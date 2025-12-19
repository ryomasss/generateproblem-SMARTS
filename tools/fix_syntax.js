const fs = require('fs');
const path = require('path');

const reactionsFile = path.join(__dirname, '../reactions.js');
let content = fs.readFileSync(reactionsFile, 'utf-8');

// Fix 1: Remove carriage returns that cause issues
content = content.replace(/\r\n/g, '\n');
content = content.replace(/\r/g, '\n');

// Fix 2: Remove double commas
content = content.replace(/,,+/g, ',');

// Fix 3: Fix `}\r,` -> `},` (already handled by CR removal above, but let's be safe)
content = content.replace(/\}\s*,\s*,/g, '},');

// Fix 4: Remove trailing commas before closing braces (optional, JS allows it but let's clean)
// content = content.replace(/,(\s*\})/g, '$1'); // Commented out: trailing commas in objects are valid in modern JS

// Fix 5: Ensure consistent spacing and newlines between blocks
// This is more complex, for now just focus on syntax errors.

// Fix 6: Remove empty lines between blocks (optional cleanup)
content = content.replace(/\n\n+/g, '\n');

fs.writeFileSync(reactionsFile, content, 'utf-8');
console.log('Fixed syntax errors in reactions.js');
