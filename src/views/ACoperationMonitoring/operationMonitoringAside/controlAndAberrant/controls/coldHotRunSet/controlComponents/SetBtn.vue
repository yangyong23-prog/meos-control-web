<template>
    <template v-if="hasControls">
        <m-button v-if="controlItem.runStatus" style="margin-top: 1px" type="link" size="small" @click="e => openControlPop(e, controlItem)">
            {{ btnText(controlItem) }}
        </m-button>
        <m-tips v-else-if="btnText(controlItem)" :content="content" theme="darkTransparent">
            <div class="btn-disabled">
                {{ btnText(controlItem) }}
            </div>
        </m-tips>
    </template>
    <template v-else>
        <m-tips :content="i18n.global.t('meos_control_web.cloud_platform_control_not_supported_please_use_edge')" theme="darkTransparent">
            <div class="btn-disabled">
                {{ btnText(controlItem) }}
            </div>
        </m-tips>
    </template>
</template>

<script setup>
import i18n from '@/localization';
import { btnText } from '@/utils/tools';
defineProps({
    controlItem: {
        type: Object,
        default: () => ({})
    },
    content: String
});
const openControlPop = inject('openControlPop');
const hasControls = inject('hasControls');
</script>
<style lang="less" scoped>
.btn-disabled {
    cursor: not-allowed;
    color: var(--gray-400);
    padding: 0 4px;
}
</style>
