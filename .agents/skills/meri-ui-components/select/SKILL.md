---
name: select
description: "Meri UI select 组件技能。适用于查阅 select 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-select

用途:
- 下拉选择。

API 要点:
- 属性:
| 名称                   | 类型                      | 可选值                                                                      | 默认值                      | 说明                                                                                                         |
| ---------------------- | ------------------------- | --------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| modelValue/v-model     | string/string[]           | --                                                                          | ''/[]                       | 绑定值, 单选是字符串, 多选是字符串数组                                                                       |
| options                | Item[]                    | --                                                                          | []                          | 下拉列表选项数组,如果要设置选项默认值, 则必须设置此选项, item 类型`{id:string,name:string,disabled:boolean}` |
| valueKey               | string                    | --                                                                          | 'id'                        | 选项唯一标识, 用于匹配选项值, 如设置了 valueKey="value", 则匹配值为 options[i].value 而不是 options[i].id    |
| labelKey               | string                    | --                                                                          | 'name'                      | 选项显示的文本, 如设置了 labelKey="name", 则显示为 options[i].name                                           |
| disabled               | boolean                   | --                                                                          | false                       | 禁用整个组件                                                                                                 |
| prefix                 | string                    | --                                                                          | ''                          | 前置标签                                                                                                     |
| clearable              | boolean                   | --                                                                          | false                       | 是否可以清空                                                                                                 |
| searchable             | boolean                   | --                                                                          | false                       | 是否可以搜索                                                                                                 |
| panelSearchable        | boolean                   | --                                                                          | false                       | 是否开启下拉面板里的搜索,此属性与 searchable 只能设置一个, 如果同时为 true,则此选项优先生效                  |
| panelSearchPlaceholder | string                    | --                                                                          | --                          | 下拉框中搜索框的 placeholder 属性, panelSearchable 为 true 时才可设置此属性                                  |
| autoClearSearch        | boolean                   | --                                                                          | true                        | 失去焦点后自动清空筛选                                                                                       |
| multiple               | boolean                   | --                                                                          | false                       | 是否多选                                                                                                     |
| multipleLimit          | number                    | --                                                                          | 0                           | 多选限制数量,0 为不限制,                                                                                     |
| hasConfirm             | boolean                   | --                                                                          | false                       | 当多选时, 是否需要确认取消按钮                                                                               |
| mode                   | string                    | 'multiple'&#124;'tags'                                                      | 'multiple'                  | 仅开启多选有效,显示模式为标签或者'已选择 XX                                                                  |
| placeholder            | string                    | --                                                                          | '请选择'&#124; '搜索或选择' |                                                                                                              |
| placeholderColor       | string                    | --                                                                          | --gray-400                  | css 中支持颜色值的字符串,例如'red','#333'                                                                    |
| size                   | number &#124; string      | 'small' &#124; 'medium' &#124; 'large' &#124; 'auto'                        | "medium"                    | 设置触发器和下拉框的宽度                                                                                     |
| maxWidth               | number                    | --                                                                          | 360                         | 设置触发器中选中值部分的最大宽度, 此属性需配合 size='auto'来使用                                             |
| menuSize               | number &#124; string      | 'min'&#124; 'small' &#124; 'medium' &#124; 'large' &#124;'max'&#124; 'auto' | "medium"                    | 单独设置下拉框的宽度                                                                                         |
| maxScrollHeight        | number &#124;             | --                                                                          | --                          | 设置下拉菜单可滚动区域的最大高度                                                                             |
| maxTagCount            | number                    | --                                                                          | 0                           | 最多显示多少个 ,0 表示不限制, tag 剩余的显示+n                                                               |
| maxTagTextLength       | number                    | <br />                                                                      | 0                           | 最大显示的 tag 文本长度                                                                                      |
| maxTagWidth            | number                    | <br />                                                                      | 0                           | 最大 tag 宽度，例子:设置 100,则 tag 最大宽是 100px                                                           |
| level                  | string                    | "Left",'Right'                                                              | --                          | 设定下拉框的弹出方向(仅控制水平方向, 左对齐或者右对齐触发器)                                                 |
| virtual                | boolean                   | --                                                                          | false                       | 是否开启虚拟列表                                                                                             |
| isShowEmpty            | boolean                   | --                                                                          | undefined                   | 自定义显示空插槽                                                                                             |
| zIndex                 | number                    | --                                                                          | undefined                   | 设置下拉弹窗的 z-index 属性                                                                                  |
| popoverClass           | string                    | --                                                                          | --                          | 弹出框自定义 class                                                                                           |
| noborder               | boolean                   | --                                                                          | false                       | 设定无边框模式                                                                                               |
| teleport               | string/Ref                | --                                                                          | body                        | 将下拉菜单渲染到指定元素, 传值同 teleport 元素的 to 属性                                                     |
| beforeClickItem        | (Item,done)=>void         | --                                                                          | undefined                   | 选项点击的前置事件,可以阻拦点击事件                                                                          |
| tipsTagHandleName      | (name,index,items) => any | --                                                                          | undefined                   | 自定义 select 多选 tips 中的 tag 文案                                                                        |
| popoverAttrs     | PopoverProps | {}                                                                    | --      | popover组件的属性 属性参考 [Popover props](https://dev.meos.center/meri-plus/packages/components/popover/#popover-props) |
| clickOutSideIgnore     | string/HTMLElement |--                                                                   | ''      | 设置点击外部区域时要忽略的元素来防止下拉面板收起,可传入选择器字符串或dom
| hasCheckAll     | boolean |--                                                                   | true      | 是否开启全选复选框
| maxMenuWidth     |  number|--                                                                   | 680      | 下拉面板最大宽度
| beforeConfirm        | (Ids,done)=>void         | --                                                                          | undefined                   | 下拉确定按钮的前置事件，Ids为当前已选择节点id数组

- 事件:
| 名称    | 回调参数                       | 说明                                   |
| ------- | ------------------------------ | -------------------------------------- |
| change  | (value: string&#124; string[]) | 绑定值变化时触发                       |
| search  | (value: string)                | 搜索输入框输入时触发                   |
| remove  | (value: Item)                  | tag 的移除事件, 返回被移除的 Item 对象 |
| clear   | --                             | clear 事件                             |
| blur    | --                             | blur 事件                              |
| focus   | --                             | focus 事件                             |
| confirm | value: string[]                | 当有确认按钮时, 点击确认按钮事件       |
| cancel  | value: string[]                | 当有确认取消时, 点击取消按钮事件       |
| hasConfirmChekedChange  | value: string[] | 当有确认取消时，选中/取消选中时触发       |

| 方法名 | 说明                                   | 参数 |
| ------ | -------------------------------------- | ---- |
| focus  | 使选择器的输入框获取焦点, 并打开下拉框 | -    |
| blur   | 使选择器的输入框失去焦点, 并隐藏下拉框 | -    |

- 插槽:
| 插槽名      | 说明                                   |
| ----------- | -------------------------------------- |
| default     | 默认插槽可以自定义下拉面板             |
| prefix      | 跟属性 prefix 同名插槽, 自定义前置标题 |
| suffixIcon  | 自定义选择框后缀图标                   |
| clearIcon   | 自定义的多选框清除图标                 |
| trigger     | 自定义触发器                           |
| empty       | 当下拉列表为空时显示的内容             |
| panelHeader | 下拉框的 header                        |
| panelFooter | 下拉框的 footer                        |
| nodeSlot | 节点插槽                        |

示例用法:
```vue
<template>
  <div
      ref="modal"
      class="select">
    <!-- <div v-if="isShow" style="width: 100px; height: 300px"></div> -->
    <section>
      <div>单选选择器</div>
      <m-select
          v-model="selectValue"
          :teleport="modal"
          :beforeClickItem="beforeClick"
          :options="list"
          class="test"
          id="1111"
          popoverClass="test2222"
      >
      </m-select>
    </section>
    <section>
      <div>可清空</div>
      <m-select
          v-model="selectValue"
          :options="list"
          clearable></m-select>
    </section>
    <section>
      <div>前置标签</div>
      <m-select
          ref="select"
          v-model="selectValue"
          :options="list"
          prefix="设备状态："></m-select>
    </section>
  </div>
</template>

<script
    setup
    lang="ts">
import {onMounted, ref} from 'vue'
import {testList} from './test'

const selectValue = ref('999')
const list = ref(testList)
const isShow = ref(false)

const modal = ref(null)

const beforeClick = (el: any, done: () => void) => {
  console.log('el', el)
  done()
}

onMounted(() => {
  setTimeout(() => {
    isShow.value = true
  }, 3000)
})
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 单选/多选下拉选择
- 真实业务场景+推荐组合: 远程选择项目（Select + Search + Loading）
- 常用用法: `options` 或 `Option` 子组件
- 高级用法: 远程搜索、虚拟列表、分组选项
- 主题与样式: 面板宽度、选中项样式
- 兼容性: 下拉层依赖定位与容器滚动
- 性能建议: 大数据用虚拟滚动 + 远程搜索
- 迁移提示: `value`/`label` 字段需与旧数据映射
- 故障排查: 选中不回显多为 value 类型不一致

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/select/index.ts
- packages/components/select/index.md
- packages/components/select/test/select.vue
