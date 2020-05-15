import {useEffect, useState} from "react"

import {CircularProgress} from "@material-ui/core"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import {Line, LineChart, ResponsiveContainer, Tooltip, YAxis} from "recharts"

import {breakpoint as bp} from "../theme/constants"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    histogram: {
      flexGrow: 1,
      minHeight: theme.breakpoints.values[bp] * 0.2,
      padding: theme.spacing(3),
      width: "100%",
    },
  }),
)

const histogramDataObjectKeys = ["red", "green", "blue", "alpha"]

async function prepareData ({data}: ImageData): Promise<HistogramDataObject[]> {
  const histogramData: HistogramDataObject[] = JSON.parse(
    JSON.stringify(new Array(256).fill({red: 0, green: 0, blue: 0, alpha: 0})),
  )
  for (let i = 0; i < data.length; i += 4) {
    histogramDataObjectKeys.forEach((key, j) => {
      histogramData[data[i + j]][key]++
    })
  }
  return histogramData
}

interface HistogramDataObject {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

interface HistogramProps {
  imageData?: ImageData;
}

function Histogram ({imageData}: HistogramProps): JSX.Element {
  const styles = useStyles()
  const [histogramDataArray, setHistogramDataArray] = useState<
    HistogramDataObject[]
  >([])
  useEffect(() => {
    prepareData(imageData).then((histogramDataArray) =>
      setHistogramDataArray(histogramDataArray),
    )
  }, [imageData])
  return (
    <div className={styles.histogram}>
      {histogramDataArray.length ? (
        <ResponsiveContainer>
          <LineChart data={histogramDataArray}>
            <YAxis
              domain={[
                // TODO: calculate Y-axis scale in a more sophisticated way
                0,
                histogramDataArray
                  .map(({red, green, blue}) => (red + green + blue) / 3)
                  .reduce((prevY, y) => prevY + y) / histogramDataArray.length,
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
      ) : (
        <CircularProgress />
      )}
    </div>
  )
}

export default Histogram
