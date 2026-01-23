// Token Types
export type TokenCategory =
  | 'color'
  | 'spacing'
  | 'typography'
  | 'border'
  | 'effect'
  | 'animation'
  | 'component'
  | 'other'
export type TokenTheme = 'light' | 'dark' | 'all'
export type TokenScale = 'desktop' | 'tablet' | 'mobile'
export type TokenSourceFormat = 'tokensStudio' | 'css' | 'scss'
export type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'fontSize'
  | 'lineHeight'
  | 'number'
  | 'duration'
  | 'cubicBezier'
  | 'boxShadow'
  | 'other'

export interface Token {
  value: string
  type: TokenType
  category: TokenCategory
  theme: TokenTheme
  scale: TokenScale
  description?: string
  references: string[]
  referencedBy: string[]
  $extensions?: Record<string, unknown>
  set?: string
  sourceFormat?: TokenSourceFormat
}

export type TokensMap = Record<string, Token>

export interface TokenNodeProps {
  token: Token
  name: string
  x: number
  y: number
  isSelected: boolean
  isHighlighted: boolean
  isConnected: boolean
  onClick: () => void
  onDragStart: (e: React.MouseEvent) => void
}

export interface NodePosition {
  x: number
  y: number
}

export type NodePositionsMap = Record<string, NodePosition>

export interface UploadPreview {
  filename: string
  tokenCount: number
  categories: TokenCategory[]
  themes: TokenTheme[]
  tokens: TokensMap
  format: TokenSourceFormat
}

export interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (tokens: TokensMap) => void
}

export interface ColorPreviewProps {
  value: string
}

export interface NamingRule {
  id: string
  name: string
  description: string
  pattern?: RegExp
  badPatterns?: RegExp[]
  exceptions?: string[]
  severity: 'error' | 'warning' | 'info'
}

export interface Recommendation {
  type: 'architecture' | 'naming'
  severity: 'error' | 'warning' | 'info'
  title: string
  description: string
  tokenName?: string
}

// Tokens Studio JSON Types
export interface TokensStudioValue {
  value: string | number | Record<string, unknown>
  type?: TokenType
  $type?: TokenType
  description?: string
  $description?: string
  $extensions?: Record<string, unknown>
}

export type TokensStudioJSON = Record<string, TokensStudioValue | TokensStudioJSON>
