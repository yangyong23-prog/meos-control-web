# ACAI Apply 验证与对齐清单

## 1. 后端未冻结字段对齐（对应任务 5.2）

| 项目 | 当前状态 | 影响范围 | 前端处理 |
|---|---|---|---|
| `backend_code` | 待后端确认 | 参数与字段映射 | 前端按 group_key + code 渲染，保持映射层可替换 |
| 控制逻辑 ACAI payload 字段名 | 待后端确认 | 保存/回显 | `controlLogic` 维持 `allItem` 原样透传，等待后端最终字段 |
| “冷机与热泵”显隐字段 | 待后端确认 | 控制逻辑显示 | 显隐以后端返回 group/items 为准，不在前端硬编码 |
| 设备组过滤与 Sy2Eg 细节 | 后端负责 | 设备组可见结果 | 前端不新增过滤逻辑，仅渲染返回结果 |

## 2. 代码层落地核对

- ACAI 自动化需求 tab 与分组动态映射：已接入 `algorithmLogic.vue`。
- 12 个 ACAI 二级分类状态字段组：已按命名规范新增。
- ACAI 控制逻辑分类与别名兼容：已接入 `controlLogic.vue`。
- 控制逻辑保存链路：沿用 `updateshellConfigSave('control', allItem)`，新增分组随 `allItem` 一并提交。
- 设备组过滤：本次未新增系统类/Sy2Eg 过滤实现（符合边界）。

## 3. 回归清单（对应任务 5.3）

### 3.1 自动化需求计算输入（ACAI）

- 一级 tab 切换到 ACAI 后，12 个二级分类可渲染。
- 二级分类切换不串数据，错误态与实例 tab 隔离。
- `number` / `range_pair` / `composite_pair` / `single_select` 校验生效。
- `dynamic_rows` 与 `single_select_dynamic_options` 行为正常。

### 3.2 控制逻辑输入

- “中央空调冷热源全系统”排序位于“中央空调供热全系统”后。
- “冷机与热泵”按后端返回显隐。
- 保存后回显一致，且不影响 ACAC/ACAH 分类。

### 3.3 设备组与异常路径

- ACCPC/ACOPC/ACOTC/ACCGP/ACCST/ACHPC/ACPPC 渲染路径可达。
- 空数据返回显示空态，不阻断页面交互。
- 接口异常提示后可重试。

## 4. 本地可执行验证（当前会话）

- 已完成静态代码核对与编译问题扫描（`algorithmLogic.vue`、`controlLogic.vue`、`constant.js`）。
- `algorithmLogic.vue` 中存在大量历史 lint 提示（如未使用参数），与本次 ACAI 逻辑无直接冲突。

## 5. 待联调项

- 真实后端接口联调验证（显隐、payload 字段、设备组结果）。
- UAT 场景下 106 参数完整录入-保存-回显链路验收。
