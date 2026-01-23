import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'

// Sample Design Tokens Database
const initialTokens = {
  // Color Tokens
  'color.primary.base': {
    value: '#2563eb',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: ['color.primary.hover', 'color.primary.active'],
    referencedBy: ['button.background', 'link.color'],
  },
  'color.primary.hover': {
    value: '#1d4ed8',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['button.background.hover'],
  },
  'color.primary.active': {
    value: '#1e40af',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['button.background.active'],
  },
  'color.secondary.base': {
    value: '#64748b',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['text.muted', 'border.default'],
  },
  'color.success.base': {
    value: '#22c55e',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['alert.success.bg', 'icon.success'],
  },
  'color.warning.base': {
    value: '#f59e0b',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['alert.warning.bg'],
  },
  'color.error.base': {
    value: '#ef4444',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['alert.error.bg', 'input.error.border'],
  },
  'color.background.page': {
    value: '#ffffff',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['card.background', 'modal.background'],
  },
  'color.background.subtle': {
    value: '#f8fafc',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['table.row.alt', 'sidebar.background'],
  },
  'color.text.primary': {
    value: '#0f172a',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['heading.color', 'body.color'],
  },
  'color.text.secondary': {
    value: '#475569',
    type: 'color',
    category: 'color',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['label.color', 'caption.color'],
  },

  // Dark theme variants
  'color.primary.base.dark': {
    value: '#3b82f6',
    type: 'color',
    category: 'color',
    theme: 'dark',
    scale: 'desktop',
    references: [],
    referencedBy: ['button.background'],
  },
  'color.background.page.dark': {
    value: '#0f172a',
    type: 'color',
    category: 'color',
    theme: 'dark',
    scale: 'desktop',
    references: [],
    referencedBy: ['card.background'],
  },
  'color.text.primary.dark': {
    value: '#f1f5f9',
    type: 'color',
    category: 'color',
    theme: 'dark',
    scale: 'desktop',
    references: [],
    referencedBy: ['heading.color'],
  },

  // Spacing Tokens
  'spacing.xs': {
    value: '4px',
    type: 'dimension',
    category: 'spacing',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['button.padding.x', 'icon.margin'],
  },
  'spacing.sm': {
    value: '8px',
    type: 'dimension',
    category: 'spacing',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['input.padding', 'card.gap'],
  },
  'spacing.md': {
    value: '16px',
    type: 'dimension',
    category: 'spacing',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['section.padding', 'modal.padding'],
  },
  'spacing.lg': {
    value: '24px',
    type: 'dimension',
    category: 'spacing',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['container.padding', 'page.margin'],
  },
  'spacing.xl': {
    value: '32px',
    type: 'dimension',
    category: 'spacing',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['hero.padding'],
  },
  'spacing.2xl': {
    value: '48px',
    type: 'dimension',
    category: 'spacing',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['section.gap'],
  },

  // Mobile scale spacing
  'spacing.md.mobile': {
    value: '12px',
    type: 'dimension',
    category: 'spacing',
    theme: 'all',
    scale: 'mobile',
    references: ['spacing.md'],
    referencedBy: [],
  },
  'spacing.lg.mobile': {
    value: '16px',
    type: 'dimension',
    category: 'spacing',
    theme: 'all',
    scale: 'mobile',
    references: ['spacing.lg'],
    referencedBy: [],
  },

  // Typography Tokens
  'font.family.sans': {
    value: "'Inter', -apple-system, sans-serif",
    type: 'fontFamily',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['body.fontFamily', 'button.fontFamily'],
  },
  'font.family.mono': {
    value: "'JetBrains Mono', monospace",
    type: 'fontFamily',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['code.fontFamily'],
  },
  'font.size.xs': {
    value: '12px',
    type: 'dimension',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['caption.fontSize', 'badge.fontSize'],
  },
  'font.size.sm': {
    value: '14px',
    type: 'dimension',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['body.small.fontSize'],
  },
  'font.size.base': {
    value: '16px',
    type: 'dimension',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['body.fontSize', 'input.fontSize'],
  },
  'font.size.lg': {
    value: '18px',
    type: 'dimension',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['h4.fontSize'],
  },
  'font.size.xl': {
    value: '20px',
    type: 'dimension',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['h3.fontSize'],
  },
  'font.size.2xl': {
    value: '24px',
    type: 'dimension',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['h2.fontSize'],
  },
  'font.size.3xl': {
    value: '30px',
    type: 'dimension',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['h1.fontSize'],
  },
  'font.weight.normal': {
    value: '400',
    type: 'fontWeight',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['body.fontWeight'],
  },
  'font.weight.medium': {
    value: '500',
    type: 'fontWeight',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['button.fontWeight'],
  },
  'font.weight.semibold': {
    value: '600',
    type: 'fontWeight',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['heading.fontWeight'],
  },
  'font.weight.bold': {
    value: '700',
    type: 'fontWeight',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['h1.fontWeight'],
  },
  'line.height.tight': {
    value: '1.25',
    type: 'number',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['heading.lineHeight'],
  },
  'line.height.normal': {
    value: '1.5',
    type: 'number',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['body.lineHeight'],
  },
  'line.height.relaxed': {
    value: '1.75',
    type: 'number',
    category: 'typography',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['paragraph.lineHeight'],
  },

  // Border Tokens
  'border.radius.none': {
    value: '0px',
    type: 'dimension',
    category: 'border',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: [],
  },
  'border.radius.sm': {
    value: '4px',
    type: 'dimension',
    category: 'border',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['input.borderRadius', 'badge.borderRadius'],
  },
  'border.radius.md': {
    value: '6px',
    type: 'dimension',
    category: 'border',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['button.borderRadius', 'card.borderRadius'],
  },
  'border.radius.lg': {
    value: '8px',
    type: 'dimension',
    category: 'border',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['modal.borderRadius'],
  },
  'border.radius.xl': {
    value: '12px',
    type: 'dimension',
    category: 'border',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['panel.borderRadius'],
  },
  'border.radius.full': {
    value: '9999px',
    type: 'dimension',
    category: 'border',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['avatar.borderRadius', 'pill.borderRadius'],
  },
  'border.width.thin': {
    value: '1px',
    type: 'dimension',
    category: 'border',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['input.borderWidth', 'divider.width'],
  },
  'border.width.medium': {
    value: '2px',
    type: 'dimension',
    category: 'border',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['button.borderWidth'],
  },

  // Shadow Tokens
  'shadow.sm': {
    value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    type: 'boxShadow',
    category: 'effect',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['input.shadow', 'button.shadow'],
  },
  'shadow.md': {
    value: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    type: 'boxShadow',
    category: 'effect',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['card.shadow', 'dropdown.shadow'],
  },
  'shadow.lg': {
    value: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    type: 'boxShadow',
    category: 'effect',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['modal.shadow'],
  },
  'shadow.xl': {
    value: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    type: 'boxShadow',
    category: 'effect',
    theme: 'light',
    scale: 'desktop',
    references: [],
    referencedBy: ['popover.shadow'],
  },

  // Animation Tokens
  'animation.duration.fast': {
    value: '150ms',
    type: 'duration',
    category: 'animation',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['button.transition', 'input.transition'],
  },
  'animation.duration.normal': {
    value: '300ms',
    type: 'duration',
    category: 'animation',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['modal.transition', 'dropdown.transition'],
  },
  'animation.duration.slow': {
    value: '500ms',
    type: 'duration',
    category: 'animation',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['page.transition'],
  },
  'animation.easing.default': {
    value: 'cubic-bezier(0.4, 0, 0.2, 1)',
    type: 'cubicBezier',
    category: 'animation',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['all.transition'],
  },
  'animation.easing.in': {
    value: 'cubic-bezier(0.4, 0, 1, 1)',
    type: 'cubicBezier',
    category: 'animation',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['exit.transition'],
  },
  'animation.easing.out': {
    value: 'cubic-bezier(0, 0, 0.2, 1)',
    type: 'cubicBezier',
    category: 'animation',
    theme: 'all',
    scale: 'desktop',
    references: [],
    referencedBy: ['enter.transition'],
  },

  // Component Tokens (semantic)
  'button.background': {
    value: '{color.primary.base}',
    type: 'color',
    category: 'component',
    theme: 'light',
    scale: 'desktop',
    references: ['color.primary.base'],
    referencedBy: [],
  },
  'button.background.hover': {
    value: '{color.primary.hover}',
    type: 'color',
    category: 'component',
    theme: 'light',
    scale: 'desktop',
    references: ['color.primary.hover'],
    referencedBy: [],
  },
  'button.borderRadius': {
    value: '{border.radius.md}',
    type: 'dimension',
    category: 'component',
    theme: 'all',
    scale: 'desktop',
    references: ['border.radius.md'],
    referencedBy: [],
  },
  'card.background': {
    value: '{color.background.page}',
    type: 'color',
    category: 'component',
    theme: 'light',
    scale: 'desktop',
    references: ['color.background.page'],
    referencedBy: [],
  },
  'card.borderRadius': {
    value: '{border.radius.md}',
    type: 'dimension',
    category: 'component',
    theme: 'all',
    scale: 'desktop',
    references: ['border.radius.md'],
    referencedBy: [],
  },
  'card.shadow': {
    value: '{shadow.md}',
    type: 'boxShadow',
    category: 'component',
    theme: 'light',
    scale: 'desktop',
    references: ['shadow.md'],
    referencedBy: [],
  },
  'input.borderRadius': {
    value: '{border.radius.sm}',
    type: 'dimension',
    category: 'component',
    theme: 'all',
    scale: 'desktop',
    references: ['border.radius.sm'],
    referencedBy: [],
  },
  'input.error.border': {
    value: '{color.error.base}',
    type: 'color',
    category: 'component',
    theme: 'light',
    scale: 'desktop',
    references: ['color.error.base'],
    referencedBy: [],
  },
}

// Tokens Studio JSON Parser
const parseTokensStudioJSON = (data, parentPath = '', setName = 'core') => {
  const tokens = {}
  const allTokenRefs = {}

  // Recursive function to flatten nested token structure
  const flattenTokens = (obj, path = '', currentSet = setName) => {
    if (!obj || typeof obj !== 'object') return

    Object.entries(obj).forEach(([key, value]) => {
      // Skip metadata keys
      if (key.startsWith('$')) return

      const newPath = path ? `${path}.${key}` : key

      // Check if this is a token (has value property)
      if (value && typeof value === 'object' && 'value' in value) {
        const tokenValue = value.value
        const tokenType = value.type || value.$type || inferType(tokenValue)
        const description = value.description || value.$description || ''

        // Extract references from value (e.g., {color.primary})
        const references = []
        if (typeof tokenValue === 'string') {
          const refMatches = tokenValue.match(/\{([^}]+)\}/g)
          if (refMatches) {
            refMatches.forEach(match => {
              const refPath = match.slice(1, -1) // Remove { }
              references.push(refPath)
            })
          }
        }

        // Determine category from path or type
        const category = inferCategory(newPath, tokenType)

        // Determine theme from path or set name
        const theme = inferTheme(newPath, currentSet)

        // Determine scale from path
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
          $extensions: value.$extensions || {},
          set: currentSet,
        }

        // Store for building referencedBy
        allTokenRefs[newPath] = references
      } else if (value && typeof value === 'object') {
        // Check if this is a token set (top level in multi-file format)
        if (path === '' && !('value' in value) && !key.startsWith('$')) {
          // This might be a token set name
          flattenTokens(value, '', key)
        } else {
          // Continue recursing into nested groups
          flattenTokens(value, newPath, currentSet)
        }
      }
    })
  }

  // Helper to infer token type
  const inferType = value => {
    if (typeof value !== 'string') return 'other'
    if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) return 'color'
    if (value.match(/^\d+(\.\d+)?(px|rem|em|%)$/)) return 'dimension'
    if (value.match(/^\d+(\.\d+)?$/)) return 'number'
    if (value.match(/^\d+(\.\d+)?ms$/)) return 'duration'
    if (value.includes('cubic-bezier')) return 'cubicBezier'
    if (value.includes('shadow') || value.match(/^\d+\s+\d+/)) return 'boxShadow'
    return 'other'
  }

  // Helper to infer category from path or type
  const inferCategory = (path, type) => {
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
    if (
      pathLower.includes('border') ||
      pathLower.includes('radius') ||
      pathLower.includes('stroke')
    )
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

  // Helper to infer theme from path
  const inferTheme = (path, setName) => {
    const lower = (path + ' ' + setName).toLowerCase()
    if (lower.includes('dark')) return 'dark'
    if (lower.includes('light')) return 'light'
    return 'all'
  }

  // Helper to infer scale from path
  const inferScale = path => {
    const lower = path.toLowerCase()
    if (lower.includes('mobile') || lower.includes('sm') || lower.includes('compact'))
      return 'mobile'
    if (lower.includes('tablet') || lower.includes('md')) return 'tablet'
    return 'desktop'
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

// Naming Convention Rules
const namingRules = [
  {
    id: 'hierarchy',
    name: 'Hierarchical Naming',
    description: 'Use dot notation for hierarchy (category.property.variant)',
    pattern: /^[a-z]+(\.[a-z0-9]+)+$/,
    severity: 'error',
  },
  {
    id: 'lowercase',
    name: 'Lowercase Only',
    description: 'Token names should be lowercase with no spaces',
    pattern: /^[a-z0-9.-]+$/i,
    severity: 'error',
  },
  {
    id: 'no-abbreviations',
    name: 'Avoid Abbreviations',
    description: 'Use full words for clarity (background not bg)',
    exceptions: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'bg'],
    severity: 'warning',
  },
  {
    id: 'semantic',
    name: 'Semantic Names',
    description: 'Prefer semantic names over literal values',
    badPatterns: [/blue|red|green|yellow|#[0-9a-f]+/i],
    severity: 'warning',
  },
]

// Architecture Recommendations
const getArchitectureRecommendations = tokens => {
  const recommendations = []
  const tokenNames = Object.keys(tokens)

  if (tokenNames.length === 0) return recommendations

  // Check for missing semantic layer
  const hasRawColors = tokenNames.some(n => n.startsWith('color.') && !n.includes('semantic'))
  const hasComponentTokens = tokenNames.some(
    n => tokens[n].category === 'component' || n.includes('button') || n.includes('card')
  )
  if (hasRawColors && !hasComponentTokens) {
    recommendations.push({
      type: 'architecture',
      severity: 'info',
      title: 'Add Semantic Layer',
      description:
        'Consider adding component-level tokens that reference your primitive colors for better maintainability.',
    })
  }

  // Check for theme coverage
  const lightTokens = tokenNames.filter(n => tokens[n].theme === 'light')
  const darkTokens = tokenNames.filter(n => tokens[n].theme === 'dark')
  if (lightTokens.length > 0 && darkTokens.length < lightTokens.length * 0.5) {
    recommendations.push({
      type: 'architecture',
      severity: 'warning',
      title: 'Incomplete Dark Theme',
      description: `You have ${lightTokens.length} light tokens but only ${darkTokens.length} dark tokens. Consider adding dark variants.`,
    })
  }

  // Check for mobile scale coverage
  const desktopTokens = tokenNames.filter(n => tokens[n].scale === 'desktop')
  const mobileTokens = tokenNames.filter(n => tokens[n].scale === 'mobile')
  if (desktopTokens.length > 10 && mobileTokens.length < desktopTokens.length * 0.2) {
    recommendations.push({
      type: 'architecture',
      severity: 'info',
      title: 'Limited Mobile Scale',
      description: 'Consider adding more mobile-specific tokens for responsive design.',
    })
  }

  // Check naming conventions (limit to first 10)
  let namingIssues = 0
  tokenNames.forEach(name => {
    if (namingIssues >= 10) return
    namingRules.forEach(rule => {
      if (namingIssues >= 10) return
      if (rule.badPatterns) {
        rule.badPatterns.forEach(bp => {
          if (bp.test(name) && namingIssues < 10) {
            recommendations.push({
              type: 'naming',
              severity: rule.severity,
              title: rule.name,
              description: `Token "${name}" violates: ${rule.description}`,
              tokenName: name,
            })
            namingIssues++
          }
        })
      }
    })
  })

  // Check for orphan tokens (limit to first 5)
  let orphanCount = 0
  tokenNames.forEach(name => {
    if (orphanCount >= 5) return
    const token = tokens[name]
    if (
      token.references.length === 0 &&
      token.referencedBy.length === 0 &&
      token.category !== 'component'
    ) {
      recommendations.push({
        type: 'architecture',
        severity: 'info',
        title: 'Orphan Token',
        description: `Token "${name}" has no connections. Consider removing or connecting it.`,
        tokenName: name,
      })
      orphanCount++
    }
  })

  return recommendations
}

// Color Preview Component
const ColorPreview = ({ value }) => {
  if (!value) return null
  const isColor = value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')
  if (!isColor) return null
  return (
    <div
      className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
      style={{ backgroundColor: value }}
    />
  )
}

// Token Node Component for Graph
const TokenNode = ({
  token,
  name,
  x,
  y,
  isSelected,
  isHighlighted,
  isConnected,
  onClick,
  onDragStart,
}) => {
  const categoryColors = {
    color: '#3b82f6',
    spacing: '#22c55e',
    typography: '#a855f7',
    border: '#f59e0b',
    effect: '#6366f1',
    animation: '#ec4899',
    component: '#14b8a6',
    other: '#64748b',
  }

  const bgColor = categoryColors[token.category] || '#64748b'
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
        stroke={isSelected ? '#fff' : 'transparent'}
        strokeWidth={2}
      />
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
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
          fill={token.value.startsWith('{') ? '#fff' : token.value}
          stroke="#fff"
          strokeWidth={0.5}
        />
      )}
    </g>
  )
}

// Upload Modal Component
const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFile = async file => {
    setError(null)
    setPreview(null)

    if (!file) return

    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file')
      return
    }

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Parse the tokens
      const tokens = parseTokensStudioJSON(data)
      const tokenCount = Object.keys(tokens).length

      if (tokenCount === 0) {
        setError("No tokens found in this file. Make sure it's a valid Tokens Studio export.")
        return
      }

      // Show preview
      const categories = [...new Set(Object.values(tokens).map(t => t.category))]
      const themes = [...new Set(Object.values(tokens).map(t => t.theme))]

      setPreview({
        filename: file.name,
        tokenCount,
        categories,
        themes,
        tokens,
      })
    } catch (err) {
      setError(`Failed to parse JSON: ${err.message}`)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleDragOver = e => {
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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Import Tokens Studio JSON</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Upload a JSON file exported from Tokens Studio for Figma
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                dragOver
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={e => handleFile(e.target.files[0])}
                className="hidden"
              />
              <div className="text-4xl mb-3">📦</div>
              <p className="text-white font-medium">Drop your tokens.json file here</p>
              <p className="text-slate-400 text-sm mt-1">or click to browse</p>
              <p className="text-slate-500 text-xs mt-4">
                Supports Tokens Studio for Figma export format
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">✅</div>
                  <div>
                    <p className="text-white font-medium">{preview.filename}</p>
                    <p className="text-slate-400 text-sm">{preview.tokenCount} tokens found</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {preview.categories.map(cat => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 bg-slate-600 rounded text-xs text-slate-200"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Themes</p>
                  <div className="flex flex-wrap gap-1">
                    {preview.themes.map(theme => (
                      <span
                        key={theme}
                        className="px-2 py-0.5 bg-slate-600 rounded text-xs text-slate-200"
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
                className="text-sm text-slate-400 hover:text-white"
              >
                ← Choose different file
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmUpload}
            disabled={!preview}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              preview
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Import {preview ? preview.tokenCount : ''} Tokens
          </button>
        </div>
      </div>
    </div>
  )
}

// Main App Component
export default function DesignTokensVisualizer() {
  const [tokens, setTokens] = useState(initialTokens)
  const [selectedToken, setSelectedToken] = useState(null)
  const [expandedTokens, setExpandedTokens] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [themeFilter, setThemeFilter] = useState('all')
  const [scaleFilter, setScaleFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState('graph')
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingToken, setEditingToken] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [nodePositions, setNodePositions] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [importSource, setImportSource] = useState('sample')
  const svgRef = useRef(null)

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

  // Initialize node positions when tokens change
  useEffect(() => {
    const positions = {}
    const categories = [...new Set(Object.values(tokens).map(t => t.category))]
    const categoryAngles = {}
    categories.forEach((cat, i) => {
      categoryAngles[cat] = (i / categories.length) * Math.PI * 2
    })

    const tokensByCategory = {}
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
    setNodePositions(positions)
  }, [tokens])

  // Handle imported tokens
  const handleImportTokens = useCallback(importedTokens => {
    setTokens(importedTokens)
    setImportSource('imported')
    setSelectedToken(null)
    setSearchQuery('')
    setThemeFilter('all')
    setScaleFilter('all')
    setCategoryFilter('all')
  }, [])

  // Get connected tokens
  const getConnectedTokens = useCallback(
    tokenName => {
      const token = tokens[tokenName]
      if (!token) return new Set()
      const connected = new Set()
      token.references.forEach(ref => connected.add(ref))
      token.referencedBy.forEach(ref => connected.add(ref))
      return connected
    },
    [tokens]
  )

  // Toggle token expansion
  const toggleExpand = useCallback(tokenName => {
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
    tokenName => {
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
  const handleDelete = useCallback(tokenName => {
    if (confirm(`Delete token "${tokenName}"?`)) {
      setTokens(prev => {
        const next = { ...prev }
        delete next[tokenName]
        // Clean up references
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
    format => {
      let content = ''
      let filename = ''

      if (format === 'css') {
        content = ':root {\n'
        Object.entries(tokens).forEach(([name, token]) => {
          const cssName = name.replace(/\./g, '-')
          content += `  --${cssName}: ${token.value};\n`
        })
        content += '}\n'
        filename = 'tokens.css'
      } else if (format === 'json') {
        // Export in Tokens Studio compatible format
        const exportData = {}
        Object.entries(tokens).forEach(([name, token]) => {
          const parts = name.split('.')
          let current = exportData
          parts.forEach((part, index) => {
            if (index === parts.length - 1) {
              current[part] = {
                value: token.value,
                type: token.type,
                description: token.description || '',
              }
            } else {
              current[part] = current[part] || {}
              current = current[part]
            }
          })
        })
        content = JSON.stringify(exportData, null, 2)
        filename = 'tokens.json'
      } else if (format === 'js') {
        content =
          'export const tokens = ' +
          JSON.stringify(
            Object.fromEntries(Object.entries(tokens).map(([k, v]) => [k, v.value])),
            null,
            2
          ) +
          ';\n'
        filename = 'tokens.js'
      }

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },
    [tokens]
  )

  // Handle mouse events for dragging
  const handleMouseMove = useCallback(
    e => {
      if (!isDragging || !draggedNode || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / zoom
      const y = (e.clientY - rect.top - pan.y) / zoom
      setNodePositions(prev => ({
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

  const connectedTokens = selectedToken ? getConnectedTokens(selectedToken) : new Set()

  // Categories for filter
  const categories = [...new Set(Object.values(tokens).map(t => t.category))]
  const themes = [...new Set(Object.values(tokens).map(t => t.theme))]

  return (
    <div
      className="h-screen w-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">Design Tokens Visualizer</h1>
          <div className="flex gap-1 bg-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-md text-sm transition ${viewMode === 'graph' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Graph
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm transition ${viewMode === 'list' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              List
            </button>
          </div>
          {importSource === 'imported' && (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
              Imported
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 rounded-md text-sm flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition ${showRecommendations ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
          >
            <span>💡</span>
            Recommendations
            {recommendations.length > 0 && (
              <span className="bg-amber-500 text-white text-xs px-1.5 rounded-full">
                {recommendations.length}
              </span>
            )}
          </button>

          <div className="flex gap-1">
            <button
              onClick={() => exportTokens('css')}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-sm text-slate-300 transition"
            >
              CSS
            </button>
            <button
              onClick={() => exportTokens('json')}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-sm text-slate-300 transition"
            >
              JSON
            </button>
            <button
              onClick={() => exportTokens('js')}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-sm text-slate-300 transition"
            >
              JS
            </button>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-4 py-2 flex items-center gap-4 flex-shrink-0">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search tokens by name or value..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"
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
          <span className="text-sm text-slate-400">Theme:</span>
          <select
            value={themeFilter}
            onChange={e => setThemeFilter(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
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
          <span className="text-sm text-slate-400">Scale:</span>
          <select
            value={scaleFilter}
            onChange={e => setScaleFilter(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-slate-400 ml-auto">
          {filteredTokens.length} of {Object.keys(tokens).length} tokens
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph/List View */}
        <div className="flex-1 relative">
          {viewMode === 'graph' ? (
            <svg
              ref={svgRef}
              className="w-full h-full"
              style={{ background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}
            >
              {/* Grid pattern */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#334155"
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
                        stroke={isHighlighted ? '#60a5fa' : '#475569'}
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
                <rect x={0} y={0} width={140} height={220} rx={8} fill="#1e293b" stroke="#334155" />
                <text x={12} y={24} fill="#94a3b8" fontSize={11} fontWeight={600}>
                  Categories
                </text>
                {[
                  { name: 'Color', color: '#3b82f6' },
                  { name: 'Spacing', color: '#22c55e' },
                  { name: 'Typography', color: '#a855f7' },
                  { name: 'Border', color: '#f59e0b' },
                  { name: 'Effect', color: '#6366f1' },
                  { name: 'Animation', color: '#ec4899' },
                  { name: 'Component', color: '#14b8a6' },
                  { name: 'Other', color: '#64748b' },
                ].map((cat, i) => (
                  <g key={cat.name} transform={`translate(12, ${44 + i * 22})`}>
                    <rect x={0} y={0} width={12} height={12} rx={3} fill={cat.color} />
                    <text x={20} y={10} fill="#cbd5e1" fontSize={11}>
                      {cat.name}
                    </text>
                  </g>
                ))}
              </g>

              {/* Zoom controls */}
              <g transform="translate(20, 260)">
                <rect x={0} y={0} width={40} height={80} rx={8} fill="#1e293b" stroke="#334155" />
                <g
                  transform="translate(8, 8)"
                  onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                  style={{ cursor: 'pointer' }}
                >
                  <rect width={24} height={24} rx={4} fill="#334155" />
                  <text x={12} y={16} textAnchor="middle" fill="#fff" fontSize={16}>
                    +
                  </text>
                </g>
                <g
                  transform="translate(8, 48)"
                  onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
                  style={{ cursor: 'pointer' }}
                >
                  <rect width={24} height={24} rx={4} fill="#334155" />
                  <text x={12} y={16} textAnchor="middle" fill="#fff" fontSize={16}>
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
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedToken === name
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ColorPreview value={token.value} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{name}</div>
                        <div className="text-xs text-slate-400 truncate">{token.value}</div>
                      </div>
                      <div className="flex gap-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            token.category === 'color'
                              ? 'bg-blue-500/20 text-blue-400'
                              : token.category === 'spacing'
                                ? 'bg-green-500/20 text-green-400'
                                : token.category === 'typography'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : token.category === 'border'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : token.category === 'effect'
                                      ? 'bg-indigo-500/20 text-indigo-400'
                                      : token.category === 'animation'
                                        ? 'bg-pink-500/20 text-pink-400'
                                        : token.category === 'component'
                                          ? 'bg-teal-500/20 text-teal-400'
                                          : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {token.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">
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
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-white truncate">{selectedToken}</h2>
                <button
                  onClick={() => setSelectedToken(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <label className="text-xs text-slate-400 block mb-1">Value</label>
                  {editingToken === selectedToken ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={saveEdit}
                        className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm text-white"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ColorPreview value={tokens[selectedToken].value} />
                      <code className="flex-1 text-sm text-slate-300 bg-slate-700/50 px-2 py-1 rounded truncate">
                        {tokens[selectedToken].value}
                      </code>
                      <button
                        onClick={() => handleEdit(selectedToken)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <svg
                          className="w-4 h-4"
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
                    <label className="text-xs text-slate-400 block mb-1">Description</label>
                    <p className="text-sm text-slate-300">{tokens[selectedToken].description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Type</label>
                    <span className="text-sm text-slate-300">{tokens[selectedToken].type}</span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Category</label>
                    <span className="text-sm text-slate-300">{tokens[selectedToken].category}</span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Theme</label>
                    <span className="text-sm text-slate-300">{tokens[selectedToken].theme}</span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Scale</label>
                    <span className="text-sm text-slate-300">{tokens[selectedToken].scale}</span>
                  </div>
                </div>

                {tokens[selectedToken].set && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Token Set</label>
                    <span className="text-sm text-slate-300">{tokens[selectedToken].set}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {tokens[selectedToken]?.references.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    References ({tokens[selectedToken].references.length})
                  </h3>
                  <div className="space-y-1">
                    {tokens[selectedToken].references.map(ref => (
                      <button
                        key={ref}
                        onClick={() => tokens[ref] && setSelectedToken(ref)}
                        className={`w-full text-left px-2 py-1.5 rounded bg-slate-700/50 hover:bg-slate-700 text-sm truncate ${
                          tokens[ref] ? 'text-blue-400' : 'text-slate-500'
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
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Referenced By ({tokens[selectedToken].referencedBy.length})
                  </h3>
                  <div className="space-y-1">
                    {tokens[selectedToken].referencedBy.map(ref => (
                      <button
                        key={ref}
                        onClick={() => tokens[ref] && setSelectedToken(ref)}
                        className={`w-full text-left px-2 py-1.5 rounded bg-slate-700/50 hover:bg-slate-700 text-sm truncate ${
                          tokens[ref] ? 'text-green-400' : 'text-slate-500'
                        }`}
                      >
                        ← {ref} {!tokens[ref] && '(not found)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700">
              <button
                onClick={() => handleDelete(selectedToken)}
                className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition"
              >
                Delete Token
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Panel */}
        {showRecommendations && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Recommendations</h2>
              <button
                onClick={() => setShowRecommendations(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">✨</span>
                  <p className="text-sm text-slate-400 mt-2">Your tokens look great!</p>
                </div>
              ) : (
                recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      rec.severity === 'error'
                        ? 'bg-red-500/10 border-red-500/30'
                        : rec.severity === 'warning'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`text-sm ${
                          rec.severity === 'error'
                            ? 'text-red-400'
                            : rec.severity === 'warning'
                              ? 'text-amber-400'
                              : 'text-blue-400'
                        }`}
                      >
                        {rec.severity === 'error' ? '🔴' : rec.severity === 'warning' ? '🟡' : '🔵'}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-white">{rec.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{rec.description}</p>
                        {rec.tokenName && tokens[rec.tokenName] && (
                          <button
                            onClick={() => {
                              setSelectedToken(rec.tokenName)
                              setShowRecommendations(false)
                            }}
                            className="text-xs text-blue-400 hover:underline mt-2"
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
