// @ts-ignore
import i18n from '@/localization';
import { ref, provide } from 'vue';
import { querySchedulingLegend } from '@/apis/ACOperationControl';
import { ENV_ATTR_KEYS } from '../constants/constant';

const schedulingLegendListColorMap = {
    // TARGET_VALUE: '#15AE55', // 目标值
    TARGET_VALUE: '#85CDA1', // 目标值
    UPPER_LIMIT_VALUE: '#F2B8A5', // 上限值
    COLD_STORAGE_VALUE: '#A1C8E5', // 蓄冷值
    LOWER_LIMIT_VALUE: '#A1C8E5', // 下限值
    HEAT_STORAGE_VALUE: '#F2B8A5' // 蓄热值
};

const schedulingCo2LegendListColorMap = {
    TARGET_VALUE: '#85CDA1',
    UPPER_LIMIT_VALUE: '#F2B8A5'
};

export default (currentTab, currentEnvAttr, currentEnvAttrFloor, currentFloorObj) => {
    const qualityLegendList = ref([]); // 质量图例列表s
    const schedulingLengendList = ref([]); // 调度图例列表

    const schedulingLengendListLoading = ref(false);

    const qualityTemperatureList = ref([]); // 原始数据
    const schedulingTemperatureList = ref([]); // 调度原始数据
    const qualityCarbonList = ref([]); // 原始数据
    const shcedulingCarbonList = ref([]); // 原始数据
    const qualityRHList = ref([]); // 原始数据
    const qualityPressureDiffList = ref([]); // 原始数据
    const otherList = ref([]); // 原始数据

    provide('qualityLegendList', qualityLegendList);
    provide('schedulingLengendList', schedulingLengendList);
    provide('schedulingTemperatureList', schedulingTemperatureList);
    provide('shcedulingCarbonList', shcedulingCarbonList);

    provide('schedulingLengendListLoading', schedulingLengendListLoading);

    qualityTemperatureList.value = [
        {
            value: i18n.global.t('meos_control_web.over_cooled'),
            color: '#76B9EA'
        },
        {
            value: i18n.global.t('meos_control_web.too_cool'),
            color: '#74D1DE'
        },
        {
            value: i18n.global.t('meos_control_web.comfortable'),
            color: '#89CCA4'
        },
        {
            value: i18n.global.t('meos_control_web.too_warm'),
            color: '#EAC884'
        },
        {
            value: i18n.global.t('meos_control_web.over_heated'),
            color: '#F0A09B'
        },
        {
            value: i18n.global.t('common.no_data_short'),
            color: '#C4C9CF'
        },
        {
            value: i18n.global.t('meos_control_web.no_standard'),
            color: '#9FA5AB'
        },
        {
            value: i18n.global.t('meos_control_web.parameter_masked'),
            color: '#C9B79B'
        }
    ];
    qualityCarbonList.value = [
        {
            value: i18n.global.t('meos_control_web.comfortable'),
            color: '#89CCA4'
        },
        {
            value: i18n.global.t('meos_control_web.slightly_high'),
            color: '#EAC884'
        },
        {
            value: i18n.global.t('meos_control_web.too_high'),
            color: '#F0A09B'
        },
        {
            value: i18n.global.t('common.no_data_short'),
            color: '#C4C9CF'
        },
        {
            value: i18n.global.t('meos_control_web.no_standard'),
            color: '#9FA5AB'
        },
        {
            value: i18n.global.t('meos_control_web.parameter_masked'),
            color: '#C9B79B'
        }
    ];
    qualityRHList.value = [
        {
            value: i18n.global.t('meos_control_web.too_low'),
            color: '#76B9EA'
        },
        {
            value: i18n.global.t('meos_control_web.slightly_low'),
            color: '#74D1DE'
        },
        {
            value: i18n.global.t('meos_control_web.comfortable'),
            color: '#89CCA4'
        },
        {
            value: i18n.global.t('meos_control_web.slightly_high'),
            color: '#EAC884'
        },
        {
            value: i18n.global.t('meos_control_web.too_high'),
            color: '#F0A09B'
        },
        {
            value: i18n.global.t('common.no_data_short'),
            color: '#C4C9CF'
        },
        {
            value: i18n.global.t('meos_control_web.no_standard'),
            color: '#9FA5AB'
        },
        {
            value: i18n.global.t('meos_control_web.parameter_masked'),
            color: '#C9B79B'
        }
    ];
    qualityPressureDiffList.value = [
        {
            value: i18n.global.t('meos_control_web.too_low'),
            color: '#76B9EA'
        },
        {
            value: i18n.global.t('meos_control_web.normal'),
            color: '#89CCA4'
        },

        {
            value: i18n.global.t('meos_control_web.too_high'),
            color: '#F0A09B'
        },
        {
            value: i18n.global.t('common.no_data_short'),
            color: '#C4C9CF'
        },
        {
            value: i18n.global.t('meos_control_web.no_standard'),
            color: '#9FA5AB'
        },
        {
            value: i18n.global.t('meos_control_web.parameter_masked'),
            color: '#C9B79B'
        }
    ];
    otherList.value = [
        {
            value: i18n.global.t('common.no_data_short'),
            color: '#C4C9CF'
        },
        {
            value: i18n.global.t('meos_control_web.no_standard'),
            color: '#9FA5AB'
        }
    ];

    schedulingLengendListLoading.value = true;
    querySchedulingLegend()
        .then(res => {
            const { data = {} } = res;
            const { temperatureDemandStatuses = [], carbonDioxideDemandStatuses = [] } = data;
            temperatureDemandStatuses.forEach(item => {
                item.color = schedulingLegendListColorMap[item.key];
                item.name = item.value;
            });
            carbonDioxideDemandStatuses.forEach(item => {
                item.color = schedulingCo2LegendListColorMap[item.key];
                item.name = item.value;
            });
            schedulingTemperatureList.value = temperatureDemandStatuses;
            shcedulingCarbonList.value = carbonDioxideDemandStatuses;
        })
        .finally(() => {
            schedulingLengendListLoading.value = false;
        });

    watchEffect(() => {
        if (
            (currentEnvAttr.value === ENV_ATTR_KEYS.TEMPERATURE && !currentFloorObj?.value) ||
            (currentEnvAttrFloor.value === ENV_ATTR_KEYS.TEMPERATURE && currentFloorObj?.value)
        ) {
            qualityLegendList.value = qualityTemperatureList.value;
            schedulingLengendList.value = schedulingTemperatureList.value;
        } else if ((currentEnvAttr.value === ENV_ATTR_KEYS.CO2 && !currentFloorObj?.value) || (currentEnvAttrFloor.value === ENV_ATTR_KEYS.CO2 && currentFloorObj?.value)) {
            qualityLegendList.value = qualityCarbonList.value;
            schedulingLengendList.value = shcedulingCarbonList.value;
        } else if ((currentEnvAttr.value === ENV_ATTR_KEYS.RH && !currentFloorObj?.value) || (currentEnvAttrFloor.value === ENV_ATTR_KEYS.RH && currentFloorObj?.value)) {
            qualityLegendList.value = qualityRHList.value;
            schedulingLengendList.value = [];
        } else if (
            (currentEnvAttr.value === ENV_ATTR_KEYS.PRESSURE_DIFF && !currentFloorObj?.value) ||
            (currentEnvAttrFloor.value === ENV_ATTR_KEYS.PRESSURE_DIFF && currentFloorObj?.value)
        ) {
            qualityLegendList.value = qualityPressureDiffList.value;
            schedulingLengendList.value = [];
        } else {
            qualityLegendList.value = otherList.value;
            schedulingLengendList.value = [];
        }
    });
    onUnmounted(() => {
        qualityLegendList.value = null;
        schedulingLengendList.value = null;
        schedulingTemperatureList.value = null;
        shcedulingCarbonList.value = null;
    });
    return {
        qualityLegendList,
        schedulingLengendList,
        schedulingLengendListLoading,
        schedulingLegendListColorMap
    };
};
