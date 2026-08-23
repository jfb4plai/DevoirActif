import { describe, it, expect } from 'vitest'
import { Packer } from 'docx'
import { construireDocumentDevoir } from './exportDevoirDocx.js'

describe('construireDocumentDevoir', () => {
  it('produit un document docx non vide à partir d\'une consigne et d\'une fiche', async () => {
    const doc = construireDocumentDevoir({
      niveau: 'P4',
      matiere: 'Mathématiques',
      competence: 'Mesurer un périmètre',
      formatLabel: 'Manipulable',
      consigneTexte: 'Mesure trois objets et calcule leur périmètre.',
      ficheContenu: 'Matériel : un mètre ruban\n\nÉtape 1 : choisis 3 objets',
    })
    const buffer = await Packer.toBuffer(doc)
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('fonctionne sans fiche (formats oral/chrono)', async () => {
    const doc = construireDocumentDevoir({
      niveau: 'P6',
      matiere: 'Français',
      competence: 'Conjuguer au futur simple',
      formatLabel: 'Chrono sans ressource',
      consigneTexte: 'Écris en 5 minutes tout ce que tu sais sur le futur simple.',
      ficheContenu: '',
    })
    const buffer = await Packer.toBuffer(doc)
    expect(buffer.length).toBeGreaterThan(0)
  })
})
