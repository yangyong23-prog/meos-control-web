<template>
    <m-table :columns="columnList" :data-source="renderDataSource" :checkbox="!props.isPreview" :empty-text="'--'">
        <template #name="row">
            <m-tips :content="i18n.global.t('meos_control_web.view_group_loop')" theme="darkTransparent" placement="right" trigger="hover">
                <div class="group-name multiple-line" @click.stop="previewGroup(row)" v-html="row.filterGroupName"></div>
            </m-tips>
        </template>
        <template #purpose="{ purpose }">
            <span class="multiple-line">{{ purpose }}</span>
        </template>
        <template #count="{ relObjects }">
            <span class="multiple-line">{{ relObjects?.length ?? 0 }}</span>
        </template>
        <template #status="row">
            <template v-if="isPreview">
                <m-tag v-if="row.settingMode === SMD_ALL_OPEN" size="small" color="#E68600" bg-color="#FFF0CC">{{ i18n.global.t('meos_control_web.fully_on') }}</m-tag>
                <m-tag v-if="row.settingMode === SMD_ALL_CLOSE" size="small" color="#626C78" bg-color="#E8ECF0">{{ i18n.global.t('meos_control_web.fully_off') }}</m-tag>
                <m-tag v-else-if="row.settingMode === NOT_CONFIGURED || !row?.settingMode" size="small" color="#626C78" bg-color="#E8ECF0">{{
                    i18n.global.t('meos_control_web.unconfiged')
                }}</m-tag>
            </template>
            <div v-else class="op-warp">
                <div class="btn-item" :class="{ act: row.settingMode === SMD_ALL_OPEN }" @click="switchMode(row, SMD_ALL_OPEN)">
                    {{ i18n.global.t('meos_control_web.fully_on') }}
                </div>
                <div class="btn-item" :class="{ act: row.settingMode === SMD_ALL_CLOSE }" @click="switchMode(row, SMD_ALL_CLOSE)">
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
                    <m-button width="64" size="small" @click="batchChange(checkeds, SMD_ALL_OPEN)">{{ i18n.global.t('meos_control_web.fully_on') }}</m-button>
                    <m-button width="64" size="small" @click="batchChange(checkeds, SMD_ALL_CLOSE)">{{ i18n.global.t('meos_control_web.fully_off') }}</m-button>
                </div>
            </div>
        </template>
    </m-table>
    <NewGroupModal
        v-if="curPreviewRow?.id"
        :template-type="templateType"
        :tag="curPreviewRow?.tag"
        :default-loop-ids="curPreviewRow?.relObjects?.map(item => item.id) || []"
        :data="curPreviewRow"
        disabled-modify
        :is-preview="!!curPreviewRow?.id"
        @close="curPreviewRow = null"
        @success="curPreviewRow = null"
    />
</template>

<script setup>
import i18n from '@/localization';
import { SMD_ALL_OPEN, SMD_ALL_CLOSE, NOT_CONFIGURED } from '../../constant';
import { nameMatch } from '@/utils/viewUtils';
import NewGroupModal from '../new-group-modal/index.vue';
import { curMenuIdKey } from '../../hooks/useGlobalData';

const props = defineProps({
    isPreview: {
        type: Boolean,
        default: true
    }
});

const baseColumnList = [
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.goupname')
    },
    {
        dataIndex: 'purpose',
        title: i18n.global.t('meos_control_web.group_purpose'),
        width: 715
    },
    {
        dataIndex: 'count',
        title: i18n.global.t('meos_control_web.loop_count'),
        width: 100
    }
];
const previewColumnList = [
    {
        dataIndex: 'status',
        title: `${i18n.global.t('meos_control_web.switch_demand')}`,
        width: 110
    }
];
const editColumnList = [
    {
        dataIndex: 'status',
        title: `${i18n.global.t('meos_control_web.operation1')}`,
        width: 110
    }
];
const columnList = ref(baseColumnList);

const templateType = inject(curMenuIdKey);

const filterOpenCloseDemands = defineModel('openCloseDemands', { type: Array });
const inputLoopName = defineModel('loopName', { type: String });
const inputGroupName = defineModel('groupName', { type: String });

const curGroupList = defineModel({ type: Array });

const renderDataSource = ref([]);

const curPreviewRow = ref(null);

watch(
    () => props.isPreview,
    curIsPreview => {
        if (curIsPreview) {
            columnList.value = [...baseColumnList, ...previewColumnList];
        } else {
            columnList.value = [...baseColumnList, ...editColumnList];
        }
    },
    {
        immediate: true
    }
);

const filterDataSource = data => {
    const res = data.filter(obj => {
        const openCloseDemandOk = !filterOpenCloseDemands.value.length || filterOpenCloseDemands.value.includes(obj.settingMode || NOT_CONFIGURED);
        const groupNameOk = inputGroupName.value === '' || obj.name?.toUpperCase()?.includes(inputGroupName.value?.toUpperCase());
        obj.filterGroupName = nameMatch(obj.name, inputGroupName.value);

        const loopNameOk = inputLoopName.value === '' || (obj.relObjects || []).some(loop => loop?.localName?.toUpperCase()?.includes(inputLoopName.value?.toUpperCase()));
        return openCloseDemandOk && groupNameOk && loopNameOk;
    });
    return res;
};

watchEffect(() => {
    const res = filterDataSource(curGroupList.value);
    renderDataSource.value = res;
});

const previewGroup = row => {
    curPreviewRow.value = structuredClone(row);
};

const switchMode = (row, toMode) => {
    curGroupList.value = curGroupList.value?.map(obj => {
        if (row.id === obj.id) {
            return { ...obj, settingMode: toMode };
        }
        return obj;
    });
};

const batchChange = (checkedItems, toMode) => {
    const checkedIds = checkedItems?.filter(s => s?.checked === 'checked')?.map(v => v?.id);
    curGroupList.value = curGroupList.value?.map(obj => {
        if (checkedIds.includes(obj.id)) {
            return { ...obj, settingMode: toMode };
        }
        return obj;
    });

    nextTick(() => {
        checkedItems?.forEach(obj => {
            obj.checked = obj.checked === 'checked' ? 'uncheck' : 'checked';
        });
    });
};
</script>

<style lang="less" scoped>
.multiple-line {
    max-width: 100%;
    overflow-wrap: break-word;
    white-space: normal;
    padding-block: 12px;
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

:deep(.meri-table-element-tr:hover) {
    &:hover {
        .group-name {
            color: var(--blue-500, #246fe5);
            cursor: pointer;
        }
    }
}

.op-warp {
    display: flex;
    align-items: center;
    gap: 8px;

    .btn-item {
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
</style>
