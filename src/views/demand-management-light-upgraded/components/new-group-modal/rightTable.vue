<template>
    <div class="right-table-wrap">
        <div class="right-table-fitler-wrap fc">
            <div v-ellipsis class="m-ellipsis right-table-fitler-wrap-left">{{ activeTreeNode?.name }}</div>
            <div class="right-table-fitler-wrap-right">
                <m-search ref="search" v-model="query.name" class="lightcontrol-noborder-input" immediate type="enter" width="240" @change="pageChange(1)" @clear="pageChange(1)">
                </m-search>
                <div class="bar" />
                <m-select
                    v-model="query.lampFuncType"
                    :prefix="i18n.global.t('meos_control_web.luminaire_type_colon')"
                    multiple
                    clearable
                    has-confirm
                    has-check-all
                    panel-searchable
                    :options="lampFuncTypes"
                    @clear="pageChange(1)"
                    @confirm="pageChange(1)"
                >
                </m-select>
                <template v-if="publicAreaVisible">
                    <div class="bar" />
                    <m-tree-select
                        v-model="query.space"
                        :data="serviceSpacesTree"
                        :prefix="i18n.global.t('meos_control_web.served_space_colon')"
                        multiple
                        clearable
                        :show-parent-name="false"
                        has-confirm
                        has-check-all
                        panel-searchable
                        @clear="pageChange(1)"
                        @confirm="pageChange(1)"
                    ></m-tree-select>
                </template>
            </div>
        </div>
        <div class="table-container">
            <div class="table-content">
                <m-table
                    ref="tableRef"
                    :columns="columns"
                    :data-source="tableData"
                    :checkbox="true"
                    :disable-select-all-text="i18n.global.t('meos_control_web.preview_status_not_operable')"
                    :disable-select-all="isPreview"
                    empty-text="--"
                    @checked-change="checkedChange"
                >
                    <template #localName="item">
                        <div v-ellipsis class="row-name" v-html="highlightKeyword(item?.localName)"></div>
                    </template>

                    <template #relController="item">
                        <div v-ellipsis class="row-name">
                            {{ getController(item)?.join('、') || '--' }}
                        </div>
                    </template>
                    <template #inSpace="item">
                        <div v-ellipsis class="row-name">
                            {{ getInSpace(item) }}
                        </div>
                    </template>
                    <template #serviceAreaTypeName="item">
                        <div v-ellipsis class="row-name">
                            {{ getServiceSpace(item) }}
                        </div>
                    </template>
                </m-table>
            </div>
            <div class="table-pagination">
                <m-pagination
                    v-model:page-num="page.current"
                    background
                    :total="page.total"
                    :sizes-list="[100, 200, 300, 400, 500]"
                    :page-size="page.pageSize"
                    layout="total,prev,pager,next,sizes"
                    @page-change="pageChange"
                    @size-change="sizeChange"
                ></m-pagination>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { trim } from 'lodash';
import { activeLoopListKey, loopListMapKey, viewSelectKey, activeTreeNodeKey, moduleListMapKey, moduleIdsKey } from '../../hooks/useAddGroupHook';
import { publicAreaVisibleKey } from '../../hooks/useGlobalData';
import { setSpaceTreeData } from '../../utils';
import { isEqual } from 'lodash';

const props = defineProps({
    isPreview: {
        type: Boolean,
        default: false
    },
    disabledModify: {
        type: Boolean,
        default: false
    }
});
const tableRef = ref();
const viewSelect = inject(viewSelectKey);
const activeTreeNode = inject(activeTreeNodeKey);
const activeLoopList = inject(activeLoopListKey);
const loopListMap = inject(loopListMapKey);
const moduleListMap = inject(moduleListMapKey);
const moduleIds = inject(moduleIdsKey);
const publicAreaVisible = inject(publicAreaVisibleKey);
const query = ref({
    name: '',
    lampFuncType: [],
    space: []
});

const lampFuncTypes = ref([]);
const serviceSpacesMap = ref(new Map());
const serviceSpacesTree = ref([]);
const columns = ref([
    {
        title: i18n.global.t('meos_control_web.loop_name'),
        width: 240,
        dataIndex: 'localName',
        ellipsis: true,
        fixed: 'left'
    },
    {
        title: i18n.global.t('meos_control_web.luminaire_type'),
        width: 100,
        dataIndex: 'lampFuncTypeName' // 是否取错
    },
    {
        title: i18n.global.t('meos_control_web.related_lighting_controller'),
        minWidth: 150,
        dataIndex: 'relController'
    },
    {
        title: i18n.global.t('meos_control_web.located_space'),
        minWidth: 150,
        textNotEllipsis: true,
        dataIndex: 'inSpace'
    },
    {
        title: i18n.global.t('meos_control_web.served_space'),
        textNotEllipsis: true,
        dataIndex: 'serviceAreaTypeName',
        width: 210
    }
]);

watchEffect(() => {
    columns.value = columns.value.filter(v => {
        if (v?.title === i18n.global.t('meos_control_web.served_space') && !publicAreaVisible.value) {
            return false;
        }
        return true;
    });
});

const page = ref({
    current: 1,
    pageSize: 500,
    total: 0
});
const checkedChange = ({ items, selecteds }) => {
    items.forEach(item => {
        if (item.checked === 'checked') {
            if (loopListMap.value.has(item.id)) {
                loopListMap.value.get(item.id).isSelected = true;
            }
            item.isSelected = true;
        } else {
            if (loopListMap.value.has(item.id)) {
                loopListMap.value.get(item.id).isSelected = false;
            }
            item.isSelected = false;
        }
    });
};

const sizeChange = size => {
    page.value.pageSize = +size;
};
const getController = item => {
    if (item?.relController) {
        // 一条回路只会关联一个控制模块或者一个ddc，只取一个, 此处兼容多个
        const allNames = item?.relController?.map(v => v?.localName);
        return allNames || [];
    }
    return [];
};
const getInSpace = item => {
    return moduleListMap.value.get(item?.relModuleId)?.relSpace?.localName || '--';
};
const highlightKeyword = name => {
    const regex = new RegExp(escapeRegExp(trim(query.value.name)), 'gi');
    return name ? name.replace(regex, '<span style="color:#246FE5">$&</span>') : '--';
};
const getServiceSpace = item => {
    if (item?.relSpace) {
        return item?.relSpace?.map(r => r?.localName)?.join('、') || '--';
    }
    return '--';
};
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义所有正则元字符
}
const tableData = ref([]);

const calcuLateData = () => {
    tableData.value = [];
    const lampFuncTypeOptions = {};
    const serviceSpaceOptions = {};
    const spaceInfoMap = new Map();
    if (page.value.current <= 0) {
        page.value.current = 1;
    }
    const data = activeLoopList.value
        .filter(loop => {
            let valid = true;
            if (viewSelect.value === 'checked') {
                if (!loopListMap.value.get(loop.id).isSelected) {
                    valid = false;
                }
            }
            if (trim(query.value.name)) {
                const reg = new RegExp(escapeRegExp(trim(query.value.name)), 'gi');
                if (!reg.test(loop.localName)) {
                    valid = false;
                }
            }

            if (valid) {
                if (loop?.lampFuncTypeName && loop?.lampFuncType) {
                    lampFuncTypeOptions[loop.lampFuncType] = {
                        id: loop.lampFuncType,
                        name: loop.lampFuncTypeName
                    };
                }
                if (Array.isArray(loop?.relSpace) && loop?.relSpace?.length) {
                    loop.relSpace.forEach(space => {
                        if (space.id) {
                            const newSpace = { ...space, name: space?.localName || '' };
                            spaceInfoMap.set(space.id, structuredClone(newSpace));
                            serviceSpaceOptions[space.id] = {
                                id: space.id,
                                name: space?.localName || ''
                            };
                        }
                    });
                }
            }

            if (query.value.lampFuncType.length) {
                if (!query.value.lampFuncType.includes(loop?.lampFuncType)) {
                    valid = false;
                }
            }
            if (query.value.space.length) {
                if (Array.isArray(loop?.relSpace)) {
                    const hasIntersection = loop.relSpace.some(item => query.value.space.includes(item?.id));
                    if (!hasIntersection) {
                        valid = false;
                    }
                }
            }

            return valid;
        })
        .toSorted((a, b) =>
            a.localName?.localeCompare(b.localName, 'zh', {
                numeric: true,
                sensitivity: 'base'
            })
        );
    lampFuncTypes.value = data.length === 0 || Object.keys(lampFuncTypeOptions).length === 0 ? lampFuncTypes.value : Object.values(lampFuncTypeOptions);
    serviceSpacesMap.value = data.length === 0 || spaceInfoMap.size === 0 ? serviceSpacesMap.value : spaceInfoMap;
    page.value.total = data.length;
    data.slice((page.value.current - 1) * page.value.pageSize, page.value.current * page.value.pageSize).forEach(item => {
        if (loopListMap.value.get(item.id).isSelected) {
            item.checked = 'checked';
        } else {
            item.checked = 'uncheck';
        }
        if (props.isPreview) {
            item.checkDisableTip = i18n.global.t('meos_control_web.preview_status_not_operable');
            item.disable = true;
        } else {
            item.checkDisableTip = '';
            item.disable = false;
        }
        tableData.value.push(item);
    });
};

const pageChange = val => {
    page.value.current = val;
    calcuLateData();
};

watch(
    () => [...serviceSpacesMap.value.keys()],
    (curKeys, preKeys) => {
        if (isEqual(curKeys, preKeys)) {
            return;
        }
        const spaceList = [...serviceSpacesMap.value.values()];
        const list = setSpaceTreeData(spaceList);
        serviceSpacesTree.value = list;
    }
);

watch(
    () => props.isPreview,
    () => {
        calcuLateData();
    }
);
watch(
    () => activeLoopList.value,
    cur => {
        calcuLateData();
    },
    {
        immediate: true,
        deep: true
    }
);
const resetParms = () => {
    query.value.name = '';
    query.value.lampFuncType = [];
    query.value.space = [];
    page.value.pageSize = 500;
};
watch(
    () => moduleIds.value,
    () => {
        resetParms();
        pageChange(1);
    },
    {
        immediate: true,
        deep: true
    }
);
watch(
    () => viewSelect.value,
    val => {
        if (val) {
            pageChange(1);
        }
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.right-table-wrap {
    padding: 16px 24px 0 16px;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    gap: 8px;
}
.row-name {
    color: var(--gray-900);
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
}
.table-container {
    display: flex;
    flex-grow: 1;
    height: calc(100% - 40px);
    flex-direction: column;
    .table-pagination {
        display: flex;
        flex-direction: row;
        height: 60px;
        align-items: center;
        justify-content: flex-end;
    }
}
.table-content {
    max-width: auto;
    min-width: 100%;
    height: calc(100% - 60px);
}
.del-icon {
    &:hover {
        --svg-hover-color: var(--blue-500);
        path {
            fill: var(--blue-500);
        }
    }
}
.right-table-fitler-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 8px;
    max-width: 100%;
    .right-table-fitler-wrap-left {
        font-weight: 700;
        font-size: 16px;
        line-height: 22px;
        white-space: nowrap;
        width: calc(100% - 738px);
        color: #2e3742;
    }
    .right-table-fitler-wrap-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        .bar {
            width: 1px;
            height: 16px;
            background-color: transparent;
        }
    }
}
</style>
<style lang="less">
.lightcontrol-noborder-input {
    .inner-input {
        border-color: transparent;
        &.hover,
        &.active,
        &.focus {
            border-color: transparent;
            background: var(--alpha-30);
            input {
                background: transparent;
            }
        }
        .suffix-icon {
            width: 60px;
            .icon {
                width: 60px;
            }
        }
    }
}
.lt-service-space-column-wrap {
    width: 260px;
    white-space: nowrap;
}
</style>
