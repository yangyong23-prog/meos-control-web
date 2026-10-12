<template>
    <div class="state-progress-bar wh100" :style="{ backgroundColor: barbgColor }">
        <div v-for="item in mergedResult" :key="item.color" class="bar-item" :style="style(item)" :start="item.start" :end="item.end"></div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { PropType } from 'vue';

const props = defineProps({
    bars: {
        type: Array as PropType<{ color: string; values: number[]; zIndex: number; start: string; end: string }[]>,
        default: () => []
    },
    barbgColor: {
        type: String,
        default: 'rgba(0, 0, 0, 0.08)'
    }
});
const mergedResult = ref<any[]>([]);
const style = (data: { color: string; mergeNum: number }) => {
    return {
        backgroundColor: data.color,
        'flex-grow': data.mergeNum || 1
    };
};
function mergeObjects(arr: any[]) {
    if (!arr || arr.length === 0) return [];

    // 复制原数组以避免修改原始数据
    const sortedArr = [...arr];
    // 结果数组
    const result = [];
    // 当前合并组
    let currentGroup = [sortedArr[0]];

    for (let i = 1; i < sortedArr.length; i++) {
        const prev = currentGroup[currentGroup.length - 1];
        const current = sortedArr[i];

        // 检查是否相邻且status相同
        if (prev.color === current.color && prev.end === current.start) {
            // 加入当前组
            currentGroup.push(current);
        } else {
            // 合并当前组并添加到结果
            result.push(mergeGroup(currentGroup));
            // 开始新组
            currentGroup = [current];
        }
    }

    // 添加最后一组
    if (currentGroup.length > 0) {
        result.push(mergeGroup(currentGroup));
    }

    return result;
}
// 合并一组对象
function mergeGroup(group: any) {
    if (group.length === 0) return null;

    // 取第一个对象的基础属性
    const first = group[0];
    // 取最后一个对象的结束属性
    const last = group[group.length - 1];

    // 合并后的对象
    return {
        ...first,
        end: last.end,
        mergeNum: group.length
    };
}
onMounted(() => {
    mergedResult.value = mergeObjects(props.bars);
});
</script>
<style lang="less" scoped>
.state-progress-bar {
    display: flex;
    .bar-item {
        height: 100%;
    }
}
</style>
