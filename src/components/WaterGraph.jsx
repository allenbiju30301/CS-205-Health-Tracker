import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'

function WaterGraph() {
  const { waterEntries } = useHealthData()

  const weeklyData = useMemo(() => {
    const days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })

      const dayWaters = waterEntries.filter((e) => e.date === dateStr)
      const total = dayWaters.reduce((s, e) => s + (e.glasses || 0), 0)

      days.push({
        day: dayName,
        glasses: total,
      })
    }

    return days
  }, [waterEntries])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Last 7 Days – Glasses of Water
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip contentStyle={{ backgroundColor: 'rgb(255,255,255)', border: '1px solid #e5e7eb' }} />
          <Bar dataKey="glasses" fill="var(--color-primary)" name="Glasses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WaterGraph
