<template>
    <div class="data-analysis-item mb16">
        <div class="fc">
            <span class="mark-icon">
                <component :is="ventilateArr[idnex]"></component>
            </span>
            <div class="ml12">
                <div class="f18 fb7">{{ name }}</div>
                <div class="f14 ft mt4">
                    {{ i18n.global.t('common.total_count') }}:<span class="fmp">{{ data?.total || '0' }}</span>
                </div>
            </div>
        </div>
        <div class="fc mt23 flex-gap">
            <div v-for="(item, key, idx) in sortedKeys(data?.runStatus)" :key="idx" class="flex-item">
                <div class="f14 ft">{{ item.name }}</div>
                <div class="fmp f18 fb7 mt4">{{ item.value || '0' }}</div>
                <div class="legend-bar mt4">
                    <div
                        class="bar-item"
                        :style="{
                            backgroundColor: getBackgroundColor(idx),
                            width: item.value !== 0 ? ((item.value / data.total) * 100).toFixed(1) + '%' : 0 + '%'
                        }"
                    ></div>
                </div>
            </div>
        </div>
        <div class="statistics-buttom mt16 gp16 fw">
            <div class="statistics">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.offline') }}:</span>
                <span class="fmp f14 fb6">{{ data?.alarmControl?.offLine || '0' }}</span>
            </div>
            <div v-ellipsis class="statistics m-ellipsis mw">
                <span class="f14 ft popver-name">{{ i18n.global.t('meos_control_web.control_feedback_mismatch') }}:</span>
                <span class="fmp f14 fb6">{{ data?.alarmControl?.orderFailAlarm || '0' }}</span>
            </div>
            <div class="statistics">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.abnormal') }}:</span>
                <span class="fmp f14 fb6">{{ data?.abnormalCount ? data?.abnormalCount.toString() : '0' }}</span>
            </div>
            <div class="statistics">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.local') }}:</span>
                <span class="fmp f14 fb6">{{ data?.alarmControl?.localStatus || '0' }}</span>
            </div>
            <div class="statistics mw">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.manual') }}:</span>
                <span class="fmp f14 fb6">{{ data?.alarmControl?.manualStatus || '0' }}</span>
            </div>
            <div class="statistics">
                <span class="f14 ft">{{ i18n.global.t('meos_control_web.auto') }}:</span>
                <span class="fmp f14 fb6">{{ data?.alarmControl?.autoStatus || '0' }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import ventilateExhaustFan from '@/assets/svg/ventilate-ExhaustFan.svg';
import ventilateSupplyFan from '@/assets/svg/ventilate-SupplyFan.svg';
import i18n from '@/localization';

const ventilateArr = ref([ventilateExhaustFan, ventilateSupplyFan]);
const color = ref(['#09B3B5', '#626C78', '#C4C9CF']);
defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    name: {
        type: String,
        default: () => ''
    },
    idnex: {
        type: Number,
        default: () => 0
    }
});
const getBackgroundColor = index => {
    return color.value[index];
};

const sortedKeys = obj => {
    const mapObj = [];
    if (obj?.on || obj?.on === 0) {
        mapObj.push({
            name: i18n.global.t('meos_control_web.on'),
            value: obj.on
        });
    }
    if (obj?.off || obj?.off === 0) {
        mapObj.push({
            name: i18n.global.t('meos_control_web.off'),
            value: obj.off
        });
    }
    if (obj?.unknown || obj?.unknown === 0) {
        mapObj.push({
            name: i18n.global.t('meos_control_web.no_data1'),
            value: obj.unknown
        });
    }
    return mapObj;
};
</script>
<style lang="less" scoped>
.data-analysis {
    height: 100%;
    &-item {
        border-radius: 4px;
        border: 1px solid var(--gray-200, #e8ecf0);
        padding: 12px;
    }
    .left-icon {
        border-radius: 8px;
        background: var(--turquoise-50, #e6fcf7);
        padding: 9px;
    }
    .legend-bar {
        height: 5px;
        background: #e8ecf0;
        .bar-item {
            height: 100%;
            // border-radius: 2px;
        }
    }
    .flex-gap {
        gap: 16px;
    }
    .statistics-buttom {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        .statistics {
            border-radius: 4px;
            background: var(--gray-50, #f7f9fa);
            padding: 4px;
        }
    }
}
.mark-icon {
    display: inline-block;
    width: 44px;
    height: 44px;
}
.m-flexible-overlay {
    .popver-name {
        color: white;
    }
}
@media (max-width: 1800px) {
    .flex-item:nth-of-type(2) {
        width: 125px;
    }
    .flex-item:not(:nth-child(2)) {
        width: 26%;
    }
    .mw {
        width: 125px;
    }
}
@media (min-width: 1800px) {
    .flex-item {
        width: 33%;
    }
}
</style>
