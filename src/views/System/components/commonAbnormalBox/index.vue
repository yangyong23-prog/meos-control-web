<template>
    <div class="abnormal-box h100">
        <AbnormalList
            :abnormal-event-list="abnormalEventList"
            :abnormal-event-list-loaded-time="curDateString"
            :abnormal-event-list-loading="false"
            :abnormal-event-list-update-time="curDateString"
            :show-type="'tab'"
            :padding-right="24"
        />
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import DockSingleton from '@/hooks/responsiveDock';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import { getDayjsTz } from '@/utils/globalVariables';
const { getAbnormalEventsList, getAllObjectInfo } = DockSingleton.getInstance();

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => ({})
    },
    ids: {
        type: Array,
        default: () => []
    }
});
const abnormalEventList = computed(() => {
    const idSet = new Set();
    if (props.selectObj?.id) {
        idSet.add(props.selectObj.id);
    }
    if (props.ids?.length) {
        idSet.add(...props.ids);
    }
    if (idSet.size === 0) {
        return [];
    }
    const arr = getAbnormalEventsList([...idSet]) || [];
    return arr;
});

const curDateString = computed(() => {
    return getDayjsTz().format('YYYY-MM-DD HH:mm');
});
onMounted(() => {
    console.log(getAllObjectInfo());
});
</script>
<style lang="less" scoped>
.abnormal-box {
    padding-left: 24px;
    padding-top: 16px;
}
</style>
