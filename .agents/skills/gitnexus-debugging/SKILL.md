---
name: gitnexus-debugging
description: "当用户正在调试错误、追踪错误或询问为什么某事失败时使用。例如：\"为什么 X 失败？\"、\"这个错误来自哪里？\"、\"追踪这个错误\""
---

# 使用 GitNexus 进行调试

## 何时使用

- "为什么这个函数失败？"
- "追踪这个错误来自哪里"
- "谁调用了这个方法？"
- "这个端点返回 500"
- 调查错误、异常或意外行为

## 工作流

```
1. query({search_query: "<错误或症状>"})            → 查找相关执行流程
2. context({name: "<嫌疑>"})                    → 查看调用者/被调用者/流程
3. 读取 gitnexus://repo/{name}/process/{name}                → 追踪执行流程
4. cypher({statement: "MATCH path..."})                 → 需要时进行自定义追踪
```

> 如果"索引已过时" → 在终端运行 `node .gitnexus/run.cjs analyze`。

## 检查清单

```
- [ ] 理解症状（错误消息、意外行为）
- [ ] 查询错误文本或相关代码
- [ ] 从返回的流程中识别嫌疑函数
- [ ] 进行 context 以查看调用者和被调用者
- [ ] 如果适用，通过 process 资源追踪执行流程
- [ ] 需要时使用 cypher 进行自定义调用链追踪
- [ ] 阅读源文件以确认根本原因
```

## 调试模式

| 症状 | GitNexus 方法 |
|------|--------------|
| 错误消息 | `query` 错误文本 → 对抛出位置进行 `context` |
| 错误返回值 | 对函数进行 `context` → 追踪被调用者的数据流 |
| 间歇性失败 | `context` → 查找外部调用、异步依赖 |
| 性能问题 | `context` → 查找有许多调用者的符号（热路径） |
| 最近回归 | `detect_changes` 查看您的更改影响什么 |
| "A 如何到达 B？" | `trace` 两个符号之间 — 一次调用完成最短调用链 |

## 工具

**query** — 查找与错误相关的代码：

```
query({search_query: "支付验证错误"})
→ 流程：CheckoutFlow、ErrorHandling
→ 符号：validatePayment、handlePaymentError、PaymentException
```

**context** — 嫌疑的完整上下文：

```
context({name: "validatePayment"})
→ 传入调用：processCheckout、webhookHandler
→ 传出调用：verifyCard、fetchRates（外部 API！）
→ 流程：CheckoutFlow（步骤 3/7）
```

**cypher** — 自定义调用链追踪：

```cypher
MATCH path = (a)-[:CodeRelation {type: 'CALLS'}*1..2]->(b:Function {name: "validatePayment"})
RETURN [n IN nodes(path) | n.name] AS chain
```

**trace** — 两个符号之间的最短调用链（"A 如何到达 B？"），一次调用代替链接 `context` 跳跃：

```
trace({ from: "processCheckout", to: "fetchRates" })
→ status: ok, hopCount: 3
→ hops: processCheckout → validatePayment → verifyCard → fetchRates
→ edges: CALLS (1.0), CALLS (0.95), CALLS (1.0)
```

当没有路径存在时，`trace` 报告最远可到达节点 — 链断裂的确切位置（动态分发、反射或外部边界）。

## 示例："支付端点间歇性返回 500"

```
1. query({search_query: "支付错误处理"})
   → 流程：CheckoutFlow、ErrorHandling
   → 符号：validatePayment、handlePaymentError

2. context({name: "validatePayment"})
   → 传出调用：verifyCard、fetchRates（外部 API！）

3. 读取 gitnexus://repo/my-app/process/CheckoutFlow
   → 步骤 3：validatePayment → 调用 fetchRates（外部）

4. 根本原因：fetchRates 调用外部 API 时没有适当的超时
```
