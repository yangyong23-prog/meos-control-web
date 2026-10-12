<template>
    <div class="equipment-modal-content-wrap" :style="{ top: qiankunWindow?.__POWERED_BY_QIANKUN__ ? '48px' : 0 }">
        <leftSelect
            :template-loading="templateLoading"
            :template-list="templateList"
            :template-list-tree="templateListTree"
            :running-monitor-type="props.runningMonitorType"
            @close="close"
        />
        <rightTable :running-monitor-type="props.runningMonitorType" :page-size="pageSize" :all-loops="allLoops" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { qiankunWindow } from '@/utils/helper';
import leftSelect from './leftSelect.vue';
import rightTable from './rightTable/index.vue';
import { useLeftSelect } from './hooks/useLeftSelect';
const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    pageSize: {
        type: Number,
        default: 20
    },
    // 是否按需订阅
    isSubscriptOnDemand: {
        type: Boolean,
        default: false
    },
    fromCode: {
        type: String,
        default: ''
    },
    allLoops: {
        type: Array,
        default: () => []
    },
    objectType: {
        type: String,
        default: null
    }
});
const emits = defineEmits(['close']);
const { templateList, templateListTree, templateLoading } = useLeftSelect(props);

const close = () => {
    emits('close');
};
provide('runningMonitorType', props?.runningMonitorType);
</script>
<style lang="less" scoped>
.equipment-modal-content-wrap {
    position: fixed;
    z-index: 3900;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    background: #fff;
}
</style>
