# 有机化学反应出题器 - RDKit + AI 验证版

基于 RDKit.js 和 ChemBERTa AI 验证的有机化学反应出题系统。本系统完全依赖 SMARTS 反应规则进行动态产物生成，并利用深度学习模型确保生成的化学反应合理有效。

## 主要更新

- 🚀 **完全动态生成**：移除了所有硬编码的预定义产物，所有反应均由 RDKit 实时计算。
- 🤖 **AI 智能验证**：集成了 ChemBERTa 模型，自动过滤化学上不合理的反应产物。
- 🔬 **增强的 RDKit 引擎**：服务器端 RDKit 集成，解决了浏览器端性能和兼容性问题。

## 快速开始

### 方法 1：使用启动脚本（推荐）

1. **双击运行** `start_server.bat`
2. 浏览器会自动打开应用
3. 开始生成题目！

### 方法 2：手动启动服务器

由于需要调用 Python 后端的 AI 验证模块，必须通过 Python 服务器启动：

```bash
# 在项目目录下打开命令行
cd c:\Users\ryoma\Desktop\出题器\generateproblem-SMARTS

# 启动 Python Flask 服务器
python server.py

# 服务器启动后，请在浏览器访问显示的的地址（通常是 http://localhost:8000）
```

## 系统要求

- **Python 3.8+**
  - 需要安装依赖库：`flask`, `rdkit`, `torch`, `transformers`, `scikit-learn`
- **现代浏览器**（推荐 Chrome 或 Edge）

## 功能特性

- 🧪 **广泛的反应支持**：覆盖烯烃、炔烃、醇、苯、醛酮等多种有机反应。
- 🎨 **高质量渲染**：使用 RDKit 绘制标准的化学结构式。
- 🧠 **智能过滤**：利用 AI 剔除错误的反应预测结果。
- 📊 **高度可定制**：支持调整显示大小、键长、颜色等视觉参数。

## 文件结构

```
generateproblem-SMARTS/
├── index.html           # 主页面
├── server.py            # Python 后端服务器（处理 RDKit 和 AI 验证）
├── ai_validator.py      # AI 验证模块 (ChemBERTa)
├── reactions.js         # 反应数据库（SMARTS 规则）
├── modules/             # 前端模块
│   ├── reaction-engine.js # 反应引擎前端接口
│   ├── ui-controller.js   # UI 控制逻辑
│   └── ...
├── style.css            # 样式表
├── start_server.bat     # 启动脚本
└── README.md            # 本文档
```

## 常见问题

### Q: 为什么生成速度比以前慢？
**A:** 因为现在每次生成都会经过 AI 模型的验证计算，虽然速度稍慢，但能保证题目质量更高。

### Q: "服务器连接失败"？
**A:** 请确保 `server.py` 正在后台运行。本版本不再支持纯静态页面打开。

### Q: 产物位置显示 "?"
**A:** 表示 RDKit 无法根据规则生成产物，或者生成的结果未通过 AI 验证。

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Python Flask
- **化学引擎**: RDKit (Python & JS via WASM)
- **AI 模型**: ChemBERTa (Transformers)

## 🛠️ 维护与管理

本项目包含一个内置的维护工具 `maintenance.py`，用于数据更新、系统体检和 AI 调优。

### 如何使用
双击 `maintenance.py` 或在命令行运行：
```bash
python maintenance.py
```

### 功能菜单
1. **数据更新**：每次修改 `SMARTS.txt` 后，运行此选项将更改同步到 JSON 和 JS 文件。
2. **系统体检**：检查规则文件是否有语法错误。
3. **数据备份**：一键备份核心数据文件到 `backups/` 目录。
4. **AI 统计**：查看 AI 模型的拦截率和常见失败反应。
5. **日志清理**：重置 AI 拦截日志。
