const fs = require('fs');
const path = require('path');

// Configuration
const inputFile = path.join(__dirname, '../SMARTS.txt');
const outputFile = path.join(__dirname, '../parsed_reactions.json');

// Category Mapping (Chinese to English)
const categoryMap = {
    '烯烃': 'alkene',
    '炔烃': 'alkyne',
    '醇': 'alcohol',
    '苯及其同系物（吡咯、呋喃、噻吩）': 'benzene',
    '苯及其同系物': 'benzene',
    '醛、酮': 'carbonyl',
    '羧酸': 'acid',
    '卤代烃': 'halide',
    '醚': 'ether',
    '硫醇': 'thiol',
    '环烷烃': 'cycloalkane'
};

// Source mapping based on category
const sourceMap = {
    'alkene': ['alkenes'],
    'alkyne': ['alkynes'],
    'alcohol': ['alcohols'],
    'benzene': ['benzenes'],
    'carbonyl': ['carbonyls'],
    'acid': ['acids'],
    'halide': ['halides'],
    'ether': ['ethers'],
    'thiol': ['thiols'],
    'cycloalkane': ['cycloalkanes']
};

// Main function
function parse() {
    const content = fs.readFileSync(inputFile, 'utf-8');
    const lines = content.split(/\r?\n/);
    
    const reactions = {};
    let currentCategory = 'uncategorized';
    let categoryCounter = {};

    // Helper to find category from line
    function detectCategory(line) {
        // Check exact matches first (longer strings)
        for (const key in categoryMap) {
            if (line === key || line.startsWith(key)) {
                return categoryMap[key];
            }
        }
        return null;
    }

    // Helper to extract comment from line
    // The format is: SMARTS   # Comment
    // OR: SMARTS，# Comment (Chinese comma)
    // OR: SMARTS, # Comment
    // Key insight: The `#` in SMARTS is always attached to atoms (like [C:1]#[C:2])
    // while comment `#` is preceded by whitespace or comma
    function extractSmartsAndComment(line) {
        // First, try to find comment delimiter patterns
        // Pattern 1: `, #` or `,  #` (comma + space + hash)
        // Pattern 2: `，#` (Chinese comma + hash)
        // Pattern 3: Space + `#` (but careful: not inside SMARTS)
        
        // Strategy: Find the LAST occurrence of ` #` or `，#` or `,#`
        // because SMARTS # bonds are like [C:1]#[C:2] (no space before #)
        
        let smarts = line;
        let comment = '';
        
        // Try different comment patterns
        const patterns = [
            /\s+#\s*(.*)$/,      // space(s) + # + comment
            /，\s*#\s*(.*)$/,    // Chinese comma + optional space + # + comment
            /,\s*#\s*(.*)$/,     // English comma + optional space + # + comment
            /\s{2,}(.*)$/        // Multiple spaces followed by Chinese text (fallback)
        ];
        
        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
                const idx = line.lastIndexOf(match[0]);
                smarts = line.substring(0, idx).trim();
                comment = match[1] ? match[1].trim() : '';
                break;
            }
        }
        
        // Clean up smarts: remove trailing commas
        smarts = smarts.replace(/[,，]+$/, '').trim();
        
        return { smarts, comment };
    }

    // Extract search_smarts from the reaction SMARTS
    // Returns: { patterns: [...], reactant_info: [{smarts, count}, ...] }
    function extractSearchSmarts(smarts) {
        // SMARTS format: Reactant1.Reactant2>>Product
        const arrowIdx = smarts.indexOf('>>');
        if (arrowIdx === -1) return { patterns: [], reactant_info: [] };
        
        const reactantsBlock = smarts.substring(0, arrowIdx).trim();
        
        // Split by `.` but be careful with nested structures
        // Simple approach: split by `.` that's not inside brackets
        const reactants = [];
        let current = '';
        let bracketDepth = 0;
        
        for (let i = 0; i < reactantsBlock.length; i++) {
            const char = reactantsBlock[i];
            if (char === '[' || char === '(') bracketDepth++;
            else if (char === ']' || char === ')') bracketDepth--;
            else if (char === '.' && bracketDepth === 0) {
                if (current.trim()) reactants.push(current.trim().replace(/\s+/g, ''));
                current = '';
                continue;
            }
            current += char;
        }
        if (current.trim()) reactants.push(current.trim().replace(/\s+/g, ''));
        
        // Count occurrences of each unique reactant pattern
        const patternCounts = {};
        reactants.forEach(r => {
            // Normalize pattern for comparison (remove atom mapping numbers)
            const normalized = r.replace(/:\d+/g, '');
            if (!patternCounts[normalized]) {
                patternCounts[normalized] = { original: r, count: 0 };
            }
            patternCounts[normalized].count++;
        });
        
        // Build output
        const patterns = [];
        const reactant_info = [];
        
        for (const key in patternCounts) {
            const info = patternCounts[key];
            patterns.push(info.original);
            reactant_info.push({
                smarts: info.original,
                count: info.count
            });
        }
        
        return { patterns, reactant_info };
    }

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        // Check if this line is a category header (no >> means it's not a reaction)
        if (!line.includes('>>')) {
            const cat = detectCategory(line);
            if (cat) {
                currentCategory = cat;
                if (!categoryCounter[cat]) categoryCounter[cat] = 0;
            }
            return;
        }

        // Parse Reaction
        const { smarts, comment } = extractSmartsAndComment(line);
        
        if (!smarts || !smarts.includes('>>')) return;

        // Generate ID
        if (!categoryCounter[currentCategory]) categoryCounter[currentCategory] = 0;
        categoryCounter[currentCategory]++;
        const id = `${currentCategory}_gen_${categoryCounter[currentCategory]}`;

        // Extract search_smarts
        const searchSmarts = extractSearchSmarts(smarts);

        // Generate name from comment
        let name = comment || `${currentCategory} 反应 ${categoryCounter[currentCategory]}`;
        
        // Clean up name - remove any leading/trailing special chars
        name = name.replace(/^[#，,\s]+/, '').replace(/[，,\s]+$/, '');
        if (!name) name = `${currentCategory} 反应 ${categoryCounter[currentCategory]}`;

        // Build entry
        const entry = {
            category: currentCategory,
            name: name,
            difficulty: 2, // Default to medium
            smarts: smarts.replace(/\s+/g, ''), // Remove extra spaces in SMARTS
            source: sourceMap[currentCategory] || [currentCategory + 's'],
            search_smarts: searchSmarts.patterns,
            reactant_info: searchSmarts.reactant_info,
            condition: name
        };
        
        reactions[id] = entry;
    });

    fs.writeFileSync(outputFile, JSON.stringify(reactions, null, 2), 'utf-8');
    console.log(`Parsed ${Object.keys(reactions).length} reactions.`);
    
    // Print category breakdown
    console.log('\nCategory breakdown:');
    for (const cat in categoryCounter) {
        console.log(`  ${cat}: ${categoryCounter[cat]} reactions`);
    }
}

parse();
