const fs = require('fs');
const path = require('path');

// 文件路径
const reactionsFile = path.join(__dirname, '../reactions.js');

// 读取文件
let content = fs.readFileSync(reactionsFile, 'utf-8');

// 需要修复的反应规则
const fixes = {
    // 聚合反应 - 产物格式不正确，需要修复为简单的二聚体或标记为不可用
    'alkene_gen_20': {
        action: 'fix',
        oldSmarts: '[C:1]=[C:2]>>-[C:1]-[C:2]-',
        newSmarts: '[C:1]=[C:2].[C:3]=[C:4]>>[C:1][C:2][C:3][C:4]',
        newName: '烯烃二聚反应'
    },
    'alkene_gen_45': {
        action: 'delete', // 与 alkene_gen_20 重复
        reason: '与 alkene_gen_20 重复'
    },
    
    // 苯酚三溴代 - 产物中的 [Br][Br][Br] 是错误的副产物表示
    'benzene_gen_10': {
        action: 'fix',
        oldSmarts: '[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[Br][Br].[Br][Br].[Br][Br]>>[c:1]1([Br])[c:2][c:3]([Br])[c:4][c:5]([Br])[c:6]1[O].[Br][Br][Br]',
        newSmarts: '[c:1]1[c:2][c:3][c:4][c:5][c:6]1[OH].[Br][Br]>>[c:1]1([Br])[c:2][c:3]([Br])[c:4][c:5]([Br])[c:6]1[OH]',
        newName: '苯酚三溴代',
        newCondition: 'Br₂ (过量)'
    },
    'benzene_gen_70': {
        action: 'delete', // 与 benzene_gen_10 重复
        reason: '与 benzene_gen_10 重复'
    },
    
    // 环烷烃氧化 - 产物中 (=O)(O) 应该是 (=O)[OH] 表示羧酸
    'cycloalkane_gen_11': {
        action: 'fix',
        oldSmarts: '[C:1]1[C:2][C:3]=[C:4][C:5][C:6]1>>[C:4](=O)(O)[C:5][C:6][C:1][C:2][C:3](=O)(O)',
        newSmarts: '[C:1]1[C:2][C:3]=[C:4][C:5][C:6]1>>[C:4](=O)[OH].[C:3](=O)[OH].[C:1][C:2].[C:5][C:6]',
        newName: '环烯烃氧化断裂',
        newCondition: 'KMnO₄, H⁺'
    }
};

let fixCount = 0;
let deleteCount = 0;

for (const [key, fix] of Object.entries(fixes)) {
    if (fix.action === 'delete') {
        // 删除整个反应条目
        // 匹配格式: key: { ... }, 或 key: { ... }
        const deletePattern = new RegExp(
            `\\s*${key}:\\s*\\{[^}]*(?:\\{[^}]*\\}[^}]*)*\\},?\\n?`,
            'g'
        );
        const before = content.length;
        content = content.replace(deletePattern, '\n');
        if (content.length < before) {
            deleteCount++;
            console.log(`🗑️ 删除: ${key} (${fix.reason})`);
        }
    } else if (fix.action === 'fix') {
        // 修复 SMARTS
        if (fix.oldSmarts) {
            const escapedOld = fix.oldSmarts.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const smartsPattern = new RegExp(
                `smarts:\\s*["']${escapedOld}["']`,
                'g'
            );
            if (smartsPattern.test(content)) {
                content = content.replace(smartsPattern, `smarts: "${fix.newSmarts}"`);
                fixCount++;
                console.log(`✅ 修复 SMARTS: ${key}`);
            }
        }
        
        // 修复名称
        if (fix.newName) {
            const namePattern = new RegExp(
                `(${key}:\\s*\\{[^}]*name:\\s*["'])[^"']+["']`,
                'g'
            );
            content = content.replace(namePattern, `$1${fix.newName}"`);
        }
        
        // 修复条件
        if (fix.newCondition) {
            const condPattern = new RegExp(
                `(${key}:\\s*\\{[^}]*condition:\\s*["'])[^"']+["']`,
                'g'
            );
            content = content.replace(condPattern, `$1${fix.newCondition}"`);
        }
    }
}

fs.writeFileSync(reactionsFile, content, 'utf-8');

console.log(`\n=== 修复完成 ===`);
console.log(`修复: ${fixCount} 个反应`);
console.log(`删除: ${deleteCount} 个反应`);
