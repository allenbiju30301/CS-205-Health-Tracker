import { useState } from 'react'
import { HealthDataProvider } from './context/HealthDataContext'
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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <HealthDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Mood Tracking App
            </h1>
            <p className="text-gray-600">
              Track how you feel over time with a simple 1–5 mood scale
            </p>
          </header>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'data'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Data Management
              </button>
              <button
                onClick={() => setActiveTab('sleep')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sleep'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sleep
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-indigo-500 text-indigo-600'
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
            <FileManager />
          )}
        </div>
      </div>
    </HealthDataProvider>
  )
}

export default App
