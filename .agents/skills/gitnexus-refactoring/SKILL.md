---
name: gitnexus-refactoring
description: "当用户想要安全地重命名、提取、拆分、移动或重构代码时使用。例如：\"重命名这个函数\"、\"将此提取为模块\"、\"重构这个类\"、\"将此移动到单独的文件\""
---

# 使用 GitNexus 进行重构

## 何时使用

- "安全地重命名这个函数"
- "将此提取为模块"
- "拆分这个服务"
- "将此移动到新文件"
- 任何涉及重命名、提取、拆分或重构代码的任务

## 工作流

```
1. impact({target: "X", direction: "upstream"})  → 映射所有依赖项
2. query({search_query: "X"})                            → 查找涉及 X 的执行流程
3. context({name: "X"})                           → 查看所有传入/传出引用
4. 规划更新顺序：接口 → 实现 → 调用者 → 测试
```

> 如果"索引已过时" → 在终端运行 `node .gitnexus/run.cjs analyze`。

## 检查清单

### 重命名符号

```
- [ ] rename({symbol_name: "oldName", new_name: "newName", dry_run: true}) — 预览所有编辑
- [ ] 查看图谱编辑（高置信度）和 text_search 编辑（仔细审查）
- [ ] 如果满意：rename({..., dry_run: false}) — 应用编辑
- [ ] detect_changes() — 验证只有预期文件更改
- [ ] 运受影响流程的测试
```

### 提取模块

```
- [ ] context({name: target}) — 查看所有传入/传出引用
- [ ] impact({target, direction: "upstream"}) — 查找所有外部调用者
- [ ] 定义新模块接口
- [ ] 提取代码，更新导入
- [ ] detect_changes() — 验证影响范围
- [ ] 运受影响流程的测试
```

### 拆分函数/服务

```
- [ ] context({name: target}) — 理解所有被调用者
- [ ] 按职责对被调用者进行分组
- [ ] impact({target, direction: "upstream"}) — 映射调用者以进行更新
- [ ] 创建新函数/服务
- [ ] 更新调用者
- [ ] detect_changes() — 验证影响范围
- [ ] 运受影响流程的测试
```

## 工具

**rename** — 自动化多文件重命名：

```
rename({symbol_name: "validateUser", new_name: "authenticateUser", dry_run: true})
→ 8 个文件中的 12 处编辑
→ 10 处图谱编辑（高置信度），2 处 text_search 编辑（需审查）
→ 更改：[{file_path, edits: [{line, old_text, new_text, confidence}]}]
```

**impact** — 首先映射所有依赖项：

```
impact({target: "validateUser", direction: "upstream"})
→ d=1：loginHandler、apiMiddleware、testUtils
→ 受影响流程：LoginFlow、TokenRefresh
```

**detect_changes** — 重构后验证您的更改：

```
detect_changes({scope: "all"})
→ 更改：8 个文件，12 个符号
→ 受影响流程：LoginFlow、TokenRefresh
→ 风险：中
```

**cypher** — 自定义引用查询：

```cypher
MATCH (caller)-[:CodeRelation {type: 'CALLS'}]->(f:Function {name: "validateUser"})
RETURN caller.name, caller.filePath ORDER BY caller.filePath
```

## 风险规则

| 风险因素 | 缓解措施 |
|---------|---------|
| 许多调用者（>5） | 使用 rename 进行自动更新 |
| 跨区域引用 | 之后使用 detect_changes 验证范围 |
| 字符串/动态引用 | query 查找它们 |
| 外部/公共 API | 正确版本控制和弃用 |

## 示例：将 `validateUser` 重命名为 `authenticateUser`

```
1. rename({symbol_name: "validateUser", new_name: "authenticateUser", dry_run: true})
   → 12 处编辑：10 处图谱（安全），2 处 text_search（需审查）
   → 文件：validator.ts、login.ts、middleware.ts、config.json...

2. 审查 text_search 编辑（config.json：动态引用！）

3. rename({symbol_name: "validateUser", new_name: "authenticateUser", dry_run: false})
   → 在 8 个文件中应用了 12 处编辑

4. detect_changes({scope: "all"})
   → 受影响：LoginFlow、TokenRefresh
   → 风险：中 — 运行这些流程的测试
```
