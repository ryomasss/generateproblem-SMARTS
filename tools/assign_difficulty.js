/**
 * 难度评定脚本
 * 根据反应的复杂程度自动分配难度等级
 * 
 * 难度等级定义：
 * 1 = 简单 (easy) - 基础反应，直接加成、氢化
 * 2 = 中等 (medium) - 需要理解选择性或机理
 * 3 = 困难 (hard) - 复杂反应、多步反应、格氏反应
 */

const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../parsed_reactions.json');
const outputFile = path.join(__dirname, '../parsed_reactions.json');

// 读取反应数据
const reactions = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

// 难度规则：关键词匹配
const DIFFICULTY_RULES = {
    // 难度 1 (简单) - 直接匹配这些关键词的反应
    easy: [
        // 简单加成
        '与溴加成', '与氯加成', '与碘加成',
        '与溴化氢加成', '与氯化氢加成', '与碘化氢加成',
        '与水加成', '与水反应',
        '催化加氢', '氢化', '加氢',
        '卤化', '溴化', '氯化',
        // 简单取代
        '硝化', '磺化',
        // 其他简单反应
        '酯化', '水解',
    ],
    
    // 难度 3 (困难) - 匹配这些关键词的反应
    hard: [
        // 格氏反应
        '格氏', 'Grignard', 'grignard',
        // 羟醛缩合
        '羟醛', '醇醛', 'aldol', 'Aldol',
        // 复杂重排
        '重排', 'rearrangement',
        'Claisen', 'claisen',
        'Cannizzaro', 'cannizzaro',
        'Baeyer-Villiger', 'baeyer',
        'Wittig', 'wittig',
        'Hofmann', 'hofmann',
        // 环化反应
        'Diels-Alder', 'diels',
        '复分解', 'metathesis',
        // 其他复杂反应
        '偶联', 'coupling',
        '有机锂', 'organolithium',
        '炔化物', 'alkynide',
        '烯醇', 'enol',
        '卤仿', 'haloform',
        '共轭加成',
        '臭氧', 'ozone',
        '硼氢化', 'hydroboration',
        '环氧化',
        'Williamson', 'williamson', '威廉姆逊',
    ],
};

// SMARTS 复杂度评分规则
function getSmartsComplexity(smarts) {
    if (!smarts) return 0;
    
    let score = 0;
    
    // 反应物数量
    const arrowIdx = smarts.indexOf('>>');
    if (arrowIdx > 0) {
        const reactants = smarts.substring(0, arrowIdx);
        const dotCount = (reactants.match(/\./g) || []).length;
        score += dotCount * 0.5;  // 每多一个反应物 +0.5
    }
    
    // 原子映射数量 (复杂的反应通常有更多映射)
    const mappingCount = (smarts.match(/:\d+/g) || []).length;
    if (mappingCount > 6) score += 1;
    if (mappingCount > 10) score += 1;
    
    // 特殊结构
    if (smarts.includes('#')) score += 0.5;  // 含炔键
    if (smarts.includes('c')) score += 0.3;  // 含芳环
    if (smarts.match(/\[.*?;.*?\]/)) score += 0.5;  // 含SMARTS限定符
    
    return score;
}

// 评定难度
function assignDifficulty(reaction) {
    const name = reaction.name || '';
    const condition = reaction.condition || '';
    const smarts = reaction.smarts || '';
    const text = name + ' ' + condition;
    
    // 1. 先检查是否匹配困难关键词
    for (const keyword of DIFFICULTY_RULES.hard) {
        if (text.includes(keyword)) {
            return 3;
        }
    }
    
    // 2. 再检查是否匹配简单关键词
    for (const keyword of DIFFICULTY_RULES.easy) {
        if (text.includes(keyword)) {
            return 1;
        }
    }
    
    // 3. 基于 SMARTS 复杂度评分
    const complexity = getSmartsComplexity(smarts);
    if (complexity >= 2.5) return 3;
    if (complexity >= 1.5) return 2;
    
    // 4. 默认中等难度
    return 2;
}

// 统计
let stats = { 1: 0, 2: 0, 3: 0 };

// 遍历并更新
for (const key in reactions) {
    const reaction = reactions[key];
    const newDifficulty = assignDifficulty(reaction);
    reaction.difficulty = newDifficulty;
    stats[newDifficulty]++;
}

// 保存
fs.writeFileSync(outputFile, JSON.stringify(reactions, null, 2), 'utf-8');

console.log('=== 难度评定完成 ===');
console.log(`简单 (★):     ${stats[1]} 个反应`);
console.log(`中等 (★★):   ${stats[2]} 个反应`);
console.log(`困难 (★★★): ${stats[3]} 个反应`);
console.log(`总计: ${stats[1] + stats[2] + stats[3]} 个反应`);
console.log('\n已更新 parsed_reactions.json');
console.log('请运行 node tools/rebuild_reactions.js 来同步 reactions.js');
