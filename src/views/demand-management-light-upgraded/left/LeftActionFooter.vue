<template>
    <div v-if="isAbleAuth && !leftTreeLoading && !isHideTemplateManage" class="left-footer">
        <m-popover
            :content="i18n.global.t('meos_control_web.already_editing_cannot_add')"
            theme="darkTransparent"
            :show-arrow="false"
            :disabled="!isRightConfigAdd && !isRightConfigEdit"
        >
            <m-button type="link" size="medium" icon="IconMeriComponentButtonAdd" :disabled="isRightConfigAdd || isRightConfigEdit" @click="addConfig">{{
                i18n.global.t('meos_control_web.add_special_config')
            }}</m-button>
        </m-popover>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { isRightConfigAddKey, isRightConfigEditKey, useConfigLeftAction } from '../hooks/useConfigCommonHook';

const props = defineProps({
    isHideTemplateManage: {
        type: Boolean,
        default: false
    },
    useAuth: {
        type: Boolean,
        default: false
    }
});
const base = baseStore();
const isAbleAuth = computed(() => {
    if (props.useAuth) {
        return base.hasAuth('editingStandards');
    }
    return true;
});

const isRightConfigAdd = inject(isRightConfigAddKey);
const isRightConfigEdit = inject(isRightConfigEditKey);
const { addConfig } = useConfigLeftAction();
</script>

<style lang="less" scoped>
.left-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 60px;
    line-height: 60px;
    text-align: center;
    width: 336px;
    border-top: 1px solid var(--gray-300, #e1e5eb);
}
</style>
