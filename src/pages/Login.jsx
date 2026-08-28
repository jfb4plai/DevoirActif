import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [enCours, setEnCours] = useState(false)
  const { signIn, signUp, sendPasswordReset, updatePassword, passwordRecovery } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setSucces('')
    setEnCours(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setErreur('Email ou mot de passe incorrect.')
    } else if (mode === 'reset') {
      const { error } = await sendPasswordReset(email)
      if (error) setErreur(error.message)
      else setSucces('Email envoyé ! Vérifiez votre boîte mail pour créer un nouveau mot de passe.')
    } else {
      const { error } = await signUp(email, password)
      if (error) setErreur(error.message)
      else setSucces('Compte créé. Vérifiez votre email pour confirmer votre inscription.')
    }

    setEnCours(false)
  }

  async function handleUpdatePassword(e) {
    e.preventDefault()
    setErreur('')
    if (newPassword.length < 6) { setErreur('6 caractères minimum.'); return }
    setEnCours(true)
    const { error } = await updatePassword(newPassword)
    if (error) setErreur(error.message)
    setEnCours(false)
  }

  if (passwordRecovery) {
    return (
      <div className="plai-section">
        <div className="plai-card" style={{ maxWidth: 420, margin: '2rem auto' }}>
          <h2>Nouveau mot de passe</h2>
          <form onSubmit={handleUpdatePassword}>
            <label className="plai-label" htmlFor="new-password">Nouveau mot de passe</label>
            <input
              id="new-password"
              type="password"
              className="plai-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
            {erreur && <p className="plai-error">{erreur}</p>}
            <button type="submit" className="plai-btn" disabled={enCours}>
              {enCours ? 'Chargement…' : 'Enregistrer'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="plai-section">
      <div className="plai-card" style={{ maxWidth: 420, margin: '2rem auto' }}>
        <h2>{mode === 'login' ? 'Se connecter' : mode === 'reset' ? 'Mot de passe oublié' : 'Créer mon compte'}</h2>
        <p className="plai-help">
          {mode === 'login'
            ? 'Connexion enseignant nécessaire pour générer et enregistrer un devoir.'
            : mode === 'reset'
            ? 'Entrez votre email pour recevoir un lien de réinitialisation.'
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

          {mode !== 'reset' && (
            <>
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
            </>
          )}

          {erreur && <p className="plai-error">{erreur}</p>}
          {succes && <p className="plai-success">{succes}</p>}

          <button type="submit" className="plai-btn" disabled={enCours}>
            {enCours ? 'Chargement…' : mode === 'login' ? 'Se connecter' : mode === 'reset' ? 'Envoyer le lien' : 'Créer mon compte'}
          </button>
        </form>

        {mode !== 'reset' && (
          <button
            type="button"
            className="plai-btn"
            style={{ marginTop: '0.75rem', background: 'transparent', color: 'var(--teal)' }}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErreur(''); setSucces('') }}
          >
            {mode === 'login' ? 'Pas encore de compte ? Créer un compte' : 'Déjà un compte ? Se connecter'}
          </button>
        )}
        {mode === 'login' && (
          <button
            type="button"
            className="plai-btn"
            style={{ marginTop: '0.5rem', background: 'transparent', color: 'var(--teal)' }}
            onClick={() => { setMode('reset'); setErreur(''); setSucces('') }}
          >
            Mot de passe oublié ?
          </button>
        )}
        {mode === 'reset' && (
          <button
            type="button"
            className="plai-btn"
            style={{ marginTop: '0.75rem', background: 'transparent', color: 'var(--teal)' }}
            onClick={() => { setMode('login'); setErreur(''); setSucces('') }}
          >
            ← Retour à la connexion
          </button>
        )}
      </div>
    </div>
  )
}
