---
name: select-create
description: "Meri UI selectCreate 组件技能。适用于查阅 selectCreate 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-selectCreate

用途:
- 可创建选项的选择器。

API 要点:
- 文档缺失/格式异常
示例用法:
- <m-select-\1reate />

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 支持用户输入创建新选项的选择器
- 真实业务场景+推荐组合: 标签创建（SelectCreate + Tag + FormItem）
- 常用用法: `allowCreate` + `filterable`
- 高级用法: 自定义创建提示与校验规则
- 主题与样式: 新建项样式与下拉面板宽度
- 兼容性: 创建项需与 `value` 类型一致
- 性能建议: 远程搜索时避免频繁请求
- 迁移提示: 创建行为与其他库的触发条件不同
- 故障排查: 新建项不生效多为事件未监听

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/selectCreate/index.ts
- packages/components/selectCreate/index.md
