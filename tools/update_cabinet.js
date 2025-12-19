const fs = require('fs');
const path = require('path');

const reactionsFile = path.join(__dirname, '../reactions.js');
let content = fs.readFileSync(reactionsFile, 'utf-8');

const cabinetStart = content.indexOf('window.CHEMICAL_CABINET_EXTENDED');
if (cabinetStart === -1) {
    console.error('Could not find CHEMICAL_CABINET_EXTENDED');
    process.exit(1);
}

// Find the closing brace for the cabinet
const cabinetEnd = content.indexOf('};', cabinetStart);

if (cabinetEnd === -1) {
    console.error('Could not find closing brace for cabinet');
    process.exit(1);
}

const insertionPoint = cabinetEnd;

// Content to insert
const newCabinetItems = `
  // --- New Categories ---
  ethers: ["COC", "CCOCC", "COc1ccccc1"],
  thiols: ["CS", "CCS", "Sc1ccccc1"],
  cycloalkanes: ["C1CCCCC1", "C1CCCC1"],
  amines: ["CN", "CCN", "Nc1ccccc1"],
  esters: ["CC(=O)OC", "CC(=O)OCC"],
`;

// Check if we need a comma for the previous item
const before = content.substring(0, insertionPoint);
// Find last non-whitespace
let i = before.length - 1;
while (/\s/.test(before[i])) i--;
const needsComma = before[i] !== ',' && before[i] !== '{';

const newContent = before + (needsComma ? ',' : '') + newCabinetItems + content.substring(insertionPoint);

fs.writeFileSync(reactionsFile, newContent, 'utf-8');
console.log('Updated cabinet successfully.');
