// devoiractif/src/lib/generationSchema.test.js
import { describe, it, expect } from 'vitest'
import { DEVOIR_SCHEMA } from './generationSchema.js'

describe('generationSchema', () => {
  it('exige consigne_texte, fiche_contenu et avertissement, sans propriété additionnelle', () => {
    expect(DEVOIR_SCHEMA.additionalProperties).toBe(false)
    expect(DEVOIR_SCHEMA.required).toEqual(['consigne_texte', 'fiche_contenu', 'avertissement'])
  })

  it('les trois champs sont des chaînes (jamais null — chaîne vide si absent)', () => {
    expect(DEVOIR_SCHEMA.properties.consigne_texte.type).toBe('string')
    expect(DEVOIR_SCHEMA.properties.fiche_contenu.type).toBe('string')
    expect(DEVOIR_SCHEMA.properties.avertissement.type).toBe('string')
  })

  it('ne contient aucune contrainte minItems/maxItems (rejetée par l\'API Anthropic)', () => {
    expect(JSON.stringify(DEVOIR_SCHEMA)).not.toMatch(/minItems|maxItems/)
  })
})
