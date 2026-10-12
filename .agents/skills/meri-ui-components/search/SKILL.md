---
name: search
description: "Meri UI search 组件技能。适用于查阅 search 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-search

用途:
- 搜索输入增强。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
  <div style="display: flex;width: 100%;justify-content: space-around;">
    <m-search
      @change="handleChange"
      @clear="clear"
      ref="search"
      v-model="test"
      immediate
      type="enter"
    > </m-search>
    <m-button @click="clearContent">清空</m-button>
    <m-search
      @change="handleChange"
      type="enter"
      :border="false"
      disabled
    > </m-search>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const test = ref(32323)
const handleChange = val => {
	console.log(val)
}

const search = ref('search')
const clear = (value,type) => {
  console.log(111111111111,value,type);
}
const clearContent = () => {
  search.value.clearInp()
}
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 搜索输入增强
- 真实业务场景+推荐组合: 顶部搜索（Search + Table + Pagination）
- 常用用法: `v-model` + 触发搜索事件
- 高级用法: 防抖/回车触发
- 主题与样式: 图标与输入框样式
- 兼容性: 与 Input 事件一致
- 性能建议: 搜索请求防抖
- 迁移提示: 事件名称可能不同
- 故障排查: 触发不了多为事件未监听

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/search/index.ts
- packages/components/search/index.md
- packages/components/search/test/search.vue
