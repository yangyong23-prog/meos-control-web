<template>
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
            v-if="hasField('heatingSwitchSet')"
            :ref="el => registerRef(el, 'heatingSwitchSet')"
            v-model="heatingSwitchSetData"
            :prop-key="'heatingSwitchSet' + index"
            :field="getFieldDefine(curMainClassCode, 'heatingSwitchSet')"
            :disabled="isEditDisabled"
            :default-data="defaultDataByCode('heatingSwitchSet')"
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
        <template v-if="!isCoolingSupplySwitchSetClose && !isEnableCtrlDataClose && !isHeatingSwitchSetClose">
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

            <template v-if="isHeatSupply">
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

            <ItemCoolSupplyModeCheckGroup
                v-if="hasCoolingMode"
                v-show="isOpen"
                :ref="el => registerRef(el, 'coolingMode')"
                v-model="coolingMode"
                :label="i18n.global.t('meos_control_web.cooling_mode')"
                :cooling-mode-options="coolingModeOptions"
                :disabled="coolingModeOptions?.length === 1 || isEditDisabled"
                label-width="140px"
                class="cooling-mode"
            >
                <!-- <m-checkbox-group v-model="coolingMode">
                    <div class="check-list">
                        <m-checkbox v-for="item in coolingModeOptions" :key="item.value" :disabled="coolingModeOptions?.length === 1 || isEditDisabled" :label="item.value">
                            {{ item.label }}
                        </m-checkbox>
                    </div>
                </m-checkbox-group> -->
            </ItemCoolSupplyModeCheckGroup>
        </template>
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
            <template v-if="isCoolInput">
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
    </template>
</template>
<script setup>
import { COOLMODE } from '@/components/TimeTableEditorModal/timetableConfig';
import ItemSwitchSet from '@/components/TimeTableEditorModal/ItemSwitchSet.vue';
import ItemNumberUnits from '@/components/TimeTableEditorModal/ItemNumberUnits.vue';
import ItemInput from '@/components/TimeTableEditorModal/ItemInput.vue';
import ItemCoolSupplyModeCheckGroup from '@/components/TimeTableEditorModal/ItemCoolSupplyModeCheckGroup.vue';
import useTimeTableItem from '../hooks/useTimeTableItem';
import i18n from '@/localization';

const props = defineProps({
    currentSystem: {
        type: Object,
        default: () => ({})
    },
    codeDefine: {
        type: Object,
        default: () => ({})
    },
    chillerData: {
        type: Object,
        default: () => ({})
    },
    consoleType: {
        type: String,
        default: ''
    },
    slotParams: {
        type: Object,
        default: () => ({})
    }
});
watch(
    () => props.slotParams,
    () => {
        console.log('props.slotParams: ', props.slotParams);
    }
);

const {
    isCoolingSupplySwitchSetClose,
    coolingSupplySwitchSetData,
    heatingSwitchSetData,
    isHeatingSwitchSetClose,
    isEnableCtrlDataClose,
    enableCtrlData,
    coolingModeOptions,
    hasCoolingSupply,
    coolingMode,
    chillerRuleInfos,
    pointRuleInfoFields,
    hasField,
    defaultDataByCode,
    validator,
    getValueBase,
    getChillerItemData,
    isCoolInput,
    isAirZone,
    needInitRendered,
    airConditionDemandData,
    baseData,
    getFieldDefine,
    isEditDisabled,
    isOpen,
    currentStrategyRule,
    curMainClassCode,
    registerRef,
    index,
    hasCoolingMode,
    isHeatSupply,
    isAirConditionDemandDataClose
} = useTimeTableItem(props);
</script>
<style lang="less" scoped>
.split-line {
    height: 1px;
    width: 100%;
    border-bottom: 1px dashed #c4c9cf;
}
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
</style>
