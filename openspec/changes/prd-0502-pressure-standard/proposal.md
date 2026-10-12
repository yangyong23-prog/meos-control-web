## Why

系统需适配压差标准，包括在空调运行标准中新增压差配置、黑名单增加压差过滤能力，并在 Dashboard/模型视角/品质视图/临时需求中消费压差标准。

## What Changes

- 环境品质目标新增压差标准配置：全局开关、压差上下限、数值校验
- 黑名单"按IOT监测"新增"未交付压差数据的空间"选项
- Dashboard 新增压差分布统计环图与空间列表压差筛选染色
- 模型视角新增压差分布统计（全楼/楼层）
- 品质视图新增压差空间染色
- 临时需求新增压差目标设定与查看
- 需求目标新增压差标准显示
- 运行标准查看新增压差标准展示
- 配套国际化翻译

## Capabilities

### New Capabilities
- `pressure-standard-configuration`: 环境品质目标压差标准配置与黑名单压差过滤
- `pressure-standard-consumption`: Dashboard/模型视角/品质视图/临时需求/需求目标中的压差标准消费

### Modified Capabilities

- 无

## Impact

- 受影响应用：主应用 `src/`（空调运行标准配置、黑名单配置、Dashboard、模型视角、品质视图、临时需求配置页面）
- 依赖协同：空调模板压差启用状态、/interventionTaskConfig/list 接口、品质标准查询接口补压差字段
