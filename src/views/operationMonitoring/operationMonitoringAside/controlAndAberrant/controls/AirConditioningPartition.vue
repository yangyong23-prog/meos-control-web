<template>
    <div class="air-conditioning-partition" :class="{ 'is-cloud': !isEdge() }">
        <m-list-skeleton v-if="loading" />
        <m-illustration v-else-if="!controlListData.length" :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        <m-collapse v-else v-model="collapseData" :hover-style="false" only-icon-click>
            <m-collapse-item v-for="item in controlListData" :id="item.id" :key="item.id" :title="item.switchSetInfoCodeName" :class="item.isCommonGroup ? 'common-group' : ''">
                <template #title>
                    <div class="w100">
                        <ControlItem :key="item.infoCode" :data="item" :class="item.infoCode" :system-id="systemId" :console-types="CONSOLE_TYPE" :system-type="SYSTEM_TYPE">
                            <component
                                :is="CONTROL_CONFIG_FUN(item).component"
                                :has-actual="false"
                                :data="item"
                                has-icon
                                :active-set-form-data="activeSetFormData || {}"
                                :system-id="systemId"
                                :console-types="CONSOLE_TYPE"
                                :system-type="SYSTEM_TYPE"
                                @open-set-form="event => openSetForm(event, item)"
                                @show-plan-list="refreshAirConditionControlList"
                                @open-space-list="openAirConditionSpaceList"
                            />
                        </ControlItem>
                    </div>
                </template>
                <template #icon="{ isActive, click }">
                    <span class="m-collapse-item__header-icon" :class="{ 'is-active': isActive }" @click="click">
                        <IconMeriComponentChevronDown />
                    </span>
                </template>
                <div class="collapse-main" :class="item.isCommonGroup ? 'has-common-group' : ''" @mouseenter="mouseShow(item)" @mouseleave="mouseHide">
                    <template v-if="item.isCommonGroup">
                        <ControlItem
                            v-for="value in item.pumpGroupInfoCodes"
                            :key="value.infoCode"
                            :data="value"
                            :no-bg="true"
                            :system-id="systemId"
                            :console-types="CONSOLE_TYPE"
                            :system-type="SYSTEM_TYPE"
                        >
                            <component
                                :is="CONTROL_CONFIG_FUN(value).component"
                                :data="value"
                                v-bind="disabledFun(item, i18n.global.t('meos_control_web.pump_group_off_cannot_operate'))"
                                :active-set-form-data="activeSetFormData || {}"
                                :system-id="systemId"
                                :console-types="CONSOLE_TYPE"
                                :system-type="SYSTEM_TYPE"
                                @open-set-form="event => openSetForm(event, value)"
                                @show-plan-list="refreshAirConditionControlList"
                                @open-space-list="openAirConditionSpaceList"
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
                                :console-types="CONSOLE_TYPE"
                                :system-type="SYSTEM_TYPE"
                            >
                                <component
                                    :is="CONTROL_CONFIG_FUN(value).component"
                                    :data="value"
                                    :active-set-form-data="activeSetFormData || {}"
                                    :system-id="systemId"
                                    :console-types="CONSOLE_TYPE"
                                    :system-type="SYSTEM_TYPE"
                                    v-bind="disabledFun(item)"
                                    @open-set-form="event => openSetForm(event, value)"
                                    @show-plan-list="refreshAirConditionControlList"
                                    @open-space-list="openAirConditionSpaceList"
                                />
                            </ControlItem>
                        </div>
                    </template>
                </div>
            </m-collapse-item>
        </m-collapse>
        <ControlForm
            ref="ControlFormRef"
            v-model="isOpen"
            width="370px"
            :system-id="systemId"
            :virtual-ref="virtualRef || undefined"
            :form-list="formList"
            :relate-form-list="relateFormList"
            @submit="handleSubmit"
            @hide="closeForm"
            @close="closeForm"
        />
    </div>
</template>

<script setup lang="ts">
import ControlItem from '@/components/SystemControl/ControlItem.vue';
import { CONTROL_CONFIG_FUN } from '@/components/SystemControl/config';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import i18n from '@/localization';
import type { ConsoleType } from '@/views/Common/SystemsAndControl/types';
import type { ControlProps } from '@/views/Common/SystemsAndControl/types/props';
import type { ControlListItem, PumpGroup } from '@/views/Common/SystemsAndControl/types/control';
import { IconMeriComponentChevronDown } from 'meri-icon';
import type { Ref } from 'vue';
import { useAirConditionControlForm } from './hooks/useAirConditionControlForm';
import { isEdge } from '@/utils/envUtils';

const SYSTEM_TYPE = 'ACCI';
const CONSOLE_TYPE = 'AIR_TERMINAL_ZONE';
const systemId = inject<Ref<string>>('systemId', ref(''));
const relationChartComponent = inject<Ref<Record<string, any>>>('relationChartComponent', ref({}));
const refreshAirConditionControlList = inject<() => Promise<unknown>>('refreshAirConditionControlList', async () => undefined);
const openAirConditionSpaceList = inject<(data: ControlListItem) => void>('openAirConditionSpaceList', () => undefined);
const { getIotData } = DockSingleton.getInstance();
const controlListData = inject<Ref<ControlListItem[]>>('airConditionControlListData', ref([]));
const loading = inject<Ref<boolean>>('airConditionLoading', ref(false));
const currentConsoleType = computed<ConsoleType>(() => ({
    id: CONSOLE_TYPE,
    name: i18n.global.t('meos_control_web.hvac_zone'),
    timeTableName: i18n.global.t('meos_control_web.zone_schedule'),
    code: ['airConditionDemand'],
    isAir: true,
    lockStatusCode: '',
    hasLockStatuCodes: [],
    noUseDefaultReasonCodes: [],
    show: true,
    reason: {
        default: []
    },
    controlList: controlListData.value
}));
const controlFormProps = reactive({
    currentConsoleType,
    systemId,
    systemClassCode: SYSTEM_TYPE,
    showControlInterventionTime: true
});
const {
    isOpen,
    currentData,
    formList,
    virtualRef,
    relateFormList,
    ControlFormRef,
    openSetForm: openControlForm,
    handleSubmit,
    closeForm
} = useAirConditionControlForm(controlFormProps as unknown as ControlProps);
const activeSetFormData = computed(() => currentData.value || null);
const collapseData = computed(() => controlListData.value.map(item => item.id));
const timer = ref<ReturnType<typeof setTimeout> | null>(null);

const openSetForm = (event: HTMLElement, item: ControlListItem) => {
    openControlForm(event, item);
};

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

const mouseShow = (item: ControlListItem | PumpGroup) => {
    const id = item.id || ('pumpGroupId' in item ? item.pumpGroupId : '');
    if (!id) {
        return;
    }
    if (timer.value) {
        clearTimeout(timer.value);
    }
    const ids = [id];
    const equipGroups = relationChartComponent.value?.getEquipsByInGroup?.(id);
    if (equipGroups) {
        ids.push(...equipGroups.map((equip: { id: string }) => equip.id));
    }
    timer.value = setTimeout(() => {
        relationChartComponent.value?.shakeName?.(ids);
    }, 500);
};

const mouseHide = () => {
    if (timer.value) {
        clearTimeout(timer.value);
    }
    timer.value = null;
    relationChartComponent.value?.clearShakeName?.();
};

onUnmounted(mouseHide);
</script>

<style lang="less" scoped>
.air-conditioning-partition {
    width: 100%;
    min-height: 100%;
    padding-top: 12px;
    :deep(.m-collapse-item) {
        position: relative;
        background-color: var(--gray-100);
        border-radius: 8px;

        .m-collapse-item__header {
            padding: 0;
            cursor: default;
        }

        & + .m-collapse-item {
            margin-top: 8px;
        }

        &:has(.has-common-group) {
            background-color: var(--blue-50, #e9f0f8);

            .control-item {
                background-color: transparent;
            }
        }

        &.common-group {
            border: 1px solid var(--gray-0);

            &:hover {
                border-color: var(--blue-500);
            }
        }
    }

    .m-collapse-item__header-icon {
        position: absolute;
        top: 12px;
        right: 12px;
        margin: 0;
        cursor: pointer;

        &.is-active svg {
            transform: rotate(180deg);
        }
    }

    .collapse-main {
        margin: 8px;
        background-color: var(--gray-0);
        border-radius: 8px;

        &.has-common-group {
            padding: 0 8px;
        }

        .group-name {
            padding: 8px 0;
        }

        .air-box-group {
            position: relative;
            padding: 0 8px;
            border: 1px solid var(--gray-0);
            border-radius: 8px;

            &:hover {
                border-color: var(--blue-500);
            }

            & + .air-box-group::after {
                position: absolute;
                top: 0;
                left: 8px;
                display: block;
                width: calc(100% - 16px);
                height: 1px;
                background: var(--gray-200);
                content: '';
            }
        }

        :deep(.control-item) {
            padding: 8px;
            border-radius: 0;

            & + .control-item {
                margin-top: 0;
                border-top: 1px solid var(--gray-200);
            }
        }
    }

    // 云端仅展示控制数据，隐藏手自动标签和操作入口
    &.is-cloud {
        :deep(.control-item-icon),
        :deep(.switch-control-times),
        :deep(.control-item-time) {
            display: none;
        }

        :deep(.control-item-main) {
            width: 100%;
        }
    }
}
</style>
