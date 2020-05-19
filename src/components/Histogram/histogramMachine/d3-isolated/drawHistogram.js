import * as d3 from "d3"

function drawHistogram (data) {
  const {height, width} = document
    .getElementById("histogram")
    .getBoundingClientRect()
  const svg = d3
    .select("#histogram")
    .append("svg")
    .attr("height", "100%")
    .attr("width", "100%")
    .append("g")
}
export default drawHistogram
