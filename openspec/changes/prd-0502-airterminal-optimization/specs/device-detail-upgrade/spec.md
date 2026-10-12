## ADDED Requirements

### Requirement: 空调机组控制组（ACAHG）设备详情

系统必须支持 ACAHG 设备详情的展示，运行监控 tab 包含：控制台、关联空调机组控制台、关联阀门控制台、运行参数、技术参数。样式同冷却塔控制单元。阀门和空调机组对象可点击跳转对应设备详情。

#### Scenario: ACAHG 详情控制台展示

- **WHEN** 用户打开 ACAHG 设备详情时
- **THEN** 系统展示聚合控制台，包含 ACAHG 自身 + 关联空调机组 + 关联阀门的控制台

#### Scenario: ACAHG 详情点击跳转

- **WHEN** 用户在 ACAHG 详情中点击阀门或空调机组对象
- **THEN** 系统跳转到对应对象的设备详情

### Requirement: 风管式再热装置（ACATHT）设备详情

系统必须支持 ACATHT 设备详情的展示，按设备详情配置表展示。

#### Scenario: ACATHT 详情展示

- **WHEN** 用户打开 ACATHT 设备详情时
- **THEN** 系统按配置表展示设备信息与控制台

### Requirement: 空调机组详情升级

系统必须根据空调机组是否关联 ACAHG 决定详情展示模式。无关联时展示自身控制台；有关联时展示 ACAHG 控制台 + 自身控制台 + 运行参数/技术参数，同串联冷机组规则。空调机组的"关联设备"中增加接力风机和通风风机的监测与控制。

#### Scenario: 有关联 ACAHG 的空调机组详情

- **WHEN** 用户打开有关联 ACAHG 的空调机组详情
- **THEN** 系统展示 ACAHG 控制台、空调机组控制台、运行参数及技术参数

#### Scenario: 无关联 ACAHG 的空调机组详情

- **WHEN** 用户打开无关联 ACAHG 的空调机组详情
- **THEN** 系统按配置展示自身控制台

### Requirement: 设备列表与设备 hover

系统必须支持 ACAHG 和 ACATHT 在设备列表与 hover 中的展示。

#### Scenario: ACAHG 和 ACATHT 设备列表展示

- **WHEN** 设备列表加载时
- **THEN** 系统显示 ACAHG 和 ACATHT 设备条目及控制操作

#### Scenario: ACAHG 和 ACATHT 设备 hover

- **WHEN** 用户 hover ACAHG 或 ACATHT 设备
- **THEN** 系统展示配置的 hover 信息
