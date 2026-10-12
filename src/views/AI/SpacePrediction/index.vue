<template>
    <div class="space-prediction-container wh100">
        <Header :fix-type="fixType" :options="options" :value="spacePredictionType" @back="$emit('back')" @change="change">
            <template #left>
                <m-radio-group v-model="code" @change="changeCode">
                    <m-radio v-for="item in stgyCodeList" :key="item.code" :label="item.code" :size="14">
                        {{ i18n.global.t('meos_control_web.strategy_code') }}({{ item.code }})</m-radio
                    >
                </m-radio-group>
            </template>
        </Header>
        <div class="space-prediction-main">
            <template v-if="spacePredictionType === SPACE_PREDICTION.space.key">
                <!-- 空间品质预测 -->
                <SpaceBox
                    :space-ids="spaceIds"
                    :space-type-data="spaceType"
                    :select-data="selectData"
                    :show-main="showMain"
                    :fifteen-minute-times="fifteenMinuteTimes"
                    :start-time="startTime"
                    :end-time="endTime"
                    :fix-type="fixType"
                    :is-dis-content="isDisContent"
                />
            </template>
            <template v-else-if="spacePredictionType === SPACE_PREDICTION.cold.key">
                <!-- 冷站运行预测 -->
                <ColdBox
                    :chart-type-data="chartType"
                    :select-data="selectData"
                    :show-main="showMain"
                    :fifteen-minute-times="fifteenMinuteTimes"
                    :hour-minute-times="hourMinuteTimes"
                    :start-time="startTime"
                    :fix-type="fixType"
                />
            </template>
            <template v-else-if="spacePredictionType === SPACE_PREDICTION.unit.key">
                <!-- 机组运行预测 -->
                <AircrewBox
                    :show-main="showMain"
                    :select-data="selectData"
                    :fifteen-minute-times="fifteenMinuteTimes"
                    :start-time="startTime"
                    :get-original-time="getOriginalTime"
                />
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { CHART_TYPE, SPACE_PREDICTION, TEMPERATURE } from '../variable';
import Header from '../components/Header.vue';
import SpaceBox from './SpaceBox.vue';
import ColdBox from './ColdBox.vue';
import AircrewBox from './AircrewBox.vue';
import { generateNextDayIntervals } from '../utils';
import dayjs from 'dayjs';
import { getOriginalTimeKey } from '../injectionKey';
import { currentSystemIdKey } from '../hooks/useStaticData';
import { dayjsIsSame, dayjsIsBefore, dayjsIsAfter } from '@/utils/dayjsTools';

const props = defineProps({
    selectCode: {
        type: String,
        default: () => ''
    },
    stgyCodeList: {
        type: Array,
        default: () => []
    },
    predictionType: {
        type: String,
        default: SPACE_PREDICTION.space.key
    },
    spaceType: {
        type: String,
        default: TEMPERATURE
    },
    spaceIds: {
        type: Array,
        default: undefined
    },
    chartType: {
        type: String,
        default: CHART_TYPE.CoolingCapacityView
    },
    fixType: {
        type: Boolean,
        default: false
    },
    isDisContent: {
        type: Boolean,
        default: false
    }
});
const currentSystemId = inject(currentSystemIdKey);
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
const options = ref([SPACE_PREDICTION.space, SPACE_PREDICTION.cold, SPACE_PREDICTION.unit]);
const spacePredictionType = ref(props.predictionType);
const change = value => {
    spacePredictionType.value = value;
};
const showMain = ref(true);
const changeCode = () => {
    showMain.value = false;
    nextTick(() => {
        showMain.value = true;
    });
};
const fifteenMinuteTimes = ref([]);
const hourMinuteTimes = ref([]);
const getOriginalTime = time => {
    return fifteenMinuteTimes.value.find(item => dayjs(item).format('HH:mm') === time) || '';
};

watchEffect(() => {
    if (startTime.value) {
        const intervals = [];
        let cur = dayjs(startTime.value),
            hCur = dayjs(dayjs(startTime.value).format('YYYY-MM-DD HH:00:00'));
        const maxEnd = dayjs(startTime.value).add(1, 'day').subtract(15, 'minute');
        const end = dayjsIsAfter(endTime.value, maxEnd) ? maxEnd : dayjs(endTime.value);
        while (dayjsIsBefore(cur, end) || dayjsIsSame(cur, end)) {
            intervals.push(cur.format('YYYY-MM-DD HH:mm:ss'));
            cur = cur.add(15, 'minute');
        }
        fifteenMinuteTimes.value = intervals;

        const hourIntervals = [];
        while (dayjsIsBefore(hCur, end) || dayjsIsSame(hCur, end)) {
            hourIntervals.push(hCur.format('YYYY-MM-DD HH:mm:ss'));
            hCur = hCur.add(60, 'minute');
        }
        hourMinuteTimes.value = hourIntervals;
    }
});

provide(getOriginalTimeKey, getOriginalTime);
</script>
<style lang="less" scoped>
.space-prediction-container {
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--gray-0);
    z-index: 10;
    .space-prediction-main {
        height: calc(100% - 48px);
        overflow-y: auto;
    }
}
</style>
