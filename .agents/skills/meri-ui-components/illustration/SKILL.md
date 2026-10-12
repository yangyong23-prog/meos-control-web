---
name: illustration
description: "Meri UI illustration 组件技能。适用于查阅 illustration 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-illustration

用途:
- 插画占位图。

API 要点:
- 属性:
| 名称     | 类型    | 可选值                                   | 默认值  |  是否必填  |说明                                                       |
| :------- | :------ | :---------------------------------------| :------ | :-------- |:-------------------------------------------------------|
| type     | string  |      noContent / noSearchResult / noMessage / noAccess / pageLoadFailure / success / error          |  — | 否  |插画类型 |
| title     | string  |      —            |  — | 是  |标题 |
| content     | string  |      —            |  — | 否  |插画描述内容 |

- 插槽:
| 插槽名  | 说明         |
| :------ | :----------- |
| img  | 自定义插画图片 |
| title  | 自定义标题 |
| content  | 自定义描述内容 |
| footer | 自定义底部操作 |

示例用法:
```vue
<template>
    <m-illustration title="暂无数据"></m-illustration>
</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 空状态/异常提示插画
- 真实业务场景+推荐组合: 空状态（Illustration + Button）
- 常用用法: 选择内置图形
- 高级用法: 自定义 slot 内容
- 主题与样式: 尺寸与对齐
- 兼容性: 与容器布局对齐
- 性能建议: 仅在空状态渲染
- 迁移提示: 图标命名可能不同
- 故障排查: 图不显示多为类型名错误

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/illustration/index.ts
- packages/components/illustration/index.md
- packages/components/illustration/test/basic.vue
