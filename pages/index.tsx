import React, { useRef, useEffect } from 'react'
import { select } from 'd3-selection'

const Index: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  useEffect(() => {

    select(svgRef.current)
      .append('rect')
      .attr('width', 100)
      .attr('height', 100)
      .attr('fill', 'red')
  })
  return (
    <div>
      <svg ref={svgRef} />
      <line />

    </div>
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
