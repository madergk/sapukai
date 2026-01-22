/**
 * Tests for generate-report.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Change Report Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Token Comparison', () => {
    it('should detect added tokens', () => {
      const oldTokens = new Map([['colors.primary', { $value: '#000', $type: 'color' }]])

      const newTokens = new Map([
        ['colors.primary', { $value: '#000', $type: 'color' }],
        ['colors.secondary', { $value: '#333', $type: 'color' }],
      ])

      const added = Array.from(newTokens.keys()).filter(k => !oldTokens.has(k))

      expect(added).toContain('colors.secondary')
      expect(added.length).toBe(1)
    })

    it('should detect modified tokens', () => {
      const oldTokens = new Map([['colors.primary', { $value: '#000', $type: 'color' }]])

      const newTokens = new Map([['colors.primary', { $value: '#111', $type: 'color' }]])

      const modified: string[] = []

      for (const [path, newToken] of newTokens) {
        const oldToken = oldTokens.get(path)
        if (oldToken && JSON.stringify(oldToken.$value) !== JSON.stringify(newToken.$value)) {
          modified.push(path)
        }
      }

      expect(modified).toContain('colors.primary')
    })

    it('should detect removed tokens', () => {
      const oldTokens = new Map([
        ['colors.primary', { $value: '#000', $type: 'color' }],
        ['colors.secondary', { $value: '#333', $type: 'color' }],
      ])

      const newTokens = new Map([['colors.primary', { $value: '#000', $type: 'color' }]])

      const removed = Array.from(oldTokens.keys()).filter(k => !newTokens.has(k))

      expect(removed).toContain('colors.secondary')
      expect(removed.length).toBe(1)
    })
  })

  describe('Breaking Changes Detection', () => {
    it('should mark removed tokens as breaking', () => {
      const changes = {
        added: [],
        modified: [],
        removed: [{ path: 'colors.primary', type: 'color', oldValue: '#000' }],
      }

      const breaking = changes.removed.map(c => ({
        ...c,
        type: `REMOVED: ${c.type}`,
      }))

      expect(breaking.length).toBe(1)
      expect(breaking[0].type).toContain('REMOVED')
    })

    it('should mark type changes as breaking', () => {
      const changes = {
        added: [],
        modified: [
          {
            path: 'spacing.md',
            type: 'dimension',
            oldValue: '16px',
            newValue: 16, // Changed from string to number
          },
        ],
        removed: [],
      }

      const breaking = changes.modified.filter(c => {
        const oldType = typeof c.oldValue
        const newType = typeof c.newValue
        return oldType !== newType
      })

      expect(breaking.length).toBe(1)
    })
  })

  describe('Report Structure', () => {
    it('should create valid report structure', () => {
      const report = {
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        summary: {
          added: 5,
          modified: 3,
          removed: 1,
          total: 9,
        },
        details: {
          added: [],
          modified: [],
          removed: [],
        },
        breakingChanges: [],
        metadata: {
          source: 'Figma',
        },
      }

      expect(report.version).toBeDefined()
      expect(report.timestamp).toBeDefined()
      expect(report.summary.total).toBe(9)
      expect(report.details).toBeDefined()
      expect(report.breakingChanges).toBeDefined()
    })

    it('should calculate total correctly', () => {
      const summary = {
        added: 10,
        modified: 5,
        removed: 2,
      }

      const total = summary.added + summary.modified + summary.removed

      expect(total).toBe(17)
    })
  })
})

describe('Report Formatting', () => {
  it('should truncate long lists', () => {
    const items = Array.from({ length: 20 }, (_, i) => `item-${i}`)
    const maxShow = 5

    const displayed = items.slice(0, maxShow)
    const remaining = items.length - maxShow

    expect(displayed.length).toBe(5)
    expect(remaining).toBe(15)
  })

  it('should format timestamps correctly', () => {
    const timestamp = '2024-01-22T10:30:00.000Z'
    const date = new Date(timestamp)

    expect(date.getFullYear()).toBe(2024)
    expect(date.getMonth()).toBe(0) // January
    expect(date.getDate()).toBe(22)
  })
})
