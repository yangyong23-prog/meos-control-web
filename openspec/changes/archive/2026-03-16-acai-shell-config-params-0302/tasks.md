## 1. 数据与模型基线对齐

- [x] 1.1 基于 `prd-param-group-form-mapping` 建立 ACAI 参数元数据清单（group_key、form_type、required、范围、默认值）。
- [x] 1.2 定义二级分类到状态字段组的命名映射常量，覆盖 `*_tab_on`、`*_tabs_list`、`*_tab_Data`、`*Data`、`*ErrorData`。
- [x] 1.3 为复杂参数（主机开启台数限制规则、是否支持大小机同时开）定义前端数据结构与默认值生成逻辑。

## 2. 壳配置页面 ACAI 参数渲染

- [x] 2.1 新增 ACAI 二级分类面板与参数分组渲染入口，保证分类切换时数据隔离。
- [x] 2.2 按 `form_type` 实现 number/range_pair/composite_pair/single_select/dynamic_rows/single_select_dynamic_options 渲染。
- [x] 2.3 接入参数级校验（必填、上下限、倍数规则、上下限关系）并统一错误展示。
- [x] 2.4 完成 106 条参数覆盖核对，确保映射无缺项、无多项。

## 3. 控制逻辑 ACAI 联动接入

- [x] 3.1 在“冷热源控制逻辑选机条件输入”新增“中央空调冷热源全系统”分类并校验排序位置。
- [x] 3.2 在 ACAI 分类接入“冷机与热泵”参数渲染，显隐完全以后端返回为准。
- [x] 3.3 扩展控制逻辑保存与回显 payload，纳入 ACAI 字段并保持与 ACAC/ACAH 兼容。

## 4. 设备组过滤边界与联调

- [x] 4.1 确认前端不新增系统类/Sy2Eg 过滤逻辑，仅消费后端过滤结果。
- [x] 4.2 对 ACCPC/ACOPC/ACOTC/ACCGP/ACCST/ACHPC/ACPPC 渲染路径进行联调验证。
- [x] 4.3 补充空列表、接口失败重试等兜底交互，保证页面稳定可用。

## 5. 验证与交付

- [x] 5.1 完成参数录入、保存、回显全链路自测（含供冷/供热、复杂参数、异常路径）。
- [x] 5.2 完成与后端字段未冻结项清单对齐（`backend_code`、payload 字段名、显隐字段）。
- [x] 5.3 形成回归清单并更新变更说明，准备进入 `/opsx:apply` 实施阶段。
