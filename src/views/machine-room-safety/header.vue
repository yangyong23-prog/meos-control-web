<template>
    <div class="head">
        <span class="head-title">{{ i18n.global.t('meos_control_web.machine_room_safety') }}</span>
        <div class="right-filter">
            <div class="right-filter-left">
                <div class="filter-item-wrap">
                    <m-checkbox v-model="activeOnlyMagRiskModel">{{ i18n.global.t('meos_control_web.risk_only_act_managed') }}</m-checkbox>
                </div>
                <m-select
                    ref="Select1"
                    v-model="roomTypeModel"
                    multiple
                    :options="roomTypes"
                    :prefix="i18n.global.t('meos_control_web.machine_room_type_colon')"
                    clearable
                    panel-searchable
                    has-check-all
                    has-confirm
                ></m-select>
            </div>
            <div v-if="isEdge() && base.hasAuth(FOCUSED_MACHINE_ROOMS_PERMISSION)" v-ellipsis class="right-filter-right">
                <m-button type="primary" class="focused-machine-rooms-entry" @click="openModal">{{ i18n.global.t('meos_control_web.watched_machine_room_config') }}</m-button>
            </div>
        </div>
    </div>
    <TreeWithMapForSpaceSelectModal
        v-model="showFocusedModal"
        :title="i18n.global.t('meos_control_web.watched_machine_room_config')"
        :tree-data-loading="props.loading"
        :tree-data="treeData"
        :default-selected="defaultSelected"
        :empty-text="i18n.global.t('meos_control_web.no_space_selectable')"
        :open-clear-cache="true"
        :open-reset-default-selected="true"
        @submit="submit"
    ></TreeWithMapForSpaceSelectModal>
</template>
<script setup>
import i18n from '@/localization';
import { $Message } from 'meri-plus';
import useStore from '@/store';
import TreeWithMapForSpaceSelectModal from '@/views/Common/TreeWithMapForSpaceSelectModal/index.vue';
import { isEdge } from '@/utils/envUtils';
import { useSubmitFocusedList } from './hooks/useFocusedMachineRoomList';
import { activeOnlyMagRiskModelKey, roomTypeModelKey, roomTypesKey } from './hooks/useBaseDataHook';
import { OBJ_TYPE } from '@/utils/globalVariables';

// 关注机房 按钮权限
const FOCUSED_MACHINE_ROOMS_PERMISSION = 'Consernspace';
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    focusedTree: {
        type: Array,
        default: () => []
    },
    focusedList: {
        type: Array,
        default: () => []
    }
});

const emits = defineEmits(['refresh']);
const { submitFocusedList, submitResponse, errorString } = useSubmitFocusedList();
const { base } = useStore();
const { projectId, projectName } = base;

const roomTypeModel = inject(roomTypeModelKey);
const roomTypes = inject(roomTypesKey);
const showFocusedModal = ref(false);
const activeOnlyMagRiskModel = inject(activeOnlyMagRiskModelKey);

const treeData = computed(() => {
    if (Array.isArray(props.focusedTree)) {
        const cloneTree = structuredClone(props.focusedTree)
            .values()
            .filter(build => build?.floors?.length)
            .map(build => {
                return handleTreeFloorSelect(build);
            })
            .toArray();
        if (cloneTree?.length) {
            return [
                {
                    id: projectId || 'projectId',
                    name: projectName || i18n.global.t('meos_control_web.project_name'),
                    children: cloneTree || [],
                    instanceType: 'PROJECT'
                }
            ];
        } else {
            return [];
        }
    } else {
        return [];
    }
});

const defaultSelected = computed(() => {
    // 有配置
    if (Array.isArray(props.focusedList) && props.focusedList.length) {
        const { configData = [] } = props.focusedList.find(item => item.objectType === 'space' && item.configType === 'WHITE_LIST') || {};
        return configData;
    } else {
        // 无配置时默认选中全部
        const spaceIdSet = new Set();
        const cloneTree = structuredClone(props.focusedTree);
        if (Array.isArray(cloneTree)) {
            cloneTree.forEach(item => handleTreeFloorSelect(item, spaceIdSet));
            return [...spaceIdSet];
        } else {
            return [];
        }
    }
});

const handleTreeFloorSelect = (data, spaceIdSet) => {
    data.name = data.localName;
    if (data?.objType === OBJ_TYPE.BUILDING) {
        data.children = data.floors;
    }
    if (data?.objType === OBJ_TYPE.FLOOR) {
        data.children = data.spaces;
    }
    if (data?.objType === OBJ_TYPE.SPACE) {
        if (spaceIdSet) {
            spaceIdSet.add(data.id);
        }
    }
    if (data?.children?.length) {
        data.children = data.children.map(item => {
            return handleTreeFloorSelect(item, spaceIdSet);
        });
    }
    return data;
};

const openModal = () => {
    showFocusedModal.value = true;
};
const submit = async (selectedSpaces, relatedNodes, { successCallback, failCallback }) => {
    const selectIds = selectedSpaces?.value;
    try {
        await submitFocusedList?.(selectIds);
        nextTick(() => {
            if (submitResponse?.value) {
                $Message.success({ title: `${i18n.global.t('common.operation_success')}` });
                successCallback?.();
                nextTick(() => {
                    emits('refresh');
                });
            } else {
                failCallback?.();
            }
            if (errorString) {
                failCallback?.();
            }
        });
    } catch (error) {
        failCallback?.();
    }
};
</script>
<style lang="less" scoped>
.head {
    padding: 16px 24px;
    padding-right: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    &-title {
        color: #2e3742;
        font-size: 24px;
        font-weight: 700;
        height: 32px;
        line-height: 32px;
        white-space: nowrap;
    }
}
.focused-machine-rooms-entry {
    cursor: pointer;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.right-filter {
    width: fit-content;
    display: flex;
    gap: 12px;
    margin-left: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 100%;
    overflow: hidden;
    &-left {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-shrink: 0;
    }
    &-right {
        flex: 1;
        min-width: 0;
    }
}
.filter-item-wrap {
    display: flex;
    height: 32px;
    line-height: 32px;
    padding: 0 12px;
    align-items: center;
    gap: 4px;
    border-radius: 4px;
    background: var(--Grey-Grey-0, #fff);

    /* Shadow/shadow-1 */
    box-shadow: 0 2px 10px 0 rgba(27, 33, 41, 0.1);
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
}
</style>
