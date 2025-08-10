import { principles } from '../src/data/principles';

/**
 * Migration completed! This script is now deprecated.
 * The principle data has been successfully moved to JSON translation files.
 */
function extractPrincipleData() {
  console.log('Migration completed! Principle data is now in JSON translation files:');
  console.log('- src/messages/en.json');
  console.log('- src/messages/zh.json');
  console.log('');
  console.log('Current principles structure:');
  principles.forEach(principle => {
    console.log(`- Principle ${principle.id}: ${principle.messageKey} (stage ${principle.stage})`);
  });
}

// Create the structure for the migration plan
function createPrincipleStructure() {
  const structure = principles.map(principle => ({
    id: principle.id,
    stage: principle.stage,
    messageKey: principle.messageKey
  }));

  console.log('Current principle structure (post-migration):');
  console.log(JSON.stringify(structure, null, 2));
  return structure;
}

// Run the extraction
if (require.main === module) {
  console.log('=== Extracting Principle Data for i18n Migration ===\n');
  extractPrincipleData();
  console.log('\n\n=== Principle Structure ===\n');
  createPrincipleStructure();
}

export { extractPrincipleData, createPrincipleStructure };