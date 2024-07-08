import EvolutionGraph from "@/components/home/evolution-graph"
import { promises as fs } from 'fs';
import { extractClass, extractFinalTestIds, parseIterations, Iteration } from '@/components/util/LogParser'
import { populationEvolution, offspringEvolution, Node, TextNode } from '@/components/util/EvolutionGraph'
import { EvolutionGraphProps } from "@/components/home/evolution-graph"
import Evolution from "@/components/home/evolution-graphs";

let log = await getLog()
const popProps: EvolutionGraphProps = getProps(log)
const offProps: EvolutionGraphProps = getProps(log, true)

export default async function Home() {
  return (
    <Evolution populationProps={popProps} offspringProps={offProps} />
  );
}

async function getLog() {
  return await fs.readFile(process.cwd() + '/public/log1.txt', 'utf8')
}
function getProps(logstring: string, useOffspring: boolean = false): EvolutionGraphProps {
  let classstring = extractClass(logstring)
  if(!classstring) {
    return {
      height: 0,
      width: 0,
      nodes: [],
      textNodes: []
    }
  }

  let width = 1000, height = 40000

  let [iterations, testcases] = parseIterations(classstring)
  let finalTests = extractFinalTestIds(classstring)

  let nodes:     Node[] = []
  let textNodes: TextNode[] = []

  if(useOffspring) {
    [nodes, textNodes] = offspringEvolution(iterations, testcases, finalTests, width-50, height)
  } else {
    [nodes, textNodes] = populationEvolution(iterations, testcases, finalTests, width-50, height)
  }

  return {
    textNodes: textNodes,
    nodes:  nodes,
    width:  width,
    height: height,
  }
}
