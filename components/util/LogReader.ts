import { promises as fs } from 'fs';

export type Log = {
  seed:              number
  numGoals:          number
  numInitialGoals:   number
  testCriteria:      string[]
  initialPopulation: string[]
  iterations:        Iteration[]
  testCases:         TestCase[]
}

export type Iteration = {
  num:             number
  numCoveredGoals: number
  numTargetGoals:  number
  targetGoals:     string[]
  coveredGoals:    string[]
  population:      string[] // ids
  //archive:         string[] // ids
}

type ArchiveForIteration = {
  num:     number
  archive: string[]
}

type GoalsForIteration = {
  num:             number
  numCoveredGoals: number
  numTargetGoals:  number
  targetGoals:     string[]
  coveredGoals:    string[]
}

type PopulationInIteration = {
  num:        number
  population: string[]
}

export type TestCase = {
  id:       string
  rank:     number
  fitness:  number
  distance: number
  code:     string[]
  parent1?: string
  parent2?: string
  mutated?: boolean
  goals?:   {
    name:    string
    fitness: number
  }[]
}

export async function loadText(path: string): Promise<string> {
  return fs.readFile(process.cwd() + '/public/log1.txt', 'utf8')
}

export function parseLog(log: string): Log {
  // uses Test criteria: and * as delimiters

  log.replaceAll(/\[Progress:.*/g, '') // Remove Progress bars

  let seed:            number     = getSeed(log)
  let numGoals:        number     = getNumGoals(log)
  let numInitialGoals: number     = getNumInitialGoals(log)
  let testCriteria:    string[]   = getTestCriterias(log)
  let goals :          GoalsForIteration[] = getGoals(log)

  let [initalPopulation, testCases] : [string[], TestCase[]] = getInitialPopulation(log)
  let popInIt: PopulationInIteration[] =  parsePopulations(log, testCases)
  parseCrossovers(log, testCases)
  parseGoalsForIndividuals(log, testCases)

  let iterations: Iteration[] = []

  for(let it in popInIt) {
    let  iterationGoals = goals.find((g) => g.num == it.num)

    let i: Iteration = {
      num:             0,
      numCoveredGoals: 0,
      numTargetGoals:  0,
      targetGoals:     [],
      coveredGoals:    [],
      population:      [] 
    }
    if(it.num) {
      i.num = it.num
    }
    if(it.population) {
      i.population = it.population
    }
    if(iterationGoals?.numCoveredGoals) {
      i.numCoveredGoals = iterationGoals.numCoveredGoals
    }
    if(iterationGoals?.numTargetGoals) {
      i.numTargetGoals = iterationGoals.numTargetGoals
    }
    if(iterationGoals?.targetGoals) {
      i.targetGoals = iterationGoals.targetGoals
    }
    if(iterationGoals?.coveredGoals) {
      i.coveredGoals = iterationGoals.coveredGoals
    }

    iterations.push(i)
  }

  return {
    seed:              seed, 
    numGoals:          numGoals,
    numInitialGoals:   numInitialGoals,
    testCriteria:      testCriteria,
    initialPopulation: initalPopulation,
    iterations:        iterations,
    testCases:         testCases
  }
}

function getSeed(log: string): number {
  let matches = log.match(/(?<=Using seed )[0-9]*/)
  if(matches) {
    return +matches[0]
  }
  console.warn("No seed string found, returning 0")
  return 0
}

function getTestCriterias(log: string): string[] {
  const reg: RegExp = /(?<=Test criteria:\n)(.*)(\n(?!\*).*)*/
  let matches = log.match(reg)
  if(matches) {
    return matches[0].replace(/.*- /g, '').split('\n')
  }
  console.warn('No test criterias found, returning \'[]\'')
  return []
}

function getNumGoals(log: string): number {
  const reg: RegExp = /(?<=Total number of test goals for DYNAMOSA: )[0-9]*/
  let matches = log.match(reg)
  if(matches) {
    return +matches[0]
  }
  console.warn('No goals number found, returning 0')
  return 0
}

function getNumInitialGoals(log: string): number {
  const reg: RegExp = /(?<=(?<=Initial Number of Goals in DynaMOSA = ))[0-9]*/
  let matches = log.match(reg)
  if(matches) {
    return +matches[0]
  }
  console.warn('No initial goals number found, returning 0')
  return 0
}


function getInitialPopulation(log: string):  [string[], TestCase[]] {
  const reg: RegExp = /(?<="Initial population": popStart)(.*\n)*](?=popEnd)/g
  let testCases: TestCase[] = []
  let ids:       string[]   = []

  let matches = log.match(reg)
  if(!matches) {
    console.warn('No initial population found, returning ""')
  } else {
    testCases = extractIndividuals(matches[0])
    ids = testCases.map((tc) => tc.id)
  }
  return [ids, testCases]
}

function parsePopulations(log: string, testCases: TestCase[]): PopulationInIteration[] {
  const reg: RegExp = /(?<="population": ){"iteration": (.*\n(?!] }\n))+}\n] }/g
  const popMatch: RegExp = /(?<=popStart)(.*\n)*](?=popEnd)/g

  let popInIt:   PopulationInIteration[] = []

  log.match(reg)?.forEach((pop) => {
    let num = getIterationForPopulation(pop)

    pop.match(popMatch)?.forEach((p) => {
      let individuals = extractIndividuals(p)
      let ids         = individuals.map((i) => i.id)

      popInIt.push({num: num, population: ids})
      individuals.map((i) => {
        if(!testCases.find((t) => t.id==i.id)){
          testCases.push(i)
        }
      })
    })
  })
  popInIt.sort((a, b) => a.num - b.num) // Sort by smallest, ascending

  return popInIt
}

function getIterationForPopulation(population: string): number {
  let num =  population.match(/(?<="iteration":) [0-9]*/g)
  if(num) {
    return +num[0]
  }
  console.warn('No iteration number found')
  return -1
}

function parseCrossovers(log: string, population: TestCase[]): void {
  const reg: RegExp = /(?<="Crossovers": )({.*\n)*/g
  let match = log.match(reg)
  if(!match) {
    console.warn('No crossovers found, returning []')
    return 
  } 
  let extracted   = JSON.parse(match[0])
  extracted.crossovers.map((entry: any) => {
    let id1 = entry.o1.id
    let id2 = entry.o2.id

    let child1: TestCase | undefined = population.find((tc) => tc.id == id1)
    let child2: TestCase | undefined = population.find((tc) => tc.id == id2)

    if(child1) {
      child1.parent1 = entry.p1
      child1.parent2 = entry.p2
      child1.mutated = entry.o1.mutated
    }
    if(child2) {
      child2.parent1 = entry.p1
      child2.parent2 = entry.p2
      child2.mutated = entry.o1.mutated
    }
  })
}

function getGoals(log: string): GoalsForIteration[] {
  let goals = log.match(/(?<="Goals": )[^}]*\n*}/g)
  if(!goals) {
    console.warn('No goals found')
    return [{
      num: -1,
      numCoveredGoals: 0,
      numTargetGoals: 0,
      targetGoals: [],
      coveredGoals: []
    }]
  }
  let result: GoalsForIteration[] = []

  for(let goal in goals) {
    let g = JSON.parse(goal)
    result.push({
      num:             g['iteration'],
      numCoveredGoals: g['covered'],
      numTargetGoals:  g['covered targets'],
      targetGoals:     g['current targets'],
      coveredGoals:    g['covered targets']
    })
  }
  result.sort((a, b) => a.num - b.num)

  return result
}

function parseGoalsForIndividuals(log: string, individuals: TestCase[]): void {
  let matches = log.match(/(?<="Chromosome Goals": )(.*\n(?!] }))*}\n] }/g)
  if(!matches) {
    console.warn('No individual goals found, returning')
    return
  }
  for(let match in matches) {
    let goalsContent  = JSON.parse(match)
    let goalsForIndividuals = goalsContent['individuals']

    for(let inds in goalsForIndividuals) {
      let individual = individuals.find((tc) => tc.id == inds.id)
      if(individual) {
        for(let goal in inds.goals) {
          individual.goals?.push({name: goal.goal, fitness: goal.fitness})
        }
      }
    }
  }
}

function extractIndividuals(population: string): TestCase[] {
  const reg: RegExp = /(?<={(.)*)(.*(?<!},)\n)*/g
  let matches = population.match(reg) // match all individuals

  if(matches){
    return matches.map(((chromosome) => {
      return {
        id:       getId(chromosome),
        rank:     getRank(chromosome),
        fitness:  getFitness(chromosome),
        distance: getDistance(chromosome),
        code:     getCode(chromosome)
      }
    }))
  }
  console.warn('No population found for string: ' + population + '\n -- returning []')
  return []
}

function getId(chromosome: string): string {
  const reg: RegExp = /(?<="id": ")[^"]*/  
  let matches = chromosome.match(reg)
  if(matches) {
    return matches[0]
  }
  return ''
}

function getRank(chromosome: string) {

  const reg: RegExp = /(?<="rank": )[^,]*/  
  let matches = chromosome.match(reg)
  if(matches) {
    return +matches[0]
  }
  return -1 
}

function getFitness(chromosome: string): number {

  const reg: RegExp = /(?<="fitness": )[^,]*/  
  let matches = chromosome.match(reg)
  if(matches) {
    return +matches[0]
  }
  return -1
}

function getDistance(chromosome: string): number {
  const reg: RegExp = /(?<="distance": )[^,]*/  
  let matches = chromosome.match(reg)
  if(matches) {
    return +matches[0]
  }
  return -1
}

function getCode(chromosome: string): string[] {
  const reg: RegExp = /(?<="code":{\n)((.*\n)(?!\t}\n},))*/g
  let matches = chromosome.match(reg)
  if(matches) {
    return matches[0].split('\n')
  }
  return []
}
