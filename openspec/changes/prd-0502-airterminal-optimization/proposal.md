## Why

当前末端系统需要支持新设备类（电动风阀、通风风机、风管式再热装置、空调机组控制组）的监测与控制，同时升级半剖图部件扩展能力和新设备类运行日志。

## What Changes

- 新增电动调节风阀、电动通断风阀、通风风机、风管式再热装置、空调机组控制组的查询逻辑与图形关系
- 新增设备详情/空间详情/设备hover/设备列表/拓扑配置的6张配置表更新
- 楼层地图、全楼模型、设备列表/详情、空间hover/详情适配新设备类
- 半剖图升级：风口阀门参数展示、组合AHU双盘扩展、新风机组扩展
- 新设备类运行日志接入与新图标

## Capabilities

### New Capabilities
- `new-device-type-integration`: 新设备类查询逻辑、配置表与楼层地图/全楼模型适配
- `device-detail-upgrade`: ACAHG/ACATHT/AHU 设备详情与设备列表
- `space-detail-upgrade`: 空间 hover 与空间详情新增压差及关联设备
- `semi-section-view-upgrade`: 半剖图风口阀门参数与AHU/新风机组部件扩展
- `device-icons-and-logs`: 新设备类图标与运行日志接入

### Modified Capabilities

- 无

## Impact

- 受影响应用：主应用 `src/`（ACOperationControl 相关页面）
- 受影响范围：楼层地图、设备列表、设备详情、空间详情、半剖图、运行日志
- 依赖协同：后端新设备类图形查询 DTO、6 张配置表、日志接口
