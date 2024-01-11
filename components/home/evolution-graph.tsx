'use client'
import {useRef} from 'react'

import { Node, TextNode } from '@/components/util/EvolutionGraph'

export type EvolutionGraphProps = {
  nodes:      Node[]
  textNodes:  TextNode[]   
  width:      number
  height:     number
}

export default function EvolutionGraph({nodes, textNodes, width, height}: EvolutionGraphProps) {
  const ref = useRef(null);

    return (
    <div ref={ref} className="relative p-5 scroll-smooth">
      <svg viewBox={"0 -80 " + width + " " + (height+80)}>
        {textNodes.map((tn) => (
          <g>
            <rect
              x={tn.x}
              y={tn.y-15}
              width={width}
              height={75}
              fill='white'
              rx={8}
              ry={8}
            />
            <text
              x={tn.x+5}
              y={tn.y}
              fontSize={10}
            >{tn.text}</text>
          </g>
        ))}
        {nodes.map((node) => (
          <rect
            x={node.x+25}
            y={node.y - node.height}
            width={16}
            height={node.height}
            fill={node.style.background}
            stroke={node.style.bordercolor}
            strokeWidth={node.style.borderthickness}
          />
        ))}
      </svg>
    </div>
  )
}
