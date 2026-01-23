import type { TokensMap } from './types'

const toNestedTokens = (tokens: TokensMap): Record<string, unknown> => {
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
  return exportData
}

export const buildStyleDictionaryTokens = (tokens: TokensMap): Record<string, unknown> =>
  toNestedTokens(tokens)

export const buildStyleDictionaryConfig = (): Record<string, unknown> => ({
  source: ['tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [{ destination: 'tokens.css', format: 'css/variables' }],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [{ destination: 'tokens.scss', format: 'scss/variables' }],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
  },
})

const toKebabName = (name: string): string => name.replace(/\./g, '-')

export const buildCssVariables = (tokens: TokensMap): string => {
  let content = ':root {\n'
  Object.entries(tokens).forEach(([name, token]) => {
    const cssName = toKebabName(name)
    content += `  --${cssName}: ${token.value};\n`
  })
  content += '}\n'
  return content
}

export const buildScssVariables = (tokens: TokensMap): string => {
  let content = ''
  Object.entries(tokens).forEach(([name, token]) => {
    const scssName = toKebabName(name)
    content += `$${scssName}: ${token.value};\n`
  })
  return content
}
