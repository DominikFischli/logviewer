import Markdown from "react-markdown";

export default function EvolutionInfoCard({
  seed,
  numGoals,
  numInitialGoals,
  testCriteria
}: {
    seed: number
    numGoals: number
    numInitialGoals: number
    testCriteria: string[]
  }) {
  return (
    <div
      className={"pt-10 relative col-span-1 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md"}>

      <div className="mx-auto max-w-md">
        <h3 className="bg-gradient-to-br text-center from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">
          Evolution Info
        </h3>
        <div className="prose-sm m-10 mt-3 text-left leading-normal text-gray-500 [text-wrap:balance] md:prose ">
          <b>Seed:</b> {seed.toString()}<br/>
          <b>Total Goals:</b> {numGoals.toString()}<br/>
          <b>Initial Goals:</b> {numInitialGoals.toString()} <br/><br/>
          <b>Criterias:</b>
          <div className="grid grid-cols-2 text-xs">
            {testCriteria.map((criteria) => {return <p>{criteria}</p>})}
          </div>
        </div>
      </div>
      <div className="flex h-60 items-center justify-center"></div>
    </div>
  )
}
