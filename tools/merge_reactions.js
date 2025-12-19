const fs = require('fs');
const path = require('path');

// File paths
const parsedReactionsFile = path.join(__dirname, '../parsed_reactions.json');
const outputFile = path.join(__dirname, '../reactions.js');

// Load parsed reactions
const parsedReactions = JSON.parse(fs.readFileSync(parsedReactionsFile, 'utf-8'));

// Existing reactions that we want to preserve (from current reactions.js)
// These have better-curated conditions and difficulty levels
const existingReactions = {
  "alkene_addition_br2": {
    category: "alkene",
    name: "烯烃与溴加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[Br][Br]>>[C:1]([Br])-[C:2]([Br])",
    source: ["alkenes", "reagents_br2"],
    search_smarts: ["C=C"],
    condition: "CCl₄"
  },
  "alkene_addition_cl2": {
    category: "alkene",
    name: "烯烃与氯加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[Cl][Cl]>>[C:1]([Cl])-[C:2]([Cl])",
    source: ["alkenes", "reagents_cl2"],
    search_smarts: ["C=C"],
    condition: "CCl₄"
  },
  "alkene_addition_hbr": {
    category: "alkene",
    name: "烯烃与HBr加成",
    difficulty: 2,
    smarts: "[C:1]=[C:2]>>[C:1]-[C:2]([Br])",
    source: ["alkenes", "reagents_hbr"],
    search_smarts: ["C=C"],
    condition: "HBr"
  },
  "alkene_addition_h2o": {
    category: "alkene",
    name: "烯烃水合反应",
    difficulty: 2,
    smarts: "[C:1]=[C:2]>>[C:1]-[C:2]([OH])",
    source: ["alkenes", "reagents_h2o"],
    search_smarts: ["C=C"],
    condition: "H⁺, H₂O"
  },
  "alkene_epoxidation": {
    category: "alkene",
    name: "烯烃环氧化",
    difficulty: 2,
    smarts: "[C:1]=[C:2].[O:3][O:4][C:5]>>[C:1]1[C:2][O:3]1",
    source: ["alkenes", "reagents_peracid"],
    search_smarts: ["C=C"],
    condition: "mCPBA"
  },
  "alkene_ozonolysis": {
    category: "alkene",
    name: "烯烃臭氧氧化分解",
    difficulty: 3,
    smarts: "[C:1]=[C:2]>>[C:1]=O.O=[C:2]",
    source: ["alkenes"],
    search_smarts: ["C=C"],
    condition: "1. O₃, -78°C 2. Zn/H₂O"
  },
  "alkene_hydrogenation": {
    category: "alkene",
    name: "烯烃催化氢化",
    difficulty: 1,
    smarts: "[C:1]=[C:2]>>[C:1]-[C:2]",
    source: ["alkenes", "reagents_h2"],
    search_smarts: ["C=C"],
    condition: "H₂, Pd/C"
  },
  "alkyne_addition_hbr_1": {
    category: "alkyne",
    name: "炔烃与HBr加成 (1eq)",
    difficulty: 2,
    smarts: "[C:1]#[C:2]>>[C:1]([Br])=[C:2]",
    source: ["alkynes", "reagents_hbr"],
    search_smarts: ["C#C"],
    condition: "HBr (1 eq)"
  },
  "alkyne_hydration_terminal": {
    category: "alkyne",
    name: "末端炔烃水合 (Markovnikov)",
    difficulty: 3,
    smarts: "[CH1:1]#[C:2]>>[C:1](=O)-[C:2]",
    source: ["alkynes_terminal", "reagents_h2o"],
    search_smarts: ["[CH]#C"],
    condition: "HgSO₄, H₂SO₄"
  },
  "alkyne_hydrogenation_full": {
    category: "alkyne",
    name: "炔烃完全氢化",
    difficulty: 1,
    smarts: "[C:1]#[C:2]>>[C:1]-[C:2]",
    source: ["alkynes", "reagents_h2"],
    search_smarts: ["C#C"],
    condition: "H₂, Pd/C"
  },
  "alkyne_hydrogenation_lindlar": {
    category: "alkyne",
    name: "炔烃部分氢化 (Lindlar)",
    difficulty: 2,
    smarts: "[C:1]#[C:2]>>[C:1]=[C:2]",
    source: ["alkynes", "reagents_h2"],
    search_smarts: ["C#C"],
    condition: "H₂, Lindlar Cat."
  },
  "alcohol_oxidation_primary": {
    category: "alcohol",
    name: "伯醇氧化为醛",
    difficulty: 2,
    smarts: "[C:1][C:2][O:3]>>[C:1][C:2]=[O:3]",
    source: ["alcohols_primary"],
    search_smarts: ["[CH2][OH]"],
    condition: "PCC"
  },
  "alcohol_oxidation_secondary": {
    category: "alcohol",
    name: "仲醇氧化为酮",
    difficulty: 2,
    smarts: "[C:1][C:2]([O:3])[C:4]>>[C:1][C:2](=[O:3])[C:4]",
    source: ["alcohols_secondary"],
    search_smarts: ["[CH]([C])([C])[OH]"],
    condition: "Na₂Cr₂O₇, H₂SO₄"
  },
  "alcohol_dehydration_intra": {
    category: "alcohol",
    name: "醇分子内脱水 (消除)",
    difficulty: 2,
    smarts: "[C:1][C:2][O:3]>>[C:1]=[C:2]",
    source: ["alcohols"],
    search_smarts: ["[CH2][CH2][OH]"],
    condition: "Conc. H₂SO₄, Heat"
  },
  "williamson_ether": {
    category: "alcohol",
    name: "威廉姆逊醚合成",
    difficulty: 3,
    smarts: "[C:1][O:2].[C:3][Br:4]>>[C:1][O:2][C:3]",
    source: ["alcohols", "halides"],
    search_smarts: ["[CX4][OH]", "[CX4][Br]"],
    condition: "1. NaH 2. R-X"
  },
  "benzene_halogenation_br": {
    category: "benzene",
    name: "苯的溴代",
    difficulty: 1,
    smarts: "[c;H1:1].[Br][Br]>>[c:1][Br]",
    source: ["benzenes", "reagents_br2"],
    search_smarts: ["c1ccccc1"],
    condition: "FeBr₃"
  },
  "benzene_nitration": {
    category: "benzene",
    name: "苯的硝化",
    difficulty: 1,
    smarts: "[c;H1:1].[N+](=O)([O-])[O]>>[c:1][N+](=O)[O-]",
    source: ["benzenes", "reagents_hno3"],
    search_smarts: ["c1ccccc1"],
    condition: "HNO₃, H₂SO₄"
  },
  "benzene_friedel_crafts_alkyl": {
    category: "benzene",
    name: "傅-克烷基化",
    difficulty: 2,
    smarts: "[c;H1:1].[C:2][Cl]>>[c:1][C:2]",
    source: ["benzenes", "halides_alkyl"],
    search_smarts: ["c1ccccc1"],
    condition: "AlCl₃"
  },
  "benzene_friedel_crafts_acyl": {
    category: "benzene",
    name: "傅-克酰基化",
    difficulty: 2,
    smarts: "[c;H1:1].[C:2](=[O:3])[Cl]>>[c:1][C:2](=[O:3])",
    source: ["benzenes", "halides_acyl"],
    search_smarts: ["c1ccccc1"],
    condition: "AlCl₃"
  },
  "carbonyl_reduction_alcohol": {
    category: "carbonyl",
    name: "醛/酮还原为醇",
    difficulty: 1,
    smarts: "[C:1]=[O:2]>>[C:1][O:2]",
    source: ["carbonyls", "reagents_h2"],
    search_smarts: ["C=O"],
    condition: "NaBH₄ or LiAlH₄"
  },
  "grignard_addition": {
    category: "carbonyl",
    name: "格氏试剂加成",
    difficulty: 3,
    smarts: "[C:1](=[O:2]).[C:3][Mg]>>[C:1]([OH:2])([C:3])",
    source: ["carbonyls", "grignard_reagents"],
    search_smarts: ["[CH]=O", "C(=O)C"],
    condition: "1. Ether 2. H₃O⁺"
  },
  "aldol_condensation": {
    category: "carbonyl",
    name: "羟醛缩合 (简化)",
    difficulty: 3,
    smarts: "[C:1][C:2](=O).[C:3][C:4](=O)>>[C:1][C:2](=O)[C:3][C:4](=O)",
    source: ["carbonyls"],
    search_smarts: ["CC=O", "CC(=O)C"],
    condition: "NaOH, Heat"
  },
  "esterification": {
    category: "alcohol",
    name: "酯化反应",
    difficulty: 2,
    smarts: "[C:1](=O)O.[O:2]C>>[C:1](=O)[O:2]C",
    source: ["acids", "alcohols"],
    search_smarts: ["[CX3](=O)[OX2H1]", "[#6][OX2H1]"],
    condition: "H₂SO₄, Heat"
  }
};

// Normalize SMARTS for comparison (remove spaces, standardize)
function normalizeSMARTS(smarts) {
  return smarts.replace(/\s+/g, '').toLowerCase();
}

// Check if a reaction is a duplicate based on SMARTS
function isDuplicate(newSmarts, existingReactions) {
  const normalizedNew = normalizeSMARTS(newSmarts);
  for (const key in existingReactions) {
    const existing = existingReactions[key];
    if (normalizeSMARTS(existing.smarts) === normalizedNew) {
      return key;
    }
  }
  return null;
}

// Merge reactions
const mergedReactions = { ...existingReactions };
let addedCount = 0;
let duplicateCount = 0;
const duplicates = [];

for (const key in parsedReactions) {
  const reaction = parsedReactions[key];
  const dupKey = isDuplicate(reaction.smarts, mergedReactions);
  
  if (dupKey) {
    duplicateCount++;
    duplicates.push({ newKey: key, existingKey: dupKey, smarts: reaction.smarts });
  } else {
    // Add new reaction with a unique key
    mergedReactions[key] = reaction;
    addedCount++;
  }
}

// Generate the output JavaScript content
let output = `// 难度等级定义：
// 1 = easy (简单) - 基础反应，如简单加成、氢化
// 2 = medium (中等) - 需要理解选择性或机理，如马氏规则、Lindlar催化剂
// 3 = hard (高级) - 复杂反应，如格氏反应、羟醛缩合、多步反应

window.REACTION_DB_EXTENDED = `;

output += JSON.stringify(mergedReactions, null, 2);

// Fix JSON to JavaScript object format (remove quotes from keys where possible)
output = output.replace(/"([a-zA-Z_][a-zA-Z0-9_]*)"\s*:/g, '$1:');

output += `;

// 难度等级名称映射
window.DIFFICULTY_NAMES = {
  1: "简单",
  2: "中等",
  3: "高级"
};

// 根据难度等级获取反应列表
window.getReactionsByDifficulty = function(level) {
  const result = {};
  for (const key in window.REACTION_DB_EXTENDED) {
    const reaction = window.REACTION_DB_EXTENDED[key];
    if (reaction.difficulty === level) {
      result[key] = reaction;
    }
  }
  return result;
};

// 根据难度范围获取反应列表 (例如：level 1-2)
window.getReactionsByDifficultyRange = function(minLevel, maxLevel) {
  const result = {};
  for (const key in window.REACTION_DB_EXTENDED) {
    const reaction = window.REACTION_DB_EXTENDED[key];
    if (reaction.difficulty >= minLevel && reaction.difficulty <= maxLevel) {
      result[key] = reaction;
    }
  }
  return result;
};

window.CHEMICAL_CABINET_EXTENDED = {
  // 基础试剂
  reagents_br2: ["BrBr"],
  reagents_cl2: ["ClCl"],
  reagents_hbr: ["Br"],
  reagents_h2o: ["O"],
  reagents_h2: ["[H][H]"],
  reagents_peracid: ["CC(=O)OO"],
  reagents_hno3: ["[O-][N+](=O)O"],

  // 烃类
  alkenes: [
    "C=C", "CC=C", "CC(=C)C", "C1=CCCCC1", "c1ccccc1C=C", "CC=CC", "C1=CCCC1"
  ],
  alkynes: [
    "C#C", "CC#C", "CC#CC", "c1ccccc1C#C", "CCC#C"
  ],
  alkynes_terminal: [
    "C#C", "CC#C", "c1ccccc1C#C", "CCC#C"
  ],

  // 醇类
  alcohols: ["CO", "CCO", "CCCO", "CC(O)C", "OCc1ccccc1", "C1CCCCC1O"],
  alcohols_primary: ["CO", "CCO", "CCCO", "OCc1ccccc1"],
  alcohols_secondary: ["CC(O)C", "C1CCCCC1O"],
  
  // 羧酸
  acids: ["CC(=O)O", "CCC(=O)O", "c1ccccc1C(=O)O"],

  // 卤代烃
  halides: ["CBr", "CCBr", "CCCCl", "CI", "BrCc1ccccc1", "CC(C)Cl"],
  halides_alkyl: ["CCl", "CCCl", "CCCCl", "CC(C)Cl"],
  halides_acyl: ["CC(=O)Cl", "CCC(=O)Cl", "c1ccccc1C(=O)Cl"],

  // 芳香族
  benzenes: ["c1ccccc1", "Cc1ccccc1", "COc1ccccc1", "Clc1ccccc1", "c1ccc(C)cc1"],

  // 羰基化合物
  carbonyls: ["CC=O", "CCC=O", "CC(=O)C", "c1ccccc1C=O", "c1ccccc1C(=O)C"],
  grignard_reagents: ["C[Mg]Cl", "CC[Mg]Cl", "c1ccccc1[Mg]Cl"],
  
  // 硫醇
  thiols: ["CS", "CCS", "CCCS"],
  
  // 醚类
  ethers: ["COC", "CCOC", "c1ccccc1OC"],
  
  // 环烷烃
  cycloalkanes: ["C1CCCCC1", "C1CCCC1", "C1CCC1"]
};
`;

fs.writeFileSync(outputFile, output, 'utf-8');

console.log('=== Merge Complete ===');
console.log(`Existing reactions preserved: ${Object.keys(existingReactions).length}`);
console.log(`New reactions added: ${addedCount}`);
console.log(`Duplicates removed: ${duplicateCount}`);
console.log(`Total reactions: ${Object.keys(mergedReactions).length}`);

if (duplicates.length > 0) {
  console.log('\n--- Duplicates Found (kept existing) ---');
  duplicates.slice(0, 10).forEach(d => {
    console.log(`  ${d.newKey} -> ${d.existingKey}`);
  });
  if (duplicates.length > 10) {
    console.log(`  ... and ${duplicates.length - 10} more`);
  }
}

// Category summary
const categoryCount = {};
for (const key in mergedReactions) {
  const cat = mergedReactions[key].category;
  categoryCount[cat] = (categoryCount[cat] || 0) + 1;
}
console.log('\n--- Category Summary ---');
for (const cat in categoryCount) {
  console.log(`  ${cat}: ${categoryCount[cat]} reactions`);
}
