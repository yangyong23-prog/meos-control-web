# Capability: acai-device-group-filtering

## Purpose
定义 ACAI 设备组过滤与展示的前后端责任边界，以及空数据和异常场景下的前端兜底要求。细节以后端契约为准。

## Requirements

### Requirement: 设备组过滤责任边界
系统 MUST 将设备组过滤逻辑定义为后端职责，前端 MUST NOT 在本次能力中新增基于系统类或 Sy2Eg 关系的二次过滤算法。

#### Scenario: 前端接收到设备组列表
- **WHEN** 后端返回符合过滤条件的设备组数据
- **THEN** 前端直接按返回结果渲染，不进行额外过滤裁剪

### Requirement: ACAI 相关设备组展示
系统 MUST 支持展示后端返回的 ACAI 关联设备组，包括 ACCPC、ACOPC、ACOTC、ACCGP、ACCST、ACHPC、ACPPC。

#### Scenario: ACAI 设备组列表返回完整
- **WHEN** 后端返回 ACAI 关联设备组集合
- **THEN** 页面可在对应配置区域正确展示各设备组实例

### Requirement: 异常与空数据兜底
系统 MUST 在设备组接口返回空列表或异常时提供稳定兜底展示，并保持页面可继续操作。

#### Scenario: 返回空列表
- **WHEN** 后端返回空设备组集合
- **THEN** 页面展示空态提示且不报错

#### Scenario: 接口异常
- **WHEN** 设备组接口请求失败
- **THEN** 页面展示错误提示并允许用户重试
