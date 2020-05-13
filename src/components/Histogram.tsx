import React, {useEffect} from "react"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import {breakpoint as bp} from "../theme/constants"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    histogram: {
      alignItems: "center",
      background: theme.palette.grey[300],
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      fontFamily: "monospace",
      fontSize: "1.5rem",
      justifyContent: "center",
      minHeight: theme.breakpoints.values[bp] * 0.2,
      padding: theme.spacing(3),
      width: "100%",
    },
  }),
)

function renderHistogram (imageData: ImageData): void {
  console.log("imageData:", imageData)
  const histogram = document.getElementById("histogram")
  console.log("histogram:", histogram)
  const pixels: Pixel[] = []
  for (let i = 0; i < imageData.data.length; i += 4) {
    pixels.push({
      red: imageData.data[i],
      green: imageData.data[i + 1],
      blue: imageData.data[i + 2],
      alpha: imageData.data[i + 3],
    })
  }
  console.log("pixels:", pixels)
  const histogramRect = histogram.getBoundingClientRect()
  console.log("histogramRect:", histogramRect)
}

interface Pixel {
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
  useEffect(() => renderHistogram(imageData), [])
  return (
    <div className={styles.histogram}>
      <svg id={"histogram"} />
    </div>
  )
}

export default Histogram
