---
name: ellipsis
description: "Meri UI ellipsis 工具技能。适用于查阅 ellipsis 文本省略指令的用途、示例、注意事项与常见坑。"
---

# meri-ui-utils/ellipsis

用途:
- 文本省略工具指令。

API 要点:
- 文档缺失/格式异常
示例用法:
- <m-utils/ellipsis />

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 文本超长省略与提示
- 真实业务场景+推荐组合: 表格溢出文本（v-ellipsis + Table）
- 常用用法: `v-ellipsis` 作用于文本容器
- 高级用法: 自定义 tooltip 或多行省略
- 主题与样式: 需要明确宽度/行高
- 兼容性: 容器需可测量尺寸
- 性能建议: 列表中使用注意性能
- 迁移提示: 与 CSS 省略方式不同
- 故障排查: 不生效多为容器无宽度

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/utils/ellipsis/index.ts
