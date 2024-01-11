'use client'

import React, { useMemo, useRef, useEffect } from 'react'
import { Log } from '@/components/util/LogReader'
import * as d3 from 'd3'

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type StackedAreaChartProps = {
  log:    Log
}
export default function StackedAreaChart({log}: StackedAreaChartProps) {
  const ref = useRef<SVGSVGElement>(null)

  let data: { [key: string]: number }[] = []
  let keys = new Set<string>()
  console.log(log)
  log.iterations.forEach((iteration) => {
    let fronts: number[] = []
    iteration.population.forEach((id) => {
      const tc = log.testCases.find((m) => { return m.id == id })
      if(tc?.rank) {
        console.log(tc.id + ": " + tc.rank)
        if(!fronts[tc?.rank]) fronts[tc.rank] = 1
        else fronts[tc.rank] += 1
      }
    })
    let entries: Map<string, number> = new Map()
    entries.set("x", iteration.num)
    fronts.forEach((n, rank) => { 
      keys.add(""+rank)
      entries.set(""+rank, n)
    })
    
    data.push(Object.fromEntries(entries.entries()))
  })

  let width  = data.length
  let height = 500


  const stackSeries = d3.stack().keys(keys)
  const series = stackSeries(data)

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis
  const max = 300; // todo
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [data, height]);

  // X axis
  const [xMin, xMax] = d3.extent(data, (d) => d.x);
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([xMin || 0, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, width]);


  useEffect(() => {
    const svgElement = d3.select(ref.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  // Build the line
  const areaBuilder = d3
    .area<any>()
    .x((d) => {
      return xScale(d.data.x);
    })
    .y1((d) => yScale(d[1]))
    .y0((d) => yScale(d[0]));

  const allPath = series.map((serie, i) => {
    const path = areaBuilder(serie);
    return (
      <path
        key={i}
        d={path}
        opacity={1}
        stroke="none"
        fill="#9a6fb0"
        fillOpacity={i / 10 + 0.1}
      />
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allPath}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={ref}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
    </div>
  );
}

