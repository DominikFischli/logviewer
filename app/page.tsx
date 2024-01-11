import EvolutionGraph from "@/components/home/evolution-graph"
import { promises as fs } from 'fs';
import { extractClass, extractFinalTestIds, parseIterations, Iteration } from '@/components/util/LogParser'
import { createEvolution, Node, TextNode } from '@/components/util/EvolutionGraph'
import { EvolutionGraphProps } from "@/components/home/evolution-graph"

const props: EvolutionGraphProps = await getLog().then((log) => getProps(log))

export default async function Home() {
  return (
    <>
      <div className="w-screen">
        <EvolutionGraph 
          nodes={props.nodes}
          textNodes={props.textNodes}
          height={props.height}
          width={props.width}
        />
      </div>
    </>
  );
}

async function getLog() {
  return await fs.readFile(process.cwd() + '/public/log1.txt', 'utf8')
}
function getProps(logstring: string): EvolutionGraphProps {
  let classstring = extractClass(logstring)
  if(!classstring) {
    return {
      height: 0,
      width: 0,
      nodes: []
    }
  }

  let width = 1000, height = 8000

  let [iterations, testcases] = parseIterations(classstring)
  let finalTests = extractFinalTestIds(classstring)

  let [nodes, textNodes]: [Node[], TextNode[]] = createEvolution(iterations, testcases, finalTests, width-50, height)

  return {
    textNodes: textNodes,
    nodes:  nodes,
    width:  width,
    height: height,
  }
}
