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

  if (!smiles || smiles === "FAILED" || smiles === "PREDEFINED_PRODUCT") {
    container.innerHTML = `
      <div class="empty-structure" style="display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ef4444;text-align:center;padding:10px;">
        <span style="font-size:24px;margin-bottom:5px;">⚠️</span>
        <span style="font-size:12px;">无法生成<br>(或出错)</span>
      </div>`;
    return container;
  }

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

    // 特殊处理：氢气分子和其他简单双原子分子
    // 这些分子默认可能显示为竖直，我们强制设置为水平显示
    if (smiles === '[H][H]' || smiles === 'H' || smiles.match(/^\[?H\]?\[?H\]?$/)) {
      // 对于氢气，直接显示为文本 "H₂"
      container.innerHTML = `<div class="structure-text" style="display:flex;align-items:center;justify-content:center;height:${baseSize}px;font-size:32px;color:${colorHex};">H₂</div>`;
      if (mol && typeof mol.delete === 'function') {
        mol.delete();
        mol = null;  // 防止 finally 块再次删除
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
