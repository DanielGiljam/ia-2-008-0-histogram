import * as d3 from "d3"

function drawHistogram (data) {
  const margins = {left: 36, bottom: 20}
  const rect = document.getElementById("histogram").getBoundingClientRect()

  const height = rect.height - margins.bottom
  const width = rect.width - margins.left

  const svg = d3
    .select("#histogram")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g")
    .attr("transform", `translate(${margins.left},0)`)

  data.shift()

  const r = []
  const g = []
  const b = []
  const l = []

  for (const {red, green, blue} of data) {
    r.push(red)
    g.push(green)
    b.push(blue)
    l.push((red + green + blue) / 3)
  }

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min([d3.min(r), d3.min(g), d3.min(b), d3.min(l)]),
      d3.max([d3.max(r), d3.max(g), d3.max(b), d3.max(l)]),
    ])
    .range([height, 0])
  const xScale = d3.scaleLinear().domain([0, data.length]).range([0, width])
  const area = d3
    .area()
    .x(function (d, i) {
      return (i * width) / data.length
    })
    .y0(height)
    .y1(function (d) {
      return yScale(d)
    })

  const yAxis = d3.axisLeft(yScale)
  const xAxis = d3.axisBottom(xScale)

  svg
    .append("path")
    .attr("fill", "red")
    .style("opacity", 0.5)
    .attr("d", area(r))
    .attr("id", "red")
  svg
    .append("path")
    .attr("fill", "green")
    .style("opacity", 0.5)
    .attr("d", area(g))
    .attr("id", "green")
  svg
    .append("path")
    .attr("fill", "blue")
    .style("opacity", 0.5)
    .attr("d", area(b))
    .attr("id", "blue")

  svg.append("g").call(yAxis)
  svg.append("g").call(xAxis).attr("transform", `translate(0,${height})`)
}
export default drawHistogram
