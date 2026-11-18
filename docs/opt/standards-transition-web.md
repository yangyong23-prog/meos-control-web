# 运行标准过渡期前端改动（W1–W5）

依据：《运行标准服务对 meos-control 配置的覆盖评估》"两个服务的下一步改动清单"（2026-11-18 定稿）。
后端配套：meos-control-parent 分支 `opt/standards-transition`（B1/B2/B4）。W6（下线菜单与页面）不在本轮。

所有改动都在开关后面，**默认全部关闭，关闭时行为与改动前完全一致**。

## 开关

前端开关只从主框架下发的 `window.meosEnv`（qiankun 下为 `window.proxy.meosEnv`）读取，不读 `apmCommonEnv`；值为 `true` 或 `'true'` 才算打开。

| 开关 | 条目 | 打开后 |
|---|---|---|
| `OPT_STRICT_EDGE_PREFIX` | W1 / W5 | `INTERFACE_PREFIX_MEOS_DTP`、`INTERFACE_PREFIX_AI_AUTORUN` 只认 meosEnv；没配时请求在本地拦截并提示"主框架未配置接口前缀 X"（同一前缀只提示一次），不再回落 `apmCommonEnv`（新主框架镜像里是云端开发网关） |
| `OPT_STANDARDS_READONLY` | W2 | 已切新运行标准的项目（后端 B1 `readOnly=true`），空调需求配置、需求日历、MPC 智能体配置页顶部显示"由云端运行标准管理"，MPC 启动按钮禁用；下方 13 个写接口在本地直接返回失败（与后端 B2 同形：HTTP 200、code `A0403`） |
| `OPT_STANDARDS_DISPLAY` | W3 | 已切项目的 AI 页标准值（平面图气泡、湿度开关）和需求日历（空调）改读后端 B4 同形接口。**后端本轮只做了原样转发，同形接口下一轮才有，上线前保持关闭** |
| `OPT_AI_BUBBLE_CACHE` | W3 | AI 平面图气泡的"空调季 + 空间运行标准"两次查询按 项目+日期(+空间) 缓存 5 分钟，所有气泡共享；失败结果不缓存 |

`OPT_STANDARDS_READONLY` 还需要后端两个开关 `switch.opt.standardsMode`、`switch.opt.standardsReadonly` 都打开、且项目已切（dtp-meos `demand_custom_config` 有 `STANDRAD_CONFIG` 行）才会生效；`/standards/mode` 不存在或报错时按"未切"处理。

## 与后端的接口约定（已与后端线程对齐）

| 接口 | 用途 |
|---|---|
| `GET {INTERFACE_PREFIX_MEOS}/standards/mode?projectId=` → `{ projectId, mode: STANDARD\|LEGACY, readOnly, source }` | B1，每个项目只请求一次（只有 W2/W3 开关打开时才请求） |
| `POST /standards/display/listConfigsByInstance` | B4 同形影子接口，与 `/demand/config/listConfigsByInstance` 同入参同出参（下一轮） |
| `POST /standards/display/listDateSetting` | B4 同形影子接口，与 `/demand/template/listDateSetting` 同形（下一轮） |
| `POST /standards/display/computeResult`、`/computeResultDetail` | B4 原样转发 dtp-meos，本轮后端已有，前端暂未使用 |

前端本地拦截的写接口（与后端 B2 默认清单一致，见 `src/utils/opt/standardsModeState.js`）：
`/demand/addInstanceConfig`、`/demand/addDemandConfig`、`/demand/clearSettings`、`/demand/referenceSettings`、`/demand/copyConfigs`、`/demand/blacklist/addRules`、`/demand/instanceGroup/add|edit|copy`、`/demand/template/applyTemplateByDate`、`/demand/template/clearCalendar`、`/valueSelection/saveConfig`、`/shellConfig/mpcAgentCfg`。只拦 `INTERFACE_PREFIX_MEOS` 下的路径。

## 需要主框架侧配置的（不改框架代码，作为部署配置 / 给框架开发者的需求）

盒子上 `window.meosEnv` 至少要有：

- `INTERFACE_PREFIX_MEOS`（我方后端）
- `INTERFACE_PREFIX_MEOS_DTP`（dtp-meos，下面 W4 清单里的手动控制、监测、干预都走它）
- `INTERFACE_PREFIX_AI_AUTORUN`（AI 页 `/strategy/*` 直调 agent）
- 以及要打开的 `OPT_*` 开关

4.91 目前是用 ConfigMap 覆盖 `yiheng-common-web-edge/static/env/apm.env.js` 追加了 7 个 meosEnv 前缀，需要核对是否包含上面两项（给框架开发者的问题清单第 13 条同一问题）。

## W4：`INTERFACE_PREFIX_MEOS_DTP` 调用归类

口径：`src/apis` 里实际经 `INTERFACE_PREFIX_MEOS_DTP` 发出的调用函数共 120 个（含经 `url()` / `urlDtp()` 间接引用的；以前说的 108 处是文本出现次数），去重后 80 个接口。"边缘 DTP / 云端 MEOS"表示代码写的是 `isEdge() ? MEOS_DTP : MEOS`。页面列是引用这些函数的目录；"无引用"的函数可在下线时顺手清理。

| 类别 | 调用函数数 | 不同接口数 | 处理 |
|---|---|---|---|
| 监测 | 30 | 14 | 保留。盒子上必须配好 INTERFACE_PREFIX_MEOS_DTP；dtp-meos 独立后仍由它提供。 |
| 手动控制 | 41 | 26 | 保留。手动控制统一经 dtp-meos 下发（对应后端 B5）；盒子上必须配好前缀。 |
| 干预 | 34 | 32 | 保留（W6 不下线干预）。归属待 G3 定：若定归 dtp-meos 则不动；若归 meos-control 需改前缀。 |
| 配置 | 15 | 8 | 配置类：时间表策略存在 dtp-meos。新运行标准服务的源/末端策略（acs）可能覆盖它，确认覆盖后随配置模块下线；本轮不动。 |
| 合计 | 120 | 80 | |

### 监测（30 处 / 14 个接口）

| 接口路径 | 说明 | 前缀 | 调用函数（文件:行） | 使用页面 |
|---|---|---|---|---|
| `/cold-heat/checkSystemRunningModelStatus` | 冷热源运行模式查询 | DTP | `checkSystemRunningModelStatus` systemDiagram.ts:347 | views/ACoperationMonitoring、views/operationMonitoring |
| `/cold-heat/getSystemRunningModel` | 冷热源运行模式查询 | DTP | `getSystemRunningModel` coolHot.ts:14<br>`getSystemRunningModel` systemDiagram.ts:335 | views/ACoperationMonitoring、views/operationMonitoring |
| `/demandStrategy/getChiller` | 读取（时间表/设备字典，展示用） | DTP | `getChillerAxios` control.ts:38<br>`getChillerAxios` common.ts:264<br>`getChillerAxios` timetable.js:16<br>`getChillerAxios` ACAC.js:86 | components/TimeTableEditorModal、views/ACAC、views/Common、views/System-Heat-Source、views/coldHotStrategicInterventions |
| `/demandStrategy/listScheduleInfoCodeDefine` | 读取（时间表/设备字典，展示用） | DTP | `listScheduleInfoCodeDefine` control.ts:30<br>`listScheduleInfoCodeDefine` common.ts:256<br>`listScheduleInfoCodeDefine` ACAH.js:62<br>`listScheduleInfoCodeDefine` ACAC.js:256 | views/ACAC、views/AI、views/Common、views/System-Heat-Source、views/coldHotStrategicInterventions、views/operationMonitoring |
| `/hotColdStationStrategyIntervention/listRunningStrategy` | 运行中策略/机组数据展示 | 边缘 DTP / 云端 MEOS | `coldHotListRunningStrategy` systemDiagram.ts:309<br>`chilllistRunningStrategy` hotColdStationStrategyIntervention.ts:96 | views/ACoperationMonitoring、views/operationMonitoring |
| `/hotStationStrategyIntervention/listRunningStrategy` | 运行中策略/机组数据展示 | DTP | `hotListRunningStrategy` systemDiagram.ts:359 | views/ACoperationMonitoring、views/operationMonitoring |
| `/runConsole/airTerminalZoneControllerParameter` | 运行控制台参数（页面轮询） | DTP | `airTerminalZoneControllerParameter` control.ts:22<br>`airTerminalZoneControllerParameter` common.ts:248<br>`airTerminalZoneControllerParameter` ACAH.js:55<br>`airTerminalZoneControllerParameter` ACAC.js:72 | views/ACAC、views/Common、views/System-Heat-Source、views/operationMonitoring |
| `/runConsole/allControllerParameter` | 运行控制台参数（页面轮询） | DTP | `allControllerParameter` control.ts:14<br>`allControllerParameter` common.ts:240<br>`getACACSystemRunning` AI.js:112<br>`allControllerParameter` ACAH.js:47<br>`allControllerParameter` ACAC.js:65 | views/ACAC、views/AI、views/Common、views/System-Heat-Source |
| `/running-monitor/queryManualAutoStatusByObjectId` | 手自动状态查询 | DTP | `queryRunMode` systemDiagram.ts:115 | views/ACoperationMonitoring、views/operationMonitoring、views/test |
| `/strategyIntervention/chillerStrategy/listRunningStrategy` | 运行中策略/机组数据展示 | 边缘 DTP / 云端 MEOS | `chilllistRunningStrategy` systemDiagram.ts:96 | views/ACoperationMonitoring、views/operationMonitoring |
| `/strategyIntervention/getInfoCodeDataTimeAndPrecisionType` | 运行中策略/机组数据展示 | 边缘 DTP / 云端 MEOS | `getInfoCodeDataTimeAndPrecisionType` systemDiagram.ts:424 | utils/helper.js、views/Common、views/System-Heat-Source |
| `/strategyIntervention/getRunningChillerData` | 运行中策略/机组数据展示 | DTP | `getRunningChillerData` systemDiagram.ts:253 | views/ACoperationMonitoring、views/operationMonitoring |
| `/strategyIntervention/lastFreezePumpGroup/listRunningStrategy` | 运行中策略/机组数据展示 | 边缘 DTP / 云端 MEOS | `listRunningStrategy` systemDiagram.ts:66<br>`listRunningStrategy` strategic.ts:137 | views/ACoperationMonitoring、views/operationMonitoring |
| `/strategyIntervention/listPumpGroupStrategy` | 运行中策略/机组数据展示 | DTP | `listPumpGroupStrategy` systemDiagram.ts:30 | views/ACoperationMonitoring、views/operationMonitoring |

### 手动控制（41 处 / 26 个接口）

| 接口路径 | 说明 | 前缀 | 调用函数（文件:行） | 使用页面 |
|---|---|---|---|---|
| `/calculate/lighting/circuitDemand` | 指令下发/手自动/解除干预 | 边缘 DTP / 云端 MEOS | `commandExecuteCircuitDemand` common.ts:146 | hooks/useGeneralControl.js |
| `/cold-heat/changeSystemRunningModel` | 冷热源运行模式切换/解除干预 | DTP | `changeSystemRunningModel` coolHot.ts:30 | views/ACoperationMonitoring、views/operationMonitoring |
| `/cold-heat/removeInterveneSystemRunningModel` | 冷热源运行模式切换/解除干预 | DTP | `removeInterveneSystemRunningModel` systemDiagram.ts:351<br>`removeInterveneSystemRunningModel` hotColdStationStrategyIntervention.ts:111 | views/ACoperationMonitoring、views/operationMonitoring |
| `/commandExecute/batchAutoCommandSendBySingleObject` | 指令下发/手自动/解除干预 | 边缘 DTP / 云端 MEOS | `batchAutoCommandSendBySingleObject` common.ts:101 | hooks/useGeneralControl.js |
| `/commandExecute/batchCommandSend` | 指令下发/手自动/解除干预 | DTP、边缘 DTP / 云端 MEOS | `batchCommandSend` common.ts:92<br>`batchCommandSend` ACAC.js:176 | hooks/useGeneralControl.js、views/ACAC |
| `/commandExecute/batchCommandSendBySingleObject` | 指令下发/手自动/解除干预 | 边缘 DTP / 云端 MEOS | `batchCommandSendBySingleObject` common.ts:110 | hooks/useGeneralControl.js |
| `/commandExecute/batchObjectCommandSend` | 指令下发/手自动/解除干预 | 边缘 DTP / 云端 MEOS | `batchObjectCommandSend` common.ts:119 | hooks/useGeneralControl.js |
| `/commandExecute/changeInfoCodeExpireTime` | 指令下发/手自动/解除干预 | 边缘 DTP / 云端 MEOS | `changeInfoCodeExpireTime` common.ts:128 | hooks/useGeneralControl.js |
| `/commandExecute/changeManualAutoStatus` | 指令下发/手自动/解除干预 | DTP、边缘 DTP / 云端 MEOS | `commandExecuteChangeManualAutoStatus` common.ts:83<br>`commandExecuteChangeManualAutoStatus` ACAC.js:185 | components/ObjectInfoComponents、components/systemInfo、hooks/useGeneralControl.js、views/ACAC |
| `/commandExecute/clearAccRuntimeClass` | 指令下发/手自动/解除干预 | 边缘 DTP / 云端 MEOS | `clearAccRuntimeClass` common.ts:190 | hooks/useGeneralControl.js |
| `/commandExecute/commandExecuteByBatch` | 指令下发/手自动/解除干预 | DTP | `commandExecuteByBatch` systemDiagram.ts:269 | views/ACoperationMonitoring、views/operationMonitoring |
| `/commandExecute/commandSend` | 指令下发/手自动/解除干预 | DTP | `commandSend` ACAC.js:168 | components/systemInfo、views/ACAC |
| `/commandExecute/releaseIntervention` | 指令下发/手自动/解除干预 | DTP、边缘 DTP / 云端 MEOS | `commandExecuteReleaseIntervention` common.ts:137<br>`commandExecuteReleaseIntervention` ACAC.js:108 | components/ObjectInfoComponents、hooks/useGeneralControl.js、views/ACAC |
| `/commandExecute/relieveIntervene` | 指令下发/手自动/解除干预 | DTP | `relieveIntervene` systemDiagram.ts:287 | views/ACoperationMonitoring、views/operationMonitoring |
| `/commandExecute/setManualAutoMatic` | 指令下发/手自动/解除干预 | DTP | `setManualAutoMatic` systemDiagram.ts:278 | views/ACoperationMonitoring、views/operationMonitoring |
| `/runConsole/${code}` | 运行控制台开关/手自动/解除干预 | DTP、边缘 DTP / 云端 MEOS | `consoleSwitchSet` control.ts:46<br>`consoleSwitchSet` common.ts:272<br>`consoleSwitchSet` ACAC.js:29 | views/ACAC、views/Common、views/System-Heat-Source、views/operationMonitoring |
| `/runConsole/changeManualAutoStatus` | 运行控制台开关/手自动/解除干预 | DTP | `changeManualAutoStatus` control.ts:53<br>`changeManualAutoStatus` ACAC.js:51 | components/SystemControl、views/ACAC、views/Common |
| `/runConsole/coolingSupplySwitchSet` | 运行控制台开关/手自动/解除干预 | DTP | `coolingSupplySwitchSet` ACAC.js:58 | views/AI |
| `/runConsole/releaseIntervention` | 运行控制台开关/手自动/解除干预 | DTP | `releaseIntervention` ACAC.js:101 | components/SystemControl、views/ACAC、views/Common |
| `/running-monitor/batchAutoSetOperatingParameters` | 设参/手自动/到期时间/解除干预 | DTP | `batchAutoSetOperatingParameters` ACOperationControl.js:96 | views/ACoperationMonitoring、views/operationMonitoring |
| `/running-monitor/batchSetOperatingParameters` | 设参/手自动/到期时间/解除干预 | DTP | `batchSetOperatingParameters` common.ts:30<br>`batchSetOperatingParameters` airterminalxplantrunmonitor.ts:96 | components/independentSetting、views/Common |
| `/running-monitor/changeManualAutoStatusByObjectId` | 设参/手自动/到期时间/解除干预 | DTP | `changeManualAutoStatusByObjectId` systemDiagram.ts:139<br>`changeManualAutoStatusByObjectId` common.ts:64<br>`changeManualAutoStatusByObjectId` airterminalxplantrunmonitor.ts:11 | components/ObjectInfoComponents、components/independentSetting、views/ACoperationMonitoring、views/Common、views/operationMonitoring |
| `/running-monitor/changeManualAutoStatusByObjectIds` | 设参/手自动/到期时间/解除干预 | DTP | `changeManualAutoStatusByObjectIds` LightingDetail.ts:10 | views/Common |
| `/running-monitor/changeManualExpireTimeByObjectId` | 设参/手自动/到期时间/解除干预 | DTP | `changeManualExpireTimeByObjectId` LightingDetail.ts:26<br>`changeManualExpireTimeByObjectId` systemDiagram.ts:218<br>`changeManualExpireTimeByObjectId` common.ts:73<br>`changeManualExpireTimeByObjectId` airterminalxplantrunmonitor.ts:43 | components/independentSetting、views/ACoperationMonitoring、views/operationMonitoring |
| `/running-monitor/releaseIntervention` | 设参/手自动/到期时间/解除干预 | DTP | `releaseIntervention` common.ts:55<br>`releaseIntervention` airterminalxplantrunmonitor.ts:104<br>`releaseIntervention` ACOperationControl.js:91 | components/ObjectInfoComponents、components/independentSetting、hooks/useGeneralControl.js、views/Common |
| `/running-monitor/setOperatingParameters` | 设参/手自动/到期时间/解除干预 | DTP | `setOperatingParameters` systemDiagram.ts:123 | views/ACoperationMonitoring、views/operationMonitoring |

### 干预（34 处 / 32 个接口）

| 接口路径 | 说明 | 前缀 | 调用函数（文件:行） | 使用页面 |
|---|---|---|---|---|
| `/hotColdStationStrategyIntervention/addFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `chillerStrategyAddFixedTimeStrategy` hotColdStationStrategyIntervention.ts:46 | views/coldHotStrategicInterventions |
| `/hotColdStationStrategyIntervention/batchDeleteFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `batchDeleteFixedTimeStrategy` hotColdStationStrategyIntervention.ts:70 | views/coldHotStrategicInterventions |
| `/hotColdStationStrategyIntervention/checkFixedStrategy` | 定时策略干预（增删改查/日历） | DTP | `checkFixedStrategy` hotColdStationStrategyIntervention.ts:22 | （无引用，可清理） |
| `/hotColdStationStrategyIntervention/deleteFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `deleteFixedTimeStrategy` hotColdStationStrategyIntervention.ts:62 | views/coldHotStrategicInterventions |
| `/hotColdStationStrategyIntervention/getAcahcObj` | 干预页的对象/季节/字典读取 | DTP | `getAcahcObj` hotColdStationStrategyIntervention.ts:81 | views/coldHotStrategicInterventions |
| `/hotColdStationStrategyIntervention/listFixedStrategyDateByMonth` | 定时策略干预（增删改查/日历） | DTP | `listFixedStrategyDateByMonth` hotColdStationStrategyIntervention.ts:30 | views/coldHotStrategicInterventions |
| `/hotColdStationStrategyIntervention/listFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `listFixedTimeStrategy` hotColdStationStrategyIntervention.ts:38 | views/coldHotStrategicInterventions |
| `/hotColdStationStrategyIntervention/querySeasonByTime` | 干预页的对象/季节/字典读取 | DTP | `querySeasonByTime` hotColdStationStrategyIntervention.ts:84 | views/coldHotStrategicInterventions |
| `/hotColdStationStrategyIntervention/updateFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `updateFixedTimeStrategy` hotColdStationStrategyIntervention.ts:54 | views/coldHotStrategicInterventions |
| `/hotStationStrategyIntervention/addFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `addFixedTimeStrategy` HeatStrateg.js:10 | views/HeatStrategicInterventions |
| `/hotStationStrategyIntervention/commandExecuteByBatch` | 解除/下发干预、临时策略到期 | DTP | `hitCommandExecuteByBatch` systemDiagram.ts:397 | views/ACoperationMonitoring、views/operationMonitoring |
| `/hotStationStrategyIntervention/deleteFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `deleteFixedTimeStrategy` HeatStrateg.js:18 | views/HeatStrategicInterventions |
| `/hotStationStrategyIntervention/getHotWaterDetaSetType` | 干预页的对象/季节/字典读取 | DTP | `getHotWaterDetaSetType` HeatStrateg.js:30 | views/HeatStrategicInterventions |
| `/hotStationStrategyIntervention/listFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `listFixedTimeStrategy` HeatStrateg.js:6 | views/HeatStrategicInterventions |
| `/hotStationStrategyIntervention/relieveIntervene` | 解除/下发干预、临时策略到期 | DTP | `hotEelieveIntervene` systemDiagram.ts:379 | views/ACoperationMonitoring、views/operationMonitoring |
| `/hotStationStrategyIntervention/updateFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `updateFixedTimeStrategy` HeatStrateg.js:14 | views/HeatStrategicInterventions |
| `/strategyIntervention/checkFixedStrategy` | 定时策略干预（增删改查/日历） | DTP | `checkFixedStrategy` HeatStrateg.js:26<br>`checkFixedStrategy` strategic.ts:34 | views/HeatStrategicInterventions、views/strategicInterventions |
| `/strategyIntervention/chillerStrategy/addFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `chillerStrategyAddFixedTimeStrategy` strategic.ts:74 | views/strategicInterventions |
| `/strategyIntervention/chillerStrategy/deleteFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `deleteFixedTimeStrategy` strategic.ts:102 | views/strategicInterventions |
| `/strategyIntervention/chillerStrategy/listFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `listFixedTimeStrategy` strategic.ts:60 | views/strategicInterventions |
| `/strategyIntervention/chillerStrategy/listFixedTimeStrategyByDateRange` | 定时策略干预（增删改查/日历） | DTP | `chillListFixedTimeStrategyByDateRange` strategic.ts:116 | views/strategicInterventions |
| `/strategyIntervention/chillerStrategy/queryByParam` | 干预页的对象/季节/字典读取 | DTP | `queryByParam` strategic.ts:129 | （无引用，可清理） |
| `/strategyIntervention/chillerStrategy/updateFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `updateFixedTimeStrategy` strategic.ts:88 | views/strategicInterventions |
| `/strategyIntervention/getCooler` | 干预页的对象/季节/字典读取 | DTP | `getCooler` strategic.ts:12 | views/ACoperationMonitoring、views/operationMonitoring、views/strategicInterventions |
| `/strategyIntervention/lastFreezePumpGroup/addFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `addFixedTimeStrategy` strategic.ts:158 | views/strategicInterventions |
| `/strategyIntervention/lastFreezePumpGroup/delFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `delFixedTimeStrategy` strategic.ts:186 | views/strategicInterventions |
| `/strategyIntervention/lastFreezePumpGroup/editFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `editFixedTimeStrategy` strategic.ts:172 | views/strategicInterventions |
| `/strategyIntervention/lastFreezePumpGroup/listFixedTimeStrategy` | 定时策略干预（增删改查/日历） | DTP | `lastFreezePumpGroupListFixedTimeStrategy` strategic.ts:145 | views/strategicInterventions |
| `/strategyIntervention/lastFreezePumpGroup/listFixedTimeStrategyByDateRange` | 定时策略干预（增删改查/日历） | DTP | `listFixedTimeStrategyByDateRange` strategic.ts:213 | views/strategicInterventions |
| `/strategyIntervention/listFixedStrategyDateByMonth` | 定时策略干预（增删改查/日历） | DTP | `listFixedStrategyDateByMonth` HeatStrateg.js:22<br>`listFixedStrategyDateByMonth` strategic.ts:47 | views/HeatStrategicInterventions、views/strategicInterventions |
| `/strategyIntervention/listStrategyObject` | 干预页的对象/季节/字典读取 | DTP | `listStrategyObject` strategic.ts:20 | views/strategicInterventions |
| `/strategyIntervention/resetTempStrategyPlanEffectEndDateTime` | 解除/下发干预、临时策略到期 | DTP | `resetTempStrategyPlanEffectEndDateTime` systemDiagram.ts:193 | views/ACoperationMonitoring、views/operationMonitoring |

### 配置（15 处 / 8 个接口）

| 接口路径 | 说明 | 前缀 | 调用函数（文件:行） | 使用页面 |
|---|---|---|---|---|
| `/demandStrategy/batchRemoveStrategy` | 时间表策略（需求策略）配置 | DTP | `batchRemoveStrategy` ACAC.js:129 | views/ACAC、views/ACAI、views/System-Heat-Source、views/WaterSupply、views/coldHotStrategicInterventions |
| `/demandStrategy/getStrategy` | 时间表策略（需求策略）配置 | DTP | `getStrategyOfDay` timetable.js:23<br>`getStrategyOfDay` ACAC.js:152 | components/TimeTableEditorModal、views/ACAC、views/System-Heat-Source |
| `/demandStrategy/listSpaceZoneAndPublicPumpGroup` | 时间表策略（需求策略）配置 | DTP | `listSpaceZoneAndPublicPumpGroup` timetable.js:14<br>`listSpaceZoneAndPublicPumpGroup` ACAC.js:141 | components/TimeTableEditorModal、views/ACAC、views/System-Heat-Source |
| `/demandStrategy/listStrategy` | 时间表策略（需求策略）配置 | DTP | `listStrategy` timetable.js:18<br>`listStrategy` ACAC.js:115 | components/TimeTableEditorModal、views/ACAC、views/ACAI、views/System-Heat-Source、views/WaterSupply、views/coldHotStrategicInterventions |
| `/demandStrategy/optionsEditStrategy` | 时间表策略（需求策略）配置 | DTP | `optionsEditStrategy` timetable.js:9<br>`optionsEditStrategy` ACAC.js:94 | components/TimeTableEditorModal、views/ACAC、views/System-Heat-Source |
| `/demandStrategy/optionsUpdateStrategy` | 时间表策略（需求策略）配置 | DTP | `optionsUpdateStrategy` timetable.js:7<br>`optionsUpdateStrategy` ACAC.js:79 | components/TimeTableEditorModal、views/ACAC、views/System-Heat-Source |
| `/demandStrategy/removeStrategy` | 时间表策略（需求策略）配置 | DTP | `removeStrategy` timetable.js:30<br>`removeStrategy` ACAC.js:122 | views/ACAC、views/ACAI、views/System-Heat-Source、views/WaterSupply、views/coldHotStrategicInterventions |
| `/demandStrategy/saveStrategy` | 时间表策略（需求策略）配置 | DTP | `saveStrategy` timetable.js:11<br>`saveStrategy` ACAC.js:148 | components/TimeTableEditorModal、views/ACAC、views/System-Heat-Source |
