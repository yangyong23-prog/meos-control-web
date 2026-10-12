# GitNexus — 代码智能

本项目已通过 GitNexus 索引为 **meos-control-web**（64897 个符号，126559 个关系，300 个执行流程）。使用 GitNexus MCP 工具来理解代码、评估影响并安全导航。

> 索引已过时？从项目根目录运行 `node .gitnexus/run.cjs analyze` — 它会自动选择可用的运行器。还没有 `.gitnexus/run.cjs`？运行 `npx gitnexus analyze`（npm 11 崩溃 → `npm i -g gitnexus`；#1939）。

## 必须执行

- **编辑任何符号前必须运行影响分析。** 在修改函数、类或方法之前，运行 `impact({target: "symbolName", direction: "upstream"})` 并向用户报告影响范围（直接调用者、受影响的流程、风险级别）。
- **提交前必须运行 `detect_changes()`** 以验证您的更改仅影响预期的符号和执行流程。进行回归审查时，与默认分支比较：`detect_changes({scope: "compare", base_ref: "master"})`。
- **如果影响分析返回高或严重风险，必须警告用户** 再继续编辑。
- 探索不熟悉的代码时，使用 `query({search_query: "概念"})` 查找执行流程，而不是 grep。它返回按相关性排序的按流程分组的结果。
- 需要特定符号的完整上下文时 — 调用者、被调用者、参与的执行流程 — 使用 `context({name: "symbolName"})`。
- 安全审查时，`explain({target: "文件或符号"})` 列出污点发现（源→汇流；需要 `analyze --pdg`）。

## 禁止操作

- 禁止未先运行 `impact` 就编辑函数、类或方法。
- 禁止忽略影响分析的高或严重风险警告。
- 禁止使用查找替换重命名符号 — 使用理解调用图的 `rename`。
- 禁止未运行 `detect_changes()` 检查影响范围就提交更改。

## 技能

| 任务 | 技能 |
|------|------|
| 理解架构 / "X 是如何工作的？" | `gitnexus-exploring` |
| 影响范围 / "如果我改变 X 什么会破坏？" | `gitnexus-impact-analysis` |
| 追踪错误 / "为什么 X 失败？" | `gitnexus-debugging` |
| 重命名 / 提取 / 拆分 / 重构 | `gitnexus-refactoring` |
| 工具、资源、模式参考 | `gitnexus-guide` |
| 索引、状态、清理、wiki CLI 命令 | `gitnexus-cli` |
