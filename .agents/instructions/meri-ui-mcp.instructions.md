# meos-control-web 项目级指令：meri-plus MCP 优先

你正在 `meos-control-web` 项目中协助开发。**当任务涉及 meri-plus 组件增删查改（新增、删除、查询、修改）时，必须优先调用 meri-plus MCP 服务**，再进行代码实现。

## 1 适用范围（项目级）

- 适用于本项目内所有 AI 开发任务。
- 触发场景包括但不限于：
  - `m-*` 组件的 props / emits / 插槽 / 样式行为调整
  - meri-plus 组件替换、扩展、封装、问题排查
  - Figma 设计映射到 meri-plus 组件

## 2 强制执行顺序（先 MCP，后改码）

当任务命中上述场景时，严格按以下顺序调用 meri-plus MCP：

1. `list_components`：确认可用组件清单
2. `get_component_doc(componentName)`：确认组件 API、示例和约束
3. `get_component_code(componentName)`：确认源码实现细节（必要时）
4. `get_component_style(componentName)`：确认样式来源与覆盖方式（涉及样式时）

> 仅在“纯文案改动且不涉及组件 API / 行为 / 样式”时可跳过完整链路。

## 3 交付要求

- 优先复用已有 meri-plus 组件能力，避免凭经验直接改。
- 以最小改动完成需求，不做无关重构。
- 在结果说明中明确：
  - 是否调用了 meri-plus MCP
  - 调用了哪些信息（文档/源码/样式）
  - 结论来源（MCP 文档或项目现有代码）

## 4 约束

- 不随意新增依赖。
- 不随意变更公共 API（props / emits / class）除非需求明确。
- 先对齐组件文档语义，再落地代码，避免 API 误用。
