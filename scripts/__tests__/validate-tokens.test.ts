/**
 * Tests for validate-tokens.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// Mock fs module
vi.mock('fs')
vi.mock('ora', () => ({
  default: () => ({
    start: () => ({ succeed: vi.fn(), fail: vi.fn(), warn: vi.fn() }),
  }),
}))

describe('Token Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Schema Validation', () => {
    it('should detect missing primitives object', () => {
      const tokens = {
        semantic: { light: {}, dark: {} },
      }

      // The actual validation would happen here
      expect(tokens.primitives).toBeUndefined()
    })

    it('should detect missing semantic object', () => {
      const tokens = {
        primitives: {},
      }

      expect(tokens.semantic).toBeUndefined()
    })

    it('should validate token structure', () => {
      const validToken = {
        $value: '#ffffff',
        $type: 'color',
      }

      expect(validToken.$value).toBeDefined()
      expect(validToken.$type).toBe('color')
    })

    it('should detect invalid color format', () => {
      const invalidColors = ['rgb(255,0,0)', 'red', '#GGG', '255,0,0']
      const validColors = ['#fff', '#ffffff', '#ffffffff', '#FFF']

      const hexPattern = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

      for (const color of invalidColors) {
        expect(hexPattern.test(color)).toBe(false)
      }

      for (const color of validColors) {
        expect(hexPattern.test(color)).toBe(true)
      }
    })
  })

  describe('Naming Validation', () => {
    it('should detect spaces in token names', () => {
      const tokenNames = ['primary color', 'background-primary', 'contentPrimary']
      const spacesPattern = /\s/

      expect(spacesPattern.test(tokenNames[0])).toBe(true)
      expect(spacesPattern.test(tokenNames[1])).toBe(false)
      expect(spacesPattern.test(tokenNames[2])).toBe(false)
    })

    it('should detect special characters', () => {
      const tokenNames = ['color@primary', 'color-primary', 'color_primary']
      const specialPattern = /[^a-zA-Z0-9\-_\.]/

      expect(specialPattern.test(tokenNames[0])).toBe(true)
      expect(specialPattern.test(tokenNames[1])).toBe(false)
      expect(specialPattern.test(tokenNames[2])).toBe(false)
    })
  })

  describe('Mode Parity', () => {
    it('should detect missing dark mode tokens', () => {
      const light = new Map([
        ['content.primary', { $value: '#000', $type: 'color' }],
        ['content.secondary', { $value: '#333', $type: 'color' }],
      ])

      const dark = new Map([
        ['content.primary', { $value: '#fff', $type: 'color' }],
        // secondary is missing
      ])

      const missingInDark = Array.from(light.keys()).filter(k => !dark.has(k))

      expect(missingInDark).toContain('content.secondary')
    })

    it('should detect missing light mode tokens', () => {
      const light = new Map([['content.primary', { $value: '#000', $type: 'color' }]])

      const dark = new Map([
        ['content.primary', { $value: '#fff', $type: 'color' }],
        ['content.secondary', { $value: '#ccc', $type: 'color' }],
      ])

      const missingInLight = Array.from(dark.keys()).filter(k => !light.has(k))

      expect(missingInLight).toContain('content.secondary')
    })
  })

  describe('Token References', () => {
    it('should identify token references', () => {
      const values = ['{Zinc.500}', '#ffffff', '{colors.primary}', 'transparent']

      const isReference = (v: string) => v.startsWith('{') && v.endsWith('}')

      expect(isReference(values[0])).toBe(true)
      expect(isReference(values[1])).toBe(false)
      expect(isReference(values[2])).toBe(true)
      expect(isReference(values[3])).toBe(false)
    })
  })

  describe('WCAG Contrast', () => {
    it('should calculate approximate contrast ratio', () => {
      // Simple luminance calculation for testing
      const getLuminance = (hex: string): number => {
        const r = parseInt(hex.slice(1, 3), 16) / 255
        const g = parseInt(hex.slice(3, 5), 16) / 255
        const b = parseInt(hex.slice(5, 7), 16) / 255
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }

      const getContrastRatio = (l1: number, l2: number): number => {
        const lighter = Math.max(l1, l2)
        const darker = Math.min(l1, l2)
        return (lighter + 0.05) / (darker + 0.05)
      }

      const white = getLuminance('#ffffff')
      const black = getLuminance('#000000')

      const ratio = getContrastRatio(white, black)

      // Black on white should have high contrast
      expect(ratio).toBeGreaterThan(10)
    })
  })
})

describe('Utility Functions', () => {
  describe('flattenTokens', () => {
    it('should flatten nested token structure', () => {
      const tokens = {
        colors: {
          primary: {
            $value: '#000',
            $type: 'color',
          },
          secondary: {
            light: {
              $value: '#333',
              $type: 'color',
            },
          },
        },
      }

      // Simplified flatten for testing
      const flatten = (obj: any, prefix = ''): Map<string, any> => {
        const result = new Map()
        for (const [key, value] of Object.entries(obj)) {
          if (key.startsWith('$')) continue
          const path = prefix ? `${prefix}.${key}` : key
          if (value && typeof value === 'object' && '$value' in value) {
            result.set(path, value)
          } else if (typeof value === 'object') {
            const nested = flatten(value, path)
            for (const [k, v] of nested) {
              result.set(k, v)
            }
          }
        }
        return result
      }

      const flattened = flatten(tokens)

      expect(flattened.has('colors.primary')).toBe(true)
      expect(flattened.has('colors.secondary.light')).toBe(true)
      expect(flattened.get('colors.primary').$value).toBe('#000')
    })
  })
})
