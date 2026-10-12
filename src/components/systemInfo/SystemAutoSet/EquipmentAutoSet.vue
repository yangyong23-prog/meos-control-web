<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        modal-class-name="equipment-auto-set-modal"
        type="default"
        :title="`${i18n.global.t('meos_control_web.manual_auto_control')}（${
            model === '0' ? i18n.global.t('meos_control_web.one_click_manual') : i18n.global.t('meos_control_web.one_click_auto')
        }）`"
        :width="420"
        @close="close"
    >
        <template #content>
            <m-form ref="Mform" :label-width="'86px'" :model="params" require-asterisk-position="right" :label-position="'left'">
                <m-form-item
                    :label="i18n.global.t('meos_control_web.equipment_scope')"
                    prop="objectIds"
                    :rules="[{ type: 'array', required: true, message: EMPTYTEXT, trigger: 'change' }]"
                >
                    <m-tree-select v-model="params.objectIds" :data="equitManual" :mode="tags" :not-null="false" :size="286" multiple searchable panel-searchable> </m-tree-select>
                </m-form-item>

                <m-form-item
                    v-if="model === '0'"
                    :label="i18n.global.t('meos_control_web.end_time')"
                    prop="expireTime"
                    :rules="[
                        { required: true, message: EMPTYTEXT, trigger: 'change' },
                        {
                            validator: (_value, _rule, callback) => validateLessNow(params.expireTime, callback),
                            trigger: 'change'
                        }
                    ]"
                >
                    <m-date-picker
                        v-model="params.expireTime"
                        type="datetime"
                        placement="bottomRight"
                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                        :popover-attrs="{
                            arrowOverflow: false
                        }"
                        :scope="SCOPE(5)"
                        :width="286"
                        :time-picker="{
                            stepM: 5,
                            format: 'hm'
                        }"
                    />
                </m-form-item>
                <template v-if="reasonType === 'select'">
                    <m-form-item v-if="model === '0'" :label="i18n.global.t('meos_control_web.reason')" prop="operateType">
                        <m-select
                            v-model="params.operateType"
                            :placeholder="i18n.global.t('meos_control_web.please_select')"
                            controls="operatorIcon"
                            :size="286"
                            :options="operateTypeList"
                        />
                    </m-form-item>

                    <m-form-item
                        v-if="params.operateType === i18n.global.t('meos_control_web.others') && model === '0'"
                        label=" "
                        prop="operateReason"
                        require-asterisk-position="null"
                        :rules="[{ max: 20, message: i18n.global.t('meos_control_web.max_20_chars'), trigger: ['blur', 'change'] }]"
                    >
                        <m-input v-model="params.operateReason" width="100%" :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')" />
                    </m-form-item>
                    <m-form-item
                        v-if="model === '0'"
                        :label="i18n.global.t('common.remarks')"
                        prop="contentInfo"
                        class="flex-start"
                        :rules="[{ max: 50, message: i18n.global.t('meos_control_web.max_50_chars'), trigger: ['blur', 'change'] }]"
                    >
                        <m-input v-model="params.contentInfo" type="textarea" :placeholder="i18n.global.t('common.placeholder_input')" :width="240" :height="70" />
                    </m-form-item>
                </template>
                <template v-else>
                    <m-form-item
                        v-if="model === '0'"
                        :label="i18n.global.t('common.remarks')"
                        prop="operateType"
                        class="flex-start"
                        :rules="[{ max: 200, message: i18n.global.t('meos_control_web.max_200_chars'), trigger: ['blur', 'change'] }]"
                    >
                        <m-input
                            v-model="params.operateType"
                            type="textarea"
                            :maxlength="200"
                            show-word-limit
                            :placeholder="i18n.global.t('common.placeholder_input')"
                            :width="240"
                            :height="70"
                        />
                    </m-form-item>
                </template>
            </m-form>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" :loading="loading" @click.stop="submit">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import { getManualAutoChangeReason } from '@/apis/systemDiagram';
import { EMPTYTEXT, SCOPE, SUCCESSCODE } from '@/utils/globalVariables';
import { useErrorMessage, useSuccessMessage, validateLessNow } from '@/utils/tools';
import dayjs from 'dayjs';
import { MMessageBox } from 'meri-plus';
import { commandExecuteChangeManualAutoStatus, getListClassCodes, getListEquipmentsByType } from '@/apis/ACAC';
import useLoading from '@/hooks/useLoading';
import i18n from '@/localization';
import { orderBy } from 'lodash';

const emits = defineEmits(['close', 'errorFun']);
const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
    },
    model: {
        type: String,
        default: ''
    },
    reasonType: {
        type: String,
        default: 'select'
    }
});
// 加载动画相关

const { openLoading, closeLoading } = useLoading(
    'm-modal-main-content',
    '#fff',
    'ball',
    {
        width: '80px',
        height: '80px'
    },
    0
);
const show = ref(false);
const Mform = ref(null);
// 0手动，1自动
const params = ref({
    model: props.model,
    objectIds: [],
    expireTime: '',
    operateType: '',
    operateReason: '',
    contentInfo: ''
});
const operateTypeList = ref([]);
const manualAutoChangeReason = async () => {
    operateTypeList.value = [];
    let res = {};
    try {
        const ress = await getManualAutoChangeReason({ systemId: props.systemId });
        if (ress.code === SUCCESSCODE) {
            res.data = ress.data || {};
        }
    } finally {
        if (!res.data) {
            res.data = {
                10: i18n.global.t('meos_control_web.device_maintenance_or_commissioning'),
                20: i18n.global.t('meos_control_web.equipment_fault_isolation'),
                30: i18n.global.t('meos_control_web.cooling_demand_change'),
                40: i18n.global.t('meos_control_web.adjust_equipment_params'),
                50: i18n.global.t('meos_control_web.others'),
                '00': i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation')
            };
        }
        for (const key in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, key)) {
                operateTypeList.value.push({ id: res.data[key], code: key, name: res.data[key] });
            }
        }
        operateTypeList?.value.sort((a, b) => a.code - b.code);
    }
};
const loading = ref(false);
const equitManual = ref([]);

// 根据名称首字符类型返回排序权重：
// 特殊字符(1) > 数字(2) > 小写字母(3) > 大写字母(4) > 汉字(5) > 其他(6)
const getCharTypeRank = nameStr => {
    if (!nameStr) return 6;
    const s = String(nameStr).trim();
    if (!s) return 6;
    const ch = s[0];
    // 汉字
    if (/^[\u4e00-\u9fa5]/.test(ch)) return 5;
    // 大写字母
    if (/^[A-Z]/.test(ch)) return 4;
    // 小写字母
    if (/^[a-z]/.test(ch)) return 3;
    // 数字
    if (/^\d/.test(ch)) return 2;
    // 其它视为特殊字符
    return 1;
};

const ManualAutoClassList = () => {
    equitManual.value = [];
    openLoading();
    getListEquipmentsByType(props.runningMonitorType, {
        filterEquipmentInSystemIds: [props.systemId],
        filterInfoCodeRules: ['manualAutoSet'],
        excludeInfoCodeValues: {
            localRemoteStatus: '0'
        },
        withColumns: ['id', 'classCode', 'classCodeName', 'localName']
    })
        .then(res => {
            const { result, data } = res;
            if (result === 'success') {
                // 按 classCode 分类
                const groupByClassCodeMap = Map.groupBy(data, item => item.classCode);
                const classCodes = new Set();
                data.forEach(item => {
                    classCodes.add(item.classCode);
                });
                const arr = Array.from(classCodes);
                arr.length &&
                    getListClassCodes({
                        queryCache: false,
                        isThrows: false,
                        classCodes: arr
                    })
                        .then(response => {
                            if (response.code === SUCCESSCODE && data && data.length) {
                                const finalResult = [
                                    {
                                        id: '0',
                                        name: i18n.global.t('common.all'),
                                        open: true,
                                        // 分组先按 classCode.name 分类排序，再按 equipment.localName 排序
                                        children: (response?.data || []).map(v => {
                                            const groupEquipments = groupByClassCodeMap.get(v.code) || [];
                                            const arr = orderBy(
                                                groupEquipments.map(item => ({ id: item.id, name: item.localName })),
                                                [o => getCharTypeRank(o.name), o => (o.name ?? '').toString().toLowerCase()],
                                                ['asc', 'asc']
                                            );
                                            return {
                                                id: v.code,
                                                name: v.name,
                                                children: arr
                                            };
                                        })
                                    }
                                ];
                                equitManual.value = finalResult;
                            }
                            closeLoading();
                        })
                        .catch(() => {
                            closeLoading();
                        });
            }
        })
        .finally(() => {
            closeLoading();
        });
};

onMounted(() => {
    show.value = true;
    if (props.reasonType === 'select') {
        manualAutoChangeReason();
    }
    ManualAutoClassList();
});
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};

const submit = () => {
    Mform.value.validate(valid => {
        const obj = structuredClone(params.value);
        obj.expireTime = obj.expireTime ? dayjs(obj.expireTime).format('YYYYMMDDHHmm59') : '';
        const paramsData = {
            content: obj.operateReason || obj.operateType,
            objectIds: obj.objectIds,
            systemId: props.systemId,
            infoValue: obj.model,
            expireTime: obj.expireTime,
            oneClick: true
        };
        if (valid) {
            if (props.model === '1') {
                MMessageBox({
                    title: i18n.global.t('meos_control_web.acknowledge_release_manual_control'),
                    customClass: 'customClass',
                    hasLoading: true,
                    message: i18n.global.t('meos_control_web.confirm_release_manual_to_auto'),
                    beforeClose: (action, data, done) => {
                        if (action === 'confirm') {
                            loading.value = true;
                            commandExecuteChangeManualAutoStatus(paramsData, false).then(res => {
                                loading.value = false;
                                if (res.code === SUCCESSCODE) {
                                    useSuccessMessage();
                                } else if (res.code === 'A0400') {
                                    emits('errorFun', res.data);
                                }
                                close(true);
                            });
                            done();
                        } else {
                            done();
                        }
                    }
                });
            } else {
                loading.value = true;
                commandExecuteChangeManualAutoStatus(paramsData, false).then(res => {
                    if (res.code === SUCCESSCODE) {
                        useSuccessMessage();
                    } else if (res.code === 'A0400') {
                        emits('errorFun', res.data);
                    }
                    close(true);
                    loading.value = false;
                });
            }
        } else {
            useErrorMessage();
        }
    });
};
</script>
<style lang="less" scoped>
.fs12 {
    font-size: 12px;
}
.radio-box {
    width: 100%;
    &-item {
        padding: 16px 20px;
        width: 100%;
        border-radius: 4px;
        border: 1px solid var(--gray-400);
        background: var(--gray-0);
        &.is-active {
            border: 1px solid var(--blue-500);
            background-color: var(--blue-50);
        }
        .m-radio {
            width: 100%;
        }
        p {
            padding-left: 24px;
            margin-top: 8px;
            font-size: 12px;
            color: var(--gray-500);
        }
        & + .radio-box-item {
            margin-top: 16px;
        }
    }
}
</style>
