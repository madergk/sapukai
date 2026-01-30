#!/usr/bin/env tsx
/**
 * Demo: Figma Token Extraction
 * Shows how to use Figma Console to extract variables
 */

import chalk from 'chalk'

function main() {
  console.clear()
  console.log(chalk.blue.bold('\n╔════════════════════════════════════════════════════════════╗'))
  console.log(chalk.blue.bold('║   🎨 Figma Token Extraction - Console MCP Demo             ║'))
  console.log(chalk.blue.bold('╚════════════════════════════════════════════════════════════╝\n'))

  console.log(chalk.cyan('📌 Paso 1: Abre tu archivo de Figma en el navegador'))
  console.log(chalk.gray('   URL: https://www.figma.com/design/{FIGMA_FILE_KEY}/...\n'))

  console.log(chalk.cyan('📌 Paso 2: Abre la consola de desarrollador'))
  console.log(chalk.gray('   Mac: Cmd + Option + J'))
  console.log(chalk.gray('   Windows/Linux: Ctrl + Shift + J\n'))

  console.log(chalk.cyan('📌 Paso 3: Copia y pega este script en la consola:\n'))

  const script = `
// 🎨 Figma Token Extractor
(async function extractFigmaTokens() {
  const spinner = (msg) => console.log('⏳', msg);
  spinner('Extrayendo tokens de Figma...');

  try {
    // Obtener todas las variables
    const allVariables = figma.variables.getAll();
    spinner(\`✅ Encontradas \${allVariables.length} variables\`);

    // Obtener colecciones
    const collections = figma.variables.getLocalVariableCollections();
    spinner(\`✅ Encontradas \${collections.length} colecciones\`);

    // Organizar por colección
    const tokensByCollection = {};
    for (const variable of allVariables) {
      if (variable.hiddenFromPublishing) continue;

      const colId = variable.variableCollectionId;
      if (!tokensByCollection[colId]) {
        tokensByCollection[colId] = [];
      }

      tokensByCollection[colId].push({
        name: variable.name,
        type: variable.resolvedType,
        description: variable.description,
        valuesByMode: variable.valuesByMode,
      });
    }

    // Crear output
    const output = {
      timestamp: new Date().toISOString(),
      fileKey: figma.fileKey,
      fileName: figma.root.name,
      collections: collections.reduce((acc, col) => ({
        ...acc,
        [col.id]: {
          name: col.name,
          modes: col.modes,
        }
      }), {}),
      tokens: tokensByCollection,
    };

    console.log('\\n✅ Extracción completada!\\n');
    console.log('📋 Copia este JSON:\\n');
    console.log(JSON.stringify(output, null, 2));
    console.log('\\n💾 Guárdalo en: tokens/figma-tokens.json');

    return output;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
`

  console.log(chalk.yellow(script))

  console.log(chalk.cyan('\n📌 Paso 4: Presiona Enter y copia el JSON que aparece\n'))

  console.log(chalk.cyan('📌 Paso 5: Guarda el JSON en tu proyecto\n'))
  console.log(chalk.gray('   Abre tu editor y crea/actualiza: tokens/figma-tokens.json'))
  console.log(chalk.gray('   Pega todo el JSON ahí\n'))

  console.log(chalk.cyan('📌 Paso 6: Sincroniza los tokens\n'))
  console.log(chalk.yellow('   npm run token:sync -- --source=local\n'))

  console.log(chalk.green.bold('✨ ¡Listo! Tus tokens serán procesados y sincronizados.\n'))

  console.log(chalk.blue.bold('═══════════════════════════════════════════════════════════\n'))

  // Show quick reference
  console.log(chalk.cyan('📚 Comandos Disponibles:\n'))
  console.log(chalk.gray('  npm run token:sync -- --source=local'))
  console.log(chalk.gray('    → Sincroniza sin intentar fetch de API\n'))

  console.log(chalk.gray('  npm run token:sync -- --source=local --dry-run'))
  console.log(chalk.gray('    → Simula cambios sin aplicarlos\n'))

  console.log(chalk.gray('  npm run token:postprocess'))
  console.log(chalk.gray('    → Reporte + docs + Storybook\n'))

  console.log(chalk.gray('  npm run rollback-tokens -- --list'))
  console.log(chalk.gray('    → Ver versiones anteriores\n'))

  // Show example output
  console.log(chalk.blue.bold('═══════════════════════════════════════════════════════════\n'))
  console.log(chalk.cyan('📊 Ejemplo de Output Esperado:\n'))

  const exampleOutput = {
    timestamp: '2026-01-29T19:45:00Z',
    fileKey: 'abc123xyz456',
    fileName: 'Sapukai Design System',
    collections: {
      col1: {
        name: 'Primitives',
        modes: [{ modeId: 'm1', name: 'Default' }],
      },
      col2: {
        name: 'Semantic',
        modes: [
          { modeId: 'm2', name: 'Light' },
          { modeId: 'm3', name: 'Dark' },
        ],
      },
    },
    tokens: {
      col1: [
        {
          name: 'colors/blue/500',
          type: 'COLOR',
          valuesByMode: {
            m1: { r: 0.235, g: 0.522, b: 0.957 },
          },
        },
        {
          name: 'spacing/4',
          type: 'FLOAT',
          valuesByMode: {
            m1: 16,
          },
        },
      ],
      col2: [
        {
          name: 'content/primary',
          type: 'COLOR',
          valuesByMode: {
            m2: { r: 0.855, g: 0.467, b: 0.024 }, // Light
            m3: { r: 1, g: 1, b: 1 }, // Dark
          },
        },
      ],
    },
  }

  console.log(chalk.yellow(JSON.stringify(exampleOutput, null, 2)))

  console.log(chalk.blue.bold('\n═══════════════════════════════════════════════════════════\n'))
  console.log(chalk.green('✅ Para empezar:'))
  console.log(chalk.gray('  1. Copia el script de arriba'))
  console.log(chalk.gray('  2. Abre tu archivo Figma en navegador'))
  console.log(chalk.gray('  3. F12 → Console → Pega y presiona Enter'))
  console.log(chalk.gray('  4. Copia el JSON resultante'))
  console.log(chalk.gray('  5. Guarda en tokens/figma-tokens.json'))
  console.log(chalk.gray('  6. npm run token:sync -- --source=local\n'))

  console.log(chalk.cyan('📖 Documentación completa en: docs/TOKENS_MCP_GUIDE.md\n'))
}

main()
