<template>
    <div class="control-set">
        <div class="control-set-manual-auto control-set-box">
            <!-- 受限制组 -->
            <ControlSetItemGroup
                v-for="item in restrictedInfoCodes"
                :key="item.infoCode"
                :item="item"
                :cur-info-code="curInfoCode"
                :system-id="systemId"
                :object-id="objectId"
                :show-data-source="showDataSource"
                :show-control-btn-fn="showControlBtnFn"
                :disabled-fun="disabledFun"
                @open-form="openForm"
            />
        </div>
        <!-- 分隔线：仅当两组都存在时展示 -->
        <div v-if="showDivider" class="control-set-divider fcc">
            <Line />
        </div>
        <div class="control-set-no-manual-auto control-set-box">
            <!-- 不受限制组 -->
            <ControlSetItemGroup
                v-for="item in unrestrictedInfoCodes"
                :key="item.infoCode"
                :item="item"
                :cur-info-code="curInfoCode"
                :system-id="systemId"
                :object-id="objectId"
                :show-data-source="showDataSource"
                :show-control-btn-fn="showControlBtnFn"
                :disabled-fun="disabledFun"
                @open-form="openForm"
            />
        </div>
    </div>
    <ControlForm v-model="isOpen" :width="formWidth" :system-id="systemId" :virtual-ref="virtualRef" :form-list="formList" @submit="handleSubmit" @close="closeForm" />
</template>

<script setup>
import { INFO, INTERVENTION_TIME, REASON } from '@/components/ObjectInfoComponents/ControlForm/config';
import ControlSetItemGroup from './ControlSetItemGroup.vue';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormItemInputNumber from '@/components/ObjectInfoComponents/ControlForm/FormItemInputNumber.vue';
import { canControl, getNextFiveMinutePoint, useSuccessMessage } from '@/utils/tools';
import dayjs from 'dayjs';
import { INFO_CODE, IOT_SETTING, IS_AUTO, SUCCESSCODE } from '@/utils/globalVariables';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import i18n from '@/localization';
import { handleRelInfoCode, isUnrelatedToManualAutoSet } from '../utils';
import { IconMeriComponentNotificationInfo } from 'meri-icon';
import Line from '@/assets/svg/component/line.svg';

const { getIotData, setIotData } = DockSingleton.getInstance();
const props = defineProps({
    objectId: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
    },
    infoCodes: {
        type: Array,
        default: () => [
            /* {
                additionalMapValue: {
                    recoveryDateTime: '2025-06-20 15:25:00'
                },
                objectId: 'Eq748038282434a13ae892c54e9a8ec526f1c89adbd6',
                dataSource: [
                    {
                        code: '0',
                        name: i18n.global.t('meos_control_web.manual')
                    },
                    {
                        code: '1',
                        name: i18n.global.t('meos_control_web.auto')
                    }
                ],
                dataTime: '2025-06-19 15:25:00',
                dataValue: '0',
                infoCode: 'manualAutoSet',
                infoCodeName: i18n.global.t('meos_control_web.manual_auto_status_set'),
                infoCodeType: 'IOT_SETTING',
                existsIotRule: true,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataSource: [
                            {
                                code: '0',
                                name: i18n.global.t('meos_control_web.manual')
                            },
                            {
                                code: '1',
                                name: i18n.global.t('meos_control_web.auto')
                            }
                        ],
                        dataTime: '2025-06-19 15:25:00',
                        dataValue: '0',
                        infoCode: 'manualAutoStatus',
                        infoCodeName: i18n.global.t('meos_control_web.manual_auto_status'),
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '1935192558558724098',
                        sequence: 2,
                        originDataType: 'Boolv'
                    }
                ],
                relTemplateTypeId: '1935192558558724098',
                sequence: 1,
                originDataType: 'Boolp'
            },
            {
                additionalMapValue: {},
                objectId: 'Eq748038282434a13ae892c54e9a8ec526f1c89adbd6',
                dataTime: '2025-06-19 15:25:00',
                dataValue: '9.1',
                infoCode: 'chillWaterOutTempSet',
                infoCodeName: i18n.global.t('meos_control_web.chilled_water_outlet_temp_setpoint_value'),
                infoCodeType: 'IOT_SETTING',
                existsIotRule: true,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataTime: '2025-06-19 15:25:00',
                        dataValue: '8',
                        infoCode: 'evapWaterOutTemp',
                        infoCodeName: i18n.global.t('meos_control_web.evaporator_outlet_water_temp'),
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '1935192558558724098',
                        scale: 1,
                        sequence: 11,
                        unit: '℃',
                        originDataType: 'Inst'
                    }
                ],
                relTemplateTypeId: '1935192558558724098',
                scale: 1,
                sequence: 10,
                unit: '℃',
                originDataType: 'Nump'
            },
            {
                additionalMapValue: {},
                objectId: 'Eq748038282434a13ae892c54e9a8ec526f1c89adbd6',
                dataTime: '2025-06-19 15:25:00',
                dataValue: '64.8',
                infoCode: 'maxPLRSet',
                infoCodeName: i18n.global.t('meos_control_web.max_load_rate_setting'),
                infoCodeType: 'IOT_SETTING',
                existsIotRule: true,
                relInfoCodeConfigs: [
                    {
                        additionalMapValue: {},
                        dataTime: '2025-06-19 15:25:00',
                        dataValue: '500.4',
                        infoCode: 'pLR',
                        infoCodeName: i18n.global.t('meos_control_web.chiller_load_ratio'),
                        infoCodeType: 'IOT_RUNNING',
                        existsIotRule: true,
                        relTemplateTypeId: '1935192558558724098',
                        scale: 1,
                        sequence: 13,
                        unit: '%',
                        originDataType: 'Inst'
                    }
                ],
                relTemplateTypeId: '1935192558558724098',
                scale: 1,
                sequence: 12,
                unit: '%',
                originDataType: 'Nump'
            } */
        ]
    },
    type: {
        type: String,
        default: ''
    },
    handleSubmit: {
        type: Function,
        default: undefined
    },
    setConditions: {
        type: Array,
        default: () => [INFO_CODE.onlineStatus.infoCode, INFO_CODE.localRemoteStatus.infoCode]
    },
    customDisabledFun: {
        type: Function,
        default: undefined
    },
    hideIntervention: {
        type: Boolean,
        default: false
    },
    customInterventionTime: {
        type: Function,
        default: null
    },
    formWidth: {
        type: String,
        default: '280px'
    },
    showDataSource: {
        type: Boolean,
        default: false
    },
    showControlBtnFn: {
        type: Function,
        default: null
    },
    showInfo: {
        type: Boolean,
        default: true
    },
    showReason: {
        type: Boolean,
        default: false
    }
});
const virtualRef = ref(null);
const isOpen = ref(false);
const formList = ref([]);
const curInfoCode = ref({});
const setInterventionTime = (item, dataSourceItem) => {
    if (props.hideIntervention) {
        return;
    }
    // const obj = getIotData(item.objectId, item.infoCode);
    // console.log(item);
    formList.value.push(
        INTERVENTION_TIME(
            `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(3, 'day').format('YYYY.MM.DD HH:mm:00')}`,
            {
                infoCode: INFO_CODE.manualAutoSet.infoCode,
                dataValue: '1'
            },
            {},
            {
                // defaultValue: obj.additionalMapValue?.recoveryDateTime ? dayjs(obj.additionalMapValue.recoveryDateTime).format('YYYY.MM.DD HH:mm') : '',
                showFilter: props.showDataSource
                    ? (params, data) => {
                          // 判断是否是手动模式
                          if (item.infoCode === data.hide.infoCode && data.hide.dataValue === dataSourceItem.code) {
                              return false;
                          }
                          return true;
                      }
                    : null
            }
        )
    );
};
const openForm = (e, item, dataSourceItem) => {
    emitter.emit(CLOSE_CONTROL_FORM);
    formList.value = [];
    isOpen.value = false;
    virtualRef.value = e;
    curInfoCode.value = item;
    // 解析显示样式配置
    let showStyle = {};
    try {
        if (item.showStyle) {
            showStyle = JSON.parse(item.showStyle);
        }
    } catch (error) {
        console.log(error);
    }
    // 处理相关信息编码
    const relArr = handleRelInfoCode(item, dataSourceItem, showStyle);
    if (!dataSourceItem) {
        setFormItem(item);
    } else {
        let text = i18n.global.t('meos_control_web.confirm_set_equip_to_name', { name: dataSourceItem?.name }),
            options = {},
            is = IconMeriComponentNotificationInfo;
        if (relArr.length) {
            text = i18n.global.t('meos_control_web.rel_info_text', {
                operationType: dataSourceItem?.name,
                operationName: item.infoCodeName,
                relName: relArr.map(r => r.infoCodeName).join('、')
            });
            options = {
                componentAttrs: {
                    size: 16,
                    is: () => IconMeriComponentNotificationInfo,
                    color: 'var(--gray-500)'
                }
            };
        }
        props.showInfo && formList.value.push(INFO(text, is, options));
        curInfoCode.value.dataSourceItem = dataSourceItem;
    }
    if (!isUnrelatedToManualAutoSet(item)) {
        if (props.customInterventionTime) {
            props.customInterventionTime?.(formList.value);
        } else {
            // 当选择的设备包含“手自动状态manualAutoStatus=1 自动”才需要填写截止时间、当前选择的为手自动设置、或者始终显示截止时间
            const manualAutoStatus = getIotData(item.objectId, INFO_CODE.manualAutoStatus.infoCode);
            const showInterventionTime = manualAutoStatus.dataValue === IS_AUTO || item.infoCode === INFO_CODE.manualAutoSet.infoCode;
            if (showInterventionTime) {
                setInterventionTime(item, dataSourceItem);
            }
        }
    }
    // 遍历处理相关项并设置表单项
    relArr.forEach(relItem => {
        setFormItem(relItem);
    });
    curInfoCode.value.relInfoCodes = relArr.map(r => r.infoCode);
    (!props.showDataSource || props.showReason) && formList.value.push(REASON());
    nextTick(() => {
        isOpen.value = true;
    });
};
const setFormItem = item => {
    const obj = {
        name: item.infoCodeName,
        required: true,
        defaultValue: getIotData(item.objectId, item.infoCode)?.dataValue,
        ...item
    };
    if (item?.dataSource?.length) {
        obj.component = FormItemRadio;
    } else {
        obj.component = FormItemInputNumber;
        obj.componentAttrs = {
            precision: item.scale || 1
        };
    }
    formList.value.push(obj);
};
const closeForm = () => {
    isOpen.value = false;
    virtualRef.value = null;
    curInfoCode.value = {};
    formList.value = [];
};
const { controlFn, singleObjectBatchControlFn } = useGeneralControl();
const handleSubmit = async (data, fn) => {
    // 根据数据源项或信息码获取值
    const value = curInfoCode.value.dataSourceItem ? curInfoCode.value.dataSourceItem.code : data[curInfoCode.value.infoCode];
    const params = {
        objectIds: [curInfoCode.value.objectId],
        infoCode: curInfoCode.value.infoCode,
        infoValue: value,
        model: value,
        ...data
    };
    delete params[curInfoCode.value.infoCode];
    params.operateReason = data.content || '';
    params.expireTime = params.expireTime ? dayjs(params.expireTime).format('YYYYMMDDHHmmss') : '';
    // 判断是否存在关联信息码，决定使用不同的处理方式
    if (curInfoCode.value.relInfoCodes?.length) {
        // 构建批量操作的命令参数
        const commandParams = [{ infoCode: curInfoCode.value.infoCode, infoValue: value }];
        curInfoCode.value.relInfoCodes.forEach(relInfoCode => {
            commandParams.push({
                infoCode: relInfoCode,
                infoValue: data[relInfoCode]
            });
        });

        // 执行批量控制操作
        singleObjectBatchControlFn({
            data: {
                objectId: curInfoCode.value.objectId || props.objectId,
                systemId: props.systemId,
                commandParams: commandParams,
                content: params.operateReason
            },
            callback: res => {
                const { code } = res;
                if (code === SUCCESSCODE) {
                    useSuccessMessage();
                }
                closeForm();
                fn();
            }
        });
    } else {
        controlFn({
            data: params,
            callback: res => {
                const { code } = res;
                if (code === SUCCESSCODE) {
                    useSuccessMessage();
                }
                closeForm();
                fn();
            }
        });
    }
};

const disabledFun = item => {
    if (props.customDisabledFun) {
        return props.customDisabledFun(props.setConditions, item, props.objectId);
    }
    const obj = { disabled: false, disabledText: '', setValueAlways: true };
    const infoCodesData = [];
    props.setConditions?.forEach(v => {
        const data = getIotData(item.objectId, v);
        infoCodesData.push(data);
    });
    const canControlObj = canControl(infoCodesData);
    obj.disabled = !canControlObj.value;
    obj.disabledText = canControlObj.text;
    return obj;
};
// 仅展示可控制的信息点，并补充当前对象 ID；首个非手自动设置信息点用于模板中的特殊样式。
const infoCodesComputed = computed(() => {
    let first = false;
    props.infoCodes?.forEach(item => {
        item.objectId = props.objectId;
        if (item.infoCode !== INFO_CODE.manualAutoSet.infoCode && !first) {
            // 标记首个非手自动设置项，避免与手自动设置项的展示样式冲突。
            first = true;
            item.notFirstManualAutoSet = true;
        }
    });
    // 控制区只渲染可下发设置指令的信息点。
    return props.infoCodes?.filter(item => item.infoCodeType === IOT_SETTING) || [];
});

// 受限制组：受手自动状态控制的参数
const restrictedInfoCodes = computed(() => {
    return infoCodesComputed.value.filter(item => !isUnrelatedToManualAutoSet(item));
});

// 不受限制组：不受手自动状态控制的参数
const unrestrictedInfoCodes = computed(() => {
    return infoCodesComputed.value.filter(item => isUnrelatedToManualAutoSet(item));
});

// 仅当两组都存在时展示分隔线
const showDivider = computed(() => restrictedInfoCodes.value.length > 0 && unrestrictedInfoCodes.value.length > 0);
</script>
<style lang="less" scoped>
.control-set-divider {
    height: 32px;
    background-color: var(--gray-0);
    overflow: hidden;
}
</style>
