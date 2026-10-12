---
name: form-item
description: "Meri UI formItem 组件技能。适用于查阅 formItem 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-formItem

用途:
- 表单字段容器。

API 要点:
- 文档缺失/格式异常
示例用法:
- <m-form-\1tem />

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 表单字段容器、校验展示
- 真实业务场景+推荐组合: 配置表单项（FormItem + Input/Select + Tips）
- 常用用法: `prop` 对应 model 字段
- 高级用法: 自定义错误提示、嵌套表单项
- 主题与样式: 错误态样式与对齐
- 兼容性: `prop` 必须与 Form 的 model 对应
- 性能建议: 动态显示/隐藏时避免频繁卸载
- 迁移提示: 与其他库的 `prop`/`name` 语义不同
- 故障排查: 错误提示不显示多为未配置 rules

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/formItem/index.ts
