<template>
    <m-popover
        ref="popoverRef"
        trigger="click"
        theme="light"
        :append-to="appendTo"
        @show="onShow"
        @hide="onHide"
        @mouse-enter="handleMouse(true)"
        @mouse-leave="handleMouse(false)"
    >
        <template #content>
            <div v-if="isLoading" v-loading="isLoading" class="loading-container" element-loading-lottiename="circle"></div>
            <template v-else>
                <div v-if="treeData?.length" class="head-title">{{ i18n.global.t('meos_control_web.served_space') }}</div>
                <m-scrollbar :max-height="400">
                    <div
                        :class="{
                            'pump-service-space': true,
                            'is-empty-space': !isLoading && !treeData?.length
                        }"
                    >
                        <template v-if="!treeData?.length"> {{ i18n.global.t('meos_control_web.no_service_space') }} </template>
                        <m-tree v-if="treeData?.length" ref="tree" :data="treeData" :default-expand-all="true" readonly last-stage> </m-tree>
                    </div>
                </m-scrollbar>
            </template>
        </template>
        <div v-show="isHoverActive || isShowPopover" :class="['view-service-spaces-container', isSmallSize ? 'small-size' : '']">
            <!-- <div v-if="!isSmallSize" class="divider"></div> -->
            <div :class="['view-service-spaces']" @click="getData">
                <span ref="el">{{ isSmallSize ? i18n.global.t('meos_control_web.view_service_space') : i18n.global.t('meos_control_web.served_space') }}</span>
            </div>
        </div>
    </m-popover>
</template>

<script setup>
import i18n from '@/localization';
import { getServiceSpaces } from '@/apis/DemandManagementHome';
import { useElementBounding } from '@vueuse/core';
import useStore from '@/store';

const props = defineProps({
    pumpItem: {
        type: Object,
        default: () => {}
    },
    hoverItem: {
        type: Object,
        default: () => {}
    },
    appendTo: {
        type: String,
        default: 'body'
    },
    isSmallSize: {
        type: Boolean,
        default: false
    },
    renderKey: {
        type: String,
        default: ''
    }
});

const el = ref(null);
const { bottom } = useElementBounding(el);

const { base } = useStore();
const { projectId } = base || {};
const fetchAbortController = ref(null);

const tree = ref();
const popoverRef = ref();

const treeData = ref([]);
const isLoading = ref(false);

const isShowPopover = ref(false);

const isEnterPopover = ref(false);

const isHoverActive = computed(() => {
    const isEqual = props?.renderKey === props?.hoverItem?.pumpServiceSpaceCode;
    const res = props?.hoverItem?.id && props?.pumpItem?.id === props?.hoverItem?.id;
    return isEqual && res;
});

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
const getData = () => {
    popoverRef?.value?.manuallyHide?.();
    getFetchData();
};

const getFetchData = async () => {
    const objectId = props?.pumpItem?.id;
    fetchAbortController.value?.abort();
    fetchAbortController.value = new AbortController();
    isLoading.value = true;
    const res = await getServiceSpaces({ objectId, projectId }, fetchAbortController.value?.signal).finally(() => {
        isLoading.value = false;
    });
    if (res?.code === '00000') {
        const resData = res?.data;
        if (Array.isArray(resData)) {
            transformDataToTree(resData);
            treeData.value = resData;
        }

        popoverRef?.value?.manuallyOpen?.();
    }
};

const onShow = async () => {
    isShowPopover.value = true;
};

const onHide = () => {
    isShowPopover.value = false;
};

const handleMouse = enter => {
    isEnterPopover.value = enter;
};

watch(
    () => bottom.value,
    () => {
        if (!isEnterPopover.value) {
            popoverRef?.value?.manuallyHide?.();
        }
    }
);
</script>

<style lang="less" scoped>
.head-title {
    color: @grey-900;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
    margin-bottom: 8px;
}

.pump-service-space {
    display: flex;
    flex-direction: column;
    width: 400px;
    max-height: 400px;
}

.is-empty-space {
    width: 190px;
    height: 29px;

    color: @grey-600;
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-container {
    width: 328px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.el-loading-spinner) {
        .circular {
            width: 20px !important;
            height: 20px !important;
            margin-top: 12px;
            circle {
                stroke: #626c78 !important;
            }
        }
    }
}

.view-service-spaces-container {
    display: flex;
    align-items: center;
}

.view-service-spaces-container.small-size {
    position: absolute;
    top: 0px;
    right: 0px;
}

.view-service-spaces {
    display: flex;
    align-items: center;
    white-space: nowrap;
    cursor: pointer;
    color: @blue-500;
    position: relative;
    padding-inline: 4px;
    z-index: 1;

    &::after {
        content: '';
        display: flex;
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        border-radius: 4px;
        transform: scaleY(1.2);
    }

    &:hover {
        &::after {
            background: rgba(196, 201, 207, 0.3);
        }
    }
}

.divider {
    width: 1px;
    height: 12px;
    background: #d9d9d9;
    margin-inline: 2px;
}
</style>
