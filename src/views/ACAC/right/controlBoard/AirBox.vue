<template>
    <div class="air-box">
        <m-collapse v-model="collapseData" :hover-style="false" only-icon-click>
            <m-collapse-item v-for="item in controlListData" :id="item.id" :key="item.id" :title="item.switchSetInfoCodeName" :class="item.isCommonGroup ? 'common-group' : ''">
                <template #title>
                    <div class="w100">
                        <ControlItem :key="item.infoCode" :data="item" :class="item.infoCode">
                            <component
                                :is="CONTROL_CONFIG_FUN(item).component"
                                :has-actual="false"
                                :data="item"
                                has-icon
                                :active-set-form-data="activeSetFormData"
                                @open-set-form="e => openSetForm(e, item)"
                                @show-plan-list="showPlanList"
                            />
                        </ControlItem>
                    </div>
                </template>
                <template #icon="{ isActive, click }">
                    <span
                        class="m-collapse-item__header-icon"
                        :class="{ 'is-active': isActive }"
                        style="margin: 0; position: absolute; right: 12px; top: 12px; cursor: pointer"
                        @click="click"
                    >
                        <IconMeriComponentChevronDown />
                    </span>
                </template>
                <div class="collapse-main" :class="item.isCommonGroup ? 'has-common-group' : ''" @mouseenter="mouseShow(item)" @mouseleave="mouseHide">
                    <template v-if="item.isCommonGroup">
                        <ControlItem v-for="value in item.pumpGroupInfoCodes" :key="value.infoCode" :data="value" :no-bg="true">
                            <component
                                :is="CONTROL_CONFIG_FUN(value).component"
                                :data="value"
                                v-bind="{ ...disabledFun(item, i18n.global.t('meos_control_web.pump_group_off_cannot_operate')) }"
                                :active-set-form-data="activeSetFormData"
                                @open-set-form="e => openSetForm(e, value)"
                            />
                        </ControlItem>
                    </template>
                    <template v-else>
                        <div v-for="group in item.pumpGroups" :key="group.pumpGroupId" class="air-box-group" @mouseenter="mouseShow(group)" @mouseleave="mouseHide">
                            <div class="group-name">{{ group.pumpGroupName }}</div>
                            <ControlItem v-for="value in group.pumpGroupInfoCodes" :key="value.infoCode" :data="value" :no-bg="true">
                                <component
                                    :is="CONTROL_CONFIG_FUN(value).component"
                                    :active-set-form-data="activeSetFormData"
                                    :data="value"
                                    v-bind="{ ...disabledFun(item) }"
                                    @open-set-form="e => openSetForm(e, value)"
                                />
                            </ControlItem>
                        </div>
                    </template>
                </div>
            </m-collapse-item>
        </m-collapse>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { CONTROL_CONFIG_FUN } from '../../hooks/config';
import ControlItem from '@/views/ACAC/components/control/ControlItem.vue';
import { IconMeriComponentChevronDown } from 'meri-icon';
import DockSingleton from '@/hooks/responsiveDock';
import { showPlanListKey } from '../../hooks/useRightHook';
import { relationChartComponentKey } from '../../hooks/useBaseHook';
const props = defineProps({
    controlListData: {
        type: Array,
        default: () => []
    },
    activeSetFormData: {
        type: Object,
        default: () => ({})
    }
});
const { getIotData } = DockSingleton.getInstance();
const collapseData = ref([]);
collapseData.value = props.controlListData.map(item => {
    return item.id;
});
const showPlanList = inject(showPlanListKey);
const timer = ref(null);
const relationChartComponent = inject(relationChartComponentKey);
const emit = defineEmits(['openSetForm']);
const openSetForm = (...args) => {
    emit('openSetForm', ...args);
};
const disabledFun = (item, text) => {
    if (getIotData(item.id, item.infoCode).dataValue === '0') {
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
const mouseShow = item => {
    const arr = [];
    const id = item.pumpGroupId || item.id;
    clearTimeout(timer.value);
    arr.push(id);
    const equipGroups = relationChartComponent.value?.getEquipsByInGroup(id);
    if (equipGroups) {
        arr.push(...equipGroups.map(equip => equip.id));
    }
    timer.value = setTimeout(() => {
        relationChartComponent.value?.shakeName(arr);
    }, 500);
};
const mouseHide = () => {
    clearTimeout(timer.value);
    timer.value = null;
    relationChartComponent.value?.clearShakeName();
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
            &:hover {
                border: 1px solid var(--blue-500);
            }
        }
        :deep(.control-item) {
            border-radius: 0;
            padding: 8px;
            & + .control-item {
                margin-top: 0;
                border-top: 1px solid var(--gray-200);
            }
        }
    }
    .m-collapse-item__header-icon.is-active svg {
        transform: rotate(180deg);
    }
}
</style>
