import { useState } from 'react'
import { lectures } from './data/lectures.js'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import LectureDetail from './components/LectureDetail.jsx'
import NotesReview from './components/NotesReview.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import './App.css'

export default function App() {
  const [view, setView] = useState('dashboard') // 'dashboard' | 'lecture' | 'notes'
  const [activeLectureId, setActiveLectureId] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  function openLecture(id) {
    setActiveLectureId(id)
    setView('lecture')
    window.scrollTo(0, 0)
  }

  function goToDashboard() {
    setView('dashboard')
    setActiveLectureId(null)
  }

  const activeLecture = lectures.find((l) => l.id === activeLectureId) || null

  return (
    <div className="app-shell">
      <Header
        view={view}
        onNavigateDashboard={goToDashboard}
        onNavigateNotes={() => setView('notes')}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="app-main">
        {view === 'dashboard' && <Dashboard onOpenLecture={openLecture} />}
        {view === 'lecture' && activeLecture && (
          <LectureDetail lecture={activeLecture} onBack={goToDashboard} />
        )}
        {view === 'notes' && <NotesReview onOpenLecture={openLecture} />}
      </main>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
