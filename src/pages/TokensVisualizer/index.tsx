import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import type {
  TokensMap,
  TokenCategory,
  TokenTheme,
  TokenNodeProps,
  NodePositionsMap,
  UploadModalProps,
  UploadPreview,
  TokenSourceFormat,
  ColorPreviewProps,
} from './types'
import { sampleTokens } from './sampleTokens'
import { parseTokensStudioJSON } from './parseTokensStudio'
import { parseCssScss } from './parseCssScss'
import { getArchitectureRecommendations } from './recommendations'
import {
  buildCssVariables,
  buildScssVariables,
  buildStyleDictionaryConfig,
  buildStyleDictionaryTokens,
} from './styleDictionaryExport'

// Category colors mapping
const categoryColors: Record<TokenCategory | 'other', string> = {
  color: 'var(--content-blue)',
  spacing: 'var(--content-green)',
  typography: 'var(--content-purple)',
  border: 'var(--content-amber)',
  effect: 'var(--content-indigo)',
  animation: 'var(--content-pink)',
  component: 'var(--content-teal)',
  other: 'var(--content-zinc)',
}

// Color Preview Component
function ColorPreview({ value }: ColorPreviewProps) {
  if (!value) return null
  const isColor = value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')
  if (!isColor) return null
  return (
    <div
      className="h-6 w-6 flex-shrink-0 rounded border border-[var(--border-primary)]"
      style={{ backgroundColor: value }}
    />
  )
}

// Token Node Component for Graph
function TokenNode({
  token,
  name,
  x,
  y,
  isSelected,
  isHighlighted,
  isConnected,
  onClick,
  onDragStart,
}: TokenNodeProps) {
  const bgColor = categoryColors[token.category] || 'var(--content-zinc)'
  const opacity = isHighlighted ? 1 : isConnected ? 0.9 : isSelected ? 1 : 0.6

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onMouseDown={onDragStart}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={-60}
        y={-20}
        width={120}
        height={40}
        rx={6}
        fill={bgColor}
        opacity={opacity}
        stroke={isSelected ? 'var(--content-primary)' : 'transparent'}
        strokeWidth={2}
      />
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--content-primary)"
        fontSize={10}
        fontWeight={500}
        style={{ pointerEvents: 'none' }}
      >
        {name.length > 16 ? name.slice(0, 14) + '...' : name}
      </text>
      {token.type === 'color' && (
        <rect
          x={-55}
          y={10}
          width={12}
          height={8}
          rx={2}
          fill={token.value.startsWith('{') ? 'var(--content-primary)' : token.value}
          stroke="var(--content-primary)"
          strokeWidth={0.5}
        />
      )}
    </g>
  )
}

// Upload Modal Component
function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<UploadPreview | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formatLabels: Record<TokenSourceFormat, string> = {
    tokensStudio: 'Tokens Studio',
    css: 'CSS',
    scss: 'SCSS',
  }

  const handleFile = async (file: File | undefined) => {
    setError(null)
    setPreview(null)

    if (!file) return

    try {
      const text = await file.text()
      const lowerName = file.name.toLowerCase()
      let format: TokenSourceFormat

      if (lowerName.endsWith('.json')) {
        format = 'tokensStudio'
      } else if (lowerName.endsWith('.css')) {
        format = 'css'
      } else if (lowerName.endsWith('.scss')) {
        format = 'scss'
      } else {
        setError('Please upload a JSON, CSS, or SCSS file')
        return
      }

      const tokens =
        format === 'tokensStudio'
          ? parseTokensStudioJSON(JSON.parse(text))
          : parseCssScss(text, format)

      const tokenCount = Object.keys(tokens).length

      if (tokenCount === 0) {
        setError("No tokens found in this file. Make sure it's a valid tokens source.")
        return
      }

      const categories = [...new Set(Object.values(tokens).map(t => t.category))] as TokenCategory[]
      const themes = [...new Set(Object.values(tokens).map(t => t.theme))] as TokenTheme[]

      setPreview({
        filename: file.name,
        tokenCount,
        categories,
        themes,
        tokens,
        format,
      })
    } catch (err) {
      setError(`Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const confirmUpload = () => {
    if (preview) {
      onUpload(preview.tokens)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[color:color-mix(in_srgb,var(--background-inverseprimary)_60%,transparent)]"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-lg overflow-hidden rounded-xl bg-[var(--background-secondary)] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] p-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--content-primary)]">
              Import design tokens
            </h2>
            <p className="mt-0.5 text-sm text-[var(--content-secondary)]">
              Upload a Tokens Studio JSON export, CSS variables, or SCSS variables file
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--content-secondary)] hover:text-[var(--content-primary)]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
                dragOver
                  ? 'border-[var(--border-info)] bg-[var(--background-blue)]'
                  : 'border-[var(--border-secondary)] hover:border-[var(--border-primary)] hover:bg-[color:color-mix(in_srgb,var(--background-secondary)_60%,transparent)]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.css,.scss"
                onChange={e => handleFile(e.target.files?.[0])}
                className="hidden"
              />
              <div className="mb-3 text-4xl">📦</div>
              <p className="font-medium text-[var(--content-primary)]">
                Drop your tokens.json file here
              </p>
              <p className="mt-1 text-sm text-[var(--content-secondary)]">or click to browse</p>
              <p className="mt-4 text-xs text-[var(--content-tertiary)]">
                Supports Tokens Studio JSON, CSS variables, and SCSS variables
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-[color:color-mix(in_srgb,var(--background-secondary)_60%,transparent)] p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">✅</div>
                  <div>
                    <p className="font-medium text-[var(--content-primary)]">{preview.filename}</p>
                    <p className="text-sm text-[var(--content-secondary)]">
                      {preview.tokenCount} tokens found · {formatLabels[preview.format]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[color:color-mix(in_srgb,var(--background-secondary)_40%,transparent)] p-3">
                  <p className="mb-2 text-xs uppercase tracking-wider text-[var(--content-secondary)]">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {preview.categories.map(cat => (
                      <span
                        key={cat}
                        className="rounded bg-[var(--background-tertiary)] px-2 py-0.5 text-xs text-[var(--content-secondary)]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-[color:color-mix(in_srgb,var(--background-secondary)_40%,transparent)] p-3">
                  <p className="mb-2 text-xs uppercase tracking-wider text-[var(--content-secondary)]">
                    Themes
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {preview.themes.map(theme => (
                      <span
                        key={theme}
                        className="rounded bg-[var(--background-tertiary)] px-2 py-0.5 text-xs text-[var(--content-secondary)]"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setPreview(null)
                  setError(null)
                }}
                className="text-sm text-[var(--content-secondary)] hover:text-[var(--content-primary)]"
              >
                ← Choose different file
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-[var(--border-error)] bg-[var(--background-red)] p-3">
              <p className="text-sm text-[var(--content-red)]">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--border-primary)] p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[var(--content-secondary)] transition hover:text-[var(--content-primary)]"
          >
            Cancel
          </button>
          <button
            onClick={confirmUpload}
            disabled={!preview}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              preview
                ? 'bg-[var(--background-hover)] text-[var(--content-primary)] hover:bg-[var(--content-blue)]'
                : 'cursor-not-allowed bg-[var(--background-tertiary)] text-[var(--content-tertiary)]'
            }`}
          >
            Import {preview ? preview.tokenCount : ''} Tokens
          </button>
        </div>
      </div>
    </div>
  )
}

// Props for the main component
interface TokensVisualizerProps {
  currentPath?: string
  onNavigate?: (path: string) => void
}

// Main Component
export function TokensVisualizer({ onNavigate }: TokensVisualizerProps) {
  const [tokens, setTokens] = useState<TokensMap>(sampleTokens)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [expandedTokens, setExpandedTokens] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [themeFilter, setThemeFilter] = useState('all')
  const [scaleFilter, setScaleFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph')
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingToken, setEditingToken] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [dragPositions, setDragPositions] = useState<NodePositionsMap>({})
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [pan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [importSource, setImportSource] = useState<'sample' | 'imported'>('sample')
  const svgRef = useRef<SVGSVGElement>(null)

  // Filter tokens
  const filteredTokens = useMemo(() => {
    return Object.entries(tokens).filter(([name, token]) => {
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.value.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTheme =
        themeFilter === 'all' || token.theme === themeFilter || token.theme === 'all'
      const matchesScale = scaleFilter === 'all' || token.scale === scaleFilter
      const matchesCategory = categoryFilter === 'all' || token.category === categoryFilter
      return matchesSearch && matchesTheme && matchesScale && matchesCategory
    })
  }, [tokens, searchQuery, themeFilter, scaleFilter, categoryFilter])

  // Get recommendations
  const recommendations = useMemo(() => getArchitectureRecommendations(tokens), [tokens])

  const basePositions = useMemo(() => {
    const positions: NodePositionsMap = {}
    const categories = [...new Set(Object.values(tokens).map(t => t.category))]
    const categoryAngles: Record<string, number> = {}
    categories.forEach((cat, i) => {
      categoryAngles[cat] = (i / categories.length) * Math.PI * 2
    })

    const tokensByCategory: Record<string, string[]> = {}
    Object.entries(tokens).forEach(([name, token]) => {
      if (!tokensByCategory[token.category]) {
        tokensByCategory[token.category] = []
      }
      tokensByCategory[token.category].push(name)
    })

    Object.entries(tokens).forEach(([name, token]) => {
      const catIndex = tokensByCategory[token.category].indexOf(name)
      const catTotal = tokensByCategory[token.category].length
      const angle = categoryAngles[token.category] + (catIndex / catTotal - 0.5) * 0.8
      const radius = 180 + (catIndex % 3) * 60
      positions[name] = {
        x: 400 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
      }
    })

    return positions
  }, [tokens])

  const nodePositions = useMemo(() => {
    const merged: NodePositionsMap = { ...basePositions }
    Object.entries(dragPositions).forEach(([name, position]) => {
      if (basePositions[name]) {
        merged[name] = position
      }
    })
    return merged
  }, [basePositions, dragPositions])

  // Handle imported tokens
  const handleImportTokens = useCallback((importedTokens: TokensMap) => {
    setTokens(importedTokens)
    setImportSource('imported')
    setSelectedToken(null)
    setDragPositions({})
    setSearchQuery('')
    setThemeFilter('all')
    setScaleFilter('all')
    setCategoryFilter('all')
  }, [])

  // Get connected tokens
  const getConnectedTokens = useCallback(
    (tokenName: string) => {
      const token = tokens[tokenName]
      if (!token) return new Set<string>()
      const connected = new Set<string>()
      token.references.forEach(ref => connected.add(ref))
      token.referencedBy.forEach(ref => connected.add(ref))
      return connected
    },
    [tokens]
  )

  // Toggle token expansion
  const toggleExpand = useCallback((tokenName: string) => {
    setExpandedTokens(prev => {
      const next = new Set(prev)
      if (next.has(tokenName)) {
        next.delete(tokenName)
      } else {
        next.add(tokenName)
      }
      return next
    })
    setSelectedToken(tokenName)
  }, [])

  // Handle edit
  const handleEdit = useCallback(
    (tokenName: string) => {
      setEditingToken(tokenName)
      setEditValue(tokens[tokenName].value)
    },
    [tokens]
  )

  const saveEdit = useCallback(() => {
    if (editingToken && editValue !== tokens[editingToken].value) {
      setTokens(prev => ({
        ...prev,
        [editingToken]: { ...prev[editingToken], value: editValue },
      }))
    }
    setEditingToken(null)
    setEditValue('')
  }, [editingToken, editValue, tokens])

  // Handle delete
  const handleDelete = useCallback((tokenName: string) => {
    if (confirm(`Delete token "${tokenName}"?`)) {
      setTokens(prev => {
        const next = { ...prev }
        delete next[tokenName]
        Object.keys(next).forEach(key => {
          next[key] = {
            ...next[key],
            references: next[key].references.filter(r => r !== tokenName),
            referencedBy: next[key].referencedBy.filter(r => r !== tokenName),
          }
        })
        return next
      })
      setSelectedToken(null)
    }
  }, [])

  // Export tokens
  const exportTokens = useCallback(
    (format: 'css' | 'scss' | 'json' | 'js' | 'sd-config' | 'sd-bundle') => {
      const downloadFile = (filename: string, content: string) => {
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      }

      if (format === 'css') {
        downloadFile('tokens.css', buildCssVariables(tokens))
        return
      }

      if (format === 'scss') {
        downloadFile('tokens.scss', buildScssVariables(tokens))
        return
      }

      if (format === 'json') {
        const exportData: Record<string, unknown> = {}
        Object.entries(tokens).forEach(([name, token]) => {
          const parts = name.split('.')
          let current: Record<string, unknown> = exportData
          parts.forEach((part, index) => {
            if (index === parts.length - 1) {
              current[part] = {
                value: token.value,
                type: token.type,
                description: token.description || '',
              }
            } else {
              current[part] = current[part] || {}
              current = current[part] as Record<string, unknown>
            }
          })
        })
        downloadFile('tokens.json', JSON.stringify(exportData, null, 2))
        return
      }

      if (format === 'js') {
        const content =
          'export const tokens = ' +
          JSON.stringify(
            Object.fromEntries(Object.entries(tokens).map(([k, v]) => [k, v.value])),
            null,
            2
          ) +
          ';\n'
        downloadFile('tokens.js', content)
        return
      }

      const sdTokens = JSON.stringify(buildStyleDictionaryTokens(tokens), null, 2)
      const sdConfig = JSON.stringify(buildStyleDictionaryConfig(), null, 2)

      if (format === 'sd-config') {
        downloadFile('tokens.json', sdTokens)
        downloadFile('config.json', sdConfig)
        return
      }

      if (format === 'sd-bundle') {
        downloadFile('tokens.json', sdTokens)
        downloadFile('config.json', sdConfig)
        downloadFile('tokens.css', buildCssVariables(tokens))
        downloadFile('tokens.scss', buildScssVariables(tokens))
        const jsContent =
          'export const tokens = ' +
          JSON.stringify(
            Object.fromEntries(Object.entries(tokens).map(([k, v]) => [k, v.value])),
            null,
            2
          ) +
          ';\n'
        downloadFile('tokens.js', jsContent)
      }
    },
    [tokens]
  )

  // Handle mouse events for dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !draggedNode || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / zoom
      const y = (e.clientY - rect.top - pan.y) / zoom
      setDragPositions(prev => ({
        ...prev,
        [draggedNode]: { x, y },
      }))
    },
    [isDragging, draggedNode, pan, zoom]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggedNode(null)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const connectedTokens = selectedToken ? getConnectedTokens(selectedToken) : new Set<string>()

  // Categories and themes for filter
  const categories = [...new Set(Object.values(tokens).map(t => t.category))]
  const themes = [...new Set(Object.values(tokens).map(t => t.theme))]

  return (
    <div
      className="flex h-screen w-full flex-col overflow-hidden bg-[var(--background-primary)] text-[var(--content-primary)]"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-[var(--border-primary)] bg-[var(--background-secondary)] px-4 py-3">
        <div className="flex items-center gap-4">
          {onNavigate && (
            <button
              onClick={() => onNavigate('/')}
              className="rounded p-1 text-[var(--content-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--content-primary)]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <h1 className="text-lg font-semibold text-[var(--content-primary)]">
            Design Tokens Visualizer
          </h1>
          <div className="flex gap-1 rounded-lg bg-[var(--background-tertiary)] p-0.5">
            <button
              onClick={() => setViewMode('graph')}
              className={`rounded-md px-3 py-1.5 text-sm transition ${viewMode === 'graph' ? 'bg-[var(--background-secondary)] text-[var(--content-primary)]' : 'text-[var(--content-secondary)] hover:text-[var(--content-primary)]'}`}
            >
              Graph
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md px-3 py-1.5 text-sm transition ${viewMode === 'list' ? 'bg-[var(--background-secondary)] text-[var(--content-primary)]' : 'text-[var(--content-secondary)] hover:text-[var(--content-primary)]'}`}
            >
              List
            </button>
          </div>
          {importSource === 'imported' && (
            <span className="rounded bg-[var(--background-green)] px-2 py-0.5 text-xs text-[var(--content-green)]">
              Imported
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 rounded-md bg-[var(--background-hover)] px-3 py-1.5 text-sm text-[var(--content-primary)] transition hover:bg-[var(--content-blue)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Import JSON
          </button>

          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition ${showRecommendations ? 'bg-[var(--background-amber)] text-[var(--content-amber)]' : 'bg-[var(--background-tertiary)] text-[var(--content-secondary)] hover:bg-[var(--background-secondary)]'}`}
          >
            <span>💡</span>
            Recommendations
            {recommendations.length > 0 && (
              <span className="rounded-full bg-[var(--content-amber)] px-1.5 text-xs text-[var(--background-primary)]">
                {recommendations.length}
              </span>
            )}
          </button>

          <div className="flex gap-1">
            <button
              onClick={() => exportTokens('css')}
              className="rounded-md bg-[var(--background-tertiary)] px-3 py-1.5 text-sm text-[var(--content-secondary)] transition hover:bg-[var(--background-secondary)]"
            >
              CSS
            </button>
            <button
              onClick={() => exportTokens('scss')}
              className="rounded-md bg-[var(--background-tertiary)] px-3 py-1.5 text-sm text-[var(--content-secondary)] transition hover:bg-[var(--background-secondary)]"
            >
              SCSS
            </button>
            <button
              onClick={() => exportTokens('json')}
              className="rounded-md bg-[var(--background-tertiary)] px-3 py-1.5 text-sm text-[var(--content-secondary)] transition hover:bg-[var(--background-secondary)]"
            >
              JSON
            </button>
            <button
              onClick={() => exportTokens('js')}
              className="rounded-md bg-[var(--background-tertiary)] px-3 py-1.5 text-sm text-[var(--content-secondary)] transition hover:bg-[var(--background-secondary)]"
            >
              JS
            </button>
            <button
              onClick={() => exportTokens('sd-config')}
              className="rounded-md bg-[var(--background-tertiary)] px-3 py-1.5 text-sm text-[var(--content-secondary)] transition hover:bg-[var(--background-secondary)]"
            >
              SD Config
            </button>
            <button
              onClick={() => exportTokens('sd-bundle')}
              className="rounded-md bg-[var(--background-tertiary)] px-3 py-1.5 text-sm text-[var(--content-secondary)] transition hover:bg-[var(--background-secondary)]"
            >
              SD Bundle
            </button>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="flex flex-shrink-0 items-center gap-4 border-b border-[var(--border-primary)] bg-[color:color-mix(in_srgb,var(--background-secondary)_70%,transparent)] px-4 py-2">
        <div className="relative max-w-md flex-1">
          <input
            type="text"
            placeholder="Search tokens by name or value..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-secondary)] bg-[var(--background-tertiary)] px-4 py-2 pl-10 text-sm text-[var(--content-primary)] placeholder-[var(--content-tertiary)] focus:border-[var(--border-info)] focus:outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-[var(--content-tertiary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--content-secondary)]">Theme:</span>
          <select
            value={themeFilter}
            onChange={e => setThemeFilter(e.target.value)}
            className="rounded-lg border border-[var(--border-secondary)] bg-[var(--background-tertiary)] px-3 py-1.5 text-sm text-[var(--content-primary)] focus:border-[var(--border-info)] focus:outline-none"
          >
            <option value="all">All</option>
            {themes
              .filter(t => t !== 'all')
              .map(theme => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--content-secondary)]">Scale:</span>
          <select
            value={scaleFilter}
            onChange={e => setScaleFilter(e.target.value)}
            className="rounded-lg border border-[var(--border-secondary)] bg-[var(--background-tertiary)] px-3 py-1.5 text-sm text-[var(--content-primary)] focus:border-[var(--border-info)] focus:outline-none"
          >
            <option value="all">All</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--content-secondary)]">Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[var(--border-secondary)] bg-[var(--background-tertiary)] px-3 py-1.5 text-sm text-[var(--content-primary)] focus:border-[var(--border-info)] focus:outline-none"
          >
            <option value="all">All</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-sm text-[var(--content-secondary)]">
          {filteredTokens.length} of {Object.keys(tokens).length} tokens
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Graph/List View */}
        <div className="relative flex-1">
          {viewMode === 'graph' ? (
            <svg
              ref={svgRef}
              className="h-full w-full"
              style={{
                background:
                  'radial-gradient(circle at center, var(--background-secondary) 0%, var(--background-primary) 100%)',
              }}
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="var(--border-secondary)"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* Connections */}
                {filteredTokens.map(([name, token]) => {
                  const pos = nodePositions[name]
                  if (!pos) return null

                  return token.references.map(refName => {
                    const refPos = nodePositions[refName]
                    if (!refPos || !filteredTokens.find(([n]) => n === refName)) return null

                    const isHighlighted = selectedToken === name || selectedToken === refName

                    return (
                      <line
                        key={`${name}-${refName}`}
                        x1={pos.x}
                        y1={pos.y}
                        x2={refPos.x}
                        y2={refPos.y}
                        stroke={isHighlighted ? 'var(--content-blue)' : 'var(--border-secondary)'}
                        strokeWidth={isHighlighted ? 2 : 1}
                        opacity={isHighlighted ? 1 : 0.4}
                        strokeDasharray={isHighlighted ? '' : '4 2'}
                      />
                    )
                  })
                })}

                {/* Nodes */}
                {filteredTokens.map(([name, token]) => {
                  const pos = nodePositions[name]
                  if (!pos) return null

                  return (
                    <TokenNode
                      key={name}
                      token={token}
                      name={name}
                      x={pos.x}
                      y={pos.y}
                      isSelected={selectedToken === name}
                      isHighlighted={expandedTokens.has(name)}
                      isConnected={connectedTokens.has(name)}
                      onClick={() => toggleExpand(name)}
                      onDragStart={e => {
                        e.stopPropagation()
                        setIsDragging(true)
                        setDraggedNode(name)
                      }}
                    />
                  )
                })}
              </g>

              {/* Legend */}
              <g transform="translate(20, 20)">
                <rect
                  x={0}
                  y={0}
                  width={140}
                  height={220}
                  rx={8}
                  fill="var(--background-secondary)"
                  stroke="var(--border-primary)"
                />
                <text x={12} y={24} fill="var(--content-secondary)" fontSize={11} fontWeight={600}>
                  Categories
                </text>
                {[
                  { name: 'Color', key: 'color' },
                  { name: 'Spacing', key: 'spacing' },
                  { name: 'Typography', key: 'typography' },
                  { name: 'Border', key: 'border' },
                  { name: 'Effect', key: 'effect' },
                  { name: 'Animation', key: 'animation' },
                  { name: 'Component', key: 'component' },
                  { name: 'Other', key: 'other' },
                ].map((cat, i) => (
                  <g key={cat.name} transform={`translate(12, ${44 + i * 22})`}>
                    <rect
                      x={0}
                      y={0}
                      width={12}
                      height={12}
                      rx={3}
                      fill={categoryColors[cat.key as TokenCategory | 'other']}
                    />
                    <text x={20} y={10} fill="var(--content-secondary)" fontSize={11}>
                      {cat.name}
                    </text>
                  </g>
                ))}
              </g>

              {/* Zoom controls */}
              <g transform="translate(20, 260)">
                <rect
                  x={0}
                  y={0}
                  width={40}
                  height={80}
                  rx={8}
                  fill="var(--background-secondary)"
                  stroke="var(--border-primary)"
                />
                <g
                  transform="translate(8, 8)"
                  onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                  style={{ cursor: 'pointer' }}
                >
                  <rect width={24} height={24} rx={4} fill="var(--background-tertiary)" />
                  <text
                    x={12}
                    y={16}
                    textAnchor="middle"
                    fill="var(--content-primary)"
                    fontSize={16}
                  >
                    +
                  </text>
                </g>
                <g
                  transform="translate(8, 48)"
                  onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
                  style={{ cursor: 'pointer' }}
                >
                  <rect width={24} height={24} rx={4} fill="var(--background-tertiary)" />
                  <text
                    x={12}
                    y={16}
                    textAnchor="middle"
                    fill="var(--content-primary)"
                    fontSize={16}
                  >
                    −
                  </text>
                </g>
              </g>
            </svg>
          ) : (
            <div className="h-full overflow-auto p-4">
              <div className="grid gap-2">
                {filteredTokens.map(([name, token]) => (
                  <div
                    key={name}
                    onClick={() => setSelectedToken(name)}
                    className={`cursor-pointer rounded-lg p-3 transition ${
                      selectedToken === name
                        ? 'border border-[var(--border-info)] bg-[var(--background-blue)]'
                        : 'border border-[var(--border-primary)] bg-[var(--background-secondary)] hover:border-[var(--border-secondary)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ColorPreview value={token.value} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-[var(--content-primary)]">
                          {name}
                        </div>
                        <div className="truncate text-xs text-[var(--content-secondary)]">
                          {token.value}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${
                            token.category === 'color'
                              ? 'bg-[var(--background-blue)] text-[var(--content-blue)]'
                              : token.category === 'spacing'
                                ? 'bg-[var(--background-green)] text-[var(--content-green)]'
                                : token.category === 'typography'
                                  ? 'bg-[var(--background-purple)] text-[var(--content-purple)]'
                                  : token.category === 'border'
                                    ? 'bg-[var(--background-amber)] text-[var(--content-amber)]'
                                    : token.category === 'effect'
                                      ? 'bg-[var(--background-indigo)] text-[var(--content-indigo)]'
                                      : token.category === 'animation'
                                        ? 'bg-[var(--background-pink)] text-[var(--content-pink)]'
                                        : token.category === 'component'
                                          ? 'bg-[var(--background-teal)] text-[var(--content-teal)]'
                                          : 'bg-[var(--background-zinc)] text-[var(--content-zinc)]'
                          }`}
                        >
                          {token.category}
                        </span>
                        <span className="rounded bg-[var(--background-tertiary)] px-2 py-0.5 text-xs text-[var(--content-secondary)]">
                          {token.theme}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedToken && tokens[selectedToken] && (
          <div className="flex w-80 flex-col overflow-hidden border-l border-[var(--border-primary)] bg-[var(--background-secondary)]">
            <div className="border-b border-[var(--border-primary)] p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="truncate text-sm font-semibold text-[var(--content-primary)]">
                  {selectedToken}
                </h2>
                <button
                  onClick={() => setSelectedToken(null)}
                  className="p-1 text-[var(--content-secondary)] hover:text-[var(--content-primary)]"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-[var(--content-secondary)]">
                    Value
                  </label>
                  {editingToken === selectedToken ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="flex-1 rounded border border-[var(--border-secondary)] bg-[var(--background-tertiary)] px-2 py-1 text-sm text-[var(--content-primary)] focus:border-[var(--border-info)] focus:outline-none"
                      />
                      <button
                        onClick={saveEdit}
                        className="rounded bg-[var(--background-hover)] px-2 py-1 text-sm text-[var(--content-primary)] hover:bg-[var(--content-blue)]"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ColorPreview value={tokens[selectedToken].value} />
                      <code className="flex-1 truncate rounded bg-[color:color-mix(in_srgb,var(--background-secondary)_60%,transparent)] px-2 py-1 text-sm text-[var(--content-secondary)]">
                        {tokens[selectedToken].value}
                      </code>
                      <button
                        onClick={() => handleEdit(selectedToken)}
                        className="p-1 text-[var(--content-secondary)] hover:text-[var(--content-primary)]"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {tokens[selectedToken].description && (
                  <div>
                    <label className="mb-1 block text-xs text-[var(--content-secondary)]">
                      Description
                    </label>
                    <p className="text-sm text-[var(--content-secondary)]">
                      {tokens[selectedToken].description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-[var(--content-secondary)]">
                      Type
                    </label>
                    <span className="text-sm text-[var(--content-secondary)]">
                      {tokens[selectedToken].type}
                    </span>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[var(--content-secondary)]">
                      Category
                    </label>
                    <span className="text-sm text-[var(--content-secondary)]">
                      {tokens[selectedToken].category}
                    </span>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[var(--content-secondary)]">
                      Theme
                    </label>
                    <span className="text-sm text-[var(--content-secondary)]">
                      {tokens[selectedToken].theme}
                    </span>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[var(--content-secondary)]">
                      Scale
                    </label>
                    <span className="text-sm text-[var(--content-secondary)]">
                      {tokens[selectedToken].scale}
                    </span>
                  </div>
                </div>

                {tokens[selectedToken].set && (
                  <div>
                    <label className="mb-1 block text-xs text-[var(--content-secondary)]">
                      Token Set
                    </label>
                    <span className="text-sm text-[var(--content-secondary)]">
                      {tokens[selectedToken].set}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-auto p-4">
              {tokens[selectedToken]?.references.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--content-secondary)]">
                    References ({tokens[selectedToken].references.length})
                  </h3>
                  <div className="space-y-1">
                    {tokens[selectedToken].references.map(ref => (
                      <button
                        key={ref}
                        onClick={() => tokens[ref] && setSelectedToken(ref)}
                        className={`w-full truncate rounded bg-[color:color-mix(in_srgb,var(--background-secondary)_60%,transparent)] px-2 py-1.5 text-left text-sm hover:bg-[var(--background-tertiary)] ${
                          tokens[ref]
                            ? 'text-[var(--content-blue)]'
                            : 'text-[var(--content-tertiary)]'
                        }`}
                      >
                        → {ref} {!tokens[ref] && '(not found)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tokens[selectedToken]?.referencedBy.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--content-secondary)]">
                    Referenced By ({tokens[selectedToken].referencedBy.length})
                  </h3>
                  <div className="space-y-1">
                    {tokens[selectedToken].referencedBy.map(ref => (
                      <button
                        key={ref}
                        onClick={() => tokens[ref] && setSelectedToken(ref)}
                        className={`w-full truncate rounded bg-[color:color-mix(in_srgb,var(--background-secondary)_60%,transparent)] px-2 py-1.5 text-left text-sm hover:bg-[var(--background-tertiary)] ${
                          tokens[ref]
                            ? 'text-[var(--content-green)]'
                            : 'text-[var(--content-tertiary)]'
                        }`}
                      >
                        ← {ref} {!tokens[ref] && '(not found)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[var(--border-primary)] p-4">
              <button
                onClick={() => handleDelete(selectedToken)}
                className="w-full rounded-lg bg-[var(--background-red)] px-3 py-2 text-sm text-[var(--content-red)] transition hover:bg-[color:color-mix(in_srgb,var(--background-red)_80%,transparent)]"
              >
                Delete Token
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Panel */}
        {showRecommendations && (
          <div className="flex w-80 flex-col overflow-hidden border-l border-[var(--border-primary)] bg-[var(--background-secondary)]">
            <div className="flex items-center justify-between border-b border-[var(--border-primary)] p-4">
              <h2 className="text-sm font-semibold text-[var(--content-primary)]">
                Recommendations
              </h2>
              <button
                onClick={() => setShowRecommendations(false)}
                className="p-1 text-[var(--content-secondary)] hover:text-[var(--content-primary)]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-auto p-4">
              {recommendations.length === 0 ? (
                <div className="py-8 text-center">
                  <span className="text-4xl">✨</span>
                  <p className="mt-2 text-sm text-[var(--content-secondary)]">
                    Your tokens look great!
                  </p>
                </div>
              ) : (
                recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 ${
                      rec.severity === 'error'
                        ? 'border-[var(--border-error)] bg-[var(--background-red)]'
                        : rec.severity === 'warning'
                          ? 'border-[var(--border-warning)] bg-[var(--background-amber)]'
                          : 'border-[var(--border-info)] bg-[var(--background-blue)]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`text-sm ${
                          rec.severity === 'error'
                            ? 'text-[var(--content-red)]'
                            : rec.severity === 'warning'
                              ? 'text-[var(--content-amber)]'
                              : 'text-[var(--content-blue)]'
                        }`}
                      >
                        {rec.severity === 'error' ? '🔴' : rec.severity === 'warning' ? '🟡' : '🔵'}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-[var(--content-primary)]">
                          {rec.title}
                        </h4>
                        <p className="mt-1 text-xs text-[var(--content-secondary)]">
                          {rec.description}
                        </p>
                        {rec.tokenName && tokens[rec.tokenName] && (
                          <button
                            onClick={() => {
                              setSelectedToken(rec.tokenName!)
                              setShowRecommendations(false)
                            }}
                            className="mt-2 text-xs text-[var(--content-blue)] hover:underline"
                          >
                            View token →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleImportTokens}
      />
    </div>
  )
}
