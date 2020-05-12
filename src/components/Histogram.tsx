import React, {useEffect, useRef, useState} from "react"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import * as d3 from "d3"
import {max} from "d3-array"
import {axisBottom, axisLeft} from "d3-axis"
import {scaleBand, scaleLinear} from "d3-scale"
import {Selection, select} from "d3-selection"

import {breakpoint as bp} from "../theme/constants"

const dimensions = {
  width: 500,
  height: 500,
  chartWidth: 700,
  chartHeight: 400,
  marginLeft: 100,
}

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
interface HistogramProps {
  imageData?: ImageData;
}

function Histogram ({imageData}: HistogramProps): JSX.Element {
  const styles = useStyles()
  console.log(imageData.data)
  const ref = useRef<SVGSVGElement | null>(null)
  const [selection, setSelection] = useState<null | Selection<
    SVGSVGElement | null,
    unknown,
    null,
    undefined
  >>(null)

  // const maxValue = max(data, (d) => d.number)
  const data = []
  for (let i = 0; i < imageData.data.length; i += 4) {
    data.push({
      red: imageData.data[i],
      green: imageData.data[i + 1],
      blue: imageData.data[i + 2],
      alpha: imageData.data[i + 3],
    })
  }

  const y = scaleLinear()
    .domain([0, max(data, (d) => d.units)])
    .range([dimensions.height, 0])

  const x = scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, dimensions.width])
    .paddingInner(0.05)

  const yAxis = axisLeft(y).tickFormat((d) => `${d} rgb`)
  const xAxis = axisBottom(x)

  useEffect(() => {
    if (!selection) {
      setSelection(select(ref.current))
    } else {
      const xAxisGroup = selection
        .append("g")
        .attr(
          "transform",
          `translate(${dimensions.marginLeft}, ${dimensions.height})`,
        )
        .call(xAxis)

      const yAxisGroup = selection
        .append("g")
        .attr("transform", `translate(${dimensions.marginLeft})`)
        .call(yAxis)

      selection
        .append("g")
        .attr("transform", `translate(${dimensions.marginLeft},0)`)
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", x.bandwidth)
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.units))
        .attr("fill", "orange")
        .attr("height", (d) => dimensions.height - y(d.units))
    }
  }, [selection])

  return (
    <div className={styles.histogram}>
      Color distribution for the picture
      <svg ref={ref} height={imageData.height} width={imageData.width}></svg>
    </div>
  )
}

export default Histogram
