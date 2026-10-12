<template>
    <m-popover :width="width" :show-arrow="false" :theme="theme">
        <template #content>
            <div class="popover-content">
                <div v-if="type === 'target' && name === 'temperature'">
                    <div v-for="item in temperatureList" :key="item.title" class="popover-content-item">
                        <div class="title">{{ item.title }}</div>
                        <div class="content">{{ item.content }}</div>
                    </div>
                </div>
                <div v-else-if="type === 'target' && name === 'co2'">
                    <div v-for="item in co2List" :key="item.title" class="popover-content-item">
                        <div class="title" v-html="item.title"></div>
                        <div class="content">{{ item.content }}</div>
                    </div>
                </div>
                <div v-else-if="type === 'target' && name === 'rh'">
                    <div v-for="item in rhList" :key="item.title" class="popover-content-item">
                        <div class="title" v-html="item.title"></div>
                        <div class="content">{{ item.content }}</div>
                    </div>
                </div>
                <div v-else-if="type === 'target' && name === 'pressureDiff'">
                    <div v-for="item in pressureDiffList" :key="item.title" class="popover-content-item">
                        <div class="title" v-html="item.title"></div>
                        <div class="content">{{ item.content }}</div>
                    </div>
                </div>
                <div v-else>{{ content }}</div>
            </div>
        </template>
        <IconMeriComponentDialogLinear :size="14" color="#626C78" />
    </m-popover>
</template>

<script setup>
import { IconMeriComponentDialogLinear } from 'meri-icon';
import i18n from '@/localization';
defineProps({
    content: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    theme: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: '' //'temperature' or 'rh' or 'co2' or 'pressureDiff'
    }
});
const temperatureList = inject('temperatureList', ref([]));
const co2List = inject('co2List', ref([]));

const rhList = ref([
    { title: i18n.global.t('meos_control_web.humidity_comfort_zone_upper_limit_alt'), content: i18n.global.t('meos_control_web.humidity_comfort_zone_upper_limit_alt_tips') },
    { title: i18n.global.t('meos_control_web.humidity_comfort_zone_lower_limit_alt'), content: i18n.global.t('meos_control_web.humidity_comfort_zone_lower_limit_alt_tips') },
    { title: i18n.global.t('meos_control_web.humidity_over_dry_threshold_alt'), content: i18n.global.t('meos_control_web.humidity_over_dry_threshold_alt_tips') },
    { title: i18n.global.t('meos_control_web.humidity_over_wet_threshold_alt'), content: i18n.global.t('meos_control_web.humidity_over_wet_threshold_alt_tips') }
]);
const pressureDiffList = ref([
    { title: i18n.global.t('meos_control_web.pressure_diff_lower_limit'), content: i18n.global.t('meos_control_web.pressure_diff_lower_limit_tips') },
    { title: i18n.global.t('meos_control_web.pressure_diff_upper_limit'), content: i18n.global.t('meos_control_web.pressure_diff_upper_limit_tips') }
]);
</script>
<style lang="less" scoped>
.popover-content {
    max-width: 420px;
    &-item {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
        .title {
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            line-height: 22px;
        }
        .content {
            color: #e8ecf0;
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            margin-top: 4px;
            word-wrap: break-word;
        }
    }
}
</style>
