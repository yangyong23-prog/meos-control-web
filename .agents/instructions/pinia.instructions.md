---
description: "在 meos-control-web 中编写或修改 Pinia store、store 入口与状态管理逻辑时使用。涵盖多应用 store 入口识别、根应用持久化协议、Options / Setup Store 取舍、storeToRefs 使用以及避免把局部状态误提到全局。"
name: "Pinia Store Guidelines"
applyTo: "src/store/**, src/main.ts, operation-duty-homepage/src/store/**, operation-duty-homepage/src/main.js, meoi-aim-rcrm-web/src/store/**, meoi-aim-rcrm-web/src/main.js"
---

# Pinia / Store 规范

在当前仓库中处理 Pinia 或 store 相关修改时，先判断所属应用，再复用该应用现有的状态管理方式，不要跨应用硬套一套统一模板。

## 先判断所属应用

- 根应用 `src/`：使用 Pinia，入口在 `src/store/index.ts`
- `operation-duty-homepage/`：使用 Pinia，入口在 `operation-duty-homepage/src/store/index.js`
- `meoi-aim-rcrm-web/`：使用 Pinia，入口在 `meoi-aim-rcrm-web/src/store/index.js`
- `meos-daily-report-web/` 不是当前这份 Pinia 指令的目标范围，不要把这里的规则强套过去

默认先看当前文件路径，再决定使用哪套 store 入口、命名习惯和组织方式。

## 根应用持久化规则

根应用 `src/store/index.ts` 已接入：

- `pinia-plugin-persistedstate`
- `sessionStorage`
- `cryptoInstance` 加密 / 解密序列化

因此：

- 不要随意改掉持久化插件
- 不要把 `sessionStorage` 改成 `localStorage`
- 不要无故改动 `serializer`、持久化 key 或加密逻辑
- 如果只是新增或修改 store，一般不要顺手改 `src/store/index.ts`

## store 风格选择

当前仓库 Pinia 现状以 **Options Store** 为主，尤其是根应用和两个子应用现有 store。

默认策略：

- 修改现有 store：优先保持原文件当前风格
- 新增简单 store：优先延续周边现有 Options Store 风格
- 新增且逻辑明显复杂的 store：可以评估 Setup Store，但要先确认不会让同目录风格割裂得过于明显

不要因为 Pinia 官方支持 Setup Store，就无端重写已有 Options Store。

## 状态应该放哪里

新增状态前先判断归属，避免把所有东西都丢进全局 store。

### 更适合放组件内 `ref` / `reactive`

- 只在单个组件内使用
- 不需要跨组件共享
- 不需要在页面切换后继续保留

### 更适合放模块 store

- 多个组件、hooks、utils 需要共享
- 需要统一 action 封装更新逻辑
- 属于某个业务模块的页面级状态

### 更适合放根应用 `baseStore` 或子应用 `main` store

- `projectId`、`groupCode`、用户信息、权限信息
- 微前端宿主传入的上下文
- 全局 header 配置、项目级公共上下文

不要把明显的页面局部弹窗开关、单次编辑态、临时筛选条件，随意塞进 `baseStore` / `main` store。

## 组件和 hooks 中使用 store 的方式

- 直接读取状态或调用 action 时，可直接使用 store 实例
- 解构 `state` / `getters` 时，优先使用 `storeToRefs`
- 不要直接解构 store state，避免响应式丢失

例如：

```ts
const base = baseStore();
base.setHeaderConfig(...);
```

如果要解构响应式字段，优先：

```ts
const controlsStore = useControls();
const { publicArea, parkingLot } = storeToRefs(controlsStore);
```

## store 文件组织

- 根应用 store 放在 `src/store/`
- `operation-duty-homepage` store 放在 `operation-duty-homepage/src/store/`
- `meoi-aim-rcrm-web` store 放在 `meoi-aim-rcrm-web/src/store/`
- 一个 store 文件应围绕一类明确业务状态，不要做成“什么都塞”的大仓库
- `store id` 和导出方式要保持稳定，不要随意改名导致调用方一起震荡

## 避免这些做法

- 为了“统一风格”跨应用重写 store 架构
- 修改 store 时顺手破坏根应用持久化协议
- 把大量局部状态提升成全局 store
- 直接错误解构 store state
- 在轻量子应用里无故引入过度复杂的全局状态设计

## 修改后自检

- 是否先判断了当前文件属于哪个应用
- 是否复用了该应用已有的 store 入口和组织方式
- 是否破坏了根应用持久化协议
- 是否错误解构了 store state / getters
- 是否把本应留在组件内的状态错误提升到了全局 store
- 是否与附近 store 的命名、导出、调用方式保持一致