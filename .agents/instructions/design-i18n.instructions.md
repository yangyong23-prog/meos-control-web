---
description: "在 meos-control-web 根应用中编写或修改界面文案、国际化 key、语言包与 Figma 转代码中的文本映射时使用。涵盖语言包位置、`meos_control_web` 命名空间、`I18nSlot` 与 `i18n.global.t(...)` 的使用以及避免硬编码文案。"
name: "Root Design I18n Guidelines"
applyTo: "src/**/*.vue, src/**/*.js, src/**/*.ts, src/localization.js, src/components/I18nSlot.vue, locales/langs/**/*.json"
---

# 根应用国际化规范

在根应用 `src/` 中处理文案或 Figma 文本映射时，优先走现有 i18n 体系，不要直接硬编码中文或英文。

## 语言包与入口

- 国际化入口：`src/localization.js`
- 中文语言包：`locales/langs/zh.json`
- 英文语言包：`locales/langs/en.json`

## 文案新增规则

- 新增文案优先放在 `meos_control_web` 命名空间下
- 重复文本优先复用已有 key，不要同义重复造 key
- 先补齐中英文，再在界面中引用

## 使用方式

### Vue 模板中

- 需要插槽型国际化内容时，优先使用 `src/components/I18nSlot.vue`
- 普通文本可直接使用当前项目约定的 i18n 调用方式

### 生成代码时的长文本展示

- 生成页面代码或样式时，要默认考虑国际化后文本可能变长，不要只按中文长度估算
- 若用户未明确指定，需提供两种展示策略供其选择：
	- **超出显示 `...`**：适合按钮、标题、标签、表格列等单行受限区域
	- **自动换行**：适合说明文本、表单标签、详情内容等允许高度增长的区域
- 不要写死固定高度导致翻译后内容被裁切
- 需要省略号时，优先使用项目约定的 `v-ellipsis` 指令并加上 `m-ellipsis` class，不要只手写通用省略 CSS
- 需要换行时，优先补齐 `white-space: normal`、`word-break: break-word` 或 `overflow-wrap: anywhere` 等规则

### JS / TS 中

优先：

```ts
import i18n from '@/localization';
```

并使用：

```ts
i18n.global.t('meos_control_web.xxx')
```

## 避免这些做法

- 直接硬编码中文或英文文案
- 在多个地方为同一含义重复创建 key
- 写了中文 key 却遗漏英文语言包
- 使用不存在的 `zh-CN.json` / `en-US.json` 之类旧路径

## 修改后自检

- 是否已优先复用现有 key
- 是否已同时补齐 `zh.json` 与 `en.json`
- 是否优先放在 `meos_control_web` 命名空间下
- 模板与脚本是否使用了正确的 i18n 调用方式
- 涉及界面展示的新增文案，是否已考虑超长国际化文本，并给出“省略号 / 自动换行”的明确方案