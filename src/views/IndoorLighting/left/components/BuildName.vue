<template>
    <div class="fcc build-number" style="gap: 12px">
        {{ build?.name }}
        <template v-for="item in list" :key="item.name">
            <div v-show="item.list.length" class="fs16 fw500 number-item" @click="openStaticlDrawer(item.type, build.localName, INSTANCE_TYPE.BUILDING, build.id)">
                <span style="color: var(--gray-600)">{{ item.aliasName || item.name }}:</span>
                <InfoCodeNumber v-model="item.list" :objects="loops" v-bind="item" class="fw700" :class="[item.list.length ? 'has-value' : 'no-value']" />
            </div>
        </template>
        <div v-show="abnormalList?.length" class="fs16 fw500">
            <span style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.abnormal_event') }}:</span>
            <span style="color: var(--red-500)">{{ abnormalList.length }}</span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getAbnormalIdsByBuildingIdKey, getLoopListByBuildingIdKey } from '../../hooks/useBaseHook';
import { INFOCODE, INSTANCE_TYPE } from '../../variables';
import InfoCodeNumber from '@/views/IndoorLighting/components/StatusNumber/InfoCodeNumber.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { uniqBy } from 'lodash';
import { openStaticlDrawerKey } from '../../hooks/useDrawerCommon';
const openStaticlDrawer = inject(openStaticlDrawerKey);
const { getAbnormalEventsList } = DockSingleton.getInstance();

const props = defineProps({
    build: {
        type: Object,
        default: () => ({})
    }
});
const list = ref([
    {
        ...INFOCODE.localRemoteStatus0,
        list: []
    },
    {
        ...INFOCODE.controlDeviationStatus1,
        list: []
    },
    {
        ...INFOCODE.controlDeviationStatus2,
        list: []
    },
    {
        ...INFOCODE.runStatusNull,
        list: []
    }
]);
const getLoopListByBuildingId = inject(getLoopListByBuildingIdKey);
const loops = computed(() => getLoopListByBuildingId(props.build.id) || []);
const getAbnormalIdsByBuildingId = inject(getAbnormalIdsByBuildingIdKey);
const abnormalIds = computed(() => getAbnormalIdsByBuildingId(props.build.id) || []);
const abnormalList = computed(() => {
    const arr = getAbnormalEventsList(abnormalIds.value);
    return uniqBy(arr, 'exceptionEventId');
});
</script>
<style lang="less" scoped>
.build-number {
    .has-value {
        color: #ff992d;
    }
    .no-value {
        color: var(--gray-400);
    }

    .number-item {
        cursor: pointer;
        color: var(--gray-600);
        &:hover {
            color: var(--blue-500);
            .no-value,
            .has-value {
                color: var(--blue-500);
            }
        }
    }
}
</style>
