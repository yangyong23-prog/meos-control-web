---
name: month-day-picker
description: "Meri UI monthDayPicker 组件技能。适用于查阅 monthDayPicker 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-monthDayPicker

用途:
- 月-日选择。

API 要点:
- 文档缺失/格式异常
示例用法:
- <m-month-\1ay-\1icker />

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 仅选择月/日的业务场景
- 真实业务场景+推荐组合: 生日提醒（MonthDayPicker + FormItem + Notification）
- 常用用法: 绑定 value 并设置展示格式
- 高级用法: 限制可选范围、禁用特定日期
- 主题与样式: 面板与列表项样式
- 兼容性: value 类型需与组件一致
- 性能建议: 列表项较多时优化渲染
- 迁移提示: 与普通 datePicker 的差异
- 故障排查: 选中不更新多为事件未绑定

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/monthDayPicker/index.ts
