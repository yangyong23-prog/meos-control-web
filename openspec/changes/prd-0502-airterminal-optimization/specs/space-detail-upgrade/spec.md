## ADDED Requirements

### Requirement: 空间 hover 新增压差数据

空间 hover 必须新增压差数据（与其它空间的相对压差）的显示。

#### Scenario: 空间 hover 显示压差

- **WHEN** 用户 hover 空间时
- **THEN** 系统展示空间的 relativePressureDiffToOtherSpace 值

### Requirement: 空间详情新增压差数据

空间详情必须新增压差数据的实时值展示和曲线数据展示。

#### Scenario: 空间详情展示压差实时值

- **WHEN** 用户打开空间详情时
- **THEN** 系统展示空间压差实时值

#### Scenario: 空间详情展示压差曲线

- **WHEN** 用户查看空间详情中的曲线数据
- **THEN** 系统提供压差曲线

### Requirement: 空间详情关联信息更新

空间详情必须按配置表新增关联设备的显示。

#### Scenario: 空间详情显示关联设备

- **WHEN** 用户打开空间详情时
- **THEN** 系统按空间详情配置表展示关联设备
