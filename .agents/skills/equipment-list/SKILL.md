---
name: equipment-list
description: '为 meos-control-web 根应用告诉 AI 如何正确使用和接入设备列表组件的技能。适用于在页面中直接复用 src/components/equipmentList/index.vue，并让 AI 优先通过 props 和事件完成接入，而不是自己重写设备表。触发词：equipmentList、设备列表、如何接入设备列表、如何使用 equipmentList、设备列表 props、设备列表示例、EquipmentList。'
argument-hint: '说明目标页面和设备列表使用场景，例如从楼层入口打开、从分类入口打开、带筛选条件打开，或作为覆盖层显示/关闭'
---

# meos-control-web 设备列表技能

## 技能目标

在根应用 `src/` 中处理设备列表页面时，帮助代理优先复用现有 `EquipmentList`，并正确完成：

- 设备列表组件接入
- 常用 props 选择与传递
- 返回事件处理
- 页面中的最小使用方式

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里需要一个设备列表页 / 设备清单面板”
- “帮我接入现有设备列表组件”
- “设备列表这里应该怎么用，不要自己重写”
- “这里点进去后展示设备列表”
- “从楼层 / 分类入口打开设备列表应该怎么传参”
- “设备列表返回时怎么处理”

默认优先检查：

- `src/components/equipmentList/index.vue`

## 使用原则

### 1. 默认优先整体使用 `EquipmentList`

如果页面要的是完整设备列表体验，优先直接挂：

- `src/components/equipmentList/index.vue`

而不是自己重新写一个设备表页面。

### 2. 先传最少 props，再按场景补充

大多数页面接入时，不需要理解内部实现细节，只需要先传最常用的业务 props。

### 3. `@back` 是标准退出方式

当设备列表是页面中的覆盖层、切换层或子视图时，优先通过 `@back` 来关闭它，并清理接入参数。

## 组件入口

直接使用：

`src/components/equipmentList/index.vue`

## Props 说明

### 高频 props

#### `runningMonitorType`

- 用途：设备列表所属运行监控类型

#### `permission`

- 用途：控制设备列表中的操作权限

### 常用场景 props

#### `floorId`

- 用途：默认定位到某个楼层/节点
- 适合场景：从楼层或树节点入口打开设备列表

#### `classCode`

- 用途：默认定位到某个设备分类
- 适合场景：从某类设备入口直接打开设备列表

#### `filter`

- 用途：传入初始过滤条件
- 类型：对象
- 适合场景：打开后直接带筛选条件进入

#### `pageSize`

- 用途：控制每页默认数量
- 默认值：`50`

#### `getFilterObjectIdsFn`

- 用途：异步返回允许展示的对象 ID 列表
- 适合场景：页面已有更高层过滤逻辑，希望设备列表只展示某批设备

### 其它 props

- `runningMonitorSecondType`：二级运行监控类型
- `subscribeType`：订阅类型
- `zIndex`：层级控制

## 最小使用示例

### 1. 页面内切换显示设备列表

```vue
<EquipmentList
    v-if="showEquipmentList"
    v-bind="equipmentListData"
    @back="() => {
        showEquipmentList = false;
        equipmentListData = {};
    }"
/>
```

这是最常见的接法，适合“点进去后打开设备列表，再返回关闭”的场景。

### 2. 接入参数的常见组织方式

```js
const showEquipmentList = ref(false);
const equipmentListData = ref({});

const openEquipmentList = payload => {
    showEquipmentList.value = true;
    equipmentListData.value = {
        floorId: payload.floorId,
        classCode: payload.classCode,
        runningMonitorType: payload.runningMonitorType,
        permission: payload.permission,
        filter: payload.filter || {}
    };
};
```

适合场景：

- 页面进入设备列表前，先整理一份接入参数
- 打开时整体传入，返回时整体清空

### 3. 带默认分类和默认楼层的使用示例

```vue
<EquipmentList
    :floor-id="currentFloorId"
    :class-code="currentClassCode"
    :running-monitor-type="runningMonitorType"
    :permission="permission"
    @back="handleBack"
/>
```

适合场景：

- 从楼层入口打开
- 从某类设备入口打开
- 希望设备列表默认落在指定范围

### 4. 带初始筛选条件的使用示例

```vue
<EquipmentList
    :running-monitor-type="runningMonitorType"
    :permission="permission"
    :filter="{
        localName: keyword,
        runStatus: runStatusList
    }"
    @back="handleBack"
/>
```

适合场景：

- 从搜索页或标签页带条件进入
- 打开后直接命中一组初始过滤结果

## AI 最该知道的使用结论

### 1. 默认优先整体使用 `EquipmentList`

如果页面要的是完整设备列表体验，就优先直接挂：

- `src/components/equipmentList/index.vue`

### 2. 大多数页面只需要关心 props 和 `@back`

通常不需要理解它的内部实现，也不需要把内部层级自己重新拼起来。

### 3. 打开时组织参数，关闭时清空参数

这是最标准的设备列表接入方式。

### 4. 不要把它当成普通静态表

它不是一个只负责展示的普通表格壳子，所以不要为了“用它”又重写一套设备表。

## AI 使用时的规则

### 1. 不要一上来就重写设备列表

优先顺序应该是：

1. 先看能不能直接用 `EquipmentList`
2. 再看是否只需要补充 props
3. 最后才考虑新实现

### 2. 不要把内部实现细节搬到页面里

如果只是页面接入：

- 不需要自己重接左侧树
- 不需要自己重接表头
- 不需要自己重接控制弹窗
- 不需要自己重接 SSE

### 3. 优先传业务参数，不要传内部实现假设

应该优先传：

- `floorId`
- `classCode`
- `runningMonitorType`
- `permission`
- `filter`
- `pageSize`

### 4. 返回时优先清理显示状态和接入参数

标准返回处理一般是：

- 隐藏 `EquipmentList`
- 清空 `equipmentListData`

## 特别容易写错的地方

### 1. 明明只需要“用它”，却先去“重写它”

这是最容易让 AI 跑偏的地方。

### 2. 只接了一个普通表格，漏掉已有设备列表能力

比如漏掉：

- 返回事件
- 初始筛选
- 默认分类/楼层定位

### 3. 返回时只隐藏，不清理接入参数

这样容易导致下次打开时残留上一次的条件。

### 4. 一开始就传过多 props 或内部实现假设

大多数页面接入时，不需要理解内部 hook 才能正确使用它。

## 完成标准

满足以下条件才算完成：

- AI 已知道什么时候直接使用 `EquipmentList`
- AI 已知道最常用 props 怎么传
- AI 已知道 `@back` 是标准返回方式
- AI 不会因为只想接一个设备列表就去重写一整套设备表

## 给用户回复时建议说明

完成相关任务后，建议反馈：

1. 这次是整体使用 `EquipmentList`，还是只补了某些 props
2. 传了哪些关键 props
3. `@back` 是如何处理显示状态与参数清理的
