<!--
 * @Author: guoxiaohuan
 * @Date: 2024-04-26 10:53:34
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-16 14:25:44
 * @Description:
-->
<template>
    <div ref="controlAberrantBox" class="control-aberrant-container">
        <template v-if="headerModelView === 'model'">
            <div class="tab">
                <m-tabs v-model="curTab" size="large" :data="tabItems" type="segment"></m-tabs>
            </div>
            <div v-show="curTab === '1'" class="container" :style="{ height: `calc(100% - 72px)` }">
                <RunControlEntry :has-spaces="props.hasSpaces" />
            </div>
            <m-scrollbar v-show="curTab === '2'" class="container container-abnormal" style="height: calc(100% - 72px)">
                <div style="height: 100%">
                    <AbnormalList
                        :abnormal-event-list="abnormalEventList"
                        :abnormal-event-list-loading="abnormalEventListLoading || templateTypeLoading"
                        :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                        :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                        @total-amount-change="handleTotalAmountChange"
                    />
                </div>
            </m-scrollbar>
        </template>
        <template v-else>
            <!-- <m-scrollbar :class="[notifyList.length ? 'broadcast' : 'no-broadcast']"> -->
            <div style="padding: 20px 0 16px 16px; height: 100%; overflow: hidden">
                <AbnormalList
                    :abnormal-event-list="abnormalEventList"
                    :abnormal-event-list-loading="abnormalEventListLoading || templateTypeLoading"
                    :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                    :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                />
            </div>
            <!-- </m-scrollbar> -->
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { isEdge, isMeosFrame } from '@/utils/envUtils';
import RunControlEntry from './controls/index.vue';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import { h } from 'vue';
import { MBadge } from 'meri-plus';

const abnormalEventListLoading = inject('abnormalEventListLoading');
const abnormalEventListUpdateTime = inject('abnormalEventListUpdateTime');
const abnormalEventListLoadedTime = inject('abnormalEventListLoadedTime');
const abnormalEventList = inject('abnormalEventList');
const templateTypeLoading = inject('templateTypeLoading');
const props = defineProps({
    hasSpaces: {
        type: Boolean,
        default: true
    }
});
const curTab = ref('1');
const tabItems = ref([
    {
        id: '1',
        name: i18n.global.t('meos_control_web.operation_control')
    },
    {
        id: '2',
        name: i18n.global.t('meos_control_web.abnormal_event')
    }
]);

const controlAberrantBox = ref(null);
const headerModelView = inject('headerModelView');
const notifyList = inject('notifyList');

const abnormalAmount = ref(0);
const handleTotalAmountChange = val => {
    abnormalAmount.value = val;
};

watch(
    headerModelView,
    () => {
        if (headerModelView.value === 'list') {
            curTab.value = '2';
        } else {
            curTab.value = '1';
        }
    },
    {
        immediate: true
    }
);
watch(
    () => abnormalAmount.value,
    cur => {
        if (cur) {
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
const hasControls = computed(() => {
    if (!isEdge()) {
        return false;
    }
    return true;
});

provide('hasControls', hasControls);
</script>
<style lang="less" scoped>
.control-aberrant-container {
    height: 100%;
    .tab {
        padding: 16px;
    }
    .container {
        padding: 0 0 20px 0px;
    }
    .container-abnormal {
        padding: 0 0 20px 16px;
    }
    .pd16 {
        padding-top: 20px;
        // padding-left: 16px;
    }
    .broadcast {
        :deep(.abnormal-wrap) {
            height: calc(100vh - 135px);
        }
    }
    .no-broadcast {
        :deep(.abnormal-wrap) {
            height: calc(100vh - 70px);
        }
    }
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
:deep(.m-scrollbar__content) {
    height: 100%;
}
</style>
