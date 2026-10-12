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
import { getDayjsTz } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
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
    const arr = getAbnormalEventsList([props.selectObj.id, ...props.ids]) || [];
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
