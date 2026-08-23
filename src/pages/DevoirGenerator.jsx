import { useState } from 'react'
import { FORMATS } from '../lib/formatsCatalogue.js'
import { exporterDevoirDocx } from '../lib/exportDevoirDocx.js'
import { supabase } from '../lib/supabaseClient.js'

const NIVEAUX = ['P4', 'P5', 'P6']

export default function DevoirGenerator() {
  const [niveau, setNiveau] = useState('P4')
  const [matiere, setMatiere] = useState('')
  const [competence, setCompetence] = useState('')
  const [formatId, setFormatId] = useState(FORMATS[0].id)
  const [afficherJustification, setAfficherJustification] = useState(false)
  const [resultat, setResultat] = useState(null)
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState('')
  const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false)
  const [sauvegardeStatut, setSauvegardeStatut] = useState(null)
  const [exportEnCours, setExportEnCours] = useState(false)

  const formatChoisi = FORMATS.find((f) => f.id === formatId)

  async function genererDevoir() {
    setEnCours(true)
    setErreur('')
    setResultat(null)
    setSauvegardeStatut(null)
    try {
      const { data: session } = await supabase.auth.getSession()
      const token = session?.session?.access_token
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ niveau, matiere, competence, formatId }),
      })
      const data = await resp.json()
      if (!resp.ok) {
        setErreur(data.error || 'Erreur inconnue.')
        return
      }
      setResultat(data.resultat)
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnCours(false)
    }
  }

  async function sauvegarderHistorique() {
    if (!resultat) return
    setSauvegardeEnCours(true)
    setSauvegardeStatut(null)
    try {
      const { data: userData, error: erreurUser } = await supabase.auth.getUser()
      if (erreurUser || !userData?.user) {
        setSauvegardeStatut({ type: 'erreur', message: 'Session expirée — reconnectez-vous avant d\'enregistrer.' })
        return
      }
      const { error: erreurInsert } = await supabase.from('devoir_historique').insert({
        user_id: userData.user.id,
        niveau,
        matiere,
        competence,
        format: formatId,
        consigne_texte: resultat.consigne_texte,
        fiche_contenu: resultat.fiche_contenu,
      })
      if (erreurInsert) {
        setSauvegardeStatut({ type: 'erreur', message: `Échec de l'enregistrement : ${erreurInsert.message}` })
        return
      }
      setSauvegardeStatut({ type: 'succes', message: 'Enregistré.' })
    } catch (err) {
      setSauvegardeStatut({ type: 'erreur', message: `Échec de l'enregistrement : ${err.message}` })
    } finally {
      setSauvegardeEnCours(false)
    }
  }

  async function exporterFiche() {
    if (!resultat) return
    setExportEnCours(true)
    try {
      await exporterDevoirDocx({
        niveau,
        matiere,
        competence,
        formatLabel: formatChoisi.label,
        consigneTexte: resultat.consigne_texte,
        ficheContenu: resultat.fiche_contenu,
      })
    } finally {
      setExportEnCours(false)
    }
  }

  return (
    <div className="plai-section">
      <h2>Un devoir, un format résistant au scan + IA</h2>

      <label className="plai-label" htmlFor="niveau">Niveau</label>
      <select id="niveau" className="plai-input" value={niveau} onChange={(e) => setNiveau(e.target.value)}>
        {NIVEAUX.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <p className="plai-help">
        Le niveau ajuste le vocabulaire et la complexité de la consigne générée, et la durée proposée pour le format chrono sans ressource.
      </p>

      <label className="plai-label" htmlFor="matiere">Matière</label>
      <input
        id="matiere"
        className="plai-input"
        placeholder="ex. Français"
        value={matiere}
        onChange={(e) => setMatiere(e.target.value)}
      />
      <p className="plai-help">La matière dans laquelle porte le devoir — libre, toute discipline.</p>

      <label className="plai-label" htmlFor="competence">Compétence visée</label>
      <input
        id="competence"
        className="plai-input"
        placeholder="ex. Accorder l'adjectif avec le nom"
        value={competence}
        onChange={(e) => setCompetence(e.target.value)}
      />
      <p className="plai-help">
        La compétence précise que ce devoir doit faire travailler — plus c'est précis, plus le format proposé sera pertinent.
      </p>

      <fieldset>
        <legend className="plai-label">Format du devoir</legend>
        {FORMATS.map((f) => (
          <div key={f.id} className="plai-card">
            <label>
              <input
                type="radio"
                name="format"
                value={f.id}
                checked={formatId === f.id}
                onChange={() => setFormatId(f.id)}
              />
              {' '}{f.label}
            </label>
            <p className="plai-help">{f.description}</p>
          </div>
        ))}
        <button type="button" className="plai-btn" onClick={() => setAfficherJustification((v) => !v)}>
          Pourquoi ce format ?
        </button>
        {afficherJustification && <p className="plai-help">{formatChoisi.justificationRiss}</p>}
      </fieldset>

      <button type="button" className="plai-btn" onClick={genererDevoir} disabled={enCours || !matiere || !competence}>
        {enCours ? 'Génération…' : 'Générer le devoir'}
      </button>

      {erreur && <p className="plai-error">{erreur}</p>}

      {resultat && (
        <div className="plai-card">
          {resultat.avertissement && <p className="plai-error">{resultat.avertissement}</p>}

          <label className="plai-label" htmlFor="consigne">Consigne (éditable)</label>
          <textarea
            id="consigne"
            className="plai-input"
            rows={4}
            value={resultat.consigne_texte}
            onChange={(e) => setResultat({ ...resultat, consigne_texte: e.target.value })}
          />

          {formatChoisi.needsFiche && (
            <>
              <label className="plai-label" htmlFor="fiche">Contenu de la fiche (éditable)</label>
              <textarea
                id="fiche"
                className="plai-input"
                rows={6}
                value={resultat.fiche_contenu}
                onChange={(e) => setResultat({ ...resultat, fiche_contenu: e.target.value })}
              />
            </>
          )}

          <button type="button" className="plai-btn" onClick={sauvegarderHistorique} disabled={sauvegardeEnCours}>
            {sauvegardeEnCours ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {formatChoisi.needsFiche && (
            <button type="button" className="plai-btn" onClick={exporterFiche} disabled={exportEnCours}>
              {exportEnCours ? 'Export…' : 'Exporter la fiche (.docx)'}
            </button>
          )}

          {sauvegardeStatut && (
            <p className={sauvegardeStatut.type === 'succes' ? 'plai-success' : 'plai-error'}>
              {sauvegardeStatut.message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
