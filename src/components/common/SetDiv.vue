<template>
    <template v-if="hasPermission()">
        <m-tips v-if="!isEdge()" theme="darkTransparent" :content="i18n.global.t('meos_control_web.cloud_platform_operation_not_supported_please_use_edge')" placement="top">
            <div :disabled="true" class="set-div" :class="{ noHeight: noHeight }" v-bind="$attrs" @click="handleClick">
                <span ref="btn"><slot :has-permission="hasPermission()" :is-edge="isEdge()" :disabled="true"></slot></span>
            </div>
        </m-tips>
        <m-tips v-else theme="darkTransparent" :disabled="!disabled && !showTip" :content="content" placement="top">
            <div :disabled="disabled" class="set-div" :class="{ noHeight: noHeight }" v-bind="$attrs" @click="handleClick">
                <span ref="btn"><slot :has-permission="hasPermission()" :is-edge="isEdge()" :disabled="disabled"></slot></span>
            </div>
        </m-tips>
    </template>
    <template v-else>
        <m-tips theme="darkTransparent" :content="i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding')" placement="top">
            <div ref="btn" :disabled="true" class="set-div" :class="{ noHeight: noHeight }" v-bind="$attrs">
                <span><slot :has-permission="hasPermission()" :is-edge="isEdge()" :disabled="true"></slot></span>
            </div>
        </m-tips>
    </template>
</template>

<script setup>
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { isEdge } from '@/utils/envUtils';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
defineOptions({
    inheritAttrs: false
});
const base = baseStore();
const props = defineProps({
    content: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    permission: {
        type: String,
        default: () => window[GET_MENU_CONFIG]().PERMISSION || ''
    },
    showTip: {
        type: Boolean,
        default: false
    },
    noHeight: {
        type: Boolean,
        default: false
    }
});
const btn = ref(null);
const emits = defineEmits(['click']);
const handleClick = e => {
    if (props.disabled || !isEdge() || !hasPermission()) {
        return;
    }
    emits('click', btn.value, e);
};
const hasPermission = () => {
    // 如果没有传入权限，则默认返回true
    if (!props.permission) {
        return true;
    }
    // 如果传入了权限，则检查是否有权限
    if (base.hasAuth(props.permission)) {
        return true;
    }
    return false;
};
</script>
<style lang="less" scoped>
.set-div {
    display: inline-block;
    color: var(--blue-500);
    cursor: pointer;
    user-select: none;
    height: 22px;
    line-height: 22px;
    &.noHeight {
        height: auto;
        line-height: none;
    }
    &:hover {
        color: var(--blue-700);
    }
    & + .set-div {
        margin-left: 12px;
    }
    &[disabled='true'] {
        cursor: not-allowed;
        color: var(--gray-400);
    }
}
</style>
