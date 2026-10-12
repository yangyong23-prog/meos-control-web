<template>
    <m-tag v-for="tag in tagsValueFun" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
</template>
<script setup>
import { baseColors } from '@/constants/baseColors';
import i18n from '@/localization';

const props = defineProps({
    tagsValue: {
        type: Object,
        default: () => {}
    }
});

//手自动状态
const manualAutoStatus = {
    0: {
        name: i18n.global.t('meos_control_web.device_manual'),
        color: '#FFB800'
    },
    1: {
        name: i18n.global.t('meos_control_web.auto'),
        color: baseColors['$blue-500']
    }
};
//本地远程
const localRemote = {
    0: {
        name: i18n.global.t('meos_control_web.local'),
        color: '#246FE5'
    },
    1: {
        name: i18n.global.t('meos_control_web.remote'),
        color: baseColors['$grey-800']
    }
};
//开关状态
const onOffState = {
    1: {
        name: i18n.global.t('meos_control_web.on'),
        color: '#09B3B5'
    },
    0: {
        name: i18n.global.t('meos_control_web.off'),
        color: '#8B949E'
    }
};
//温度区间
const temperatureDemandStatus = {
    TARGET_VALUE: {
        name: i18n.global.t('meos_control_web.temperature_target_value'),
        color: '#8B949E'
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
        color: '#8B949E'
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
    alarmstatus: {
        name: i18n.global.t('meos_control_web.abnormal'),
        color: '#F55047'
    }
};
//控反不一致
const ControlledReturn = {
    1: {
        name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
        color: '#FFB800'
    }
};
//空间干预
const spaceIntervene = {
    1: {
        name: i18n.global.t('meos_control_web.space_intervention'),
        color: '#8252E3'
    }
};
//在离线状态
const onlineStatusEnum = {
    1: {
        name: i18n.global.t('meos_control_web.online'),
        color: '#246FE5'
    },
    0: {
        name: i18n.global.t('meos_control_web.offline'),
        color: '#8B949E'
    }
};

const tagsValueFun = computed(() => {
    if (props.tagsValue?.relInfoCodeConfigs?.length) {
        let tagInfo = {};
        props.tagsValue.relInfoCodeConfigs?.forEach(item => {
            tagInfo[item.infoCode] = item.dataValue;
        });
        const onlineStatusEnumTag = onlineStatusEnum[tagInfo.onlineStatus];
        const manualAutoStatusTag = manualAutoStatus[tagInfo.manualAutoStatus];
        const localRemoteTag = localRemote[tagInfo.localRemoteStatus];
        const onOffStateTag = onOffState[tagInfo.runStatus];
        const carbonDioxideDemandStatusTag = carbonDioxideDemandStatus[tagInfo.cO2];
        const temperatureDemandStatusTag = temperatureDemandStatus[tagInfo.tdb];
        const abnormalTag = abnormal[tagInfo.alarmstatus];
        const orderFailAlarmTag = ControlledReturn[tagInfo.orderFailAlarm];
        const spaceInterveneTag = spaceIntervene[tagInfo.spaceIntervene];

        const tags = [
            manualAutoStatusTag,
            onlineStatusEnumTag,
            localRemoteTag,
            onOffStateTag,
            carbonDioxideDemandStatusTag,
            temperatureDemandStatusTag,
            abnormalTag,
            orderFailAlarmTag,
            spaceInterveneTag
        ].filter(Boolean);
        console.log('tags>>>>', tags);

        return tags;
    }
    return [];
});
</script>

<style lang="less" scoped>
.info-tag {
    font-weight: var(--platform-font-weight) !important;
}
</style>
