---
name: input-number
description: "Meri UI inputNumber 组件技能。适用于查阅 inputNumber 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-inputNumber

用途:
- 数值输入（完整功能）。

API 要点:
- 属性:
| 名称                  | 类型               | 可选值                            | 默认值    | 说明                              |
| :-------------------- | :----------------- | :-------------------------------- | :-------- | :-------------------------------- |
| model-value / v-model | number / undefined | —                                 | —         | 选中项绑定值                      |
| defaultValue          | number             | —                                 | —         | 默认数字值                        |
| min                   | number             | —                                 | -Infinity | 设置计数器允许的最小值            |
| max                   | number             | —                                 | Infinity  | 设置计数器允许的最大值            |
| step                  | number             | —                                 | 1         | 计数器步长                        |
| precision             | number             | —                                 | 0         | 数值精度                          |
| disabled              | boolean            | —                                 | false     | 是否禁用计数器                    |
| controls              | string             | operator/rightButton/operatorIcon | operator  | 操作按钮的控制按钮                |
| placeholder           | string             | —                                 | —         | 输入框默认 placeholder            |
| textAlign             | string             | left/center/right                 | —         | 数字的显示位置                    |
| errorText             | string             | —                                 | —         | 错误提示文字                      |
| size                  | string             | large/medium                      | medium    | size 大小                         |
| autofocus             | boolean            | —                                 | false     | 是否自动获取焦点                  |
| autoFill              | boolean            | —                                 | true      | 当前值是否需要自动补 0 来满足精度 |

- 事件:
| 名称   | 参数           | 说明                        |
| :----- | :------------- | :-------------------------- |
| change | (currentValue) | 绑定值被改变时触发          |
| input  | (event: Event) | 绑定值被改变时触发          |
| blur   | (event: Event) | 在组件 Input 失去焦点时触发 |
| focus  | (event: Event) | 在组件 Input 获得焦点时触发 |

示例用法:
```vue
<template>
<!-- /operator 是两侧有button的按钮 operatorIcon两侧只有图标的类型  rightButton 是右侧带单位输入框 -->
  <m-input-number v-model="dataVal" placeholder="输入数字" controls="operator" :step="2" :autofocus="false"></m-input-number>
  <m-input-number v-model="dataVal" placeholder="输入数字" controls="operatorIcon" :step="2" ></m-input-number>
  <m-input-number textAlign='left' placeholder="输入数字" controls="rightButton" :step="6">
     <template #suffix>
        元
      </template>
  </m-input-number>
</template>

<script>
export default {
  data() {
    return {
      dataVal: 24,
    };
  },
  methods:{
    blur(){
      console.log('211')
    }
  }
}
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 数值输入与步进控制
- 真实业务场景+推荐组合: 数量配置（InputNumber + FormItem）
- 常用用法: `min`/`max`/`step`
- 高级用法: 精度控制与格式化
- 主题与样式: 输入框与按钮样式
- 兼容性: 值类型需为 Number
- 性能建议: 避免过高精度导致频繁更新
- 迁移提示: 与 inputNum 的差异
- 故障排查: 不可输入多为 value 类型不一致

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/inputNumber/index.ts
- packages/components/inputNumber/index.md
- packages/components/inputNumber/test/index.vue
