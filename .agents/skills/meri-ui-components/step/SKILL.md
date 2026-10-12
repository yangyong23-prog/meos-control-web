---
name: step
description: "Meri UI step 组件技能。适用于查阅 step 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-step

用途:
- 步骤条子项。

API 要点:
- 文档缺失/格式异常
示例用法:
- <m-step />

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: steps 子项
- 真实业务场景+推荐组合: 步骤子项（Step + Steps）
- 常用用法: 设置 title/description
- 高级用法: 自定义图标与插槽
- 主题与样式: 子项间距
- 兼容性: 需嵌套在 Steps 内
- 性能建议: 轻量渲染即可
- 迁移提示: 与旧组件的 slot 名称不同
- 故障排查: 不显示多为未放在 Steps 内

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/step/index.ts
