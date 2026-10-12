---
name: injection-key
description: "Meri UI injectionKey 工具技能。适用于查阅 injectionKey 工具的用途、示例、注意事项与常见坑。"
---

# meri-ui-utils/injectionKey

用途:
- 注入 key 工具。

API 要点:
- 文档缺失/格式异常
示例用法:
- <m-utils/injection-\1ey />

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 跨组件注入 key 管理
- 真实业务场景+推荐组合: 跨组件上下文（injectionKey + Form/Select）
- 常用用法: 内部组件自动使用
- 高级用法: 扩展自定义注入
- 主题与样式: 无
- 兼容性: 与 Vue provide/inject 一致
- 性能建议: 避免频繁变更注入内容
- 迁移提示: key 命名需统一
- 故障排查: 注入失败多为 key 不一致

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/utils/injectionKey/index.ts
