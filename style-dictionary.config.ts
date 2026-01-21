/**
 * Style Dictionary Configuration
 * Transforms Figma tokens JSON into TypeScript and CSS outputs
 */

import StyleDictionary from 'style-dictionary'
import type { Config, TransformedToken, Format, Transform } from 'style-dictionary/types'
import * as fs from 'fs'
import * as path from 'path'

const TOKENS_INPUT = './tokens/figma-tokens.json'
const OUTPUT_DIR = './src/tokens'

// Check if tokens file exists
function checkTokensExist(): boolean {
  return fs.existsSync(path.resolve(TOKENS_INPUT))
}

/**
 * Custom transform: Convert token name to camelCase for TypeScript
 */
const transformNameCamelCase: Transform = {
  name: 'name/camel',
  type: 'name',
  transform: (token: TransformedToken): string => {
    return token.path
      .map((part, index) => {
        if (index === 0) return part.toLowerCase()
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      })
      .join('')
  },
}

/**
 * Custom transform: Convert token name to CSS variable format
 */
const transformNameKebab: Transform = {
  name: 'name/kebab',
  type: 'name',
  transform: (token: TransformedToken): string => {
    return token.path
      .map(part => part.toLowerCase().replace(/\s+/g, '-'))
      .join('-')
  },
}

/**
 * Custom format: TypeScript colors module
 */
const formatTypeScriptColors: Format = {
  name: 'typescript/colors',
  format: ({ dictionary }) => {
    const primitives: Record<string, any> = {}
    const semantic: Record<string, any> = {}

    dictionary.allTokens.forEach(token => {
      const category = token.path[0]
      const isColor = token.$type === 'color' || token.type === 'color'
      
      if (!isColor) return

      if (category === 'primitives' || token.filePath?.includes('primitives')) {
        let current = primitives
        const tokenPath = token.path.slice(1) // Remove 'primitives' prefix
        
        for (let i = 0; i < tokenPath.length - 1; i++) {
          const key = tokenPath[i]
          if (!current[key]) current[key] = {}
          current = current[key]
        }
        current[tokenPath[tokenPath.length - 1]] = token.value
      } else {
        let current = semantic
        const tokenPath = token.path
        
        for (let i = 0; i < tokenPath.length - 1; i++) {
          const key = tokenPath[i]
          if (!current[key]) current[key] = {}
          current = current[key]
        }
        current[tokenPath[tokenPath.length - 1]] = token.value
      }
    })

    return `/**
 * Color tokens - Auto-generated from Figma
 * DO NOT EDIT DIRECTLY - Run \`npm run sync-tokens\` to update
 * Generated: ${new Date().toISOString()}
 */

export const primitiveColors = ${JSON.stringify(primitives, null, 2)} as const

export const semanticColors = {
  light: ${JSON.stringify(semantic.light || {}, null, 2)},
  dark: ${JSON.stringify(semantic.dark || {}, null, 2)},
} as const

export type PrimitiveColorKey = keyof typeof primitiveColors
export type SemanticColorKey = keyof typeof semanticColors.light
`
  },
}

/**
 * Custom format: TypeScript typography module
 */
const formatTypeScriptTypography: Format = {
  name: 'typescript/typography',
  format: ({ dictionary }) => {
    const typography: Record<string, any> = {}

    dictionary.allTokens.forEach(token => {
      const isTypography = token.path.some(p => 
        ['font', 'typography', 'text', 'lineHeight', 'letterSpacing', 'fontSize', 'fontWeight', 'fontFamily'].includes(p.toLowerCase())
      )
      
      if (!isTypography) return

      let current = typography
      for (let i = 0; i < token.path.length - 1; i++) {
        const key = token.path[i]
        if (!current[key]) current[key] = {}
        current = current[key]
      }
      current[token.path[token.path.length - 1]] = token.value
    })

    return `/**
 * Typography tokens - Auto-generated from Figma
 * DO NOT EDIT DIRECTLY - Run \`npm run sync-tokens\` to update
 * Generated: ${new Date().toISOString()}
 */

export const typography = ${JSON.stringify(typography, null, 2)} as const

export const fontFamily = {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
} as const

export type TypographyKey = keyof typeof typography
`
  },
}

/**
 * Custom format: TypeScript spacing module
 */
const formatTypeScriptSpacing: Format = {
  name: 'typescript/spacing',
  format: ({ dictionary }) => {
    const spacing: Record<string, any> = {}
    const borderRadius: Record<string, any> = {}

    dictionary.allTokens.forEach(token => {
      const isSpacing = token.path.some(p => 
        ['spacing', 'space', 'gap', 'padding', 'margin'].includes(p.toLowerCase())
      )
      const isRadius = token.path.some(p => 
        ['radius', 'borderRadius', 'rounded'].includes(p.toLowerCase())
      )
      
      if (isSpacing) {
        const key = token.path[token.path.length - 1]
        spacing[key] = token.value
      } else if (isRadius) {
        const key = token.path[token.path.length - 1]
        borderRadius[key] = token.value
      }
    })

    return `/**
 * Spacing tokens - Auto-generated from Figma
 * DO NOT EDIT DIRECTLY - Run \`npm run sync-tokens\` to update
 * Generated: ${new Date().toISOString()}
 */

export const spacing = ${JSON.stringify(spacing, null, 2)} as const

export const borderRadius = ${JSON.stringify(borderRadius, null, 2)} as const

export type SpacingKey = keyof typeof spacing
export type BorderRadiusKey = keyof typeof borderRadius
`
  },
}

/**
 * Custom format: TypeScript shadows module
 */
const formatTypeScriptShadows: Format = {
  name: 'typescript/shadows',
  format: ({ dictionary }) => {
    const shadows: Record<string, any> = {}

    dictionary.allTokens.forEach(token => {
      const isShadow = token.path.some(p => 
        ['shadow', 'elevation', 'boxShadow'].includes(p.toLowerCase())
      )
      
      if (!isShadow) return

      const key = token.path[token.path.length - 1]
      shadows[key] = token.value
    })

    return `/**
 * Shadow tokens - Auto-generated from Figma
 * DO NOT EDIT DIRECTLY - Run \`npm run sync-tokens\` to update
 * Generated: ${new Date().toISOString()}
 */

export const shadows = ${JSON.stringify(shadows, null, 2)} as const

export type ShadowKey = keyof typeof shadows
`
  },
}

/**
 * Custom format: CSS theme variables for Tailwind v4
 */
const formatCssTheme: Format = {
  name: 'css/tailwind-theme',
  format: ({ dictionary }) => {
    let primitiveVars = ''
    let lightVars = ''
    let darkVars = ''

    dictionary.allTokens.forEach(token => {
      const cssName = token.path.map(p => p.toLowerCase().replace(/\s+/g, '-')).join('-')
      const value = token.value

      // Skip non-primitive values that are aliases (contain references)
      if (typeof value === 'string' && value.startsWith('{')) {
        return
      }

      const category = token.path[0]?.toLowerCase()
      
      if (category === 'primitives' || token.filePath?.includes('primitives')) {
        primitiveVars += `  --${cssName.replace('primitives-', '')}: ${value};\n`
      } else if (category === 'light' || token.filePath?.includes('light')) {
        lightVars += `  --${cssName.replace('light-', '')}: ${value};\n`
      } else if (category === 'dark' || token.filePath?.includes('dark')) {
        darkVars += `  --${cssName.replace('dark-', '')}: ${value};\n`
      } else {
        primitiveVars += `  --${cssName}: ${value};\n`
      }
    })

    return `/**
 * CSS Theme Variables - Auto-generated from Figma
 * DO NOT EDIT DIRECTLY - Run \`npm run sync-tokens\` to update
 * Generated: ${new Date().toISOString()}
 * 
 * Compatible with Tailwind CSS v4 @theme directive
 */

@theme {
  /* Primitive Tokens */
${primitiveVars}
}

/* Light Mode (default) */
:root {
${lightVars || '  /* No light mode tokens defined */'}
}

/* Dark Mode */
.dark {
${darkVars || '  /* No dark mode tokens defined */'}
}
`
  },
}

/**
 * Custom format: TypeScript barrel export
 */
const formatTypeScriptIndex: Format = {
  name: 'typescript/index',
  format: () => {
    return `/**
 * Catalyst UI Design System - Design Tokens
 * Auto-generated from Figma - DO NOT EDIT DIRECTLY
 * Run \`npm run sync-tokens\` to update
 * Generated: ${new Date().toISOString()}
 */

export * from './colors'
export * from './typography'
export * from './spacing'
export * from './shadows'
`
  },
}

// Register custom transforms and formats
StyleDictionary.registerTransform(transformNameCamelCase)
StyleDictionary.registerTransform(transformNameKebab)
StyleDictionary.registerFormat(formatTypeScriptColors)
StyleDictionary.registerFormat(formatTypeScriptTypography)
StyleDictionary.registerFormat(formatTypeScriptSpacing)
StyleDictionary.registerFormat(formatTypeScriptShadows)
StyleDictionary.registerFormat(formatCssTheme)
StyleDictionary.registerFormat(formatTypeScriptIndex)

/**
 * Style Dictionary configuration
 */
const config: Config = {
  source: [TOKENS_INPUT],
  platforms: {
    typescript: {
      transformGroup: 'js',
      buildPath: `${OUTPUT_DIR}/`,
      files: [
        {
          destination: 'colors.ts',
          format: 'typescript/colors',
        },
        {
          destination: 'typography.ts',
          format: 'typescript/typography',
        },
        {
          destination: 'spacing.ts',
          format: 'typescript/spacing',
        },
        {
          destination: 'shadows.ts',
          format: 'typescript/shadows',
        },
        {
          destination: 'index.ts',
          format: 'typescript/index',
        },
      ],
    },
    css: {
      transformGroup: 'css',
      buildPath: `${OUTPUT_DIR}/`,
      files: [
        {
          destination: 'theme.css',
          format: 'css/tailwind-theme',
        },
      ],
    },
  },
}

/**
 * Build tokens using Style Dictionary
 */
async function buildTokens(): Promise<void> {
  if (!checkTokensExist()) {
    console.error('Error: tokens/figma-tokens.json not found')
    console.error('Run `npm run sync-figma` first to fetch tokens from Figma')
    process.exit(1)
  }

  const sd = new StyleDictionary(config)
  await sd.buildAllPlatforms()
}

// Run if executed directly
if (process.argv[1]?.includes('style-dictionary.config')) {
  buildTokens()
    .then(() => console.log('✓ Style Dictionary build complete'))
    .catch(console.error)
}

export { config, buildTokens }
