<template>
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="show"
        :title="i18n.global.t('meos_control_web.system_parameter_setting')"
        :shadow="false"
        :shadow-click="false"
        width="480px"
        :drawer-class="`system-drawer noIframe ${String(route.name || '')}`"
        :z-index="Z_INDEX.commonDrawer"
        @close="close"
    >
        <template #content>
            <m-scrollbar :content-class="'sys-drawer-loading-container'" style="padding-right: 20px">
                <SystemParamsSet
                    ref="SystemParamsSetRef"
                    :system-id="systemId"
                    :loading="loadingSystemParamsSet"
                    :special-info-codes="normalizedSpecialInfoCodes"
                    :handle-special-info-codes="handleSpecialInfoCodes"
                    :handle-special-submit-fn="handleSpecialSubmitFn"
                    v-bind="systemParamsSetProps as any || {}"
                    @load-finally="loadingSystemParamsSet = false"
                >
                    <template v-for="infoCode in normalizedSpecialInfoCodes" :key="infoCode" #[infoCode]="{ data, getInfoData }">
                        <slot :name="infoCode" :data="data" :get-info-data="getInfoData">
                            <span style="margin-right: 4px">
                                <span class="value-text" style="margin-right: 4px; font-size: 16px; font-family: 'Microsoft YaHei'">
                                    {{ handleSpecialInfoCodeValue(data) }}
                                </span>
                                <span class="value-unit">{{ data?.unit }}</span>
                            </span>
                        </slot>
                    </template>
                    <template v-for="infoCode in normalizedSpecialInfoCodes" #[`${infoCode}Tag`]="slotProps">
                        <slot :name="`${infoCode}Tag`" v-bind="slotProps" />
                    </template>
                </SystemParamsSet>
                <div class="group">
                    <div class="params-set-title fc">{{ i18n.global.t('meos_control_web.manual_auto_settings') }}</div>
                    <SystemAutoSet class="content" :running-monitor-type="runningMonitorType" :system-id="systemId" v-bind="systemAutoSetProps" />
                </div>
                <div class="group">
                    <div class="params-set-title fc mb4">{{ i18n.global.t('meos_control_web.auto_control_cum_runtime_reset') }}</div>
                    <AutomaticReset
                        :running-monitor-type="runningMonitorType"
                        :system-id="systemId"
                        :system-class-code="systemClassCode"
                        @load-finally="loadingAutomaticReset = false"
                    />
                </div>
                <DisabilityAlarmReset
                    v-if="disabilityAlarmReset?.groupCode && currentSystem"
                    class="mt12"
                    :data="disabilityAlarmReset"
                    :system-data="{ systemId: systemId!, classCode: systemClassCode, localName: currentSystem.localName! }"
                />
            </m-scrollbar>
        </template>
    </m-drawer>
</template>

<script setup lang="ts">
import { Z_INDEX } from '@/constants/zIndex';
import i18n from '@/localization';
import SystemAutoSet from '@/components/systemInfo/SystemAutoSet/SystemAutoSet.vue';
import AutomaticReset from '@/components/systemInfo/AutomaticReset/AutomaticReset.vue';
import SystemParamsSet from '@/components/systemInfo/SystemParams/index.vue';
import useLoading from '@/hooks/useLoading';
import { SystemSetProps } from '../types/props';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import DisabilityAlarmReset from '@/components/systemInfo/DisabilityAlarmReset/index.vue';
import { COOLING_CODE, HEATING_CODE } from '@/utils/globalVariables';
import { Ref } from 'vue';
import DockSingleton from '@/hooks/responsiveDock';
import { useRoute } from 'vue-router';
import { buildSystemParamsSpecialInfoCodeForm, submitSystemParamsSpecialInfoCode } from '../utils';
const route = useRoute();
const { getCustomInfo, getIotData } = DockSingleton.getInstance();

const props = withDefaults(defineProps<SystemSetProps>(), {
    systemId: '',
    systemClassCode: ''
});
const normalizedSpecialInfoCodes = computed<string[]>(() => {
    const specialInfoCodes = props.systemParamsSetProps?.specialInfoCodes;
    if (!Array.isArray(specialInfoCodes)) {
        return [];
    }
    return specialInfoCodes.map(item => (typeof item === 'string' ? item : item?.infoCode)).filter(item => typeof item === 'string' && item.length > 0) as string[];
});
const loadingAutomaticReset = ref(true);
const loadingSystemParamsSet = ref(true);
const SystemParamsSetRef = ref<InstanceType<typeof SystemParamsSet> | null>(null);
const show = ref(false);
const emits = defineEmits(['close', 'cancel']);
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
const handleSpecialInfoCodes = (value: { dataValue: { [key: string]: string | number }; infoCode: any; infoCodeName: any }, list: Ref<any[]>, relateFormList: Ref<any[]>) => {
    if (props.systemParamsSetProps?.handleSpecialInfoCodesFn) {
        props.systemParamsSetProps.handleSpecialInfoCodesFn(value, list, relateFormList);
        return;
    }
    buildSystemParamsSpecialInfoCodeForm({
        value,
        list,
        relateFormList,
        specialInfoCodeKey: props.systemParamsSetProps?.specialInfoCodeKey,
        dataSource: props.handleSpecialInfoCodesDataSourcesFn?.(value.infoCode) ?? undefined
    });
};
const handleSpecialSubmitFn = (data: { [x: string]: any; manualAutoSet: any }, currentData: { infoCode: string | number; infoCodeType: any }, cb: () => void) => {
    if (props.systemParamsSetProps?.handleSpecialSubmitFn) {
        props.systemParamsSetProps.handleSpecialSubmitFn(data, currentData, cb, () => {
            SystemParamsSetRef.value?.getTemplateInfoCodes();
        });
        return;
    }
    submitSystemParamsSpecialInfoCode({
        data,
        currentData,
        systemId: props.systemId,
        systemClassCode: props.systemClassCode,
        specialInfoCodeKey: props.systemParamsSetProps?.specialInfoCodeKey,
        getCustomInfo,
        onSuccess: () => {
            SystemParamsSetRef.value?.getTemplateInfoCodes();
        },
        onFinally: cb
    });
};
const handleSpecialInfoCodeValue = (data: any) => {
    if (props.systemParamsSetProps?.specialInfoCodeKey?.[data.infoCode]) {
        const dataValue = data?.dataValue?.[props.systemParamsSetProps?.specialInfoCodeKey?.[data.infoCode]];
        const obj = getIotData(props.systemId, data.infoCode);
        if (obj?.dataSources?.length) {
            return obj.dataSources.find((item: { code: string }) => item.code === dataValue)?.name || '--';
        }
        if (dataValue === COOLING_CODE) {
            return i18n.global.t('meos_control_web.cooling');
        } else if (dataValue === HEATING_CODE) {
            return i18n.global.t('meos_control_web.heating');
        }
        return '--';
    }
    return '--';
};
onMounted(() => {
    show.value = true;
    nextTick(() => {
        openLoading();
    });
});
useWatchWithCleanup(
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
    gap: 24px;
}
</style>
