# 📄 Guía: Sincronización Local de Tokens

## ¿Qué es `sync-tokens-local`?

Es un script que **carga tokens directamente desde `figma-tokens.json`** sin hacer fetch desde Figma ni desde API.

### Casos de Uso

- ✅ **Desarrollo local rápido** - Sin latencia de red
- ✅ **CI/CD pipelines** - Tokens ya están en el repositorio
- ✅ **Trabajo offline** - Sin dependencia de internet
- ✅ **Testing** - Validar transformaciones sin API
- ✅ **Actualizaciones manuales** - Después de copiar/pegar JSON desde Figma
- ✅ **Validación** - Verificar integridad de tokens

---

## 🚀 Uso Básico

### Opción 1: Carga simple

```bash
npm run sync-tokens-local
```

Esto:

- Lee `tokens/figma-tokens.json`
- Valida la estructura
- Crea backup automático
- Listo para next step

### Opción 2: Con reporte

```bash
npm run sync-tokens-local --report
```

Muestra:

- Estadísticas de tokens
- Desglose por tipo
- Comparación con versión anterior
- Metadata del archivo

### Opción 3: Validación estricta

```bash
npm run sync-tokens-local --validate
```

Valida:

- Estructura W3C Design Tokens
- Campos requeridos
- Secciones mandatorias
- Integridad de datos

### Opción 4: Vista previa (sin cambios)

```bash
npm run sync-tokens-local --dry-run
```

Simula el proceso sin hacer cambios reales.

---

## 📋 Opciones Completas

```bash
npm run sync-tokens-local [options]

--report           Mostrar estadísticas detalladas
--dry-run          Vista previa sin cambios
--no-validate      Saltar validación
--no-backup        No crear backup
--force            Ignorar errores de validación
--help             Mostrar ayuda
```

### Combinaciones Útiles

```bash
# Ver stats sin hacer nada
npm run sync-tokens-local --report --dry-run

# Cargar y validar estrictamente
npm run sync-tokens-local --validate --force

# Cargar sin backup (desarrollo rápido)
npm run sync-tokens-local --no-backup

# Cargar todo sin validación
npm run sync-tokens-local --no-validate --no-backup --dry-run
```

---

## 🔄 Flujo de Trabajo Recomendado

### Scenario 1: Después de extraer desde Figma Console

```bash
# 1. Extrae JSON desde Figma Console
# (Ver: TOKENS_MCP_GUIDE.md)

# 2. Copia el JSON a tokens/figma-tokens.json

# 3. Valida la carga
npm run sync-tokens-local --report

# 4. Si todo está bien, sincroniza
npm run sync-tokens -- --skip-figma

# 5. Verifica cambios
git diff src/tokens/

# 6. Commit y push
git add . && git commit -m "Update design tokens" && git push
```

### Scenario 2: Desarrollo local iterativo

```bash
# Durante desarrollo, usa local para rapidez
npm run sync-tokens-local --dry-run

# Cuando estés seguro, sincroniza
npm run sync-tokens-local
npm run sync-tokens -- --skip-figma

# Valida transformación
npm run validate-tokens
```

### Scenario 3: CI/CD pipeline

```bash
# En tu GitHub Actions o similar:
npm run sync-tokens-local --validate
npm run sync-tokens -- --skip-figma
npm run validate-tokens
npm run validate-components
```

---

## 📊 Entender el Output

### Salida Básica

```
📄 Loading tokens from local file...

✓ Loaded tokens/figma-tokens.json
✓ Tokens structure is valid ✓
✓ Backup created

✅ Local token load complete!

Tokens are ready for transformation.
Next: npm run sync-tokens -- --skip-figma

Next steps:
  1. Review tokens: npm run sync-tokens-local --report
  2. Transform: npm run sync-tokens -- --skip-figma
  3. Validate: npm run validate-tokens
  4. Commit: git add . && git commit
```

### Con `--report`

```
📊 Token Statistics:

Primitives:
  color: 660
  dimension: 53
  Total: 713

Semantic - Light:
  color: 52
  Total: 52

Semantic - Dark:
  color: 52
  Total: 52

Grand Total: 817 tokens

📋 Metadata:

Source: Figma (Console MCP)
File Key: abc123xyz456
Version: 1.0.0
Extracted: 2026-01-29T19:45:00Z

📈 Changes from previous version:

Previous: 800 tokens
Current:  817 tokens
Change:   +17 tokens
```

---

## 🔍 Validación

El script valida automáticamente:

✓ Estructura W3C Design Tokens
✓ Campos metadata requeridos
✓ Secciones primitives/semantic
✓ Modos light/dark
✓ Presencia de tokens

Si hay errores:

```bash
# Saltarlos forzadamente
npm run sync-tokens-local --force

# O revisarlos
npm run sync-tokens-local --validate
```

---

## 💾 Backups

Automáticamente se crean:

1. **`.figma-tokens.prev.json`** - Último backup
2. **`.backups/figma-tokens-TIMESTAMP.json`** - Histórico con timestamp

```bash
# Ver backups
ls -la tokens/.backups/

# Restaurar versión anterior
cp tokens/.figma-tokens.prev.json tokens/figma-tokens.json
npm run sync-tokens-local
```

---

## 🆚 Comparativa: Local vs REST API vs Console MCP

| Aspecto        | sync-tokens (REST) | sync-tokens-local | sync-figma-tokens-mcp |
| -------------- | ------------------ | ----------------- | --------------------- |
| Origen         | API Figma          | Archivo local     | Console Figma         |
| Requisitos     | Enterprise         | Ninguno           | Ninguno               |
| Velocidad      | Lenta (network)    | Rápida            | Media (manual)        |
| Offline        | ❌ No              | ✅ Sí             | ❌ No                 |
| CI/CD          | ✅ Ideal           | ✅ Ideal          | ❌ Requiere navegador |
| Setup          | Complejo           | Simple            | Manual                |
| Automatización | Completa           | Parcial           | Manual                |

---

## 📝 Estructura Esperada

Tu `tokens/figma-tokens.json` debe tener:

```json
{
  "$schema": "https://design-tokens.org/schema.json",
  "$metadata": {
    "source": "Figma (Console MCP)",
    "fileKey": "tu_file_key",
    "extractedAt": "2026-01-29T19:45:00Z",
    "version": "1.0.0"
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
  },
  "semantic": {
    "light": {
      "content": {
        "primary": {
          "$value": "#d97706",
          "$type": "color"
        }
      }
    },
    "dark": {
      "content": {
        "primary": {
          "$value": "#ffffff",
          "$type": "color"
        }
      }
    }
  }
}
```

---

## 🆘 Troubleshooting

### "Error: tokens/figma-tokens.json not found"

```bash
# Necesitas crear este archivo primero
# Opción 1: Desde Figma Console
npm run sync-tokens -- --mcp

# Opción 2: Manual desde Figma
# Ver: TOKENS_MCP_GUIDE.md

# Opción 3: De un backup
cp tokens/.figma-tokens.prev.json tokens/figma-tokens.json
npm run sync-tokens-local
```

### "Validation errors found"

```bash
# Revisar estructura
npm run sync-tokens-local --validate

# O forzar ignorando errores
npm run sync-tokens-local --force

# O manualmente verificar el JSON
cat tokens/figma-tokens.json | jq .
```

### "No changes detected"

Esto es normal si no has actualizado tokens en Figma. Para forzar:

```bash
npm run sync-tokens -- --skip-figma --force
```

### "Backup failed"

```bash
# Continuar sin backup
npm run sync-tokens-local --no-backup
```

---

## ⚡ Workflow Rápido

Para máxima velocidad en desarrollo:

```bash
# 1. Extrae una sola vez desde Figma
# (Ver TOKENS_MCP_GUIDE.md)

# 2. De ahora en adelante usa local (muy rápido)
npm run sync-tokens-local --no-validate --no-backup

# 3. Cuando publiques, haz validación completa
npm run sync-tokens-local --report --validate
npm run sync-tokens -- --skip-figma
npm run validate-tokens
```

---

## 🔗 Integración con Otros Scripts

```bash
# Flujo completo: Local → Transform → Validate
npm run sync-tokens-local && \
npm run sync-tokens -- --skip-figma && \
npm run validate-tokens

# Con report previo
npm run sync-tokens-local --report && \
npm run sync-tokens -- --skip-figma && \
npm run validate-components
```

---

## 📚 Relación con Otros Scripts

```
sync-tokens.ts (Orquestador)
├── sync-figma-tokens.ts (REST API - ❌ Bloqueado)
├── sync-figma-tokens-mcp.ts (Console MCP - Manual)
└── sync-figma-tokens-local.ts (Archivo local - ✅ Recomendado para CI/CD)
```

### Qué usar cuándo:

- **`sync-tokens`** - Flujo completo con todas las opciones
- **`sync-tokens-local`** - Desarrollo rápido, CI/CD
- **`sync-figma-tokens-mcp`** - Cuando necesites actualizar desde Figma
- **`sync-figma-tokens`** - Solo si tienes plan Enterprise (sin problemas)

---

## 💡 Tips Profesionales

### 1. Alias en `.bashrc` o `.zshrc`

```bash
alias sync-tokens-quick="npm run sync-tokens-local --no-validate --no-backup"
alias sync-tokens-strict="npm run sync-tokens-local --report --validate"
```

### 2. Pre-commit hook

Agregar a `.husky/pre-commit`:

```bash
npm run sync-tokens-local --validate
```

### 3. GitHub Actions

```yaml
- name: Sync tokens
  run: npm run sync-tokens-local --validate
```

### 4. Testing local

```bash
# Validar estructura sin cambios
npm run sync-tokens-local --dry-run --report

# Luego transformar
npm run build-tokens
```

---

## ✅ Checklist: Primeras 5 Minutos

- [ ] Lee esta guía (3 min)
- [ ] Ejecuta: `npm run sync-tokens-local --report` (1 min)
- [ ] Entiende el output (1 min)
- [ ] ¡Listo para usar!

---

**Última actualización:** 29 Jan 2026
**Status:** ✅ Ready for Production
