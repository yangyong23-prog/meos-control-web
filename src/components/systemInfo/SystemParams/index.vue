<template>
    <div class="system-params-set">
        <div v-for="level1 in systemParameterSet.groupChildren" :key="level1.groupCode" class="group-children-item">
            <div class="group-name-detail-configuration">{{ level1.groupName }}</div>
            <template v-if="level1.groupChildren?.length">
                <div v-for="level2 in level1.groupChildren" :key="level2.groupCode" class="group-children-item">
                    <div class="level2-title fs14 fw700">{{ level2.groupName }}</div>
                    <RelInfoCodeConfigs
                        :rel-info-code-configs="level2?.relInfoCodeConfigs"
                        :special-info-codes="specialInfoCodes"
                        :current-info-code="currentData.infoCode"
                        :get-info-data="getInfoData"
                        :on-open-form="openFrom"
                    >
                        <template v-for="(_, slotName) in slots" #[slotName]="slotProps">
                            <slot :name="slotName" v-bind="slotProps" />
                        </template>
                    </RelInfoCodeConfigs>
                </div>
            </template>
            <RelInfoCodeConfigs
                v-else
                :rel-info-code-configs="level1?.relInfoCodeConfigs"
                :special-info-codes="specialInfoCodes"
                :current-info-code="currentData.infoCode"
                :get-info-data="getInfoData"
                :on-open-form="openFrom"
            >
                <template v-for="(_, slotName) in slots" #[slotName]="slotProps">
                    <slot :name="slotName" v-bind="slotProps" />
                </template>
            </RelInfoCodeConfigs>
        </div>
    </div>
    <ControlForm
        ref="ControlFormRef"
        v-model="isOpen"
        width="300px"
        :system-id="systemId"
        :virtual-ref="virtualRef"
        :form-list="formList"
        :relate-form-list="relateFormList"
        @submit="handleSubmit"
        @hide="closeForm"
        @close="closeForm"
    />
</template>

<script setup>
import { DETAIL, GET_MENU_CONFIG, OTHER_REASON, SUCCESSCODE } from '@/utils/globalVariables';
import dataDockHandling from '@/hooks/dataDockHandling';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import DockSingleton from '@/hooks/responsiveDock';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import { REASON_SELECT } from '@/components/ObjectInfoComponents/ControlForm/config';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormItemInputNumber from '@/components/ObjectInfoComponents/ControlForm/FormItemInputNumber.vue';
import { commandSend } from '@/apis/ACAC';
import { useSuccessMessage } from '@/utils/tools';
import { INFO_EXTEND_SET } from '@/utils/SSEEventTypes';
import RelInfoCodeConfigs from './RelInfoCodeConfigs.vue';
import { defineEmits, defineProps, useSlots, ref } from 'vue';
import { isIotInfoType } from '@/utils/infoTemplate';

const { getIotData, setIotData, getCustomInfo, setCustomInfo } = DockSingleton.getInstance();
const props = defineProps({
    systemId: {
        type: String,
        default: ''
    },
    runningMonitorType: {
        type: String,
        default: () => window[GET_MENU_CONFIG]?.()?.RUNNING_MONITOR_TYPE
    },
    specialInfoCodes: {
        type: Array,
        default: () => []
    },
    handleSpecialInfoCodes: Function,
    maxAndMin: {
        type: Object,
        default: () => ({})
    },
    optionsObj: {
        type: Object,
        default: () => ({})
    },
    handleSpecialSubmitFn: Function,
    sseConsoleClient: {
        type: Object,
        default: null
    }
});
const isOpen = ref(false);
const { loadDynaDataWithIotHandling } = dataDockHandling();
const { cancelQuest, cancelToken } = UseCancelTokenHooks();
const ControlFormRef = ref(null);
const systemParameterSet = ref({});
const virtualRef = ref(null);
const formList = ref([]);
const relateFormList = ref([]);
const currentData = ref({});
const emits = defineEmits(['loadFinally']);
const slots = useSlots();

const getTemplateInfoCodes = async () => {
    cancelQuest();
    // 获取模板信息编码
    const params = {
        templateCode: DETAIL,
        objectIds: [props.systemId],
        runningMonitorType: props.runningMonitorType
    };
    try {
        const res = await loadDynaDataWithIotHandling(params, listInfoCodeConfigsByObjectIdCommon, undefined, { cancelToken: cancelToken() });
        const data = res?.data?.[0] || {};
        systemParameterSet.value = data.systemParameterSet || {};
    } finally {
        emits('loadFinally');
    }
};
const getInfoData = value => {
    if (isIotInfoType(value.infoCodeType)) {
        return getIotData(props.systemId, value.infoCode);
    }
    return getCustomInfo(props.systemId, value.infoCodeType, value.infoCode);
};
const openFrom = (e, value) => {
    if (value.infoCode === currentData.value.infoCode) {
        return;
    }
    closeForm();
    isOpen.value = true;
    virtualRef.value = e;
    const options = props.optionsObj[value.infoCode] || [];
    currentData.value = value;
    if (props.specialInfoCodes.includes(value.infoCode)) {
        if (props.handleSpecialInfoCodes) {
            return props.handleSpecialInfoCodes?.(getInfoData(value), formList, relateFormList);
        }
    }
    options?.length &&
        formList.value.unshift(
            REASON_SELECT(undefined, {
                options
            })
        );
    const obj = {
        name: value.infoCodeName,
        required: true,
        defaultValue: getInfoData(value)?.dataValue,
        componentAttrs: {},
        ...value
    };
    if (value?.dataSource?.length) {
        obj.component = FormItemRadio;
    } else {
        obj.component = FormItemInputNumber;
        obj.componentAttrs = {
            precision: value.scale || 1,
            ...(props.maxAndMin[value.infoCode] || {})
        };
    }
    formList.value.unshift(obj);
};
const handleSubmit = data => {
    if (props.specialInfoCodes.includes(currentData.value.infoCode)) {
        // 处理特殊信息编码
        props.handleSpecialSubmitFn?.(data, currentData.value, () => {
            closeForm();
        });
        return;
    } else {
        const params = {
            systemId: props.systemId,
            objectId: props.systemId,
            infoCode: currentData.value.infoCode,
            infoValue: data[currentData.value.infoCode],
            beforeValue: getInfoData(currentData.value).dataValue ?? '',
            content: data.operateType === OTHER_REASON ? data.operateReason : data.operateType
        };
        commandSend(params)
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    useSuccessMessage();
                }
            })
            .finally(() => {
                closeForm();
            });
    }
};
const closeForm = () => {
    isOpen.value = false;
    virtualRef.value = null;
    formList.value = [];
    relateFormList.value = [];
    currentData.value = {};
};
const walkGroupChildren = (groupChildren, callback) => {
    if (!Array.isArray(groupChildren) || typeof callback !== 'function') {
        return;
    }
    groupChildren.forEach(group => {
        if (Array.isArray(group?.relInfoCodeConfigs)) {
            group.relInfoCodeConfigs.forEach(callback);
        }
        if (Array.isArray(group?.groupChildren) && group.groupChildren?.length) {
            walkGroupChildren(group.groupChildren, callback);
        }
    });
};
const handleInfoExtendSet = res => {
    const infoCode = res?.data?.infoCode;
    if (!infoCode) {
        return;
    }

    walkGroupChildren(systemParameterSet.value?.groupChildren, info => {
        if (info?.infoCode === infoCode) {
            const objCustom = getCustomInfo(props.systemId, info.infoCodeType, info.infoCode) || {};
            setCustomInfo(res.data.objectId, { ...info, dataValue: { ...(objCustom.dataValue || {}), ...res.data.extendSetting } }, info.infoCodeType, info.infoCode);
        }
    });
};
onMounted(() => {
    props.sseConsoleClient?.addEventListener(INFO_EXTEND_SET, handleInfoExtendSet);
    getTemplateInfoCodes();
});
onUnmounted(() => {
    props.sseConsoleClient?.removeEventListener(INFO_EXTEND_SET, handleInfoExtendSet);
});
defineExpose({
    getTemplateInfoCodes
});
</script>
<style lang="less" scoped>
.system-params-set {
    .group-children-item + .group-children-item {
        margin-top: 16px;
    }
    .level2-title {
        padding-left: 12px;
        height: 22px;
        line-height: 22px;
        margin-bottom: 8px;
    }
}
</style>
<style lang="less">
.system-params-set .info-code-value {
    .value-text {
        font-weight: 700;
        font-size: 18px;
        font-family: 'PersagyRegular-aasd', 'PersagyMedium', 'PersagyBold';
    }
    .value-unit {
        color: var(--gray-600);
    }
}
</style>
