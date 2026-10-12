## Why

现有壳配置能力尚未覆盖 PRD 0302 中“空调冷热源全系统（ACAI）”新增参数与分类，导致 ACAI 场景无法完成参数配置、控制逻辑联动与一致性持久化。需要基于最新 PRD 与参数映射表，明确前后端责任边界并重建可实施的 OpenSpec 产物。

## What Changes

- 在“自动化需求计算条件输入”下新增 ACAI 相关二级分类、参数分组与表单类型映射，覆盖映射表 A 节 106 条参数。
- 新增 ACAI 参数组的前端状态模型治理规则，确保每个二级分类具备完整状态字段组并避免字段复用冲突。
- 在“控制逻辑条件输入”中新增 ACAI 三级分类与“冷机与热泵”参数渲染/持久化能力，显隐逻辑由后端数据驱动。
- 明确设备组过滤（含 Sy2Eg 关系）由后端实现，前端不新增过滤算法，仅消费后端返回结果并按系统类渲染。
- 基于以上需求重写本变更的设计与实施任务，形成可直接执行的实现清单。

## Capabilities

### New Capabilities
- `acai-auto-demand-config`: ACAI 自动化需求计算条件输入的分类、参数映射、状态字段治理与校验规则。
- `acai-control-logic-selection`: 控制逻辑页面新增 ACAI 分类与“冷机与热泵”参数渲染及持久化契约。
- `acai-device-group-filtering`: 设备组取数责任边界与前端消费约束（后端过滤、前端透传展示）。

### Modified Capabilities
- 无

## Impact

- 受影响范围：壳配置页面 ACAI 参数分组渲染、表单校验、状态命名空间、控制逻辑分类渲染与持久化 payload。
- 受影响文档：`openspec/changes/acai-shell-config-params-0302/design.md`、`openspec/changes/acai-shell-config-params-0302/specs/**/spec.md`、`openspec/changes/acai-shell-config-params-0302/tasks.md`。
- 依赖与边界：设备组过滤及参数显隐细节依赖后端返回；`backend_code` 与部分字段命名待后端最终确认。
