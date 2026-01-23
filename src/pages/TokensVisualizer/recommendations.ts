import type { TokensMap, NamingRule, Recommendation } from './types'

// Naming Convention Rules
export const namingRules: NamingRule[] = [
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

/**
 * Analyze tokens and return architecture/naming recommendations
 */
export function getArchitectureRecommendations(tokens: TokensMap): Recommendation[] {
  const recommendations: Recommendation[] = []
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
  for (const name of tokenNames) {
    if (namingIssues >= 10) break
    for (const rule of namingRules) {
      if (namingIssues >= 10) break
      if (rule.badPatterns) {
        for (const bp of rule.badPatterns) {
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
        }
      }
    }
  }

  // Check for orphan tokens (limit to first 5)
  let orphanCount = 0
  for (const name of tokenNames) {
    if (orphanCount >= 5) break
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
  }

  return recommendations
}
