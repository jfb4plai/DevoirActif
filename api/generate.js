// devoiractif/api/generate.js
// Route : POST /api/generate
// Body : { niveau, matiere, competence, formatId }
// ANTHROPIC_API_KEY reste côté serveur uniquement.

import { requireUser } from './_auth.js'
import { construirePromptSysteme } from '../src/lib/promptBuilder.js'
import { DEVOIR_SCHEMA } from '../src/lib/generationSchema.js'
import { getFormat } from '../src/lib/formatsCatalogue.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const user = await requireUser(req, res)
  if (!user) return // requireUser a déjà envoyé la 401

  const { niveau, matiere, competence, formatId } = req.body ?? {}
  if (!niveau || !matiere || !competence || !formatId) {
    return res.status(400).json({ error: 'Champs requis manquants (niveau, matiere, competence, formatId).' })
  }

  if (!getFormat(formatId)) {
    return res.status(400).json({ error: `Format "${formatId}" inconnu.` })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Clé API manquante (ANTHROPIC_API_KEY)' })

  let systemPrompt
  try {
    systemPrompt = construirePromptSysteme({ niveau, matiere, competence, formatId })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: systemPrompt,
        output_config: { format: { type: 'json_schema', schema: DEVOIR_SCHEMA } },
        messages: [{ role: 'user', content: 'Génère le devoir selon les instructions du format indiqué.' }],
      }),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      return res.status(502).json({ error: `Erreur API Anthropic : ${errText}` })
    }

    const data = await resp.json()
    const texte = data.content?.[0]?.text ?? '{}'
    const resultat = JSON.parse(texte)
    return res.status(200).json({ resultat })
  } catch (err) {
    return res.status(500).json({ error: `Erreur serveur : ${err.message}` })
  }
}
