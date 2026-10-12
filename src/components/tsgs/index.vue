<template>
    <m-tag v-for="tag in tagObjs" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
</template>
<script setup>
import { baseColors } from '@/constants/baseColors';
import i18n from '@/localization';

const props = defineProps({
    dataObj: {
        type: Object,
        default: () => {}
    }
});
const tagsValue = ref({});
watch(
    () => props.dataObj,
    () => {
        tagsValue.value = props.dataObj;
    },
    { deep: true, immediate: true }
);
//手自动状态
const manualAutoStatus = {
    MANUAL_OPERATION: {
        name: i18n.global.t('meos_control_web.device_manual'),
        color: '#FFB800'
    },
    AUTO: {
        name: i18n.global.t('meos_control_web.auto'),
        color: baseColors['$blue-500']
    }
};
//本地远程
const localRemote = {
    LOCAL: {
        name: i18n.global.t('meos_control_web.local'),
        color: '#246FE5'
    },
    REMOTE: {
        name: i18n.global.t('meos_control_web.remote'),
        color: baseColors['$grey-800']
    }
};
//开关状态
const onOffState = {
    OPEN: {
        name: i18n.global.t('meos_control_web.on'),
        color: '#09B3B5'
    },
    CLOSE: {
        name: i18n.global.t('meos_control_web.off'),
        color: '#8B949E'
    }
};
//温度区间
const temperatureDemandStatus = {
    TARGET_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_target_value'),
        color: '#15AE55'
    },
    UPPER_LIMIT_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_upper_limit'),
        color: '#FF7A2F'
    },
    LOWER_LIMIT_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_lower_limit'),
        color: '#1B9FFF'
    },
    COLD_STORAGE_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_cold_storage_value'),
        color: '#1B9FFF'
    },
    HEAT_STORAGE_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_heat_storage_value'),
        color: '#FF7A2F'
    }
};
//CO2区间
const carbonDioxideDemandStatus = {
    TARGET_VALUE: {
        name: i18n.global.t('meos_control_web.co2_target_value'),
        color: '#15AE55'
    },
    UPPER_LIMIT_VALUE: {
        name: i18n.global.t('meos_control_web.co2_upper_limit'),
        color: '#FF7A2F'
    },
    LOWER_LIMIT_VALUE: {
        name: i18n.global.t('meos_control_web.co2_lower_limit'),
        color: '#1B9FFF'
    },
    COLD_STORAGE_VALUE: {
        name: i18n.global.t('meos_control_web.co2_cold_storage_value'),
        color: '#1B9FFF'
    },
    HEAT_STORAGE_VALUE: {
        name: i18n.global.t('meos_control_web.co2_heat_storage_value'),
        color: '#FF7A2F'
    }
};
//异常状态
const abnormal = {
    ABNORMAL_EVENT: {
        name: i18n.global.t('meos_control_web.abnormal'),
        color: '#F55047'
    },
    ORDER_FAIL_ALARM: {
        name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
        color: '#FFB800'
    },
    HIGH_LEV_ALARM: {
        name: i18n.global.t('meos_control_web.high_level_alarm'),
        color: '#F55047'
    },
    LOW_LEV_ALARM: {
        name: i18n.global.t('meos_control_web.low_level_alarm'),
        color: '#F55047'
    },
    FAULT_STATUS: {
        name: i18n.global.t('meos_control_web.fault_signal'),
        color: '#F55047'
    }
};
//在离线状态
const onlineStatusEnum = {
    ONLINE: {
        name: i18n.global.t('meos_control_web.online'),
        color: '#246FE5'
    },
    OFFLINE: {
        name: i18n.global.t('meos_control_web.offline'),
        color: '#8B949E'
    }
};

const tagObjs = computed(() => {
    if (tagsValue?.value) {
        const abnormalCopy = [...(tagsValue.value?.abnormal || [])];
        // 有高液位标签时  不显示低液位标签
        const hightLevIndex = abnormalCopy?.findIndex(abnormalItem => abnormalItem === 'HIGH_LEV_ALARM');
        const lowLevIndex = abnormalCopy?.findIndex(abnormalItem => abnormalItem === 'LOW_LEV_ALARM');
        if (hightLevIndex > -1 && lowLevIndex > -1) {
            abnormalCopy?.splice(lowLevIndex, 1);
        }
        const onlineStatusEnumTag = onlineStatusEnum[tagsValue.value.onlineStatusEnum];
        const manualAutoStatusTag = manualAutoStatus[tagsValue.value.manualAutoStatus];
        const localRemoteTag = localRemote[tagsValue.value.localRemote];
        const onOffStateTag = onOffState[tagsValue.value.onOffState];
        const carbonDioxideDemandStatusTag = carbonDioxideDemandStatus[tagsValue.value.carbonDioxideDemandStatus];
        const temperatureDemandStatusTag = temperatureDemandStatus[tagsValue.value.temperatureDemandStatus];
        const abnormalTag = abnormalCopy?.map(abnormalItem => abnormal[abnormalItem]) || [];
        return [onlineStatusEnumTag, manualAutoStatusTag, localRemoteTag, onOffStateTag, carbonDioxideDemandStatusTag, temperatureDemandStatusTag, ...abnormalTag].filter(Boolean);
    }
    return [];
});
</script>

<style lang="less" scoped>
.info-tag {
    font-weight: var(--platform-font-weight) !important;
}
</style>
