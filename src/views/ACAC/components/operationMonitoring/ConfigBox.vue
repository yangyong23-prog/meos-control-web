<template>
    <m-collapse v-model="data" class="config-box" :hover-style="false" only-icon-click>
        <m-collapse-item id="1">
            <template #title>
                <div class="config-box-title">{{ title }}</div>
            </template>
            <template #icon="{ click, isActive }">
                <div v-if="collapse" class="config-box-icon fcc" @click="click">
                    {{ isActive ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}&nbsp;<Shouqizhankai />
                </div>
            </template>
            <slot></slot>
        </m-collapse-item>
    </m-collapse>
</template>

<script setup>
import i18n from '@/localization';
import Shouqizhankai from '@/assets/svg/ACAC/shouqizhankai.svg';
defineProps({
    title: {
        type: String,
        default: i18n.global.t('meos_control_web.console')
    },
    collapse: {
        type: Boolean,
        default: false
    }
});
const data = ref(['1']);
</script>
<style lang="less" scoped>
.config-box {
    padding: 0 24px;
    &:first-child {
        padding-top: 16px;
    }
    &:last-child {
        padding-bottom: 16px;
    }
    & + .config-box {
        margin-top: 24px;
    }
    :deep(.m-collapse-item__header) {
        padding: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: default;
    }
    :deep(.m-collapse-item__header-icon) {
        margin-right: 0;
    }
    :deep(.m-collapse-item__content) {
        padding-top: 16px;
    }
}
.config-box-title {
    font-size: 16px;
    font-weight: 700;
    position: relative;
    text-indent: 12px;
    &::after {
        content: '';
        position: absolute;
        display: block;
        width: 3px;
        height: 14px;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        background-color: #246fe5;
    }
}
.config-box-icon {
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    height: 20px;
    line-height: 20px;
}
</style>
