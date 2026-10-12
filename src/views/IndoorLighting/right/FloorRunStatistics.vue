<template>
    <m-scrollbar class="floor-run-statistics" style="padding-right: 16px">
        <div class="statistics-title m-t-n mb16 mt16">{{ i18n.global.t('meos_control_web.run_total_switch_status') }}</div>
        <PreTotal :data="loopList" />
        <div class="statistics-title m-t-n mb16 mt16">{{ i18n.global.t('meos_control_web.run_total_abnormal') }}</div>
        <div class="abnormal-box fc" style="gap: 8px">
            <div
                v-for="item in statusList"
                v-show="item.rule !== false"
                :key="item.name"
                class="list-item"
                :class="{ 'is-active': item.id === activeData.id, [item.id]: true }"
                @click="clickStatusList(item)"
            >
                <div>
                    <InfoCodeNumber v-model="item.list" v-bind="item" v-model:rule="item.rule" :objects="loopList" class="fw600 ffCP" style="margin-left: 2px" />
                </div>
                <div v-ellipsis class="m-ellipsis list-item-text">
                    {{ (item as any).aliasName || item.name }}
                </div>
            </div>
        </div>
        <LoopStatisticalDetail v-bind="LoopStatisticalDetailProps" class="mt16" style="padding: 0" />
    </m-scrollbar>
</template>

<script setup lang="ts">
import i18n from '@/localization';
import PreTotal from '../left/components/PreTotal.vue';
import { getLoopListByFloorIdKey } from '../hooks/useBaseHook';
import { INFOCODE } from '../variables';
import InfoCodeNumber from '../components/StatusNumber/InfoCodeNumber.vue';
import LoopStatisticalDetail from '../components/LoopStatisticalDetail/index.vue';
import { ObjectTypeEnum } from '@/types/common';
import useWatchEffectWithCleanup from '@/hooks/useWatchEffectWithCleanup';

const getLoopListByFloorId = inject<(floorId: string) => []>(getLoopListByFloorIdKey);

type PropsType = {
    instanceId: string;
    instanceType: ObjectTypeEnum | string;
    serviceAreaType: '1' | '2';
    spaceIds?: Array<string>;
};
const props = withDefaults(defineProps<PropsType>(), {
    instanceId: ''
});
const activeData = ref<{ id: string; infoCode: string; type: string }>({
    id: INFOCODE.controlDeviationStatus1.id,
    infoCode: INFOCODE.controlDeviationStatus1.infoCode,
    type: INFOCODE.controlDeviationStatus1.type
});
const LoopStatisticalDetailProps = computed(() => ({
    type: activeData.value.type,
    instanceType: props.instanceType,
    instanceId: props.instanceId,
    serviceAreaType: props.serviceAreaType,
    useHoverLoopLinkage: true
}));
const loopList = computed(() => {
    return getLoopListByFloorId?.(props.instanceId) || [];
});
const statusList = ref<any>([
    {
        ...INFOCODE.controlDeviationStatus1,
        list: []
    },
    {
        ...INFOCODE.controlDeviationStatus2,
        list: []
    },
    {
        ...INFOCODE.localRemoteStatus0,
        list: [],
        rule: true
    },
    {
        ...INFOCODE.runStatusNull,
        list: []
    }
]);
const clickStatusList = (item: { id: string; infoCode: string; type: string }) => {
    // TODO 点击事件
    activeData.value.id = item.id;
    activeData.value.infoCode = item.infoCode;
    activeData.value.type = item.type;
};
</script>

<style scoped lang="less">
.floor-run-statistics {
    height: calc(100% - 40px);
    .list-item {
        user-select: none;
        padding: 8px 12px;
        border-radius: 4px;
        flex: 1;
        background-color: var(--gray-100);
        cursor: pointer;
        border: 1px solid var(--gray-100);
        &.runStatusNull {
            flex: 0 0 108px;
        }
        &.is-active {
            background-color: var(--blue-100);
            border-color: var(--blue-500);
            color: var(--blue-500);
            .list-item-text {
                color: var(--blue-500);
            }
        }
        &:hover {
            border-color: var(--blue-500);
        }
    }
    .list-item-text {
        color: var(--gray-600);
    }
    :deep(.indoor-lighting-sidebar .scrollbar) {
        padding: 0;
    }
}
</style>
