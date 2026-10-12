<template>
    <div :class="{ 'header-warp': true, 'with-right-padding': currentModel === 'model' }" :style="{ background: headerBg }">
        <div v-if="floorView && currentModel === 'model'" class="go-back-wrap" @click="goBack">
            <span v-if="!onlyShowMap" class="go-back"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>

            <span class="name">
                <template v-if="currentBuidingList.length > 1 && buildingLocalName">
                    <span v-ellipsis class="building-name m-ellipsis">{{ buildingLocalName }}</span
                    >/
                </template>
                <span v-ellipsis class="m-ellipsis">{{ curFloorName }}</span>
            </span>
        </div>
        <div v-else class="header-icon-warp">
            <!-- <img src="@/assets/images/common/ac-class-icon.png" style="width: 44px; height: 44px" alt="" /> -->
            <span class="header-name">{{ i18n.global.t('meos_control_web.security_monitor') }}</span>
        </div>

        <div class="header-right">
            <template v-if="currentModel === 'model'">
                <template v-if="showVideoGroup && currentFloorObj?.id">
                    <m-select
                        v-model="selectedCameraTypes"
                        clearable
                        :size="200"
                        :menu-size="auto"
                        :options="curFloorCameraTypes"
                        :max-scroll-height="362"
                        multiple
                        has-confirm
                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                        :prefix="i18n.global.t('meos_control_web.equipment_type_colon')"
                    ></m-select>
                    <m-select
                        v-model="selectedFuncTypes"
                        clearable
                        :size="220"
                        :menu-size="auto"
                        :options="curFloorSpaceFuncTypes"
                        :max-scroll-height="362"
                        multiple
                        has-confirm
                        has-check-all
                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                        :prefix="i18n.global.t('meos_control_web.space_function_type_colon')"
                    >
                    </m-select>
                </template>
                <template v-else-if="!showVideoGroup">
                    <div v-if="tabsOptions?.length > 0" class="header-box-tab">
                        <m-tabs v-model="currentTab" :data="tabsOptions" type="segment" size="small">
                            <template #abnormal="{ item }">
                                <div class="tab-content-warp">
                                    <div class="tab-content-warp-name">{{ item.name }}</div>
                                    <div v-if="isAbnormal" class="red-circle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                                            <circle cx="5" cy="5.71191" r="4.5" fill="#F55047" stroke="white" />
                                        </svg>
                                    </div>
                                </div>
                            </template>
                        </m-tabs>
                    </div>

                    <div v-if="currentFloorObj?.id" class="header-box-select">
                        <!-- 仅看可控设备 -->
                        <m-checkbox :model-value="onlyShowControlledEquipmentRef" @change="onlyShowControlledEquipmentChange">{{
                            i18n.global.t('meos_control_web.only_controllable_equipment')
                        }}</m-checkbox>
                        <span class="box-split ml12"></span>
                        <!-- 安防设备 -->
                        <m-tree-select
                            v-model="selectValue"
                            class="custom-select"
                            noborder
                            :prefix="i18n.global.t('meos_control_web.security_device')"
                            :data="equipFilterTreeData"
                            multiple
                            clearable
                            :size="200"
                            :menu-size="'auto'"
                            @change="treeSelect"
                        >
                        </m-tree-select>
                    </div>
                    <!-- 搜索组件 -->
                    <MapSearch
                        :spaces="validSpaces"
                        :equips="validEquips"
                        :space-filter-fn="spaceFilterFn"
                        :equip-filter-fn="equipFilterFn"
                        :current-floor-id="currentFloorObj?.id"
                        :loading="spacesAndEquipsLoading"
                        :only-type="searchOnlyType"
                        @choose="chooseObj"
                    ></MapSearch>
                </template>
            </template>
            <!-- 切换视图 -->
            <HeaderModelSwitch
                v-if="!onlyShowMap && !currentFloorObj?.id && !showVideoGroup"
                :disabled-id="disabledTabId"
                :default-tab="currentModel"
                @grid-tab-change="headerModelSwitchChange"
            />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { ACCESS_CONTROLLER, CONTROL_BAR_TAB_KEYS, CAMERA_TYPES, CAMERA_TYPE_OTHER } from '../constants/index';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import HeaderModelSwitch from '@/views/Common/HeaderModelSwitch.vue';
import { currentModelInjectKey, staticEquipsKey, staticSpacesKey } from '../constants/injectKey';
import { onlyShowMapKey } from '../hooks/useDashboard';
import { allMapDataLoadedInjectKey } from '../hooks/useSecurityGlobalData';
import { showVideoGroupMapKey, selectedCameraTypesKey, allSpaceFuncTypesKey, selectedSpaceFuncTypesKey } from '../hooks/useVideoGroup';
import { CAMERA_CLASS_CODES } from '@/constants/camera';

const props = defineProps({
    scrollTop: {
        type: Number,
        default: 0
    }
});

const isAbnormal = inject('isAbnormal');
const currentTab = inject('currentTab');
const currentFloorObj = inject('currentFloorObj');
const equipFilterTreeData = inject('equipFilterTreeData');
const filterEquipmentClass = inject('filterEquipmentClass');
const tabsOptions = inject('tabsOptions');
// 仅看可控设备
const onlyShowControlledEquipment = inject('onlyShowControlledEquipment');
const onlyShowControlledEquipmentRef = ref(onlyShowControlledEquipment?.value ? 'checked' : 'uncheck');
const spaceFilterFn = inject('spaceFilterFn');
const equipFilterFn = inject('equipFilterFn');
const staticSpaces = inject(staticSpacesKey);
const staticEquips = inject(staticEquipsKey);
const clickMapObj = inject('clickMapObj');
const spacesAndEquipsLoading = inject('spacesAndEquipsLoading');
const onlyShowMap = inject(onlyShowMapKey);

const currentModel = inject(currentModelInjectKey);
const allMapDataLoaded = inject(allMapDataLoadedInjectKey);
const showVideoGroup = inject(showVideoGroupMapKey);

const selectedCameraTypes = inject(selectedCameraTypesKey);
const allSpaceFuncTypes = inject(allSpaceFuncTypesKey);
const selectedFuncTypes = inject(selectedSpaceFuncTypesKey);

const disabledTabId = computed(() => {
    if (!allMapDataLoaded.value) return 'model';
    return '';
});

const headerBg = computed(() => {
    return currentModel.value === 'model' ? 'transparent' : props?.scrollTop ? '#DBEBFD' : 'transparent';
});

const validSpaces = computed(() => {
    return staticSpaces.value.filter(space => {
        return space?.localName;
    });
});
const validEquips = computed(() => {
    return staticEquips.value.filter(equip => {
        return equip?.localName;
    });
});
const curFloorId = computed(() => {
    return currentFloorObj?.value?.id;
});
const curFloorCameras = computed(() => {
    const res = (staticEquips.value || []).filter(equip => {
        const hasCameraType = equip?.cameraType;
        const isCamera = equip?.classCode && CAMERA_CLASS_CODES.includes(equip?.classCode);
        const isInCurFloor = equip?.floorId === curFloorId.value;
        if (curFloorId.value) {
            return hasCameraType && isCamera && isInCurFloor;
        }
        return hasCameraType && isCamera;
    });

    return res;
});
const curFloorCameraTypes = computed(() => {
    const cameras = curFloorCameras.value;
    const allTypes = [...new Set(cameras.map(v => v?.cameraType))];
    // 过滤其他摄像头类型
    return allTypes
        .filter(v => `${v}` !== CAMERA_TYPE_OTHER)
        .map(item => {
            return {
                id: item,
                name: CAMERA_TYPES[item] || ''
            };
        });
});

const curFloorSpaceFuncTypes = computed(() => {
    const cameras = curFloorCameras.value;
    const allTypes = cameras
        .map(v => {
            return v?.roomFuncTypes || [];
        })
        ?.filter(v => v?.length)
        ?.flat();
    const noRepeatTypes = [...new Set(allTypes)];
    return noRepeatTypes.map(item => {
        const curTypeItem = allSpaceFuncTypes?.value?.find(v => v?.code === item) || {};
        return {
            id: item,
            name: curTypeItem?.name || ''
        };
    });
});

// 是门禁控制器
const isAccessController = classCode => {
    return ACCESS_CONTROLLER.includes(classCode?.toUpperCase());
};
// 仅看可控设备切换
const onlyShowControlledEquipmentChange = state => {
    onlyShowControlledEquipmentRef.value = state;
    onlyShowControlledEquipment.value = state === 'checked' ? true : false;
};
const goBack = () => {
    if (currentFloorObj.value.fromDashboard) {
        currentModel.value = 'list';
    }
    currentFloorObj.value = null;
};
const callToggleWidth = inject('callToggleWidth');
const headerModelSwitchChange = id => {
    callToggleWidth(true);
    currentModel.value = id;
};

const selectValue = ref([]);

const treeSelect = treeData => {
    const checkedIds = new Set(treeData);
    let arr = [];
    equipFilterTreeData.value.forEach(g => {
        arr = arr.concat(
            g.children?.filter(obj => {
                return checkedIds.has(obj.id);
            })
        );
    });
    filterEquipmentClass.value = arr;
};

const chooseObj = obj => {
    if (clickMapObj) {
        clickMapObj(obj);
    }
};

const searchOnlyType = computed(() => {
    return !floorView.value && currentTab.value !== CONTROL_BAR_TAB_KEYS.ABNORMAL ? 'space' : null;
});
const currentBuidingList = inject('currentBuidingList');
const floorView = computed(() => {
    return !!currentFloorObj?.value?.id;
});
const buildingLocalName = computed(() => {
    if (currentFloorObj?.value?.id) {
        const floor = currentBuidingList?.value?.filter(build => {
            return build?.floorList?.find(item => item.id === currentFloorObj.value.id)?.localName;
        });
        if (floor.length) {
            return `${floor[0]?.localName}`;
        }
    }
    return '';
});
const curFloorName = computed(() => {
    if (currentFloorObj?.value) {
        return i18n.global.t('meos_control_web.floor_num', {
            floor: currentFloorObj.value?.localName || currentFloorObj.value?.floorName || currentFloorObj.value?.localId || '--'
        });
    }
    return '';
});
watch(selectValue, () => {
    if (!selectValue.value?.length) {
        filterEquipmentClass.value = [];
    }
});
watch(onlyShowControlledEquipment, () => {
    onlyShowControlledEquipmentRef.value = onlyShowControlledEquipment?.value ? 'checked' : 'uncheck';
});
watch(filterEquipmentClass, newVal => {
    if (!newVal) {
        selectValue.value = [];
    }
});
// 安防设备下拉筛选树，默认全选除了‘门禁控制器’之外的所有选项
watch(equipFilterTreeData, newVal => {
    if (newVal.length > 0) {
        const checkedIdss = [];
        newVal.forEach(n => {
            n.children?.forEach(c => {
                if (!isAccessController(c.classCode)) {
                    checkedIdss.push(c.id);
                }
            });
        });
        selectValue.value = checkedIdss;
    }
});
watch(
    () => curFloorId?.value,
    () => {
        // 切换楼层，清空设备类型选中、空间功能类型选中
        nextTick(() => {
            selectedCameraTypes.value = [];
            selectedFuncTypes.value = [];
        });
    }
);
</script>
<style lang="less" scoped>
.header-warp {
    padding: 16px 0px 0px 16px;
    margin-right: 16px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: var(--z-index-system-graph-header);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    .header-icon-warp {
        display: flex;
        align-items: center;
        column-gap: 6px;
        flex-shrink: 0;
        .header-name {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px;
        }
    }

    .go-back-wrap {
        flex: 1;
        overflow: hidden;
        display: inline-flex;
        padding: 0px 16px 0px 4px;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
        border-radius: 4px;
        font-size: 14px;
        color: @grey-900;
        z-index: 20;

        .go-back {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
        }

        .name {
            display: flex;
            flex: 1;
            overflow: hidden;
            color: @grey-800;
            text-align: center;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            .building-name {
                min-width: 20px;
            }
        }
    }

    .header-right {
        // width: 100%;
        width: fit-content;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        position: relative;

        .header-box-tab {
            :deep(.m-tabs.m-tabs-segment) {
                .m-tabs-item {
                    flex: 1;
                    padding: 0 10px;
                }
                .m-tabs-name {
                    max-width: 168px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    min-width: 10px;
                    line-height: 22px;
                }
                .m-tabs-body {
                    padding-right: 0 !important;
                    .m-tabs-trigger {
                        display: none !important;
                    }
                }
            }
            .tab-content-warp {
                display: flex;
                align-items: center;
                position: relative;
                &-name {
                    max-width: 168px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .red-circle {
                    position: absolute;
                    top: -9px;
                    right: -11px;
                }
            }
        }
        .header-box-select {
            height: 32px;
            border-radius: 4px;
            background: #fff;
            padding: 8px 4px 8px 12px;
            border: 1px solid var(--gray-400);
            display: flex;
            align-items: center;
            :deep(.m-checkbox-label) {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 140px;
            }
            :deep(.m-select-inner-prefix) {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 120px;
            }
            .box-split {
                width: 1px;
                height: 14px;
                opacity: 0.4;
                background: var(--gray-500, #8b949e);
            }
            :deep(.m-select) {
                height: 24px;
            }
        }
    }
}
.with-right-padding {
    padding-right: 16px;
    margin-right: 0px;
}
</style>
