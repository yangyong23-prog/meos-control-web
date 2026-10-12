---
name: gitnexus-exploring
description: "当用户询问代码如何工作、想要理解架构、追踪执行流程或探索代码库的不熟悉部分时使用。例如：\"X 是如何工作的？\"、\"谁调用了这个函数？\"、\"显示认证流程\""
---

# 使用 GitNexus 探索代码库

## 何时使用

- "认证是如何工作的？"
- "项目结构是什么？"
- "显示主要组件"
- "数据库逻辑在哪里？"
- 理解您未见过的代码

## 工作流

```
1. 读取 gitnexus://repos                          → 发现已索引的仓库
2. 读取 gitnexus://repo/{name}/context             → 代码库概览，检查新鲜度
3. query({search_query: "<您想理解的内容>"})  → 查找相关执行流程
4. context({name: "<符号>"})            → 深入特定符号
5. 读取 gitnexus://repo/{name}/process/{name}      → 追踪完整执行流程
```

> 如果步骤 2 显示"索引已过时" → 先在终端运行 `node .gitnexus/run.cjs analyze`。

## 检查清单

```
- [ ] 读取 gitnexus://repo/{name}/context
- [ ] 查询您想理解的概念
- [ ] 查看返回的流程（执行流程）
- [ ] 对关键符号进行 context 以查看调用者/被调用者
- [ ] 读取 process 资源以获取完整执行追踪
- [ ] 阅读源文件以获取实现细节
```

## 资源

| 资源 | 获取内容 |
|------|---------|
| `gitnexus://repo/{name}/context` | 统计、新鲜度警告（~150 令牌） |
| `gitnexus://repo/{name}/clusters` | 所有功能区域及内聚分数（~300 令牌） |
| `gitnexus://repo/{name}/cluster/{name}` | 带文件路径的区域成员（~500 令牌） |
| `gitnexus://repo/{name}/process/{name}` | 逐步执行追踪（~200 令牌） |

## 工具

**query** — 查找与概念相关的执行流程：

```
query({search_query: "支付处理"})
→ 流程：CheckoutFlow、RefundFlow、WebhookHandler
→ 按流程分组的符号及文件位置
```

**context** — 符号的 360 度视图：

```
context({name: "validateUser"})
→ 传入调用：loginHandler、apiMiddleware
→ 传出调用：checkToken、getUserById
→ 流程：LoginFlow（步骤 2/5）、TokenRefresh（步骤 1/3）
```

## 示例："支付处理是如何工作的？"

```
1. 读取 gitnexus://repo/my-app/context       → 918 个符号，45 个流程
2. query({search_query: "支付处理"})
   → CheckoutFlow：processPayment → validateCard → chargeStripe
   → RefundFlow：initiateRefund → calculateRefund → processRefund
3. context({name: "processPayment"})
   → 传入：checkoutHandler、webhookHandler
   → 传出：validateCard、chargeStripe、saveTransaction
4. 阅读 src/payments/processor.ts 以获取实现细节
```
