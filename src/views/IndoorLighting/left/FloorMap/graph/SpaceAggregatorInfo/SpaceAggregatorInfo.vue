<template>
    <div class="space-label-wrap" :class="{ hide: !show }" :style="{ opacity: opacityRef }">
        <div v-if="selectedIcon || spaceIcon" class="icon-wrap" :style="{ bottom: ` ${bottomGap}px` }">
            <span v-if="selectedIcon" class="icon-span">
                <svg width="35" height="38" viewBox="0 0 35 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M17.6817 0.517578C8.20328 0.517578 0.519531 8.15024 0.519531 17.5656C0.519531 25.1636 5.52334 31.6007 12.4361 33.8026C13.8388 34.2494 15.1595 34.9802 16.0777 36.1245L17.3659 37.7299C17.5275 37.9314 17.8358 37.9314 17.9974 37.7299L19.2856 36.1245C20.2038 34.9802 21.5245 34.2494 22.9272 33.8026C29.84 31.6007 34.8438 25.1636 34.8438 17.5656C34.8438 8.15024 27.1601 0.517578 17.6817 0.517578Z"
                        fill="#036FEB"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11 17.75C11 21.4779 16.8125 26 17.75 26C18.6875 26 24.5 21.4779 24.5 17.75C24.5 14.0221 21.4779 11 17.75 11C14.0221 11 11 14.0221 11 17.75ZM17.7503 20.0827C19.2305 20.0827 20.4303 18.8828 20.4303 17.4027C20.4303 15.9225 19.2305 14.7227 17.7503 14.7227C16.2702 14.7227 15.0703 15.9225 15.0703 17.4027C15.0703 18.8828 16.2702 20.0827 17.7503 20.0827Z"
                        fill="white"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.5 1.03351C8.40963 1.03351 1.04043 8.35371 1.04043 17.3836C1.04043 24.6698 5.83873 30.8441 12.469 32.956C13.9176 33.4174 15.3269 34.1858 16.3199 35.4232L17.5 36.894L18.6801 35.4232C19.6731 34.1858 21.0824 33.4174 22.531 32.956C29.1613 30.8441 33.9596 24.6698 33.9596 17.3836C33.9596 8.35371 26.5904 1.03351 17.5 1.03351ZM0 17.3836C0 7.78292 7.83502 0 17.5 0C27.165 0 35 7.78292 35 17.3836C35 25.132 29.897 31.6951 22.8487 33.9402C21.5216 34.3629 20.3176 35.0406 19.4937 36.0674L18.2192 37.6558C17.851 38.1147 17.149 38.1147 16.7808 37.6558L15.5063 36.0674C14.6824 35.0406 13.4784 34.3629 12.1513 33.9402C5.10299 31.6951 0 25.132 0 17.3836Z"
                        fill="white"
                    />
                </svg>
            </span>
            <span v-if="!selectedIcon && spaceIcon" class="icon-span">
                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.3 14C5.425 14 0 9.77935 0 6.3C0 2.82065 2.82065 0 6.3 0C9.77935 0 12.6 2.82065 12.6 6.3C12.6 9.77935 7.175 14 6.3 14Z" :fill="spaceIconColor" />
                    <circle cx="6.30017" cy="5.97595" r="2.50134" fill="white" />
                </svg>
            </span>
        </div>
        <div class="icon-text-container">
            <!-- <div v-show="!hideLabel && showFeedback" class="icon-content" v-html="svgString"></div> -->
            <div v-if="workPlaneLuxText" :style="{ color, fontWeight }" class="lux-text">{{ workPlaneLuxText }}</div>
            <div class="mid-wrap">
                <div v-if="svgIcon" class="svg-icon" v-html="svgIcon"></div>
                <template v-else>
                    <span v-if="spaceType == SpaceType.hostsController && hoverList.length" class="label-wrap" :style="{ background: controllerBg }">
                        {{ hoverList?.length || '--' }}
                    </span>
                    <div v-if="!hideLabel" m-ellipsis class="space-name-text" :style="{ color, fontWeight }">
                        {{ labelName }}
                    </div>
                </template>
            </div>
            <div v-if="abnormal" class="abnormal-tag">{{ i18n.global.t('meos_control_web.abnormal') }}</div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MPopover } from 'meri-plus';
import { SpaceType } from '../../hooks/useFloorMapHook';
import { spaceIcon as spaceIconFunc } from '@/apm-3d/components/D2Component/d2Utils';
import DockSingleton from '@/hooks/responsiveDock';
import { isEmpty } from 'lodash';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
// 标签状态
// 正常 normal 异常 abnormal 干预 intervene 鼠标悬浮 hover 选中 selected
const props = defineProps({
    model: {
        type: Object,
        default: () => ({})
    },
    currentStyle: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(['clickItem']);
const hover = ref(false);

const labelName = ref(props.model?.data?.localName || '--');

const svgString = unref(props).model?.svg || '';

const showFeedback = computed(() => currentStyle.value?.showFeedback);

// #当前图元的叠加样式集合
const currentStyle = ref(props?.model?.caclCurrentStyle() || {});

const selectedIcon = computed(() => currentStyle.value?.selectedIcon);

const spaceIcon = computed(() => currentStyle.value?.spaceIcon);

const spaceIconColor = computed(() => currentStyle.value?.spaceIconColor);

const color = computed(() => currentStyle.value.color || '#000000');
const controllerBg = computed(() => currentStyle.value.controllerBg || '#000000');

const show = computed(() => currentStyle.value?.show);
const showName = computed(() => currentStyle.value?.showName);

const hideLabel = computed(() => currentStyle.value?.hideLabel);
const workPlaneLuxShow = computed(() => currentStyle.value?.workPlaneLuxShow);

const fontWeight = computed(() => currentStyle.value?.fontWeight || 400);

const bottomGap = computed(() => currentStyle.value?.bottomGap || 8);

const controllerShow = computed(() => currentStyle.value?.controllerShow);

const opacityRef = computed(() => currentStyle.value?.opacity || 1);

const { getIotData, getAbnormalEventsList } = DockSingleton.getInstance();

const abnormal = computed(() => {
    const { type, abnormalIds } = props.model?.data || {};
    if (type === SpaceType.hostsController) {
        const list = getAbnormalEventsList(abnormalIds);
        return list.length > 0;
    }
    return false;
});

const workPlaneLuxText = computed(() => {
    if (!props.model?.isPositionSpace()) {
        // TODO
        const { dataValue, unit } = getIotData(props.model?.data.id, 'workPlaneLux');
        if (dataValue === undefined) {
            // 无实例化规则
            return null;
        } else {
            return isEmpty(dataValue) ? '--' : `${dataValue} ${unit || ''}`;
        }
    }
    return null;
});

useWatchWithCleanup(
    workPlaneLuxText,
    () => {
        props.model?.setWorkPlaneLuxText(workPlaneLuxText.value);
    },
    {
        immediate: true
    }
);

useWatchWithCleanup(
    abnormal,
    () => {
        props.model?.setAbnormal(abnormal.value);
    },
    {
        immediate: true
    }
);

const hoverList = computed(() => {
    return props.model?.data.hostsControlers || [];
});

const spaceType = computed(() => {
    return props.model?.data.type;
});

const svgIcon = computed(() => {
    if (props.model?.isPositionSpace()) {
        if (props.model?.isIconPosition()) {
            const svg = spaceIconFunc(props.model?.data?.roomFuncType, 'map', 16, '#637B9B66');
            return svg;
        }
        return null;
    }
    return null;
});

props.model.addObserver('ChangeState', e => {
    currentStyle.value = props?.model?.caclCurrentStyle() || {};
    workPlaneLuxText.value = props.model?.workPlaneLuxText || '';
});

const clickControllerItem = (e, item) => {
    console.log('clickControllerItem: ', e);
    e.stopPropagation();
    e.preventDefault();
    hover.value = false;
    const { model } = props;
    model.target = item;
    emits('clickItem', { e, model: model.parent, controllerItem: item });
    // props.rootMedia.emit('css2dobjectclick', { e, model });
};
</script>
<style lang="less" scoped>
.space-label-wrap {
    position: relative;
    // cursor: pointer;
    .icon-wrap {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 34px;
        height: 38px;
        bottom: 8px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        z-index: 10;
        .icon-span {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .space-name-text {
        pointer-events: auto;
        font-size: 14px;
        line-height: 17px;
        text-align: center;
        color: #1b2129;
        height: 17px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 120px;
        text-shadow: 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
    }
    .abnormal-legend {
        position: absolute;
        margin-top: 2px;
        background: #fff;
        left: 50%;
        transform: translateX(-50%);
        padding: 1px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
            display: inline-block;
            width: 12px;
            height: 4px;
            border-radius: 1px;
            margin-right: 1.4px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    &.hide {
        display: none;
    }
}

.icon-text-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    .lux-text {
        white-space: nowrap;
        color: var(--gray-600, #626c78);
        text-align: center;
        text-shadow: 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
        font-size: 12px;
        font-weight: var(--platform-font-weight);
        line-height: normal;
        pointer-events: auto;
    }
    .label-wrap {
        pointer-events: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .mid-wrap {
        display: flex;
        gap: 2px;
        .svg-icon {
            width: 16px;
            height: 16px;
            border: 0.5px solid #637b9b66;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background-color: #fff;
            pointer-events: auto;

            svg {
                fill: #ffffff;
            }
        }
        .label-wrap {
            display: flex;
            padding: 0px 4px;
            justify-content: center;
            align-items: center;
            // width: 8px;
            height: 16px;
            border-radius: 2px;
            color: #fff;

            font-size: 12px;
            font-style: normal;
            font-weight: 700;
        }
    }

    .abnormal-tag {
        position: absolute;
        top: 20px;
        height: 16px;
        padding: 0px 4px;
        border-radius: 2px;
        background: var(--red-500, #f55047);
        color: #fff;
        font-size: 12px;
        font-weight: var(--platform-font-weight);
        line-height: 16px; /* 150% */
    }
}

.icon-content {
    width: 100%;
    height: 100%;
    margin-right: 4px;

    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
}

.hover-box-wrap {
    cursor: pointer;
    width: 180px;
    .title {
        overflow: hidden;
        color: #626c78;
        text-overflow: ellipsis;

        font-size: 12px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-bottom: 8px;
        padding-left: 8px;
        span {
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            color: #246fe5;
            text-overflow: ellipsis;

            font-size: 12px;
            font-weight: 700;
            line-height: 22px;
        }
    }
    .divider {
        width: 156px;
        height: 1px;
        background: #e1e5eb;
    }
    .item {
        height: 40px;
        padding: 9px 8px;
        overflow: hidden;
        color: #1b2129;
        font-feature-settings: 'clig' off, 'liga' off;
        text-overflow: ellipsis;
        white-space: nowrap;

        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        &:hover {
            border-radius: 4px;
            background: rgba(196, 201, 207, 0.3);
        }
    }
}
</style>
