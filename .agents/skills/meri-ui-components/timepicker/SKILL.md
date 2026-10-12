---
name: timepicker
description: "Meri UI timepicker 组件技能。适用于查阅 timepicker 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-timepicker

用途:
- 时间选择。

API 要点:
- 属性:
| 名称       | 类型   | 可选值            | 默认值  | 说明           |
| :--------- | :----- | :---------------- | :------ | :------------- |
|  v-model   | string |  可为空,如果有初始值，需要按照HH:mm:ss格式传入，需要跟进对应得format传入对应得默认时间                 |         | 时间       |
| format     | string | h/m/s/hm/ms/hms    | hms      | 时间类型 |
| range      | boolean| true/false         | false    | 是否开启时间段 |
| scopeTime  | string |  "01:10:20-05:14:45"   需要按照HH:mm:ss格式传入，需要跟进对应得format传入对应得scopeTime               | ''      | 可选择的时间段 |
| placeholder| string |                 |     ''     | 占位符 |
| stepH     | number | 1-24    | 1      | 小时刻度 |
| stepM     | number | 1-60    | 1      | 分刻度 |
| stepS     | number | 1-60    | 1      | 秒刻度 |
| hideClear    | boolean |  true/false     | false      | 是否显示清空icon |
| errorText | string |    |       | 错误文本 |
| currentTime     | boolean | true/false      | false      | 下拉展开是否显示当前时间 |
| width     | number |    | 208      | 触发器宽度 |      |     |
| disabled     | boolean | true/false      | false      | 是否禁用 |
| disabledTipsText     | string |    |       | 组件整体禁用提示文案 |
| scopeDisabledTipsText     | string |    |       | 时间禁用提示文案 |
| popoverAttrs     | PopoverProps | {}      | --      | popover组件的属性 属性参考 [Popover props](https://dev.meos.center/meri-plus/packages/components/popover/#popover-props) |

- 事件:
| 名称              | 参数               | 说明         |
| :---------------- | :----------------- | :----------- |
| change            | (value: string) | 按钮点击回调 |

示例用法:
```vue
<template>
  <p>format hm</p>
  <m-time-picker v-model="testTime1" format="hm"></m-time-picker>
   <p>format hms</p>
  <m-time-picker v-model="testTime2" format="hms"></m-time-picker>
   <p>format s</p>
  <m-time-picker v-model="testTime3" format="s"></m-time-picker>
</template>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    ref,
    watch
  } from 'vue';

  export default defineComponent({
    setup() {
      const testTime = ref('01:20:59')
      const testTime2 = ref('')
      const testTime3 = ref('')
      const testTime4 = ref('01:00:09-01:34:12')
      const testTime1 = ref('')
      const timechange = (v: string) => {
        console.log(testTime.value);
        // testTime.value = v
      }
      const timechange1 = (v: string) => {
        console.log(v);
        testTime1.value = v
      }
      const timechange2 = (v: string) => {
        console.log('返回得时间', v);
        testTime2.value = v
      }
      const timechange3 = (v: string) => {
        console.log(v);
        testTime3.value = v
      }
      const timechange4 = (v: string) => {
        console.log(v);
        testTime4.value = v
      }
      const errtext = ref('32432')
      const changeerr = () => {
        errtext.value = ''
      }
      return {
        changeerr,
        errtext,
        testTime,
        testTime1,
        testTime2,
        testTime3,
        testTime4,
        timechange,
        timechange1,
        timechange2,
        timechange3,
        timechange4
      };
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
- 适用场景: 时间点/时间范围选择
- 真实业务场景+推荐组合: 值班时间选择（TimePicker + FormItem）
- 常用用法: `format` + `step`
- 高级用法: 自定义面板内容与限制区间
- 主题与样式: 面板宽度与选中态样式
- 兼容性: 受时区/格式影响
- 性能建议: 大量时间项时控制步长
- 迁移提示: 与旧组件的格式化规则不同
- 故障排查: 选中值不回显多为格式不一致

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/timepicker/index.ts
- packages/components/timepicker/index.md
- packages/components/timepicker/test/format.vue
