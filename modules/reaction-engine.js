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
        
        // 检查是否支持反应功能
        if (typeof rdkit.get_rxn !== 'function') {
            console.log("浏览器端 RDKit 不支持反应功能");
            return null;
        }
        
        const rxn = rdkit.get_rxn(smarts);
        if (!rxn || !rxn.is_valid()) {
            console.warn("无效的反应 SMARTS");
            return null;
        }
        
        // 创建反应物分子
        const mols = [];
        for (const smi of reactantSmiles) {
            const mol = rdkit.get_mol(smi);
            if (!mol || !mol.is_valid()) {
                mols.forEach(m => m.delete());
                return null;
            }
            mols.push(mol);
        }
        
        // 执行反应
        const products = rxn.run_reactants(mols, 1000);
        
        // 清理
        mols.forEach(m => m.delete());
        rxn.delete();
        
        if (products && products.length > 0) {
            const uniqueProducts = [...new Set(products)];
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
 * 使用服务器端 RDKit 引擎生成产物
 */
async function tryServerRDKit(smarts, reactantSmiles) {
    try {
        const response = await fetch('http://localhost:8000/api/react', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ smarts, reactants: reactantSmiles })
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
            console.log(`✅ 服务器端 RDKit 成功: ${data.products.length} 个产物`);
            return data.products;
        }
        
        return null;
    } catch (e) {
        // 静默失败，不打印错误（因为服务器可能没运行）
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

    const reactantSmiles = [r1Smiles, r2Smiles].filter(s => s && s !== "FAILED");
    
    if (reactantSmiles.length === 0) {
        console.warn("没有有效的反应物");
        return ["?"];
    }

    console.log(`🧪 执行反应: ${def.name} | 反应物: ${reactantSmiles.join(' + ')}`);

    // 1. 先尝试浏览器端 RDKit（最快）
    let products = tryBrowserRDKit(def.smarts, reactantSmiles);
    if (products && products.length > 0) {
        return filterMainProducts(products);
    }

    // 2. 尝试服务器端 RDKit
    products = await tryServerRDKit(def.smarts, reactantSmiles);
    if (products && products.length > 0) {
        return filterMainProducts(products);
    }

    // 3. 最后尝试预定义产物
    console.log(`⚠️ RDKit 执行失败，尝试预定义产物`);
    return getPredefinedProduct(rxnKey, r1Smiles, r2Smiles);
}

/**
 * 返回预定义的产物SMILES（当RDKit反应功能不可用时）
 * @param {string} rxnKey - 反应类型键
 * @param {string} r1Smiles - 反应物1的SMILES
 * @param {string} r2Smiles - 反应物2的SMILES
 * @returns {string} 产物SMILES或"FAILED"
 */
export function getPredefinedProduct(rxnKey, r1Smiles, r2Smiles) {
    const predefinedProducts = {
        'alkene_addition_br2': {
            'C=C': 'C(Br)C(Br)',
            'CC=C': 'CCC(Br)Br',
            'C1=CCCCC1': 'C1C(Br)C(Br)CCC1'
        },
        'alkene_addition_cl2': {
            'C=C': 'C(Cl)C(Cl)',
            'CC=C': 'CCC(Cl)Cl',
            'C1=CCCCC1': 'C1C(Cl)C(Cl)CCC1'
        },
        'alkene_addition_hbr': {
            'C=C': 'CCBr',
            'CC=C': 'CCC(Br)',
            'CC(=C)C': 'CC(Br)C',  // 异丁烯 + HBr -> 叔丁基溴化物（马氏规则）
            'C1=CCCCC1': 'C1C(Br)CCCC1'
        },
        'alkene_addition_h2o': {
            'C=C': 'C(O)CO',
            'CC=C': 'CCC(O)',
            'C1=CCCCC1': 'C1C(O)CCC1'
        },
        'alkene_epoxidation': {
            'C=C': 'C1CO1',
            'CC=C': 'CC1CO1',
            'CC(=C)C': 'CC1(C)CO1'
        },
        'alkene_hydrogenation': {
            'C=C': 'CC',
            'CC=C': 'CCC',
            'CC(=C)C': 'CC(C)C',
            'C1=CCCC1': 'C1CCCCC1'
        },
        'alkene_ozonolysis': {
            'C=C': 'C=O',
            'CC=C': 'CC=O',
            'CC(=C)C': 'CC(=O)C'
        },
        'benzene_halogenation_br': {
            'Cc1ccccc1': 'C(Br)c1ccccc1',
            'c1ccccc1': 'BrC1=CC=CC=C1'
        },
        'benzene_nitration': {
            'c1ccccc1': '[N+](=O)([O-])c1ccccc1',
            'Cc1ccccc1': 'C[N+](=O)([O-])c1ccccc1'
        },
        'benzene_friedel_crafts_alkyl': {
            'c1ccccc1': 'CCc1ccccc1',
            'Cc1ccccc1': 'CCc1ccc(C)cc1'
        },
        'benzene_friedel_crafts_acyl': {
            'c1ccccc1': 'CC(=O)c1ccccc1',
            'Cc1ccccc1': 'CC(=O)c1ccc(C)cc1'
        },
        'alkyne_addition_hbr_1': {
            'C#C': 'C(Br)=C',
            'CC#C': 'CCC(Br)=C'
        },
        'alkyne_hydration_terminal': {
            'C#C': 'CC=O',
            'CC#C': 'CCC=O'
        },
        'alkyne_hydrogenation_full': {
            'C#C': 'CC',
            'CC#C': 'CCC'
        },
        'alkyne_hydrogenation_lindlar': {
            'C#C': 'C=C',
            'CC#C': 'C=CC'
        },
        'alcohol_oxidation_primary': {
            'CO': 'C=O',
            'CCO': 'CC=O',
            'CCCO': 'CCC=O'
        },
        'alcohol_oxidation_secondary': {
            'CC(C)O': 'CC(=O)C',
            'CCC(C)O': 'CCCC(=O)C'
        },
        'alcohol_dehydration_intra': {
            'CCO': 'C=C',
            'CCCO': 'C=CC',
            'CC(C)O': 'C=C'
        },
        'williamson_ether': {
            'CO': 'COC',
            'CCO': 'COC(C)C'
        },
        'carbonyl_reduction_alcohol': {
            'C=O': 'CO',
            'CC=O': 'CCO',
            'CC(=O)C': 'CC(O)C',
            'c1ccccc1C=O': 'c1ccccc1CO',
            'c1ccccc1C(=O)C': 'c1ccccc1C(O)C'
        },
        'grignard_addition': {
            'CC=O': 'CCC(O)(C)',  // 乙醛 + CH3MgCl -> 2-丙醇
            'CCC=O': 'CCCC(O)(C)',  // 丙醛 + CH3MgCl -> 2-丁醇
            'c1ccccc1C=O': 'c1ccccc1C(O)(C)'  // 苯甲醛 + CH3MgCl
        },
        'aldol_condensation': {
            'CC=O': 'CC(O)CC=O',  // 乙醛 -> 羟基丁醛
            'CC(=O)C': 'CC(=O)CC(C)(O)C',  // 丙酮 -> 双丙酮醇
            'c1ccccc1C=O': 'c1ccccc1C(O)CC(=O)c1ccccc1'  // 苯甲醛
        },
        'esterification': {
            'CC(=O)O': 'CC(=O)OC',  // 乙酸 + 甲醇 -> 乙酸甲酯
            'CCC(=O)O': 'CCC(=O)OCC'  // 丙酸 + 乙醇 -> 丙酸乙酯
        }
    };
    
    const reactionProducts = predefinedProducts[rxnKey];
    if (reactionProducts) {
        const safeR1 = r1Smiles || "";
        const safeR2 = r2Smiles || "";
        
        for (const [reactant, product] of Object.entries(reactionProducts)) {
            if (safeR1.includes(reactant) || safeR2.includes(reactant) || 
                safeR1.startsWith(reactant) || safeR2.startsWith(reactant) ||
                safeR1.endsWith(reactant) || safeR2.endsWith(reactant)) {
                return [product];
            }
        }
        
        // 通用规则推断
        if (rxnKey.startsWith('alkene_')) {
            if (safeR1.includes('C=') || safeR2.includes('C=')) {
                if (rxnKey.includes('addition_br2')) {
                    return [safeR1.replace('C=', 'C(Br)-').replace('C=C', 'C(Br)C(Br)')];
                } else if (rxnKey.includes('addition_hbr')) {
                    return [safeR1.replace('C=C', 'CC(Br)')];
                } else if (rxnKey.includes('addition_h2o')) {
                    return [safeR1.replace('C=C', 'C(O)C')];
                } else if (rxnKey.includes('hydrogenation')) {
                    return [safeR1.replace('C=', 'C-')];
                }
            }
        }
        
        if (rxnKey.startsWith('alkyne_')) {
            if (safeR1.includes('C#') || safeR2.includes('C#')) {
                if (rxnKey.includes('hydrogenation_full')) {
                    return [safeR1.replace('C#', 'C-').replace('C-', 'CC')];
                } else if (rxnKey.includes('hydration_terminal')) {
                    if (safeR1.startsWith('C#') || safeR2.startsWith('C#')) {
                        return [safeR1.replace('C#C', 'CC=O')];
                    }
                }
            }
        }
    }
    
    console.warn(`未找到预定义产物，反应类型: ${rxnKey}, 反应物: ${r1Smiles}, ${r2Smiles}`);
    return ["FAILED"];
}
