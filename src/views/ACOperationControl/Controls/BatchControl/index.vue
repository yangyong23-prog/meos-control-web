<template>
    <m-scrollbar v-if="list.length" class="batch-control-container">
        <template v-for="item in list" :key="item.templateTypeId">
            <div
                v-if="manualAutoSetOrequipSwitchSet(item.relInfoCodeConfigs)?.length || noManualAutoSetOrequipSwitchSet(item.relInfoCodeConfigs)?.length"
                class="batch-control-list"
            >
                <div class="list-item-title fw700">{{ item.templateTypeName }}</div>
                <ControlItem
                    v-for="value in manualAutoSetOrequipSwitchSet(item.relInfoCodeConfigs)"
                    :key="value.infoCode"
                    :data="value"
                    :equipments="item.equipments"
                    @click="openControlForm"
                />
                <m-collapse v-if="noManualAutoSetOrequipSwitchSet(item.relInfoCodeConfigs)?.length" v-model="item.collapse" :hover-style="false">
                    <m-collapse-item id="1">
                        <template #title="{ isActive }">
                            <div class="fc collapse-btn" style="color: var(--blue-500)">
                                {{ isActive ? i18n.global.t('meos_control_web.collapse_config') : i18n.global.t('meos_control_web.expand_config') }}
                                <IconMeriComponentChevronDown color="var(--blue-500)" />
                            </div>
                        </template>
                        <template #icon>
                            <span></span>
                        </template>
                        <ControlItem
                            v-for="value in noManualAutoSetOrequipSwitchSet(item.relInfoCodeConfigs)"
                            :key="value.infoCode"
                            :equipments="item.equipments"
                            :data="value"
                            @click="openControlForm"
                        />
                    </m-collapse-item>
                </m-collapse>
            </div>
        </template>
    </m-scrollbar>
    <div v-else-if="loadingBatchList" class="h100" style="padding: 16px">
        <m-list-skeleton />
    </div>
    <div v-else class="h100 fcc">
        <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
    </div>
    <ControlForm
        v-model="isOpenControlForm"
        width="320px"
        placement="top"
        :virtual-ref="virtualControlFormRef"
        :form-list="controlFormFormList"
        @submit="handleSubmit"
        @close="closeForm"
    />
    <ErrorList v-if="showErrorList" :error-list="errorList" @close="showErrorList = false" />
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown } from 'meri-icon';
import ControlItem from './ControlItem.vue';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import ErrorList from '@/components/ObjectInfoComponents/Other/ErrorList.vue';
import { useControlHook } from './useControlHook';
import { IOT_RUNNING, IOT_SETTING } from '@/utils/globalVariables';
const { isOpenControlForm, virtualControlFormRef, controlFormFormList, showErrorList, errorList, handleSubmit, closeForm, openControlForm } = useControlHook();
const props = defineProps({
    batchList: {
        type: Array,
        default: () => []
    },
    floorId: {
        type: String,
        default: ''
    },
    loadingBatchList: {
        type: Boolean,
        default: false
    }
});
const manualAutoSetOrequipSwitchSet = arr => {
    return arr.filter(item => {
        if (item.infoCodeType === IOT_RUNNING) {
            const info = item?.relInfoCodeConfigs?.[0] || {};
            return info.infoCode === 'manualAutoSet' || info.infoCode === 'equipSwitchSet';
        }
        return item.infoCode === 'manualAutoSet' || item.infoCode === 'equipSwitchSet';
    });
};
const noManualAutoSetOrequipSwitchSet = arr => {
    return arr.filter(item => {
        if (item.infoCodeType === IOT_RUNNING) {
            const info = item?.relInfoCodeConfigs?.[0] || {};
            return info.infoCode !== 'manualAutoSet' && info.infoCode !== 'equipSwitchSet' && item?.relInfoCodeConfigs?.length;
        }
        if (item.infoCodeType === IOT_SETTING) {
            return item.infoCode !== 'manualAutoStatus' && item.infoCode !== 'runStatus' && item.infoCode !== 'manualAutoSet' && item.infoCode !== 'equipSwitchSet';
        }
        return (
            item.infoCode !== 'manualAutoStatus' &&
            item.infoCode !== 'runStatus' &&
            item.infoCode !== 'manualAutoSet' &&
            item.infoCode !== 'equipSwitchSet' &&
            item?.relInfoCodeConfigs?.length
        );
    });
};
const getEquipments = equipments => {
    if (!props.floorId) return equipments;
    return equipments.filter(item => item.floorId === props.floorId);
};
const list = computed(() => {
    return props.batchList.map(item => ({ ...item, equipments: getEquipments(item.equipments) })).filter(item => item.equipments.length > 0);
});
</script>
<style lang="less" scoped>
.batch-control-container {
    :deep(.m-scrollbar__content) {
        padding: 16px;
        .batch-control-list {
            padding: 0 12px;
            border-radius: 8px;
            background-color: #f1f4f6;
            & + .batch-control-list {
                margin-top: 8px;
            }
            .list-item-title {
                height: 38px;
                padding: 12px 0 8px 0;
                -webkit-font-smoothing: antialiased;
                -webkit-font-smoothing: none;
            }
            .m-collapse {
                border-top: 1px solid var(--gray-300);
            }
            .m-collapse-item__header {
                padding-left: 0;
                svg {
                    transition: all 0.3s ease;
                }
                &.is-active {
                    border-bottom: 1px solid var(--gray-300);
                }
            }
            .is-active.m-collapse-item__header {
                svg {
                    transform: rotate(-180deg);
                }
            }
        }
        .collapse-btn {
            border-radius: 4px;
            padding: 4px;
            &:hover {
                background-color: var(--alpha-30);
            }
        }
    }
}
</style>
