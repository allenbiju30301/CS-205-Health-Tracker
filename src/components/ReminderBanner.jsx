import { useState, useEffect } from 'react'
import { useHealthData } from '../context/HealthDataContext'

const REMINDER_KEY = 'reminderTime'

function getTodayStr() {
  return new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

function ReminderBanner() {
  const { moodEntries } = useHealthData()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const check = () => {
      const today = getTodayStr()
      const hasMoodToday = moodEntries.some((e) => e.date === today)
      const reminderTime = localStorage.getItem(REMINDER_KEY) || '09:00'
      const [rh, rm] = reminderTime.split(':').map(Number)
      const now = new Date()
      const mins = now.getHours() * 60 + now.getMinutes()
      const reminderMins = (rh || 9) * 60 + (rm || 0)
      if (!hasMoodToday && mins >= reminderMins && !dismissed) setShow(true)
      else setShow(false)
    }
    check()
    const id = setInterval(check, 60000)
    return () => clearInterval(id)
  }, [moodEntries, dismissed])

  useEffect(() => {
    const msUntilMidnight = new Date().setHours(24, 0, 0, 0) - Date.now()
    const t = setTimeout(() => setDismissed(false), msUntilMidnight)
    return () => clearTimeout(t)
  }, [dismissed])

  if (!show) return null
  return (
    <div className="bg-amber-100 border-b border-amber-300 px-4 py-3 flex justify-between items-center">
      <span className="text-amber-900">Don&apos;t forget to log your mood today! 🌟</span>
      <button
        onClick={() => {
          setDismissed(true)
          setShow(false)
        }}
        className="text-amber-800 hover:text-amber-900 font-medium px-2"
      >
        Dismiss
      </button>
    </div>
  )
}

export default ReminderBanner
