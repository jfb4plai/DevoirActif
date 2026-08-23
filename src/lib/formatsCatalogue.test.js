// devoiractif/src/lib/formatsCatalogue.test.js
import { describe, it, expect } from 'vitest'
import { FORMATS, getFormat } from './formatsCatalogue.js'

describe('formatsCatalogue', () => {
  it('expose exactement les 4 formats V1', () => {
    expect(FORMATS.map((f) => f.id)).toEqual(['oral', 'chrono', 'manipulable', 'contexte_personnel'])
  })

  it('chaque format a un label, une description, une justification RISS et une instruction de prompt', () => {
    for (const format of FORMATS) {
      expect(format.label).toBeTruthy()
      expect(format.description).toBeTruthy()
      expect(format.justificationRiss).toBeTruthy()
      expect(format.promptInstructions).toBeTruthy()
    }
  })

  it('seuls manipulable et contexte_personnel nécessitent une fiche', () => {
    expect(getFormat('oral').needsFiche).toBe(false)
    expect(getFormat('chrono').needsFiche).toBe(false)
    expect(getFormat('manipulable').needsFiche).toBe(true)
    expect(getFormat('contexte_personnel').needsFiche).toBe(true)
  })

  it('getFormat renvoie undefined pour un id inconnu', () => {
    expect(getFormat('inexistant')).toBeUndefined()
  })
})
