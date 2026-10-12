<template>
    <div class="group-item">
        <div class="item-base">
            <div class="header">
                <div class="left">
                    <component :is="getTiteIcon()"></component>
                    <div class="title">{{ title }}</div>
                </div>
                <m-tips v-if="data?.checkable" trigger="hover" theme="darkTransparent" :content="data?.allDisabledInfo?.text || ''" :disabled="data?.allDisabledInfo?.value">
                    <m-popconfirm
                        v-if="data?.allDisabledInfo?.value"
                        :content="data?.onfirmDesc"
                        status="primary"
                        placement="bottom-end"
                        :cancel-button-text="i18n.global.t('common.cancel')"
                        :confirm-button-text="i18n.global.t('common.confirm')"
                        style="--m-popover-border-radius: 8px"
                        width="316px"
                        @confirm="emits('click')"
                    >
                        <m-button class="btn" type="default" size="medium">{{ data?.btnName }}</m-button>
                    </m-popconfirm>
                    <m-button v-else class="btn" type="default" size="medium" :disabled="!data?.allDisabledInfo?.value">{{ data?.btnName }}</m-button>
                </m-tips>
            </div>
            <div class="desc">{{ desc }}</div>
            <m-button
                class="btn"
                type="link"
                size="medium"
                icon-position="right"
                :icon="isOpen ? 'IconMeriComponentChevronUp' : 'IconMeriComponentChevronDown'"
                @click="toogleExpand"
                >{{ expandOrCollapseDesc }}</m-button
            >
        </div>
        <div v-show="isOpen" class="group-item-content">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { LOOP_STATIC_TYPES } from '@/views/IndoorLighting/variables';
import LocalLoopSVG from '@/assets/svg/indoorLighting/local_loop.svg';
import ManuOpenLoopSVG from '@/assets/svg/indoorLighting/manu_open_loop.svg';
import SysAutoCloseLoopSVG from '@/assets/svg/indoorLighting/sys_auto_close.svg';
import { curOpenGroupCodeKey } from '@/views/IndoorLighting/hooks/useStatisticalDetails';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
const props = defineProps({ data: { type: Object, default: () => ({}) } });
const desc = computed(() => props.data?.desc);
const count = computed(() => props.data?.loops?.length ?? 0);
const title = computed(() => `${props.data?.name}:${count.value}`);

const curOpenGroupCode = inject(curOpenGroupCodeKey);
const isOpen = computed(() => curOpenGroupCode?.value === props.data?.code);
const expandOrCollapseDesc = computed(() => (isOpen.value ? i18n.global.t('meos_control_web.collapse_loop_list') : i18n.global.t('meos_control_web.expand_loop_list')));

const emits = defineEmits(['click']);

const getTiteIcon = () => {
    switch (props.data?.code) {
        case LOOP_STATIC_TYPES.LOCAL.code:
            return LocalLoopSVG;
        case LOOP_STATIC_TYPES.MANUAL.code:
            return ManuOpenLoopSVG;
        case LOOP_STATIC_TYPES.SYS_AUTO.code:
            return SysAutoCloseLoopSVG;
        default:
            return '';
    }
};
const toogleExpand = () => {
    curOpenGroupCode.value = isOpen.value ? '' : props.data?.code;
};
useWatchWithCleanup(
    () => isOpen.value,
    val => {
        emitter.emit(CLOSE_CONTROL_FORM);
    }
);
</script>
<style lang="less" scoped>
.group-item {
    display: flex;
    width: 100%;

    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    border-radius: 4px;
    border: 1px solid var(--Grey-Grey-300, #e1e5eb);

    .item-base {
        display: flex;
        width: 100%;
        padding: 8px 16px;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        background: var(--Grey-Grey-50, #f7f9fa);
        .header {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            .left {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .title {
                color: #000;
                font-size: 16px;
                font-weight: 700;
                line-height: 24px; /* 150% */
            }
        }
        .desc {
            color: var(--Grey-Grey-600, #626c78);
            font-size: 14px;
            font-weight: 400;
            line-height: 24px; /* 171.429% */
        }
        .group-item-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 5px;
        }
    }

    .group-item-content {
        display: flex;
        width: 100%;
        padding: 8px 16px;
        gap: 12px;
        flex-direction: column;
        align-items: flex-start;
        background-color: #fff;
    }
}
</style>
