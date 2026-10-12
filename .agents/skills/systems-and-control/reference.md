# SystemsAndControl 完整 API 参考

## Props

### 主组件 Props（IndexProps）

| 属性 | 类型 | 默认值 | 必传 | 说明 |
|------|------|--------|------|------|
| menuCode | `string` | - | 是 | 菜单 Code，决定系统树与默认系统 |
| noSystemCotrolPanel | `boolean` | - | 是 | 是否不展示控制面板（注意拼写） |
| subscribeType | `string` | - | 是 | SSE 订阅类型 |
| runningMonitorType | `string` | - | 是 | 运行监控类型 |
| systemClassCode | `SystemClassCode` | - | 是 | 系统类型（`'ACAC'|'ACAI'|'ACAH'|string`） |
| consoleTypeMap | `ConsoleTypeMap` | - | 有控制面板时必传 | 控制台类型配置 |
| handleSpecialInfoCodesDataSourcesFn | `(infoCode: string) => Array` | - | 有控制面板时必传 | 特殊信息编码数据源处理 |
| headerProps | `Partial<HeaderProps>` | `{}` | 否 | 头部配置（如 `showUpdateTime`） |
| chartProps | `Partial<ChartProps>` | `{}` | 否 | 关系图配置 |
| spaceMapProps | `Partial<SpaceMapProps>` | - | 否 | 空间地图配置 |
| systemDataProps | `Partial<SystemDataProps>` | - | 否 | 系统数据面板配置 |
| operatingMonitoringProps | `Record<string, any>` | - | 否 | 运行监控页签附加参数 |
| abnormalTabBoxProps | `Record<string, any>` | - | 否 | 异常事件页签附加参数 |
| commonDrawerProps | `Record<string, any>` | - | 否 | 设备抽屉通用配置 |
| controlPanelProps | `Record<string, ControlProps>` | - | 否 | 控制面板通用配置 |
| systemParamsSetProps | `SystemParamsSetProps` | - | 否 | 系统参数设置配置 |
| productCode | `string` | - | 否 | 产品/模块过滤条件 |
| useDefaultChart | `boolean` | `true` | 否 | 是否挂载默认关系图 |
| useDefaultSpaceMap | `boolean` | `true` | 否 | 是否挂载默认空间地图 |
| abnormalEventList | `any[]` | - | 否 | 异常事件数据源 |
| mainGrapTypeCode | `string` | - | 否 | 主图 graphTypeCode |
| tabs | `Array<{id, name, slotName?}>` | 运行控制+异常事件 | 否 | 右侧控制面板页签 |
| classCodeEquipIdsMap | `Record<string, string[]>` | - | 否 | 禁用默认图表时可注入 |
| hasIndoorTemperature | `boolean` | - | 否 | 展示室内温度 |
| hasOutdoorTemperature | `boolean` | - | 否 | 展示室外天气 |
| hasNotify | `boolean` | - | 否 | 展示通知列表 |
| runParamKey | `string` | `GROUP_CODE_KEY_MAP.x1stTag3` | 否 | 运行参数字段名 |
| disabilityAlarmResetKey | `string` | - | 否 | 告警重置字段名 |
| sortByInfoCode | `Record<string, number>` | - | 否 | 信息编码排序配置 |
| getDataFn | `() => HttpResponse` | - | 否 | 自定义系统树请求 |
| customFetchMenuConfigFn | `(data) => {systemList, currentSystem}` | - | 否 | 自定义系统解析 |
| customVisibilityRulesFn | `(tabs, status) => void` | - | 否 | 页签显隐策略 |
| customOperatingControlShowRulesFn | `(show, templateData) => void` | - | 否 | 运行控制抽屉显隐 |
| customControlIsEmptyFn | `() => boolean` | - | 否 | 空状态判断 |
| customControlParams | `(consoleTypesData) => void` | - | 否 | 控制面板动态参数处理 |

### ChartProps（关系图配置）

| 属性 | 类型 | 说明 |
|------|------|------|
| beforeClickNode | `(obj, modal, done) => boolean` | 点击节点拦截 |
| canHoverGroupSelect | `boolean` | 允许 hover 组选择 |
| enableSelect | `(modalData) => boolean` | 是否启用选择 |
| defaultLegends | `Array<{id, name, color, bgColor}>` | 默认图例 |
| shouldHadSubGraph | `(obj, curSystemInfo) => boolean` | 判断是否有分视图 |
| needLineFlow | `boolean` | 是否需要管线流动动画 |
| lineFlowConfig | `{lineTypesInPairs, graphCodeForPumps, pumpClassCodes}` | 管线流动配置 |
| enableHoverGroup | `(obj, info) => boolean|DataObject[]` | hover 分组启用 |

### SpaceMapProps（空间地图配置）

| 属性 | 类型 | 说明 |
|------|------|------|
| querySpacesByChartObjType | `boolean` | 按关系图对象类型查询空间 |
| queryEquipsParams | `(curSystem, equipsClassCodes?) => Record` | 自定义查询参数 |
| queryEquipsApi | `(params, config?) => Promise` | 自定义查询 API |
| sortSpacesByClassCodes | `({spaces, spaceIdMapClassCodes}) => Array` | 空间排序 |
| findDefaultSpace | `(spaces, idMapClassCodes) => Record|null` | 默认空间 |

### SystemParamsSetProps（系统参数设置）

| 属性 | 类型 | 说明 |
|------|------|------|
| sseConsoleClient | `SSEClient` | SSE 客户端实例 |
| maxAndMin | `Record<string, {max, min}>` | 参数值范围限制 |
| optionsObj | `Record<string, Options>` | 参数选项配置 |
| specialInfoCodes | `string[]` | 需要特殊处理的信息编码列表 |
| specialInfoCodeKey | `Record<string, string>` | 特殊编码的 key 映射 |

---

## V-Model 双向绑定

| V-Model | 类型 | 说明 |
|---------|------|------|
| `v-model` (systemId) | `string` | 当前选中系统 ID |
| `v-model:systemClassCode` | `string` | 当前系统类型 Code |
| `v-model:viewMode` | `ViewModeEnum` | 视图模式 |
| `v-model:controlLoading` | `boolean` | 控制面板加载状态 |
| `v-model:showSpaceListDrawer` | `boolean` | 空间列表抽屉 |
| `v-model:isExpanded` | `boolean` | 展开/折叠 |
| `v-model:hideIcon` | `boolean` | 隐藏折叠图标 |

---

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| classCodeEquipIdsMap | `(data: Record<string, string[]>, type?: string)` | 设备分类与 ID 映射 |
| objectIdAndInfoCodes | `(data: Record<string, string[]>)` | 对象 ID 与信息编码映射 |
| afterChartEquipsLoaded | `({systemInfo, equipsClassCodes})` | 关系图加载完成 |
| systemDetailLoaded | `(data: EquipmentDetail)` | 系统详情加载完成 |
| controlListLoaded | `(data: Record<string, string[]>)` | 控制列表加载完成 |
| finally | `(systemList, currentSystem)` | 初始化完成 |
| openEquipment | `(data: EquipmentData)` | 打开设备抽屉 |
| closeEquipment | `(type?: boolean)` | 关闭设备抽屉 |
| openBoard | 无 | 打开运行监控面板 |
| openTimeTable | `(consoleType)` | 打开时间表 |

---

## Slots

| 插槽名 | Slot Props | 说明 |
|--------|-----------|------|
| header | - | 替换整个头部 |
| left-content | `viewMode` | 头部左侧（如运行模式标签） |
| subHeader | `viewMode` | 头部子标题 |
| right-content | `{mapSpaceList, currentMapSpaceId, externalDataLoading, isChartBaseSystem, handleEquipInit, handleEquipAllChange, handleEquipSelectChange, handleSpaceSelectChange}` | 右侧头部（空间地图交互） |
| right-tabs | `viewMode` | 右侧标签页 |
| relation-chart | `{systemLoading, ...bindObj}` | 关系图区域 |
| legend | `{defaultLegends, switchLegendData, pipelineLegendData}` | 图例 |
| map-legend | `{pipelineData}` | 空间地图图例 |
| model-view-map | `{systemLoading, ...bindObj}` | 3D 空间地图 |
| operating-control | `{...bindObj}` | 运行控制 |
| system-data | `{data, systemId, chartsData}` | 系统数据面板 |
| weather | `{weatherList}` | 天气信息 |
| abnormal | `{...bindObj, controlTabs}` | 异常事件 |
| equipment-info | `{showEquipmentInfo, selectObj, onDetailDrawerClose}` | 设备信息抽屉 |
| operatingControl | `{selectObj, curTab, res, showEquipmentInfo}` | 运行监控标签 |
| extra-panes | `{selectObj, curTab, res, showEquipmentInfo}` | 额外标签页 |
| equipAbnormalList | `{selectObj, curTab, res, showEquipmentInfo}` | 设备异常列表 |
| extra-icon | `{selectObj, openMonitorPlayer, CAMERA_CLASS_CODES}` | 抽屉额外图标 |
| no-data | - | 无数据 |
| control-component-{slotName} | `{item, manualAutoSetData, ...slotProps}` | 控制组件动态插槽 |

---

## Expose（导出）

| 属性/方法 | 类型 | 说明 |
|----------|------|------|
| systemList | `Ref<SystemControlNode[]>` | 系统列表 |
| currentSystem | `Ref<SystemControlNode|null>` | 当前系统 |
| systemId | `Ref<string>` | 当前系统 ID |
| viewMode | `Ref<ViewModeEnum>` | 视图模式 |
| consoleTypesData | `Ref<ConsoleTypes>` | 控制台类型数据 |
| currentConsoleTypeId | `Ref<string>` | 当前控制台类型 ID |
| chillerData | `Ref<ChillerData>` | 冷机数据 |
| codeDefine | `Ref<Record>` | 信息点字典 |
| chart | `Ref<Chart>` | 关系图实例 |
| ControlRef | `Ref<Control>` | 控制面板实例 |
| changeData | `(type, data) => void` | 改变系统/视图 |
| querySpaceList | `(systemId, curSystem, equipsClassCodes?) => Promise` | 查询 3D 空间 |
| getCodeDefineConfig | `(code, systemClassCode?) => CodeConfig|null` | 获取信息点定义 |
| openSpaceList | `(data) => void` | 打开空间列表抽屉 |
| closeSpaceList | `() => void` | 关闭空间列表抽屉 |

---

## Hooks

### useAbnormalEventHook

```ts
useAbnormalEventHook(
    data: { subscribeType: string; runningMonitorType: string },
    systemId: Ref<string>,
    classCodeEquipIdsMap: Ref<Record<string, string[]>>
) => {
    equipmentIds: Ref<string[]>,
    abnormalEventList: Ref<unknown[]>,
    abnormalEventListLoading: Ref<boolean>,
    abnormalEventListUpdateTime: Ref<string>,
    abnormalEventListLoadedTime: Ref<string>
}
```

### useRelationChartSSEHook / useSystemDetailSSEHook

每个系统页面需在 `hooks/useSSEHook.ts` 中创建，典型签名：

```ts
useRelationChartSSEHook(subscribeType: string) => {
    setRelationChartSSEClientOption: (classCodesData, objectIdAndInfoCodes?) => void
}

useSystemDetailSSEHook(subscribeType: string) => {
    sseClient: SSEClient,
    setSystemDetailSSEClientOption: (data: Record<string, string[]>) => void
}
```

---

## 枚举

```ts
enum ViewModeEnum {
    GRAPH_CODE = 'Graph',
    MAP_VIEW = 'MapView'
}

enum CompTypeEnum {
    PACK_NODE = 'PackNode'
}

enum ConsoleTypesEnum {
    COOL_SUPPLY = 'COOL_SUPPLY',
    COOL_INPUT = 'COOL_INPUT',
    HEAT_SUPPLY = 'HEAT_SUPPLY',
    AIR_TERMINAL_ZONE = 'AIR_TERMINAL_ZONE'
}

enum ControlTabsEnum {
    OPERATING_CONTROL = 'OPERATING_CONTROL',
    ABNORMAL = 'ABNORMAL'
}
```
