// 难度等级定义：
// 1 = easy (简单) - 基础反应，如简单加成、氢化
// 2 = medium (中等) - 需要理解选择性或机理，如马氏规则、Lindlar催化剂
// 3 = hard (高级) - 复杂反应，如格氏反应、羟醛缩合、多步反应

window.REACTION_DB_EXTENDED = {
  "alkene_gen_1": {
    category: "alkene",
    name: "烯烃与溴加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[Br][Br]>>[C:1]([Br])-[C:2]([Br])",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","BrBr"],
    condition: "烯烃与溴加成"
  },
  "alkene_gen_2": {
    category: "alkene",
    name: "烯烃与氯加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[Cl][Cl]>>[C:1]([Cl])-[C:2]([Cl])",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","ClCl"],
    condition: "烯烃与氯加成"
  },
  "alkene_gen_3": {
    category: "alkene",
    name: "烯烃与碘加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[I][I]>>[C:1]([I])-[C:2]([I])",
    source: ["alkenes", "reagents_i2"],
    search_smarts: ["[C]=[C]","II"],
    condition: "烯烃与碘加成"
  },
  "alkene_gen_4": {
    category: "alkene",
    name: "烯烃与溴化氢加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[H][Br]>>[C:1][H][C:2][Br]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","Br"],
    condition: "烯烃与溴化氢加成"
  },
  "alkene_gen_5": {
    category: "alkene",
    name: "烯烃与氯化氢加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[H][Cl]>>[C:1][H][C:2][Cl]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","Cl"],
    condition: "烯烃与氯化氢加成"
  },
  "alkene_gen_6": {
    category: "alkene",
    name: "烯烃与碘化氢加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[H][I]>>[C:1][H][C:2][I]",
    source: ["alkenes", "reagents_hi"],
    search_smarts: ["[C]=[C]","I"],
    condition: "烯烃与碘化氢加成"
  },
  "alkene_gen_7": {
    category: "alkene",
    name: "烯烃与次溴酸加成",
    difficulty: 2,
    smarts: "[C:1]=[C:2].[OH][Br:3]>>[C:1][Br:3][C:2][OH]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","OBr"],
    condition: "烯烃与次溴酸加成"
  },
  "alkene_gen_8": {
    category: "alkene",
    name: "烯烃与次氯酸加成",
    difficulty: 2,
    smarts: "[C:1]=[C:2].[OH][Cl:3]>>[C:1][Cl:3][C:2][OH]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","OCl"],
    condition: "烯烃与次氯酸加成"
  },
  "alkene_gen_9": {
    category: "alkene",
    name: "烯烃与次碘酸加成",
    difficulty: 2,
    smarts: "[C:1]=[C:2].[OH][I:3]>>[C:1][I:3][C:2][OH]",
    source: ["alkenes", "reagents_hoi"],
    search_smarts: ["[C]=[C]","OI"],
    condition: "烯烃与次碘酸加成"
  },
  "alkene_gen_10": {
    category: "alkene",
    name: "与水加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[O:3][H:4]>>[C:1](-[H:4])-[C:2]-[O:3]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","O"],
    condition: "与水加成"
  },
  "alkene_gen_11": {
    category: "alkene",
    name: "烯烃与硫酸加成",
    difficulty: 2,
    smarts: "[C:1]=[C:2].[O:3]([O]=)S(=[O])[O:4][H]>>[C:1][C:2][O:3]([O]=)S(=[O])([O:4])[H]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","[O]([O]=)S(=[O])[O][H]"],
    condition: "烯烃与硫酸加成"
  },
  "alkene_gen_12": {
    category: "alkene",
    name: "alkene 反应 12",
    difficulty: 2,
    smarts: "C=C.O=S(=O)(O)O>>CC-O-S(=O)(=O)O",
    source: ["alkenes"],
    search_smarts: ["C=C","O=S(=O)(O)O"],
    condition: "alkene 反应 12"
  },
  "alkene_gen_13": {
    category: "alkene",
    name: "自由基加成反应（反马氏规则）",
    difficulty: 2,
    smarts: "[C:1][C:2]=[C:3].[Br:4][H:5]>>[C:1][C:2][H:5][C:3][Br:4]",
    source: ["alkenes"],
    search_smarts: ["[C][C]=[C]","Br"],
    condition: "自由基加成反应（反马氏规则）"
  },
  "alkene_gen_14": {
    category: "alkene",
    name: "a氢的卤化",
    difficulty: 1,
    smarts: "[C:1][C:2]=[C:3].[Cl][Cl]>>[Cl][C:1][C:2]=[C:3]",
    source: ["alkenes"],
    search_smarts: ["[C][C]=[C]","ClCl"],
    condition: "a氢的卤化"
  },
  "alkene_gen_15": {
    category: "alkene",
    name: "环氧化反应",
    difficulty: 3,
    smarts: "[C:1]=[C:2].[O:3][O:4][C:5]>>[C:1]1[C:2][O:3]1",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","[O][O][C]"],
    condition: "环氧化反应"
  },
  "alkene_gen_16": {
    category: "alkene",
    name: "烯烃氧化为邻二醇",
    difficulty: 2,
    smarts: "[C:1]=[C:2]>>[C:1]([OH])-[C:2]([OH])",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "烯烃氧化为邻二醇"
  },
  "alkene_gen_17": {
    category: "alkene",
    name: "烯烃的臭氧氧化-分解反应",
    difficulty: 3,
    smarts: "[C:1]=[C:2]>>[C:1]=O.O=[C:2]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "烯烃的臭氧氧化-分解反应"
  },
  "alkene_gen_18": {
    category: "alkene",
    name: "硼氢化反应",
    difficulty: 3,
    smarts: "[C:1]=[C:2]>>[C:1][H][C:2][B]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "硼氢化反应"
  },
  "alkene_gen_19": {
    category: "alkene",
    name: "催化加氢",
    difficulty: 1,
    smarts: "[C:1]=[C:2]>>[C:1]-[C:2]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "催化加氢"
  },
  "alkene_gen_20": {
    category: "alkene",
    name: "聚合反应",
    difficulty: 2,
    smarts: "[C:1]=[C:2]>>-[C:1]-[C:2]-",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "聚合反应"
  },
  "alkene_gen_21": {
    category: "alkene",
    name: "烯烃复分解反应",
    difficulty: 3,
    smarts: "[C:1]=[C:2].[C:3]=[C:4]>>[C:1]=[C:3].[C:2]=[C:4]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "烯烃复分解反应"
  },
  "alkene_gen_22": {
    category: "alkene",
    name: "共轭加成(1,2-加成)",
    difficulty: 3,
    smarts: "[C:1]=[C:2]-[C:3]=[C:4]>>[C:1][Br]-[C:2]=[C:3]-[C:4][Br]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]-[C]=[C]"],
    condition: "共轭加成(1,2-加成)"
  },
  "alkene_gen_23": {
    category: "alkene",
    name: "共轭加成(1,4-加成)",
    difficulty: 3,
    smarts: "[C:1]=[C:2]-[C:3]=[C:4]>>[C:1][Br]-[C:2]-[C:3]=[C:4][Br]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]-[C]=[C]"],
    condition: "共轭加成(1,4-加成)"
  },
  "alkyne_gen_1": {
    category: "alkyne",
    name: "与HBr加成（马氏规则）内部炔烃",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[H:3][Br:4]>>[C:1]([Br:4])=[C:2][H:3]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","Br"],
    condition: "与HBr加成（马氏规则）内部炔烃"
  },
  "alkyne_gen_2": {
    category: "alkyne",
    name: "与HBr加成（马氏规则）末端炔烃",
    difficulty: 3,
    smarts: "[C;H1:1]#[C:2].[H:3][Br:4]>>[C:1]([H:3])=[C:2][Br:4]",
    source: ["alkynes"],
    search_smarts: ["[C;H1]#[C]","Br"],
    condition: "与HBr加成（马氏规则）末端炔烃"
  },
  "alkyne_gen_3": {
    category: "alkyne",
    name: "alkyne 反应 3",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[H][Br][H][Br]>>[C:1][C:2]([Br])([Br])",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[H][Br][H][Br]"],
    condition: "alkyne 反应 3"
  },
  "alkyne_gen_4": {
    category: "alkyne",
    name: "与水加成 末端炔烃生成醛",
    difficulty: 1,
    smarts: "[C;H1:1]#[C:2].[O:3][H:4]>>[C:1](=[O:3])-[C:2]([H:4])",
    source: ["alkynes"],
    search_smarts: ["[C;H1]#[C]","O"],
    condition: "与水加成 末端炔烃生成醛"
  },
  "alkyne_gen_5": {
    category: "alkyne",
    name: "与水加成 内部炔烃生成酮",
    difficulty: 1,
    smarts: "[C:1]#[C:2].[O:3][H:4]>>[C:1](=[O:3])-[C:2]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","O"],
    condition: "与水加成 内部炔烃生成酮"
  },
  "alkyne_gen_6": {
    category: "alkyne",
    name: "溴加成(反式加成,第一步)",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[Br:3][Br:4]>>[C:1]([Br:3])=[C:2]([Br:4])",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","BrBr"],
    condition: "溴加成(反式加成,第一步)"
  },
  "alkyne_gen_7": {
    category: "alkyne",
    name: "溴加成第二步",
    difficulty: 3,
    smarts: "[C:1]([Br:3])=[C:2]([Br:4]).[Br:5][Br:6]>>[C:1]([Br:3])([Br:5])-[C:2]([Br:4])([Br:6])",
    source: ["alkynes"],
    search_smarts: ["[C]([Br])=[C]([Br])","BrBr"],
    condition: "溴加成第二步"
  },
  "alkyne_gen_8": {
    category: "alkyne",
    name: "alkyne 反应 8",
    difficulty: 2,
    smarts: "[C:1][C:2]#[C:3].[H:4][Br:5]>>[C:1][C:2]([H:4])=[C:3]([Br:5])",
    source: ["alkynes"],
    search_smarts: ["[C][C]#[C]","Br"],
    condition: "alkyne 反应 8"
  },
  "alkyne_gen_9": {
    category: "alkyne",
    name: "alkyne 反应 9",
    difficulty: 3,
    smarts: "[C:1][C:2]#[C:3].[H:4][Br:5][H:6][Br:7]>>[C:1][C:2]([H:4])([Br:7])[C:3]([H:6])([Br:5])",
    source: ["alkynes"],
    search_smarts: ["[C][C]#[C]","[H][Br][H][Br]"],
    condition: "alkyne 反应 9"
  },
  "alkyne_gen_10": {
    category: "alkyne",
    name: "与氢氰酸亲核加成",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[H:3][C:4]#[N:5]>>[C:1]=[C:2][C:4]#[N:5]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[H][C]#[N]"],
    condition: "与氢氰酸亲核加成"
  },
  "alkyne_gen_11": {
    category: "alkyne",
    name: "在强碱(如KOH或NaOH)催化下",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[C:3][C:4][O:5]>>[C:1]=[C:2][O:5][C:4][C:3]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[C][C][O]"],
    condition: "在强碱(如KOH或NaOH)催化下"
  },
  "alkyne_gen_12": {
    category: "alkyne",
    name: "高锰酸钾（KMnO₄）氧化末端炔烃",
    difficulty: 2,
    smarts: "[C;H1:1]#[C:2]>>[C:1](=O)[OH].[C:2](=O)[OH]",
    source: ["alkynes"],
    search_smarts: ["[C;H1]#[C]"],
    condition: "高锰酸钾（KMnO₄）氧化末端炔烃"
  },
  "alkyne_gen_13": {
    category: "alkyne",
    name: "高锰酸钾（KMnO₄）氧化内部炔烃",
    difficulty: 2,
    smarts: "[C:1]#[C:2]>>[C:1](=O)[OH].[C:2](=O)[OH]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "高锰酸钾（KMnO₄）氧化内部炔烃"
  },
  "alkyne_gen_14": {
    category: "alkyne",
    name: "臭氧氧化-分解反应",
    difficulty: 3,
    smarts: "[C:1]#[C:2]>>[C:1](=O)[OH].[C:2](=O)[OH]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "臭氧氧化-分解反应"
  },
  "alkyne_gen_15": {
    category: "alkyne",
    name: "完全加氢(生成烷烃)",
    difficulty: 1,
    smarts: "[C:1]#[C:2].[H][H][H][H]>>[C:1]([H])([H])-[C:2]([H])([H])",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[H][H][H][H]"],
    condition: "完全加氢(生成烷烃)"
  },
  "alkyne_gen_16": {
    category: "alkyne",
    name: "部分加氢(顺式加成,Lindlar催化剂)",
    difficulty: 1,
    smarts: "[C:1]#[C:2].[H][H]>>([H])/[C:1]=[C:2]\\([H])",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[H][H]"],
    condition: "部分加氢(顺式加成,Lindlar催化剂)"
  },
  "alkyne_gen_17": {
    category: "alkyne",
    name: "硼氢化-氧化反应 对于末端炔烃（生成醛）",
    difficulty: 3,
    smarts: "[C;H1:1]#[C:2]>>[C:1](=O)-[C:2]",
    source: ["alkynes"],
    search_smarts: ["[C;H1]#[C]"],
    condition: "硼氢化-氧化反应 对于末端炔烃（生成醛）"
  },
  "alkyne_gen_18": {
    category: "alkyne",
    name: "二聚反应",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[C:3]#[C:4]>>[C:1]=[C:2][C:3]#[C:4]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "二聚反应"
  },
  "alkyne_gen_19": {
    category: "alkyne",
    name: "三聚反应",
    difficulty: 3,
    smarts: "[C:1]#[C:2].[C:3]#[C:4].[C:5]#[C:6]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "三聚反应"
  },
  "alkyne_gen_20": {
    category: "alkyne",
    name: "四聚反应",
    difficulty: 3,
    smarts: "[C:1]#[C:2].[C:3]#[C:4].[C:5]#[C:6].[C:7]#[C:8]>>[C:1]1=[C:2][C:3]=[C:4][C:5]=[C:6][C:7]=[C:8]1",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "四聚反应"
  },
  "alcohol_gen_1": {
    category: "alcohol",
    name: "与钠反应",
    difficulty: 2,
    smarts: "[C:1][O:2].[Na:3]>>[C:1][O-:2].[Na+:3].[H][H]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[Na]"],
    condition: "与钠反应"
  },
  "alcohol_gen_2": {
    category: "alcohol",
    name: "伯醇→醛",
    difficulty: 2,
    smarts: "[C:1][C:2][O:3]>>[C:1][C:2]=[O:3]",
    source: ["alcohols"],
    search_smarts: ["[C][C][O]"],
    condition: "伯醇→醛"
  },
  "alcohol_gen_3": {
    category: "alcohol",
    name: "伯醇→羧酸",
    difficulty: 2,
    smarts: "[C:1][C:2][O:3]>>[C:1][C:2](=[O:3])[O]",
    source: ["alcohols"],
    search_smarts: ["[C][C][O]"],
    condition: "伯醇→羧酸"
  },
  "alcohol_gen_4": {
    category: "alcohol",
    name: "仲醇→酮",
    difficulty: 2,
    smarts: "[C:1][C:2]([O:3])[C:4]>>[C:1][C:2](=[O:3])[C:4]",
    source: ["alcohols"],
    search_smarts: ["[C][C]([O])[C]"],
    condition: "仲醇→酮"
  },
  "alcohol_gen_5": {
    category: "alcohol",
    name: "分子内脱水（消除反应）",
    difficulty: 2,
    smarts: "[C:1][C:2][O:3]>>[C:1]=[C:2].[O:3]",
    source: ["alcohols"],
    search_smarts: ["[C][C][O]"],
    condition: "分子内脱水（消除反应）"
  },
  "alcohol_gen_6": {
    category: "alcohol",
    name: "分子间脱水(生成醚)",
    difficulty: 2,
    smarts: "[C:1][O:2].[CH:3][O:4]>>[C:1][O:2][C:3].[O:4]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[CH][O]"],
    condition: "分子间脱水(生成醚)"
  },
  "alcohol_gen_7": {
    category: "alcohol",
    name: "alcohol 反应 7",
    difficulty: 2,
    smarts: "[C:1][O:2].[C:3](=[O:4])[O:5]>>[C:3](=[O:4])[O:2][C:1].[O:5]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[C](=[O])[O]"],
    condition: "alcohol 反应 7"
  },
  "alcohol_gen_8": {
    category: "alcohol",
    name: "酚的酯化反应",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[C:8][C:9](=O)[O:10]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7][C:9](=O)[C:8].[O:10]",
    source: ["alcohols"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","[C][C](=O)[O]"],
    condition: "酚的酯化反应"
  },
  "alcohol_gen_9": {
    category: "alcohol",
    name: "与HX反应",
    difficulty: 2,
    smarts: "[C:1][O:2].[Br:3]>>[C:1][Br:3].[O:2]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[Br]"],
    condition: "与HX反应"
  },
  "alcohol_gen_10": {
    category: "alcohol",
    name: "与SOCl₂反应",
    difficulty: 3,
    smarts: "[C:1][O:2].[S:3](=[O:4])([Cl:5])([Cl:6])>>[C:1][Cl:6].[S:3](=[O:4])(=[O]).[Cl:5]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[S](=[O])([Cl])([Cl])"],
    condition: "与SOCl₂反应"
  },
  "alcohol_gen_11": {
    category: "alcohol",
    name: "烷氧基负离子与卤代烃反应生成醚",
    difficulty: 2,
    smarts: "[C:1][O-:2].[C:3][Br:4]>>[C:1][O:2][C:3].[Br-:4]",
    source: ["alcohols"],
    search_smarts: ["[C][O-]","[C][Br]"],
    condition: "烷氧基负离子与卤代烃反应生成醚"
  },
  "alcohol_gen_12": {
    category: "alcohol",
    name: "与卤化磷反应转化为卤代烃",
    difficulty: 1,
    smarts: "[C:1][O:2].[P:3]([Cl:4])([Cl:5])[Cl:6]>>[C:1][Cl:4].[P:3](=[O:2])([Cl:5])[Cl:6]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[P]([Cl])([Cl])[Cl]"],
    condition: "与卤化磷反应转化为卤代烃"
  },
  "alcohol_gen_13": {
    category: "alcohol",
    name: "生成磺酸酯和氯化氢",
    difficulty: 1,
    smarts: "[CX4:1][O:2][H].[C:3][S:4](=[O])(=[O])[Cl:5]>>[CX4:1][O:2][S:4](=[O])(=[O])[C:3]+[H][Cl:5]",
    source: ["alcohols"],
    search_smarts: ["[CX4][O][H]","[C][S](=[O])(=[O])[Cl]"],
    condition: "生成磺酸酯和氯化氢"
  },
  "thiol_gen_1": {
    category: "thiol",
    name: "硫醇与重金属反应（解毒应用）",
    difficulty: 2,
    smarts: "[S:1][H:2].[Hg:3]>>[S:1][Hg:3].[H:2]",
    source: ["thiols"],
    search_smarts: ["[S][H]","[Hg]"],
    condition: "硫醇与重金属反应（解毒应用）"
  },
  "thiol_gen_2": {
    category: "thiol",
    name: "硫醇在稀过氧化氢/碘/空气作用下生成二硫化物",
    difficulty: 2,
    smarts: "[S:1][H:2].[S:3][H:4]>>[S:1]-[S:3].[H:2][H:4]",
    source: ["thiols"],
    search_smarts: ["[S][H]"],
    condition: "硫醇在稀过氧化氢/碘/空气作用下生成二硫化物"
  },
  "ether_gen_1": {
    category: "ether",
    name: "醚氧化成酮",
    difficulty: 2,
    smarts: "[C:1]-[O:2]-[C:3]>>[C:1](=O)-[C:3]",
    source: ["ethers"],
    search_smarts: ["[C]-[O]-[C]"],
    condition: "醚氧化成酮"
  },
  "ether_gen_2": {
    category: "ether",
    name: "ether 反应 2",
    difficulty: 2,
    smarts: "[C:1]-[O:2]-[C:3].[C:4][X:5]>>[C:1]-[O:2]-[C:4].[C:3][X:5]",
    source: ["ethers"],
    search_smarts: ["[C]-[O]-[C]","[C][X]"],
    condition: "ether 反应 2"
  },
  "ether_gen_3": {
    category: "ether",
    name: "酸性条件下与水反应生成两种醇",
    difficulty: 1,
    smarts: "[C:1]-[O:2]-[C:3].[H:4][O:5][H:6]>>[C:1]-[O:5][H:6].[C:3]-[O:5][H:4]",
    source: ["ethers"],
    search_smarts: ["[C]-[O]-[C]","[H][O][H]"],
    condition: "酸性条件下与水反应生成两种醇"
  },
  "ether_gen_4": {
    category: "ether",
    name: "与水在酸催化下反应生成乙二醇",
    difficulty: 2,
    smarts: "[C:1]1-[O:2]-[C:3]1.[OH2]>>[C:1]([OH])-[O:2]-[C:3][OH]",
    source: ["ethers"],
    search_smarts: ["[C]1-[O]-[C]1","O"],
    condition: "与水在酸催化下反应生成乙二醇"
  },
  "ether_gen_5": {
    category: "ether",
    name: "在碱性条件下与氰化物反应",
    difficulty: 3,
    smarts: "[C:1]1-[O:2]-[C;H2,H1:3]1.[C-:4]#[N]>>[C:1]([O:2])-[C:3]-[C:4]#[N]",
    source: ["ethers"],
    search_smarts: ["[C]1-[O]-[C;H2,H1]1","[C-]#N"],
    condition: "在碱性条件下与氰化物反应"
  },
  "benzene_gen_1": {
    category: "benzene",
    name: "卤代反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[Br][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[Br].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","BrBr"],
    condition: "卤代反应"
  },
  "benzene_gen_2": {
    category: "benzene",
    name: "benzene 反应 2",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[Cl][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[Cl].[Cl]#卤代反应",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","ClCl"],
    condition: "benzene 反应 2"
  },
  "benzene_gen_3": {
    category: "benzene",
    name: "硝化反应",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[N+](=O)([O-])[O:7]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[N+](=O)[O-].[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[N+](=O)([O-])[O]"],
    condition: "硝化反应"
  },
  "benzene_gen_4": {
    category: "benzene",
    name: "磺化反应",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[S](=O)(=O)O>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[S](=O)(=O)O",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","OS(=O)(=O)O"],
    condition: "磺化反应"
  },
  "benzene_gen_5": {
    category: "benzene",
    name: "烷基化反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[C:7][C:8][Br:9]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[C][C][Br]"],
    condition: "烷基化反应"
  },
  "benzene_gen_6": {
    category: "benzene",
    name: "烷基化反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[C:7][C:8][Cl:9]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[C][C][Cl]"],
    condition: "烷基化反应"
  },
  "benzene_gen_7": {
    category: "benzene",
    name: "酰基化反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[C:7][C:8](=O)[Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:8](=O)[C:7].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[C][C](=O)[Cl]"],
    condition: "酰基化反应"
  },
  "benzene_gen_8": {
    category: "benzene",
    name: "酰基化反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[C:7][C:8](=O)[Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:8](=O)[C:7].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[C][C](=O)[Br]"],
    condition: "酰基化反应"
  },
  "benzene_gen_9": {
    category: "benzene",
    name: "苯酚的溴代反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[Br][Br]>>[c:1]1[c:2][c:3]([Br])[c:4][c:5][c:6]1[O].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","BrBr"],
    condition: "苯酚的溴代反应"
  },
  "benzene_gen_10": {
    category: "benzene",
    name: "benzene 反应 10",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[Br][Br].[Br][Br].[Br][Br]>>[c:1]1([Br])[c:2][c:3]([Br])[c:4][c:5]([Br])[c:6]1[O].[Br][Br][Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","BrBr"],
    condition: "benzene 反应 10"
  },
  "benzene_gen_11": {
    category: "benzene",
    name: "苯酚的氯代反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[Cl][Cl]>>[c:1]1[c:2][c:3]([Cl])[c:4][c:5][c:6]1[O].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","ClCl"],
    condition: "苯酚的氯代反应"
  },
  "benzene_gen_12": {
    category: "benzene",
    name: "苯酚的碘代反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[I][I]>>[c:1]1[c:2][c:3]([I])[c:4][c:5][c:6]1[O].[I]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","II"],
    condition: "苯酚的碘代反应"
  },
  "benzene_gen_13": {
    category: "benzene",
    name: "CHCI3 ;15℃苯酚的硝化反应",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[N+](=O)[O-]>>[c:1]1[c:2][c:3]([N+](=O)[O-])[c:4][c:5][c:6]1[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","[N+](=O)[O-]"],
    condition: "CHCI3 ;15℃苯酚的硝化反应"
  },
  "benzene_gen_14": {
    category: "benzene",
    name: "低极性溶剂 ; 25℃,HONO2(20%)",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[N+](=O)[O-]>>[c:1]1[c:2][c:3][c:4][c:5]([N+](=O)[O-])[c:6]1[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","[N+](=O)[O-]"],
    condition: "低极性溶剂 ; 25℃,HONO2(20%)"
  },
  "benzene_gen_15": {
    category: "benzene",
    name: "磺化反应浓H2SO4 ; 25℃",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[S](=O)(=O)O>>[c:1]1[c:2][c:3][c:4][c:5]([S](=O)(=O)O)[c:6]1[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","OS(=O)(=O)O"],
    condition: "磺化反应浓H2SO4 ; 25℃"
  },
  "benzene_gen_16": {
    category: "benzene",
    name: "磺化反应浓H2SO4 ; 100℃",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[S](=O)(=O)O>>[c:1]1[c:2][c:3]([S](=O)(=O)O)[c:4][c:5][c:6]1[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","OS(=O)(=O)O"],
    condition: "磺化反应浓H2SO4 ; 100℃"
  },
  "benzene_gen_17": {
    category: "benzene",
    name: "H2SO4 ; 30℃",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7].[N+](=O)[O-]>>[c:1]1[c:2][c:3][c:4][c:5]([N+](=O)[O-])[c:6]1[C:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]","[N+](=O)[O-]"],
    condition: "H2SO4 ; 30℃"
  },
  "benzene_gen_18": {
    category: "benzene",
    name: "发烟HNO3 ; H2SO4 ; 90-100℃",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[N+](=O)[O-].[N+](=O)[O-]>>[c:1]1[c:2][c:3][c:4]([N+](=O)[O-])[c:5][c:6]1[N+](=O)[O-]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[N+](=O)[O-]","[N+](=O)[O-]"],
    condition: "发烟HNO3 ; H2SO4 ; 90-100℃"
  },
  "benzene_gen_19": {
    category: "benzene",
    name: "萘FeCl3;加热",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[Cl][Cl]>>[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1[Cl].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","ClCl"],
    condition: "萘FeCl3;加热"
  },
  "benzene_gen_20": {
    category: "benzene",
    name: "萘FeCl3;加热",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[Br][Br]>>[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1[Br].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","BrBr"],
    condition: "萘FeCl3;加热"
  },
  "benzene_gen_21": {
    category: "benzene",
    name: "benzene 反应 21",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[N+](=O)[O-]>>[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1[N+](=O)[O-]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","[N+](=O)[O-]"],
    condition: "benzene 反应 21"
  },
  "benzene_gen_22": {
    category: "benzene",
    name: "benzene 反应 22",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[S](=O)(=O)O>>[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1[S](=O)(=O)O",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","OS(=O)(=O)O"],
    condition: "benzene 反应 22"
  },
  "benzene_gen_23": {
    category: "benzene",
    name: "benzene 反应 23",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[S](=O)(=O)O>>[c:1]1([S](=O)(=O)O)[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","OS(=O)(=O)O"],
    condition: "benzene 反应 23"
  },
  "benzene_gen_24": {
    category: "benzene",
    name: "苯在Ni/Pt/Pd/Ru/Rh催化作用下与氢气反应生成环己烷",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1>>[C:1]1[C:2][C:3][C:4][C:5][C:6]1",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1"],
    condition: "苯在Ni/Pt/Pd/Ru/Rh催化作用下与氢气反应生成环己烷"
  },
  "benzene_gen_25": {
    category: "benzene",
    name: "H2,Pd/C",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1>>[C:1]1[C:2][C:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[C:10]1",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1"],
    condition: "H2,Pd/C"
  },
  "benzene_gen_26": {
    category: "benzene",
    name: "H2,Pd/C,高压",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1>>[C:1]1[C:2][C:3][C:4]2[C:5][C:6]1[C:7][C:8][C:9]2[C:10]1",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1"],
    condition: "H2,Pd/C,高压"
  },
  "benzene_gen_27": {
    category: "benzene",
    name: "在光照或加热条件下",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8].[Br][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Br])[C:8].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C][C]","BrBr"],
    condition: "在光照或加热条件下"
  },
  "benzene_gen_28": {
    category: "benzene",
    name: "在光照或加热条件下",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8].[Cl][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Cl])[C:8].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C][C]","ClCl"],
    condition: "在光照或加热条件下"
  },
  "benzene_gen_29": {
    category: "benzene",
    name: "与HX反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8][C:9].[H][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Br])[C:8][C:9]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C][C]","Br"],
    condition: "与HX反应"
  },
  "benzene_gen_30": {
    category: "benzene",
    name: "与HX反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8][C:9].[H][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Cl])[C:8][C:9]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C][C]","Cl"],
    condition: "与HX反应"
  },
  "benzene_gen_31": {
    category: "benzene",
    name: "与X2反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[Cl][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Cl])[C:8][Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","ClCl"],
    condition: "与X2反应"
  },
  "benzene_gen_32": {
    category: "benzene",
    name: "与X2反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[Br][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Br])[C:8][Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","BrBr"],
    condition: "与X2反应"
  },
  "benzene_gen_33": {
    category: "benzene",
    name: "与HX反应(马氏规则)",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[H][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Cl])[C:8]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","Cl"],
    condition: "与HX反应(马氏规则)"
  },
  "benzene_gen_34": {
    category: "benzene",
    name: "与HX反应(马氏规则)",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[H][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Br])[C:8]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","Br"],
    condition: "与HX反应(马氏规则)"
  },
  "benzene_gen_35": {
    category: "benzene",
    name: "在H₂SO₄催化下",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[OH2:9]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([OH:9])[C:8]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","O"],
    condition: "在H₂SO₄催化下"
  },
  "benzene_gen_36": {
    category: "benzene",
    name: "与次氯酸的加成",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[H][O][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([OH])[C:8][Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","[H][O][Cl]"],
    condition: "与次氯酸的加成"
  },
  "benzene_gen_37": {
    category: "benzene",
    name: "在重铬酸钾等强氧化剂的氧化下",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7](=O)O",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C][C]"],
    condition: "在重铬酸钾等强氧化剂的氧化下"
  },
  "benzene_gen_38": {
    category: "benzene",
    name: "用K2Cr2O7 ; H2SO4作氧化剂生成对苯醌",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O]>>[C:1]1=[C:2][C:3](=[O])[C:4]=[C:5][C:6]1=[O]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]"],
    condition: "用K2Cr2O7 ; H2SO4作氧化剂生成对苯醌"
  },
  "benzene_gen_39": {
    category: "benzene",
    name: "Ag2O ; 无水乙醚",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4]([O])[c:5][c:6]1[O]>>[C:1]1=[C:2][C:3]=[C:4][C:5](=[O])[C:6]1=[O]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]([O])[c][c]1[O]"],
    condition: "Ag2O ; 无水乙醚"
  },
  "benzene_gen_40": {
    category: "benzene",
    name: "Na2Cr2O7 ; H2SO4,94%",
    difficulty: 2,
    smarts: "[c:1]1[c:2][O][c:3][c:4][c:5][c:6]1[O]>>[C:1]1=[C:2][C:3](=[O])[C:4]=[C:5][C:6]1=[O]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][O][c][c][c][c]1[O]"],
    condition: "Na2Cr2O7 ; H2SO4,94%"
  },
  "benzene_gen_41": {
    category: "benzene",
    name: "生成",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[Na+].[OH-]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O][Na+].O",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","[Na+]","[OH-]"],
    condition: "生成"
  },
  "benzene_gen_42": {
    category: "benzene",
    name: "CrO3,CH3COOH,25℃",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1>>[C:1]1[C:2][C:3](=O)[c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[C:10]1(=O)",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1"],
    condition: "CrO3,CH3COOH,25℃"
  },
  "carbonyl_gen_1": {
    category: "carbonyl",
    name: "醛与氢氰酸的加成",
    difficulty: 2,
    smarts: "[C:1](=O)[H].[C:2]#[N:3]>>[C:1]([OH])[C:2]([N:3])",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)[H]","[C]#[N]"],
    condition: "醛与氢氰酸的加成"
  },
  "carbonyl_gen_2": {
    category: "carbonyl",
    name: "酮与氢氰酸的加成",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[C:3].[C:4]#[N:5]>>[C:1][C:2]([OH])([C:4][N:5])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[C]#[N]"],
    condition: "酮与氢氰酸的加成"
  },
  "carbonyl_gen_3": {
    category: "carbonyl",
    name: "醛与格氏试剂加成,无水醚",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[H].[C:3][Mg]([X])>>[C:1][C:2]([O][Mg]([X]))[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[H]","[C][Mg]([X])"],
    condition: "醛与格氏试剂加成,无水醚"
  },
  "carbonyl_gen_4": {
    category: "carbonyl",
    name: "醛与格氏试剂加成,H2O",
    difficulty: 3,
    smarts: "[C:1][C:2]([O][Mg]([X]))[C:3]>>[C:1][C:2]([OH])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([O][Mg]([X]))[C]"],
    condition: "醛与格氏试剂加成,H2O"
  },
  "carbonyl_gen_5": {
    category: "carbonyl",
    name: "酮与格氏试剂加成,无水醚",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[C:4][Mg]([X])>>[C:1][C:2]([O][Mg]([X]))([C:4])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[C][Mg]([X])"],
    condition: "酮与格氏试剂加成,无水醚"
  },
  "carbonyl_gen_6": {
    category: "carbonyl",
    name: "酮与格氏试剂加成,H2O",
    difficulty: 3,
    smarts: "[C:1][C:2]([O][Mg]([X]))([C:4])[C:3]>>[C:1][C:2]([OH])([C:4])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([O][Mg]([X]))([C])[C]"],
    condition: "酮与格氏试剂加成,H2O"
  },
  "carbonyl_gen_7": {
    category: "carbonyl",
    name: "醛与有机锂试剂加成,无水醚",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[H].[C:3][Li]>>[C:1][C:2]([O][Li])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[H]","[C][Li]"],
    condition: "醛与有机锂试剂加成,无水醚"
  },
  "carbonyl_gen_8": {
    category: "carbonyl",
    name: "醛与有机锂试剂加成, H2O",
    difficulty: 3,
    smarts: "[C:1][C:2]([O][Li])[C:3]>>[C:1][C:2]([OH])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([O][Li])[C]"],
    condition: "醛与有机锂试剂加成, H2O"
  },
  "carbonyl_gen_9": {
    category: "carbonyl",
    name: "酮与有机锂试剂加成,无水醚",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[C:4][Li]>>[C:1][C:2]([O][Li])([C:4])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[C][Li]"],
    condition: "酮与有机锂试剂加成,无水醚"
  },
  "carbonyl_gen_10": {
    category: "carbonyl",
    name: "酮与有机锂试剂加成,H2O",
    difficulty: 3,
    smarts: "[C:1][C:2]([O][Li])([C:4])[C:3]>>[C:1][C:2]([OH])([C:4])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([O][Li])([C])[C]"],
    condition: "酮与有机锂试剂加成,H2O"
  },
  "carbonyl_gen_11": {
    category: "carbonyl",
    name: "碱性条件下",
    difficulty: 2,
    smarts: "[C:1](=O)[C:2].[Na+][C-:3]#[C:4]>>[C:1]([O-][Na+])([C:2])[C:3]#[C:4]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)[C]","[Na+][C-]#[C]"],
    condition: "碱性条件下"
  },
  "carbonyl_gen_12": {
    category: "carbonyl",
    name: "水解反应",
    difficulty: 1,
    smarts: "[C:1]([O-][Na+])([C:2])[C:3]#[C:4].[O]>>[C:1]([OH])([C:2])[C:3]#[C:4].[Na+][OH-]",
    source: ["carbonyls"],
    search_smarts: ["[C]([O-][Na+])([C])[C]#[C]","[O]"],
    condition: "水解反应"
  },
  "carbonyl_gen_13": {
    category: "carbonyl",
    name: "碱性条件下",
    difficulty: 3,
    smarts: "[C:1]1[C:2][C:3][C:4][C:5](=O)[C:6]1.[Na+][C-:7]#[C:8]>>[C:1]1[C:2][C:3][C:4][C:5]([O-][Na+])([C:7]#[C:8])[C:6]1",
    source: ["carbonyls"],
    search_smarts: ["[C]1[C][C][C][C](=O)[C]1","[Na+][C-]#[C]"],
    condition: "碱性条件下"
  },
  "carbonyl_gen_14": {
    category: "carbonyl",
    name: "carbonyl 反应 14",
    difficulty: 3,
    smarts: "[C:1]1[C:2][C:3][C:4][C:5]([O-][Na+])([C:7]#[C:8])[C:6]1.[O]>>[C:1]1[C:2][C:3][C:4][C:5]([OH])([C:7]#[C:8])[C:6]1.[Na+][OH-]#水解",
    source: ["carbonyls"],
    search_smarts: ["[C]1[C][C][C][C]([O-][Na+])([C]#[C])[C]1","[O]"],
    condition: "carbonyl 反应 14"
  },
  "carbonyl_gen_15": {
    category: "carbonyl",
    name: "醛与一级胺反应H+第一步",
    difficulty: 2,
    smarts: "[C:1](=O)[H].[C:2][NH2]>>[C:1]([OH2])[NH1][C:2]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)[H]","[C][NH2]"],
    condition: "醛与一级胺反应H+第一步"
  },
  "carbonyl_gen_16": {
    category: "carbonyl",
    name: "醛与一级胺反应第二步（消除）",
    difficulty: 2,
    smarts: "[C:1]([OH2])[NH1][C:2]>>[C:1]=[N][C:2].[O]",
    source: ["carbonyls"],
    search_smarts: ["[C]([OH2])[NH1][C]"],
    condition: "醛与一级胺反应第二步（消除）"
  },
  "carbonyl_gen_17": {
    category: "carbonyl",
    name: "酮与二级胺反应第一步",
    difficulty: 2,
    smarts: "[C:1](=[O:2])[C:3].[NH1:4]>>[C:1](-[OH2:2])([C:3])-[N:4]",
    source: ["carbonyls"],
    search_smarts: ["[C](=[O])[C]","[NH1]"],
    condition: "酮与二级胺反应第一步"
  },
  "carbonyl_gen_18": {
    category: "carbonyl",
    name: "酮与二级胺反应第二步（消除）",
    difficulty: 2,
    smarts: "[C:1](-[OH2:2])([C:3])-[N:4]>>[C:3]=[C:1]-[N:4].[O:2]",
    source: ["carbonyls"],
    search_smarts: ["[C](-[OH2])([C])-[N]"],
    condition: "酮与二级胺反应第二步（消除）"
  },
  "carbonyl_gen_19": {
    category: "carbonyl",
    name: "与胺的衍生物（羟胺）加成后失水",
    difficulty: 2,
    smarts: "[C:1](=O).[NH2:2]-[OH]>>[C:1]=[N:2]-[OH]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)","[NH2]-[OH]"],
    condition: "与胺的衍生物（羟胺）加成后失水"
  },
  "carbonyl_gen_20": {
    category: "carbonyl",
    name: "酸性条件下生成醛水合物",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[H].[O]>>[C:1][C:2]([OH])([OH])[H]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[H]","[O]"],
    condition: "酸性条件下生成醛水合物"
  },
  "carbonyl_gen_21": {
    category: "carbonyl",
    name: "酸性条件下生成酮水合物",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[C:3].[O]>>[C:1][C:2]([OH])([OH])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[O]"],
    condition: "酸性条件下生成酮水合物"
  },
  "carbonyl_gen_22": {
    category: "carbonyl",
    name: "H+,半缩醛/酮",
    difficulty: 2,
    smarts: "[C:1](=O).[C:2][O:3][H]>>[C:1]([O:3][C:2])[OH]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)","[C][O][H]"],
    condition: "H+,半缩醛/酮"
  },
  "carbonyl_gen_23": {
    category: "carbonyl",
    name: "H+,缩醛/酮",
    difficulty: 2,
    smarts: "[C:1]([O:3][C:2])[OH].[C:4][O:5][H]>>[C:1]([O:3][C:2])[O:5][C:4].[O]",
    source: ["carbonyls"],
    search_smarts: ["[C]([O][C])[OH]","[C][O][H]"],
    condition: "H+,缩醛/酮"
  },
  "carbonyl_gen_24": {
    category: "carbonyl",
    name: "与亚硫酸氢钠加成",
    difficulty: 2,
    smarts: "[C:1][C:2]=[O:3].[Na+][O-][S](=O)O>>[C:1][C:2]([OH:3])[S]([O-])(=O)O[Na+]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]=[O]","[Na+][O-][S](=O)O"],
    condition: "与亚硫酸氢钠加成"
  },
  "cycloalkane_gen_1": {
    category: "cycloalkane",
    name: "催化加氢,Ni,80℃",
    difficulty: 1,
    smarts: "[C:1]1[C:2][C:3]1.[H][H]>>[C:1][C:2][C:3]",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C][C]1","[H][H]"],
    condition: "催化加氢,Ni,80℃"
  },
  "cycloalkane_gen_2": {
    category: "cycloalkane",
    name: "催化加氢,Ni,120℃",
    difficulty: 1,
    smarts: "[C:1]1[C:2][C:3][C:4]1.[H][H]>>[C:1][C:2][C:3][C:4]",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C][C][C]1","[H][H]"],
    condition: "催化加氢,Ni,120℃"
  },
  "cycloalkane_gen_3": {
    category: "cycloalkane",
    name: "催化加氢,Ni,300℃",
    difficulty: 1,
    smarts: "[C:1]1[C:2][C:3][C:4][C:5]1.[H][H]>>[C:1][C:2][C:3][C:4][C:5]",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C][C][C][C]1","[H][H]"],
    condition: "催化加氢,Ni,300℃"
  },
  "cycloalkane_gen_4": {
    category: "cycloalkane",
    name: "cycloalkane 反应 4",
    difficulty: 2,
    smarts: "[C:1]1[C:2][C:3]1.[Br][Br]>>[C:1]([Br])[C:2][C:3]([Br])",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C][C]1","BrBr"],
    condition: "cycloalkane 反应 4"
  },
  "cycloalkane_gen_5": {
    category: "cycloalkane",
    name: "cycloalkane 反应 5",
    difficulty: 2,
    smarts: "[C:1]1[C:2][C:3][C:4]1.[Br][Br]>>[C:1]([Br])[C:2][C:3][C:4]([Br])",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C][C][C]1","BrBr"],
    condition: "cycloalkane 反应 5"
  },
  "cycloalkane_gen_6": {
    category: "cycloalkane",
    name: "cycloalkane 反应 6",
    difficulty: 2,
    smarts: "[C:1]1[C:2][C:3]1.[H][Br]>>[C:1][C:2][C:3][Br]",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C][C]1","Br"],
    condition: "cycloalkane 反应 6"
  },
  "cycloalkane_gen_7": {
    category: "cycloalkane",
    name: "马氏产物",
    difficulty: 2,
    smarts: "[C:1]([C:4])([C:5])1[C:2][C:3]1.[H][Br]>>[C:1]([Br])([C:4])([C:5])[C:2][C:3]",
    source: ["cycloalkanes"],
    search_smarts: ["[C]([C])([C])1[C][C]1","Br"],
    condition: "马氏产物"
  },
  "cycloalkane_gen_8": {
    category: "cycloalkane",
    name: "cycloalkane 反应 8",
    difficulty: 2,
    smarts: "[C:1]1[C:2][C:3]1.[Cl][Cl]>>[C:1]1[C:2]([Cl])[C:3]1.[Cl]",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C][C]1","ClCl"],
    condition: "cycloalkane 反应 8"
  },
  "cycloalkane_gen_9": {
    category: "cycloalkane",
    name: "cycloalkane 反应 9",
    difficulty: 3,
    smarts: "[C:1]1[C:2][C:3][C:4][C:5][C:6]1.[Cl][Cl]>>[C:1]1[C:2][C:3][C:4][C:5]([Cl])[C:6]1.[Cl]",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C][C][C][C][C]1","ClCl"],
    condition: "cycloalkane 反应 9"
  },
  "cycloalkane_gen_10": {
    category: "cycloalkane",
    name: "O3,H2O,Zn",
    difficulty: 2,
    smarts: "[C:1]1[C:2]([C:3])[C:4]=[C:5][C:6]([C:7])1>>[C:5](=O)[C:6]([C:7])[C:1][C:2]([C:3])[C:4](=O)",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C]([C])[C]=[C][C]([C])1"],
    condition: "O3,H2O,Zn"
  },
  "cycloalkane_gen_11": {
    category: "cycloalkane",
    name: "KMnO4,H+",
    difficulty: 2,
    smarts: "[C:1]1[C:2][C:3]=[C:4][C:5][C:6]1>>[C:4](=O)(O)[C:5][C:6][C:1][C:2][C:3](=O)(O)",
    source: ["cycloalkanes"],
    search_smarts: ["[C]1[C][C]=[C][C][C]1"],
    condition: "KMnO4,H+"
  },
  "alkene_gen_24": {
    category: "alkene",
    name: "烯烃与溴加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[Br][Br]>>[C:1]([Br])-[C:2]([Br])",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","BrBr"],
    condition: "烯烃与溴加成"
  },
  "alkene_gen_25": {
    category: "alkene",
    name: "烯烃与氯加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[Cl][Cl]>>[C:1]([Cl])-[C:2]([Cl])",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","ClCl"],
    condition: "烯烃与氯加成"
  },
  "alkene_gen_26": {
    category: "alkene",
    name: "烯烃与碘加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[I][I]>>[C:1]([I])-[C:2]([I])",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","II"],
    condition: "烯烃与碘加成"
  },
  "alkene_gen_27": {
    category: "alkene",
    name: "烯烃与溴化氢加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[H][Br]>>[C:1][H][C:2][Br]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","Br"],
    condition: "烯烃与溴化氢加成"
  },
  "alkene_gen_28": {
    category: "alkene",
    name: "烯烃与氯化氢加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[H][Cl]>>[C:1][H][C:2][Cl]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","Cl"],
    condition: "烯烃与氯化氢加成"
  },
  "alkene_gen_29": {
    category: "alkene",
    name: "烯烃与碘化氢加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[H][I]>>[C:1][H][C:2][I]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","I"],
    condition: "烯烃与碘化氢加成"
  },
  "alkene_gen_30": {
    category: "alkene",
    name: "烯烃与次溴酸加成",
    difficulty: 2,
    smarts: "[C:1]=[C:2].[OH][Br:3]>>[C:1][Br:3][C:2][OH]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","OBr"],
    condition: "烯烃与次溴酸加成"
  },
  "alkene_gen_31": {
    category: "alkene",
    name: "烯烃与次氯酸加成",
    difficulty: 2,
    smarts: "[C:1]=[C:2].[OH][Cl:3]>>[C:1][Cl:3][C:2][OH]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","OCl"],
    condition: "烯烃与次氯酸加成"
  },
  "alkene_gen_32": {
    category: "alkene",
    name: "烯烃与次碘酸加成",
    difficulty: 2,
    smarts: "[C:1]=[C:2].[OH][I:3]>>[C:1][I:3][C:2][OH]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","OI"],
    condition: "烯烃与次碘酸加成"
  },
  "alkene_gen_33": {
    category: "alkene",
    name: "与水加成",
    difficulty: 1,
    smarts: "[C:1]=[C:2].[O:3][H:4]>>[C:1](-[H:4])-[C:2]-[O:3]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","O"],
    condition: "与水加成"
  },
  "alkene_gen_34": {
    category: "alkene",
    name: "烯烃与硫酸加成",
    difficulty: 2,
    smarts: "[C:1]=[C:2].[O:3]([O]=)S(=[O])[O:4][H]>>[C:1][C:2][O:3]([O]=)S(=[O])([O:4])[H]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","[O]([O]=)S(=[O])[O][H]"],
    condition: "烯烃与硫酸加成"
  },
  "alkene_gen_35": {
    category: "alkene",
    name: "alkene 反应 35",
    difficulty: 2,
    smarts: "C=C.O=S(=O)(O)O>>CC-O-S(=O)(=O)O",
    source: ["alkenes"],
    search_smarts: ["C=C","O=S(=O)(O)O"],
    condition: "alkene 反应 35"
  },
  "alkene_gen_36": {
    category: "alkene",
    name: "自由基加成反应（反马氏规则）",
    difficulty: 2,
    smarts: "[C:1][C:2]=[C:3].[Br:4][H:5]>>[C:1][C:2][H:5][C:3][Br:4]",
    source: ["alkenes"],
    search_smarts: ["[C][C]=[C]","Br"],
    condition: "自由基加成反应（反马氏规则）"
  },
  "alkene_gen_37": {
    category: "alkene",
    name: "a氢的卤化",
    difficulty: 1,
    smarts: "[C:1][C:2]=[C:3].[Cl][Cl]>>[Cl][C:1][C:2]=[C:3]",
    source: ["alkenes"],
    search_smarts: ["[C][C]=[C]","ClCl"],
    condition: "a氢的卤化"
  },
  "alkene_gen_38": {
    category: "alkene",
    name: "环氧化反应",
    difficulty: 3,
    smarts: "[C:1]=[C:2].[O:3][O:4][C:5]>>[C:1]1[C:2][O:3]1",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","[O][O][C]"],
    condition: "环氧化反应"
  },
  "alkene_gen_39": {
    category: "alkene",
    name: "烯烃与过氧酸反应",
    difficulty: 3,
    smarts: "[C:1]=[C:2].[C:3][C:4](=O)[O:5][O:6][H]>>[C:1]1[C:2][O:6]1.[C:3][C:4](=O)[O:5][H]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]","[C][C](=O)[O][O][H]"],
    condition: "烯烃与过氧酸反应"
  },
  "alkene_gen_40": {
    category: "alkene",
    name: "烯烃被高锰酸钾氧化为邻二醇",
    difficulty: 2,
    smarts: "[C:1]=[C:2]>>[C:1]([OH])-[C:2]([OH])",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "烯烃被高锰酸钾氧化为邻二醇"
  },
  "alkene_gen_41": {
    category: "alkene",
    name: "烯烃的臭氧氧化-分解反应第一步",
    difficulty: 3,
    smarts: "[C:1]=[C:2]>>[C:1]1[O][C:2][O][O]1",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "烯烃的臭氧氧化-分解反应第一步"
  },
  "alkene_gen_42": {
    category: "alkene",
    name: "烯烃的臭氧氧化-分解反应第二步",
    difficulty: 3,
    smarts: "[C:1]1[O][C:2][O][O]1>>[C:1]=O.O=[C:2]",
    source: ["alkenes"],
    search_smarts: ["[C]1[O][C][O][O]1"],
    condition: "烯烃的臭氧氧化-分解反应第二步"
  },
  "alkene_gen_43": {
    category: "alkene",
    name: "硼氢化反应",
    difficulty: 3,
    smarts: "[C:1]=[C:2]>>[C:1][H][C:2][B]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "硼氢化反应"
  },
  "alkene_gen_44": {
    category: "alkene",
    name: "催化加氢",
    difficulty: 1,
    smarts: "[C:1]=[C:2]>>[C:1]-[C:2]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "催化加氢"
  },
  "alkene_gen_45": {
    category: "alkene",
    name: "聚合反应",
    difficulty: 2,
    smarts: "[C:1]=[C:2]>>-[C:1]-[C:2]-",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "聚合反应"
  },
  "alkene_gen_46": {
    category: "alkene",
    name: "烯烃复分解反应",
    difficulty: 3,
    smarts: "[C:1]=[C:2].[C:3]=[C:4]>>[C:1]=[C:3].[C:2]=[C:4]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]"],
    condition: "烯烃复分解反应"
  },
  "alkene_gen_47": {
    category: "alkene",
    name: "共轭加成(1,2-加成)",
    difficulty: 3,
    smarts: "[C:1]=[C:2]-[C:3]=[C:4]>>[C:1][Br]-[C:2]=[C:3]-[C:4][Br]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]-[C]=[C]"],
    condition: "共轭加成(1,2-加成)"
  },
  "alkene_gen_48": {
    category: "alkene",
    name: "共轭加成(1,4-加成)",
    difficulty: 3,
    smarts: "[C:1]=[C:2]-[C:3]=[C:4]>>[C:1][Br]-[C:2]-[C:3]=[C:4][Br]",
    source: ["alkenes"],
    search_smarts: ["[C]=[C]-[C]=[C]"],
    condition: "共轭加成(1,4-加成)"
  },
  "alkene_gen_49": {
    category: "alkene",
    name: "alkene 反应 49",
    difficulty: 3,
    smarts: "[C:1]=[C:2][C:3]=[C:4].[C:5]=[C:6]>>[C:1]1[C:2]=[C:3][C:4][C:5][C:6]1",
    source: ["alkenes"],
    search_smarts: ["[C]=[C][C]=[C]","[C]=[C]"],
    condition: "alkene 反应 49"
  },
  "alkyne_gen_21": {
    category: "alkyne",
    name: "与HBr加成（马氏规则）内部炔烃",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[H:3][Br:4]>>[C:1]([Br:4])=[C:2][H:3]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","Br"],
    condition: "与HBr加成（马氏规则）内部炔烃"
  },
  "alkyne_gen_22": {
    category: "alkyne",
    name: "与HBr加成（马氏规则）末端炔烃",
    difficulty: 3,
    smarts: "[C;H1:1]#[C:2].[H:3][Br:4]>>[C:1]([H:3])=[C:2][Br:4]",
    source: ["alkynes"],
    search_smarts: ["[C;H1]#[C]","Br"],
    condition: "与HBr加成（马氏规则）末端炔烃"
  },
  "alkyne_gen_23": {
    category: "alkyne",
    name: "alkyne 反应 23",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[H][Br][H][Br]>>[C:1][C:2]([Br])([Br])",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[H][Br][H][Br]"],
    condition: "alkyne 反应 23"
  },
  "alkyne_gen_24": {
    category: "alkyne",
    name: "与水加成 末端炔烃生成醛",
    difficulty: 1,
    smarts: "[C;H1:1]#[C:2].[O:3][H:4]>>[C:1](=[O:3])-[C:2]([H:4])",
    source: ["alkynes"],
    search_smarts: ["[C;H1]#[C]","O"],
    condition: "与水加成 末端炔烃生成醛"
  },
  "alkyne_gen_25": {
    category: "alkyne",
    name: "与水加成 内部炔烃生成酮",
    difficulty: 1,
    smarts: "[C:1]#[C:2].[O:3][H:4]>>[C:1](=[O:3])-[C:2]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","O"],
    condition: "与水加成 内部炔烃生成酮"
  },
  "alkyne_gen_26": {
    category: "alkyne",
    name: "溴加成(反式加成,第一步)",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[Br:3][Br:4]>>[C:1]([Br:3])=[C:2]([Br:4])",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","BrBr"],
    condition: "溴加成(反式加成,第一步)"
  },
  "alkyne_gen_27": {
    category: "alkyne",
    name: "溴加成第二步",
    difficulty: 3,
    smarts: "[C:1]([Br:3])=[C:2]([Br:4]).[Br:5][Br:6]>>[C:1]([Br:3])([Br:5])-[C:2]([Br:4])([Br:6])",
    source: ["alkynes"],
    search_smarts: ["[C]([Br])=[C]([Br])","BrBr"],
    condition: "溴加成第二步"
  },
  "alkyne_gen_28": {
    category: "alkyne",
    name: "alkyne 反应 28",
    difficulty: 2,
    smarts: "[C:1][C:2]#[C:3].[H:4][Br:5]>>[C:1][C:2]([H:4])=[C:3]([Br:5])",
    source: ["alkynes"],
    search_smarts: ["[C][C]#[C]","Br"],
    condition: "alkyne 反应 28"
  },
  "alkyne_gen_29": {
    category: "alkyne",
    name: "alkyne 反应 29",
    difficulty: 3,
    smarts: "[C:1][C:2]#[C:3].[H:4][Br:5][H:6][Br:7]>>[C:1][C:2]([H:4])([Br:7])[C:3]([H:6])([Br:5])",
    source: ["alkynes"],
    search_smarts: ["[C][C]#[C]","[H][Br][H][Br]"],
    condition: "alkyne 反应 29"
  },
  "alkyne_gen_30": {
    category: "alkyne",
    name: "与氢氰酸亲核加成",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[H:3][C:4]#[N:5]>>[C:1]=[C:2][C:4]#[N:5]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[H][C]#[N]"],
    condition: "与氢氰酸亲核加成"
  },
  "alkyne_gen_31": {
    category: "alkyne",
    name: "在强碱(如KOH或NaOH)催化下",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[C:3][C:4][O:5]>>[C:1]=[C:2][O:5][C:4][C:3]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[C][C][O]"],
    condition: "在强碱(如KOH或NaOH)催化下"
  },
  "alkyne_gen_32": {
    category: "alkyne",
    name: "高锰酸钾（KMnO₄）氧化末端炔烃",
    difficulty: 2,
    smarts: "[C;H1:1]#[C:2]>>[C:1](=O)[OH].[C:2](=O)[OH]",
    source: ["alkynes"],
    search_smarts: ["[C;H1]#[C]"],
    condition: "高锰酸钾（KMnO₄）氧化末端炔烃"
  },
  "alkyne_gen_33": {
    category: "alkyne",
    name: "高锰酸钾（KMnO₄）氧化内部炔烃",
    difficulty: 2,
    smarts: "[C:1]#[C:2]>>[C:1](=O)[OH].[C:2](=O)[OH]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "高锰酸钾（KMnO₄）氧化内部炔烃"
  },
  "alkyne_gen_34": {
    category: "alkyne",
    name: "臭氧氧化-分解反应",
    difficulty: 3,
    smarts: "[C:1]#[C:2]>>[C:1](=O)[OH].[C:2](=O)[OH]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "臭氧氧化-分解反应"
  },
  "alkyne_gen_35": {
    category: "alkyne",
    name: "完全加氢(生成烷烃)",
    difficulty: 1,
    smarts: "[C:1]#[C:2].[H][H][H][H]>>[C:1]([H])([H])-[C:2]([H])([H])",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[H][H][H][H]"],
    condition: "完全加氢(生成烷烃)"
  },
  "alkyne_gen_36": {
    category: "alkyne",
    name: "部分加氢(顺式加成,Lindlar催化剂)",
    difficulty: 1,
    smarts: "[C:1]#[C:2].[H][H]>>([H])/[C:1]=[C:2]\\([H])",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]","[H][H]"],
    condition: "部分加氢(顺式加成,Lindlar催化剂)"
  },
  "alkyne_gen_37": {
    category: "alkyne",
    name: "硼氢化-氧化反应 对于末端炔烃（生成醛）",
    difficulty: 3,
    smarts: "[C;H1:1]#[C:2]>>[C:1](=O)-[C:2]",
    source: ["alkynes"],
    search_smarts: ["[C;H1]#[C]"],
    condition: "硼氢化-氧化反应 对于末端炔烃（生成醛）"
  },
  "alkyne_gen_38": {
    category: "alkyne",
    name: "二聚反应",
    difficulty: 2,
    smarts: "[C:1]#[C:2].[C:3]#[C:4]>>[C:1]=[C:2][C:3]#[C:4]",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "二聚反应"
  },
  "alkyne_gen_39": {
    category: "alkyne",
    name: "三聚反应",
    difficulty: 3,
    smarts: "[C:1]#[C:2].[C:3]#[C:4].[C:5]#[C:6]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "三聚反应"
  },
  "alkyne_gen_40": {
    category: "alkyne",
    name: "四聚反应",
    difficulty: 3,
    smarts: "[C:1]#[C:2].[C:3]#[C:4].[C:5]#[C:6].[C:7]#[C:8]>>[C:1]1=[C:2][C:3]=[C:4][C:5]=[C:6][C:7]=[C:8]1",
    source: ["alkynes"],
    search_smarts: ["[C]#[C]"],
    condition: "四聚反应"
  },
  "halide_gen_1": {
    category: "halide",
    name: "生成醇",
    difficulty: 2,
    smarts: "[C:1][F,Cl,Br,I].[OH-]>>[C:1][OH].[F,Cl,Br,I-]",
    source: ["halides"],
    search_smarts: ["[C][F,Cl,Br,I]","[OH-]"],
    condition: "生成醇"
  },
  "halide_gen_2": {
    category: "halide",
    name: "生成腈",
    difficulty: 2,
    smarts: "[C:1][F,Cl,Br,I].[C-]#N>>[C:1][C#N].[F,Cl,Br,I-]",
    source: ["halides"],
    search_smarts: ["[C][F,Cl,Br,I]","[C-]#N"],
    condition: "生成腈"
  },
  "halide_gen_3": {
    category: "halide",
    name: "生成醚",
    difficulty: 2,
    smarts: "[C:1][F,Cl,Br,I].[O-][C:2]>>[C:1][O][C:2].[F,Cl,Br,I-]",
    source: ["halides"],
    search_smarts: ["[C][F,Cl,Br,I]","[O-][C]"],
    condition: "生成醚"
  },
  "halide_gen_4": {
    category: "halide",
    name: "生成胺",
    difficulty: 2,
    smarts: "[C:1][F,Cl,Br,I].[NH2]>>[C:1][NH2]",
    source: ["halides"],
    search_smarts: ["[C][F,Cl,Br,I]","N"],
    condition: "生成胺"
  },
  "halide_gen_5": {
    category: "halide",
    name: "生成硝酸酯",
    difficulty: 2,
    smarts: "[C:1][F,Cl,Br,I].[Ag+].[O-][N+](=O)[O-]>>[C:1][O][N+](=O)[O-].[Ag][F,Cl,Br,I]",
    source: ["halides"],
    search_smarts: ["[C][F,Cl,Br,I]","[Ag+]","[O-][N+](=O)[O-]"],
    condition: "生成硝酸酯"
  },
  "halide_gen_6": {
    category: "halide",
    name: "KOH,C2H5OH,加热",
    difficulty: 2,
    smarts: "[C:1][C:2][C:3]([Br])[C:4]>>[C:1][C:2]=[C:3][C:4].[C:1][C:2][C:3]=[C:4]",
    source: ["halides"],
    search_smarts: ["[C][C][C]([Br])[C]"],
    condition: "KOH,C2H5OH,加热"
  },
  "halide_gen_7": {
    category: "halide",
    name: "KOH,C2H5OH,加热",
    difficulty: 2,
    smarts: "[C:1][C:2][C:3]([C:5])([Br])[C:4]>>[C:1][C:2]=[C:3]([C:5])[C:4].[C:1][C:2][C:3]([C:5])=[C:4]",
    source: ["halides"],
    search_smarts: ["[C][C][C]([C])([Br])[C]"],
    condition: "KOH,C2H5OH,加热"
  },
  "halide_gen_8": {
    category: "halide",
    name: "halide 反应 8",
    difficulty: 2,
    smarts: "[C:1][Br].[Mg]>>[C:1][Mg][Br]",
    source: ["halides"],
    search_smarts: ["[C][Br]","[Mg]"],
    condition: "halide 反应 8"
  },
  "halide_gen_9": {
    category: "halide",
    name: "halide 反应 9",
    difficulty: 2,
    smarts: "[C:1][I].[Mg]>>[C:1][Mg][I]",
    source: ["halides"],
    search_smarts: ["[C][I]","[Mg]"],
    condition: "halide 反应 9"
  },
  "halide_gen_10": {
    category: "halide",
    name: "halide 反应 10",
    difficulty: 2,
    smarts: "[C:1][Cl].[Mg]>>[C:1][Mg][Cl]",
    source: ["halides"],
    search_smarts: ["[C][Cl]","[Mg]"],
    condition: "halide 反应 10"
  },
  "halide_gen_11": {
    category: "halide",
    name: "halide 反应 11",
    difficulty: 2,
    smarts: "[C:1][F,Cl,Br,I].[Mg]>>[C:1][Mg][F,Cl,Br,I]",
    source: ["halides"],
    search_smarts: ["[C][F,Cl,Br,I]","[Mg]"],
    condition: "halide 反应 11"
  },
  "halide_gen_12": {
    category: "halide",
    name: "LiAlH4",
    difficulty: 2,
    smarts: "[C:1][Br]>>[C:1][H]",
    source: ["halides"],
    search_smarts: ["[C][Br]"],
    condition: "LiAlH4"
  },
  "halide_gen_13": {
    category: "halide",
    name: "LiAlH4",
    difficulty: 2,
    smarts: "[C:1][Cl]>>[C:1][H]",
    source: ["halides"],
    search_smarts: ["[C][Cl]"],
    condition: "LiAlH4"
  },
  "halide_gen_14": {
    category: "halide",
    name: "LiAlH4",
    difficulty: 2,
    smarts: "[C:1][I]>>[C:1][H]",
    source: ["halides"],
    search_smarts: ["[C][I]"],
    condition: "LiAlH4"
  },
  "halide_gen_15": {
    category: "halide",
    name: "halide 反应 15",
    difficulty: 2,
    smarts: "[C:1][F,Cl,Br,I].[H2]>>[C:1][H]",
    source: ["halides"],
    search_smarts: ["[C][F,Cl,Br,I]","[H2]"],
    condition: "halide 反应 15"
  },
  "halide_gen_16": {
    category: "halide",
    name: "halide 反应 16",
    difficulty: 2,
    smarts: "[C:1][F,Cl,Br,I].[C:2][F,Cl,Br,I]>>[C:1][C:2]",
    source: ["halides"],
    search_smarts: ["[C][F,Cl,Br,I]"],
    condition: "halide 反应 16"
  },
  "alcohol_gen_14": {
    category: "alcohol",
    name: "与钠反应",
    difficulty: 2,
    smarts: "[C:1][O:2].[Na:3]>>[C:1][O-:2].[Na+:3].[H][H]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[Na]"],
    condition: "与钠反应"
  },
  "alcohol_gen_15": {
    category: "alcohol",
    name: "伯醇→醛",
    difficulty: 2,
    smarts: "[C:1][C:2][O:3]>>[C:1][C:2]=[O:3]",
    source: ["alcohols"],
    search_smarts: ["[C][C][O]"],
    condition: "伯醇→醛"
  },
  "alcohol_gen_16": {
    category: "alcohol",
    name: "伯醇→羧酸",
    difficulty: 2,
    smarts: "[C:1][C:2][O:3]>>[C:1][C:2](=[O:3])[O]",
    source: ["alcohols"],
    search_smarts: ["[C][C][O]"],
    condition: "伯醇→羧酸"
  },
  "alcohol_gen_17": {
    category: "alcohol",
    name: "仲醇→酮",
    difficulty: 2,
    smarts: "[C:1][C:2]([O:3])[C:4]>>[C:1][C:2](=[O:3])[C:4]",
    source: ["alcohols"],
    search_smarts: ["[C][C]([O])[C]"],
    condition: "仲醇→酮"
  },
  "alcohol_gen_18": {
    category: "alcohol",
    name: "分子内脱水（消除反应）",
    difficulty: 2,
    smarts: "[C:1][C:2][O:3]>>[C:1]=[C:2].[O:3]",
    source: ["alcohols"],
    search_smarts: ["[C][C][O]"],
    condition: "分子内脱水（消除反应）"
  },
  "alcohol_gen_19": {
    category: "alcohol",
    name: "分子间脱水(生成醚)",
    difficulty: 2,
    smarts: "[C:1][O:2].[CH:3][O:4]>>[C:1][O:2][C:3].[O:4]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[CH][O]"],
    condition: "分子间脱水(生成醚)"
  },
  "alcohol_gen_20": {
    category: "alcohol",
    name: "alcohol 反应 20",
    difficulty: 2,
    smarts: "[C:1][O:2].[C:3](=[O:4])[O:5]>>[C:3](=[O:4])[O:2][C:1].[O:5]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[C](=[O])[O]"],
    condition: "alcohol 反应 20"
  },
  "alcohol_gen_21": {
    category: "alcohol",
    name: "酚的酯化反应",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[C:8][C:9](=O)[O:10]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7][C:9](=O)[C:8].[O:10]",
    source: ["alcohols"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","[C][C](=O)[O]"],
    condition: "酚的酯化反应"
  },
  "alcohol_gen_22": {
    category: "alcohol",
    name: "与HX反应",
    difficulty: 2,
    smarts: "[C:1][O:2].[Br:3]>>[C:1][Br:3].[O:2]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[Br]"],
    condition: "与HX反应"
  },
  "alcohol_gen_23": {
    category: "alcohol",
    name: "与SOCl₂反应",
    difficulty: 3,
    smarts: "[C:1][O:2].[S:3](=[O:4])([Cl:5])([Cl:6])>>[C:1][Cl:6].[S:3](=[O:4])(=[O]).[Cl:5]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[S](=[O])([Cl])([Cl])"],
    condition: "与SOCl₂反应"
  },
  "alcohol_gen_24": {
    category: "alcohol",
    name: "烷氧基负离子与卤代烃反应生成醚",
    difficulty: 2,
    smarts: "[C:1][O-:2].[C:3][Br:4]>>[C:1][O:2][C:3].[Br-:4]",
    source: ["alcohols"],
    search_smarts: ["[C][O-]","[C][Br]"],
    condition: "烷氧基负离子与卤代烃反应生成醚"
  },
  "alcohol_gen_25": {
    category: "alcohol",
    name: "与卤化磷反应转化为卤代烃",
    difficulty: 1,
    smarts: "[C:1][O:2].[P:3]([Cl:4])([Cl:5])[Cl:6]>>[C:1][Cl:4].[P:3](=[O:2])([Cl:5])[Cl:6]",
    source: ["alcohols"],
    search_smarts: ["[C][O]","[P]([Cl])([Cl])[Cl]"],
    condition: "与卤化磷反应转化为卤代烃"
  },
  "alcohol_gen_26": {
    category: "alcohol",
    name: "生成磺酸酯和氯化氢",
    difficulty: 1,
    smarts: "[CX4:1][O:2][H].[C:3][S:4](=[O])(=[O])[Cl:5]>>[CX4:1][O:2][S:4](=[O])(=[O])[C:3]+[H][Cl:5]",
    source: ["alcohols"],
    search_smarts: ["[CX4][O][H]","[C][S](=[O])(=[O])[Cl]"],
    condition: "生成磺酸酯和氯化氢"
  },
  "thiol_gen_3": {
    category: "thiol",
    name: "硫醇与重金属反应（解毒应用）",
    difficulty: 2,
    smarts: "[S:1][H:2].[Hg:3]>>[S:1][Hg:3].[H:2]",
    source: ["thiols"],
    search_smarts: ["[S][H]","[Hg]"],
    condition: "硫醇与重金属反应（解毒应用）"
  },
  "thiol_gen_4": {
    category: "thiol",
    name: "硫醇在稀过氧化氢/碘/空气作用下生成二硫化物",
    difficulty: 2,
    smarts: "[S:1][H:2].[S:3][H:4]>>[S:1]-[S:3].[H:2][H:4]",
    source: ["thiols"],
    search_smarts: ["[S][H]"],
    condition: "硫醇在稀过氧化氢/碘/空气作用下生成二硫化物"
  },
  "ether_gen_6": {
    category: "ether",
    name: "醚氧化成酮",
    difficulty: 2,
    smarts: "[C:1]-[O:2]-[C:3]>>[C:1](=O)-[C:3]",
    source: ["ethers"],
    search_smarts: ["[C]-[O]-[C]"],
    condition: "醚氧化成酮"
  },
  "ether_gen_7": {
    category: "ether",
    name: "ether 反应 7",
    difficulty: 2,
    smarts: "[C:1]-[O:2]-[C:3].[C:4][X:5]>>[C:1]-[O:2]-[C:4].[C:3][X:5]",
    source: ["ethers"],
    search_smarts: ["[C]-[O]-[C]","[C][X]"],
    condition: "ether 反应 7"
  },
  "ether_gen_8": {
    category: "ether",
    name: "酸性条件下与水反应生成两种醇",
    difficulty: 1,
    smarts: "[C:1]-[O:2]-[C:3].[H:4][O:5][H:6]>>[C:1]-[O:5][H:6].[C:3]-[O:5][H:4]",
    source: ["ethers"],
    search_smarts: ["[C]-[O]-[C]","[H][O][H]"],
    condition: "酸性条件下与水反应生成两种醇"
  },
  "ether_gen_9": {
    category: "ether",
    name: "与水在酸催化下反应生成乙二醇",
    difficulty: 2,
    smarts: "[C:1]1-[O:2]-[C:3]1.[OH2]>>[C:1]([OH])-[O:2]-[C:3][OH]",
    source: ["ethers"],
    search_smarts: ["[C]1-[O]-[C]1","O"],
    condition: "与水在酸催化下反应生成乙二醇"
  },
  "ether_gen_10": {
    category: "ether",
    name: "在碱性条件下与氰化物反应",
    difficulty: 3,
    smarts: "[C:1]1-[O:2]-[C;H2,H1:3]1.[C-:4]#[N]>>[C:1]([O:2])-[C:3]-[C:4]#[N]",
    source: ["ethers"],
    search_smarts: ["[C]1-[O]-[C;H2,H1]1","[C-]#N"],
    condition: "在碱性条件下与氰化物反应"
  },
  "benzene_gen_43": {
    category: "benzene",
    name: "卤代反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[Br][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[Br].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","BrBr"],
    condition: "卤代反应"
  },
  "benzene_gen_44": {
    category: "benzene",
    name: "卤代反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[Cl][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[Cl].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","ClCl"],
    condition: "卤代反应"
  },
  "benzene_gen_45": {
    category: "benzene",
    name: "吡咯的卤代反应",
    difficulty: 2,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1.[Br][Br]>>[nH]1[c:1]([Br])[c:2][c:3][c:4]1.[Br]",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1","BrBr"],
    condition: "吡咯的卤代反应"
  },
  "benzene_gen_46": {
    category: "benzene",
    name: "吡咯的卤代反应",
    difficulty: 2,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1.[Cl][Cl]>>[nH]1[c:1]([Cl])[c:2][c:3][c:4]1.[Cl]",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1","ClCl"],
    condition: "吡咯的卤代反应"
  },
  "benzene_gen_47": {
    category: "benzene",
    name: "呋喃的卤代反应",
    difficulty: 2,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.[Br][Br]>>[o]1[c:1]([Br])[c:2][c:3][c:4]1.[Br]",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","BrBr"],
    condition: "呋喃的卤代反应"
  },
  "benzene_gen_48": {
    category: "benzene",
    name: "呋喃的卤代反应",
    difficulty: 2,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.[Cl][Cl]>>[o]1[c:1]([Cl])[c:2][c:3][c:4]1.[Cl]",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","ClCl"],
    condition: "呋喃的卤代反应"
  },
  "benzene_gen_49": {
    category: "benzene",
    name: "噻吩的卤代反应",
    difficulty: 2,
    smarts: "[s]1[c:1][c:2][c:3][c:4]1.[Br][Br]>>[s]1[c:1]([Br])[c:2][c:3][c:4]1.[Br]",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c][c][c]1","BrBr"],
    condition: "噻吩的卤代反应"
  },
  "benzene_gen_50": {
    category: "benzene",
    name: "噻吩的卤代反应",
    difficulty: 2,
    smarts: "[s]1[c:1][c:2][c:3][c:4]1.[Cl][Cl]>>[s]1[c:1]([Cl])[c:2][c:3][c:4]1.[Cl]",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c][c][c]1","ClCl"],
    condition: "噻吩的卤代反应"
  },
  "benzene_gen_51": {
    category: "benzene",
    name: "吡咯与乙酸酐反应,加热",
    difficulty: 2,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1.CC(=O)OC(=O)C>>[nH]1[c:1](C(=O)C)[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1","CC(=O)OC(=O)C"],
    condition: "吡咯与乙酸酐反应,加热"
  },
  "benzene_gen_52": {
    category: "benzene",
    name: "呋喃与乙酸酐反应,加热",
    difficulty: 2,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.CC(=O)OC(=O)C>>[o]1[c:1](C(=O)C)[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","CC(=O)OC(=O)C"],
    condition: "呋喃与乙酸酐反应,加热"
  },
  "benzene_gen_53": {
    category: "benzene",
    name: "吡咯的硝化反应,乙酰硝基酯",
    difficulty: 1,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1.[N+](=O)[O-]>>[nH]1[c:1]([N+](=O)[O-])[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1","[N+](=O)[O-]"],
    condition: "吡咯的硝化反应,乙酰硝基酯"
  },
  "benzene_gen_54": {
    category: "benzene",
    name: "呋喃的硝化反应,乙酰硝基酯",
    difficulty: 1,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.[N+](=O)[O-]>>[o]1[c:1]([N+](=O)[O-])[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","[N+](=O)[O-]"],
    condition: "呋喃的硝化反应,乙酰硝基酯"
  },
  "benzene_gen_55": {
    category: "benzene",
    name: "硝化反应",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[N+](=O)([O-])[O:7]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[N+](=O)[O-].[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[N+](=O)([O-])[O]"],
    condition: "硝化反应"
  },
  "benzene_gen_56": {
    category: "benzene",
    name: "磺化反应",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[S](=O)(=O)O>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[S](=O)(=O)O",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","S(=O)(=O)(O)O"],
    condition: "磺化反应"
  },
  "benzene_gen_57": {
    category: "benzene",
    name: "吡咯的磺化反应",
    difficulty: 1,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1.[S](=O)(=O)O>>[nH]1[c:1]([S](=O)(=O)O)[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1","S(=O)(=O)(O)O"],
    condition: "吡咯的磺化反应"
  },
  "benzene_gen_58": {
    category: "benzene",
    name: "呋喃的磺化反应",
    difficulty: 1,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.[S](=O)(=O)O>>[o]1[c:1]([S](=O)(=O)O)[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","S(=O)(=O)(O)O"],
    condition: "呋喃的磺化反应"
  },
  "benzene_gen_59": {
    category: "benzene",
    name: "烷基化反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[C:7][C:8][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[C][C][Br]"],
    condition: "烷基化反应"
  },
  "benzene_gen_60": {
    category: "benzene",
    name: "烷基化反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[C:7][C:8][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[C][C][Cl]"],
    condition: "烷基化反应"
  },
  "benzene_gen_61": {
    category: "benzene",
    name: "吡咯的烷基化反应",
    difficulty: 3,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1.[C:5][C:6][Cl]>>[nH]1[c:1]([C:5][C:6])[c:2][c:3][c:4]1.[Cl]",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1","[C][C][Cl]"],
    condition: "吡咯的烷基化反应"
  },
  "benzene_gen_62": {
    category: "benzene",
    name: "呋喃的烷基化反应",
    difficulty: 3,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.[C:5][C:6][Cl]>>[o]1[c:1]([C:5][C:6])[c:2][c:3][c:4]1.[Cl]",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","[C][C][Cl]"],
    condition: "呋喃的烷基化反应"
  },
  "benzene_gen_63": {
    category: "benzene",
    name: "吡咯的酰基化反应",
    difficulty: 3,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1.[C:5][C:6](=O)[Cl]>>[nH]1[c:1]([C:6](=O)[C:5])[c:2][c:3][c:4]1.[Cl]",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1","[C][C](=O)[Cl]"],
    condition: "吡咯的酰基化反应"
  },
  "benzene_gen_64": {
    category: "benzene",
    name: "呋喃的酰基化反应",
    difficulty: 3,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.[C:5][C:6](=O)[Cl]>>[o]1[c:1]([C:6](=O)[C:5])[c:2][c:3][c:4]1.[Cl]",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","[C][C](=O)[Cl]"],
    condition: "呋喃的酰基化反应"
  },
  "benzene_gen_65": {
    category: "benzene",
    name: "噻吩的Vilsmeier甲酰化",
    difficulty: 2,
    smarts: "[s]1[c:1][c:2][c:3][c:4]1.[C:5](=O)[Cl]>>[s]1[c:1]([C:6](=O))[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c][c][c]1","[C](=O)[Cl]"],
    condition: "噻吩的Vilsmeier甲酰化"
  },
  "benzene_gen_66": {
    category: "benzene",
    name: "Vilsmeier-Haack反应,POCl₃",
    difficulty: 2,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1.[C:5](=O)[H]>>[nH]1[c:1]([C:5](=O)[H])[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1","[C](=O)[H]"],
    condition: "Vilsmeier-Haack反应,POCl₃"
  },
  "benzene_gen_67": {
    category: "benzene",
    name: "酰基化反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[C:7][C:8](=O)[Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:8](=O)[C:7].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[C][C](=O)[Cl]"],
    condition: "酰基化反应"
  },
  "benzene_gen_68": {
    category: "benzene",
    name: "酰基化反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1.[C:7][C:8](=O)[Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:8](=O)[C:7].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1","[C][C](=O)[Br]"],
    condition: "酰基化反应"
  },
  "benzene_gen_69": {
    category: "benzene",
    name: "苯酚的溴代反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[Br][Br]>>[c:1]1[c:2][c:3]([Br])[c:4][c:5][c:6]1[O].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","BrBr"],
    condition: "苯酚的溴代反应"
  },
  "benzene_gen_70": {
    category: "benzene",
    name: "benzene 反应 70",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[Br][Br].[Br][Br].[Br][Br]>>[c:1]1([Br])[c:2][c:3]([Br])[c:4][c:5]([Br])[c:6]1[O].[Br][Br][Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","BrBr"],
    condition: "benzene 反应 70"
  },
  "benzene_gen_71": {
    category: "benzene",
    name: "苯酚的氯代反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[Cl][Cl]>>[c:1]1[c:2][c:3]([Cl])[c:4][c:5][c:6]1[O].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","ClCl"],
    condition: "苯酚的氯代反应"
  },
  "benzene_gen_72": {
    category: "benzene",
    name: "苯酚的碘代反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[I][I]>>[c:1]1[c:2][c:3]([I])[c:4][c:5][c:6]1[O].[I]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","II"],
    condition: "苯酚的碘代反应"
  },
  "benzene_gen_73": {
    category: "benzene",
    name: "CHCI3 ;15℃苯酚的硝化反应",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[N+](=O)[O-]>>[c:1]1[c:2][c:3]([N+](=O)[O-])[c:4][c:5][c:6]1[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","[N+](=O)[O-]"],
    condition: "CHCI3 ;15℃苯酚的硝化反应"
  },
  "benzene_gen_74": {
    category: "benzene",
    name: "低极性溶剂 ; 25℃,HONO2(20%)",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[N+](=O)[O-]>>[c:1]1[c:2][c:3][c:4][c:5]([N+](=O)[O-])[c:6]1[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","[N+](=O)[O-]"],
    condition: "低极性溶剂 ; 25℃,HONO2(20%)"
  },
  "benzene_gen_75": {
    category: "benzene",
    name: "磺化反应浓H2SO4 ; 25℃",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[S](=O)(=O)O>>[c:1]1[c:2][c:3][c:4][c:5]([S](=O)(=O)O)[c:6]1[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","S(=O)(=O)(O)O"],
    condition: "磺化反应浓H2SO4 ; 25℃"
  },
  "benzene_gen_76": {
    category: "benzene",
    name: "磺化反应浓H2SO4 ; 100℃",
    difficulty: 1,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O:7].[S](=O)(=O)O>>[c:1]1[c:2][c:3]([S](=O)(=O)O)[c:4][c:5][c:6]1[O:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","S(=O)(=O)(O)O"],
    condition: "磺化反应浓H2SO4 ; 100℃"
  },
  "benzene_gen_77": {
    category: "benzene",
    name: "H2SO4 ; 30℃",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7].[N+](=O)[O-]>>[c:1]1[c:2][c:3][c:4][c:5]([N+](=O)[O-])[c:6]1[C:7]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]","[N+](=O)[O-]"],
    condition: "H2SO4 ; 30℃"
  },
  "benzene_gen_78": {
    category: "benzene",
    name: "发烟HNO3 ; H2SO4 ; 90-100℃",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[N+](=O)[O-].[N+](=O)[O-]>>[c:1]1[c:2][c:3][c:4]([N+](=O)[O-])[c:5][c:6]1[N+](=O)[O-]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[N+](=O)[O-]","[N+](=O)[O-]"],
    condition: "发烟HNO3 ; H2SO4 ; 90-100℃"
  },
  "benzene_gen_79": {
    category: "benzene",
    name: "萘FeCl3;加热",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[Cl][Cl]>>[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1[Cl].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","ClCl"],
    condition: "萘FeCl3;加热"
  },
  "benzene_gen_80": {
    category: "benzene",
    name: "萘FeCl3;加热",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[Br][Br]>>[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1[Br].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","BrBr"],
    condition: "萘FeCl3;加热"
  },
  "benzene_gen_81": {
    category: "benzene",
    name: "benzene 反应 81",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[N+](=O)[O-]>>[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1[N+](=O)[O-]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","[N+](=O)[O-]"],
    condition: "benzene 反应 81"
  },
  "benzene_gen_82": {
    category: "benzene",
    name: "benzene 反应 82",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[S](=O)(=O)O>>[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1[S](=O)(=O)O",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","S(=O)(=O)(O)O"],
    condition: "benzene 反应 82"
  },
  "benzene_gen_83": {
    category: "benzene",
    name: "benzene 反应 83",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1.[S](=O)(=O)O>>[c:1]1([S](=O)(=O)O)[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1","S(=O)(=O)(O)O"],
    condition: "benzene 反应 83"
  },
  "benzene_gen_84": {
    category: "benzene",
    name: "苯在Ni/Pt/Pd/Ru/Rh催化作用下与氢气反应生成环己烷",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1>>[C:1]1[C:2][C:3][C:4][C:5][C:6]1",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1"],
    condition: "苯在Ni/Pt/Pd/Ru/Rh催化作用下与氢气反应生成环己烷"
  },
  "benzene_gen_85": {
    category: "benzene",
    name: "H2,Pd/C",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1>>[C:1]1[C:2][C:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[C:10]1",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1"],
    condition: "H2,Pd/C"
  },
  "benzene_gen_86": {
    category: "benzene",
    name: "H2,Pd/C,高压",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1>>[C:1]1[C:2][C:3][C:4]2[C:5][C:6]1[C:7][C:8][C:9]2[C:10]1",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1"],
    condition: "H2,Pd/C,高压"
  },
  "benzene_gen_87": {
    category: "benzene",
    name: "吡咯的催化加氢",
    difficulty: 1,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1>>[NH]1[C:1][C:2][C:3][C:4]1",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1"],
    condition: "吡咯的催化加氢"
  },
  "benzene_gen_88": {
    category: "benzene",
    name: "呋喃的催化加氢",
    difficulty: 1,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1>>[O]1[C:1][C:2][C:3][C:4]1",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1"],
    condition: "呋喃的催化加氢"
  },
  "benzene_gen_89": {
    category: "benzene",
    name: "噻吩的部分加氢",
    difficulty: 1,
    smarts: "[s]1[c:1][c:2][c:3][c:4]1>>[S]1[C:1][C:2][C:3]=[C:4]1",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c][c][c]1"],
    condition: "噻吩的部分加氢"
  },
  "benzene_gen_90": {
    category: "benzene",
    name: "噻吩的完全加氢",
    difficulty: 1,
    smarts: "[s]1[c:1][c:2][c:3][c:4]1>>[S]1[C:1][C:2][C:3][C:4]1",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c][c][c]1"],
    condition: "噻吩的完全加氢"
  },
  "benzene_gen_91": {
    category: "benzene",
    name: "呋喃在强碱条件下",
    difficulty: 2,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.[Li]>>[o]1[c:1]([Li])[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","[Li]"],
    condition: "呋喃在强碱条件下"
  },
  "benzene_gen_92": {
    category: "benzene",
    name: "噻吩在强碱条件下",
    difficulty: 2,
    smarts: "[s]1[c:1][c:2][c:3][c:4]1.[Li]>>[s]1[c:1]([Li])[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c][c][c]1","[Li]"],
    condition: "噻吩在强碱条件下"
  },
  "benzene_gen_93": {
    category: "benzene",
    name: "呋喃在酸性条件下",
    difficulty: 2,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1>>[C:1](=O)[C:2]=[C:3][C:4](=O)",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1"],
    condition: "呋喃在酸性条件下"
  },
  "benzene_gen_94": {
    category: "benzene",
    name: "呋喃作为双烯体,乙烯作为亲双烯体",
    difficulty: 3,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.[C:5]=[C:6]1>>[O]1[C:1]2[C:2]=[C:3][C:4]1[C:5][C:6]2",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","[C]=[C]1"],
    condition: "呋喃作为双烯体,乙烯作为亲双烯体"
  },
  "benzene_gen_95": {
    category: "benzene",
    name: "在光照或加热条件下",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8].[Br][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Br])[C:8].[Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C][C]","BrBr"],
    condition: "在光照或加热条件下"
  },
  "benzene_gen_96": {
    category: "benzene",
    name: "在光照或加热条件下",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8].[Cl][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Cl])[C:8].[Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C][C]","ClCl"],
    condition: "在光照或加热条件下"
  },
  "benzene_gen_97": {
    category: "benzene",
    name: "在酸性条件下",
    difficulty: 2,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1.[Nu:5]>>[o]1[c:1]([Nu:5])[c:2][c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1","[Nu]"],
    condition: "在酸性条件下"
  },
  "benzene_gen_98": {
    category: "benzene",
    name: "与HX反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8][C:9].[H][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Br])[C:8][C:9]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C][C]","Br"],
    condition: "与HX反应"
  },
  "benzene_gen_99": {
    category: "benzene",
    name: "与HX反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8][C:9].[H][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Cl])[C:8][C:9]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C][C]","Cl"],
    condition: "与HX反应"
  },
  "benzene_gen_100": {
    category: "benzene",
    name: "与X2反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[Cl][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Cl])[C:8][Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","ClCl"],
    condition: "与X2反应"
  },
  "benzene_gen_101": {
    category: "benzene",
    name: "与X2反应",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[Br][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Br])[C:8][Br]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","BrBr"],
    condition: "与X2反应"
  },
  "benzene_gen_102": {
    category: "benzene",
    name: "与HX反应(马氏规则)",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[H][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Cl])[C:8]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","Cl"],
    condition: "与HX反应(马氏规则)"
  },
  "benzene_gen_103": {
    category: "benzene",
    name: "与HX反应(马氏规则)",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[H][Br]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([Br])[C:8]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","Br"],
    condition: "与HX反应(马氏规则)"
  },
  "benzene_gen_104": {
    category: "benzene",
    name: "在H₂SO₄催化下",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[OH2:9]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([OH:9])[C:8]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","O"],
    condition: "在H₂SO₄催化下"
  },
  "benzene_gen_105": {
    category: "benzene",
    name: "与次氯酸的加成",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]=[C:8].[H][O][Cl]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([OH])[C:8][Cl]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]=[C]","[H][O][Cl]"],
    condition: "与次氯酸的加成"
  },
  "benzene_gen_106": {
    category: "benzene",
    name: "硝基活化",
    difficulty: 2,
    smarts: "[s]1[c:1][c:2]([N+](=O)[O-])[c:3][c:4]1.[Nu:5]>>[s]1[c:1]([Nu:5])[c:2]([N+](=O)[O-])[c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c]([N+](=O)[O-])[c][c]1","[Nu]"],
    condition: "硝基活化"
  },
  "benzene_gen_107": {
    category: "benzene",
    name: "硝基活化",
    difficulty: 2,
    smarts: "[s]1[c:1]([N+](=O)[O-])[c:2][c:3][c:4]1.[Nu:5]>>[s]1[c:1]([N+](=O)[O-])[c:2]([Nu:5])[c:3][c:4]1",
    source: ["benzenes"],
    search_smarts: ["[s]1[c]([N+](=O)[O-])[c][c][c]1","[Nu]"],
    condition: "硝基活化"
  },
  "benzene_gen_108": {
    category: "benzene",
    name: "在重铬酸钾等强氧化剂的氧化下",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7][C:8]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7](=O)O",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C][C]"],
    condition: "在重铬酸钾等强氧化剂的氧化下"
  },
  "benzene_gen_109": {
    category: "benzene",
    name: "用K2Cr2O7 ; H2SO4作氧化剂生成对苯醌",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O]>>[C:1]1=[C:2][C:3](=[O])[C:4]=[C:5][C:6]1=[O]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]"],
    condition: "用K2Cr2O7 ; H2SO4作氧化剂生成对苯醌"
  },
  "benzene_gen_110": {
    category: "benzene",
    name: "Ag2O ; 无水乙醚",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4]([O])[c:5][c:6]1[O]>>[C:1]1=[C:2][C:3]=[C:4][C:5](=[O])[C:6]1=[O]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]([O])[c][c]1[O]"],
    condition: "Ag2O ; 无水乙醚"
  },
  "benzene_gen_111": {
    category: "benzene",
    name: "Na2Cr2O7 ; H2SO4,94%",
    difficulty: 2,
    smarts: "[c:1]1[c:2][O][c:3][c:4][c:5][c:6]1[O]>>[C:1]1=[C:2][C:3](=[O])[C:4]=[C:5][C:6]1=[O]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][O][c][c][c][c]1[O]"],
    condition: "Na2Cr2O7 ; H2SO4,94%"
  },
  "benzene_gen_112": {
    category: "benzene",
    name: "呋喃氧化生成顺丁烯二酸酐",
    difficulty: 2,
    smarts: "[o]1[c:1][c:2][c:3][c:4]1>>[O]1[C:1](=O)[C:2]=[C:3][C:4]1(=O)",
    source: ["benzenes"],
    search_smarts: ["[o]1[c][c][c][c]1"],
    condition: "呋喃氧化生成顺丁烯二酸酐"
  },
  "benzene_gen_113": {
    category: "benzene",
    name: "噻吩氧化为亚砜（形式电核表示法）",
    difficulty: 2,
    smarts: "[s]1[c:1][c:2][c:3][c:4]1.[O:5]>>[S+]([O-:5])1[C:1][C:2][C:3][C:4]1",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c][c][c]1","[O]"],
    condition: "噻吩氧化为亚砜（形式电核表示法）"
  },
  "benzene_gen_114": {
    category: "benzene",
    name: "噻吩氧化为砜（形式电核表示法）",
    difficulty: 3,
    smarts: "[s]1[c:1][c:2][c:3][c:4]1.[O:5].[O:6]>>[S+2]([O-:5])([O-:6])1[C:1][C:2][C:3][C:4]1",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c][c][c]1","[O]"],
    condition: "噻吩氧化为砜（形式电核表示法）"
  },
  "benzene_gen_115": {
    category: "benzene",
    name: "生成",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O].[Na+].[OH-]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[O][Na+].[O]",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c][c][c]1[O]","[Na+]","[OH-]"],
    condition: "生成"
  },
  "benzene_gen_116": {
    category: "benzene",
    name: "CrO3,CH3COOH,25℃",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[c:10]1>>[C:1]1[C:2][C:3](=O)[c:4]2[c:5][c:6]1[c:7][c:8][c:9]2[C:10]1(=O)",
    source: ["benzenes"],
    search_smarts: ["[c]1[c][c][c]2[c][c]1[c][c][c]2[c]1"],
    condition: "CrO3,CH3COOH,25℃"
  },
  "benzene_gen_117": {
    category: "benzene",
    name: "吡咯的酸性",
    difficulty: 2,
    smarts: "[nH]1[c:1][c:2][c:3][c:4]1.[K+].[OH-]>>[n-]1([K+])[c:1][c:2][c:3][c:4]1.[O]",
    source: ["benzenes"],
    search_smarts: ["[nH]1[c][c][c][c]1","[K+]","[OH-]"],
    condition: "吡咯的酸性"
  },
  "benzene_gen_118": {
    category: "benzene",
    name: "Suzuki偶联,溴噻吩和苯硼酸反应",
    difficulty: 3,
    smarts: "[s]1[c:1][c:2][c:3][c:4](Br)1.[B]([c:5]1[c:6][c:7][c:8][c:9][c:10]1)(O)(O)>>[s]1[c:1][c:2][c:3][c:4]([c:5]1[c:6][c:7][c:8][c:9][c:10]1)1",
    source: ["benzenes"],
    search_smarts: ["[s]1[c][c][c][c](Br)1","[B]([c]1[c][c][c][c][c]1)(O)(O)"],
    condition: "Suzuki偶联,溴噻吩和苯硼酸反应"
  },
  "carbonyl_gen_25": {
    category: "carbonyl",
    name: "醛与氢氰酸的加成",
    difficulty: 2,
    smarts: "[C:1](=O)[H].[C:2]#[N:3]>>[C:1]([OH])[C:2]([N:3])",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)[H]","[C]#[N]"],
    condition: "醛与氢氰酸的加成"
  },
  "carbonyl_gen_26": {
    category: "carbonyl",
    name: "酮与氢氰酸的加成",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[C:3].[C:4]#[N:5]>>[C:1][C:2]([OH])([C:4][N:5])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[C]#[N]"],
    condition: "酮与氢氰酸的加成"
  },
  "carbonyl_gen_27": {
    category: "carbonyl",
    name: "醛与格氏试剂加成,无水醚",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[H].[C:3][Mg]([X])>>[C:1][C:2]([O][Mg]([X]))[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[H]","[C][Mg]([X])"],
    condition: "醛与格氏试剂加成,无水醚"
  },
  "carbonyl_gen_28": {
    category: "carbonyl",
    name: "醛与格氏试剂加成,H2O",
    difficulty: 3,
    smarts: "[C:1][C:2]([O][Mg]([X]))[C:3]>>[C:1][C:2]([OH])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([O][Mg]([X]))[C]"],
    condition: "醛与格氏试剂加成,H2O"
  },
  "carbonyl_gen_29": {
    category: "carbonyl",
    name: "酮与格氏试剂加成,无水醚",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[C:4][Mg]([X])>>[C:1][C:2]([O][Mg]([X]))([C:4])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[C][Mg]([X])"],
    condition: "酮与格氏试剂加成,无水醚"
  },
  "carbonyl_gen_30": {
    category: "carbonyl",
    name: "酮与格氏试剂加成,H2O",
    difficulty: 3,
    smarts: "[C:1][C:2]([O][Mg]([X]))([C:4])[C:3]>>[C:1][C:2]([OH])([C:4])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([O][Mg]([X]))([C])[C]"],
    condition: "酮与格氏试剂加成,H2O"
  },
  "carbonyl_gen_31": {
    category: "carbonyl",
    name: "醛与有机锂试剂加成,无水醚",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[H].[C:3][Li]>>[C:1][C:2]([O][Li])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[H]","[C][Li]"],
    condition: "醛与有机锂试剂加成,无水醚"
  },
  "carbonyl_gen_32": {
    category: "carbonyl",
    name: "醛与有机锂试剂加成, H2O",
    difficulty: 3,
    smarts: "[C:1][C:2]([O][Li])[C:3]>>[C:1][C:2]([OH])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([O][Li])[C]"],
    condition: "醛与有机锂试剂加成, H2O"
  },
  "carbonyl_gen_33": {
    category: "carbonyl",
    name: "酮与有机锂试剂加成,无水醚",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[C:4][Li]>>[C:1][C:2]([O][Li])([C:4])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[C][Li]"],
    condition: "酮与有机锂试剂加成,无水醚"
  },
  "carbonyl_gen_34": {
    category: "carbonyl",
    name: "酮与有机锂试剂加成,H2O",
    difficulty: 3,
    smarts: "[C:1][C:2]([O][Li])([C:4])[C:3]>>[C:1][C:2]([OH])([C:4])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([O][Li])([C])[C]"],
    condition: "酮与有机锂试剂加成,H2O"
  },
  "carbonyl_gen_35": {
    category: "carbonyl",
    name: "碱性条件下",
    difficulty: 2,
    smarts: "[C:1](=O)[C:2].[Na+][C-:3]#[C:4]>>[C:1]([O-][Na+])([C:2])[C:3]#[C:4]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)[C]","[Na+][C-]#[C]"],
    condition: "碱性条件下"
  },
  "carbonyl_gen_36": {
    category: "carbonyl",
    name: "水解反应",
    difficulty: 1,
    smarts: "[C:1]([O-][Na+])([C:2])[C:3]#[C:4].[O]>>[C:1]([OH])([C:2])[C:3]#[C:4].[Na+][OH-]",
    source: ["carbonyls"],
    search_smarts: ["[C]([O-][Na+])([C])[C]#[C]","[O]"],
    condition: "水解反应"
  },
  "carbonyl_gen_37": {
    category: "carbonyl",
    name: "碱性条件下",
    difficulty: 3,
    smarts: "[C:1]1[C:2][C:3][C:4][C:5](=O)[C:6]1.[Na+][C-:7]#[C:8]>>[C:1]1[C:2][C:3][C:4][C:5]([O-][Na+])([C:7]#[C:8])[C:6]1",
    source: ["carbonyls"],
    search_smarts: ["[C]1[C][C][C][C](=O)[C]1","[Na+][C-]#[C]"],
    condition: "碱性条件下"
  },
  "carbonyl_gen_38": {
    category: "carbonyl",
    name: "carbonyl 反应 38",
    difficulty: 3,
    smarts: "[C:1]1[C:2][C:3][C:4][C:5]([O-][Na+])([C:7]#[C:8])[C:6]1.[O]>>[C:1]1[C:2][C:3][C:4][C:5]([OH])([C:7]#[C:8])[C:6]1.[Na+][OH-]#水解",
    source: ["carbonyls"],
    search_smarts: ["[C]1[C][C][C][C]([O-][Na+])([C]#[C])[C]1","[O]"],
    condition: "carbonyl 反应 38"
  },
  "carbonyl_gen_39": {
    category: "carbonyl",
    name: "醛与一级胺反应H+第一步",
    difficulty: 2,
    smarts: "[C:1](=O)[H].[C:2][NH2]>>[C:1]([OH2])[NH1][C:2]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)[H]","[C][NH2]"],
    condition: "醛与一级胺反应H+第一步"
  },
  "carbonyl_gen_40": {
    category: "carbonyl",
    name: "醛与一级胺反应第二步（消除）",
    difficulty: 2,
    smarts: "[C:1]([OH2])[NH1][C:2]>>[C:1]=[N][C:2].[O]",
    source: ["carbonyls"],
    search_smarts: ["[C]([OH2])[NH1][C]"],
    condition: "醛与一级胺反应第二步（消除）"
  },
  "carbonyl_gen_41": {
    category: "carbonyl",
    name: "酮与二级胺反应第一步",
    difficulty: 2,
    smarts: "[C:1](=[O:2])[C:3].[NH1:4]>>[C:1](-[OH2:2])([C:3])-[N:4]",
    source: ["carbonyls"],
    search_smarts: ["[C](=[O])[C]","[NH1]"],
    condition: "酮与二级胺反应第一步"
  },
  "carbonyl_gen_42": {
    category: "carbonyl",
    name: "酮与二级胺反应第二步（消除）",
    difficulty: 2,
    smarts: "[C:1](-[OH2:2])([C:3])-[N:4]>>[C:3]=[C:1]-[N:4].[O:2]",
    source: ["carbonyls"],
    search_smarts: ["[C](-[OH2])([C])-[N]"],
    condition: "酮与二级胺反应第二步（消除）"
  },
  "carbonyl_gen_43": {
    category: "carbonyl",
    name: "与胺的衍生物（羟胺）加成后失水",
    difficulty: 2,
    smarts: "[C:1](=O).[NH2:2]-[OH]>>[C:1]=[N:2]-[OH]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)","[NH2]-[OH]"],
    condition: "与胺的衍生物（羟胺）加成后失水"
  },
  "carbonyl_gen_44": {
    category: "carbonyl",
    name: "酸性条件下生成醛水合物",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[H].[O]>>[C:1][C:2]([OH])([OH])[H]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[H]","[O]"],
    condition: "酸性条件下生成醛水合物"
  },
  "carbonyl_gen_45": {
    category: "carbonyl",
    name: "酸性条件下生成酮水合物",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[C:3].[O]>>[C:1][C:2]([OH])([OH])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[O]"],
    condition: "酸性条件下生成酮水合物"
  },
  "carbonyl_gen_46": {
    category: "carbonyl",
    name: "H+,半缩醛/酮",
    difficulty: 2,
    smarts: "[C:1](=O).[C:2][O:3][H]>>[C:1]([O:3][C:2])[OH]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)","[C][O][H]"],
    condition: "H+,半缩醛/酮"
  },
  "carbonyl_gen_47": {
    category: "carbonyl",
    name: "H+,缩醛/酮",
    difficulty: 2,
    smarts: "[C:1]([O:3][C:2])[OH].[C:4][O:5][H]>>[C:1]([O:3][C:2])[O:5][C:4].[O]",
    source: ["carbonyls"],
    search_smarts: ["[C]([O][C])[OH]","[C][O][H]"],
    condition: "H+,缩醛/酮"
  },
  "carbonyl_gen_48": {
    category: "carbonyl",
    name: "与亚硫酸氢钠加成",
    difficulty: 2,
    smarts: "[C:1][C:2]=[O:3].[Na+][O-][S](=O)O>>[C:1][C:2]([OH:3])[S]([O-])(=O)O[Na+]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]=[O]","[Na+][O-][S](=O)O"],
    condition: "与亚硫酸氢钠加成"
  },
  "carbonyl_gen_49": {
    category: "carbonyl",
    name: "与亚硫酸氢钠加成",
    difficulty: 2,
    smarts: "[C:1](=O).[S](=O)(=O)[O-]>>[C:1]([OH])([S](=O)(=O)[O-])",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)","[S](=O)(=O)[O-]"],
    condition: "与亚硫酸氢钠加成"
  },
  "carbonyl_gen_50": {
    category: "carbonyl",
    name: "与硫醇（RSH）的加成生成半缩硫醛/酮",
    difficulty: 2,
    smarts: "[C:1][C:2](=O).[S:3][H]>>[C:1][C:2]([OH])([S:3])",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)","[S][H]"],
    condition: "与硫醇（RSH）的加成生成半缩硫醛/酮"
  },
  "carbonyl_gen_51": {
    category: "carbonyl",
    name: "缩合脱水（形成缩硫醛/酮）",
    difficulty: 2,
    smarts: "[C:1][C:2]([OH])[S:3].[S:4][H]>>[C:1][C:2]([S:3])([S:4]).[O]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([OH])[S]","[S][H]"],
    condition: "缩合脱水（形成缩硫醛/酮）"
  },
  "carbonyl_gen_52": {
    category: "carbonyl",
    name: "与卤素加成",
    difficulty: 2,
    smarts: "[C:1][C:2]=[C:3][C:4](=O)[C:5].[Br][Br]>>[C:1][C:2]([Br])[C:3]([Br])[C:4](=O)[C:5]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]=[C][C](=O)[C]","BrBr"],
    condition: "与卤素加成"
  },
  "carbonyl_gen_53": {
    category: "carbonyl",
    name: "与次卤酸加成",
    difficulty: 2,
    smarts: "[C:1][C:2]=[C:3][C:4](=O)[C:5].[H][O][Br]>>[C:1][C:2]([OH])[C:3]([Br])[C:4](=O)[C:5]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]=[C][C](=O)[C]","[H][O][Br]"],
    condition: "与次卤酸加成"
  },
  "carbonyl_gen_54": {
    category: "carbonyl",
    name: "与卤化氢加成,1-4共轭加成",
    difficulty: 3,
    smarts: "[C:1][C:2]=[C:3][C:4](=O)[C:5].[H][Cl]>>[C:1][C:2]([Cl])[C:3]=[C:4]([OH])[C:5]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]=[C][C](=O)[C]","Cl"],
    condition: "与卤化氢加成,1-4共轭加成"
  },
  "carbonyl_gen_55": {
    category: "carbonyl",
    name: "互变异构,烯醇不稳定",
    difficulty: 3,
    smarts: "[C:1][C:2]([Cl])[C:3]=[C:4]([OH])[C:5]>>[C:1][C:2]([Cl])[C:3][C:4](=O)[C:5]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([Cl])[C]=[C]([OH])[C]"],
    condition: "互变异构,烯醇不稳定"
  },
  "carbonyl_gen_56": {
    category: "carbonyl",
    name: "与胺加成,1-4共轭加成",
    difficulty: 3,
    smarts: "[C:1][C:2]=[C:3][C:4](=O)[C:5].[C:6][NH2]>>[C:1][C:2]([NH][C:6])[C:3]=[C:4]([OH])[C:5]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]=[C][C](=O)[C]","[C][NH2]"],
    condition: "与胺加成,1-4共轭加成"
  },
  "carbonyl_gen_57": {
    category: "carbonyl",
    name: "互变异构,烯醇不稳定",
    difficulty: 3,
    smarts: "[C:1][C:2]([NH][C:6])[C:3]=[C:4]([OH])[C:5]>>[C:1][C:2]([NH][C:6])[C:3][C:4](=O)[C:5]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([NH][C])[C]=[C]([OH])[C]"],
    condition: "互变异构,烯醇不稳定"
  },
  "carbonyl_gen_58": {
    category: "carbonyl",
    name: "carbonyl 反应 58",
    difficulty: 3,
    smarts: "[C:1](=O)([H])[C:2]=[C:3]([c:4]1[c:5][c:6][c:7][c:8][c:9]1).[Br][Mg]([c:10]1[c:11][c:12][c:13][c:14][c:15]1)>>",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)([H])[C]=[C]([c]1[c][c][c][c][c]1)","[Br][Mg]([c]1[c][c][c][c][c]1)"],
    condition: "carbonyl 反应 58"
  },
  "carbonyl_gen_59": {
    category: "carbonyl",
    name: "carbonyl 反应 59",
    difficulty: 3,
    smarts: "[C:1](=O)([H])[C:2]=[C:3]([c:4]1[c:5][c:6][c:7][c:8][c:9]1).[C:10][C:11][Mg][Br]>>",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)([H])[C]=[C]([c]1[c][c][c][c][c]1)","[C][C][Mg][Br]"],
    condition: "carbonyl 反应 59"
  },
  "carbonyl_gen_60": {
    category: "carbonyl",
    name: "carbonyl 反应 60",
    difficulty: 3,
    smarts: "[C:1]([c:5]1[c:6][c:7][c:8][c:9][c:10]1)=[C:2][C:3](=O)[C:4].[Br][Mg]([c:11]1[c:12][c:13][c:14][c:15][c:16]1)>>",
    source: ["carbonyls"],
    search_smarts: ["[C]([c]1[c][c][c][c][c]1)=[C][C](=O)[C]","[Br][Mg]([c]1[c][c][c][c][c]1)"],
    condition: "carbonyl 反应 60"
  },
  "carbonyl_gen_61": {
    category: "carbonyl",
    name: "carbonyl 反应 61",
    difficulty: 3,
    smarts: "[C:1]([c:5]1[c:6][c:7][c:8][c:9][c:10]1)=[C:2][C:3](=O)[C:4].[C:11][C:12][Mg][Br]>>",
    source: ["carbonyls"],
    search_smarts: ["[C]([c]1[c][c][c][c][c]1)=[C][C](=O)[C]","[C][C][Mg][Br]"],
    condition: "carbonyl 反应 61"
  },
  "carbonyl_gen_62": {
    category: "carbonyl",
    name: "在H+/OH-作用下发生烯醇化反应",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3]>>[C:1][C:2]([OH])=[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]"],
    condition: "在H+/OH-作用下发生烯醇化反应"
  },
  "carbonyl_gen_63": {
    category: "carbonyl",
    name: "热力学控制的产物",
    difficulty: 2,
    smarts: "[C:1][C:2][C:3](=O)[C:4]>>[C:1][C:2]=[C:3]([OH])[C:4]",
    source: ["carbonyls"],
    search_smarts: ["[C][C][C](=O)[C]"],
    condition: "热力学控制的产物"
  },
  "carbonyl_gen_64": {
    category: "carbonyl",
    name: "动力学控制的产物",
    difficulty: 2,
    smarts: "[C:1][C:2][C:3](=O)[C:4]>>[C:1][C:2][C:3]([OH])=[C:4]",
    source: ["carbonyls"],
    search_smarts: ["[C][C][C](=O)[C]"],
    condition: "动力学控制的产物"
  },
  "carbonyl_gen_65": {
    category: "carbonyl",
    name: "在H+/OH-催化作用下",
    difficulty: 2,
    smarts: "[C:1](=O)[C:2].[Br][Br]>>[C:1](=O)[C:2][Br].[Br]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)[C]","BrBr"],
    condition: "在H+/OH-催化作用下"
  },
  "carbonyl_gen_66": {
    category: "carbonyl",
    name: "卤仿反应",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[OH-].[Cl][Cl]>>[C:1][C:2](=O)[O-].[C:3]([H])([Cl])([Cl])[Cl]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[OH-]","ClCl"],
    condition: "卤仿反应"
  },
  "carbonyl_gen_67": {
    category: "carbonyl",
    name: "卤仿反应",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[OH-].[Br][Br]>>[C:1][C:2](=O)[O-].[C:3]([H])([Br])([Br])[Br]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[OH-]","BrBr"],
    condition: "卤仿反应"
  },
  "carbonyl_gen_68": {
    category: "carbonyl",
    name: "卤仿反应",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[OH-].[I][I]>>[C:1][C:2](=O)[O-].[C:3]([H])([I])([I])[I]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[OH-]","II"],
    condition: "卤仿反应"
  },
  "carbonyl_gen_69": {
    category: "carbonyl",
    name: "H+/OH-",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[H].[C:3][C:4](=O)[H]>>[C:1][C:2]([OH])[C:3][C:4](=O)[H]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[H]"],
    condition: "H+/OH-"
  },
  "carbonyl_gen_70": {
    category: "carbonyl",
    name: "H+/OH-",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[C:4][C:5](=O)[C:6]>>[C:1][C:2]([OH])([C:3])[C:4][C:5](=O)[C:6]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]"],
    condition: "H+/OH-"
  },
  "carbonyl_gen_71": {
    category: "carbonyl",
    name: "OH-",
    difficulty: 3,
    smarts: "[C:1][C:2][C:3][C:4][C:5][C:6][C:7](=O)[H].[C:8][C:9](=O)[C:10]>>[C:1][C:2][C:3][C:4][C:5][C:6][C:7]([OH])[C:8][C:9](=O)[C:10]",
    source: ["carbonyls"],
    search_smarts: ["[C][C][C][C][C][C][C](=O)[H]","[C][C](=O)[C]"],
    condition: "OH-"
  },
  "carbonyl_gen_72": {
    category: "carbonyl",
    name: "-H2O",
    difficulty: 2,
    smarts: "[C:1][C:2][C:3][C:4][C:5][C:6][C:7]([OH])[C:8][C:9](=O)[C:10]>>[C:1][C:2][C:3][C:4][C:5][C:6]/[C:7]=[C:8]/[C:9](=O)[C:10]",
    source: ["carbonyls"],
    search_smarts: ["[C][C][C][C][C][C][C]([OH])[C][C](=O)[C]"],
    condition: "-H2O"
  },
  "carbonyl_gen_73": {
    category: "carbonyl",
    name: "Beckmann重排, H+",
    difficulty: 3,
    smarts: "[C:1]([C:2])([C:3])=[N:4][OH]>>[C:2][C:1](=O)[N:4][H][C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C]([C])([C])=[N][OH]"],
    condition: "Beckmann重排, H+"
  },
  "carbonyl_gen_74": {
    category: "carbonyl",
    name: "Favorski重排",
    difficulty: 3,
    smarts: "[C:1][C:2]([Br])[C:3](=O)[C:4].[OH-]>>[C:1][C:2]([C:4])[C:3](=O)[OH].[Br-]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([Br])[C](=O)[C]","[OH-]"],
    condition: "Favorski重排"
  },
  "carbonyl_gen_75": {
    category: "carbonyl",
    name: "Favorski重排",
    difficulty: 3,
    smarts: "[C:1][C:2]([Cl])[C:3](=O)[C:4].[OH-]>>[C:1][C:2]([C:4])[C:3](=O)[OH].[Cl-]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]([Cl])[C](=O)[C]","[OH-]"],
    condition: "Favorski重排"
  },
  "carbonyl_gen_76": {
    category: "carbonyl",
    name: "CH3COOEt,40℃,Baeyer-Villiger氧化重排",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[C:4][C:5](=O)[O][OH]>>[C:1][C:2](=O)[O][C:3].[C:4][C:5](=O)[OH]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[C][C](=O)[O][OH]"],
    condition: "CH3COOEt,40℃,Baeyer-Villiger氧化重排"
  },
  "carbonyl_gen_77": {
    category: "carbonyl",
    name: "Et2O,加热",
    difficulty: 3,
    smarts: "[C:1](=O)1[C:2]([Br])[C:3][C:4][C:5][C:6]1.[C:7][C:8][O-]>>[C:2]([C:1](=O)[O][C:8][C:7])1[C:3][C:4][C:5][C:6]1.[Br-]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)1[C]([Br])[C][C][C][C]1","[C][C][O-]"],
    condition: "Et2O,加热"
  },
  "carbonyl_gen_78": {
    category: "carbonyl",
    name: "carbonyl 反应 78",
    difficulty: 2,
    smarts: "[C:1](=O)([c:3]1[c:4][c:5][c:6][c:7][c:8]1)[C:2](=O)([c:9]1[c:10][c:11][c:12][c:13][c:14]1)>>",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)([c]1[c][c][c][c][c]1)[C](=O)([c]1[c][c][c][c][c]1)"],
    condition: "carbonyl 反应 78"
  },
  "carbonyl_gen_79": {
    category: "carbonyl",
    name: "KMnO4, H2SO4 醛的氧化",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[H]>>[C:1][C:2](=O)[OH]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[H]"],
    condition: "KMnO4, H2SO4 醛的氧化"
  },
  "carbonyl_gen_80": {
    category: "carbonyl",
    name: "酮的氧化",
    difficulty: 2,
    smarts: "[C:1][C:2][C:3](=O)[C:4][C:5]>>[C:5][C:4](=O)[OH].[C:1][C:2][C:3](=O)[OH]",
    source: ["carbonyls"],
    search_smarts: ["[C][C][C](=O)[C][C]"],
    condition: "酮的氧化"
  },
  "carbonyl_gen_81": {
    category: "carbonyl",
    name: "生成己二酸",
    difficulty: 2,
    smarts: "[C:1](=O)1[C:2][C:3][C:4][C:5][C:6]1>>[C:2](=O)[OH][C:3][C:4][C:5][C:6][C:1](=O)[OH]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)1[C][C][C][C][C]1"],
    condition: "生成己二酸"
  },
  "carbonyl_gen_82": {
    category: "carbonyl",
    name: "Clemmensen还原法,Zn-Hg ,HCl,加热",
    difficulty: 2,
    smarts: "[C:1](=O)>>[CH2:1]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)"],
    condition: "Clemmensen还原法,Zn-Hg ,HCl,加热"
  },
  "carbonyl_gen_83": {
    category: "carbonyl",
    name: "Wolff-Kishner-Huang Minlon还原法, NH2NH2,KOH,(HOCH2CH2)2O,180℃",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[C:3]>>[C:1][C:2][C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]"],
    condition: "Wolff-Kishner-Huang Minlon还原法, NH2NH2,KOH,(HOCH2CH2)2O,180℃"
  },
  "carbonyl_gen_84": {
    category: "carbonyl",
    name: "H+,缩硫酮氢解法第一步",
    difficulty: 2,
    smarts: "[C:1](=O).[C:2]([SH])[C:3]([SH])>>[C:1]1[S][C:2][C:3][S]",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)","[C]([SH])[C]([SH])"],
    condition: "H+,缩硫酮氢解法第一步"
  },
  "carbonyl_gen_85": {
    category: "carbonyl",
    name: "H2,Ni, 缩硫酮氢解法第二步",
    difficulty: 2,
    smarts: "[C:1]1[S][C:2][C:3][S]>>[CH2:1]",
    source: ["carbonyls"],
    search_smarts: ["[C]1[S][C][C][S]"],
    condition: "H2,Ni, 缩硫酮氢解法第二步"
  },
  "carbonyl_gen_86": {
    category: "carbonyl",
    name: "Pt,0.3MPa,25℃",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[H].[H][H]>>[C:1][C:2][OH]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[H]","[H][H]"],
    condition: "Pt,0.3MPa,25℃"
  },
  "carbonyl_gen_87": {
    category: "carbonyl",
    name: "Pt,0.3MPa,25℃",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[C:3].[H][H]>>[C:1][C:2]([OH])[C:3]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[H][H]"],
    condition: "Pt,0.3MPa,25℃"
  },
  "carbonyl_gen_88": {
    category: "carbonyl",
    name: "carbonyl 反应 88",
    difficulty: 3,
    smarts: "[C:1](=O)1[C:2]=[C:3]([C:7])[C:4][C:5][C:6]1.[H][H]>>[C:1](=O)1[C:2][C:3]([C:7])[C:4][C:5][C:6]1",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)1[C]=[C]([C])[C][C][C]1","[H][H]"],
    condition: "carbonyl 反应 88"
  },
  "carbonyl_gen_89": {
    category: "carbonyl",
    name: "carbonyl 反应 89",
    difficulty: 3,
    smarts: "[C:1](=O)1[C:2]=[C:3]([C:7])[C:4][C:5][C:6]1.[H][H][H][H]>>[C:1]([OH])1[C:2][C:3]([C:7])[C:4][C:5][C:6]1",
    source: ["carbonyls"],
    search_smarts: ["[C](=O)1[C]=[C]([C])[C][C][C]1","[H][H][H][H]"],
    condition: "carbonyl 反应 89"
  },
  "carbonyl_gen_90": {
    category: "carbonyl",
    name: "LiAlH4,H2O,加热",
    difficulty: 2,
    smarts: "[C:1][C:2]=[C:3][C:4][C:5][C:6](=O)[H]>>[C:1][C:2]=[C:3][C:4][C:5][C:6][OH]",
    source: ["carbonyls"],
    search_smarts: ["[C][C]=[C][C][C][C](=O)[H]"],
    condition: "LiAlH4,H2O,加热"
  },
  "carbonyl_gen_91": {
    category: "carbonyl",
    name: "异丙醇铝,H2O,Meerwein-Ponndorf反应",
    difficulty: 3,
    smarts: "[C:1][C:2](=O)[C:3].[C:4]([C:5])([C:6])([O-])[H]>>[C:1][C:2]([OH])([H])[C:3].[C:5][C:4](=O)[C:6]",
    source: ["carbonyls"],
    search_smarts: ["[C][C](=O)[C]","[C]([C])([C])([O-])[H]"],
    condition: "异丙醇铝,H2O,Meerwein-Ponndorf反应"
  },
  "acid_gen_1": {
    category: "acid",
    name: "PBr3,70℃",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[OH].[Br][Br]>>[C:1]([Br])[C:2](=O)[OH].[Br]",
    source: ["acids"],
    search_smarts: ["[C][C](=O)[OH]","BrBr"],
    condition: "PBr3,70℃"
  },
  "acid_gen_2": {
    category: "acid",
    name: "I2催化",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[OH].[Cl][Cl]>>[C:1]([Cl])[C:2](=O)[OH].[Cl]",
    source: ["acids"],
    search_smarts: ["[C][C](=O)[OH]","ClCl"],
    condition: "I2催化"
  },
  "acid_gen_3": {
    category: "acid",
    name: "H+",
    difficulty: 2,
    smarts: "[C:1][O:2].[C:3](=[O:4])[O:5]>>[C:3](=[O:4])[O:2][C:1].[O:5]",
    source: ["acids"],
    search_smarts: ["[C][O]","[C](=[O])[O]"],
    condition: "H+"
  },
  "acid_gen_4": {
    category: "acid",
    name: "加热,分子间",
    difficulty: 3,
    smarts: "[C:1]([C:3])([OH])[C:2](=O)[OH].[C:4](=O)([OH])[C:5]([C:6])([OH])>>[C:1]([C:3])1[C:2](=O)[O][C:5]([C:6])[C:4](=O)[O]1",
    source: ["acids"],
    search_smarts: ["[C]([C])([OH])[C](=O)[OH]","[C](=O)([OH])[C]([C])([OH])"],
    condition: "加热,分子间"
  },
  "acid_gen_5": {
    category: "acid",
    name: "分子内酯化",
    difficulty: 1,
    smarts: "[C:1][C:2]([OH])[C:3][C:4][C:5](=O)[OH]>>[C:2]([C:1])1[C:3][C:4][C:5](=O)[O]1",
    source: ["acids"],
    search_smarts: ["[C][C]([OH])[C][C][C](=O)[OH]"],
    condition: "分子内酯化"
  },
  "acid_gen_6": {
    category: "acid",
    name: "acid 反应 6",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[OH].[C:3][NH2]>>[C:1][C:2](=O)[O][NH2][C:3]",
    source: ["acids"],
    search_smarts: ["[C][C](=O)[OH]","[C][NH2]"],
    condition: "acid 反应 6"
  },
  "acid_gen_7": {
    category: "acid",
    name: "acid 反应 7",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[OH].[NH3]>>[C:1][C:2](=O)[O][NH4]",
    source: ["acids"],
    search_smarts: ["[C][C](=O)[OH]","N"],
    condition: "acid 反应 7"
  },
  "acid_gen_8": {
    category: "acid",
    name: "100℃",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[O][NH4]>>[C:1][C:2](=O)[NH2].[O]",
    source: ["acids"],
    search_smarts: ["[C][C](=O)[O][NH4]"],
    condition: "100℃"
  },
  "acid_gen_9": {
    category: "acid",
    name: "acid 反应 9",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7](=O)[OH].[c:8]1[c:9][c:10][c:11][c:12][c:13]1[NH2]>>",
    source: ["acids"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C](=O)[OH]","[c]1[c][c][c][c][c]1[NH2]"],
    condition: "acid 反应 9"
  },
  "acid_gen_10": {
    category: "acid",
    name: "acid 反应 10",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7](=O)[OH].[S](=O)(Cl)(Cl)>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7](=O)(Cl).[S](=O)(=O).[Cl]",
    source: ["acids"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C](=O)[OH]","[S](=O)(Cl)(Cl)"],
    condition: "acid 反应 10"
  },
  "acid_gen_11": {
    category: "acid",
    name: "acid 反应 11",
    difficulty: 3,
    smarts: "[C:1][C:2][C:3][C:4](=O)[OH].[C:5][C:6][C:7][C:8](=O)[OH].[C:9][C:10][C:11][C:12](=O)[OH].[P](Cl)(Cl)(Cl)>>",
    source: ["acids"],
    search_smarts: ["[C][C][C][C](=O)[OH]","[P](Cl)(Cl)(Cl)"],
    condition: "acid 反应 11"
  },
  "acid_gen_12": {
    category: "acid",
    name: "acid 反应 12",
    difficulty: 2,
    smarts: "[C:1][C:2][C:3][C:4][C:5][C:6][C:7][C:8](=O)[OH].[P](Cl)(Cl)(Cl)(Cl)(Cl)>>",
    source: ["acids"],
    search_smarts: ["[C][C][C][C][C][C][C][C](=O)[OH]","[P](Cl)(Cl)(Cl)(Cl)(Cl)"],
    condition: "acid 反应 12"
  },
  "acid_gen_13": {
    category: "acid",
    name: "acid 反应 13",
    difficulty: 2,
    smarts: "[C:1][C:2](=O)[OH].[C:3][Mg][Br]>>[C:1][C:2](=O)[O][Mg][Br].[C:3]",
    source: ["acids"],
    search_smarts: ["[C][C](=O)[OH]","[C][Mg][Br]"],
    condition: "acid 反应 13"
  },
  "acid_gen_14": {
    category: "acid",
    name: "acid 反应 14",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7](=O)[OH].[C:8][Li]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7](=O)[O-][Li+]",
    source: ["acids"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C](=O)[OH]","[C][Li]"],
    condition: "acid 反应 14"
  },
  "acid_gen_15": {
    category: "acid",
    name: "acid 反应 15",
    difficulty: 3,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7](=O)[O-][Li+].[C:9][Li]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([O-][Li+])([O-][Li+])[C:9]",
    source: ["acids"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C](=O)[O-][Li+]","[C][Li]"],
    condition: "acid 反应 15"
  },
  "acid_gen_16": {
    category: "acid",
    name: "H2O",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7]([O-][Li+])([O-][Li+])[C:9]>>[c:1]1[c:2][c:3][c:4][c:5][c:6]1[C:7](=O)[C:9]",
    source: ["acids"],
    search_smarts: ["[c]1[c][c][c][c][c]1[C]([O-][Li+])([O-][Li+])[C]"],
    condition: "H2O"
  },
  "acid_gen_17": {
    category: "acid",
    name: "LiAlH4,H2O",
    difficulty: 2,
    smarts: "[C:1]=[C:2][C:3][C:4](=O)[OH]>>[C:1]=[C:2][C:3][C:4][OH]",
    source: ["acids"],
    search_smarts: ["[C]=[C][C][C](=O)[OH]"],
    condition: "LiAlH4,H2O"
  },
  "acid_gen_18": {
    category: "acid",
    name: "B2H6,H2O",
    difficulty: 2,
    smarts: "[c:1]1[c:2][c:3]([N+](=O)[O-])[c:4][c:5][c:6]1[C:7](=O)[OH]>>[c:1]1[c:2][c:3]([N+](=O)[O-])[c:4][c:5][c:6]1[C:7][OH]",
    source: ["acids"],
    search_smarts: ["[c]1[c][c]([N+](=O)[O-])[c][c][c]1[C](=O)[OH]"],
    condition: "B2H6,H2O"
  },
  "acid_gen_19": {
    category: "acid",
    name: "加热,碱",
    difficulty: 2,
    smarts: "[C:1][C:2][C:3](=O)[OH]>>[C:1][C:2].[C:3](=O)(=O)",
    source: ["acids"],
    search_smarts: ["[C][C][C](=O)[OH]"],
    condition: "加热,碱"
  },
  "acid_gen_20": {
    category: "acid",
    name: "-H+,H2O 负离子机理第一步",
    difficulty: 2,
    smarts: "[C:1](Cl)(Cl)(Cl)[C:2](=O)[OH]>>[C:1](Cl)(Cl)(Cl)[C:2](=O)[O-]",
    source: ["acids"],
    search_smarts: ["[C](Cl)(Cl)(Cl)[C](=O)[OH]"],
    condition: "-H+,H2O 负离子机理第一步"
  },
  "acid_gen_21": {
    category: "acid",
    name: "加热,H+,负离子机理第二步",
    difficulty: 2,
    smarts: "[C:1](Cl)(Cl)(Cl)[C:2](=O)[O-]>>[C:1](Cl)(Cl)(Cl).[C:2](=O)(=O)",
    source: ["acids"],
    search_smarts: ["[C](Cl)(Cl)(Cl)[C](=O)[O-]"],
    condition: "加热,H+,负离子机理第二步"
  },
  "acid_gen_22": {
    category: "acid",
    name: "acid 反应 22",
    difficulty: 2,
    smarts: "[C:1]([C:7])([C:8][C:9](=O)[O-][Ag+])1[C:2][C:3][C:4][C:5][C:6]1>>[C:1]([C:7])([C:8][Br])1[C:2][C:3][C:4][C:5][C:6]1",
    source: ["acids"],
    search_smarts: ["[C]([C])([C][C](=O)[O-][Ag+])1[C][C][C][C][C]1"],
    condition: "acid 反应 22"
  },
  "acid_gen_23": {
    category: "acid",
    name: "140-160℃",
    difficulty: 2,
    smarts: "[C:1](=O)([OH])[C:2][C:3](=O)[OH]>>[C:2][C:3](=O)[OH].[C:1](=O)(=O)",
    source: ["acids"],
    search_smarts: ["[C](=O)([OH])[C][C](=O)[OH]"],
    condition: "140-160℃"
  },
  "acid_gen_24": {
    category: "acid",
    name: "300℃",
    difficulty: 2,
    smarts: "[C:1](=O)([OH])[C:2][C:3][C:4](=O)[OH]>>[C:1](=O)1[C:2][C:3][C:4](=O)[O]1.[O]",
    source: ["acids"],
    search_smarts: ["[C](=O)([OH])[C][C][C](=O)[OH]"],
    condition: "300℃"
  },
  "acid_gen_25": {
    category: "acid",
    name: "300℃",
    difficulty: 2,
    smarts: "[C:1](=O)([OH])[C:2][C:3][C:4][C:5][C:6](=O)[OH]>>[C:1](=O)1[C:2][C:3][C:4][C:5]1.[C:6](=O)(=O).[O]",
    source: ["acids"],
    search_smarts: ["[C](=O)([OH])[C][C][C][C][C](=O)[OH]"],
    condition: "300℃"
  }
};

// 难度等级名称映射
window.DIFFICULTY_NAMES = {
  1: "简单",
  2: "中等",
  3: "高级"
};

// 根据难度等级获取反应列表
window.getReactionsByDifficulty = function(level) {
  const result = {};
  for (const key in window.REACTION_DB_EXTENDED) {
    const reaction = window.REACTION_DB_EXTENDED[key];
    if (reaction.difficulty === level) {
      result[key] = reaction;
    }
  }
  return result;
};

// 根据难度范围获取反应列表 (例如：level 1-2)
window.getReactionsByDifficultyRange = function(minLevel, maxLevel) {
  const result = {};
  for (const key in window.REACTION_DB_EXTENDED) {
    const reaction = window.REACTION_DB_EXTENDED[key];
    if (reaction.difficulty >= minLevel && reaction.difficulty <= maxLevel) {
      result[key] = reaction;
    }
  }
  return result;
};

window.CHEMICAL_CABINET_EXTENDED = {
  // 基础试剂
  reagents_br2: ["BrBr"],
  reagents_cl2: ["ClCl"],
  reagents_hbr: ["Br"],
  reagents_hcl: ["Cl"],
  reagents_hi: ["I"],
  reagents_i2: ["II"],
  reagents_h2o: ["O"],
  reagents_hoi: ["OI"],
  reagents_h2: ["[H][H]"],
  reagents_peracid: ["CC(=O)OO"],
  reagents_hno3: ["[O-][N+](=O)O"],

  // 烃类
  alkenes: [
    "C=C", "CC=C", "CC(=C)C", "C1=CCCCC1", "c1ccccc1C=C", "CC=CC", "C1=CCCC1"
  ],
  alkynes: [
    "C#C", "CC#C", "CC#CC", "c1ccccc1C#C", "CCC#C"
  ],
  alkynes_terminal: [
    "C#C", "CC#C", "c1ccccc1C#C", "CCC#C"
  ],

  // 醇类
  alcohols: ["CO", "CCO", "CCCO", "CC(O)C", "OCc1ccccc1", "C1CCCCC1O"],
  alcohols_primary: ["CO", "CCO", "CCCO", "OCc1ccccc1"],
  alcohols_secondary: ["CC(O)C", "C1CCCCC1O"],
  
  // 羧酸
  acids: ["CC(=O)O", "CCC(=O)O", "c1ccccc1C(=O)O"],

  // 卤代烃
  halides: ["CBr", "CCBr", "CCCCl", "CI", "BrCc1ccccc1", "CC(C)Cl"],
  halides_alkyl: ["CCl", "CCCl", "CCCCl", "CC(C)Cl"],
  halides_acyl: ["CC(=O)Cl", "CCC(=O)Cl", "c1ccccc1C(=O)Cl"],

  // 芳香族
  benzenes: ["c1ccccc1", "Cc1ccccc1", "COc1ccccc1", "Clc1ccccc1", "c1ccc(C)cc1"],

  // 羰基化合物
  carbonyls: ["CC=O", "CCC=O", "CC(=O)C", "c1ccccc1C=O", "c1ccccc1C(=O)C"],
  grignard_reagents: ["C[Mg]Cl", "CC[Mg]Cl", "c1ccccc1[Mg]Cl"],

  // 新增类别
  ethers: ["COC", "CCOCC", "COc1ccccc1"],
  thiols: ["CS", "CCS", "Sc1ccccc1"],
  cycloalkanes: ["C1CCCCC1", "C1CCCC1"],
  amines: ["CN", "CCN", "Nc1ccccc1"],
  esters: ["CC(=O)OC", "CC(=O)OCC"]
};
