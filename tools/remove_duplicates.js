const fs = require('fs');
const path = require('path');

const reactionsFile = path.join(__dirname, '../reactions.js');
let content = fs.readFileSync(reactionsFile, 'utf-8');

// Extract the object content
// We need to parse the object again.
// Since it's a JS file with `window.REACTION_DB_EXTENDED = { ... };`, we can try to extract the JSON part.
// However, the object keys might not be quoted, and values might be strings.
// A regex approach or a safe eval might be needed.
// Given strict structure from previous merges, we can try to just regex the blocks.

// Better approach:
// 1. match the `window.REACTION_DB_EXTENDED = {` -> `};` block.
// 2. Evaluate it in a sandbox or just regex parse specific fields if structure is consistent.
// Since I generated the file, the structure is likely consistent JSON-like inside the JS assignment.

// Actually, `reactions.js` is now a mix of original handwritten JS and my JSON merge.
// The original handwritten part has comments and unquoted keys?
// Let's check the file content first.

// If I can't easily parse it as JSON, I will load it effectively as a module or string parsing.

// Strategy:
// 1. Read file.
// 2. Use a regex to identify every reaction entry block `key: { ... },`
// 3. Extract the `smarts` field from each block.
// 4. Keep track of seen smarts.
// 5. If smarts is seen, mark this key for deletion.
// 6. Reconstruct the file excluding the deleted blocks.

// Regex for reaction block:
// /^\s*"([\w_]+)":\s*\{[\s\S]*?\},\s*$/gm
// But keys might be unquoted in the original file.
// Let's check `reactions.js` content from previous turn.
// Original file had quoted keys: `"alkene_addition_br2": {`
// My merged content had quoted keys: `"alkene_gen_1": {`
// So quoted keys are consistent.

const dbRegex = /window\.REACTION_DB_EXTENDED\s*=\s*\{([\s\S]*?)\n\};/m;
const match = content.match(dbRegex);

if (!match) {
    console.error("Could not find DB object");
    process.exit(1);
}

const dbContent = match[1];

// Split by top-level commas.
// Since it's nested objects, we can't just split by comma.
// We can use a regex that matches `  "key": { ... }` which usually ends with `  },` or `  }`.

// Let's parse strictly line by line or block by block.
// Each block starts with `  "key": {` and ends with `  }` or `  },`.

const blocks = [];
let buffer = [];
let braceCount = 0;
let inBlock = false;
let currentKey = null;

const lines = dbContent.split('\n');

for (const line of lines) {
    if (line.trim().startsWith('//')) {
         // preserve top level comments? or attach to next block?
         // For now, let's just accumulate them in buffer if they are part of the block structure?
         // If we are deleting a block, we might delete associated comments.
         if (!inBlock) {
             buffer.push({ type: 'comment', text: line });
         } else {
             buffer[buffer.length - 1].text += '\n' + line;
         }
         continue;
    }

    // specific check for key start
    const keyMatch = line.match(/^\s*"?([\w_]+)"?:\s*\{/);
    if (keyMatch) {
        currentKey = keyMatch[1];
        inBlock = true;
        braceCount = 1; // We found one opening brace
        
        // Check if there was a preceding comment stored in buffer as a separate item
        // We want to group it.
        // Actually, just pushing the raw string "lines" blocks is easier.
        const entry = {
            key: currentKey,
            lines: [line],
            smarts: null
        };
        blocks.push(entry);
    } else if (inBlock) {
        blocks[blocks.length - 1].lines.push(line);
        
        // Count braces to find end
        // Simple heuristic: count { and }
        const open = (line.match(/\{/g) || []).length;
        const close = (line.match(/\}/g) || []).length;
        braceCount += open - close;
        
        // Extract smarts if present
        const smartsMatch = line.match(/^\s*smarts:\s*"(.*)",?/); 
        // Note: original file used `smarts: "..."`, my merge used `"smarts": "..."`
        const smartsMatchJson = line.match(/^\s*"smarts":\s*"(.*)",?/);
        
        if (smartsMatch) blocks[blocks.length - 1].smarts = smartsMatch[1];
        if (smartsMatchJson) blocks[blocks.length - 1].smarts = smartsMatchJson[1];

        if (braceCount === 0) {
            inBlock = false;
        }
    } else {
        // Outside of blocks (whitespace, global comments)
        buffer.push({ type: 'raw', text: line });
    }
}

// Deduplication
const seenSmarts = new Set();
const uniqueBlocks = [];
const duplicateKeys = [];

// There might be raw text between blocks (commas, newlines).
// The logic above separates specific reaction blocks from "everything else".
// But we need to reconstruct the file.
// Let's refine: We iterate the file, if we find a block, we decide to keep or drop.

// Actually, simpler:
// Regex to capture full entry:
// `\s*"?([\w_]+)"?:\s*\{[\s\S]*?smarts:\s*"([^"]+)"[\s\S]*?\}(,|)`
// This is risky if `smarts` is not in specific order.

// Back to line iteration, but keeping strict file order.
const outputLines = [];
let currentBlock = null;

// Re-read file lines
const fileLines = content.split('\n');
// We only care about the content inside `window.REACTION_DB_EXTENDED`.
// Finding start and end line indices.

let startLine = -1;
let endLine = -1;

for (let i = 0; i < fileLines.length; i++) {
    if (fileLines[i].includes('window.REACTION_DB_EXTENDED = {')) startLine = i;
    if (startLine !== -1 && fileLines[i].trim() === '};') {
        endLine = i;
        break;
    }
}

if (startLine === -1 || endLine === -1) {
     console.error("Bounds not found");
     process.exit(1);
}

// Pre-scan existing smarts
// We want to keep the *first* occurrence? Or the existing ones (top of file)?
// Usually top of file are hand-curated, bottom are generated.
// So we keep first seen.

const preservedContent = []; // List of string chunks (lines)

let skipBlock = false;
let blockBuffer = [];
let braces = 0;
let currentSmarts = null;

for (let i = startLine + 1; i < endLine; i++) {
    const line = fileLines[i];
    
    // Check start of object
    if (line.match(/^\s*"?([\w_]+)"?:\s*\{/)) {
        // Start of a block
        blockBuffer = [line];
        braces = 1;
        currentSmarts = null;
        skipBlock = false;
        
        // try fast check smarts in this line? unlikely
    } else if (braces > 0) {
        blockBuffer.push(line);
        
        // Check smarts
        const sMatch = line.match(/smarts"?:\s*"(.*)"/);
        if (sMatch) currentSmarts = sMatch[1].trim(); // trim checks

        braces += (line.match(/\{/g) || []).length;
        braces -= (line.match(/\}/g) || []).length;
        
        if (braces === 0) {
            // End of block
            // Check duplicate
            if (currentSmarts && seenSmarts.has(currentSmarts)) {
                // Duplicate!
                // Don't add to preservedContent
                // We also need to handle the comma of the *previous* block if this one is removed?
                // Or easier: Re-join all blocks with commas later?
                // `reactions.js` is an object, so commas are needed.
                console.log(`Removing duplicate: ${sMatch ? sMatch[1] : 'unknown'}`);
            } else {
                if (currentSmarts) seenSmarts.add(currentSmarts);
                preservedContent.push(blockBuffer.join('\n'));
            }
            blockBuffer = [];
        }
    } else {
        // Comments, whitespace between blocks
        // Only keep if meaningful?
        // safer to keep
        if (line.trim().length > 0 && !line.trim().startsWith('//')) {
             // likely just structual clutter or comments we want to preserve?
        }
        // Actually, logic is tricky with mixed comments. 
        // Best to just regenerate the body from extracted blocks.
    }
}

// Re-assemble
// Join blocks with commas and newlines.
const newBody = preservedContent.join(',\n');

const finalContent = fileLines.slice(0, startLine + 1).join('\n') + '\n' + newBody + '\n' + fileLines.slice(endLine).join('\n');

fs.writeFileSync(reactionsFile, finalContent, 'utf-8');
console.log(`Deduplication complete. kept ${seenSmarts.size} unique reactions.`);
