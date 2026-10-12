# 分类动态分发配置映射（group_key -> stateKey）基线模板

## 说明
- 每个二级分类至少一组映射。
- 若存在历史命名偏差，请在“现状命名”与“建议标准名”中同时记录。

## 映射表

| 分类类别 | group_key | 现状命名(tab_on/tabs_list/tab_Data/Data/ErrorData) | 建议标准名(tab_on/tabs_list/tab_Data/Data/ErrorData) | 错误监听接入说明 | 备注 |
|---|---|---|---|---|---|
| 示例：空调冷热源自动需求计算条件输入 | group_acai_cooling_supply_temp | second_tab_acai_cooling_supply_temp_on / second_tab_acai_cooling_supply_temp_tabs_list / second_tab_acai_cooling_supply_temp_tab_Data / acaiCoolingSupplyTempData / acaiCoolingSupplyTempErrorData | 同现状 | 纳入全局 error watcher | 示例行 |

## 覆盖统计
- 二级分类总数：
- 已建立映射的 group_key 数：
- 已接入 ErrorData 监听的分组数：
- 命名偏差分组数：
