const FEATURES = [
  'Correlation Analysis (Sleep vs Mood)',
  'Streaks & Stats Dashboard',
  'Journal / Notes on Mood Entries',
  'Water Intake Tracker',
]

function FeaturesChecklist() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Features</h3>
      <ul className="space-y-2">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500 font-bold" aria-hidden="true">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FeaturesChecklist
