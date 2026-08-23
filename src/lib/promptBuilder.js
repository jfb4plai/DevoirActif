// devoiractif/src/lib/promptBuilder.js
import { getFormat } from './formatsCatalogue.js'

const REGLES_GENERALES = `Tu es un générateur de devoirs pour l'enseignement primaire francophone (Fédération
Wallonie-Bruxelles). Règles impératives :
1. Ne résous pas l'exercice toi-même, ne fournis jamais la réponse attendue — seulement la consigne (et la fiche
   si demandée).
2. Le vocabulaire doit être compréhensible par un enfant de ce niveau, sans jargon didactique.
3. Une seule version de la consigne, pas de variantes ni de commentaire hors sujet.
4. Si la compétence indiquée correspond mal au format demandé, remplis le champ avertissement avec une phrase
   claire et une suggestion de format alternatif — ne force pas une génération qui n'aurait pas de sens.
5. Style direct, sans préambule ("Voici", "Bien sûr"), sans transition artificielle.`

export function construirePromptSysteme({ niveau, matiere, competence, formatId }) {
  const format = getFormat(formatId)
  if (!format) {
    throw new Error(`Format inconnu : "${formatId}"`)
  }

  return `${REGLES_GENERALES}

Niveau : ${niveau}
Matière : ${matiere}
Compétence visée : ${competence}

Instructions du format "${format.label}" :
${format.promptInstructions}`
}
