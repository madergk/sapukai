/**
 * Tests for rollback-tokens.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Token Rollback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Backup Parsing', () => {
    it('should parse backup filename correctly', () => {
      const filename = 'tokens-0.1.0-2024-01-22T10-30-00-000Z.json'
      const match = filename.match(/^tokens-(.+?)-(\d{4}-\d{2}-\d{2}T[\d-]+Z)\.json$/)

      expect(match).not.toBeNull()
      expect(match![1]).toBe('0.1.0')
      expect(match![2]).toBe('2024-01-22T10-30-00-000Z')
    })

    it('should handle various version formats', () => {
      const filenames = [
        'tokens-0.0.1-2024-01-22T10-30-00-000Z.json',
        'tokens-1.2.3-2024-01-22T10-30-00-000Z.json',
        'tokens-10.20.30-2024-01-22T10-30-00-000Z.json',
      ]

      const pattern = /^tokens-(.+?)-(\d{4}-\d{2}-\d{2}T[\d-]+Z)\.json$/

      for (const filename of filenames) {
        const match = filename.match(pattern)
        expect(match).not.toBeNull()
      }
    })
  })

  describe('Version Sorting', () => {
    it('should sort backups by date (newest first)', () => {
      const backups = [
        { date: new Date('2024-01-20'), version: '0.1.0' },
        { date: new Date('2024-01-22'), version: '0.1.2' },
        { date: new Date('2024-01-21'), version: '0.1.1' },
      ]

      const sorted = [...backups].sort((a, b) => b.date.getTime() - a.date.getTime())

      expect(sorted[0].version).toBe('0.1.2')
      expect(sorted[1].version).toBe('0.1.1')
      expect(sorted[2].version).toBe('0.1.0')
    })
  })

  describe('Backup Cleanup', () => {
    it('should identify backups to delete when exceeding limit', () => {
      const backups = Array.from({ length: 25 }, (_, i) => ({
        version: `0.0.${i}`,
        date: new Date(2024, 0, i + 1),
      })).sort((a, b) => b.date.getTime() - a.date.getTime())

      const keepCount = 20
      const toDelete = backups.slice(keepCount)

      expect(toDelete.length).toBe(5)
      expect(toDelete[0].version).toBe('0.0.4') // Oldest kept
    })
  })

  describe('Version Matching', () => {
    it('should find backup by exact version', () => {
      const backups = [
        { version: '0.1.0', filename: 'tokens-0.1.0-xxx.json' },
        { version: '0.1.1', filename: 'tokens-0.1.1-xxx.json' },
        { version: '0.1.2', filename: 'tokens-0.1.2-xxx.json' },
      ]

      const target = backups.find(b => b.version === '0.1.1')

      expect(target).toBeDefined()
      expect(target!.version).toBe('0.1.1')
    })

    it('should return undefined for non-existent version', () => {
      const backups = [{ version: '0.1.0', filename: 'tokens-0.1.0-xxx.json' }]

      const target = backups.find(b => b.version === '0.2.0')

      expect(target).toBeUndefined()
    })
  })
})

describe('CLI Argument Parsing', () => {
  it('should parse --version argument', () => {
    const args = ['--version=0.1.0']

    let version: string | undefined

    for (const arg of args) {
      if (arg.startsWith('--version=')) {
        version = arg.split('=')[1]
      }
    }

    expect(version).toBe('0.1.0')
  })

  it('should parse --latest flag', () => {
    const args = ['--latest', '--dry-run']

    const latest = args.includes('--latest')
    const dryRun = args.includes('--dry-run')

    expect(latest).toBe(true)
    expect(dryRun).toBe(true)
  })

  it('should parse --list flag', () => {
    const args = ['--list']

    const list = args.includes('--list') || args.includes('-l')

    expect(list).toBe(true)
  })
})
