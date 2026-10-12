# SystemsAndControl 组件百科

## 概述

SystemsAndControl 模块用于搭建一体化的系统监控界面，整合了关联图、三维/空间地图、运行控制、异常事件以及设备详情抽屉等能力。通过该组件，产品团队可以快速落地完整的监测与控制流程，同时保留丰富的插槽和钩子以满足定制化需求。

核心职责：

- 根据菜单配置加载系统树，并保持当前系统与路由参数同步。
- 渲染默认关联图（Chart.vue）或替换插槽，同时对外暴露图表相关的上下文数据。
- 在关联图与三维地图（SpaceMapView）之间切换，确保选中状态与信息点映射一致。
- 驱动右侧控制面板，包括运行控制、系统指标、天气与异常事件，并根据监控权限灵活控制显示内容。
- 管理设备详情抽屉的全生命周期，涵盖数据准备、物联网订阅、视频联动等流程。

## 目录结构

```
SystemsAndControl/
  index.vue                 根组件，负责装配各区域并暴露插槽
  LeftHeader.vue            默认头部，实现系统切换与视图切换
  Chart.vue                 默认关联图实现
  Control.vue               默认运行控制卡片
  SystemData.vue            默认系统指标面板
  Legend.vue                默认图例实现
  components/               天气、参数、指标展示等子组件
  constant/                 监控状态等共享枚举
  hooks/                    数据编排相关的组合式函数
  types/                    公共枚举、Props、Emit 定义
```

## 组件属性

| 属性 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------- | ----- |
| menuCode | string | 必填 | 通过 getMenuConfig 解析系统树。 |
| subscribeType | string | 必填 | 设备详情抽屉订阅所需的类型。 |
| runningMonitorType | string | 必填 | 运行监控类型，向图表、抽屉及全局头部同步。 |
| productCode | string | 无 | 可选的产品/过滤上下文。 |
| headerProps | Partial<HeaderProps> | {} | 合并到 LeftHeader.vue，可配置标签、禁用视图等。 |
| chartProps | Partial<ChartProps> | {} | 传给 Chart.vue，可自定义悬停、图例、点击前置逻辑。 |
| spaceMapProps | Partial<SpaceMapProps> | {} | 传给 SpaceMapView，可覆写数据查询和排序。 |
| systemDataProps | Partial<SystemDataProps> | {} | 传给 SystemData.vue，可控制监控面板/温度卡片。 |
| operatingMonitoringProps | Record<string, any> | {} | 运行监控抽屉页签的附加配置。 |
| abnormalTabBoxProps | Record<string, any> | {} | 异常事件抽屉页签的附加配置。 |
| commonDrawerProps | Record<string, any> | {} | 透传给 CommonDrawer 的通用参数（宽度、标签等）。 |
| tabs | Array<{ id: ControlTabsEnum; name: string; slotName?: string }> | 运行控制+异常事件 | 自定义右侧面板页签。 |
| useDefaultChart | boolean | true | 设为 false 完全替换默认关联图。 |
| useDefaultSpaceMap | boolean | true | 设为 false 替换默认空间地图。 |
| mainGrapTypeCode | string | 无 | 转交给关联图接口的 graphTypeCode。 |
| abnormalEventList | any[] | [] | 用于异常事件徽标与图表叠加。 |
| classCodeEquipIdsMap | Record<string, string[]> | {} | 跳过默认图表时，可注入外部的设备映射。 |
| hasIndoorTemperature | boolean | false | 控制是否展示室内温度信息。 |
| hasOutdoorTemperature | boolean | false | 控制是否展示户外天气信息。 |
| getDataFn | () => HttpResponse<SystemControlNode[]> | getMenuConfig | 自定义系统树获取接口。 |
| customFetchMenuConfigFn | (systems) => { systemList, currentSystem } | 无 | 自定义系统列表解析与初始选中。 |
| customVisibilityRulesFn | (tabsRef, monitoringStatus) => void | 无 | 动态控制右侧页签可见性。 |
| customOperatingControlShowRulesFn | (showRef, templateData) => void | 无 | 扩展运行控制页签的展示逻辑。 |
| customControlIsEmptyFn | () => boolean | 无 | 自定义判断右侧面板是否为空。 |

更多字段说明可参考 [types/props.ts](src/views/Common/SystemsAndControl/types/props.ts)。

## 事件

组件事件全部封装在枚举 [types/emits.ts](src/views/Common/SystemsAndControl/types/emits.ts) 中，确保调用方与内部字符串常量保持一致。

### ChartEvent

- ChartEvent.OpenEquipment：当关联图或空间地图选中设备时触发，附带扩展后的 EquipmentData（包含 systemObjectId、systemClassCode）。
- ChartEvent.CloseEquipment：取消选中时触发，可携带布尔参数区分关闭方式。
- ChartEvent.ObjectIdAndInfoCodes：返回图加载时解析出的 objectId 与信息点编码映射。
- ChartEvent.ClassCodeEquipIdsMap：返回类型编码与设备 ID 的映射，含打包节点下的从属设备。
- ChartEvent.AfterChartEquipsLoaded：图表设备加载完成后提供 systemInfo 与 equipsClassCodes。

### IndexEvent

- IndexEvent.Finally：系统树获取结束后无论成功与否都会触发，参数为 systemList 与 currentSystem。
- IndexEvent.OpenBoard：SystemData.vue 内部触发，表示用户点击进入监控看板。
- IndexEvent.SystemDetailLoaded：设备详情数据加载完毕时触发，便于外部联动。

在模板中监听事件时请使用短横线格式，例如 @open-equipment。

## 插槽

组件在多个区域暴露插槽以支持深度定制：

- header、left-content、subHeader、right-content、right-tabs：定制头部布局与快捷操作。
- relation-chart：替换整块关联图区域，插槽参数包含 bindObj 与 systemLoading。
- legend：在保留默认图表的情况下自定义图例渲染。
- model-view-map：替换三维/空间地图渲染，同样接收 bindObj。
- map-legend：自定义 SpaceMapView 内部的图例内容。
- operating-control：替换运行控制主内容。
- system-data：用自定义组件展示系统指标，复用 runParams、chartsData、systemId。
- weather：替换天气组件。
- abnormal：自定义异常事件页签。
- no-data：系统列表为空时的占位内容。
- equipment-info：完全替换设备抽屉，自行控制展开状态与关闭逻辑。
- operatingControl、extra-panes、equipAbnormalList、extra-icon：透传自 CommonDrawer 的子插槽，便于扩展抽屉页签。

所有插槽都会得到 index.vue 内计算的 bindObj，可直接访问 mapSpaceList、handleEquipInit、controlData 等共享状态。

## 内部组合式函数

- useBaseDataHook：负责菜单数据拉取、系统树解析、监控状态同步，并在完成后触发 IndexEvent.Finally。
- useChartHook：处理关联图生命周期，包括图例衍生、物联网数据获取、点击行为等，并向外发射 ChartEvent。
- useSpaceMapHook：维护三维空间数据、当前选中的设备与空间映射。
- useControlBoardHook：加载右侧面板所需的运行控制、系统指标、天气与异常事件数据，支持权限差异化。
- useEquipmentInfoHook：管理设备抽屉状态，补全楼层信息、克隆设备数据并发射开关事件。
- useMonitorPlayer：在选中设备为摄像头时处理监控视频播放。
- useEchartsPie、useAbnormalEventHook 等：支撑子组件图表与异常事件列表的专用逻辑。

在自定义插槽时建议确认上述钩子暴露的状态，以便与内部逻辑保持对齐，例如 space3dSelectData、notifyList、chartsData 等。

## 数据流程与生命周期

1. 挂载：useBaseDataHook 根据 menuCode 调用接口，期间显示骨架。完成后初始化 systemList、currentSystem，并触发 IndexEvent.Finally。
2. 头部：systemId、currentSystem、viewMode 与 LeftHeader 双向绑定，切换系统会触发链路刷新。
3. 图表与地图：Chart.vue 借助 useChartHook 加载图数据、解析信息点并发射设备映射；SpaceMapView 复用 bindObj，实现视图切换时保持选中。
4. 右侧面板：默认包括运行控制与异常事件，监控状态会控制页签是否展示，数据通过 useControlBoardHook 分系统缓存。
5. 设备抽屉：useEquipmentInfoHook 负责富化数据、打开 CommonDrawer，并结合 useObjectInfoDataByTemplateHook 获取模板详情；关闭时会同步取消图表选中。
6. 清理：组件卸载时停止尺寸监听、取消网络请求、移除总线监听，并恢复异常事件策略。

## 使用示例

```vue
<script setup lang="ts">
import SystemsAndControl, { ChartEvent, IndexEvent, ChartEvent as SystemsChartEvent } from '@/views/Common/SystemsAndControl/index.vue';
import type { IndexProps } from '@/views/Common/SystemsAndControl/types/props';

const props: IndexProps = {
  menuCode: 'LightingSystemMenu',
  subscribeType: 'lighting',
  runningMonitorType: 'INDOOR_LIGHTING',
  hasOutdoorTemperature: true,
};

const handleOpen = (event: SystemsChartEvent, payload: any) => {
  if (event === SystemsChartEvent.OpenEquipment) {
    // 在此对接 AI 助手或其他看板
  }
};
</script>

<template>
  <SystemsAndControl
    v-bind="props"
    @open-equipment="handleOpen(ChartEvent.OpenEquipment, $event)"
    @finally="(list, current) => console.log(list, current)"
  />
</template>
```

监听事件时请使用短横线形式，例如 @open-equipment；引入枚举可以避免字符串拼写差异。

## 接入检查清单

- 必须提供有效的 menuCode 与 subscribeType，否则组件不会展示数据。
- 确保全局插件已注册：Vue Router、Pinia/Vuex（供 useStore、treeBuildFloor 使用）、I18n，以及内部依赖的 UI 组件库。
- 确认 getMenuConfig、getInfoCodeDataTimeAndPrecisionType、listObjectsByTackValueLogic 等接口可达，网络错误目前仅在控制台输出。
- 若关闭默认关联图或地图，需要自行提供 classCodeEquipIdsMap、objectIdAndInfoCodes 等关键数据以保证后续逻辑正常。
- 监听 IndexEvent.Finally 以在基础数据就绪后启动外部逻辑。

## 扩展建议

- 通过 tabs 属性和对应插槽重构右侧面板。
- 在 chartProps.beforeClickNode 与 chartProps.enableHoverGroup 中自定义节点交互。
- 使用 equipment-info 插槽重写抽屉内容，并复用插槽参数中的 equipmentNodeActiveData、onDetailDrawerClose。
- 监听 ChartEvent.OpenEquipment 将设备上下文交给 AI 或其他业务模块。
