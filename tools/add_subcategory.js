/**
 * 为 reactions.js 添加 subcategory 字段的脚本
 * 根据反应名称和类别自动分配子分类
 */

const fs = require('fs');

// 读取 reactions.js 文件
let content = fs.readFileSync('./reactions.js', 'utf8');

// 定义子分类映射规则
const subcategoryRules = {
  // 烯烃反应分类
  alkene: [
    // 卤素加成
    { pattern: /溴加成|氯加成|碘加成|卤素加成/i, subcategory: 'addition_halogen' },
    // 卤化氢加成 (马氏规则)
    { pattern: /溴化氢加成|氯化氢加成|碘化氢加成|HBr加成|HCl加成|HI加成|与HX反应|卤化氢/i, subcategory: 'addition_hx' },
    // 自由基加成 (反马氏)
    { pattern: /自由基加成|反马氏|过氧化物/i, subcategory: 'addition_hx_anti' },
    // 水合反应
    { pattern: /水合|与水加成|水加成|硫酸加成/i, subcategory: 'addition_water' },
    // 次卤酸加成
    { pattern: /次溴酸|次氯酸|次碘酸/i, subcategory: 'addition_hypohalous' },
    // 共轭加成
    { pattern: /共轭加成|1,2-加成|1,4-加成/i, subcategory: 'addition_conjugate' },
    // 环氧化
    { pattern: /环氧化|mCPBA|过氧酸/i, subcategory: 'oxidation_epox' },
    // 邻二醇化
    { pattern: /邻二醇|二醇化|OsO/i, subcategory: 'oxidation_diol' },
    // 臭氧氧化断裂
    { pattern: /臭氧|ozonolysis|氧化分解|断裂/i, subcategory: 'oxidation_cleavage' },
    // 催化氢化
    { pattern: /催化氢化|氢化|加氢|H₂/i, subcategory: 'hydrogenation' },
    // α-氢取代 (烯丙位卤化)
    { pattern: /α氢|a氢|α位|烯丙位/i, subcategory: 'substitution_alpha' },
    // 硼氢化
    { pattern: /硼氢化/i, subcategory: 'hydroboration' },
    // 聚合反应
    { pattern: /聚合/i, subcategory: 'polymerization' },
    // 复分解反应
    { pattern: /复分解/i, subcategory: 'metathesis' },
    // DA反应
    { pattern: /DA反应|环加成|Diels/i, subcategory: 'cycloaddition' },
  ],
  
  // 炔烃反应分类
  alkyne: [
    { pattern: /完全氢化|完全加氢|生成烷烃/i, subcategory: 'hydrogenation_full' },
    { pattern: /部分氢化|Lindlar|顺式加成/i, subcategory: 'hydrogenation_lindlar' },
    { pattern: /马氏.*水合|水合.*马氏|HgSO|汞盐|生成酮/i, subcategory: 'hydration_markov' },
    { pattern: /反马氏.*水合|硼氢化.*氧化|水合.*反马|生成醛/i, subcategory: 'hydration_antimarkov' },
    { pattern: /HBr加成|溴化氢加成|卤化氢/i, subcategory: 'addition_hx' },
    { pattern: /溴加成|卤素加成/i, subcategory: 'addition_halogen' },
    { pattern: /氢氰酸|HCN|亲核加成/i, subcategory: 'addition_nucleophilic' },
    { pattern: /氧化|高锰酸钾|KMnO/i, subcategory: 'oxidation' },
    { pattern: /聚合|二聚|三聚|四聚/i, subcategory: 'polymerization' },
  ],
  
  // 苯环反应分类
  benzene: [
    { pattern: /溴代|氯代|碘代|卤代/i, subcategory: 'substitution_halogen' },
    { pattern: /硝化/i, subcategory: 'substitution_nitration' },
    { pattern: /磺化/i, subcategory: 'substitution_sulfonation' },
    { pattern: /傅.*克.*烷基|烷基化|Friedel.*alkyl/i, subcategory: 'substitution_fc_alkyl' },
    { pattern: /傅.*克.*酰基|酰基化|Friedel.*acyl/i, subcategory: 'substitution_fc_acyl' },
    { pattern: /还原|氢化|环己烷/i, subcategory: 'reduction' },
    { pattern: /侧链.*卤|光照|自由基取代/i, subcategory: 'sidechain_halogen' },
    { pattern: /侧链.*氧化|重铬酸|氧化.*羧酸/i, subcategory: 'sidechain_oxidation' },
    { pattern: /酚.*溴|酚.*氯|苯酚.*卤/i, subcategory: 'phenol_halogenation' },
    { pattern: /酚.*硝化/i, subcategory: 'phenol_nitration' },
    { pattern: /酚.*磺化/i, subcategory: 'phenol_sulfonation' },
    { pattern: /对苯醌|醌/i, subcategory: 'oxidation_quinone' },
    { pattern: /酸性|Na\+|钠盐/i, subcategory: 'phenol_acidity' },
  ],
  
  // 羰基反应分类
  carbonyl: [
    { pattern: /还原.*醇|醇还原|NaBH|LiAlH|Pt.*加氢/i, subcategory: 'reduction_alcohol' },
    { pattern: /Clemmensen|Wolff.*Kishner|还原.*CH2|还原.*烃/i, subcategory: 'reduction_ch2' },
    { pattern: /氢氰酸|HCN|氰醇/i, subcategory: 'addition_hcn' },
    { pattern: /格氏|Grignard|RMgX/i, subcategory: 'addition_grignard' },
    { pattern: /有机锂|RLi/i, subcategory: 'addition_organolithium' },
    { pattern: /胺|亚胺|肟|羟胺/i, subcategory: 'addition_amine' },
    { pattern: /羟醛|aldol/i, subcategory: 'aldol' },
    { pattern: /半缩醛|缩醛|缩酮/i, subcategory: 'acetal' },
    { pattern: /水合物/i, subcategory: 'hydrate' },
    { pattern: /亚硫酸氢钠|NaHSO/i, subcategory: 'bisulfite' },
    { pattern: /烯醇化|烯醇/i, subcategory: 'enolization' },
    { pattern: /卤仿/i, subcategory: 'haloform' },
    { pattern: /氧化.*醛|醛.*羧酸/i, subcategory: 'oxidation' },
    { pattern: /重排|Beckmann|Favorski|Baeyer/i, subcategory: 'rearrangement' },
    { pattern: /炔化物|炔/i, subcategory: 'addition_alkynide' },
    { pattern: /不饱和.*醛酮|α,β-不饱和/i, subcategory: 'conjugate_addition' },
  ],
  
  // 卤代烃反应分类
  halide: [
    { pattern: /醇|OH-|生成醇/i, subcategory: 'sn_alcohol' },
    { pattern: /醚|RO-|生成醚/i, subcategory: 'sn_ether' },
    { pattern: /腈|CN-|生成腈/i, subcategory: 'sn_nitrile' },
    { pattern: /胺|NH2|氨/i, subcategory: 'sn_amine' },
    { pattern: /消除|E2|生成烯烃|脱卤化氢/i, subcategory: 'elimination' },
    { pattern: /格氏试剂|Mg|Grignard/i, subcategory: 'grignard_formation' },
    { pattern: /还原|LiAlH4|H2/i, subcategory: 'reduction' },
    { pattern: /Wurtz|偶联/i, subcategory: 'coupling' },
  ],
  
  // 醇反应分类  
  alcohol: [
    { pattern: /氧化.*醛|伯醇.*醛|PCC/i, subcategory: 'oxidation_aldehyde' },
    { pattern: /氧化.*酮|仲醇.*酮/i, subcategory: 'oxidation_ketone' },
    { pattern: /氧化.*羧酸|伯醇.*羧酸/i, subcategory: 'oxidation_acid' },
    { pattern: /脱水.*消除|分子内脱水|消除反应/i, subcategory: 'elimination' },
    { pattern: /分子间脱水|生成醚/i, subcategory: 'dehydration_ether' },
    { pattern: /酯化/i, subcategory: 'esterification' },
    { pattern: /威廉姆逊|Williamson/i, subcategory: 'williamson' },
    { pattern: /与钠|活泼金属/i, subcategory: 'metal_reaction' },
    { pattern: /HX|卤代|SOCl|PCl/i, subcategory: 'halogenation' },
    { pattern: /磺酰氯|磺酸酯/i, subcategory: 'tosylation' },
  ],
  
  // 醚反应分类
  ether: [
    { pattern: /氧化/i, subcategory: 'oxidation' },
    { pattern: /酸水解|水解/i, subcategory: 'acid_cleavage' },
    { pattern: /开环|环氧|乙二醇/i, subcategory: 'ring_opening' },
  ],
  
  // 羧酸反应分类
  acid: [
    { pattern: /酯化/i, subcategory: 'esterification' },
    { pattern: /酰氯|SOCl|PCl/i, subcategory: 'acyl_chloride' },
    { pattern: /胺|酰胺/i, subcategory: 'amide_formation' },
    { pattern: /脱羧/i, subcategory: 'decarboxylation' },
    { pattern: /Hell.*Volhard|α-卤代/i, subcategory: 'alpha_halogenation' },
    { pattern: /还原.*醇/i, subcategory: 'reduction' },
    { pattern: /格氏|Grignard/i, subcategory: 'grignard' },
    { pattern: /有机锂/i, subcategory: 'organolithium' },
  ],
  
  // 硫醇反应
  thiol: [
    { pattern: /重金属/i, subcategory: 'metal_binding' },
    { pattern: /二硫化物|氧化/i, subcategory: 'disulfide_formation' },
  ],
  
  // 杂环反应
  heterocycle: [
    { pattern: /卤代|溴代|氯代/i, subcategory: 'halogenation' },
    { pattern: /硝化/i, subcategory: 'nitration' },
    { pattern: /磺化/i, subcategory: 'sulfonation' },
    { pattern: /酰基化|乙酸酐/i, subcategory: 'acylation' },
    { pattern: /烷基化/i, subcategory: 'alkylation' },
    { pattern: /催化加氢|还原/i, subcategory: 'reduction' },
    { pattern: /开环/i, subcategory: 'ring_opening' },
    { pattern: /金属化/i, subcategory: 'metallation' },
  ],
  
  // 环烷烃反应
  cycloalkane: [
    { pattern: /催化加氢|开环/i, subcategory: 'ring_opening' },
    { pattern: /加成|溴加成|HBr/i, subcategory: 'addition' },
    { pattern: /自由基取代|卤化/i, subcategory: 'substitution' },
    { pattern: /氧化/i, subcategory: 'oxidation' },
  ],
};

// 函数：根据反应名称和类别确定子分类
function getSubcategory(category, name) {
  const rules = subcategoryRules[category];
  if (!rules) {
    return 'general';  // 默认子分类
  }
  
  for (const rule of rules) {
    if (rule.pattern.test(name)) {
      return rule.subcategory;
    }
  }
  
  return 'general';  // 如果没有匹配，返回通用子分类
}

// 使用正则表达式匹配每个反应条目并添加 subcategory
const reactionPattern = /(\s+\w+:\s*\{[\s\S]*?category:\s*"(\w+)",[\s\S]*?name:\s*"([^"]+)")/g;

let matchCount = 0;
content = content.replace(reactionPattern, (match, fullMatch, category, name) => {
  // 检查是否已有 subcategory
  if (match.includes('subcategory:')) {
    return match;
  }
  
  const subcategory = getSubcategory(category, name);
  matchCount++;
  
  // 在 category 行后插入 subcategory
  return match.replace(
    /category:\s*"(\w+)",/,
    `category: "$1",\n    subcategory: "${subcategory}",`
  );
});

// 写回文件
fs.writeFileSync('./reactions.js', content, 'utf8');
console.log(`✅ 成功为 ${matchCount} 个反应添加了 subcategory 字段`);
