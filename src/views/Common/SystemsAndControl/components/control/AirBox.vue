<template>
    <div class="air-box">
        <m-collapse v-model="collapseData" :hover-style="false" only-icon-click>
            <m-collapse-item
                v-for="item in controlListData"
                :id="item.id"
                :key="item.id"
                :title="item.switchSetInfoCodeName"
                :class="item.isCommonGroup ? 'common-group' : ''"
                @mouseenter="item.isCommonGroup && mouseShow(item)"
                @mouseleave="item.isCommonGroup && mouseHide"
            >
                <template #title>
                    <div class="w100">
                        <ControlItem
                            :key="item.infoCode"
                            :data="item"
                            :class="item.infoCode"
                            :system-id="systemId"
                            :console-types="consoleTypes"
                            :system-class-code="systemClassCode"
                        >
                            <component
                                :is="resolveComponent(item.infoCode)"
                                :has-actual="false"
                                :data="item"
                                has-icon
                                :active-set-form-data="activeSetFormData"
                                :system-id="systemId"
                                :console-types="consoleTypes"
                                :system-class-code="systemClassCode"
                                :show-control-intervention-time="showControlInterventionTime"
                                @open-set-form="handleOpenSetForm($event, item)"
                                @show-plan-list="emit(AirBoxEvent.ShowPlanList, item)"
                                @open-space-list="
                                    emit(AirBoxEvent.OpenSpaceList, { airTerminalZoneId: item.airTerminalZoneId ?? '', airTerminalZoneName: item.airTerminalZoneName ?? '' })
                                "
                            />
                        </ControlItem>
                    </div>
                </template>
                <template #icon="{ isActive, click }">
                    <span
                        class="m-collapse-item__header-icon"
                        :class="{ 'is-active': isActive }"
                        style="margin: 0; position: absolute; right: 12px; top: 8px; cursor: pointer"
                        @click="click"
                    >
                        <IconMeriComponentChevronDown />
                    </span>
                </template>
                <div class="collapse-main" :class="item.isCommonGroup ? 'has-common-group' : ''">
                    <template v-if="item.isCommonGroup">
                        <ControlItem
                            v-for="value in item.pumpGroupInfoCodes"
                            :key="value.infoCode"
                            :data="value"
                            :no-bg="true"
                            :system-id="systemId"
                            :console-types="consoleTypes"
                            :system-class-code="systemClassCode"
                        >
                            <component
                                :is="resolveComponent(value.infoCode)"
                                :data="value"
                                v-bind="{ ...disabledFun(item, i18n.global.t('meos_control_web.pump_group_off_cannot_operate')) }"
                                :active-set-form-data="activeSetFormData"
                                :system-id="systemId"
                                :show-control-intervention-time="showControlInterventionTime"
                                :console-types="consoleTypes"
                                :system-class-code="systemClassCode"
                                :console-is-close="consoleIsClose(item)"
                                @open-set-form="handleOpenSetForm($event, value)"
                                @show-plan-list="emit(AirBoxEvent.ShowPlanList, item)"
                                @open-space-list="
                                    emit(AirBoxEvent.OpenSpaceList, { airTerminalZoneId: item.airTerminalZoneId ?? '', airTerminalZoneName: item.airTerminalZoneName ?? '' })
                                "
                            />
                        </ControlItem>
                    </template>
                    <template v-else>
                        <div v-for="group in item.pumpGroups" :key="group.pumpGroupId" class="air-box-group" @mouseenter="mouseShow(group)" @mouseleave="mouseHide">
                            <div class="group-name">{{ group.pumpGroupName }}</div>
                            <ControlItem
                                v-for="value in group.pumpGroupInfoCodes"
                                :key="value.infoCode"
                                :data="value"
                                :no-bg="true"
                                :system-id="systemId"
                                :console-types="consoleTypes"
                                :system-class-code="systemClassCode"
                            >
                                <component
                                    :is="resolveComponent(value.infoCode)"
                                    :active-set-form-data="activeSetFormData"
                                    :data="value"
                                    :system-id="systemId"
                                    :console-types="consoleTypes"
                                    :system-class-code="systemClassCode"
                                    :show-control-intervention-time="showControlInterventionTime"
                                    :console-is-close="consoleIsClose(item)"
                                    v-bind="{ ...disabledFun(item) }"
                                    @open-set-form="handleOpenSetForm($event, value)"
                                    @show-plan-list="emit(AirBoxEvent.ShowPlanList, item)"
                                    @open-space-list="
                                        emit(AirBoxEvent.OpenSpaceList, { airTerminalZoneId: item.airTerminalZoneId ?? '', airTerminalZoneName: item.airTerminalZoneName ?? '' })
                                    "
                                />
                            </ControlItem>
                        </div>
                    </template>
                </div>
            </m-collapse-item>
        </m-collapse>
    </div>
</template>

<script setup lang="ts">
import i18n from '@/localization';
import ControlItem from './ControlItem.vue';
import { IconMeriComponentChevronDown } from 'meri-icon';
import DockSingleton from '@/hooks/responsiveDock';
import { computed, ref } from 'vue';
import type { AirBoxHoverItem, AirBoxProps } from '../../types/props';
import type { ControlListItem } from '../../types/control';
import { AirBoxEvent, AirBoxEmits } from '../../types/emits';
import { CONSOLEIS_CLOSE } from '../../constant';

const props = withDefaults(defineProps<AirBoxProps>(), {
    controlListData: () => [],
    activeSetFormData: () => ({}),
    relationChartComponent: () => ({}),
    systemId: '',
    systemClassCode: '',
    consoleTypes: '',
    useComponent: undefined,
    showControlInterventionTime: true
});
const { getIotData } = DockSingleton.getInstance();
const collapseData = computed<string[]>(() => props.controlListData.map(item => item.id));
const timer = ref<ReturnType<typeof setTimeout> | null>(null);
const emit = defineEmits<AirBoxEmits>();
const openSetForm = (...args: any[]) => {
    emit(AirBoxEvent.OpenSetForm, ...args);
};
const handleOpenSetForm = (event: any, item: ControlListItem) => {
    openSetForm(event, item);
};
const resolveComponent = (infoCode: string) => props.useComponent?.(infoCode) || 'div';
const disabledFun = (item: ControlListItem, text?: string) => {
    if (getIotData(item.id, item.infoCode)?.dataValue === '0') {
        return {
            disabled: true,
            disabledText: text || i18n.global.t('meos_control_web.hvac_zone_not_operable_when_off'),
            disabledNoValue: true
        };
    }
    return {
        disabled: false,
        disabledText: ''
    };
};
const mouseShow = (item: AirBoxHoverItem) => {
    const arr: string[] = [];
    const { id } = item;
    if (!id) {
        return;
    }
    if (timer.value) {
        clearTimeout(timer.value);
    }
    arr.push(id);
    const equipGroups = props.relationChartComponent?.getEquipsByInGroup?.(id);
    if (equipGroups) {
        arr.push(...equipGroups.map(equip => equip.id));
    }
    timer.value = setTimeout(() => {
        props.relationChartComponent?.shakeName?.(arr);
    }, 500);
};
const mouseHide = () => {
    if (timer.value) {
        clearTimeout(timer.value);
    }
    timer.value = null;
    props.relationChartComponent?.clearShakeName?.();
};
const consoleIsClose = (item: { infoCode: any; id: any }) => {
    if (item?.infoCode) {
        return getIotData(item.id, item.infoCode)?.dataValue === CONSOLEIS_CLOSE ? true : false;
    }
    return false;
};
</script>

<style scoped lang="less">
.air-box {
    :deep(.m-collapse-item) {
        position: relative;
        background-color: var(--gray-100);
        border-radius: 8px;
        .m-collapse-item__header {
            cursor: default;
            padding: 0;
        }
        & + .m-collapse-item {
            margin-top: 8px;
        }
        &:has(.has-common-group) {
            background-color: #e9f0f8;
            .control-item {
                background-color: transparent;
            }
        }
        &.common-group {
            border: 1px solid var(--gray-0);
            &:hover {
                border: 1px solid var(--blue-500);
            }
        }
    }

    .collapse-main {
        background-color: var(--gray-0);
        border-radius: 8px;
        margin: 8px;
        &.has-common-group {
            padding: 0 8px;
        }
        .group-name {
            padding: 8px 0;
        }
        .air-box-group {
            border-radius: 8px;
            border: 1px solid var(--gray-0);
            padding: 0 8px;
            position: relative;
            &:hover {
                border: 1px solid var(--blue-500);
            }
            & + .air-box-group {
            }
        }
        :deep(.control-item) {
            border-radius: 0;
            padding: 8px;
            & + .control-item {
                margin-top: 0;
            }
        }
    }
    .m-collapse-item__header-icon.is-active svg {
        transform: rotate(180deg);
    }
}
</style>
