---
name: gitnexus-impact-analysis
description: "当用户想知道更改某物会破坏什么，或在编辑代码前需要安全分析时使用。例如：\"更改 X 安全吗？\"、\"什么依赖于此？\"、\"什么会破坏？\""
---

# 使用 GitNexus 进行影响分析

## 何时使用

- "更改这个函数安全吗？"
- "如果我修改 X 什么会破坏？"
- "显示影响范围"
- "谁使用这段代码？"
- 在进行非平凡代码更改之前
- 在提交之前 — 了解您的更改影响什么

## 工作流

```
1. impact({target: "X", direction: "upstream"})  → 什么依赖于此
2. 读取 gitnexus://repo/{name}/processes                   → 检查受影响的执行流程
3. detect_changes()                               → 将当前 git 更改映射到受影响的流程
4. 评估风险并向用户报告
```

> 如果"索引已过时" → 在终端运行 `node .gitnexus/run.cjs analyze`。

## 检查清单

```
- [ ] impact({target, direction: "upstream"}) 查找依赖项
- [ ] 首先查看 d=1 项（这些将破坏）
- [ ] 检查高置信度（>0.8）依赖项
- [ ] 读取流程以检查受影响的执行流程
- [ ] detect_changes() 进行提交前检查
- [ ] 评估风险级别并向用户报告
```

## 理解输出

| 深度 | 风险级别 | 含义 |
|------|---------|------|
| d=1 | **将破坏** | 直接调用者/导入者 |
| d=2 | 可能受影响 | 间接依赖项 |
| d=3 | 可能需要测试 | 传递效应 |

## 风险评估

| 受影响 | 风险 |
|--------|------|
| <5 个符号，少量流程 | 低 |
| 5-15 个符号，2-5 个流程 | 中 |
| >15 个符号或许多流程 | 高 |
| 关键路径（认证、支付） | 严重 |

## 工具

**impact** — 符号影响范围的主要工具：

```
impact({
  target: "validateUser",
  direction: "upstream",
  minConfidence: 0.8,
  maxDepth: 3
})

→ d=1（将破坏）：
  - loginHandler (src/auth/login.ts:42) [CALLS, 100%]
  - apiMiddleware (src/api/middleware.ts:15) [CALLS, 100%]

→ d=2（可能受影响）：
  - authRouter (src/routes/auth.ts:22) [CALLS, 95%]
```

**detect_changes** — 基于 git 差异的影响分析：

```
detect_changes({scope: "staged"})

→ 更改：3 个文件中的 5 个符号
→ 受影响：LoginFlow、TokenRefresh、APIMiddlewarePipeline
→ 风险：中
```

## 示例："如果我更改 validateUser 什么会破坏？"

```
1. impact({target: "validateUser", direction: "upstream"})
   → d=1：loginHandler、apiMiddleware（将破坏）
   → d=2：authRouter、sessionManager（可能受影响）

2. 读取 gitnexus://repo/my-app/processes
   → LoginFlow 和 TokenRefresh 涉及 validateUser

3. 风险：2 个直接调用者，2 个流程 = 中
```
