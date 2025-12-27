// --- PubChem API 模块 ---
// 处理与 PubChem 数据库的交互
// 优化版本：支持 localStorage 持久化缓存、增加获取数量、分子复杂度过滤

import { appState } from './state.js';
import { showStatus } from './utils.js';
import { REACTION_DB } from './state.js';

// 缓存配置
const CACHE_CONFIG = {
    storageKey: 'pubchem_molecule_cache',
    expiryHours: 24, // 缓存过期时间（小时）
    maxRecords: 50   // 每次从 PubChem 获取的最大记录数
};

// 缓存统计
export const cacheStats = {
    hits: 0,
    misses: 0,
    fromStorage: 0,
    lastUpdated: null
};

/**
 * 从 localStorage 加载缓存
 */
export function loadCacheFromStorage() {
    try {
        const stored = localStorage.getItem(CACHE_CONFIG.storageKey);
        if (!stored) return;

        const parsed = JSON.parse(stored);
        const now = Date.now();
        const expiryMs = CACHE_CONFIG.expiryHours * 60 * 60 * 1000;

        // 检查是否过期
        if (parsed.timestamp && (now - parsed.timestamp) < expiryMs) {
            appState.moleculeCache = parsed.data || {};
            cacheStats.fromStorage = Object.keys(appState.moleculeCache).length;
            console.log(`✅ 从 localStorage 加载了 ${cacheStats.fromStorage} 条缓存数据`);
        } else {
            console.log('⏰ 缓存已过期，将重新获取');
            localStorage.removeItem(CACHE_CONFIG.storageKey);
        }
    } catch (e) {
        console.warn('加载缓存失败:', e);
    }
}

/**
 * 保存缓存到 localStorage
 */
function saveCacheToStorage() {
    try {
        const data = {
            timestamp: Date.now(),
            data: appState.moleculeCache
        };
        localStorage.setItem(CACHE_CONFIG.storageKey, JSON.stringify(data));
        cacheStats.lastUpdated = new Date().toISOString();
    } catch (e) {
        console.warn('保存缓存失败 (可能超出配额):', e);
    }
}

/**
 * Helper to fetch with retry logic
 * @param {string} url - URL to fetch
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise<Response>} - Fetch response
 */
async function fetchWithRetry(url, retries = 3, delay = 1500) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            
            // If 500, 503, or 429 (Too Many Requests / Server Issues), retry
            if (response.status === 500 || response.status === 503 || response.status === 429) {
                console.warn(`PubChem API ${response.status}. Retrying in ${delay}ms... (${i + 1}/${retries})`);
                await new Promise(r => setTimeout(r, delay));
                delay *= 2; // Exponential backoff
                continue;
            }
            
            // Other errors, throw immediately with status for fallback handling
            const error = new Error(`PubChem API error: ${response.status}`);
            error.status = response.status;
            throw error;
        } catch (e) {
            if (i === retries - 1) throw e;
            console.warn(`Fetch failed: ${e.message}. Retrying...`);
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
        }
    }
}

/**
 * 检查分子复杂度是否合适（过滤太简单或太复杂的分子）
 * @param {string} smiles - SMILES 字符串
 * @param {string} targetReactionCategory - 目标反应的分类（可选）
 * @returns {boolean} 是否通过复杂度检查
 */
function checkMoleculeComplexity(smiles, targetReactionCategory = null) {
    if (!smiles) return false;
    
    // 1. 限制 SMILES 字符串长度（过长的分子浏览器端 RDKit 可能无法解析）
    if (smiles.length > 50) {
        console.log(`🚫 分子过于复杂 (长度 ${smiles.length}): ${smiles.substring(0, 40)}...`);
        return false;
    }
    
    // 2. 计算原子数的粗略估计
    const atomCount = smiles.replace(/[\[\]()0-9@\\\\/=#+-]/g, '').length;
    
    // 3. 过滤掉原子数少于2或多于20的分子（2原子常见于试剂如 I2, H2）
    if (atomCount < 2 || atomCount > 20) {
        return false;
    }
    
    // 4. 排除含有典型生物大分子特征的 SMILES（如多个肽键）
    const peptideBondCount = (smiles.match(/C\(=O\)N/g) || []).length;
    if (peptideBondCount >= 2) {
        console.log(`🚫 可能是生物大分子: ${smiles.substring(0, 40)}...`);
        return false;
    }
    
    // 5. 排除多卤代化合物（超过2个卤素原子）
    const halogenCount = (smiles.match(/Cl|Br|F|I/g) || []).length;
    if (halogenCount > 2) {
        console.log(`🚫 过多卤素取代 (${halogenCount}个): ${smiles.substring(0, 40)}...`);
        return false;
    }
    
    // 6. 排除含有复杂杂环或多环的分子（超过2个环）
    const ringCount = (smiles.match(/[0-9]/g) || []).length / 2;
    if (ringCount > 2) {
        console.log(`🚫 环数过多 (${ringCount}): ${smiles.substring(0, 40)}...`);
        return false;
    }
    
    // 7. 排除含有金属或稀有原子的分子
    if (/\[(?:Fe|Cu|Zn|Mg|Ca|Na|K|Li|Al|Pd|Pt|Au|Ag|Hg|Pb|Sn|Si|B(?!r)|As|Se)\]/.test(smiles)) {
        console.log(`🚫 含有金属或稀有元素: ${smiles.substring(0, 40)}...`);
        return false;
    }
    
    // ========== 新增：干扰性官能团检测 ==========
    
    // 8. 排除含有强吸电子基团的分子（可能干扰亲电反应）
    const strongEWGPatterns = [
        /\[N\+\]\(=O\)\[O-\]/,      // 硝基 -NO2
        /C\(=O\)\[O-\]/,            // 羧酸根
        /S\(=O\)\(=O\)/,            // 磺酰基
        /C#N/,                       // 氰基 -CN
        /\[N\+\]#\[C-\]/,           // 异氰基
    ];
    
    const ewgCount = strongEWGPatterns.filter(p => p.test(smiles)).length;
    if (ewgCount >= 2) {
        console.log(`🚫 含有多个强吸电子基 (${ewgCount}个): ${smiles.substring(0, 40)}...`);
        return false;
    }
    
    // 9. 排除复杂杂环化合物（吡啶、嘧啶、三唑等可能干扰反应）
    const complexHeterocycles = [
        /n1ccnc1/,     // 咪唑
        /n1cccc1/,     // 吡咯 (小写n表示芳香氮)
        /n1ccccc1/,    // 吡啶
        /n1nccc1/,     // 吡唑
        /n1nncn1/,     // 三唑
        /n1cncnc1/,    // 嘧啶
        /O=C1NC/,      // 内酰胺
    ];
    
    // 对于非杂环反应，排除复杂杂环
    if (targetReactionCategory !== 'heterocycle') {
        const heterocycleCount = complexHeterocycles.filter(p => p.test(smiles.toLowerCase())).length;
        if (heterocycleCount >= 1 && targetReactionCategory !== 'benzene') {
            console.log(`🚫 含有复杂杂环: ${smiles.substring(0, 40)}...`);
            return false;
        }
    }
    
    // 10. 排除含有保护基的分子（如TBS、Boc等）
    const protectingGroups = [
        /\[Si\]\(C\)\(C\)C/,        // TBS 保护基
        /OC\(=O\)OC\(C\)\(C\)C/,    // Boc 保护基
        /Cc1ccccc1C/,               // 苄基保护基
    ];
    
    for (const pg of protectingGroups) {
        if (pg.test(smiles)) {
            console.log(`🚫 含有保护基: ${smiles.substring(0, 40)}...`);
            return false;
        }
    }
    
    // 11. 排除多官能团化合物（可能产生竞争反应）
    let functionalGroupCount = 0;
    
    // 检测各种官能团
    if (/C=C(?![a-z])/.test(smiles)) functionalGroupCount++;  // 烯烃 (非芳香)
    if (/C#C/.test(smiles)) functionalGroupCount++;           // 炔烃
    if (/C=O(?![a-zA-Z])/.test(smiles)) functionalGroupCount++;  // 羰基
    if (/[^c]O[^=]/.test(smiles) && /O/.test(smiles)) functionalGroupCount++;  // 醚/醇
    if (/N(?![+\]])/.test(smiles) && !/n/.test(smiles)) functionalGroupCount++;  // 胺 (非芳香氮)
    
    // 如果多于3种主要官能团，可能产生竞争反应
    if (functionalGroupCount > 3) {
        console.log(`🚫 官能团过多 (${functionalGroupCount}种): ${smiles.substring(0, 40)}...`);
        return false;
    }
    
    // 12. 对于烯烃/炔烃反应，排除已含卤素的底物（避免歧义）
    if (targetReactionCategory === 'alkene' || targetReactionCategory === 'alkyne') {
        if (halogenCount > 0 && smiles.match(/C=C|C#C/)) {
            console.log(`🚫 烯炔底物已含卤素: ${smiles.substring(0, 40)}...`);
            return false;
        }
    }
    
    return true;
}

/**
 * 使用异步轮询方式从 PubChem 获取子结构搜索结果
 * @param {string} smarts - SMARTS 模式
 * @returns {Promise<number[]>} CID 数组
 */
async function fetchCidsWithPolling(smarts) {
    // 第一步：提交异步搜索请求
    const submitUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/substructure/smarts/${encodeURIComponent(smarts)}/JSON`;
    
    console.log(`🔄 提交异步子结构搜索: ${smarts}`);
    const submitResponse = await fetchWithRetry(submitUrl, 2, 2000);
    
    if (!submitResponse || !submitResponse.ok) {
        throw new Error(`提交搜索失败: ${submitResponse?.status}`);
    }
    
    const submitData = await submitResponse.json();
    
    // 检查是否返回了 ListKey（异步模式）
    if (!submitData.Waiting || !submitData.Waiting.ListKey) {
        // 可能直接返回了结果（某些简单查询）
        if (submitData.IdentifierList?.CID) {
            return submitData.IdentifierList.CID;
        }
        throw new Error('无法获取 ListKey');
    }
    
    const listKey = submitData.Waiting.ListKey;
    console.log(`📋 获取到 ListKey: ${listKey}`);
    
    // 第二步：轮询获取结果
    const pollUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/listkey/${listKey}/cids/JSON?MaxRecords=${CACHE_CONFIG.maxRecords}`;
    
    const maxPolls = 10;
    const pollDelay = 2000;
    
    for (let i = 0; i < maxPolls; i++) {
        await new Promise(r => setTimeout(r, pollDelay));
        
        try {
            const pollResponse = await fetch(pollUrl);
            
            if (pollResponse.status === 202) {
                // 仍在处理中
                console.log(`⏳ 搜索进行中... (${i + 1}/${maxPolls})`);
                continue;
            }
            
            if (!pollResponse.ok) {
                throw new Error(`轮询失败: ${pollResponse.status}`);
            }
            
            const pollData = await pollResponse.json();
            
            // 检查是否仍在等待
            if (pollData.Waiting) {
                console.log(`⏳ 搜索进行中... (${i + 1}/${maxPolls})`);
                continue;
            }
            
            // 获取到结果
            if (pollData.IdentifierList?.CID) {
                return pollData.IdentifierList.CID;
            }
            
            return [];
        } catch (e) {
            console.warn(`轮询出错: ${e.message}`);
            if (i === maxPolls - 1) throw e;
        }
    }
    
    throw new Error('轮询超时');
}

/**
 * 从 PubChem 获取匹配 SMARTS 的分子
 * @param {string} smarts - SMARTS 模式
 * @param {string} verificationSmarts - 用于验证的反应 SMARTS
 * @returns {Promise<string[]>} SMILES 字符串数组
 */
export async function fetchMoleculesFromPubChem(smarts, verificationSmarts = null) {
    if (!smarts) return [];
    
    // Check memory cache first
    const cacheKey = smarts + (verificationSmarts ? `|${verificationSmarts}` : "");
    if (appState.moleculeCache[cacheKey] && appState.moleculeCache[cacheKey].length > 0) {
        cacheStats.hits++;
        console.log(`📦 缓存命中: ${smarts} (${appState.moleculeCache[cacheKey].length} 个分子)`);
        return appState.moleculeCache[cacheKey];
    }
    
    cacheStats.misses++;
    console.log(`🔍 从 PubChem 搜索: ${smarts}`);
    
    // 尝试使用 fastsubstructure（更快但不稳定），失败时回退到异步轮询模式
    const fastUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastsubstructure/smarts/${encodeURIComponent(smarts)}/cids/JSON?MaxRecords=${CACHE_CONFIG.maxRecords}`;

    try {
        let cids = [];
        let usedFallback = false;
        
        // 首先尝试 fast endpoint
        try {
            const response = await fetchWithRetry(fastUrl, 2, 1000);
            if (response && response.ok) {
                const data = await response.json();
                if (data.IdentifierList?.CID) {
                    cids = data.IdentifierList.CID;
                }
            }
        } catch (fastError) {
            console.warn(`⚠️ fastsubstructure 失败 (${fastError.message})，尝试异步轮询模式...`);
            usedFallback = true;
            // 回退到异步轮询模式
            try {
                cids = await fetchCidsWithPolling(smarts);
            } catch (pollError) {
                console.warn(`⚠️ 异步轮询也失败: ${pollError.message}`);
                return [];
            }
        }
        
        if (cids.length === 0) {
            console.log(`📭 未找到匹配分子: ${smarts}`);
            return [];
        }
        
        console.log(`📥 获取到 ${cids.length} 个 CID${usedFallback ? ' (使用异步轮询)' : ''}`);

        // Fetch properties (SMILES) for these CIDs
        const cidsStr = cids.join(',');
        const propsUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cidsStr}/property/SMILES/JSON`;
        
        // 增加延迟，避免触发限流
        await new Promise(r => setTimeout(r, 500));
        
        const propsResponse = await fetchWithRetry(propsUrl);
        const propsData = await propsResponse.json();
        
        if (!propsData.PropertyTable || !propsData.PropertyTable.Properties) {
            console.warn("属性表为空");
            return [];
        }
        
        // PubChem 返回的字段名可能是 SMILES, IsomericSMILES, 或 CanonicalSMILES
        let smilesList = propsData.PropertyTable.Properties
            .map(p => p.SMILES || p.IsomericSMILES || p.CanonicalSMILES)
            .filter(s => s) // 只过滤掉空值
            .filter(s => checkMoleculeComplexity(s)); // 过滤太复杂或太简单的分子
        
        console.log(`✅ 获取到 ${smilesList.length} 个分子 SMILES (经过复杂度过滤)`);
            
        // 严格验证：确保分子真正匹配 SMARTS 模式
        if (appState.rdkitModule && smilesList.length > 0) {
            const originalCount = smilesList.length;
            const rdkit = appState.rdkitModule;
            
            // 创建 SMARTS 模式用于验证
            let verificationPattern = null;
            try {
                let strictSmarts = smarts;
                if (smarts === "C=C") {
                    strictSmarts = "[#6;!a]=[#6;!a]";  // 排除芳香碳
                } else if (smarts === "C#C") {
                    strictSmarts = "[#6;!a]#[#6;!a]";  // 排除芳香碳
                }
                verificationPattern = rdkit.get_qmol(strictSmarts);
            } catch (e) {
                console.warn(`无法创建验证 SMARTS: ${smarts}`, e);
            }
            
            smilesList = smilesList.filter(s => {
                let mol = null;
                try {
                    mol = rdkit.get_mol(s);
                    if (!mol || !mol.is_valid()) return false;
                    
                    if (verificationPattern) {
                        const matches = mol.get_substruct_match(verificationPattern);
                        if (!matches || matches === "{}") {
                            return false;
                        }
                    }
                    
                    return true;
                } catch (e) {
                    return false;
                } finally {
                    if (mol && typeof mol.delete === "function") {
                        mol.delete();
                    }
                }
            });
            
            if (verificationPattern && typeof verificationPattern.delete === "function") {
                verificationPattern.delete();
            }
            
            if (smilesList.length < originalCount) {
                console.log(`🔬 SMARTS 验证: ${originalCount} -> ${smilesList.length} (${smarts})`);
            }
        }

        // Update cache and persist
        if (smilesList.length > 0) {
            appState.moleculeCache[cacheKey] = smilesList;
            saveCacheToStorage();
            console.log(`✅ 缓存更新: ${smarts} (${smilesList.length} 个分子)`);
        }
        
        return smilesList;
        
    } catch (e) {
        console.error("PubChem fetch failed:", e);
        return [];
    }
}

/**
 * 助手函数：并行执行任务队列并限制并发数
 * @param {Array} items - 任务项数组
 * @param {number} concurrency - 最大并发数
 * @param {Function} taskFn - 执行具体任务的函数
 */
async function runTaskQueue(items, concurrency, taskFn) {
    const results = [];
    const executing = new Set();
    
    for (const item of items) {
        const promise = taskFn(item).then(result => {
            executing.delete(promise);
            return result;
        });
        results.push(promise);
        executing.add(promise);
        
        if (executing.size >= concurrency) {
            await Promise.race(executing);
        }
    }
    
    return Promise.all(results);
}

/**
 * 预加载常用分子到缓存 (增强版：覆盖各主要分类)
 */
export async function preloadCommonMolecules() {
    const commonSmartsLists = [
        // 第一梯队：最常用
        ["C=C", "C#C", "c1ccccc1", "[CH2][OH]"],
        // 第二梯队：常见含氧/含氮
        ["[CH]([OH])", "C=O", "[CX3](=O)[OH]", "COC", "C1CO1"],
        // 第三梯队：卤代烃/酚/其他
        ["[CX4][F,Cl,Br,I]", "Oc1ccccc1", "N", "S", "C1CC1"]
    ];
    
    console.log("🚀 启动加速：预加载关键分子库...");
    showStatus("正在加速初始化分子库...", "loading");
    
    for (const group of commonSmartsLists) {
        await runTaskQueue(group, 2, async (smarts) => {
            if (!appState.moleculeCache[smarts] || appState.moleculeCache[smarts].length === 0) {
                await fetchMoleculesFromPubChem(smarts);
            }
        });
        // 组间稍微延迟
        await new Promise(r => setTimeout(r, 500));
    }
    
    console.log("✅ 常用分子库预热完成");
}

/**
 * 为选定的反应类型准备分子池 (并行优化版)
 * @param {string[]} availableTypes - 可用的反应类型键数组
 */
export async function prepareMoleculePools(availableTypes) {
    const neededItemsMap = new Map(); // 使用 Map 防止重复
    
    for (const typeKey of availableTypes) {
        const def = REACTION_DB[typeKey];
        if (!def) continue;
        
        const infos = def.reactant_info || 
                     (def.search_smarts ? def.search_smarts.map(s => ({ smarts: s })) : []);
        
        infos.forEach(info => {
            if (info && info.smarts && !info.skip) {
                const cacheKey = info.smarts + (def.smarts ? `|${def.smarts}` : "");
                if (!appState.moleculeCache[cacheKey] || appState.moleculeCache[cacheKey].length === 0) {
                    neededItemsMap.set(cacheKey, { search: info.smarts, verification: def.smarts });
                }
            }
        });
    }
    
    const neededList = Array.from(neededItemsMap.values());
    if (neededList.length === 0) {
        showStatus("就绪 (使用本地缓存)", "success");
        return;
    }
    
    showStatus(`正在从云端获取 ${neededList.length} 类分子资源...`, "loading");
    
    // 并行获取，并发量限制为 3
    await runTaskQueue(neededList, 3, async (item) => {
        await fetchMoleculesFromPubChem(item.search, item.verification);
        // PubChem 请求之间的轻微随机延迟，提高抗封锁性
        await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
    });
    
    console.log(`📊 缓存状态: 命中=${cacheStats.hits}, 新增=${cacheStats.misses}`);
}

/**
 * 清除分子缓存（内存和 localStorage）
 * 在调试或发现缓存数据有问题时使用
 */
export function clearMoleculeCache() {
    appState.moleculeCache = {};
    localStorage.removeItem(CACHE_CONFIG.storageKey);
    cacheStats.hits = 0;
    cacheStats.misses = 0;
    cacheStats.fromStorage = 0;
    console.log('🗑️ 分子缓存已清除');
}

// 暴露到 window 以便在控制台调试
window.clearMoleculeCache = clearMoleculeCache;
