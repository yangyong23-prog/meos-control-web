<template>
    <div :class="['abnormal-box', isLoadedEmpty ? 'load-empty' : '']">
        <AbnormalList
            :abnormal-event-list="renderList"
            :abnormal-event-list-loaded-time="curDateString"
            :abnormal-event-list-loading="props?.detailWithList?.abnormalEventListLoading || false"
            :abnormal-event-list-update-time="abnormalEventListUpdateTime"
            :show-type="'tab'"
            :padding-right="paddingRight"
            @hover-abnormal-item="hoverAbnormalItem"
            @unhover-abnormal-item="unhoverAbnormalItem"
        />
    </div>
</template>

<script setup>
import DockSingleton from '@/hooks/responsiveDock';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { DETAIL, getDayjsTz } from '@/utils/globalVariables';

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => {}
    },
    detailWithList: {
        type: Object,
        default: () => {}
    },
    paddingRight: {
        type: Number,
        default: 24
    },
    sseClient: {
        type: Object,
        default: null
    }
});

const emits = defineEmits(['hover-abnormal-item', 'unhover-abnormal-item']);
const { getAbnormalEventsList } = DockSingleton.getInstance();
const commonDrawerRoot = inject(commonDrawerRootContextKey);
const abnormalEventListUpdateTime = ref(getDayjsTz().format('YYYY-MM-DD HH:mm'));

let propsSseClient = props.sseClient;

const _abnormalEventList = defineModel({ type: Array, default: () => [] });
const equipmentId = computed(() => {
    return props.selectObj.id;
});

onMounted(() => {
    if (props.sseClient) {
        useEquipInfoSSEHandle(
            equipmentId,
            {
                RISK_EVENT_DETAIL: _abnormalEventList
            },
            true,
            DETAIL,
            propsSseClient
        );
    }
});

const renderList = computed(() => {
    if (commonDrawerRoot?.props?.isSubscriptOnDemand || !props?.sseClient) {
        if (Object.keys(props.detailWithList || {})?.length) {
            return props.detailWithList?.abnormalEventList || [];
        } else if (props.selectObj?.id) {
            return getAbnormalEventsList([props?.selectObj?.id]);
        } else {
            return [];
        }
    } else {
        return _abnormalEventList.value;
    }
});

watch(
    () => renderList.value,
    () => {
        abnormalEventListUpdateTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
    },
    {
        deep: true
    }
);

const curDateString = computed(() => {
    return getDayjsTz().format('YYYY-MM-DD HH:mm');
});

const isLoadedEmpty = computed(() => {
    const isLoading = props?.detailWithList?.abnormalEventListLoading || false;
    return !isLoading && renderList.value?.length === 0;
});

const hoverAbnormalItem = item => {
    emits('hover-abnormal-item', item);
};

const unhoverAbnormalItem = () => {
    emits('unhover-abnormal-item');
};
</script>

<style lang="less" scoped>
.abnormal-box {
    height: 100%;
    padding: 16px 24px;
    padding-right: 0px;
    padding-bottom: 0px;
}
.load-empty {
    padding: 0px;
    padding-left: 24px;
}
</style>
