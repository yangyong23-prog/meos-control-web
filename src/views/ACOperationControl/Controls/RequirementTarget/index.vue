<template>
    <div class="target-container">
        <template v-if="isLoading">
            <m-list-skeleton :style="{ paddingRight: '16px' }" />
        </template>
        <template v-else>
            <div v-if="tabsItems.length > 1" class="tabs-box">
                <m-tabs v-model="curModel" :data="tabsItems" type="segment" size="small" @change="tabsChange"></m-tabs>
            </div>
            <m-scrollbar :height="type === 'space' ? '100%' : tabsItems.length > 1 ? 'calc(100% - 40px)' : '100%'" @scroll="handleScroll">
                <div v-if="finalConfigData?.length" class="scroll-box">
                    <div v-for="(item, index) in finalConfigData" :key="index" class="target-item">
                        <div v-if="curModel !== 'global'" class="space-container" @click="item.open = !item.open">
                            <IconMeriComponentArrowDown v-show="item.open" color="#8B949E" size="20" />
                            <IconMeriComponentArrowRight v-show="!item.open" color="#8B949E" size="20" />
                            <span v-if="item?.funcTypes.length" v-ellipsis class="space-text">
                                {{ item?.configGroupName || item.funcTypes.map(item => item.name).join('、') }}
                            </span>
                        </div>
                        <template v-if="curModel === 'global'">
                            <template v-if="isShield">
                                <div class="custom-banner">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M7.36312 4.94108C7.36312 4.57289 7.6616 4.27441 8.02979 4.27441C8.39798 4.27441 8.69646 4.57289 8.69646 4.94108V8.85775C8.69646 9.22594 8.39798 9.52441 8.02979 9.52441C7.6616 9.52441 7.36312 9.22594 7.36312 8.85775V4.94108Z"
                                            fill="#F55047"
                                        />
                                        <path
                                            d="M8.83366 10.8924C8.83366 11.3526 8.46056 11.7257 8.00033 11.7257C7.54009 11.7257 7.16699 11.3526 7.16699 10.8924C7.16699 10.4322 7.54009 10.0591 8.00033 10.0591C8.46056 10.0591 8.83366 10.4322 8.83366 10.8924Z"
                                            fill="#F55047"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M15.1097 7.51018C15.4728 7.44947 15.718 7.10587 15.6573 6.74272C15.0425 3.06445 11.8096 0.333252 7.99785 0.333252C4.19561 0.333252 0.968183 3.05112 0.342612 6.71763C0.280687 7.08057 0.524712 7.425 0.887657 7.48692C1.2506 7.54885 1.59503 7.30482 1.65695 6.94188C2.17313 3.91652 4.84489 1.66659 7.99785 1.66659C11.1587 1.66659 13.8349 3.92753 14.3422 6.96254C14.4029 7.32569 14.7465 7.57088 15.1097 7.51018ZM0.890572 8.55155C0.52798 8.6155 0.285886 8.96129 0.349842 9.32388C0.993101 12.9708 4.21136 15.6666 7.99785 15.6666C11.7767 15.6666 14.9905 12.9815 15.6423 9.344C15.7072 8.98159 15.4661 8.63515 15.1036 8.57021C14.7412 8.50527 14.3948 8.74643 14.3298 9.10885C13.7921 12.1103 11.1315 14.3333 7.99785 14.3333C4.85793 14.3333 2.19369 12.1016 1.66291 9.09228C1.59895 8.72968 1.25317 8.48759 0.890572 8.55155Z"
                                            fill="#F55047"
                                        />
                                    </svg>
                                    <span>{{ i18n.global.t('meos_control_web.space_masked_demand_not_implemented') }}</span>
                                </div>
                            </template>

                            <TitlePrefix v-if="valueSelectTypeValue" :font-size="16" :line-height="24" :title="i18n.global.t('meos_control_web.value_selection')"> </TitlePrefix>
                            <div v-if="valueSelectTypeValue" class="value-selection">
                                <ValueSelection :value-select-type="valueSelectTypeValue"></ValueSelection>
                            </div>
                            <TitlePrefix :font-size="16" :line-height="24" :title="i18n.global.t('meos_control_web.hvac_demand_time')"> </TitlePrefix>
                            <div v-if="item.baseConfig" class="demand-time">
                                <BaseConfig :cur-model="curModel" :base-config="item.baseConfig" :is-project="isFromProject" />
                            </div>
                            <TitlePrefix :font-size="16" :line-height="24" :title="i18n.global.t('meos_control_web.env_quality_target')"> </TitlePrefix>
                            <EnvironmentalQuality v-if="item.environmentQuality" :environment-quality="item.environmentQuality" />
                            <TitlePrefix v-if="item.workCondition" :font-size="16" :line-height="24" :title="i18n.global.t('meos_control_web.operating_condition_configuration')">
                            </TitlePrefix>
                            <WorkCondition v-if="item.workCondition" :ref="el => (workConditionShowRefs[index] = el)" :work-condition="item.workCondition" />
                        </template>
                        <template v-else>
                            <template v-if="item.open">
                                <TitlePrefix :font-size="16" :line-height="24" :title="i18n.global.t('meos_control_web.hvac_demand_time')"> </TitlePrefix>
                                <div class="demand-time">
                                    <BaseConfig :cur-model="curModel" :base-config="item?.config?.baseConfig" />
                                </div>
                                <TitlePrefix :font-size="16" :line-height="24" :title="i18n.global.t('meos_control_web.env_quality_target')"> </TitlePrefix>
                                <EnvironmentalQuality v-if="item?.config?.environmentQuality" :environment-quality="item?.config?.environmentQuality" />
                            </template>
                        </template>
                    </div>
                </div>
                <div v-else class="empty-with-scroll"><Empty /></div>
            </m-scrollbar>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import TitlePrefix from '@/components/title-prefix/index.vue';
import ValueSelection from './ValueSelection.vue';
import BaseConfig from './BaseConfig.vue';
import EnvironmentalQuality from './EnvironmentalQuality.vue';
import WorkCondition from './WorkCondition.vue';
import useRequirementTarget from '../../hooks/useRequirementTarget';
import Empty from '@/components/common/Empty.vue';
import { IconMeriComponentArrowDown, IconMeriComponentArrowRight } from 'meri-icon';

const props = defineProps({
    type: {
        type: String,
        default: () => ''
    },
    isFromDashboard: {
        type: Boolean,
        default: () => false
    }
});

const isFromDashboard = computed(() => props.isFromDashboard);

const { tabsItems, curModel, isLoading, valueSelectTypeValue, finalConfigData, isFromProject, tabsChange, handleScroll, instanceTag } = useRequirementTarget(isFromDashboard);

const isShield = computed(() => {
    return !!instanceTag?.value?.shielded;
});

const workConditionShowRefs = ref([]);
</script>

<style lang="less" scoped>
.target-container {
    height: calc(100% - 8px);
    padding-left: 16px;
    padding-top: 16px;
    position: relative;
    .tabs-box {
        min-width: 208px;
        height: 32px;
        margin-bottom: 16px;
        margin-right: 16px;
        .tabs-text {
            color: #1b2129;
            font-size: 16px;
            line-height: 24px;
        }
    }
    .scroll-box {
        margin-right: 16px;
    }
    .empty {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .arrow-icon {
        width: 16px;
        height: 16px;
        margin-left: 8px;
    }

    .empty-with-scroll {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .value-selection {
        width: 262px;
        border-radius: 4px;
        margin: 12px 0 16px 0;
    }
    .demand-time {
        padding: 16px 12px;
        border-radius: 4px;
        background: #f7f9fa;
        margin: 12px 0 16px 0;
    }
    .space-container {
        user-select: none;
        height: 32px;
        display: flex;
        align-items: center;
        padding: 0 4px;
        border-radius: 4px;
        color: #000;
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
        margin-bottom: 16px;
        svg {
            cursor: pointer;
            margin-right: 4px;
        }
        &:hover {
            background: rgba(196, 201, 207, 0.3);
        }
        .space-text {
            max-width: calc(100% - 24px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    :deep(.m-scrollbar__content) {
        // height: 100%;
    }
}

.custom-banner {
    display: flex;
    padding: 8px 16px;
    align-items: center;
    gap: 4px;

    border-radius: 4px;
    background: var(--red-100, #ffe6e5);

    color: var(--red-500, #f55047);
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 18px;
    margin-bottom: 16px;
}
</style>
