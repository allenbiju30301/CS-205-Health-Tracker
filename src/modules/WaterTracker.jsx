import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted } from '../utils/helpers'

const GOAL = 8

function WaterTracker() {
  const { waterEntries, addWaterEntry, deleteWaterEntry } = useHealthData()
  const today = getTodayFormatted()
  const todayGlasses = waterEntries
    .filter((e) => e.date === today)
    .reduce((s, e) => s + (e.glasses || 0), 0)

  const handleAdd = (glasses) => {
    const now = new Date()
    addWaterEntry({
      id: Date.now(),
      glasses: Number(glasses),
      date: today,
      timestamp: now.toISOString(),
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Water Tracker
      </h2>
      <p className="text-gray-600 mb-4">
        Log how many glasses of water you&apos;ve had today. Goal: {GOAL} glasses.
      </p>

      <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">Today&apos;s total</p>
        <p className="text-2xl font-bold text-indigo-700">
          {todayGlasses} / {GOAL} glasses
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Add glasses</p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
            <button
              key={g}
              onClick={() => handleAdd(g)}
              className="py-2 px-4 rounded-lg font-semibold border border-gray-300 bg-gray-50 text-gray-800 hover:bg-indigo-100 hover:border-indigo-400 transition-colors"
            >
              +{g}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {waterEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No water entries yet. Add glasses above to get started.
          </p>
        ) : (
          [...waterEntries]
            .filter((e) => e.date === today)
            .sort((a, b) => b.id - a.id)
            .map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-800">
                  {entry.glasses} glass{entry.glasses !== 1 ? 'es' : ''} • {entry.date}
                </span>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this water entry?')) {
                      deleteWaterEntry(entry.id)
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

export default WaterTracker
