---
name: transfer
description: "Meri UI transfer 组件技能。适用于查阅 transfer 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-transfer

用途:
- 穿梭框/多选迁移。

API 要点:
- 属性:
| 名称     | 类型      | 可选值/示例                                   | 默认值   | 说明                                                       |
| :------- |:--------| :--------------------------------------- |:------| :--------------------------------------------------------- |
| modelValue | Array   |                         | []    | 绑定值，节点id集合 |                                       |
| data     | Array   |                         | []    | 树结构数据  |                                       |
| notNull  | Boolean | true/ false                                   | false | 是否返回半选状态的数据
| linkage  | Boolean | true/ false                             | true  | 是否严格的遵循父子互相关联的做法
| lastStage  | Boolean | true/ false                                  | false | 是否仅末级可选
| placeholderSearch | String  |                                   | '请输入' | 搜索框占位符
| virtual | Boolean |                                   | false | 开启虚拟滚动(左侧为虚拟树，右侧为虚拟列表)，用于数据量大的场景

- 事件:
| 名称    | 参数       | 说明         |
| :------ | :--------- | :----------- |
| change | (row:TreeNode,selectNode: TreeNode[]) | 勾选/删除内容回调 <br> row : 当前操作的数据<br>selectNode : 操作后选中的数据 |
| clear  | e:Event | 点击右上角清空按钮 |

示例用法:
```vue
<template>
  <div class="select">
    <section>
      <div>基础用法</div>
      <m-transfer
          :linkage="true"
          :data="transferData.treeData"
          v-model="transferData.selectedIds"
          @change="handleChange"
          @clear="handleClear"
      >
        <template v-slot:nodePrefix="node">
          <span v-if="!node.children || node.children.length===0" style="display:inline-block;height: 6px;width: 6px;border-radius: 3px;margin-right: 8px;background-color: #FFB800;vertical-align: middle"></span>
        </template>
      </m-transfer>
    </section>
    <section>
      <div>设置默认选中项</div>
      <m-transfer
          :linkage="true"
          :data="transferData1.treeData"
          v-model="transferData1.selectedIds"
          @change="handleChange"
      ></m-transfer>
    </section>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue';
import {TreeNode} from '../src/TransferProps';

export default defineComponent({
  setup() {
    const transferData = reactive({
      treeData: [
        {
          id: '0', name: '顶级', open: true, checked: 'uncheck',
          children: [
            {
              id: '1', name: '一级1', open: true, checked: 'uncheck',
              children: [
                {id: '12', name: '一二级2', checked: 'uncheck'},
                {id: '121', name: '一二级3', checked: 'uncheck'},
                {id: '122', name: '一二级4', checked: 'uncheck'},
                {
                  id: '1321', name: '二级1', open: true, checked: 'uncheck',
                  children: [
                    {id: '13', name: '二三级2', checked: 'uncheck'},
                    {id: '131', name: '二三级3', checked: 'uncheck'},
                    {id: '132', name: '二三级4', checked: 'uncheck'},
                  ]
                }
              ]
            },
            {
              id: '2', name: '一级2', open: true, checked: 'uncheck',
              children: [
                {id: '222', name: '二二级2', checked: 'uncheck', disabled: true},
                {id: '2221', name: '二二级1', checked: 'uncheck'},
                {id: '2222', name: '二二级3', checked: 'uncheck'}
              ]
            },
            {
              id: '3', name: '一级3', open: true, checked: 'uncheck',
              children: [
                {id: '3220', name: '三二级0', checked: 'uncheck'},
                {id: '3221', name: '三二级1', checked: 'uncheck'},
                {id: '322', name: '三二级2', checked: 'uncheck'}
              ]
            }
          ]
        }
      ],
      value: '',
      selectedIds: []
    })

    const transferData1 = reactive({
      treeData: [],
      value: '',
      selectedIds: []
    })

    setTimeout(() => {
      transferData1.treeData = [
        {
          id: '0', name: '顶级', open: true, checked: 'checked',
          children: [
            {
              id: '1', name: '一级1', open: true, checked: 'uncheck',
              children: [
                {id: '12', name: '一二级2', checked: 'uncheck'},
                {id: '121', name: '一二级3', checked: 'uncheck'},
                {id: '122', name: '一二级4', checked: 'uncheck',disabled: true},
                {
                  id: '1321', name: '二级1', open: true, checked: 'uncheck',
                  children: [
                    {id: '13', name: '二三级2', checked: 'uncheck'},
                    {id: '131', name: '二三级3', checked: 'uncheck'},
                    {id: '132', name: '二三级4', checked: 'uncheck'},
                  ]
                }
              ]
            },
            {
              id: '2', name: '一级2', open: true, checked: 'uncheck',
              children: [
                {id: '222', name: '二二级2', checked: 'uncheck', disabled: true},
                {id: '2221', name: '二二级1', checked: 'uncheck'},
                {id: '2222', name: '二二级3', checked: 'uncheck'}
              ]
            },
            {
              id: '3', name: '一级3', open: true, checked: 'uncheck',
              children: [
                {id: '3220', name: '三二级0', checked: 'uncheck'},
                {id: '3221', name: '三二级1', checked: 'uncheck'},
                {id: '322', name: '三二级2', checked: 'uncheck'}
              ]
...
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 大量数据的双栏选择与转移
- 真实业务场景+推荐组合: 业务页面组合使用（组件本身 + Form/Table/Modal 之一）
- 常用用法: 左右列表 + 选中项转移
- 高级用法: 级联选择、虚拟列表、自定义项渲染
- 主题与样式: 列宽、列表高度、选中态样式
- 兼容性: 级联场景需保证数据结构一致
- 性能建议: 大数据启用虚拟滚动/分页
- 迁移提示: `key/label` 字段差异需适配
- 故障排查: 转移无效多为 key 重复或缺失

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/transfer/index.ts
- packages/components/transfer/index.md
- packages/components/transfer/test/linkage.vue
