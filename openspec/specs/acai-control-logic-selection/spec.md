# Capability: acai-control-logic-selection

## Purpose
定义 ACAI 在冷热源控制逻辑选机条件输入中的分类扩展、参数显隐和保存回显能力。细节以产品与后端契约为准。

## Requirements

### Requirement: 控制逻辑分类扩展
系统 MUST 在“控制逻辑条件输入-冷热源控制逻辑选机条件输入”下新增三级分类“中央空调冷热源全系统”，且排序位于“中央空调供热全系统”之后。

#### Scenario: 控制逻辑分类加载
- **WHEN** 页面加载控制逻辑分类树
- **THEN** 用户可见“中央空调冷热源全系统”且顺序符合 PRD 定义

### Requirement: ACAI 参数渲染与显隐
系统 MUST 在 ACAI 分类下渲染“冷机与热泵”参数，并且显隐 MUST 由后端返回数据驱动。

#### Scenario: 后端返回可显示
- **WHEN** 后端返回 ACAI 分类下“冷机与热泵”可显示
- **THEN** 页面展示参数并允许编辑

#### Scenario: 后端返回隐藏
- **WHEN** 后端返回 ACAI 分类下“冷机与热泵”隐藏
- **THEN** 页面不渲染该参数且不提交其值

### Requirement: ACAI 控制逻辑持久化
系统 MUST 将 ACAI 分类字段纳入控制逻辑保存 payload，并与后端约定结构保持一致。

#### Scenario: 用户保存 ACAI 控制逻辑
- **WHEN** 用户在 ACAI 分类完成配置并点击保存
- **THEN** 请求 payload 包含 ACAI 对应字段且字段值与页面输入一致

#### Scenario: 历史配置回显
- **WHEN** 页面加载已保存的 ACAI 控制逻辑
- **THEN** 参数回显与保存值一致，不影响 ACAC/ACAH 既有回显
