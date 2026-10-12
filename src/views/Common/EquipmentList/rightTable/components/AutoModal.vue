<template>
    <PopoverWrap :disabled="props.disabled" :visible="props.visible">
        <template #content>
            <div class="popover-custom-wrap">
                <section class="header-wrap">
                    <div class="left">
                        <IconMeriComponentDialogWarning :size="24" color="#246FE5"></IconMeriComponentDialogWarning>
                    </div>
                    <div class="right">
                        <div class="right-title">{{ i18n.global.t('meos_control_web.switch_to_auto_mode') }}</div>
                        <div class="sub-title">{{ i18n.global.t('meos_control_web.confirm_switch_to_auto_dup') }}</div>
                    </div>
                </section>
                <section class="btn-wrap">
                    <m-button type="default" size="small" @click="closePop">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button
                        type="primary"
                        size="small"
                        :loading="textLoading"
                        @click="
                            changeManualAutoStatus({
                                objectIds: props.objectIds,
                                model: 1,
                                objectType: 'manualAutoSet'
                            })
                        "
                        >{{ i18n.global.t('common.confirm') }}</m-button
                    >
                </section>
            </div>
        </template>
        <slot></slot>
    </PopoverWrap>
</template>
<script setup>
import { IconMeriComponentDialogWarning } from 'meri-icon';
import PopoverWrap from './PopoverWrap.vue';
import i18n from '@/localization';

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    visible: {
        type: Boolean,
        default: true
    },
    objectIds: {
        type: Array,
        default: () => []
    }
});

const textLoading = inject('textLoading');
const closePop = inject('closePop');
const changeManualAutoStatus = inject('changeManualAutoStatus');
</script>
<style lang="less" scoped>
.popover-custom-wrap {
    padding: 20px 20px 12px 20px;
    width: 320px;
    .btn-wrap {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
    .header-wrap {
        display: flex;
        .left {
            width: 24px;
            height: 24px;
            margin-right: 12px;
        }
        .right {
            flex: 1;
            color: @grey-600;
            font-family: 'PingFang SC';
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            white-space: normal;
            text-wrap: wrap;
            min-width: 0;
            .right-title {
                color: #1b2129;

                font-size: 16px;
                font-weight: 700;
                margin-bottom: 8px;
                line-height: 24px;
            }
        }
    }
}
</style>
