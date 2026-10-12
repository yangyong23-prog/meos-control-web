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
            <span v-ellipsis="{ enterable: false }" :ellipsis-disabled="true" class="value" :style="{ fontSize: `${globalFontSize}px` }"> {{ nameText }}</span>
            <!-- <span v-if="data?.interactiveConfigVo && data?.interactiveConfigVo?.canJump" class="opera-btn" @click.stop="switchRelationChart">
                <Arrow class="arrow" />
            </span> -->
        </div>
        <div class="status-marks" :style="{ right: `${markRight}px`, transform: `scale(${legendScaleRatio}) translateY(-50%)` }">
            <span v-for="(item, index) in abnormalList" :key="item" class="mark-out" :style="{ zIndex: 99 - index }">
                <span v-if="index === 0 && item !== STATUS_NAME.offline" class="mark-animation" :style="{ background: STATUS_BG_COLOR[item] }"></span>
                <span class="mark-item" :style="{ background: STATUS_BG_COLOR[item] }"></span>
            </span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Arrow from '@/assets/svg/up.svg';
import { STATUS_NAME, STATUS_BG_COLOR, STATUS_FONT_COLOR } from './constant';
import DockSingleton from '@/hooks/responsiveDock';
import { rectCanSelectKey } from '../constants/injectKey';

const { getIotData } = DockSingleton.getInstance();

const getNamePlaceObject = textMap => {
    return Object.values(textMap).find(textObj => {
        // 新系统图(二次排版工具的)，取第一个点位作为名字的
        const target = textObj;
        if (target) {
            return true;
        }
        return false;
    });
};

const props = defineProps({
    idPrefix: {
        type: String,
        default: ''
    },
    data: {
        type: Object,
        default: () => ({})
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    },
    globalFontSize: {
        type: Number,
        default: 24
    },
    selected: {
        type: Boolean,
        default: false
    },
    canActive: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['switchRelationChart', 'clickName', 'hoverName', 'unHoverName']);

const rectCanSelect = inject(rectCanSelectKey);
const nameContentRef = ref();

const markRight = ref(0);
const markTop = ref(0);
const updateMarkPosition = size => {
    if (size && nameContentRef.value) {
        const width = nameContentRef.value.offsetWidth;
        // 本身display为none或者其祖先组件为none，就会返回0
        if (width === 0) return;
        // const height = nameContentRef.value.offsetHeight;
        markRight.value = (size.x - width * props.legendScaleRatio) / 2;
        // markTop.value = (size.y - height * props.legendScaleRatio) / 2;
    } else {
        // markRight.value = 0;
        markTop.value = 0;
    }
};

const namePlaceObj = ref();

const warpStyle = ref({
    left: '0',
    top: '0',
    width: 0,
    height: 0
});

const contentStyle = ref({});

const nameText = ref('');

const abnormalList = ref([]);

const fixedInfoCodes = unref(props).data?.fixedInfoCodes?.map(info => info.infoCode) || [];

watchEffect(() => {
    const { data } = props;
    const { dataObject, textMap, aliasName } = data;

    // 名称
    nameText.value = (aliasName || dataObject?.localName || dataObject?.name) ?? '--';

    // 获取位置
    namePlaceObj.value = getNamePlaceObject(textMap);
    if (!namePlaceObj.value) {
        namePlaceObj.value = null;
        return;
    }

    const { location, size } = namePlaceObj.value;

    warpStyle.value = {
        left: `${location.x}px`,
        top: `${location.y}px`,
        width: `${size.x}px`,
        height: `${size.y + 4}px`
    };
    nextTick(() => {
        updateMarkPosition(size);
    });

    // 异常状态
    const statusList = [];
    props.data.renderData.abnormal && statusList.push(STATUS_NAME.abnormal);

    // 断电
    if (fixedInfoCodes.includes('powerStatus')) {
        const porwerDownIotObj = getIotData(dataObject?.id, 'powerStatus');
        if (porwerDownIotObj.dataValue === '0') {
            statusList.push(STATUS_NAME.porwerDown);
        }
    }

    // 控返不一致
    // if (fixedInfoCodes.includes('orderFailAlarm')) {
    //     const inconsistentObj = getIotData(dataObject?.id, 'orderFailAlarm');
    //     if (inconsistentObj?.dataValue === '1') {
    //         statusList.push(STATUS_NAME.inconsistent);
    //     }
    // }

    // 离线
    // if (fixedInfoCodes.includes('onlineStatus')) {
    //     const offlineObj = getIotData(dataObject?.id, 'onlineStatus');
    //     if (!_.isEmpty(offlineObj) && offlineObj?.dataValue !== '1') {
    //         statusList.push(STATUS_NAME.offline);
    //     }
    // }

    let cStyle = {},
        cursor = 'default';
    if (props.canActive && rectCanSelect && rectCanSelect(data)) {
        cursor = 'pointer';
    }
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
        cursor,
        ...cStyle,
        transform: `scale(${props.legendScaleRatio})`,
        maxWidth: `${size.x / props.legendScaleRatio}px`
    };

    abnormalList.value = statusList;
    contentStyle.value = cStyle;
});

const switchRelationChart = () => {
    emit('switchRelationChart', props.data.interactiveConfigVo);
};

const clickName = () => {
    emit('clickName');
};

const hoverName = () => {
    emit('hoverName');
};
const unHoverName = () => {
    emit('unHoverName');
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
        border-radius: 3.6px;
        padding: 0 4px;
        cursor: default;
        // cursor: pointer;

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
            line-height: 1;
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
