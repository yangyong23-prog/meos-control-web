---
name: input-num
description: "Meri UI inputNum 组件技能。适用于查阅 inputNum 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-inputNum

用途:
- 数值输入（简化版）。

API 要点:
- 属性:
| 名称                  | 类型               | 可选值                            | 默认值    | 说明                                                          |
| :-------------------- | :----------------- | :-------------------------------- | :-------- | :------------------------------------------------------------ |
| model-value / v-model | number / undefined | —                                 | —         | 选中项绑定值                                                  |
| defaultValue          | number             | —                                 | —         | 默认数字值                                                    |
| min                   | number             | —                                 | -Infinity | 设置计数器允许的最小值                                        |
| max                   | number             | —                                 | Infinity  | 设置计数器允许的最大值                                        |
| step                  | number             | —                                 | 1         | 计数器步长                                                    |
| precision             | number             | —                                 | 0         | 数值精度                                                      |
| disabled              | boolean            | —                                 | false     | 是否禁用计数器                                                |
| controls              | string             | operator/rightButton/operatorIcon | operator  | 操作按钮的控制按钮                                            |
| placeholder           | string             | —                                 | —         | 输入框默认 placeholder                                        |
| textAlign             | string             | left/center/right                 | —         | 数字的显示位置                                                |
| errorText             | string             | —                                 | —         | 错误提示文字                                                  |
| size                  | string             | large/medium                      | medium    | size 大小                                                     |
| autofocus             | boolean            | —                                 | false     | 是否自动获取焦点                                              |
| autoFill              | boolean            | —                                 | true      | 当前值是否需要自动补 0 来满足精度                             |
| suffixWidth           | number             | —                                 | 0        | 设置后缀插槽的宽度，设置为 0 时不设置宽度，根据文字宽度自适应 |

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
  <m-input-num v-model="dataVal" placeholder="输入数字" controls="operator" :step="2" :autofocus="false"></m-input-num>
  <m-input-num v-model="dataVal" placeholder="输入数字" controls="operatorIcon" :step="2" ></m-input-num>
  <m-input-num textAlign='left' placeholder="输入数字" controls="rightButton" :step="6">
     <template #suffix>
        元
      </template>
  </m-input-num>
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
- 适用场景: 轻量数值输入
- 真实业务场景+推荐组合: 简单数值（InputNum + FormItem）
- 常用用法: 基础 `v-model` 绑定
- 高级用法: 自定义格式或校验提示
- 主题与样式: 尺寸与对齐
- 兼容性: 值类型需统一
- 性能建议: 与表单联动时避免频繁校验
- 迁移提示: 与 inputNumber API 不同
- 故障排查: 变更无效多为类型转换问题

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/inputNum/index.ts
- packages/components/inputNum/index.md
- packages/components/inputNum/test/index.vue
