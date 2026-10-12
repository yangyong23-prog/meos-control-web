---
name: avatar
description: "Meri UI avatar 组件技能。适用于查阅 avatar 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-avatar

用途:
- 用户头像展示。

API 要点:
- 属性:
| 名称     | 类型   | 可选值                                     | 默认值    | 说明                           |
| :------- | :----- | :----------------------------------------- | :-------- | :----------------------------- |
| type     | String | image / logo / text                        | image     | 图片、图标、文字               |
| iconName | String | 图标的icon名称                             |
| color    | String | 颜色名 / RGB / 十六进制 / hsl              | #8d9399   | 文本头像的颜色                 |
| bgColor  | String | 颜色名 / RGB / 十六进制 / hsl              | #eff0f1   | 文本头像的背景色               |
| fontSize | Number |                                            | 14        | 文本头像的大小                 |
| radius   | String |                                            | 100%      | 圆角大小                       |
| src      | String |                                            | undefined | 图片头像的资源地址             |
| size     | String | small / medium / large                     | undefined | 图片头像的大小                 |
| fit      | String | fill / contain / cover / none / scale-down | fill      | 头像的图片在容器内的的适应类型 |

- 事件:
| 名称    | 参数       | 说明                     |
| :------ | :--------- | :----------------------- |
| onError | (e: Event) | 图片类头像加载失败的回调 |

- 插槽:
| 名称    | 说明             |
| :------ | :--------------- |
| default | 头像内填充的内容 |

示例用法:
```vue
<template>
  <m-avatar radius="2px" size="small" src=""></m-avatar>
  <m-avatar radius="4px" size="medium" src="/meri-plus/avatar-default.png"></m-avatar>
  <m-avatar radius="10%" size="large" src="/meri-plus/avatar-default.png"></m-avatar>
  <m-avatar radius="15%" :size="56" src="/meri-plus/avatar-default.png"></m-avatar>
</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 用户头像/占位
- 真实业务场景+推荐组合: 用户列表（Avatar + Tag + Table）
- 常用用法: 图片 src 或 icon
- 高级用法: 自定义形状/尺寸/文字头像
- 主题与样式: 圆形/方形与边框
- 兼容性: 图片加载失败需 fallback
- 性能建议: 头像列表建议懒加载
- 迁移提示: 与旧组件的 size 规格不同
- 故障排查: 图片不显示多为 URL 不可用

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/avatar/index.ts
- packages/components/avatar/index.md
- packages/components/avatar/test/size.vue
