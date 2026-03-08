import { useMemo } from 'react'
import { useHealthData } from '../context/HealthDataContext'

const QUOTES = {
  veryLow: ['You\'re stronger than you feel. Tomorrow is a new day. 💪', 'Small steps still move you forward. Be kind to yourself. 🌱', 'It\'s okay to not be okay. You\'re not alone. 🤗'],
  low: ['Every day brings a chance to start fresh. 🌅', 'Progress isn\'t always linear. You\'re doing your best. 📈', 'Be gentle with yourself today. 🌸'],
  neutral: ['Take a breath. You\'re exactly where you need to be. 😌', 'Steady as you go. Balance is its own win. ⚖️', 'Some days are for coasting—and that\'s fine. ☁️'],
  good: ['You\'re building something good. Keep going! ✨', 'Nice work taking care of yourself today. 🌟', 'This momentum is yours to keep. 🚀'],
  excellent: ['You\'re shining! Let it show. 🌟', 'Today you chose you—that matters. 💫', 'This is what thriving looks like! 🎉'],
}

function MoodQuote() {
  const { moodEntries } = useHealthData()
  const { quote, emoji, bg } = useMemo(() => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekEntries = moodEntries.filter((e) => new Date(e.date) >= weekAgo)
    const avg = weekEntries.length === 0 ? 0 : weekEntries.reduce((s, e) => s + e.mood, 0) / weekEntries.length
    const idx = today.getDate() % 3
    let range, emoji, bg
    if (avg >= 5.0) { range = QUOTES.excellent; emoji = '😊'; bg = 'bg-green-50' }
    else if (avg >= 4.0) { range = QUOTES.good; emoji = '🙂'; bg = 'bg-green-50' }
    else if (avg >= 3.0) { range = QUOTES.neutral; emoji = '😐'; bg = 'bg-yellow-50' }
    else if (avg >= 2.0) { range = QUOTES.low; emoji = '😕'; bg = 'bg-red-50' }
    else { range = QUOTES.veryLow; emoji = '😢'; bg = 'bg-red-50' }
    return { quote: range[idx], emoji, bg }
  }, [moodEntries])
  return (
    <div className={`rounded-lg shadow-lg p-6 ${bg}`}>
      <p className="text-lg text-gray-800">{quote}</p>
      <p className="text-2xl mt-2">{emoji}</p>
    </div>
  )
}

export default MoodQuote
