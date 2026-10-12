<template>
    <SimpleDrawer v-model="showDrawer">
        <template #title>
            {{ title }}
        </template>
        <template #content>
            <div ref="contentContainerRef" class="hidden-container"></div>
            <template v-if="isEmpty">
                <Empty class="empty-container" />
            </template>
            <template v-else-if="isTree">
                <m-collapse v-model="collapseData" class="building-collapse-container" :hover-style="false" icon-position="left">
                    <template v-for="building in treeData" :key="building.id">
                        <m-collapse-item v-if="building?.children?.length" :id="building?.id" :title="building?.name">
                            <m-virtual-list ref="virtualListRef" :style="{ 'max-height': `${height - 16 - 38}px` }" :item-size="80" item-resizable :items="building?.children">
                                <template #default="{ item: space }">
                                    <div class="subItem-row">
                                        <div
                                            :class="{ 'card-row': true, 'hover-active': space.id === currentHoverSpace?.id, 'is-map-not-loaded': !mapAllLoaded }"
                                            @mouseenter="handleMouse('enter', space)"
                                            @mouseleave="handleMouse('leave', space)"
                                            @click="goToFloor(space)"
                                        >
                                            <div class="card-header">
                                                <div class="header-left">
                                                    <m-tips
                                                        :content="
                                                            mapAllLoaded
                                                                ? i18n.global.t('meos_control_web.jump_to_floor_to_view_details')
                                                                : i18n.global.t('meos_control_web.loading_please_wait_alt')
                                                        "
                                                        theme="darkTransparent"
                                                        trigger="hover"
                                                    >
                                                        <span class="space-title">{{ space?.spaceName || '--' }}</span>
                                                    </m-tips>

                                                    <m-tag size="small" color="#1B4ACC" bg-color="#D9EBFF">{{ space?.floorLocalId }}</m-tag>
                                                </div>
                                                <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                                                    <div v-if="space.id === currentHoverSpace?.id" class="header-right" @click.stop="jumpTo(space.id)">
                                                        <EquipHoverIcon></EquipHoverIcon>
                                                    </div>
                                                </m-tips>
                                            </div>
                                            <div class="inner-cards">
                                                <div v-ellipsis class="col-item m-ellipsis">
                                                    <span class="col-label">{{ i18n.global.t('meos_control_web.schedule_status_colon') }}</span>
                                                    <span class="col-value">
                                                        <template v-if="props.dynamic">
                                                            <getDemandTargetInfoStr v-bind="space"></getDemandTargetInfoStr>
                                                        </template>
                                                        <template v-else>
                                                            <span :style="{ color: DEMAND_TARGET_TEXT_COLOR_MAP[space.scheduleStatus] }">{{
                                                                DEMAND_TARGET_TEXT_NAME_MAP[space.scheduleStatus] || '--'
                                                            }}</span>
                                                        </template>
                                                    </span>
                                                </div>
                                                <div v-if="false" v-ellipsis class="col-item m-ellipsis">
                                                    <span class="col-label">{{ i18n.global.t('meos_control_web.control_target_colon_item', { item: envTitle }) }}</span>
                                                    <span class="col-value">
                                                        <template v-if="props.dynamic"> <getControlTargetInfoStr v-bind="space"></getControlTargetInfoStr> </template>
                                                        <template v-else> {{ space?.targetValue || '--' }} </template>
                                                    </span>
                                                </div>
                                                <div v-if="space?.showIotValue" v-ellipsis class="col-item m-ellipsis">
                                                    <span class="col-label">{{ i18n.global.t('meos_control_web.current_item', { item: envTitle }) + `：` }}</span>
                                                    <span class="col-value">
                                                        <template v-if="props.dynamic">
                                                            <getIotValueStr v-bind="space"></getIotValueStr>
                                                        </template>
                                                        <template v-else>{{ space?.iotValue || '--' }}</template>
                                                    </span>
                                                </div>
                                                <div v-if="space?.showComfortableValue" v-ellipsis class="col-item m-ellipsis">
                                                    <span class="col-label">{{ i18n.global.t('meos_control_web.comfort_range_colon') }}</span>
                                                    <span class="col-value">
                                                        <template v-if="props.dynamic"> <getComfortableValue v-bind="space"></getComfortableValue> </template>
                                                        <template v-else>
                                                            <span>{{ space?.lowerValue || '--' }}</span>
                                                            <span v-if="space?.lowerValue && space?.higherValue">~</span>
                                                            <span>{{ space?.higherValue || '--' }}</span>
                                                            <span v-if="space?.unit">{{ space?.unit }}</span>
                                                        </template>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </m-virtual-list>
                        </m-collapse-item>
                    </template>
                </m-collapse>
            </template>
            <template v-else>
                <m-scrollbar>
                    <div class="schedule-drawer-content">
                        <m-virtual-list ref="virtualListRef" :style="{ 'max-height': `${height - 16}px` }" :item-size="80" item-resizable :items="treeData">
                            <template #default="{ item: space }">
                                <div class="subItem-row">
                                    <div
                                        :class="{ 'card-row': true, 'hover-active': space.id === currentHoverSpace?.id, 'is-map-not-loaded': !mapAllLoaded }"
                                        @mouseenter="handleMouse('enter', space)"
                                        @mouseleave="handleMouse('leave', space)"
                                        @click="goToFloor(space)"
                                    >
                                        <div class="card-header">
                                            <div class="header-left">
                                                <m-tips
                                                    :content="
                                                        mapAllLoaded
                                                            ? i18n.global.t('meos_control_web.jump_to_floor_to_view_details')
                                                            : i18n.global.t('meos_control_web.loading_please_wait_alt')
                                                    "
                                                    theme="darkTransparent"
                                                    trigger="hover"
                                                >
                                                    <span class="space-title">{{ space?.spaceName || '--' }}</span>
                                                </m-tips>

                                                <m-tag size="small" color="#1B4ACC" bg-color="#D9EBFF">{{ space?.floorLocalId }}</m-tag>
                                            </div>
                                            <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                                                <div v-if="space.id === currentHoverSpace?.id" class="header-right" @click.stop="jumpTo(space.id)">
                                                    <EquipHoverIcon></EquipHoverIcon>
                                                </div>
                                            </m-tips>
                                        </div>
                                        <div class="inner-cards">
                                            <div v-ellipsis class="col-item m-ellipsis">
                                                <span class="col-label">{{ i18n.global.t('meos_control_web.schedule_status_colon') }}</span>
                                                <span class="col-value">
                                                    <template v-if="props.dynamic">
                                                        <getDemandTargetInfoStr v-bind="space"></getDemandTargetInfoStr>
                                                    </template>
                                                    <template v-else>
                                                        <span :style="{ color: DEMAND_TARGET_TEXT_COLOR_MAP[space.scheduleStatus] }">{{
                                                            DEMAND_TARGET_TEXT_NAME_MAP[space.scheduleStatus] || '--'
                                                        }}</span>
                                                    </template>
                                                </span>
                                            </div>
                                            <div v-if="space?.showTargetValue" v-ellipsis class="col-item m-ellipsis">
                                                <span class="col-label">{{ i18n.global.t('meos_control_web.control_target_colon_item', { item: envTitle }) }}</span>
                                                <span class="col-value">
                                                    <template v-if="props.dynamic"> <getControlTargetInfoStr v-bind="space"></getControlTargetInfoStr> </template>
                                                    <template v-else> {{ space?.targetValue || '--' }} </template>
                                                </span>
                                            </div>
                                            <div v-if="space?.showIotValue" v-ellipsis class="col-item m-ellipsis">
                                                <span class="col-label">{{ i18n.global.t('meos_control_web.current_item', { item: envTitle }) + `：` }}</span>
                                                <span class="col-value">
                                                    <template v-if="props.dynamic">
                                                        <getIotValueStr v-bind="space"></getIotValueStr>
                                                    </template>
                                                    <template v-else>{{ space?.iotValue || '--' }}</template>
                                                </span>
                                            </div>
                                            <div v-if="space?.showComfortableValue" v-ellipsis class="col-item m-ellipsis">
                                                <span class="col-label">{{ i18n.global.t('meos_control_web.comfort_range_colon') }}</span>
                                                <span class="col-value">
                                                    <template v-if="props.dynamic"> <getComfortableValue v-bind="space"></getComfortableValue> </template>
                                                    <template v-else>
                                                        <span>{{ space?.lowerValue || '--' }}</span>
                                                        <span v-if="space?.lowerValue && space?.higherValue">~</span>
                                                        <span>{{ space?.higherValue || '--' }}</span>
                                                        <span v-if="space?.unit">{{ space?.unit }}</span>
                                                    </template>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </m-virtual-list>
                    </div>
                </m-scrollbar>
            </template>
        </template>
    </SimpleDrawer>
</template>

<script setup lang="jsx">
import i18n from '@/localization';
import SimpleDrawer from '@/views/lightingControl/components/simple-drawer/index.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import Empty from '@/components/common/Empty.vue';
import EquipHoverIcon from '@/assets/svg/equipHoverIcon.svg';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { getAuthParamsString } from '@/utils/envUtils';
import DockSingleton from '@/hooks/responsiveDock';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { DEMAND_TARGET_TEXT_COLOR_MAP, DEMAND_TARGET_TEXT_NAME_MAP, SELECT_SOURCE } from '../constants/constant';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { flattenedSpacesInjectKey } from '@/views/ACOperationControl/hooks/useDashboard';
import { useQiankunElementSize } from '@/hooks/useQiankunElementSize';

import { currentFloorObjKey, mapAllLoadedKey, floorFromeKey, headerModelViewKey, selectObjectInjectKey } from '@/views/ACOperationControl/injectKeys';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    env: {
        type: String,
        default: ''
    },
    data: {
        type: Array,
        default: () => []
    },
    dynamic: {
        type: Boolean,
        default: false
    },
    isModelView: {
        type: Boolean,
        default: false
    }
});

const showDrawer = defineModel({
    type: Boolean,
    default: false
});

const currentFloorObj = inject(currentFloorObjKey);
const mapAllLoaded = inject(mapAllLoadedKey);
const floorFrome = inject(floorFromeKey);
const headerModelView = inject(headerModelViewKey);
const flattenSpaces = inject(flattenedSpacesInjectKey);
const selectObject = inject(selectObjectInjectKey);

const currentHoverSpace = ref(null);
const contentContainerRef = ref(null);
const { height } = useQiankunElementSize(contentContainerRef);

const isEmpty = computed(() => {
    return !props.data?.length;
});

const isTree = computed(() => {
    return xplantindoorenvStore().buildingData.length > 1;
});

const collapseData = ref([]);

watch(
    () => props.data,
    () => {
        if (props.data) {
            const allIds = new Set();
            props.data.forEach(cur => {
                const { buildingId } = cur || {};
                allIds.add(buildingId);
            });
            collapseData.value = [...allIds];
        }
    },
    { immediate: true }
);

const envTitle = computed(() => {
    if (props.env === 'tdb') {
        return i18n.global.t('meos_control_web.temperature');
    } else if (props.env === 'cO2') {
        return i18n.global.t('meos_control_web.co2_concentration');
    } else if (props.env === 'rH') {
        return i18n.global.t('meos_control_web.humidity');
    }
    return '';
});

const treeData = computed(() => {
    if (props.data?.length) {
        if (isTree.value) {
            // 空间数据按建筑分组
            const result = props.data.reduce((acc, cur) => {
                const { floorId, buildingId, buildingName } = cur || {};
                if (!currentFloorObj?.value?.id || floorId === currentFloorObj?.value?.id) {
                    if (acc[buildingId]) {
                        acc[buildingId].children.push(cur);
                    } else {
                        acc[buildingId] = {
                            id: buildingId,
                            name: buildingName,
                            children: [cur]
                        };
                    }
                }

                return acc;
            }, {});
            for (let k in result) {
                // 空间数据根据楼层排序
                result[k].children.sort((a, b) => b.floorSequenceId - a.floorSequenceId);
            }
            return Object.values(result);
        } else {
            return props.data;
        }
    }
    return [];
});

const { getIotData, getCustomInfo } = DockSingleton.getInstance();

const getDemandTargetInfoStr = spaceData => {
    const { infoCode, infoCodeType } = spaceData?.curSpaceUpperEnv?.secondGroupSecondInfo || {};
    const targetLabelObj = getCustomInfo(spaceData.id, infoCodeType, infoCode);

    if (targetLabelObj?.dataValue) {
        const { dataSource } = targetLabelObj;
        const labelObj = (dataSource || []).find(item => item.code === targetLabelObj.dataValue);
        if (labelObj) {
            const { name } = labelObj || {};
            let finalName = name;
            if (labelObj.code === 'TARGET_VALUE') {
                finalName = i18n.global.t('meos_control_web.un_schedule');
            }
            return <span style={{ color: DEMAND_TARGET_TEXT_COLOR_MAP[targetLabelObj.dataValue] }}>{finalName}</span>;
        }
    }
    return <>--</>;
};

const getControlTargetInfoStr = spaceData => {
    const controlAim = spaceData?.curSpaceUpperEnv?.secondGroupThirdInfo?.infoCode;
    const valObj = controlAim ? getIotData(spaceData.id, controlAim) : null;
    const iotValObj = getIotData(spaceData.id, props.env);

    if (valObj?.dataValue?.toString()) {
        return (
            <>
                <span>{valObj?.dataValue || '--'}</span>
                <span>{iotValObj?.unit || '--'}</span>
            </>
        );
    }
    return <>--</>;
};

const getIotValueStr = spaceData => {
    const iotValObj = getIotData(spaceData.id, props.env);

    if (iotValObj?.dataValue?.toString()) {
        return (
            <>
                <span>{iotValObj?.dataValue || '--'}</span>
                <span>{iotValObj?.unit || '--'}</span>
            </>
        );
    }
    return <>--</>;
};

const getComfortableValue = spaceData => {
    const iotValObj = getIotData(spaceData.id, props.env);
    const limitRangeObj = getCustomInfo(spaceData.id, 'DEMAND_CONFIG', props.env);

    const { lowerComfortSeasonLimitValue, upperComfortSeasonLimitValue, carbonDioxideLimitValue, carbonDioxideUpperLimitValue } = limitRangeObj || {};

    if ((props.env === 'tdb' || props.env === 'rH') && lowerComfortSeasonLimitValue && upperComfortSeasonLimitValue) {
        return (
            <>
                <span>{lowerComfortSeasonLimitValue}</span>
                <span>~</span>
                <span>{upperComfortSeasonLimitValue}</span>
                <span>{iotValObj?.unit || '--'}</span>
            </>
        );
    } else if (props.env === 'cO2' && carbonDioxideLimitValue && carbonDioxideUpperLimitValue) {
        return (
            <>
                <span>{carbonDioxideLimitValue}</span>
                <span>~</span>
                <span>{carbonDioxideUpperLimitValue}</span>
                <span>{iotValObj?.unit || '--'}</span>
            </>
        );
    }
    return <>--</>;
};

const handleMouse = (type, space) => {
    if (type === 'enter') {
        currentHoverSpace.value = space;
    } else {
        currentHoverSpace.value = null;
    }
};

const goToFloor = space => {
    if (!mapAllLoaded.value) {
        return;
    } else {
        showDrawer.value = false;
        const floorObj = getFloorInfoByFloorId(space.floorId) || {};
        const spaceInfo = flattenSpaces?.value?.find(item => item.id === space.id) || {};

        if (!props.isModelView) {
            headerModelView.value = 'model';
            floorFrome.value = 'dashboard';
        }
        currentFloorObj.value = { ...floorObj, buildingLocalName: spaceInfo?.buildingLocalName };
        nextTick(() => {
            selectObject(spaceInfo, SELECT_SOURCE.SCHEDULE);
        });
    }
};

const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
</script>

<style lang="less" scoped>
.empty-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

.schedule-drawer-content {
    display: flex;
    flex-direction: column;
    padding-left: 24px;
    padding-right: 24px;
    padding-block: 8px;
}

.building-collapse-container {
    display: flex;
    flex-direction: column;
    // padding-left: 24px;
    // padding-right: 24px;
    padding-block: 8px;
    padding-inline: 0px;

    :deep(.m-collapse-item__header) {
        width: fit-content;
        height: 38px;
        padding-left: 24px;
        padding-top: 8px;
        padding-bottom: 2px;

        color: @grey-500;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
    }

    .subItem-row {
        padding-inline: 24px;
    }
}

.card-row {
    width: 100%;
    display: flex;
    padding: 16px 12px;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;

    border-bottom: 1px solid @grey-200;

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        .header-left {
            display: flex;
            align-items: flex-start;
            column-gap: 4px;
        }

        .space-title {
            color: @grey-900;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: normal;
        }

        .header-right {
            position: absolute;
            top: 0;
            right: 0;
            cursor: pointer;
        }
    }

    .inner-cards {
        display: grid;
        grid-template-columns: repeat(2, minmax(min-content, 180px));
        row-gap: 8px;
        column-gap: 10px;
    }

    .col-item {
        max-width: 180px;
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: normal;
    }
}

.hover-active {
    border-bottom: 1px solid @grey-200;
    background: rgba(196, 201, 207, 0.3);

    .card-header {
        padding-right: 20px;

        .space-title {
            color: @blue-500;
        }
    }
}

.is-map-not-loaded {
    cursor: not-allowed;

    .space-title {
        cursor: not-allowed;
    }
}

.hidden-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
}
</style>
