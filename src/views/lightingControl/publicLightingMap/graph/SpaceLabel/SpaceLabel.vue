<template>
    <div class="space-label-wrap" :class="{ hide: !show }" :style="{ opacity: opacityRef }">
        <div v-if="selectedIcon || spaceIcon" class="icon-wrap">
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
            <div v-show="!hideLabel && showIcon" class="icon-content" v-html="svgString"></div>
            <div class="label" :style="{ color, fontWeight }">
                {{ hideLabel ? '' : labelName }}
            </div>
        </div>

        <div v-if="showLegend && legendList.length > 0" class="abnormal-legend">
            <span v-for="item in legendList" :key="item" :style="{ background: item }"></span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
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

const labelName = ref(props.model?.data?.localName || '--');

const svgString = unref(props).model?.svg || '';

const showIcon = computed(() => currentStyle.value?.showIcon);

// #当前图元的叠加样式集合
const currentStyle = ref(props?.model?.caclCurrentStyle() || {});

const selectedIcon = computed(() => currentStyle.value?.selectedIcon);

const spaceIcon = computed(() => currentStyle.value?.spaceIcon);

const spaceIconColor = computed(() => currentStyle.value?.spaceIconColor);

const color = computed(() => currentStyle.value.color || '#000000');

const show = computed(() => currentStyle.value?.show);

const hideLabel = computed(() => currentStyle.value?.hideLabel);

const fontWeight = computed(() => currentStyle.value?.fontWeight || 400);

const showLegend = computed(() => currentStyle.value?.showLegend);

const opacityRef = computed(() => currentStyle.value?.opacity || 1);

const legendList = computed(() => {
    let colorList = [];
    const legend1Color = currentStyle.value?.legend1Color;
    const legend2Color = currentStyle.value?.legend2Color;
    const legend3Color = currentStyle.value?.legend3Color;
    const legend4Color = currentStyle.value?.legend4Color;
    if (legend1Color) {
        colorList.push(legend1Color);
    }
    if (legend2Color) {
        colorList.push(legend2Color);
    }
    if (legend3Color) {
        colorList.push(legend3Color);
    }
    if (legend4Color) {
        colorList.push(legend4Color);
    }
    return colorList;
});

props.model.addObserver('ChangeState', e => {
    currentStyle.value = props?.model?.caclCurrentStyle() || {};
});
</script>
<style lang="less" scoped>
.space-label-wrap {
    position: relative;
    cursor: pointer;
    .icon-wrap {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 34px;
        height: 38px;
        bottom: 14px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        .icon-span {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .label {
        pointer-events: auto;
        font-size: 12px;
        line-height: 17px;
        text-align: center;
        color: #000000;
        height: 17px;
        white-space: nowrap;
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
    transform: translateX(-50%);

    display: flex;
    align-items: center;
    pointer-events: none;
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
</style>
