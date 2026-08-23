import { describe, it, expect } from 'vitest'
import { construireParagraphesFiche } from './construireParagraphesFiche.js'

describe('construireParagraphesFiche', () => {
  it('découpe le texte en paragraphes sur les lignes vides', () => {
    const texte = 'Matériel : 24 objets\n\nÉtape 1 : compte-les\nÉtape 2 : forme 4 groupes'
    const paragraphes = construireParagraphesFiche(texte)
    expect(paragraphes).toEqual([
      'Matériel : 24 objets',
      'Étape 1 : compte-les',
      'Étape 2 : forme 4 groupes',
    ])
  })

  it('retourne un tableau vide pour une chaîne vide', () => {
    expect(construireParagraphesFiche('')).toEqual([])
  })

  it('ignore les lignes ne contenant que des espaces', () => {
    const texte = 'Ligne 1\n   \nLigne 2'
    expect(construireParagraphesFiche(texte)).toEqual(['Ligne 1', 'Ligne 2'])
  })
})
