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

    // 2. 随机选择反应物
    let r1 = null;
    let r2 = null;

    // 尝试从 PubChem 缓存获取 R1
    if (def.search_smarts && def.search_smarts[0]) {
        const s = def.search_smarts[0];
        // Construct cache key matching pubchem-api.js logic
        const cacheKey = s + (def.smarts ? `|${def.smarts}` : "");
        const pool = appState.moleculeCache[cacheKey];
        if (pool && pool.length > 0) {
            r1 = pool[Math.floor(Math.random() * pool.length)];
        }
    }
    
    // R1 的回退方案
    if (!r1) {
        const poolName1 = def.source[0];
        const pool1 = CHEMICAL_CABINET[poolName1];
        if (pool1 && pool1.length > 0) {
            r1 = pool1[Math.floor(Math.random() * pool1.length)];
        }
    }

    // 尝试获取 R2（如果需要）
    if (def.source[1]) {
        // 尝试从 PubChem 获取 R2
        if (def.search_smarts && def.search_smarts[1]) {
            const s = def.search_smarts[1];
            // Construct cache key matching pubchem-api.js logic
            const cacheKey = s + (def.smarts ? `|${def.smarts}` : "");
            const pool = appState.moleculeCache[cacheKey];
            if (pool && pool.length > 0) {
                r2 = pool[Math.floor(Math.random() * pool.length)];
            }
        }
        
        // R2 的回退方案
        if (!r2) {
            const poolName2 = def.source[1];
            let pool2 = CHEMICAL_CABINET[poolName2];
            
            // 威廉姆逊醚合成的特殊逻辑
            if (poolName2 === "alcohols" && typeKey === "williamson_ether") {
                if (CHEMICAL_CABINET["phenols"]) {
                     pool2 = pool2.concat(CHEMICAL_CABINET["phenols"]);
                }
            }
            
            if (pool2 && pool2.length > 0) {
                r2 = pool2[Math.floor(Math.random() * pool2.length)];
            }
        }
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
              productSmilesArray.forEach((smi, idx) => {
                  if (idx > 0) {
                      const plus = document.createElement("div");
                      plus.className = "plus";
                      plus.textContent = "+";
                      plus.style.margin = "0 10px";
                      plus.style.color = "#ffffff";
                      plus.style.fontSize = "24px";
                      plus.style.fontWeight = "bold";
                      answerContainer.appendChild(plus);
                  }
                  
                  const structDiv = document.createElement("div");
                  structDiv.className = "structure product";
                  structDiv.appendChild(createStructureSVG(smi));
                  answerContainer.appendChild(structDiv);
              });
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
                    plus.className = "plus";
                    plus.textContent = "+";
                    plus.style.margin = "0 10px";
                    plus.style.color = "#ffffff";
                    plus.style.fontSize = "24px";
                    plus.style.fontWeight = "bold";
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
 * 渲染反应类型复选框
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
        "other": "其他反应"
    };

    for (let cat in groups) {
        const groupDiv = document.createElement("div");
        groupDiv.style.marginBottom = "10px";
        groupDiv.innerHTML = `<strong>${catNames[cat] || cat}</strong><br/>`;
        
        groups[cat].forEach(r => {
            const label = document.createElement("label");
            label.style.display = "inline-block";
            label.style.marginRight = "10px";
            label.innerHTML = `<input type="checkbox" value="${r.key}" checked /> ${r.name}`;
            groupDiv.appendChild(label);
        });
        container.appendChild(groupDiv);
    }
}
