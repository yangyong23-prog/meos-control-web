<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div class="loopList">
        <div class="fb">
            <div>
                <div v-ellipsis class="f14 m-ellipsis loop-title">{{ obj?.localName ?? '--' }}</div>
                <div class="f12 ft1 mt4">{{ i18n.global.t('meos_control_web.lighting_code') }}: {{ obj.localId }}</div>
            </div>
        </div>
        <div v-show="state.loopUnpackShow">
            <div class="fc mt12">
                <m-tag v-if="obj.tag && obj.tag?.onlineStatus?.infoCodeValue == '0'" color="#1B2129" bg-color="#E8ECF0" size="small">{{
                    i18n.global.t('meos_control_web.offline')
                }}</m-tag>
                <m-tag v-if="obj.tag && obj.tag?.onlineStatus?.infoCodeValue == '1'" color="#1B4ACC" bg-color="#D9EBFF" size="small">{{
                    i18n.global.t('meos_control_web.online')
                }}</m-tag>
            </div>
            <div>
                <!-- <div class="fc mt8">
                    <div class="ft">{{ i18n.global.t('meos_control_web.related_control_module_colon') }}</div>
                    <div>F1_{{ i18n.global.t('meos_control_web.lighting_control_module') }}</div>
                </div> -->
                <div class="fc mt8">
                    <div class="ft">{{ i18n.global.t('meos_control_web.related_distribution_box_colon') }}</div>
                    <div>{{ obj.relDistributionCabinet?.localName ?? '--' }}</div>
                </div>
                <div class="fc mt8">
                    <div class="ft">{{ i18n.global.t('meos_control_web.related_electrical_shaft_colon') }}</div>
                    <div>{{ obj.relSpace?.localName ?? '--' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import SvgIcon from '@/components/common/SvgIcon.vue';
import { PropType } from 'vue';
import i18n from '@/localization';
defineProps({
    obj: {
        type: Object as PropType<any>,
        default: () => {}
    }
});
const state = reactive({
    loopUnpackShow: true,
    abnormalShow: true
});
// const days = computed(() => (minutes: any) => {
//     const day = Math.floor(minutes / 60 / 24);
//     return day;
// });
// const hours = computed(() => (minutes: any) => {
//     const hour = Math.ceil((minutes % (60 * 24)) / 60);
//     return hour;
// });
</script>
<style lang="less" scoped>
.loopList {
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
        -webkit-line-clamp: 3;
    }
    .set-operation {
        background: var(--gray-200, #e8ecf0);
        padding: 4px 8px;
    }
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
