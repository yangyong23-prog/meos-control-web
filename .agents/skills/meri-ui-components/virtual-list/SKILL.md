---
name: virtual-list
description: "Meri UI virtualList 组件技能。适用于查阅 virtualList 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-virtualList

用途:
- 虚拟列表。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<div style="width: 300px">
		<m-virtual-list style="max-height: 240px" :item-size="42" :items="items">
			<template #default="{ item }">
				<div :key="item.key" style="height: 42px">
					<div class="item" style="height: 36px; padding: 8px; background-color: var(--gray-100)">
						<img class="avatar" :src="item.avatar" alt="" />
						<span style="font-size: 20px;font-weight: 700;">{{ item.value }}</span>
					</div>
				</div>
			</template>
		</m-virtual-list>
	</div>
</template>

<script setup>
const avatars = [
	'https://coding-net-production-static-ci.codehub.cn/43de9922-b359-49c8-bfb8-d918b0cce2fc.jpg?imageView2/1/w/0/h/0',
	'https://coding-net-production-static-ci.codehub.cn/00931aa3-380c-4652-8a75-75e2ce55a1b1.png?imageMogr2/cut/554x554x4x0',
	'https://coding-net-production-static-ci.codehub.cn/80e29e0c-3c58-4660-9c39-104b6eee1906.png?imageMogr2/cut/496x496x0x0',
	'https://coding-net-production-static-ci.codehub.cn/3e617825-5384-4eab-8a4e-b7faa48c67ad.png?imageMogr2/cut/200x200x0x0',
	'https://coding-net-production-static-ci.codehub.cn/c5e22dfb-69cb-496c-95bf-1d2f39074a16.png?imageMogr2/cut/800x800x0x0',
	'https://coding-net-production-static-ci.codehub.cn/da2d370d-0c0a-49f1-a999-e15d02a850d5.png?imageMogr2/cut/288x288x0x0',
	'https://coding-net-production-static-ci.codehub.cn/af171dcb-b579-42e0-8f97-53281e47cb7d.png?imageMogr2/cut/578x578x0x0'
]

const items = Array.from({ length: 10000 }, (_, i) => ({
	key: `${i}`,
	value: i,
	avatar: avatars[i % avatars.length]
}))
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 超长列表渲染优化
- 真实业务场景+推荐组合: 日志列表（VirtualList + Search + Scrollbar）
- 常用用法: 固定高度 + itemSize
- 高级用法: 动态高度与滚动定位
- 主题与样式: 外层容器高度控制
- 兼容性: 需要稳定的 item key
- 性能建议: 避免复杂 item 组件
- 迁移提示: 与普通 list 需要额外高度配置
- 故障排查: 滚动空白多为 itemSize 不匹配

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/virtualList/index.ts
- packages/components/virtualList/index.md
- packages/components/virtualList/test/default.vue
