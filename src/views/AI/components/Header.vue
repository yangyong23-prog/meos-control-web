<template>
    <div class="run-analysis-header fcb">
        <div class="header-left fc h100">
            <div class="header-back fcc" @click="emits('back')"><IconMeriComponentChevronLeft color="#8B949E" />{{ i18n.global.t('meos_control_web.back') }}</div>
            <div class="line" style="margin-right: 8px"></div>
            <m-dropdown v-if="!fixType" v-model="dropdownId" :options="options" :text="dropdownName" trigger="click" @change="changeDropdown"> </m-dropdown>
            <div v-else class="fix-text">{{ dropdownName }}</div>
            <div class="line" style="margin: 0 12px"></div>
            <slot name="left"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import { PropType } from 'vue';
const props = defineProps({
    options: {
        type: Array as PropType<{ label: string; key: string }[]>,
        default: () => []
    },
    value: {
        type: String,
        default: ''
    },
    fixType: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['back', 'change']);
const dropdownId = ref(props.value);
const dropdownName = ref('');
const changeDropdown = (value: any, data: { label: string }) => {
    dropdownName.value = data.label;
    emits('change', value, data);
};
onMounted(() => {
    const data = props.options?.find(item => item.key === props.value) || props.options[0];
    dropdownName.value = data.label;
    dropdownId.value = data.key;
});
</script>
<style lang="less" scoped>
.run-analysis-header {
    height: 48px;
    padding: 0 24px;
    border-bottom: 1px solid var(--gray-300);
    .line {
        height: 16px;
        width: 1px;
        background-color: var(--gray-400);
    }
    .fix-text {
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
    }
    .header-back {
        cursor: pointer;
        margin-right: 8px;
        padding: 4px 8px 4px;
        border-radius: 4px;
        &:hover {
            background-color: var(--gray-200);
        }
    }
    :deep(.m-dropdown-text) {
        font-weight: 700;
    }
}
</style>
