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
    // Returns: { patterns: [...], reactant_info: [{smarts, count, isReagent, smiles}, ...] }
    
    // Common reagents lookup - maps SMARTS patterns to searchable SMILES or marks as reagent
    const COMMON_REAGENTS = {
        // Diatomic halogens
        '[Br][Br]': { smiles: 'BrBr', isReagent: true },
        '[Cl][Cl]': { smiles: 'ClCl', isReagent: true },
        '[I][I]': { smiles: 'II', isReagent: true },
        '[F][F]': { smiles: 'FF', isReagent: true },
        'BrBr': { smiles: 'BrBr', isReagent: true },
        'ClCl': { smiles: 'ClCl', isReagent: true },
        
        // Hydrogen halides
        '[H][Br]': { smiles: 'Br', isReagent: true },
        '[H][Cl]': { smiles: 'Cl', isReagent: true },
        '[H][I]': { smiles: 'I', isReagent: true },
        '[H][F]': { smiles: 'F', isReagent: true },
        '[Br][H]': { smiles: 'Br', isReagent: true },
        '[Cl][H]': { smiles: 'Cl', isReagent: true },
        
        // Hypohalous acids
        '[OH][Br]': { smiles: 'OBr', isReagent: true },
        '[OH][Cl]': { smiles: 'OCl', isReagent: true },
        '[OH][I]': { smiles: 'OI', isReagent: true },
        
        // Water and hydroxide
        '[O][H]': { smiles: 'O', isReagent: true },
        '[OH2]': { smiles: 'O', isReagent: true },
        'O': { smiles: 'O', isReagent: true },
        '[OH-]': { smiles: '[OH-]', isReagent: true },
        '[Na+]': { smiles: '[Na+]', isReagent: true, skip: true },
        '[Na+].[OH-]': { smiles: '[Na+].[OH-]', isReagent: true, skip: true },
        
        // Metals and metal ions (should not search PubChem)
        '[Hg]': { smiles: '[Hg]', isReagent: true, skip: true },
        '[Mg]': { smiles: '[Mg]', isReagent: true, skip: true },
        '[Li]': { smiles: '[Li]', isReagent: true, skip: true },
        '[Na]': { smiles: '[Na]', isReagent: true, skip: true },
        '[K]': { smiles: '[K]', isReagent: true, skip: true },
        
        // Hydrogen gas
        '[H][H]': { smiles: '[H][H]', isReagent: true },
        
        // Nitrogen compounds
        '[NH2]': { smiles: 'N', isReagent: true },
        '[NH3]': { smiles: 'N', isReagent: true },
        
        // Cyanide
        '[C-]#N': { smiles: '[C-]#N', isReagent: true },
        '[C-]#[N]': { smiles: '[C-]#N', isReagent: true },
        
        // Sulfur compounds
        '[S](=O)(=O)O': { smiles: 'OS(=O)(=O)O', isReagent: true },
        
        // Nitro group (for nitration)
        '[N+](=O)[O-]': { smiles: '[N+](=O)[O-]', isReagent: true, skip: true },
        '[N+](=O)([O-])[O]': { smiles: 'O[N+](=O)[O-]', isReagent: true, skip: true },
        
        // Phosphorus halides
        '[P](Cl)(Cl)(Cl)': { smiles: 'ClP(Cl)Cl', isReagent: true, skip: true },
        '[S](=O)(Cl)(Cl)': { smiles: 'ClS(Cl)=O', isReagent: true, skip: true },
        
        // Acetic anhydride
        'CC(=O)OC(=O)C': { smiles: 'CC(=O)OC(=O)C', isReagent: true },
    };
    
    function extractSearchSmarts(smarts) {
        // SMARTS format: Reactant1.Reactant2>>Product
        const arrowIdx = smarts.indexOf('>>');
        if (arrowIdx === -1) return { patterns: [], reactant_info: [] };
        
        const reactantsBlock = smarts.substring(0, arrowIdx).trim();
        
        // Split by `.` but be careful with nested structures
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
        
        // Process each reactant
        const patternCounts = {};
        reactants.forEach(r => {
            // Remove atom mapping numbers for normalization
            const normalized = r.replace(/:\d+/g, '');
            
            if (!patternCounts[normalized]) {
                patternCounts[normalized] = { original: r, normalized: normalized, count: 0 };
            }
            patternCounts[normalized].count++;
        });
        
        // Build output with proper search patterns
        const patterns = [];
        const reactant_info = [];
        
        for (const key in patternCounts) {
            const info = patternCounts[key];
            const normalized = info.normalized;
            
            // Check if this is a known reagent
            const reagentInfo = COMMON_REAGENTS[normalized];
            
            let searchPattern = normalized;  // Default: use normalized (no atom mapping)
            let isReagent = false;
            let skip = false;
            let smiles = null;
            
            if (reagentInfo) {
                isReagent = reagentInfo.isReagent || false;
                skip = reagentInfo.skip || false;
                smiles = reagentInfo.smiles || null;
                // For reagents, use the predefined SMILES as search pattern
                if (smiles && !skip) {
                    searchPattern = smiles;
                }
            }
            
            patterns.push(searchPattern);
            reactant_info.push({
                smarts: searchPattern,
                count: info.count,
                isReagent: isReagent,
                skip: skip,  // If true, don't search PubChem for this
                smiles: smiles  // Predefined SMILES to use directly
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
