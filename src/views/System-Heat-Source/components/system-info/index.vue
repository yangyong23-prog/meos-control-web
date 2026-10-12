<template>
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="show"
        :title="i18n.global.t('meos_control_web.system_parameter_setting')"
        :shadow="false"
        :shadow-click="false"
        width="480px"
        :drawer-class="`system-drawer noIframe`"
        :z-index="Z_INDEX.commonDrawer"
        @close="close"
    >
        <template #content>
            <m-scrollbar :content-class="'sys-drawer-loading-container'" style="padding-right: 20px">
                <SystemParamsSet
                    ref="SystemParamsSetRef"
                    :system-id="systemObject.id || systemObject.systemId"
                    :special-info-codes="['ZDYairConditioningCapacitySet']"
                    :loading="loadingSystemParamsSet"
                    :max-and-min="{
                        sourceReturnTempSet: { max: 50, min: 0 },
                        distributorCollectorDetaPressSet: { max: 1000, min: 0 }
                    }"
                    :options-obj="{
                        sourceReturnTempSet: [
                            {
                                id: i18n.global.t('meos_control_web.winter_summer_condition_change'),
                                name: i18n.global.t('meos_control_web.winter_summer_condition_change')
                            },
                            {
                                id: i18n.global.t('meos_control_web.temporary_adjustment_of_buried_pipe_heat'),
                                name: i18n.global.t('meos_control_web.temporary_adjustment_of_buried_pipe_heat')
                            },
                            {
                                id: OTHER_REASON,
                                name: i18n.global.t('meos_control_web.others')
                            }
                        ]
                    }"
                    :handle-special-info-codes="handleSpecialInfoCodes"
                    :handle-submit-fn="handleSubmitFn"
                    :sse-console-client="sseConsoleClient"
                    @load-finally="loadingSystemParamsSet = false"
                >
                    <template #ZDYairConditioningCapacitySet="{ data }">
                        <span style="margin-right: 4px">
                            <span class="value-text" style="margin-right: 4px; font-size: 16px; font-family: 'Microsoft YaHei'">{{
                                data?.dataValue?.airConditioningCapacitySet
                                    ? data?.dataValue?.airConditioningCapacitySet === '1'
                                        ? i18n.global.t('meos_control_web.cooling')
                                        : i18n.global.t('meos_control_web.heating')
                                    : '--'
                            }}</span>
                            <span class="value-unit">{{ data.unit }}</span>
                        </span>
                    </template>
                </SystemParamsSet>
                <div class="group">
                    <div class="params-set-title fc">{{ i18n.global.t('meos_control_web.manual_auto_settings') }}</div>
                    <SystemAutoSet class="content" :running-monitor-type="runningMonitorType" :system-id="systemObject.id || systemObject.systemId" />
                </div>
                <div class="group">
                    <div class="params-set-title fc mb4">{{ i18n.global.t('meos_control_web.auto_control_cum_runtime_reset') }}</div>
                    <AutomaticReset
                        :running-monitor-type="runningMonitorType"
                        :loading="loadingAutomaticReset"
                        :system-id="systemObject.id || systemObject.systemId"
                        :system-class-code="systemObject.classCode"
                        @load-finally="loadingAutomaticReset = false"
                    />
                </div>
            </m-scrollbar>
        </template>
    </m-drawer>
</template>

<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
// import SystemForm from './SystemForm.vue';
// import PumpSetForm from './PumpSetForm.vue';
import SystemAutoSet from '@/components/systemInfo/SystemAutoSet/SystemAutoSet.vue';
import AutomaticReset from '@/components/systemInfo/AutomaticReset/AutomaticReset.vue';
import SystemParamsSet from '@/components/systemInfo/SystemParams/index.vue';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormSelect from '@/components/ObjectInfoComponents/ControlForm/FormSelect.vue';
import { SYSTEM_CLASS_CODE } from '../../constant/variable';
import { extendInfoCodeValueConfig } from '@/apis/ACAC';
import { useSuccessMessage } from '@/utils/tools';
import { INFO } from '@/components/ObjectInfoComponents/ControlForm/config';
// import AutomaticReset from './AutomaticReset.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { OTHER_REASON, SUCCESSCODE } from '@/utils/globalVariables';
import useLoading from '@/hooks/useLoading';

const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    systemObject: {
        type: Object,
        default: () => ({})
    },
    sseConsoleClient: {
        type: Object,
        default: null
    }
});
const loadingAutomaticReset = ref(true);
const loadingSystemParamsSet = ref(true);
const show = ref(false);
const SystemParamsSetRef = ref();
// const openLoading = inject('openLoading');
const emits = defineEmits(['close', 'cancel']);
const handleSpecialInfoCodes = (value, list, relateFormList) => {
    const data = {
        name: '',
        required: true,
        componentAttrs: {},
        defaultValue: value.dataValue?.airConditioningCapacitySet ?? '',
        component: FormSelect,
        dataSource: [
            { code: '1', name: i18n.global.t('meos_control_web.cooling') },
            { code: '2', name: i18n.global.t('meos_control_web.heating') }
        ],
        infoCode: value.infoCode
    };
    const arr1 = [data];
    const arr2 = [
        INFO(i18n.global.t('meos_control_web.switch_auto_mode_device_auto'), '', {
            componentAttrs: {
                style: 'border-radius: 4px;padding: 4px;background-color: var(--gray-100);color: var(--gray-50);'
            }
        })
    ];
    if (value.dataValue?.manualAutoSet === 1) {
        relateFormList.value = arr2;
    } else {
        relateFormList.value = arr1;
    }
    // 添加手自动项
    const obj = {
        name: value.infoCodeName || value.infoCode,
        required: true,
        defaultValue: value.dataValue?.manualAutoSet + '',
        componentAttrs: {
            onChange: val => {
                console.log(val);
                if (val === '1') {
                    relateFormList.value = arr2;
                } else {
                    relateFormList.value = arr1;
                }
            }
        },
        infoCode: 'manualAutoSet',
        dataSource: [
            { code: '0', name: i18n.global.t('meos_control_web.manual1') },
            { code: '1', name: i18n.global.t('meos_control_web.auto') }
        ],
        component: FormItemRadio
    };
    list.value.unshift(obj);
};
const { getCustomInfo } = DockSingleton.getInstance();

const handleSubmitFn = (data, currentData, cb) => {
    const params = {
        classCode: SYSTEM_CLASS_CODE,
        systemId: props.systemObject.id || props.systemObject.systemId,
        infoCode: currentData.infoCode,
        infoValue: data[currentData.infoCode],
        beforeValue: getCustomInfo(props.systemObject.id || props.systemObject.systemId, currentData.infoCodeType, currentData.infoCode)?.infoCodeValue ?? '',
        content: '', //原因
        extendSetting: {
            manualAutoSet: data.manualAutoSet, //手自动状态 0-人工 1-自动
            airConditioningCapacitySet: data[currentData.infoCode]
        }
    };
    extendInfoCodeValueConfig(params)
        .then(res => {
            if (res.code === SUCCESSCODE) {
                useSuccessMessage();
                SystemParamsSetRef.value.getTemplateInfoCodes();
            }
        })
        .finally(() => {
            cb();
        });
};
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
const { openLoading, closeLoading } = useLoading(
    'm-drawer-container-content',
    '#FFFFFF',
    'ball',
    {
        width: '100px',
        height: '100px'
    },
    0
);
onMounted(() => {
    show.value = true;
    nextTick(() => {
        openLoading();
    });
});
watch(
    () => [loadingAutomaticReset.value, loadingSystemParamsSet.value],
    val => {
        if (val.every(v => !v)) {
            // 全部加载完成
            closeLoading();
        }
    }
);
</script>
<style lang="less" scoped>
.group:empty {
    display: none;
}
.params-set-title {
    color: #2e3742;
    //
    font-size: 16px;
    font-weight: 700;
    height: 24px;
    line-height: 24px;
    padding-left: 12px;
    position: relative;
    &::after {
        content: '';
        width: 3px;
        height: 14px;
        background-color: #246fe5;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
}
.params-set-title:last-child {
    display: none;
}
</style>
<style lang="less">
@media screen and (min-width: 1600px) {
    .system-drawer {
        .m-drawer-container {
            width: 480px !important;
            height: calc(100% - 48px) !important;
        }
    }
}
@media screen and (max-width: 1600px) {
    .system-drawer {
        .m-drawer-container {
            width: 400px !important;
            height: calc(100% - 48px) !important;
        }
    }
}

.system-drawer {
    .m-drawer-mask {
        background-color: transparent;
    }
    .m-drawer-container-content {
        width: 100%;
        padding: 16px 0px 16px 20px;
    }
}
.sys-drawer-loading-container {
    display: flex;
    flex-direction: column;
    row-gap: 24px;
}
</style>
