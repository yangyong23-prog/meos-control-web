<template>
    <div
        :id="editScopeKey"
        class="ObjectSelection"
    >
        <div class="title-item f16 fb7">{{ i18n.global.t('meos_control_web.object_selection') }}</div>

        <div class="card-container mt12">
            <div class="fc">
                <div
                    class="f14 fc"
                    style="height: 22px; min-width: 130px"
                >
                    {{ i18n.global.t('meos_control_web.object_type') }}
                </div>
                <m-radio-group
                    v-model="addObjectSelection.type"
                    @change="changeRadio"
                >
                    <div class="list">
                        <m-popover
                            v-for="(item, index) in options"
                            :key="index"
                            :content="i18n.global.t('meos_control_web.i_am_hint_text')"
                            placement="top"
                            theme="darkTransparent"
                            :show-arrow="false"
                            :disabled="disabled"
                        >
                            <template #content>{{ i18n.global.t('meos_control_web.edit_interrupt_tips') }}</template>
                            <m-radio
                                :label="item.value"
                                :size="14"
                                :disabled="item.disabled"
                            >
                                <span>{{ item.label }}</span>
                            </m-radio>
                        </m-popover>
                    </div>
                </m-radio-group>
            </div>
            <div class="f">
                <div
                    class="f14 fc title-obj"
                    style="height: 32px; min-width: 130px"
                >
                    {{ i18n.global.t('meos_control_web.object_selection') }}
                    <span class="required-dot">*</span>
                </div>
                <div>
                    <div>
                        <m-button @click="SelectObjectBtn">{{ i18n.global.t('meos_control_web.select_object') }}</m-button>
                        <span
                            v-if="requiredFields"
                            class="ml4 f12"
                            style="color: #f55047"
                            >{{ i18n.global.t('meos_control_web.input_required_check_error_4') }}</span
                        >
                    </div>
                    <div
                        v-show="showSelect"
                        class="name-content mt10"
                    >
                        <div class="f">
                            <div
                                ref="textRef"
                                :class="[unpack ? '' : 'h40', 'mr8']"
                            >
                                <span
                                    v-for="(item, index) in content"
                                    :key="index"
                                >
                                    <template v-if="item.v">
                                        <span
                                            v-for="(io, iv) in item.v"
                                            :key="iv"
                                        >
                                            <span> {{ io }}</span>
                                            <span v-if="iv < item.v.length - 1">/</span>
                                        </span>
                                        <span>({{ item.parentName }}) </span>
                                    </template>
                                    <template v-else>
                                        <span> {{ item.name }}</span>
                                        <span v-if="index < content.length - 1">、</span>
                                    </template>
                                    <span v-if="index < content.length - 1 && item.v">、</span>
                                </span>
                            </div>
                            <div
                                style="width: 16px; height: 16px"
                                class="mt2"
                            >
                                <IconMeriComponentCancel
                                    class="fork-icon cp"
                                    @click="delBtn"
                                />
                            </div>
                        </div>
                        <m-button
                            v-if="textRefScrollHeight > 40"
                            type="link"
                            size="small"
                            @click="unpackBtn"
                            >{{ unpackText }}</m-button
                        >
                    </div>
                </div>
            </div>
            <div class="fc">
                <div
                    class="f14 fc"
                    style="height: 22px; min-width: 130px"
                >
                    {{ i18n.global.t('meos_control_web.special_config_name') }}
                </div>
                <m-input
                    v-model="name"
                    :maxlength="30"
                    :error-text="addObjectSelection.duplicateVerification ? i18n.global.t('meos_control_web.special_config_name_exists') : ''"
                    clearable
                    :placeholder="placeholder"
                    width="486px"
                    @clear="clearableFuc"
                >
                </m-input>
            </div>
        </div>
    </div>
    <!-- 建筑 -->
    <architectureModal
        v-if="showArchitecture"
        :type="type"
        :ids="architectureTemporarily"
        @close="showArchitecture = false"
        @name-obj-fun="nameObjFun"
    />
    <!-- 楼层 -->
    <floorModal
        v-if="showFloor"
        :type="type"
        :ids="floorTemporarily"
        @close="showFloor = false"
        @name-obj-fun="nameObjFun"
    />
    <!-- 空间类型 -->
    <spaceTypeModal
        v-if="showSpaceType"
        :type="type"
        :ids="spaceTypeTemporarily"
        @close="closeSpaceTypeModal"
        @name-obj-fun="nameObjFun"
    />
    <!-- 空间对象 -->
    <TreeWithMapForSpaceSelectModal
        v-model="showSpaceObject"
        :title="i18n.global.t('meos_control_web.select_object_space_object')"
        :tree-data-loading="spaceTreeLoading"
        :tree-data="spaceTreeData"
        :empty-text="i18n.global.t('meos_control_web.no_configurable_content')"
        :default-selected="spaceDefaultSelectedData"
        :open-clear-cache="true"
        :min-tree-height="486"
        :tree-filters-map="spaceTreeFiltersMap"
        :before-confirm-callback="beforeConfirmCallback"
        @submit="confirmSelectedSpaceObj"
    >
        <template #search-filter>
            <m-tree-select
                v-model="curSpaceFuncTypes"
                :size="360"
                :data="spaceFuncTypeList"
                :prefix="i18n.global.t('meos_control_web.space_function_type_colon')"
                multiple
                clearable
                :show-parent-name="false"
                has-confirm
                has-check-all
                panel-searchable
            >
            </m-tree-select>
            <m-select
                v-model="curSpaceLightFeedBack"
                class="mt8 mb8"
                :size="360"
                :options="spaceLightFeedBackOptions"
                :prefix="i18n.global.t('meos_control_web.illuminance_feedback_colon')"
                :placeholder="i18n.global.t('meos_control_web.please_select')"
                clearable
            ></m-select>
        </template>
    </TreeWithMapForSpaceSelectModal>
</template>
<script setup>
import i18n from '@/localization';
import architectureModal from './architectureModal.vue';
import floorModal from './floorModal.vue';
import spaceTypeModal from './spaceTypeModal.vue';
import TreeWithMapForSpaceSelectModal from '@/views/Common/TreeWithMapForSpaceSelectModal/index.vue';
import { IconMeriComponentCancel } from 'meri-icon';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { getTreeBuildingFloorSpace } from '@/apis/DemandManagementHomeNew';
import { filterTreeByLeafIds } from '@/utils';
import { getLoopTreeIds, setSpaceTreeData, isSpaceLightFeedBack } from '../../utils/index';
import {
    curMenuIdKey,
    globalLoopRoomFuncTypesTreeKey,
    globalSpaceLoopListMapKey,
    globalLoopListKey,
    isSpaceWithWorkPlaneLuxRuleKey,
    isProjectWithOutdoorIlluminanceRuleKey
} from '../../hooks/useGlobalData';
import { curLeftConfigObjItemKey, leftTreeListKey, leftTreeRemoveCurrentIdsKey } from '../../hooks/useConfigCommonHook';
import { OBJECT_SELECT_TYPE } from '../../constant/index';
import useStore from '@/store';
import { $Message } from 'meri-plus';

const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: ''
    },
    editScopeKey: {
        type: String,
        default: 'ObjectSelection'
    }
});

const spaceLightFeedBackOptions = ref([
    {
        id: 'true',
        name: i18n.global.t('meos_control_web.yes')
    },
    {
        id: 'false',
        name: i18n.global.t('common.no')
    }
]);
const curSpaceLightFeedBack = ref('');
const spaceFuncTypeList = inject(globalLoopRoomFuncTypesTreeKey);
const globalSpaceLoopListMap = inject(globalSpaceLoopListMapKey);
const globalLoopList = inject(globalLoopListKey);
const isSpaceWithWorkPlaneLuxRule = inject(isSpaceWithWorkPlaneLuxRuleKey);
const isProjectWithOutdoorIlluminanceRule = inject(isProjectWithOutdoorIlluminanceRuleKey);

const curSpaceFuncTypes = ref([]);
const spaceTreeFiltersMap = ref(new Map());

watch([() => curSpaceLightFeedBack.value, () => curSpaceFuncTypes.value], () => {
    const tempMap = new Map();
    // TODO 调整筛选项
    tempMap.set('spaceLightFeedBack', {
        key: 'spaceLightFeedBack',
        filterVal: computed(() => curSpaceLightFeedBack.value),
        isEmpty: computed(() => !curSpaceLightFeedBack.value),
        condition: (curVal, curFilter) => {
            if (curFilter === 'true') {
                return isSpaceLightFeedBack(curVal, isSpaceWithWorkPlaneLuxRule(curVal.id), isProjectWithOutdoorIlluminanceRule());
            } else {
                return !isSpaceLightFeedBack(curVal, isSpaceWithWorkPlaneLuxRule(curVal.id), isProjectWithOutdoorIlluminanceRule());
            }
        }
    });
    tempMap.set('spaceFuncType', {
        key: 'spaceFuncType',
        filterVal: computed(() => curSpaceFuncTypes.value),
        isEmpty: computed(() => !curSpaceFuncTypes.value?.length),
        condition: (curVal, curFilter) => {
            const curSpaceInfo = globalSpaceLoopListMap.value.get(curVal.id);
            if (curSpaceInfo?.roomFuncType) {
                return curFilter.includes(curSpaceInfo?.roomFuncType);
            }
            return false;
        }
    });
    spaceTreeFiltersMap.value = tempMap;
});

const beforeConfirmCallback = spaces => {
    if (Array.isArray(spaces) && !spaces.length) {
        $Message.error({ title: i18n.global.t('meos_control_web.please_select_at_least_one_object') });
        return false;
    }
    return true;
};

const options = ref([
    {
        label: i18n.global.t('meos_control_web.building'),
        value: OBJECT_SELECT_TYPE.BUILDING,
        disabled: false
    },
    {
        label: i18n.global.t('meos_control_web.floor'),
        value: OBJECT_SELECT_TYPE.FLOOR,
        disabled: false
    },
    {
        label: i18n.global.t('meos_control_web.space_type'),
        value: OBJECT_SELECT_TYPE.ROOM_FUNC_TYPE,
        disabled: false
    },
    {
        label: i18n.global.t('meos_control_web.space_object'),
        value: OBJECT_SELECT_TYPE.SPACE,
        disabled: false
    }
]);
const { base } = useStore();
const { projectId, projectName } = base;
const leftTreeList = inject(leftTreeListKey);
const leftTreeRemoveCurrentIds = inject(leftTreeRemoveCurrentIdsKey);
const curSelectedConfigItem = inject(curLeftConfigObjItemKey);
const templateType = inject(curMenuIdKey);

const addObjectSelection = defineModel('object-selection', { type: Object });
const hasFillEditId = defineModel('has-fill-edit-id', { type: Boolean });
const showSelect = inject('showSelect');
const requiredFields = inject('requiredFields');

const showArchitecture = ref(false);
const showFloor = ref(false);
const showSpaceType = ref(false);
const showSpaceObject = ref(false);
const spaceTreeData = ref([]);
const spaceTreeIds = ref([]);
const spaceTreeLoading = ref(false);

const unpack = ref(false);
const unpackText = ref(i18n.global.t('meos_control_web.expand'));
const content = ref([]);
const architectureTemporarily = ref([]);
const floorTemporarily = ref([]);
const spaceTypeTemporarily = ref([]);
const spaceDefaultSelectedData = ref([]);
const textRef = ref(null); //获取元素高度ref
const textRefScrollHeight = ref(40);
const disabled = ref(true);
const placeholder = ref(i18n.global.t('meos_control_web.please_input_max_30_chars'));
const name = ref('');
const isClear = ref(false);
const temporaryObj = ref({
    type: '',
    content: [],
    placeholder: ''
});

const closeSpaceTypeModal = () => {
    nextTick(() => {
        showSpaceType.value = false;
    });
};
watch(
    () => [name.value, placeholder.value],
    () => {
        if (props.type === 'edit' && name.value.trim() === '' && !placeholder.value) {
            placeholder.value = curSelectedConfigItem.value.instanceNames?.slice(0, 30);
        }
        addObjectSelection.value.configGroupName =
            name.value.trim() === '' ? (placeholder.value === i18n.global.t('meos_control_web.please_input_max_30_chars') ? '' : placeholder.value) : name.value;
        addObjectSelection.value.name = name.value;
    }
);
onMounted(() => {
    textRefScrollHeight.value = textRef.value?.scrollHeight;
});

watch(
    () => content.value,
    () => {
        nextTick(() => {
            textRefScrollHeight.value = textRef.value?.scrollHeight;
        });
    }
);

watch(
    () => curSelectedConfigItem.value,
    () => {
        if (props.type === 'edit') {
            const sortedGroupName = curSelectedConfigItem?.value?.groupName;
            const sortedInstanceNames = curSelectedConfigItem?.value?.instanceNames?.slice(0, 30);
            if (sortedGroupName !== sortedInstanceNames) {
                name.value = curSelectedConfigItem?.value?.groupName;
            } else {
                placeholder.value = sortedInstanceNames;
            }

            content.value.push({
                name: curSelectedConfigItem.value.instanceNames
            });
            addObjectSelection.value.instanceIds = curSelectedConfigItem.value.relInstanceIds;

            if (curSelectedConfigItem.value.objectType === OBJECT_SELECT_TYPE.BUILDING) {
                architectureTemporarily.value = curSelectedConfigItem.value.relInstanceIds;
            } else if (curSelectedConfigItem.value.objectType === OBJECT_SELECT_TYPE.FLOOR) {
                floorTemporarily.value = curSelectedConfigItem.value.relInstanceIds;
            } else if (curSelectedConfigItem.value.objectType === OBJECT_SELECT_TYPE.ROOM_FUNC_TYPE) {
                spaceTypeTemporarily.value = curSelectedConfigItem.value.relInstanceIds;
                addObjectSelection.value.spaceFuncList = curSelectedConfigItem.value?.relInstances?.map(v => ({ name: v?.instanceName, id: v?.instanceId }));
            } else if (curSelectedConfigItem.value.objectType === OBJECT_SELECT_TYPE.SPACE) {
                spaceDefaultSelectedData.value = curSelectedConfigItem.value.relInstanceIds;
            }

            showSelect.value = true;
            options.value.forEach(item => {
                if (item.value === addObjectSelection.value.type) {
                    item.disabled = false;
                    disabled.value = false;
                } else {
                    item.disabled = true;
                }
            });

            hasFillEditId.value = true;
        } else {
            showSelect.value = false;
        }
        requiredFields.value = false;
    },
    {
        immediate: true
    }
);
const clearableFuc = () => {
    if (props.type === 'edit' && !isClear.value) {
        placeholder.value = curSelectedConfigItem.value.instanceNames?.slice(0, 30);
    }
};
const handleTreeName = (data, allSpacesSet) => {
    data.name = (data.localName || data.name) ?? '--';
    if (data?.children?.length) {
        data.children.forEach(item => {
            handleTreeName(item, allSpacesSet);
        });
    } else {
        allSpacesSet.add(data?.id);
    }
};
// 获取过滤了黑名单的建筑楼层空间数据
const getFilterBlackListTree = async () => {
    spaceTreeData.value = [];

    // 过滤仅回路服务空间的空间数据
    const { spacesInfo } = getLoopTreeIds(globalLoopList.value);
    const newTreeData = setSpaceTreeData(spacesInfo);
    const cloneData = structuredClone(newTreeData);

    const allSpacesSet = new Set();
    cloneData?.forEach(item => {
        handleTreeName(item, allSpacesSet);
    });
    let finalTree = cloneData,
        filterIds = [];
    const filteredArray = leftTreeList.value
        ?.filter(item => item?.objectType === OBJECT_SELECT_TYPE.SPACE)
        ?.flatMap(v => v?.children || [])
        ?.flatMap(v => v?.relInstanceIds || []);
    if (props.type === 'edit') {
        filterIds = leftTreeRemoveCurrentIds.value || [];
    } else {
        filterIds = [...new Set(filteredArray)];
    }
    // 过滤空间ids
    if (filterIds?.length) {
        finalTree = filterTreeByLeafIds(cloneData, { leafIds: filterIds, isExclude: true });
    }
    // spaceTreeData.value = finalTree;
    // 添加项目树根节点
    if (Array.isArray(finalTree) && finalTree?.length) {
        spaceTreeData.value = [
            {
                id: projectId || 'projectId',
                name: projectName || i18n.global.t('meos_control_web.project_name'),
                children: finalTree,
                instanceType: 'PROJECT'
            }
        ];
    }
    spaceTreeIds.value = [...allSpacesSet];
};

const SelectObjectBtn = () => {
    switch (addObjectSelection.value.type) {
        case OBJECT_SELECT_TYPE.BUILDING:
            showArchitecture.value = true;
            break;
        case OBJECT_SELECT_TYPE.FLOOR:
            showFloor.value = true;
            break;
        case OBJECT_SELECT_TYPE.ROOM_FUNC_TYPE:
            showSpaceType.value = true;
            break;
        case OBJECT_SELECT_TYPE.SPACE:
            showSpaceObject.value = true;
            // 请求树数据
            getFilterBlackListTree();
            break;
        default:
            break;
    }
};
//对象选择回显名称删除按钮
const delBtn = () => {
    showSelect.value = false;
    architectureTemporarily.value = [];
    floorTemporarily.value = [];
    spaceTypeTemporarily.value = [];
    spaceDefaultSelectedData.value = [];
    content.value = [];
    addObjectSelection.value.instanceIds = [];
    addObjectSelection.value.spaceFuncList = [];
    temporaryObj.value = {};
    placeholder.value = i18n.global.t('meos_control_web.please_input_max_30_chars');
};
const unpackBtn = () => {
    unpack.value = !unpack.value;
    unpackText.value = unpack.value ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand');
};
const changeRadio = val => {
    content.value = [];
    placeholder.value = i18n.global.t('meos_control_web.please_input_max_30_chars');
    showSelect.value = false;
    if (val === temporaryObj.value.type) {
        showSelect.value = true;
        content.value = temporaryObj.value.content;
        placeholder.value = temporaryObj.value.placeholder;
    }
};
//选择建筑确认回调
const nameObjFun = val => {
    console.log(val, props.type);
    isClear.value = true;
    architectureTemporarily.value = [];
    floorTemporarily.value = [];
    spaceTypeTemporarily.value = [];
    spaceDefaultSelectedData.value = [];
    requiredFields.value = false;
    content.value = [];
    showSelect.value = val.arr.length ? true : false;
    if (val.arr && val.arr.length) {
        val.arr.forEach(element => {
            if (val.type === 'architecture') {
                architectureTemporarily.value.push(element.id);
                temporaryObj.value.type = OBJECT_SELECT_TYPE.BUILDING;
            } else if (val.type === 'floor') {
                temporaryObj.value.type = OBJECT_SELECT_TYPE.FLOOR;
                floorTemporarily.value.push(element.id);
            } else {
                temporaryObj.value.type = OBJECT_SELECT_TYPE.ROOM_FUNC_TYPE;
                spaceTypeTemporarily.value.push(element.id);
            }
        });
        const arrays = [architectureTemporarily.value, floorTemporarily.value, spaceTypeTemporarily.value];
        addObjectSelection.value.instanceIds = arrays.find(arr => arr.length > 0) || [];
        if (val?.type === 'spaceType') {
            addObjectSelection.value.spaceFuncList = val.arr;
        }
    }
    const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });
    const sortedArr = val.arr.toSorted((a, b) => {
        return collator.compare(b?.name, a?.name);
    });
    if (val.type === 'floor') {
        let arr = [];
        if (val?.listData.length) {
            if (val?.listData.length === 1) {
                content.value = sortedArr;
                placeholder.value = sortedArr
                    ?.map(obj => obj.name)
                    ?.join('、')
                    ?.slice(0, 30);
            } else if (val?.listData.length > 1) {
                const result = Object.groupBy(sortedArr, ({ parent }) => parent.name);
                content.value = Object.entries(result)?.map(([key, v]) => {
                    return { parentName: key, v: v.map(obj => obj.name) };
                });
                arr = Object.entries(result)?.map(([key, v]) => {
                    return `${v.map(obj => obj.name).join('/')}(${key})`;
                });
                if (props.type === 'add') {
                    placeholder.value = arr?.join('、')?.slice(0, 30);
                } else {
                    placeholder.value = arr?.join('、')?.slice(0, 30);
                }
            }
        }
    } else {
        if (props.type === 'add') {
            content.value = sortedArr;
            placeholder.value = sortedArr
                ?.map(item => item.name)
                ?.join('、')
                ?.slice(0, 30);
        } else {
            content.value = sortedArr;
            placeholder.value = sortedArr
                ?.map(item => item.name)
                ?.join('、')
                ?.slice(0, 30);
        }
    }
    temporaryObj.value.content = content.value;
    temporaryObj.value.placeholder = placeholder.value;
};
const confirmSelectedSpaceObj = (spaces, relatedNodes, { successCallback }) => {
    isClear.value = true;
    const cloneIds = structuredClone(spaces?.value);
    spaceDefaultSelectedData.value = cloneIds;
    addObjectSelection.value.instanceIds = cloneIds;
    architectureTemporarily.value = [];
    floorTemporarily.value = [];
    spaceTypeTemporarily.value = [];

    const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });
    const sortedArr = relatedNodes.toSorted((a, b) => {
        return collator.compare(b?.spaceName, a?.spaceName);
    });

    content.value = sortedArr?.map(v => {
        return { name: v?.spaceName };
    });

    if (props.type === 'add') {
        placeholder.value = sortedArr
            ?.map(item => item?.spaceName)
            ?.join('、')
            ?.slice(0, 30);
    } else {
        placeholder.value = sortedArr
            ?.map(item => item?.spaceName)
            ?.join('、')
            ?.slice(0, 30);
        console.log(placeholder.value);
    }

    showSelect.value = !!cloneIds?.length;
    temporaryObj.value.type = OBJECT_SELECT_TYPE.SPACE;
    temporaryObj.value.content = content.value;
    temporaryObj.value.placeholder = placeholder.value;
    console.log(temporaryObj.value);
    successCallback?.();
};
</script>
<style lang="less" scoped>
.ObjectSelection {
    .title-item {
        padding-left: 12px;
        position: relative;
        color: var(--gray-800, #2e3742);
        height: 22px;
        line-height: 22px;

        &::after {
            position: absolute;
            top: 4px;
            left: 0;
            width: 3px;
            height: 14px;
            background: var(--blue-500);
            content: '';
        }
    }
    .card-container {
        display: flex;
        padding: 16px 12px;
        flex-direction: column;
        row-gap: 12px;

        border-radius: 4px;
        background: var(--gray-50, #f7f9fa);
    }

    .name-content {
        width: fit-content;
        padding: 6px;
        border-radius: 4px;
        background: var(--gray-200, #e8ecf0);
    }
    .h40 {
        max-height: 40px;
        overflow: hidden;
    }
    .title-obj {
        position: relative;
        .required-dot {
            color: #f55047;
            margin-left: 2px;
        }
    }

    .fork-icon:hover path {
        fill: #246fe5;
    }
}
</style>
