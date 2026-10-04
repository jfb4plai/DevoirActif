import DevoirGenerator from './pages/DevoirGenerator.jsx'
import Login from './pages/Login.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'

function AppContent() {
  const { user, loading, signOut, passwordRecovery } = useAuth()

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
        {loading ? null : user && !passwordRecovery ? <DevoirGenerator /> : <Login />}
      </div>

      <footer className="plai-footer">
        <p>DevoirActif — outil PLAI, Pôle Territorial de la Ville de Liège</p>
        <p>Devoirs P4-P6 conçus pour résister à la délégation à l'IA générative</p>
        <p>
          Code :{' '}
          <a href="https://polyformproject.org/licenses/noncommercial/1.0.0" target="_blank" rel="noopener noreferrer">PolyForm Noncommercial 1.0.0</a>
          {' · '}Contenus :{' '}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>
          {' · '}Jean-François Beguin, jfb4plai.com
        </p>
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
