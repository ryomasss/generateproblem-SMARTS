/**
 * SMARTS 语法错误自动修复工具
 * 修复以下问题：
 * 1. 反应物分隔符 `.` 周围的多余空格
 * 2. 反应箭头 `>>` 周围的多余空格
 * 3. 产物之间的空格问题
 * 4. 中文标点替换为英文标点
 * 5. 其他常见 SMARTS 语法问题
 */

const fs = require('fs');
const path = require('path');

// 读取 SMARTS.txt
const smartsPath = path.join(__dirname, '..', 'SMARTS.txt');
const content = fs.readFileSync(smartsPath, 'utf-8');

// 统计修复次数
let fixCount = {
    spaceAroundDot: 0,
    spaceAroundArrow: 0,
    chinesePunctuation: 0,
    spaceInSmarts: 0,
    invalidPatterns: 0
};

// 处理每一行
const lines = content.split('\n');
const fixedLines = lines.map((line, index) => {
    const lineNum = index + 1;
    let originalLine = line;
    let fixedLine = line;
    
    // 跳过注释行和空行
    if (line.trim().startsWith('#') || !line.includes('>>')) {
        return fixedLine;
    }
    
    // 提取 SMARTS 部分（>>之前和之后的内容）
    // 格式通常是: SMARTS >> products, # comment 或 SMARTS >> products #comment
    
    // 1. 修复中文逗号和句号
    if (fixedLine.includes('，')) {
        fixedLine = fixedLine.replace(/，/g, ',');
        fixCount.chinesePunctuation++;
    }
    
    // 2. 修复反应箭头周围的空格（但保留标准格式）
    // 标准格式应该是 >> 不带空格
    fixedLine = fixedLine.replace(/\s*>>\s*/g, '>>');
    if (fixedLine !== originalLine) {
        fixCount.spaceAroundArrow++;
    }
    
    // 3. 修复分隔符 . 周围的空格
    // 在 SMARTS 中，. 分隔多个反应物/产物，不应该有空格
    // 但要小心不要破坏注释中的内容
    
    // 找到 SMARTS 部分（在 # 或 , 之前的部分）
    const smartsMatch = fixedLine.match(/^([^#,]+)/);
    if (smartsMatch) {
        let smartsPart = smartsMatch[1];
        let restPart = fixedLine.slice(smartsPart.length);
        
        // 修复 SMARTS 中 . 周围的空格
        // 例如: [C:1]=[C:2]. [H][Br] 应该变成 [C:1]=[C:2].[H][Br]
        let originalSmarts = smartsPart;
        
        // 先处理 `. ` 和 ` .` 的情况
        smartsPart = smartsPart.replace(/\.\s+/g, '.');
        smartsPart = smartsPart.replace(/\s+\./g, '.');
        
        // 处理产物中的空格问题
        // 例如: >>[C:1] [C:2] 应该变成 >>[C:1][C:2] 或保持分子间分隔
        // 但这比较复杂，需要判断是否是分隔符还是错误
        
        // 移除 SMARTS atom 表达式之间的错误空格
        // 例如: [C:1] [C:2] 如果不是用 . 分隔，应该直接连接
        // 但是如果是 [C:1]([Br])[C:2] 这样的结构，需要保持
        
        // 修复常见错误：原子后面直接跟空格再跟原子，应该去掉空格或添加 .
        // 例如: [C:1] [C:2] 通常应该是 [C:1][C:2] 或 [C:1].[C:2]
        // 这里选择直接连接（去掉空格），因为大多数情况是书写错误
        smartsPart = smartsPart.replace(/\]\s+\[/g, '][');
        
        // 修复显式氢的书写错误，例如 [C:1][H][C:2] 中的空格
        smartsPart = smartsPart.replace(/\)\s+\[/g, ')[');
        smartsPart = smartsPart.replace(/\]\s+\(/g, '](');
        
        // 修复数字标识符后的空格，例如 [C:1] [C:2]
        smartsPart = smartsPart.replace(/(:[\d]+)\s+/g, '$1');
        
        if (smartsPart !== originalSmarts) {
            fixCount.spaceInSmarts++;
            fixedLine = smartsPart + restPart;
        }
    }
    
    // 4. 修复特殊问题
    // 修复 `/ \` 立体化学标记中的空格问题
    // 例如: ([H]) / [C:1]=[C:2]\ ([H]) 应该是 ([H])/[C:1]=[C:2]\([H])
    fixedLine = fixedLine.replace(/\s+\/\s+/g, '/');
    fixedLine = fixedLine.replace(/\s+\\\s+/g, '\\');
    
    // 5. 修复一些已知的无效模式
    // 例如: [X] 应该替换为具体的卤素 [F,Cl,Br,I]
    // 但这个修复可能影响语义，暂时跳过
    
    // 记录修复情况
    if (fixedLine !== originalLine) {
        console.log(`Line ${lineNum}: Fixed`);
        console.log(`  Before: ${originalLine.trim()}`);
        console.log(`  After:  ${fixedLine.trim()}`);
        console.log('');
    }
    
    return fixedLine;
});

// 输出统计
console.log('\n=== 修复统计 ===');
console.log(`反应物分隔符空格: ${fixCount.spaceAroundDot}`);
console.log(`反应箭头空格: ${fixCount.spaceAroundArrow}`);
console.log(`中文标点: ${fixCount.chinesePunctuation}`);
console.log(`SMARTS 内部空格: ${fixCount.spaceInSmarts}`);
console.log(`无效模式: ${fixCount.invalidPatterns}`);

// 写入修复后的文件
const outputPath = path.join(__dirname, '..', 'SMARTS_fixed.txt');
fs.writeFileSync(outputPath, fixedLines.join('\n'), 'utf-8');
console.log(`\n修复后的文件已保存到: ${outputPath}`);

// 同时创建备份并替换原文件
const backupPath = path.join(__dirname, '..', 'SMARTS_backup.txt');
fs.copyFileSync(smartsPath, backupPath);
console.log(`原文件备份到: ${backupPath}`);

// 询问是否替换原文件
console.log('\n如需替换原文件，请运行:');
console.log(`  copy "${outputPath}" "${smartsPath}"`);
