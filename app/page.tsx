import EvolutionInfoCard from "@/components/home/evolution-info-card"
import EvolutionGraph from "@/components/home/evolution-graph"
import { Log, loadText, parseLog } from "@/components/util/LogReader"

export default async function Home() {
  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        <EvolutionInfoCard
          seed={log.seed}
          numGoals={log.numGoals}
          numInitialGoals={log.numInitialGoals}
          testCriteria={log.testCriteria}
          />

        <EvolutionGraph
          log={log}
          />

      </div>
    </>
  );
}

const log: Log = await loadText("").then((log) => parseLog(log))
