import EvolutionGraph from "@/components/home/evolution-graph"
import { promises as fs } from 'fs';
import { extractClass, extractFinalTestIds, parseIterations, Iteration } from '@/components/util/LogParser'
import { populationEvolution, offspringEvolution, Node, TextNode } from '@/components/util/EvolutionGraph'
import { EvolutionGraphProps } from "@/components/home/evolution-graph"

import { TabView, TabPanel } from 'primereact/tabview'

let log = await getLog()
const popProps: EvolutionGraphProps = getProps(log)
const offProps: EvolutionGraphProps = getProps(log, true)

export default async function Home() {
  return (
    <TabView className="w-screen">
      <TabPanel header="Population Evolution" className="m-0 p-2 mb-1">
        <EvolutionGraph {...popProps} />
      </TabPanel>
      <TabPanel header="Offspring Evolution" className="m-0 p-2 mb-1">
        <EvolutionGraph {...offProps} />
      </TabPanel>
    </TabView>
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

  let width = 1000, height = 8000

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
