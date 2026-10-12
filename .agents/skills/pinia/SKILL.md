---
name: pinia
description: '为 meos-control-web 工作区处理 Pinia / store / 状态管理规则的技能。适用于新增或修改 Pinia store、判断当前应用的 store 组织方式、复用根应用加密 session 持久化、避免破坏 src/store/index.ts 的持久化序列化逻辑、在组件中正确使用 store 与 storeToRefs，并保持根应用与两个子应用的现有 Pinia 风格一致。触发词：pinia、store、defineStore、storeToRefs、状态管理、持久化、sessionStorage、baseStore、createPinia。'
argument-hint: '说明目标应用/文件，以及是要新增 store、修改 state/getters/actions、接入持久化，还是梳理 Pinia 规则'
---

# meos-control-web Pinia 使用技能

## 技能目标

在当前多应用工作区中处理 Pinia / store 任务时，帮助代理稳定完成以下事项：

- 先识别当前代码属于哪个应用，再复用该应用现有的 Pinia 组织方式。
- 在根应用中保留现有的加密 sessionStorage 持久化行为，不破坏 `src/store/index.ts`。
- 新增或修改 store 时，保持与周边 store 的语法、命名、导出和调用方式一致。
- 在组件中正确使用 store，避免错误解构导致响应式丢失。
- 区分“应该改 store”与“应该改局部组件状态”的场景，避免把所有状态都塞进全局仓库。

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “帮我新增一个 Pinia store”
- “这个状态应该放组件里还是放 store 里”
- “当前项目里 Pinia 应该怎么写”
- “修改 baseStore / mainStore / 其它 store 的 state、getters、actions”
- “为什么这个 store 的持久化不能乱改”
- “解构 store 后响应式没了怎么处理”
- “当前项目的 store 规范是什么”

默认覆盖整个工作区内的 Pinia 任务，但执行时必须先识别目标应用，再进入对应的 store 风格与初始化方式。

## 先判断目标应用

这个仓库是多应用工作区，Pinia 的接入方式不完全相同。

### 根应用 `src/`

- 入口：`src/store/index.ts`
- 使用 `createPinia()`
- 使用 `pinia-plugin-persistedstate`
- 持久化存储：`sessionStorage`
- 序列化方式：`cryptoInstance` 加密/解密
- store 目录：`src/store/`
- 常见风格：`defineStore('id', { state, getters, actions })`

### 子应用 `operation-duty-homepage/`

- 入口：`operation-duty-homepage/src/store/index.js`
- 使用 `createPinia()`
- 当前未见持久化插件接入
- store 目录：`operation-duty-homepage/src/store/modules/`
- 常见风格：轻量 `main` store，Options 风格 `defineStore`

### legacy 子应用 `meoi-aim-rcrm-web/`

- 入口：`meoi-aim-rcrm-web/src/store/index.js`
- 使用 `createPinia()`
- 当前未见持久化插件接入
- store 目录：`meoi-aim-rcrm-web/src/store/modules/`
- 常见风格：轻量 `main` / `chartDataStore` / `adjustDataStore`，Options 风格 `defineStore`

### 总规则

1. 先根据文件路径判断属于哪个应用。
2. 再复用该应用已有的 Pinia 初始化和 store 组织方式。
3. 没有明确需求时，不跨应用统一 store 架构。
4. 不为了“Pinia 最佳实践看起来更先进”而强行把当前仓库大面积改成另一种风格。

## 根应用 Pinia 规则现状

根应用最重要的约定集中在 `src/store/index.ts` 与 `src/store/baseStore.ts`。

### 1. 必须保留全局持久化行为

根应用 Pinia 当前使用：

- `createPersistedState`
- `sessionStorage`
- `cryptoInstance.Encrypt / Decrypt`

这意味着：

- 根应用 store 持久化不是明文
- session 存储行为已被统一封装
- 修改 `src/store/index.ts` 时必须非常谨慎

默认不要：

- 改掉 `serializer`
- 改掉 `storage: sessionStorage`
- 改掉持久化 key 规则
- 引入另一套持久化插件或局部持久化方案去打架

### 2. 根应用当前以 Options Store 为主

虽然 Pinia 官方支持 Setup Store，但当前仓库实际大量使用的是：

```ts
defineStore('base', {
		state: () => ({}),
		getters: {},
		actions: {}
})
```

因此默认策略是：

- 修改现有 store 时，优先保持现有 Options 风格
- 新增简单 store 时，若附近同目录均为 Options 风格，优先继续保持一致
- 新增且逻辑明显复杂的 store，可优先评估 Setup Store，但必须先确认不会破坏同目录可维护性
- 不要无端把现有 Options Store 批量迁成 Setup Store

### 3. `baseStore` 是根应用核心 store

`src/store/baseStore.ts` 目前承担很多全局状态职责，例如：

- 用户信息
- `projectId` / `groupCode`
- 模板信息
- headerConfig
- 权限判断 `hasAuth`
- 与外链跳转相关的动作

默认策略：

- 与全局项目上下文、权限、项目级配置相关的状态，优先评估是否应进入 `baseStore`
- 但不要把页面局部 UI 状态随意塞进 `baseStore`

### 4. 页面局部状态优先独立 store 或组件内状态

仓库里也有一些偏局部的 store，如：

- `componentStore`
- `lightingDemandStore`
- `showInfoStore`

因此新增状态前先判断：

#### 应放组件内 `ref/reactive` 的情况

- 只在单个组件使用
- 不需要跨页面/跨组件共享
- 不需要在页面切换后保留

#### 应放 Pinia store 的情况

- 多个组件共享
- 多个 hooks / utils / 组件都要访问
- 与当前业务模块的页面级交互状态强相关
- 需要统一 action 封装更新逻辑

#### 应放 `baseStore` / `mainStore` 的情况

- 项目级上下文
- 微前端宿主交互数据
- 用户权限、项目身份、全局头部配置

## 子应用 Pinia 规则现状

### `operation-duty-homepage/`

- 当前 store 结构较轻
- 主要 `main` store 存放：`groupCode`、`projectId`、微前端钩子、drawerTop 等
- 默认策略：继续保持轻量，不要无故把它扩展成“大而全”全局仓库

### `meoi-aim-rcrm-web/`

- 当前 store 也偏轻量，按主业务拆成多个 store
- 常见模式是通过 `useMainStore()` 在工具或 hooks 中读取 `projectId` / `groupCode`
- 默认策略：沿用当前 Options 风格和模块划分

## 组件中使用 store 的规则

### 1. 直接使用 store 实例

当前项目里大量代码直接这样写：

```ts
const base = baseStore();
base.projectId;
base.setHeaderConfig(...);
```

这在当前仓库是正常风格，尤其适合：

- 不需要解构
- 直接读状态或调用 action

### 2. 解构 state/getters 时使用 `storeToRefs`

如果要解构响应式 state/getters，优先使用：

```ts
const controlsStore = useControls();
const { publicArea, parkingLot } = storeToRefs(controlsStore);
```

不要直接：

```ts
const { publicArea } = useControls();
```

否则容易丢失响应式。

### 3. actions 可以直接从 store 调用

若只是调用 action，通常直接从 store 实例调用即可，不必为了“统一解构”把 actions 和 state 混在一起解构。

## store 文件组织规则

### 根应用

- 目录：`src/store/`
- 一个 store 文件维护一类明确业务状态
- store id 保持稳定，不要随意改名
- 默认导出方式以当前文件附近风格为准：
	- `export default baseStore`
	- 或 `export const useControls = defineStore(...)`

### 命名建议

- 全局上下文：`baseStore`
- 微前端上下文：`useMidFrameStore`
- 业务域：`lightingDemandStore`、`loopControlList`
- 尽量让 store 名字表达业务领域，而不是纯 UI 名字堆砌

### state / getters / actions

- `state` 只放状态，不放副作用
- `getters` 放派生值与轻量判断
- `actions` 放显式更新逻辑、跨字段变更、必要副作用
- 不要把复杂异步业务塞进 getter

### 复杂新 store 的风格建议

对根应用新增 store：

- 若只是常规状态 + 简单 getters/actions，优先延续当前 Options Store 风格
- 若包含复杂组合逻辑、多个 composable、watch 依赖链、需要更细粒度组织响应式变量，可优先评估 Setup Store

但前提是：

1. 同目录或同业务模块不会因此形成难以维护的风格割裂
2. 调用方式对现有组件与 hooks 足够清晰
3. 不把“官方推荐”当作唯一理由去推动迁移

## 核心决策规则

### 1. 先复用，再新增 store

默认顺序：

1. 先判断已有 store 是否已经承载该状态
2. 再判断是组件局部状态还是 store 状态
3. 只有确有必要时才新建 store

避免同类信息分散在多个 store 中，导致来源不清。

### 2. 不破坏持久化协议

对于根应用：

- 不要随意改 `src/store/index.ts` 的加密序列化逻辑
- 不要把持久化从 `sessionStorage` 改成 `localStorage`
- 不要在不确认影响范围时修改 `key` 规则

### 3. 不为“最佳实践”牺牲当前仓库一致性

避免以下行为：

- 只因为 Pinia 官方更推荐 Setup Store，就把已有 Options Store 全部推倒重来
- 在一个目录里混用完全不同的 store 组织风格
- 为了少写几行代码，直接错误解构 store state

### 4. store 不应替代所有局部状态

如果状态只在单个组件短期存在，优先留在组件中，不要让 Pinia 变成“全局杂物间”。

## 标准工作流

### 第 1 步：定位所属应用与 store 入口

1. 根据路径判断属于根应用还是子应用。
2. 找到该应用的 `store/index.*`。
3. 明确该应用是否有持久化插件、加密序列化、微前端上下文约定。

### 第 2 步：判断状态归属

1. 这是组件局部状态、模块共享状态，还是全局上下文状态？
2. 若已有 store 可承载，优先增量修改。
3. 若必须新建 store，再决定命名与目录位置。

### 第 3 步：按现有风格实现 store

1. 优先保持同目录 store 的语法风格。
2. 保持 `state/getters/actions` 职责清晰。
3. 如果涉及根应用持久化，确认不会破坏全局序列化规则。

### 第 4 步：验证调用方式

至少检查以下内容：

1. 是否复用了正确的 store 入口与风格。
2. 是否错误解构了 state/getters。
3. 是否把局部状态无谓提升成全局 store。
4. 是否意外影响了根应用持久化行为。
5. 是否与周边组件和 hooks 的调用方式一致。

## 完成标准

满足以下条件才算完成：

- 已确认当前任务使用的是目标应用真实存在的 Pinia 组织方式。
- 修改后的 store 与周边文件风格一致。
- 根应用持久化与加密 session 逻辑未被破坏。
- 组件中的 store 使用方式保持响应式正确。
- 没有把明显的局部状态错误提升为全局状态。

## 回答用户时的建议输出结构

处理 Pinia 任务后，建议按以下顺序反馈：

1. 当前文件所属应用与所用 store 入口
2. 该状态为什么放在 store 或不放在 store
3. 采用了哪种 store 风格（沿用现有 Options 风格 / 其它）
4. 是否影响持久化、微前端上下文或全局状态
5. 调整了哪些 state / getters / actions

## 本技能沉淀出的项目经验

1. 根应用 `src/store/index.ts` 使用 `pinia-plugin-persistedstate` + `sessionStorage` + `cryptoInstance` 加密序列化，修改时必须保留该协议。
2. 根应用当前 store 以 Options 风格 `defineStore({ state, getters, actions })` 为主，默认应优先保持一致。
3. 根应用大量代码直接调用 `baseStore()` / 其它 store 实例；只有在解构响应式 state/getters 时才更适合使用 `storeToRefs`。
4. `operation-duty-homepage` 与 `meoi-aim-rcrm-web` 的 store 更轻量，主要围绕 `main` store 和微前端上下文字段，不应无故改造成复杂全局状态系统。
