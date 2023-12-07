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
      className="p-5 m-1 h-48 col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">

      <div className="flex justify-around">
        <h3 className="bg-gradient-to-br text-left from-black to-stone-500 bg-clip-text text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">
          Evolution Visualization
        </h3>
        <div className="prose-sm relative text-left leading-normal text-gray-500 [text-wrap:balance]">
          <b>Seed:</b> {seed.toString()}<br/>
          <b>Total Goals:</b> {numGoals.toString()}<br/>
          <b>Initial Goals:</b> {numInitialGoals.toString()} <br/><br/>
        </div>
        <div className="prose-sm relative text-left leading-normal text-gray-500 [text-wrap:balance]">
          <b>Criterias:</b>
          <div className="grid grid-cols-2 gap-x-5 text-xs">
            {testCriteria.map((criteria) => {return <p>{criteria}</p>})}
          </div>
        </div>
      </div>
    </div>
  )
}
