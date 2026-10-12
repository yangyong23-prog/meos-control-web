---
name: meri-ui-color-guidelines
description: "Meri UI 颜色规范技能。适用于选择语义色、灰阶中性色、Figma 色值替换以及页面颜色实现对齐。"
---

# meri-ui-color-guidelines

用途:
- 统一颜色规范与色值使用，确保页面颜色与设计规范一致。

适用场景:
- 需要按规范选择颜色或替换设计稿色值。
- 需要在实现中优先使用语义色与灰阶中性色。
- 需要基于 Figma/MCP 进行最近色替换。

颜色使用规范:

基于 `default.less` 的变量整理，统一颜色命名与使用范围，优先使用语义变量，避免直接写色值。

1. 使用原则
- 语义优先: 能用语义色就不要直接使用色板色（如 `--primary-color` 优先于 `--blue-500`）。
- 中性色优先: 文本、边框、分割线、背景优先使用灰阶变量。
- 状态一致: 成功/危险/警示/禁用统一使用对应语义色。
- 可交互统一: hover、选中、表头、侧边栏等统一使用配置中的 UI 变量。

2. 基础色板（Palette，含色值）

蓝色 (Blue)
- `--blue-50`  #ebf6ff
- `--blue-100` #d9ebff
- `--blue-200` #9fc9fb
- `--blue-300` #64a6f7
- `--blue-400` #2481f2
- `--blue-500` #246fe5
- `--blue-600` #215dd9
- `--blue-700` #1b4acc
- `--blue-800` #1241bf
- `--blue-900` #1034b2

蓝绿色 (Turquoise)
- `--turquoise-50`  #e6fcf7
- `--turquoise-100` #cbf7f3
- `--turquoise-200` #a6ede8
- `--turquoise-300` #72e1de
- `--turquoise-400` #33d4d2
- `--turquoise-500` #14c4c4
- `--turquoise-600` #09b3b5
- `--turquoise-700` #00a2a7
- `--turquoise-800` #008e96
- `--turquoise-900` #00818c

绿色 (Green)
- `--green-50`  #ebffeb
- `--green-100` #daf7e1
- `--green-200` #b6e9c7
- `--green-300` #8edbab
- `--green-400` #69cd90
- `--green-500` #3fbe72
- `--green-600` #15ae55
- `--green-700` #0c9b4a
- `--green-800` #0f8843
- `--green-900` #13753f

黄色 (Yellow)
- `--yellow-50`  #fdffe6
- `--yellow-100` #fcf8b8
- `--yellow-200` #fcef7e
- `--yellow-300` #fbe750
- `--yellow-400` #fbdf23
- `--yellow-500` #f8d60c
- `--yellow-600` #f2cb0c
- `--yellow-700` #ecc00c
- `--yellow-800` #e6b507
- `--yellow-900` #e0a800

橙色 (Orange)
- `--orange-50`  #fffbe6
- `--orange-100` #fff0cc
- `--orange-200` #ffe399
- `--orange-300` #ffd873
- `--orange-400` #ffcc47
- `--orange-500` #ffb800
- `--orange-600` #f29f00
- `--orange-700` #e68600
- `--orange-800` #d96c00
- `--orange-900` #cc5300

青色 (Lime)
- `--lime-50`  #f1fce6
- `--lime-100` #e8f7bb
- `--lime-200` #dbed8f
- `--lime-300` #cce062
- `--lime-400` #bdd436
- `--lime-500` #aac41c
- `--lime-600` #95b315
- `--lime-700` #80a20e
- `--lime-800` #6a9107
- `--lime-900` #558000

红色 (Red)
- `--red-50`  #fff5f5
- `--red-100` #ffe6e5
- `--red-200` #fdc1be
- `--red-300` #fa9b96
- `--red-400` #f8766f
- `--red-500` #f55047
- `--red-600` #e63c35
- `--red-700` #d72824
- `--red-800` #c71412
- `--red-900` #b80000

胭脂红 (Carmine)
- `--carmine-50`  #fff2fd
- `--carmine-100` #f7e3f5
- `--carmine-200` #f1c5ee
- `--carmine-300` #e9a8e6
- `--carmine-400` #de8bdc
- `--carmine-500` #d069d2
- `--carmine-600` #be49c5
- `--carmine-700` #a928b7
- `--carmine-800` #910aa7
- `--carmine-900` #780094

紫色 (Purple)
- `--purple-50`  #fff2fd
- `--purple-100` #f7e3f5
- `--purple-200` #f1c5ee
- `--purple-300` #e9a8e6
- `--purple-400` #de8bdc
- `--purple-500` #d069d2
- `--purple-600` #be49c5
- `--purple-700` #a928b7
- `--purple-800` #910aa7
- `--purple-900` #780094

紫罗兰 (Violet)
- `--violet-50`  #fcf5ff
- `--violet-100` #f1e5fe
- `--violet-200` #e6d1ff
- `--violet-300` #d3b3ff
- `--violet-400` #b286f5
- `--violet-500` #9b6ced
- `--violet-600` #8252e3
- `--violet-700` #683bd6
- `--violet-800` #5124c4
- `--violet-900` #4016b5

灰色 (Gray)
- `--gray-0`   #ffffff
- `--gray-50`  #f7f9fa
- `--gray-100` #f2f4f6
- `--gray-200` #e8ecf0
- `--gray-300` #e1e5eb
- `--gray-400` #c4c9cf
- `--gray-500` #8b949e
- `--gray-600` #626c78
- `--gray-700` #424c59
- `--gray-800` #2e3742
- `--gray-900` #1b2129

透明色
- `--alpha-30` #C4C9CF4D

3. 语义色 (Semantic)

用于全局一致的状态与主色。

- 主色: `--primary-color`（= `--blue-500`）
- 成功: `--success-color`（= `--green-500`）
- 危险: `--danger-color`（= `--red-500`）
- 警示: `--warning-color`（= `--orange-500`）
- 禁用色: `--disable-color`（= `--gray-200`）
- 禁用标题: `--disable-title`（= `--gray-400`）
- 禁用背景: `--disable-bg-color`（= `--gray-200`）
- 禁用文字: `--disable-text-color`（= `--gray-400`）

4. 文本与中性色

文本层级与基础界面色统一使用灰阶。

- 标题/正文: `--title-color`（= `--gray-900`）
- 注释/弱化文字: `--notes-color`（= `--gray-600`）
- 辅助/描述文字: `--describe-color`（= `--gray-500`）
- 白色文字: `--title-white`（= `--gray-0`）
- 边框/输入框边框/按钮边框: `--border-color`（= `--gray-400`）
- 细分割线/表格描边: `--stroke-color`（= `--gray-300`）
- 页面分割线: `--divider-color`（= `--gray-200`）
- 页面背景: `--background-color`（= `--gray-50`）

5. 图标颜色

- 基本图标: `--icon-color`（= `--gray-500`）
- 图标文字: `--text-icon-color`（= `--gray-50`）
- 提示性图标: `--tip-icon-color`（= `--primary-color`）
- 警告性图标: `--warning-icon-color`（= `--warning-color`）
- 错误性图标: `--error-icon-color`（= `--danger-color`）
- 反色图标: `--reverse-icon-color`（= `--gray-0`）

6. 界面与组件常用元素

- 侧边栏背景: `--sidebar-bg-color`（= `--gray-50`）
- 表头底色: `--table-head-bg-color`（= `--gray-100`）
- 可交互 hover 背景: `--operation-hover-bg-color`（= `--gray-200`）
- 输入框/选择器/Tab/二级按钮边框/滚动条: `--border-color`（= `--gray-400`）
- 模块分割线/表格内容分割线/边框线: `--divider-bg-color`（= `--gray-300`）
- Checkbox/Radio 默认边框: `--radio-border-color`（= `--gray-500`）
- 弹窗 Mask 原色: `--modal-bg-color`（= `--gray-600`）
- Popover 背景: `--popover-bg-color`（rgba(27, 33, 41, 0.8)）
- Hover 透明度: `--opacity-hover`（0.8）

7. 使用建议（落地）

- 主按钮/高亮操作: `--primary-color`
- 成功/完成状态: `--success-color`
- 错误/危险状态: `--danger-color`
- 警示/提示状态: `--warning-color`
- 禁用态（按钮/文字/背景）: `--disable-bg-color` + `--disable-text-color`
- 常规文本: `--title-color`，说明文本: `--notes-color`/`--describe-color`
- 页面底色: `--background-color`，分割线: `--divider-color`

8. 注意事项
- 色值以变量为准，业务页面避免直接写十六进制色值。
- `default.less` 中黄/橙色存在重复定义，使用时以实际生效的变量为准。

9. Figma 色值替换规则（用于 MCP 生成页面）

当 Figma 设计稿中的颜色不是规范内的变量色值时，按以下规则替换为最接近的规范色：

1) 语义优先
- 明确语义（主色/成功/危险/警示/禁用）时，优先映射到 `--primary-color / --success-color / --danger-color / --warning-color / --disable-*`。

2) 中性色优先
- 文本/边框/分割线/背景等中性色场景，优先在灰阶 `--gray-*` 中找最近色。

3) 最近色匹配
- 其余场景在对应色相的色板里找最近色。
- 计算方式建议: 用 RGB 直接距离（ΔE 近似即可），取最小值。

4) 透明色处理
- 含 alpha 的色值先保留 alpha，再在不透明色板中找最近色；合成后如接近 `--alpha-30` 可直接使用。

5) 输出格式
- 优先输出语义变量名（如 `--primary-color`），其次输出色板变量名（如 `--blue-500`）。
