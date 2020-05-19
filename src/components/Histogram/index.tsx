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
      "& > #histogram": {
        height: "100%",
        width: "100%",
      },
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
    case "loading":
      contents = <CircularProgress disableShrink />
      break
    case "error":
      contents = <Typography>{errorMessage}</Typography>
      break
    default:
      contents = undefined
  }
  return (
    <div className={styles.histogram}>
      {contents}
      <div id={"histogram"} />
    </div>
  )
}

export default Histogram
