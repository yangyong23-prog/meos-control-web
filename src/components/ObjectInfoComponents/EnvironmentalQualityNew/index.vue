<template>
    <!-- <div class="env-container"> -->
    <m-scrollbar v-if="groupList?.length > 0" box-class="environmental-quality-scrollbar" :content-style="'height:100%'">
        <div v-for="(groupItem, idx) in groupList" :key="idx">
            <div class="title">{{ groupItem?.groupName }}</div>
            <div v-for="(item, index) in groupItem?.groupChildren" :key="index">
                <ItemChart
                    :graphic-data="item"
                    :object-id="selectObj?.id"
                    :is-open="curOpenedRecord[`${groupItem.groupCode}-${item.groupCode}`]"
                    :running-monitor-type="runningMonitorType"
                    @open-item="switchOpen(groupItem.groupCode, item.groupCode)"
                />
            </div>
        </div>
    </m-scrollbar>
    <div v-else class="wh100 fcc">
        <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
    </div>
    <!-- </div> -->
</template>

<script setup>
import ItemChart from './ItemChart.vue';
import i18n from '@/localization';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    selectObj: {
        type: Object,
        default: () => ({})
    }
});
const curOpenedRecord = ref({});

const groupList = computed(() => {
    return props.data?.filter(obj => !!obj);
});
watch(
    () => groupList.value,
    () => {
        curOpenedRecord.value = {};
        groupList.value?.forEach(groupItem => {
            groupItem?.groupChildren?.forEach((item, idx) => {
                const k = `${groupItem.groupCode}-${item.groupCode}`;
                if (idx < 2) {
                    curOpenedRecord.value[k] = true;
                }
            });
        });
    }
);
const switchOpen = (parentCode, code) => {
    const k = `${parentCode}-${code}`;
    curOpenedRecord.value[k] = !curOpenedRecord.value[k];
};
</script>

<style lang="less" scoped>
:deep(.environmental-quality-scrollbar) {
    padding: 0 10px 0 24px;
}
// .env-container {
// height: 100%;
// margin-right: -14px;
.title {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    font-size: 16px;
    font-weight: 700;
    height: 22px;
    line-height: 22px;
    margin: 16px 0;
    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500, #246fe5);
        content: '';
    }
}
.title-name {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    font-size: 16px;
    font-weight: 700;
    height: 22px;
    line-height: 22px;
    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500, #246fe5);
        content: '';
    }
}
.exception-list {
    padding-right: 10px;
    &-item {
        position: relative;
        padding: 12px 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #fffbfb 0.85%, rgba(255, 255, 255, 0) 96.02%);
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    &-title {
        padding-left: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
    &-title:before {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #f55047;
        border: 1px solid #fff;
        left: 10px;
        top: 18px;
    }
}
.exception-list-item:hover {
    cursor: pointer;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}
.mb0 {
    margin-bottom: 0;
}
// }
</style>
