# ⚡ QuickStart: Figma Console MCP para Tokens

**TL;DR**: Necesitas extraer tokens desde Figma sin plan Enterprise? Esta guía te lo explica en 5 minutos.

---

## 🎯 En 5 Pasos

### 1️⃣ Abre tu archivo de Figma en el navegador

```
https://www.figma.com/design/{FIGMA_FILE_KEY}/...
```

### 2️⃣ Abre DevTools y ve a la consola

- **Mac**: `Cmd + Option + J`
- **Windows/Linux**: `Ctrl + Shift + J`

### 3️⃣ Copia el script (abajo) y pégalo en la consola

```javascript
;(async function extractFigmaTokens() {
  const allVariables = figma.variables.getAll()
  const collections = figma.variables.getLocalVariableCollections()

  const tokensByCollection = {}
  for (const variable of allVariables) {
    if (variable.hiddenFromPublishing) continue
    const colId = variable.variableCollectionId
    if (!tokensByCollection[colId]) tokensByCollection[colId] = []
    tokensByCollection[colId].push({
      name: variable.name,
      type: variable.resolvedType,
      valuesByMode: variable.valuesByMode,
    })
  }

  const output = {
    timestamp: new Date().toISOString(),
    fileKey: figma.fileKey,
    fileName: figma.root.name,
    collections: collections.reduce(
      (acc, col) => ({
        ...acc,
        [col.id]: { name: col.name, modes: col.modes },
      }),
      {}
    ),
    tokens: tokensByCollection,
  }

  console.log(JSON.stringify(output, null, 2))
})()
```

### 4️⃣ Copia el JSON que aparece y guárdalo

```bash
# Abre el editor y crea este archivo con el JSON:
tokens/figma-tokens.json
```

### 5️⃣ Sincroniza los tokens

```bash
npm run sync-tokens -- --skip-figma
```

✅ **¡Listo!** Tus tokens están sincronizados.

---

## 📚 Comandos Disponibles

```bash
# Ver demostración con instrucciones detalladas
npx tsx scripts/demo-figma-extract.ts

# Sincronizar (sin fetch de API)
npm run sync-tokens -- --skip-figma

# Preview de cambios (sin aplicarlos)
npm run sync-tokens -- --skip-figma --dry-run

# Validar tokens
npm run validate-tokens

# Ver versiones anteriores
npm run rollback-tokens -- --list

# Revertir a una versión anterior
npm run rollback-tokens -- --version=0.1.5
```

---

## ❓ FAQs Rápidas

### ¿Necesito plan Enterprise?

**No.** Este método funciona con cualquier plan de Figma.

### ¿Es manual o automático?

**Manual pero simple**. Copias/pegas un script en la consola. Toma ~2 minutos.

### ¿Dónde guardó los tokens?

En `tokens/figma-tokens.json` (formato W3C Design Tokens).

### ¿Qué pasa si cambio variables en Figma?

1. Ejecuta el script de nuevo en la consola
2. Copia el JSON actualizado
3. Reemplaza `tokens/figma-tokens.json`
4. Ejecuta `npm run sync-tokens -- --skip-figma`

### ¿Puedo automatizarlo?

**Próximamente** con `npm run sync-tokens -- --mcp`

### ¿Qué formatos genera?

- CSS variables (`src/tokens/theme.css`)
- TypeScript (`src/tokens/colors.ts`)
- SCSS
- JSON
- iOS Swift
- Android XML

---

## 🔧 Setup Inicial (Solo una vez)

```bash
# 1. Verificar que tienes FIGMA_FILE_KEY en .env
grep FIGMA_FILE_KEY .env

# 2. Si no lo tienes, agréguelo:
echo "FIGMA_FILE_KEY=tu_key_aqui" >> .env

# 3. Extraer tu FILE_KEY desde la URL de Figma
# URL: https://www.figma.com/design/abc123xyz/My-File
#                                    ^^^^^^^^
#                                    Este es tu FILE_KEY
```

---

## 📊 Ejemplo de Output

Cuando ejecutes el script en Figma Console, verás:

```json
{
  "timestamp": "2026-01-29T19:45:00Z",
  "fileKey": "abc123xyz456",
  "fileName": "Sapukai Design System",
  "collections": {
    "col1": {
      "name": "Primitives",
      "modes": [{ "modeId": "m1", "name": "Default" }]
    }
  },
  "tokens": {
    "col1": [
      {
        "name": "colors/blue/500",
        "type": "COLOR",
        "valuesByMode": { "m1": { "r": 0.235, "g": 0.522, "b": 0.957 } }
      }
    ]
  }
}
```

**Copia TODO ese JSON** (incluyendo los `{` y `}`) a `tokens/figma-tokens.json`.

---

## 🚀 Próxima Ejecución

Cuando necesites sincronizar de nuevo:

```bash
# 1. Abre Figma Console (F12 → Console)
# 2. Pega el script de nuevo
# 3. Copia el nuevo JSON
# 4. Actualiza tokens/figma-tokens.json
# 5. npm run sync-tokens -- --skip-figma

# ¡Hecho! Tus tokens están actualizados.
```

---

## 📖 Documentación Completa

- **Guía detallada**: `docs/TOKENS_MCP_GUIDE.md`
- **Comparativa de métodos**: `docs/TOKENS_FLOW.md`
- **Resumen de implementación**: `docs/IMPLEMENTATION_SUMMARY.md`
- **Scripts disponibles**: `scripts/`

---

## ✨ Tips Avanzados

### Extraer solo ciertos tipos de tokens

```javascript
// Solo colores
const colors = figma.variables.getAll().filter(v => v.resolvedType === 'COLOR')
```

### Ver todas tus colecciones

```javascript
const collections = figma.variables.getLocalVariableCollections()
collections.forEach(col => console.log(col.name, col.id))
```

### Exportar con una sola línea

```javascript
// Copiar directo al portapapeles
const data = JSON.stringify(/*tu output*/)
await navigator.clipboard.writeText(data)
console.log('✅ Copiado al portapapeles!')
```

---

## 🎓 ¿Por qué Figma Console MCP?

| Característica  | API REST     | Console MCP |
| --------------- | ------------ | ----------- |
| Plan Enterprise | ❌ Requerido | ✅ No       |
| Automatización  | ✅ Sí        | 🟡 Manual   |
| Configuración   | 30 min       | 5 min       |
| Confiabilidad   | 🟡 Media     | ✅ Alta     |

**Resultado**: Console MCP es más accesible y confiable para la mayoría.

---

## 🆘 Troubleshooting

| Problema                   | Solución                                                              |
| -------------------------- | --------------------------------------------------------------------- |
| "figma is not defined"     | Asegúrate de estar en la consola de Figma (F12 en la página de Figma) |
| "getAll is not a function" | Tu versión de Figma podría ser antigua. Actualiza.                    |
| JSON muy grande            | Guárdalo en un archivo `.txt` temporal y luego cópialo                |
| "No changes detected"      | Usa `npm run sync-tokens -- --force`                                  |

---

## 🎉 ¡Listo para comenzar?

```bash
# Paso 1: Ver demo interactiva
npx tsx scripts/demo-figma-extract.ts

# Paso 2: Seguir los pasos de arriba

# Paso 3: Sincronizar
npm run sync-tokens -- --skip-figma

# ✅ ¡Hecho!
```

---

**Preguntas?** Revisa `docs/TOKENS_MCP_GUIDE.md` para más detalles.
