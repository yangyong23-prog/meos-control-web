<template>
    <m-search
        v-model="curItem"
        clearable
        searchable
        :placeholder="i18n.global.t('meos_control_web.search_plate_number')"
        label="carNumber"
        :fetch-suggestions="querySuggest"
        :high-light-field="['carNumber']"
        @select="handleSelect"
        @focus="handlefocus"
    />
</template>

<script lang="js" setup>
import i18n from '@/localization';
import { MSearch } from 'meri-plus';

const emits = defineEmits(['parking-spot-search']);

const props = defineProps({
    list: {
        type: Array,
        default: () => {[]}
    },
    curFloorId: {
        type: String,
        default: ''
    },
    curBuildingId: {
        type: String,
        default: ''
    }
});

const curItem = ref('');
const carNumbers = ref([]);

const querySuggest = (querystring, cb) => {
    if (!querystring || props.list?.length === 0) {
        cb([]);
        return;
    }
	const list = carNumbers.value?.filter(item => new RegExp(querystring, 'i').test(item.carNumber) && item.data.floorId === props.curFloorId && item.data.buildingId === props.curBuildingId);
	cb(list)
}

const handleSelect = (item) => {
    curItem.value = '';
    emits('parking-spot-search', item.data);
}

const handlefocus = (e) => {
    carNumbers.value = props.list ?? [];
}

const clearSearch = () => {
    curItem.value = '';
}

defineExpose({ clearSearch });
</script>
