# meos-control-web 项目分析文档

> 生成日期：2026-05-11
> 项目名称：meos-control-web（MEOS 控制 Web）
> 作者：chenpeng
> 所属公司：北京博锐尚格 (Persagy)

---

## 一、项目概述

**meos-control-web** 是博锐尚格智慧建筑运营管理平台（MEOS）的核心前端应用之一，负责建筑设备系统的运行监控、控制与管理。系统覆盖空调、照明、通风、给排水、变配电、消防、安防、电梯等多个建筑子系统，为建筑运维人员提供统一的数字化管理界面。

项目采用 **微前端架构（Qiankun）**，作为子应用嵌入到 `mid-frame-web` 主框架中运行，同时支持独立开发模式。

---

## 二、技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5.13 | 前端框架 |
| TypeScript | ~4.9.5 | 类型系统 |
| Vite | 4.5.0 | 构建工具 |
| Vue Router | ^4.5.0 | 路由管理 |
| Pinia | 2.0.26 | 状态管理 |
| Axios | 1.2.0 | HTTP 客户端 |

### UI 与可视化

| 技术 | 版本 | 用途 |
|------|------|------|
| Element Plus | ^2.7.0 | 基础 UI 组件库 |
| Meri Plus | 4.1.9-beta | 定制 UI 组件库 |
| ECharts | ^5.5.1 | 图表可视化 |
| @antv/g6 | 5.0.43 | 图可视化引擎（关系图） |
| @yushu/core3d | 2.0.10 | 3D 引擎 |
| @yushu/3d-graph-engine | 1.0.4-beta2 | 3D 关系图引擎 |
| @yushu/relation-chart | 1.1.17 | 关系图表 |
| Konva | ^9.3.18 | Canvas 图形库 |
| Three.js (via @yushu/three-base) | ^1.0.7 | 3D 渲染 |

### 其他关键依赖

| 技术 | 用途 |
|------|------|
| vue-i18n | 国际化（中/英文） |
| qiankun | 微前端框架 |
| pinia-plugin-persistedstate | 状态持久化（加密存储到 sessionStorage） |
| dayjs | 日期时间处理（含时区支持） |
| @microsoft/fetch-event-source | SSE 实时数据推送 |
| swiper | 轮播组件 |
| axios | HTTP 请求 |
| vue-draggable-plus / vuedraggable | 拖拽组件 |

### 工程化工具

| 技术 | 用途 |
|------|------|
| ESLint + Prettier | 代码规范 |
| Stylelint | 样式规范 |
| Husky + lint-staged | Git 提交前检查 |
| Commitlint | 提交信息规范 |
| Less | CSS 预处理器 |
| Terser | 代码压缩 |
| unplugin-auto-import | API 自动导入 |
| unplugin-vue-components | 组件自动导入 |
| rollup-plugin-visualizer | 打包分析 |
| vite-plugin-compression | Gzip 压缩 |

---

## 三、项目架构

### 3.1 Monorepo 结构

项目根目录为 monorepo，包含多个子应用：

```
meos-control-web/                  # 根目录
├── meos-control-web/              # 主应用构建产物（含 video-sdk、dahua-rtsp-sdk）
├── meoi-aim-rcrm-web/             # AIM RCRM 子应用
├── meos-daily-report-web/         # 日报子应用
├── operation-duty-homepage/       # 运维值班首页子应用
├── src/                           # 主应用源码
├── env/                           # 环境变量配置
├── locales/                       # 国际化资源管理
├── mock/                          # Mock 数据
├── public/                        # 公共资源
├── docs/                          # 文档
├── plan/                          # 计划文档
├── scripts/                       # 脚本工具
└── translation/                   # 翻译资源
```

### 3.2 微前端架构

```
┌─────────────────────────────────────────────┐
│              mid-frame-web (主应用)           │
│  ┌─────────────────────────────────────────┐│
│  │     meos-control-web (子应用)            ││
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ││
│  │  │ 空调末端  │ │ 照明控制  │ │ 通风感知  │ ││
│  │  ├─────────┤ ├──────────┤ ├──────────┤ ││
│  │  │ 给排水   │ │ 变配电   │ │ 消防/安防 │ ││
│  │  └─────────┘ └──────────┘ └──────────┘ ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

- 主应用通过 Qiankun 加载本子应用
- 子应用通过 `renderWithQiankun` 暴露生命周期（bootstrap/mount/unmount/update）
- 通过 `qiankunWindow.__POWERED_BY_QIANKUN__` 判断运行环境
- 主应用传递 `props` 包含用户信息、项目信息、时区、WebEnv 等

### 3.3 源码目录结构

```
src/
├── apis/                 # API 接口层（~60+ 文件，按子系统划分）
├── apm-3d/               # 3D 场景相关（color, components, scenes, utils）
├── assets/               # 静态资源
│   ├── font/             # 字体文件
│   ├── images/imgs/      # 图片资源
│   ├── less/             # Less 变量与样式
│   ├── locales/          # 语言资源
│   └── svg/              # SVG 图标
├── components/           # 公共组件（~30+ 组件目录）
├── constants/            # 常量定义
├── directives/           # 自定义指令
├── hooks/                # 组合式函数（~25+ hooks）
├── lib/                  # 第三方库兼容
├── locales/              # 国际化配置
├── router/               # 路由配置
├── store/                # Pinia 状态管理（~10 stores）
├── styles/               # 全局样式
├── types/                # TypeScript 类型定义
├── utils/                # 工具函数（~30+ 文件）
├── video-sdk/            # 视频播放 SDK（海康等）
├── dahua-rtsp-sdk/       # 大华 RTSP SDK
└── views/                # 页面视图（~40+ 子系统目录）
```

---

## 四、路由系统

### 4.1 路由配置

路由定义在 `src/router/routes.js`，分为正式路由和测试路由两组，共约 65+ 条路由。

### 4.2 路由分类

| 类别 | 路由示例 | 说明 |
|------|---------|------|
| 首页 | `/system-status-home` | 系统状态感知首页 |
| 空调系统 | `/ac-operation-control` | 空调末端控制 |
| 冷热源 | `/system/ACAI` `/ACAC` | 空调冷热源系统 |
| 变配电 | `/:majorCode` | 系统状态感知关系图（AC/SE 等） |
| 照明 | `/lightxplantrunmonitor` `/outdoorlighting` | 室内/室外照明 |
| 给排水 | `/WS` `/ws-sewage-treatment` | 生活给水/污水处理 |
| 通风 | `/ventilation-perception` | 通风感知 |
| 消防 | `/fire-electricity` | 消防电感知 |
| 弱电 | `/WE` | 弱电感知 |
| 安防 | `/space-security-control` | 空间安防 |
| 电梯 | `/elevator-system` | 电梯系统 |
| 停车场 | `/parking-lot` | 停车场 |
| 客流 | `/passenger-flow-statistics` | 客流统计 |
| 厨房油烟 | `/kitchen-fumes` | 厨房排油烟 |
| 机房安全 | `/machine-room-safety` | 机房安全感知 |
| 报警 | `/meoscontrolalarm` | 运行报警 |
| 运行监测 | `/xplantrunmonitor` | 运行监测 |
| 运行标准 | `/operation-criterion` | 运行标准配置 |
| 运行日志 | `/operationLog` `/runLog` | 运行日志 |
| 运行分析 | `/runAnalysis` | 运行分析 |
| 复盘报告 | `/runretroreport` | 运行复盘报告 |
| 时间表 | `/strategicinterventions` | 策略干预时间表 |
| 需求管理 | `/demand-management/:type/home` | 需求管理 |
| 日历 | `/businessCalendar` `/demandCalendar` | 营业日历/需求日历 |
| 智能体 | `/AI` | 运行智能体 |
| 调试 | `/debug-tools-iot` | IoT 调试工具 |

### 4.3 路由守卫

`src/router/index.ts` 中的 `beforeEach` 守卫：
- 设置项目信息（projectId, groupCode）到 Store
- 设置用户信息到 Store
- 设置 HeaderConfig（时间区间、运行监测类型）
- 处理孤岛页面（islandPage）的标题
- 空调末端首次加载特殊处理（拦截到 preGuardPage）

---

## 五、状态管理

### 5.1 Store 一览

| Store 文件 | 用途 |
|-----------|------|
| `baseStore.ts` | 用户信息、项目信息、权限、Header 配置 |
| `componentStore.ts` | 组件状态共享 |
| `controlsScroll.ts` | 控制滚动状态 |
| `demandSituationControls.ts` | 需求情况控制 |
| `lightingDemandStore.ts` | 照明需求管理 |
| `loopControlList.ts` | 循环控制列表 |
| `midFrameStore.js` | 微前端主框架交互 |
| `showInfo.ts` | 信息展示 |
| `treeBuildFloor.js` | 建筑楼层树 |
| `xplantindoorenv.ts` | 运行监测环境 |
| `infoCodeData.js` | 信息码数据 |

### 5.2 持久化

- 使用 `pinia-plugin-persistedstate` 插件
- 存储到 `sessionStorage`（会话级）
- 数据经过加密（`persagy-tools` 的 `cryptoInstance`）
- key 前缀格式：`__persagy__{storeId}`

---

## 六、API 层

### 6.1 架构

```
Http 类 (src/utils/http.ts)
├── Axios 实例
├── Request 拦截器
│   ├── 添加公共请求头（userId, token, projectId, groupCode 等）
│   ├── 添加 HeaderConfig（IPDataStartTime, IPDataEndTime, IPType 等）
│   └── 自动合并 projectId 参数
├── Response 拦截器
│   ├── 统一错误处理（403/404/500/503/504）
│   ├── IoT 过期管理拦截
│   └── 自动提示错误信息
└── API 接口文件（src/apis/）
    ├── ACAC.js / ACAH.js / ACOperationControl.js
    ├── AI.js
    ├── MonitoringWE.js / WaterSupply.js
    ├── indoorLighting.js / lightingControl.ts
    ├── ventilationPerception.js
    ├── fireElectricity.js / SpaceSecurityControl.js
    ├── ...（约 60+ 文件）
```

### 6.2 后端服务前缀

配置文件 `src/config.js` 定义了大量后端服务接口前缀，按命名空间和服务编码两级查找，支持代理穿透：

| 配置名 | 对应服务 |
|--------|---------|
| INTERFACE_PREFIX_MEOS | MEOS 后端服务 |
| INTERFACE_PREFIX_AIM | AIM 后端服务 |
| INTERFACE_PREFIX_DTP_MEOS | BDTP-DTP 服务 |
| INTERFACE_PREFIX_IOTHUB | IoT Hub 服务 |
| INTERFACE_PREFIX_EMS | EMS 服务 |
| INTERFACE_PREFIX_DMP_ALARM | DMP 告警服务 |
| INTERFACE_PREFIX_MEOS_COMPUTE | MEOS 计算服务 |
| APM_MONITORING_CONFIGS | APM 监控配置 |

### 6.3 实时数据

- **SSE (Server-Sent Events)**：使用 `@microsoft/fetch-event-source` 和自定义封装
- **WebSocket**：通过 `dataDispatcher` 模块管理
- **IoT 过期管理**：`iotExpireManager` 自动处理 IoT 设备过期

---

## 七、视图层（业务子系统）

### 7.1 子系统分类

```
┌─────────────────────────────────────────────────┐
│                  meos-control-web                │
├────────────┬────────────┬────────────┬───────────┤
│  暖通空调   │  电气照明   │  给排水     │  安防消防  │
│  ────────  │  ────────  │  ────────  │  ────────  │
│  · 空调末端  │  · 室内照明 │  · 生活给水 │  · 空间安防 │
│  · 冷热源   │  · 室外照明 │  · 污水处理 │  · 消防电   │
│  · 热源    │  · 照明需求 │            │  · 机房安全 │
│  · 通风感知 │  · 光伏系统 │            │            │
├────────────┼────────────┼────────────┼───────────┤
│  其他系统   │  运维管理   │  智能分析   │  调试工具   │
│  ────────  │  ────────  │  ────────  │  ────────  │
│  · 电梯系统 │  · 运行日志 │  · 运行分析 │  · IoT调试  │
│  · 停车场   │  · 运行标准 │  · 复盘报告 │  · 组件测试 │
│  · 客流统计 │  · 营业日历 │  · 运行智能体│  · 性能测试 │
│  · 厨房油烟 │  · 需求日历 │            │  · 3D测试   │
│  · 弱电感知 │  · 需求管理 │            │            │
└────────────┴────────────┴────────────┴───────────┘
```

### 7.2 核心页面模式

大多数业务页面遵循以下模式：

1. **关系图模式** (`operationMonitoring`)：以系统拓扑关系图为核心，展示设备间的关联，支持点击下钻
2. **监测面板模式**：设备状态卡片网格 + 实时数据更新（SSE）
3. **控制面板模式**：设备控制 + 参数设置 + 时间表策略
4. **3D 场景模式** (`apm-3d`)：3D 建筑模型上的设备状态展现
5. **分析报表模式**：基于 ECharts 的数据趋势分析和报表

---

## 八、公共组件体系

### 8.1 组件分类

| 分类 | 组件 | 用途 |
|------|------|------|
| 3D 引擎 | `3dEngineElements/` | 3D 引擎封装 |
| 关系图 | `RelationChart/` | 系统拓扑关系图 |
| 空间地图 | `SpaceMapView/` `SpaceTopologyGraph/` | 楼层空间/拓扑 |
| 设备控制 | `SystemControl/` `equipmentList/` | 设备控制列表 |
| 时间表 | `Timetable/` `TimeTableEditorModal/` | 时间策略编辑 |
| 日历 | `calendar/` | 日历组件 |
| 图表 | `echarts/` | ECharts 封装 |
| 标签 | `equipmentTags/` `templateObjectTags/` | 设备/模板标签 |
| 卡片 | `cardContainer/` `AggregatedGroupCard/` | 聚合卡片 |
| 框架 | `frame/` `frameManagement/` `frame-management-upgraded/` | 框架管理 |
| 通用 | `common/` `hooks/` `popupTips/` `tagselect/` | 通用组件 |

### 8.2 自定义 Hooks

| Hook | 用途 |
|------|------|
| `useGeneralControl` | 通用控制逻辑 |
| `useDiagramControls` | 关系图控制 |
| `useInfoTags` / `useTags` | 标签逻辑 |
| `useObjectInfoSSE` | 对象信息 SSE 订阅 |
| `useDashboardSSEGlobal` | 仪表盘全局 SSE |
| `useAbnormalSSEGlobal` | 异常 SSE 全局 |
| `useBreakpointAdaptation` | 断点适配 |
| `usePage` | 页面通用逻辑 |
| `useLoading` | 加载状态 |
| `useDrawerVisible` | 抽屉显隐控制 |
| `useEffectWarp` | 特效封装 |
| `useWatchEffectWithCleanup` | 带清理的 Watch 封装 |
| `useFetchAbortController` | 请求取消控制 |
| `UseCancelTokenHooks` | 取消令牌 |
| `dataDockHandling` / `responsiveDock` | 数据对接 / 响应式适配 |

---

## 九、构建与部署

### 9.1 构建目标

| 模式 | 命令 | 用途 |
|------|------|------|
| 开发 | `pnpm run dev` | 本地开发（Vite dev server, port 3000） |
| 微前端 | `pnpm run dev:micro` | 微前端模式开发 |
| 标准构建 | `pnpm run build` | 生产构建 |
| 边缘构建 | `pnpm run build:edge` | 边缘环境构建 |
| 灰度构建 | `pnpm run build:gray` | 灰度环境构建 |
| 报告 | `pnpm run report` | 打包分析报告 |

### 9.2 构建产物

- 输出目录：`meos-control-web/`（可配置为 `meos-autocontrol-web-edge` 或 `meos-control-web-gray`）
- 静态资源分类输出：`static/js/`、`static/css/`、`static/images/`、`static/other/`
- 文件指纹：`[name]-[hash].[ext]`
- Gzip 压缩（>10KB 的文件）
- Terser 压缩（保留 class 名称，保留 console）

### 9.3 代理配置

开发环境通过 Vite proxy 代理：
- `/proxy-api` → 后端网关（自动映射到对应环境）
- `/proxy-wss` → WebSocket 代理
- `/yiheng-common-web` → 公共静态资源
- `/ai-bdmpc-agent-edge` → AI 智能体代理

---

## 十、环境配置

### 10.1 环境文件

| 文件 | 用途 |
|------|------|
| `.env` | 通用变量 |
| `.env.development` | 开发环境（含多组项目/集团编号） |
| `.env.development.local` | 本地覆盖（gitignore） |
| `.env.micro` | 微前端模式 |
| `.env.production` | 生产环境 |
| `.env.report` | 打包分析模式 |

### 10.2 关键环境变量

| 变量 | 说明 |
|------|------|
| `VITE_DEV_MODE` | 开发模式标识 |
| `VITE_DEV_USER` | 开发用用户 ID |
| `VITE_DEV_GROUPCODE` | 开发用集团编码 |
| `VITE_DEV_PROJECTID` | 开发用项目 ID |
| `VITE_DEV_LOCAL_IP` | 本地 IP |
| `VITE_DEV_TIME_ZONE` | 开发时区 |
| `VITE_ENV_vueDevTools` | Vue DevTools 开关 |

---

## 十一、数据流

```
用户操作 → Vue 组件
    ↓
Hooks (useGeneralControl, useTags, etc.)
    ↓
API 层 (src/apis/xxx.js)
    ↓
Http 类 (src/utils/http.ts) → Axios 拦截器
    ├── Request: 注入 userId, token, projectId, groupCode, accept-language
    └── Response: 统一错误处理, IoT 过期管理
    ↓
后端服务 (MEOS/AIM/DMP/IoTHub/etc.)
    ↓
实时数据推送 (SSE / WebSocket)
    ↓
Pinia Store 更新 → 响应式视图更新
```

---

## 十二、国际化

- 基于 `vue-i18n`，支持中文（zh）和英文（en）
- 语言资源在 `src/locales/langs/` 目录
- 通过 `x-frame-language` 在 localStorage 中存储语言偏好
- 资源通过 `LanguageManager` 从 `locales/` 根目录同步到 `src/locales/langs/`
- 所有用户提示文案通过 `i18n.global.t('meos_control_web.xxx')` 引用

---

## 十三、关键设计决策

1. **微前端架构**：使用 Qiankun 实现微前端，支持独立运行和嵌入主框架两种模式
2. **状态加密持久化**：敏感数据（用户信息、token 等）在 sessionStorage 中加密存储
3. **后端服务动态发现**：通过 `window.proxy` 或 `window[namespace]` 获取后端服务地址，支持多环境动态切换（config.js）
4. **可切换的构建目标**：同一套代码构建出标准版、Edge 版、灰度版，通过命令行参数控制
5. **实时数据架构**：SSE 为主 + WebSocket 辅助，结合 IoT 过期管理机制
6. **丰富的 3D/可视化**：深度集成了 G6、Three.js、自研 3D 引擎，支撑建筑拓扑和设备可视化
7. **组合式 API 优先**：使用 `<script setup>` + 自定义 Hooks 组织逻辑

---

## 十四、项目规模估算

| 维度 | 数量 |
|------|------|
| 视图目录（子系统） | ~45+ |
| API 接口文件 | ~60+ |
| 公共组件目录 | ~30+ |
| 自定义 Hooks | ~25+ |
| Pinia Store | ~11 |
| 工具函数文件 | ~30+ |
| 路由条目 | ~65+ |
| 依赖项（dependencies） | ~50 |
| 开发依赖项（devDependencies） | ~55 |

---

## 十五、注意事项与改进建议

1. **依赖版本较旧**：Vite 4.5、TypeScript 4.9、Vue 3.5（非最新），部分包如 `eslint` v8 需考虑升级
2. **TypeScript 覆盖不全**：部分 API 文件和 JS 文件未使用 TypeScript，类型安全有待提升
3. **硬编码 Token**：`main.ts` 中存在硬编码的 JWT Token，存在安全风险
4. **代码复用**：多个子系统存在相似的代码模式（卡片列表、关系图、SSE 订阅），可考虑进一步抽象
5. **测试覆盖**：未发现单元测试或端到端测试配置
6. **微前端通信**：通过 sessionStorage 和 `window.menuConfigplmokn` 全局变量通信，可考虑更规范的方式
