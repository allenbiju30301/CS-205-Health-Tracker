import { useState } from 'react'
import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted } from '../utils/helpers'

const QUALITY_LABELS = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
}

const HOURS_OPTIONS = [4, 5, 6, 7, 8, 9]

function SleepTracker() {
  const { sleepEntries, addSleepEntry, deleteSleepEntry } = useHealthData()
  const [hours, setHours] = useState(null)
  const [quality, setQuality] = useState(null)
  const [bedtime, setBedtime] = useState('23:00')
  const [wakeTime, setWakeTime] = useState('06:30')

  const handleSubmit = () => {
    if (hours == null || quality == null) return

    const dateStr = getTodayFormatted()
    const now = new Date()

    const newEntry = {
      id: Date.now(),
      hours: Number(hours),
      quality,
      bedtime,
      wakeTime,
      date: dateStr,
      timestamp: now.toISOString(),
    }

    addSleepEntry(newEntry)
    setHours(null)
    setQuality(null)
  }

  const latestEntry = sleepEntries.length > 0
    ? [...sleepEntries].sort((a, b) => b.id - a.id)[0]
    : null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Sleep Tracker
      </h2>
      <p className="text-gray-600 mb-4">
        Log how long you slept, sleep quality, and your bedtime/wake times.
      </p>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Hours slept</p>
        <div className="flex flex-wrap gap-2">
          {HOURS_OPTIONS.map((h) => (
            <button
              key={h}
              onClick={() => setHours(h)}
              className={`py-2 px-4 rounded-lg font-semibold border transition-colors ${
                hours === h
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Sleep quality (1–5)</p>
        <div className="flex justify-between space-x-2">
          {[1, 2, 3, 4, 5].map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className={`flex-1 py-3 rounded-lg font-semibold border transition-colors ${
                quality === q
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="text-lg">{q}</div>
              <div
                className={`text-xs mt-1 ${
                  quality === q ? 'text-white' : 'text-gray-600'
                }`}
              >
                {QUALITY_LABELS[q]}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedtime</label>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wake time</label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={hours == null || quality == null}
        className={`w-full mb-6 py-2 px-4 rounded-lg font-medium transition-colors ${
          hours != null && quality != null
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        Save sleep log
      </button>

      {latestEntry && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Last recorded sleep:</p>
          <p className="text-lg font-semibold text-indigo-700">
            {latestEntry.hours}h – {QUALITY_LABELS[latestEntry.quality] || 'Quality'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {latestEntry.date} • Bed: {latestEntry.bedtime} → Wake: {latestEntry.wakeTime}
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sleepEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No sleep entries yet. Log your first night to get started.
          </p>
        ) : (
          [...sleepEntries]
            .sort((a, b) => b.id - a.id)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <span className="font-medium text-gray-800">
                    {entry.hours}h – {QUALITY_LABELS[entry.quality] || entry.quality}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">
                    • {entry.date} • {entry.bedtime} → {entry.wakeTime}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this sleep entry?')) {
                      deleteSleepEntry(entry.id)
                    }
                  }}
                  className="text-red-500 hover:text-red-700 font-medium text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  title="Delete this entry"
                >
                  Delete
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

export default SleepTracker
