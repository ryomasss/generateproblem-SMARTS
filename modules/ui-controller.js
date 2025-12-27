// --- UI 控制器模块 ---
// 处理用户界面交互和业务逻辑

import { appState, CHEMICAL_CABINET, REACTION_DB } from './state.js';
import { $, showStatus } from './utils.js';
import { prepareMoleculePools } from './pubchem-api.js';
import { runReactionWithRDKit } from './reaction-engine.js';
import { createStructureSVG } from './renderer.js';

// 配置：每次生成的题目数量（控制 API 请求数量）
const PROBLEM_COUNT = 5;

const problemsEl = $("#problems");

/**
 * 验证并选择一个合适的分子
 * 确保分子不会太复杂导致渲染失败
 * @param {string[]} pool - 分子池
 * @param {number} maxAttempts - 最大尝试次数
 * @returns {string|null} 有效的 SMILES 或 null
 */
function selectValidMolecule(pool, maxAttempts = 10) {
    if (!pool || pool.length === 0) return null;
    
    for (let i = 0; i < maxAttempts; i++) {
        const smiles = pool[Math.floor(Math.random() * pool.length)];
        
        // 基本检查
        if (!smiles || typeof smiles !== 'string') continue;
        
        // 长度检查
        if (smiles.length > 60) {
            console.log(`🚫 跳过复杂分子: ${smiles.substring(0, 30)}...`);
            continue;
        }
        
        // 用 RDKit 验证
        if (appState.rdkitModule) {
            try {
                const mol = appState.rdkitModule.get_mol(smiles);
                if (mol && mol.is_valid()) {
                    mol.delete();
                    return smiles;
                }
                if (mol) mol.delete();
            } catch (e) {
                continue;
            }
        } else {
            return smiles;
        }
    }
    
    // 如果多次尝试都失败，返回池中最短的分子
    const sorted = [...pool].sort((a, b) => a.length - b.length);
    return sorted[0] || null;
}

/**
 * 检测是否为简单分子或试剂（如双原子分子、酸、试剂等）
 * 这些分子可以直接作为 SMILES 使用，不需要从 PubChem 获取
 * @param {string} smarts - SMARTS 或 SMILES 字符串
 * @returns {boolean} 是否为简单分子
 */
function isSimpleMolecule(smarts) {
    if (!smarts || typeof smarts !== 'string') return false;
    
    // 简单分子和试剂的模式
    const simpleMolecules = [
        // 双原子氢卤化物
        '[H][H]',           // 氢气
        '[Br][Br]', 'BrBr', // 溴
        '[Cl][Cl]', 'ClCl', // 氯
        '[F][F]', 'FF',     // 氟
        '[I][I]', 'II',     // 碘
        
        // 氢卤酸
        '[H][Br]', '[Br][H]', 'Br', // 氢溴酸
        '[H][Cl]', '[Cl][H]', 'Cl', // 盐酸
        '[H][I]', '[I][H]', 'I', 'HI', 'II',    // 氢碘及碘单质
        '[H][F]', '[F][H]', 'F',    // 氢氟酸
        
        // 次卤酸
        '[OH][Br]', 'OBr',   // 次溴酸
        '[OH][Cl]', 'OCl',   // 次氯酸
        '[OH][I]', 'OI', 'HOI',     // 次碘酸
        
        // 水和氢氧化物
        'O', '[O]', '[OH2]', '[O][H]', // 水
        '[OH-]', 'O=[O]', '[O][O]',    // 氢氧根、氧气
        
        // 金属离子（直接使用 SMILES）
        '[Na+]', '[K+]', '[Li+]',      // 碱金属离子
        '[Ag+]', '[Cu+]', '[Cu+2]',    // 过渡金属离子
        '[Hg]', '[Hg+2]',              // 汞
        '[Mg]', '[Mg+2]',              // 镁
        '[Zn]', '[Zn+2]',              // 锌
        
        // 氮化合物
        '[NH2]', '[NH3]', 'N',         // 氨
        '[N+](=O)[O-]',                // 硝基
        '[N+](=O)([O-])[O]',           // 硝酸
        
        // 氰根
        '[C-]#N', '[C-]#[N]', '[CN-]', // 氰根
        
        // 硫化合物
        '[S](=O)(=O)O', 'OS(=O)(=O)O', // 硫酸
        '[S](=O)(Cl)(Cl)', 'ClS(Cl)=O', // 亚硫酰氯
        
        // 磷化合物
        '[P](Cl)(Cl)(Cl)', 'ClP(Cl)Cl', // 三氯化磷
        
        // 常用有机试剂
        'CC(=O)OC(=O)C',               // 乙酸酐
        'CC(=O)O',                      // 乙酸
        
        // 格氏试剂骨架
        '[Mg][Br]', '[Mg][Cl]', '[Mg][I]',
        
        // 有机锂
        '[Li]',
    ];
    
    // 也检查移除原子映射后的模式
    const normalizedSmarts = smarts.replace(/:\d+/g, '');
    
    return simpleMolecules.includes(smarts) || simpleMolecules.includes(normalizedSmarts);
}

/**
 * 重新渲染现有题目的结构式（不生成新题目）
 * 当用户调整基准尺寸、键宽、字号等参数时使用
 */
export function refreshExistingStructures() {
    if (!appState.currentProblemsData || appState.currentProblemsData.length === 0) {
        return;
    }
    
    const problems = document.querySelectorAll(".problem");
    problems.forEach((problemEl, idx) => {
        const data = appState.currentProblemsData[idx];
        if (!data) return;
        
        // 重新渲染反应物
        const reactantContainer = problemEl.querySelector(".structure-container:not(.answer-structure)");
        if (reactantContainer) {
            reactantContainer.innerHTML = "";
            reactantContainer.style.display = "flex";
            reactantContainer.style.alignItems = "center";
            reactantContainer.style.justifyContent = "center";
            reactantContainer.style.gap = "10px";
            
            // 优先使用 reactants 数组（支持任意数量的反应物）
            const reactantsToRender = data.reactants || [data.r1, data.r2].filter(Boolean);
            
            reactantsToRender.forEach((reactant, idx) => {
                if (!reactant) return;
                
                // 在反应物之间添加加号
                if (idx > 0) {
                    const plus = document.createElement("div");
                    plus.className = "plus-sign";
                    plus.textContent = "+";
                    reactantContainer.appendChild(plus);
                }
                
                const wrapper = document.createElement("div");
                wrapper.className = "structure reactant";
                wrapper.style.flex = "1";
                wrapper.appendChild(createStructureSVG(reactant));
                reactantContainer.appendChild(wrapper);
            });
        }
        
        // 重新渲染产物（如果答案正在显示）
        const answerContainer = problemEl.querySelector(".structure-container.answer-structure");
        if (answerContainer && problemEl.classList.contains("show")) {
            answerContainer.innerHTML = "";
            
            const products = Array.isArray(data.products) ? data.products : [data.products];
            const validProducts = products.filter(smi => 
                smi && typeof smi === 'string' && smi !== 'FAILED' && smi !== '?'
            );
            
            validProducts.forEach((smi, i) => {
                if (i > 0) {
                    const plus = document.createElement("div");
                    plus.className = "plus-sign";
                    plus.textContent = "+";
                    answerContainer.appendChild(plus);
                }
                
                const structDiv = document.createElement("div");
                structDiv.className = "structure product";
                structDiv.appendChild(createStructureSVG(smi));
                answerContainer.appendChild(structDiv);
            });
        }
    });
    
    console.log("🔄 已刷新现有结构式");
}

/**
 * 生成化学反应题目
 */
export async function generateProblems() {
  if (!appState.rdkitModule) {
    showStatus("RDKit 未就绪", "loading");
    return;
  }

  const availableTypes = [];
  const checkboxes = document.querySelectorAll("#reactionTypes input[type='checkbox']");
  checkboxes.forEach(chk => {
      if (chk.checked) availableTypes.push(chk.value);
  });

  if (availableTypes.length === 0) {
    showStatus("请选择至少一种反应类型！", "error");
    return;
  }

  // 从 PubChem 准备分子池
  await prepareMoleculePools(availableTypes);

  showStatus("生成题目中...", "loading");
  problemsEl.innerHTML = "";
  appState.currentProblemsData = [];

  const grid = document.createElement("div");
  grid.className = "grid";
  const template = document.getElementById("problem-template");

  let attempts = 0;
  const maxAttempts = PROBLEM_COUNT * 4; // 最多尝试数量，防止死循环
  let successfulCount = 0;

  while (successfulCount < PROBLEM_COUNT && attempts < maxAttempts) {
    attempts++;
    
    // 1. 随机选择反应类型
    const typeKey = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const def = REACTION_DB[typeKey];

    // 2. 随机选择反应物
    const reactants = [];
    if (def.reactant_info && def.reactant_info.length > 0) {
        for (const info of def.reactant_info) {
            if (!info || !info.smarts) continue;
            if (info.skip) {
                if (info.smiles) reactants.push(info.smiles);
                else if (isSimpleMolecule(info.smarts)) reactants.push(info.smarts);
                continue;
            }
            if (info.isReagent && info.smiles) {
                reactants.push(info.smiles);
                continue;
            }
            const cacheKey = info.smarts + (def.smarts ? `|${def.smarts}` : "");
            const pool = appState.moleculeCache[cacheKey];
            const mol = selectValidMolecule(pool);
            if (mol) reactants.push(mol);
            else if (info.smiles) reactants.push(info.smiles);
            else if (isSimpleMolecule(info.smarts)) reactants.push(info.smarts);
        }
    } else if (def.search_smarts && def.search_smarts.length > 0) {
        for (const s of def.search_smarts) {
            if (s) {
                const cacheKey = s + (def.smarts ? `|${def.smarts}` : "");
                const pool = appState.moleculeCache[cacheKey];
                const mol = selectValidMolecule(pool);
                if (mol) reactants.push(mol);
                else if (isSimpleMolecule(s)) reactants.push(s);
            }
        }
    }
    
    if (def.source) {
        for (let idx = 0; idx < def.source.length; idx++) {
            if (reactants[idx]) continue;
            const poolName = def.source[idx];
            if (!poolName) continue;
            let pool = CHEMICAL_CABINET[poolName];
            if (poolName === "alcohols" && typeKey === "williamson_ether") {
                if (CHEMICAL_CABINET["phenols"]) pool = pool.concat(CHEMICAL_CABINET["phenols"]);
            }
            const mol = selectValidMolecule(pool);
            if (mol) {
                if (idx < reactants.length) reactants[idx] = mol;
                else reactants.push(mol);
            }
        }
    }

    const r1 = reactants[0] || null;
    const r2 = reactants[1] || null;

    if (!r1) continue;

    // 3. 生成产物
    const productSmilesArray = await runReactionWithRDKit(typeKey, r1, r2);
    
    // 验证产物有效性
    const validProducts = (productSmilesArray || []).filter(smi => {
        if (!smi || typeof smi !== 'string') return false;
        if (smi === 'FAILED' || smi === '?' || smi.trim() === '') return false;
        return true;
    });

    if (validProducts.length === 0) {
        console.warn(`⚠️ 反应 [${def.name}] 生成失败，正在尝试其他反应物... (尝试次数: ${attempts}/${maxAttempts})`);
        continue; // 失败了，跳过，不增加 successfulCount
    }

    // 成功生成！
    successfulCount++;
    appState.currentProblemsData.push({
      r1, r2, reactants, products: productSmilesArray
    });

    // 4. 渲染 UI
    const clone = template.content.cloneNode(true);
    const problemEl = clone.querySelector(".problem");

    clone.querySelector(".index").textContent = successfulCount;
    clone.querySelector(".problem-type").textContent = `${def.name}`;
    clone.querySelector(".arrow-text").innerHTML = def.condition;

    const eqContainer = clone.querySelector(".reaction-equation");
    const oldReactantBox = clone.querySelector(".structure-container");

    const newReactantsBox = document.createElement("div");
    newReactantsBox.className = "structure-container";
    newReactantsBox.style.display = "flex";
    newReactantsBox.style.alignItems = "center";
    newReactantsBox.style.justifyContent = "center";
    newReactantsBox.style.gap = "10px";

    reactants.forEach((reactant, idx) => {
        if (!reactant) return;
        if (idx > 0) {
            const plus = document.createElement("div");
            plus.className = "plus-sign";
            plus.textContent = "+";
            newReactantsBox.appendChild(plus);
        }
        const wrapper = document.createElement("div");
        wrapper.className = "structure reactant";
        wrapper.style.flex = "1";
        wrapper.appendChild(createStructureSVG(reactant));
        newReactantsBox.appendChild(wrapper);
    });

    if (oldReactantBox && eqContainer) {
        eqContainer.replaceChild(newReactantsBox, oldReactantBox);
    }

    const answerContainer = clone.querySelector(".structure-container.answer-structure");
    if (answerContainer) {
        answerContainer.innerHTML = "";
        validProducts.forEach((smi, idx) => {
            if (idx > 0) {
                const plus = document.createElement("div");
                plus.className = "plus-sign";
                plus.textContent = "+";
                answerContainer.appendChild(plus);
            }
            const structDiv = document.createElement("div");
            structDiv.className = "structure product";
            structDiv.appendChild(createStructureSVG(smi));
            answerContainer.appendChild(structDiv);
        });
    }

    grid.appendChild(problemEl);
  }

  if (successfulCount === 0) {
      showStatus("无法生成有效题目，请尝试选择更多反应类型", "error");
      return;
  }

  problemsEl.appendChild(grid);
  showStatus("题目生成完毕！", "success");
}

/**
 * 切换答案显示/隐藏
 */
export function toggleAnswers() {
  appState.showAns = !appState.showAns;
  const btn = $("#toggle");
  if(btn) btn.textContent = appState.showAns ? "🙈 隐藏答案" : "👁️ 显示答案";

  const problems = document.querySelectorAll(".problem");
  problems.forEach((p, idx) => {
    p.classList.toggle("show", appState.showAns);

    if (appState.showAns) {
      const answerContainer = p.querySelector(".structure-container.answer-structure");
      // 如果容器是空的（或者只包含占位符），则进行渲染
      if (answerContainer && answerContainer.children.length === 0) {
        const data = appState.currentProblemsData[idx];
        if (data && data.products) {
            const products = Array.isArray(data.products) ? data.products : [data.products];
            products.forEach((smi, i) => {
                if (i > 0) {
                    const plus = document.createElement("div");
                    plus.className = "plus-sign";
                    plus.textContent = "+";
                    answerContainer.appendChild(plus);
                }
                
                const structDiv = document.createElement("div");
                structDiv.className = "structure product";
                structDiv.appendChild(createStructureSVG(smi));
                answerContainer.appendChild(structDiv);
            });
        }
      }
    }
  });
}

/**
 * 渲染反应类型复选框（折叠式分类 + 子分类）
 */
export function renderReactionCheckboxes() {
    const container = document.getElementById("reactionTypes");
    if (!container) return;
    container.innerHTML = "";

    // 按类别分组，然后按子分类再分组
    const groups = {};
    for (let key in REACTION_DB) {
        const r = REACTION_DB[key];
        const cat = r.category || "other";
        const subcat = r.subcategory || "general";
        
        if (!groups[cat]) groups[cat] = {};
        if (!groups[cat][subcat]) groups[cat][subcat] = [];
        groups[cat][subcat].push({ key, ...r });
    }

    const catNames = {
        "alkene": "烯烃反应",
        "alkyne": "炔烃反应",
        "alcohol": "醇类反应",
        "benzene": "芳香族反应",
        "carbonyl": "醛酮反应",
        "ether": "醚类反应",
        "halide": "卤代烃反应",
        "thiol": "硫醇反应",
        "cycloalkane": "环烷烃反应",
        "acid": "羧酸反应",
        "other": "其他反应"
    };

    // 子分类名称映射
    const subcatNames = {
        // 烯烃
        "addition_halogen": "🧪 卤素加成",
        "addition_hx": "🧪 HX加成 (马氏)",
        "addition_hx_anti": "🧪 HX加成 (反马氏)",
        "addition_water": "💧 水合反应",
        "addition_hypohalous": "🧪 次卤酸加成",
        "addition_conjugate": "🔗 共轭加成",
        "oxidation_epox": "⭕ 环氧化",
        "oxidation_diol": "⭕ 邻二醇化",
        "oxidation_cleavage": "✂️ 氧化断裂",
        "hydrogenation": "🔘 催化氢化",
        "substitution_alpha": "🔀 α-氢取代",
        "hydroboration": "🔷 硼氢化",
        "polymerization": "🔗 聚合反应",
        "metathesis": "🔄 复分解",
        "cycloaddition": "⭕ 环加成",
        
        // 炔烃
        "hydrogenation_full": "🔘 完全氢化",
        "hydrogenation_lindlar": "🔘 部分氢化 (Lindlar)",
        "hydration_markov": "💧 水合 (马氏→酮)",
        "hydration_antimarkov": "💧 水合 (反马氏→醛)",
        "addition_nucleophilic": "🎯 亲核加成",
        "oxidation": "⚡ 氧化反应",
        
        // 苯环
        "substitution_halogen": "🧪 卤代反应",
        "substitution_nitration": "💥 硝化反应",
        "substitution_sulfonation": "💫 磺化反应",
        "substitution_fc_alkyl": "🔧 傅-克烷基化",
        "substitution_fc_acyl": "🔧 傅-克酰基化",
        "reduction": "⬇️ 还原反应",
        "sidechain_halogen": "🔗 侧链卤化",
        "sidechain_oxidation": "🔗 侧链氧化",
        "phenol_halogenation": "🧪 酚卤代",
        "phenol_nitration": "💥 酚硝化",
        "phenol_sulfonation": "💫 酚磺化",
        "oxidation_quinone": "⭕ 醌化",
        "phenol_acidity": "🧂 酚酸性",
        
        // 羰基
        "reduction_alcohol": "⬇️ 还原→醇",
        "reduction_ch2": "⬇️ 还原→CH₂",
        "addition_hcn": "🎯 HCN加成",
        "addition_grignard": "🎯 格氏加成",
        "addition_organolithium": "🎯 有机锂加成",
        "addition_amine": "🎯 胺加成",
        "aldol": "🔗 羟醛缩合",
        "acetal": "🔗 缩醛化",
        "hydrate": "💧 水合物",
        "bisulfite": "🧂 亚硫酸氢钠",
        "enolization": "🔄 烯醇化",
        "haloform": "🧪 卤仿反应",
        "rearrangement": "🔀 重排反应",
        "addition_alkynide": "🎯 炔化物加成",
        "conjugate_addition": "🔗 共轭加成",
        
        // 卤代烃
        "sn_alcohol": "🎯 SN→醇",
        "sn_ether": "🎯 SN→醚",
        "sn_nitrile": "🎯 SN→腈",
        "sn_amine": "🎯 SN→胺",
        "elimination": "✂️ 消除反应",
        "grignard_formation": "🔧 格氏试剂生成",
        "coupling": "🔗 偶联反应",
        
        // 醇
        "oxidation_aldehyde": "⚡ 氧化→醛",
        "oxidation_ketone": "⚡ 氧化→酮",
        "oxidation_acid": "⚡ 氧化→酸",
        "dehydration_ether": "💨 脱水→醚",
        "esterification": "🔗 酯化反应",
        "williamson": "🔧 威廉姆逊合成",
        "metal_reaction": "🔩 金属反应",
        "halogenation": "🧪 卤代反应",
        "tosylation": "🔧 磺酸酯化",
        
        // 醚
        "acid_cleavage": "✂️ 酸断裂",
        "ring_opening": "⭕ 开环反应",
        
        // 羧酸
        "acyl_chloride": "🧪 酰氯生成",
        "amide_formation": "🔗 酰胺生成",
        "decarboxylation": "💨 脱羧反应",
        "alpha_halogenation": "🧪 α-卤代",
        
        // 杂环
        "nitration": "💥 硝化",
        "sulfonation": "💫 磺化",
        "acylation": "🔧 酰基化",
        "alkylation": "🔧 烷基化",
        "metallation": "🔩 金属化",
        
        // 环烷烃
        "addition": "🔗 加成反应",
        "substitution": "🔀 取代反应",
        
        // 硫醇
        "metal_binding": "🔩 金属结合",
        "disulfide_formation": "🔗 二硫化物",
        
        // 通用
        "general": "📋 通用反应"
    };

    const difficultyColors = {
        1: "#22c55e",  // 绿色 - 简单
        2: "#f59e0b",  // 橙色 - 中等
        3: "#ef4444"   // 红色 - 高级
    };
    
    const difficultyNames = {
        1: "★",
        2: "★★",
        3: "★★★"
    };

    // 全局反应编号计数器
    let reactionNumber = 1;

    // 添加全局控制按钮
    const globalControls = document.createElement("div");
    globalControls.className = "reaction-global-controls";
    globalControls.innerHTML = `
        <button type="button" class="btn-small" id="expandAllCategories">📂 展开全部</button>
        <button type="button" class="btn-small" id="collapseAllCategories">📁 收起全部</button>
        <button type="button" class="btn-small" id="selectAllReactions">☑️ 全选</button>
        <button type="button" class="btn-small" id="deselectAllReactions">☐ 取消全选</button>
    `;
    container.appendChild(globalControls);

    // 绑定全局按钮事件
    setTimeout(() => {
        document.getElementById("expandAllCategories")?.addEventListener("click", () => {
            document.querySelectorAll(".category-content").forEach(c => c.style.display = "block");
            document.querySelectorAll(".subcategory-content").forEach(c => c.style.display = "block");
            document.querySelectorAll(".category-header .toggle-icon").forEach(i => i.textContent = "▼");
            document.querySelectorAll(".subcategory-header .toggle-icon").forEach(i => i.textContent = "▼");
        });
        document.getElementById("collapseAllCategories")?.addEventListener("click", () => {
            document.querySelectorAll(".category-content").forEach(c => c.style.display = "none");
            document.querySelectorAll(".subcategory-content").forEach(c => c.style.display = "none");
            document.querySelectorAll(".category-header .toggle-icon").forEach(i => i.textContent = "▶");
            document.querySelectorAll(".subcategory-header .toggle-icon").forEach(i => i.textContent = "▶");
        });
        document.getElementById("selectAllReactions")?.addEventListener("click", () => {
            document.querySelectorAll("#reactionTypes input[type='checkbox']").forEach(c => c.checked = true);
        });
        document.getElementById("deselectAllReactions")?.addEventListener("click", () => {
            document.querySelectorAll("#reactionTypes input[type='checkbox']").forEach(c => c.checked = false);
        });
    }, 0);

    for (let cat in groups) {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "reaction-category";
        
        // 计算该分类下的总反应数
        let totalReactions = 0;
        for (let subcat in groups[cat]) {
            totalReactions += groups[cat][subcat].length;
        }
        
        // 创建可折叠的分类标题
        const header = document.createElement("div");
        header.className = "category-header";
        header.innerHTML = `
            <span class="toggle-icon">▶</span>
            <strong>${catNames[cat] || cat}</strong>
            <span class="category-count">(${totalReactions}个反应)</span>
            <button type="button" class="btn-tiny cat-select-all" data-cat="${cat}">全选</button>
            <button type="button" class="btn-tiny cat-deselect-all" data-cat="${cat}">取消</button>
        `;
        
        // 创建分类内容区域（默认折叠）
        const content = document.createElement("div");
        content.className = "category-content";
        content.style.display = "none";
        
        // 遍历子分类
        for (let subcat in groups[cat]) {
            const subcatReactions = groups[cat][subcat];
            
            // 创建子分类容器
            const subcatDiv = document.createElement("div");
            subcatDiv.className = "reaction-subcategory";
            
            // 子分类标题
            const subcatHeader = document.createElement("div");
            subcatHeader.className = "subcategory-header";
            subcatHeader.innerHTML = `
                <span class="toggle-icon">▶</span>
                <span class="subcategory-name">${subcatNames[subcat] || subcat}</span>
                <span class="subcategory-count">(${subcatReactions.length})</span>
                <button type="button" class="btn-tiny subcat-select-all">选</button>
                <button type="button" class="btn-tiny subcat-deselect-all">消</button>
            `;
            
            // 子分类内容
            const subcatContent = document.createElement("div");
            subcatContent.className = "subcategory-content";
            subcatContent.style.display = "none";
            
            subcatReactions.forEach(r => {
                const label = document.createElement("label");
                label.className = "reaction-item";
                label.dataset.difficulty = r.difficulty || 1;
                label.dataset.category = cat;
                label.dataset.subcategory = subcat;
                
                const diffLevel = r.difficulty || 1;
                const diffColor = difficultyColors[diffLevel];
                const diffStar = difficultyNames[diffLevel];
                
                const numberBadge = `<span class="reaction-number">${reactionNumber}</span>`;
                
                label.innerHTML = `<input type="checkbox" value="${r.key}" data-difficulty="${diffLevel}" data-category="${cat}" data-subcategory="${subcat}" checked /> ${numberBadge}${r.name} <span style="color:${diffColor};font-size:10px;">${diffStar}</span>`;
                subcatContent.appendChild(label);
                
                reactionNumber++;
            });
            
            subcatDiv.appendChild(subcatHeader);
            subcatDiv.appendChild(subcatContent);
            content.appendChild(subcatDiv);
            
            // 绑定子分类折叠/展开事件
            subcatHeader.addEventListener("click", (e) => {
                if (e.target.classList.contains("btn-tiny")) return;
                
                const isExpanded = subcatContent.style.display !== "none";
                subcatContent.style.display = isExpanded ? "none" : "block";
                subcatHeader.querySelector(".toggle-icon").textContent = isExpanded ? "▶" : "▼";
            });
            
            // 子分类全选/取消按钮
            subcatHeader.querySelector(".subcat-select-all")?.addEventListener("click", (e) => {
                e.stopPropagation();
                subcatContent.querySelectorAll("input[type='checkbox']").forEach(c => c.checked = true);
            });
            subcatHeader.querySelector(".subcat-deselect-all")?.addEventListener("click", (e) => {
                e.stopPropagation();
                subcatContent.querySelectorAll("input[type='checkbox']").forEach(c => c.checked = false);
            });
        }
        
        categoryDiv.appendChild(header);
        categoryDiv.appendChild(content);
        container.appendChild(categoryDiv);
        
        // 绑定分类折叠/展开事件
        header.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-tiny")) return;
            
            const isExpanded = content.style.display !== "none";
            content.style.display = isExpanded ? "none" : "block";
            header.querySelector(".toggle-icon").textContent = isExpanded ? "▶" : "▼";
            
            // 性能优化：展开时自动预取该分类下的分子数据
            if (!isExpanded) {
                const catKeys = [];
                for (let subcat in groups[cat]) {
                    groups[cat][subcat].forEach(r => catKeys.push(r.key));
                }
                if (catKeys.length > 0) {
                    console.log(`📡 自动预取分类 [${cat}] 的分子数据...`);
                    prepareMoleculePools(catKeys);
                }
            }
        });
        
        // 绑定分类全选/取消按钮
        header.querySelector(".cat-select-all")?.addEventListener("click", (e) => {
            e.stopPropagation();
            content.querySelectorAll("input[type='checkbox']").forEach(c => c.checked = true);
        });
        header.querySelector(".cat-deselect-all")?.addEventListener("click", (e) => {
            e.stopPropagation();
            content.querySelectorAll("input[type='checkbox']").forEach(c => c.checked = false);
        });
    }
}


/**
 * 根据难度设置更新复选框状态
 */
export function updateCheckboxesByDifficulty() {
    const difficultySelect = document.getElementById("difficulty");
    if (!difficultySelect) return;
    
    const selectedDifficulty = difficultySelect.value;
    const checkboxes = document.querySelectorAll("#reactionTypes input[type='checkbox']");
    
    checkboxes.forEach(chk => {
        const reactionDifficulty = parseInt(chk.dataset.difficulty) || 1;
        
        switch (selectedDifficulty) {
            case "easy":
                chk.checked = reactionDifficulty === 1;  // 只选难度1
                break;
            case "medium":
                chk.checked = reactionDifficulty === 2;  // 只选难度2
                break;
            case "hard":
                chk.checked = reactionDifficulty === 3;  // 只选难度3
                break;
            case "custom":
                // 自定义模式不改变复选框状态
                break;
        }
    });
    
    console.log(`📊 难度设置: ${selectedDifficulty}`);
}

/**
 * 初始化难度选择器事件
 */
export function initDifficultySelector() {
    const difficultySelect = document.getElementById("difficulty");
    if (difficultySelect) {
        difficultySelect.addEventListener("change", () => {
            updateCheckboxesByDifficulty();
        });
        
        // 初始化时应用默认难度
        updateCheckboxesByDifficulty();
    }
}
