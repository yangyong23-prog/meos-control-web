# 边缘去掉“异常事件”页签和面板（OPT_HIDE_ABNORMAL_EVENTS）

背景：新边缘架构里异常监测、研判归 meos-hub 工作台，自控页面只负责运行监控和人工控制（Blake 2026-11-23）。

开关：`window.meosEnv.OPT_HIDE_ABNORMAL_EVENTS = true`（主框架运行时配置，默认关闭；云端和其他部署不受影响）。

## 打开后的效果

| 位置 | 处理 | 实现 |
|---|---|---|
| 所有详情抽屉（CommonDrawer）里标签为“异常事件”的 DrawerPane，约 30 处 | 不注册页签、不渲染内容 | `components/common/CommonDrawer/DrawerPane.vue` 按文案统一识别 |
| 运行监控设备抽屉（运行监控 / 异常事件 / 关联信息） | 去掉“异常事件”页签 | `operationMonitoring`、`ACoperationMonitoring` 的 `components/info/Equipment.vue` |
| 右侧面板“运行控制 / 异常事件”分段页签：系统页（System、ACAC、热源、SystemsAndControl 及其 ACAI/给水等插槽）、空调运行控制、SEEA、照明、通风升级版、通风感知、停车场、厨房油烟、电梯、空间安防、污水处理、机房安全（保留“状态未知风险”） | 页签条隐藏，只留运行控制；异常事件列表不挂载 | 各页面模板 `v-if="!hideAbnormal"` |
| 右侧整栏只有异常事件列表的页面：弱电（MonitoringWE）、消防电、SEPre、卫生间、客流统计、污水处理（非楼层视图）、通用运行监控里没有控制的系统 | 右侧栏整块不显示，左侧占满 | `ExpansionCollapse` / `ExpansionCollapseNew` 新增 `hideRight` |
| 地图悬浮卡片里的“异常事件”段落（楼层图、回放图、popupTips、照明空间卡片） | 不显示 | 模板条件 |
| 照明控制模块/空间侧栏的“异常事件”页签、照明地图“异常事件”筛选项 | 去掉 | `withoutAbnormalTabs` |

## 后端请求

开关打开时，http 拦截器对 meos-control 的 11 个异常事件查询接口不发请求，本地返回 `code=00000, data=[]`
（这些接口返回值都是列表，见 `utils/opt/hideAbnormal.js` 的 `ABNORMAL_EVENT_PATHS`）。各页面原来每分钟一次的异常事件轮询随之消失。

未处理（数据为空后自然没有内容，如需也去掉再加）：关系图/平面图图例里的“异常事件”、头部筛选里的“异常事件”选项、
卡片上的“异常事件: N”计数、照明回路表格的异常事件列、SSE 里的 ABNORMAL_EVENT 订阅类型。
