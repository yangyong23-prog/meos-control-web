<template>
    <div class="fc">
        <div class="14">
            <span class="ft">{{ i18n.global.t('meos_control_web.current_illuminance') }}</span>
            <span class="fb7 ml4">{{ monitoringData.outdoorIlluminance ? Number(monitoringData.outdoorIlluminance).toFixed(0) : '--' }} lx</span>
        </div>
        <div class="get-line ml16"></div>
        <div v-for="(item, index) in weatherData" :key="index" class="14 ml16">
            <span class="ft">{{ item.text }}</span>
            <span class="fb7 ml4">{{ item.time }}</span>
        </div>
    </div>
</template>
<script setup>
import { sunRiseAndSet, getIllumInfo } from '@/apis/lightingControl';
import dayjs from 'dayjs';
import i18n from '@/localization';
import useStore from '@/store';
import { mapSSEClientKey } from '../hooks/useMapSSE';
import { ILLUM_INFO } from '@/utils/SSEEventTypes';
import { getDayjsTz } from '@/utils/globalVariables';
const { base } = useStore();
const { projectId } = base || {};
const mapSSEClient = inject(mapSSEClientKey);
const weatherData = ref([
    {
        text: i18n.global.t('meos_control_web.today_sunrise_time'),
        time: '--'
    },
    {
        text: i18n.global.t('meos_control_web.today_sunset_time'),
        time: '--'
    },
    {
        text: i18n.global.t('meos_control_web.next_day_sunrise_time'),
        time: '--'
    }
]);
const monitoringData = ref({});
//查询日出日落
const querySunRiseAndSet = () => {
    sunRiseAndSet({
        projectId: projectId,
        startTime: getDayjsTz().format('YYYY-MM-DD'),
        endTime: getDayjsTz().add(2, 'day').format('YYYY-MM-DD')
    }).then(res => {
        const { result, data } = res;
        if (result !== 'success') return;
        if (data.length) {
            weatherData.value = [
                {
                    text: i18n.global.t('meos_control_web.today_sunrise_time'),
                    time: getFirstOccurrenceChars(data[0].sunRise) || '--'
                },
                {
                    text: i18n.global.t('meos_control_web.today_sunset_time'),
                    time: getFirstOccurrenceChars(data[0].sunSet) || '--'
                },
                {
                    text: i18n.global.t('meos_control_web.next_day_sunrise_time'),
                    time: getFirstOccurrenceChars(data[1].sunRise) || '--'
                }
            ];
        }
    });
};
const queryGetIllumInfo = () => {
    getIllumInfo({
        projectId: projectId
    }).then(res => {
        const { result, data } = res;
        if (result !== 'success') return;
        monitoringData.value = data;
    });
};
function getFirstOccurrenceChars(str) {
    const index = str.indexOf(':');
    if (index !== -1) {
        return str.slice(index - 2, index + 3);
    }
    return '';
}
const dealEvent = val => {
    monitoringData.value = val.data;
};
onMounted(() => {
    querySunRiseAndSet();
    queryGetIllumInfo();
    mapSSEClient.addEventListener(ILLUM_INFO, dealEvent);
});
onUnmounted(() => {
    mapSSEClient.removeEventListener(ILLUM_INFO, dealEvent);
});
</script>

<style lang="less" scoped>
.get-line {
    width: 1px;
    height: 14px;
    background-color: #c4c9cf;
}
</style>
