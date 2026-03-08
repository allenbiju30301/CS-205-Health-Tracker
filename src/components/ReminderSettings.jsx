import { useState } from 'react'

const REMINDER_KEY = 'reminderTime'

function ReminderSettings() {
  const [time, setTime] = useState(() => localStorage.getItem(REMINDER_KEY) || '09:00')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem(REMINDER_KEY, time)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex items-end gap-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reminder time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="py-2 px-3 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-theme-primary text-white py-2 px-4 rounded-lg font-medium"
      >
        Save
      </button>
      {saved && <span className="text-green-600 font-medium">Saved!</span>}
    </div>
  )
}

export default ReminderSettings
