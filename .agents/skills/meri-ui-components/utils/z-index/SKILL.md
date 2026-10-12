---
name: z-index
description: "Meri UI z-index 工具技能。适用于查阅 z-index 工具的用途、示例、注意事项与常见坑。"
---

# meri-ui-utils/z-index

用途:
- z-index 工具。

API 要点:
- 文档缺失/格式异常
示例用法:
- <m-utils/z-index />

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 弹层层级统一管理
- 真实业务场景+推荐组合: 多弹层叠加（z-index 工具 + Modal/Popover）
- 常用用法: 组件内部自动处理
- 高级用法: 手动获取/设置层级
- 主题与样式: 与全局层级规范保持一致
- 兼容性: 与自定义弹层组件共存
- 性能建议: 避免手动频繁调整
- 迁移提示: 层级策略可能不同
- 故障排查: 覆盖层级异常多为自定义样式

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/utils/z-index/index.ts
