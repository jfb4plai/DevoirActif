import DevoirGenerator from './pages/DevoirGenerator.jsx'

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <nav className="plai-nav">
        <a href="/" className="plai-nav-logo">
          <img src="/plai-logo.jpg" alt="PLAI" style={{ height: 32, width: 'auto' }} />
          DevoirActif
        </a>
      </nav>

      <div className="plai-container">
        <DevoirGenerator />
      </div>

      <footer className="plai-footer">
        <p>DevoirActif — outil PLAI, Pôle Territorial de la Ville de Liège</p>
        <p>Devoirs P4-P6 conçus pour résister à la délégation à l'IA générative</p>
      </footer>
    </div>
  )
}
