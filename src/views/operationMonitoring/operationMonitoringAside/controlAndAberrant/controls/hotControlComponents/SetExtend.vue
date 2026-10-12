<template>
    <div class="control-set-extend fc">
        {{ controlItem.extend }}
        <m-popover placement="bottom" width="280px" :mouse-leave-delay="300">
            <template #content>
                <PlanList :control-item="controlItem" :open-close-times="controlItem.openCloseTimes" />
            </template>
            <div class="fcc">
                <m-button type="link" size="small">{{ i18n.global.t('meos_control_web.details') }}</m-button>
            </div>
        </m-popover>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import PlanList from './PlanList.vue';
defineProps({
    controlItem: {
        type: Object,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.control-set-extend {
    height: 34px;
    // background-color: var(--gray-100);
    color: var(--gray-600);
    border-radius: 4px;
    // gap: 8px;
    padding: 4px 12px;
    padding-left: 0;
}
</style>
