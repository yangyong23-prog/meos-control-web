---
name: list-skeleton
description: "Meri UI listSkeleton 组件技能。适用于查阅 listSkeleton 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-listSkeleton

用途:
- 列表骨架屏。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
    <div style="width: 20%">
        <m-list-skeleton/>
    </div>
    <div style="width: 30%">
        <m-list-skeleton/>
    </div>

    <div style="width: 40%">
        <m-list-skeleton/>
    </div>
</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 列表加载占位
- 真实业务场景+推荐组合: 列表首屏（ListSkeleton + List）
- 常用用法: loading 状态切换
- 高级用法: 自定义行数与样式
- 主题与样式: 骨架颜色/间距
- 兼容性: 与实际列表尺寸对齐
- 性能建议: 首屏加载使用
- 迁移提示: 与 loading 的区别
- 故障排查: 占位不显示多为样式缺失

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/listSkeleton/index.ts
- packages/components/listSkeleton/index.md
- packages/components/listSkeleton/test/skeleton.vue
