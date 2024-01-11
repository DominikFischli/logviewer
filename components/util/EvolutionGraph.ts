import { Iteration, SimpleTestCase } from '@/components/util/LogParser'

export type Position = {
  x: number
  y: number
  height:          number
}

export type Style = {
  background:      string
  bordercolor:     string
  borderthickness: number
}

export type TextNode = {
  x:    number
  y:    number
  text: string
}

export type Node = { style: Style } & Position & { text: string }

export function populationEvolution(iterations: Iteration[], testCases: SimpleTestCase[], finalTestIds: string[], width: number, heigth: number): [Node[], TextNode[]] {
  let nodes: Node[] = []
  let textNodes: TextNode[] = []

  if(iterations.length == 0 || iterations[0].population.length == 0) {
    return [nodes, textNodes]
  }

  let xstep = width / iterations[0].population.length
  let ystep = heigth / iterations.length

  iterations.forEach((it, yindex) => {
    textNodes.push({
      text: it.num == -1 ? "Initial Population" : String(it.num),
      x: 0,
      y: -50 + ystep*yindex
    })
    nodes.push(...evolutionLine(it.population, xstep, ystep * yindex, testCases, finalTestIds))
  })
  return [nodes, textNodes]
}

export function offspringEvolution(iterations: Iteration[], testCases: SimpleTestCase[], finalTestIds: string[], width: number, heigth: number): [Node[], TextNode[]] {
  let nodes: Node[] = []
  let textNodes: TextNode[] = []

  if(iterations.length == 0 || iterations[0].population.length == 0) {
    return [nodes, textNodes]
  }

  let maxchildren = 0
  iterations.forEach((it) => {
    if(it.offsprings.length > maxchildren) {
      maxchildren = it.offsprings.length
    }
  })

  let xstep = width / maxchildren
  let ystep = heigth / iterations.length

  iterations.forEach((it, yindex) => {
    textNodes.push({
      text: it.num == -1 ? "Initial Population" : String(it.num),
      x: 0,
      y: -50 + ystep*yindex
    })
    nodes.push(...evolutionLine(it.offsprings, xstep, ystep * yindex, testCases, finalTestIds))
  })
  return [nodes, textNodes]
}

function evolutionLine(ids: string[], xstep: number, lineHeight: number, testCases: SimpleTestCase[], finalTestIds: string[]): Node[]{
  let nodes:     Node[]     = []

  ids.forEach((id, index) => {
    let tc = testCases.find((tc) => tc.id == id)
    if(tc) {
      let isFinal: boolean = finalTestIds.includes(tc.id)
        let bg: string     = isFinal ? 'red' : 'black'
        let text: string   = isFinal ? tc.id.slice(0,5) : ""

        let style: Style = {
          borderthickness: 1,
          background: 'black',
          bordercolor: bg
        }
        nodes.push({
          style:  style,
          x:      xstep * index,
          y:      lineHeight,
          height: tc.code.length,
          text:   text
        })
      }
    })
  return nodes
}
