<template>
    <template v-if="hasPermission()">
        <m-tips v-if="!isEdge()" theme="darkTransparent" :content="i18n.global.t('meos_control_web.cloud_platform_operation_not_supported_please_use_edge')" placement="top">
            <div ref="btn" class="set-intervene fcb fs12" :disabled="true" @click.stop="() => {}">
                {{ i18n.global.t('common.intervention') }}<IconMeriComponentArrowDown size="10" color="var(--gray-400)" />
            </div>
        </m-tips>
        <m-popover v-else ref="pop" :disabled="disabled" style="--m-popover-padding: 0" width="180px" trigger="click">
            <template #content>
                <div class="intervene-list">
                    <div class="intervene-item" @click="interveneClick('time')">{{ i18n.global.t('meos_control_web.modify_deadline') }}</div>
                    <div class="intervene-item" @click="interveneClick('release')">{{ i18n.global.t('meos_control_web.release_intervention') }}</div>
                </div>
            </template>
            <div ref="btn" :disabled="disabled" class="set-intervene fcb fs12" @click.stop="() => {}">
                {{ i18n.global.t('common.intervention') }}<IconMeriComponentArrowDown size="10" :color="disabled ? 'var(--gray-400)' : 'var(--gray-0)'" />
            </div>
        </m-popover>
    </template>
    <template v-else>
        <m-tips theme="darkTransparent" :content="i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding')" placement="top">
            <div ref="btn" class="set-intervene fcb fs12" :disabled="true" @click.stop="() => {}">
                {{ i18n.global.t('common.intervention') }}<IconMeriComponentArrowDown size="10" color="var(--gray-400)" />
            </div>
        </m-tips>
    </template>
</template>

<script setup>
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { isEdge } from '@/utils/envUtils';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import { IconMeriComponentArrowDown } from 'meri-icon';
const emits = defineEmits(['interveneClick']);
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
const interveneClick = type => {
    pop.value.manuallyHide();
    if (props.disabled) {
        return;
    }
    emits('interveneClick', btn.value, type);
};
const hasPermission = () => {
    // 如果没有传入权限，则默认返回true
    if (!props.permission) {
        return true;
    }
    // 如果传入了权限，则检查是否有权限
    if (baseStore().hasAuth(props.permission)) {
        return true;
    }
    return false;
};
const btn = ref(null);
const pop = ref(null);
</script>
<style lang="less" scoped>
.set-intervene {
    border-radius: 2px;
    height: 20px;
    width: 40px;
    padding: 0 2px;
    background-color: var(--orange-600);
    color: var(--gray-0);
    cursor: pointer;
    &:hover {
        background-color: var(--orange-700);
    }
    &[disabled='true'] {
        cursor: not-allowed;
        color: var(--gray-400);
        background-color: var(--gray-200);
    }
}
.intervene-list {
    padding: 8px 0;
    .intervene-item {
        padding: 8px 12px;
        cursor: pointer;
        &:hover {
            background-color: var(--gray-100);
        }
    }
}
</style>
