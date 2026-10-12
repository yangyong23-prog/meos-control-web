<template>
    <div class="req-space-popoverinfo-warp">
        <div class="normal">
            <template v-if="showMarkRef">
                <div v-if="statusInfo" class="popover-wrap">
                    <div class="color-block" :style="{ backgroundColor: statusInfo.color }"></div>
                    <div class="status-desc" :style="{ color: statusInfo.textColor }">{{ statusInfo.text }}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="arrow" width="10" height="5" viewBox="0 0 10 5" fill="none">
                        <path d="M5.16992 4.79785L0.839745 0.500053L9.5 0.500054L5.16992 4.79785Z" fill="white" />
                    </svg>
                </div>
                <div class="select-icon-wrap">
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
                </div>
            </template>

            <div v-show="showTextRef" class="label" :style="{ color: textColorRef, textShadow: textShadowRef, background: textBgColorRef, border: textBorderRef }">
                {{ localName ?? '--' }}
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    model: {
        type: Object,
        default: () => {}
    },
    currentStyle: {
        type: Object,
        default: () => {}
    }
});

const { localName, instanceTag } = unref(props).model?.data || {};

const showTextRef = ref(true);
const textColorRef = ref('');
const textShadowRef = ref('');
const textBgColorRef = ref('');
const iconBgColorRef = ref('');
const showMarkRef = ref(false);
const dotColorsRef = ref([]);
const textBorderRef = ref('');
const iconColorRef = ref('');
const iconBorderColorRef = ref('');

const statusInfo = computed(() => {
    if (instanceTag?.shielded) {
        return {
            color: '#B0B5BA',
            textColor: '#8B949E',
            text: i18n.global.t('meos_control_web.space_already_masked')
        };
    } else {
        // 当前与上级都无配置
        if (!instanceTag?.existCfg && !instanceTag?.customConfig) {
            return;
        }
        return {
            color: instanceTag?.customConfig ? '#FACD73' : '#A1C8E5',
            textColor: '#2E3742',
            text: instanceTag?.customConfig ? i18n.global.t('meos_control_web.special_config') : i18n.global.t('meos_control_web.inherit_parent_configuration')
        };
    }
});

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        const { showText, textColor, textShadow, textBgColor, iconColor, iconBgColor, showMark, dotColor, textBorder, iconBorderColor } = props.currentStyle;
        showMarkRef.value = showMark;
        showTextRef.value = showText;
        textColorRef.value = textColor;
        textShadowRef.value = textShadow;
        textBgColorRef.value = textBgColor;
        iconBgColorRef.value = iconBgColor;
        dotColorsRef.value = dotColor?.split(',') || [];
        textBorderRef.value = textBorder;
        iconColorRef.value = iconColor;
        iconBorderColorRef.value = iconBorderColor;
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.req-space-popoverinfo-warp {
    cursor: pointer;
    width: 24px;
    height: 24px;
    pointer-events: auto;

    &.small-icon {
        width: 18px;
        height: 18px;
    }

    .normal {
        width: 100%;
        height: 100%;

        .popover-wrap {
            position: absolute;
            left: 50%;
            top: -70px;
            transform: translateX(-50%);
            display: flex;
            height: 24px;
            padding: 2px 8px;
            align-items: center;
            gap: 2px;
            flex-shrink: 0;

            border-radius: 4px;
            background: var(--Grey-Grey-0, #fff);
            /* Shadow/shadow-1 */
            box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);

            .color-block {
                width: 14px;
                height: 14px;
                border-radius: 2px;
                background: #facd73;
            }
            .status-desc {
                color: var(--Grey-800, #2e3742);
                text-align: center;
                font-size: 12px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                white-space: nowrap;
            }
            .arrow {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);

                bottom: -3px;
            }
        }

        .select-icon-wrap {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%) translateY(-100%);
        }

        .label {
            position: absolute;
            left: 50%;
            // bottom: -4px;
            transform: translateX(-50%);
            font-size: 12px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: normal;
            white-space: nowrap;
            padding: 1px 4px;
            border-radius: 4px;
        }
    }
}
</style>
