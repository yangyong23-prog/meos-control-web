## ADDED Requirements

### Requirement: 水印显示功能
系统必须在业务内容区渲染全局水印，水印不响应用户交互。

#### Scenario: 水印默认不显示
- **GIVEN** 系统启动且 `window.__APP_CONFIG__.watermarkEnabled` 为 `undefined` 或 `false`
- **WHEN** 用户访问任意业务页面
- **THEN** 页面不应出现水印图案

#### Scenario: 水印启用后显示
- **GIVEN** `window.__APP_CONFIG__.watermarkEnabled` 为 `true`
- **WHEN** 用户访问业务内容区
- **THEN** 整个业务内容区覆盖水印图案

#### Scenario: 水印不阻挡交互
- **GIVEN** 水印处于显示状态
- **WHEN** 用户点击、滚动或选择文字
- **THEN** 所有交互事件正常透传到下层业务控件

#### Scenario: 运行时动态关闭水印
- **GIVEN** 水印处于显示状态
- **WHEN** `window.__APP_CONFIG__.watermarkEnabled` 变为 `false`
- **THEN** 水印图案立即消失，DOM 中无水印残留

#### Scenario: 运行时动态开启水印
- **GIVEN** 水印未显示
- **WHEN** `window.__APP_CONFIG__.watermarkEnabled` 变为 `true`
- **THEN** 水印图案立即出现

### Requirement: 水印文案可配
水印文案必须支持由外部传入并运行时切换。

#### Scenario: 默认文案为空
- **GIVEN** 未传入 `text` 参数
- **WHEN** 水印渲染
- **THEN** 使用当前用户名作为水印文案，格式为 `@${userName}`

#### Scenario: 运行时切换文案
- **GIVEN** 水印当前文案为 `@userA`
- **WHEN** 外部将文案改为 `@userB`
- **THEN** 水印图案更新为新文案，无需重新挂载组件

### Requirement: 水印显示规范
水印必须符合 PRD 定义的外观参数。

#### Scenario: 水印平铺排列
- **GIVEN** 水印处于显示状态
- **WHEN** 水印渲染完成
- **THEN** 水印以 300×200px 的 tile 平铺排列，tile 间距 12px，内边距 24px
- **AND** 水印颜色为 `var(--grey-900)` 或 `#1b2129`，透明度 15%
- **AND** 水印文字旋转 -45 度

### Requirement: composable 可复用
`useWatermark` 必须封装为纯逻辑 composable，不依赖特定组件结构。

#### Scenario: 独立导入 composable
- **GIVEN** 外部项目引入 `useWatermark`
- **WHEN** 调用时传入 `text` 和 `enabled`
- **THEN** composable 返回 `{ destroy, setText, setEnabled, isActive }` 等控制接口

#### Scenario: 自定义容器
- **GIVEN** 外部项目调用 `useWatermark`
- **WHEN** 传入自定义 `container` 元素
- **THEN** 水印覆盖层渲染在指定容器内而非默认的 `#app`
