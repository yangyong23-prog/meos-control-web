<!--
 * @Author: guoxiaohuan
 * @Date: 2023-12-28 19:11:34
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-01-15 14:20:10
 * @Description:
-->
<template>
    <div class="empty-box">
        <!-- ACCC冷站，ACCI冷热源，GROUP泵组 -->
        <div class="img">
            <SvgIcon name="empty" />
            <div>
                <div>{{ i18n.global.t('meos_control_web.chillers_not_delivered_for_project') }}</div>
                <div>{{ i18n.global.t('meos_control_web.please_config_after_delivery') }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
defineProps(['type']);
</script>
<style scoped lang="less">
.empty-box {
    position: relative;
    height: 100%;
    .img {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: var(--gray-600, #626c78);
        text-align: center;
        font-family: Microsoft YaHei UI;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}
</style>
