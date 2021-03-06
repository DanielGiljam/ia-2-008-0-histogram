import {ReactNode, useEffect} from "react"

import {useMachine} from "@xstate/react"
import {State} from "xstate"

import Checkbox from "@material-ui/core/Checkbox"
import CircularProgress from "@material-ui/core/CircularProgress"
import Divider from "@material-ui/core/Divider"
import FormControl from "@material-ui/core/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import FormLabel from "@material-ui/core/FormLabel"
import Typography from "@material-ui/core/Typography"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import {breakpoint as bp} from "../../theme/constants"

import histogramMachine, {
  HistogramMachineContext,
  HistogramMachineEvent,
} from "./histogramMachine"

const useStyles = makeStyles<
  Theme,
  State<HistogramMachineContext, HistogramMachineEvent>
>((theme) =>
  createStyles({
    histogram: {
      alignItems: "center",
      display: "flex",
      flexGrow: ({value}): number => (value !== "deactivated" ? 1 : 0),
      justifyContent: "center",
      minHeight: ({value}): number =>
        value !== "deactivated" ? theme.breakpoints.values[bp] * 0.2 : 0,
      padding: ({value}): number =>
        value !== "deactivated" ? theme.spacing(3) : 0,
      width: "100%",
      "& > #histogram": {
        height: "100%",
        width: "100%",
      },
    },
  }),
)

const errorMessage =
  "Encountered unknown error when generating histogram data. See console for more information."

const colorChannels = ["red", "green", "blue", "luminosity"]

interface HistogramProps {
  imageData?: ImageData;
}

function Histogram ({imageData}: HistogramProps): JSX.Element {
  const [state, send] = useMachine(histogramMachine)
  const styles = useStyles(state)
  useEffect(() => {
    if (imageData) send({type: "DATA", data: imageData.data})
  }, [imageData])
  let contents: JSX.Element
  switch (state.value) {
    case "deactivated":
      contents = undefined
      break
    case "loading":
      contents = <CircularProgress disableShrink />
      break
    case "error":
      contents = <Typography>{errorMessage}</Typography>
      break
    default:
      contents = (
        <form>
          <FormControl component={"fieldset"}>
            <FormLabel component={"legend"}>Color Channels</FormLabel>
            <FormGroup>
              {((): ReactNode => {
                const states = colorChannels.map((colorChannel) =>
                  state.matches(`idle.${colorChannel}.checked`),
                )
                const allChecked = states.every((state) => state)
                const allUnchecked = states.every((state) => !state)
                return [
                  <FormControlLabel
                    key={"all"}
                    control={
                      <Checkbox
                        checked={allChecked}
                        indeterminate={!allChecked && !allUnchecked}
                        onChange={(): void => {
                          send(allChecked ? "UNCHECK" : "CHECK")
                        }}
                      />
                    }
                    label={"All"}
                  />,
                  <Divider key={"divider"} />,
                  ...colorChannels.map((colorChannel, index) => {
                    const checked = states[index]
                    const label = colorChannel.replace(/^./, (match) =>
                      match.toUpperCase(),
                    )
                    return (
                      <FormControlLabel
                        key={label}
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={(): void => {
                              send(
                                `${colorChannel.toUpperCase()}.${
                                  checked ? "UNCHECK" : "CHECK"
                                }`,
                              )
                            }}
                          />
                        }
                        label={label}
                      />
                    )
                  }),
                ]
              })()}
            </FormGroup>
          </FormControl>
        </form>
      )
  }
  return (
    <div className={styles.histogram}>
      {contents}
      <div id={"histogram"} />
    </div>
  )
}

export default Histogram
