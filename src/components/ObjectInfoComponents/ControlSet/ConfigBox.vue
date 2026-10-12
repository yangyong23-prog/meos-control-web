<template>
    <m-collapse v-model="data" class="config-box" :hover-style="false" only-icon-click>
        <m-collapse-item id="1" class="config-box-item">
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
    & + .config-box {
        margin-top: 16px;
    }

    :deep(.config-box-item > .m-collapse-item__header) {
        padding: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: default;
        .m-collapse-item__header-icon {
            margin-right: 0;
        }
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
    padding: 4px;
    border-radius: 4px;
    height: 22px;
    line-height: 22px;
    &:hover {
        background-color: var(--alpha-30);
    }
}
</style>
