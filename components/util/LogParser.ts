export type Iteration = IterationGoals &{
  num:              number
  offsprings:       string[] // ids
  population:       string[] // ids
  //archive:          string[] // ids
}

export type IterationGoals = {
  numUncovered: number
  numCovered:   number
  covered:      string[]
  current:      string[]
}

export type ChromosomeGoal = {
  name:    string
  fitness: number
}

export type GeneOrigin = {
  parent1: string
  parent2: string
  mutated: boolean
}

export type SimpleTestCase = {
  id:       string
  rank:     number
  fitness:  number
  distance: number
  code:     string[]
}

export type TestCase = SimpleTestCase & GeneOrigin & {
  goals:   ChromosomeGoal[]
}

export function extractClass(log: string): string | null {
  const pattern = /Current class: .*?Done/s
  let match = pattern.exec(log)
  
  return match ? match[0] : ''
}

export function parseIterations(classlog: string): [Iteration[], SimpleTestCase[]] {
  const pattern = /"Crossovers": {"iteration": (\d+)(.*?)"offspring population":(.*?)"population":(.*?)Goals":(.*?)"Chromosome Goals":(.*?)"Archive":(.*?)] }/gs
  let iterations: Iteration[]      = []

  // Handle initial population
  let initialPop: SimpleTestCase[] =  extractInitialPopulation(classlog)
  iterations.push({
    num:          -1,
    offsprings:   initialPop.map((tc) => tc.id),
    population:   initialPop.map((tc) => tc.id),
    covered: [],
    current: [],
    numCovered: 0,
    numUncovered: 0
  })

  let testCases:  SimpleTestCase[] = initialPop

  let matches = [...classlog.matchAll(pattern)]
  matches.forEach((m) => {
     //m[2] -> crossovers
    let offspringtcs = extractIndividuals(m[3])
    let tcs          = extractIndividuals(m[4]) // offspring population

    iterations.push({
      num:          Number(m[1]),
      offsprings:   offspringtcs.map((tc) => tc.id ),
      population:   tcs.map((tc) => tc.id),
     ...extractIterationGoals(m[5])
    })
    testCases.push(...offspringtcs)
  })
  iterations.sort((a, b) => a.num - b.num)

  return [iterations, testCases]
}

function extractInitialPopulation(classlog: string): SimpleTestCase[] {
  const pattern = /"Initial population": (.*?popEnd)/s
  let match = classlog.match(pattern)

  if(match) {
    return extractIndividuals(match[0])
  }
  console.warn('No initial TestCases found')
  
  return []
}


function extractIndividuals(populationlog: string) : SimpleTestCase[] {
  let pattern = /\"id\": "*([\w\d-]+)"*, \"rank\": ([-\d]+), \"fitness\": ([\d.]+), \"distance\": ([\d.]+), \"code\":\{\n(.*?)\n\n/sg
  return Array.from(populationlog.matchAll(pattern), (m) => {
    return {
      id:        m[1],
      rank:      Number(m[2]),
      fitness:   Number(m[3]),
      distance:  Number(m[4]),
      code:      m[5].split('\n')
    }
  })
}

function extractIterationGoals(goalstring: string): IterationGoals {
  const pattern = /"uncovered": (\d+), "covered": (\d+), "covered targets": \[\n(.*?)\n\].*?"current targets": \[\n(.*?)\n\]/s

  let match = goalstring.match(pattern)
  if(match) {
    return {
      numUncovered: Number(match[1]),
      numCovered:   Number(match[2]),
      covered:      match[3].split(',\n'),
      current:      match[4].split(',\n')
    }
  }
  return { numUncovered: 0, numCovered: 0, covered: [], current: [] }
}

export function extractFinalTestIds(classlog: string) : string[] {
  const listPattern = /Final Tests": .*?]/gs
  const testPattern = /"([\w\d-]*)"/gs

  let match = classlog.match(listPattern)
  if(match) {
    return Array.from(match[0].matchAll(testPattern), (m) => m[1])
  }
  console.warn('No final tests found')
  return []
}
