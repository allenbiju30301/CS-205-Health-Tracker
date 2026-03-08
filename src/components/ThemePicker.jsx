import { useHealthData } from '../context/HealthDataContext'

const THEMES = [
  { id: 'indigo', color: '#6366f1' },
  { id: 'rose', color: '#f43f5e' },
  { id: 'forest', color: '#16a34a' },
  { id: 'sunset', color: '#f97316' },
]

function ThemePicker() {
  const { theme, setTheme } = useHealthData()
  return (
    <div className="flex gap-2">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`w-8 h-8 rounded-full border-2 transition-colors ${
            theme === t.id ? 'ring-2 ring-offset-2 ring-gray-500 border-gray-700' : 'border-gray-300'
          }`}
          style={{ backgroundColor: t.color }}
          title={t.id}
          aria-label={`Select ${t.id} theme`}
        />
      ))}
    </div>
  )
}

export default ThemePicker
