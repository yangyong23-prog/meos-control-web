---
description: "在 meos-control-web 中编写或修改 API / HTTP 请求文件时使用。涵盖请求封装、INTERFACE_PREFIX 选择、http.ts 与 Xsync、mergeParams、autoHandleError、AbortSignal 以及避免硬编码主机。"
name: "API HTTP Request Guidelines"
applyTo: "src/apis/**, src/utils/http.ts, src/config.js, operation-duty-homepage/src/apis/**, operation-duty-homepage/src/config.js, meoi-aim-rcrm-web/src/api/**, meoi-aim-rcrm-web/src/config.js"
---

# API / HTTP 请求规范

在当前仓库中处理接口请求时，先判断所属应用，再复用该应用现有请求封装，不要跨应用硬套。

## 先判断请求底座

- 根应用 `src/`：优先使用 `src/utils/http.ts`
- `operation-duty-homepage/`：优先使用 `Xsync`
- `meoi-aim-rcrm-web/`：优先使用 `Xsync`

默认不要在业务文件里直接新建 `axios.create(...)`，也不要重复写拦截器。

## 服务前缀规则

- 根应用服务前缀统一来自 `src/config.js` 的 `INTERFACE_PREFIX_*`
- 子应用使用各自 `config.js` 或 URL helper（如 `getMeoiServerUrl()`、`getDtpServerUrl()`）
- 不要硬编码域名、host、环境地址
- 不要在 API 文件里直接拼 `window.proxy.xxx`

## 根应用 `http.ts` 使用规则

根应用新增接口默认沿用：

```ts
import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
```

并优先写成具名导出函数。

`http.ts` 已统一处理：

- 公共请求头
- `projectId` 自动合并
- 统一错误提示
- 语言头 `accept-language`
- 特定接口的 form-urlencoded 转换

因此：

- 不要无故绕开 `http.ts`
- 不要重复拼 token / groupCode / projectId
- 仅在确有必要时才关闭默认能力

### `autoHandleError`

仅当调用方需要自己处理错误提示时，再传：

```ts
{ autoHandleError: false }
```

### `mergeParams`

仅当接口明确不允许自动合并公共参数时，再传：

```ts
{ headers: { mergeParams: false } }
```

### `signal / AbortSignal`

如页面切换、搜索中断、旧请求取消等场景需要取消请求，优先沿用已有 `signal` 模式。

### `modelType`

如果附近接口已传 `headers.modelType`，优先保持一致，尤其是运行控制台、运行监测、指令下发相关接口。

## 接口文件组织

- 根应用放在 `src/apis/`
- `operation-duty-homepage` 放在 `operation-duty-homepage/src/apis/`
- `meoi-aim-rcrm-web` 放在 `meoi-aim-rcrm-web/src/api/`
- 一个业务文件维护一组相关接口
- 优先具名导出，不要默认导出整个 API 对象

## 命名与类型

- 查询类优先：`get` / `query` / `list` / `map`
- 修改类优先：`edit` / `update` / `change`
- 删除类优先：`delete` / `remove`
- 根应用新增 API 默认优先补返回值类型，尽量使用 `HttpResponse<T>`

如果周边已有明确类型写法，保持一致；如果周边普遍未补类型，保持最小改动，但不要主动删除已有类型。

## 避免这些做法

- 在业务组件里直接发裸 `axios` 请求
- 硬编码测试地址或联调地址
- 无理由关闭 `autoHandleError` / `mergeParams`
- 把根应用 `http.ts` 模式强迁到 `Xsync` 子应用
- 为了“统一风格”重写整个请求层

## 修改后自检

- 是否复用了正确的请求底座
- 是否使用了正确的服务前缀
- 是否遗漏了必须的 headers / signal / modelType
- 是否与附近 API 文件的命名、参数、导出风格一致
- 是否避免了硬编码 host