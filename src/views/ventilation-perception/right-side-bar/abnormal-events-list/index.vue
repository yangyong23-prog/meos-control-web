<template>
    <div id="abnormal-loading-wrapper" class="abnormal-wrap">
        <div v-if="titleShow" :class="{ 'abnormal-header': true, empty: !renderList?.length }">
            <div class="abnormal-header-title">{{ i18n.global.t('meos_control_web.abnormal_event_list') }}</div>
            <m-button v-if="isEdge()" type="default" size="medium" @click="equipmentBtn">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
        </div>
        <div class="abnormal-content">
            <div class="overview">
                <div v-if="renderList?.length" class="time">{{ i18n.global.t('meos_control_web.update_time_colon') }}{{ isEmpty(props?.abnormalEventListUpdateTime) }}</div>
                <div v-if="renderList?.length" class="total-number">
                    {{ isEmpty(renderList?.length) }}<span class="util">{{ i18n.global.t('common.unit') }}</span>
                </div>
            </div>
            <template v-if="renderList?.length">
                <m-scrollbar ref="scrollbarInstance" style="padding-right: var(--scrollbar-right)">
                    <AbnormalItem v-for="(item, index) in renderList" :key="index" :item="item" />
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
    <EquipmentList v-if="showEquipmentList" :running-monitor-type="'VENTILATION'" :equipment-data="equipmentData" @close="close" />
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import I18nSlot from '@/components/I18nSlot.vue';
import AbnormalItem from './AbnormalItem.vue';
import { isEmpty } from '@/utils/tools';
import GoodStatusSvg from '@/assets/images/operateMonitoring/goodStatus.svg';
import SvgIcon from '@/components/common/SvgIcon.vue';
import EquipmentList from '@/views/Common/EquipmentList/index.vue';
import { MLoading } from 'meri-plus';
import { isEdge } from '@/utils/envUtils';
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

const { titleShow } = unref(props);

const loadingInstance = ref<any>();
const showEquipmentList = ref(false);
const equipmentData = ref('');

const close = () => {
    showEquipmentList.value = false;
};

const renderList = computed(() => {
    const abnormalEventList = props?.abnormalEventList ?? [];
    if (!abnormalEventList?.length) {
        return [];
    }
    if (!props.filterIds?.length) {
        return abnormalEventList;
    }
    return abnormalEventList.filter((abnormal: any) => {
        const { instances } = abnormal || {};
        return instances.some((ins: any) => props.filterIds.includes(ins.instanceId));
    });
});

watch(
    () => props.abnormalEventListLoading,
    val => {
        if (val) {
            loadingInstance.value = MLoading.service({
                target: '.abnormal-content',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            loadingInstance.value?.destroy?.();
        }
    },
    {
        immediate: true
    }
);

const equipmentBtn = () => {
    showEquipmentList.value = true;
    equipmentData.value = i18n.global.t('meos_control_web.ventilation_list');
};
provide('equipmentData', equipmentData);
</script>

<style lang="less" scoped>
.abnormal-wrap {
    height: 100%;
    width: 100%;
    margin-top: 12px;
    display: flex;
    flex-direction: column;

    &:first-child {
        margin-top: 0;
    }
    --scrollbar-right: 0px;
}
.abnormal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    height: 42px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--gray-200, #e8ecf0);

    .abnormal-header-title {
        display: flex;
        align-items: center;
    }
}

.abnormal-header.empty {
    border-bottom: none;
}

.abnormal-content {
    width: calc(100% + var(--scrollbar-right));
    margin-top: 16px;
    flex: 1;
    height: calc(100% - 43px);
    padding-bottom: 16px;
    display: flex;
    flex-direction: column;

    .m-scrollbar {
        height: 100%;
    }

    .overview {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    .total-number {
        font-family: 'Persagy2.0';
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        color: #000;

        .util {
            font-size: 12px;
            font-weight: normal;
            color: @grey-600;
        }
    }

    .time {
        // margin-left: 8px;
        font-size: 12px;
        font-weight: normal;
        color: @grey-600;
    }
}

.pos-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
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
}
</style>
