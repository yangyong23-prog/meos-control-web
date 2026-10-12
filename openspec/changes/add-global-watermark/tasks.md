## 1. 类型声明

- [ ] 1.1 在 `src/types/global.d.ts` 中扩展 `Window` 接口，新增 `__APP_CONFIG__?: { watermarkEnabled?: boolean }`

## 2. useWatermark Composable

- [ ] 2.1 创建 `src/hooks/useWatermark.ts`，定义 `WatermarkOptions` 接口（text、enabled、container、tileWidth、tileHeight、gap、padding、fontSize、opacity、color、angle）
- [ ] 2.2 实现 Canvas 水印图案生成函数 `generateWatermarkCanvas(text, options): HTMLCanvasElement`
- [ ] 2.3 实现 overlay div 的创建、挂载和移除逻辑（appendChild、removeChild、pointer-events: none、高 z-index）
- [ ] 2.4 实现 `window.__APP_CONFIG__?.watermarkEnabled` 的响应式监听（使用 `watchEffect`），动态挂载/移除水印
- [ ] 2.5 实现 `ResizeObserver` 监听容器尺寸变化，重建水印
- [ ] 2.6 返回 `{ destroy, setText, setEnabled, isActive }` 控制接口
- [ ] 2.7 实现 `destroy()` 清理逻辑：移除 observer、移除 DOM、释放引用

## 3. Watermark 组件

- [ ] 3.1 创建 `src/components/Watermark/index.vue`，使用 `<script setup lang="ts">` + Composition API
- [ ] 3.2 接收 `text` prop（string，可选），默认读取当前用户名 `@${userName}`
- [ ] 3.3 接收 `enabled` prop（boolean，可选），若不传则读取 `window.__APP_CONFIG__?.watermarkEnabled`
- [ ] 3.4 内部调用 `useWatermark` composable，以自身容器为 container
- [ ] 3.5 仅在有内容时渲染 overlay 插槽，template 层保持最小

## 4. 应用集成

- [ ] 4.1 在 `src/App.vue` 中导入 `<Watermark />` 组件
- [ ] 4.2 在 `<router-view />` 旁（同级或包裹层）添加 `<Watermark :text="watermarkText" />`
- [ ] 4.3 确保 App.vue 的根元素或 `#app` 容器具有 `position: relative`（水印 absolute 定位的锚点）

## 5. 验证

- [ ] 5.1 运行 `pnpm lint` 确认无 ESLint 错误
- [ ] 5.2 运行 `pnpm typecheck` 确认无类型错误（如有）
- [ ] 5.3 手动验证：设置 `window.__APP_CONFIG__.watermarkEnabled = true`，确认水印出现且交互穿透
- [ ] 5.4 手动验证：设置 `window.__APP_CONFIG__.watermarkEnabled = false`，确认水印消失
- [ ] 5.5 手动验证：水印文案随用户名正确显示
