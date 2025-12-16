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
 * @returns {boolean} 是否通过复杂度检查
 */
function checkMoleculeComplexity(smiles) {
    if (!smiles) return false;
    
    // 1. 限制 SMILES 字符串长度（过长的分子浏览器端 RDKit 可能无法解析）
    if (smiles.length > 50) {
        console.log(`🚫 分子过于复杂 (长度 ${smiles.length}): ${smiles.substring(0, 40)}...`);
        return false;
    }
    
    // 2. 计算原子数的粗略估计
    const atomCount = smiles.replace(/[\[\]()0-9@\\\\/=#+-]/g, '').length;
    
    // 3. 过滤掉原子数少于3或多于20的分子
    if (atomCount < 3 || atomCount > 20) {
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
    
    return true;
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
    
    // 尝试使用 fastsubstructure（更快但不稳定），失败时回退到标准 substructure（更慢但更稳定）
    const fastUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastsubstructure/smarts/${encodeURIComponent(smarts)}/cids/JSON?MaxRecords=${CACHE_CONFIG.maxRecords}`;
    const standardUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/substructure/smarts/${encodeURIComponent(smarts)}/cids/JSON?MaxRecords=${CACHE_CONFIG.maxRecords}`;

    try {
        let response;
        let usedFallback = false;
        
        // 首先尝试 fast endpoint
        try {
            response = await fetchWithRetry(fastUrl, 2, 1000); // 较少重试次数
        } catch (fastError) {
            console.warn(`⚠️ fastsubstructure 失败 (${fastError.message})，尝试标准 substructure...`);
            usedFallback = true;
            // 回退到标准 substructure endpoint
            response = await fetchWithRetry(standardUrl, 3, 2000);
        }
        
        if (!response || !response.ok) {
            if (response && response.status === 404) return []; // No results
            throw new Error(`PubChem API error: ${response ? response.status : 'no response'}`);
        }
        
        const data = await response.json();
        if (!data.IdentifierList || !data.IdentifierList.CID) return [];
        
        const cids = data.IdentifierList.CID;
        if (cids.length === 0) return [];
        
        console.log(`📥 获取到 ${cids.length} 个 CID${usedFallback ? ' (使用标准搜索)' : ''}`);

        // Fetch properties (SMILES) for these CIDs
        // 注意：只请求 SMILES，PubChem 会返回 "SMILES" 字段
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
            
            // 创建 SMARTS 模式用于验证（针对脂肪族双键使用更严格的模式）
            let verificationPattern = null;
            try {
                // 对于 C=C（烯烃），使用更严格的 SMARTS 来排除芳香族
                // [#6;!a]=[#6;!a] 匹配任意两个非芳香碳原子之间的双键
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
                    
                    // 如果有验证模式，检查分子是否匹配
                    if (verificationPattern) {
                        const matches = mol.get_substruct_match(verificationPattern);
                        if (!matches || matches === "{}") {
                            console.log(`🚫 过滤不匹配的分子: ${s}`);
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
            
            // 清理验证模式
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
 * 预加载常用分子到缓存
 */
export async function preloadCommonMolecules() {
    const commonSmarts = [
        "C=C",           // 烯烃
        "C#C",           // 炔烃
        "c1ccccc1",      // 苯环
        "[CH2][OH]",     // 伯醇
        "[CH]([OH])",    // 仲醇
        "C=O",           // 羰基
        "[CX3](=O)[OH]"  // 羧酸
    ];
    
    console.log("🚀 预加载常用分子...");
    showStatus("预加载分子库...", "loading");
    
    for (const smarts of commonSmarts) {
        // 跳过已缓存的
        if (appState.moleculeCache[smarts] && appState.moleculeCache[smarts].length > 0) {
            console.log(`📦 已缓存: ${smarts}`);
            continue;
        }
        await fetchMoleculesFromPubChem(smarts);
        // 增加延迟到 1 秒，避免触发 PubChem 限流
        await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log("✅ 预加载完成");
}

/**
 * 为选定的反应类型准备分子池
 * @param {string[]} availableTypes - 可用的反应类型键数组
 */
export async function prepareMoleculePools(availableTypes) {
    const neededSmarts = new Set();
    
    for (const typeKey of availableTypes) {
        const def = REACTION_DB[typeKey];
        if (def && def.search_smarts) {
            def.search_smarts.forEach(s => {
                if (s) {
                    neededSmarts.add(JSON.stringify({ search: s, verification: def.smarts }));
                }
            });
        }
    }
    
    if (neededSmarts.size === 0) return;
    
    // 计算需要从网络获取的数量
    const smartsList = Array.from(neededSmarts);
    let needFetch = 0;
    for (const jsonStr of smartsList) {
        const item = JSON.parse(jsonStr);
        const cacheKey = item.search + (item.verification ? `|${item.verification}` : "");
        if (!appState.moleculeCache[cacheKey] || appState.moleculeCache[cacheKey].length === 0) {
            needFetch++;
        }
    }
    
    if (needFetch === 0) {
        showStatus("使用缓存数据", "success");
        return;
    }
    
    showStatus(`正在从 PubChem 获取 ${needFetch}/${neededSmarts.size} 类分子...`, "loading");
    
    // Fetch sequentially to avoid hitting rate limits
    for (const jsonStr of smartsList) {
        const item = JSON.parse(jsonStr);
        await fetchMoleculesFromPubChem(item.search, item.verification);
        // 增加延迟到 1 秒，避免触发限流
        await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log(`📊 缓存统计: 命中=${cacheStats.hits}, 未命中=${cacheStats.misses}`);
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
