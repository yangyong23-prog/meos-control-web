<template>
    <div id="abnormal-loading-container" class="abnormal-wrap" :style="{ 'row-gap': isTabShow ? '8px' : '12px' }">
        <Header
            v-if="!isLoadingEmptyHideHeader && !props.hideHeader"
            v-model="selectedSort"
            :abnormal-event-list-update-time="props.abnormalEventListUpdateTime"
            :show-total="showTotal"
            :total-amount="totalAmount"
            :hide-filter="hideFilter"
            :select-list="selectList"
            :padding-right="props.paddingRight"
            :is-tab-show="isTabShow"
        ></Header>
        <template v-if="props.abnormalEventListLoading || !props?.abnormalEventListLoadedTime">
            <m-list-skeleton :style="{ 'padding-right': `${props.paddingRight}px` }" />
        </template>
        <div v-else class="content-wrap" :style="{ height: isLoadingEmptyHideHeader || props.hideHeader ? 'calc(100%)' : isTabShow ? `calc(100% - 36px)` : 'calc(100% - 44px)' }">
            <template v-if="renderList?.length">
                <m-scrollbar v-if="withScroll" ref="scrollbarInstance" :style="{ 'padding-right': `${props.paddingRight}px` }">
                    <AbnormalGroup :group-data="groupData" :sticky-top="stickyTop" @hover-abnormal-item="hoverAbnormalItem" @unhover-abnormal-item="unhoverAbnormalItem">
                    </AbnormalGroup>
                </m-scrollbar>
                <div v-else :style="{ 'padding-right': `${props.paddingRight}px` }">
                    <AbnormalGroup
                        :group-data="groupData"
                        :with-scroll="withScroll"
                        :sticky-top="stickyTop"
                        @hover-abnormal-item="hoverAbnormalItem"
                        @unhover-abnormal-item="unhoverAbnormalItem"
                    >
                    </AbnormalGroup>
                </div>
            </template>
            <template v-else-if="$slots.empty">
                <slot name="empty"></slot>
            </template>
            <div v-else class="pos-center" :style="{ 'padding-right': `${props.paddingRight}px` }">
                <m-illustration :title="i18n.global.t('meos_control_web.no_abnormal_event1')" type="noContent">
                    <template #img>
                        <EmptyAbnormalIcon />
                    </template>
                </m-illustration>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import { SORT_OPTIONS, SORT_OPTION_ENUM } from './config';
import Header from './header.vue';
import EmptyAbnormalIcon from '@/assets/images/common/empty-abnormal.svg';
import AbnormalGroup from './abnormal-group.vue';
import { useDataTransform } from './useAbnormalGroup';

const props = defineProps({
    abnormalEventList: {
        type: Array,
        default: () => {}
    },
    abnormalEventListLoading: {
        type: Boolean,
        default: false
    },
    abnormalEventListUpdateTime: {
        type: String,
        default: null
    },
    abnormalEventListLoadedTime: {
        type: String,
        default: ''
    },
    filterIds: {
        type: Array,
        default: () => []
    },
    hideHeader: {
        type: Boolean,
        default: false
    },
    withScroll: {
        type: Boolean,
        default: true
    },
    stickyTop: {
        type: Number,
        default: 0
    },

    // 展示类型:'panel'|'subPanel'|'tab'
    showType: {
        type: String,
        default: 'panel'
    },
    paddingRight: {
        type: Number,
        default: 16
    }
});

const emits = defineEmits(['total-amount-change', 'hover-abnormal-item', 'unhover-abnormal-item']);

const selectList = ref(SORT_OPTIONS);
const selectedSort = defineModel({ type: String, default: SORT_OPTION_ENUM.BY_LEVEL });
const { groupData } = useDataTransform(props, selectedSort);

const scrollbarInstance = ref(null);

const updateScroll = () => {
    scrollbarInstance.value?.update();
};

const renderList = computed(() => {
    if (!props.abnormalEventList?.length) {
        return [];
    }
    if (!props.filterIds?.length) {
        return props.abnormalEventList;
    }
    return props.abnormalEventList.filter(abnormal => {
        const { instances = [] } = abnormal;
        return instances.some(ins => props.filterIds.includes(ins.instanceId));
    });
});

const totalAmount = computed(() => {
    return renderList?.value?.length;
});

const showTotal = computed(() => ['panel', 'subPanel'].includes(props.showType));

const isTabShow = computed(() => props.showType === 'tab');

const isLoading = computed(() => props.abnormalEventListLoading || !props?.abnormalEventListLoadedTime);

const hideFilter = computed(() => {
    return props.showType === 'panel' && (isLoading.value || (!isLoading.value && totalAmount.value === 0));
});

const isLoadingEmptyHideHeader = computed(() => {
    const isRightShowType = props.showType === 'tab' || props.showType === 'subPanel';
    const isLoadingOrEmpty = isLoading.value || (!isLoading.value && totalAmount.value === 0);
    return isRightShowType && isLoadingOrEmpty;
});

const hoverAbnormalItem = item => {
    emits('hover-abnormal-item', item);
};

const unhoverAbnormalItem = () => {
    emits('unhover-abnormal-item');
};

let loadingInstance = null,
    observer = new MutationObserver(updateScroll);

watch(
    () => props.abnormalEventListLoading,
    val => {
        if (!isTabShow.value) {
            return;
        }
        nextTick(() => {
            if (val) {
                loadingInstance = MLoading.service({
                    target: '#abnormal-loading-container',
                    fullscreen: false,
                    duration: 30000,
                    lottieName: 'ball',
                    loadIconStyle: {
                        width: '100px',
                        height: '100px'
                    }
                });
            } else {
                loadingInstance?.destroy?.();
            }
        });
    },
    {
        immediate: true
    }
);

watch(
    () => totalAmount.value,
    cur => {
        emits('total-amount-change', cur);
    },
    {
        immediate: true
    }
);

onMounted(() => {
    updateScroll();
    if (document.querySelector('#abnormal-loading-container')) {
        observer.observe(document.querySelector('#abnormal-loading-container'), { attributes: true, childList: true, subtree: true });
    }
});

onBeforeUnmount(() => {
    loadingInstance?.destroy?.();
    observer?.disconnect();
    loadingInstance = null;
    observer = null;
});
</script>
<style lang="less" scoped>
.abnormal-wrap {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
.content-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    .m-scrollbar {
        height: 100%;
    }
}

.pos-center {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    flex: 1;
}
</style>
