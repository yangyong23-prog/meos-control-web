<template>
    <div class="module-count-wrap" :class="{ hide: !show }" :style="{ opacity: opacityRef }">
        <div class="icon-wrap">
            <span v-show="selectedIcon" class="icon-span">
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
            <MPopover placement="right" popover-class="light-popover-wrap" :disabled="selectedIcon || hoverList?.length <= 0" trigger="hover">
                <template #content>
                    <div class="hover-box-wrap">
                        <div
                            class="title"
                            v-html="
                                i18n.global.t('meos_control_web.exist_lighting_module', {
                                    count: hoverList?.length
                                })
                            "
                        ></div>
                        <div class="divider"></div>
                        <div v-for="item in hoverList" :key="item.id" class="item" @click="e => clickItem(e, item)" @mouseenter="hover = true" @mouseleave="hover = false">
                            {{ item.name }}
                        </div>
                    </div>
                </template>
                <span class="label-wrap" :style="{ background: color }" :class="{ hover: hover }"> {{ hoverList?.length || '--' }} </span>
            </MPopover>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MPopover } from 'meri-plus';

const props = defineProps({
    model: {
        type: Object,
        default: () => ({})
    },
    rootMedia: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(['clickItem']);
const hover = ref(false);

const clickItem = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    hover.value = false;
    const { model } = props;
    model.target = item;
    emits('clickItem', { e, model });
    // props.rootMedia.emit('css2dobjectclick', { e, model });
};
// #当前图元的叠加样式集合
// eslint-disable-next-line vue/no-setup-props-destructure
const currentStyle = ref(props?.model?.caclCurrentStyle() || {});

const color = computed(() => currentStyle.value.color || '#000000');

const show = computed(() => currentStyle.value?.show);

const selectedIcon = computed(() => currentStyle.value?.selectedIcon);
const opacityRef = computed(() => currentStyle.value?.opacity || 1);

const hoverList = computed(() => {
    return props.model?.hoverList || [];
});

// eslint-disable-next-line vue/no-setup-props-destructure
props.model.addObserver('ChangeState', e => {
    hover.value = false;
    currentStyle.value = props?.model?.caclCurrentStyle() || {};
});
</script>
<style lang="less" scoped>
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
.module-count-wrap {
    cursor: pointer;
    .icon-wrap {
        position: relative;
        transform: translateY(-22px);
        width: 34px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .label-wrap,
        .icon-span {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .icon-span {
            width: 34px;
            height: 38px;
            position: absolute;
            bottom: 21px;
        }
        .label-wrap {
            border-radius: 4px;
            color: #fff;

            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            width: 20px;
            height: 20px;
            &.hover {
                background: @blue-500 !important;
            }
        }
    }
    &.hide {
        display: none;
    }
}
</style>
