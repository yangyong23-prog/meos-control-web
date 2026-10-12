<template>
    <div class="control-set-title fcb">
        <div class="fc">
            <template v-if="hasControls">
                <div class="mr4">
                    <m-tag v-if="controlItem.isAi" size="small" color="#683BD6" bg-color="#F1E5FE">{{ i18n.global.t('meos_control_web.auto') }}</m-tag>
                    <m-tag v-else size="small" color="#E68600" bg-color="#FFF0CC">{{ i18n.global.t('meos_control_web.manual1') }}</m-tag>
                </div>
            </template>
            {{ controlItem.name }}
        </div>
        <div v-if="controlItem.infoCode === infoCode" class="fcc">
            <div style="height: 28px; line-height: 28px">{{ getValueStr(controlItem).text }}</div>
            <template v-if="true">
                <SetBtn :control-item="controlItem" />
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getValueStr } from '@/utils/tools';
import SetBtn from './SetBtn.vue';
defineProps({
    controlItem: {
        type: Object,
        default: () => ({})
    },
    infoCode: String
});
const hasControls = inject('hasControls');
</script>
<style lang="less" scoped>
.control-set-title {
    height: 32px;
    color: var(--gray-600);
}
</style>
