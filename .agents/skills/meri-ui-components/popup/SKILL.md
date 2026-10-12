---
name: popup
description: "Meri UI popup 组件技能。适用于查阅 popup 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-popup

用途:
- 通用弹层/浮层。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
  <m-dropdown type="primary">primary</m-dropdown>
  <m-dropdown>default</m-dropdown>
  <m-dropdown type="link">link</m-dropdown>
  <m-dropdown type="text">text</m-dropdown>
</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 任意触发的浮层/弹层
- 真实业务场景+推荐组合: 批量操作浮层（Popup + Checkbox + Button）
- 常用用法: 触发元素 + 内容区域
- 高级用法: 复杂定位、点击外部关闭
- 主题与样式: 浮层阴影与边距
- 兼容性: 依赖定位策略与容器滚动
- 性能建议: 频繁切换时避免重建内容
- 迁移提示: 与 popover / dropdown 的差异
- 故障排查: 位置错乱多为容器定位上下文

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/popup/index.ts
- packages/components/popup/index.md
- packages/components/popup/test/type.vue
