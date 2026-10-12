---
name: tag
description: "Meri UI tag 组件技能。适用于查阅 tag 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-tag

用途:
- 标签。

API 要点:
- 属性:
| **名称** | **类型** | **可选值**                                                   | **默认值**                    | **说明**     |
| -------- | -------- | ------------------------------------------------------------ | ----------------------------- | ------------ |
| color    | string   | -                                                            | -                             | 设置字体颜色 |
| bg-color | string   | -                                                            | 默认取字体颜色并设置透明为0.15 | 设置背景颜色 |
| size     | string   | `small` \| `medium` \| `large`                                            | `small`                       | 尺寸         |
| type     | string   | `processing` \| `canceled` \| `completed` \| `rejected` \| `error` | -                             | 类型         |
| dot      | boolean  | `true`\| `false`                                              | `false`                       |              |
| icon     | string   | -                                                            | -                             | 图标         |
| has-prefix     | boolean   | `true` \| `false`                                                            | `false`                             | 是否默认有尾部icon         |

| 名称 | 类型 | 说明                   |
| :----- | :--- | :--------------------- |
| clickSuffix   | -    | 点击头部icon事件 |
| clickPrefix   | -    | 点击尾部icon事件 |

示例用法:
```vue
<template>
	<div style="gap: 0">
		<p>高</p>
		<m-tag color="#fff" bg-color="#F55047" size="large"> 紧急 </m-tag>
		<m-tag color="#fff" bg-color="#F55047" size="large"> 建议增加 </m-tag>
		<p>中</p>
		<m-tag color="#D72824" bg-color="#FFE6E5" size="large"> 逾期未完成 </m-tag>
		<m-tag color="#E68600" bg-color="#FFF0CC" size="large"> 逾期完成 </m-tag>
		<m-tag color="#00A2A7" bg-color="#CBF7F3" size="large"> 正常完成 </m-tag>
		<m-tag color="#1B4ACC" bg-color="#D9EBFF" size="large"> 未反馈 </m-tag>
		<p>低</p>
		<m-tag color="#1B2129" bg-color="#E8ECF0" size="large"> 严重影响 </m-tag>
		<m-tag color="#1B2129" bg-color="#E8ECF0" size="large"> 一般影响 </m-tag>
	</div>
</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 状态/分类标识
- 真实业务场景+推荐组合: 状态标记（Tag + Table/Detail）
- 常用用法: `type`/`size` 组合
- 高级用法: 可关闭、状态色
- 主题与样式: 背景色/边框/圆角
- 兼容性: 与表单/列表混用
- 性能建议: 列表中过多 tag 合并展示
- 迁移提示: status 取值可能不同
- 故障排查: 颜色不对多为 type 值错误

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/tag/index.ts
- packages/components/tag/index.md
- packages/components/tag/test/grade.vue
