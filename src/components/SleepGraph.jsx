import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'

function SleepGraph() {
  const { sleepEntries } = useHealthData()

  const weeklyData = useMemo(() => {
    const days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

      const daySleeps = sleepEntries.filter(entry => entry.date === dateStr)
      const totalHours =
        daySleeps.length === 0
          ? 0
          : daySleeps.reduce((sum, entry) => sum + (entry.hours || 0), 0)
      const avgHours = daySleeps.length === 0 ? 0 : totalHours / daySleeps.length

      days.push({
        day: dayName,
        hours: Number(avgHours.toFixed(1)),
      })
    }

    return days
  }, [sleepEntries])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Last 7 Days – Hours Slept</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 12]} />
          <Tooltip />
          <Bar dataKey="hours" fill="#6366f1" name="Hours slept" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SleepGraph
