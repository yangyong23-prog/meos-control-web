<template>
    <ScrollingList :initial-items="data"></ScrollingList>

    <MButton @click="addItem">{{ i18n.global.t('meos_control_web.add_project') }}</MButton>
    <MButton @click="delItem">{{ i18n.global.t('meos_control_web.empty_list') }}</MButton>
</template>

<script setup>
import i18n from '@/localization';
import { defineProps } from 'vue';
import ScrollingList from './ScrollingList.vue';
import { MButton } from 'meri-plus';

// const props = defineProps({
//     data: {
//         type: Array,
//         default: () => []
//     }
// });

const data = ref([]);

const addItem = () => {
    console.log('==================');
    data.value.push(`${i18n.global.t('meos_control_web.new_project')}${data.value.length + 1}`);
};

const delItem = () => {
    data.value = [];
};
</script>
