// devoiractif/src/lib/generationSchema.js
// Sortie contrainte de Haiku — évite le parsing Markdown fragile (pattern ProgressActif).
// Convention PLAI : pas de champ optionnel absent, chaîne vide "" quand non applicable
// (cohérent avec _generationSchema.js de ProgressActif — voir verification.details).

export const DEVOIR_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['consigne_texte', 'fiche_contenu', 'avertissement'],
  properties: {
    consigne_texte: {
      type: 'string',
      description: 'La consigne du devoir, prête à être lue ou recopiée par l\'enseignant. Jamais vide.',
    },
    fiche_contenu: {
      type: 'string',
      description:
        'Contenu de la fiche imprimable (matériel, étapes, espace de réponse). Chaîne vide "" si le format ' +
        'ne nécessite pas de fiche (oral, chrono).',
    },
    avertissement: {
      type: 'string',
      description:
        'Signale si la compétence correspond mal au format choisi et suggère une alternative. Chaîne vide "" ' +
        'si aucun problème détecté.',
    },
  },
}
