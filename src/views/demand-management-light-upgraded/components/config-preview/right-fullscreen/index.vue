<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        content-class-name="config-preview-right-modal-content"
        modal-class-name="config-preview-right-modal"
        type="full"
        :need-scrollbar="false"
        @close="close"
    >
        <template #header>
            <div class="config-preview-right-header">
                <div class="config-preview-right-title">
                    {{ i18n.global.t('meos_control_web.loop_onoff_demand') }}
                    <span v-if="currentSelTreeNode" v-ellipsis class="config-preview-right-title-tips m-ellipsis"> ({{ currentSelTreeNode.localName || '--' }}) </span>
                </div>
            </div>
        </template>
        <template #content>
            <div class="config-preview-right-content">
                <Topbar />
                <Filterbar @clear="clear" />
                <div class="config-preview-right-table">
                    <m-table
                        :columns="publicAreaVisible ? tableColumns : nightColumns"
                        :data-source="tableData"
                        :checkbox="false"
                        :column-line="false"
                        :empty-text="'--'"
                        class="loop-table"
                    >
                        <template #localName="item">
                            <span v-html="highlightKeyword(item?.localName)"></span>
                        </template>
                        <template #settingMode="item">
                            <m-tag v-if="item.settingMode === SMD_OPEN" color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
                            <m-tag v-if="item.settingMode === SMD_CLOSE" color="#626C78" bg-color="#E8ECF0" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
                            <m-tag v-if="item.settingMode === SMD_ALL_OPEN" color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('meos_control_web.fully_on') }}</m-tag>
                            <m-tag v-if="item.settingMode === SMD_ALL_CLOSE" color="#626C78" bg-color="#E8ECF0" size="small">{{
                                i18n.global.t('meos_control_web.fully_off')
                            }}</m-tag>
                            <m-tag v-if="item.settingMode === FEEDBACK_ADJUSTMENT" color="#683BD6" bg-color="#F1E5FE" size="small">{{
                                i18n.global.t('meos_control_web.feedback_adjustment')
                            }}</m-tag>
                            <m-tag v-if="item.settingMode === NOT_CONFIGURED || !item.settingMode" color="#626C78" bg-color="#E8ECF0" size="small">{{
                                i18n.global.t('meos_control_web.unconfiged')
                            }}</m-tag>
                        </template>
                        <template #configSourceObjName="item">
                            {{ getSource(item) }}
                        </template>
                        <template #relSpace="item">
                            {{ item.relSpace?.map(space => space.localName).join('、') || '--' }}
                        </template>
                        <template #relFloor="item">
                            {{ item.relFloor?.map(fl => fl.localName).join('、') || '--' }}
                        </template>
                        <template #relController="item">
                            {{ item.relController?.map(ctrl => ctrl.localName).join('、') || '--' }}
                        </template>
                        <template #inSpace="item">
                            {{ item?.inSpace?.relSpace?.localName || '--' }}
                        </template>
                    </m-table>
                </div>
                <div class="table-pagination">
                    <m-pagination
                        v-model:page-num="page.current"
                        background
                        :total="page.total"
                        :sizes-list="[20, 50, 100, 200, 300, 400, 500]"
                        :page-size="page.pageSize"
                        layout="total,prev,pager,next,sizes"
                        @page-change="pageChange"
                        @size-change="sizeChange"
                    ></m-pagination>
                </div>
            </div>
        </template>
    </m-modal>
</template>
<script setup>
import i18n from '@/localization';
import { SMD_ALL_OPEN, SMD_ALL_CLOSE, SMD_CLOSE, SMD_OPEN, NOT_CONFIGURED, FEEDBACK_ADJUSTMENT } from '../../../constant/index';
import { publicAreaVisibleKey } from '../../../hooks/useGlobalData';
import Topbar from './topbar.vue';
import Filterbar from './filterbar.vue';
import { template, trim } from 'lodash';
import { configPreviewLoadingKey, currentSelTreeNodeKey } from '../../../hooks/useConfigPreviewHook';
import {
    configPreviewTableDataKey,
    configPreviewPageKey,
    configPreviewFilterFuncKey,
    configPreviewModalTableQueryKey,
    escapeRegExp
} from '../../../hooks/useConfigPreviewFilterHook';
const currentSelTreeNode = inject(currentSelTreeNodeKey);
const emits = defineEmits(['close']);
const query = inject(configPreviewModalTableQueryKey);
const publicAreaVisible = inject(publicAreaVisibleKey);
const show = ref(false);
const tableColumns = [
    {
        dataIndex: 'localName',
        title: i18n.global.t('meos_control_web.loop_name'),
        width: 240,
        ellipsis: true
    },
    // {
    //     dataIndex: 'buildingOrder',
    //     title: '建筑'
    // },
    // {
    //     dataIndex: 'floorSequenceId',
    //     title: '楼层'
    // },
    {
        dataIndex: 'funcTypeName',
        title: i18n.global.t('meos_control_web.function_type'),
        width: 144,
        ellipsis: true
    },
    {
        dataIndex: 'lampFuncTypeName',
        title: i18n.global.t('meos_control_web.luminaire_type'),
        width: 139,
        ellipsis: true
    },
    {
        dataIndex: 'settingMode',
        title: `${i18n.global.t('meos_control_web.switch_demand')}`,
        width: 138,
        ellipsis: true
    },
    // {
    //     dataIndex: 'configSourceObjName',
    //     title: `需求来源`,
    //     ellipsis: true,
    //     minWidth: 194
    // },
    {
        dataIndex: 'relSpace',
        title: `${i18n.global.t('meos_control_web.served_space')}`,
        ellipsis: true,
        minWidth: 194
    },
    {
        dataIndex: 'relController',
        title: i18n.global.t('meos_control_web.related_lighting_controller'),
        width: 194,
        ellipsis: true
    },
    {
        dataIndex: 'inSpace',
        title: i18n.global.t('meos_control_web.located_space'),
        width: 151,
        ellipsis: true
    }
];
const nightColumns = [
    {
        dataIndex: 'localName',
        title: i18n.global.t('meos_control_web.loop_name'),
        width: 240,
        ellipsis: true
    },
    // {
    //     dataIndex: 'buildingOrder',
    //     title: '建筑'
    // },
    // {
    //     dataIndex: 'floorSequenceId',
    //     title: '楼层'
    // },
    {
        dataIndex: 'funcTypeName',
        title: i18n.global.t('meos_control_web.function_type'),
        width: 144,
        ellipsis: true
    },
    {
        dataIndex: 'lampFuncTypeName',
        title: i18n.global.t('meos_control_web.luminaire_type'),
        width: 139,
        ellipsis: true
    },
    {
        dataIndex: 'settingMode',
        title: `${i18n.global.t('meos_control_web.switch_demand')}`,
        width: 138,
        ellipsis: true
    },
    {
        dataIndex: 'relFloor',
        title: `${i18n.global.t('meos_control_web.served_floor')}`,
        ellipsis: true
    },
    {
        dataIndex: 'relController',
        title: i18n.global.t('meos_control_web.related_lighting_controller'),
        width: 194,
        ellipsis: true
    },
    {
        dataIndex: 'inSpace',
        title: i18n.global.t('meos_control_web.located_space'),
        width: 282,
        ellipsis: true
    }
];
const page = inject(configPreviewPageKey);
const calcuLateData = inject(configPreviewFilterFuncKey);
const clear = val => {
    query.value.name = '';
    query.value.settingModes = [];
    query.value.lampFuncTypes = [];
    query.value.funcTypes = [];
    query.value.relControllers = [];
    query.value.relSpaces = [];
    calcuLateData();
};
const sizeChange = size => {
    page.value.pageSize = +size;
    calcuLateData();
};
const highlightKeyword = name => {
    const regex = new RegExp(escapeRegExp(trim(query.value.name)), 'gi');
    return name ? name.replace(regex, '<span style="color:#246FE5">$&</span>') : '--';
};
const getSource = item => {
    if (item.configSourceObjName) {
        if (item.configSourceObjId.match(/^Pj/gi)) {
            return i18n.global.t('meos_control_web.global_config_requirement');
        }
        if (item.configSourceObjId.match(/^SFT/gi)) {
            return item.configSourceObjName + i18n.global.t('meos_control_web.demand_like');
        }
        return item.configSourceObjName + i18n.global.t('meos_control_web.demand');
    }
    return '--';
};
const tableData = inject(configPreviewTableDataKey);
const pageChange = val => {
    page.value.current = val;
    calcuLateData();
};
onMounted(() => {
    show.value = true;
});
const close = () => {
    show.value = false;
    clear();
    nextTick(() => {
        emits('close');
    });
};
</script>
<style lang="less">
.config-preview-right-modal {
    .m-modal-full {
        .m-modal-full-content {
            padding: 0px 24px 12px 24px;
        }
    }
}
.config-preview-right-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .config-preview-right-title {
        font-weight: 700;
        white-space: nowrap;
        font-size: 16px;
        line-height: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        white-space: nowrap;
        min-width: 0;
    }
    .config-preview-right-title-tips {
        font-weight: 400;
        font-size: 16px;
        display: inline-block;
        color: var(--gray-600, #626c78);
        line-height: 20px;
        min-width: 0;
    }
}
.config-preview-right-modal-content {
    padding-top: 12px;
    .config-preview-right-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .config-preview-right-table {
            margin-top: -8px;
            display: flex;
            flex: 1 1 0;
            height: calc(100% - 180px);
        }
        .table-pagination {
            display: flex;
            flex-direction: row;
            height: 60px;
            align-items: center;
            justify-content: flex-end;
        }
    }
}
</style>
