<template>
    <m-popover v-if="row.alarmeventdetail !== 0 && row.alarmeventdetail?.length > 0" placement="bottom" trigger="click" popover-class="room-table-popover-wrap">
        <template #content>
            <div class="abnormal-events-wrap">
                <m-scrollbar>
                    <div v-for="item in row.alarmeventdetail" :key="item.templateTypeId" class="item-wrap" @click="abnormalJump(item)">
                        <div class="title">
                            {{ item.problemsName }}
                        </div>
                        <div class="info">
                            <span class="name">{{ i18n.global.t('meos_control_web.departure_time_colon') }}</span>
                            {{ dayjs.tz(+item.exceptionStartTime).format('YYYY-MM-DD HH:mm') }}
                            <span class="text"></span>
                        </div>
                        <div class="info">
                            <span class="name">{{ i18n.global.t('meos_control_web.risk_level_colon') }}</span>
                            {{ importanceDegree(item).name }}
                            <span class="text"></span>
                        </div>
                    </div>
                </m-scrollbar>
            </div>
        </template>
        <span class="abnormal-text red">{{ row.alarmeventdetail.length }}</span>
    </m-popover>
    <span v-else class="abnormal-text">{{ row.alarmeventdetail }}</span>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { durationTime, importanceDegree } from '@/utils/viewUtils';

const props = defineProps({
    row: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(['abnormalJump']);
const abnormalJump = params => {
    emits('abnormalJump', params);
};
</script>
<style lang="less" scoped>
.abnormal-events-wrap {
    max-height: 302px;
    overflow: auto;
    margin-right: 8px;
    .item-wrap {
        padding: 4px 8px;
        cursor: pointer;
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        width: 100%;
        .title {
            color: #246fe5;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .info {
            margin-top: 4px;
            .name {
                color: #626c78;
                margin-right: 4px;
            }
            .text {
                color: #2e3742;
            }
        }
        &:hover {
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}
.abnormal-text {
    color: #c4c9cf;
    user-select: none;
    &.red {
        color: #f55047;
        font-weight: 700;
        cursor: pointer;
        &:hover {
            color: #246fe5;
        }
    }
}
</style>
<style lang="less">
.room-table-popover-wrap {
    padding: 8px 0 8px 8px !important;
    width: 350px;
    max-height: 318px;
}
</style>
