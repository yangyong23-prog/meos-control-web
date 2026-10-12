<template>
    <template v-if="hasPermission()">
        <m-tips v-if="!isEdge()" theme="darkTransparent" :content="i18n.global.t('meos_control_web.cloud_platform_operation_not_supported_please_use_edge')" placement="top">
            <m-button ref="btn" v-bind="$attrs" :disabled="true" class="set-btn" @click="handleClick"><slot></slot></m-button>
        </m-tips>
        <m-tips v-else theme="darkTransparent" :disabled="!disabled && !showTip" :content="content" placement="top">
            <m-button ref="btn" v-bind="$attrs" :disabled="disabled" class="set-btn" @click="handleClick"><slot></slot></m-button>
        </m-tips>
    </template>
    <template v-else>
        <m-tips theme="darkTransparent" :content="i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding')" placement="top">
            <m-button ref="btn" v-bind="$attrs" :disabled="true" class="set-btn"><slot></slot></m-button>
        </m-tips>
    </template>
</template>

<script setup>
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { isEdge } from '@/utils/envUtils';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
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
    }
});
const btn = ref(null);
const emits = defineEmits(['click']);
const handleClick = e => {
    emits('click', { target: btn.value.$el });
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
.set-btn {
    &.m-button.small.link {
        padding: 0;
        :deep(.m-button-span-text) {
            padding: 0 4px;
        }
    }
    &.is-hover {
        background-color: var(--alpha-30);
    }
}
</style>
