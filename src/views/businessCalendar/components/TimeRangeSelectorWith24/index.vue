<template>
    <div class="time-range-row">
        <m-cascader
            v-model="startTime"
            :options="startTimeOptions"
            :trigger="'hover'"
            :width="props.singleWidth"
            :drop-panel-single-width="props.singleWidth"
            :placeholder="i18n.global.t('meos_control_web.start_time')"
            :show-all-levels="false"
            clearable
            @clear="handleClear('start')"
        >
            <template #default="data"> {{ data.text }} </template>
        </m-cascader>
        <div class="row-gap"></div>
        <m-cascader
            v-model="endTime"
            :options="endTimeOptions"
            :trigger="'hover'"
            :width="props.singleWidth"
            :drop-panel-single-width="props.singleWidth"
            :placeholder="i18n.global.t('meos_control_web.end_time')"
            :show-all-levels="false"
            clearable
            @clear="handleClear('end')"
        >
            <template #default="data"> {{ data.text }} </template>
        </m-cascader>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { rangeGenerator } from '@/utils';

const props = defineProps({
    singleWidth: {
        type: Number,
        default: 208
    }
});

const startTimeNumbers = [...rangeGenerator(24)];
const endTimeNumbers = [...rangeGenerator(25)];
const minutes = [...rangeGenerator(60, 0, 5)];

const startTime = defineModel('start', { type: String, default: '' });
const endTime = defineModel('end', { type: String, default: '' });
const emits = defineEmits(['change']);

watch([startTime, endTime], () => {
    emits('change', { startTime, endTime });
});

const handleClear = type => {
    nextTick(() => {
        emits('change', { startTime, endTime, type });
    });
};

const startTimeOptions = startTimeNumbers.map(num => {
    const hour = `${num}`.padStart(2, '0');
    const children = minutes.map(min => {
        const minute = `${min}`.padStart(2, '0');
        return {
            id: `${hour}:${minute}`,
            name: `${hour}:${minute}`,
            text: `${minute}`
        };
    });
    return {
        id: hour,
        name: hour,
        text: `${hour}:00`,
        children
    };
});

const endTimeOptions = endTimeNumbers.map(num => {
    const hour = `${num}`.padStart(2, '0');
    const children = minutes.map(min => {
        const minute = `${min}`.padStart(2, '0');
        return {
            id: `${hour}:${minute}`,
            name: `${hour}:${minute}`,
            text: `${minute}`
        };
    });
    return {
        id: num === 24 ? `${hour}:00` : hour,
        name: num === 24 ? `${hour}:00` : hour,
        text: `${hour}:00`,
        children: num === 24 ? [] : children
    };
});
</script>

<style lang="less" scoped>
.time-range-row {
    display: flex;
    align-items: center;
    gap: 8px;
}
.row-gap {
    width: 8px;
    height: 1px;
    background-color: #8b949e;
}
</style>
