<template>
    <div
        v-show="list.length > 0"
        class="space-bubble-2d-warp"
        :style="{ opacity: opacityRef }"
        @click="
            () => {
                emits('click');
            }
        "
    >
        <div v-show="list.length > 0" class="container-wrap" :style="{ transform: `translateY(calc(-50% - ${bottomGapRef}px))` }">
            <div class="list-wrap">
                <div v-for="(item, k) in list" :key="k" class="item">
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
import DockSingleton from '@/hooks/responsiveDock';
import { INFOCODE } from '@/views/IndoorLighting/variables';
import { getCurrentInstance } from 'vue';
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

const showTextRef = ref(true);
const textColorRef = ref('');
const textShadowRef = ref('');
const textBgColorRef = ref('');
const iconBgColorRef = ref('');
const showMarkRef = ref(false);
const dotColorsRef = ref([]);
const textBorderRef = ref('');
const iconColorRef = ref('');
const bottomGapRef = ref(12);
const opacityRef = ref(1);

const emits = defineEmits(['click']);

const { getIotData } = DockSingleton.getInstance();

const listInfo = ref([]);
const list = computed(() => {
    const result = [];
    let moreCount = 0,
        lessCount = 0,
        unknownCount = 0;
    props.model?.data.servedByLoops.forEach(circuit => {
        const close = getIotData(circuit.id, INFOCODE.runStatus0.infoCode).dataValue === INFOCODE.runStatus0.dataValue;
        const open = getIotData(circuit.id, INFOCODE.runStatus1.infoCode).dataValue === INFOCODE.runStatus1.dataValue;
        const unknown = INFOCODE.runStatusNull.checkDataValue(getIotData(circuit.id, INFOCODE.runStatusNull.infoCode).dataValue);
        const more = getIotData(circuit.id, INFOCODE.controlDeviationStatus1.infoCode).dataValue === INFOCODE.controlDeviationStatus1.dataValue;
        const less = getIotData(circuit.id, INFOCODE.controlDeviationStatus2.infoCode).dataValue === INFOCODE.controlDeviationStatus2.dataValue;

        if (more) {
            moreCount++;
        } else if (less) {
            lessCount++;
        } else if (unknown) {
            // TODO
            unknownCount++;
        }
    });

    if (moreCount > 0) result.push({ name: i18n.global.t('common.over_on'), value: moreCount });
    if (lessCount > 0) result.push({ name: i18n.global.t('common.drive_less'), value: lessCount });
    if (unknownCount > 0) result.push({ name: i18n.global.t('meos_control_web.switch_status_unknown'), value: unknownCount });

    return result;
});

useWatchWithCleanup(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        const { showText, textColor, textShadow, textBgColor, iconColor, iconBgColor, showMark, dotColor, textBorder, opacity = 1, bottomGap = 12 } = props.currentStyle;
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
        bottomGapRef.value = bottomGap;
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
        pointer-events: auto;
        display: inline-flex;

        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        box-shadow: 0px 2px 10px 0px rgba(137, 137, 137, 0.4);
        background: #fff;
        border-radius: 4px;
        // transform: translateY(calc(-50% - 22px));
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

        &:hover {
            background-color: #f0f0f0f2;
            cursor: pointer;

            .arrow {
                path {
                    fill: #f0f0f0f2;
                }
            }
        }
    }
}
</style>
