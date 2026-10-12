<template>
    <div v-if="isVacant" class="pos-center">
        <div class="equipment-good fcc">
            <GoodStatusSvg></GoodStatusSvg>
            <I18nSlot html-tag="p" name-key="meos_control_web.current_relate_equip" class="good-status-text">
                <template #status>
                    <span class="good-status-text-inner">{{ i18n.global.t('meos_control_web.operation_status_good') }}</span>
                </template>
            </I18nSlot>
        </div>
    </div>
    <div v-else class="abnormal-content-container">
        <AbnormalList
            :abnormal-event-list="renderList"
            :abnormal-event-list-loaded-time="curDateString"
            :abnormal-event-list-loading="abnormalEventListLoading"
            :abnormal-event-list-update-time="curDateString"
            :show-type="'tab'"
            @hover-abnormal-item="hoverAbnormalItem"
            @unhover-abnormal-item="unhoverAbnormalItem"
        />
    </div>
</template>
<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import GoodStatusSvg from '@/assets/images/operateMonitoring/goodStatus.svg';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';

const props = defineProps({
    abnormalEventList: {
        type: Array,
        default: () => {}
    },
    abnormalEventListLoading: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['hover-abnormal-item', 'unhover-abnormal-item']);
const curDateString = computed(() => {
    return getDayjsTz().format('YYYY-MM-DD HH:mm');
});

const renderList = computed(() => {
    if (!props.abnormalEventList?.length) {
        return [];
    }
    return props.abnormalEventList;
});
const hoverAbnormalItem = item => {
    emits('hover-abnormal-item', item);
};

const isVacant = computed(() => {
    return !props.abnormalEventListLoading && !renderList.value?.length;
});

const unhoverAbnormalItem = () => {
    emits('unhover-abnormal-item');
};
</script>
<style lang="less" scoped>
.abnormal-content-container {
    display: flex;
    flex-direction: column;

    padding: 0px;
    padding-top: 16px;
    padding-left: 24px;
    height: 100%;
    width: 100%;
}
.pos-center {
    height: 100%;
    width: 100%;
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
.abnormal-header {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 700;

    padding-right: 16px;
}
.equipment-good {
    width: 100%;
    padding: 12px 20px;
    height: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    border-radius: 4px;
}
.abnormal-content {
    width: calc(100% + var(--scrollbar-right));
    // margin-top: 16px;
    flex: 1;
    height: calc(100% - 38px);
    display: flex;
    flex-direction: column;
    .fireelectrity-abornoal-item {
        margin-right: 24px;
    }
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
}
</style>
