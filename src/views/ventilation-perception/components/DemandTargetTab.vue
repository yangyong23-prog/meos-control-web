<template>
    <div class="demand-target-tab-wrapper">
        <ConfigList :info-data="configListData" :info-loading="listLoading" :is-demand-target="true" :with-padding="props?.withPadding" />
    </div>
</template>

<script setup>
import ConfigList from '@/views/DemandManagementHome/right-demand-config-vent/components/ConfigList.vue';
import { listConfigsByInstance } from '@/apis/DemandManagementHome';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';

const props = defineProps({
    withPadding: {
        type: Boolean,
        default: true
    },
    isFromSpace: {
        type: Boolean,
        default: false
    }
});

const configListData = ref({});
const listLoading = ref(false);
const fetchAbortController = ref();

const templateType = inject('templateType');
const instanceType = inject('computedInstanceType');
const instanceId = inject('computedInstanceId');

const instanceParams = computed(() => {
    return {
        templateType: templateType?.value,
        instanceType: instanceType?.value,
        instanceIds: [instanceId?.value]
    };
});

const fetchConfigList = async (instanceData = {}) => {
    configListData.value = [];
    fetchAbortController.value?.abort();
    fetchAbortController.value = new AbortController();
    listLoading.value = true;

    const requestParams = {
        ...instanceData,
        date: getDayjsTz().format('YYYY-MM-DD')
    };
    const res = await listConfigsByInstance(requestParams, fetchAbortController.value.signal).finally(() => {
        listLoading.value = false;
    });
    if (res?.code === '00000') {
        const resData = res.data;
        configListData.value = resData;
    }
};

watch(
    [instanceParams, () => props?.isFromSpace],
    ([cur, curIsFromSpace]) => {
        if (cur?.templateType && cur?.instanceType) {
            if (cur?.instanceType === 'SPACE' && !curIsFromSpace) {
                return;
            }
            fetchConfigList(cur);
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.demand-target-tab-wrapper {
    height: 100%;
}
</style>
