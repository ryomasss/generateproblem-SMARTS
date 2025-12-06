// --- 主入口模块 ---
// 应用初始化和事件绑定

import { appState } from './modules/state.js';
import { $, showStatus } from './modules/utils.js';
import { generateProblems, toggleAnswers, renderReactionCheckboxes } from './modules/ui-controller.js';
import { loadCacheFromStorage, preloadCommonMolecules, cacheStats } from './modules/pubchem-api.js';

/**
 * 初始化应用
 */
async function init() {
  showStatus("正在加载 RDKit 引擎...", "loading");
  
  // 先加载 localStorage 中的缓存
  loadCacheFromStorage();
  
  try {
    if (window.initRDKitModule) {
      // RDKit 模块已经在 HTML 中配置好 CDN 路径，这里直接初始化
      const rdkitModule = await window.initRDKitModule();
      appState.rdkitModule = rdkitModule;
      
      // 检测并记录 RDKit 版本和功能
      let versionInfo = "Unknown";
      try {
        if (typeof rdkitModule.version === 'function') {
          versionInfo = rdkitModule.version();
        }
      } catch (e) {}
      
      const hasReactionSupport = typeof rdkitModule.get_rxn === 'function';
      const hasMolListSupport = typeof rdkitModule.MolList === 'function';
      
      console.log(`🧪 RDKit 已加载:`);
      console.log(`   版本: ${versionInfo}`);
      console.log(`   反应支持 (get_rxn): ${hasReactionSupport ? '✅' : '❌'}`);
      console.log(`   MolList 支持: ${hasMolListSupport ? '✅' : '❌'}`);
      
      if (!hasReactionSupport || !hasMolListSupport) {
        console.warn('⚠️  当前 RDKit 版本功能不完整，将使用预定义产物作为备选');
      }
      
      // 显示缓存状态
      if (cacheStats.fromStorage > 0) {
        console.log(`📦 已从缓存加载 ${cacheStats.fromStorage} 条分子数据`);
      }
      
      renderReactionCheckboxes();
      showStatus("就绪", "success");

      // 绑定事件监听器
      $("#gen")?.addEventListener("click", generateProblems);
      $("#toggle")?.addEventListener("click", toggleAnswers);
      
      // 刷新分子库按钮
      $("#refreshMolecules")?.addEventListener("click", async () => {
        if (!confirm("确定要清除缓存并重新从 PubChem 获取分子吗？这可能需要一些时间。")) {
          return;
        }
        
        showStatus("正在清除缓存...", "loading");
        
        // 清除 localStorage 缓存
        localStorage.removeItem('pubchem_molecule_cache');
        appState.moleculeCache = {};
        
        console.log("🗑️ 已清除分子缓存");
        
        showStatus("正在从 PubChem 重新获取分子...", "loading");
        
        // 重新预加载分子
        await preloadCommonMolecules();
        
        showStatus("分子库刷新完成！", "success");
        console.log("✅ 分子库刷新完成");
        
        // 重新生成题目
        generateProblems();
      });
      
      const inputs = ["structureColor", "baseSize", "bondWidth", "fixedLength"];
      inputs.forEach(id => {
         document.getElementById(id)?.addEventListener("change", () => {
             if(appState.currentProblemsData.length > 0) generateProblems();
         });
      });
      
      // 如果缓存为空，则预加载常用分子
      if (cacheStats.fromStorage === 0) {
        // 使用 setTimeout 延迟预加载，避免阻塞首次渲染
        setTimeout(async () => {
          await preloadCommonMolecules();
          showStatus("预加载完成，可以生成题目", "success");
        }, 500);
      }
      
      generateProblems();
    } else {
      throw new Error("RDKit load failed");
    }
  } catch (e) {
    console.error(e);
    showStatus("引擎初始化失败", "error");
  }
}

window.onload = init;

