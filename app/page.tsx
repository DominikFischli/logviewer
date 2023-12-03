import EvolutionInfoCard from "@/components/home/evolution-info-card"
import Card from "@/components/home/card";
import { Log, loadText, parseLog } from "@/components/util/LogReader"

export default async function Home() {
  return (
    <>
      <div className="m-10 grid h-screen w-90 p-10 animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        <EvolutionInfoCard
          seed={log.seed}
          numGoals={log.numGoals}
          numInitialGoals={log.numInitialGoals}
          testCriteria={log.testCriteria}
          />
        {features.map(({ title, description, demo, large }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={demo}
            large={large}
          />
        ))}
      </div>
    </>
  );
}

const log: Log = await loadText("").then((log) => parseLog(log))

const features = [
  {
    title: "Evolutions",
    description:
      "Individuals of each iteration plotted per iteration",
    demo: ( log.numGoals ),
    large: true,
  },
  {
    title: "TBD",
    description: "TBD",
    demo: ( <p></p>
    ),
  },
];
