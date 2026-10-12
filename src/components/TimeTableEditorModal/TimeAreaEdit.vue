<template>
    <m-form-item :prop="'time-area-' + index" label-width="0px" class="area-item" :class="{ err: hasValidateErr }" style="--m-form-item-margin: 0">
        <div class="area">
            <div v-if="currentStrategyRule" class="items-block">
                <FoldBar :open="isOpen" v-bind="$attrs" :del-disable="isEditDisabled" @toggle-open="toggleOpen"></FoldBar>
                <ItemTimeSel
                    :ref="el => registerRef(el, 'strategyTime')"
                    v-model="data.strategyTime"
                    :disabled="isEditDisabled"
                    :prop-key="'strategyTime' + index"
                    :index="index"
                ></ItemTimeSel>
                <slot name="content" v-bind="slotProps">
                    <template v-if="needInitRendered">
                        <ItemSwitchSet
                            v-show="isOpen"
                            v-if="hasField('coolingSupplySwitchSet')"
                            :ref="el => registerRef(el, 'coolingSupplySwitchSet')"
                            v-model="coolingSupplySwitchSetData"
                            :prop-key="'coolingStorageSwitchSet' + index"
                            :field="getFieldDefine(curMainClassCode, 'coolingSupplySwitchSet')"
                            :disabled="isEditDisabled"
                            :default-data="defaultDataByCode('coolingSupplySwitchSet')"
                        ></ItemSwitchSet>
                        <ItemSwitchSet
                            v-show="isOpen"
                            v-if="hasField('enableCtrl')"
                            :ref="el => registerRef(el, 'enableCtrl')"
                            v-model="enableCtrlData"
                            :prop-key="'enableCtrl' + index"
                            :field="getFieldDefine(curMainClassCode, 'enableCtrl')"
                            :disabled="isEditDisabled"
                            :default-data="defaultDataByCode('enableCtrl')"
                        ></ItemSwitchSet>
                        <template v-if="isAirZoneRef && !isEnableCtrlDataClose">
                            <ItemNumberUnits
                                v-for="(chillerRuleInfo, i) in chillerRuleInfos(currentStrategyRule?.pointRuleInfo?.chillerRuleInfos)"
                                :key="i"
                                :ref="el => registerRef(el, `chillerRuleInfos-${chillerRuleInfo.chillerType}`)"
                                :prop-key="chillerRuleInfo.chillerType"
                                :object-id="baseData?.objectId"
                                :disabled="isEditDisabled"
                                :cool-mode="COOLMODE.CHILLER_COOL"
                                :label="getFieldDefine(curMainClassCode, chillerRuleInfo.chillerType)?.name"
                                :option="chillerRuleInfo"
                                :default-data="getChillerItemData(chillerRuleInfo.chillerType)"
                                :chiller-data="chillerData"
                                :empty-text="emptyText"
                            ></ItemNumberUnits>
                        </template>
                        <template v-if="!isCoolingSupplySwitchSetClose && !isEnableCtrlDataClose">
                            <ItemInput
                                v-for="(code, k) in pointRuleInfoFields(currentStrategyRule?.pointRuleInfo)"
                                v-show="isOpen"
                                :ref="el => registerRef(el, code)"
                                :key="k"
                                :disabled="isEditDisabled"
                                :prop-key="code + index"
                                :field="getFieldDefine(curMainClassCode, code)"
                                :default-data="defaultDataByCode(code)"
                            ></ItemInput>

                            <m-form-item v-if="hasCoolingMode" v-show="isOpen" :label="i18n.global.t('meos_control_web.cooling_mode')" label-width="140px" class="cooling-mode">
                                <m-checkbox-group v-model="coolingMode">
                                    <div class="check-list">
                                        <m-checkbox
                                            v-for="item in coolingModeOptions"
                                            :key="item.value"
                                            :disabled="coolingModeOptions?.length === 1 || isEditDisabled"
                                            :label="item.value"
                                        >
                                            {{ item.label }}
                                        </m-checkbox>
                                    </div>
                                </m-checkbox-group>
                            </m-form-item>
                        </template>

                        <ItemSwitchSet
                            v-show="isOpen"
                            v-if="hasField('coolingStorageSwitchSet')"
                            :ref="el => registerRef(el, 'coolingStorageSwitchSet')"
                            v-model="coolingStorageSwitchSetData"
                            :disabled="isEditDisabled"
                            :prop-key="'coolingStorageSwitchSet' + index"
                            :field="getFieldDefine(curMainClassCode, 'coolingStorageSwitchSet')"
                            :default-data="defaultDataByCode('coolingStorageSwitchSet')"
                        ></ItemSwitchSet>
                        <ItemSwitchSet
                            v-show="isOpen"
                            v-if="hasField('airConditionDemand')"
                            :ref="el => registerRef(el, 'airConditionDemand')"
                            v-model="airConditionDemandData"
                            :disabled="isEditDisabled"
                            :prop-key="'airConditionDemand' + index"
                            :field="getFieldDefine(curMainClassCode, 'airConditionDemand')"
                            :default-data="defaultDataByCode('airConditionDemand')"
                        ></ItemSwitchSet>
                    </template>
                    <template v-if="needInitRendered">
                        <div v-if="hasCoolingSupply" v-show="isOpen" class="split-line"></div>
                        <div v-if="hasCoolingSupply" v-show="isOpen" class="categorize-block">
                            <div class="title">{{ i18n.global.t('meos_control_web.chiller_cooling') }}</div>
                            <div class="items-block">
                                <ItemNumberUnits
                                    v-for="(chillerRuleInfo, i) in chillerRuleInfos(currentStrategyRule?.pointRuleInfo?.chillerRuleInfos)"
                                    :key="i"
                                    :ref="el => registerRef(el, `chillerRuleInfos-${chillerRuleInfo.chillerType}`)"
                                    :prop-key="chillerRuleInfo.chillerType"
                                    :object-id="baseData?.systemId"
                                    :disabled="isEditDisabled"
                                    :cool-mode="COOLMODE.CHILLER_COOL"
                                    :label="getFieldDefine(curMainClassCode, chillerRuleInfo.chillerType)?.name"
                                    :option="chillerRuleInfo"
                                    :default-data="getChillerItemData(chillerRuleInfo.chillerType)"
                                    :chiller-data="chillerData"
                                    :empty-text="emptyText"
                                ></ItemNumberUnits>
                            </div>
                        </div>
                        <template v-if="isCoolInputRef && !isCoolingStorageSwitchSetClose">
                            <ItemNumberUnits
                                v-for="(chillerRuleInfo, i) in chillerRuleInfos(currentStrategyRule?.pointRuleInfo?.chillerRuleInfos)"
                                :key="i"
                                :ref="el => registerRef(el, `chillerRuleInfos-${chillerRuleInfo.chillerType}`)"
                                :prop-key="chillerRuleInfo.chillerType"
                                :object-id="baseData?.systemId"
                                :disabled="isEditDisabled"
                                :cool-mode="COOLMODE.CHILLER_COOL"
                                :label="getFieldDefine(curMainClassCode, chillerRuleInfo.chillerType)?.name"
                                :option="chillerRuleInfo"
                                :default-data="getChillerItemData(chillerRuleInfo.chillerType)"
                                :chiller-data="chillerData"
                                :empty-text="emptyText"
                            ></ItemNumberUnits>
                        </template>
                        <div v-if="hasRegionalPlateCoolingSupply" v-show="isOpen" class="split-line"></div>
                        <div v-if="hasRegionalPlateCoolingSupply" v-show="isOpen" class="categorize-block">
                            <div class="title">{{ i18n.global.t('meos_control_web.city_cooling_supply') }}</div>
                            <ItemSwitchSet
                                v-if="hasField('districtCoolingPlateSwitchSet')"
                                :ref="el => registerRef(el, 'districtCoolingPlateSwitchSet')"
                                v-model="districtCoolingPlateSwitchSetVal"
                                :prop-key="'districtCoolingPlateSwitchSet' + index"
                                :disabled="isEditDisabled"
                                :cool-mode="COOLMODE.CITY_COOL"
                                :field="getFieldDefine(curMainClassCode, 'districtCoolingPlateSwitchSet')"
                                :default-data="defaultDataByCode('districtCoolingPlateSwitchSet')"
                            ></ItemSwitchSet>
                        </div>
                        <div v-if="hasDischargeCoolingSupply" v-show="isOpen" class="split-line"></div>
                        <div v-if="hasDischargeCoolingSupply" v-show="isOpen" class="categorize-block">
                            <div class="title">{{ i18n.global.t('meos_control_web.cold_discharge_cooling') }}</div>
                            <ItemSwitchSet
                                v-if="hasField('dischargeCoolingSwitchSet')"
                                :ref="el => registerRef(el, 'dischargeCoolingSwitchSet')"
                                v-model="dischargeCoolingSwitchSetVal"
                                :prop-key="'dischargeCoolingSwitchSet' + index"
                                :disabled="isEditDisabled"
                                :cool-mode="COOLMODE.DE_ICE_COOL"
                                :field="getFieldDefine(curMainClassCode, 'dischargeCoolingSwitchSet')"
                                :default-data="defaultDataByCode('dischargeCoolingSwitchSet')"
                            ></ItemSwitchSet>
                            <ItemEnableLogic
                                v-if="dischargeCoolingSwitchSetVal === 'OPEN'"
                                :ref="el => registerRef(el, 'iceRatio')"
                                field-code="iceRatio"
                                :cool-mode="COOLMODE.DE_ICE_COOL"
                                :default-data="data?.isOld ? data : null"
                                :prop-key="'iceRatio' + index"
                                :desc-after="i18n.global.t('meos_control_web.hours_ahead_end_discharge')"
                                :desc-front="i18n.global.t('meos_control_web.enable_early_end_discharge_ice_low')"
                                suffix="%"
                                :disabled="isEditDisabled"
                            ></ItemEnableLogic>
                        </div>
                        <div v-if="hasFreeCoolingSupply" v-show="isOpen" class="split-line"></div>
                        <div v-if="hasFreeCoolingSupply" v-show="isOpen" class="categorize-block">
                            <div class="title">{{ i18n.global.t('meos_control_web.free_cooling_supply') }}</div>
                            <ItemSwitchSet
                                v-if="hasField('freeCoolingSwitchSet')"
                                :ref="el => registerRef(el, 'freeCoolingSwitchSet')"
                                v-model="freeCoolingSwitchSetVal"
                                :prop-key="'freeCoolingSwitchSet' + index"
                                :disabled="isEditDisabled"
                                :cool-mode="COOLMODE.FREE_COOL"
                                :field="getFieldDefine(curMainClassCode, 'freeCoolingSwitchSet')"
                                :default-data="defaultDataByCode('freeCoolingSwitchSet')"
                            ></ItemSwitchSet>
                            <ItemEnableLogic
                                v-if="freeCoolingSwitchSetVal === 'OPEN'"
                                :ref="el => registerRef(el, 'freeCoolTemp')"
                                field-code="freeCoolTemp"
                                :cool-mode="COOLMODE.FREE_COOL"
                                :default-data="data?.isOld ? data : null"
                                :prop-key="'freeCoolTemp' + index"
                                :precision="1"
                                :max="99"
                                :desc-after="i18n.global.t('meos_control_web.hours_ahead_end_free_cooling')"
                                :desc-front="i18n.global.t('meos_control_web.enable_early_end_free_cooling_supply_temp_high')"
                                suffix="℃"
                                :disabled="isEditDisabled"
                            ></ItemEnableLogic>
                        </div>
                        <template v-if="!isAirConditionDemandDataClose">
                            <template v-for="(item, idx) in currentStrategyRule?.objectRuleInfos" :key="idx">
                                <div v-show="isOpen" class="split-line"></div>
                                <div v-show="isOpen" class="categorize-block">
                                    <div class="title">{{ item.localName }}</div>
                                    <div class="items-block">
                                        <ItemSwitchSet
                                            v-if="item.enableCtrl"
                                            :ref="el => registerRef(el, `objectRuleInfos-enableCtrl-${index}-${idx}`)"
                                            :prop-key="`objectRuleInfos-enableCtrl-${index}-${idx}`"
                                            :disabled="isEditDisabled"
                                            :field="getFieldDefine(item.classCode, 'enableCtrl')"
                                            :default-data="defaultDataByCode('enableCtrl', item?.objectId)"
                                        ></ItemSwitchSet>
                                        <ItemNumberUnits
                                            v-for="(chillerRuleInfo, i) in chillerRuleInfos(item.pointRuleInfo?.chillerRuleInfos)"
                                            :key="i"
                                            :ref="el => registerRef(el, `objectRuleInfos-chillerRuleInfos-${chillerRuleInfo.chillerType}-${i}-${idx}`)"
                                            :prop-key="`objectRuleInfos-chillerRuleInfos-${index}-${idx}-${chillerRuleInfo.chillerType}-${i}`"
                                            :disabled="isEditDisabled"
                                            :option="chillerRuleInfo"
                                            :obj-info="item"
                                            :default-data="getChillerItemData(chillerRuleInfo.chillerType, item?.objectId)"
                                            :label="getFieldDefine(item.classCode, chillerRuleInfo.chillerType)?.name"
                                            :chiller-data="chillerData"
                                            :empty-text="emptyText"
                                        ></ItemNumberUnits>

                                        <ItemInput
                                            v-for="(code, k) in pointRuleInfoFields(item.pointRuleInfo)"
                                            v-show="isOpen"
                                            :key="code + k"
                                            :ref="el => registerRef(el, `objectRuleInfos-${code}-${i}-${idx}`)"
                                            :prop-key="`objectRuleInfos-${index}-${idx}-${code}-${i}`"
                                            :disabled="isEditDisabled"
                                            :field="getFieldDefine(item.classCode, code)"
                                            :default-data="defaultDataByCode(code, item?.objectId)"
                                        ></ItemInput>
                                    </div>
                                </div>
                            </template>
                            <template v-if="currentStrategyRule?.localNames?.length > 0">
                                <div v-show="isOpen" class="split-line"></div>
                                <div class="local-names">{{ currentStrategyRule?.localNames.join('、') }}</div>
                                <div class="info-desc">{{ i18n.global.t('meos_control_web.open_close_time_follows_zone_config') }}</div>
                            </template>
                        </template>
                    </template>
                </slot>
            </div>
        </div>
    </m-form-item>
</template>
<script setup>
import { useSlots } from 'vue';
import i18n from '@/localization';
import ItemTimeSel from './ItemTimeSel.vue';
import ItemSwitchSet from './ItemSwitchSet.vue';
import ItemInput from './ItemInput.vue';
import ItemNumberUnits from './ItemNumberUnits.vue';
import ItemEnableLogic from './ItemEnableLogic.vue';
import FoldBar from './FoldBar.vue';
import { COOLMODE, EMPTYTEXT } from './timetableConfig';
import { useTimetableEditorItemCore, useTimetableEditorItemDefaultContent, strategyTimeKey } from './useTimetableEditorItem';

const props = defineProps({
    index: {
        type: Number,
        default: -1
    },
    data: {
        type: Object,
        default: () => {}
    },
    consoleType: {
        type: String,
        default: ''
    },
    baseData: {
        type: Object,
        default: () => ({})
    },
    strategyRule: {
        type: Object,
        default: () => ({})
    },
    isCoolInput: {
        type: Boolean,
        default: false
    },
    isAirZone: {
        type: Boolean,
        default: false
    },
    consoleTypes: {
        type: Object,
        default: () => ({})
    },
    chillerOrder: {
        type: Object,
        default: () => ({})
    }
});

// 内部常量
const emptyText = EMPTYTEXT;
const dischargeCoolingSwitchSetVal = ref('');
// 区域板换供冷设定值
const districtCoolingPlateSwitchSetVal = ref('');
const freeCoolingSwitchSetVal = ref('');
const slots = useSlots();
const hasCustomContentSlot = !!slots.content;
const core = useTimetableEditorItemCore(props);
const defaultContent = hasCustomContentSlot ? null : useTimetableEditorItemDefaultContent(props, core);
const {
    toggleOpen,
    chillerRuleInfos,
    pointRuleInfoFields,
    hasField,
    needInitRendered,
    defaultDataByCode,
    validator,
    getChillerItemData,
    isCoolInput: isCoolInputRef,
    isAirZone: isAirZoneRef,
    hasValidateErr,
    getFieldDefine,
    isEditDisabled,
    isOpen,
    currentStrategyRule,
    curMainClassCode,
    registerRef,
    strategyTime
} = core;
const getValue = defaultContent?.getValue || core.getValueBase;
const airConditionDemandData = defaultContent?.airConditionDemandData;
const coolingStorageSwitchSetData = defaultContent?.coolingStorageSwitchSetData;
const isCoolingStorageSwitchSetClose = defaultContent?.isCoolingStorageSwitchSetClose;
const isAirConditionDemandDataClose = defaultContent?.isAirConditionDemandDataClose;
const enableCtrlData = defaultContent?.enableCtrlData;
const isEnableCtrlDataClose = defaultContent?.isEnableCtrlDataClose;
const coolingSupplySwitchSetData = defaultContent?.coolingSupplySwitchSetData;
const isCoolingSupplySwitchSetClose = defaultContent?.isCoolingSupplySwitchSetClose;
const coolingModeOptions = defaultContent?.coolingModeOptions;
const hasCoolingSupply = defaultContent?.hasCoolingSupply;
const hasDischargeCoolingSupply = defaultContent?.hasDischargeCoolingSupply;
const hasRegionalPlateCoolingSupply = defaultContent?.hasRegionalPlateCoolingSupply;
const hasFreeCoolingSupply = defaultContent?.hasFreeCoolingSupply;
const hasCoolingMode = defaultContent?.hasCoolingMode;
const coolingMode = defaultContent?.coolingMode || ref([]);

const slotProps = computed(() => ({
    index: props.index,
    data: props.data,
    baseData: props.baseData,
    ...core,
    emptyText,
    COOLMODE
}));

provide(strategyTimeKey, strategyTime);

defineExpose({
    validator,
    getValue
});
</script>
<style lang="less" scoped>
.area-item {
    width: 100%;
    border: 1px solid #ffffff;
    border-radius: 4px;
    &.err {
        border: 1px solid var(--red-500, #f55047);
    }
}
.area {
    display: flex;
    padding: 16px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    position: relative;

    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);

    .categorize-block {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 8px;
        width: 100%;
        .title {
            color: var(--Gray-800, #2e3742);
            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
        }
    }
    .items-block {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 16px;
        width: 100%;
    }

    .cooling-mode {
        margin-bottom: 0;
    }
    .check-list {
        display: flex;
        align-items: flex-start;
        gap: 16px;
    }
    .split-line {
        height: 1px;
        width: 100%;
        border-bottom: 1px dashed #c4c9cf;
    }
    .enable-row {
        display: flex;
        padding: 6px 8px 6px 12px;
        align-items: center;
        gap: 8px;
        width: 100%;

        border-radius: 4px;
        background: rgba(196, 201, 207, 0.24);
    }
    .local-names {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 157.143% */
    }
    .info-desc {
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
}
</style>
