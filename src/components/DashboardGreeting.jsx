import { useMemo } from 'react'
import { useHealthData } from '../context/HealthDataContext'

function getDateStr(d) {
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

function DashboardGreeting() {
  const { moodEntries } = useHealthData()
  const { greeting, insight } = useMemo(() => {
    const h = new Date().getHours()
    let greeting
    if (h >= 5 && h < 12) greeting = 'Good morning! 🌅'
    else if (h >= 12 && h < 17) greeting = 'Good afternoon! ☀️'
    else if (h >= 17 && h < 21) greeting = 'Good evening! 🌙'
    else greeting = 'Good night! ⭐'

    const today = new Date()
    const last3 = []
    const prev3 = []
    for (let i = 1; i <= 3; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      last3.push(getDateStr(d))
    }
    for (let i = 4; i <= 6; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      prev3.push(getDateStr(d))
    }
    const last3Moods = moodEntries.filter((e) => last3.includes(e.date))
    const prev3Moods = moodEntries.filter((e) => prev3.includes(e.date))
    const last3Avg = last3Moods.length === 0 ? 0 : last3Moods.reduce((s, e) => s + e.mood, 0) / last3Moods.length
    const prev3Avg = prev3Moods.length === 0 ? 0 : prev3Moods.reduce((s, e) => s + e.mood, 0) / prev3Moods.length
    let insight
    if (last3Moods.length === 0 && prev3Moods.length === 0) insight = '😌 Your mood has been steady this week.'
    else if (last3Avg > prev3Avg) insight = '📈 Your mood has been improving lately!'
    else if (last3Avg < prev3Avg) insight = '📉 Rough patch lately — it gets better!'
    else insight = '😌 Your mood has been steady this week.'
    return { greeting, insight }
  }, [moodEntries])
  return (
    <div className="rounded-lg shadow-lg p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
      <h2 className="text-2xl font-semibold text-gray-800">{greeting}</h2>
      <p className="text-gray-700 mt-2">{insight}</p>
    </div>
  )
}

export default DashboardGreeting
