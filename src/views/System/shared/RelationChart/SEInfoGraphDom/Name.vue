<template>
    <div v-if="namePlaceObj" class="name-warp" :style="warpStyle">
        <div
            :id="`${idPrefix}${data.id}`"
            ref="nameContentRef"
            class="name-content"
            :style="contentStyle"
            :class="{ selected: data.renderData?.selected, hover: data.renderData?.hover, 'shake-name': data.renderData?.shake }"
            @click.stop="clickName"
            @mousemove.stop="() => {}"
            @mouseenter.stop="hoverName"
            @mouseleave.stop="unHoverName"
        >
            <span v-ellipsis="{ enterable: false }" class="value"> {{ nameText }}</span>
            <span v-if="data?.interactiveConfigVo && data?.interactiveConfigVo?.canJump" class="opera-btn" @click.stop="switchRelationChart">
                <Arrow class="arrow" />
            </span>
        </div>
        <div class="status-marks" :style="{ right: `${markRight}px`, transform: `scale(${legendScaleRatio}) translateY(-50%)` }">
            <span v-for="(item, index) in abnormalList" :key="item" class="mark-out">
                <span v-if="index === 0 && item !== STATUS_NAME.offline" class="mark-animation" :style="{ background: STATUS_BG_COLOR[item] }"></span>
                <span class="mark-item" :style="{ background: STATUS_BG_COLOR[item] }"></span>
            </span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import _ from 'lodash';
import { SHOW_DOM_COM_MAP } from '../constants/common';
const { getIotData } = DockSingleton.getInstance();
import Arrow from '@/assets/svg/up.svg';
import { STATUS_NAME, STATUS_BG_COLOR, STATUS_FONT_COLOR } from '../constants/common';

const props = defineProps({
    idPrefix: {
        type: String,
        default: ''
    },
    webLayout: {
        // 是否是前端布局
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: () => ({})
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    },
    selected: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['switchRelationChart', 'clickName', 'hoverName', 'unHoverName']);

const nameContentRef = ref();

const markRight = ref(0);
const markTop = ref(0);
const updateMarkPosition = size => {
    if (size && nameContentRef.value && !props.data.textMap?.localName?.__diyLayOut) {
        const width = nameContentRef.value.offsetWidth;
        // const height = nameContentRef.value.offsetHeight;
        // 本身未display为none或者其祖先组件为none，就会返回0
        if (width === 0) return;
        markRight.value = (size.x - width * props.legendScaleRatio) / 2;
        // markTop.value = (size.y - height * props.legendScaleRatio) / 2;
    } else {
        // markRight.value = 0;
        markTop.value = 0;
    }
};

const namePlaceObj = ref();

const abnormalList = ref([]);

const warpStyle = ref({
    left: '0',
    top: '0',
    width: 0,
    height: 0
});

const contentStyle = ref({});

const nameText = ref('');

watchEffect(() => {
    const { data } = props;
    const { dataObject } = data;

    // 名称
    nameText.value = (dataObject?.localName || dataObject?.name) ?? '--';
    // 判断是否要显示名字
    if (data.__showComs?.indexOf(SHOW_DOM_COM_MAP.Name) === -1) {
        namePlaceObj.value = null;
        return;
    }
    // 获取位置
    namePlaceObj.value = data?.textMap?.localName;
    if (!namePlaceObj.value) {
        namePlaceObj.value = null;
        return;
    }

    const { absoluteLocation, size } = namePlaceObj.value;
    warpStyle.value = {
        left: `${absoluteLocation.x}px`,
        top: `${absoluteLocation.y}px`,
        width: `${size.x}px`,
        height: `${size.y}px`,
        justifyContent: data.textMap?.localName?.__diyLayOut ? 'flex-end' : 'center'
    };
    nextTick(() => {
        updateMarkPosition(size);
    });

    // 异常状态
    const statusList = [];
    data.renderData?.abnormal && statusList.push(STATUS_NAME.abnormal);
    // const inconsistentObj = getIotData(dataObject?.id, 'orderFailAlarm');
    // if (inconsistentObj?.dataValue === '1') {
    //     statusList.push(STATUS_NAME.inconsistent);
    // }
    // const offlineObj = getIotData(dataObject?.id, 'onlineStatus');
    // if (!_.isEmpty(offlineObj) && offlineObj?.dataValue !== '1') {
    //     statusList.push(STATUS_NAME.offline);
    // }

    let cStyle = {};

    if (statusList[0]) {
        // 异常色
        cStyle = {
            backgroundColor: STATUS_BG_COLOR[statusList[0]],
            color: STATUS_FONT_COLOR[statusList[0]]
        };
    } else {
        // 正常色
        cStyle = {
            backgroundColor: STATUS_BG_COLOR[STATUS_NAME.normal],
            color: STATUS_FONT_COLOR[STATUS_NAME.normal]
        };
    }
    cStyle = {
        ...cStyle,
        transform: `scale(${props.legendScaleRatio})`,
        maxWidth: `${size.x / props.legendScaleRatio}px`
    };

    contentStyle.value = cStyle;
    abnormalList.value = statusList;
});

const switchRelationChart = () => {
    emit('switchRelationChart', props.data.interactiveConfigVo);
};

const clickName = () => {
    emit('clickName', props.data);
};

const hoverName = () => {
    emit('hoverName', props.data);
};
const unHoverName = () => {
    emit('unHoverName', props.data);
};
</script>
<style lang="less" scoped>
.name-warp {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    @keyframes shake {
        0% {
            color: #626c78;
            background-color: rgba(242, 244, 246, 0.9);
        }
        100% {
            color: white;
            background-color: #246fe5;
        }
    }

    .shake-name {
        animation: shake 0.5s infinite;
        animation-direction: alternate;
    }

    .name-content {
        max-width: 100%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 2px;
        padding: 0 4px;
        cursor: default;
        cursor: pointer;
        color: var(--gray-900);

        .mark {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: var(--red-500);
            border: 2px solid #fff;
        }

        .value {
            display: inline-block;
            font-size: 24px;
            line-height: 24px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .opera-btn {
            width: 18px;
            height: 18px;
            border-radius: 4px;
            background-color: var(--blue-500);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .arrow {
                transform: rotateZ(180deg);
                :deep(path) {
                    fill: #fff;
                }
            }
        }

        &.hover,
        &.selected {
            background-color: var(--blue-500) !important;
            .value {
                color: #fff !important;
            }

            .opera-btn {
                background-color: #fff;
                .arrow {
                    :deep(path) {
                        fill: var(--blue-500);
                    }
                }
            }
        }
    }

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
