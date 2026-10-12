<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div v-for="(item, index) in list" :key="index" class="circuitList">
        <div class="fb">
            <div>
                <div v-ellipsis class="f14 m-ellipsis loop-title">{{ item.localName ?? '--' }}</div>
                <div class="f12 ft1 mt4">{{ i18n.global.t('meos_control_web.lighting_code') }}: {{ item.localId }}</div>
            </div>
        </div>
        <!-- <div v-show="state.loopUnpackShow"> -->
        <div v-if="abnormalEvents(item)?.length || item.tag?.infoCodeValue == '0' || item.tag?.infoCodeValue == '1'" class="fc mt12">
            <div v-if="abnormalEvents(item)?.length" class="abnormal fc" @click="item.abnormalShow = !item.abnormalShow">
                <div class="mr4 f12">{{ i18n.global.t('meos_control_web.abnormal_event') }}:{{ abnormalEvents(item).length }}</div>
                <div :class="[item.abnormalShow ? 'rotateBottom' : '', 'rotate']">
                    <SvgIcon name="redArrow" />
                </div>
            </div>
            <m-tag v-if="item.tag && item.tag.infoCodeValue == '0'" class="mr4" color="#1B2129" bg-color="#E8ECF0" size="small">{{
                i18n.global.t('meos_control_web.offline')
            }}</m-tag>
            <m-tag v-if="item.tag && item.tag.infoCodeValue == '1'" class="mr4" color="#1B4ACC" bg-color="#D9EBFF" size="small">
                {{ i18n.global.t('meos_control_web.online') }}
            </m-tag>
        </div>
        <!-- 异常列表 -->
        <div v-show="item.abnormalShow">
            <div v-for="(items, indexs) in abnormalEvents(item)" :key="indexs" class="abnormal-list mt8" @click="abnormalInfo(items)">
                <div v-ellipsis class="exception-list-title">{{ items.problemsName || '--' }}</div>
                <div class="fcb mt12">
                    <div>
                        <div style="color: #1b2129">{{ dayjs(+items.exceptionStartTime).format('YYYY.MM.DD HH:mm') }}</div>
                        <div class="ft1 mt4">{{ i18n.global.t('meos_control_web.abnormal_time_time') }}</div>
                    </div>
                    <div>
                        <div style="color: #1b2129">{{ durationTime(items.duration || 0) }}</div>
                        <div class="ft1 mt4">{{ i18n.global.t('meos_control_web.continuous_duration') }}</div>
                    </div>
                    <div>
                        <div style="color: #1b2129">{{ items.resolvedProblemCount || '--' }}/{{ items.allProblemCount || '--' }}</div>
                        <div class="ft1 mt4">{{ i18n.global.t('meos_control_web.resolved_all_issues') }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt8">
            <!-- <div class="fc mb8">
                <div class="ft">{{ i18n.global.t('meos_control_web.related_control_module_colon') }}</div>
                <div>{{ item.relController?.localName || '--' }}</div>
            </div> -->
            <div class="fc mb8">
                <div class="ft">{{ i18n.global.t('meos_control_web.related_distribution_box_colon') }}</div>
                <div>{{ item.relDistributionCabinet?.localName ?? '--' }}</div>
            </div>
            <div class="fc">
                <div class="ft">{{ i18n.global.t('meos_control_web.related_electrical_shaft_colon') }}</div>
                <div>{{ item.relSpace?.localName ?? '--' }}</div>
            </div>
        </div>
        <!-- </div> -->
    </div>
</template>
<script setup lang="ts">
import SvgIcon from '@/components/common/SvgIcon.vue';
import { PropType } from 'vue';
import dayjs from 'dayjs';
import i18n from '@/localization';
import { durationTime } from '@/utils/viewUtils';
import { abnormalJumpFun } from '@/utils/envUtils';
const abnormalEventList = inject('abnormalEventList', ref([]));
const abnormalEvents: any = (data: any) => abnormalEventList.value.filter((item: any) => item.id === data.id);
defineProps({
    list: {
        type: Array as PropType<any[]>,
        default: () => []
    }
});
const state = reactive({
    loopUnpackShow: true,
    abnormalShow: true
});
const days = computed(() => (minutes: any) => {
    const day = Math.floor(minutes / 60 / 24);
    return day;
});
const hours = computed(() => (minutes: any) => {
    const hour = Math.ceil((minutes % (60 * 24)) / 60);
    return hour;
});
const abnormalInfo = (item: any) => {
    abnormalJumpFun(item);
};
</script>
<style lang="less" scoped>
.circuitList {
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
    padding: 10px;
    .abnormal {
        color: #d72824;
        background-color: #ffe6e5;
        padding: 0px 4px;
        border-radius: 2px;
        height: 20px;
    }
    .abnormal:hover {
        cursor: pointer;
        background: var(--red-200, #fdc1be);
    }
    .abnormal-list {
        border-radius: 4px;
        background: rgba(255, 230, 229, 0.45);
        padding: 12px 8px;
    }
    .abnormal-list:hover {
        cursor: pointer;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
    .exception-list-title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        color: #424c59;
    }
    .set-operation {
        background: var(--gray-200, #e8ecf0);
        padding: 4px 8px;
    }
}
.circuitList:not(:last-child) {
    margin-bottom: 12px;
}
.ratate {
    transition: all 0.2s ease-in;
}
.rotateBottom {
    transform: rotate(-180deg);
    cursor: pointer;
    display: flex;
    align-items: end;
}
.getline {
    width: 100%;
    height: 1px;
    background-color: var(--gray-200, #e8ecf0);
}
.getline1 {
    width: 100%;
    height: 1px;
    background-color: #e1e5eb;
}
.popover_header {
    height: 24px;
    display: flex;
    align-items: center;

    > p {
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        color: #2e3742;
        margin-left: 12px;
    }
}

.popover_cont {
    margin-left: 12px;
    color: #626c78;
    width: 270px;
    word-break: break-all;
    margin-top: 8px;
}

.popover_footer {
    margin: 12px 0 0;
    text-align: right;
}

.m-button + .m-button {
    margin-left: 12px;
}
@media screen and (max-width: 1920px) {
    .loop-title {
        max-width: 400px;
    }
}
@media screen and (max-width: 1600px) {
    .loop-title {
        max-width: 300px;
    }
}
</style>
