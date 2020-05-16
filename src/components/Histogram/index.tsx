import {useEffect} from "react"

import {useMachine} from "@xstate/react"

import {CircularProgress, Typography} from "@material-ui/core"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import {Line, LineChart, ResponsiveContainer, Tooltip, YAxis} from "recharts"

import {breakpoint as bp} from "../../theme/constants"

import histogramMachine from "./histogramMachine"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    histogram: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      justifyContent: "center",
      minHeight: theme.breakpoints.values[bp] * 0.2,
      padding: theme.spacing(3),
      width: "100%",
    },
  }),
)

const errorMessage =
  "Encountered unknown error when generating histogram data. See console for more information."

interface HistogramProps {
  imageData?: ImageData;
}

function Histogram ({imageData}: HistogramProps): JSX.Element {
  const styles = useStyles()
  const [state, send] = useMachine(histogramMachine)
  useEffect(() => {
    if (imageData) send({type: "DATA", data: imageData.data})
  }, [imageData])
  let contents: JSX.Element
  switch (state.value) {
    case "deactivated":
      return null
    case "loading":
      contents = <CircularProgress disableShrink />
      break
    case "error":
      contents = <Typography>{errorMessage}</Typography>
      break
    default:
      contents = (
        <ResponsiveContainer>
          <LineChart data={state.context.data}>
            <YAxis
              domain={[
                // TODO: calculate Y-axis scale in a more sophisticated way
                0,
                state.context.data
                  .map(({red, green, blue}) => (red + green + blue) / 3)
                  .reduce((prevY, y) => prevY + y) / state.context.data.length,
              ]}
              allowDataOverflow
            />
            <Tooltip />
            <Line dataKey={"red"} dot={false} stroke={"red"} />
            <Line dataKey={"green"} dot={false} stroke={"green"} />
            <Line dataKey={"blue"} dot={false} stroke={"blue"} />
            <Line dataKey={"alpha"} dot={false} stroke={"alpha"} />
          </LineChart>
        </ResponsiveContainer>
      )
  }
  return <div className={styles.histogram}>{contents}</div>
}

export default Histogram
