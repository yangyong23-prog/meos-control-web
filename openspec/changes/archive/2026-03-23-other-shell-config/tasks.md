## 1. 参数与规则模型准备

- [x] 1.1 以 sample JSON 为基线整理新增参数清单，输出 ACAC/ACCC 的 PRD章节-场景-groupKey-code-参数中文名对照表
- [x] 1.2 在常量分组中新增并维护“间隔时间规则模型”对应 code 集合，与旧模型 code 显式区分
- [x] 1.3 明确规则模型行结构映射：旧模型使用 `countLimit`，新模型使用 `intervalTime`
- [x] 1.4 明确规则主 code：ACAC 使用 alg_air_cooling_start_interval_rule，ACCC 使用 alg_cooling_start_interval_rule

## 2. 表单渲染与交互扩展

- [x] 2.1 扩展壳配置表单渲染逻辑，确保新增分类与参数在正确层级展示
- [x] 2.2 扩展动态多行规则组件以支持“间隔时间”第二字段显示、单位与输入控件
- [x] 2.3 保持冷机范围选择交互一致（至少两台、跨行去重、规则增删）并适配新模型

## 3. 值转换、回显与保存链路

- [x] 3.1 在回显转换逻辑中按 code 分流解析旧模型与新模型 JSON 数据
- [x] 3.2 在提交组装逻辑中按模型输出 `countLimit` 或 `intervalTime`，避免字段语义混用
- [x] 3.3 验证新增参数在“无当前值/有当前值”场景下的默认值回显与重入编辑
- [x] 3.4 增加历史数据兼容：规则 JSON 含 `count` 字段时可正常回显并可继续编辑

## 4. 输入校验与国际化

- [x] 4.1 为新增参数接入对应校验规则（整数/一位小数、范围、5 的倍数、必填）
- [x] 4.2 为“间隔时间”接入整数且 0-15 的专用校验与错误提示
- [x] 4.3 补充中英文国际化文案（新增参数名、提示语、校验语）并完成界面替换

## 5. 联调与回归验证

- [x] 5.1 与后端联调 sample 中关键 code（湿球温度、频率范围、安全运行规则、出水温度、泵组参数）查询/保存一致性
- [x] 5.2 回归旧模型“最大开启台数”能力，确保并存改动不影响历史功能
- [x] 5.3 覆盖关键场景自测：新增参数展示、非法输入拦截、保存成功后回显、两类规则模型并存、历史 `count` 数据兼容

## 6. 实现前核对清单（任务 1.1 / 1.2 / 3.1 / 3.2）

- [x] 6.1（映射 1.1）参数基线文件核对完成
	- 核对文件：plan/20260302-shellconfig-other/20260302.shellconfig.acac.sample.json
	- 核对文件：plan/20260302-shellconfig-other/20260302.shellconfig.accc.sample.json
	- 核对文件：plan/20260302-shellconfig-other/20260302.shellconfig.airquality.sample.json
	- 核对项：
		- ACAC/ACCC/空间类 的 group 与 code 清单已整理并可追溯到 PRD 参数名称
		- 以下关键 code 已被纳入实现范围：
			- ACAC：alg_air_cooling_wet_bulb_temp_range、alg_air_cooling_pump_1_freq_range、alg_air_cooling_pump_2_freq_range、alg_air_cooling_pump_acopc_freq_range、alg_air_cooling_pump_acotc_freq_range、alg_air_cooling_space_low_duration、alg_air_cooling_mul_iplr_threshold、alg_air_cooling_mul_iplr_duration、alg_air_cooling_no_load_m、alg_air_cooling_free_cool_diff、alg_air_cooling_free_start_temp_threshold、alg_air_cooling_free_open_duration、alg_air_cooling_free_close_temp_threshold、alg_air_cooling_temp_adjust_range、alg_air_cooling_temp_main_adjust、alg_air_cooling_intermittent_temp_upper、alg_air_cooling_intermittent_duration、alg_air_cooling_start_interval_rule、alg_air_cooling_shield_all_enabled、alg_air_cooling_shield_count_enabled
			- ACCC：alg_cooling_wet_bulb_temp_range、alg_cooling_pump_1_freq_range、alg_cooling_pump_2_freq_range、alg_cooling_pump_acopc_freq_range、alg_cooling_pump_acotc_freq_range、alg_cooling_start_interval_rule、alg_cooling_shield_all_enabled、alg_cooling_shield_count_enabled
			- 空间类（提前开关时长）：alg_cooling_period_cool_down_factor、alg_cooling_period_warm_up_factor、alg_heating_period_warm_up_factor、alg_heating_period_cool_down_factor
		- 映射表字段完整：PRD章节、场景、groupKey、code、参数中文名

- [x] 6.2（映射 1.2）常量分组与模型 code 路由核对完成
	- 改动文件：src/views/xshellConfiguration/constants/constant.js
	- 核对项：
		- 旧模型与新模型 code 分组已显式区分（避免共用同一解析逻辑）
		- 规则主 code 映射已明确：
			- ACAC：alg_air_cooling_start_interval_rule
			- ACCC：alg_cooling_start_interval_rule
		- 与规则组件相关的 code 常量未破坏历史字段（countLimit）处理链路

- [x] 6.3（映射 3.1）回显转换逻辑核对完成
	- 改动文件：src/views/xshellConfiguration/utils/tools.ts
	- 核对项：
		- 按 code 分流解析旧模型（countLimit）与新模型（intervalTime）
		- 历史数据兼容映射已处理：当规则项仅有 `count` 时可正确回显
		- 规则行最小选择约束（至少两台）在回显后仍有效

- [x] 6.4（映射 3.2）提交组装逻辑核对完成
	- 改动文件：src/views/xshellConfiguration/utils/tools.ts
	- 联动文件：src/views/xshellConfiguration/configRight/common/MultipleRowsFormList.vue
	- 核对项：
		- 新模型提交字段为 `intervalTime`，旧模型提交字段保持 `countLimit`
		- 提交前无效规则行过滤逻辑不误删有效行
		- 保存 payload 对 `/shellConfig/save` 兼容（JSON 数组结构稳定）
		- 不出现旧模型字段被新模型覆盖或混写

- [x] 6.5（建议执行顺序）实施前走查
	- 先完成 6.1（基线确认）→ 再做 6.2（常量分组）→ 再做 6.3（回显）→ 最后做 6.4（提交）
	- 已记录本地核对日志：
		- Query/Save 链路：`tools.ts` 中 `formatterValue`、`updateshellConfigSave` 对新增与历史规则字段映射一致。
		- 本地构建：`pnpm build` 通过（shell 配置相关改动可正常打包）。
		- 目标文件 lint：`xshellConfiguration` 相关文件 ESLint 通过。
	- 联调补充记录：已对 QA 网关发起 `/shellConfig/query`、`/shellConfig/save` 探测，请求可达但返回不稳定（出现 `B0001`/`后台服务异常`），待具备有效联调会话后继续完成 5.1。
	- 5.1 重执行（按 sample 数据口径）记录：
		- 基线文件：plan/20260302-shellconfig-other/20260302.shellconfig.acac.sample.json、plan/20260302-shellconfig-other/20260302.shellconfig.accc.sample.json、plan/20260302-shellconfig-other/20260302.shellconfig.airquality.sample.json
		- 关键类目（湿球温度/频率范围/安全运行规则/出水温度/泵组参数）在 sample 与 `constant.js` 的 code 覆盖核对通过；`tools.ts` 中 `formatterValue` 与 `updateshellConfigSave` 的查询/保存分流链路核对通过。
		- 说明：sample 基线未包含 `alg_air_cooling_pump_2_freq_range`、`alg_cooling_pump_2_freq_range`，该两项待后续联调样本补齐后可补充复验。