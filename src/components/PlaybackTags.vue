<template>
    <m-tag v-for="tag in tagsValueFun" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">
        {{ `${tag.name}${tag.value?.toString() ? '：' + tag.value : ''}` }}
    </m-tag>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    statusData: {
        type: Object,
        default: () => {}
    },
    templateType: {
        type: String,
        default: ''
    }
});

const hoverTagMap = ref({
    carbonDioxideDemandStatus: {
        TARGET_VALUE: {
            name: i18n.global.t('meos_control_web.co2_target_value'),
            color: '#15AE55',
            value: ''
        },
        UPPER_LIMIT_VALUE: {
            name: i18n.global.t('meos_control_web.co2_upper_limit'),
            color: '#FF7A2F',
            value: ''
        },
        LOWER_LIMIT_VALUE: {
            name: i18n.global.t('meos_control_web.co2_lower_limit'),
            color: '#1B9FFF',
            value: ''
        },
        COLD_STORAGE_VALUE: {
            name: i18n.global.t('meos_control_web.co2_cold_storage_value'),
            color: '#1B9FFF',
            value: ''
        },
        HEAT_STORAGE_VALUE: {
            name: i18n.global.t('meos_control_web.co2_heat_storage_value'),
            color: '#FF7A2F',
            value: ''
        }
    },
    temperatureDemandStatus: {
        TARGET_VALUE: {
            name: i18n.global.t('meos_control_web.temperature_target_value'),
            color: '#15AE55',
            value: ''
        },
        UPPER_LIMIT_VALUE: {
            name: i18n.global.t('meos_control_web.temperature_upper_limit'),
            color: '#FF7A2F'
        },
        LOWER_LIMIT_VALUE: {
            name: i18n.global.t('meos_control_web.temperature_lower_limit'),
            color: '#1B9FFF',
            value: ''
        },
        COLD_STORAGE_VALUE: {
            name: i18n.global.t('meos_control_web.temperature_cold_storage_value'),
            color: '#1B9FFF',
            value: ''
        },
        HEAT_STORAGE_VALUE: {
            name: i18n.global.t('meos_control_web.temperature_heat_storage_value'),
            color: '#FF7A2F',
            value: ''
        }
    }
});

const tagsValueFun = computed(() => {
    if (props.templateType && props.statusData) {
        const statusMap = hoverTagMap.value;

        return props.statusData?.relInfoCodeConfigs
            ?.map(info => {
                const infoDefine = statusMap[info.infoCode];
                if (infoDefine) {
                    const withoutExtraValItem = infoDefine[info.dataValue];
                    return {
                        ...withoutExtraValItem,
                        value: info?.dataExtraValue ?? ''
                    };
                }
                return null;
            })
            .filter(Boolean);
    }
    return [];
});
</script>

<style lang="less" scoped>
.info-tag {
    font-weight: var(--platform-font-weight) !important;
    margin-left: 0px !important;
}
</style>
