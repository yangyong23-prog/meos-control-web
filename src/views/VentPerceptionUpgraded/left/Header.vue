<template>
    <div
        ref="headerRef"
        :class="{
            'vent-perception-title': true,
            fcb: true,
            'viewmode-3d': headerModelView !== 'list'
        }"
    >
        <span v-if="!currentFloorObj" class="indoor-title-text fs20 fw700">{{ i18n.global.t('common.meos_home_ventilation') }}</span>
        <div v-else class="go-back-wrap">
            <span class="go-back" @click="goBack"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>
            <span class="name">
                <template v-if="buildingNum > 1 && buildingLocalName">
                    <span v-ellipsis class="building-name m-ellipsis">{{ buildingLocalName }}</span
                    >/
                </template>
                <span v-ellipsis class="m-ellipsis">{{ curFloorName }}</span>
            </span>
        </div>
        <div v-show="currentFloorObj" class="header-right">
            <div class="widget-card">
                <m-checkbox v-model="onlyShowControlledEquipmentRef" @change="onlyShowControlledEquipmentChange">{{
                    i18n.global.t('meos_control_web.only_controllable_equipment')
                }}</m-checkbox>
                <span class="box-split ml8"></span>
                <m-select
                    v-model="filterEquipmentType"
                    :max-scroll-height="362"
                    :size="184"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :prefix="i18n.global.t('meos_control_web.ventilation_equipment_colon')"
                    clearable
                    noborder
                >
                    <div class="select-explain">*通过通风设备筛选其服务的空间</div>
                    <m-option v-for="item in equipTypeOptions" :key="item.id" :value="item.id" :label="item.name"> </m-option>
                </m-select>
            </div>
            <m-select v-model="curSceneEnvParam" :options="floorEnvOptions" :prefix="i18n.global.t('meos_control_web.env_param_colon')" :clearable="false" :size="180"> </m-select>
            <div v-if="width < 1040" class="vent-new-dropdown-container">
                <m-popover :show-arrow="false" placement="bottom-end" content="" trigger="click">
                    <div class="vent-new-dropdown-text">
                        <span v-if="curSceneSelSpaceTypes.length" class="dot"></span>
                        <IconMeriActionFilter />
                    </div>
                    <template #content>
                        <div class="vent-new-dropdown-content">
                            <m-tree-select
                                v-model="curSceneSelSpaceTypes"
                                :data="spaceTypeTreesForFloor"
                                clearable
                                :size="180"
                                multiple
                                :prefix="i18n.global.t('meos_control_web.space_type_colon')"
                                searchable
                                panel-searchable
                            >
                            </m-tree-select>
                            <!-- 搜索组建 -->
                            <MapSearch
                                :spaces="allSpaces"
                                :equips="allEquips"
                                :width="180"
                                :max-height="488"
                                :space-filter-fn="spaceFilterFn"
                                :equip-filter-fn="equipFilterFn"
                                :loading="dyncDataLoading || loading"
                                :current-floor-tag="false"
                                @choose="chooseObj"
                            ></MapSearch>
                        </div>
                    </template>
                </m-popover>
            </div>
            <m-tree-select
                v-if="width >= 1040"
                v-model="curSceneSelSpaceTypes"
                :data="spaceTypeTreesForFloor"
                clearable
                :size="180"
                multiple
                :prefix="i18n.global.t('meos_control_web.space_type_colon')"
                searchable
                panel-searchable
            >
            </m-tree-select>
            <!-- 搜索组建 -->
            <MapSearch
                v-if="width >= 1040"
                :spaces="allSpaces"
                :equips="allEquips"
                :width="180"
                :max-height="488"
                :space-filter-fn="spaceFilterFn"
                :equip-filter-fn="equipFilterFn"
                :loading="dyncDataLoading || loading"
                :current-floor-tag="false"
                @choose="chooseObj"
            ></MapSearch>
        </div>
        <HeaderModelSwitch
            v-if="hasData"
            v-show="!currentFloorObj"
            class="header-model-switch-container"
            :default-tab="headerModelView"
            :disabled-id="headerModelSwitchDisabledId"
            :disabled-tips="i18n.global.t('meos_control_web.model_loading')"
            @grid-tab-change="onGridTabChange"
        />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import { IconMeriActionFilter } from 'meri-icon';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import {
    filterEquipmentTypeKey,
    equipTypeOptionsKey,
    curSceneEnvParamKey,
    curSceneSelSpaceTypesKey,
    onlyShowControlledEquipmentKey,
    onlyShowControlledEquipmentRefKey
} from '@/views/VentPerceptionUpgraded/hooks/useHeaderHook';
import { MONITORING_CONTROL_TYPE } from '@/views/VentPerceptionUpgraded/variables';
import { getEquipTypeId, getEquipTypeList } from '@/views/VentPerceptionUpgraded/utils';
import {
    headerModelViewKey,
    mapAllLoadedKey,
    currentFloorObjInjectKey,
    dyncDataLoadingKey,
    spaceTypeTreesKey,
    getSpacesByFloorIdKey,
    loadingKey,
    floorFromKey,
    getEquipsByFloorIdKey,
    floorEnvOptionsKey,
    hasDataKey
} from '@/views/VentPerceptionUpgraded/hooks/useBaseHook';
import HeaderModelSwitch from '@/views/Common/HeaderModelSwitch.vue';
import { IconMeriComponentChevronLeft } from 'meri-icon';
const emits = defineEmits(['grid-tab-change', 'search-choose-obj']);
const headerRef = ref();
const { width, height } = useElementSize(headerRef);
const headerModelView = inject(headerModelViewKey);
const spaceTypeTrees = inject(spaceTypeTreesKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const curSceneEnvParam = inject(curSceneEnvParamKey);
const floorFrom = inject(floorFromKey);
const floorEnvOptions = inject(floorEnvOptionsKey);
const equipTypeOptions = inject(equipTypeOptionsKey);
const dyncDataLoading = inject(dyncDataLoadingKey);
const loading = inject(loadingKey);
const getSpacesByFloorId = inject(getSpacesByFloorIdKey);
const getEquipsByFloorId = inject(getEquipsByFloorIdKey);
const curSceneSelSpaceTypes = inject(curSceneSelSpaceTypesKey);
const hasData = inject(hasDataKey);
const selectValue = ref();
const headerModelSwitchDisabledId = computed(() => {
    return dyncDataLoading.value || loading.value ? 'model' : '';
});
const onlyShowControlledEquipment = inject(onlyShowControlledEquipmentKey);
const onlyShowControlledEquipmentRef = inject(onlyShowControlledEquipmentRefKey);
const filterEquipmentType = inject(filterEquipmentTypeKey);

const buildingLocalName = computed(() => {
    if (currentFloorObj.value) {
        return `${currentFloorObj.value.buildingName || '--'}`;
    }
    return '';
});
const allSpaces = computed(() => {
    return getSpacesByFloorId(currentFloorObj.value?.id);
});
const allEquips = computed(() => {
    return getEquipsByFloorId(currentFloorObj.value?.id);
});

const spaceTypeTreesForFloor = ref([]);

const computeSpaceTrees = () => {
    const roomFuncTypes = new Set();
    allSpaces.value.map(space => {
        if (space.roomFuncType) {
            roomFuncTypes.add(space.roomFuncType);
        }
    });
    const res = [];
    const tree = structuredClone(unref(spaceTypeTrees));
    const deal = node => {
        if (roomFuncTypes.has(node.id)) {
            node.valid = true;
        }
        if (node.children) {
            let nodevalid = !!node.valid;
            for (let i = node.children.length - 1; i >= 0; i--) {
                const cvalid = deal(node.children[i]);
                if (cvalid) {
                    nodevalid = true;
                } else {
                    node.children.splice(i, 1);
                }
            }
            node.valid = nodevalid;
        }

        return !!node.valid;
    };
    if (tree && tree.length) {
        for (let i = tree.length - 1; i >= 0; i--) {
            const valid = deal(tree[i]);
            if (!valid) {
                tree.splice(i, 1);
            }
        }
    }
    spaceTypeTreesForFloor.value = tree;
};

watch(
    () => currentFloorObj.value?.id,
    () => {
        computeSpaceTrees();
    },
    {
        immediate: true
    }
);

const buildingNum = computed(() => {
    return xplantindoorenvStore().buildingData?.length;
});
const onlyShowControlledEquipmentChange = state => {
    onlyShowControlledEquipmentRef.value = state;
    onlyShowControlledEquipment.value = state === 'checked' ? true : false;
};

const curFloorName = computed(() => {
    const n = currentFloorObj?.value?.floorLocalName || currentFloorObj?.value?.localId || currentFloorObj?.value?.localName || '--';
    return n ? i18n.global.t('meos_control_web.floor_num', { floor: n }) : '';
});

const chooseObj = (obj, type) => {
    emits('searchChooseObj', obj, type);
};

const floorView = computed(() => {
    return !!currentFloorObj.value?.id;
});
const spaceFilterFn = spaceData => {
    let flag = true;
    if (filterEquipmentType.value) {
        const equipTypes = getEquipTypeList(spaceData.relObjects);
        if (!equipTypes?.find(equipType => equipType?.id === filterEquipmentType.value)) {
            flag = false;
        }
    }
    return flag;
};

const equipFilterFn = equipData => {
    let flag = true;
    const equipType = getEquipTypeId(equipData);
    if (filterEquipmentType.value && filterEquipmentType.value !== equipType) {
        flag = false;
    }
    if (flag && floorView.value && onlyShowControlledEquipment.value && equipData.monitoringSurveillanceStatus !== MONITORING_CONTROL_TYPE.MEASURABLE_CONTROLLABLE) {
        flag = false;
    }
    return flag;
};
const goBack = () => {
    currentFloorObj.value = null;
    if (floorFrom.value === 'dashboard') {
        headerModelView.value = 'list';
        floorFrom.value = '';
    }
};
const onGridTabChange = item => {
    headerModelView.value = item;
    floorFrom.value = '';
    emits('grid-tab-change', item);
};
</script>
<style lang="less" scoped>
.vent-new-dropdown-container {
    padding: 0 8px;
    .vent-new-dropdown-text {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: var(--blue-500);
        position: relative;
        display: flex;
        align-items: center;
        .dot {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: var(--blue-500);
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(50%, -50%);
            border: 1px solid #fff;
        }
    }
}
.vent-new-dropdown-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 8px;
}
.select-explain {
    color: #8b949e;
    font-size: 12px;
    text-align: center;
}
.vent-perception-title {
    padding: 0;
    width: 100%;
    height: 48px;
    padding-bottom: 16px;
    z-index: 99;
    display: flex;
    justify-content: space-between;
    &.viewmode-3d {
        height: 32px;
        padding-bottom: 0px;
    }
    .indoor-title-text {
        z-index: 99;
        gap: 4px;
        .title-name {
            color: var(--gray-600);
        }
        .title-value {
            font-weight: 700;
        }
        .title-line {
            color: var(--gray-400);
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
        white-space: nowrap;
        color: @grey-900;
        z-index: 20;

        .go-back {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            &:hover {
                background-color: #c4c9cf80;
            }
        }

        .line {
            width: 1px;
            height: 16px;
            background-color: @grey-400;
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
        z-index: 99;
        width: fit-content;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        position: relative;
        .widget-card {
            border-radius: 4px;
            white-space: nowrap;
            background: #fff;
            border: 1px solid @grey-400;

            display: flex;
            width: fit-content;
            height: 32px;
            padding: 8px 0px 8px 8px;
            align-items: center;
            .box-split {
                width: 1px;
                height: 14px;
                opacity: 0.4;
                background: var(--gray-500, #8b949e);
            }
            :deep(.m-select) {
                height: 24px;
            }
            &:hover {
                border: 1px solid @blue-600;
            }
        }
        .floor-checkbox {
            height: 32px;
            padding: 0 12px;
            border-radius: 4px;
            background: var(--Grey-Grey-0, #fff);
            /* Shadow/shadow-1 */
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
            /deep/.m-checkbox-label {
                display: inline-block;
                overflow: hidden;
                height: 20px;
                width: unset;
            }
        }
        .abnormal-checkbox {
            width: 104px;
            height: 32px;
            border-radius: 4px;
            background: var(--Grey-Grey-0, #fff);
            /* Shadow/shadow-1 */
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
        }

        .header-box-tab {
            position: relative;
            :deep(> .m-tabs.m-tabs-segment) {
                width: 217px;
                .m-tabs-item {
                    flex: 1;
                    padding: 0 10px;
                }
                .m-tabs-name {
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

            .absolute-env-attr-warp {
                position: absolute;
                right: 0;
                top: calc(100% + 8px);

                &.quality {
                    right: 34px;
                    .triangle-icon {
                        left: 28px;
                    }
                }

                &.shceduling {
                    right: 0;
                    .triangle-icon {
                        left: 42px;
                    }
                }

                .triangle-icon {
                    display: inline-block;
                    position: absolute;
                    top: -11px;
                    left: 0;
                }

                :deep(.m-tabs) {
                    .m-tabs-list {
                        background-color: #fff;
                        padding: 6px;
                        border-radius: 2px;
                        .m-tabs-item {
                            width: 54px;
                            text-align: center;
                            &--active {
                                border-radius: 4px;
                                background: var(--blue-100);
                            }
                            .m-tabs-name {
                                min-width: none;
                            }
                        }
                    }
                }
            }
            .triangle-tab {
                border-radius: 4px;
                box-shadow: 0px 3px 12px 0px rgba(27, 33, 41, 0.12), 0px 0.5px 3px 0px rgba(27, 33, 41, 0.08);
                :deep(.m-tabs.m-tabs-segment) {
                    padding: 1px;
                    width: 126px;
                    .m-tabs-item {
                        flex: 1;
                    }
                    .m-tabs-body {
                        padding-right: 0 !important;

                        .m-tabs-trigger {
                            display: none !important;
                        }
                    }
                }
                :deep(.m-tabs-list) {
                    border-radius: 4px !important;
                }
            }
        }
    }
}
</style>
