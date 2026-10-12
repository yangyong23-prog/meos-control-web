<template>
    <div class="right-signboard-content" :class="{ full: currentModel === 'list', model: currentModel !== 'list' }">
        <div v-if="currentModel !== 'list'" class="tab">
            <m-tabs v-model="curTab" size="large" :data="tabItems" type="segment"></m-tabs>
        </div>
        <Controls
            v-if="curTab === tabControlKey"
            @click-monitor-group="clickMonitorGroup"
            @hover-monitor-group="hoverMonitorGroup"
            @unhover-monitor-group="unhoverMonitorGroup"
            @open-edit-group="openEditGroup"
        />
        <AbnormalList
            v-if="curTab === tabAbnormalKey"
            class="abnormal-list-warp"
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
            :show-type="currentModel === 'list' ? 'panel' : 'subPanel'"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import Controls from '../Controls/index.vue';
import { currentModelInjectKey } from '../constants/injectKey';
import { MBadge } from 'meri-plus';
import { isMeosFrame } from '@/utils/envUtils';
import { h } from 'vue';
const emit = defineEmits(['clickMonitorGroup', 'hover-monitor-group', 'unhover-monitor-group', 'open-edit-group']);
const clickMonitorGroup = group => {
    emit('clickMonitorGroup', group);
};
const openEditGroup = group => {
    emit('open-edit-group', group);
};
const hoverMonitorGroup = group => {
    emit('hover-monitor-group', group);
};
const unhoverMonitorGroup = () => {
    emit('unhover-monitor-group');
};
const currentModel = inject(currentModelInjectKey);

const tabControlKey = 'control';
const tabAbnormalKey = 'abnormal';

const curTab = ref(tabControlKey);
const tabItems = ref([
    {
        id: tabControlKey,
        name: i18n.global.t('meos_control_web.operation_control')
    },
    {
        id: tabAbnormalKey,
        name: i18n.global.t('meos_control_web.abnormal_event')
    }
]);

watch(
    currentModel,
    () => {
        if (currentModel.value === 'list') {
            curTab.value = tabAbnormalKey;
        } else {
            curTab.value = tabControlKey;
        }
    },
    {
        immediate: true
    }
);

const abnormalEventList = inject('abnormalEventList');
const abnormalEventListLoading = inject('abnormalEventListLoading');
const abnormalEventListUpdateTime = inject('abnormalEventListUpdateTime');
const abnormalEventListLoadedTime = inject('abnormalEventListLoadedTime');
const abnormalEventCount = inject('abnormalEventCount');

watch(
    abnormalEventCount,
    () => {
        if (abnormalEventCount.value > 0) {
            tabItems.value[1].renderSlot = {
                component: h(MBadge, { count: abnormalEventCount.value, show: true }),
                style: {
                    margin: '-6px 0px 0px 8px',
                    // 仅在 meos-frame 下补齐徽标插槽高度。
                    minHeight: isMeosFrame() ? '16px' : undefined
                }
            };
        } else {
            tabItems.value[1].renderSlot = undefined;
        }
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.right-signboard-content {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 8px 10px 0 rgba(27, 33, 41, 0.03);
    overflow: hidden;

    &.full {
        .abnormal-list-warp {
            // margin-top: 8px;
            height: 100%;
            padding: 16px 0 16px 16px;
        }
    }
    &.model {
        .abnormal-list-warp {
            margin-top: 8px;
        }
    }

    .tab {
        padding: 16px 16px 4px 16px;
    }

    .abnormal-list-warp {
        padding: 0 0 0 16px;
        height: calc(100% - 96px);
    }
}
</style>
