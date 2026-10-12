<template>
    <m-popover virtual-triggering :virtual-ref="popoverVirtualRef" :popover-class="'node-slot-popover'" trigger="manually" show-arrow :is-open="isOpen" @click-event="clickEvent">
        <template #content>
            <div v-if="treeData?.length && !isLoading" class="service-space">
                <div class="title">{{ i18n.global.t('meos_control_web.served_space') }}</div>
                <m-tree :data="treeData" :default-expand-all="true" readonly last-stage> </m-tree>
            </div>
            <div v-else-if="isLoading" v-loading="isLoading" element-loading-lottiename="circle" class="loading-container"></div>
            <div v-else-if="!treeData?.length && !isLoading" class="empty">{{ i18n.global.t('meos_control_web.no_service_space') }}</div>
        </template>
    </m-popover>
</template>

<script setup>
import i18n from '@/localization';
import { getServiceSpaces } from '@/apis/DemandManagementHome';
import Empty from '@/components/common/Empty.vue';
import baseStore from '@/store/baseStore';
defineProps({
    popoverVirtualRef: {
        type: Object,
        default: () => {}
    }
});
const currentItem = inject('currentItem');
const isOpen = inject('isOpen');

const clickEvent = (e, type) => {
    const dom = document.querySelector('.m-popover.m-popover-light.m-select-window');
    const isContains = dom?.contains(e.target);
    if (!type && !isContains) {
        isOpen.value = false;
    }
};
const fetchAbortController = ref(null);
const isLoading = ref(false);
const treeData = ref([]);
const transformDataToTree = list => {
    list?.forEach(v => {
        v.name = v?.localName ?? '--';
        if (v?.floors?.length) {
            v.children = v?.floors;
            transformDataToTree(v?.floors);
        } else if (v?.spaces?.length) {
            v.children = v?.spaces;
            transformDataToTree(v?.spaces);
        }
    });
};

const queryServiceSpaceData = async () => {
    isLoading.value = true;
    fetchAbortController.value?.abort();
    fetchAbortController.value = new AbortController();
    const res = await getServiceSpaces({ objectId: currentItem?.value.id, projectId: baseStore().projectId }, fetchAbortController.value.signal).finally(() => {
        isLoading.value = false;
    });
    if (res?.code === '00000') {
        const resData = res?.data;
        if (Array.isArray(resData)) {
            transformDataToTree(resData);
            console.log('resData', resData);
            treeData.value = resData;
        }
    }
};

watch(
    isOpen,
    val => {
        if (val) {
            queryServiceSpaceData();
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="scss">
.node-slot-popover {
    right: 32px !important;
    left: auto !important;
    max-width: 360px;
    max-height: 400px;
    padding: 16px !important;
    border-radius: 8px !important;
    .service-space {
        padding: 0;
        display: flex;
        flex-direction: column;
        max-height: calc(400px - 32px);
        overflow: auto;
        .title {
            color: #1b2129;
            font-size: 14px;
            font-weight: 700;
            line-height: 22px;
            margin-bottom: 8px;
        }
    }
    .el-loading-spinner .circular {
        width: 20px !important;
        height: 20px !important;
        margin-top: 8px;
        circle {
            stroke: #626c78 !important;
        }
    }
    .empty {
        width: calc(360px - 32px);
        color: #626c78;
        font-size: 14px;
        height: 27px;
        line-height: 27px;
        text-align: center;
    }
    .loading-container {
        width: calc(360px - 32px);
        height: 27px;
    }
}
</style>
