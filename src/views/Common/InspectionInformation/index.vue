<template>
    <div class="inspection-information fcb">
        <div class="mr40">
            <div class="ft1 f14 mt4">{{ i18n.global.t('meos_control_web.inspection_staff') }}</div>
            <div class="f14">{{ inspectionInformation?.lastUpdateBy }}</div>
        </div>
        <div>
            <div class="ft1 f14 mt4">{{ i18n.global.t('meos_control_web.inspection_time') }}</div>
            <div class="f14">{{ inspectionInformation?.finishTime }}</div>
        </div>
        <!-- <div style="width: 100px">
            <div :class="['f14', inspectionInformation?.finishTime > 0 ? 'color-r' : '']">{{ inspectionInformation?.finishTime }}</div>
            <div class="ft1 f14 mt4">{{ i18n.global.t('meos_control_web.last_inspection_issue') }}</div>
        </div> -->
    </div>
</template>
<script setup>
// import dayjs from 'dayjs';
import i18n from '@/localization';

const props = defineProps({
    inspectionInformation: {
        type: Object,
        default: () => {}
    }
});
</script>
<style lang="less" scoped>
.inspection-information {
    border-radius: 4px;
    background: #f7f9fa;
    padding: 10px 12px;
}
.color-r {
    color: #f55047;
}
</style>
