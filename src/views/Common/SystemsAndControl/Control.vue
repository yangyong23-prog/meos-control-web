<template>
    <div class="control">
        <div class="control-header fcb">
            <div class="control-header-left">
                <div v-if="tabs.length === 1" class="fw600 fs16 mb12 mt12">
                    {{ currentConsoleType?.name }}
                </div>
                <m-tabs v-if="tabs.length > 1" v-model="value" size="large" :data="tabs" scroll-position="end" style="margin-left: -12px" @change="changeConsoleTypes" />
            </div>
            <div class="control-header-right">
                <div class="fcc right-btn-group" style="gap: 8px">
                    <m-button v-if="currentConsoleType?.timeTableName" type="link" size="medium" @click="openTimeTable(currentConsoleType)">{{
                        currentConsoleType?.timeTableName
                    }}</m-button>
                    <div v-if="currentConsoleType?.timeTableName" style="background-color: var(--gray-300); width: 1px; height: 14px"></div>
                    <m-button
                        type="icon"
                        icon="IconMeriActionSetting"
                        :title="i18n.global.t('meos_control_web.system_settings')"
                        size="medium"
                        show-tip
                        style="position: relative; z-index: 2"
                        @click="openSystemSet()"
                    ></m-button>
                </div>
            </div>
        </div>

        <div class="control-main">
            <template v-if="!currentConsoleType?.isAir">
                <div v-for="groupData in controlTree" :key="groupData.groupKey" class="control-group">
                    <ControlItem
                        v-for="item in groupData.list"
                        :key="item.infoCode"
                        :data="item"
                        :class="item.infoCode"
                        :system-id="systemId"
                        :console-types="value"
                        :system-class-code="systemClassCode"
                    >
                        <template #default="{ manualAutoSetData }">
                            <component
                                :is="useComponent?.(item.infoCode)"
                                :id="systemId"
                                v-bind="disabledFun(item)"
                                :data="item"
                                :active-set-form-data="currentData || {}"
                                :manual-auto-set-data="manualAutoSetData"
                                :system-id="systemId"
                                :console-types="value"
                                :system-class-code="systemClassCode"
                                :show-control-intervention-time="showControlInterventionTime"
                                :switch-is-lock="currentConsoleType?.code?.includes(item.infoCode) ? false : switchIsLock"
                                :console-is-close="currentConsoleType?.code?.includes(item.infoCode) ? false : consoleIsClose"
                                @open-set-form="(e: HTMLElement) => openSetForm(e, item)"
                                @show-plan-list="showPlanList"
                            >
                                <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                                    <slot :name="slotName" v-bind="{ ...slotProps, item, manualAutoSetData }" />
                                </template>
                            </component>
                        </template>
                    </ControlItem>
                </div>
            </template>
            <template v-else>
                <AirBox
                    :control-list-data="currentConsoleType?.controlList || []"
                    :active-set-form-data="currentData || {}"
                    :system-id="systemId"
                    :console-types="value"
                    :system-class-code="systemClassCode"
                    :use-component="useComponent"
                    :relation-chart-component="relationChartComponent"
                    :show-control-intervention-time="showControlInterventionTime"
                    @open-set-form="openSetForm"
                    @show-plan-list="showPlanList"
                    @open-space-list="openSpaceList"
                />
            </template>
        </div>
        <ControlForm
            ref="ControlFormRef"
            v-model="isOpen"
            width="370px"
            :system-id="systemId"
            :virtual-ref="(virtualRef as any)"
            :form-list="formList"
            :relate-form-list="relateFormList"
            @submit="handleSubmit"
            @hide="closeForm"
            @close="closeForm"
        />
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ControlProps } from './types/props';
import { ConsoleType, ConsoleTypeMap } from './types';
import ControlItem from './components/control/ControlItem.vue';
import AirBox from './components/control/AirBox.vue';
import { ControlListItem } from './types/control';
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { isLock } from './utils';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import { useControlFormPop } from './hooks/useControlFormPop';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
const props = withDefaults(defineProps<ControlProps>(), {
    showControlInterventionTime: true
});
const { getIotData } = DockSingleton.getInstance();
type ControlTreeGroup = {
    groupKey: number;
    list: ControlListItem[];
};
const tabs = computed(() => {
    return props.consoleTypesData?.filter(item => item.controlList?.length && item.show) || [];
});
const controlTree = computed<ControlTreeGroup[]>(() => {
    const controlList = props.currentConsoleType?.controlList || [];
    const groupKeyMap = props.groupKeyMap || {};
    const grouped = new Map<number, ControlListItem[]>();

    controlList.forEach(item => {
        const key = groupKeyMap[item.infoCode] ?? Number.MAX_SAFE_INTEGER;
        const list = grouped.get(key);
        if (list) {
            list.push(item);
        } else {
            grouped.set(key, [item]);
        }
    });

    return [...grouped.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([groupKey, list]) => ({
            groupKey,
            list
        }));
});
const value = defineModel({
    type: String as PropType<keyof ConsoleTypeMap>,
    default: ''
});
const { isOpen, currentData, formList, virtualRef, relateFormList, ControlFormRef, openSetForm, handleSubmit, closeForm } = useControlFormPop(props);
const changeConsoleTypes = (data: ConsoleType) => {
    value.value = data.id;
};
const disabledFun = (item: ControlListItem) => {
    const closeDisabledText = i18n.global.t('meos_control_web.name_cannot_operate', {
        name: props.currentConsoleType?.name
    });
    const lockDisabledText = item.infoCodeName + i18n.global.t('meos_control_web.locked_cannot_modify');

    // 1. 控制台关闭时，除当前控制台 code 对应信息点外均不可操作
    if (props.consoleIsClose && item.infoCode !== props.currentConsoleType?.code) {
        return {
            disabled: true,
            disabledText: closeDisabledText
        };
    }
    // 2. 信息点锁定时展示锁定提示
    const lock = getIotData(props.systemId, item.lockStatus?.infoCode);
    if (isLock(lock)) {
        return {
            disabled: true,
            disabledText: lockDisabledText
        };
    }
    //3. 当currentConsoleType.lockStatusCode锁定时，控制台界面中控制参数的实际值正常显示，设定值均显示--，修改操作均置灰
    if (switchIsLock.value) {
        return {
            disabled: true,
            disabledText: props.currentConsoleType?.lockTip
        };
    }
    return {
        disabled: false,
        disabledText: ''
    };
};
const switchIsLock = computed(() => {
    if (!props.currentConsoleType?.lockStatusCode) {
        return false;
    }
    const obj = getIotData(props.systemId, props.currentConsoleType.lockStatusCode);
    if (!obj?.lockStatus?.infoCode) {
        return false;
    }
    const lockAll = getIotData(props.systemId, obj.lockStatus.infoCode);
    return isLock(lockAll);
});

useWatchWithCleanup(
    () => value.value,
    () => {
        currentData.value = undefined;
    }
);
useWatchWithCleanup(
    () => props.showSystemSet,
    () => {
        closeForm();
    }
);
useWatchWithCleanup(
    () => props.systemId,
    () => {
        closeForm();
    }
);
defineExpose({
    openSetForm,
    closeForm
});
</script>
<style lang="less" scoped>
.control {
    &-header {
        margin-bottom: 12px;
        border-bottom: 1px solid var(--gray-200);
    }
    &-group {
        border-radius: 8px;
        background-color: var(--gray-50);
        & + & {
            margin-top: 8px;
        }
    }
}
</style>
