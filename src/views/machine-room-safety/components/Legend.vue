<template>
    <div class="legend-container">
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_status_colon') }}</span>
        <div v-for="(item, index) in onOffStatuses" :key="index" class="legend-item">
            <div class="legend-item-door" :style="{ background: item.color, borderRadius: item.radius, border: item.border }">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="11.1729" y="2.73889" width="0.810201" height="8.72524" rx="0.4051" fill="white" />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.07032 2.33337C2.50239 2.33337 2.04199 2.79377 2.04199 3.36171V10.8405C2.04199 11.4084 2.50239 11.8688 3.07032 11.8688H4.94002C5.50795 11.8688 5.96835 11.4084 5.96835 10.8405V3.36171C5.96835 2.79377 5.50795 2.33337 4.94002 2.33337H3.07032ZM4.00533 10.4044C4.31512 10.4044 4.56624 10.1532 4.56624 9.84345C4.56624 9.53367 4.31512 9.28254 4.00533 9.28254C3.69555 9.28254 3.44443 9.53367 3.44443 9.84345C3.44443 10.1532 3.69555 10.4044 4.00533 10.4044Z"
                        fill="white"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.65822 2.33337C7.09028 2.33337 6.62988 2.79377 6.62988 3.36171V10.8405C6.62988 11.4084 7.09028 11.8688 7.65821 11.8688H9.52791C10.0958 11.8688 10.5562 11.4084 10.5562 10.8405V3.36171C10.5562 2.79377 10.0958 2.33337 9.52791 2.33337H7.65822ZM8.5932 10.4044C8.90298 10.4044 9.15411 10.1532 9.15411 9.84345C9.15411 9.53367 8.90298 9.28254 8.5932 9.28254C8.28342 9.28254 8.03229 9.53367 8.03229 9.84345C8.03229 10.1532 8.28342 10.4044 8.5932 10.4044Z"
                        fill="white"
                    />
                </svg>
            </div>
            <span class="legend-name">{{ item.name }}</span>
        </div>
        <div class="divide"></div>
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.non_running_equipment_colon') }}</span>
        <div v-for="(item, index) in offStatuses" :key="index" class="legend-item">
            <div class="legend-item-door" :style="{ background: item.color, borderRadius: item.radius, border: item.border }">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="11.1729" y="2.73889" width="0.810201" height="8.72524" rx="0.4051" fill="white" />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.07032 2.33337C2.50239 2.33337 2.04199 2.79377 2.04199 3.36171V10.8405C2.04199 11.4084 2.50239 11.8688 3.07032 11.8688H4.94002C5.50795 11.8688 5.96835 11.4084 5.96835 10.8405V3.36171C5.96835 2.79377 5.50795 2.33337 4.94002 2.33337H3.07032ZM4.00533 10.4044C4.31512 10.4044 4.56624 10.1532 4.56624 9.84345C4.56624 9.53367 4.31512 9.28254 4.00533 9.28254C3.69555 9.28254 3.44443 9.53367 3.44443 9.84345C3.44443 10.1532 3.69555 10.4044 4.00533 10.4044Z"
                        fill="white"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.65822 2.33337C7.09028 2.33337 6.62988 2.79377 6.62988 3.36171V10.8405C6.62988 11.4084 7.09028 11.8688 7.65821 11.8688H9.52791C10.0958 11.8688 10.5562 11.4084 10.5562 10.8405V3.36171C10.5562 2.79377 10.0958 2.33337 9.52791 2.33337H7.65822ZM8.5932 10.4044C8.90298 10.4044 9.15411 10.1532 9.15411 9.84345C9.15411 9.53367 8.90298 9.28254 8.5932 9.28254C8.28342 9.28254 8.03229 9.53367 8.03229 9.84345C8.03229 10.1532 8.28342 10.4044 8.5932 10.4044Z"
                        fill="white"
                    />
                </svg>
            </div>
        </div>
        <div class="divide"></div>
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.risk_and_abnormal_colon') }}</span>
        <div v-for="(item, index) in equipStatuses" :key="index" class="legend-item">
            <i class="circle-mark" :style="{ background: item.color }"></i>
            <span class="legend-name">{{ item.name }}</span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';

const props = defineProps({
    pipes: {
        type: Array,
        default: () => []
    }
});

const onOffStatuses = ref([
    { color: '#00a2a7', name: i18n.global.t('meos_control_web.on'), radius: '3.333px', border: '0.833px solid rgba(255, 255, 255, 0.40)' },
    { color: '#424C59', name: i18n.global.t('meos_control_web.off'), radius: '3.333px', border: '0.833px solid rgba(255, 255, 255, 0.40)' },
    { color: '#8B949E', name: i18n.global.t('meos_control_web.no_data1'), radius: '3.333px', border: '0.833px solid rgba(255, 255, 255, 0.40)' }
]);
const offStatuses = ref([{ color: '#64A6F7', name: '', radius: '3.333px', border: '0.833px solid rgba(255, 255, 255, 0.40)' }]);
const equipStatuses = ref([
    { color: '#9B6CED', name: i18n.global.t('meos_control_web.status_unknown') },
    { color: '#F29F00', name: i18n.global.t('meos_control_web.potential_risk') },
    { color: '#F55047', name: i18n.global.t('meos_control_web.risk_occurred') }
]);

const commonPipes = [
    { color: '#246FE5', name: i18n.global.t('meos_control_web.cooling_water_outlet_pipe'), code: '' },
    { color: '#E68600', name: i18n.global.t('meos_control_web.chilled_water_outlet_pipe'), code: '' },
    { color: '#8252E3', name: i18n.global.t('meos_control_web.cooling_water_return_pipe'), code: '' },
    { color: '#F55047', name: i18n.global.t('meos_control_web.chilled_water_return_pipe'), code: '' }
];
const waterPipeStatuses = ref(commonPipes);

watchEffect(() => {
    if (props?.pipes?.length) {
        waterPipeStatuses.value = props?.pipes;
    }
});
</script>

<style lang="less" scoped>
.legend-container {
    width: max-content;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 11px 20px;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, rgba(112, 113, 121, 0.9) 0%, rgba(88, 89, 99, 0.9) 100%);

    z-index: 50;
    row-gap: 12px;

    .legend-category-name {
        color: @grey-100;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        height: 18px;
        line-height: 18px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        column-gap: 4px;
        margin-right: 12px;
        .legend-item-door {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 20px;
            height: 20px;
            padding: 3px;
        }
        &:last-child {
            margin-right: 0;
        }
    }

    .circle-mark {
        display: inline-flex;
        box-sizing: border-box;
        width: 10px;
        height: 10px;
        border-radius: 90px;
        margin-right: 4px;
        border: 1px solid #fff;
    }

    .line-icon {
        display: inline-flex;
        width: 14px;
        height: 3px;
    }

    .legend-name {
        color: @grey-400;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }

    .icon-item {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #fff;
        font-size: 10px;
        line-height: 18px;
    }

    .divide {
        width: 1px;
        height: 14px;
        background: #b1b9c2;
        margin-right: 12px;
    }
}
</style>
