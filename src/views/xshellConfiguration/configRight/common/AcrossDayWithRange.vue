<template>
    <div class="with-date-picker">
        <!-- <m-select v-model="currentVal.acrossDay" :size="100" :menu-size="100" :placeholder="i18n.global.t('meos_control_web.select')" :options="props.options" />
          -->
        <span>{{ i18n.global.t('meos_control_web.next_day') }}</span>
        <m-time-picker v-model="currentVal.beginTime" format="hm" :hide-clear="true" :step-m="5" :width="240" :placeholder="'00:00'" :error-text="''" />
        <span>{{ i18n.global.t('meos_control_web.generate_daily_report') }}</span>
    </div>
</template>

<script setup>
import i18n from '@/localization';

const currentVal = defineModel({ type: Object });
const props = defineProps({
    options: {
        type: Array,
        default: () => []
    }
});
</script>

<style lang="less" scoped></style>
