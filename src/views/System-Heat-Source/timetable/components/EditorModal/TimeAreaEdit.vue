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
                <template v-if="needInitRendered">
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
                    <template v-if="isAirZone && !isEnableCtrlDataClose">
                        <ItemNumberUnits
                            v-for="(chillerRuleInfo, i) in chillerRuleInfos(currentStrategyRule?.pointRuleInfo?.chillerRuleInfos)"
                            v-show="isOpen"
                            :key="i"
                            :ref="el => registerRef(el, `chillerRuleInfos-${chillerRuleInfo.chillerType}`)"
                            :prop-key="chillerRuleInfo.chillerType"
                            :object-id="baseData?.objectId"
                            :disabled="isEditDisabled"
                            :label="getFieldDefine(curMainClassCode, chillerRuleInfo.chillerType)?.name"
                            :option="chillerRuleInfo"
                            :default-data="getChillerItemData(chillerRuleInfo.chillerType)"
                        ></ItemNumberUnits>
                    </template>
                    <template v-if="!isHeatingSwitchSetDataClose && !isEnableCtrlDataClose">
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
                        <ItemSwitchSet
                            v-show="isOpen"
                            v-if="hasField('municipalHeatingPlateHeatExchangerSwitchSet')"
                            :ref="el => registerRef(el, 'municipalHeatingPlateHeatExchangerSwitchSet')"
                            v-model="municipalHeatingPlateHeatExchangerSwitchSetData"
                            :prop-key="'municipalHeatingPlateHeatExchangerSwitchSet' + index"
                            :field="getFieldDefine(curMainClassCode, 'municipalHeatingPlateHeatExchangerSwitchSet')"
                            :disabled="isEditDisabled"
                            :default-data="defaultDataByCode('municipalHeatingPlateHeatExchangerSwitchSet')"
                        ></ItemSwitchSet>
                        <template v-if="!isAirZone && needInitRendered">
                            <ItemNumberUnits
                                v-for="(chillerRuleInfo, i) in chillerRuleInfos(currentStrategyRule?.pointRuleInfo?.chillerRuleInfos)"
                                v-show="isOpen"
                                :key="i"
                                :ref="el => registerRef(el, `chillerRuleInfos-${chillerRuleInfo.chillerType}`)"
                                :prop-key="chillerRuleInfo.chillerType"
                                :object-id="baseData?.systemId"
                                :disabled="isEditDisabled"
                                :label="getFieldDefine(curMainClassCode, chillerRuleInfo.chillerType)?.name"
                                :option="chillerRuleInfo"
                                :default-data="getChillerItemData(chillerRuleInfo.chillerType)"
                            ></ItemNumberUnits>
                        </template>
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
                </template>
            </div>
            <template v-if="needInitRendered">
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
                                ></ItemNumberUnits>

                                <ItemInput
                                    v-for="(code, k) in pointRuleInfoFields(item.pointRuleInfo)"
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
        </div>
    </m-form-item>
</template>
<script setup>
import i18n from '@/localization';
import ItemTimeSel from './ItemTimeSel.vue';
import ItemSwitchSet from './ItemSwitchSet.vue';
import ItemInput from './ItemInput.vue';
import ItemNumberUnits from './ItemNumberUnits.vue';
import ItemEnableLogic from './ItemEnableLogic.vue';
import FoldBar from './FoldBar.vue';
import useTimetableEditorItem from '@/views/System-Heat-Source/hooks/useTimetableEditorItem';

import { baseDataKey } from '@/views/System-Heat-Source/hooks/useTimetableEditor';

const props = defineProps({
    index: {
        type: Number,
        default: -1
    },
    // 数据
    data: {
        type: Object,
        default: () => {}
    },
    consoleType: {
        type: String,
        default: ''
    }
});
const baseData = inject(baseDataKey);
const dischargeCoolingSwitchSetVal = ref('');
const freeCoolingSwitchSetVal = ref('');
const {
    toggleOpen,
    chillerRuleInfos,
    pointRuleInfoFields,
    hasField,
    needInitRendered,
    defaultDataByCode,
    validator,
    getValue,
    getChillerItemData,
    isAirConditionDemandDataClose,
    isAirZone,
    hasValidateErr,
    airConditionDemandData,
    enableCtrlData,
    municipalHeatingPlateHeatExchangerSwitchSetData,
    isEnableCtrlDataClose,
    heatingSwitchSetData,
    isHeatingSwitchSetDataClose,

    getFieldDefine,

    isEditDisabled,

    isOpen,
    currentStrategyRule,
    curMainClassCode,
    registerRef
} = useTimetableEditorItem(props);
// const time = ref();

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
