import * as d3 from "d3"

function drawHistogram (data, state) {
  console.log(data.shift())

  const {
    margin = {top: 20, right: 30, bottom: 30, left: 60},
    height,
    width,
  } = document.getElementById("histogram").getBoundingClientRect()
  const svg = d3
    .select("#histogram")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  const area = d3
    .area()
    .x(function (d, i) {
      return (i * width) / r.length
    })
    .y0(height)
    .y1(function (d) {
      return yScale(d)
    })
  // Skapar arrays separat för varje rgb värde
  const r = []
  const g = []
  const b = []
  const a = []
  const rgbValues = []

  let o = 0
  let j = 0
  let k = 0
  const m = 0

  // Far igenom varje data rgb värde och sätter in dem i respektive arrays
  for (const red of data) {
    // console.log(data[i].red)
    r.push(data[o].red)
    o++
  }
  for (const green of data) {
    // console.log(data[j].green)
    g.push(data[j].green)
    j++
  }
  for (const blue of data) {
    // console.log(data[k].blue)
    b.push(data[k].blue)
    k++
  }
  rgbValues.push(r + g + b)

  // console.log(r)

  // Skapar scale efter r (som är en array av data.red)
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(r), d3.max([d3.max(r), d3.max(g), d3.max(b)])])
    .range([height, 0])

  const xScale = d3.scaleLinear().domain([0, data.length]).range([0, width])
  // Axis
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

  // rita axisarna
  svg.append("g").call(yAxis)

  svg
    .append("g")
    .call(xAxis)
    .attr("transform", "translate( 2, " + height + ")")
}
export default drawHistogram
