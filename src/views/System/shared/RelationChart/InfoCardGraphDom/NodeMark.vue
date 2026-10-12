<template>
    <div class="node-mark-warp" :style="warpStyle">
        <div class="status-marks" :style="{ transform: `scale(${legendScaleRatio})` }">
            <span v-for="(item, index) in abnormalList" :key="item" class="mark-out">
                <span v-if="index === 0 && item !== STATUS_NAME.offline" class="mark-animation" :style="{ background: STATUS_BG_COLOR[item] }"></span>
                <span class="mark-item" :style="{ background: STATUS_BG_COLOR[item] }"></span>
            </span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { STATUS_NAME, STATUS_BG_COLOR } from './constant';
import DockSingleton from '@/hooks/responsiveDock';
import _ from 'lodash';

const { getIotData } = DockSingleton.getInstance();

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    // 支持表达的状态编码
    supportStatusCodes: {
        type: Array,
        default: () => []
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    }
});

const warpStyle = ref({
    left: '0',
    top: '0',
    width: '0',
    height: '0'
});

const abnormalList = ref([]);

const fixedInfoCodes = unref(props).data?.fixedInfoCodes?.map(info => info.infoCode) || [];

watchEffect(() => {
    const { data } = props;
    const { legendNode, dataObject, scale, absoluteLocation, centerLocation } = data;
    if (legendNode) {
        const { location, size } = legendNode;
        const newSize = { x: size.x * scale, y: size.y * scale };
        warpStyle.value = scale
            ? {
                  left: `${absoluteLocation.x - centerLocation.x}px`,
                  top: `${absoluteLocation.y - centerLocation.y}px`,
                  width: `${size.x * scale}px`,
                  height: `${size.y * scale}px`
              }
            : {
                  left: `${location.x}px`,
                  top: `${location.y}px`,
                  width: `${size.x}px`,
                  height: `${size.y}px`
              };
        // 异常状态
        const statusList = [];
        data.renderData.abnormal && statusList.push(STATUS_NAME.abnormal);

        // if (fixedInfoCodes.includes('orderFailAlarm')) {
        //     const inconsistentObj = getIotData(dataObject?.id, 'orderFailAlarm');
        //     if (inconsistentObj?.dataValue === '1') {
        //         statusList.push(STATUS_NAME.inconsistent);
        //     }
        // }

        if (props.supportStatusCodes?.includes('onlineStatus') && fixedInfoCodes.includes('onlineStatus')) {
            const offlineObj = getIotData(dataObject?.id, 'onlineStatus');
            if (!_.isEmpty(offlineObj) && offlineObj?.dataValue === '0') {
                statusList.push(STATUS_NAME.offline);
            }
        }

        abnormalList.value = statusList;
    }
});
</script>
<style lang="less" scoped>
.node-mark-warp {
    position: absolute;
    pointer-events: none;

    .status-marks {
        position: absolute;
        pointer-events: none;
        .mark-out {
            display: inline-block;
            width: 7px;
            line-height: 0;
            position: relative;
            .mark-item {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid #fff;
                border-radius: 50%;
            }
            // 动画 变大再变小
            @keyframes mark-animation {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(5);
                    opacity: 0.2;
                }
                100% {
                    transform: scale(5);
                    opacity: 0;
                }
            }
            .mark-animation {
                position: absolute;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                opacity: 0.2;
                animation: mark-animation 2s cubic-bezier(0, 0, 0.25, 1) infinite;
            }
        }
    }
}
</style>
