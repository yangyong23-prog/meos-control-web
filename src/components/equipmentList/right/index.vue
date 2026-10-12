<template>
    <div class="equipment-list-right wh100">
        <SearchHeader></SearchHeader>

        <TableList
            :table-data="tableData"
            :refresh-table-key="refreshTableKey"
            :columns="columns"
            :pagination-data="paginationData"
            :select-equip-id="selectEquipId"
            :has-equipment-info="hasEquipmentInfo"
            @click-equip="handleClickEquip"
        />
        <ControlForm
            v-model="isOpenControlForm"
            width="320px"
            placement="top"
            :virtual-ref="virtualControlFormRef"
            :form-list="controlFormFormList"
            @submit="handleSubmit"
            @close="closeForm"
        />
        <m-popover virtual-triggering :virtual-ref="recoveryDateTimeDom" theme="darkTransparent" trigger="manually" :is-open="isOpenrecoveryDateTime" :show-arrow="false">
            <template #content>
                {{
                    i18n.global.t('meos_control_web.deadline_to', {
                        time: dayjs(recoveryDateTimeInfoCode?.additionalMapValue?.recoveryDateTime).format('YYYY.MM.DD HH:mm')
                    })
                }}
            </template>
        </m-popover>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useTableDataHook } from '../hooks/useTableDataHook';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import { useControlHook } from '../hooks/useControlHook';
import SearchHeader from './components/search.vue';
import TableList from './TableList.vue';
import dayjs from 'dayjs';
const props = defineProps({
    floorId: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
    },
    classCode: {
        type: String,
        default: ''
    },
    filter: {
        type: Object,
        default: () => ({})
    },
    selectEquipId: {
        type: String,
        default: ''
    },
    hasEquipmentInfo: {
        type: Boolean,
        default: true
    },
    filterInSystemIds: {
        type: Array,
        default: () => []
    },
    manualAutoSetControl: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['click-equip']);

const { isOpenControlForm, virtualControlFormRef, controlFormFormList, handleSubmit, closeForm } = useControlHook(props);

const { tableData, columns, paginationData, isOpenHeaderSet, refreshTableKey, isOpenrecoveryDateTime, recoveryDateTimeDom, recoveryDateTimeInfoCode } = useTableDataHook(props);
const handleClickEquip = row => {
    emits('click-equip', row);
};
watch(
    () => isOpenHeaderSet.value,
    val => {
        if (val) {
            closeForm();
        }
    }
);
watch(
    () => tableData.value,
    () => {
        closeForm();
    }
);
</script>
<style lang="less" scoped>
.equipment-list-right {
    position: relative;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
    :deep(.meri-table-body-tr) {
        &.meri-table-body-tr-active:hover .meri-table-element-td {
            background-color: var(--blue-100) !important;
        }
    }
    :deep(.meri-table-element-td) {
        padding: 0;
        height: var(--line-height);
        .meri-table-body-cell {
            height: 100%;
        }
    }
}
</style>
