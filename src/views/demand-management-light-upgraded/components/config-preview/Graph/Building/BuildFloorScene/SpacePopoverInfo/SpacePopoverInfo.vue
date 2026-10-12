<template>
    <div class="req-space-popoverinfo-warp">
        <MPopover placement="right" popover-class="light-popover-wrap" :disabled="absorbList?.length <= 0" trigger="hover">
            <template #content>
                <div class="hover-box-wrap">
                    <div
                        class="title"
                        v-html="
                            i18n.global.t('meos_control_web.aggregate_devices_here_html', {
                                count: absorbList?.length
                            })
                        "
                    ></div>
                    <div class="divider"></div>
                    <m-scrollbar :max-height="'210px'" class="list-wrap">
                        <div
                            v-for="item in absorbList"
                            :key="item.id"
                            v-ellipsis
                            class="item"
                            @click="e => clickItem(e, item)"
                            @mouseenter="e => handleHover(e, item, true)"
                            @mouseleave="e => handleHover(e, item, false)"
                        >
                            {{ item.localName ?? '--' }}
                        </div>
                    </m-scrollbar>
                </div>
            </template>
            <span v-if="showAbsorbGroup" class="group-wrap" :class="{ hover: hover }" @mouseup.stop @mousemove.stop @mousedown.stop>
                {{ absorbList?.length || '--' }}
            </span>
        </MPopover>

        <div v-show="!showAbsorbGroup" class="normal">
            <div v-if="showHover" class="popover-wrap">
                <div class="popover-inner">
                    <div class="status-desc">{{ localName ?? '--' }}</div>
                    <div class="status-flag" :style="{ backgroundColor: statusInfo?.color || '#e8ecf0', color: statusInfo?.textColor || '#626c78' }">
                        {{ statusInfo?.text || i18n.global.t('meos_control_web.unconfiged') }}
                    </div>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" class="arrow" width="10" height="5" viewBox="0 0 10 5" fill="none">
                    <path d="M5.16992 4.79785L0.839745 0.500053L9.5 0.500054L5.16992 4.79785Z" fill="white" />
                </svg>
            </div>
            <div v-if="showSelect" class="space-icon">
                <svg class="bg-svg" style="display: none" width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M19.5646 2.51709C10.1493 2.51709 2.5166 10.1497 2.5166 19.5651C2.5166 27.1631 7.48714 33.6002 14.3539 35.8021C15.7473 36.2489 17.0593 36.9797 17.9713 38.124L19.2509 39.7295C19.4115 39.9309 19.7177 39.9309 19.8783 39.7295L21.1579 38.124C22.07 36.9797 23.3819 36.2489 24.7753 35.8021C31.6421 33.6002 36.6126 27.1631 36.6126 19.5651C36.6126 10.1497 28.98 2.51709 19.5646 2.51709Z"
                        fill="#246FE5"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19.3836 3.03351C10.3537 3.03351 3.03351 10.3537 3.03351 19.3836C3.03351 26.6698 7.79991 32.8441 14.3861 34.956C15.825 35.4174 17.225 36.1858 18.2113 37.4232L19.3836 38.894L20.5559 37.4232C21.5422 36.1858 22.9423 35.4174 24.3812 34.956C30.9674 32.8441 35.7338 26.6698 35.7338 19.3836C35.7338 10.3537 28.4136 3.03351 19.3836 3.03351ZM2 19.3836C2 9.78292 9.78292 2 19.3836 2C28.9844 2 36.7673 9.78292 36.7673 19.3836C36.7673 27.132 31.6982 33.6951 24.6967 35.9402C23.3785 36.3629 22.1825 37.0406 21.3641 38.0674L20.0981 39.6558C19.7323 40.1147 19.035 40.1147 18.6692 39.6558L17.4032 38.0674C16.5847 37.0406 15.3888 36.3629 14.0705 35.9402C7.06906 33.6951 2 27.132 2 19.3836Z"
                        fill="white"
                    />
                </svg>
                <svg class="default-svg" width="18" height="25" viewBox="0 0 18 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.98748 0.0405273C10.1838 0.0405273 11.3078 0.268757 12.36 0.724462C13.4116 1.18047 14.3234 1.79664 15.0954 2.57249C15.8865 3.36826 16.5089 4.28948 16.9626 5.3372C17.4157 6.38493 17.6428 7.51035 17.6428 8.71311C17.6428 10.3427 17.1891 12.1035 16.2823 13.9951C15.375 15.8868 14.3812 17.6379 13.3006 19.248C12.2196 20.8588 10.7821 22.7308 8.98742 24.8649C7.19265 22.7308 5.75486 20.8588 4.67415 19.248C3.59315 17.6379 2.59949 15.8868 1.69262 13.9951C0.785312 12.1035 0.332031 10.3427 0.332031 8.71311C0.332031 7.51035 0.558627 6.38493 1.01233 5.3372C1.46546 4.28948 2.08781 3.36826 2.87932 2.57249C3.6511 1.79661 4.56291 1.18044 5.61491 0.724462C6.66674 0.268757 7.79059 0.0405273 8.98748 0.0405273ZM8.98748 11.8269C9.41182 11.8269 9.81253 11.7447 10.1889 11.5796C10.5652 11.4149 10.8881 11.1967 11.1586 10.9248C11.448 10.6338 11.6748 10.2991 11.8389 9.92066C12.0027 9.54241 12.0849 9.13995 12.0849 8.71296C12.0849 8.2865 12.0027 7.8835 11.8389 7.50525C11.6748 7.12682 11.448 6.80224 11.1586 6.5303C10.8882 6.23928 10.5652 6.01646 10.1889 5.86097C9.81253 5.70582 9.41182 5.62807 8.98748 5.62807C8.56291 5.62807 8.16259 5.70582 7.7862 5.86097C7.40993 6.01646 7.08654 6.23925 6.81644 6.5303C6.52697 6.80227 6.29999 7.12697 6.13629 7.50525C5.97206 7.88365 5.89021 8.2865 5.89021 8.71296C5.89021 9.13995 5.97206 9.54241 6.13629 9.92066C6.29999 10.2991 6.52697 10.6338 6.81644 10.9248C7.08654 11.1967 7.40993 11.415 7.7862 11.5796C8.16244 11.7447 8.56291 11.8269 8.98748 11.8269Z"
                        fill="white"
                    />
                </svg>
            </div>

            <div v-show="showTextRef || showIconRef" class="icon-text-container">
                <div v-show="showIconRef" class="icon-content" :style="`--icon-color:${iconColorRef};`" v-html="svgString"></div>
                <div v-show="showTextRef" class="label" :style="{ color: textColorRef, textShadow: textShadowRef, background: textBgColorRef, border: textBorderRef }">
                    <span>{{ localName ?? '--' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MPopover, MScrollbar, vEllipsis } from 'meri-plus';
const props = defineProps({
    model: {
        type: Object,
        default: () => ({})
    },
    currentStyle: {
        type: Object,
        default: () => ({})
    },
    absorbList: {
        type: Array,
        default: () => []
    },
    rootMedia: {
        type: Object,
        default: () => ({})
    }
});

const { localName } = unref(props).model?.data || '';

const svgString = unref(props).model?.svg || '';
const showHover = ref(false);
const showSelect = ref(false);

const hover = ref(false);

const showTextRef = ref(true);
const textColorRef = ref('');
const textShadowRef = ref('');
const textBgColorRef = ref('');
const textBorderRef = ref('');

const showIconRef = ref(false);
const iconBgColorRef = ref('');
const iconColorRef = ref('');
const iconBorderColorRef = ref('');

const haveAbsorb = computed(() => {
    const res = props.absorbList.length > 1;
    return res;
});

const showAbsorbGroup = computed(() => {
    return haveAbsorb.value;
});

const clickItem = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    hover.value = false;
    const { model } = props;
    const targetModel = model?.getAbsorbModelById(item.id);
    if (targetModel) {
        props.rootMedia.emit('css2dobjectclick', { e, model: targetModel.parent });
    }
};

const handleHover = (e, item, flag) => {
    e.stopPropagation();
    e.preventDefault();
    hover.value = flag;
    if (flag) {
        const { model } = props;
        const targetModel = model?.getAbsorbModelById(item.id);
        if (targetModel) {
            props.rootMedia.emit('css2dobjectmousemove', { e, model: targetModel.parent });
        }
    }
};

const statusInfo = ref({});

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        const {
            showText,
            textColor,
            textShadow,
            textBgColor,
            iconColor,
            iconBgColor,
            showIcon,
            textBorder,
            iconBorderColor,
            showPopover,
            popoverText,
            showSelect: showSel
        } = props.currentStyle;
        showHover.value = showPopover;
        showSelect.value = showSel;
        if (showHover.value) {
            statusInfo.value = popoverText;
        }
        showIconRef.value = false;
        showTextRef.value = showText;

        textColorRef.value = textColor;
        textShadowRef.value = textShadow;
        textBgColorRef.value = textBgColor;
        textBorderRef.value = textBorder;

        iconBgColorRef.value = iconBgColor;
        iconColorRef.value = iconColor;
        iconBorderColorRef.value = iconBorderColor;
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.hover-box-wrap {
    cursor: pointer;
    pointer-events: auto;
    width: 196px;
    padding: 4px;
    .title {
        overflow: hidden;
        color: var(--gray-500);
        text-overflow: ellipsis;
        font-size: 12px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        padding: 0 8px 8px 8px;
    }
    .divider {
        width: 170px;
        height: 1px;
        margin-left: 8px;
        background: #e1e5eb;
    }
    .list-wrap {
        margin-right: -8px;
        padding-right: 8px;
    }
    .item {
        height: 40px;
        padding: 9px 8px;
        overflow: hidden;
        color: var(--gray-900);
        font-feature-settings: 'clig' off, 'liga' off;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        &:hover {
            border-radius: 4px;
            background: var(--gray-200);
        }
    }
}
.req-space-popoverinfo-warp {
    cursor: pointer;
    width: 24px;
    height: 24px;
    pointer-events: none;
    position: relative;

    &.small-icon {
        width: 18px;
        height: 18px;
    }

    .normal {
        width: 100%;
        height: 100%;

        .space-icon {
            position: absolute;
            left: 50%;
            top: calc(-100% - 8px);
            transform: translateX(-50%);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            svg {
                fill: @white;
                width: 20px;
                height: 20px;
            }
            .bg-svg {
                width: 38px;
                height: 40px;
                position: absolute;
                display: block !important;
                z-index: -1;
            }
            .default-svg {
                display: block !important;
            }
        }

        .popover-wrap {
            position: absolute;
            left: 50%;
            top: -46px;
            transform: translateX(-50%);

            display: flex;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid @grey-300;
            background: @white;

            .popover-inner {
                display: flex;
                max-width: 396px;
                align-items: center;
            }

            .status-desc {
                color: var(--Grey-800, #2e3742);
                text-align: center;
                font-size: 14px;
                font-style: normal;
                line-height: 22px;
                white-space: nowrap;
            }

            .status-flag {
                display: flex;
                align-items: center;
                min-width: max-content;

                display: flex;
                margin-left: 8px;
                padding: 0 6px;
                font-size: 12px;
                font-style: normal;
                line-height: 22px;
                border-radius: 2px;
            }
            .arrow {
                position: absolute;
                display: flex;
                left: 50%;
                bottom: -6px;
                transform: translateX(-50%);
                width: 12px;
                height: 7px;
                overflow: hidden;
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
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        }

        .label {
            font-size: 12px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: normal;
            white-space: nowrap;
            padding: 1px 4px;
            border-radius: 4px;
            pointer-events: none;
        }
    }
}

.group-wrap {
    pointer-events: auto;
    display: flex;
    width: 24px;
    height: 24px;
    padding: 5px 8.5px 4px 7.5px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    border-radius: 4px;
    border: 1px solid var(--gray-400, #c4c9cf);
    background: var(--gray-200, #e8ecf0);

    /* Shadow/shadow-1 */
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);

    color: var(--gray-800);
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    line-height: normal;

    &:hover,
    &.hover {
        color: #fff;
        background: var(--blue-500);
    }
}
</style>
