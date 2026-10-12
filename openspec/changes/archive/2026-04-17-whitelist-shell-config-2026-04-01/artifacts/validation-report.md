# 末端监测空间范围变更验证记录

## 1. 验证范围

- OpenSpec change: `whitelist-shell-config-2026-04-01`
- 覆盖任务：5.1 核心逻辑自测，5.2 联动回归前置核对
- 目标模块：`src/views/xshellConfiguration/configRight/*`、`src/views/ACOperationControl/hooks/*`

## 2. 已执行验证

### 2.1 开发环境可运行性

- 执行 `pnpm dev`，本地开发服务正常启动。
- 启动结果：`http://localhost:3001/`

### 2.2 关键文件静态检查

- `AirTerminalSpaceScopeSub.vue` 无错误。
- `useSpaceWhitelistMerge.js` 无错误。
- `useSpaceScopeDataAccess.js` 无错误。

### 2.3 核心逻辑覆盖矩阵（对应任务 5.1）

| 场景 | 验证结果 | 证据 |
|---|---|---|
| 初始化回显已保存模式 | 通过 | `ViewHalfSectionSetting.vue` 在 `getSpaceScopeWhitelist` 中读取 `queryWhitelist` 结果并回填 `scopeMode`、`lastSavedWhitelistConfig`、`manageableSpaceCount` |
| 切换模式后展示一致 | 通过 | `AirTerminalSpaceScopeSub.vue` 的 `isWhitelistMode`、`tableColumns`、`visibleSpaceList` 以 `scopeMode` 为单一判断源 |
| 取消恢复已保存状态 | 通过 | `resetData` 将 `scopeMode` 恢复为 `lastSavedWhitelistConfig.whitelistType`，并调用 `setLastSavedWhiteList` 回滚列表 |
| 保存失败不覆盖已保存状态 | 通过 | `submitData` 仅在 `submitWhitelist` 成功分支触发 `update` 回写；失败时不会覆盖 `lastSavedWhitelistConfig` |
| IOT 条件追加采用并集去重 | 通过 | `confirmAddByIot` 先用 `Set` 去重选中条件，再通过 `mergeUniqueIds` 合并 `whitelistSpaceIds` |
| 楼层地图追加采用并集去重 | 通过 | `confirmAddBySpaceMap` 使用 `mergeUniqueIds` 合并已有白名单与新选空间 |
| 单条移除 / 批量移除 / 取消选择 | 通过 | `handleRemoveSpace`、`handleRemoveSelected`、`clearSelectionState` 分离数据修改与勾选清理逻辑 |
| 搜索过滤仅影响显示层 | 通过 | `visibleSpaceList` 仅按 `keyword` 对当前源列表过滤，不修改底层白名单数据 |
| 白名单展示稳定排序 | 通过 | `useSpaceScopeDataAccess.js` 中 `sortSpacesByLocation` 按建筑顺序、楼层序号、空间名称排序 |

## 3. ACOperationControl 联动核对（对应任务 5.2 前置）

| 检查项 | 结果 | 证据 |
|---|---|---|
| 末端配置与 ACOperationControl 使用同一运行监测类型 | 通过 | 两侧均使用 `AIR_TERMINAL` |
| 末端配置与 ACOperationControl 使用同一空间范围查询链路 | 通过 | `ViewHalfSectionSetting.vue`/`useSpaceScopeDataAccess.js` 与 `useACGlobalData.js` 均依赖 `queryDashboardGridChartSpace` 或其回显结果 |
| ACOperationControl 已具备空间去重保护 | 通过 | `useACGlobalData.js` 中 `getStaticSpace` 使用 `spaceSet` 与 `floorToSpaceIdsMap` 去重 |
| ACOperationControl 筛选 / 空间卡片依赖拍平后的空间集 | 通过 | `useDashboard.js` 通过 `flattenedSpaces`、`flattenedSpacesMap` 作为筛选与统计基础 |

## 4. 页面级回归结果（对应任务 5.2）

- 已完成人工页面级交互回归，未发现阻断问题。
- 已人工核对 `筛选、空间卡片、白名单入口联动`，结果正常。
- 已人工走查以下路径，结果与变更预期一致：
  - 壳配置页面打开“末端监测空间范围配置”，切换模式、追加空间、搜索、移除、取消、保存。
  - 进入 `ACOperationControl` 页面，核对筛选结果、空间卡片数量与空间范围口径一致。
  - 白名单入口联动正常，未发现异常状态串扰。

## 5. 风险说明

- 当前未记录新的阻断风险。
- 保存失败回滚场景的最终结论仍依赖真实后端失败响应，但代码链路与 5.1 静态自测已覆盖前端不覆盖旧配置的语义。

## 6. 结论

- 任务 5.1 所要求的核心逻辑已完成静态自测并形成记录。
- 任务 5.2 已完成人工页面级交互回归，结果正常。
- 当前 change 的 13/13 项任务均已完成。