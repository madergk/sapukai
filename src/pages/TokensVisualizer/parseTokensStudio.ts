import type {
  TokensMap,
  TokenType,
  TokenCategory,
  TokenTheme,
  TokenScale,
  TokensStudioJSON,
} from './types'

// Helper to infer token type from value
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

// Helper to infer category from path or type
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

  // Fallback to type-based inference
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

// Helper to infer theme from path or set name
const inferTheme = (path: string, setName: string): TokenTheme => {
  const lower = (path + ' ' + setName).toLowerCase()
  if (lower.includes('dark')) return 'dark'
  if (lower.includes('light')) return 'light'
  return 'all'
}

// Helper to infer scale from path
const inferScale = (path: string): TokenScale => {
  const lower = path.toLowerCase()
  if (lower.includes('mobile') || lower.includes('compact')) return 'mobile'
  if (lower.includes('tablet')) return 'tablet'
  return 'desktop'
}

/**
 * Parse Tokens Studio JSON export format into a flat tokens map
 */
export function parseTokensStudioJSON(data: TokensStudioJSON, setName = 'core'): TokensMap {
  const tokens: TokensMap = {}
  const allTokenRefs: Record<string, string[]> = {}

  // Recursive function to flatten nested token structure
  const flattenTokens = (obj: TokensStudioJSON, path = '', currentSet = setName): void => {
    if (!obj || typeof obj !== 'object') return

    Object.entries(obj).forEach(([key, value]) => {
      // Skip metadata keys
      if (key.startsWith('$')) return

      const newPath = path ? `${path}.${key}` : key

      // Check if this is a token (has value property)
      if (value && typeof value === 'object' && 'value' in value) {
        const tokenValue = value.value
        const tokenType = (value.type || value.$type || inferType(tokenValue)) as TokenType
        const description = (value.description || value.$description || '') as string

        // Extract references from value (e.g., {color.primary})
        const references: string[] = []
        if (typeof tokenValue === 'string') {
          const refMatches = tokenValue.match(/\{([^}]+)\}/g)
          if (refMatches) {
            refMatches.forEach(match => {
              const refPath = match.slice(1, -1) // Remove { }
              references.push(refPath)
            })
          }
        }

        // Determine category, theme, and scale
        const category = inferCategory(newPath, tokenType)
        const theme = inferTheme(newPath, currentSet)
        const scale = inferScale(newPath)

        tokens[newPath] = {
          value: typeof tokenValue === 'object' ? JSON.stringify(tokenValue) : String(tokenValue),
          type: tokenType,
          category,
          theme,
          scale,
          description,
          references,
          referencedBy: [],
          $extensions: (value.$extensions as Record<string, unknown>) || {},
          set: currentSet,
          sourceFormat: 'tokensStudio',
        }

        // Store for building referencedBy
        allTokenRefs[newPath] = references
      } else if (value && typeof value === 'object') {
        // Check if this is a token set (top level in multi-file format)
        if (path === '' && !('value' in value) && !key.startsWith('$')) {
          // This might be a token set name
          flattenTokens(value as TokensStudioJSON, '', key)
        } else {
          // Continue recursing into nested groups
          flattenTokens(value as TokensStudioJSON, newPath, currentSet)
        }
      }
    })
  }

  // Parse the input data
  flattenTokens(data)

  // Build referencedBy relationships
  Object.entries(allTokenRefs).forEach(([tokenName, refs]) => {
    refs.forEach(refPath => {
      if (tokens[refPath]) {
        if (!tokens[refPath].referencedBy.includes(tokenName)) {
          tokens[refPath].referencedBy.push(tokenName)
        }
      }
    })
  })

  return tokens
}
