<template>
    <template v-if="workCondList?.length">
        <div v-for="item in workCondList" :key="item.type" class="work-condition-item">
            <div class="type">{{ item.type }}</div>
            <template v-if="item.data && item.data.length > 0">
                <div v-for="subItem in item.data" :key="subItem" class="sub-item">
                    <div class="sub-title" @mouseenter="subItem.systemConfig.showServiceSpace = true" @mouseleave="mouseleaveFun(subItem.systemConfig)">
                        <span class="sub-name">{{ subItem?.systemConfig?.localName ?? '--' }}</span>
                        <m-button
                            class="sub-btn"
                            type="link"
                            size="medium"
                            :style="{ zIndex: subItem?.systemConfig?.showServiceSpace === true ? '1' : '-1' }"
                            @click="handle($event, subItem?.systemConfig)"
                            >{{ i18n.global.t('meos_control_web.view_service_space') }}</m-button
                        >
                    </div>
                    <div v-if="subItem?.systemConfig?.supplyTempName" class="sub-desc">
                        {{
                            i18n.global.t('meos_control_web.system_should_be', {
                                system: subItem?.systemConfig?.supplyTempName ?? '--',
                                num: subItem?.systemConfig?.supplyTemp ?? '--',
                                time: subItem?.systemConfig?.supplyTempTime ?? '--'
                            })
                        }}
                    </div>
                    <template v-if="subItem?.systemConfig?.tempAndPressureSetList?.length">
                        <div v-for="(showItem, subIndex) in subItem.systemConfig.tempAndPressureSetList" v-show="showItem?.chillWaterDetaSetName" :key="subIndex" class="sub-desc">
                            {{
                                i18n.global.t('meos_control_web.system_should_between', {
                                    system: showItem?.chillWaterDetaSetName ?? '--',
                                    minVal: showItem?.lowerChillWaterDetaSet ?? '--',
                                    minUnit: showItem?.chillWaterDetaUnit ?? '--',
                                    maxVal: showItem?.upperChillWaterDetaSet ?? '--',
                                    maxUnit: showItem?.chillWaterDetaUnit ?? '--'
                                })
                            }}
                        </div>
                    </template>
                    <div v-if="!subItem?.systemConfig?.supplyTempName" class="sub-desc">{{ i18n.global.t('meos_control_web.parameter_not_instantiated') }}</div>
                    <div v-if="subItem?.pumpConfig" class="sub-children-item">
                        <div class="child-left">{{ i18n.global.t('meos_control_web.system_pump_group') }}：</div>
                        <div class="child-right">
                            <div v-for="child in subItem?.pumpConfig" :key="child" class="child-right-item">
                                <div class="right-item-title" @mouseenter="child.showServiceSpace = true" @mouseleave="mouseleaveFun(child)">
                                    <span class="right-item-name">{{ child.localName ?? '--' }}</span
                                    ><m-button
                                        class="right-item-btn"
                                        type="link"
                                        size="medium"
                                        :style="{ zIndex: child?.showServiceSpace === true ? '1' : '-1' }"
                                        @click="handle($event, child)"
                                        >{{ i18n.global.t('meos_control_web.view_service_space') }}</m-button
                                    >
                                </div>
                                <div v-if="child?.supplyTempName" class="right-item-desc">
                                    {{
                                        i18n.global.t('meos_control_web.system_should_be', {
                                            system: child?.supplyTempName ?? '--',
                                            num: child?.supplyTemp ?? '--',
                                            time: child?.supplyTempTime ?? '--'
                                        })
                                    }}
                                </div>

                                <template v-if="child?.tempAndPressureSetList?.length">
                                    <div
                                        v-for="subShowItem in child.tempAndPressureSetList"
                                        v-show="subShowItem?.chillWaterDetaSetName"
                                        :key="subShowItem.chillWaterDetaUnit"
                                        class="right-item-desc"
                                    >
                                        {{
                                            i18n.global.t('meos_control_web.system_should_between', {
                                                system: subShowItem?.chillWaterDetaSetName ?? '--',
                                                minVal: subShowItem?.lowerChillWaterDetaSet ?? '--',
                                                minUnit: subShowItem?.chillWaterDetaUnit ?? '--',
                                                maxVal: subShowItem?.upperChillWaterDetaSet ?? '--',
                                                maxUnit: subShowItem?.chillWaterDetaUnit ?? '--'
                                            })
                                        }}
                                    </div>
                                </template>
                                <div v-if="!child?.supplyTempName && !child?.tempAndPressureSetList?.length" class="right-item-desc">
                                    {{ i18n.global.t('meos_control_web.parameter_not_instantiated') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="empty">{{ i18n.global.t('meos_control_web.no_content') }}</div>
            </template>
        </div>
    </template>
    <template v-else>
        <div class="all-empty">{{ i18n.global.t('meos_control_web.no_content') }}</div>
    </template>
    <!-- 服务空间 -->
    <PopoverServiceSpace :popover-virtual-ref="popoverVirtualRef" />
</template>

<script setup>
import i18n from '@/localization';
import { seasonTagCodesKey } from '@/views/ACOperationControl/injectKeys';
import PopoverServiceSpace from './PopoverServiceSpace.vue';
const props = defineProps({
    workCondition: {
        type: Object,
        default: () => {}
    }
});

const SEASON_ENUM = {
    SEASON_COOLING: 'ACSeason-1', // 供冷季
    SEASON_HEATING: 'ACSeason-2' // 供热季
};

const seasonTagCodes = inject(seasonTagCodesKey);
const isOpen = inject('isOpen');
const workCondList = ref([]);
const popoverVirtualRef = ref({});
const currentItem = ref({});
const handle = (event, row) => {
    currentItem.value = row;
    popoverVirtualRef.value = '';
    setTimeout(() => {
        popoverVirtualRef.value = event.target;
        isOpen.value = true;
    });
};
const mouseleaveFun = item => {
    if (isOpen.value && currentItem.value?.id === item.id) {
        item.showServiceSpace = true;
    } else {
        item.showServiceSpace = false;
    }
};
provide('currentItem', currentItem);
watch(
    () => isOpen?.value,
    val => {
        if (!val) {
            currentItem.value.showServiceSpace = false;
        }
    },
    {
        immediate: true
    }
);

const handleInitCodes = infoItem => {
    let newConfig = { ...(infoItem || {}) };
    const isBelongACAC = infoItem?.classCode === 'ACAC';
    const hasTempAndPressureSetList = infoItem?.tempAndPressureSetList?.length;
    // 非ACAC数据兼容处理
    if (!isBelongACAC && !hasTempAndPressureSetList) {
        const { lowerChillWaterDetaSet, upperChillWaterDetaSet, chillWaterDetaSetName, chillWaterDetaSetType, chillWaterDetaUnit } = infoItem;
        newConfig = {
            ...newConfig,
            tempAndPressureSetList: [{ lowerChillWaterDetaSet, upperChillWaterDetaSet, chillWaterDetaSetName, chillWaterDetaSetType, chillWaterDetaUnit }]
        };
    }

    return newConfig;
};

watch(
    [() => props.workCondition?.coolingSeason, () => props.workCondition?.heatingSeason, () => seasonTagCodes.value],
    ([newCoolingSeason, newHeatingSeason]) => {
        if (newCoolingSeason?.length || newHeatingSeason?.length) {
            const coolItem = {
                type: i18n.global.t('meos_control_web.cooling_mode_config'),
                data: (newCoolingSeason || [])?.map(item => {
                    const systemConfig = handleInitCodes(item.systemConfig);
                    const pumpConfig = item?.pumpConfig?.map(p => {
                        const newData = handleInitCodes({ ...p, classCode: item?.systemConfig?.classCode });
                        return newData;
                    });
                    return { systemConfig, pumpConfig, showServiceSpace: false };
                })
            };
            const heatItem = {
                type: i18n.global.t('meos_control_web.heating_mode_config'),
                data: (newHeatingSeason || [])?.map(item => {
                    const systemConfig = handleInitCodes(item.systemConfig);
                    const pumpConfig = item?.pumpConfig?.map(p => {
                        const newData = handleInitCodes({ ...p, classCode: item?.systemConfig?.classCode });
                        return newData;
                    });
                    return { systemConfig, pumpConfig, showServiceSpace: false };
                })
            };

            let finalData = [];
            if (Array.isArray(seasonTagCodes?.value) && seasonTagCodes?.value?.length) {
                if (seasonTagCodes.value?.includes(SEASON_ENUM.SEASON_COOLING)) {
                    finalData = [coolItem];
                } else if (seasonTagCodes.value?.includes(SEASON_ENUM.SEASON_HEATING)) {
                    finalData = [heatItem];
                } else {
                    finalData = [];
                }
            } else {
                finalData = [];
            }
            workCondList.value = finalData;
        } else {
            workCondList.value = [];
        }
    },
    { immediate: true }
);
defineExpose({
    show: computed(() => {
        return !!workCondList.value?.length;
    })
});
</script>

<style lang="less" scoped>
.work-condition-item {
    margin-top: 12px;
    .type {
        padding-left: 12px;
        color: #626c78;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
    }
    .empty {
        margin-top: 8px;
        padding: 7px 12px 12px 12px;
        background: #f7f9fa;
        color: #626c78;
        font-size: 14px;
        line-height: 22px;
    }
    .sub-item {
        margin-top: 8px;
        padding: 7px 12px 12px 12px;
        background: #f7f9fa;
        .sub-title {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            .sub-name {
                padding-top: 5px;
                color: #2e3742;
                font-size: 14px;
                font-weight: 700;
                line-height: 22px;
            }
        }
        .sub-desc {
            margin-top: 3px;
            color: #626c78;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
        }
        .sub-children-item {
            .child-left {
                color: #626c78;
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
                margin: 12px 0 8px 0;
            }
            .child-right {
                width: 100%;
                &-item {
                    padding: 7px 12px;
                    background: #f1f4f6;
                    margin-top: 12px;
                    &:hover {
                        background: rgba(196, 201, 207, 0.3);
                    }
                    .right-item-title {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        .right-item-name {
                            padding-top: 5px;
                            color: #2e3742;
                            font-size: 14px;
                            font-weight: 700;
                            line-height: 22px;
                        }
                    }
                    .right-item-desc {
                        margin-top: 3px;
                        color: #626c78;
                        font-size: 14px;
                        font-weight: 400;
                        line-height: 22px;
                    }
                }
                /* margin-left: 20px; */
            }
        }
    }
}

.all-empty {
    margin-top: 8px;
    padding: 7px 12px 12px 12px;
    background: #f7f9fa;
    color: #626c78;
    font-size: 14px;
}
</style>
