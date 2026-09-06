export default function Header({ view, onNavigateDashboard, onNavigateNotes, onOpenSettings }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <button className="brand" onClick={onNavigateDashboard}>
          Financial Markets <span className="brand-sub">ECON 252 · Yale</span>
        </button>
        <nav className="app-nav">
          <button
            className={view === 'dashboard' ? 'nav-link active' : 'nav-link'}
            onClick={onNavigateDashboard}
          >
            Dashboard
          </button>
          <button
            className={view === 'notes' ? 'nav-link active' : 'nav-link'}
            onClick={onNavigateNotes}
          >
            All Notes
          </button>
          <button className="nav-link" onClick={onOpenSettings}>
            Settings
          </button>
        </nav>
      </div>
    </header>
  )
}
