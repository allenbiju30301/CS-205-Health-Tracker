import { useState, useEffect } from 'react'
import { HealthDataProvider, useHealthData } from './context/HealthDataContext'
import MoodTracker from './modules/MoodTracker'
import SleepTracker from './modules/SleepTracker'
import WaterTracker from './modules/WaterTracker'
import DailyGraph from './components/DailyGraph'
import WeeklyGraph from './components/WeeklyGraph'
import SleepGraph from './components/SleepGraph'
import WaterGraph from './components/WaterGraph'
import MoodHeatmap from './components/MoodHeatmap'
import CorrelationChart from './components/CorrelationChart'
import StatsCard from './components/StatsCard'
import FeaturesChecklist from './components/FeaturesChecklist'
import HistoryView from './components/HistoryView'
import FileManager from './components/FileManager'
import ThemePicker from './components/ThemePicker'
import ReminderBanner from './components/ReminderBanner'
import ReminderSettings from './components/ReminderSettings'

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { theme } = useHealthData()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      <ReminderBanner />
      <div className="min-h-screen bg-theme-page">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Mood Tracking App
              </h1>
              <p className="text-gray-600">
                Track how you feel over time with a simple 1–5 mood scale
              </p>
            </div>
            <ThemePicker />
          </header>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-theme-primary text-theme-primary-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-theme-primary text-theme-primary-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'data'
                    ? 'border-theme-primary text-theme-primary-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Data Management
              </button>
              <button
                onClick={() => setActiveTab('sleep')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sleep'
                    ? 'border-theme-primary text-theme-primary-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sleep
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-theme-primary text-theme-primary-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex gap-4 flex-wrap items-start">
                <div className="flex-1 min-w-[280px]">
                  <StatsCard />
                </div>
                <FeaturesChecklist />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MoodTracker />
                <SleepTracker />
                <WaterTracker />
                <DailyGraph />
                <WeeklyGraph />
                <SleepGraph />
                <WaterGraph />
              </div>
            </div>
          )}

          {activeTab === 'sleep' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SleepTracker />
                <SleepGraph />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <MoodHeatmap />
              <CorrelationChart />
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryView />
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <FileManager />
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Reminder Settings</h3>
                <ReminderSettings />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <HealthDataProvider>
      <AppContent />
    </HealthDataProvider>
  )
}

export default App
