# PRD 分类参数到前端映射追踪表（基线模板）

## 说明
- 一行一个参数 code。
- 字段缺失时填写 TBD，并在备注说明缺失来源。
- 二级分类对应后端参数分组(group)。
- 三级分类对应可选 tab 分类(tabObjectName)。

## 映射表

| 序号 | 章节区域 | 一级分类 | 二级分类(group) | 三级分类(tabObjectName) | 参数名称(name) | 后端参数映射(code) | 表单类型(form_type) | 参数单位 | 必填与校验范围 | 备注 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 4.3.2 | 空调冷热源自动需求计算条件输入 | group_acai_cooling_supply_temp | tab_cooling_supply_temp | 冷冻水供水温度设定值 | cooling_supply_temp_setting | input_number | ℃ | 必填；范围 4.0-20.0；一位小数 | 示例行 |

## 对账清单
- PRD 参数总数：
- sample 参数总数：
- 已映射 code 数：
- TBD 数：
