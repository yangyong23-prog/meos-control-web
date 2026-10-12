---
name: cascader
description: "Meri UI cascader 组件技能。适用于查阅 cascader 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-cascader

用途:
- 级联选择。

API 要点:
- 属性:
| 名称                            | 类型            | 可选值         | 默认值                      | 说明                                                                                                              |
|-------------------------------|---------------|-------------|--------------------------|-----------------------------------------------------------------------------------------------------------------|
| modelValue/v-model            | string/string[] | --          | ''/[]                    | 绑定值, 单选是字符串, 多选是字符串数组                                                                                           |
| options                       | Item[]        | --          | []                       | 下拉列表选项数组, item 类型`{id:string,name:string}`                                                                      |
| disabled                      | boolean       | --          | false                    | 禁用整个组件                                                                                                          |
| caption                       | string        | --          | ''                       | 前置标签                                                                                                            |
| clearable                     | boolean       | --          | true                     | 是否可以清空                                                                                                          |
| filterable                    | boolean       | --          | false                    | 是否支持搜索                                                                                                          |
| multiple                      | boolean       | --          | false                    | 是否多选                                                                                                            |
| showSelectCount               | boolean       | true/false  | false                    | 仅开启多选有效,是否仅仅显示选中数量，默认显示tag                                                                                      |
| placeholder                   | string        | --          | '请选择'      | <br />                                                                                                          |
| maxTagCount(新规范已废弃)           | number        | --          | 1                        | 最多显示多少个，默认显示一个, tag 剩余的显示+n ，0 表示全部展开                                                                           |
| trigger                       | string        | click/hover | click                    | 触发方式                                                                                                            |
| popoverClass                  | string        | --          | ''                       | 设置下拉框的class                                                                                                     |
| rangeSeparator                | string        | --          | ' / '                    | 选中结果连接符                                                                                                         |
| width                         | number/string | 数字/auto     | 240                      | 自定义选择框宽度(下拉看板每一层级的宽度为该宽度的一半、且最小宽为120px)                                                                         |
| maxWidth               | number                    | --          | 360                      | 设置触发器中选中值部分的最大宽度, 此属性需配合 width='auto'来使用                                                                        |
| lastStage                     | boolean       | --          | false                    | 设置lastStage属性为true，设置仅仅末级显示复选框                                                                                  |
| checkStrictly                 | boolean       | --          | false                    | 设置checkStrictly属性为true，可取消子父级联动，从而达到选择任意一级                                                                      |
| valueKey                      | string        | --          | id                       | 属性自定义数据字段                                                                                                       |
| labelKey                      | string        | --          | name                     | 属性自定义数据字段                                                                                                       |
| childrenKey                   | string        | --          | children                 | 属性自定义数据字段                                                                                                       |
| multipleTagsMaxHeight(新规范已废弃) | number        | --          | 0                        | 多选tags最大高度，超出出现滚动条，默认高度自动撑开                                                                                     |
| dropPanelSingleWidth          | number        | --          | 0                        | 下拉看板每一层级的宽度，默认为width的一半，width=auto时为120px，hasConfirm=true时最小宽度为165px                                            |
| placeholderStyle              | object        | --          | "{color: 'var(--gray-400)'}" | 自定义placeholder样式（目前仅支持自定义color）                                                                                 |
| teleportTo                    | string,object | --          | body                     | 下拉看板渲染到指定元素下                                                                                                    |
| simpleStyle                   | boolean       | --          | false                    | 开启简易样式                                                                                                          |
| loadData                      | function      | --          | --                       | 懒加载（与filterable不可同时使用）                                                                                          |
| popoverAttrs                  | PopoverProps  | {}          | --                       | popover组件的属性 属性参考 [Popover props](https://dev.meos.center/meri-plus/packages/components/popover/#popover-props) |
| hasConfirm                    | boolean       | false/true  | false                    | 多选添加取消、确认按钮                                                                                                     |
| loading                       | boolean       |    false/true    | false                         | 数据为空时，是否显示loading动画                                                                                             |
| autoClearSearch        | boolean                   | --          | true                     | 失去焦点后自动清空筛选                                                                                                     |
| tipsTagHandleName      | (name,index,items) => any | --          | undefined                | 自定义 select 多选 tips 中的 tag 文案                                                                                    |
| hasCheckAll                    | boolean       | false/true  | false                    | 多选添加全选                                                                                                          |

- 事件:
| 名称                | 回调参数                           | 说明                        |
|-------------------|--------------------------------|---------------------------|
| change            | (value: string&#124; string[]) | 绑定值变化时触发                  |
| removeTag(新规范已移除) | (value: Item)                  | tag 的移除事件, 返回被移除的 Item 对象 |
| clear             | --                             | clear 事件                  |
| blur              | --                             | blur 事件                   |
| focus             | --                             | focus 事件                  |

| 方法名   | 说明                   | 参数 |
|-------|----------------------|----|
| focus | 使选择器的输入框获取焦点, 并打开下拉框 | -  |
| blur  | 使选择器的输入框失去焦点, 并隐藏下拉框 | -  |

示例用法:
```vue
<template>
  <div ref="cascaderRef" class="select">
    <section>
      <div>基础用法</div>
      <m-cascader
          class="test"
          id="222"
          :teleportTo="cascaderRef"
          :options="list"
          :placeholderStyle="{color:'red'}"
      ></m-cascader>
    </section>
    <section>
      <div>前置标签</div>
      <m-cascader
          :options="list"
          caption="标签"
          clearable
      >
      </m-cascader>
    </section>
    <section>
      <div>带默认选中项</div>
      <m-cascader
          v-model="selectValue"
          :options="list1"
          caption="标签"
          clearable
      >
      </m-cascader>
    </section>
  </div>
</template>

<script
    setup
    lang="ts"
>
import {ref} from 'vue'

let cascaderRef = ref(null)

let selectValue = ref('1-2');

const list = ref([
  {
    id: '1',
    name: '选项1选项1选项1选项1选项1选项1选项1',
    children: [
      {
        id: '1-1',
        name: '选项1-1',
        children: [
          {
            id: '1-1-1',
            name: '选项1-1-1',
            children: [
              {
                id: '1-1-1-1',
                name: '选项1-1-1-1',
              }
            ]
          }
        ]
      },
      {
        id: '1-2',
        name: '选项1-2'
      },
      {
        id: '1-3',
        name: '选项1-3'
      }
    ]
  },
  {
    id: '2',
    name: '选项2',
    children: [
      {
        id: '2-1',
        name: '选项2-1'
      },
      {
        id: '2-2',
        name: '选项2-2'
      },
      {
        id: '2-3',
        name: '选项2-3'
      }
    ]
  },
  {
    id: '3',
    name: '选项3',
    children: [
      {
        id: '3-1',
        name: '选项3-1',
      },
      {
        id: '3-2',
        name: '选项3-2',
      },
      {
        id: '3-3',
        name: '选项3-3',
      }
    ]
  },
  {
    id: '4',
    name: '选项1选项1选项1选项1选项1选项1选项1',
  },
  {
    id: '5',
    name: '选项2',
  },
  {
...
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 省市区/分类多级联动选择
- 真实业务场景+推荐组合: 省市区选择（Cascader + FormItem）
- 常用用法: 设置 `options` 与 `value`
- 高级用法: `checkStrictly`、懒加载、搜索过滤
- 主题与样式: 菜单宽度与层级指示
- 兼容性: 懒加载需返回 children 结构
- 性能建议: 大树用懒加载减少初始渲染
- 迁移提示: 字段名映射与老数据需适配
- 故障排查: 无法展开多为 children 字段缺失

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/cascader/index.ts
- packages/components/cascader/index.md
- packages/components/cascader/test/cascader.vue
