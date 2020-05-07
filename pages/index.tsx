import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import {axisLeft, axisBottom } from 'd3-axis'


const data = [
  {
    name: 'ass',
    number: 100,
  },
  {
    name: 'aqq',
    number: 657,
  },
  {
    name: 'rtg',
    number: 234,
  },
  {
    name: 'fgh',
    number: 787,
  },
  {
    name: 'fdg',
    number: 346,
  },
  {
    name: 'ert',
    number: 564,
  },
];
  
  const dimensions = {
    width: 800,
    height: 500,
    chartWidth: 700,
    chartHeight: 400,
    marginLeft: 100
  }
  

const Index: React.FC = () => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [selection, setSelection] = useState(null)
  
 

  const maxValue =max(data, d => d.number);

  const y = d3.scaleLinear()
    .domain([0, maxValue!])
    .range([0, dimensions.chartHeight]);

    const x = scaleBand()
    .domain([data.map(d => d.name)])
    .range([0, dimensions.chartWidth])
    .paddingInner(0.05)
    
    const yAxis = axisLeft(y)
    const xAxis = axisBottom(x)

  useEffect(() => {

    if (!selection) {
      setSelection(select(ref.current));
    } else {
        const xAxisGroup = selection
        .append('g')
        .attr('transform', 'translate(${dimensions.marginLeft}, ${dimensions.chartHeight})')
        .call(xAxis);

        const yAxisGroup = selection
        .append('g')
        .call(yAxis);


      selection
        .append('g')
        .attr('transform', 'translate(${dimensions.marginLeft},0)')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('x', d => x(d.name)!)
        .attr('fill', 'orange')
        .attr('height', d => y(d.number));
    }
  },  [selection]);

    return (
      <div>
        <h1> RGB (but actually just white - black</h1>
          <svg ref={ref} width={dimensions.width} height={dimensions.chartHeight}>
          </svg>
      </div >
    )
  }



export default Index

  /*
const Index: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  useEffect(() => {


    const dataTable = [30, 50, 70, 30, 40];
    const height = window.innerHeight / 2;
    const width = window.innerWidth * 0.8;
    const barwidth = 50, barMargin = 20;

    //d3.select('svg').remove('staplar');
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataTable)]) 
      .range([0, height]);

    const xScale = d3.scaleBand()
      .domain(dataTable)
      .range([0, width])
      .padding(0.2);

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
*/

  /*
  function Index(): JSX.Element {
  
    return <div>
      <h1>Bildens pixelfördelning</h1>
  
    </div>
  }*/