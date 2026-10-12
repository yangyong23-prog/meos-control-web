<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        modal-class-name="black-list-modal"
        type="default"
        :title="i18n.global.t('meos_control_web.blacklist_config')"
        :need-scrollbar="false"
        :width="1260"
        :height="642"
        :z-index="10"
        :max-height="642"
        :escable="false"
        @close="closeModal"
    >
        <template #content>
            <div v-if="submitLoading" class="h100 update-img fcc" style="flex-direction: column">
                <img src="../../../assets/imgs/update.gif" width="238px" height="238px" />
                <div style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.data_uploading_wait') }}</div>
            </div>
            <m-scrollbar v-else class="content-wrap">
                <div class="tips">{{ i18n.global.t('meos_control_web.quality_exclusion_rules') }}</div>
                <div class="rule-type fcc">
                    <m-button type="link" size="medium" @click="showEquipServiceSpaceModal = true">{{ i18n.global.t('meos_control_web.by_ac_equipment_space_service') }}</m-button>
                    <div class="line"></div>
                    <m-button type="link" size="medium" @click="showSystemServiceSpaceModal = true">{{ i18n.global.t('meos_control_web.by_system_service_space') }}</m-button>
                    <div class="line"></div>
                    <m-button type="link" size="medium" @click="showIOTModal = true">{{ i18n.global.t('meos_control_web.by_iot_monitoring') }}</m-button>
                    <div class="line"></div>
                    <m-button type="link" size="medium" @click="showFloorModal = true">{{ i18n.global.t('meos_control_web.by_building_floor') }}</m-button>
                    <div class="line"></div>
                    <m-button type="link" size="medium" @click="showSpaceTypeModal = true">{{ i18n.global.t('meos_control_web.by_space') }}</m-button>
                </div>
                <template v-if="activeRulesCount">
                    <div class="rule-type-list">
                        <div class="rule-type-list-title">{{ i18n.global.t('meos_control_web.blacklist_config_rules') }}</div>
                        <div class="rule-type-list-content" :class="combineClass">
                            <div v-if="params.isEquipToServiceSpace" class="rule-type-list-item">
                                <div class="fcb">
                                    <div class="rule-type-title fc fw600">{{ i18n.global.t('meos_control_web.by_ac_equipment_space_service') }}</div>
                                    <div>
                                        <m-button type="link" size="medium" style="margin-right: 12px" @click="showEquipServiceSpaceModal = true">{{
                                            i18n.global.t('common.edit')
                                        }}</m-button>
                                        <m-button type="link" size="medium" @click="deleteFun('equipServiceSpace')">{{ i18n.global.t('common.delete') }}</m-button>
                                    </div>
                                </div>
                                <div class="rule-type-content fc">
                                    {{ i18n.global.t('meos_control_web.system_will_find_controllable_end_device_spaces_as_control_spaces_and_blacklist_others') }}
                                </div>
                            </div>
                            <div v-if="params.systemIds.length" class="rule-type-list-item">
                                <div class="fcb">
                                    <div class="rule-type-title fc fw600">{{ i18n.global.t('meos_control_web.by_system_service_space') }}</div>
                                    <div>
                                        <m-button type="link" size="medium" style="margin-right: 12px" @click="showSystemServiceSpaceModal = true">{{
                                            i18n.global.t('common.edit')
                                        }}</m-button>
                                        <m-button type="link" size="medium" @click="deleteFun('systemIds')">{{ i18n.global.t('common.delete') }}</m-button>
                                    </div>
                                </div>
                                <div class="rule-type-content">
                                    <div v-for="(row, index) in renderGroupSystem" :key="index" class="row-item">
                                        <div class="row-title">{{ row?.name || '--' }}</div>
                                        <div class="row-content">{{ row.childrenNames || '--' }}</div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="params.nonInstantiationCodes.length > 0" class="rule-type-list-item">
                                <div class="fcb">
                                    <div class="rule-type-title fc fw600">{{ i18n.global.t('meos_control_web.by_iot_monitoring') }}</div>
                                    <div>
                                        <m-button type="link" size="medium" style="margin-right: 12px" @click="showIOTModal = true">{{ i18n.global.t('common.edit') }}</m-button>
                                        <m-button type="link" size="medium" @click="deleteFun('nonInstantiationCodes')">{{ i18n.global.t('common.delete') }}</m-button>
                                    </div>
                                </div>
                                <div class="rule-type-content fc">
                                    {{ params.nonInstantiationCodes.map(item => IOTType[item]?.name).join('、') }}
                                </div>
                            </div>
                            <div v-if="params.inFloorIds.length > 0" class="rule-type-list-item">
                                <div class="fcb">
                                    <div class="rule-type-title fc fw600">{{ i18n.global.t('meos_control_web.by_building_floor') }}</div>
                                    <div>
                                        <m-button type="link" size="medium" style="margin-right: 12px" @click="showFloorModal = true">{{ i18n.global.t('common.edit') }}</m-button>
                                        <m-button type="link" size="medium" @click="deleteFun('inFloorIds')">{{ i18n.global.t('common.delete') }}</m-button>
                                    </div>
                                </div>
                                <div class="rule-type-content">
                                    <div v-for="(value, key) in floorIdsByBuildNameGroup(params.inFloorIds)" :key="key" class="build-item">
                                        <div class="build-item-title fc">{{ value?.name }}</div>
                                        <div class="floor-content fc">
                                            {{ value.floorNames.join('、') }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="params.roomFuncTypes.length > 0" class="rule-type-list-item">
                                <div class="fcb">
                                    <div class="rule-type-title fc fw600">{{ i18n.global.t('meos_control_web.by_space') }}</div>
                                    <div>
                                        <m-button type="link" size="medium" style="margin-right: 12px" @click="showSpaceTypeModal = true">{{
                                            i18n.global.t('common.edit')
                                        }}</m-button>
                                        <m-button type="link" size="medium" @click="deleteFun('roomFuncTypes')">{{ i18n.global.t('common.delete') }}</m-button>
                                    </div>
                                </div>
                                <div class="rule-type-content">
                                    <div class="fc" style="min-height: 32px; padding: 5px 0">
                                        {{ params.roomFuncTypes.map(item => roomFuncTypesMap.get(item)?.name).join('、') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-left: 20px">
                        {{ i18n.global.t('meos_control_web.based_on_above_rules') }}
                        <m-button type="link" @click="delayViewInnerModal">{{ i18n.global.t('meos_control_web.view_edit_blacklist_object') }}</m-button>
                    </div>
                    <div v-if="params.inSpaceIds.length || params.removeSpaceIds.length" style="margin-left: 20px; margin-top: 8px">
                        <div v-if="params.inSpaceIds.length" class="space-box">
                            <div class="space-box-text fcc">
                                {{ i18n.global.t('meos_control_web.add_spaces_below_to_blacklist') }}&nbsp;
                                <m-tips :content="i18n.global.t('meos_control_web.obj_cleared_on_rule_edit')" theme="darkTransparent">
                                    <IconMeriComponentDialogLinear :size="14" color="#626C78" />
                                </m-tips>
                            </div>
                            <div class="space-box-ids fc">
                                <div v-for="item in params.inSpaceIds" :key="item" class="space-item in-space">{{ buildFloorMap.get(item)?.name || '--' }}</div>
                            </div>
                        </div>
                        <div v-if="params.removeSpaceIds.length" class="space-box" style="margin-top: 8px">
                            <div class="space-box-text fcc">
                                {{ i18n.global.t('meos_control_web.remove_spaces_below_from_blacklist') }}&nbsp;
                                <m-tips :content="i18n.global.t('meos_control_web.obj_cleared_on_rule_edit')" theme="darkTransparent">
                                    <IconMeriComponentDialogLinear :size="14" color="#626C78" />
                                </m-tips>
                            </div>
                            <div class="space-box-ids fc">
                                <div v-for="item in params.removeSpaceIds" :key="item" class="space-item remove-space">{{ buildFloorMap.get(item)?.name || '--' }}</div>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-else style="height: 500px" class="fcc">
                    <m-illustration
                        :title="i18n.global.t('meos_control_web.no_content')"
                        type="noContent"
                        :content="i18n.global.t('meos_control_web.click_above_button_for_blacklist_config')"
                    />
                </div>
            </m-scrollbar>
        </template>
        <template #footer>
            <div class="footer-btn-group">
                <div class="btns">
                    <m-button type="default" :disabled="submitLoading" @click.stop="closeModal">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" :loading="submitLoading" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </div>
        </template>
    </m-modal>
    <TreeWithMapForSpaceSelectModal
        v-if="showBlackListModal"
        v-model="showInnerModal"
        :default-selected="defaultSelected"
        :title="i18n.global.t('meos_control_web.view_edit_blacklist_object')"
        :tree-data-loading="treeLoading"
        :tree-data="treeData"
        :open-clear-cache="true"
        @submit="submitInnerModal"
        @close="delayCloseModal"
    ></TreeWithMapForSpaceSelectModal>
    <EquipToSpaceModal v-if="showEquipServiceSpaceModal" @close="showEquipServiceSpaceModal = false" @confirm="confirmEquipToSpace"></EquipToSpaceModal>
    <SystemToSpaceModal
        v-if="showSystemServiceSpaceModal"
        :data="params.systemIds"
        :tree-data="treeSystemListData"
        @close="showSystemServiceSpaceModal = false"
        @confirm="confirmSystemToSpace"
    ></SystemToSpaceModal>
    <IOTModal v-if="showIOTModal" :data="params.nonInstantiationCodes" @close="showIOTModal = false" @confirm="confirmIOT" />
    <FloorModal v-if="showFloorModal" :tree-data="treeBuildFloorFilterData" :data="params.inFloorIds" @close="showFloorModal = false" @confirm="confirmFloor" />
    <SpaceTypeModal v-if="showSpaceTypeModal" :tree-data="treeRoomFuncTypesData" :data="params.roomFuncTypes" @close="showSpaceTypeModal = false" @confirm="confirmSpaceType" />
</template>

<script setup>
import { IconMeriComponentDialogLinear } from 'meri-icon';
import EquipToSpaceModal from './EquipToSpaceModal.vue';
import SystemToSpaceModal from './SystemToSpaceModal.vue';
import TreeWithMapForSpaceSelectModal from '@/views/Common/TreeWithMapForSpaceSelectModal/index.vue';
import IOTModal from './IOTModal.vue';
import FloorModal from './FloorModal.vue';
import SpaceTypeModal from './SpaceTypeModal.vue';
import { MMessageBox } from 'meri-plus';
import { addRules, getBlacklist, getListSpaceIdsByRule, getTreeBuildingFloorSpace, treeSpaceRoomFuncTypes } from '@/apis/DemandManagementHomeNew';
import { listObjectsByTackValueLogic, getKnowledgeListClassCodes } from '@/apis/public';
import { SUCCESSCODE } from '@/utils/globalVariables';
import useLoading from '@/hooks/useLoading';
import { difference, isEqual } from 'lodash';
import { useSuccessMessage } from '@/utils/tools';
import useStore from '@/store';
import i18n from '@/localization';

const IOTType = {
    tdb: {
        code: 'tdb',
        name: i18n.global.t('meos_control_web.space_with_undelivered_temperature_data')
    },
    co2: {
        code: 'co2',
        name: i18n.global.t('meos_control_web.space_without_co2_data')
    },
    rh: {
        code: 'rh',
        name: i18n.global.t('meos_control_web.space_without_rh_data')
    },
    relativePressureDiffToOtherSpace: {
        code: 'relativePressureDiffToOtherSpace',
        name: i18n.global.t('meos_control_web.space_with_undelivered_pressure_diff_data')
    }
};
const props = defineProps({
    templateType: {
        type: String,
        default: ''
    },
    templateDemandType: {
        type: String,
        default: ''
    }
});

let buildFloorMap = new Map(),
    roomFuncTypesMap = new Map();
const emits = defineEmits(['close', 'after-submit']);

const { base } = useStore();
const { projectId, projectName } = base;
const defaultSelected = ref([]);
const showModal = ref(false);
const showBlackListModal = ref(false);
const showInnerModal = ref(false);
const lastRulesSpaceIds = ref([]);
const treeData = ref([]);
const treeLoading = ref(false);

const showEquipServiceSpaceModal = ref(false);
const showSystemServiceSpaceModal = ref(false);
const showIOTModal = ref(false);
const showFloorModal = ref(false);
const showSpaceTypeModal = ref(false);

const treeSystemListsMap = ref(new Map());
const treeSystemListData = ref([]);
const treeBuildFloorFilterData = ref([]);
const treeBuildFloorSpaceData = ref([]);
const treeRoomFuncTypesData = ref([]);
const params = ref({
    nonInstantiationCodes: [], // IOT 规则数据
    inFloorIds: [],
    roomFuncTypes: [],
    inSpaceIds: [],
    removeSpaceIds: [],
    isEquipToServiceSpace: false, // 是否设备服务空间,
    systemIds: [] // 服务空间的系统IDS
});

const delayTimer = ref(null);

const activeRulesCount = computed(() => {
    const isIotActive = params.value.nonInstantiationCodes.length > 0;
    const isFloorActive = params.value.inFloorIds.length > 0;
    const isRoomFuncTypesActive = params.value.roomFuncTypes.length > 0;
    const isSystemActive = params.value.systemIds.length > 0;
    const conditions = [isIotActive, isFloorActive, isRoomFuncTypesActive, params.value.isEquipToServiceSpace, isSystemActive];
    const activeCount = conditions.filter(Boolean).length;
    return activeCount;
});

const combineClass = computed(() => {
    if (activeRulesCount.value < 2) return '';
    return isChinese?.value ? 'combine' : 'combineEn';
});
const renderGroupSystem = computed(() => {
    const list = params.value.systemIds.map(item => {
        const info = treeSystemListsMap.value.get(item);
        return {
            id: item,
            name: info?.name,
            parentName: info?.parentName
        };
    });
    const groupByList = Object.groupBy(list, item => item.parentName);
    return Object.values(groupByList).map(item => {
        return {
            name: item[0].parentName,
            childrenNames: item.map(v => v.name)?.join('、')
        };
    });
});

const delayViewInnerModal = () => {
    showBlackListModal.value = true;
    // 延迟打开显示动画
    nextTick(() => {
        viewInnerModal();
    });
};

const delayCloseModal = () => {
    nextTick(() => {
        showBlackListModal.value = false;
    });
};

const handleInnerData = data => {
    // 若无移入移出空间数据，则记录最新规则空间数据
    if (!params.value?.removeSpaceIds?.length && !params.value?.inSpaceIds?.length) {
        lastRulesSpaceIds.value = data;
    }
    defaultSelected.value = data;
    treeLoading.value = false;
    const cloneData = structuredClone(treeBuildFloorSpaceData.value);
    if (cloneData?.length) {
        // 添加项目树根节点
        treeData.value = [
            {
                id: projectId || 'projectId',
                name: projectName || i18n.global.t('meos_control_web.project_name'),
                children: cloneData,
                instanceType: 'PROJECT'
            }
        ];
    }
};

const viewInnerModal = () => {
    try {
        showInnerModal.value = true;
        treeLoading.value = true;
        // 延迟异步请求，不阻塞打开显示动画
        if (delayTimer.value) {
            clearTimeout(delayTimer.value);
        }
        delayTimer.value = setTimeout(() => {
            getListSpaceIdsByRule(getParams())
                .then(res => {
                    const { data } = res || {};
                    handleInnerData(data);
                })
                .finally(() => {
                    treeLoading.value = false;
                });
        }, 300);
    } catch {
        treeLoading.value = false;
        showInnerModal.value = false;
    }
};

const submitLoading = ref(false);

const floorIdsByBuildNameGroup = ids => {
    const build = {};
    const floors = ids.map(item => buildFloorMap.get(item));
    floors.forEach(item => {
        if (build[item.buildId]) {
            build[item.buildId].floorNames.push(item.name);
        } else {
            build[item.buildId] = {
                name: item.buildName,
                floorNames: [item.name]
            };
        }
    });
    return build;
};
const submitInnerModal = (selectedSpaces, relatedNodes, { successCallback }) => {
    const lastIds = lastRulesSpaceIds.value;
    const removeSpaceList = difference(lastIds, selectedSpaces.value);
    const addSpaceList = difference(selectedSpaces.value, lastIds);
    params.value.inSpaceIds = structuredClone(addSpaceList);
    params.value.removeSpaceIds = structuredClone(removeSpaceList);
    successCallback();
    showInnerModal.value = false;
};

const closeModal = () => {
    submitLoading.value = false;
    showModal.value = false;
    nextTick(() => {
        emits('close');
    });
};
const deleteFun = code => {
    MMessageBox({
        type: 'danger',
        title: i18n.global.t('meos_control_web.acknowledge_delete'),
        confirmButtonText: i18n.global.t('common.delete'),
        message: i18n.global.t('meos_control_web.deleted_content_irreversible')
    })
        .then(() => {
            if (code === 'equipServiceSpace') {
                params.value.isEquipToServiceSpace = false;
            } else {
                params.value[code] = [];
            }
            clearSpaceIds();
        })
        .catch(() => {});
};
const clearSpaceIds = () => {
    params.value.inSpaceIds = [];
    params.value.removeSpaceIds = [];
};

const confirmEquipToSpace = () => {
    showEquipServiceSpaceModal.value = false;
    if (params.value.isEquipToServiceSpace === true) {
        return;
    }
    clearSpaceIds();
    params.value.isEquipToServiceSpace = true;
};

const confirmSystemToSpace = val => {
    showSystemServiceSpaceModal.value = false;
    if (isEqual(val, params.value.systemIds)) {
        return;
    }
    clearSpaceIds();
    params.value.systemIds = val;
};

const confirmIOT = val => {
    showIOTModal.value = false;
    // useSuccessMessage();
    if (isEqual(val, params.value.nonInstantiationCodes)) {
        return;
    }
    clearSpaceIds();
    params.value.nonInstantiationCodes = val;
};
const confirmFloor = val => {
    showFloorModal.value = false;
    // useSuccessMessage();
    if (isEqual(val, params.value.inFloorIds)) {
        return;
    }
    clearSpaceIds();
    params.value.inFloorIds = val;
};
const confirmSpaceType = val => {
    showSpaceTypeModal.value = false;
    // useSuccessMessage();
    if (isEqual(val, params.value.roomFuncTypes)) {
        return;
    }
    clearSpaceIds();
    params.value.roomFuncTypes = val;
};
const getParams = () => {
    const paramsData = {
        demandTemplateType: props.templateDemandType,
        configData: {}
    };
    if (params.value.isEquipToServiceSpace) {
        paramsData.configData.AIR_TERMINAL_SERVICE_SPACE = {};
    }
    if (params.value.systemIds.length) {
        paramsData.configData.SYSTEM_SERVICE_SPACE = {};
        paramsData.configData.SYSTEM_SERVICE_SPACE.systemIds = params.value.systemIds;
    }
    if (params.value.nonInstantiationCodes.length) {
        paramsData.configData.INSTANTIATE_RULE = {};
        paramsData.configData.INSTANTIATE_RULE.nonInstantiationCodes = params.value.nonInstantiationCodes;
    }
    if (params.value.inFloorIds.length) {
        paramsData.configData.IN_FLOOR = {};
        paramsData.configData.IN_FLOOR.inFloors = params.value.inFloorIds.map(item => ({ floorId: item }));
    }
    if (params.value.roomFuncTypes.length) {
        paramsData.configData.ROOM_FUNC_TYPE = {};

        paramsData.configData.ROOM_FUNC_TYPE.roomFuncTypes = params.value.roomFuncTypes.map(item => ({ roomFuncType: item }));
    }
    if (params.value.inSpaceIds.length) {
        paramsData.configData.INTO_SPACES = {};

        paramsData.configData.INTO_SPACES.spaces = params.value.inSpaceIds.map(item => ({ spaceId: item }));
    }
    if (params.value.removeSpaceIds.length) {
        paramsData.configData.REMOVE_SPACES = {};

        paramsData.configData.REMOVE_SPACES.spaces = params.value.removeSpaceIds.map(item => ({ spaceId: item }));
    }
    return paramsData;
};
const confirm = async () => {
    if (loading.value) {
        closeModal();
    }
    submitLoading.value = true;
    try {
        await addRules(getParams());
        useSuccessMessage();
        closeModal();
        emits('after-submit');
    } catch (error) {
        console.log(error);
    } finally {
        submitLoading.value = false;
    }
};

const handleTreeSystemData = async () => {
    const queryClassCodes = ['ACAC', 'ACCC', 'ACCI', 'ACAH', 'ACCH'];

    const promiseOne = listObjectsByTackValueLogic({
        takeValueLogic: {
            queryParam: {
                classCode: queryClassCodes,
                withColumns: ['id', 'localName', 'classCode'],
                orderCustoms: [
                    {
                        column: 'localName'
                    }
                ]
            }
        }
    });
    const promiseTwo = getKnowledgeListClassCodes({
        classCodes: queryClassCodes
    });
    const results = await Promise.allSettled([promiseOne, promiseTwo]);
    let curList = [],
        curSubList = [];
    results.forEach((res, index) => {
        if (res.status === 'fulfilled') {
            if (res.value.code === SUCCESSCODE) {
                if (index === 0) {
                    curSubList = res.value.data;
                } else {
                    curList = res.value.data;
                }
            }
        }
    });

    if (Array.isArray(curList)) {
        const sortList = curList.toSorted((a, b) => {
            const aSort = queryClassCodes.findIndex(c => c === a.code);
            const bSort = queryClassCodes.findIndex(c => c === b.code);
            const aOrder = aSort === -1 ? 999 : aSort;
            const bOrder = bSort === -1 ? 999 : bSort;
            return aOrder - bOrder;
        });
        const tempTree = [];
        sortList.forEach(item => {
            const children = curSubList.filter(subItem => subItem.classCode === item.code);
            const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });
            const sortChildren = children.toSorted((a, b) => collator.compare(a.localName, b.localName)).map(v => ({ ...v, name: v.localName }));
            if (sortChildren.length) {
                sortChildren.forEach(child => {
                    if (treeSystemListsMap.value) {
                        treeSystemListsMap.value.set(child.id, { ...child, parentName: item.name });
                    }
                });
                tempTree.push({ id: item.code, name: item.name, children: sortChildren });
            }
        });
        treeSystemListData.value = tempTree;
        return tempTree;
    }
    return [];
};
const handleTreeBuildingFloorData = async () => {
    buildFloorMap = new Map();
    const { data, code } = await getTreeBuildingFloorSpace({
        templateType: props.templateType,
        queryFloor: true,
        querySpace: true,
        filterInBlacklistedSpace: false,
        filterInShieldedSpace: false
    });
    if (code === SUCCESSCODE) {
        const cloneData = handelData(structuredClone(data));
        // 添加项目树根节点
        if (cloneData?.length) {
            treeBuildFloorFilterData.value = [
                {
                    id: projectId || 'projectId',
                    name: projectName || i18n.global.t('meos_control_web.project_name'),
                    children: cloneData,
                    instanceType: 'PROJECT',
                    open: true
                }
            ];
        }

        treeBuildFloorSpaceData.value = handelData(structuredClone(data), false);
    }
};
const handelData = (data, delSpaces = true) => {
    data.forEach(element => {
        element.name = (element.localName || element.name) ?? '--';
        buildFloorMap.set(element.id, { id: element.id, name: element.name });
        // element.open = true;
        element.children.forEach(floor => {
            floor.name = (floor.localName || floor.name) ?? '--';
            floor.buildingName = element.name;
            buildFloorMap.set(floor.id, { id: floor.id, name: floor.name, buildId: element.id, buildName: element.name });
            // floor.open = true;
            floor.children.forEach(space => {
                space.name = (space.localName || space.name) ?? '--';
                space.floorName = floor.name;
                buildFloorMap.set(space.id, { id: space.id, name: space.name, floorId: floor.id, floorName: floor.name, buildId: element.id, buildName: element.name });
            });
            delSpaces && delete floor.children;
        });
    });
    return data;
};
const handleTreeSpaceRoomFuncTypes = async () => {
    roomFuncTypesMap = new Map();
    const { data } = await treeSpaceRoomFuncTypes({ templateType: props.templateType, filterBlacklistSpace: false });
    traverseSpaceData(data);

    if (data?.length) {
        // 添加项目树根节点
        treeRoomFuncTypesData.value = [
            {
                id: projectId || 'projectId',
                name: projectName || i18n.global.t('meos_control_web.project_name'),
                children: data,
                instanceType: 'PROJECT',
                open: true
            }
        ];
    }
};
function traverseSpaceData(data) {
    data.forEach(item => {
        item.id = item.funcType;
        item.name = item.funcTypeName;
        // item.open = true;
        roomFuncTypesMap.set(item.id, { id: item.id, name: item.name });
        if (item.children && item.children.length > 0) {
            traverseSpaceData(item.children);
        }
    });
}
const queryBlackData = async () => {
    const res = await getBlacklist({ demandTemplateType: props.templateDemandType });
    const { configData } = res?.data || {};
    params.value.isEquipToServiceSpace = !!configData?.AIR_TERMINAL_SERVICE_SPACE;
    params.value.systemIds = configData?.SYSTEM_SERVICE_SPACE?.systemIds || [];
    params.value.nonInstantiationCodes = configData?.INSTANTIATE_RULE?.nonInstantiationCodes || [];
    params.value.inFloorIds =
        configData?.IN_FLOOR?.inFloors?.map(floor => {
            buildFloorMap.set(floor.floorId, { id: floor.floorId, name: floor.floorLocalName, buildId: floor.buildingId, buildName: floor.buildingLocalName });
            return floor.floorId;
        }) || [];
    params.value.roomFuncTypes =
        configData?.ROOM_FUNC_TYPE?.roomFuncTypes?.map(item => {
            roomFuncTypesMap.set(item.roomFuncType, { id: item.roomFuncType, name: item.roomFuncTypeName });
            return item.roomFuncType;
        }) || [];
    params.value.inSpaceIds = configData?.INTO_SPACES?.spaces?.map(item => item.spaceId) || [];
    params.value.removeSpaceIds = configData?.REMOVE_SPACES?.spaces?.map(item => item.spaceId) || [];
    return configData;
};
const getBaseData = async () => {
    openLoading();
    await Promise.all([handleTreeBuildingFloorData(), handleTreeSpaceRoomFuncTypes(), handleTreeSystemData()]);
    const configData = await queryBlackData();
    if (configData) {
        const { REMOVE_SPACES, INTO_SPACES, ...rest } = configData || {};
        const res = await getListSpaceIdsByRule({
            demandTemplateType: props.templateDemandType,
            configData: { ...rest }
        });
        const { data } = res || {};
        // 获取已存在规则的spaceIds
        if (Array.isArray(data)) {
            lastRulesSpaceIds.value = data;
        }
    }

    closeLoading();
};
const { openLoading, closeLoading, loading } = useLoading(
    'content-wrap',
    '#f2f4f6',
    'ball',
    {
        width: '100px',
        height: '100px'
    },
    0
);
const isChinese = computed(() => {
    return i18n.global.locale.startsWith('zh');
});
onMounted(() => {
    showModal.value = true;
    getBaseData();
});
</script>

<style lang="less" scoped>
.content-wrap {
    width: 100%;
    height: 100%;
    background-color: var(--gray-100);
    :deep(.m-scrollbar__content) {
        padding: 20px 24px;
    }
    .rule-type {
        border-radius: 8px;
        background-color: var(--gray-0);
        height: 48px;
        margin: 12px 0;
        .line {
            width: 1px;
            height: 12px;
            background-color: #d9d9d9;
            margin: 0 10px;
        }
    }
    .rule-type-list {
        &-title {
            margin-bottom: 12px;
        }
        &-content {
            border-radius: 8px;
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 12px;
            position: relative;
            &.combine,
            &.combineEn {
                border-left: 1px dashed var(--gray-400);
                &::before {
                    content: attr(data-content);
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: -9px;
                    width: 18px;
                    height: 22px;
                    background-color: var(--gray-300);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 3px;
                }
            }

            &.combine {
                &::before {
                    content: '并';
                    left: -9px;
                    width: 18px;
                }
            }

            &.combineEn {
                &::before {
                    content: 'and';
                    left: -14px;
                    width: 28px;
                }
            }

            .rule-type-list-item {
                background-color: var(--gray-0);
                border-radius: 8px;
                padding: 12px;
                .rule-type-title {
                    position: relative;
                    height: 22px;
                    &::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        left: 0;
                        display: block;
                        border-left: 3px solid var(--blue-500);
                        height: 14px;
                    }
                    padding-left: 9px;
                }
                .rule-type-content {
                    margin-top: 8px;
                    padding: 4px 12px;
                    background-color: var(--gray-50);
                    border-radius: 4px;
                }
                .row-item {
                    display: flex;
                    gap: 12px;

                    & + .row-item {
                        margin-top: 8px;
                    }

                    .row-title {
                        padding-block: 5px;
                        width: 120px;
                        color: var(--gray-600, #626c78);
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 22px;
                    }
                    .row-content {
                        padding-block: 5px;
                        flex: 1;
                        color: var(--gray-900, #1b2129);
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 22px;
                    }
                }
            }
            .build-item {
                display: flex;
                height: 32px;
                padding: 5px 0;
                &-title {
                    color: var(--gray-600);
                    margin-right: 12px;
                    width: fit-content;
                }
                .floor-content {
                    flex: 1;
                    height: 100%;
                }
            }
        }
    }
    .space-box {
        gap: 10px;
        display: flex;
        &-text {
            width: 162px;
            color: var(--gray-600);
            align-self: start;
            padding-top: 1px;
            svg {
                min-width: 14px;
                max-width: 14px;
            }
        }
        &-ids {
            width: calc(100% - 162px);
            gap: 4px;
            flex-wrap: wrap;
            .space-item {
                display: flex;
                align-items: center;
                padding: 1px 4px;
                border-radius: 4px;
                cursor: default;
                &.in-space {
                    background-color: var(--blue-100);
                }
                &.remove-space {
                    background-color: var(--red-100);
                }
            }
        }
    }
}

.tips {
    color: @grey-500;
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}

.footer-btn-group {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btns {
        display: flex;
        align-items: center;
    }
}
</style>
<style lang="less">
.black-list-modal.m-modal-bg .m-modal-main {
    .m-modal-main-content {
        padding: 0;
    }
}
</style>
