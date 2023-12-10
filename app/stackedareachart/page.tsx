import { Log, loadText, parseLog } from '@/components/util/LogReader'

const log: Log = await loadText("").then((log) => parseLog(log))

export default function StackedAreaChart() {
  return (
    <div className="w-screen h-screen p-5 m-1 col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <h3>Stacked Area Chart</h3>
        <h4>log: {log.seed}</h4>
    </div>
  )
}
