import { Document, Paragraph, HeadingLevel, Packer } from 'docx'
import { saveAs } from 'file-saver'
import { construireParagraphesFiche } from './construireParagraphesFiche.js'

export function construireDocumentDevoir({ niveau, matiere, competence, formatLabel, consigneTexte, ficheContenu }) {
  const enfants = [
    new Paragraph({ text: `Devoir — ${matiere} (${niveau})`, heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ text: `Compétence : ${competence}` }),
    new Paragraph({ text: `Format : ${formatLabel}` }),
    new Paragraph({ text: '' }),
    new Paragraph({ text: consigneTexte }),
  ]

  const paragraphesFiche = construireParagraphesFiche(ficheContenu)
  if (paragraphesFiche.length > 0) {
    enfants.push(new Paragraph({ text: '' }))
    enfants.push(new Paragraph({ text: 'Fiche', heading: HeadingLevel.HEADING_2 }))
    for (const ligne of paragraphesFiche) {
      enfants.push(new Paragraph({ text: ligne }))
    }
  }

  return new Document({ sections: [{ children: enfants }] })
}

export async function exporterDevoirDocx(params) {
  const doc = construireDocumentDevoir(params)
  const blob = await Packer.toBlob(doc)
  const nomFichier = `devoir-${params.niveau}-${params.matiere}.docx`.replace(/\s+/g, '_')
  saveAs(blob, nomFichier)
}
