const fs = require('fs');
const path = require('path');

// 加载 parsed_reactions.json
const reactionsFile = path.join(__dirname, '../parsed_reactions.json');
const reactions = JSON.parse(fs.readFileSync(reactionsFile, 'utf-8'));

// 已知有问题的 SMARTS 模式特征
const problematicPatterns = [
    // 产物中原子价态不合理的情况
    { pattern: /\(=O\)\(O\)/, desc: '碳同时连接=O和O，价态不对' },
    { pattern: /\[C\].*\[C\].*\[C\].*\[C\].*\[C\].*\[C\]/, desc: '过于复杂的产物结构' },
    { pattern: /\[H\]\[H\]\[H\]\[H\]/, desc: '4个氢原子 - 不合理' },
    { pattern: /\[Br\]\[Br\]\[Br\]/, desc: '3个连续溴原子' },
    { pattern: />>-\[/, desc: '产物以-开头 (聚合物表示法)' },
    { pattern: /-\[.*\]-$/, desc: '产物以-结尾 (聚合物表示法)' },
];

// 简单的 SMILES 语法检查
function validateSMARTS(smarts) {
    const issues = [];
    
    if (!smarts || !smarts.includes('>>')) {
        issues.push('无效的反应 SMARTS 格式');
        return issues;
    }
    
    const [reactants, products] = smarts.split('>>');
    
    // 检查产物部分
    for (const check of problematicPatterns) {
        if (check.pattern.test(products)) {
            issues.push(check.desc);
        }
    }
    
    // 检查括号匹配
    const countChars = (str, char) => (str.match(new RegExp(`\\${char}`, 'g')) || []).length;
    if (countChars(products, '(') !== countChars(products, ')')) {
        issues.push('产物中括号不匹配');
    }
    if (countChars(products, '[') !== countChars(products, ']')) {
        issues.push('产物中方括号不匹配');
    }
    
    // 检查原子映射是否完整（每个反应物中的映射应在产物中出现）
    const reactantMappings = reactants.match(/:\d+/g) || [];
    const productMappings = products.match(/:\d+/g) || [];
    
    const reactantSet = new Set(reactantMappings);
    const productSet = new Set(productMappings);
    
    // 检查是否有反应物映射在产物中丢失
    for (const mapping of reactantSet) {
        if (!productSet.has(mapping)) {
            // 这不一定是错误，有些原子可能被消除（如脱水反应）
            // issues.push(`原子映射 ${mapping} 在产物中丢失`);
        }
    }
    
    return issues;
}

// 检查所有反应
console.log('=== 反应规则验证 ===\n');

const problemReactions = [];
const validReactions = [];

for (const [key, reaction] of Object.entries(reactions)) {
    const issues = validateSMARTS(reaction.smarts);
    
    if (issues.length > 0) {
        problemReactions.push({
            key,
            name: reaction.name,
            smarts: reaction.smarts,
            issues
        });
    } else {
        validReactions.push(key);
    }
}

console.log(`✅ 有效反应: ${validReactions.length}`);
console.log(`❌ 问题反应: ${problemReactions.length}\n`);

if (problemReactions.length > 0) {
    console.log('--- 问题反应列表 ---');
    problemReactions.forEach(r => {
        console.log(`\n${r.key}: ${r.name}`);
        console.log(`  SMARTS: ${r.smarts.substring(0, 80)}...`);
        console.log(`  问题: ${r.issues.join(', ')}`);
    });
}

// 导出问题反应列表
fs.writeFileSync(
    path.join(__dirname, 'problem_reactions.json'),
    JSON.stringify(problemReactions, null, 2),
    'utf-8'
);

console.log('\n问题反应列表已保存到 problem_reactions.json');
