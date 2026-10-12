<template>
    <div
        class="config-preview-right-wrap"
        :style="{
            width: width + 'px'
        }"
    >
        <m-list-skeleton v-if="loading" />
        <div v-else class="config-preview-right-content">
            <div class="config-preview-right-header">
                <div class="config-preview-right-title">
                    {{ i18n.global.t('meos_control_web.loop_onoff_demand') }}
                    <span v-if="currentSelTreeNode" v-ellipsis class="config-preview-right-title-tips m-ellipsis"> ({{ currentSelTreeNode.localName || '--' }}) </span>
                </div>
                <m-tips theme="darkTransparent" :content="i18n.global.t('meos_control_web.view_in_fullscreen')" placement="top">
                    <div class="config-preview-right-title-action" @click="viewFullScreenModal">
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
            <div class="config-preview-right-table">
                <m-table :columns="defaultColumns" :data-source="tableData" :checkbox="false" :column-line="false" :empty-text="'--'" class="group-table">
                    <template #settingMode="item">
                        <m-tag v-if="loopIdMapMode[item.id] === SMD_OPEN" color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
                        <m-tag v-if="loopIdMapMode[item.id] === SMD_CLOSE" color="#626C78" bg-color="#E8ECF0" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
                        <m-tag v-if="loopIdMapMode[item.id] === SMD_ALL_OPEN" color="#E68600" bg-color="#FFF0CC" size="small">{{
                            i18n.global.t('meos_control_web.fully_on')
                        }}</m-tag>
                        <m-tag v-if="loopIdMapMode[item.id] === SMD_ALL_CLOSE" color="#626C78" bg-color="#E8ECF0" size="small">{{
                            i18n.global.t('meos_control_web.fully_off')
                        }}</m-tag>
                        <m-tag v-if="loopIdMapMode[item.id] === NOT_CONFIGURED || !loopIdMapMode[item.id]" color="#626C78" bg-color="#E8ECF0" size="small">{{
                            i18n.global.t('meos_control_web.unconfiged')
                        }}</m-tag>
                        <m-tag v-if="loopIdMapMode[item.id] === FEEDBACK_ADJUSTMENT" color="#683BD6" bg-color="#F1E5FE" size="small">{{
                            i18n.global.t('meos_control_web.feedback_adjustment')
                        }}</m-tag>
                    </template>
                </m-table>
                <div class="table-pagination">
                    <m-pagination
                        v-model:page-num="page.current"
                        background
                        :pager-count="width > 460 ? 6 : 3"
                        :total="page.total"
                        :sizes-list="[20, 50, 100, 200, 300, 400, 500]"
                        :page-size="page.pageSize"
                        layout="total,prev,pager,next,sizes"
                        @page-change="pageChange"
                        @size-change="sizeChange"
                    ></m-pagination>
                </div>
            </div>
        </div>
        <RightFullscreen v-if="showFullScreen" @close="showFullScreen = false" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import RightFullscreen from './right-fullscreen/index.vue';
import { SMD_ALL_OPEN, SMD_ALL_CLOSE, SMD_CLOSE, SMD_OPEN, NOT_CONFIGURED, FEEDBACK_ADJUSTMENT } from '../../constant/index';
import { configPreviewLoadingKey, currentSelTreeNodeKey, loopIdMapModeKey, filterSpacesKey, currentLoopsKey, rightTableLoopsKey } from '../../hooks/useConfigPreviewHook';
import { useConfigPreviewFilterHook } from '../../hooks/useConfigPreviewFilterHook';
useConfigPreviewFilterHook();
const filterSpaces = inject(filterSpacesKey);
const loading = inject(configPreviewLoadingKey);
const currentSelTreeNode = inject(currentSelTreeNodeKey);
const showFullScreen = ref(false);
const viewFullScreenModal = () => {
    showFullScreen.value = true;
};
const props = defineProps({
    width: {
        type: Number,
        default: 560
    }
});
const loopIdMapMode = inject(loopIdMapModeKey);
const currentLoops = inject(currentLoopsKey);
const rightTableLoops = inject(rightTableLoopsKey);
const defaultColumns = [
    {
        dataIndex: 'localName',
        title: i18n.global.t('meos_control_web.loop_name'),
        ellipsis: true
    },
    {
        dataIndex: 'lampFuncTypeName',
        title: i18n.global.t('meos_control_web.luminaire_type'),
        width: 103
    },
    {
        dataIndex: 'funcTypeName',
        title: i18n.global.t('meos_control_web.function_type'),
        width: 110
    },
    {
        dataIndex: 'settingMode',
        title: `${i18n.global.t('meos_control_web.switch_demand')}`
    }
];
const page = ref({
    current: 1,
    pageSize: 20,
    total: rightTableLoops.value.length
});
const tableData = ref([]);
const filterData = () => {
    tableData.value = [];
    if (page.value.current <= 0) {
        page.value.current = 1;
    }
    const data = rightTableLoops.value;
    page.value.total = data.length;
    data.slice((page.value.current - 1) * page.value.pageSize, page.value.current * page.value.pageSize).forEach(item => {
        tableData.value.push({
            ...item
        });
    });
};
watch(
    () => rightTableLoops.value,
    () => {
        filterData();
    },
    {
        immediate: true
    }
);
const pageChange = val => {
    page.value.current = val;
    filterData();
};
const sizeChange = size => {
    page.value.pageSize = +size;
    filterData();
};
onMounted(() => {
    filterData();
});
</script>
<style lang="less" scoped>
.config-preview-right-wrap {
    width: 560px;
    height: 100%;
    padding: 16px;
    flex-shrink: 0;
    border-right: 1px solid var(--gray-300, #e1e5eb);
    background: #fff;
    box-sizing: border-box;
    .config-preview-right-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 16px;
        .config-preview-right-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .config-preview-right-title {
                font-weight: 700;
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
            .config-preview-right-title-action {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 18px;
                min-width: 0;
                height: 18px;
                cursor: pointer;
                &:hover {
                    background-color: #c4c9cf4d;
                }
            }
        }
        .config-preview-right-table {
            height: calc(100% - 80px);
        }
        .table-pagination {
            display: flex;
            flex-direction: row;
            position: relative;
            width: 100%;
            max-width: 100%;
            height: 44px;
            white-space: nowrap;
            align-items: flex-end;
        }
    }
}
</style>
