#!/usr/bin/env tsx
/**
 * Figma Console Helper
 * Provides utilities to extract tokens directly from Figma Console
 * Can be run from Claude Code browser context
 */

/**
 * This code should be run in the Figma browser console
 * Paste into Chrome DevTools Console while on a Figma file
 */

export const figmaConsoleScript = `
/**
 * Figma Console Token Extractor
 * Run this in Figma browser console to extract all variables
 */

(async function extractFigmaTokens() {
  console.log('🎨 Extracting Figma tokens...');

  // Get all variables
  const allVariables = figma.variables.getAll();
  console.log(\`Found \${allVariables.length} variables\`);

  // Organize by collection and mode
  const tokensByCollection = {};

  for (const variable of allVariables) {
    if (variable.hiddenFromPublishing) continue;

    const collection = variable.variableCollectionId;
    if (!tokensByCollection[collection]) {
      tokensByCollection[collection] = [];
    }

    const tokenData = {
      name: variable.name,
      id: variable.id,
      key: variable.key,
      type: variable.resolvedType,
      description: variable.description,
      scopes: variable.scopes,
      valuesByMode: variable.valuesByMode,
    };

    tokensByCollection[collection].push(tokenData);
  }

  // Get collection metadata
  const collections = figma.variables.getLocalVariableCollections();
  const collectionMap = {};
  for (const collection of collections) {
    collectionMap[collection.id] = {
      name: collection.name,
      modes: collection.modes,
      defaultMode: collection.defaultModeId,
    };
  }

  // Build output
  const output = {
    timestamp: new Date().toISOString(),
    fileKey: figma.fileKey,
    fileName: figma.root.name,
    collections: collectionMap,
    tokens: tokensByCollection,
    summary: {
      totalCollections: collections.length,
      totalVariables: allVariables.length,
      totalTokens: Object.values(tokensByCollection).reduce((sum, tokens) => sum + tokens.length, 0),
    },
  };

  console.log('✅ Token extraction complete!');
  console.log('Copy the following JSON:');
  console.log(JSON.stringify(output, null, 2));

  // Also return for programmatic access
  return output;
})();
`

/**
 * Interactive extraction function
 * This can be called from Claude Code to guide users through the process
 */
export async function guideTokenExtraction(): Promise<void> {
  console.log('\n📱 Figma Token Extraction Guide\n')

  console.log('Step 1: Open your Figma file in a browser')
  console.log('Step 2: Open Developer Tools (F12 or Cmd+Option+J)')
  console.log('Step 3: Go to Console tab')
  console.log('Step 4: Copy and paste the following script:\n')

  console.log(figmaConsoleScript)

  console.log('\n\nStep 5: Press Enter to run the script')
  console.log('Step 6: Copy the JSON output from the console')
  console.log('Step 7: Paste it into tokens/figma-tokens.json\n')
}

/**
 * Parse Figma console output and convert to standard format
 */
export function parseFigmaConsoleOutput(rawData: any) {
  const output = {
    $schema: 'https://design-tokens.org/schema.json',
    $metadata: {
      source: 'Figma (Console MCP)',
      fileKey: rawData.fileKey,
      fileName: rawData.fileName,
      extractedAt: rawData.timestamp,
      version: '1.0.0',
    },
    primitives: {} as any,
    semantic: {
      light: {} as any,
      dark: {} as any,
    },
  }

  // Process each collection
  for (const [collectionId, tokens] of Object.entries(rawData.tokens)) {
    const collection = rawData.collections[collectionId]
    const isPrimitive =
      collection.name.toLowerCase().includes('primitive') ||
      collection.name.toLowerCase().includes('base') ||
      collection.name.toLowerCase().includes('core')

    for (const token of tokens as any[]) {
      const path = token.name.split('/').map((p: string) => p.trim())

      // Process each mode
      for (const [modeId, value] of Object.entries(token.valuesByMode)) {
        const modeName = collection.modes.find((m: any) => m.modeId === modeId)?.name || ''

        const tokenValue = {
          $value: formatTokenValue(value, token.type),
          $type: mapTokenType(token.type),
          ...(token.description && { $description: token.description }),
        }

        if (isPrimitive) {
          // Primitives don't have modes
          setNestedValue(output.primitives, path, tokenValue)
        } else {
          // Semantic tokens go into light/dark
          if (modeName.toLowerCase().includes('dark')) {
            setNestedValue(output.semantic.dark, path, tokenValue)
          } else {
            setNestedValue(output.semantic.light, path, tokenValue)
          }
        }
      }
    }
  }

  return output
}

/**
 * Helper: Set nested value in object
 */
function setNestedValue(obj: any, path: string[], value: any): void {
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (!(key in current)) {
      current[key] = {}
    }
    current = current[key]
  }
  current[path[path.length - 1]] = value
}

/**
 * Helper: Format token value based on type
 */
function formatTokenValue(value: any, type: string): string | number | boolean {
  if (type === 'COLOR' && typeof value === 'object') {
    // Convert RGBA to hex
    const { r, g, b, a } = value
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    if (a < 1) {
      return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  if (typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
    // Return variable reference
    return `{${value.id}}`
  }

  return value
}

/**
 * Helper: Map Figma type to token type
 */
function mapTokenType(figmaType: string): string {
  const typeMap: Record<string, string> = {
    COLOR: 'color',
    FLOAT: 'number',
    STRING: 'string',
    BOOLEAN: 'boolean',
  }
  return typeMap[figmaType] || 'string'
}

// If run directly
if (require.main === module) {
  guideTokenExtraction()
}
