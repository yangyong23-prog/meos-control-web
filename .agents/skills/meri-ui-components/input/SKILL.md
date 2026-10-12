---
name: input
description: "Meri UI input 组件技能。适用于查阅 input 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-input

用途:
- 文本输入。

API 要点:
- 属性:
| 名称                      | 类型               | 可选值                          | 默认值 | 说明                                                                                                                               |
| :------------------------ | :----------------- | :------------------------------ | :----- | :--------------------------------------------------------------------------------------------------------------------------------- |
| model-value / v-model     | number / undefined | —                               | —      | 选中项绑定值                                                                                                                       |
| type                      | string             | text/password/textarea/vericode | text   | 输入框的类型 vericode 为密码输入框类型                                                                                             |
| placeholder               | string             |                                 | 请输入 | 输入框提示文字                                                                                                                     |
| errorText                 | string             | —                               | null   | 错误信息提示                                                                                                                       |
| prefixIcon                | string             |                                 |        | 前图标                                                                                                                             |
| suffixIcon                | string             |                                 |        | 后图标                                                                                                                             |
| clearable                 | boolean            | true/false                      |        | 清空 输入框                                                                                                                        |
| rows                      | number             |                                 | 4      | 输入框行数，仅 type 为 'textarea' 时有效                                                                                           |
| height                    | number /string     |                                 | 32     | 输入框高度，当 type 为 'textarea' 时有效，优先级高于 rows 且为最小高度                                                             |
| width                     | number /string     |                                 | 200    | 输入框宽度 当 type 为 'textarea' 时为最小宽度，                                                                                    |
| show-word-limit           | Boolean            |                                 |        | 是否显示字数                                                                                                                       |
| maxlength                 | number/object      |                                 |        | 最大字数：类型为 number 超出后不能再输入；为 object 可以继续输入也可设置错误文案 例 maxlength="{length:10,errorText:'文字超出了'}" |
| 支持所有原生的 Input 属性 |                    | —                               | -      | 原生的 Input 属性例如 readonly                                                                                                     |
| autofocus                 | boolean            | —                               | false  | 是否自动获取焦点                                                                                                                   |
| disabled                  | boolean            | —                               | false  | 是否禁用输入框                                                                                                                     |
| prependSuffixWidth        | number             | —                               | 0      | 设置前缀的宽度，为 0 是设置 minWidth：48,默认为 0                                                                                  |
| appendSuffixHeight        | number             | —                               | 0      | 设置后缀的宽度，为 0 是设置 minWidth：48,默认为 0                                                                                  |

- 事件:
| 名称       | 参数           | 说明                                   |
| :--------- | :------------- | :------------------------------------- |
| input      | (currentValue) | 绑定值被改变时触发                     |
| change     | (currentValue) | 仅在输入框失去焦点或用户按下回车时触发 |
| blur       | (event: Event) | 在组件 Input 失去焦点时触发            |
| focus      | (event: Event) | 在组件 Input 获得焦点时触发            |
| clear      | (event: Event) | 在组件 Input 点击清空触发              |
| keyup      | (event: Event) | 输入框 keyup 事件                      |
| pressEnter | (event: Event) | 输入框回车事件                         |

- 插槽:
| 名称    | 说明                                  |
| :------ | :------------------------------------ |
| prefix  | 输入框头部内容，只对 type="text" 有效 |
| suffix  | 输入框尾部内容，只对 type="text" 有效 |
| prepend | 输入框前置内容，只对 type="text" 有效 |
| append  | 输入框后置内容，只对 type="text" 有效 |

示例用法:
```vue
<template>
  <m-input v-model="value" @clear="clear" @pressEnter="pressEnter" :autofocus="false"> </m-input>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const value = ref("");
    let clear = ()=>{
      console.log('hhh');
    }
    const pressEnter = () => {
      console.log('回车')
    }
    return { value ,clear, pressEnter };
  },
});
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 文本/密码/多行输入
- 真实业务场景+推荐组合: 搜索框（Input + Button + Search）
- 常用用法: `v-model` + `placeholder`
- 高级用法: 前后缀、字数限制、校验提示
- 主题与样式: 尺寸/边框/错误态
- 兼容性: 与 formItem 联动校验
- 性能建议: 防抖输入用于搜索
- 迁移提示: 与旧组件的事件名不同
- 故障排查: 无法输入多为 disabled 或 v-model 绑定错误

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/input/index.ts
- packages/components/input/index.md
- packages/components/input/test/input.vue
