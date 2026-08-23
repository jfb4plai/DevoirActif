import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [enCours, setEnCours] = useState(false)
  const { signIn, signUp } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setSucces('')
    setEnCours(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setErreur('Email ou mot de passe incorrect.')
    } else {
      const { error } = await signUp(email, password)
      if (error) setErreur(error.message)
      else setSucces('Compte créé. Vérifiez votre email pour confirmer votre inscription.')
    }

    setEnCours(false)
  }

  return (
    <div className="plai-section">
      <div className="plai-card" style={{ maxWidth: 420, margin: '2rem auto' }}>
        <h2>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</h2>
        <p className="plai-help">
          {mode === 'login'
            ? 'Connexion enseignant nécessaire pour générer et enregistrer un devoir.'
            : 'Créez votre compte enseignant pour utiliser DevoirActif.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="plai-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="plai-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom.nom@etablissement.be"
            required
          />

          <label className="plai-label" htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            className="plai-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
          {mode === 'register' && <p className="plai-help">Minimum 6 caractères.</p>}

          {erreur && <p className="plai-error">{erreur}</p>}
          {succes && <p className="plai-success">{succes}</p>}

          <button type="submit" className="plai-btn" disabled={enCours}>
            {enCours ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <button
          type="button"
          className="plai-btn"
          style={{ marginTop: '0.75rem', background: 'transparent', color: 'var(--teal)' }}
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErreur(''); setSucces('') }}
        >
          {mode === 'login' ? 'Pas encore de compte ? Créer un compte' : 'Déjà un compte ? Se connecter'}
        </button>
      </div>
    </div>
  )
}
