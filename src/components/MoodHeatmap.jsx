import { useMemo } from 'react'
import { useHealthData } from '../context/HealthDataContext'

const COLOR = {
  null: '#e5e7eb', // gray - no data
  1: '#fecaca',
  2: '#fde68a',
  3: '#bfdbfe',
  4: '#86efac',
  5: '#16a34a',
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDateKey(date) {
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

function MoodHeatmap() {
  const { moodEntries } = useHealthData()

  const { grid, monthLabels } = useMemo(() => {
    const avgByDate = {}
    moodEntries.forEach((entry) => {
      if (!avgByDate[entry.date]) avgByDate[entry.date] = []
      avgByDate[entry.date].push(entry.mood)
    })
    Object.keys(avgByDate).forEach((date) => {
      const arr = avgByDate[date]
      avgByDate[date] = arr.reduce((s, n) => s + n, 0) / arr.length
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364)

    const gridStart = new Date(startDate)
    gridStart.setDate(gridStart.getDate() - gridStart.getDay())

    const numWeeks = 53
    const grid = []
    const monthLabels = []

    for (let col = 0; col < numWeeks; col++) {
      const weekStart = new Date(gridStart)
      weekStart.setDate(weekStart.getDate() + col * 7)
      const weekMonth = weekStart.getMonth()
      const prevColMonth = col > 0
        ? (() => {
            const prev = new Date(gridStart)
            prev.setDate(prev.getDate() + (col - 1) * 7)
            return prev.getMonth()
          })()
        : -1
      if (weekMonth !== prevColMonth) {
        monthLabels.push({ col, label: weekStart.toLocaleDateString('en-US', { month: 'short' }) })
      }

      for (let row = 0; row < 7; row++) {
        const cellDate = new Date(weekStart)
        cellDate.setDate(cellDate.getDate() + row)
        const inRange = cellDate >= startDate && cellDate <= today
        const dateKey = formatDateKey(cellDate)
        const avg = inRange && avgByDate[dateKey] != null ? avgByDate[dateKey] : null
        const level = avg != null ? Math.min(5, Math.max(1, Math.round(avg))) : null
        if (!grid[row]) grid[row] = []
        grid[row].push({ dateKey, inRange, level })
      }
    }

    return { grid, monthLabels }
  }, [moodEntries])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Mood over the last year</h3>
      <p className="text-sm text-gray-500 mb-4">
        Each square is a day — darker green = better mood, gray = no data.
      </p>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col min-w-0">
          {/* Month labels — one per column where month changes */}
          <div className="flex pl-12 mb-1 gap-px" style={{ minHeight: '20px', width: 53 * 13 }}>
            {grid[0]?.map((_, colIndex) => {
              const monthForCol = monthLabels.find((m) => m.col === colIndex)
              return (
                <div
                  key={colIndex}
                  className="text-xs text-gray-500 shrink-0 flex items-end"
                  style={{ width: 12 }}
                >
                  {monthForCol ? monthForCol.label : ''}
                </div>
              )
            })}
          </div>

          <div className="flex gap-px">
            {/* Day-of-week labels */}
            <div className="flex flex-col justify-around pr-1 text-xs text-gray-500 shrink-0">
              {DAY_LABELS.map((label) => (
                <div key={label} className="flex items-center justify-end h-3 w-10">
                  {label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div
              className="flex gap-px"
              style={{ width: 53 * 13 }}
            >
              {grid[0]?.map((_, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-px">
                  {grid.map((row, rowIndex) => {
                    const cell = row[colIndex]
                    const bg = cell.inRange ? (COLOR[cell.level ?? 'null']) : COLOR.null
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{ backgroundColor: bg }}
                        title={cell.inRange ? `${cell.dateKey}: ${cell.level != null ? `Mood ${cell.level}` : 'No data'}` : undefined}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <span>Less</span>
        {[null, 1, 2, 3, 4, 5].map((level) => (
          <span
            key={level ?? 'null'}
            className="w-3 h-3 rounded-sm shrink-0"
            style={{ backgroundColor: COLOR[level ?? 'null'] }}
            title={level != null ? `Mood ${level}` : 'No data'}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

export default MoodHeatmap
