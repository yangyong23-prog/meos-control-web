## ADDED Requirements

### Requirement: 电动调节风阀查询

系统必须支持电动调节风阀的图形关系查询：空调机组控制组/空调机组/新风机组 → ACAirNetwork/FreshAirNetwork → 电动调节风阀。空调设备根据监控监测=2 或 3 过滤。

#### Scenario: 查询空调机组控制组关联的电动调节风阀

- **WHEN** 系统查询与空调机组控制组关联的电动调节风阀
- **THEN** 系统根据 ACAirNetwork 的 Supply/Return/ReandEx 边类型返回关联阀门列表

#### Scenario: 查询无控制组的空调机组关联的电动调节风阀

- **WHEN** 系统查询与无控制组的空调机组关联的电动调节风阀
- **THEN** 系统先验证空调机组不属于任何控制组（CombineSubset/Eg2Eq），再根据 ACAirNetwork 关系查询阀门

### Requirement: 电动通断风阀查询

系统必须支持电动通断风阀的图形关系查询：排风机 → VentNetwork Discharge → 阀门 → 多层循环。根据监控监测=2 或 3 过滤。

#### Scenario: 查询通风网络中关联的电动通断风阀

- **WHEN** 系统查询通风设备中的电动通断风阀
- **THEN** 系统先查服务空间的排风机，再通过 VentNetwork Discharge 边类型循环查询关联阀门直至无更多设备

### Requirement: 通风风机查询

系统必须支持通风风机的查询，取空调接力风机、排风机、动态归类三种逻辑的并集。

#### Scenario: 查询空调设备中的接力风机

- **WHEN** 系统查询空调设备中的接力风机
- **THEN** 系统返回与空调机组/新风机组有 ACAirNetwork Supply 或 FreshAirNetwork Fresh 关系且 funcType=8 的通风风机

#### Scenario: 查询通风设备中的排风机

- **WHEN** 系统查询通风设备中的排风机
- **THEN** 系统返回 funcType=2/6/7 且有服务空间关系（MechForArch/Eq2Sp）的设备

### Requirement: 楼层地图新设备类显示

楼层地图必须支持新设备类的显示规则：ACATHT 按非运行状态颜色渲染显示；ACAHG、电动调节风阀、电动通断风阀不在地图显示。地图统计必须增加 ACATHT 统计。

#### Scenario: 风管式再热装置在地图中显示

- **WHEN** 楼层地图渲染时
- **THEN** ACATHT 设备显示在地图上，按非运行状态颜色渲染

#### Scenario: 空调机组控制组不在地图显示

- **WHEN** 楼层地图渲染时
- **THEN** ACAHG、电动调节风阀、电动通断风阀不显示在地图上

#### Scenario: 地图交互-选中有关联控制组的空调机组

- **WHEN** 用户在地图中点击有关联 ACAHG 的空调机组
- **THEN** 系统弹出 ACAHG 设备详情，地图中选中该控制组下所有空调机组

#### Scenario: 地图交互-选中无关联控制组的空调机组

- **WHEN** 用户在地图中点击无关联 ACAHG 的空调机组
- **THEN** 系统弹出该空调机组自身的设备详情

### Requirement: 楼层地图压力数据展示

楼层地图必须新增压力数据的展示：与其它空间的相对压差 relativePressureDiffToOtherSpace，获取不到时展示 --。

#### Scenario: 地图显示压差数据

- **WHEN** 楼层地图加载空间数据时
- **THEN** 各空间展示 relativePressureDiffToOtherSpace 值，无数据时展示 --

### Requirement: 全楼模型交互同步

全楼模型的交互必须与楼层地图一致。

#### Scenario: 全楼模型交互

- **WHEN** 用户在全楼模型中操作
- **THEN** 交互逻辑与楼层地图一致（设备选中、详情弹出、控制组联动）
