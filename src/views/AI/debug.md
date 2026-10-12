# AI 模块排查说明

## 1. 当前确认的两条问题链路

### 1.1 首页重新计算后仍展示旧数据

根因结论：

- 首页不活跃时，刷新判定只看最新 `jobResult(dataOffset=0)` 返回的第一条策略 code，位置在 `src/views/AI/components/home/index.vue` 的 `AI-compute-end` 分支。
- 当前判定逻辑是：只要最新第一条 code 还能在当前 `strategyOverview[0].stgyCodeList` 里命中，就不会调用 `getLastStrategyOverview()`。
- 这意味着以下情况都会被误判成“无需刷新”：
  - code 不变，但策略详情 `content` 变了
  - `idBest / isBest` 变了
  - `startTime / endTime` 变了
  - `valueSelectType` 变了
  - 第二组、第三组策略变了，但第一组第一条 code 没变

这条链路依赖的数据：

- `showHomeView`
- `strategyOverview`
- `currentSystemId`
- `headerCenterState`
- `computeEndTime`
- `broadcastEndTime`

这条链路相关接口：

- `/strategy/jobResult`
- `/strategy/detail`
- `/strategy/jobState`
- `/ai/getDemandConfig`
- `/valueSelection/currentApplyConfig`

### 1.2 最终策略选择前端没展示出来

根因结论：

- 右侧“最终策略选择”不是单独请求一个接口，而是前端从当前最佳策略 `bestStrategy.content.data[0]` 里二次组装。
- `nextColdCard` 依赖 `stgyCSDetail`、`predACAC[currentSystemId]`、模板配置 `mpcFinalStrategySelection`、信息点字典、冷机编码定义。
- `nextEndCard` 依赖 `stgySpace`、`predACAC[currentSystemId]` 和当前时刻对应的下一个索引 `nextIndex`。
- 只要下面任一条件不满足，右侧就可能出现“暂无数据”或局部不展示：
  - 当前策略里没有 `isBest = true`
  - `/strategy/detail` 没返回 `stgyCSDetail`
  - `/strategy/detail` 没返回 `predACAC[currentSystemId]`
  - `/strategy/detail` 没返回 `stgySpace`
  - 当前时间已经晚于所有 `stgyCSDetail.time`，导致 `nextIndex` 为 `null`
  - `mpcFinalStrategySelection` 模板未加载到
  - `/knowledge/listInfoCodes` 没有字段定义
  - `/demandStrategy/listScheduleInfoCodeDefine` 没有当前系统类型的冷机定义

这条链路依赖的数据：

- `strategyOverviewTemp`
- `activeStrategyIndex`
- `broadcastAndComputeEndTime`
- `currentSystemId`
- `infoCodeMap`
- `templateConfigs.mpcFinalStrategySelection`
- `chillerCodeDefine`

这条链路相关接口：

- `/strategy/detail`
- `/infoCodeConfig/listInfoCodeConfigsByObjectId?WEB_CONFIG`
- `/knowledge/listInfoCodes`
- `/demandStrategy/listScheduleInfoCodeDefine`

## 2. 额外可疑点

### 2.1 `getLastStrategyOverview` 的系统开关状态赋值不一致

在 `src/views/AI/hooks/useStaticData.js` 中：

- 初始加载 `getStrategyOverview()` 里，运行状态赋值是：
  - `strategyOverview.value[i].IsSystemOpen = data.IsSystemOpen`
  - `strategyOverview.value[i].IsCoolingStorageOpen = data.IsCoolingStorageOpen`
- 但最新刷新 `getLastStrategyOverview()` 里，当前代码是：
  - `res.data.IsSystemOpen = data`

这会把整个对象写进 `IsSystemOpen`，结构和初始加载不一致，可能影响左侧策略生成卡片里依赖布尔值的展示逻辑。

## 3. 建议的排查顺序

1. 先抓 `AI-compute-end` 到达时，前端本地 `strategyOverview[0]` 和最新 `jobResult(dataOffset=0)` 的差异，重点看 `startTime / endTime / stgyCodeList / idBest`。
2. 再抓 `/strategy/detail` 返回的最佳策略，确认是否包含：
   - `stgyCSDetail`
   - `predACAC[currentSystemId]`
   - `stgySpace`
3. 再确认模板和字典是否成功返回：
   - `mpcFinalStrategySelection`
   - `listInfoCodes`
   - `listScheduleInfoCodeDefine`

## 4. 调试日志开关

本次新增的调试日志默认在开发环境输出。

如果要在 QA 或生产环境手动开启，可在浏览器控制台执行：

```js
window.__MEOS_AI_DEBUG__ = true;
```

关闭：

```js
window.__MEOS_AI_DEBUG__ = false;
```