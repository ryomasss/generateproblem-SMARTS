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
            
            // 反应物1
            if (data.r1) {
                const w1 = document.createElement("div");
                w1.className = "structure reactant";
                w1.style.flex = "1";
                w1.appendChild(createStructureSVG(data.r1));
                reactantContainer.appendChild(w1);
            }
            
            // 反应物2（如果存在）
            if (data.r2) {
                const plus = document.createElement("div");
                plus.className = "plus-sign";
                plus.textContent = "+";
                reactantContainer.appendChild(plus);
                
                const w2 = document.createElement("div");
                w2.className = "structure reactant";
                w2.style.flex = "1";
                w2.appendChild(createStructureSVG(data.r2));
                reactantContainer.appendChild(w2);
            }
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

  for (let i = 0; i < PROBLEM_COUNT; i++) {
    // 1. 随机选择反应类型
    const typeKey = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const def = REACTION_DB[typeKey];

    // 2. 随机选择反应物 - 使用 reactant_info 获取所有反应物
    let r1 = null;
    let r2 = null;

    // 优先使用 reactant_info（如果可用）
    if (def.reactant_info && def.reactant_info.length > 0) {
        // 获取第一个反应物类型
        const info1 = def.reactant_info[0];
        if (info1 && info1.smarts) {
            const cacheKey = info1.smarts + (def.smarts ? `|${def.smarts}` : "");
            const pool = appState.moleculeCache[cacheKey];
            r1 = selectValidMolecule(pool);
        }
        
        // 获取第二个反应物类型（如果存在）
        if (def.reactant_info.length > 1) {
            const info2 = def.reactant_info[1];
            if (info2 && info2.smarts) {
                const cacheKey = info2.smarts + (def.smarts ? `|${def.smarts}` : "");
                const pool = appState.moleculeCache[cacheKey];
                r2 = selectValidMolecule(pool);
            }
        }
    } else if (def.search_smarts && def.search_smarts[0]) {
        // 回退到旧的 search_smarts 逻辑
        const s = def.search_smarts[0];
        const cacheKey = s + (def.smarts ? `|${def.smarts}` : "");
        const pool = appState.moleculeCache[cacheKey];
        r1 = selectValidMolecule(pool);
        
        // 获取 R2
        if (def.search_smarts[1]) {
            const s2 = def.search_smarts[1];
            const cacheKey2 = s2 + (def.smarts ? `|${def.smarts}` : "");
            const pool2 = appState.moleculeCache[cacheKey2];
            r2 = selectValidMolecule(pool2);
        }
    }
    
    // R1 的回退方案 - 使用本地分子库
    if (!r1 && def.source && def.source[0]) {
        const poolName1 = def.source[0];
        const pool1 = CHEMICAL_CABINET[poolName1];
        r1 = selectValidMolecule(pool1);
    }

    // R2 的回退方案（如果需要）
    if (!r2 && def.source && def.source[1]) {
        const poolName2 = def.source[1];
        let pool2 = CHEMICAL_CABINET[poolName2];
        
        // 威廉姆逊醚合成的特殊逻辑
        if (poolName2 === "alcohols" && typeKey === "williamson_ether") {
            if (CHEMICAL_CABINET["phenols"]) {
                 pool2 = pool2.concat(CHEMICAL_CABINET["phenols"]);
            }
        }
        
        r2 = selectValidMolecule(pool2);
    }

    // 安全检查
    if (!r1) {
        console.warn(`No reactant 1 found for ${typeKey}`);
        continue;
    }

    // 3. 生成产物 (返回数组)
    const productSmilesArray = await runReactionWithRDKit(typeKey, r1, r2);

    appState.currentProblemsData.push({
      r1, r2, products: productSmilesArray
    });

    // 4. 渲染 UI
    const clone = template.content.cloneNode(true);
    const problemEl = clone.querySelector(".problem");

    clone.querySelector(".index").textContent = i + 1;
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

    // 创建并添加反应物 1
    const w1 = document.createElement("div");
    w1.className = "structure reactant";
    w1.style.flex = "1";
    w1.appendChild(createStructureSVG(r1));
    newReactantsBox.appendChild(w1);

    // 判断是否存在反应物 2
    if (r2) {
        const plus = document.createElement("div");
        plus.className = "plus-sign";
        plus.textContent = "+";
        newReactantsBox.appendChild(plus);

        const w2 = document.createElement("div");
        w2.className = "structure reactant";
        w2.style.flex = "1";
        w2.appendChild(createStructureSVG(r2));
        newReactantsBox.appendChild(w2);
    }

    if (oldReactantBox && eqContainer) {
        eqContainer.replaceChild(newReactantsBox, oldReactantBox);
    }

      const answerContainer = clone.querySelector(".structure-container.answer-structure");
      if (answerContainer) {
          answerContainer.innerHTML = ""; // 清空默认的占位符

          if (Array.isArray(productSmilesArray)) {
              // 过滤掉无效的产物 SMILES
              const validProducts = productSmilesArray.filter(smi => {
                  if (!smi || typeof smi !== 'string') return false;
                  if (smi === 'FAILED' || smi === '?' || smi.trim() === '') return false;
                  
                  // 尝试用 RDKit 验证 SMILES
                  if (appState.rdkitModule) {
                      try {
                          const mol = appState.rdkitModule.get_mol(smi);
                          if (mol && mol.is_valid()) {
                              mol.delete();
                              return true;
                          }
                          if (mol) mol.delete();
                          console.warn(`🔴 产物 SMILES 无效 (RDKit 无法解析): ${smi}`);
                          return false;
                      } catch (e) {
                          console.warn(`🔴 产物 SMILES 验证失败: ${smi}`, e.message);
                          return false;
                      }
                  }
                  return true;
              });
              
              if (validProducts.length === 0) {
                  console.warn("⚠️ 没有有效的产物可渲染");
                  const errorDiv = document.createElement("div");
                  errorDiv.innerHTML = `<span style="color:#ef4444;font-size:12px;">⚠️ 产物生成失败</span>`;
                  answerContainer.appendChild(errorDiv);
              } else {
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
          }
      }

    grid.appendChild(problemEl);
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
 * 渲染反应类型复选框（折叠式分类）
 */
export function renderReactionCheckboxes() {
    const container = document.getElementById("reactionTypes");
    if (!container) return;
    container.innerHTML = "";

    // 按类别分组
    const groups = {};
    for (let key in REACTION_DB) {
        const r = REACTION_DB[key];
        const cat = r.category || "other";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push({ key, ...r });
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
            document.querySelectorAll(".category-header .toggle-icon").forEach(i => i.textContent = "▼");
        });
        document.getElementById("collapseAllCategories")?.addEventListener("click", () => {
            document.querySelectorAll(".category-content").forEach(c => c.style.display = "none");
            document.querySelectorAll(".category-header .toggle-icon").forEach(i => i.textContent = "▶");
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
        
        const reactionCount = groups[cat].length;
        
        // 创建可折叠的标题
        const header = document.createElement("div");
        header.className = "category-header";
        header.innerHTML = `
            <span class="toggle-icon">▶</span>
            <strong>${catNames[cat] || cat}</strong>
            <span class="category-count">(${reactionCount}个反应)</span>
            <button type="button" class="btn-tiny cat-select-all" data-cat="${cat}">全选</button>
            <button type="button" class="btn-tiny cat-deselect-all" data-cat="${cat}">取消</button>
        `;
        
        // 创建内容区域（默认折叠）
        const content = document.createElement("div");
        content.className = "category-content";
        content.style.display = "none";
        
        groups[cat].forEach(r => {
            const label = document.createElement("label");
            label.className = "reaction-item";
            label.dataset.difficulty = r.difficulty || 1;
            label.dataset.category = cat;
            
            const diffLevel = r.difficulty || 1;
            const diffColor = difficultyColors[diffLevel];
            const diffStar = difficultyNames[diffLevel];
            
            // 添加反应编号
            const numberBadge = `<span class="reaction-number">${reactionNumber}</span>`;
            
            label.innerHTML = `<input type="checkbox" value="${r.key}" data-difficulty="${diffLevel}" data-category="${cat}" checked /> ${numberBadge}${r.name} <span style="color:${diffColor};font-size:10px;">${diffStar}</span>`;
            content.appendChild(label);
            
            reactionNumber++;
        });
        
        categoryDiv.appendChild(header);
        categoryDiv.appendChild(content);
        container.appendChild(categoryDiv);
        
        // 绑定折叠/展开事件
        header.addEventListener("click", (e) => {
            // 如果点击的是按钮，不触发折叠
            if (e.target.classList.contains("btn-tiny")) return;
            
            const isExpanded = content.style.display !== "none";
            content.style.display = isExpanded ? "none" : "block";
            header.querySelector(".toggle-icon").textContent = isExpanded ? "▶" : "▼";
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
