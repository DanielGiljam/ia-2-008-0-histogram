import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { select, selectAll } from 'd3-selection';

const Index: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  useEffect(() => {


    const dataTable = [30, 50, 70, 30, 40];
    const height = window.innerHeight / 2;
    const width = window.innerWidth * 0.8;
    const barwidth = 50, barMargin = 20;

    //d3.select('svg').remove('staplar');
    const yScale = d3.scaleLinear().domain([0, d3.max(dataTable)]).range([0, height]);

    const xScale = d3.scaleBand().domain(dataTable).range([0, width]).padding(0.2);

    const canvas = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "lightgrey");
    //här börjar tidsresan
    canvas.selectAll("staplar").data(dataTable)

      .enter()
      .append("rect")
      .attr("width", function (data) { return xScale.bandwidth(); })

      .attr("height", function (data) { return yScale(data) + barMargin; })


      .attr("x", function (data, i) { return xScale(data); })


      .attr("y", function (data) { return height - yScale(data) + barMargin; });

  })
  return (
    <div>
      <h1> RGB (but actually just white - black</h1>


    </div >
  )
}

//const Index = (): JSX.Element => <div><h1>Bildens pixelfördelning</h1></div>





export default Index

/*
function Index(): JSX.Element {

  return <div>
    <h1>Bildens pixelfördelning</h1>

  </div>
}*/
