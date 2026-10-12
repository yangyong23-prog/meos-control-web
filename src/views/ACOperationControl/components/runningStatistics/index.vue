<template>
    <m-modal v-model:visible="show" :append-to="$modalAppendTo" type="full" content-class-name="running-statistics" :need-scrollbar="false" :footer="false" @close="close">
        <template #header>
            <div class="fcb">
                <div class="fc">
                    {{ i18n.global.t('meos_control_web.run_total') }}&nbsp;
                    <m-tips :content="i18n.global.t('meos_control_web.run_total_tips')" theme="darkTransparent">
                        <IconMeriComponentDialogLinear color="var(--gray-600)" />
                    </m-tips>
                    &nbsp;
                    <span v-if="time" class="fs12" style="color: var(--gray-600); font-weight: 400">
                        {{ i18n.global.t('meos_control_web.run_total_time', { time: time }) }}
                    </span>
                </div>
                <m-button v-if="!loading" type="link" size="small" style="margin-right: 20px" @click="showFloorTotal = true">
                    {{ i18n.global.t('meos_control_web.floor_total') }}
                </m-button>
            </div>
        </template>
        <template #content>
            <div v-if="tabs.length > 2" class="running-statistics-tabs" style="width: fit-content; max-width: 100%">
                <m-tabs v-model="currentTab" :data="tabs" type="segment" size="medium" :style="{ width: '100%' }"></m-tabs>
            </div>
            <TableList
                v-if="!loading"
                :key="currentTab"
                class="running-statistics-table"
                :current-tab="currentTab"
                :data-source="getTableListByBuildType()"
                :class-list-map="classListMap"
                :is-one-build="treeBuildFloorStore()?.treeBuildFloor?.length === 1"
                :style="{ height: tabs.length > 2 ? 'calc(100% - 42px)' : '100%' }"
            />
        </template>
    </m-modal>
    <FloorTotal v-if="showFloorTotal" :data-source="tableListData" @close="showFloorTotal = false" />
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import useLoading from '@/hooks/useLoading';
import dayjs from 'dayjs';
import TableList from './TableList.vue';
import { dashboardEquipment } from '@/apis/ACOperationControl';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import FloorTotal from './FloorTotal.vue';
import { AIR_TERMINAL, TABLE_LIST, OBJ_TYPE } from '@/utils/globalVariables';
const { cancelQuest, cancelToken } = UseCancelTokenHooks();
const { loading, openLoading, closeLoading } = useLoading('running-statistics', '#fff');
const show = ref(false);
const emits = defineEmits(['close']);
const close = () => {
    show.value = false;
    closeLoading();
    nextTick(() => {
        emits('close');
    });
};
const showFloorTotal = ref(false);
const time = ref('');
const tableListData = ref([]);
const currentTab = ref('all');
const buildList = ref([]);
const classListMap = ref(new Map());
const tabs = computed(() => {
    const arr = buildList.value.map(item => ({
        name: item.name,
        id: item.id
    }));
    arr.unshift({ name: i18n.global.t('common.all'), id: 'all' });
    return arr;
});
const getTableListByBuildType = () => {
    if (currentTab.value === 'all') {
        return tableListData.value;
    }
    return tableListData.value.filter(item => item.buildId === currentTab.value);
};
const getEquipments = async () => {
    openLoading();
    loading.value = true;
    cancelQuest();
    buildList.value = [];
    tableListData.value = [];
    classListMap.value = new Map();
    try {
        const res = await dashboardEquipment(
            {
                runningMonitorType: AIR_TERMINAL,
                templateType: TABLE_LIST,
                objectType: OBJ_TYPE.EQUIPMENT
            },
            { cancelToken: cancelToken() }
        );
        res.data?.forEach(item => {
            buildList.value.push({ id: item.building.id, name: item.building.localName });
            const arr = item.floors.map(val => {
                val.statistics.forEach(stat => {
                    classListMap.value.set(stat.templateName, { templateName: stat.templateName, classCode: stat.templateName, templateSequence: stat.templateSequence });
                });
                return { ...val.floor, statistics: val.statistics, buildName: item.building.localName, buildId: item.building.id, name: val.floor.localName };
            });
            tableListData.value.push(...arr);
        });
    } finally {
        loading.value = false;
        time.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
        closeLoading();
    }
};
onMounted(() => {
    show.value = true;
    getEquipments();
});
onUnmounted(() => {
    tableListData.value = [];
    closeLoading();
    cancelQuest();
});
</script>
<style lang="less" scoped>
.running-statistics-tabs {
    padding-bottom: 10px;
}

.refresh-btn {
    margin-left: 12px;
}
</style>
