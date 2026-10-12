## Why

各项目/人员对不同场景下的信息安全有差异化需求，当前业务内容区缺少全局水印能力，无法在敏感页面追溯泄密来源。需提供一套轻量、可复用的水印方案，由上层 mid-frame 控制显隐。

## What Changes

- 新增 `src/hooks/useWatermark.ts` composable：Canvas 生成水印图案 → data URL → overlay div background-image
- 新增 `src/components/Watermark/index.vue` 组件：调用 composable 渲染水印层，供 App.vue 及外部项目复用
- 修改 `src/App.vue`：在 `<router-view />` 旁条件渲染 `<Watermark />`
- 修改 `src/types/global.d.ts`：扩展 `Window.__APP_CONFIG__` 类型声明
- 水印显隐由 `window.__APP_CONFIG__?.watermarkEnabled` 控制，默认关闭
- 水印文案支持后序可配

## Capabilities

### New Capabilities
- `global-watermark`: 全局水印覆盖层，Canvas 生成图案，pointer-events: none 穿透交互

### Modified Capabilities
- 无（新增功能，不修改现有 spec）

## Impact

- **影响范围**：仅根应用（`src/`），不影响 meoi-aim-rcrm-web、operation-duty-homepage、meos-daily-report-web
- **新增文件**：`src/hooks/useWatermark.ts`、`src/components/Watermark/index.vue`
- **修改文件**：`src/App.vue`、`src/types/global.d.ts`
- **无新增依赖**，纯 Canvas + Vue 3 原生实现
