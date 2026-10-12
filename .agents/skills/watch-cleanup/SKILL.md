---
name: watch-cleanup
description: '为 meos-control-web 工作区处理 Vue watch / watchEffect 清理问题的技能。适用于新增或修改 watch、watchEffect、组合式 hooks、组件副作用监听时，优先改用 `src/hooks/useWatchEffectWithCleanup.ts` 中的 `useWatchEffectWithCleanup` 与 `useWatchWithCleanup`，自动在组件卸载前 stop，避免遗漏清理。触发词：watch、watchEffect、cleanup、onBeforeUnmount、停止监听、监听释放、useWatchWithCleanup、useWatchEffectWithCleanup、Vue 3、Composition API。'
argument-hint: '说明目标文件，以及是要新增监听、把原生 watch 改成自动清理，还是梳理当前 watch 使用规范'
---

# meos-control-web watch 自动清理技能

## 技能目标

在当前工作区处理 Vue `watch` / `watchEffect` 相关任务时，帮助代理稳定完成以下事项：

- 优先复用项目现有封装：`src/hooks/useWatchEffectWithCleanup.ts`
- 在组件或 composable 中新增监听时，默认带上卸载自动清理能力
- 区分 `watch` 与 `watchEffect` 的使用场景，选对封装函数
- 避免手写重复的 `const stop = watch(...); onBeforeUnmount(stop)` 模板代码
- 交付前检查是否仍残留未清理的原生监听写法

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “帮我加一个 watch”
- “这个 watch 要记得销毁 / 清理”
- “把 watchEffect 改安全一点”
- “为什么这个监听在组件销毁后还在触发”
- “统一项目里的 watch 写法”
- “把原生 watch / watchEffect 改成公共 hook”
- “当前项目 watch 应该怎么写”

默认覆盖根应用 `src/` 下的 Vue 组件与 hooks 场景；若目标代码位于其它子应用，先确认该子应用是否也应复用同一封装路径，再决定是否沿用。

## 先认识项目里的公共封装

项目里已经提供了统一封装：`src/hooks/useWatchEffectWithCleanup.ts`

### 1. `useWatchEffectWithCleanup`

用于替代原生 `watchEffect`：

- 内部调用 `watchEffect(effect, options)`
- 在 `onBeforeUnmount` 中自动执行 `stop()`
- 适合“依赖自动收集”的副作用监听

### 2. `useWatchWithCleanup`

用于替代原生 `watch`：

- 内部调用 `watch(...args)`
- 在 `onBeforeUnmount` 中自动执行 `stop()`
- 适合“明确指定监听源”的场景

## 核心决策规则

### 1. 能复用封装时，不直接写原生 `watch` / `watchEffect`

默认顺序：

1. 如果是 `watchEffect(...)` 场景，优先改为 `useWatchEffectWithCleanup(...)`
2. 如果是 `watch(source, callback, options)` 场景，优先改为 `useWatchWithCleanup(...)`
3. 只有在明确需要脱离组件卸载生命周期手动管理 stop 时，才保留原生写法

### 2. 先判断应该用 `watch` 还是 `watchEffect`

#### 用 `useWatchWithCleanup` 的情况

适合：

- 已经有明确的监听源，如 `ref`、`computed`、getter、数组源
- 需要访问 `newValue` / `oldValue`
- 需要 `deep`、`immediate`、`flush` 等典型 `watch` 配置
- 现有代码本来就是 `watch(...)`

常见形态包括：

- `useWatchWithCleanup(someRef, callback)`
- `useWatchWithCleanup(() => state.xxx, callback)`
- `useWatchWithCleanup([a, b], callback, options)`

#### 用 `useWatchEffectWithCleanup` 的情况

适合：

- 副作用依赖在回调内部自动收集
- 只关心“依赖变了就重跑”，不关心新旧值
- 现有代码本来就是 `watchEffect(...)`

### 3. 不要重复包一层手动 `onBeforeUnmount`

如果已经用了：

- `useWatchWithCleanup(...)`
- `useWatchEffectWithCleanup(...)`

就不要再额外写一层：

- `const stop = ...`
- `onBeforeUnmount(() => stop())`

否则属于重复清理，代码更啰嗦，也容易让后续维护者误以为封装没有处理生命周期。

### 4. 不是所有地方都适合这两个封装

以下情况要先停一下判断：

- 监听逻辑不在组件 `setup` / composable 执行链中，`onBeforeUnmount` 可能没有有效宿主
- 监听需要早于组件销毁就被主动停止，并且 stop 时机由业务控制
- 临时创建的 watcher 需要在同一函数内立即 stop / 切换 stop

这类场景可以保留原生 `watch` / `watchEffect`，但要明确说明为什么不走公共封装。

## 标准工作流

### 第 1 步：确认监听类型

先判断当前需求属于哪类：

1. 原生 `watch(...)`
2. 原生 `watchEffect(...)`
3. 新增监听但尚未实现

### 第 2 步：选择正确封装

- `watchEffect` → `useWatchEffectWithCleanup`
- `watch` → `useWatchWithCleanup`

导入方式统一来自：`@/hooks/useWatchEffectWithCleanup`

### 第 3 步：保持原有监听语义不变

改造时只替换监听创建方式，不顺手改业务逻辑：

- 保留原有 source
- 保留原有 callback
- 保留原有 options
- 保留原有异步流程、判空、节流、防抖等业务判断

目标是“只补自动清理，不改变行为”。

### 第 4 步：删除重复清理代码

如果原代码存在：

- `const stop = watch(...)`
- `const stop = watchEffect(...)`
- `onBeforeUnmount(() => stop())`

在切换到公共封装后，应删除这些因改造而变得多余的手动清理代码。

### 第 5 步：检查导入与调用风格

至少检查以下内容：

1. `watch` 是否改成 `useWatchWithCleanup`
2. `watchEffect` 是否改成 `useWatchEffectWithCleanup`
3. 是否还残留未使用的 `watch` / `watchEffect` / `onBeforeUnmount` 导入
4. 是否误改了监听逻辑本身
5. 是否在组件或 composable 生命周期内调用该封装

## 完成标准

满足以下条件才算完成：

- 新增或修改的监听已优先复用 `src/hooks/useWatchEffectWithCleanup.ts`
- 没有重复保留无意义的手动 stop + `onBeforeUnmount`
- 监听的业务语义与触发条件未被意外改变
- 调用位置具备组件卸载生命周期上下文
- 相关导入已清理干净

## 回答用户时的建议输出结构

处理 watch 相关任务后，建议按以下顺序反馈：

1. 当前监听属于 `watch` 还是 `watchEffect`
2. 采用了哪个公共封装
3. 是否移除了重复的手动清理代码
4. 是否有场景不适合使用该封装，以及原因

## 本技能沉淀出的项目经验

1. 当前仓库已经提供 `src/hooks/useWatchEffectWithCleanup.ts`，不要重复发明另一套 watch 清理封装。
2. `useWatchEffectWithCleanup` 对应 `watchEffect`，`useWatchWithCleanup` 对应 `watch`，职责分工明确。
3. 这两个封装的核心价值是把 `stop()` 统一挂到 `onBeforeUnmount`，减少遗漏监听释放的问题。
4. 该封装在根应用 `src/` 中已有大量实际使用，属于项目现成约定，不是新的试验性写法。
