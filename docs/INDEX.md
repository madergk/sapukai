# 📚 Índice de Documentación - Figma Console MCP

## 🚀 Comienza Aquí

### ⚡ [QUICKSTART_MCP.md](../QUICKSTART_MCP.md) - 5 Minutos

**Para:** Usuarios que quieren empezar YA

- Guía paso a paso en 5 pasos
- Script listo para copiar/pegar
- Comandos esenciales
- FAQs rápidas

**Tiempo:** ~5 minutos

---

## 📖 Documentación Completa

### 0. 📘 [SYNC_LOCAL_GUIDE.md](./SYNC_LOCAL_GUIDE.md)

**Para:** Desarrollo rápido y CI/CD

- Carga tokens desde archivo local
- Sin fetch de API o Figma
- Validación y backups automáticos
- Ideal para pipelines

**Tiempo:** ~5 minutos

---

### 1. 📘 [TOKENS_MCP_GUIDE.md](./TOKENS_MCP_GUIDE.md)

**Para:** Usuarios que quieren entender TODO

- Prerequisitos detallados
- 3 métodos de extracción (Manual, Automático, CI/CD)
- Script JavaScript comentado
- Estructura de tokens explicada
- Troubleshooting completo
- Tips y trucos avanzados
- Referencias útiles

**Incluye:** Ejemplos completos, validación, exportación personalizada

---

### 2. 🔄 [TOKENS_FLOW.md](./TOKENS_FLOW.md)

**Para:** Usuarios que quieren comparar métodos

- Diagrama visual: REST API vs Console MCP
- Tabla comparativa detallada
- Flujos de sincronización
- Ejemplo de transformación
- Workflow recomendado

**Incluye:** Ventajas/desventajas, flujos de CI/CD, arquitectura

---

### 3. 🔧 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

**Para:** Developers técnicos

- Resumen de cambios realizados
- Archivos creados/actualizados
- Decisiones de diseño
- Checklist de implementación
- Aprendizajes y referencias

**Incluye:** Detalles técnicos, arquitectura, próximas fases

---

## 🗂️ Estructura de Archivos

```
proyecto/
├── 📘 QUICKSTART_MCP.md                    ← EMPIEZA AQUÍ
├── 📘 docs/
│   ├── INDEX.md (este archivo)
│   ├── TOKENS_MCP_GUIDE.md                 ← Guía completa
│   ├── TOKENS_FLOW.md                      ← Comparativa
│   └── IMPLEMENTATION_SUMMARY.md            ← Detalles técnicos
│
├── 🔧 scripts/
│   ├── tokens/                             ← Orquestación tokens
│   │   ├── sync.ts                         ← Orquestador
│   │   └── sources/figma-mcp.ts            ← Script MCP
│   ├── figma-console-helper.ts             ← Helpers
│   └── demo-figma-extract.ts               ← Demo interactiva
│
├── 📋 .env.mcp.example                     ← Configuración
└── 🎨 tokens/
    └── figma-tokens.json                   ← Tokens W3C
```

---

## 🎯 Guía de Navegación

### "Necesito empezar AHORA"

→ [QUICKSTART_MCP.md](../QUICKSTART_MCP.md)

### "Quiero entender el proceso completo"

→ [TOKENS_MCP_GUIDE.md](./TOKENS_MCP_GUIDE.md)

### "¿Cuál es mejor: REST API o Console MCP?"

→ [TOKENS_FLOW.md](./TOKENS_FLOW.md)

### "Quiero ver los detalles técnicos"

→ [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

### "Necesito ayuda visual"

→ `npx tsx scripts/demo-figma-extract.ts`

---

## 📊 Comparativa Rápida de Documentos

| Doc                    | Tiempo | Tipo        | Público    |
| ---------------------- | ------ | ----------- | ---------- |
| SYNC_LOCAL_GUIDE       | 5 min  | Acción      | Todos      |
| QUICKSTART             | 5 min  | Acción      | Todos      |
| TOKENS_MCP_GUIDE       | 20 min | Tutorial    | Todos      |
| TOKENS_FLOW            | 15 min | Explicación | Técnico    |
| IMPLEMENTATION_SUMMARY | 30 min | Referencia  | Developers |

---

## 🔄 Flujos Principales

### Flujo Manual (Recomendado)

```
1. Leer QUICKSTART_MCP.md
2. Ejecutar demo-figma-extract.ts
3. Copiar script a Figma Console
4. Pegar JSON en tokens/figma-tokens.json
5. npm run token:sync -- --source=local
```

### Flujo Automatizado (Próximamente)

```
1. npm run token:sync -- --source=mcp
2. Claude Code hace el rest
```

---

## 📚 Recursos por Rol

### Para Diseñadores

- 📘 [QUICKSTART_MCP.md](../QUICKSTART_MCP.md) - Pasos simples
- 🎨 Script de extracción en TOKENS_MCP_GUIDE

### Para Developers Frontend

- 📘 [TOKENS_FLOW.md](./TOKENS_FLOW.md) - Comparativa
- 🔧 [TOKENS_MCP_GUIDE.md](./TOKENS_MCP_GUIDE.md) - Todo detalle
- ⚙️ Scripts en `scripts/`

### Para Leads/Architects

- 🔧 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Visión general
- 📊 [TOKENS_FLOW.md](./TOKENS_FLOW.md) - Decisiones

### Para DevOps/CI-CD

- 🔄 [TOKENS_FLOW.md](./TOKENS_FLOW.md) - Integración
- 🔧 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Próximas fases

---

## ⚡ Comandos Rápidos

```bash
# Ver demo interactiva
npx tsx scripts/demo-figma-extract.ts

# Leer documentos
cat QUICKSTART_MCP.md                    # Inicio rápido
cat docs/TOKENS_MCP_GUIDE.md             # Guía completa
cat docs/TOKENS_FLOW.md                  # Comparativa
cat docs/IMPLEMENTATION_SUMMARY.md       # Técnico

# Sincronizar tokens
npm run token:sync -- --source=local     # Manual
npm run token:sync -- --source=mcp       # Automático

# Postprocess
npm run token:postprocess                # Reporte + docs

# Rollback
npm run rollback-tokens -- --list        # Ver versiones
npm run rollback-tokens -- --version=X   # Revertir
```

---

## 🆘 Troubleshooting

**"¿Por dónde empiezo?"**
→ QUICKSTART_MCP.md

**"¿Cómo hago X?"**
→ TOKENS_MCP_GUIDE.md (búsqueda por palabra clave)

**"¿Por qué funciona de esta forma?"**
→ TOKENS_FLOW.md o IMPLEMENTATION_SUMMARY.md

**"¿Qué error es este?"**
→ TOKENS_MCP_GUIDE.md → Troubleshooting section

**"¿Necesito ayuda visual?"**
→ Ejecuta: `npx tsx scripts/demo-figma-extract.ts`

---

## 🎓 Estructura Educativa

```
Nivel 1: QUICKSTART (Acción)
  └─ "Hazlo funcionar"

Nivel 2: TOKENS_MCP_GUIDE (Tutorial)
  └─ "Entiende qué haces"

Nivel 3: TOKENS_FLOW (Comparativa)
  └─ "Comprende los tradeoffs"

Nivel 4: IMPLEMENTATION_SUMMARY (Referencia)
  └─ "Domina la arquitectura"
```

---

## 📈 Próximas Mejoras

- [ ] Video tutorial (5 min)
- [ ] Integración GitHub Actions
- [ ] Notificaciones Slack/Discord
- [ ] Dashboard de sincronización
- [ ] Automatización completa con Claude Code

---

## 🔗 Enlaces Útiles

**Documentación Este Proyecto:**

- [SYNC_LOCAL_GUIDE.md](./SYNC_LOCAL_GUIDE.md) - Local file sync (rápido)
- [TOKENS_MCP_GUIDE.md](./TOKENS_MCP_GUIDE.md) - Figma Console extraction
- [TOKENS_FLOW.md](./TOKENS_FLOW.md) - Comparativa de métodos
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Detalles técnicos

**Documentación Oficial:**

- [Figma Developers](https://www.figma.com/developers)
- [W3C Design Tokens](https://design-tokens.org/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)

**En este proyecto:**

- `scripts/` - Scripts de sincronización
- `tokens/` - Archivo de tokens
- `src/tokens/` - Tokens generados

---

## 📝 Cheatsheet

```bash
# Setup
FIGMA_FILE_KEY=tu_key_aqui npm run token:sync -- --source=local

# Uso diario
npm run token:sync -- --source=local       # Sincronizar
npm run token:postprocess                  # Reporte + docs
git diff src/tokens/                       # Ver cambios

# Rollback
npm run rollback-tokens -- --list
npm run rollback-tokens -- --version=0.1.5

# Info
npx tsx scripts/demo-figma-extract.ts      # Ver instrucciones
tsx scripts/tokens/report.ts -- --list     # Listar reportes
```

---

## ✅ Checklist: Primeras 24 Horas

- [ ] Leer QUICKSTART_MCP.md (5 min)
- [ ] Ejecutar `npx tsx scripts/demo-figma-extract.ts` (2 min)
- [ ] Extraer tokens desde Figma Console (5 min)
- [ ] Ejecutar `npm run token:sync -- --source=local` (2 min)
- [ ] Postprocess con `npm run token:postprocess` (2 min)
- [ ] Hacer git push (si todo está bien)
- [ ] Leer TOKENS_FLOW.md para entender mejor (15 min)

**Total: ~30 minutos para estar completamente funcional**

---

## 📞 Soporte

Si tienes preguntas:

1. Busca en la documentación relevante
2. Ejecuta `npx tsx scripts/demo-figma-extract.ts` para ver instrucciones
3. Revisa troubleshooting en TOKENS_MCP_GUIDE.md

---

**Última actualización:** 29 Jan 2026
**Versión:** 1.0.0
**Estado:** ✅ Completo
