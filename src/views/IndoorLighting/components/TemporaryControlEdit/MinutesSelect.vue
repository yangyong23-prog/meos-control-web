<template>
    <div v-if="!isLongterm" class="btn-duration-group">
        <div v-for="item in durationOptions" :key="item.key" :class="['btn-duration', value === item.value ? 'btn-act' : '']" @click="value = item.value">
            {{ item.name }}
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const durationOptions = [
    {
        key: 0,
        value: 30,
        name: `30${i18n.global.t('meos_control_web.minute')}`
    },
    {
        key: 1,
        value: 60,
        name: `60${i18n.global.t('meos_control_web.minute')}`
    },
    {
        key: 2,
        value: 120,
        name: i18n.global.t('meos_control_web.num_hour', { num: 2 })
    },
    {
        key: 3,
        value: 360,
        name: i18n.global.t('meos_control_web.num_hour', { num: 6 })
    },
    {
        key: 4,
        value: 720,
        name: i18n.global.t('meos_control_web.num_hour', { num: 12 })
    }
];
const value = defineModel({ type: Number, default: 60 });
</script>
<style lang="less" scoped>
.btn-duration-group {
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    .btn-duration {
        display: flex;
        padding: 4px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // gap: 10px;
        flex: 1 0 0;
        white-space: nowrap;

        cursor: pointer;

        border-radius: 4px;
        border: 1px solid var(--grey-400, #c4c9cf);
        background: var(--Grey-Grey-0-Text, #fff);

        color: var(--Grey-Grey-600, #626c78);
        font-size: 14px;
        font-weight: 400;
    }
    .btn-act {
        border: 1px solid var(--blue-500, #246fe5);
        background: var(--blue-50, #ebf6ff);
        color: var(--blue-500, #246fe5);
    }
    .btn-duration:hover {
        border: 1px solid var(--blue-500, #246fe5);
    }
}
</style>
