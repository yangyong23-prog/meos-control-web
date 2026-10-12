# 冷热源分区时间表独立路由设计

## 目标

在 `/cold-hot-timetable-strategic-interventions` 路由下提供一套与生活热水时间表一致的周/月日历、新建、编辑、批量删除和保存后刷新功能。实现代码放在 `src/views/coldHotStrategicInterventions/AirTableTime`，不修改或运行时依赖 `src/views/WaterSupply` 业务代码。

## 页面输入

路由入口从 URL query 读取参数，并组装时间表组件需要的数据：

- `systemId`：系统 ID，核心查询参数。
- `systemName`：系统名称。
- `systemType`：系统类型。
- `curConsoleType`：当前控制台类型。
- `enableConsoleTypes`：可用控制台类型，支持 JSON 数组或逗号分隔字符串。
- `codeDefine`：信息点定义，支持 JSON 对象字符串。
- `chillerData`：冷机数据，支持 JSON 对象字符串。

无法解析的数组或对象参数分别回退为空数组和空对象，避免路由参数格式异常导致页面崩溃。

## 目录与职责

- `AirTableTime/index.vue`：路由入口，解析 query、组装 `currentSystem` 并提供页面级数据。
- `AirTableTime/components/timetable/index.vue`：时间表功能容器，管理编辑弹窗和日历刷新。
- `AirTableTime/components/timetable/components/*`：复制周历、月历、日期项、头部筛选和批量删除视图。
- `AirTableTime/hooks/useTimetableHook.js`：管理周/月状态、查询区间、时间表列表和依赖注入。
- `AirTableTime/hooks/useTimeTableItem.js`：管理编辑项展示数据。
- `AirTableTime/components/TimeTableEditItem.vue`：编辑弹窗中的控制项内容。
- `AirTableTime/injectKeys.js`：本模块内部注入键。
- `AirTableTime/constant.js`：本模块所需控制台配置和权限常量。

复制后的文件只依赖公共组件、公共 API 和 `AirTableTime` 目录内模块，不引用 `@/views/WaterSupply/**`。

## 数据流

1. 路由入口读取 query 并构造时间表 props。
2. 时间表 hook 根据控制台类型、系统类型和系统 ID 查询策略列表。
3. 周历和月历通过模块内注入键读取列表与当前日期。
4. 新建或编辑操作将当前上下文传给公共 `TimeTableEditorModal`。
5. 保存、单项删除或批量删除完成后调用模块内 `init` 重新查询。
6. 返回操作优先使用路由历史返回上一页。

## 路由调整

将 `/cold-hot-timetable-strategic-interventions` 的组件路径修正为：

`@/views/coldHotStrategicInterventions/AirTableTime/index.vue`

保留现有菜单配置加载逻辑。

## 验证

- 新目录不存在 `@/views/WaterSupply` 引用。
- 路由组件路径真实存在。
- Vue、JavaScript 和样式 lint 通过。
- 构建或类型检查能够解析所有新增文件和导入。
- Git 差异中 `src/views/WaterSupply/**` 无修改。
