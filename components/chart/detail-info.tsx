'use client'

import { Log } from '@/components/util/LogReader'

export default function StackedAreaChart({log}: {log: Log}) {
  log.iterations.forEach((it) => {
    it.targetGoals
    it.coveredGoals
  })

  return (
    <>
      <h3>Stacked Area Chart</h3>
      <h4>log: {log.seed}</h4>
      <div className="w-screen h-screen p-5 m-1 col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md overflow-y-auto">
        <table className="table-auto">
          <thead>
            <tr>
              <th>Iteration</th>
              <th>Target Goals</th>
              <th>Covered Goals</th>
            </tr>
          </thead>
          <tbody>
            {log.iterations.map((iteration) => (
              <tr key={iteration.num}>
                <td>{iteration.num}</td>
                <td>
                  <table className="table-auto">
                    <tr>
                      {iteration.coveredGoals.map((goal) => (
                        <td key={iteration.num + goal}>{goal}</td>
                      ))}
                    </tr>
                  </table>
                </td>
                <td>
                  <table className="table-auto">
                    <tr>
                      {iteration.coveredGoals.map((goal) => (
                        <td key={iteration.num + goal}>{goal}</td>
                      ))}
                    </tr>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
