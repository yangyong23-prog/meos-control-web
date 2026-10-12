<template>
    <div class="pressure-standard-container">
        <div class="fc ml12 mt16 mb8">
            <!-- 压差标准 -->
            <div class="f14 fb7 ft">{{ i18n.global.t('meos_control_web.pressure_diff_standard') }}</div>
            <m-popover :width="336 + 'px'" :show-arrow="false" theme="darkTransparent" placement="right-start">
                <template #content>
                    <div>
                        <div>
                            <!-- 压差-下限值 -->
                            <div class="f14 fb7">{{ i18n.global.t('meos_control_web.pressure_diff_lower_limit') }}</div>
                            <!-- 空间压差允许的最小值，超出后应立即采取措施提高压差 -->
                            <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.pressure_diff_lower_limit_tips') }}</div>
                        </div>
                        <div class="mt10">
                            <!-- 压差-上限值 -->
                            <div class="f14 fb7">{{ i18n.global.t('meos_control_web.pressure_diff_upper_limit') }}</div>
                            <!-- 空间压差允许的最大值，超出后应立即采取措施降低压差 -->
                            <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.pressure_diff_upper_limit_tips') }}</div>
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
.pressure-standard-container {
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
