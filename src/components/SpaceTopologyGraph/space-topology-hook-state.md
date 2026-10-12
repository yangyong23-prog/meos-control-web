# Space Topology Hook 状态逻辑

## 目标

`useSpaceTopologyHook` 是空间拓扑图的会话控制器，负责把“右侧详情抽屉选中对象”和“左侧拓扑图当前展示空间”解耦。

它主要处理四件事：

1. 管理左侧拓扑图的打开、关闭和当前空间会话。
2. 只在当前右侧对象是空间详情，且详情模板确实属于该空间时，同步空间快照和关联关系。
3. 每次拿到空间详情里的最新关联设备关系后，重新请求最新拓扑配置，不缓存拓扑配置。
4. 管理拓扑图自己的 SSE 订阅范围，让动态数据继续由全局数据池更新。

> 注意：拓扑配置不再按空间缓存。业务侧反馈同一空间的最新关联关系可能变化，因此拓扑配置必须以空间详情模板里的最新 `relation.groupChildren` 为准。

---

## 一句话理解

左侧拓扑图绑定的是一个“空间会话”。切到设备详情时，左侧仍保持原空间拓扑；点击另一个关联空间时，左侧切到新空间，并基于新空间详情里的最新关联设备重新请求拓扑配置。

---

## 核心输入

`useSpaceTopologyHook({ currentSelectObj, showModuleInfo, templateData, templateLoading })`

- `currentSelectObj`
  右侧详情抽屉当前选中的对象，可能是空间，也可能是设备。

- `showModuleInfo`
  右侧详情抽屉是否打开。

- `templateData`
  当前详情对象对应的模板数据。空间详情时包含空间关系分组；设备详情时是设备模板。

- `templateLoading`
  当前详情模板是否加载中。

---

## 核心输出

- `topologyPassThroughProps`
  透传给 `SpaceTopology` 的最终数据：
  - `visible`
  - `loading`
  - `space`
  - `sessionId`
  - `source`
  - `config`

- `topologyHasEntry`
  当前空间详情是否有可打开拓扑图的关联设备。

- `handleSpaceSelect(space, source)`
  统一处理“选中空间”后的拓扑行为决策。

- `applyDetailSelection(nextObj)`
  应用右侧详情选中对象。

- `openTopologyBySpace(space, source)`
  打开或切换左侧拓扑图空间。

- `closeTopology(reason)`
  手动或随抽屉关闭拓扑图。

---

## 核心状态

### `topologyVisible`

左侧拓扑图是否打开。

### `topologySessionId`

每次打开或切换一个新的拓扑空间时递增。用于让 UI 识别拓扑会话变化。

### `topologySpace`

左侧拓扑图当前展示的空间。

关键规则：

- 点击空间 A 打开拓扑后，`topologySpace = A`。
- 点击拓扑图里的设备后，右侧详情切到设备，但 `topologySpace` 仍然是 A。
- 再从设备详情点击关联空间 B 后，`topologySpace` 切到 B。

### `topologyFallbackRelationGroups`

从空间详情模板 `templateData.relation.groupChildren` 中拿到的最新关系分组快照。

当前 hook 中它主要用于保留“当前拓扑会话消费过的空间关系快照”。真实拓扑渲染配置仍来自拓扑配置接口返回的 `topologyConfigData`。

### `topologyRelationIdsKey`

当前关系设备 ID 集合的签名。

虽然会记录签名，但当前策略是：只要当前空间详情稳定同步，就按最新关系请求拓扑配置，不再因为签名相同而跳过请求。

### `topologySubscriptionKey`

当前拓扑 SSE 订阅范围签名。

SSE 订阅只在订阅范围变化时重设，避免重复创建同样的 SSE 订阅。

### `topologyBootstrapLoading`

拓扑刚打开、还在等待当前空间详情模板稳定时的首屏 loading。

### `topologySessionReady`

标记当前拓扑会话是否已经消费过空间详情快照。

### `suppressTopologyLoadingOnSpaceRestore`

从左侧拓扑点击回空间详情时，用于避免恢复详情时出现不必要 loading。

当前没有拓扑配置缓存，因此它只影响空间详情恢复场景，不代表配置缓存命中。

### `topologyConfigData`

拓扑配置接口返回的数据，最终透传给 `SpaceTopology.config`。

重要规则：

- 不缓存。
- 每次空间详情稳定同步后，根据最新关联设备 ID 请求。
- 切设备详情时不改。
- 切另一个空间时清空旧运行时状态，再等待新空间详情同步后请求。

---

## 状态流转

### 1. idle：拓扑关闭

条件：

```text
topologyVisible = false
```

说明：

- 左侧拓扑图未显示。
- 无活跃拓扑会话。

---

### 2. opening：打开某个空间拓扑

触发：

```js
openTopologyBySpace(space, source)
```

动作：

1. `normalizeTopologySpace(space)` 统一空间字段。
2. 如果当前拓扑已经显示同一个空间，只合并非 `undefined` 字段，不重置会话。
3. 如果是新空间：
   - `resetTopologyRuntime()` 清空上一轮运行时状态。
   - 写入 `topologySpace`。
   - 写入 `topologySource`。
   - `topologyBootstrapLoading = true`。
   - `topologySessionId += 1`。
   - `topologyVisible = true`。

说明：

- 此时还没有新空间的最新关系快照。
- 需要等待右侧空间详情模板 `templateData` 返回。

---

### 3. bootstrapping：等待空间详情模板稳定

触发：

```js
syncTopologySessionFromDetail(isSelectObjectSwitching)
```

进入条件：

- 当前右侧选中对象是空间。
- 当前空间详情模板还在加载。
- 当前拓扑会话尚未 ready。

动作：

```js
topologyBootstrapLoading.value = true
```

说明：

- 这是拓扑首屏 loading。
- 防止左侧拓扑提前消费旧设备模板或旧空间模板。

---

### 4. active：空间详情稳定，同步拓扑会话

触发：

```js
syncTopologySessionFromDetail(isSelectObjectSwitching)
```

必须同时满足：

- `currentSelectObj.objType === 'space'`
- `templateData.objType === 'space'`
- `templateData.objectId || templateData.id` 等于当前空间 ID
- 当前不是对象切换瞬间

动作顺序：

1. `syncTopologySpaceSnapshot(templateData)`
   - 用空间详情模板补全 `topologySpace` 的空间动态字段。
   - 不允许设备模板覆盖空间拓扑。

2. `syncTopologyRelationSnapshot(templateData.relation.groupChildren)`
   - 冻结当前空间的最新关系分组。
   - 提取关联设备 ID。
   - 按最新关联设备 ID 请求拓扑配置接口。
   - 如果没有关联设备，则清空拓扑配置。

3. `syncTopologySubscription(templateData)`
   - 从空间详情模板中提取 `classCode -> objectIds`。
   - 订阅范围变化时，调用 `setSpaceTopologySSEClientOption`。

4. 关闭 bootstrap loading。

说明：

- 这是拓扑图真正建立会话的阶段。
- 关联设备关系以空间详情模板的最新数据为准。
- 拓扑配置始终重新请求，不走缓存。

---

### 5. overlay-detail-switch：左侧空间拓扑 + 右侧设备详情

触发：

- 点击拓扑图中的设备。
- 点击其它入口打开设备详情。

动作：

```js
applyDetailSelection(equipment)
```

效果：

- `currentSelectObj` 切到设备。
- `topologySpace` 不变。
- `topologyConfigData` 不变。
- 不消费设备 `templateData`。

说明：

这是正常并存态：左侧展示空间 A 的拓扑，右侧展示空间 A 内某个设备详情。

---

### 6. switch-space-from-device：从设备详情切到关联空间

触发：

从设备详情里的关联信息点击空间 B。

动作链路：

1. 外部调用 `selectObject(spaceB, source)`。
2. `handleSpaceSelect(spaceB, source)` 返回 `openTopology = true`，因为当前拓扑已打开且空间 ID 不同。
3. 外部调用 `openTopologyBySpace(spaceB, source)`。
4. 左侧 `topologySpace` 从 A 切到 B。
5. 等待 B 的空间详情模板稳定后，重新请求 B 的最新拓扑配置。

说明：

这个流程修复了“从空间 A 拓扑点设备，再从设备详情点关联空间 B，左侧仍显示 A 名称”的问题。

---

### 7. closing：关闭拓扑

触发：

```js
closeTopology('manual')
closeTopology('drawer')
```

动作：

- `topologyVisible = false`
- `resetTopologyRuntime()`
- `resetTopologyConfigData()`
- 如果原因是 `drawer`，额外清空 `topologySpace`

说明：

- `manual` 表示用户手动关左侧拓扑，不主动改右侧抽屉。
- `drawer` 表示当前空间详情抽屉关闭，左侧拓扑也要关闭。
- 关闭时不会保留拓扑配置缓存。

---

## 关键函数分工

### `normalizeTopologySpace(space)`

统一空间对象字段：

- `id`
- `type = 'space'`
- `objType = 'space'`
- `floorLocalName`
- `buildingLocalName`

同时调用 `additionalFloorInfo` 补充楼层相关信息。

### `mergeDefinedFields(base, patch)`

同一空间重复打开时使用。

目的：只合并非 `undefined` 字段，避免点击事件里的轻量 payload 把详情模板里更完整的空间信息覆盖掉。

### `normalizeRelationGroups(relationGroups)`

把空间详情模板里的关系分组转换为拓扑请求需要的结构：

- `groups`
- `ids`
- `idMapSort`

其中 `ids` 是关联设备 ID 列表。

### `useSpaceTopologyConfigHook()`

负责拓扑配置接口请求。

- `loadTopologyConfigData(objectIds, idMapSort)`
  - 根据关联设备 ID 请求 `TOPOLOGY_VIEW` 配置。
  - 请求前会取消上一轮请求。
  - 用 `topologyConfigSessionId` 防止旧请求覆盖新请求。

- `resetTopologyConfigData()`
  - 取消请求。
  - 清空配置。

### `syncTopologySpaceSnapshot(detailTemplateData)`

只在详情模板属于当前拓扑空间时同步空间字段。

不会让设备模板覆盖 `topologySpace`。

### `syncTopologyRelationSnapshot(relationGroups)`

负责同步最新关系并请求拓扑配置：

1. 写入 `topologyFallbackRelationGroups`。
2. 提取最新关联设备 ID。
3. 写入 `topologyRelationIdsKey`。
4. 如果有关联设备，调用 `loadTopologyConfigData`。
5. 如果没有关联设备，调用 `resetTopologyConfigData`。

### `syncTopologySubscription(detailTemplateData)`

负责拓扑 SSE 订阅：

1. 从空间详情模板提取 `classCode -> objectIds`。
2. 生成 `topologySubscriptionKey`。
3. 如果订阅范围没变化，直接返回。
4. 如果有订阅范围，调用 `setSpaceTopologySSEClientOption`。
5. 如果没有订阅范围，关闭拓扑 SSE。

### `syncTopologySessionFromDetail(isSelectObjectSwitching)`

总调度器。

它负责判断当前是否可以消费 `templateData`：

- 当前选中对象不是空间：直接返回，保留左侧拓扑。
- 当前选中空间和左侧拓扑空间不同：先调用 `openTopologyBySpace` 切换左侧拓扑空间。
- 空间详情仍在加载：保持 bootstrap loading。
- 模板不是当前空间：继续等待。
- 模板稳定且属于当前空间：同步空间快照、关系快照、拓扑配置和 SSE。

### `handleSpaceSelect(space, source)`

处理空间选择入口。

返回：

- `selectObj`
- `openDrawer`
- `openTopology`
- `source`

`openTopology` 为 `true` 的情况：

1. 壳配置是直接关系模式，且当前空间已有关系设备。
2. 左侧拓扑已打开，但点击的是另一个空间。

### `openTopologyBySpace(space, source)`

打开或切换左侧拓扑空间。

- 同一空间：只合并有效字段，不重置拓扑。
- 不同空间：重置运行时状态，写入新空间，进入 bootstrap loading。

### `closeTopology(reason)`

关闭左侧拓扑。

合法 reason：

- `manual`
- `drawer`

其它 reason 会被忽略。

---

## Watch 关系

### `useWatchWithCleanup(() => showModuleInfo.value, syncTopologyWithDrawerVisibility)`

作用：

- 右侧抽屉关闭时，判断是否需要关闭左侧拓扑。
- 只有当前关闭的是拓扑所属空间详情时，才关闭拓扑。
- 如果关闭的是设备详情，且左侧还有空间拓扑，则保持拓扑不变。

### `useWatchWithCleanup(topologySessionWatchSources, callback, { immediate: true })`

监听项：

- `topologyVisible`
- `topologySpace.id`
- `currentSelectObj.id`
- `currentSelectObj.objType`
- `templateLoading`
- 当前详情模板中的关联设备 ID
- `templateData.objectId || templateData.id`
- `templateData.objType`

作用：

1. 识别右侧选中对象是否正在切换。
2. 处理空间详情关闭时是否同步关闭拓扑。
3. 调用 `syncTopologySessionFromDetail` 建立或更新拓扑会话。
4. 调用 `resolvePendingDirectTopologyOpen` 处理直接关系模式下的延迟打开。

---

## 环境参数展示缓存

拓扑图空间卡片里的环境参数展示由 `useTopologySpaceEnvironment` 管理。

这个子 hook 放在 `SpaceTopologyGraph` 目录下，目的是把“拓扑空间展示数据”从业务页面里收回来，避免 `ACOperationControl/index.vue` 继续维护拓扑内部展示缓存。

它维护两类缓存：

- `topologySpaceTemplateDataMap`
  按空间 ID 缓存环境参数选项模板。模板来源仍是空间详情 `templateData`。

- `topologySpaceWithEnvMap`
  按空间 ID 缓存带环境参数的空间展示数据。切到设备详情时，左侧拓扑仍可展示原空间的环境参数。

这部分缓存只影响拓扑空间卡片里的环境参数名称和值，不影响关联设备关系和拓扑配置。

`useSpaceTopologyHook` 仍然只负责拓扑空间会话、拓扑配置请求和 SSE 订阅；环境参数展示由 `useTopologySpaceEnvironment` 组合进页面后传给 `SpaceTopology.space`。

---

## 不缓存拓扑配置的原因

空间最新关联关系来自空间详情模板。

业务侧确认：同一个空间重新打开时，最新空间详情查到的关联关系可能和之前拓扑图里用过的关联关系不同。因此：

- 不缓存 `topologyConfigData`。
- 不缓存 `relationGroups` 作为下次打开的配置来源。
- 每次空间详情稳定后，都用最新关联设备 ID 请求拓扑配置。
- SSE 只负责动态数据更新，不负责重建拓扑结构。

---

## 典型链路

### 链路一：点击空间 A 打开拓扑

```text
selectObject(A)
→ handleSpaceSelect(A)
→ applyDetailSelection(A)
→ openTopologyBySpace(A)
→ 等待 A 的 templateData
→ syncTopologySessionFromDetail
→ syncTopologySpaceSnapshot(A template)
→ syncTopologyRelationSnapshot(A relation)
→ loadTopologyConfigData(A equipment ids)
→ syncTopologySubscription(A template)
→ SpaceTopology 渲染 A
```

### 链路二：在 A 拓扑中点击设备

```text
clickEquipWithMap(device)
→ selectObject(device)
→ applyDetailSelection(device)
→ currentSelectObj = device
→ syncTopologySessionFromDetail 发现当前不是空间，直接返回
→ topologySpace 仍是 A
→ SpaceTopology 仍显示 A
```

### 链路三：从设备详情点击关联空间 B

```text
clickName(spaceB)
→ selectObject(spaceB)
→ handleSpaceSelect(spaceB)
→ openTopologyBySpace(spaceB)
→ topologySpace 从 A 切为 B
→ 等待 B 的 templateData
→ syncTopologySessionFromDetail
→ syncTopologySpaceSnapshot(B template)
→ syncTopologyRelationSnapshot(B relation)
→ loadTopologyConfigData(B equipment ids)
→ syncTopologySubscription(B template)
→ SpaceTopology 渲染 B
```

### 链路四：关闭右侧详情

```text
showModuleInfo = false
→ syncTopologyWithDrawerVisibility
→ 如果关闭的是 topologySpace 所属空间详情，closeTopology('drawer')
→ 如果关闭的是设备详情，保留左侧拓扑
```
