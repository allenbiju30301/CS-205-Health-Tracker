import { useMemo } from 'react'
import { useHealthData } from '../context/HealthDataContext'

function formatDateKey(d) {
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

function StatsCard() {
  const { moodEntries } = useHealthData()

  const { streak, avgMood, bestDay, totalEntries } = useMemo(() => {
    const totalEntries = moodEntries.length
    const avgMood = totalEntries === 0
      ? '—'
      : (moodEntries.reduce((s, e) => s + e.mood, 0) / totalEntries).toFixed(1)

    const dates = [...new Set(moodEntries.map((e) => e.date))]
    const sortedDates = dates.map((d) => new Date(d)).sort((a, b) => b - a)

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = formatDateKey(today)
    const dateSet = new Set(dates)

    if (dateSet.has(todayStr) || dateSet.has(formatDateKey(new Date(today.getTime() - 86400000)))) {
      let d = new Date(today)
      while (dateSet.has(formatDateKey(d))) {
        streak++
        d.setDate(d.getDate() - 1)
      }
    }

    const byDate = {}
    moodEntries.forEach((e) => {
      if (!byDate[e.date]) byDate[e.date] = []
      byDate[e.date].push(e.mood)
    })
    let bestDay = { date: '—', avg: 0 }
    Object.entries(byDate).forEach(([date, moods]) => {
      const avg = moods.reduce((s, n) => s + n, 0) / moods.length
      if (avg > bestDay.avg) bestDay = { date, avg }
    })

    return {
      streak,
      avgMood,
      bestDay: bestDay.date !== '—' ? `${bestDay.avg.toFixed(1)} on ${bestDay.date}` : '—',
      totalEntries,
    }
  }, [moodEntries])

  const cards = [
    { label: 'Current streak', value: `${streak} days`, desc: 'Consecutive days logged' },
    { label: 'All-time avg mood', value: avgMood, desc: '1–5 scale' },
    { label: 'Best day ever', value: bestDay, desc: 'Highest avg mood' },
    { label: 'Total entries', value: totalEntries, desc: 'Moods logged' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-lg shadow-lg p-4 border border-gray-100"
        >
          <p className="text-sm text-gray-500">{c.label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{c.value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsCard
