// --- 渲染模块 ---
// 处理分子结构的SVG渲染

import { appState } from './state.js';
import { hexToRgbArray } from './utils.js';

/**
 * 创建分子结构的SVG容器
 * @param {string} smiles - SMILES字符串
 * @returns {HTMLElement} 包含SVG的容器元素
 */
export function createStructureSVG(smiles) {
  const container = document.createElement("div");
  container.className = "image-container";

  // 检测更多无效 SMILES 格式
  const invalidPatterns = ["FAILED", "PREDEFINED_PRODUCT", "?", "undefined", "null"];
  const isInvalid = !smiles || 
                    typeof smiles !== 'string' || 
                    smiles.trim() === "" ||
                    invalidPatterns.includes(smiles.trim());
  
  if (isInvalid) {
    console.warn("🔴 无效 SMILES 被过滤:", smiles);
    container.innerHTML = `
      <div class="empty-structure" style="display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ef4444;text-align:center;padding:10px;">
        <span style="font-size:24px;margin-bottom:5px;">⚠️</span>
        <span style="font-size:12px;">无法生成<br>(或出错)</span>
      </div>`;
    return container;
  }
  
  console.log("🎨 准备渲染 SMILES:", smiles);

  // 延迟渲染
  setTimeout(() => {
      try {
        renderStructureSync(smiles, container);
      } catch (e) {
        console.error("渲染 SVG 失败:", e, "SMILES:", smiles);
        container.innerHTML = `<div class="error" style="font-size:10px;">渲染错误:<br>${smiles}</div>`;
      }
  }, 0);

  return container;
}

/**
 * 同步渲染分子结构到容器
 * @param {string} smiles - SMILES字符串
 * @param {HTMLElement} container - 目标容器
 */
export function renderStructureSync(smiles, container) {
  // 0. 输入参数检查 (防止 BindingError)
  if (!smiles || typeof smiles !== 'string') {
    console.warn("Invalid SMILES for rendering:", smiles);
    container.innerHTML = `<div class="error" style="font-size:10px;">无效结构</div>`;
    return;
  }

  // 1. 基础环境检查
  if (!appState.rdkitModule) {
    container.innerHTML = `<div class="error" style="font-size:10px;">RDKit未就绪</div>`;
    return;
  }

  // 2. 准备参数 (安全获取数值)
  const getSafeNum = (id, def) => {
    const el = document.getElementById(id);
    let val = el ? parseFloat(el.value) : def;
    return (isNaN(val) || val <= 0) ? def : val;
  };

  // 直接使用用户输入的基准尺寸，确保结构式和双原子分子同步缩放
  // CSS变量仅用于容器布局，不影响渲染参数
  const baseSize = getSafeNum("baseSize", 300);
  
  const bondWidth = getSafeNum("bondWidth", 2.0);
  let fixedLength = -1;
  const fixedEl = document.getElementById("fixedLength");
  if (fixedEl) {
    let val = parseInt(fixedEl.value);
    if (!isNaN(val)) fixedLength = val;
  }

  const colorInput = document.getElementById("structureColor");
  const colorHex = colorInput ? colorInput.value : "#ffffff";

  let mol = null;
  try {
    // 3. 创建分子
    mol = appState.rdkitModule.get_mol(smiles);
    if (!mol || !mol.is_valid()) {
      if (mol) mol.delete();
      container.innerHTML = `<div class="error" style="font-size:10px;">无效结构</div>`;
      return;
    }

    // 特殊处理：双原子分子和常用试剂 (氢气、卤素、水、氢卤酸等)
    // 这些分子应以化学式形式显示 (如 H₂, Br₂, HCl)，而不是结构式
    const reagentFormulas = {
      // 氢气
      '[H][H]': 'H2', 'H': 'H2',
      // 氢同位素 (氘和氚)
      '[2H][2H]': 'D2', '[D][D]': 'D2',     // 氘气
      '[3H][3H]': 'T2',                      // 氚气
      '[2H][H]': 'HD', '[H][2H]': 'HD',      // 氢氘化物
      // 卤素
      'BrBr': 'Br2', '[Br][Br]': 'Br2',
      'ClCl': 'Cl2', '[Cl][Cl]': 'Cl2',
      'FF': 'F2', '[F][F]': 'F2',
      'II': 'I2', '[I][I]': 'I2',
      // 氧气和氮气
      'O=O': 'O2', '[O]=[O]': 'O2',
      'N#N': 'N2', '[N]#[N]': 'N2',
      // 氢卤酸
      'Br': 'HBr', '[H][Br]': 'HBr', '[Br][H]': 'HBr',
      'Cl': 'HCl', '[H][Cl]': 'HCl', '[Cl][H]': 'HCl',
      'I': 'HI', '[H][I]': 'HI', '[I][H]': 'HI', 'HI': 'HI',
      'F': 'HF', '[H][F]': 'HF', '[F][H]': 'HF',
      // 水和次卤酸
      'O': 'H2O', '[OH2]': 'H2O',
      'OI': 'HOI', '[OH][I]': 'HOI',
      'OCl': 'HOCl', '[OH][Cl]': 'HOCl',
      'OBr': 'HOBr', '[OH][Br]': 'HOBr',
      // 过氧化氢
      'OO': 'H2O2', '[O][O]': 'H2O2',
      // 氨
      'N': 'NH3', '[NH3]': 'NH3',
      // 硫化物和氧化物
      'O=S=O': 'SO2',                        // 二氧化硫
      'O=C=O': 'CO2',                        // 二氧化碳
      '[C-]#[O+]': 'CO', '[C]=O': 'CO',      // 一氧化碳
      'SS': 'S2', '[S][S]': 'S2',            // 二硫
      // 氰化氢
      'C#N': 'HCN', '[H]C#N': 'HCN'
    };


    const formula = reagentFormulas[smiles];
    if (formula) {
      const atomFontSize = Math.round(baseSize / 14);
      const subFontSize = Math.round(atomFontSize * 0.6);
      
      // 处理化学式中的数字，将其转换为下标
      const formattedFormula = formula.replace(/(\d+)/g, `<sub style="font-size:${subFontSize}px;vertical-align:sub;line-height:1;">$1</sub>`);
      
      container.innerHTML = `<div class="structure-text diatomic-formula" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:${atomFontSize}px;color:${colorHex};font-family:Arial,sans-serif;font-weight:normal;"><span style="display:inline-flex;align-items:baseline;">${formattedFormula}</span></div>`;
      
      if (mol && typeof mol.delete === 'function') {
        mol.delete();
        mol = null;
      }
      return;
    }

    // 4. 定义绘图参数
    const drawOpts = {
      width: baseSize,
      height: baseSize,
      bondLineWidth: bondWidth,
      fixedBondLength: fixedLength,
      minFontSize: 14,
      symbolColour: hexToRgbArray(colorHex),
      backgroundColour: [0.0, 0.0, 0.0, 0.0],
      colorAtoms: false,
      addStereoAnnotation: true
    };
    const jsonOpts = JSON.stringify(drawOpts);

    // 5. 定义生成 SVG 的内部辅助函数
    const tryGenerateSVG = () => {
      if (mol.get_svg_with_highlights) {
        return mol.get_svg_with_highlights(jsonOpts);
      }
      return mol.get_svg(baseSize, baseSize);
    };

    // 核心修复：三级尝试机制
    let svgString = "";
    let success = false;

    // [尝试 1] 标准模式：使用 CoordGen (更美观)
    try {
        if (mol.set_new_coords) mol.set_new_coords(true);
        svgString = tryGenerateSVG();
        if (svgString && !svgString.includes("nan")) success = true;
    } catch (e) { console.warn("渲染尝试1失败:", e); }

    // [尝试 2] 备用模式：使用 RDKit 经典坐标算法
    if (!success) {
        try {
            if (mol.set_new_coords) mol.set_new_coords(false);
            else if (mol.generate_2d_coords) mol.generate_2d_coords();

            svgString = tryGenerateSVG();
            if (svgString && !svgString.includes("nan")) success = true;
        } catch (e) { console.warn("渲染尝试2失败:", e); }
    }

    // [尝试 3] 保底模式：不带任何参数
    if (!success) {
        try {
            if (mol.generate_2d_coords) mol.generate_2d_coords();
            svgString = mol.get_svg(300, 300);
            if (svgString && !svgString.includes("nan")) success = true;
        } catch (e) { console.warn("渲染尝试3失败:", e); }
    }

    // 渲染结果处理
    if (success) {
        container.innerHTML = `<div class="structure-svg-container" style="width:${baseSize}px;height:${baseSize}px;">${svgString}</div>`;
    } else {
        console.error("渲染最终失败，SVG包含NaN:", smiles);
        container.innerHTML = `<div class="error" style="font-size:14px; color: #94a3b8; display:flex; align-items:center; justify-content:center;">
            ${smiles}
        </div>`;
    }

  } catch (e) {
    console.error("渲染异常:", e);
    container.innerHTML = `<div class="error">渲染错误</div>`;
  } finally {
    if (mol && typeof mol.delete === "function") {
      mol.delete();
    }
  }
}
