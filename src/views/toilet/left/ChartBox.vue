<template>
    <div ref="chartsRef" class="toilet-left-charts" :style="styleFun">
        <template v-if="loading">
            <m-list-skeleton />
        </template>
        <template v-else>
            <ChartItem v-for="item in cards" :key="item.id" :data="item" />
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useBreakpointAdaptation } from '@/hooks/useBreakpointAdaptation';
import { totalListKey, spaceMapKey } from '../hooks/useBaseDataHook';
import ChartItem from './ChartItem.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { uniqBy } from 'lodash';
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
const { getAbnormalEventsList } = DockSingleton.getInstance();

const totalList = inject(totalListKey);
const chartsRef = ref(null);
const spaceMap = inject(spaceMapKey, new Map());
const cards = computed(() => {
    let arr = structuredClone(totalList.value);
    arr.forEach(item => {
        if (item.id === 'all') {
            item.total.num = spaceMap.value.size;
            item.abnormal.num = getList(Array.from(spaceMap.value.keys())).length;
        } else {
            const spaces = Array.from(spaceMap.value.values()).filter(space => space.roomFuncType === item.id);
            item.total.num = spaces.length;
            item.abnormal.num = getList(spaces.map(space => space.id)).length;
        }
    });
    // 删除总数为0的卡片
    arr = arr.filter(item => item.total.num > 0);
    return arr;
});
const getList = ids => {
    let list = getAbnormalEventsList(ids) || [];
    list = list.filter(val => spaceMap.value.get(val.id));
    list = uniqBy(list, 'id');
    return list;
};
/**
 * 小于等于3个卡片，皆均分
 * 大于3个卡片，需要断点处理
 * 卡片区域>=1440px，totalList等分
 * 1200px=<卡片区域<1440px，则4等分
 * 卡片区域<1200px，则3等分
 */
const { style } = useBreakpointAdaptation(chartsRef, () => [
    { maxWidth: 1200, span: 3 },
    { maxWidth: 1440, span: 4 },
    { default: true, span: cards.value?.length }
]);

const styleFun = computed(() => {
    if (props.loading) {
        return { 'grid-template-columns': 'repeat(1, minmax(0, 1fr))' };
    }
    const len = cards.value?.length || 0;
    console.log(len, 'len');

    // 小于等于3个卡片，皆均分
    if (len <= 3) {
        return { 'grid-template-columns': `repeat(${len || 1}, minmax(0, 1fr))` };
    }
    // 大于3个卡片，断点样式
    return style.value;
});
</script>
<style lang="less" scoped>
.toilet-left-charts {
    padding-bottom: 16px;
    display: grid;
    gap: 12px;
}
</style>
