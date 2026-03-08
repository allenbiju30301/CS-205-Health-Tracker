import { useState } from 'react'
import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted } from '../utils/helpers'

const MOOD_LABELS = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent',
}
const MOOD_EMOJIS = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' }

function MoodTracker() {
  const { moodEntries, addMoodEntry, deleteMoodEntry } = useHealthData()
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')

  const handleSelectMood = (mood) => {
    setSelectedMood(mood)
  }

  const handleSubmit = () => {
    if (!selectedMood) return

    const now = new Date()

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: note.trim() || undefined,
      timestamp: now.toISOString(),
      date: getTodayFormatted(),
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }

    addMoodEntry(newEntry)
    setSelectedMood(null)
    setNote('')
  }

  const latestEntry = moodEntries.length > 0
    ? [...moodEntries].sort((a, b) => b.id - a.id)[0]
    : null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Mood Tracker
      </h2>
      <p className="text-gray-600 mb-4">
        Select how you&apos;re feeling and then submit. Date and time are recorded automatically.
      </p>

      <div className="flex justify-between mb-6 space-x-2">
        {[1, 2, 3, 4, 5].map((mood) => (
          <button
            key={mood}
            onClick={() => handleSelectMood(mood)}
            className={`flex-1 py-3 rounded-lg font-semibold border transition-colors ${
              selectedMood === mood
                ? 'bg-theme-primary text-white border-theme-primary'
                : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <div className="text-2xl">{MOOD_EMOJIS[mood]}</div>
            <div
              className={`text-xs mt-1 ${
                selectedMood === mood ? 'text-white' : 'text-gray-600'
              }`}
            >
              {MOOD_LABELS[mood]}
            </div>
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Add a note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full mb-4 py-2 px-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus-theme"
      />

      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className={`w-full mb-6 py-2 px-4 rounded-lg font-medium transition-colors ${
          selectedMood
            ? 'bg-theme-primary text-white'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        Save how I feel
      </button>

      {latestEntry && (
        <div className="mb-6 p-4 bg-theme-light rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Last recorded mood:</p>
          <p className="text-lg font-semibold text-theme-primary-dark">
            {latestEntry.mood} – {MOOD_LABELS[latestEntry.mood] || 'Mood'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {latestEntry.date} at {latestEntry.time}
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {moodEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No moods logged yet. Choose how you feel to get started.
          </p>
        ) : (
          [...moodEntries]
            .sort((a, b) => b.id - a.id)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-800">
                    {entry.mood} – {MOOD_LABELS[entry.mood] || 'Mood'}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">
                    • {entry.date} at {entry.time}
                  </span>
                  {entry.note && (
                    <p className="text-sm text-gray-600 mt-1 truncate" title={entry.note}>
                      {entry.note}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this mood entry?')) {
                      deleteMoodEntry(entry.id)
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

export default MoodTracker

