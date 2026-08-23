// devoiractif/src/lib/formatsCatalogue.js
// Catalogue fermé des formats de devoir V1 — resistants à la délégation "scan + IA".
// Chaque format porte sa propre logique anti-délégation (promptInstructions),
// vérifiée via RISS avant écriture (voir docs/superpowers/specs/2026-08-23-devoiractif-design.md).

export const FORMATS = [
  {
    id: 'oral',
    label: 'Oral',
    description: 'Rien à photographier : l\'élève explique à un adulte, qui atteste.',
    justificationRiss:
      'Le rappel actif à voix haute ne laisse aucun support scannable. Cohérent avec la valeur du rappel actif en mémorisation (Keller 2020, dumas-03052674).',
    needsFiche: false,
    promptInstructions:
      'Génère une consigne demandant à l\'élève d\'EXPLIQUER ORALEMENT à un adulte, avec ses propres mots, ' +
      'sans jamais produire de texte écrit à rendre. La consigne doit préciser ce que l\'adulte doit écouter ' +
      'et comment il atteste brièvement (une phrase). Aucune fiche à générer.',
  },
  {
    id: 'chrono',
    label: 'Chrono sans ressource',
    description: 'Quelques minutes, sans cahier ni écran, pour écrire ce dont on se souvient — non noté sur l\'exactitude.',
    justificationRiss:
      'Pratique de récupération / test-enhanced learning : le bénéfice vient de l\'effort de rappel, pas du résultat (Keller 2020, dumas-03052674).',
    needsFiche: false,
    promptInstructions:
      'Génère une consigne de rappel actif, chronométrée (indique une durée courte, entre 3 et 7 minutes), ' +
      'SANS ressource ni cahier, explicitement présentée comme non notée sur l\'exactitude du contenu. ' +
      'Précise que la correction se fait collectivement en classe. Aucune fiche à générer.',
  },
  {
    id: 'manipulable',
    label: 'Manipulable',
    description: 'Un support physique (objets, dessin, découpage) — rien à scanner proprement.',
    justificationRiss:
      'Un support non textuel élimine le canal de délégation par photo/OCR par construction, pas par surveillance.',
    needsFiche: true,
    promptInstructions:
      'Génère une consigne demandant une manipulation physique concrète (compter/mesurer/dessiner/découper des ' +
      'objets réels), avec une preuve non textuelle à ramener (photo de la manipulation, pas de la réponse écrite ' +
      'seule). Fournis aussi un contenu de fiche imprimable courte décrivant le matériel nécessaire et les étapes.',
  },
  {
    id: 'contexte_personnel',
    label: 'Contexte personnel',
    description: 'Des données que seul l\'élève possède (mesures ou objets de sa maison).',
    justificationRiss:
      'Une IA ne peut produire une réponse correcte sans les données propres à l\'élève — les récolter demande déjà l\'effort visé.',
    needsFiche: true,
    promptInstructions:
      'Génère une consigne qui demande à l\'élève de récolter une donnée personnelle chez lui (mesure, comptage, ' +
      'observation d\'un objet réel) puis d\'appliquer la compétence visée sur cette donnée. Fournis un contenu de ' +
      'fiche imprimable avec un espace pour noter la donnée récoltée et le résultat.',
  },
]

export function getFormat(id) {
  return FORMATS.find((f) => f.id === id)
}
