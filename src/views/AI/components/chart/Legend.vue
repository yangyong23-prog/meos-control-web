<template>
    <div v-for="(item, i) in list" :key="i" class="chart-legend-item fcc" :class="{ noShow: !item[showField] }" @click="emits('itemClick', item)">
        <div class="chart-legend-item-line" :style="styleFun(item, i)"></div>
        {{ (item.localName || item.name) ?? '--' }}
    </div>
</template>

<script lang="js" setup>

defineProps({
	list: {
		type: Array,
		default: () => []
	},
	styleFun: {
		type: Function,
		default: () => {}
	},
	showField: {
		type: String,
		default: 'show'
	}
})
const emits = defineEmits(['itemClick'])
</script>
<style lang="less" scoped>
.chart-legend-item {
    cursor: pointer;
    user-select: none;
    &.noShow {
        color: #ccc;
    }
    color: var(--gray-900, #1b2129);
    font-size: 14px;
    line-height: 22px;
}
.chart-legend-item-line {
    height: 4px;
    width: 12px;
    margin-right: 4px;
}
</style>
