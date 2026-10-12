<template>
    <div id="abnormal-loading-warp" class="abnormal-wrap">
        <div v-if="titleShow" class="abnormal-header">
            <div class="abnormal-header-title">
                {{ i18n.global.t('meos_control_web.abnormal_event_list')
                }}<span v-if="renderList?.length" class="time">{{ i18n.global.t('meos_control_web.update_time_colon') }}{{ isEmpty(abnormalEventListUpdateTime) }} </span>
            </div>
            <div v-if="renderList?.length" class="abnormal-header-num">
                {{ isEmpty(renderList?.length) }}<span class="util">{{ i18n.global.t('common.unit') }}</span>
            </div>
        </div>
        <div class="abnormal-content">
            <template v-if="renderList?.length">
                <m-scrollbar ref="scrollbarInstance" style="padding-right: var(--scrollbar-right)">
                    <AbnormalItem
                        v-for="(item, index) in renderList"
                        :key="index"
                        :item="item"
                        @hover-abnormal-item="hoverAbnormalItem"
                        @unhover-abnormal-item="unhoverAbnormalItem"
                    />
                </m-scrollbar>
            </template>
            <div v-else class="pos-center">
                <m-illustration v-if="empty" :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
                <template v-else-if="!empty && singleException">
                    <div class="equipment-good fcc">
                        <SvgIcon name="good" />
                        <span class="ml8">{{ i18n.global.t('meos_control_web.current') }}</span>
                        <span style="font-weight: 700; color: #2bb462; margin-left: 5px">{{ i18n.global.t('meos_control_web.operation_status_good') }}</span>
                    </div>
                </template>
                <template v-else>
                    <GoodStatusSvg></GoodStatusSvg>
                    <I18nSlot html-tag="p" name-key="meos_control_web.current_relate_equip" class="good-status-text">
                        <template #status>
                            <span class="good-status-text-inner">{{ i18n.global.t('meos_control_web.operation_status_good') }}</span>
                        </template>
                    </I18nSlot>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import AbnormalItem from './abnormalItem.vue';
import { isEmpty } from '@/utils/tools';
import GoodStatusSvg from '@/assets/images/operateMonitoring/goodStatus.svg';
import { MLoading } from 'meri-plus';
import SvgIcon from '@/components/common/SvgIcon.vue';

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
    filterIds: {
        type: Array,
        default: () => []
    },
    empty: {
        type: Boolean,
        default: false
    },
    titleShow: {
        type: Boolean,
        default: true
    },
    singleException: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['total-amount-change', 'hover-abnormal-item', 'unhover-abnormal-item']);

const renderList = computed(() => {
    // console.log(props.abnormalEventList, props.filterIds);
    if (!props.abnormalEventList?.length) {
        return [];
    }
    if (!props.filterIds?.length) {
        // return props.abnormalEventList.slice(0, index.value * 20);
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

let loadingInstance = null;

const hoverAbnormalItem = item => {
    emits('hover-abnormal-item', item);
};

const unhoverAbnormalItem = () => {
    emits('unhover-abnormal-item');
};

watch(
    () => props.abnormalEventListLoading,
    val => {
        nextTick(() => {
            if (val) {
                loadingInstance = MLoading.service({
                    target: '#abnormal-loading-warp',
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

const scrollbarInstance = ref(null);
const updateScroll = () => {
    scrollbarInstance.value?.update();
};

// eslint-disable-next-line one-var
let observer = new MutationObserver(updateScroll);

onMounted(() => {
    updateScroll();
    if (document.querySelector('#abnormal-loading-warp')) {
        observer.observe(document.querySelector('#abnormal-loading-warp'), { attributes: true, childList: true, subtree: true });
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
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    position: relative;
    z-index: 1;
    // padding-right: 16px;

    &:first-child {
        margin-top: 0;
    }
    --scrollbar-right: 0px;
}
.abnormal-header {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 700;

    padding-right: 16px;

    .abnormal-header-title {
        display: flex;
        align-items: center;
        .time {
            margin-left: 8px;
            font-size: 12px;
            font-weight: normal;
            color: @grey-600;
        }
    }

    .abnormal-header-num {
        .util {
            font-size: 12px;
            font-weight: normal;
            color: @grey-600;
        }
    }
}

.abnormal-content {
    width: calc(100% + var(--scrollbar-right));
    // margin-top: 16px;
    flex: 1;
    height: calc(100% - 38px);
    display: flex;
    flex-direction: column;

    .m-scrollbar {
        height: 100%;
    }
}

.pos-center {
    display: flex;
    align-items: center;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    .good-status-text {
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        text-align: center;
        margin-top: 14px;

        .good-status-text-inner {
            color: #2bb462;
        }
    }
}
.equipment-good {
    width: 100%;
    padding: 12px 20px;
    background-color: #f7f9fa;
    border-radius: 4px;
}
</style>
