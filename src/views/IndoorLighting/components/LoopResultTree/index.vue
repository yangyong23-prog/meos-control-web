<template>
    <div class="config-tree-container">
        <m-tree ref="tree" :data="data" class="tree" last-stage readonly>
            <template #nodeSlot="node">
                <div class="item-container">
                    <div v-ellipsis class="m-ellipsis">{{ node.name }}</div>
                </div>
            </template>
            <template #nodeSuffix="node">
                <div v-if="node.children?.length > 0" class="count">{{ i18n.global.t('meos_control_web.loop_on_colon') }}{{ node.openCount }}/{{ node.loopCount }}</div>
            </template>
            <template #rowSuffix="node">
                <m-tag v-if="node.status && statusStyle[node.status]" size="small" :bg-color="statusStyle[node.status].bgColor" :color="statusStyle[node.status].textColor">{{
                    statusStyle[node.status].text
                }}</m-tag>
            </template>
        </m-tree>
    </div>
</template>
<script setup>
import i18n from '@/localization';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});
const statusStyle = {
    ALL_OPEN: {
        bgColor: '#FFF0CC',
        textColor: '#E68600',
        text: i18n.global.t('meos_control_web.all_on')
    },
    OPEN: {
        bgColor: '#FFF0CC',
        textColor: '#E68600',
        text: i18n.global.t('common.status_open')
    },
    PART_OPEN: {
        bgColor: '#FFE6E5',
        textColor: '#D72824',
        text: i18n.global.t('meos_control_web.partial_on')
    },
    ALL_CLOSE: {
        bgColor: '#E8ECF0',
        textColor: '#626C78',
        text: i18n.global.t('meos_control_web.all_off')
    },
    CLOSE: {
        bgColor: '#E8ECF0',
        textColor: '#626C78',
        text: i18n.global.t('common.status_close')
    }
};

watch(
    () => props.data,
    () => {
        props.data?.forEach(func => {
            let funcOpenCount = 0,
                loopCount = 0;
            func.children?.forEach(lamp => {
                let lampOpenCount = 0;
                lamp.children?.forEach(loop => {
                    if (loop.status === 'OPEN') {
                        lampOpenCount += 1;
                    }
                });
                lamp.loopCount = lamp.children?.length ?? 0;
                lamp.openCount = lampOpenCount;
                funcOpenCount += lampOpenCount;
                loopCount += lamp.loopCount;
            });
            func.loopCount = loopCount;
            func.openCount = funcOpenCount;
        });
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.config-tree-container {
    width: 100%;
    display: flex;
    padding: 5px 8px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;
    .tree {
        padding: 0;
    }
    .item-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
    .count {
        margin-left: 4px;
        color: var(--gray-600, #626c78);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
    }
}
</style>
