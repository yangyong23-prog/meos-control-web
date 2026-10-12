<template>
    <div class="ocg-partial-card" @mouseenter="hoverPump(showItem?.systemConfig)" @mouseleave="unHoverPump">
        <div class="ocg-partial-card-title">
            <span v-ellipsis class="text-ellipsis">{{ item?.localName ?? '--' }}</span>
            <m-popover
                ref="popoverRef"
                trigger="click"
                theme="light"
                width="280px"
                :show-arrow="false"
                :append-to="appendTo"
                :disabled="isLoading"
                placement="bottom-start"
                class="criterion-partial-card-btn-wrap"
                @show="onShow"
                @hide="onHide"
                @mouse-enter="handleMouse(true)"
                @mouse-leave="handleMouse(false)"
            >
                <m-button v-show="isHoverActive || isShowPopover" type="link" size="small" :loading="isLoading" @click="getData"
                    ><span ref="el">{{ i18n.global.t('meos_control_web.served_space') }}</span></m-button
                >
                <template #content>
                    <!-- <div v-if="!isLoading && treeData?.length" class="head-title">服务空间</div> -->
                    <m-scrollbar :max-height="400">
                        <div
                            :class="{
                                'pump-service-space': true,
                                'is-empty-space': !isLoading && !treeData?.length
                            }"
                        >
                            <span v-if="treeData?.length === 0" :style="{ color: '#8B949E' }"> {{ i18n.global.t('meos_control_web.no_service_space') }} </span>
                            <m-tree v-else ref="tree" :data="treeData" :default-expand-all="treeData.length === 1" readonly last-stage> </m-tree>
                        </div>
                    </m-scrollbar>
                </template>
            </m-popover>
        </div>
        <div v-if="showDivider" class="divider"></div>
        <i18n-slot v-if="item?.supplyTempName" html-tag="div" class="ocg-partial-card-info" name-key="meos_control_web.system_should_be">
            <template #system>
                <span>{{ item?.supplyTempName || '' }}</span>
            </template>
            <template #num>
                <span class="ocg-emphasis">{{ item?.supplyTemp ?? '--' }}</span>
            </template>
            <template #time>
                <span class="ocg-emphasis">{{ item?.supplyTempTime ?? '--' }}</span>
            </template>
        </i18n-slot>
        <div v-if="item?.primaryChillWaterMainReturnTempName && showReturnWater(item)" class="ocg-partial-card-info">
            <span>{{
                i18n.global.t('meos_control_web.name_should_be', {
                    name: item?.primaryChillWaterMainReturnTempName || ''
                })
            }}</span>
            <span class="ocg-emphasis"
                >{{ item?.lowerPrimaryChillWaterMainReturnTemp ?? '--'
                }}{{
                    i18n.global.t('meos_control_web.from_to', {
                        from: '℃',
                        to: item?.upperPrimaryChillWaterMainReturnTemp ?? '--'
                    })
                }}
                {{ '℃' }}</span
            >
        </div>
        <template v-if="computedItem?.tempAndPressureSetList?.length">
            <div v-for="(subItem, subIndex) in computedItem.tempAndPressureSetList" v-show="subItem?.chillWaterDetaSetName" :key="subIndex" class="ocg-partial-card-info">
                <span>{{
                    i18n.global.t('meos_control_web.name_should_be', {
                        name: subItem?.chillWaterDetaSetName || ''
                    })
                }}</span>
                <span class="ocg-emphasis"
                    >{{ subItem?.lowerChillWaterDetaSet ?? '--'
                    }}{{
                        i18n.global.t('meos_control_web.from_to', {
                            from: subItem?.chillWaterDetaUnit,
                            to: subItem?.upperChillWaterDetaSet ?? '--'
                        })
                    }}
                    {{ subItem?.chillWaterDetaUnit }}</span
                >
            </div>
        </template>
    </div>
</template>
<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import { getServiceSpaces } from '@/apis/DemandManagementHome';
import { useElementBounding } from '@vueuse/core';
import useStore from '@/store';

const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    },
    showDivider: {
        type: Boolean,
        default: true
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

const isHoverActive = ref(false);

const handleInitCodes = infoItem => {
    let newConfig = { ...(infoItem || {}) };
    const isBelongACAC = infoItem?.classCode === 'ACAC';
    const hasTempAndPressureSetList = infoItem?.tempAndPressureSetList?.length;
    // 非ACAC数据兼容处理
    if (!isBelongACAC && !hasTempAndPressureSetList) {
        const { lowerChillWaterDetaSet, upperChillWaterDetaSet, chillWaterDetaSetName, chillWaterDetaSetType, chillWaterDetaUnit } = infoItem;
        newConfig = {
            ...newConfig,
            tempAndPressureSetList: [{ lowerChillWaterDetaSet, upperChillWaterDetaSet, chillWaterDetaSetName, chillWaterDetaSetType, chillWaterDetaUnit }]
        };
    }

    return newConfig;
};

const showReturnWater = item => {
    return item?.classCode === 'ACAC';
};

const computedItem = computed(() => {
    const newItem = handleInitCodes(props.item);
    return newItem;
});

const hoverPump = item => {
    isHoverActive.value = true;
};

const unHoverPump = () => {
    isHoverActive.value = false;
};

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
const getData = async () => {
    const objectId = props?.item?.id;
    fetchAbortController.value?.abort();
    fetchAbortController.value = new AbortController();
    isLoading.value = true;
    const res = await getServiceSpaces({ objectId, projectId }, fetchAbortController.value.signal).finally(() => {
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
    fetchAbortController.value?.abort();
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
<style lang="less">
.criterion-partial-card-btn-wrap.m-popover.m-flexible-overlay {
    padding: 0;
    padding-top: 8px;
    .m-tree-node.is-notlast > .m-tree-node__content {
        color: var(--gray-900, #1b2129);
    }
}
.criterion-partial-card-btn-wrap {
    .is-empty-space {
        margin: 8px;
        margin-top: 0;
    }
}
</style>
<style lang="less" scoped>
.ocg-partial-card {
    // height: 134px;
    display: flex;
    padding: 16px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex: 1 1 0;
    background: rgba(196, 201, 207, 0.2);
    .criterion-partial-card-btn-txt {
        color: #246fe5;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        text-align: center;
        padding: 3px 4px 3px 4px;
        border-radius: 4px;
        opacity: 0;
        &:hover {
            background: #c4c9cf4d;
        }
    }
    &:hover {
        .criterion-partial-card-btn-txt {
            opacity: 1;
        }
    }
    .divider {
        height: 1px;
        width: 100%;
        border-bottom: 1px solid rgba(196, 201, 207, 0.3);
    }
    .ocg-partial-card-title {
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 28px; /* 137.5% */
        height: 28px;
        display: flex;
        gap: 4px;
        flex-direction: row;
        align-items: center;
        display: flex;
        align-items: center;
        width: 100%;
        .text-ellipsis {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .ocg-partial-card-info {
        white-space: normal;
        overflow-wrap: break-word;
        gap: 4px;
        span {
            color: var(--gray-500, #8b949e);

            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
            &.ocg-emphasis {
                color: var(--gray-900, #1b2129);
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 22px; /* 157.143% */
            }
        }
    }
}
</style>
