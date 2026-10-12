---
name: iot
description: '为 meos-control-web 根应用处理 DockSingleton / responsiveDock 全局响应式数据池的技能。适用于 IOT 信息点读取、自定义信息点读取、SSE 回填、动态数据初始化写池、异常事件/风险事件聚合、关联对象状态查询，以及约束 AI 在生成代码时优先通过全局池子 getIotData/getCustomInfo/getObjectDanegerStatus/getAbnormalEventsList 取数，而不是直接拿接口返回或临时变量到处透传。触发词：DockSingleton、responsiveDock、全局池子、全局数据池、getIotData、setIotData、getCustomInfo、setCustomInfo、异常事件、风险事件、SSE 回填、IOT_DATA_CHANGE、INFO_CODE_CONFIG_EVENT。'
argument-hint: '说明目标页面/组件、数据来源，以及是要读取 IOT/自定义信息、写入全局池、处理 SSE，还是做异常/风险状态聚合'
---

# meos-control-web IOT 全局池技能

## 技能目标

在根应用 `src/` 中处理 IOT 信息点、自定义信息点、异常事件、风险事件、关联对象状态时，帮助代理稳定完成以下事项：

- 优先复用 `src/hooks/responsiveDock.js` 提供的全局响应式单例 `DockSingleton`。
- 让页面、组件、hook 在**读数据**时优先从全局池子读取，而不是直接消费接口返回或到处维护局部副本。
- 让初始化查询与 SSE 推送在**写数据**时优先写入全局池子，再由 UI 统一从池子感知变化。
- 保持 IOT、自定义信息、异常事件、风险事件、关联对象这几类数据的读写边界清晰，避免“页面直接拿 res.data 就渲染”的散乱模式。

## 先理解这个单例的定位

`DockSingleton` 不是一个普通工具函数集合，它更像项目里的：

- **全局响应式缓存池**
- **IOT / 自定义信息统一取数入口**
- **SSE 推送落库后的统一读口**
- **异常事件 / 风险事件 / 关联对象状态聚合中心**

一句话原则：

> **接口与 SSE 负责写池子，页面与组件优先读池子。**

如果 AI 要在页面里展示实时值、状态值、风险状态、异常列表，默认先想 `DockSingleton.getInstance()`，而不是先想“把接口结果塞进一个新的 `ref({})` 里”。

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里显示一个设备/系统的最新 IOT 值”
- “这个页面不要直接吃接口数据，要跟 SSE 联动更新”
- “这个自定义信息点要从全局缓存里取”
- “这里要根据对象和关联对象判断异常/风险状态”
- “初始化查询后要把数据写入全局池，后面统一读取”
- “生成代码时别直接拿到数据写 UI，要走全局池子”

默认优先检查这些文件：

- `src/hooks/responsiveDock.js`
- `src/hooks/dataDockHandling.js`
- `src/components/hooks/useResponsiveDockSSEHandle.js`

典型消费方示例：

- `src/components/systemInfo/SystemParams/index.vue`
- `src/components/templateObjectTags/index.vue`
- `src/components/templateObjectHiddenTags/index.vue`
- `src/hooks/useInfoTags.js`

## 先判断你要用哪一类方法

### 1. 显示实时 IOT 值 → `getIotData`

适用于：

- 页面上展示设备/系统信息点值
- 计算运行状态、锁定状态、告警状态、模式状态
- SSE 已经接入，UI 只需要取最新值

标准用法：

```js
const { getIotData } = DockSingleton.getInstance();
const latest = getIotData(objectId, infoCode);
```

优先用它的场景：

- 信息点已经由初始化接口或 SSE 写入池子
- 组件需要随着全局数据变化自动刷新
- 你不希望每个页面自己再存一份 `res.data`

### 2. 显示自定义信息点 / 扩展配置 → `getCustomInfo`

适用于：

- 非 IOT 类型信息点
- 扩展设置、控制台类型、需求配置等自定义数据
- 通过 `infoCodeType + infoCode` 组合键读取

标准用法：

```js
const { getCustomInfo } = DockSingleton.getInstance();
const customInfo = getCustomInfo(objectId, infoCodeType, infoCode);
```

优先用它的场景：

- 数据不是普通 IOT 值
- 组件像 `SystemParams` 一样，需要先判断 `isIotInfoType`
- 你要避免把 custom 配置散落在页面临时变量中

### 3. 写入 IOT 值 → `setIotData`

适用于：

- 初始化接口加载后写入池子
- SSE `IOT_DATA_CHANGE`、`CLOUD_IOT_DATA_CHANGE` 到来时回填
- 扩展设置联动后修正某个 IOT 值

标准用法：

```js
const { setIotData } = DockSingleton.getInstance();
setIotData(objectId, infoCode, info);
```

优先用它的场景：

- 你在写“数据入口层”代码：如 `dataDockHandling`、SSE 处理 hook、初始化 hook
- 你希望后续所有消费方都从池子里统一读到新值

### 4. 写入自定义信息 → `setCustomInfo`

适用于：

- 初始化阶段写入自定义信息点
- `INFO_CODE_CONFIG_EVENT` / `INFO_EXTEND_SET` 等推送回填
- 风险事件监测状态、扩展设置等对象型数据写入

标准用法：

```js
const { setCustomInfo } = DockSingleton.getInstance();
setCustomInfo(objectId, info, info.infoCodeType, info.infoCode);
```

注意：

- key 是 `keys.join('_')`
- 所以同一类 custom 数据要保持 key 组合规则一致

### 5. 需要显示“值 + 单位/枚举名” → `getIotShowValue`

适用于：

- `dataSource` 枚举值要转显示文案
- 页面想直接得到“值 + 单位”的组合字符串

### 6. 需要异常状态/异常列表 → `setAbnormalEvent` / `getAbnormalEventsList` / `getObjectAbnormalStatus`

适用于：

- SSE 异常事件写池
- 页面判断对象是否有异常
- 聚合多个对象的异常事件列表

### 7. 需要风险状态/风险列表 → `setObjectDanegerEvent` / `getObjectDanegerStatus` / `getObjectDanegerEventsList`

适用于：

- 风险事件写池
- 页面根据对象及其关联对象计算风险状态
- 获取对象或对象组的风险事件列表

### 8. 需要对象关联关系 → `setObject2RelatedObject` / `getRelatedObjects`

适用于：

- 一个空间 / 系统要关联其下设备
- 风险/异常状态需要按“对象 + 关联对象”一起计算

## 最重要的分工边界

### 1. 页面 / 组件：优先“读池子”

常见场景：

- 模板展示值
- 计算属性判断状态
- tag、卡片、详情面板取最新值
- 根据对象状态渲染 UI

优先做法：

- `getIotData`
- `getCustomInfo`
- `getObjectDanegerStatus`
- `getObjectAbnormalStatus`
- `getAbnormalEventsList`

不要默认在页面里：

- 新建一份平行 `ref({})` 缓存同一份数据
- 直接拿接口 `res.data` 作为长期渲染来源
- SSE 到来后只改当前组件局部状态，不回写全局池

### 2. 初始化数据加载 hook：优先“写池子”

典型文件：

- `src/hooks/dataDockHandling.js`

标准职责：

- 请求动态数据模板/批量信息点/风险事件
- 解析响应结构
- 调 `setIotData` / `setCustomInfo` / `setAbnormalEvent` / `setObjectDanegerEvent`
- 把原始数据写入全局池，供所有消费方统一读取

### 3. SSE 处理 hook：优先“写池子，再通知刷新”

典型文件：

- `src/components/hooks/useResponsiveDockSSEHandle.js`

标准职责：

- 监听 `IOT_DATA_CHANGE`、`CLOUD_IOT_DATA_CHANGE`、`INFO_CODE_CONFIG_EVENT`、`ABNORMAL_EVENT`、`DANGER_EVENT` 等事件
- 将增量数据写入池子
- 必要时再触发局部 `refreshCallback`

这里的关键不是“组件自己存数据”，而是：

- **SSE 先写全局池**
- **UI 再从全局池读最新状态**

## 这套技能沉淀出的决策流程

```text
1. 先判断当前数据是 IOT、custom、异常事件还是风险事件
2. 再判断当前代码处于“读侧”还是“写侧”
3. 如果是读侧（页面/组件/渲染逻辑）→ 优先从 DockSingleton 取值
4. 如果是写侧（初始化接口/SSE/统一处理 hook）→ 优先写入 DockSingleton
5. 检查是否已有池中同类数据 → verify: 避免重复维护局部副本
6. 检查后续 UI 是否通过池子感知更新 → verify: 不要只改局部状态
```

## AI 生成代码时的默认规则

### 1. 能从池子读，就不要直接长期依赖接口返回

错误倾向：

- `const detail = ref({}); detail.value = res.data;` 然后整个页面一直用 `detail.value.xxx`

更推荐：

- 初始化时把 `res.data` 写入池子
- 页面渲染时用 `getIotData` / `getCustomInfo`

### 2. 能写入池子，就不要只更新当前组件的局部 state

错误倾向：

- SSE 到来后只 `currentRow.value = payload`

更推荐：

- `setIotData(...)` 或 `setCustomInfo(...)`
- 让其他依赖同一对象/信息点的组件也能同步拿到最新值

### 3. 先判断 info 类型，再选 getter

标准判断：

- IOT → `getIotData`
- custom → `getCustomInfo`
- 风险 → `getObjectDanegerStatus` / `getObjectDanegerEventsList`
- 异常 → `getObjectAbnormalStatus` / `getAbnormalEventsList`

不要把所有东西都塞进 `getIotData`。

### 4. 池子是主数据源，局部变量是派生结果

局部变量可以有，但更适合放：

- 当前选中项
- UI 展开收起状态
- 过滤结果
- 排序结果

不适合放：

- 已经能从 `DockSingleton` 读到的长期业务主数据

## 标准使用方式

### 页面读取 IOT 值

```js
import DockSingleton from '@/hooks/responsiveDock';

const { getIotData } = DockSingleton.getInstance();

const runStatus = computed(() => getIotData(props.objectId, 'runStatus'));
```

### 页面根据类型决定读 IOT 还是 custom

```js
const { getIotData, getCustomInfo } = DockSingleton.getInstance();

const getInfoData = value => {
	if (isIotInfoType(value.infoCodeType)) {
		return getIotData(systemId, value.infoCode);
	}
	return getCustomInfo(systemId, value.infoCodeType, value.infoCode);
};
```

### 初始化接口把数据写入池子

```js
const { setIotData, setCustomInfo } = DockSingleton.getInstance();

res.data.forEach(obj => {
	obj.relInfoCodeGroupConfigs?.forEach(group => {
		group.relInfoCodeConfigs?.forEach(info => {
			if (isIotInfoType(info.infoCodeType)) {
				setIotData(obj.id, info.infoCode, info);
			} else {
				setCustomInfo(obj.id, info, info.infoCodeType, info.infoCode);
			}
		});
	});
});
```

### SSE 到来后先回写池子

```js
const { setIotData } = DockSingleton.getInstance();

const iotHandle = res => {
	if (res?.data) {
		setIotData(res.data.objectId, res.data.infoCode, res.data);
	}
};
```

## 特别容易写错的地方

### 1. 把池子当普通工具，而不是主数据源

这会导致：

- 页面各自维护一份数据
- SSE 改了 A 页面，B 页面却不更新
- 逻辑越来越分散

### 2. 直接拿接口结果穿透到很多层组件

如果这份数据后续还会被 SSE 刷新，优先进入全局池，再统一读取。

### 3. 忘记 custom 信息的 key 是组合键

`setCustomInfo(objectId, data, ...keys)` 与 `getCustomInfo(objectId, ...keys)` 的 keys 必须保持一致。

### 4. 风险状态没把关联对象算进去

如果是空间 / 系统级状态，不要只查自己；要先判断是否需要：

- `setObject2RelatedObject`
- `getRelatedObjects`
- `getObjectDanegerStatus`

### 5. 清理方法乱用

像 `clearAllObjectInfo`、`clearOneObjectInfo`、`clearAllRelatedObjects` 这类清理方法不要在普通渲染逻辑里随手调用，通常只适合：

- 场景切换
- 页面销毁后的明确清理
- 项目级状态重置

## 完成标准

满足以下条件才算完成：

- 代码已经明确区分“读侧”和“写侧”
- 页面/组件优先通过 `DockSingleton.getInstance()` 取值
- 初始化接口与 SSE 优先写入全局池，而不是只改局部 state
- IOT / custom / 异常 / 风险 / 关联对象方法选择正确
- 没有平行维护一套本可由全局池托管的长期业务数据

## 给用户回复时建议说明

完成相关任务后，建议反馈：

1. 这次改动里哪些数据改成了“从全局池读取”
2. 哪些入口负责“写池子”（初始化接口 / SSE / 统一 hook）
3. 是否区分了 IOT 与 custom 信息读取方式
4. 是否避免了直接拿接口返回长期驱动 UI
