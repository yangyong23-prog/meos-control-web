## Context

当前业务内容区（`#app`）没有任何水印覆盖能力。PRD 要求在水印在业务内容区始终覆盖，不影响交互，支持动态显隐控制，文案后续可配。项目为 Qiankun 微前端子应用，上层 mid-frame 通过 `window.__APP_CONFIG__` 注入全局配置。

## Goals / Non-Goals

**Goals:**
- 提供 Canvas 生成水印图案的核心逻辑（`useWatermark` composable）
- 提供可直接引入的 Watermark Vue 组件
- 水印仅在启用时生成 DOM，不产生额外性能开销
- 支持动态开关（`window.__APP_CONFIG__?.watermarkEnabled`）
- 支持水印文案运行时动态切换
- 交互完全穿透（不影响点击、滚动、选择）

**Non-Goals:**
- 不处理水印防篡改或前端反移除（安全性依赖 mid-frame 后端校验）
- 不包含 mid-frame 通信实现（仅消费全局变量）
- 不考虑其他子应用（meoi-aim-rcrm-web 等）的集成

## Decisions

**1. Canvas 生成水印图案，而非 SVG/CSS 重复**
- Canvas 输出 data URL 作为 background-image，单 DOM 元素即可完成平铺，无额外子节点
- 相比多个绝对定位 div 方式更轻量
- 支持微调文字角度、间距、字体等参数

**2. 全局变量 `window.__APP_CONFIG__?.watermarkEnabled` 控制显隐**
- mid-frame 后续通过改写此变量控制开关，零通信耦合
- 前期接入简单，默认 false，组件 mount 时读取并将 enabled 保持为响应式 ref
- 通过 watchEffect 跟踪变化，true 生成 Canvas 挂载，false 移除

**3. 封装为 composable + 组件双层结构**
- `useWatermark` composable：纯逻辑，不依赖 Vue 单文件组件，其他项目（含非 Vue/React 项目）可借鉴移植
- `Watermark` 组件：薄壳，调用 composable，其他 Vue 项目可直接复制 `hooks/` + `components/Watermark/` 接入
- `WatermarkOptions` 接口支持 `text`、`enabled`、`container` 等参数，扩展性强

**4. Overlay 定位为 absolute + inset:0，而非 fixed**
- 跟随业务内容区（`#app`）位移，不影响壳框架
- 路由切换时 content 区域不变，水印无需重建

## Risks / Trade-offs

| 风险 | 应对 |
|------|------|
| Qiankun 沙箱可能隔离 `window.__APP_CONFIG__` | 若无法读取，回退到 Pinia store + mid-frame 通过 globalState 通信 |
| ResizeObserver 在严格沙箱中失效 | 降级方案：仅 mount 时生成一次，不响应容器尺寸变化 |
| Canvas 渲染耗时（高频重建） | 仅在 enabled 从 false→true 或 text 变化时重建；debounce 可考虑 |
| Shadow DOM 环境 | 当前项目不使用 Shadow DOM，标记为已知限制 |

## Migration Plan

1. 新建 `useWatermark` composable + `Watermark` 组件 → 不影响现有功能
2. 在 `App.vue` 中添加 `<Watermark />` → 默认 disabled，对外不可见
3. 通知 mid-frame 团队 `window.__APP_CONFIG__.watermarkEnabled` 接口契约
4. mid-frame 接入后，通过环境配置动态下发开关

## Open Questions

- Qiankun 沙箱环境下 `window.__APP_CONFIG__` 是否可读？需实际验证
- mid-frame 是否通过 `__APP_CONFIG__` 还是其他属性传递？当前假设 `__APP_CONFIG__` 存在
