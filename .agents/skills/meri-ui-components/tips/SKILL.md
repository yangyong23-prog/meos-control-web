---
name: tips
description: "Meri UI tips 组件技能。适用于查阅 tips 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-tips

用途:
- 轻提示/说明。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<m-tips content="我是提示文字" :showArrow="false">
		<m-button>白底</m-button>
	</m-tips>
	<m-tips content="我是提示文字" theme="darkTransparent">
		<m-button>透明黑底</m-button>
	</m-tips>
</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 轻量说明/提示文字
- 真实业务场景+推荐组合: 表单提示（Tips + FormItem）
- 常用用法: 直接包裹说明内容
- 高级用法: 主题风格与插槽
- 主题与样式: 提示色与字号
- 兼容性: 与表单提示联动
- 性能建议: 简化嵌套层级
- 迁移提示: 与 tooltip 语义不同
- 故障排查: 不显示多为插槽未传

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/tips/index.ts
- packages/components/tips/index.md
- packages/components/tips/test/theme.vue
