// --- 反应引擎模块 ---
// 处理化学反应的核心逻辑

import { appState, REACTION_DB } from './state.js';

/**
 * 使用浏览器端 RDKit.js 执行反应
 */
function tryBrowserRDKit(smarts, reactantSmiles) {
    if (!appState.rdkitModule) return null;
    
    try {
        const rdkit = appState.rdkitModule;
        
        // 检查是否支持反应功能和 MolList
        if (typeof rdkit.get_rxn !== 'function') {
            console.log("浏览器端 RDKit 不支持反应功能");
            return null;
        }
        
        if (typeof rdkit.MolList !== 'function') {
            console.log("浏览器端 RDKit 不支持 MolList");
            return null;
        }
        
        console.log(`🔬 尝试解析 SMARTS: ${smarts}`);
        const rxn = rdkit.get_rxn(smarts);
        
        if (!rxn) {
            console.warn("无法解析反应 SMARTS");
            return null;
        }
        
        // 创建 MolList 并添加反应物分子
        const molList = new rdkit.MolList();
        const mols = []; // 用于追踪需要清理的分子
        
        for (const smi of reactantSmiles) {
            const mol = rdkit.get_mol(smi);
            if (!mol || !mol.is_valid) {
                console.warn(`无效的反应物 SMILES: ${smi}`);
                // 清理已创建的分子
                mols.forEach(m => m.delete());
                molList.delete();
                rxn.delete();
                return null;
            }
            molList.append(mol);
            mols.push(mol);
        }
        
        // 执行反应
        console.log(`🔬 执行反应，反应物数量: ${molList.size()}`);
        let productSmilesList = [];
        
        try {
            // RDKit.js run_reactants 返回产物集
            const productSets = rxn.run_reactants(molList, 1000);
            
            if (productSets) {
                const size = typeof productSets.size === 'function' ? productSets.size() : 0;
                console.log(`🔬 反应产物集数量: ${size}`);
                
                if (size > 0) {
                    // 遍历产物集 - productSets 使用 get() 方法
                    for (let i = 0; i < size; i++) {
                        const productSet = productSets.get(i);
                        
                        if (productSet) {
                            // 如果 productSet 本身就是一个 Mol 对象（有 get_smiles 方法）
                            if (typeof productSet.get_smiles === 'function') {
                                try {
                                    const smiles = productSet.get_smiles();
                                    if (smiles && smiles.length > 0) {
                                        productSmilesList.push(smiles);
                                        console.log(`🔬 产物 SMILES (直接): ${smiles}`);
                                    }
                                } catch (e) {
                                    console.warn(`获取 SMILES 失败:`, e.message);
                                }
                            }
                            // 如果 productSet 是一个 MolList（有 size 和 at 方法）
                            else if (typeof productSet.size === 'function') {
                                const setSize = productSet.size();
                                console.log(`🔬 产物集 ${i} 包含 ${setSize} 个产物`);
                                
                                // MolList 使用 at() 方法访问元素
                                for (let j = 0; j < setSize; j++) {
                                    const productMol = productSet.at(j);
                                    
                                    if (productMol && typeof productMol.get_smiles === 'function') {
                                        try {
                                            const smiles = productMol.get_smiles();
                                            if (smiles && smiles.length > 0) {
                                                productSmilesList.push(smiles);
                                                console.log(`🔬 产物 SMILES: ${smiles}`);
                                            }
                                        } catch (e) {
                                            console.warn(`无法获取产物 SMILES:`, e.message);
                                        }
                                        if (typeof productMol.delete === 'function') productMol.delete();
                                    }
                                }
                            }
                            
                            if (typeof productSet.delete === 'function') productSet.delete();
                        }
                    }
                }
                
                if (typeof productSets.delete === 'function') productSets.delete();
            }
        } catch (runError) {
            console.warn("执行反应时出错:", runError.message);
        }
        
        // 清理
        mols.forEach(m => m.delete());
        molList.delete();
        rxn.delete();
        
        if (productSmilesList.length > 0) {
            const uniqueProducts = [...new Set(productSmilesList)];
            console.log(`✅ 浏览器端 RDKit 成功: ${uniqueProducts.length} 个产物`);
            return uniqueProducts;
        }
        
        return null;
    } catch (e) {
        console.warn("浏览器端 RDKit 反应失败:", e.message);
        return null;
    }
}

/**
 * 获取服务器 API 的 URL
 * 支持通过服务器访问和直接打开的两种情况
 */
function getServerApiUrl() {
    // 如果通过 localhost/127.0.0.1 访问，使用同源请求
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        return '/api/react';
    }
    // 如果是 file:// 协议或其他，使用完整 URL
    return 'http://127.0.0.1:8000/api/react';
}

/**
 * 使用服务器端 RDKit 引擎生成产物
 */
async function tryServerRDKit(smarts, reactantSmiles) {
    const apiUrl = getServerApiUrl();
    
    try {
        console.log(`🌐 调用服务器 API: ${apiUrl}`);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ smarts, reactants: reactantSmiles })
        });

        // 尝试解析 JSON 响应（即使是 500 错误也可能有 JSON 数据）
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            if (!response.ok) {
                console.warn(`服务器返回错误: ${response.status} (非 JSON 响应)`);
                return null;
            }
            throw jsonError;
        }

        if (!response.ok) {
            console.warn(`服务器返回错误: ${response.status}${data.error ? ` - ${data.error}` : ''}`);
            // 即使 500 错误，如果有 products 数据仍然使用
            if (data.products && data.products.length > 0) {
                return data.products;
            }
            return null;
        }
        
        if (data.error) {
            console.warn(`服务器返回错误信息: ${data.error}`);
        }
        
        if (data.products && data.products.length > 0) {
            console.log(`✅ 服务器端 RDKit 成功: ${data.products.length} 个产物`);
            return data.products;
        }
        
        console.log(`📭 服务器返回空产物列表`);
        return null;
    } catch (e) {
        console.warn(`🔴 服务器连接失败: ${e.message}`);
        return null;
    }
}

/**
 * 过滤产物，只保留主产物（最多2个）
 * 优先选择分子量较大的产物（通常是主产物）
 */
function filterMainProducts(products, maxCount = 2) {
    if (!products || products.length <= maxCount) {
        return products;
    }
    
    // 按 SMILES 长度排序（通常主产物分子量更大，SMILES 更长）
    // 过滤掉太简单的副产物（如 O, [H][H], Br 等）
    const filtered = products
        .filter(s => s.length > 3)  // 过滤掉太简单的分子
        .sort((a, b) => b.length - a.length)  // 按长度降序
        .slice(0, maxCount);
    
    return filtered.length > 0 ? filtered : products.slice(0, maxCount);
}

/**
 * 从 SMARTS 计算需要的反应物数量
 * @param {string} smarts - 反应 SMARTS
 * @returns {number} 反应物模板数量
 */
function countReactantTemplates(smarts) {
    // 分离反应物和产物部分
    const parts = smarts.split('>>');
    if (parts.length < 2) return 1;
    
    const reactantPart = parts[0];
    // 计算 '.' 分隔符数量 + 1 = 反应物数量
    // 但需要注意不要计算括号内的 '.'
    let count = 1;
    let depth = 0;
    for (const char of reactantPart) {
        if (char === '[' || char === '(') depth++;
        else if (char === ']' || char === ')') depth--;
        else if (char === '.' && depth === 0) count++;
    }
    return count;
}

/**
 * 主反应执行函数 - 按优先级尝试不同方法
 * @param {string} rxnKey - 反应类型键
 * @param {string} r1Smiles - 反应物1的SMILES
 * @param {string} r2Smiles - 反应物2的SMILES
 * @returns {Promise<string[]>} 产物SMILES数组（最多2个主产物）
 */
export async function runReactionWithRDKit(rxnKey, r1Smiles, r2Smiles) {
    const def = REACTION_DB[rxnKey];
    if (!def || !def.smarts) {
        console.error("未定义的反应或缺少 SMARTS:", rxnKey);
        return ["?"];
    }

    // 计算 SMARTS 中需要的反应物数量
    const requiredReactants = countReactantTemplates(def.smarts);
    
    // 构建反应物列表，只包含有效的 SMILES
    let reactantSmiles = [r1Smiles, r2Smiles].filter(s => s && s !== "FAILED");
    
    // 特殊处理：如果需要2个反应物但只有1个，复制第一个（用于自身缩合等反应）
    if (requiredReactants === 2 && reactantSmiles.length === 1) {
        reactantSmiles = [reactantSmiles[0], reactantSmiles[0]];
        console.log(`📋 复制反应物用于自身缩合: ${reactantSmiles[0]}`);
    }
    // 如果反应物过多，截取需要的数量
    else if (reactantSmiles.length > requiredReactants) {
        reactantSmiles = reactantSmiles.slice(0, requiredReactants);
    }
    
    if (reactantSmiles.length === 0) {
        console.warn("没有有效的反应物");
        return ["?"];
    }

    console.log(`🧪 执行反应: ${def.name} | 反应物: ${reactantSmiles.join(' + ')} (需要${requiredReactants}个)`);

    // 1. 先尝试服务器端 RDKit（更可靠）
    let products = await tryServerRDKit(def.smarts, reactantSmiles);
    if (products && products.length > 0) {
        return filterMainProducts(products);
    }

    // 2. 尝试浏览器端 RDKit（作为备选）
    products = tryBrowserRDKit(def.smarts, reactantSmiles);
    if (products && products.length > 0) {
        return filterMainProducts(products);
    }

    // 3. Fallback: Return "FAILED" if no products could be generated
    console.log(`⚠️ RDKit execution failed or produced no valid products.`);
    return ["?"];
}


