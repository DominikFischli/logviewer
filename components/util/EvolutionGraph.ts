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

export function getNodeStyle(style: Style): string {
  return `style="fill:${style.background};stroke:${style.bordercolor};stroke-width:${style.borderthickness}`
}

export type Node = { style: Style } & Position

export function createEvolution(iterations: Iteration[], testCases: SimpleTestCase[], finalTestIds: string[], width: number, heigth: number): [Node[], TextNode[]] {
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
    it.population.forEach((id, xindex) => {
      let tc = testCases.find((tc) => tc.id == id)
      if(tc) {
        let bg: string = finalTestIds.includes(tc.id) ? 'red' : 'black'
        let style: Style = {
          borderthickness: 1,
          background: 'black',
          bordercolor: bg
        }
        nodes.push({
          style: style,
          x: xstep * xindex,
          y: ystep * yindex,
          height: tc.code.length,
        })
      }
    })
  })
  return [nodes, textNodes]
}
