import DevoirGenerator from './pages/DevoirGenerator.jsx'
import Login from './pages/Login.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'

function AppContent() {
  const { user, loading, signOut } = useAuth()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <nav className="plai-nav">
        <a href="/" className="plai-nav-logo">
          <img src="/plai-logo.jpg" alt="PLAI" style={{ height: 32, width: 'auto' }} />
          DevoirActif
        </a>
        {user && (
          <div className="plai-nav-actions">
            <button type="button" className="plai-nav-link" onClick={signOut}>Se déconnecter</button>
          </div>
        )}
      </nav>

      <div className="plai-container">
        {loading ? null : user ? <DevoirGenerator /> : <Login />}
      </div>

      <footer className="plai-footer">
        <p>DevoirActif — outil PLAI, Pôle Territorial de la Ville de Liège</p>
        <p>Devoirs P4-P6 conçus pour résister à la délégation à l'IA générative</p>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
