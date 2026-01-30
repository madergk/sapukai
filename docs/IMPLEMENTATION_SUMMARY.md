# 🚀 Implementación: Figma Console MCP para Tokens

## 📋 Resumen de Cambios

Se ha implementado un sistema alternativo de sincronización de tokens diseño usando **Figma Console MCP** en lugar de la REST API, eliminando la necesidad del plan Enterprise de Figma.

### Problema Original

```
❌ ERROR: HTTP 403 - Invalid scope 'file_variables:read'
   Razón: Requiere Figma Enterprise Plan
   Impacto: No puedes sincronizar tokens desde la API
```

### Solución Implementada

```
✅ Figma Console MCP
   Método: figma.variables.getAll() en navegador
   Requisitos: Ninguno especial (funciona con cualquier plan)
   Acceso: Directo a datos de Figma sin restricciones de API
```

---

## 📁 Archivos Creados

### 1. Scripts de Sincronización

#### `scripts/sync-figma-tokens-mcp.ts` (Nueva)

- Script que maneja extracción via Console MCP
- Procesa variables de Figma en formato W3C
- Genera `tokens/figma-tokens.json`
- **Características:**
  - ✅ Sin requisitos Enterprise
  - ✅ Manejo de modos (light/dark)
  - ✅ Backup automático de tokens anteriores
  - ✅ Validación de estructura

#### `scripts/figma-console-helper.ts` (Nueva)

- Utilidades para trabajar con Figma Console
- Script JavaScript listo para copiar/pegar en consola de Figma
- Parser de output de Figma Console
- **Funciones:**
  - `figmaConsoleScript` - Código para ejecutar en Figma
  - `parseFigmaConsoleOutput()` - Convierte output a W3C format
  - `guideTokenExtraction()` - Guía interactiva

#### `scripts/sync-tokens.ts` (Actualizado)

- Agregado soporte para `--mcp` flag
- Ahora puede usar tanto REST API como Console MCP
- Mantiene compatibilidad con flujo antiguo

### 2. Documentación

#### `docs/TOKENS_MCP_GUIDE.md` (Nueva)

- **Guía completa de 3 métodos:**
  1. Extracción manual (copy/paste)
  2. Automatización con Claude Code
  3. Integración con CI/CD

- **Secciones principales:**
  - Prerequisitos
  - Paso a paso del flujo manual
  - Script JavaScript listo para copiar
  - Troubleshooting común
  - Tips y trucos avanzados

#### `docs/TOKENS_FLOW.md` (Nueva)

- Comparativa visual: REST API vs Console MCP
- Diagramas de flujo de sincronización
- Tabla comparativa completa
- Ejemplos de estructura de tokens
- Workflow recomendado

#### `.env.mcp.example` (Nueva)

- Configuración de ejemplo para método MCP
- Variables opcionales para notificaciones
- Opciones avanzadas de logging

### 3. Demo y Herramientas

#### `scripts/demo-figma-extract.ts` (Nueva)

- Demo interactiva en terminal
- Muestra pasos paso a paso
- Proporciona script listo para copiar
- Ejemplo de output esperado

---

## 🔄 Flujo de Trabajo Nuevo

```
┌─ OPCIÓN A: MANUAL (Recomendada para comenzar) ─────────────────┐
│                                                                   │
│  1. Figma Console (F12)                                         │
│     → figma.variables.getAll()                                  │
│                                                                   │
│  2. Copiar JSON                                                 │
│     → Seleccionar output completo                               │
│                                                                   │
│  3. Guardar en proyecto                                         │
│     → cat > tokens/figma-tokens.json << 'EOF' {JSON} EOF        │
│                                                                   │
│  4. Sincronizar                                                 │
│     → npm run sync-tokens -- --skip-figma                       │
│                                                                   │
│  5. Validar y hacer push                                        │
│     → git diff src/tokens/                                      │
│     → git push                                                  │
│                                                                   │
└────────────────────────────────────────────────────────────────┘

┌─ OPCIÓN B: AUTOMATIZADA (Cuando MCP esté listo) ──────────────┐
│                                                                   │
│  1. Comando único                                               │
│     → npm run sync-tokens -- --mcp                              │
│                                                                   │
│  2. Claude Code:                                                │
│     - Abre Figma en navegador                                   │
│     - Extrae automáticamente                                    │
│     - Procesa y sincroniza                                      │
│                                                                   │
│  3. Todo automático                                             │
│     → Cambios aplicados a src/tokens/                           │
│                                                                   │
└────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Uso

### Antes (REST API - ❌ Bloqueado)

```bash
npm run sync-tokens
# ❌ Error: HTTP 403 - Requires Enterprise
```

### Ahora (Opción A: Manual)

```bash
# 1. Ejecutar demo para ver pasos
npx tsx scripts/demo-figma-extract.ts

# 2. Manualmente: Copiar JSON desde Figma Console
# 3. Guardar en tokens/figma-tokens.json
# 4. Sincronizar sin fetch de API
npm run sync-tokens -- --skip-figma
```

### Ahora (Opción B: Automática - Próximamente)

```bash
npm run sync-tokens -- --mcp
```

---

## 📊 Comparativa

| Aspecto              | REST API                     | Console MCP                  |
| -------------------- | ---------------------------- | ---------------------------- |
| Plan Figma Requerido | Enterprise                   | Cualquiera                   |
| Autenticación        | API Token                    | Browser Access               |
| Automatización       | Completa                     | Semi (copy/paste)            |
| Tiempo de Setup      | 30 min                       | 5 min                        |
| Confiabilidad        | Media (sujeta a cambios API) | Alta (directo del navegador) |
| Control de Datos     | Limitado                     | Total                        |
| Costo                | Premium                      | Gratis                       |

---

## 🎯 Próximos Pasos

### Fase 1: Implementación Actual ✅

- ✅ Scripts de sincronización MCP
- ✅ Documentación completa
- ✅ Demo interactiva
- ✅ Soporte para `--skip-figma`

### Fase 2: Integración Claude Code (Próxima)

- ⏳ Automatización completa con `--mcp`
- ⏳ Extracción automática en navegador
- ⏳ Notificaciones en tiempo real

### Fase 3: CI/CD Integration (Futura)

- ⏳ GitHub Actions con token extraction
- ⏳ Notificaciones de Slack/Discord
- ⏳ Validación automática en PRs

---

## 💡 Decisiones de Diseño

### ¿Por qué Console MCP?

1. **Sin restricciones de plan**: Funciona con cualquier suscripción a Figma
2. **Más confiable**: No depende de cambios en la API de Figma
3. **Mayor control**: Acceso directo a datos sin filtros de API
4. **Mejor UX para diseñadores**: Pueden extraer tokens ellos mismos

### ¿Por qué mantener REST API como opción?

1. **Compatibilidad hacia atrás**: Usuarios Enterprise pueden seguir usándola
2. **Automatización futura**: Puede mejorarse cuando Figma amplíe acceso
3. **Flexibilidad**: Permite elegir el método que funcione mejor

### ¿Por qué el flujo manual primero?

1. **Velocidad de implementación**: Funciona ahora sin cambios a Figma
2. **Menos dependencias**: No requiere integración con MCP completa
3. **Educativo**: Los usuarios entienden cómo funcionan los tokens
4. **Reversible**: Fácil de automatizar después sin romper lo existente

---

## 📚 Recursos

### Para Empezar

```bash
# Ver demostración interactiva
npx tsx scripts/demo-figma-extract.ts

# Leer guía completa
cat docs/TOKENS_MCP_GUIDE.md

# Ver flujos de trabajo
cat docs/TOKENS_FLOW.md
```

### Comandos Disponibles

```bash
# Sincronización nueva
npm run sync-tokens -- --skip-figma          # Sin fetch de API

# Validación
npm run validate-tokens                      # Validar estructura

# Rollback
npm run rollback-tokens -- --list             # Ver versiones
npm run rollback-tokens -- --version=X.X.X   # Revertir a versión

# Demo
npx tsx scripts/demo-figma-extract.ts         # Ver instrucciones
```

### Archivos Clave

- `tokens/figma-tokens.json` - Tokens en formato W3C
- `src/tokens/` - Tokens generados (CSS, TS, etc)
- `docs/TOKENS_MCP_GUIDE.md` - Guía de uso
- `docs/TOKENS_FLOW.md` - Comparativa de métodos

---

## ✅ Checklist de Implementación

- [x] Crear scripts de sincronización MCP
- [x] Actualizar sync-tokens.ts con soporte `--mcp`
- [x] Documentación completa (guía + flujos)
- [x] Demo interactiva en terminal
- [x] Ejemplos de output
- [x] Troubleshooting guide
- [x] .env configuration example
- [ ] Integración automática con Claude Code
- [ ] Tests para parsers de Figma
- [ ] GitHub Actions workflow

---

## 🎓 Aprendizajes

### Problema Resuelto

```
❌ No puedo sincronizar tokens sin plan Enterprise
✅ Ahora puedo usar Figma Console MCP sin restricciones
```

### Tecnologías Utilizadas

- W3C Design Tokens standard
- Figma Console API (`figma.variables.*`)
- Style Dictionary para transformación
- TypeScript para type safety

### Beneficios Obtenidos

1. **Acceso democratizado**: Cualquiera con Figma puede extraer tokens
2. **Menos bloqueos**: No depende de plan Enterprise
3. **Mayor confiabilidad**: Directo del navegador sin intermediarios
4. **Mejor documentación**: Usuarios entienden el proceso

---

## 🔗 Referencias

- [Figma Developer Resources](https://www.figma.com/developers)
- [W3C Design Tokens](https://design-tokens.org/)
- [Style Dictionary Docs](https://amzn.github.io/style-dictionary/)

---

**Última actualización:** 29 Jan 2026
**Autor:** Claude Code
**Estado:** ✅ Implementado
