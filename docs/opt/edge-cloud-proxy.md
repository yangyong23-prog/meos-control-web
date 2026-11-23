# 边缘前端云端接口改走盒内转发（OPT_EDGE_CLOUD_PROXY）

2026-11-23 Blake 决定：天气、电价、碳排这几个原先由浏览器直连云端的请求，在盒子上改为经 meos-control 转发。现场浏览器不需要访问外网，云端也不需要放行跨域。工作历日期标签一并处理：盒内有 mid-calendar，但 IP 入口没有它的路由。

| 调用 | 原地址 | 开关打开后 |
|---|---|---|
| `Hour24Forecast`（AI 首页 24 小时天气） | `INTERFACE_PREFIX_BDTP_WEATHER/api/entrance/unifierJson/Hour24Forecast` | `INTERFACE_PREFIX_MEOS/opt/edgeCloudProxy/weather/hour24Forecast` |
| `queryProjectElecPrice`（项目电价） | `INTERFACE_PREFIX_BDTP_PERSIST/iot/ipcal/data/queryProjectElecPrice` | `.../opt/edgeCloudProxy/persist/queryProjectElecPrice` |
| `queryProjectCarbonData`（碳排） | `INTERFACE_PREFIX_BDTP_ELECTRICITY/carbon/queryCategoryData` | `.../opt/edgeCloudProxy/electricity/carbonCategoryData` |
| `getAcQuarter`（AI 平面图气泡，空调季） | `INTERFACE_PREFIX_MID_CALENDAR/v2.0/work/calendar/getEveryDayDateTag` | `.../opt/edgeCloudProxy/calendar/getEveryDayDateTag` |

- 开关：`window.meosEnv.OPT_EDGE_CLOUD_PROXY: true`，只在边缘环境（isEdge）生效。后端要同时打开 `switch.opt.edgeCloudProxy`，见 meos-control-parent 的 docs/opt/edge-cloud-proxy.md。
- 后端原样返回下游响应，前端解析逻辑不变。
- 同一版本把 AIM、EMS、IT_OPS、DMP、DMP_ALARM 加入 `DISABLED_ON_EDGE_PREFIX_KEYS`。它们在盒子上没有对应服务，也不需要；未配置时只打一行 info 日志，请求静默拦截。
