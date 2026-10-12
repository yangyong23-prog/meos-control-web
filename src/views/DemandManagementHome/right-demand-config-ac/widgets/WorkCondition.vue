<template>
    <div
        v-if="props.isProject"
        :class="{ 'work-condition-container': true, small: isSmallSize, 'edit-mode': isEdit }"
        :style="{ marginTop: isSmallSize ? '16px' : '24px', '--custom-margin-top': isEdit ? '16px' : '14px' }"
    >
        <TitlePrefix
            :font-size="16"
            :line-height="24"
            :title="isSmallSize ? i18n.global.t('meos_control_web.operating_condition_standard') : i18n.global.t('meos_control_web.hvac_operating_mode_standard')"
            :show-right="true"
        >
        </TitlePrefix>
        <div
            ref="cardContainer"
            class="card-container"
        >
            <div
                v-for="item in showCodes"
                :id="item.code"
                :key="item.code"
                class="card-item-container"
            >
                <div class="row-title">
                    <span>{{ isPreview ? item.previewTitle : item.title }}</span>
                </div>
                <div
                    v-if="!previewAndEditData[item.code]?.length"
                    class="empty-card"
                >
                    {{ i18n.global.t('meos_control_web.no_content') }}
                </div>
                <div
                    v-if="previewAndEditData[item.code]?.length"
                    class="pump-groups-detail-container"
                >
                    <div
                        v-for="(showItem, index) in previewAndEditData[item.code]"
                        :key="index"
                        class="pump-groups-detail"
                    >
                        <div
                            v-if="showItem?.systemConfig?.id"
                            :id="`${showItem.systemConfig.id}-${item.code}`"
                            class="system-config"
                            :style="{ paddingBlock: isSmallSize ? '0px' : '12px' }"
                            @mouseenter="hoverPump(showItem?.systemConfig, `system_${item.code}`)"
                            @mouseleave="unHoverPump"
                        >
                            <div class="label-left">
                                <div
                                    :class="['label']"
                                    :style="{ lineHeight: '22px' }"
                                >
                                    {{ showItem?.systemConfig?.localName ?? '--' }}
                                </div>
                            </div>

                            <div
                                v-if="checkIsEmpty(showItem?.systemConfig)"
                                class="empty-text"
                            >
                                {{ i18n.global.t('meos_control_web.parameter_not_instantiated') }}
                            </div>

                            <div
                                v-show="!checkIsEmpty(showItem?.systemConfig)"
                                class="render-val"
                            >
                                <div
                                    v-if="!checkSupplyTempIsEmpty(showItem?.systemConfig)"
                                    class="wrap-line"
                                >
                                    {{
                                        i18n.global.t('meos_control_web.system_should', {
                                            system: showItem?.systemConfig?.supplyTempName || '--'
                                        })
                                    }}
                                    <EditPreviewNumber
                                        v-model="showItem.systemConfig.supplyTemp"
                                        :class="{ val: true }"
                                        :is-preview="isPreview"
                                        :unit="`℃`"
                                        @update-err-msg="err => handleErrMsg(err, `system-supply-temp`, showItem?.systemConfig?.id, item.code)"
                                    />
                                    {{
                                        `${
                                            item.code === 'coolingSeason'
                                                ? i18n.global.t('meos_control_web.value_below', {
                                                      value: ''
                                                  })
                                                : i18n.global.t('meos_control_web.value_above', {
                                                      value: ''
                                                  })
                                        }${
                                            item.code === 'coolingSeason'
                                                ? i18n.global.t('meos_control_web.short_term_exceed_allowed_not_sustained')
                                                : i18n.global.t('meos_control_web.short_term_below_allowed_not_sustained')
                                        }`
                                    }}
                                    <EditPreviewNumber
                                        v-model="showItem.systemConfig.supplyTempTime"
                                        :class="{ val: true }"
                                        :is-preview="isPreview"
                                        :limit-arr="[0, 1440]"
                                        :unit="`min`"
                                        @update-err-msg="err => handleErrMsg(err, `system-supply-temp-time`, showItem?.systemConfig?.id, item.code)"
                                    />
                                </div>
                                <template v-if="showReturnWater(showItem?.systemConfig) && !checkReturnWaterIsEmpty(showItem?.systemConfig)">
                                    <I18nSlot
                                        name-key="meos_control_web.system_should_from_to"
                                        html-tag="div"
                                        class="wrap-line"
                                    >
                                        <template #system>
                                            {{ showItem.systemConfig?.primaryChillWaterMainReturnTempName || '--' }}
                                        </template>
                                        <template #from>
                                            <EditPreviewNumber
                                                v-model="showItem.systemConfig.lowerPrimaryChillWaterMainReturnTemp"
                                                :upper-limit="showItem.systemConfig.upperPrimaryChillWaterMainReturnTemp"
                                                class="val"
                                                :is-preview="isPreview"
                                                :unit="`℃`"
                                                :required="true"
                                                :limit-arr="[-99, 99]"
                                                @update-err-msg="err => handleErrMsg(err, `system-return-water-lower`, showItem.systemConfig.id, item.code)"
                                            />
                                        </template>
                                        <template #to>
                                            <EditPreviewNumber
                                                v-model="showItem.systemConfig.upperPrimaryChillWaterMainReturnTemp"
                                                :lower-limit="showItem.systemConfig.lowerPrimaryChillWaterMainReturnTemp"
                                                class="val"
                                                :is-preview="isPreview"
                                                :unit="`℃`"
                                                :required="true"
                                                :limit-arr="[-99, 99]"
                                                @update-err-msg="err => handleErrMsg(err, `system-return-water-upper`, showItem.systemConfig.id, item.code)"
                                            />
                                            <span
                                                v-if="isEdit"
                                                class="desc"
                                                >{{ i18n.global.t('meos_control_web.between') }}</span
                                            >
                                        </template>
                                    </I18nSlot>
                                </template>

                                <template v-if="isSmallSize && !checkWaterDetaIsEmpty(showItem?.systemConfig)">
                                    <I18nSlot
                                        v-for="setItem in showItem.systemConfig.tempAndPressureSetList"
                                        :key="setItem?.chillWaterDetaSetName"
                                        name-key="meos_control_web.system_should_from_to"
                                        html-tag="div"
                                        class="wrap-line"
                                    >
                                        <template #system>
                                            {{ setItem?.chillWaterDetaSetName || '--' }}
                                        </template>
                                        <template #from>
                                            <EditPreviewNumber
                                                v-model="setItem.lowerChillWaterDetaSet"
                                                :upper-limit="setItem.upperChillWaterDetaSet"
                                                class="val"
                                                :is-preview="isPreview"
                                                :unit="setItem.chillWaterDetaUnit"
                                                :limit-arr="setItem.chillWaterDetaSetType === 'chillWaterDetaPressSet' ? [0, 999] : [0, 99]"
                                                @update-err-msg="err => handleErrMsg(err, `${setItem.chillWaterDetaSetType}-lower`, showItem.systemConfig.id, item.code)"
                                            />
                                        </template>
                                        <template #to>
                                            <EditPreviewNumber
                                                v-model="setItem.upperChillWaterDetaSet"
                                                :lower-limit="setItem.lowerChillWaterDetaSet"
                                                class="val"
                                                :is-preview="isPreview"
                                                :unit="setItem.chillWaterDetaUnit"
                                                :limit-arr="setItem.chillWaterDetaSetType === 'chillWaterDetaPressSet' ? [0, 999] : [0, 99]"
                                                @update-err-msg="err => handleErrMsg(err, `${setItem.chillWaterDetaSetType}-upper`, showItem.systemConfig.id, item.code)"
                                            />
                                        </template>
                                    </I18nSlot>
                                </template>
                                <template v-else-if="!isSmallSize && !checkWaterDetaIsEmpty(showItem?.systemConfig)">
                                    <I18nSlot
                                        v-for="setItem in showItem.systemConfig.tempAndPressureSetList"
                                        :key="setItem?.chillWaterDetaSetName"
                                        name-key="meos_control_web.system_should_from_to"
                                        html-tag="div"
                                        class="wrap-line"
                                    >
                                        <template #system>
                                            {{ setItem?.chillWaterDetaSetName || '--' }}
                                        </template>
                                        <template #from>
                                            <EditPreviewNumber
                                                v-model="setItem.lowerChillWaterDetaSet"
                                                class="val"
                                                :upper-limit="setItem.upperChillWaterDetaSet"
                                                :is-preview="isPreview"
                                                :unit="setItem.chillWaterDetaUnit"
                                                :limit-arr="setItem.chillWaterDetaSetType === 'chillWaterDetaPressSet' ? [0, 999] : [0, 99]"
                                                @update-err-msg="err => handleErrMsg(err, `${setItem.chillWaterDetaSetType}-lower`, showItem.systemConfig.id, item.code)"
                                            />
                                        </template>
                                        <template #to>
                                            <EditPreviewNumber
                                                v-model="setItem.upperChillWaterDetaSet"
                                                class="val"
                                                :lower-limit="setItem.lowerChillWaterDetaSet"
                                                :is-preview="isPreview"
                                                :unit="setItem.chillWaterDetaUnit"
                                                :limit-arr="setItem.chillWaterDetaSetType === 'chillWaterDetaPressSet' ? [0, 999] : [0, 99]"
                                                @update-err-msg="err => handleErrMsg(err, `${setItem.chillWaterDetaSetType}-upper`, showItem.systemConfig.id, item.code)"
                                            />
                                            <span
                                                v-if="isEdit"
                                                class="desc"
                                                >{{ i18n.global.t('meos_control_web.between') }}</span
                                            >
                                        </template>
                                    </I18nSlot>
                                </template>
                            </div>
                            <div class="right-action">
                                <PumpServiceSpace
                                    :render-key="`system_${item.code}`"
                                    :pump-item="showItem?.systemConfig"
                                    :hover-item="currentHoverItem"
                                    :is-small-size="isSmallSize"
                                />
                            </div>
                        </div>
                        <div
                            v-if="showItem?.pumpConfig?.length"
                            class="pumps-group"
                        >
                            <div class="prefix">
                                {{ `${showItem?.pumpConfig?.length > 1 ? i18n.global.t('meos_control_web.system_pump_group') : i18n.global.t('meos_control_web.pump_group')}` }}
                            </div>
                            <div class="pumps-detail">
                                <div
                                    v-for="(pumpItem, i) in showItem?.pumpConfig"
                                    :id="`${pumpItem.id}-${item.code}`"
                                    :key="i"
                                    class="pump-detail"
                                    @mouseenter="hoverPump(pumpItem, `pump_${item.code}`)"
                                    @mouseleave="unHoverPump"
                                >
                                    <div class="pump-left">
                                        <div
                                            :class="['pump-name']"
                                            :style="{ lineHeight: '22px' }"
                                        >
                                            {{ pumpItem?.localName ?? '--' }}
                                        </div>
                                    </div>
                                    <div
                                        v-if="checkIsEmpty(pumpItem)"
                                        class="empty-text"
                                    >
                                        {{ i18n.global.t('meos_control_web.parameter_not_instantiated') }}
                                    </div>
                                    <div
                                        v-show="!checkIsEmpty(pumpItem)"
                                        class="pump-config"
                                    >
                                        <div
                                            v-if="!checkSupplyTempIsEmpty(pumpItem)"
                                            class="pump-row"
                                        >
                                            {{
                                                i18n.global.t('meos_control_web.name_should_be', {
                                                    name: pumpItem?.supplyTempName || ''
                                                })
                                            }}
                                            <EditPreviewNumber
                                                v-model="pumpItem.supplyTemp"
                                                :class="{ val: !isSmallSize }"
                                                :is-preview="isPreview"
                                                :unit="`℃`"
                                                @update-err-msg="err => handleErrMsg(err, `pump-supply-temp`, pumpItem?.id, item.code)"
                                            />
                                            {{
                                                `${
                                                    item.code === 'coolingSeason'
                                                        ? i18n.global.t('meos_control_web.value_below', { value: '' })
                                                        : i18n.global.t('meos_control_web.value_above', { value: '' })
                                                }${
                                                    item.code === 'coolingSeason'
                                                        ? i18n.global.t('meos_control_web.short_term_exceed_allowed_not_sustained')
                                                        : i18n.global.t('meos_control_web.short_term_below_allowed_not_sustained')
                                                }`
                                            }}
                                            <EditPreviewNumber
                                                v-model="pumpItem.supplyTempTime"
                                                :class="{ val: !isSmallSize }"
                                                :is-preview="isPreview"
                                                :limit-arr="[0, 1440]"
                                                :unit="`min`"
                                                @update-err-msg="err => handleErrMsg(err, `pump-supply-temp-time`, pumpItem?.id, item.code)"
                                            />
                                        </div>
                                        <template v-if="showReturnWater(showItem?.systemConfig) && !checkReturnWaterIsEmpty(pumpItem)">
                                            <I18nSlot
                                                name-key="meos_control_web.system_should_from_to"
                                                html-tag="div"
                                                class="pump-row"
                                            >
                                                <template #system>
                                                    {{ pumpItem?.primaryChillWaterMainReturnTempName || '--' }}
                                                </template>
                                                <template #from>
                                                    <EditPreviewNumber
                                                        v-model="pumpItem.lowerPrimaryChillWaterMainReturnTemp"
                                                        :upper-limit="pumpItem.upperPrimaryChillWaterMainReturnTemp"
                                                        class="val"
                                                        :is-preview="isPreview"
                                                        :unit="`℃`"
                                                        :required="true"
                                                        :limit-arr="[-99, 99]"
                                                        @update-err-msg="err => handleErrMsg(err, `pump-return-Water-lower`, pumpItem.id, item.code)"
                                                    />
                                                </template>
                                                <template #to>
                                                    <EditPreviewNumber
                                                        v-model="pumpItem.upperPrimaryChillWaterMainReturnTemp"
                                                        :lower-limit="pumpItem.lowerPrimaryChillWaterMainReturnTemp"
                                                        class="val"
                                                        :is-preview="isPreview"
                                                        :unit="`℃`"
                                                        :required="true"
                                                        :limit-arr="[-99, 99]"
                                                        @update-err-msg="err => handleErrMsg(err, `pump-return-Water-upper`, pumpItem.id, item.code)"
                                                    />
                                                    <span
                                                        v-if="isEdit"
                                                        class="desc"
                                                        >{{ i18n.global.t('meos_control_web.between') }}</span
                                                    >
                                                </template>
                                            </I18nSlot>
                                        </template>
                                        <template v-if="!checkWaterDetaIsEmpty(pumpItem)">
                                            <I18nSlot
                                                v-for="pumpSetItem in pumpItem.tempAndPressureSetList"
                                                :key="pumpSetItem?.chillWaterDetaSetName"
                                                class="pump-row"
                                                name-key="meos_control_web.system_should_from_to"
                                                html-tag="div"
                                            >
                                                <template #system>
                                                    {{ pumpSetItem?.chillWaterDetaSetName || '' }}
                                                </template>
                                                <template #from>
                                                    <EditPreviewNumber
                                                        v-model="pumpSetItem.lowerChillWaterDetaSet"
                                                        :class="{ val: !isSmallSize }"
                                                        :upper-limit="pumpSetItem.upperChillWaterDetaSet"
                                                        :is-preview="isPreview"
                                                        :unit="pumpSetItem.chillWaterDetaUnit"
                                                        :limit-arr="pumpSetItem.chillWaterDetaSetType === 'chillWaterDetaPressSet' ? [0, 999] : [0, 99]"
                                                        @update-err-msg="err => handleErrMsg(err, `${pumpSetItem.chillWaterDetaSetType}-lower`, pumpItem.id, item.code)"
                                                    />
                                                </template>
                                                <template #to>
                                                    <EditPreviewNumber
                                                        v-model="pumpSetItem.upperChillWaterDetaSet"
                                                        :class="{ val: !isSmallSize }"
                                                        :lower-limit="pumpSetItem.lowerChillWaterDetaSet"
                                                        :is-preview="isPreview"
                                                        :unit="pumpSetItem.chillWaterDetaUnit"
                                                        :limit-arr="pumpSetItem.chillWaterDetaSetType === 'chillWaterDetaPressSet' ? [0, 999] : [0, 99]"
                                                        @update-err-msg="err => handleErrMsg(err, `${pumpSetItem.chillWaterDetaSetType}-upper`, pumpItem.id, item.code)"
                                                    />
                                                    <span
                                                        v-if="isEdit"
                                                        class="desc"
                                                        >{{ i18n.global.t('meos_control_web.between') }}</span
                                                    >
                                                </template>
                                            </I18nSlot>
                                        </template>
                                    </div>
                                    <div class="right-action">
                                        <PumpServiceSpace
                                            :render-key="`pump_${item.code}`"
                                            :pump-item="pumpItem"
                                            :hover-item="currentHoverItem"
                                            :is-small-size="isSmallSize"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import TitlePrefix from '@/components/title-prefix/index.vue';
import PumpServiceSpace from '../../components/PumpServiceSpace.vue';
import EditPreviewNumber from '../../components/EditPreviewNumber.vue';

// 如果系统为一次泵系统，那么仅涉及到对系统实例下的参数进行设定
const props = defineProps({
    fetchData: {
        type: Object,
        default: () => {}
    },
    isEdit: {
        type: Boolean,
        default: false
    },
    isProject: {
        type: Boolean,
        default: false
    }
});

const cardContainer = ref(null);
const { width: cardWidth } = useElementSize(cardContainer);

const isPreview = computed(() => !props.isEdit);

const currentHoverItem = ref();

const hoverPump = (item = {}, code) => {
    currentHoverItem.value = { ...item, pumpServiceSpaceCode: code };
};

const unHoverPump = () => {
    currentHoverItem.value = null;
};

const showCodes = [
    { code: 'coolingSeason', title: i18n.global.t('meos_control_web.cooling_mode_config'), previewTitle: i18n.global.t('meos_control_web.cooling_mode_standard') },
    { code: 'heatingSeason', title: i18n.global.t('meos_control_web.heating_mode_config'), previewTitle: i18n.global.t('meos_control_web.heating_mode_standard') }
];

const previewAndEditData = ref({
    coolingSeason: [],
    heatingSeason: []
});

// 二级泵组默认数据
const defaultSetData = {
    lowerChillWaterDetaSet: undefined,
    upperChillWaterDetaSet: undefined,
    chillWaterDetaSetName: '',
    chillWaterDetaSetType: '', //chillWaterDetaPressSet 压差 chillWaterDetaTempSet 温差
    chillWaterDetaUnit: '', // 单位温度/压强

    primaryChillWaterMainReturnTempName: '', // 回水温度文本
    lowerPrimaryChillWaterMainReturnTemp: undefined, // 回水温度下限
    upperPrimaryChillWaterMainReturnTemp: undefined // 回水温度上限
};

// 系统默认数据
const defaultValue = {
    id: '',
    localId: '',
    localName: '',
    supplyTempName: '',
    supplyTemp: undefined,
    supplyTempTime: undefined,
    tempAndPressureSetList: [],
    primaryChillWaterMainReturnTempName: '', // 回水温度文本
    lowerPrimaryChillWaterMainReturnTemp: undefined, // 回水温度下限
    upperPrimaryChillWaterMainReturnTemp: undefined // 回水温度上限
};

// 接口返回的字符串，需转换成数字的字段，校验需要
const topNumberCodes = ['supplyTemp', 'supplyTempTime', 'lowerPrimaryChillWaterMainReturnTemp', 'upperPrimaryChillWaterMainReturnTemp'];
const bottomNumberCodes = ['lowerChillWaterDetaSet', 'upperChillWaterDetaSet', 'lowerPrimaryChillWaterMainReturnTemp', 'upperPrimaryChillWaterMainReturnTemp'];

const isSmallSize = computed(() => cardWidth.value < 500);

const errMsgArr = ref([]);

const handleErrMsg = (msg, type, id, scopeCode) => {
    const preMsg = errMsgArr.value;
    const preItem = preMsg?.find(v => v?.id === id && v?.type === type);
    const newMsg = preItem ? preMsg.map(v => (v?.id === id && v?.type === type ? { ...v, msg } : v)) : [...preMsg, { id, type, msg, scopeCode }];
    errMsgArr.value = newMsg;
};

const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });
// 系统类的显示顺序为中央空调供冷全系统（ACAC）、中央供冷系统（ACCC）、中央冷热源系统（ACCI）
const coolClassCodes = ['ACAC', 'ACCC', 'ACCI'];

// 中央空调供热全系统（ACAH）、中央供热系统（ACCH）、中央冷热源系统（ACCI）
const heatClassCodes = ['ACAH', 'ACCH', 'ACCI'];
const isACAC = classCode => ['ACAC'].includes(classCode);
// 供热水泵控制组 ACHPC、冷热共用水泵控制组 ACPPC
const isACAH = classCode => ['ACAH'].includes(classCode);

const sortByClassCode = (a, b, codes) => {
    let aOrder = codes.findIndex(c => a?.classCode?.includes(c)),
        bOrer = codes.findIndex(c => b?.classCode?.includes(c));
    if (aOrder === -1) {
        aOrder = 1000;
    }
    if (bOrer === -1) {
        bOrer = 1000;
    }

    if (aOrder === bOrer) {
        // 按系统实例名称排序
        return collator.compare(a?.localName, b?.localName);
    }

    return aOrder - bOrer;
};

const handleInitCodes = (infoItem, withTempAndPressureSetList) => {
    let newConfig = { ...defaultValue, ...(infoItem || {}) };
    const isBelongACAC = isACAC(infoItem?.classCode);
    const isBelongACAH = isACAH(newConfig?.classCode);
    const { lowerChillWaterDetaSet, upperChillWaterDetaSet, chillWaterDetaSetName, chillWaterDetaSetType, chillWaterDetaUnit, tempAndPressureSetList } = infoItem || {};
    const hasTempAndPressureSetList = tempAndPressureSetList?.length;

    // 非ACAC、ACAH数据兼容处理
    // 空调热源二次泵没有温差压差，因此没有 TempAndPressureSetList
    if ((chillWaterDetaSetName || chillWaterDetaSetType) && ((!isBelongACAC && !isBelongACAH) || withTempAndPressureSetList) && !hasTempAndPressureSetList) {
        newConfig = {
            ...newConfig,
            tempAndPressureSetList: [{ ...defaultSetData, lowerChillWaterDetaSet, upperChillWaterDetaSet, chillWaterDetaSetName, chillWaterDetaSetType, chillWaterDetaUnit }]
        };
    }

    topNumberCodes.forEach(code => {
        newConfig[code] = newConfig[code]?.toString() ? Number(newConfig[code]) : newConfig[code];
    });
    bottomNumberCodes.forEach(code => {
        newConfig.tempAndPressureSetList.forEach(item => {
            item[code] = item[code]?.toString() ? Number(item[code]) : item[code];
        });
    });
    return newConfig;
};

const transformDataToRender = v => {
    const isBelongACAC = isACAC(v?.systemConfig?.classCode);
    const isBelongACAH = isACAH(v?.systemConfig?.classCode);

    const hasPumps = !!v?.pumpConfig?.length;

    if (v?.systemConfig?.id) {
        // 空调热源二次泵没有温差压差,一级泵才有温差压差
        const withTempAndPressureSetList = isBelongACAC || (isBelongACAH && !hasPumps);
        const newSystemConfig = handleInitCodes(v?.systemConfig || {}, withTempAndPressureSetList);
        v.systemConfig = newSystemConfig;
    }
    if (v?.pumpConfig?.length) {
        const withTempAndPressureSetList = isBelongACAC || isBelongACAH;
        const newPumpConfig = v?.pumpConfig
            .map(pumpItem => {
                const { classCode } = v?.systemConfig || {};
                const newItem = handleInitCodes({ classCode, ...pumpItem }, withTempAndPressureSetList);
                return newItem;
            })
            .toSorted((a, b) => {
                // 按泵组名称排序
                return collator.compare(a.localName, b.localName);
            });
        v.pumpConfig = newPumpConfig;
    }
};

watch(
    [() => props?.fetchData, () => props?.isEdit],
    ([curData, curEdit]) => {
        if (!curData) {
            return;
        }
        const cloneData = structuredClone(curData);
        if (cloneData?.coolingSeason?.length) {
            cloneData.coolingSeason
                .sort((a, b) => sortByClassCode(a?.systemConfig, b?.systemConfig, coolClassCodes))
                .forEach(v => {
                    transformDataToRender(v);
                });
        }
        if (cloneData?.heatingSeason?.length) {
            cloneData.heatingSeason
                .sort((a, b) => sortByClassCode(a?.systemConfig, b?.systemConfig, heatClassCodes))
                .forEach(v => {
                    transformDataToRender(v);
                });
        }
        if (curEdit) {
            // 回显编辑数据
            previewAndEditData.value = cloneData;
        } else {
            // 回显预览数据
            previewAndEditData.value = cloneData;
        }
    },
    {
        immediate: true
    }
);

const checkIsEmpty = item => {
    let isEmpty = true;
    const { supplyTempName, supplyTemp, supplyTempTime, primaryChillWaterMainReturnTempName, tempAndPressureSetList = [], classCode } = item || {};
    const chillWaterDetaSetName = tempAndPressureSetList.find(v => v?.chillWaterDetaSetName);
    const lowerChillWaterDetaSet = tempAndPressureSetList.find(v => v?.lowerChillWaterDetaSet);
    const upperChillWaterDetaSet = tempAndPressureSetList.find(v => v?.upperChillWaterDetaSet);

    const isNotEmptyReturnTemp = isACAC(classCode) && primaryChillWaterMainReturnTempName;
    if (supplyTempName || supplyTemp || supplyTempTime || isNotEmptyReturnTemp || chillWaterDetaSetName || lowerChillWaterDetaSet || upperChillWaterDetaSet) {
        isEmpty = false;
    }
    return isEmpty;
};

const checkWaterDetaIsEmpty = item => {
    let isEmpty = true;
    const { tempAndPressureSetList = [] } = item || {};
    const chillWaterDetaSetName = tempAndPressureSetList.find(v => v?.chillWaterDetaSetName);
    const chillWaterDetaSetType = tempAndPressureSetList.find(v => v?.chillWaterDetaSetType);
    if (chillWaterDetaSetName || chillWaterDetaSetType) {
        isEmpty = false;
    }
    return isEmpty;
};

const showReturnWater = item => {
    const isBelongACAC = isACAC(item?.classCode);
    return isBelongACAC;
};

// 回水温度配置是否为空
const checkReturnWaterIsEmpty = item => {
    let isEmpty = true;
    // lowerReturnWaterDetaSet, upperReturnWaterDetaSet
    // lowerPrimaryChillWaterMainReturnTemp, upperPrimaryChillWaterMainReturnTemp
    const { primaryChillWaterMainReturnTempName } = item || {};
    if (primaryChillWaterMainReturnTempName) {
        isEmpty = false;
    }
    return isEmpty;
};

const checkSupplyTempIsEmpty = item => {
    let isEmpty = true;
    const { supplyTempName } = item || {};
    if (supplyTempName) {
        isEmpty = false;
    }
    return isEmpty;
};

const handleBeforeSubmit = infoItem => {
    let newConfig = { ...(infoItem || {}) };
    const isBelongACAC = isACAC(newConfig?.classCode);
    const isBelongACAH = isACAH(newConfig?.classCode);
    // 非ACAC、ACAH数据兼容处理
    if (!isBelongACAC && !isBelongACAH) {
        const { tempAndPressureSetList } = newConfig;
        const preItem = tempAndPressureSetList[0] || {};
        newConfig = {
            ...newConfig,
            ...preItem
        };
    }

    return newConfig;
};

const transformDataToSubmit = v => {
    if (v?.systemConfig?.id) {
        const newSystemConfig = handleBeforeSubmit(v?.systemConfig || {});
        v.systemConfig = newSystemConfig;
    }
    if (v?.pumpConfig?.length) {
        const newPumpConfig = v?.pumpConfig.map(pumpItem => {
            const { classCode } = v?.systemConfig || {};
            const newItem = handleBeforeSubmit({ classCode, ...pumpItem });
            return newItem;
        });
        v.pumpConfig = newPumpConfig;
    }
    return v;
};

const validate = () => {
    let errMessages = errMsgArr.value?.map(item => item?.msg)?.filter(v => !!v),
        finalResult = structuredClone(previewAndEditData.value);
    const { scopeCode: firstErrorScopeCode, id: firstErrorId } = errMsgArr.value?.find(item => !!item?.msg) || {};
    const finalElementId = firstErrorId ? `${firstErrorId}-${firstErrorScopeCode}` : '';
    if (errMessages?.length && finalElementId) return { errorScope: finalElementId };
    finalResult.coolingSeason =
        finalResult.coolingSeason?.map(v => {
            return transformDataToSubmit(v);
        }) || [];
    finalResult.heatingSeason =
        finalResult.heatingSeason?.map(v => {
            return transformDataToSubmit(v);
        }) || [];
    return { data: finalResult };
};
const getFormData = () => {
    let finalResult = structuredClone(previewAndEditData.value);
    finalResult.coolingSeason =
        finalResult.coolingSeason?.map(v => {
            return transformDataToSubmit(v);
        }) || [];
    finalResult.heatingSeason =
        finalResult.heatingSeason?.map(v => {
            return transformDataToSubmit(v);
        }) || [];
    return finalResult;
};

defineExpose({ validate, getFormData });
</script>

<style lang="less" scoped>
.work-condition-container {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}

.right-container {
    display: flex;
    align-items: center;
    min-width: 200px;
    justify-content: flex-end;
}

.card-container {
    display: flex;
    flex-direction: column;
    row-gap: 28px;
}

.card-item-container {
    display: flex;
    flex-direction: column;
}

.row-title {
    padding-left: 12px;
    margin-bottom: 8px;

    color: @grey-600;
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
}

.empty-card {
    display: flex;
    padding: 12px;
    background: @grey-50;
    color: @grey-600;
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}

.pump-groups-detail-container {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    padding: 12px;
    background: @grey-50;
}

.pump-groups-detail {
    display: flex;
    // padding: 12px;
    flex-direction: column;

    .system-config {
        display: flex;
        flex-wrap: wrap;
        padding-inline: 16px;
        background: linear-gradient(90deg, #eaeff1 0%, rgba(255, 255, 255, 0) 100%);
        &:hover {
            background-color: rgba(196, 201, 207, 0.3);
        }
    }

    .label-left {
        margin-right: 16px;
        height: 100%;
        position: relative;
        width: 144px;
        height: auto;
    }

    .empty-text {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        display: flex;
    }

    .label {
        color: @grey-900;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        max-width: 144px;
        width: 144px;
    }

    .render-val {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        color: @grey-800;
        font-size: 14px;
        line-height: 22px;
        font-weight: var(--platform-font-weight);

        .val {
            font-weight: 700;
            margin-inline: 12px;
        }
    }

    .wrap-line {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        span {
            min-width: fit-content;
            display: inline-flex;
            align-items: center;
        }
    }

    .wrap-line + .wrap-line {
        margin-top: var(--custom-margin-top);
    }
}

.pumps-group {
    margin: 12px 0 0 12px;

    .prefix {
        color: @grey-600;
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 14px;
        margin-bottom: 8px;
    }

    .pumps-detail {
        display: flex;
        flex-direction: column;
        row-gap: 12px;
        flex: 1;
    }

    .pump-detail {
        display: flex;
        padding: 7px 16px;

        background: linear-gradient(90deg, #eaeff1 0%, rgba(255, 255, 255, 0) 100%);

        &:hover {
            background: rgba(196, 201, 207, 0.3);
        }
    }

    .pump-left {
        margin-right: 16px;
        height: fit-content;
        max-width: 144px;
        width: 144px;
        height: auto;
    }

    .pump-name {
        color: @grey-800;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        max-width: 144px;
        width: 144px;
    }

    .pump-config {
        flex: 1;
        display: flex;
        flex-direction: column;
        row-gap: 14px;
    }

    .pump-row {
        color: @grey-900;
        font-size: 14px;
        line-height: 22px;
        font-weight: var(--platform-font-weight);

        .val {
            font-weight: 700;
            margin-inline: 12px;
        }
    }
}

.right-action {
    margin-left: auto;
    position: relative;
}

.edit-mode {
    .wrap-line:last-child {
        margin-bottom: 6px;
    }
    .pump-config {
        row-gap: 16px;
    }
    .pump-row:last-child {
        margin-bottom: 12px;
    }
}

.small {
    .card-container {
        row-gap: 12px;
    }

    .system-config {
        flex-direction: column;
        row-gap: 8px;
        padding-inline: 0px;
        background: none;
        align-items: flex-start;
        position: relative;

        .label {
            width: auto;
            max-width: calc(100% - 92px);
        }

        .label-left {
            width: 100%;
        }

        &:hover {
            background-color: transparent;
        }
    }

    .render-val {
        color: @grey-600;

        .val {
            color: @grey-900;
            font-weight: var(--platform-font-weight);
            margin-inline: 4px;
        }
    }

    .pump-row {
        color: @grey-600;
    }

    .pump-groups-detail-container {
        padding: 0px;
        background-color: transparent;
        row-gap: 8px;
    }

    .pump-groups-detail {
        background-color: @grey-50;
        padding: 8px 12px;
    }

    .pump-detail {
        flex-direction: column;
        position: relative;
    }

    .pump-left {
        margin-right: 0px;
        margin-bottom: 4px;
        position: relative;
        max-width: 100%;
        width: 100%;
    }

    .pumps-group {
        .pump-name {
            width: auto;
            max-width: 184px;
        }
    }

    .pump-config {
        row-gap: 4px;
    }

    .right-action {
        width: 100%;
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>
