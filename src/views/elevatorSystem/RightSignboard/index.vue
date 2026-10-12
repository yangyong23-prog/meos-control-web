<template>
    <div class="right-signboard-content">
        <div class="tab">
            <m-tabs :key="Math.random()" v-model="curTab" size="large" :data="tabItems" type="segment">
                <template #name="{ item, index }">
                    <div style="color: red; font-weight: 700">{{ item.name + index }}</div>
                </template>
            </m-tabs>
        </div>
        <Controls
            v-show="curTab === tabControlKey"
            @hover-equip="
                item => {
                    emits('hoverEquip', item);
                }
            "
            @unhover-equip="
                () => {
                    emits('unhoverEquip');
                }
            "
            @click-equip="
                item => {
                    emits('clickEquip', item);
                }
            "
        />
        <AbnormalList
            v-show="curTab === tabAbnormalKey"
            class="abnormal-list-warp"
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
            :show-type="'subPanel'"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { h } from 'vue';
import { MBadge } from 'meri-plus';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import Controls from '../Controls/index.vue';
import useStore from '@/store';
import { getAbnormalDataList } from '@/apis/elevatorSystem';
import useAbnormalData from '@/views/Common/AbnormalListPlus/useAbnormalData';
import { isMeosFrame } from '@/utils/envUtils';
const currentFloorObj = inject('currentFloorObj');

const tabControlKey = 'control';
const tabAbnormalKey = 'abnormal';
const curTab = ref(tabControlKey);
const emits = defineEmits('unhoverEquip', 'hoverEquip', 'clickEquip');
const defaulttabItems = ref([
    {
        id: tabControlKey,
        name: i18n.global.t('meos_control_web.data_statistics')
    },
    {
        id: tabAbnormalKey,
        name: i18n.global.t('meos_control_web.abnormal_event')
    }
]);
const tabItems = ref(defaulttabItems);
const queryAbnormalEventListParams = computed(() => {
    const { base } = useStore();
    const parasm = {
        projectId: base.projectId,
        instanceId: base.projectId,
        instanceType: 'PROJECT',
        runningMonitorType: 'ELEVATOR'
    };
    if (currentFloorObj?.value?.id) {
        parasm.instanceId = currentFloorObj.value.id;
        parasm.instanceType = 'FLOOR';
    }
    return parasm;
});

const { abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalData(
    queryAbnormalEventListParams,
    getAbnormalDataList
);

watch(
    () => abnormalEventList.value,
    curList => {
        if (curList.length > 0) {
            tabItems.value = defaulttabItems.value.map(item => {
                const cur = curList.length;
                if (item.id === 'abnormal' && cur) {
                    return {
                        ...item,
                        renderSlot: {
                            component: h(MBadge, { count: cur, show: true }),
                            style: {
                                margin: '-6px 0px 0px 8px',
                                // 仅在 meos-frame 下补齐徽标插槽高度。
                                minHeight: isMeosFrame() ? '16px' : undefined
                            }
                        }
                    };
                }
                return item;
            });
        } else {
            tabItems.value[1].renderSlot = undefined;
        }
    }
);
</script>
<style lang="less" scoped>
.right-signboard-content {
    height: 100%;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 8px 10px 0 rgba(27, 33, 41, 0.03);
    .tab {
        padding: 12px 16px 12px 16px;
    }
    .count-item {
        color: #ffff;
        padding: 0 5.5px;
        background-color: #f55047;
        border-radius: 9px;
        border: 1px solid #fff;
        height: 18px;
    }
    .abnormal-list-warp {
        margin-top: 0px;
        padding: 0 0 0 16px;
        height: calc(100% - 88px);
    }
}
:deep(.m-badge .badge.has-99) {
    height: 19px;
}
</style>
