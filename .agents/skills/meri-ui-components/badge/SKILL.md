---
name: badge
description: "Meri UI badge 组件技能。适用于查阅 badge 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-badge

用途:
- 角标/计数提示。

API 要点:
- 属性:
| 名称  | 类型    | 可选值     | 默认值 | 说明                                              |
| :---- | :------ | :--------- | :----- | :------------------------------------------------ |
| count | Number  |            | 0      | 当前消息数量，如果为0时，不显示当前红点           |
| show  | Boolean | true/false | false  | 当为true时，且count 不传或者传0的时候显示最小红点 |
| type  | Sstring  | num/dot    | num    | 当为num时，且count有值时显示有数字的红点；当为dot时，仅显示小红点 |

示例用法:
```vue
<template>
  <m-badge :count="0">
    <m-avatar type="text" color="#fff" bgColor="#0091ff" size="medium">1</m-avatar>
  </m-badge>

  <m-badge :show="false" type="num" :count="10">
    <m-avatar type="text" color="#fff" bgColor="#0091ff">挺</m-avatar>
  </m-badge>
  <m-badge :show="true" type="dot" :count="1">
    <m-avatar type="text" color="#fff" bgColor="#0091ff">挺</m-avatar>
  </m-badge>
   <m-badge type="dot" :count="1">
    <m-avatar type="text" color="#fff" bgColor="#0091ff">挺</m-avatar>
  </m-badge>
  <m-badge :count="11">
    <m-avatar type="text" color="#fff" bgColor="#0091ff">挺</m-avatar>
  </m-badge>
  <m-badge :count="100">
    <m-avatar type="text" color="#fff" bgColor="#0091ff">挺</m-avatar>
  </m-badge>

  <m-badge :count="0">
    <m-avatar radius="50%" size="small" src="/meri-plus/avatar-default.png"></m-avatar>
  </m-badge>
  <m-badge :count="1">
    <m-avatar radius="50%" size="medium" src="/meri-plus/avatar-default.png"></m-avatar>
  </m-badge>
  <m-badge :count="11">
    <m-avatar radius="50%" size="large" src="/meri-plus/avatar-default.png"></m-avatar>
  </m-badge>
  <m-badge :count="100">
    <m-avatar radius="50%" :size="56" src="/meri-plus/avatar-default.png"></m-avatar>
  </m-badge>

  <m-badge :count="100">
    <m-button type="primary" size="medium">默认按钮</m-button>
  </m-badge>
  <m-badge :count="100" type="dot">
    <m-button type="primary" size="medium">默认按钮</m-button>
  </m-badge>
</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 消息数/状态角标
- 真实业务场景+推荐组合: 未读消息（Badge + Icon/Button）
- 常用用法: 包裹目标元素显示数字
- 高级用法: dot 模式与自定义位置
- 主题与样式: 颜色/大小/偏移
- 兼容性: 与按钮/头像组合使用
- 性能建议: 数值更新频繁时避免过多重渲染
- 迁移提示: 角标定位方式可能不同
- 故障排查: 不显示多为内容为空或样式缺失

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/badge/index.ts
- packages/components/badge/index.md
- packages/components/badge/test/text.vue
