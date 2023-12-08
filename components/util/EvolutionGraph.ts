import { Iteration, Log } from '@/components/util/LogReader'

export type Node = {
  id:       string
  rank:     number
  fitness:  number
  size:     number
  parents:  string[]
}

export type NodeInstance = {
  node:     Node
  gridx?:   number
  gridy?:   number 
}

export type Link = {
  source: NodeInstance
  target: NodeInstance
}

export function createGraph(nodes: Node[], iterations: Iteration[]): NodeInstance[] {
  return createIterations(iterations, nodes)
}

export function createIterationInheritanceGraph(nodes: Node[], iterations: Iteration[]): [NodeInstance[], Link[]] {
  let firstOccurence: NodeInstance[] = createIterationsFirstOccurences(iterations, nodes)
  let links:          Link[]         = linkInheritance(firstOccurence)
  return [firstOccurence, links]
}

export function createNodes(log: Log): Node[] {
  let nodes: Node[] = []

  log.testCases.forEach((tc) => {
    let parents: string[] = []
    if(tc.parent1 && tc.parent2) {
      parents = [tc.parent1, tc.parent2]
    }
    nodes.push({
      id:      tc.id,
      rank:    tc.rank,
      fitness: tc.fitness,
      size:    tc.code.length,
      parents: parents
    })
  })
  return nodes
}

export function setGraphSize(nodes: NodeInstance[], width: number, height: number) {
  let [maxX, maxY]: [number, number] = [0, 0]
  nodes.forEach((node) => {
    if(node.gridx) {
      maxX = maxX > node.gridx ? maxX : node.gridx
    }
    if(node.gridy) {
      maxY = maxY > node.gridy ? maxY : node.gridy
    }
  })
  let [xfrac, yfrac]: [number, number] = [width / maxX, height / maxY]

  nodes.forEach((node) => {
    if(node.gridx) {
      node.gridx = node.gridx * xfrac
    }
    if(node.gridy) {
      node.gridy = node.gridy * yfrac
    }
  })
}

function createIterationsFirstOccurences(iterations: Iteration[], nodes: Node[]): NodeInstance[] {
  let nodeInstances: NodeInstance[] = []
  let occured: string[] = []

  iterations.forEach((iteration) => {
    let xcount = 0
    iteration.population.forEach((s) => {
      let node = nodes.find((n) => n.id == s)
      if(node && !occured.includes(s)) {
        occured.push(s)
        nodeInstances.push({ node: node, gridx: xcount, gridy: iteration.num})
      }
    })
  })
  return nodeInstances
}

function createIterations(iterations: Iteration[], nodes: Node[]):  NodeInstance[] {
  let nodeInstances:  NodeInstance[] = [] // New nodes, first occurence

  iterations.forEach((iteration) => {
    let xcount  = 0 
    iteration.population.forEach((id) => {
      let node: Node | undefined = nodes.find((node) =>  node.id == id )
      if(node) {
        nodeInstances.push({node: node, gridx: xcount++, gridy: iteration.num})
      }
    })
  })
  return nodeInstances
}

function linkInheritance(nodes: NodeInstance[]): Link[]{
  let links: Link[] = []

  nodes.forEach((nodePos) => {
    if(nodePos.node.parents){
      let [p1, p2] = nodePos.node.parents
      links.push(linkToParent(nodePos, p1, nodes))
      links.push(linkToParent(nodePos, p2, nodes))
    }
  })

  return links  
}

function linkToParent(node: NodeInstance, parent: string, nodes: NodeInstance[]): Link{
  let p = nodes.find((np) => np.node.id == parent)
  
  if(p) {
    return { source: p, target: node}    
  }


  return { source: node, target: node }
}
