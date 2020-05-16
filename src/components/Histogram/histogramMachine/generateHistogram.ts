import {EventObject, InvokeCreator} from "xstate"

import drawHistogram from "./d3-isolated/drawHistogram"

import {
  HistogramData,
  HistogramDataObject,
  HistogramMachineContext,
} from "./index"

const histogramDataObject: HistogramDataObject = {
  red: 0,
  green: 0,
  blue: 0,
  alpha: 0,
}

export interface DataEvent extends EventObject {
  type: "DATA";
  data: Uint8ClampedArray;
}

const generateHistogram: InvokeCreator<
  HistogramMachineContext,
  DataEvent
> = async (_context: unknown, {data}: DataEvent) => {
  console.log("[processData]: Generating histogram data...")
  const histogramData: HistogramData = JSON.parse(
    JSON.stringify(new Array(256).fill(histogramDataObject)),
  )
  for (let i = 0; i < data.length; i += 4) {
    Object.keys(histogramDataObject).forEach((key, j) => {
      histogramData[data[i + j]][key]++
    })
  }
  drawHistogram(histogramData, "#histogram")
  return histogramData
}

export default generateHistogram
