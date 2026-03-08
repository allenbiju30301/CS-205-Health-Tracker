import { useMemo } from 'react'
import { useHealthData } from '../context/HealthDataContext'

function getDateStr(d) {
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

function StreakBadge() {
  const { moodEntries } = useHealthData()
  const streak = useMemo(() => {
    const dates = new Set(moodEntries.map((e) => e.date))
    const today = new Date()
    let count = 0
    for (let i = 0; ; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (dates.has(getDateStr(d))) count++
      else break
    }
    return count
  }, [moodEntries])
  return (
    <div className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
      {streak >= 1 ? `🔥 ${streak} day streak` : '❄️ No streak yet'}
    </div>
  )
}

export default StreakBadge
