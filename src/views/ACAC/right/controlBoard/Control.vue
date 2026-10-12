<template>
    <div class="control-main">
        <div class="control-main-header fcb">
            <div class="left-content">
                <div v-if="consoleTypesTabs.length === 1" class="fw600 fs16">
                    {{ consoleTypesTabs[0].name }}
                </div>
                <m-tabs v-if="consoleTypesTabs.length > 1" v-model="consoleTypes" size="large" :data="consoleTypesTabs" :scroll-position="'end'" style="margin-left: -12px" />
            </div>
            <div class="fcc right-btn-group">
                <m-button type="link" size="medium" @click="openTimeTableFun">{{ CONSOLE_TYPES[consoleTypes].timeTableName }}</m-button>
                <div style="background-color: var(--gray-300); width: 1px; height: 14px"></div>
                <m-button
                    type="icon"
                    icon="IconMeriActionSetting"
                    :content="i18n.global.t('meos_control_web.system_settings')"
                    size="medium"
                    show-tip
                    @click="settingsBtn()"
                ></m-button>
            </div>
        </div>
        <div class="control-main-content">
            <template v-if="consoleTypes === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id">
                <AirBox :control-list-data="controlListData" :active-set-form-data="activeSetFormData" @open-set-form="openSetForm" />
            </template>
            <template v-else>
                <template v-if="!controlListData.length">
                    <Empty :text="i18n.global.t('meos_control_web.no_content')"></Empty>
                </template>
                <ControlItem v-for="item in controlListData" :key="item.infoCode" :data="item" :class="item.infoCode">
                    <template #default="{ manualAutoSetData }">
                        <component
                            :is="CONTROL_CONFIG_FUN(item).component"
                            :id="currentSystem.systemId"
                            v-bind="disabledFun(item)"
                            :data="item"
                            :active-set-form-data="activeSetFormData"
                            :manual-auto-set-data="manualAutoSetData"
                            :no-plan-list="NO_PLAN_LIST.includes(item.infoCode)"
                            @open-set-form="e => openSetForm(e, item)"
                            @show-plan-list="showPlanList"
                        />
                    </template>
                </ControlItem>
            </template>

            <m-popover
                virtual-triggering
                :content="i18n.global.t('meos_control_web.i_am_hint_text')"
                :virtual-ref="setFormBtn"
                trigger="manually"
                :is-open="isOpenSetForm"
                placement="bottom-end"
                style="--m-popover-padding: 0; --m-popover-border-radius: 8px"
                @scroll="closeSetForm"
            >
                <template #content>
                    <SetForm :data="activeSetFormData" :control-list-data="controlListData" @close="closeSetForm" />
                </template>
            </m-popover>
        </div>
        <coldSystemSettings v-if="showSystemInfo" @close="showSystemInfo = false" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { currentSystemKey, isShowTimeTableKey, showSystemInfoKey } from '../../hooks/useBaseHook';
import {
    consoleTypesKey,
    isOpenSetFormKey,
    setFormBtnKey,
    openSetFormKey,
    closeSetFormKey,
    activeSetFormDataKey,
    consoleIsCloseKey,
    showPlanListKey
} from '../../hooks/useRightHook';
import { CONTROL_CONFIG_FUN } from '../../hooks/config';
import ControlItem from '@/views/ACAC/components/control/ControlItem.vue';
import SetForm from '@/views/ACAC/components/setForm/index.vue';
import AirBox from './AirBox.vue';
import coldSystemSettings from './coldSystemSettings/index.vue';
import { CONSOLE_TYPES, COOLING_STORAGE_SWITCH_SET, COOLING_SUPPLY_SWITCH_SET, NO_PLAN_LIST } from '../../variables';
import { isEdge } from '@/utils/envUtils';
import DockSingleton from '@/hooks/responsiveDock';
import { isLockV2 } from '@/components/SystemControl/config';
import Empty from '@/components/common/Empty.vue';

const { getIotData } = DockSingleton.getInstance();
const consoleTypes = inject(consoleTypesKey, ref(''));
const isShowTimeTable = inject(isShowTimeTableKey, ref(false));
const isOpenSetForm = inject(isOpenSetFormKey, ref(false));
const setFormBtn = inject(setFormBtnKey, ref(null));
const activeSetFormData = inject(activeSetFormDataKey, ref(null));
const openSetForm = inject(openSetFormKey);
const showPlanList = inject(showPlanListKey);
const closeSetForm = inject(closeSetFormKey);
const currentSystem = inject(currentSystemKey, ref({}));
const consoleIsClose = inject(consoleIsCloseKey, ref(false));
const showSystemInfo = inject(showSystemInfoKey, ref(false));
const disabledFun = item => {
    let disabledText = item.infoCodeName + i18n.global.t('meos_control_web.locked_cannot_modify');
    if (consoleIsClose.value && item.infoCode !== COOLING_SUPPLY_SWITCH_SET && item.infoCode !== COOLING_STORAGE_SWITCH_SET) {
        disabledText = i18n.global.t('meos_control_web.name_cannot_operate', {
            name: consoleTypes.value === CONSOLE_TYPES.COOL_SUPPLY.id ? i18n.global.t('meos_control_web.cooling_supply1') : i18n.global.t('meos_control_web.thermal_storage_cold')
        });
    }
    if (item.lockStatus) {
        const lock = getIotData(currentSystem.value.systemId, item.lockStatus.infoCode);
        if (isLockV2(lock)) {
            return {
                disabled: true,
                disabledText,
                disabledNoValue: item.infoCode !== COOLING_SUPPLY_SWITCH_SET && item.infoCode !== COOLING_STORAGE_SWITCH_SET && consoleIsClose.value,
                lockDisabled: true
            };
        }
    }
    if (item.infoCode === COOLING_SUPPLY_SWITCH_SET || item.infoCode === COOLING_STORAGE_SWITCH_SET) {
        return {
            disabled: false,
            disabledText: ''
        };
    }
    if (consoleIsClose.value) {
        return {
            disabled: true,
            disabledText,
            disabledNoValue: true
        };
    }
    return {
        disabled: false,
        disabledText: ''
    };
};
const openTimeTableFun = () => {
    isShowTimeTable.value = true;
    currentSystem.value.consoleTypes = consoleTypes.value;
};
const settingsBtn = () => {
    showSystemInfo.value = true;
    closeSetForm();
};
defineProps({
    consoleTypesTabs: {
        type: Array,
        default: () => []
    },
    controlListData: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.control-main-header {
    height: 42px;
    border-bottom: 1px solid var(--gray-200);
    width: 100%;
    overflow: visible;
    .left-content {
        flex: 0 0 calc(100% - 157px);
        min-width: 0;
    }
    .right-btn-group {
        white-space: nowrap;
        display: flex;
        gap: 8px;
    }
}
.control-main-content {
    padding-top: 12px;
}
</style>
