const fs = require('fs');
const path = require('path');

// File path
const reactionsFile = path.join(__dirname, '../reactions.js');

// Read the file
let content = fs.readFileSync(reactionsFile, 'utf-8');

// Condition abbreviation mappings
const conditionMappings = {
  // 长条件 -> 简短条件
  '在重铬酸钾等强氧化剂的氧化下': 'K₂Cr₂O₇, H⁺',
  '重铬酸钾等强氧化剂的氧化下': 'K₂Cr₂O₇, H⁺',
  '稀HNO3 ; H2SO4 ; 90-100℃': 'HNO₃, H₂SO₄, Δ',
  '用Ni/Pt/Pd/Ru/Rh等回催化加成': 'Ni/Pd/Pt, H₂',
  '用K2Cr2O7 ; H2SO4氧化对比': 'K₂Cr₂O₇, H₂SO₄',
  'CH3COOEt,40℃,Baeyer-Villiger反应': 'mCPBA (Baeyer-Villiger)',
  'Clemmensen还原反应,Zn-Hg ,HCl,加热': 'Zn-Hg, HCl (Clemmensen)',
  'Wolff-Kishner-Huang Minlon还原反应, NH2NH2,KOH,(HOCH2CH2)2O,180℃': 'N₂H₄, KOH (Wolff-Kishner)',
  '加热,H2O,Meerwein-Ponndorf反应': 'Al(OiPr)₃ (Meerwein-Ponndorf)',
  
  // 反应名称作为条件的情况 -> 使用合适的化学条件
  '烯烃与溴化氢加成': 'HBr',
  '烯烃与氯化氢加成': 'HCl',
  '烯烃与碘化氢加成': 'HI',
  '烯烃与次溴酸加成': 'HOBr',
  '烯烃与次氯酸加成': 'HOCl',
  '烯烃与次碘酸加成': 'HOI',
  '与水加成': 'H⁺, H₂O',
  '烯烃与硫酸加成': 'H₂SO₄',
  '自由基加成反应（反马氏规则）': 'HBr, ROOR, hν',
  'a氢的卤化': 'Cl₂/Br₂, hν',
  '环氧化反应': 'mCPBA',
  '烯烃氧化为邻二醇': 'OsO₄, NMO',
  '烯烃的臭氧氧化-分解反应': '1. O₃ 2. Zn/H₂O',
  '硼氢化反应': '1. BH₃ 2. H₂O₂/NaOH',
  '催化加氢': 'H₂, Pd/C',
  '聚合反应': '引发剂, Δ',
  '烯烃复分解反应': 'Grubbs Cat.',
  '共轭加成(1,2-加成)': 'Br₂ (低温)',
  '共轭加成(1,4-加成)': 'Br₂ (高温)',
  
  // 炔烃反应
  '与HBr加成（马氏规则）内部炔烃': 'HBr',
  '与HBr加成（马氏规则）末端炔烃': 'HBr',
  '与水加成 末端炔烃生成醛': 'Hg²⁺, H₂O',
  '与水加成 内部炔烃生成酮': 'Hg²⁺, H₂O',
  '溴加成(反式加成，第一步)': 'Br₂',
  '溴加成第二步': 'Br₂ (过量)',
  '与氢氰酸亲核加成': 'HCN, Cu⁺',
  '在强碱(如KOH或NaOH)催化下': 'KOH/NaOH',
  '高锰酸钾（KMnO₄）氧化末端炔烃': 'KMnO₄, H⁺',
  '高锰酸钾（KMnO₄）氧化内部炔烃': 'KMnO₄, H⁺',
  '臭氧氧化-分解反应': '1. O₃ 2. Zn',
  '完全加氢(生成烷烃)': 'H₂, Pd/C',
  '部分加氢(顺式加成，Lindlar催化剂)': 'H₂, Lindlar',
  '硼氢化-氧化反应 对于末端炔烃（生成醛）': '1. Sia₂BH 2. H₂O₂',
  '二聚反应': 'CuCl, NH₄Cl',
  '三聚反应': 'Ni(CO)₄, Δ',
  '四聚反应': 'Ni(CN)₂, Δ',
  
  // 醇反应
  '与钠反应': 'Na',
  '伯醇→醛': 'PCC/DMP',
  '伯醇→羧酸': 'K₂Cr₂O₇, H⁺',
  '仲醇→酮': 'Na₂Cr₂O₇, H⁺',
  '分子内脱水（消除反应）': 'H₂SO₄, Δ',
  '分子间脱水(生成醚)': 'H₂SO₄, 140°C',
  '酚的酯化反应': 'Ac₂O or AcCl',
  '与HX反应': 'HBr/HCl',
  '与SOCl₂反应': 'SOCl₂',
  '烷氧基负离子与卤代烃反应生成醚': 'NaH, R-X',
  '与卤化磷反应转化为卤代烃': 'PCl₃/PBr₃',
  '生成磺酸酯和氯化氢': 'TsCl, Py',
  
  // 硫醇
  '硫醇与重金属反应（解毒应用）': 'Hg²⁺/Pb²⁺',
  '硫醇在稀过氧化氢/碘/空气作用下生成二硫化物': 'I₂/H₂O₂/O₂',
  
  // 醚
  '醚氧化成酮': '[O]',
  '酸性条件下与水反应生成两种醇': 'H⁺, H₂O',
  '与水在酸催化下反应生成乙二醇': 'H⁺, H₂O',
  
  // 苯环反应
  '苯与卤素反应': 'FeBr₃/FeCl₃',
  '苯的溴化反应': 'Br₂, FeBr₃',
  '苯的氯化反应': 'Cl₂, FeCl₃',
  '苯的碘化反应': 'I₂, HNO₃',
  '苯的硝化反应': 'HNO₃, H₂SO₄',
  '苯的磺化反应': '发烟H₂SO₄',
  '傅克烷基化反应': 'AlCl₃',
  '傅克酰基化反应': 'AlCl₃',
  '侧链氧化反应': 'KMnO₄, Δ',
  '侧链卤化反应': 'Cl₂/Br₂, hν',
  
  // 羰基反应
  '醛/酮还原为醇': 'NaBH₄/LiAlH₄',
  '醛氧化为羧酸': 'KMnO₄/CrO₃',
  '与格氏试剂反应': '1. RMgX 2. H₃O⁺',
  '与氢氰酸加成': 'HCN, KCN',
  '与亚硫酸氢钠加成': 'NaHSO₃',
  '与氨/胺反应': 'NH₃/RNH₂',
  '与羟胺反应': 'NH₂OH',
  '与肼反应': 'N₂H₄',
  '羟醛缩合反应': 'NaOH, Δ',
  
  // 羧酸反应
  '与醇酯化反应': 'H⁺, Δ',
  '与胺成酰胺': 'Δ',
  '还原为醇': 'LiAlH₄',
  '脱羧反应': 'NaOH, CaO, Δ',
  'Hell-Volhard-Zelinsky反应': 'Br₂, P',
  
  // 卤代烃反应
  '卤代烃的亲核取代': 'Nu⁻',
  'E1消除': 'H⁺, Δ',
  'E2消除': 'NaOH/KOH, EtOH',
  'Wurtz反应': 'Na',
  '格氏试剂制备': 'Mg, 乙醚',
};

// Apply replacements
let replacementCount = 0;
for (const [longCond, shortCond] of Object.entries(conditionMappings)) {
  const regex = new RegExp(`condition:\\s*["']${escapeRegex(longCond)}["']`, 'g');
  const newContent = content.replace(regex, (match) => {
    replacementCount++;
    return `condition: "${shortCond}"`;
  });
  if (newContent !== content) {
    content = newContent;
  }
}

// Helper function to escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Also fix any condition that's too long (>30 characters) and is the same as name
// Pattern: condition: "same as name"
const conditionPattern = /condition:\s*"([^"]+)"/g;
let match;
const longConditions = [];
content = content.replace(conditionPattern, (fullMatch, condition) => {
  if (condition.length > 35 && !conditionMappings[condition]) {
    // This is a long condition not in our mappings
    longConditions.push(condition);
    // Try to shorten it
    let shortened = condition;
    // Remove common prefixes
    shortened = shortened.replace(/^(在|用|使用|通过|经过)/, '');
    // Truncate if still too long
    if (shortened.length > 30) {
      shortened = shortened.substring(0, 27) + '...';
    }
    return `condition: "${shortened}"`;
  }
  return fullMatch;
});

fs.writeFileSync(reactionsFile, content, 'utf-8');

console.log('=== Condition Cleanup Complete ===');
console.log(`Conditions shortened using mappings: ${replacementCount}`);
console.log(`Additional long conditions truncated: ${longConditions.length}`);

if (longConditions.length > 0) {
  console.log('\n--- Long conditions found (truncated) ---');
  longConditions.slice(0, 10).forEach(c => console.log(`  ${c}`));
  if (longConditions.length > 10) {
    console.log(`  ... and ${longConditions.length - 10} more`);
  }
}
