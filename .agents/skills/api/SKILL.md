---
name: api
description: '为 meos-control-web 工作区处理 API / HTTP 请求 / 接口调用规则的技能。适用于新增或修改前端接口文件、判断当前应用应使用 `http.ts` 还是 `Xsync`、选择正确的服务前缀 `INTERFACE_PREFIX_*`、避免硬编码 host、处理公共请求头/mergeParams/autoHandleError/AbortSignal，并按项目现有模式组织 `src/apis` 或 `src/api`。触发词：api、http、接口、axios、Xsync、请求封装、INTERFACE_PREFIX、mergeParams、autoHandleError、AbortSignal、后端服务前缀。'
argument-hint: '说明目标应用/文件，以及是要新增接口、调整请求参数、排查请求行为，还是梳理 API 规则'
---

# meos-control-web API（HTTP 请求）使用技能

## 技能目标

在当前多应用工作区中处理 API / HTTP 请求任务时，帮助代理稳定完成以下事项：

- 先识别当前代码属于哪个应用，再复用该应用现有的请求封装。
- 使用正确的服务前缀与环境来源，避免硬编码域名或 host。
- 按项目现有风格组织接口文件、函数命名、参数传递和错误处理。
- 在需要时正确使用 `autoHandleError`、`mergeParams`、`AbortSignal/signal`、`modelType` 等项目约定。
- 避免为了“快速调通”绕过公共请求拦截器，导致请求头、项目参数、国际化报错处理失效。

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “帮我新增一个接口请求”
- “这个 API 文件该怎么写”
- “当前项目请求应该走哪个封装”
- “为什么这个接口自动带了 projectId / groupCode”
- “某个接口不要自动弹错/不要自动合并公共参数怎么处理”
- “需要取消请求/中断请求应该怎么写”
- “服务前缀 `INTERFACE_PREFIX_*` 应该怎么选”
- “当前仓库里 API 请求规范是什么”

默认覆盖整个工作区内的 API 请求任务，但执行时必须先识别目标应用，再进入对应的请求封装与目录规范。

## 先判断目标应用

这个仓库是多应用工作区，不同应用的 HTTP 请求封装并不完全一致。

### 根应用 `src/`

- API 目录：`src/apis/`
- 请求底座：`src/utils/http.ts`
- 服务前缀来源：`src/config.js` 中的 `INTERFACE_PREFIX_*`
- 常见写法：
	- `import http from '@/utils/http'`
	- `http.get(...)`
	- `http.post(...)`
- 适用场景：根应用新增/修改接口时优先沿用 `http.ts`

### 子应用 `operation-duty-homepage/`

- API 目录：`operation-duty-homepage/src/apis/`
- 请求底座：`Xsync`
- 服务地址来源：如 `getMeoiServerUrl()`、`getDtpServerUrl()` 等工具函数
- 常见写法：
	- `Xsync({ method, url, params })`
- 不要直接套用根应用 `http.ts` 的约定

### legacy 子应用 `meoi-aim-rcrm-web/`

- API 目录：`meoi-aim-rcrm-web/src/api/`
- 请求底座：`Xsync`
- 服务前缀来源：子应用自己的 `src/config.js`
- 常见写法：
	- `Xsync({ method, url, params, signal })`
- 不要把根应用 `src/apis/` 的封装方式强行迁过去

### 总规则

1. 先根据文件路径判断属于哪个应用。
2. 再复用该应用已经存在的请求封装与目录结构。
3. 没有明确需求时，不跨应用统一请求层。
4. 不为了“看起来统一”而把一个应用的请求模式生搬硬套到另一个应用。

## 根应用请求规则现状

根应用当前最重要的请求约定集中在 `src/utils/http.ts`：

### 1. 必须优先复用 `http.ts`

新增接口时默认：

- 不直接 `axios.create(...)`
- 不在业务文件里重复写拦截器
- 不自行拼公共请求头

优先写成：

```ts
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

export const querySomething = (params: any) => http.post(`${INTERFACE_PREFIX_MEOS}/xxx/yyy`, params);
```

### 2. `http.ts` 已内置的公共行为

根应用请求层已统一处理这些事项：

- 自动注入用户/项目相关请求头
	- `groupCode`
	- `projectId`
	- `userId`
	- `token`
	- `accept-language`
- 在大多数请求中自动合并 `projectId`
- 对特定接口进行 `application/x-www-form-urlencoded` 转换
- 统一处理响应 `code/resultCode/respCode === '00000'`
- 默认自动弹出错误消息
- 自动接入 IoT 过期信息拦截

因此，新增接口前要先判断：这些默认能力是不是正好就是你要的。

### 3. 服务前缀必须来自 `src/config.js`

接口地址前缀应优先从 `src/config.js` 已导出的常量中选择，例如：

- `INTERFACE_PREFIX_MEOS`
- `INTERFACE_PREFIX_MEOS_DTP`
- `INTERFACE_PREFIX_BDTP_DMP_RWD`
- `INTERFACE_PREFIX_BDTP_PERSIST`
- `INTERFACE_PREFIX_TWIN_DTP`

不要：

- 硬编码完整域名
- 在 API 文件里直接写 `window.proxy.xxx`
- 为了临时联调把 host 写死在业务代码里

### 4. `autoHandleError` 的使用规则

默认情况下，`http.ts` 会自动处理错误提示。

当且仅当以下场景成立时，再考虑传 `autoHandleError: false`：

- 调用方需要自己控制错误提示时机
- 同一个请求会被不同 UI 场景复用，默认弹错会打断交互
- 下载流、轮询、静默探测类请求不适合统一弹错

示例：

```ts
http.post(url, params, { autoHandleError: false });
```

### 5. `mergeParams` 的使用规则

根应用默认会自动把 `projectId` 合并进请求数据或参数。

只有当接口明确不允许这类公共参数，或请求已由调用方完整构造时，才考虑：

```ts
http.get(url, {}, { headers: { mergeParams: false } });
```

不要在不了解后端契约时随意关闭它。

### 6. 取消请求 / 中断请求

当前根应用已有接口函数接收 `signal` / `AbortSignal` 的先例。

如果场景需要：

- 页面切换取消请求
- 输入搜索防抖取消前一个请求
- 长列表/树懒加载中断旧请求

优先延续现有写法：

```ts
export const queryXxx = (params: any, signal?: AbortSignal, config = {}) =>
		http.post(`${INTERFACE_PREFIX_MEOS}/xxx`, params, { signal, ...config });
```

### 7. `modelType` 头的使用规则

根应用部分接口依赖 `headers.modelType`。

当你看到附近已有类似写法时：

```ts
http.post(url, params, { headers: { modelType: modelType() } });
```

应优先复用同一模式，而不是擅自省略。特别是运行控制台、指令下发、运行监测相关接口。

## 子应用请求规则现状

### `operation-duty-homepage/`

- 以 `Xsync` 为请求入口
- 常通过 `getMeoiServerUrl()`、`getDtpServerUrl()` 组装服务地址
- 参数字段通常使用 `params`
- 可按需传入 `requestOptions`

默认策略：

- 在该应用内新增接口时，优先继续写到 `src/apis/duty.js` 或同类文件
- 继续复用 `Xsync`，不要擅自引入根应用 `http.ts`

### `meoi-aim-rcrm-web/`

- 以 `Xsync` 为请求入口
- 接口文件位于 `src/api/`
- 前缀来自子应用自己的 `src/config.js`
- 常见字段：`method`、`url`、`params`、`signal`、`loadingBtnId`

默认策略：

- 保持现有 `Xsync({ ... })` 风格
- 继续复用子应用自己的 `INTERFACE_PREFIX_*`
- 不要因为根应用更现代，就把 legacy 应用硬迁成另一套请求层

## 接口文件组织规则

### 根应用

- 目录：`src/apis/`
- 一个业务文件对应一组相关接口
- 优先导出具名函数
- 默认优先补返回值类型，尽量使用 `HttpResponse<T>`
- 函数名应表达业务动作，而不是纯 HTTP 动词堆砌

示例：

- `listScheduleInfoCodeDefine`
- `queryProjectCarbonData`
- `commandExecuteReleaseIntervention`

### 命名建议

- 查询：`get` / `query` / `list` / `map`
- 新增/保存：`create` / `save`
- 修改：`edit` / `update` / `change`
- 删除：`delete` / `remove`
- 批量操作/指令：保留现有业务前缀，如 `batch`、`commandExecute`

### 参数风格

- 若项目周边文件以 `params` 命名，则延续 `params`
- 若接口是明确的请求体对象，可用 `data` / `body`，但需与附近风格一致
- 不要在同一文件里无理由混用 `payload/body/params/data/form` 多种命名

### 返回值类型风格

根应用新增 API 时，默认优先补类型，并尽量沿用：

```ts
import { HttpResponse } from '@/types/common';

export const querySomething = (params: XxxParams): HttpResponse<XxxResult> =>
	http.post(`${INTERFACE_PREFIX_MEOS}/xxx`, params);
```

规则：

1. 如果附近文件已经明确使用 `HttpResponse<T>`，优先保持一致。
2. 如果返回结构可从上下文可靠推断，应补上泛型类型。
3. 如果当前修改必须保持最小 diff，且周边文件普遍未补类型，可先跟随现状，但不要主动把已有类型删掉。

## 核心决策规则

### 1. 先复用，再新增封装

默认顺序：

1. 复用当前应用现有请求底座
2. 复用已有服务前缀常量
3. 在已有 API 文件中增补接口
4. 只有确有必要时才新建 API 文件或新增封装能力

### 2. 不硬编码环境地址

避免以下写法：

- `http.post('https://qa-xxx.xxx.com/xxx', params)`
- 在业务代码里直接读取 `window.proxy` 拼完整 URL
- 为了测试把 mock 地址长期留在正式代码路径里

### 3. 不绕过公共拦截器

除非用户明确要求，否则避免：

- 在业务组件中直接 `axios.get/post`
- 复制一份新的请求实例
- 在接口函数里重复写 token/projectId/header 逻辑

### 4. 错误处理要尊重调用场景

默认让公共请求层处理错误；只有在交互上确有必要时，才显式关闭自动错误处理，并把错误处理责任交给调用方。

### 5. 取消请求要沿用项目已有能力

若场景需要取消请求，优先沿用现有 `signal` / `AbortSignal` 模式，不要自造另一套取消协议。

## 标准工作流

### 第 1 步：定位所属应用与请求层

1. 根据路径判断属于根应用还是子应用。
2. 找到该应用的 API 目录、请求封装、配置文件。
3. 明确要复用的底座：`http.ts` 或 `Xsync`。

### 第 2 步：确认服务前缀与公共行为

1. 从配置文件中选择正确的 `INTERFACE_PREFIX_*` 或 URL helper。
2. 判断该请求是否应继承默认公共头与公共参数。
3. 判断是否需要 `modelType`、`autoHandleError`、`mergeParams`、`signal`。

### 第 3 步：按现有风格组织接口函数

1. 放进最合适的 API 文件。
2. 使用具名导出。
3. 保持附近文件的命名与参数风格一致。
4. 不顺手重构无关接口。

### 第 4 步：验证请求设计是否合理

至少检查以下内容：

1. 是否复用了正确的请求底座。
2. 是否使用了正确的服务前缀，而非硬编码 host。
3. 是否错误地关闭了 `autoHandleError` 或 `mergeParams`。
4. 是否遗漏了必须的 `modelType` / `signal` / 特殊 headers。
5. 是否与所在目录的风格保持一致。

## 完成标准

满足以下条件才算完成：

- 已确认当前任务使用的是目标应用真实存在的请求封装。
- 接口地址前缀来自配置或 URL helper，而非硬编码。
- 接口函数命名、导出方式、参数风格与周边代码一致。
- 没有无故绕开公共请求拦截器。
- 若有特殊请求行为，已明确说明为什么要关闭默认能力或补充额外配置。

## 回答用户时的建议输出结构

处理 API 请求任务后，建议按以下顺序反馈：

1. 当前文件所属应用与所用请求底座
2. 选择了哪一个服务前缀/URL helper
3. 是否启用了特殊配置（如 `autoHandleError`、`mergeParams`、`signal`、`modelType`）
4. 新增或修改了哪些接口函数
5. 是否存在后端契约仍需业务确认的点

## 本技能沉淀出的项目经验

1. 根应用的 API 应优先复用 `src/utils/http.ts`，不要在业务层直接重建 Axios 请求实例。
2. 根应用服务前缀统一来自 `src/config.js` 的 `INTERFACE_PREFIX_*` 常量，运行环境大量依赖 `window.proxy` / 注入环境，不能硬编码 host。
3. 根应用 `http.ts` 会默认合并 `projectId`、注入用户与语言相关 headers，并统一处理错误提示；关闭这些默认能力前必须有明确理由。
4. `operation-duty-homepage` 与 `meoi-aim-rcrm-web` 都更偏向使用 `Xsync`，它们的请求模式不应被根应用 `http.ts` 强行替代。
