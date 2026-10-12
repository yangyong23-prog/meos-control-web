<template>
    <div v-ellipsis class="default-data" v-html="result"></div>
</template>
<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
const { getObjectAbnormalStatus } = DockSingleton.getInstance();
const props = defineProps({
    row: {
        type: Object,
        default: () => {}
    },
    // 设备列表类型
    runningMonitorType: {
        type: String,
        default: ''
    },
    item: {
        type: String,
        default: ''
    }
});
const highlightKeyword = inject('highlightKeywordKey');
const result = computed(() => {
    if (props.item === 'localId' && highlightKeyword && props.runningMonitorType === 'LIGHTING') {
        return highlightKeyword(props.row[props.item]);
    } else if (props.item === 'alarmeventdetail') {
        const id = props.row.objectId || props.row.id;
        if (id) {
            return getObjectAbnormalStatus(id) ? i18n.global.t('meos_control_web.abnormal') : '';
        }
        return '';
    } else {
        return props.row[props.item] || '--';
    }
});
</script>
<style lang="less" scoped>
.default-data {
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    color: #1b2129;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    line-height: 20px;
    max-height: 40px;
    width: 100%;
}
</style>
