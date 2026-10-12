<template>
    <m-table :columns="columnList" :data-source="renderDataSource" :checkbox="!isPreview">
        <template #name="item">
            <div v-ellipsis class="row-name" v-html="item?.filterLoopName"></div>
        </template>
        <template #lampType="{ lampFuncTypeName }">
            <div v-ellipsis class="row-name">{{ lampFuncTypeName || '--' }}</div>
        </template>
        <template #serviceSpace="item">
            <div v-ellipsis class="row-name">
                {{ getServiceSpace(item) }}
            </div>
        </template>
        <template #linkedControlModule="item">
            <div v-ellipsis class="row-name">
                {{ getController(item)?.join('、') || '--' }}
            </div>
        </template>
        <template #inSpace="item">
            <div v-ellipsis class="row-name">
                {{ getInSpace(item) }}
            </div>
        </template>

        <template #ops="row">
            <template v-if="isPreview">
                <m-tag v-if="row.settingMode === SMD_OPEN" size="small" color="#E68600" bg-color="#FFF0CC">{{ i18n.global.t('common.status_open') }}</m-tag>
                <m-tag v-else-if="row.settingMode === SMD_CLOSE" size="small" color="#626C78" bg-color="#E8ECF0">{{ i18n.global.t('common.status_close') }}</m-tag>
                <m-tag v-else-if="row.settingMode === NOT_CONFIGURED || !row?.settingMode" size="small" color="#626C78" bg-color="#E8ECF0">{{
                    i18n.global.t('meos_control_web.unconfiged')
                }}</m-tag>
            </template>
            <div v-else class="op-warp">
                <div class="btn-item" :class="{ act: row.settingMode === SMD_OPEN }" @click="switchMode(row, SMD_OPEN)">{{ i18n.global.t('common.status_open') }}</div>
                <div class="btn-item" :class="{ act: row.settingMode === SMD_CLOSE }" @click="switchMode(row, SMD_CLOSE)">{{ i18n.global.t('common.status_close') }}</div>
            </div>
        </template>
        <template #tooltip="{ checkeds }">
            <div class="table-check-tooltips fc">
                <span>
                    {{ i18n.global.t('meos_control_web.already_selected') }}<span class="count-num"> {{ checkeds.length }}</span> {{ i18n.global.t('meos_control_web.project') }}
                </span>
                <div class="btn-groups fc">
                    <m-button width="64" size="small" @click="batchChange(checkeds, SMD_OPEN)">{{ i18n.global.t('common.status_open') }}</m-button>
                    <m-button width="64" size="small" @click="batchChange(checkeds, SMD_CLOSE)">{{ i18n.global.t('common.status_close') }}</m-button>
                </div>
            </div>
        </template>
    </m-table>
</template>

<script setup>
import i18n from '@/localization';
import { NOT_CONFIGURED, SMD_CLOSE, SMD_OPEN } from '../../constant';
import { nameMatch } from '@/utils/viewUtils';
import { globalModuleListMapKey, publicAreaVisibleKey } from '../../hooks/useGlobalData';

const props = defineProps({
    isPreview: {
        type: Boolean,
        default: true
    },
    funcTypeObj: {
        type: Object,
        default: () => {}
    }
});

const loopLampTypes = defineModel('lampTypes', { type: Array });
const loopLinkedControlItems = defineModel('controlItems', { type: Array });
const loopServiceSpaces = defineModel('serviceSpaces', { type: Array });
const loopOpenCloseDemands = defineModel('openCloseDemands', { type: Array });
const loopName = defineModel('loopName', { type: String });

const globalModuleListMap = inject(globalModuleListMapKey);
const publicAreaVisible = inject(publicAreaVisibleKey);

const curLoopConfigList = defineModel({ type: Array });

const renderDataSource = ref([]);

const baseColumnList = [
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.loop_name')
    },
    {
        dataIndex: 'lampType',
        title: i18n.global.t('meos_control_web.luminaire_type'),
        width: 180
    },
    {
        dataIndex: 'serviceSpace',
        title: i18n.global.t('meos_control_web.served_space'),
        width: 264
    },
    {
        dataIndex: 'linkedControlModule',
        title: `${i18n.global.t('meos_control_web.related_lighting_controller')}`,
        width: 180
    },
    {
        dataIndex: 'inSpace',
        title: `${i18n.global.t('meos_control_web.located_space')}`,
        width: 180
    }
];
const previewColumnList = [
    {
        dataIndex: 'ops',
        title: `${i18n.global.t('meos_control_web.switch_demand')}`,
        width: 110
    }
];
const editColumnList = [
    {
        dataIndex: 'ops',
        title: `${i18n.global.t('meos_control_web.operation1')}`,
        width: 110
    }
];
const columnList = ref(baseColumnList);

const getServiceSpace = item => {
    if (item?.relSpace) {
        return item?.relSpace?.map(r => r?.localName)?.join('、') || '--';
    }
    return '--';
};

const getInSpace = item => {
    return globalModuleListMap.value.get(item?.relModuleId)?.relSpace?.localName || '--';
};

const getController = item => {
    if (item?.relController) {
        // 一条回路只会关联一个控制模块或者一个ddc，只取一个, 此处兼容多个
        return item?.relController?.map(v => v?.localName);
    }
    return [];
};

const filterDataSource = data => {
    const res = data.filter(obj => {
        const { localName, name, lampFuncType, relController, relSpace } = obj || {};
        const objName = localName || name;
        // 一条回路只会关联一个控制模块或者一个ddc，只取一个, 此处兼容多个
        const controlItemIds = relController?.map(v => v?.id) || [];

        const serviceSpaceIds = relSpace?.map(r => r?.id) || [];

        const lampTypeOk = !loopLampTypes.value.length || loopLampTypes.value.includes(lampFuncType);
        const controlItemsOk = !loopLinkedControlItems.value.length || loopLinkedControlItems.value.some(v => controlItemIds.includes(v));
        const serviceSpaceOk = !publicAreaVisible.value || !loopServiceSpaces.value.length || loopServiceSpaces.value.some(v => serviceSpaceIds.includes(v));
        const openCloseDemandOk = !loopOpenCloseDemands.value.length || loopOpenCloseDemands.value.includes(obj.settingMode || NOT_CONFIGURED);

        const groupNameOk = loopName.value === '' || objName?.toUpperCase()?.includes(loopName.value?.toUpperCase());
        obj.filterLoopName = nameMatch(objName, loopName.value) || objName;
        return lampTypeOk && controlItemsOk && serviceSpaceOk && openCloseDemandOk && groupNameOk;
    });
    return res;
};

watchEffect(() => {
    const res = filterDataSource(curLoopConfigList.value);
    renderDataSource.value = res;
});

watch(
    [() => props.isPreview, () => publicAreaVisible.value],
    ([curIsPreview, curVisible]) => {
        if (curIsPreview) {
            // 楼体、景观、标识照明无服务空间、所在空间列
            columnList.value = [...baseColumnList, ...previewColumnList].filter(s => {
                if (!curVisible) {
                    return ![i18n.global.t('meos_control_web.served_space'), i18n.global.t('meos_control_web.located_space')].includes(s.title);
                }
                return true;
            });
        } else {
            columnList.value = [...baseColumnList, ...editColumnList].filter(s => {
                if (!curVisible) {
                    return ![i18n.global.t('meos_control_web.served_space'), i18n.global.t('meos_control_web.located_space')].includes(s.title);
                }
                return true;
            });
        }
    },
    {
        immediate: true
    }
);

const switchMode = (row, toMode) => {
    curLoopConfigList.value = curLoopConfigList.value?.map(obj => {
        if (row.id === obj.id) {
            return { ...obj, settingMode: toMode };
        }
        return obj;
    });
};

const batchChange = (checkedItems, toMode) => {
    const checkedIds = checkedItems?.filter(s => s?.checked === 'checked')?.map(v => v?.id);
    curLoopConfigList.value = curLoopConfigList.value?.map(obj => {
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
.no-cfg-text {
    color: var(--gray-400);
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
