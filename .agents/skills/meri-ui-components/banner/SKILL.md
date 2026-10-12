---
name: banner
description: "Meri UI banner 组件技能。适用于查阅 banner 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-banner

用途:
- 页面顶部/区域提示信息。

API 要点:
- 属性:
| 名称     | 类型    | 可选值                                   | 默认值  | 说明                                                       |
| :------- | :------ | :--------------------------------------- | :------ | :--------------------------------------------------------- |
| type     | String  | info / error / warn                       | info  | 类型控制 |
| closable     | Boolean  | true/false | false | 是否关闭按钮                                                   |
| message | String | | ''   | 横幅内容
| width | Number | | 232  | 宽度                                              |

- 事件:
| 名称    | 参数       | 说明         |
| :------ | :--------- | :----------- |
| close | (e: Event) | 关闭回调 |

- 插槽:
| 名称    | 说明             |
| :------ | :--------------- |
| message | message任意内容插入 |

示例用法:
```vue
<template>
<m-banner type="info" message='这是常见默认的横幅' style="margin-bottom:10px" >这是常见默认的横幅</m-banner>
  <m-banner type="error" message='这是错误类型的横幅' style="margin-bottom:10px" >这是错误类型的横幅</m-banner>
  <m-banner type="warn" message='这是警告类型的横幅' style="margin-bottom:10px" >这是警告类型的横幅</m-banner>

</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 页面顶部/区域告警提示
- 真实业务场景+推荐组合: 系统告警（Banner + Icon + Button）
- 常用用法: `type` + `closable`
- 高级用法: 可编辑/自定义图标
- 主题与样式: 告警色与图标
- 兼容性: 与布局容器对齐
- 性能建议: 避免频繁创建销毁
- 迁移提示: type 值需确认
- 故障排查: 关闭不生效多为事件未绑定

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/banner/index.ts
- packages/components/banner/index.md
- packages/components/banner/test/type.vue
