// devoiractif/src/lib/promptBuilder.test.js
import { describe, it, expect } from 'vitest'
import { construirePromptSysteme } from './promptBuilder.js'

describe('construirePromptSysteme', () => {
  const params = {
    niveau: 'P5',
    matiere: 'Français',
    competence: 'Accorder l\'adjectif avec le nom',
    formatId: 'chrono',
  }

  it('inclut le niveau, la matière et la compétence tels quels', () => {
    const prompt = construirePromptSysteme(params)
    expect(prompt).toContain('P5')
    expect(prompt).toContain('Français')
    expect(prompt).toContain('Accorder l\'adjectif avec le nom')
  })

  it('inclut les instructions du format sélectionné', () => {
    const prompt = construirePromptSysteme(params)
    expect(prompt).toContain('chronométrée')
  })

  it('interdit explicitement la production d\'une réponse résolue par l\'IA elle-même', () => {
    const prompt = construirePromptSysteme(params)
    expect(prompt).toMatch(/ne (résous|résouds) pas/i)
  })

  it('lève une erreur si formatId est inconnu', () => {
    expect(() => construirePromptSysteme({ ...params, formatId: 'inexistant' })).toThrow(/format inconnu/i)
  })
})
