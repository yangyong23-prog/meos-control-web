<template>
    <m-table
        :columns="showType === 'loop' ? loopColumnList : groupColumnList"
        :data-source="dataSource"
        :checkbox="false"
        :column-line="true"
        :empty-text="'--'"
        class="group-table"
    >
        <template #name="row">
            <m-tips :content="i18n.global.t('meos_control_web.view_group_loop')" theme="darkTransparent" placement="right" trigger="hover">
                <div class="group-name multiple-line" @click.stop="previewGroup(row)">{{ row.name || '--' }}</div>
            </m-tips>
        </template>
        <template #purpose="{ purpose }">
            <span class="multiple-line">{{ purpose }}</span>
        </template>
        <template #count="{ relObjects }">
            <span class="multiple-line">{{ relObjects?.length ?? 0 }}</span>
        </template>
        <template #headerSlot="col">
            <div class="col-with-action">
                <span>{{ col.title }}</span>
                <m-tips theme="darkTransparent" :content="i18n.global.t('meos_control_web.popup_view')" placement="bottom">
                    <div class="action-entry" @click="viewMoreModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3.19922 3.2002L5.86589 5.84006" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M3.19922 12.7732L5.86589 10.1333" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.8039 12.7732L10.1641 10.1333" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.7727 3.2002L10.1328 5.84006" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10.3984 3.2002H12.7984V5.6002" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.7984 10.3999V12.7999H10.3984" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.59922 12.7999H3.19922V10.3999" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M3.19922 5.6002V3.2002H5.59922" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </m-tips>
            </div>
        </template>
        <template #settingMode="item">
            <m-tag v-if="item.settingMode === SMD_OPEN" color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
            <m-tag v-if="item.settingMode === SMD_CLOSE" color="#626C78" bg-color="#E8ECF0" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
            <m-tag v-if="item.settingMode === SMD_ALL_OPEN" color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('meos_control_web.fully_on') }}</m-tag>
            <m-tag v-if="item.settingMode === SMD_ALL_CLOSE" color="#626C78" bg-color="#E8ECF0" size="small">{{ i18n.global.t('meos_control_web.fully_off') }}</m-tag>
            <m-tag v-if="item.settingMode === NOT_CONFIGURED || !item.settingMode" color="#626C78" bg-color="#E8ECF0" size="small">{{
                i18n.global.t('meos_control_web.unconfiged')
            }}</m-tag>
        </template>
    </m-table>
</template>

<script setup>
import i18n from '@/localization';
import { SMD_OPEN, SMD_CLOSE, SMD_ALL_OPEN, SMD_ALL_CLOSE, NOT_CONFIGURED } from '../../constant';
const props = defineProps({
    dataSource: {
        type: Array,
        default: () => []
    },
    curItem: {
        type: Object,
        default: () => ({})
    },
    showType: {
        type: String,
        default: 'loop' // 'group' | 'loop'
    }
});

const loopColumnList = ref([
    {
        dataIndex: 'localName',
        title: i18n.global.t('meos_control_web.lighting_circuit'),
        ellipsis: true
    },
    {
        dataIndex: 'localId',
        title: i18n.global.t('meos_control_web.loop_code'),
        ellipsis: true
    },
    {
        dataIndex: 'lampFuncTypeName',
        title: i18n.global.t('meos_control_web.luminaire_type'),
        width: 182
    },
    {
        dataIndex: 'settingMode',
        title: `${i18n.global.t('meos_control_web.switch_demand')}`,
        width: 158,
        headerSlot: 'headerSlot'
    }
]);

const groupColumnList = ref([
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.goupname'),
        width: 258
    },
    {
        dataIndex: 'purpose',
        title: i18n.global.t('meos_control_web.group_purpose')
    },
    {
        dataIndex: 'count',
        title: i18n.global.t('meos_control_web.loop_count'),
        width: 100
    },
    {
        dataIndex: 'settingMode',
        title: `${i18n.global.t('meos_control_web.switch_demand')}`,
        width: 158,
        headerSlot: 'headerSlot'
    }
]);

const emits = defineEmits(['view-more-modal', 'preview-group']);
const viewMoreModal = () => {
    emits('view-more-modal', props.curItem);
};

const previewGroup = row => {
    emits('preview-group', row);
};
</script>

<style lang="less" scoped>
.group-table {
    :deep(.meri-table-element-th) {
        &:last-child {
            padding-right: 0px;
        }
    }
    :deep(.meri-table-body-nodata) {
        position: relative;
        margin-top: 14px;
        min-height: 120px;
    }
}
.col-with-action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .action-entry {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 40px;
        cursor: pointer;
        border-left: 1px solid var(--Grey-Grey-Dividers, #e1e5eb);
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

.row-name {
    color: var(--gray-900);
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}
.no-cfg-text {
    color: var(--gray-400);
}
</style>
