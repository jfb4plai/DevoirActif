// Sépare le texte de fiche (venant de l'IA) en paragraphes exploitables par docx —
// une ligne non vide = un paragraphe, lignes blanches ignorées.
export function construireParagraphesFiche(texte) {
  return texte
    .split('\n')
    .map((ligne) => ligne.trim())
    .filter((ligne) => ligne.length > 0)
}
