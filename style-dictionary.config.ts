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
    return token.path.map(part => part.toLowerCase().replace(/\s+/g, '-')).join('-')
  },
}

/**
 * Custom format: TypeScript colors module
 */
const formatTypeScriptColors: Format = {
  name: 'typescript/colors',
  format: ({ dictionary }) => {
    const primitives: Record<string, any> = {}
    const semantic: Record<string, any> = { light: {}, dark: {} }

    dictionary.allTokens.forEach(token => {
      // Style Dictionary v4 stores resolved value in $value
      const tokenValue = token.$value ?? token.value

      // Only process leaf tokens with actual values
      if (tokenValue === undefined || tokenValue === null) return
      if (typeof tokenValue === 'object') return

      // Path can be array or string, normalize to array
      const pathArray = Array.isArray(token.path) ? token.path : token.path.split('.')
      const category = pathArray[0]

      const originalToken = token.original || {}
      const isColor =
        originalToken.$type === 'color' ||
        token.$type === 'color' ||
        (typeof tokenValue === 'string' && tokenValue.startsWith('#'))

      if (!isColor) return

      if (category === 'primitives') {
        // Handle primitives.colors.zinc.500 etc
        if (pathArray[1] === 'colors') {
          let current = primitives
          const tokenPath = pathArray.slice(2) // Remove 'primitives.colors' prefix

          for (let i = 0; i < tokenPath.length - 1; i++) {
            const key = tokenPath[i]
            if (!current[key]) current[key] = {}
            current = current[key]
          }
          current[tokenPath[tokenPath.length - 1]] = tokenValue
        }
      } else if (category === 'semantic') {
        // Handle semantic.light.content.primary etc
        const mode = pathArray[1] // 'light' or 'dark'
        if (mode === 'light' || mode === 'dark') {
          let current = semantic[mode]
          const tokenPath = pathArray.slice(2) // Remove 'semantic.light' or 'semantic.dark'

          for (let i = 0; i < tokenPath.length - 1; i++) {
            const key = tokenPath[i]
            if (!current[key]) current[key] = {}
            current = current[key]
          }
          current[tokenPath[tokenPath.length - 1]] = tokenValue
        }
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
        [
          'font',
          'typography',
          'text',
          'lineHeight',
          'letterSpacing',
          'fontSize',
          'fontWeight',
          'fontFamily',
        ].includes(p.toLowerCase())
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
    const screens: Record<string, any> = {}

    dictionary.allTokens.forEach(token => {
      const tokenValue = token.$value ?? token.value

      // Only process leaf tokens
      if (tokenValue === undefined || tokenValue === null) return
      if (typeof tokenValue === 'object') return

      // Path can be array or string
      const pathArray = Array.isArray(token.path) ? token.path : token.path.split('.')
      const category = pathArray[0]

      if (category !== 'primitives') return

      const subcategory = pathArray[1]
      const key = pathArray[pathArray.length - 1]

      if (subcategory === 'spacing') {
        spacing[key] = tokenValue
      } else if (subcategory === 'borderRadius') {
        borderRadius[key] = tokenValue
      } else if (subcategory === 'screens') {
        screens[key] = tokenValue
      }
    })

    return `/**
 * Spacing tokens - Auto-generated from Figma
 * DO NOT EDIT DIRECTLY - Run \`npm run sync-tokens\` to update
 * Generated: ${new Date().toISOString()}
 */

export const spacing = ${JSON.stringify(spacing, null, 2)} as const

export const borderRadius = ${JSON.stringify(borderRadius, null, 2)} as const

export const screens = ${JSON.stringify(screens, null, 2)} as const

export type SpacingKey = keyof typeof spacing
export type BorderRadiusKey = keyof typeof borderRadius
export type ScreenKey = keyof typeof screens
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
      const value = token.$value ?? token.value

      // Only process leaf tokens
      if (value === undefined || value === null) return
      if (typeof value === 'object') return

      // Skip non-primitive values that are aliases (contain references)
      if (typeof value === 'string' && value.startsWith('{')) {
        return
      }

      // Path can be array or string
      const pathArray = Array.isArray(token.path) ? token.path : token.path.split('.')
      const category = pathArray[0]

      if (category === 'primitives') {
        // Create CSS var name from path: primitives.colors.zinc.500 -> --colors-zinc-500
        const cssName = pathArray
          .slice(1)
          .map((p: string) => p.toLowerCase().replace(/\s+/g, '-'))
          .join('-')
        primitiveVars += `  --${cssName}: ${value};\n`
      } else if (category === 'semantic') {
        const mode = pathArray[1]
        // Create CSS var name: semantic.light.content.primary -> --content-primary
        const cssName = pathArray
          .slice(2)
          .map((p: string) => p.toLowerCase().replace(/\s+/g, '-'))
          .join('-')

        if (mode === 'light') {
          lightVars += `  --${cssName}: ${value};\n`
        } else if (mode === 'dark') {
          darkVars += `  --${cssName}: ${value};\n`
        }
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

/* Dark Mode (default) */
:root {
${darkVars || '  /* No dark mode tokens defined */'}
}

/* Light Mode */
.light {
${lightVars || '  /* No light mode tokens defined */'}
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
 * Custom format: JSON flat export (for third-party tools)
 */
const formatJsonFlat: Format = {
  name: 'json/flat',
  format: ({ dictionary }) => {
    const tokens: Record<string, any> = {}

    dictionary.allTokens.forEach(token => {
      const value = token.$value ?? token.value
      if (value === undefined || typeof value === 'object') return

      const path = token.path.join('.')
      tokens[path] = {
        value,
        type: token.$type || token.original?.$type || 'unknown',
      }
    })

    return JSON.stringify(tokens, null, 2)
  },
}

/**
 * Custom format: iOS Swift colors
 */
const formatSwiftColors: Format = {
  name: 'swift/colors',
  format: ({ dictionary }) => {
    let output = `//
// DesignTokens.swift
// Auto-generated from Figma - DO NOT EDIT DIRECTLY
// Generated: ${new Date().toISOString()}
//

import SwiftUI

public enum DesignTokens {
    public enum Colors {
`

    dictionary.allTokens.forEach(token => {
      const value = token.$value ?? token.value
      const isColor = token.$type === 'color' || token.original?.$type === 'color'

      if (!isColor || typeof value !== 'string' || !value.startsWith('#')) return

      const name = token.path
        .slice(-2)
        .join('')
        .replace(/[^a-zA-Z0-9]/g, '')
      const hex = value.replace('#', '')

      let r = 0,
        g = 0,
        b = 0,
        a = 1

      if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16) / 255
        g = parseInt(hex.slice(2, 4), 16) / 255
        b = parseInt(hex.slice(4, 6), 16) / 255
      } else if (hex.length === 8) {
        r = parseInt(hex.slice(0, 2), 16) / 255
        g = parseInt(hex.slice(2, 4), 16) / 255
        b = parseInt(hex.slice(4, 6), 16) / 255
        a = parseInt(hex.slice(6, 8), 16) / 255
      }

      output += `        public static let ${name} = Color(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}, opacity: ${a.toFixed(3)})\n`
    })

    output += `    }
}
`
    return output
  },
}

/**
 * Custom format: Android colors XML
 */
const formatAndroidColors: Format = {
  name: 'android/colors',
  format: ({ dictionary }) => {
    let output = `<?xml version="1.0" encoding="utf-8"?>
<!--
  Design Tokens - Auto-generated from Figma
  DO NOT EDIT DIRECTLY
  Generated: ${new Date().toISOString()}
-->
<resources>
`

    dictionary.allTokens.forEach(token => {
      const value = token.$value ?? token.value
      const isColor = token.$type === 'color' || token.original?.$type === 'color'

      if (!isColor || typeof value !== 'string' || !value.startsWith('#')) return

      const name = token.path
        .join('_')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')

      // Convert to Android format (#AARRGGBB)
      let androidColor = value.toUpperCase()
      if (androidColor.length === 7) {
        androidColor = '#FF' + androidColor.slice(1)
      } else if (androidColor.length === 9) {
        // Reorder from #RRGGBBAA to #AARRGGBB
        androidColor = '#' + androidColor.slice(7, 9) + androidColor.slice(1, 7)
      }

      output += `    <color name="${name}">${androidColor}</color>\n`
    })

    output += `</resources>
`
    return output
  },
}

/**
 * Custom format: SCSS variables
 */
const formatScssVariables: Format = {
  name: 'scss/variables',
  format: ({ dictionary }) => {
    let output = `//
// Design Token SCSS Variables
// Auto-generated from Figma - DO NOT EDIT DIRECTLY
// Generated: ${new Date().toISOString()}
//

`

    dictionary.allTokens.forEach(token => {
      const value = token.$value ?? token.value
      if (value === undefined || typeof value === 'object') return

      const name = token.path
        .join('-')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
      output += `$${name}: ${value};\n`
    })

    return output
  },
}

// Register additional formats
StyleDictionary.registerFormat(formatJsonFlat)
StyleDictionary.registerFormat(formatSwiftColors)
StyleDictionary.registerFormat(formatAndroidColors)
StyleDictionary.registerFormat(formatScssVariables)

/**
 * Style Dictionary configuration
 */
const config: Config = {
  source: [TOKENS_INPUT],
  platforms: {
    // TypeScript output (primary)
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
    // CSS output (Tailwind v4 compatible)
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
    // SCSS output
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
        },
      ],
    },
    // JSON flat export (for other tools)
    json: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },
    // iOS Swift output
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'dist/ios/',
      files: [
        {
          destination: 'DesignTokens.swift',
          format: 'swift/colors',
        },
      ],
    },
    // Android XML output
    android: {
      transformGroup: 'android',
      buildPath: 'dist/android/',
      files: [
        {
          destination: 'colors.xml',
          format: 'android/colors',
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
