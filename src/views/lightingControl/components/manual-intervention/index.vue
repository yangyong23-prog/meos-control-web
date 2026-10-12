<template>
    <div class="manual-intervention-container">
        <div v-for="(item, index) in listData" :key="index" class="manual-intervention-content">
            <ManualConfigCard
                :data="item"
                :default-expand="computedListAmount < 2"
                :expand-scroll="index === computedListAmount - 1"
                @edit:intervention="editIntervention"
                @remove:intervention="removeIntervention"
            />
        </div>
        <InterveneModal v-if="showModal" :edit-data="modalEditData" :obj="modalExtraData" @ok="ok" @close="close" />
        <div v-if="!listData.length && !props?.isLoading" class="empty">
            <SvgIcon name="empty" />
            <div class="text">{{ i18n.global.t('meos_control_web.no_demand2') }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { release } from '@/apis/LightingDetail';
import { $Message } from 'meri-plus';
import SvgIcon from '@/components/common/SvgIcon.vue';
import ManualConfigCard from './ManualConfigCard.vue';
import InterveneModal from '../intervene/interveneModal.vue';
import { InterventionProps } from './types';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { getInterventionConfigDetail } from '@/apis/lightingDemandIntervention';
import { MLoading } from 'meri-plus';

interface ManualInterventionProps {
    data?: InterventionProps[];
    isLoading?: boolean;
}
const props = defineProps<ManualInterventionProps>();

// TODO 接口联调：数据录入、编辑解除干预、刷新列表
const listData = ref<InterventionProps[]>([]);
const showModal = ref(false);
const modalEditData = ref({});
const modalExtraData = ref({});
const loadingRef = ref();

const computedListAmount = computed(() => listData?.value?.length ?? 0);
const emits = defineEmits(['refresh:list']);

watch(
    () => props?.isLoading,
    cur => {
        if (cur) {
            loadingRef.value = MLoading.service({
                target: '.manual-intervention-content',
                fullscreen: false,
                duration: 2000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            loadingRef.value?.destroy?.();
        }
    }
);

watch(
    () => props?.data,
    cur => {
        listData.value = cur ?? [];
    },
    { immediate: true }
);

const editIntervention = (item: InterventionProps) => {
    const obj = {
        runningMonitorSecondType: item.runningMonitorSecondType,
        configId: item.configId,
        instanceId: item.instanceId,
        instanceType: item.instanceType
    };
    getInterventionConfigDetail(obj).then((res: any) => {
        modalEditData.value = { id: item.configId, ...(res.data || {}) };
        modalExtraData.value = {
            id: item.instanceId,
            localName: '',
            objType: item.instanceType
        };
        showModal.value = true;
    });
};

const removeIntervention = async (item: InterventionProps) => {
    const res = await release({ interventionId: item.configId });
    if (res?.code === SUCCESSCODE) {
        $Message.success({ title: `${i18n.global.t('meos_control_web.release_intervention_success')}` });
        listData.value = [];
        refreshList();
    }
};

const refreshList = () => {
    emits('refresh:list', listData.value);
};

const ok = async () => {
    listData.value = [];
    refreshList();
};

const close = () => {
    modalEditData.value = {};
    modalExtraData.value = {};
    showModal.value = false;
};

onUnmounted(() => {
    loadingRef.value?.destroy?.();
});
</script>

<style lang="less" scoped>
.manual-intervention-container {
    display: flex;
    flex-direction: column;
    row-gap: 20px;

    .empty {
        width: 100%;
        flex: 1 0 0;
        min-height: 280px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .text {
            color: var(--gray-600, #626c78);
            text-align: center;

            font-size: 14px;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            margin-top: 8px;
        }
    }
}
</style>
