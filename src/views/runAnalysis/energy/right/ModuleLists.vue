<template>
    <div class="module-lists fcc fs16">
        <div v-for="item in [...analysisTypeList, SPACE_ANALYSIS, EQUIPMENT_ANALYSIS]" :key="item.id" class="module-lists-item fcb" @click="handleModuleInfoChange(item.id)">
            {{ i18n.global.t('meos_control_web.name_analysis', { name: item.name }) }}
            <IconMeriComponentChevronRight />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronRight } from 'meri-icon';
import { handleModuleInfoChangeKey } from '../../injectionKey';
import { SPACE_ANALYSIS, EQUIPMENT_ANALYSIS } from '../../variable';
defineProps({
    analysisTypeList: {
        type: Array,
        default: () => []
    }
});
const handleModuleInfoChange = inject(handleModuleInfoChangeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
</script>
<style lang="less" scoped>
.module-lists {
    padding: 12px 24px 0 24px;
    gap: 12px;
    margin-bottom: 12px;
    &-item {
        cursor: pointer;
        height: 48px;
        flex: 1;
        padding: 12px 16px;
        background: rgba(244, 248, 255, 1);
        border-radius: 4px;
        &:hover {
            background: #e7edf9;
        }
    }
}
</style>
