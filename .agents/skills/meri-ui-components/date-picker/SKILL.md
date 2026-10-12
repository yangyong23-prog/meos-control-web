---
name: date-picker
description: "Meri UI datePicker 组件技能。适用于查阅 datePicker 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-datePicker

用途:
- 日期/日期范围选择。

API 要点:
- 属性:
| 名称               | 类型           | 可选值                                                                   | 默认值              | 说明                                                                                                                         |
| ------------------ |--------------|-----------------------------------------------------------------------|------------------|----------------------------------------------------------------------------------------------------------------------------|
| modelValue/v-model | string       | --                                                                    | ''               | 绑定值                                                                                                                        |
| width              | number       | --                                                                    | 240              | 触发器宽度                                                                                                                      |
| disabled           | boolean      | --                                                                    | false            | 禁用整个组件                                                                                                                     |
| caption             | string       | --                                                                    | ''               | 前置标签                                                                                                                       |
| clearable          | boolean      | --                                                                    | true             | 是否可以清空                                                                                                                     |
| type               | string       | year/month/date/datetime/yearrange/monthrange/daterange/datetimerange | date             | 日期类型                                                                                                                       |
| placeholder        | string       | --                                                                    | 选择日期             | 提示文案                                                                                                                       |
| scope              | string       | --                                                                    | ''               | 限定可选时间段                                                                                                                    |
| itemMapHandle | Function | -- | undefined | 自定义每项样式以及禁用逻辑 |
| timePicker         | object       | '{format:"hms",stepH:1,stepM:15,stepS:15}'                            | '{format:"hms"}' | 日期+时间点类型（datetime），timePicker组件相关属性（注意：仅仅支持时间格式相关，如，format,stepH等，modelValue,scope依然由日期组件控制）                               |
| format | string       | --                                                                    | ''               | 显示在输入框中的格式                                                                                                                 |
| range-separator | string       | --                                                                    | -                | 选择范围时的分隔符,配合format使用                                                                                                       |
| popoverAttrs     | PopoverProps | {}                                                                    | --               | popover组件的属性            属性参考 [Popover props](https://dev.meos.center/meri-plus/packages/components/popover/#popover-props) |
| placeholderStyle     | object       | {}                                                                    | --               | 自定义placeholder样式                                                                                                           |
| simpleStyle     | boolean      | false                                                                 | --               | 是否开启简易样式                                                                                                                   |
| maxAllowedDays     | Number       | 0                                                                     | --               | 天范围选择时，最大可选天数：开始日期选择后，超出最大天数的日期将被禁用                                                                                        |
| singlePanel     | boolean      | false                                                                 | --               | 范围类型是否仅显示单个看板 - 用于不允许跨年、跨月的情况                                                                                              |
| yearSelectHide     | boolean      | false                                                                 | --               | 隐藏选择年份下拉框，用于无需区分年份，选择月、日的场景                                                                                                |
| beforeConfirmClick     | function     |                                                                       | --               | 范围类型点击确定前的拦截，用于需要特殊处理是否允许回显选中结果的情况                                                                                         |
| forbidPanelHide     | boolean      | false                                                                 | --               | 下拉看板禁止关闭，用于特殊场景下用户需要自主控制看板不关闭的情况                                                                                           |
| confirmBtnAttr     | object       | '{disabled: false,loading: false}'                                    | --               | type=range类型，确定按钮属性，需要配合forbidPanelHide，否则点击确定后会自动关闭看板                                                                     |
| panelDefaultDate     | string       | ''                                                                    | --               | 单个看板，看板头部默认选中的年（年、月）（例：type=date可设置为'2024.02';type=month，可设置为'2024'）                                                       |
| startPanelDefaultDate     | string       | ''                                                                    | --               | type=range，第一个看板头部默认选中的年（年、月）                                                                                              |
| endPanelDefaultDate     | string       | ''                                                                    | --               | type=range，第二个看板头部默认选中的年（年、月）                                                                                              |
| disabledTipsText     | string       | ''                                                                    | --               | 整个组件禁用时提示文案                                                                                                                |
| scopeDisabledTipsText     | string       | ''                                                                    | --               | 禁用节点的提示文案                                                                                                                  |
| confirmBtnText     | string       | ''                                                                    | 确定               | 确定按钮文案                                                                                                                     |
| cancelBtnText     | string       | ''                                                                    | 取消               | 取消按钮文案                                                                                                                     |
| showTypeSwitch     | boolean      |                                                                  | false               | 看板内是否显示日、周、月、年切换                                                                                                           |
| typeSwitchRange     | boolean      |                                                                  | false               | showTypeSwitch=true时，是否开启范围选择                                                                                              |
| typeSwitchList     | Array        |                    'date', 'week', 'month', 'year'                                          | 'date', 'week', 'month', 'year'               | showTypeSwitch=true时，自定义可以切换的类型列表                                                                                          |
| typeSwitchSelected     | string       |                    'date'                                          | 'date', 'week', 'month', 'year'               | showTypeSwitch=true时，当前选中的时间类型（v-model:typeSwitchSelected）                                                                                           |

| 名称    | 说明                 | 类型      |
| :------ |:-------------------|:--------|
| handleSetRangeSelected | 手动修改range看板开始、结束时间 | ({startTime:string,endTime:string})=>void

- 事件:
| 名称    | 回调参数                       | 说明                          |
| ------- | ------------------------------ |-----------------------------|
| change  | (value: string) | 绑定值变化时触发                    |
| clear   | event                            | clear 事件                    |
| blur    | event                             | 使选择器的输入框失去焦点, 并隐藏下拉框        |
| focus   | event                             | 使选择器的输入框获取焦点, 并打开下拉框        |
| typeSwitchChange   | event                             | showTypeSwitch=true时，切换日期类型 |

示例用法:
```vue
<template>
  <div class="select">
    <section>
      <div>基础用法</div>
      <m-date-picker
          caption="筛选时间："
          v-model="selectValue1"
          @change="handleChange"
          format="YYYY-MM-DD"
          class="test"
          id="111"
          :popoverAttrs="{popoverClass:'test333'}"
      ></m-date-picker>
    </section>
    <section>
      <div>带默认值</div>
      <m-date-picker
          v-model="selectValue2"
          @change="handleChange"
      ></m-date-picker>
    </section>
    <section>
      <div>报错信息</div>
      <m-date-picker
          v-model="selectValue1"
          errorInfo="必填项不可为空"
          @change="handleChange"
      ></m-date-picker>
    </section>
  </div>

</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  data() {
    return {
      selectValue1: '',
      selectValue2: '2021.09.22',
    }
  },
  methods: {
    handleChange(value) {
      console.log("时间变更2222", `value:${value}`, `this.selectValue1:${this.selectValue1}`);
    }
  }
});
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 日期/范围/时间组合选择
- 真实业务场景+推荐组合: 报表筛选（DatePicker + Select + Button）
- 常用用法: `type` + `valueFormat`
- 高级用法: 禁用日期、快捷选项、范围联动
- 主题与样式: 面板大小、快捷区样式
- 兼容性: value 与 format 需一致
- 性能建议: 避免频繁重建面板
- 迁移提示: 与其他库的格式化规则不同
- 故障排查: 回显异常多为格式字符串不匹配

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/datePicker/index.ts
- packages/components/datePicker/index.md
- packages/components/datePicker/test/datePicker.vue
