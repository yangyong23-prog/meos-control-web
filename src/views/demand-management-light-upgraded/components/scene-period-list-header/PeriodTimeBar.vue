<template>
    <div :key="props.selectedId" class="period-time-wrap">
        <template v-for="(item, idx) in periodOptionList" :key="idx">
            <TimeBar v-model="allItemsShowConfig" :item="item" :selected-id="selectedId" :has-sun-set-sun-rise="hasSunSetSunRise" @change="selItem" />
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { getSceneTimeTitle } from '../../utils/getSceneTimeConfig';
import TimeBar from './TimeBar.vue';

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    selectedId: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['selPeriodTime']);
const allItemsShowConfig = ref(new Map());

watch(
    () => props.list,
    () => {
        const temMap = new Map();
        props.list?.forEach(obj => {
            if (obj.id) {
                temMap.set(obj.id, { showText: false, isOverflow: false });
            }
        });
        allItemsShowConfig.value = temMap;
    },
    {
        immediate: true
    }
);

const periodOptionList = computed(() => {
    const result = props.list?.map(obj => {
        const timeText = getSceneTimeTitle(obj);
        // 是否有日出日落时间设置
        const sunTime = ['SUNSET', 'SUNRISE'].includes(obj?.beginTime?.timeType) || ['SUNSET', 'SUNRISE'].includes(obj?.endTime?.timeType);
        return {
            name: obj.sceneName,
            id: obj.id,
            timeText,
            timeTextMore: `(${timeText})`,
            hoverText: `${obj.sceneName || ''}(${timeText})`,
            sunSetSunRise: sunTime
        };
    });
    return result || [];
});

const hasSunSetSunRise = computed(() => {
    return periodOptionList.value.some(v => v.sunSetSunRise);
});

const selItem = item => {
    emits('selPeriodTime', item);
};
</script>
<style lang="less" scoped>
.period-time-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 6px;
}
</style>
