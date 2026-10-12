<template>
    <m-table :columns="columnList" :data-source="renderDataSource" :checkbox="true" class="group-table">
        <template #filterName="row">
            <m-tips :content="i18n.global.t('meos_control_web.view_group_loop')" theme="darkTransparent" placement="right" trigger="hover">
                <div class="group-name multiple-line" @click.stop="previewGroup(row)" v-html="row.filterName"></div>
            </m-tips>
        </template>
        <template #purpose="{ purpose }">
            <span class="multiple-line">{{ purpose }}</span>
        </template>
        <template #ops="row">
            <div class="op-warp">
                <div class="item" :class="{ act: row.settingMode === SMD_ALL_OPEN }" @click="switchMode(row, SMD_ALL_OPEN)">{{ i18n.global.t('meos_control_web.fully_on') }}</div>
                <div class="item" :class="{ act: row.settingMode === SMD_ALL_CLOSE }" @click="switchMode(row, SMD_ALL_CLOSE)">
                    {{ i18n.global.t('meos_control_web.fully_off') }}
                </div>
            </div>
        </template>
        <template #tooltip="{ checkeds }">
            <div class="table-check-tooltips fc">
                <span>
                    {{ i18n.global.t('meos_control_web.already_selected') }}<span class="count-num"> {{ checkeds.length }}</span> {{ i18n.global.t('meos_control_web.project') }}
                </span>
                <div class="btn-groups fc">
                    <m-button width="64" size="small" @click="batchChange(checkeds, SMD_ALL_OPEN)">{{ i18n.global.t('common.status_open') }}</m-button>
                    <m-button width="64" size="small" @click="batchChange(checkeds, SMD_ALL_CLOSE)">{{ i18n.global.t('common.status_close') }}</m-button>
                </div>
            </div>
        </template>
    </m-table>
    <!-- <NewGroupModal
        v-if="curPreviewRow?.id"
        :template-type="templateType"
        :tag="funcTypeObj?.funcType"
        :default-loop-ids="curPreviewRow?.relObjects?.map(item => item.id) || []"
        :data="curPreviewRow"
        disabled-modify
        :is-preview="!!curPreviewRow?.id"
        @close="curPreviewRow = null"
        @success="curPreviewRow = null"
    /> -->
</template>

<script setup>
import i18n from '@/localization';
import { SMD_ALL_OPEN, SMD_ALL_CLOSE, NOT_CONFIGURED } from '../constants/index';
import { nameMatch } from '@/utils/viewUtils';
// import NewGroupModal from '../newGroup/index.vue';

const props = defineProps({
    funcTypeObj: {
        type: Object,
        default: () => {}
    },
    searchInput: {
        type: String,
        default: ''
    },
    dataSource: {
        type: Array,
        default: () => []
    }
});

const columnList = ref([
    {
        dataIndex: 'filterName',
        title: i18n.global.t('meos_control_web.goupname'),
        width: 266
    },
    {
        dataIndex: 'purpose',
        title: i18n.global.t('meos_control_web.group_purpose'),
        width: 254
    },
    {
        dataIndex: 'count',
        title: i18n.global.t('meos_control_web.loop_count'),
        width: 100
    },
    {
        dataIndex: 'ops',
        title: `${i18n.global.t('meos_control_web.operation1')}`,
        width: 104
    }
]);

const curPreviewRow = ref(null);
const renderDataSource = ref([]);
const curGroupList = defineModel({ type: Array });
const templateType = inject('templateType');

watchEffect(() => {
    curGroupList.value = props.dataSource;
});

watchEffect(() => {
    const curInput = props.searchInput;
    const res = curGroupList.value.filter(obj => {
        const nameOk = curInput === '' || obj.name?.toUpperCase()?.includes(curInput?.toUpperCase());
        obj.filterName = nameMatch(obj.name, curInput);
        return nameOk;
    });
    renderDataSource.value = res;
});

const switchMode = (row, mode) => {
    const item = curGroupList.value[row.index];
    if (item) {
        item.settingMode = item.settingMode === mode ? NOT_CONFIGURED : mode;
    }
};

const batchChange = (checkedItems, toMode) => {
    const checkedIds = checkedItems?.filter(s => s?.checked === 'checked')?.map(v => v?.id);
    curGroupList.value?.forEach(obj => {
        if (checkedIds.includes(obj.id)) {
            obj.settingMode = toMode;
        }
    });

    nextTick(() => {
        checkedItems?.forEach(obj => {
            obj.checked = obj.checked === 'checked' ? 'uncheck' : 'checked';
        });
    });
};
const previewGroup = row => {
    // TODO 预览编组
    console.log('previewGroup', row);
    curPreviewRow.value = structuredClone(row);
};
</script>

<style lang="less" scoped>
.op-warp {
    display: flex;
    align-items: center;
    gap: 8px;

    .item {
        padding: 3px 4px;
        color: var(--blue-500);
        text-align: center;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px; /* 157.143% */
        border-radius: 4px;
        cursor: pointer;
        &.act {
            background: var(--blue-100);
        }
        &:hover {
            background: var(--alpha-30);
        }
    }
}

.table-check-tooltips {
    gap: 16px;
    .count-num {
        color: var(--gray-900);
        font-size: 14px;
        font-weight: 600;
        line-height: 22px;
    }
    .btn-groups {
        gap: 12px;
    }
}

.multiple-line {
    max-width: 100%;
    overflow-wrap: break-word;
    white-space: normal;
    padding-block: 12px;
}

:deep(.meri-table-element-tr:hover) {
    &:hover {
        .group-name {
            color: var(--blue-500, #246fe5);
            cursor: pointer;
        }
    }
}
</style>
