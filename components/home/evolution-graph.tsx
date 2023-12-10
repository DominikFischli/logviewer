'use client'
import {useLayoutEffect, useRef, useState} from 'react'

import { Log } from '@/components/util/LogReader'
import { Node, NodeInstance, Link, setGraphSize, createGraph, createIterationInheritanceGraph, createNodes } from '@/components/util/EvolutionGraph'
import { warn } from 'console'

export default function EvolutionGraph({log}: {
  log: Log,
}) {
  const ref = useRef(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(8000);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth);
    setHeight(iterationsGraph.length*1.2)
    setGraphSize(iterationsGraph, width, height)
  }, []);

  let nodes:            Node[]                   = createNodes(log)
  let iterationsGraph:  NodeInstance[]           = createGraph(nodes, log.iterations).filter((node) => { return node.gridy && node.gridx})
  let inheritanceGraph: [NodeInstance[], Link[]] = createIterationInheritanceGraph(nodes, log.iterations)
  setGraphSize(iterationsGraph, width, height)

  return (
    <div ref={ref} className="relative rounded-xl border border-gray-200 bg-white shadow-md p-5 scroll-smooth">
      <svg viewBox={"0 0 " + width + " " + height}>
        {iterationsGraph.map((node) => (
          <rect
            x={node.gridx}
            y={node.gridy}
            width={20}
            height={node.node.size*1.2}
            />
        ))}
      </svg>
    </div>
  )
}
