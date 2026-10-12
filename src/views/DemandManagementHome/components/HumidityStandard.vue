<template>
    <div class="humidity-standard-container">
        <div class="fc ml12 mt16 mb8">
            <div class="f14 fb7 ft">{{ i18n.global.t('meos_control_web.humidity_standard') }}</div>
            <m-popover :width="336 + 'px'" :show-arrow="false" theme="darkTransparent" placement="right-start">
                <template #content>
                    <div>
                        <div>
                            <div class="f14 fb7">{{ i18n.global.t('meos_control_web.humidity_comfort_zone_upper_limit_alt') }}</div>
                            <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.humidity_comfort_zone_upper_limit_alt_tips') }}</div>
                        </div>
                        <div class="mt10">
                            <div class="f14 fb7">{{ i18n.global.t('meos_control_web.humidity_comfort_zone_lower_limit_alt') }}</div>
                            <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.humidity_comfort_zone_lower_limit_alt_tips') }}</div>
                        </div>
                        <div class="mt10">
                            <div class="f14 fb7">{{ i18n.global.t('meos_control_web.humidity_over_dry_threshold_alt') }}</div>
                            <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.humidity_over_dry_threshold_alt_tips') }}</div>
                        </div>
                        <div class="mt10">
                            <div class="f14 fb7">{{ i18n.global.t('meos_control_web.humidity_over_wet_threshold_alt') }}</div>
                            <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.humidity_over_wet_threshold_alt_tips') }}</div>
                        </div>
                    </div>
                </template>
                <svg aria-hidden="true" class="row-tips-icon ml4">
                    <use :xlink:href="'#icon-info-small'" />
                </svg>
            </m-popover>
        </div>
        <div class="content-container">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
</script>

<style lang="less" scoped>
.humidity-standard-container {
    display: flex;
    flex-direction: column;
}
.row-tips-icon {
    width: 16px;
    height: 16px;
    color: @grey-500;
}
.subTips {
    color: @grey-200;
}
.content-container {
    background: #f7f9fa;
}
</style>
