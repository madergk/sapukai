import type { Token, TokensMap, TokenType, TokenCategory, TokenTheme, TokenScale } from './types'

const stripComments = (content: string): string =>
  content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const inferType = (value: unknown): TokenType => {
  if (typeof value !== 'string') return 'other'
  if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) return 'color'
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) return 'dimension'
  if (/^\d+(\.\d+)?$/.test(value)) return 'number'
  if (/^\d+(\.\d+)?ms$/.test(value)) return 'duration'
  if (value.includes('cubic-bezier')) return 'cubicBezier'
  if (value.includes('shadow') || /^\d+\s+\d+/.test(value)) return 'boxShadow'
  return 'other'
}

const inferCategory = (path: string, type: TokenType): TokenCategory => {
  const pathLower = path.toLowerCase()
  if (
    pathLower.includes('color') ||
    pathLower.includes('bg') ||
    pathLower.includes('fill') ||
    pathLower.includes('stroke')
  )
    return 'color'
  if (
    pathLower.includes('spacing') ||
    pathLower.includes('space') ||
    pathLower.includes('gap') ||
    pathLower.includes('padding') ||
    pathLower.includes('margin')
  )
    return 'spacing'
  if (
    pathLower.includes('font') ||
    pathLower.includes('text') ||
    pathLower.includes('typography') ||
    pathLower.includes('line')
  )
    return 'typography'
  if (pathLower.includes('border') || pathLower.includes('radius') || pathLower.includes('stroke'))
    return 'border'
  if (
    pathLower.includes('shadow') ||
    pathLower.includes('blur') ||
    pathLower.includes('opacity') ||
    pathLower.includes('effect')
  )
    return 'effect'
  if (
    pathLower.includes('animation') ||
    pathLower.includes('duration') ||
    pathLower.includes('ease') ||
    pathLower.includes('transition')
  )
    return 'animation'
  if (
    pathLower.includes('component') ||
    pathLower.includes('button') ||
    pathLower.includes('input') ||
    pathLower.includes('card')
  )
    return 'component'

  if (type === 'color') return 'color'
  if (type === 'dimension') return 'spacing'
  if (
    type === 'fontFamily' ||
    type === 'fontWeight' ||
    type === 'fontSize' ||
    type === 'lineHeight'
  )
    return 'typography'
  if (type === 'boxShadow') return 'effect'
  if (type === 'duration' || type === 'cubicBezier') return 'animation'

  return 'other'
}

const inferTheme = (path: string, setName: string): TokenTheme => {
  const lower = (path + ' ' + setName).toLowerCase()
  if (lower.includes('dark')) return 'dark'
  if (lower.includes('light')) return 'light'
  return 'all'
}

const inferScale = (path: string): TokenScale => {
  const lower = path.toLowerCase()
  if (lower.includes('mobile') || lower.includes('compact')) return 'mobile'
  if (lower.includes('tablet')) return 'tablet'
  return 'desktop'
}

const normalizeName = (rawName: string): string => {
  const cleaned = rawName.replace(/^--/, '').replace(/^\$/, '')
  return cleaned.replace(/\//g, '.').replace(/_/g, '-').split('-').filter(Boolean).join('.')
}

const extractReferences = (value: string, format: 'css' | 'scss'): string[] => {
  const refs: string[] = []
  if (format === 'css') {
    const matches = value.match(/var\(--([A-Za-z0-9-_]+)\)/g)
    if (matches) {
      matches.forEach(match => {
        const raw = match.slice('var(--'.length, -1)
        refs.push(normalizeName(raw))
      })
    }
  } else {
    const matches = value.match(/\$[A-Za-z0-9-_]+/g)
    if (matches) {
      matches.forEach(match => {
        refs.push(normalizeName(match))
      })
    }
  }
  return refs
}

const buildReferencedBy = (tokens: TokensMap, refsMap: Record<string, string[]>): void => {
  Object.entries(refsMap).forEach(([tokenName, refs]) => {
    refs.forEach(refPath => {
      if (tokens[refPath]) {
        if (!tokens[refPath].referencedBy.includes(tokenName)) {
          tokens[refPath].referencedBy.push(tokenName)
        }
      }
    })
  })
}

export function parseCssScss(content: string, format: 'css' | 'scss', setName = 'core'): TokensMap {
  const tokens: TokensMap = {}
  const allTokenRefs: Record<string, string[]> = {}
  const sanitized = stripComments(content)

  const regex =
    format === 'css' ? /--([A-Za-z0-9-_]+)\s*:\s*([^;]+);/g : /\$([A-Za-z0-9-_]+)\s*:\s*([^;]+);/g

  let match: RegExpExecArray | null
  while ((match = regex.exec(sanitized)) !== null) {
    const rawName = match[1]
    const rawValue = match[2].trim()
    const name = normalizeName(rawName)
    const type = inferType(rawValue)
    const category = inferCategory(name, type)
    const theme = inferTheme(name, setName)
    const scale = inferScale(name)
    const references = extractReferences(rawValue, format)

    const token: Token = {
      value: rawValue,
      type,
      category,
      theme,
      scale,
      references,
      referencedBy: [],
      set: setName,
      sourceFormat: format,
    }

    tokens[name] = token
    allTokenRefs[name] = references
  }

  buildReferencedBy(tokens, allTokenRefs)
  return tokens
}
