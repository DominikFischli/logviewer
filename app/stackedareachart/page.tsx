import { Log, loadText, parseLog } from '@/components/util/LogReader'
import StackedAreaChart from '@/components/chart/stacked-area-chart'

const log: Log = await loadText("").then((log) => parseLog(log))

export default function Page() {
  return (
    <StackedAreaChart
      log={log}
    />
  )
}
