<template>
    <div ref="controlAberrantBox" class="control-aberrant-wrap" :class="{ 'control-aberrant-abnormal': curTab === 2 }">
        <div :style="{ marginRight: curTab === 2 ? '16px' : 0 }">
            <m-tabs v-if="hasControls" v-model="curTab" :size="tabSize" :data="tabItems" type="segment"></m-tabs>
        </div>
        <Controls v-if="curTab === 1" />
        <AbnormalList
            v-if="curTab === 2"
            :style="`height: calc(100% - ${hasControls ? 56 : 0}px);paddingRight:0;marginTop:${hasControls ? 12 : 0}px`"
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loading="abnormalEventListLoading || templateTypeAllLoading"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
            :empty="noRelationChartData"
            :show-type="hasControls ? 'subPanel' : 'panel'"
            :class="[privilegeDifferentiation ? 'no-control-aberrant-abnormal' : '']"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Controls from './controls/index.vue';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import { useRoute } from 'vue-router';
import { MBadge } from 'meri-plus';
import { isMeosFrame } from '@/utils/envUtils';
import { h } from 'vue';

const abnormalEventList = inject('abnormalEventList');
const abnormalEventCount = inject('abnormalEventCount');
const abnormalEventListLoading = inject('abnormalEventListLoading');
const abnormalEventListUpdateTime = inject('abnormalEventListUpdateTime');
const abnormalEventListLoadedTime = inject('abnormalEventListLoadedTime');
const noRelationChartData = inject('noRelationChartData');
const selectedSystemObj = inject('selectedSystemObj');
const templateTypeAllLoading = inject('templateTypeAllLoading');
const route = useRoute();
const privilegeDifferentiation = ref(false);
const curTab = ref(1);
const tabItems = ref([
    {
        id: 1,
        name: i18n.global.t('meos_control_web.operation_control')
    },
    {
        id: 2,
        name: i18n.global.t('meos_control_web.abnormal_event')
    }
]);
const controlAberrantBox = ref(null);

const hasControls = ref(false);

const getHasControls = () => {
    // if (!isEdge()) {
    //     return false;
    // }
    // Boolean(baseStore().hasAuth('UaControl_fc')) &&
    return !!selectedSystemObj.value.isControl || selectedSystemObj?.value.imageOrProductName === i18n.global.t('meos_control_web.vacant_hot_pot_system_graph');
};

watchEffect(() => {
    hasControls.value = getHasControls();
    if (hasControls.value) {
        // 解决 ACsystemStatusGraph 路由下异常事件总是选中第二个tab异常事件的问题
        if (['ACsystemStatusGraph', 'systemStatusGraph'].includes(route.name)) {
            curTab.value = 1;
            privilegeDifferentiation.value = false;
        } else {
            curTab.value = 2;
        }
    } else {
        curTab.value = 2;
        if (route.params.majorCode === 'WS' || route.params.majorCode === 'SE' || route.params.majorCode === 'FF') {
            privilegeDifferentiation.value = true;
        }
    }
});

watch(
    () => abnormalEventCount.value,
    cur => {
        if (cur && !abnormalEventListLoading?.value) {
            tabItems.value[1].renderSlot = {
                component: h(MBadge, { count: cur, show: true }),
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
const tabSize = ref('large');

const windowResizeCallBack = () => {
    if (document.documentElement?.clientWidth > 1280) {
        tabSize.value = 'large';
    } else {
        tabSize.value = 'medium';
    }
};

onMounted(() => {
    window.addEventListener('resize', windowResizeCallBack);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', windowResizeCallBack);
});

provide('controlAberrantBox', controlAberrantBox);
provide('hasControls', hasControls);
</script>
<style lang="less" scoped>
.control-aberrant-wrap {
    padding: 16px;
    background-color: @white;
    border-radius: 8px;
    box-shadow: @box-shadow-bottom;
    overflow: hidden;
    flex: 1;
    height: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
.control-aberrant-abnormal {
    padding-right: 0;
}
.control-aberrant-wrap-abnormal {
    padding: 16px 0 16px 16px;
}
:deep(.m-tabs.m-tabs-segment) {
    width: 100%;
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
.no-control-aberrant-abnormal {
    margin-top: 0px;
}
</style>
