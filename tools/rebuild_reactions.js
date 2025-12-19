const fs = require('fs');
const path = require('path');

// Input files
const parsedFile = path.join(__dirname, '../parsed_reactions.json');
const outputFile = path.join(__dirname, '../reactions.js');

// Read the parsed reactions
const parsedReactions = JSON.parse(fs.readFileSync(parsedFile, 'utf-8'));

// Generate JavaScript file content
let content = `// 难度等级定义：
// 1 = easy (简单) - 基础反应，如简单加成、氢化
// 2 = medium (中等) - 需要理解选择性或机理，如马氏规则、Lindlar催化剂
// 3 = hard (高级) - 复杂反应，如格氏反应、羟醛缩合、多步反应

window.REACTION_DB_EXTENDED = {
`;

// Convert each reaction to JS object notation
const entries = [];
for (const [key, reaction] of Object.entries(parsedReactions)) {
    const entry = `  "${key}": {
    category: "${reaction.category}",
    name: ${JSON.stringify(reaction.name)},
    difficulty: ${reaction.difficulty},
    smarts: ${JSON.stringify(reaction.smarts)},
    source: ${JSON.stringify(reaction.source)},
    search_smarts: ${JSON.stringify(reaction.search_smarts)},
    condition: ${JSON.stringify(reaction.condition)}
  }`;
    entries.push(entry);
}

content += entries.join(',\n');
content += `
};

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

  // 新增类别
  ethers: ["COC", "CCOCC", "COc1ccccc1"],
  thiols: ["CS", "CCS", "Sc1ccccc1"],
  cycloalkanes: ["C1CCCCC1", "C1CCCC1"],
  amines: ["CN", "CCN", "Nc1ccccc1"],
  esters: ["CC(=O)OC", "CC(=O)OCC"]
};
`;

fs.writeFileSync(outputFile, content, 'utf-8');
console.log(`Rebuilt reactions.js with ${Object.keys(parsedReactions).length} reactions.`);
