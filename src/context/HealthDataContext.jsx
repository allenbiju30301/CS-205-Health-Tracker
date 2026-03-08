import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { loadData, saveData, saveFileHandleInfo, getFileHandleInfo } from '../utils/storage'
import { createFile, openFile, writeFile, readFile } from '../utils/fileOperations'

const HealthDataContext = createContext()
const THEME_KEY = 'healthTrackingTheme'

export function HealthDataProvider({ children }) {
  const [moodEntries, setMoodEntries] = useState([])
  const [sleepEntries, setSleepEntries] = useState([])
  const [waterEntries, setWaterEntries] = useState([])
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'indigo')
  const [isLoaded, setIsLoaded] = useState(false)
  const [fileHandle, setFileHandle] = useState(null)
  const [fileStatus, setFileStatus] = useState('none') // 'none', 'saving', 'saved', 'error'
  const fileHandleRef = useRef(null)

  // Load data on startup
  useEffect(() => {
    async function initialize() {
      // Load from localStorage first
      const loaded = loadData()
      setMoodEntries(loaded.moodEntries)
      setSleepEntries(loaded.sleepEntries || [])
      setWaterEntries(loaded.waterEntries || [])
      setIsLoaded(true)
      
      // Try to set up file auto-save
      const handleInfo = getFileHandleInfo()
      if (handleInfo && 'showOpenFilePicker' in window) {
        const handle = await openFile()
        if (handle) {
          fileHandleRef.current = handle
          setFileHandle(handle)
          
          // Load data from file if it's newer
          const fileData = await readFile(handle)
          if (fileData?.moodEntries !== undefined) {
            const fileDate = fileData.lastSaved ? new Date(fileData.lastSaved) : null
            const storageDate = loaded.moodEntries.length > 0 
              ? new Date(Math.max(...loaded.moodEntries.map(e => e.id))) 
              : null
            
            if (!storageDate || (fileDate && fileDate > storageDate)) {
              setMoodEntries(fileData.moodEntries || [])
              setSleepEntries(fileData.sleepEntries || [])
              setWaterEntries(fileData.waterEntries || [])
              saveData(fileData.moodEntries || [], fileData.sleepEntries || [], fileData.waterEntries || [])
            }
          }
        }
      } else {
        // Auto-setup file on first use
        const handle = await createFile()
        if (handle) {
          fileHandleRef.current = handle
          setFileHandle(handle)
          saveFileHandleInfo(handle)
          await writeFile(handle, {
            moodEntries: loaded.moodEntries,
            sleepEntries: loaded.sleepEntries || [],
            waterEntries: loaded.waterEntries || [],
            lastSaved: new Date().toISOString()
          })
        }
      }
    }
    
    initialize()
  }, [])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // Auto-save to localStorage and file when data changes
  useEffect(() => {
    if (isLoaded) {
      saveData(moodEntries, sleepEntries, waterEntries)
      saveToFile()
    }
  }, [moodEntries, sleepEntries, waterEntries, isLoaded])

  async function saveToFile() {
    const handle = fileHandleRef.current
    if (!handle) return

    setFileStatus('saving')
    const success = await writeFile(handle, {
      moodEntries,
      sleepEntries,
      waterEntries,
      lastSaved: new Date().toISOString()
    })
    
    if (success) {
      setFileStatus('saved')
      setTimeout(() => setFileStatus('none'), 2000)
    } else {
      setFileStatus('error')
      setTimeout(() => setFileStatus('none'), 3000)
    }
  }

  async function setupFileHandle() {
    const handle = await createFile()
    if (handle) {
      fileHandleRef.current = handle
      setFileHandle(handle)
      saveFileHandleInfo(handle)
      await saveToFile()
      return true
    }
    return false
  }

  async function loadFromFile() {
    const handle = await openFile()
    if (handle) {
      fileHandleRef.current = handle
      setFileHandle(handle)
      saveFileHandleInfo(handle)
      
      const data = await readFile(handle)
      if (data?.moodEntries !== undefined) {
        setMoodEntries(data.moodEntries || [])
        setSleepEntries(data.sleepEntries || [])
        setWaterEntries(data.waterEntries || [])
        saveData(data.moodEntries || [], data.sleepEntries || [], data.waterEntries || [])
        return true
      }
    }
    return false
  }

  const addMoodEntry = (entry) => {
    setMoodEntries([...moodEntries, entry])
  }

  const deleteMoodEntry = (id) => {
    setMoodEntries(moodEntries.filter(entry => entry.id !== id))
  }

  const addSleepEntry = (entry) => {
    setSleepEntries([...sleepEntries, entry])
  }

  const deleteSleepEntry = (id) => {
    setSleepEntries(sleepEntries.filter(e => e.id !== id))
  }

  const addWaterEntry = (entry) => {
    setWaterEntries([...waterEntries, entry])
  }

  const deleteWaterEntry = (id) => {
    setWaterEntries(waterEntries.filter(e => e.id !== id))
  }

  const setAllData = (moodEntries) => {
    setMoodEntries(moodEntries)
  }

  const exportData = () => {
    const data = {
      moodEntries,
      sleepEntries,
      waterEntries,
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      let changed = false
      if (data.moodEntries && Array.isArray(data.moodEntries)) {
        setAllData(data.moodEntries)
        changed = true
      }
      if (data.sleepEntries && Array.isArray(data.sleepEntries)) {
        setSleepEntries(data.sleepEntries)
        changed = true
      }
      if (data.waterEntries && Array.isArray(data.waterEntries)) {
        setWaterEntries(data.waterEntries)
        changed = true
      }
      return changed
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  return (
    <HealthDataContext.Provider
      value={{
        moodEntries,
        sleepEntries,
        waterEntries,
        addMoodEntry,
        deleteMoodEntry,
        addSleepEntry,
        deleteSleepEntry,
        addWaterEntry,
        deleteWaterEntry,
        exportData,
        importData,
        setAllData,
        setupFileHandle,
        loadFromFile,
        fileHandle,
        fileStatus,
        theme,
        setTheme,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  )
}

export function useHealthData() {
  const context = useContext(HealthDataContext)
  if (!context) {
    throw new Error('useHealthData must be used within HealthDataProvider')
  }
  return context
}
