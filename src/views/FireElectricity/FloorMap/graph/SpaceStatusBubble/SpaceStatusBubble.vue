<template>
    <div v-show="currentStatusList?.length > 0" class="space-bubble-2d-warp" :style="{ opacity: opacityRef }">
        <div class="container-wrap">
            <div class="list-wrap">
                <div v-for="(item, k) in currentStatusList" :key="k" class="item">
                    <div class="title">
                        {{ item.name }}
                    </div>
                    <div class="value" :style="{ color: CODE_MAP_COLOR[item.code] }">
                        {{ item.value }}
                    </div>
                </div>
            </div>
            <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="9" height="5" viewBox="0 0 9 5" fill="none">
                <path d="M4.5 4.29687L0.169823 -0.000923437L8.83008 -0.00092268L4.5 4.29687Z" fill="white" />
            </svg>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { getCurrentInstance } from 'vue';
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
    },
    currentStatusList: {
        type: Object,
        default: () => ({})
    }
});

const CODE_MAP_COLOR = {
    abnormal: '#F55047',
    alarm: '#F18B3E',
    fault: '#D2AC00'
};

const instance = getCurrentInstance();

const showTextRef = ref(true);
const textColorRef = ref('');
const textShadowRef = ref('');
const textBgColorRef = ref('');
const iconBgColorRef = ref('');
const showMarkRef = ref(false);
const dotColorsRef = ref([]);
const textBorderRef = ref('');
const iconColorRef = ref('');
const opacityRef = ref(1);

const listInfo = ref([]);
// computed(() => {
//     return unref(props).model?.data?.cacheStatus;
// });

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        const { showText, textColor, textShadow, textBgColor, iconColor, iconBgColor, showMark, dotColor, textBorder, opacity = 1 } = props.currentStyle;
        showMarkRef.value = showMark;
        showTextRef.value = showText;
        textColorRef.value = textColor;
        textShadowRef.value = textShadow;
        textBgColorRef.value = textBgColor;
        iconBgColorRef.value = iconBgColor;
        dotColorsRef.value = dotColor?.split(',') || [];
        textBorderRef.value = textBorder;
        iconColorRef.value = iconColor;
        opacityRef.value = opacity;
        listInfo.value = unref(props).model?.data?.cacheStatus;
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.space-bubble-2d-warp {
    display: inline-flex;

    flex-direction: column;
    align-items: center;
    pointer-events: none;

    .container-wrap {
        display: inline-flex;

        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        box-shadow: 0px 2px 10px 0px rgba(137, 137, 137, 0.4);
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        pointer-events: auto;
        transform: translateY(calc(-50% - 22px));
        .list-wrap {
            display: flex;
            padding: 4px 6px;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 2px;
            width: 100%;
            height: 100%;

            .item {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                gap: 2px;
                color: var(--gray-600, #626c78);
                text-align: center;
                font-size: 12px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                .value {
                    color: #f18b3e;

                    text-align: center;
                    font-family: Persagy2.0;
                    font-size: 12px;
                    font-weight: 700;
                }
            }
        }
        .arrow {
            position: absolute;
            width: 9px;
            height: 5px;
            bottom: -5px;
        }
    }
}
</style>
