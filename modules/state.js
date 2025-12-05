// --- 状态管理模块 ---
// 管理应用的全局状态和数据引用

// 应用状态
export const appState = {
  showAns: false,
  currentProblemsData: [],
  rdkitModule: null,
  moleculeCache: {}, // Cache for PubChem results
};

// 显式挂载到 window 以便调试
window.appState = appState;

// 从 reactions.js 引入的化学试剂库
export const CHEMICAL_CABINET = window.CHEMICAL_CABINET_EXTENDED || {
  // Fallback if reactions.js not loaded
  acids: ["CC(=O)O"], 
  amines: ["CN"], 
  alcohols: ["CO"], 
  halides: ["CBr"],
  alkenes: ["C=C"], 
  alkynes: ["C#C"], 
  reagents_br2: ["BrBr"]
};

// 反应类型定义 (包含 SMARTS)
export const REACTION_DB = window.REACTION_DB_EXTENDED || {
  // Fallback
  amide_formation: { 
    name: "酰胺合成", 
    smarts: "[C:1](=[O:2])[O:3][H].[N:4]([H])>>[C:1](=[O:2])[N:4]", 
    source: ["acids", "amines"] 
  }
};
