<template>
    <div v-if="textMapData?.infoDetail" class="text-graph" :style="warpStyle">
        <!-- 多数据 -->
        <m-tips :disabled="isDisabled" theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
            <template #content>
                <span class="jum-tip" style="font-size: 12px; color: var(--gray-400)">*{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</span>
                <br />
                <span>{{ getIotName(textMapData) }}{{ getIotValue(textMapData) }} &nbsp;&nbsp;</span>
            </template>
            <div :class="['iot-info', isDisabled && 'disabled']" :style="contentStyle">
                <span class="mutil-value-item" @click.stop="jumpToDataAnalysis(textMapData)"> {{ getIotName(textMapData) }}{{ getIotValue(textMapData) }}</span>
            </div>
        </m-tips>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { jumpToAnalysis } from '@/utils/envUtils';

const { getIotData } = DockSingleton.getInstance();
// localRemoteStatus 1远程 or 0本地
// manualAutoStatus 0手动 1自动
const props = defineProps({
    textMapData: {
        type: Object,
        default: () => ({})
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    },
    dataObject: {
        type: Object,
        default: () => ({})
    }
});

const warpStyle = computed(() => {
    return {
        width: props.textMapData.size.x + 'px',
        height: props.textMapData.size.y + 'px',
        left: props.textMapData.absoluteLocation.x + 'px',
        top: props.textMapData.absoluteLocation.y + 'px'
    };
});

const contentStyle = computed(() => {
    return {
        transform: `scale(${props.legendScaleRatio})`,
        maxWidth: `${props.textMapData.size.x / props.legendScaleRatio}px`
    };
});
const getIotName = iot => {
    let title = iot?.textTitle || iot?.infoDetail?.aliasName || iot?.infoDetail?.name || '';
    if (title) {
        if (title.endsWith(':') || title.endsWith('：')) {
            return title;
        }
        return title + ':';
    }
    return '';
};
const getIotValue = iot => {
    const { infoCode } = iot;

    const valObj = getIotData(unref(props).dataObject.id, infoCode);
    // console.log('getIotValue---valObj: ', valObj);
    if (!valObj) return;
    const { dataValue } = valObj;
    if (!(dataValue || dataValue === 0)) return '--';
    return Number(dataValue).toFixed(1) + (iot.unit || '');
};

const isDisabled = computed(() => {
    return props.textMapData?.infoDetail?.category === 'STATIC';
});

const jumpToDataAnalysis = iot => {
    if (isDisabled.value) return;
    const { infoCode } = iot;
    const jumpParams = {
        infoCode: infoCode,
        id: unref(props).dataObject.id
    };
    jumpToAnalysis(jumpParams);
};
</script>
<style lang="less" scoped>
.text-graph {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    user-select: none;

    .iot-warp-line {
        display: inline-flex;
        gap: 10px;
        justify-content: center;
        .iot-warp-line-item {
            padding: 0 4px;
            border-radius: 2px;
            background: #fff0cc;
            color: #e68600;
            font-size: 12px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 20px;
        }
    }

    .iot-info {
        color: var(--gray-600);
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 100%;
        cursor: pointer;
        padding: 4px;
        border-radius: 2px;
        background: rgba(247, 249, 250, 0.9);
        &.disabled {
            cursor: default;
            &:hover {
                background-color: transparent;
                color: var(--gray-600);
                background: rgba(247, 249, 250, 0.9);
            }
        }
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            color: var(--blue-500);
        }
    }
}
</style>
