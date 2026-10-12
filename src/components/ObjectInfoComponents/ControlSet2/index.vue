<template>
    <div class="control-set">
        <div class="control-set-manual-auto control-set-box">
            <!-- 受限制组 -->
            <ControlSetItemGroup
                v-for="item in restrictedInfoCodes"
                :key="item.infoCode"
                v-model:m-forced-model="mForcedModel"
                :item="item"
                :cur-info-code="curInfoCode"
                :cur-data-source-item-code="curDataSourceItemCode"
                :system-id="systemId"
                :forced-model="forcedModel"
                :show-enable-control-tip="showEnableControlTip"
                :select-obj="selectObj"
                :loading="loading"
                :show-set-buttons-fn="showSetButtons"
                :single-control-disabled-fun="singleControlDisabledFun"
                :disabled-fun="disabledFun"
                :before-change-fn="beforeChange"
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
                v-model:m-forced-model="mForcedModel"
                :item="item"
                :cur-info-code="curInfoCode"
                :cur-data-source-item-code="curDataSourceItemCode"
                :system-id="systemId"
                :forced-model="forcedModel"
                :show-enable-control-tip="showEnableControlTip"
                :select-obj="selectObj"
                :loading="loading"
                :show-set-buttons-fn="showSetButtons"
                :single-control-disabled-fun="singleControlDisabledFun"
                :disabled-fun="disabledFun"
                :before-change-fn="beforeChange"
                @open-form="openForm"
            />
        </div>
    </div>
    <ControlForm
        v-model="isOpen"
        :width="controlFormWidth"
        :system-id="systemId"
        :virtual-ref="virtualRef"
        :form-list="formList"
        @submit="handleSubmit"
        @close="closeForm"
        @click-out="closeForm"
    />
</template>

<script setup>
import i18n from '@/localization';
import ControlSetItemGroup from './ControlSetItemGroup.vue';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormItemInputNumber from '@/components/ObjectInfoComponents/ControlForm/FormItemInputNumber.vue';
import { canControl, getNextFiveMinutePoint, useSuccessMessage } from '@/utils/tools';
import dayjs from 'dayjs';
import { INFO_CODE, IOT_SETTING, IS_AUTO, IS_MANUAL, SUCCESSCODE } from '@/utils/globalVariables';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { INFO, INTERVENTION_TIME } from '@/components/ObjectInfoComponents/ControlForm/config';
import useWatchEffectWithCleanup, { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { handleRelInfoCode, isUnrelatedToManualAutoSet } from '../utils';
import { IconMeriComponentNotificationInfo } from 'meri-icon';
import Line from '@/assets/svg/component/line.svg';

const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    selectObj: {
        type: Object,
        default: () => ({})
    },
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
    forcedModel: {
        type: String,
        default: ''
    },
    forcedControlFn: {
        type: Function,
        default: () => {}
    },
    controlFormWidth: {
        type: String,
        default: '320px'
    },
    showEnableControlTip: {
        type: Boolean,
        default: true
    },
    filterInfoCodes: {
        type: Array,
        default: () => [INFO_CODE.manualAutoSet.infoCode]
    },
    enableCtrlActualInfoCode: {
        type: String,
        default: INFO_CODE.enableCtrl.infoCode
    },
    alawysShowSetButtons: {
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
    formList.value.push(
        INTERVENTION_TIME(
            `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(3, 'day').format('YYYY.MM.DD HH:mm:00')}`,
            {
                infoCode: INFO_CODE.manualAutoSet.infoCode,
                dataValue: '1'
            },
            {},
            {
                showFilter: (params, data) => {
                    // 判断是否是手动模式
                    if (item.infoCode === data.hide.infoCode && data.hide.dataValue === dataSourceItem.code) {
                        return false;
                    }
                    return true;
                }
            }
        )
    );
};
/**
 * 打开表单函数
 * @param {Event} e - 触发事件对象
 * @param {Object} item - 当前信息项对象
 * @param {Object} dataSourceItem - 数据源项对象
 * @returns {void}
 */
const openForm = (e, item, dataSourceItem) => {
    console.log(e, item, dataSourceItem);

    // 关闭控制表单并重置相关状态
    emitter.emit(CLOSE_CONTROL_FORM);
    formList.value = [];
    isOpen.value = false;
    virtualRef.value = e;
    curInfoCode.value = item;
    curInfoCode.value.dataSourceItem = dataSourceItem;
    formList.value = [];
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

    // 根据数据源项是否存在决定表单项内容
    if (dataSourceItem) {
        curDataSourceItemCode.value = dataSourceItem.code;
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
        formList.value.push(INFO(text, is, options));
    } else {
        setFormItem(item);
    }
    if (!isUnrelatedToManualAutoSet(item)) {
        if (!props.filterInfoCodes.includes(INFO_CODE.manualAutoSet.infoCode)) {
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
    curDataSourceItemCode.value = '';
};

const curDataSourceItemCode = ref('');
const isConfirm = ref(false);
const { controlFn, singleObjectBatchControlFn } = useGeneralControl();
/**
 * 处理表单提交的异步函数
 * @param {Object} data - 表单提交的数据对象
 * @param {Function} fn - 提交成功后的回调函数
 * @returns {Promise<void>} 无返回值
 */
const handleSubmit = async (data, fn) => {
    // 根据数据源项或信息码获取值
    const value = curInfoCode.value.dataSourceItem ? curInfoCode.value.dataSourceItem.code : data[curInfoCode.value.infoCode];

    // 构建请求参数
    const params = {
        objectIds: [curInfoCode.value.objectId || props.objectId],
        infoCode: curInfoCode.value.infoCode,
        infoValue: value,
        model: value,
        systemId: props.systemId,
        ...data
    };

    // 删除原始信息码字段，避免重复
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
        // 执行普通控制操作
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
        const data = getIotData(item.objectId || props.objectId, v);
        infoCodesData.push(data);
    });
    const canControlObj = canControl(infoCodesData);
    obj.disabled = !canControlObj.value;
    obj.disabledText = canControlObj.text;
    return obj;
};

const singleControlDisabledFun = item => {
    const obj = disabledFun(item);
    if (mForcedModel.value === 'checked' && item.infoCode === props.enableCtrlActualInfoCode) {
        obj.disabled = true;
        obj.disabledText = i18n.global.t('meos_control_web.single_control_active_action_denied_dup');
    }
    return obj;
};

const mForcedModel = ref('uncheck');

useWatchWithCleanup(
    () => props.forcedModel,
    () => {
        mForcedModel.value = props.forcedModel;
    },
    {
        immediate: true
    }
);

const loading = ref(false);

const beforeChange = async data => {
    const infoCodes = mForcedModel.value === 'checked' ? (data.relInfoCodeConfigs ?? []).map(c => c.infoCode) : undefined;

    let releaseForceControlInfoCodes = [];
    if (infoCodes) {
        releaseForceControlInfoCodes = [{ objectId: props.objectId, infoCodes }];
    }

    try {
        loading.value = true;
        const res = await props.forcedControlFn({ objectId: props.objectId, status: mForcedModel.value === 'checked' ? 'CLOSE' : 'OPEN', releaseForceControlInfoCodes });
        if (res.code === SUCCESSCODE) {
            // 处理成功
            // useSuccessMessage();
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        loading.value = false;
    }
};

const showSetButtons = item => {
    if (props.alawysShowSetButtons) {
        return true;
    }
    const isManual = getIotData(props.objectId, INFO_CODE.manualAutoSet.infoCode).dataValue === IS_MANUAL;
    // 根据配置文件决定设备的控制是否受"手自动状态设定"限制
    if (isUnrelatedToManualAutoSet(item)) {
        return true;
    }
    return isManual; //手动
};

useWatchEffectWithCleanup(() => {
    if (getIotData(props.objectId, INFO_CODE.manualAutoSet.infoCode).dataValue === IS_AUTO) {
        // 自动
        mForcedModel.value = 'uncheck';
    }
    if (getIotData(props.objectId, INFO_CODE.manualAutoSet.infoCode).dataValue) {
        isOpen.value = false;
        isConfirm.value = false;
    }
});

const fn = (item, handle) => {
    if (item?.relInfoCodeConfigs) {
        item?.relInfoCodeConfigs.forEach(c => {
            handle(c);
            fn(c, handle);
        });
    }
    if (item?.groupChildren) {
        item?.groupChildren.forEach(c => {
            handle(c);
            fn(c, handle);
        });
    }
};
const infoCodesComputed = computed(() => {
    props.infoCodes.forEach(item => {
        if (item.infoCode === props.enableCtrlActualInfoCode) {
            item.actualInfoCode = props.enableCtrlActualInfoCode;
        }
        item.objectId = props.objectId;
        fn(item, c => {
            c.objectId = props.objectId;
        });
    });

    return props.infoCodes.filter(item => item.infoCodeType === IOT_SETTING && !props.filterInfoCodes.includes(item.infoCode));
});

// 受限制组：受手自动状态控制的参数
const restrictedInfoCodes = computed(() => {
    if (props.alawysShowSetButtons) return [];
    return infoCodesComputed.value.filter(item => !isUnrelatedToManualAutoSet(item));
});

// 不受限制组：不受手自动状态控制的参数
const unrestrictedInfoCodes = computed(() => {
    if (props.alawysShowSetButtons) return infoCodesComputed.value;
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
