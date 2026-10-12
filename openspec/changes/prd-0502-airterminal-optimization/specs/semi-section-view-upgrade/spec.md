## ADDED Requirements

### Requirement: 风口参数新增阀门状态

系统必须支持送风口/回风口/新风口的运行参数中新增层阀状态展示。展示阀门的设备本地名称与阀门参数值。阀门通过 ACAirNetwork 或 FreshAirNetwork 查询。空调机组需不属于任何控制组。

#### Scenario: 空调机组送风口展示阀门参数

- **WHEN** 系统渲染空调机组的送风口参数
- **THEN** 在原有送风温度/湿度/压力/风量基础上，增加通过 ACAirNetwork Supply 查询到的电动调节风阀的开度值

#### Scenario: 空调机组回风口展示阀门参数

- **WHEN** 系统渲染空调机组的回风口参数
- **THEN** 在原有服务区域温度/湿度/CO₂基础上，增加通过 ACAirNetwork Return 查询到的电动调节风阀的开度值

#### Scenario: 新风机组送风口展示阀门参数

- **WHEN** 系统渲染新风机组的送风口参数
- **THEN** 在原有送风温度/湿度基础上，增加通过 FreshAirNetwork Fresh 查询到的电动调节风阀的开度值

### Requirement: 组合式空调机组双盘/三盘扩展

系统必须支持 AHU 最多三个盘部件。新增 yure01（二级预热段）、lengpanguan01（二级表冷段）、zairepanguan01（二级再热段），按信息点实例化规则判断显隐。原有冷盘管→冷却段、热盘管→加热段、再热盘管→加热段名称变更。

#### Scenario: 二级预热段部件显隐

- **WHEN** 系统渲染 AHU 半剖图时
- **THEN** 若 preHeat2Pos/preHeat2PosSet/preHeat2SwSet/preHeat2SwSta 任一存在实例化规则，显示 yure01 部件

#### Scenario: 二级表冷段部件显隐

- **WHEN** 系统渲染 AHU 半剖图时
- **THEN** 若 coolCoil2SwSta/coolCoil2Pos/coolCoil2SwSet/coolCoil2PosSet 任一存在实例化规则，显示 lengpanguan01 部件

#### Scenario: 二级再热段部件显隐

- **WHEN** 系统渲染 AHU 半剖图时
- **THEN** 若 reheat2SwSta/reheat2Pos/reheat2SwSet/reheat2PosSet 任一存在实例化规则，显示 zairepanguan01 部件

#### Scenario: 部件名称变更

- **WHEN** 系统渲染 AHU 半剖图时
- **THEN** 冷盘管显示为"冷却段"，热盘管和再热盘管显示为"加热段"

### Requirement: 新风机组部件扩展

系统必须支持新风机组的部件扩展（yure01/lengpanguan01/zairepanguan01），显隐规则与 AHU 一致，信息点使用 fahu 前缀。

#### Scenario: 新风机组二级预热段显隐

- **WHEN** 系统渲染新风机组半剖图时
- **THEN** 若 fahuPreHeat2SwSta/fahuPreHeat2Pos/fahuPreHeat2SwSet/fahuPreHeat2PosSet 任一存在实例化规则，显示 yure01 部件
