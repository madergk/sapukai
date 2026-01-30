import path from 'path'

export type TokenSource = 'mcp' | 'api' | 'tokens-studio' | 'local'

export const TOKENS_DIR = path.join(process.cwd(), 'tokens')
export const TOKENS_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')
export const REPORTS_DIR = path.join(TOKENS_DIR, '.reports')

export const DEFAULT_SOURCE: TokenSource = 'mcp'
export const REFERENCE_MAP_PATH = path.join(
  process.cwd(),
  'scripts',
  'tokens',
  'reference-map.json'
)

export const OUTPUTS = {
  cssTheme: path.join(process.cwd(), 'src', 'tokens', 'theme.css'),
}
