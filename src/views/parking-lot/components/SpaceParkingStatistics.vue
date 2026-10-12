<template>
    <div class="space-parking-statistics">
        <div v-for="(item, index) in parkingSpace" :key="index" class="space-parking-statistics-box">
            <div v-if="item.count > 0" class="space-parking-statistics-item">
                <div class="fcb">
                    <div>
                        <span class="f16">{{ item.spaceName }}</span>
                        <template v-if="item.workTime">
                            <m-tag v-if="JudgmentTime(item.workTime)" color="#fff" bg-color="#3FBE72" size="small" class="ml4">
                                {{ i18n.global.t('meos_control_web.in_business') }}
                            </m-tag>
                            <m-tag v-else color="#fff" bg-color="#8B949E" size="small" class="ml4">{{ i18n.global.t('meos_control_web.non_business_hours') }}</m-tag>
                        </template>
                    </div>
                    <div v-if="item.workTime" class="f12 ft">{{ i18n.global.t('meos_control_web.business') }} : {{ item.workTime }}</div>
                </div>
                <div :class="[arrLength(item.list) ? 'flex-d' : 'fc', 'mt8']">
                    <div>
                        <div class="fmp f20 fb6">
                            {{ item.count }}
                        </div>
                        <div class="f14 ft">{{ i18n.global.t('common.total_parking_spaces') }}</div>
                    </div>
                    <div :class="['get-Line1', 'ml16', 'mr16']"></div>
                    <div>
                        <div
                            v-for="(io, iv) in item.list"
                            v-show="chargeCodes.includes(io.parkSpaceType) ? io?.count : true"
                            :key="iv"
                            :class="['fc', arrLength(item.list) ? '' : 'lin-h']"
                        >
                            <div class="f14 ft mr4" style="width: 60px">{{ nameParkSpaceType(io.parkSpaceType) }}</div>
                            <div class="f16 fb6 fmp mr4" style="width: 50px">{{ io.count }}</div>
                            <div class="legend-bar">
                                <div
                                    class="bar-item"
                                    :style="{
                                        backgroundColor: getBackgroundColor(iv),
                                        width: io.count !== 0 ? ((io.count / maxNum) * 100).toFixed(1) + '%' : 0 + '%'
                                    }"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import dayjs from 'dayjs';
import i18n from '@/localization';
import { currentTimeKey } from '../constant/injectKey';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsBefore } from '@/utils/dayjsTools';
const props = defineProps({
    parkingSpace: {
        type: Array,
        default: () => []
    }
});
const obj = ref({
    VACANT_PARKING_SPACE: i18n.global.t('common.idle_parking_spaces'),
    VACANT_CHARGING_PARKING_SPACE: i18n.global.t('meos_control_web.charging_idle'),
    VACANT_FAST_CHARGING_PARKING_SPACE: i18n.global.t('meos_control_web.fast_charging_idle')
});
const chargeCodes = ['VACANT_CHARGING_PARKING_SPACE', 'VACANT_FAST_CHARGING_PARKING_SPACE'];
const currentTime = inject(currentTimeKey);
const color = ref(['#8EDBAB', '#00A1A7', '#64A6F7']);
const arrLength = item => {
    // item?.map(io => {
    //     if ((io.parkSpaceType === 'VACANT_CHARGING_PARKING_SPACE' || io.parkSpaceType === 'VACANT_FAST_CHARGING_PARKING_SPACE') && io.count === 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // });
    return item?.find(io => (io.parkSpaceType === 'VACANT_CHARGING_PARKING_SPACE' || io.parkSpaceType === 'VACANT_FAST_CHARGING_PARKING_SPACE') && io.count === 0);
};
const getBackgroundColor = index => {
    return color.value[index];
};
const nameParkSpaceType = name => {
    return obj.value[name];
};
const JudgmentTime = workTime => {
    const startTime = workTime?.split('-')[0];
    const endTime = workTime?.split('-')[1];
    const sTime = dayjs(`${getDayjsTz().format('YYYY-MM-DD')} ${startTime}`);
    const eTime = dayjs(`${getDayjsTz().format('YYYY-MM-DD')} ${endTime}`);
    if (dayjsIsBefore(dayjs(currentTime.value), eTime) || dayjsIsBefore(dayjs(currentTime.value), sTime)) {
        return true;
    }
    return false;
};
//空闲车位最大数
const maxNum = computed(() => {
    let maxItem = [];
    props?.parkingSpace?.map(item => {
        item.list?.map(io => {
            if (io.parkSpaceType === 'VACANT_PARKING_SPACE') {
                maxItem.push(io.count);
            }
        });
    });
    return Math.max(...maxItem);
});
</script>
<style lang="less" scoped>
.flex-d {
    display: flex;
    align-items: end;
}
.space-parking-statistics {
    &-item {
        border-radius: 4px;
        background: #f4f8ff;
        padding: 12px 16px;
    }
}
.space-parking-statistics-box:not(:last-child) {
    margin-bottom: 12px;
}
.get-Line {
    width: 1px;
    height: 66px;
    background: #e1e5eb;
}
.get-Line1 {
    width: 1px;
    height: 46px;
    background: #e1e5eb;
}
.lin-h {
    line-height: 28px;
}
.legend-bar {
    height: 10px;
    // width: 100%;
    // background: red;
    .bar-item {
        height: 100%;
        border-radius: 2px;
    }
}
@media (max-width: 1600px) {
    .legend-bar {
        width: 113px;
    }
}
@media (min-width: 1600px) {
    .legend-bar {
        width: 192px;
    }
}
</style>
