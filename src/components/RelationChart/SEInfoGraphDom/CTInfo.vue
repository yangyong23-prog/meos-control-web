<template>
    <div :class="['ct-info-warp', isDisabled && 'disabled']" :style="style">
        <div v-ellipsis class="ct-info-content" @click.stop="jumpToDataAnalysis(data)">{{ data.abbreviationName || 'CT:' }}{{ getItemValText(data) || '--' }}</div>
    </div>
</template>
<script setup>
import DockSingleton from '@/hooks/responsiveDock';

const { getIotData } = DockSingleton.getInstance();
import { jumpToAnalysis } from '@/utils/envUtils';
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});

const style = computed(() => {
    const { size, absoluteLocation } = props.data || {};
    return {
        top: `${absoluteLocation.y}px`,
        left: `${absoluteLocation.x}px`,
        width: `${size.x}px`,
        height: `${size.y}px`
    };
});

const getItemValText = (data, showUnit = true) => {
    const valObj = getIotData(data?.relObj?.dataObject?.id, data?.infoCode);
    if (valObj) {
        return `${valObj.dataValueName || valObj.dataValue || '--'}${showUnit ? data.unit || '' : ''}`;
    }
    return '';
};

const isDisabled = computed(() => {
    return props.data?.category === 'STATIC';
});

const jumpToDataAnalysis = (item, useParentCode = false) => {
    const equipId = props.data?.relObj?.dataObject?.id,
        _infoCode = useParentCode && item.mergeCode ? item.mergeCode : item.infoCode;
    if (equipId && _infoCode && item.category !== 'STATIC') {
        const jumpParams = {
            infoCode: _infoCode,
            id: equipId
        };
        jumpToAnalysis(jumpParams);
    }
};
</script>
<style lang="less" scoped>
.ct-info-warp {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &.disabled {
        cursor: default;
    }
    .ct-info-content {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        border-radius: 2px;
        background: #fff;
        height: 24px;
        line-height: 24px;
        padding: 0px 4px;
        font-size: 24px;
        color: var(--gray-900);
    }
}
</style>
