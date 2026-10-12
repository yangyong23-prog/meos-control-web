<template>
    <div :class="['no-abnormalEventList']">
        <div class="operation-monitoring-aside">
            <div class="operation-monitoring-aside-content" :style="{ height: notifyList?.length || newNotifyList?.length ? 'calc(100% - 70px)' : '100%' }">
                <ControlAndAberrant class="operation-monitoring-aside-content-control" style="display: flex; flex-direction: column; height: 100%" />
            </div>
            <template v-if="isACCI">
                <div v-if="newNotifyList?.length" class="operation-monitoring-aside-broadcast">
                    <CommonNotify :notify-list="newNotifyList" />
                </div>
            </template>
            <template v-else>
                <div v-if="notifyList?.length" class="operation-monitoring-aside-broadcast">
                    <Notify v-if="notifyList?.length" :notify-list="notifyList" />
                </div>
            </template>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import ControlAndAberrant from './controlAndAberrant/index.vue';
import Notify from '../operationMonitoringMain/components/notify.vue';
import UseNotify from '../hooks/useNotify';
import useNotify from '@/components/commonNotify/hooks/useNotify';
import CommonNotify from '@/components/commonNotify/index.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const props = defineProps({
    selectedSystemObj: {
        type: Object,
        required: true
    }
});
const isACCI = ref(false);
const { notifyList } = UseNotify();
const systemId = inject('systemId');
// 通知列表
const { notifyList: newNotifyList, getNotifyList } = useNotify(systemId, 'ACCI');
onMounted(() => {
    if (route.fullPath.includes('ACCI')) {
        isACCI.value = true;
    }
});
watch(
    () => systemId.value,
    () => {
        systemId.value && isACCI.value && getNotifyList();
    }
);
</script>
<style lang="less" scoped>
.no-abnormalEventList,
.be-abnormalEventList {
    height: 100%;
    width: 100%;
}

.operation-monitoring-aside {
    width: 100%;
    height: 100%;
    // &-content {
    //     position: absolute;
    //     top: 16px;
    //     right: 16px;
    //     width: calc(368px + var(--aside-padding));
    //     border-radius: 8px;
    //     background: #fff;
    //     box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
    //     overflow: auto;
    // }
    &-broadcast {
        position: absolute;
        bottom: 16px;
        right: 16px;
        height: 54px;
        margin-top: 16px;
        border-radius: 8px;
        background: linear-gradient(0deg, rgba(241, 248, 255, 0.8) 0%, rgba(241, 248, 255, 0.8) 100%), rgba(225, 239, 255, 0.8);
        box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
    }
}
@media (max-width: 1600px) {
    .operation-monitoring-aside-broadcast {
        width: 384px;
    }
}
@media (min-width: 1600px) {
    .operation-monitoring-aside-broadcast {
        width: 464px;
    }
}
</style>
