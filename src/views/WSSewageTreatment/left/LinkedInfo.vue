<template>
    <div class="linked-info-wrap">
        <m-scrollbar v-if="relEquipGroups.length" box-class="control-console-box-scrollbar" @scroll="onScroll">
            <template v-if="relEquipGroups.length">
                <ConfigBox class="config-box-custom-wrap" :title="i18n.global.t('common.submersible_sewage_pump')" :collapse="relEquipGroups.length >= 2">
                    <RelEquipList :data="relEquipGroups" v-bind="$attrs" :running-monitor-type="runningMonitorType" :select-obj="selectObj" class="rel-equip-list" />
                </ConfigBox>
            </template>
        </m-scrollbar>
        <div v-else class="no-data">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import ConfigBox from '@/components/ObjectInfoComponents/ControlSet/ConfigBox.vue';

import RelEquipList from './RelEquipList.vue';

const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    processedData: {
        type: Array,
        default: () => []
    }
});

const relEquipGroups = ref([]);

watch(
    () => props.processedData,
    cur => {
        if (Array.isArray(cur)) {
            relEquipGroups.value = cur;
        }
    },
    {
        immediate: true
    }
);

const onScroll = () => {};
</script>
<style lang="less" scoped>
.linked-info-wrap {
    width: 100%;
    height: 100%;
}
:deep(.control-console-box-scrollbar) {
    padding: 0 24px 16px 24px;
}
.title {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    height: 22px;
    line-height: 22px;

    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500);
        content: '';
    }
}
.settings {
    width: 100%;
    padding: 8px 0px;
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
}
.exception-list {
    &-item {
        position: relative;
        padding: 12px 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #fffbfb 0.85%, rgba(255, 255, 255, 0) 96.02%);
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
.equipment-good {
    width: 100%;
    padding: 12px 20px;
    background-color: #f7f9fa;
}
.abnormal-list-warp {
    :deep(.abnormal-item) {
        margin-right: 0px !important;
    }
}
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.config-box-custom-wrap {
    margin-top: 16px;
}
.rel-equip-list {
    margin-top: 12px;
}
</style>
