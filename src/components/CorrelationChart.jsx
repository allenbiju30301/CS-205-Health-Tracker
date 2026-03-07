import { useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'

function CorrelationChart() {
  const { sleepEntries, moodEntries } = useHealthData()

  const { scatterData, insight } = useMemo(() => {
    const byDate = {}
    moodEntries.forEach((entry) => {
      if (!byDate[entry.date]) byDate[entry.date] = []
      byDate[entry.date].push(entry.mood)
    })
    Object.keys(byDate).forEach((d) => {
      const arr = byDate[d]
      byDate[d] = arr.reduce((s, n) => s + n, 0) / arr.length
    })

    const data = []
    sleepEntries.forEach((entry) => {
      const avgMood = byDate[entry.date]
      if (avgMood != null) {
        data.push({ hours: entry.hours, mood: Number(avgMood.toFixed(1)), date: entry.date })
      }
    })

    const over7 = data.filter((d) => d.hours >= 7)
    const under7 = data.filter((d) => d.hours < 7)
    const avgOver7 = over7.length > 0 ? over7.reduce((s, d) => s + d.mood, 0) / over7.length : 0
    const avgUnder7 = under7.length > 0 ? under7.reduce((s, d) => s + d.mood, 0) / under7.length : 0
    const ins = data.length === 0
      ? 'Log both sleep and mood for the same day to see correlations.'
      : avgOver7 >= avgUnder7
        ? 'You tend to feel better after 7+ hours of sleep.'
        : 'Your mood varies. Keep logging to spot patterns.'

    return { scatterData: data, insight: ins }
  }, [sleepEntries, moodEntries])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Sleep vs Mood Correlation
      </h3>
      {scatterData.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">
          {insight}
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="hours" name="Hours slept" domain={[4, 10]} />
              <YAxis type="number" dataKey="mood" name="Avg mood" domain={[0, 5]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgb(255,255,255)', border: '1px solid #e5e7eb' }}
                labelFormatter={(_, payload) => payload[0]?.payload?.date || ''}
                formatter={(val, name) => [val, name === 'hours' ? 'Hours slept' : 'Avg mood']}
              />
              <Scatter data={scatterData} fill="#6366f1" name="Sleep vs mood" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-4">{insight}</p>
        </>
      )}
    </div>
  )
}

export default CorrelationChart
