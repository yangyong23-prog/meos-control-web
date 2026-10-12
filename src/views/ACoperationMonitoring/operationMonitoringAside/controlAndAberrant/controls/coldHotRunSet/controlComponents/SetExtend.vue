<template>
    <div class="control-set-extend fc">
        {{ controlItem.extend }}
        <m-popover placement="bottom" width="280px" :mouse-leave-delay="300">
            <template #content>
                <PlanList :control-item="controlItem" :open-close-times="controlItem.openCloseTimes" />
            </template>
            <div class="fcc">
                <SvgIcon name="info-gray" />
            </div>
        </m-popover>
    </div>
</template>

<script setup>
import PlanList from './PlanList.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
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
    background-color: var(--gray-100);
    color: var(--gray-600);
    border-radius: 4px;
    gap: 8px;
    padding: 4px 12px;
}
</style>
