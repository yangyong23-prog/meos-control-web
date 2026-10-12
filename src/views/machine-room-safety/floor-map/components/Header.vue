<template>
    <div class="floor-header-container">
        <div class="floor-header-left">
            <template v-if="showHeaderTitle">
                <span class="header-icon" @click="goBack"><IconMeriComponentChevronLeft :size="20" :color="'#626C78'" /></span>
                <span class="header-title">
                    <span v-ellipsis :class="['building-name', 'm-ellipsis']">
                        {{ buildingLocalName }}
                    </span>
                    <span>/</span>
                    <span v-ellipsis :class="['floor-name', 'm-ellipsis']">{{ curFloorName }}</span>
                </span>
            </template>
        </div>
        <div class="floor-header-right">
            <MapSearch
                :key="staticSpacesIds"
                :spaces="staticSpaces"
                :space-filter-fn="spaceFilterFn"
                :current-floor-tag="false"
                :loading="spacesLoading"
                :only-type="searchType"
                @choose="chooseObj"
                @hover-obj="hoverObj"
                @unhover-obj="unhoverObj"
            ></MapSearch>
            <div class="filter-item-wrap">
                <m-checkbox v-model="activeOnlyMagRiskModel">{{ i18n.global.t('meos_control_web.risk_only_act_managed') }}</m-checkbox>
            </div>
            <div class="only-room-type-filter fc">
                <m-checkbox v-model="onlyMachineRoom">{{ i18n.global.t('meos_control_web.only_machine_room') }} </m-checkbox>
                <template v-if="onlyMachineRoom === 'checked'">
                    <div style="background-color: var(--gray-400); width: 2px; height: 14px; margin-left: 8px"></div>
                    <m-select
                        ref="Select1"
                        v-model="curSelectedRoomTypes"
                        multiple
                        :options="roomTypes"
                        :prefix="i18n.global.t('meos_control_web.machine_room_type_colon')"
                        clearable
                    ></m-select>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import { useRouter } from 'vue-router';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import { curSelectedRoomTypesInjectKey, curSelectedSpaceInjectKey, curStaticSpacesInjectKey, onlyMachineRoomInjectKey } from '../../constant/injectKey';
import { activeOnlyMagRiskModelKey, currentFloorInfoKey, currentFloorMachineRoomSpacesKey } from '../../hooks/useBaseDataHook';
import { uniqBy } from 'lodash';
const emits = defineEmits(['go-back', 'hover-space', 'unhover-space', 'choose-space']);
const currentFloorMachineRoomSpaces = inject(currentFloorMachineRoomSpacesKey);
const onlyMachineRoom = inject(onlyMachineRoomInjectKey);

const roomTypes = computed(() => {
    const arr =
        currentFloorMachineRoomSpaces.value?.map(v => ({
            name: v.roomFuncTypeName,
            id: v.roomFuncType
        })) || [];
    return uniqBy(arr, 'id');
});
const router = useRouter();
const currentFloorObj = inject(currentFloorInfoKey);
const activeOnlyMagRiskModel = inject(activeOnlyMagRiskModelKey);
const curFloorName = computed(() => {
    return currentFloorObj?.value?.localName ?? '--';
});
const buildingLocalName = computed(() => {
    return currentFloorObj?.value?.buildingLocalName || '';
});
const showHeaderTitle = computed(() => {
    return buildingLocalName.value && curFloorName.value;
});

const curSelectedRoomTypes = inject(curSelectedRoomTypesInjectKey);

const staticSpaces = inject(curStaticSpacesInjectKey);
const staticSpacesIds = computed(() => {
    return (staticSpaces?.value || [])?.map(v => v?.id)?.join('、') || '';
});

const curSelectedSpace = inject(curSelectedSpaceInjectKey);
const spacesLoading = ref(false);
const searchType = ref('space');

const spaceFilterFn = spaceData => {
    let flag = true;
    // 只显示机房空间过滤
    const onlyMachineRoomFilter =
        onlyMachineRoom.value === 'checked' &&
        currentFloorMachineRoomSpaces.value.length > 0 &&
        !currentFloorMachineRoomSpaces.value.some(s => s.roomFuncType === spaceData.roomFuncType);

    // 空间类型过滤
    const roomfuncTypeFilter = onlyMachineRoom.value === 'checked' && curSelectedRoomTypes.value.length > 0 && !curSelectedRoomTypes.value.includes(spaceData.roomFuncType);

    // 是否需要隐藏
    flag = !(onlyMachineRoomFilter || roomfuncTypeFilter);

    return flag;
};

const goBack = () => {
    emits('go-back');
    currentFloorObj.value = null;
    router.push({
        query: {
            ...(router.currentRoute.value.query || {}),
            curFloorId: undefined
        }
    });
};

const chooseObj = obj => {
    curSelectedSpace.value = obj;
    emits('choose-space', obj);
};
const hoverObj = obj => {
    emits('hover-space', obj);
};
const unhoverObj = () => {
    emits('unhover-space');
};
</script>

<style lang="less" scoped>
.floor-header-container {
    display: flex;
    width: 100%;
    padding: 16px 0px 0px 12px;

    .floor-header-left {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 4px;
        z-index: 20;
        overflow: hidden;
    }

    .header-icon {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
    }

    .header-title {
        color: @grey-800;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px;

        display: flex;
        flex: 1;
        overflow: hidden;
        text-align: center;
        padding: 0px 9px 0px 0px;

        .building-name {
            min-width: 40px;
        }

        .floor-name {
            flex-shrink: 0;
            min-width: 16px;
            max-width: calc(100% - 74px);
        }
    }

    .floor-header-right {
        display: flex;
        align-items: center;
        justify-content: center;
        column-gap: 8px;
        z-index: 20;
    }
}
.filter-item-wrap {
    display: flex;
    height: 32px;

    align-items: center;
    gap: 4px;

    padding: 5px 12px;

    border-radius: 4px;
    background: var(--Grey-Grey-0, #fff);

    /* Shadow/shadow-1 */
    // box-shadow: 0 2px 10px 0 rgba(27, 33, 41, 0.1);
    border: 1px solid var(--gray-400);
}
.only-room-type-filter {
    background-color: var(--gray-0);
    padding: 0 8px;
    border-radius: 4px;
    border: 1px solid var(--gray-400);
    height: 32px;
    :deep(.m-select-inner) {
        border: none;
    }
}
</style>
