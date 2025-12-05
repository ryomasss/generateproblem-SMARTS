// --- 工具函数模块 ---
// 提供通用的辅助函数

/**
 * DOM 选择器快捷方式
 * @param {string} q - CSS 选择器
 * @returns {Element} DOM 元素
 */
export const $ = (q) => document.querySelector(q);

/**
 * 将十六进制颜色转换为 RGB 数组
 * @param {string} hex - 十六进制颜色值 (如 "#ffffff")
 * @returns {number[]} RGBA 数组 [r, g, b, a]
 */
export function hexToRgbArray(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  return [r / 255, g / 255, b / 255, 1.0];
}

/**
 * 显示状态消息
 * @param {string} message - 要显示的消息
 * @param {string} type - 消息类型: "loading", "error", "success"
 */
export function showStatus(message, type) {
  const statusArea = document.getElementById("statusArea");
  if (!statusArea) return;
  
  if (type === "loading") {
    statusArea.innerHTML = `<div class="loading"><div class="spinner"></div><p>${message}</p></div>`;
  } else if (type === "error") {
    statusArea.innerHTML = `<div class="error">❌ ${message}</div>`;
  } else if (type === "success") {
    statusArea.innerHTML = `<div class="success">✅ ${message}</div>`;
    setTimeout(() => { statusArea.innerHTML = ""; }, 3000);
  }
}
