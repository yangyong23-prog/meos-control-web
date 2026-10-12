<template>
    <div class="tools-container">
        <m-tips :content="i18n.global.t('meos_control_web.zoom_to_100_percent_alt_0')" theme="darkTransparent" placement="left" trigger="hover">
            <span class="item restore-default" @click.stop="toTransformToRealSize">
                <RealSize style="width: 16px; height: 16px"></RealSize>
            </span>
        </m-tips>
        <span class="split"></span>
        <m-tips :content="i18n.global.t('meos_control_web.restore_default_alt_r')" theme="darkTransparent" placement="left" trigger="hover">
            <span class="item restore-default" @click.stop="toRestoreDefault">
                <Moren style="width: 16px; height: 16px"></Moren>
            </span>
        </m-tips>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import RealSize from '@/assets/svg/real-size.svg';
import Moren from '@/assets/svg/moren.svg';
const emits = defineEmits(['toTransformToRealSize', 'toRestoreDefault']);
const toTransformToRealSize = () => {
    emits('toTransformToRealSize');
};
const toRestoreDefault = () => {
    emits('toRestoreDefault');
};
</script>

<style scoped lang="less">
.tools-container {
    position: absolute;
    bottom: 16px;
    right: 0px;
    text-align: center;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    z-index: 2;
    border-radius: 4px;
    box-shadow: 0px 3px 12px 0px rgba(27, 33, 41, 0.12), 0px 0.5px 3px 0px rgba(27, 33, 41, 0.08);

    .split {
        width: 100%;
        height: 1px;
        background-color: var(--gray-300);
    }

    .item {
        padding: 4px;
        margin: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
            border-radius: 4px;
            background: rgba(196, 201, 207, 0.3);
        }
        &.disabled {
            cursor: no-drop;
            :deep(svg) {
                path,
                rect,
                circle {
                    fill: var(--gray-300);
                }
            }
        }
    }
}
</style>
