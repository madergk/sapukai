# 🎨 Sincronización de Tokens con Figma Console MCP

Esta guía te explica cómo usar **Figma Console MCP** para extraer variables de diseño directamente desde Figma sin necesidad del plan Enterprise.

## 📋 Prerequisitos

- ✅ Acceso a tu archivo Figma
- ✅ Claude Code con capacidades de navegador
- ✅ FIGMA_FILE_KEY configurado en `.env`

## 🚀 Método 1: Extracción Manual (Recomendado)

### Paso 1: Abre tu archivo de Figma

```bash
# Tu archivo debe estar en una URL como:
# https://www.figma.com/design/{FIGMA_FILE_KEY}/...
```

### Paso 2: Abre la consola de Figma

En tu navegador (Chrome, Firefox, Safari):

1. Presiona `F12` o `Cmd+Option+J` (Mac) / `Ctrl+Alt+J` (Windows)
2. Ve a la pestaña **Console**

### Paso 3: Ejecuta el script de extracción

Copia y pega esto en la consola:

```javascript
// Figma Console Token Extractor
;(async function extractFigmaTokens() {
  console.log('🎨 Extracting Figma tokens...')

  // Get all variables
  const allVariables = figma.variables.getAll()
  console.log(`Found ${allVariables.length} variables`)

  // Organize by collection and mode
  const tokensByCollection = {}

  for (const variable of allVariables) {
    if (variable.hiddenFromPublishing) continue

    const collection = variable.variableCollectionId
    if (!tokensByCollection[collection]) {
      tokensByCollection[collection] = []
    }

    const tokenData = {
      name: variable.name,
      id: variable.id,
      key: variable.key,
      type: variable.resolvedType,
      description: variable.description,
      scopes: variable.scopes,
      valuesByMode: variable.valuesByMode,
    }

    tokensByCollection[collection].push(tokenData)
  }

  // Get collection metadata
  const collections = figma.variables.getLocalVariableCollections()
  const collectionMap = {}
  for (const collection of collections) {
    collectionMap[collection.id] = {
      name: collection.name,
      modes: collection.modes,
      defaultMode: collection.defaultModeId,
    }
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
      totalTokens: Object.values(tokensByCollection).reduce(
        (sum, tokens) => sum + tokens.length,
        0
      ),
    },
  }

  console.log('✅ Token extraction complete!')
  console.log('Copy the following JSON:')
  console.log(JSON.stringify(output, null, 2))

  return output
})()
```

### Paso 4: Copia el JSON resultante

Deberías ver un output como:

```json
{
  "timestamp": "2026-01-29T19:00:00.000Z",
  "fileKey": "abc123xyz",
  "fileName": "Design System",
  "collections": {
    "col1": {
      "name": "Primitives",
      "modes": [...],
      "defaultMode": "..."
    }
  },
  "tokens": {
    "col1": [
      {
        "name": "colors/blue/500",
        "type": "COLOR",
        "valuesByMode": {...}
      }
    ]
  },
  "summary": {...}
}
```

1. Haz click derecho en el JSON
2. Selecciona **Copy** o `Cmd+C`

### Paso 5: Guarda el JSON en tu proyecto

```bash
# Crea o actualiza el archivo
cat > tokens/figma-tokens.json << 'EOF'
{Pega aquí el JSON que copiaste}
EOF
```

### Paso 6: Sincroniza los tokens

```bash
# Usa source=local para evitar intentar usar la API
npm run token:sync -- --source=local
```

## 🤖 Método 2: Automatización con Claude Code

Si quieres automatizar este proceso:

```bash
# Usa el script MCP
npm run token:sync -- --source=mcp
```

Este método:

1. Abre tu archivo Figma en el navegador
2. Extrae automáticamente las variables
3. Procesa y guarda los tokens
4. Ejecuta Style Dictionary

## 📁 Estructura de Tokens Extraídos

El JSON extraído se estructura así:

```
tokens/figma-tokens.json
├── $schema: "https://design-tokens.org/schema.json"
├── $metadata
│   ├── source: "Figma (Console MCP)"
│   ├── fileKey: tu_figma_file_key
│   ├── extractedAt: timestamp
│   └── version: "1.0.0"
├── primitives
│   ├── colors
│   │   ├── blue
│   │   │   ├── 50: { $value: "#...", $type: "color" }
│   │   │   ├── 100: ...
│   │   │   └── 900: ...
│   │   └── red...
│   ├── spacing
│   │   ├── 1: { $value: "4px", $type: "dimension" }
│   │   └── ...
│   └── ...
└── semantic
    ├── light
    │   ├── content
    │   │   ├── primary: { $value: "#d97706", $type: "color" }
    │   │   └── ...
    │   └── ...
    └── dark
        ├── content
        │   ├── primary: { $value: "#ffffff", $type: "color" }
        │   └── ...
        └── ...
```

## 🔄 Flujo de Sincronización Completo

```
Figma Console
    ↓ (figma.variables.getAll())
JSON Output
    ↓ (Copiar & Pegar)
tokens/figma-tokens.json
    ↓ (npm run token:sync -- --source=local)
style-dictionary.config.ts
    ↓ (Transformación)
src/tokens/
├── theme.css (CSS variables)
├── colors.ts (TypeScript)
├── spacing.ts
├── motion.ts
└── ...
```

## 💡 Tips y Trucos

### Filtrar solo ciertos tipos de tokens

```javascript
// Solo colores
const colorVars = figma.variables.getAll().filter(v => v.resolvedType === 'COLOR')

// Solo variables locales (no librerías)
const localVars = figma.variables.getAll().filter(v => !v.remote)
```

### Exportar a formato diferente

```javascript
// Exportar como CSS variables
const cssOutput = allVariables.map(v =>
  `--${v.name.replace(/\//g, '-')}: ${v.valuesByMode[...]}`
).join(';\n');
```

### Validar antes de usar

```bash
# Generar reporte + actualizar docs
npm run token:postprocess -- --skip-storybook
```

## ❌ Troubleshooting

### Error: "figma is not defined"

**Solución**: Asegúrate de estar:

- En una pestaña con un archivo Figma abierto
- En la consola de desarrollador DENTRO de la página de Figma
- No en una consola externa

### Error: "getAll is not a function"

**Solución**: El método depende de tu versión de Figma. Intenta:

```javascript
// Alternativa 1
const vars = figma.variables.getLocalVariables()

// Alternativa 2
const vars = figma.variables.getAll?.() || figma.variables.getLocalVariables?.()
```

### JSON muy grande o no copia bien

**Solución**: Copia en partes o usa:

```javascript
// Descargar como archivo
const dataStr = JSON.stringify(output, null, 2)
const dataBlob = new Blob([dataStr], { type: 'application/json' })
const url = URL.createObjectURL(dataBlob)
const link = document.createElement('a')
link.href = url
link.download = 'figma-tokens.json'
link.click()
```

## 📚 Archivos Relacionados

- 📄 `/scripts/tokens/sources/figma-mcp.ts` - Script MCP
- 📄 `/scripts/figma-console-helper.ts` - Utilidades de consola
- 📄 `/scripts/tokens/sync.ts` - Orquestador principal
- 📄 `/style-dictionary.config.ts` - Configuración de transformación
- 📄 `/tokens/figma-tokens.json` - Archivo de tokens (W3C format)

## 🎯 Próximos Pasos

1. ✅ Extrae variables con Figma Console
2. ✅ Sincroniza con `npm run token:sync -- --source=local`
3. ✅ Verifica cambios: `git diff src/tokens/`
4. ✅ Ejecuta Storybook: `npm run storybook`
5. ✅ Haz push: `git push origin main`

## 🔗 Referencias

- [Figma API - Variables](https://www.figma.com/developers/api#variables)
- [W3C Design Tokens](https://design-tokens.org/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Tokens Studio for Figma](https://tokens.studio/)

---

**¿Necesitas ayuda?** Revisa los logs:

```bash
npm run token:sync -- --source=mcp --dry-run
```
