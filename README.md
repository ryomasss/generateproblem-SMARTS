# 有机化学反应出题器 - RDKit 重构版

基于 RDKit.js 的有机化学反应出题系统，支持 SMARTS 反应规则和化学结构式渲染。

## 快速开始

### 方法 1：使用启动脚本（推荐）

1. **双击运行** `start_server.bat`
2. 浏览器会自动打开应用
3. 开始生成题目！

### 方法 2：手动启动服务器

如果启动脚本无法运行，可以手动启动：

```bash
# 在项目目录下打开命令行
cd c:\Users\ryoma\Desktop\出题器\出题器-SMARTS

# 启动 Python HTTP 服务器
python -m http.server 8000

# 在浏览器中打开
# http://localhost:8000/random.html
```

## 为什么需要本地服务器？

本应用使用了 WebAssembly（`.wasm` 文件）来运行 RDKit 化学结构库。出于安全原因，浏览器不允许通过 `file://` 协议直接加载 WASM 文件。

**问题：** 直接双击 `random.html` 会导致：
- ❌ CORS 策略错误
- ❌ RDKit 引擎无法初始化
- ❌ 所有化学结构无法渲染

**解决：** 通过本地 HTTP 服务器访问：
- ✅ 绕过 CORS 限制
- ✅ RDKit 正常工作
- ✅ 化学结构正确显示

## 系统要求

- **Python 3.x**（用于启动本地服务器）
  - 下载：https://www.python.org/downloads/
  - 安装时请勾选 "Add Python to PATH"
  
- **现代浏览器**（推荐 Chrome 或 Edge）

## 功能特性

- 🧪 支持多种有机化学反应类型（烯烃、炔烃、醇、苯、醛酮等）
- 🎨 使用 RDKit 渲染高质量化学结构式
- ⚗️ 基于 SMARTS 规则的反应预测
- 📊 可自定义结构式大小、颜色、键长等参数
- 🖨️ 支持打印作业和答案

## 反应类型

### 烯烃反应
- 烯烃与溴加成
- 烯烃与氯加成
- 烯烃与 HBr 加成
- 烯烃水合反应
- 烯烃环氧化
- 烯烃臭氧氧化分解
- 烯烃催化氢化

### 炔烃反应
- 炔烃与 HBr 加成
- 末端炔烃水合
- 炔烃完全氢化
- 炔烃部分氢化（Lindlar）

### 醇类反应
- 伯醇氧化为醛
- 仲醇氧化为酮
- 醇分子内脱水
- 威廉姆逊醚合成

### 芳香族反应
- 苯的溴代
- 苯的硝化
- 傅-克烷基化
- 傅-克酰基化

### 醛酮反应
- 醛/酮还原为醇
- 格氏试剂加成
- 羟醛缩合

## 文件结构

```
出题器-SMARTS/
├── random.html          # 主页面
├── script.js            # 核心逻辑
├── reactions.js         # 反应数据库（SMARTS 规则）
├── style.css            # 样式表
├── start_server.bat     # 启动脚本
├── README.md            # 本文档
└── lib/
    ├── RDKit_minimal.js   # RDKit JavaScript 库
    └── RDKit_minimal.wasm # RDKit WebAssembly 二进制
```

## 常见问题

### Q: 启动脚本显示 "未检测到 Python"？
**A:** 请安装 Python 并确保在安装时勾选了 "Add Python to PATH" 选项。安装后重启命令行窗口。

### Q: 浏览器显示 "引擎初始化失败"？
**A:** 确保您是通过 HTTP 服务器访问（`http://localhost:8000`），而不是直接打开 HTML 文件（`file://`）。

### Q: 产物结构显示 "⚠️ 无法生成"？
**A:** 这可能是因为：
1. 反应物与 SMARTS 规则不匹配
2. RDKit 反应引擎在该特定结构上失败
3. 尝试选择其他反应类型或重新生成

### Q: 如何停止服务器？
**A:** 在命令行窗口中按 `Ctrl + C`，然后关闭窗口。

## 技术说明

- **RDKit.js**：用于化学结构渲染和反应预测
- **SMARTS**：用于定义反应规则的化学结构查询语言
- **SMILES**：用于表示化学结构的简化分子线性输入规范

## 开发者信息

如需修改反应规则，请编辑 `reactions.js` 文件中的 `REACTION_DB_EXTENDED` 对象。

每个反应定义包含：
- `category`: 反应分类
- `name`: 中文名称
- `smarts`: SMARTS 反应规则
- `source`: 反应物来源池
- `condition`: 反应条件（显示在箭头上方）

## 许可证

本项目使用 RDKit（BSD 许可证）。
