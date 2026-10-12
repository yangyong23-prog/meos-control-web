<template>
    <div v-if="infoLoading" class="configList-loading-container"></div>
    <m-scrollbar v-show="!props?.infoLoading" box-class="content-wrapper" :height="`calc(100% - ${props?.withPadding ? '24px' : '0px'})`">
        <div class="content" :style="{ paddingBlock: props?.withPadding ? '16px' : '0px' }">
            <TitlePrefix
                :font-size="14"
                :line-height="22"
                :title="isDemandTarget ? i18n.global.t('meos_control_web.today_demand_overview') : i18n.global.t('meos_control_web.ventilation_demand_time')"
            />
            <TimeAxisRectangles :legend-items="legendItems" :list-data="listData" :show-current-time="props?.isDemandTarget" :current-time-margin-top="currentTimeMarginTop" />

            <TitlePrefix
                :font-size="14"
                :line-height="22"
                :title="i18n.global.t('meos_control_web.env_quality_target')"
                :style="{ 'margin-top': isDemandTarget ? (isLapTop ? '12px' : '16px') : '32px' }"
            />
            <InfoRowItems :rows-info="envRowsInfo" />

            <TitlePrefix
                :font-size="14"
                :line-height="22"
                :title="i18n.global.t('meos_control_web.feedback_adjustment')"
                :style="{ 'margin-top': isDemandTarget ? (isLapTop ? '12px' : '16px') : '32px' }"
            />
            <InfoRowItems :rows-info="feedbackRowsInfo" />
        </div>
    </m-scrollbar>
</template>

<script setup>
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import { useBreakpoints } from '@vueuse/core';
// import Empty from '@/components/common/Empty.vue';
import TitlePrefix from '@/components/title-prefix/index.vue';
import TimeAxisRectangles from '@/components/time-axis-rectangles/index.vue';
import InfoRowItems from './InfoRowItems.vue';
import { templateTypeMapEnvAndFeedback, templateTypeToConfigLegendMap } from '../../constant/config';
import { numberFormatPercent } from '@/utils';

const defaultLegendItem = {
    color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px)',
    title: i18n.global.t('meos_control_web.no_demand1'),
    borderColor: '#8B949E'
};

const legendItems = computed(() => {
    // 图例标题沿用“排风需求/送风需求/自然通风需求”，颜色与配置图例保持一致
    const ventLegendMap = templateTypeToConfigLegendMap[templateType?.value || ''] || templateTypeToConfigLegendMap.VENTILATION;
    const legendTitleMap = {
        exhaustTimeIntervals: i18n.global.t('meos_control_web.exhaust_demand'),
        deliverTimeIntervals: i18n.global.t('meos_control_web.supply_air_demand'),
        naturalVentilationTimeIntervals: i18n.global.t('meos_control_web.natural_ventilation_demand')
    };
    return ventLegendMap
        .filter(v => !v?.isDefault)
        .map(v => ({ title: legendTitleMap[v?.type] || v?.title, color: v?.color }))
        .concat({
            title: i18n.global.t('meos_control_web.no_demand1'),
            color: 'repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 3px, #fafafa 0px, #fafafa 6px)'
        });
});

const props = defineProps({
    infoData: {
        type: Array,
        default: () => []
    },
    infoLoading: {
        type: Boolean,
        default: false
    },
    isDemandTarget: {
        type: Boolean,
        default: false
    },
    withPadding: {
        type: Boolean,
        default: true
    }
});

const templateType = inject('templateType');
const loadingRef = ref(null);

const breakpoints = useBreakpoints({
    laptop: 0,
    desktop: 1366
});

const activeBreakpoint = breakpoints.active();
const isLapTop = computed(() => {
    const res = activeBreakpoint.value === 'laptop';
    return res;
});

const currentTimeMarginTop = computed(() => {
    return isLapTop.value ? 12 : 16;
});

const selfConfigData = computed(() => {
    const selfData = props?.infoData?.[0]?.config?.globalConfig;
    return selfData;
});

const finalConfigData = computed(() => {
    return props?.infoData?.[0]?.finalConfig?.globalConfig;
});

const parentConfigData = computed(() => {
    return props?.infoData?.[0]?.parentConfig?.globalConfig;
});

const isNullOrUndefined = v => v === null || v === undefined;

const getSelfAndParentConfigData = computed(() => (labelKey, defaultVal) => {
    const selfInfoDetail = selfConfigData.value;
    const finalConfigDetail = finalConfigData.value;
    const parentInfoDetail = parentConfigData.value;
    let isFromParent = false,
        isDefault = true,
        finalVal = defaultVal,
        parentVal = parentInfoDetail?.[labelKey];

    if (selfInfoDetail) {
        if (!isNullOrUndefined(selfInfoDetail?.[labelKey])) {
            finalVal = selfInfoDetail?.[labelKey];
            isDefault = false;
            isFromParent = false;
        } else if (!isNullOrUndefined(finalConfigDetail?.[labelKey])) {
            finalVal = finalConfigDetail?.[labelKey];
            isDefault = false;
            isFromParent = true;
        } else {
            finalVal = defaultVal;
            isDefault = true;
            isFromParent = false;
        }
    } else if (parentInfoDetail) {
        if (!isNullOrUndefined(parentInfoDetail?.[labelKey])) {
            finalVal = parentInfoDetail?.[labelKey];
            isDefault = false;
            isFromParent = true;
        } else {
            finalVal = defaultVal;
            isDefault = true;
            isFromParent = false;
        }
    } else {
        finalVal = defaultVal;
        isDefault = true;
        isFromParent = false;
    }
    return { finalVal, parentVal, isFromParent, isDefault, isFromSelf: !isFromParent && !isDefault };
});

const listData = computed(() => {
    const ventLegendMap = templateTypeToConfigLegendMap[templateType?.value || ''] || templateTypeToConfigLegendMap.VENTILATION;
    const resArr = ventLegendMap.filter(v => !v?.isDefault);
    const noDemandTitleMap = {
        exhaustTimeIntervals: i18n.global.t('meos_control_web.no_exhaust_demand'),
        deliverTimeIntervals: i18n.global.t('meos_control_web.no_supply_air_demand'),
        naturalVentilationTimeIntervals: i18n.global.t('meos_control_web.no_natural_ventilation_demand')
    };
    const res = resArr.map(v => {
        const { finalVal } = getSelfAndParentConfigData.value(v?.type, []);
        // 防御：历史数据或后端异常时 finalVal 可能为非数组（PRD 5.9.2 历史自然通风需求时间为空），兜底为空数组
        const data = (Array.isArray(finalVal) ? finalVal : []).map(item => ({ ...item, ...v, clickable: false }));
        const rowConfig = {
            defaultLegendItem: {
                ...defaultLegendItem,
                clickable: false,
                title: noDemandTitleMap[v?.type] || i18n.global.t('meos_control_web.no_demand1')
            },
            height: 20
        };
        return { data, rowConfig };
    });
    return res;
});

const envRowsInfo = computed(() => {
    const envItems = templateTypeMapEnvAndFeedback[templateType?.value || '']?.env || [];
    const res = envItems?.map(v => {
        const { finalVal } = getSelfAndParentConfigData.value(v?.code, v.defaultVal);
        const defaultVal = `${v.defaultVal}${v.unit}`;
        const transformVal = typeof finalVal !== 'number' && v?.valNumberToPercent ? (finalVal ? numberFormatPercent(Number(finalVal)) : defaultVal) : `${finalVal}${v.unit}`;
        return {
            ...v,
            val: `${transformVal ?? defaultVal}`
        };
    });
    return res;
});

const feedbackRowsInfo = computed(() => {
    const feedbackItem = templateTypeMapEnvAndFeedback[templateType?.value || '']?.feedback || {};
    const { finalVal } = getSelfAndParentConfigData.value('participateFeedbackAdjust', feedbackItem.defaultVal);
    const res = [
        {
            ...feedbackItem,
            label: i18n.global.t('meos_control_web.participate_feedback_control'),
            val: finalVal ? i18n.global.t('meos_control_web.yes') : i18n.global.t('common.no')
        }
    ];
    return res;
});

watch(
    () => props?.infoLoading,
    curLoading => {
        loadingRef.value?.destroy?.();
        if (curLoading) {
            loadingRef.value = MLoading.service({
                target: '.configList-loading-container',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            loadingRef.value?.destroy?.();
        }
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.configList-loading-container {
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: relative;
}
:deep(.content-wrapper) {
    flex: 1;

    .content {
        padding: 16px;
        height: 100%;
    }
}
</style>
