<template>
    <div class="space-strategy-container wh100">
        <Header :options="options" @back="$emit('back')" @change="change">
            <template #left>
                <m-radio-group v-model="code" @change="changeCode">
                    <m-radio v-for="item in stgyCodeList" :key="item.code" :label="item.code" :size="14">
                        {{ i18n.global.t('meos_control_web.strategy_code') }}({{ item.code }})</m-radio
                    >
                </m-radio-group>
            </template>
        </Header>
        <div class="space-strategy-main">
            <template v-if="sapceStratrgyType === SPACE_STRATEGY.space.key">
                <!-- 空间策略 -->
                <SpaceBox :select-data="selectData" :show-main="showMain" :fifteen-minute-times="fifteenMinuteTimes" :start-time="startTime" :end-time="endTime" />
            </template>
            <template v-else-if="sapceStratrgyType === SPACE_STRATEGY.cold.key">
                <!-- 冷站策略 -->
                <ColdBox v-if="showMain" :select-data="selectData" />
            </template>
            <template v-else>
                <!-- 机组策略 -->
                <Aircrew v-if="showMain" :select-data="selectData" :fifteen-minute-times="fifteenMinuteTimes" :start-time="startTime" :get-original-time="getOriginalTime" />
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import SpaceBox from './SpaceBox.vue';
import { SPACE_STRATEGY } from '../variable';
import Header from '../components/Header.vue';
import ColdBox from './ColdBox.vue';
import { generateNextDayIntervals } from '../utils';
import dayjs from 'dayjs';
import { getOriginalTimeKey } from '../injectionKey';
import Aircrew from './Aircrew.vue';
import { currentSystemIdKey } from '../hooks/useStaticData';
import { dayjsIsSame, dayjsIsBefore, dayjsIsAfter } from '@/utils/dayjsTools';

const currentSystemId = inject(currentSystemIdKey);

const props = defineProps({
    selectCode: {
        type: String,
        default: () => ''
    },
    stgyCodeList: {
        type: Array,
        default: () => []
    }
});
const code = ref(props.selectCode);
const selectData = computed(() => {
    return props.stgyCodeList.find(item => item.code === code.value)?.content?.data?.[0] || {};
});
const startTime = computed(() => {
    const predACAC = selectData.value?.predACAC;
    if (predACAC && predACAC[currentSystemId.value]?.length > 0) {
        return predACAC[currentSystemId.value][0].time;
    }
    return '';
});
const endTime = computed(() => {
    if (!startTime.value) return '';
    const maxEnd = dayjs(startTime.value).add(1, 'day').subtract(15, 'minute');
    const predACAC = selectData?.value?.predACAC;
    const curData = predACAC?.[currentSystemId.value];
    if (predACAC && Array.isArray(curData) && curData.length) {
        const curEnd = curData.slice(-1)[0].time;
        const end = dayjsIsAfter(curEnd, maxEnd) ? maxEnd : dayjs(curEnd);
        return end.format('YYYY-MM-DD HH:mm:00');
    }
    return maxEnd.format('YYYY-MM-DD HH:mm:00');
});

const fifteenMinuteTimes = ref([]);
const options = ref([SPACE_STRATEGY.space, SPACE_STRATEGY.aircrew, SPACE_STRATEGY.cold]);
const sapceStratrgyType = ref(SPACE_STRATEGY.space.key);
const showMain = ref(true);
const change = value => {
    sapceStratrgyType.value = value;
};
const getOriginalTime = time => {
    return fifteenMinuteTimes.value.find(item => dayjs(item).format('HH:mm') === time) || '';
};

watchEffect(() => {
    if (startTime.value) {
        const intervals = [];
        let cur = dayjs(startTime.value);
        const maxEnd = dayjs(startTime.value).add(1, 'day').subtract(15, 'minute');
        const end = dayjsIsAfter(endTime.value, maxEnd) ? maxEnd : dayjs(endTime.value);
        while (dayjsIsBefore(cur, end) || dayjsIsSame(cur, end)) {
            intervals.push(cur.format('YYYY-MM-DD HH:mm:ss'));
            cur = cur.add(15, 'minute');
        }
        fifteenMinuteTimes.value = intervals;
    }
});
const changeCode = () => {
    showMain.value = false;
    nextTick(() => {
        showMain.value = true;
    });
};
provide(getOriginalTimeKey, getOriginalTime);
</script>
<style lang="less" scoped>
.space-strategy-container {
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--gray-0);
    z-index: 10;
    .space-strategy-main {
        height: calc(100% - 48px);
    }
}
</style>
