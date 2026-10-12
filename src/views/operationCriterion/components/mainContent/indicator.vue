<template>
    <div
        class="ocg-indicator"
        :class="bgClass"
    >
        <div
            ref="iconElement"
            class="ocg-indicator-icon"
        >
            <component :is="component[code]"></component>
        </div>
        <div
            ref="leftPartElement"
            class="ocg-indicator-part"
            :style="{ 'max-width': `calc(100% - ${leftPartReduceWidth}px)` }"
        >
            <div
                v-if="loading"
                v-loading="loading"
                element-loading-lottiename="circle"
                class="ocg-indicator-title m-ellipsis"
                element-loading-background="transparent"
                :class="loading && 'inloading'"
            />
            <div
                v-else
                v-ellipsis
                class="ocg-indicator-title m-ellipsis"
                :style="`color: ${title1Color};`"
                v-html="title1"
            ></div>
            <div
                v-ellipsis
                class="ocg-indicator-info m-ellipsis"
            >
                {{ info1 }}
            </div>
        </div>
        <div
            v-if="showRight"
            class="ocg-indicator-divider"
        />
        <div
            v-if="showRight"
            class="ocg-indicator-part"
            :style="{ 'max-width': `calc(100% - ${rightPartReduceWidth}px)` }"
        >
            <div class="ocg-indicator-title2">
                <span
                    v-ellipsis
                    class="title"
                    :style="`color: ${title2Color};`"
                    >{{ title2 }}</span
                >
                <div
                    v-ellipsis
                    class="ocg-indicator-title-info m-ellipsis"
                    v-html="info3"
                ></div>
            </div>
            <div
                v-ellipsis
                class="ocg-indicator-info m-ellipsis"
            >
                {{ info2 }}
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
/* eslint-disable */
import Icon1 from '@/assets/images/operationCriterion/icon1.svg';
import Icon2 from '@/assets/images/operationCriterion/icon2.svg';
import Icon3 from '@/assets/images/operationCriterion/icon3.svg';
import Icon4 from '@/assets/images/operationCriterion/icon4.svg';
import Icon5 from '@/assets/images/operationCriterion/icon5.svg';
import Icon6 from '@/assets/images/operationCriterion/icon6.svg';
import Icon7 from '@/assets/images/operationCriterion/icon7.svg';
import Icon8 from '@/assets/images/operationCriterion/icon8.svg';
import Icon9 from '@/assets/images/operationCriterion/icon9.svg';
import Icon10 from '@/assets/images/operationCriterion/icon10.svg';
import Icon11 from '@/assets/images/operationCriterion/icon11.svg';
import Icon12 from '@/assets/images/operationCriterion/icon_open.svg';
import Icon13 from '@/assets/images/operationCriterion/icon_close.svg';
const props = defineProps({
    showRight: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    },
    title1: {
        type: String,
        default: ''
    },
    title1Color: {
        type: String,
        default: ''
    },
    title2: {
        type: String,
        default: ''
    },
    title2Color: {
        type: String,
        default: ''
    },
    info1: {
        type: String,
        default: ''
    },
    info2: {
        type: String,
        default: ''
    },
    info3: {
        type: String,
        default: ''
    }
});
const component = {
    //第一个指标
    AirSummer: Icon1, // 夏
    AirSummerPeak: Icon1, // 夏季高峰
    AirWinter: Icon2, // 冬
    AirSeasonSpring: Icon3, // 春秋
    AirSeasonAutumn: Icon3, // 春秋
    default1: Icon3, // 默认1
    //第二个指标
    value_select_lowest_cast: Icon4, // 费用最低
    value_select_Lowest_carbon_emissions: Icon5, // 碳排放最低
    value_select_lowest_energy: Icon6, // 能耗最低
    value_select_quality_first: Icon7, // 品质最优
    default2: Icon7, // 默认2
    //第三个指标
    isAllowEarlyShutdown: Icon12, // 允许提前关机
    NotisAllowEarlyShutdown: Icon13, // 不允许提前关机
    default3: Icon13, // 默认3

    // 第四个指标
    ALL_SCHEDULE: Icon8, // 参与调度
    PARTIAL_SCHEDULE: Icon9, // 部分参与调度
    NON_SCHEDULE: Icon10, // 不参与调度
    NON_CONFIG: Icon10,
    default4: Icon10, // 默认4

    xiangying: Icon11 // 调节
};

const bgClassMap = {
    AirSummer: 'bg-bl', // 夏
    AirSummerPeak: 'bg-bl', // 夏季高峰
    AirWinter: 'bg-org', // 冬
    AirSeasonSpring: 'bg-gray', // 春秋
    AirSeasonAutumn: 'bg-gray', // 春秋
    default1: 'bg-gray', // 默认1
    value_select_lowest_cast: 'bg-org', // 费用最低
    value_select_Lowest_carbon_emissions: 'bg-green', // 碳排放最低
    value_select_lowest_energy: 'bg-bl', // 能耗最低
    value_select_quality_first: 'bg-cyan', // 品质最优
    default2: 'bg-cyan', // 默认2
    isAllowEarlyShutdown: 'bg-green', // 允许提前关机
    NotisAllowEarlyShutdown: 'bg-gray', // 不允许提前关机
    default3: 'bg-gray', // 默认3

    ALL_SCHEDULE: 'bg-bl', // 参与调度
    PARTIAL_SCHEDULE: 'bg-org', // 部分参与调度
    NON_SCHEDULE: 'bg-gray', // 不参与调度
    NON_CONFIG: 'bg-gray',
    default4: 'bg-gray',
    xiangying: 'bg-gray'
};
const titleColorMap = {
    value_select_lowest_cast: 'var(--orange-700, #E68600)', // 费用最低
    value_select_Lowest_carbon_emissions: 'var(--green-700, #0C9B4A)', // 碳排放最低
    value_select_lowest_energy: 'var(--blue-500, #246FE5)', // 能耗最低
    value_select_quality_first: 'var(--turquoise-700, #00A2A7)', // 品质最优
    isAllowEarlyShutdown: 'var(--green-700, #0C9B4A)',
    NotisAllowEarlyShutdown: 'var(--gray-500, #8B949E)',
    PARTIAL_SCHEDULE: 'var(--orange-700, #E68600)', // 部分参与调度
    NON_SCHEDULE: 'var(--gray-500, #8B949E)', // 不参与调度
    NON_CONFIG: 'var(--gray-500, #8B949E)' // 未配置
};
const iconElement = ref(null);
const leftPartElement = ref(null);

const { width: iconWidth } = useElementSize(iconElement);
const { width: leftPartWidth } = useElementSize(leftPartElement);

const iconGapWidth = computed(() => {
    return (iconWidth?.value ?? 0) + 12;
});
const dividerWidth = 33;

const bgClass = computed(() => {
    if (props.code) {
        return bgClassMap[props.code] || '';
    }
    return '';
});

const leftPartReduceWidth = computed(() => {
    const rightWidthWithDivider = props?.showRight ? dividerWidth : 0;
    const plusWidth = iconGapWidth.value + rightWidthWithDivider;
    return plusWidth;
});

const rightPartReduceWidth = computed(() => {
    const leftWidth = leftPartWidth?.value ?? 0;
    const leftWidthWithDivider = leftWidth + dividerWidth;
    const plusWidth = iconGapWidth.value + leftWidthWithDivider;
    return plusWidth;
});

const title1Color = computed(() => {
    if (props.loading) {
        return '';
    }
    if (props.code) {
        return titleColorMap[props.code] || 'bg-bl';
    }
    return '';
});
</script>
<style lang="less" scoped>
.ocg-indicator {
    padding: 12px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 8px;
    position: relative;
    flex-grow: 0;
    white-space: nowrap;

    .ocg-indicator-icon {
        margin-right: 12px;
    }

    .ocg-indicator-part {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 0 1 fit-content;

        --el-loading-spinner-size: 22px;
        --el-color-primary: #626c78;

        .ocg-indicator-title {
            color: var(--gray-800, #2e3742);
            font-size: 18px;
            font-style: normal;
            font-weight: 700;
            height: 22px;
            max-width: 100%;
            line-height: 22px;

            &.inloading {
                width: 22px;
            }

            .ocg-indicator-title-info {
                color: var(--gray-600, #626c78);
                white-space: nowrap;
                font-size: 16px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
                /* 137.5% */
            }
        }

        .ocg-indicator-title2 {
            color: var(--gray-800, #2e3742);
            font-size: 18px;
            font-style: normal;
            font-weight: 700;
            display: flex;
            flex-direction: row;
            max-width: 100%;
            line-height: 22px;
            white-space: break-spaces;

            .title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
            }

            .ocg-indicator-title-info {
                color: var(--gray-600, #626c78);
                white-space: nowrap;
                font-size: 16px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
                /* 137.5% */
            }
        }

        .ocg-indicator-info {
            color: var(--gray-500, #8b949e);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 24px;
            /* 171.429% */
        }
    }

    .ocg-indicator-divider {
        width: 1px;
        height: 48px;
        background: rgba(139, 148, 158, 0.3);
        margin: 0 16px;
    }

    &.bg-bl {
        background: linear-gradient(90deg, rgba(36, 111, 229, 0.08) 0%, rgba(36, 111, 229, 0.02) 100%);
    }

    &.bg-org {
        background: linear-gradient(90deg, rgba(249, 169, 63, 0.08) 0%, rgba(249, 169, 63, 0.02) 100%);
    }

    &.bg-gray {
        background: linear-gradient(90deg, rgba(116, 146, 165, 0.08) 0%, rgba(116, 146, 165, 0.02) 100%);
    }

    &.bg-green {
        background: linear-gradient(90deg, rgba(21, 174, 85, 0.08) 0%, rgba(21, 174, 85, 0.02) 100%);
    }

    &.bg-cyan {
        background: linear-gradient(90deg, rgba(0, 162, 167, 0.08) 0%, rgba(0, 162, 167, 0.02) 100%);
    }

    &.bg-energy {
        background: linear-gradient(90deg, rgba(33, 93, 217, 0.08) 0%, rgba(249, 169, 63, 0.02) 100%);
    }
}
</style>
