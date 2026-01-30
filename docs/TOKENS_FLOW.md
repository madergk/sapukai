# 🔄 Flujo de Sincronización de Tokens - Comparativa

## Antes: REST API (requiere Enterprise)

```
┌─────────────────────────────────────────┐
│  Figma File (Enterprise Plan Required)  │
│  Variables API Access                   │
└────────────┬────────────────────────────┘
             │
             ↓ (API Endpoint: /v1/files/{key}/variables/local)
             │ (Requires: file_variables:read scope)
             │ (Fails with HTTP 403 without Enterprise)
             │
┌────────────┴─────────────────────────┐
│ token:sync --source=api             │
│ ✗ Requires Enterprise plan           │
│ ✗ Requires Variables API access      │
│ ✗ Network-dependent                  │
│ ✗ Requires FIGMA_ACCESS_TOKEN        │
└────────────┬─────────────────────────┘
             │
             ↓
┌────────────┴─────────────────────────┐
│ figma-tokens.json                    │
│ (W3C Design Tokens format)           │
└────────────┬─────────────────────────┘
             │
             ↓
┌────────────┴─────────────────────────┐
│ style-dictionary.config.ts           │
│ (Transform & Generate)               │
└────────────┬─────────────────────────┘
             │
             ├──────────────────────────────┐
             │                              │
             ↓                              ↓
┌────────────────────────┐    ┌────────────────────────┐
│ src/tokens/theme.css   │    │ src/tokens/colors.ts   │
│ (CSS Variables)        │    │ (TypeScript)           │
└────────────────────────┘    └────────────────────────┘
```

## Ahora: Console MCP (sin restricciones)

```
┌──────────────────────────────────────────┐
│  Figma File (Any Plan)                   │
│  Variables in Figma Console              │
│  figma.variables.getAll()                │
└────────────┬─────────────────────────────┘
             │
             ↓ (Manual o Automatizado)
             │ (Browser Console Access)
             │ (No API restrictions)
             │ (Works with any plan)
             │
┌────────────┴──────────────────────────┐
│ Figma Console Script Execution        │
│                                       │
│ (async function extractFigmaTokens()) │
│ - figma.variables.getAll()           │
│ - figma.variables.getLocalCollections()│
│ - Procesa por modo (light/dark)      │
│                                       │
│ ✓ Sin requisitos Enterprise          │
│ ✓ Sin token API                      │
│ ✓ Acceso directo a datos            │
│ ✓ Control total sobre salida        │
└────────────┬──────────────────────────┘
             │
             ↓ (Copiar → Pegar)
             │
┌────────────┴──────────────────────────┐
│ tokens/figma-tokens.json             │
│                                       │
│ {                                     │
│   "$schema": "...",                   │
│   "$metadata": {...},                 │
│   "primitives": {...},                │
│   "semantic": {                        │
│     "light": {...},                    │
│     "dark": {...}                      │
│   }                                    │
│ }                                      │
└────────────┬──────────────────────────┘
             │
             ↓ (npm run token:sync -- --source=local)
             │
┌────────────┴──────────────────────────┐
│ style-dictionary.config.ts           │
│                                       │
│ Transforma JSON a múltiples formatos │
│ ✓ CSS (Tailwind v4 compatible)       │
│ ✓ TypeScript                         │
│ ✓ SCSS                               │
│ ✓ JSON                               │
│ ✓ iOS Swift                          │
│ ✓ Android XML                        │
└────────────┬──────────────────────────┘
             │
    ┌────────┼────────┬──────────┬──────────────┐
    │        │        │          │              │
    ↓        ↓        ↓          ↓              ↓
┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐
│.css  │ │.ts   │ │.scss │ │ iOS      │ │ Android  │
│      │ │      │ │      │ │ Swift    │ │ XML      │
└──────┘ └──────┘ └──────┘ └──────────┘ └──────────┘
```

## Comparativa Detallada

| Aspecto                    | REST API (Antes)          | Console MCP (Ahora)          |
| -------------------------- | ------------------------- | ---------------------------- |
| **Plan Requerido**         | Enterprise                | Cualquiera                   |
| **Acceso a Variables**     | API Variables endpoint    | figma.variables.getAll()     |
| **Autenticación**          | FIGMA_ACCESS_TOKEN        | Acceso directo browser       |
| **Restricciones de Scope** | file_variables:read (403) | Ninguna                      |
| **Automatización**         | Totalmente automática     | Semi-automática (copy/paste) |
| **Dependencias**           | HTTP API funcionando      | Navegador con Figma abierto  |
| **Velocidad**              | Rápida pero limitada      | Instantánea                  |
| **Control de Datos**       | Limitado a API response   | Control total                |
| **Modo de Ejecución**      | Node.js (backend)         | Browser Console (frontend)   |
| **Errores Comunes**        | HTTP 403 (scope)          | Ninguno documentado          |

## Implementación en tu Proyecto

### Opción A: Manual (Recomendado para empezar)

```bash
# 1. Abre tu archivo de Figma en navegador
# 2. F12 → Console
# 3. Copia el script de extractFigmaTokens()
# 4. Pega en consola, presiona Enter
# 5. Copia el JSON resultante

# 6. Crea el archivo
cat > tokens/figma-tokens.json << 'EOF'
{JSON_AQUI}
EOF

# 7. Sincroniza
npm run token:sync -- --source=local
```

### Opción B: Automatizada (Future)

```bash
# Una vez que MCP esté completamente integrado:
npm run token:sync -- --source=mcp

# Esto:
# 1. Abre Figma en navegador
# 2. Ejecuta script automáticamente
# 3. Extrae y procesa tokens
# 4. Sincroniza con Style Dictionary
```

## 🎯 Ventajas del Nuevo Flujo

### Para Desarrolladores

- ✅ Sin restricciones de plan Enterprise
- ✅ Acceso directo a datos de Figma
- ✅ Proceso más transparente
- ✅ Mejor control sobre las transformaciones

### Para Diseñadores

- ✅ Pueden extraer variables en cualquier momento
- ✅ Sin barreras de autenticación de API
- ✅ Proceso simple y visual

### Para CI/CD

- ✅ Menos dependencias externas
- ✅ Menos puntos de fallo
- ✅ Mayor confiabilidad

## 📊 Ejemplo: Estructura de Token

### Input (de Figma Console)

```javascript
{
  "timestamp": "2026-01-29T19:45:00Z",
  "fileKey": "abc123",
  "collections": {
    "col1": {
      "name": "Primitives",
      "modes": [
        { "modeId": "m1", "name": "Default" }
      ]
    }
  },
  "tokens": {
    "col1": [
      {
        "name": "colors/blue/500",
        "type": "COLOR",
        "valuesByMode": {
          "m1": { "r": 0.235, "g": 0.522, "b": 0.957 }
        }
      }
    ]
  }
}
```

### Output (W3C Format)

```json
{
  "$schema": "https://design-tokens.org/schema.json",
  "$metadata": {
    "source": "Figma (Console MCP)",
    "fileKey": "abc123",
    "extractedAt": "2026-01-29T19:45:00Z"
  },
  "primitives": {
    "colors": {
      "blue": {
        "500": {
          "$value": "#3b82f6",
          "$type": "color"
        }
      }
    }
  }
}
```

### Transformado (CSS + TypeScript)

```css
/* theme.css */
--color-blue-500: #3b82f6;
```

```typescript
// colors.ts
export const primitiveColors = {
  colors: {
    blue: {
      500: '#3b82f6',
    },
  },
}
```

## 🔗 Flujo de Trabajo Recomendado

```
SEMANA 1: Configuración
├─ Extrae tokens una vez desde Figma Console
└─ Valida estructura y completitud

SEMANAL: Cambios
├─ Diseñador actualiza variables en Figma
├─ Extraes JSON nuevamente (cuando necesites sync)
├─ npm run token:sync -- --source=local
└─ Revisas cambios: git diff src/tokens/

DEPLOYMENT
├─ Incluye cambios en PR
├─ Ejecuta tests
└─ Merge y push a main
```

## 📚 Scripts Disponibles

```bash
# Sincronización completa (REST API)
npm run token:sync -- --source=api

# Sincronización con MCP
npm run token:sync -- --source=mcp

# Sin fetch de Figma (solo transform)
npm run token:sync -- --source=local

# Preview de cambios
npm run token:sync -- --source=api --dry-run

# Postprocess (reporte + docs + Storybook)
npm run token:postprocess

# Rollback a versión anterior
npm run rollback-tokens -- --list
npm run rollback-tokens -- --version=0.1.5
```

---

**Próximo Paso**: Lee [TOKENS_MCP_GUIDE.md](./TOKENS_MCP_GUIDE.md) para instrucciones detalladas.
