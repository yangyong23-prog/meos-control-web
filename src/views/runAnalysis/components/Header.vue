<template>
    <div class="run-analysis-header fcb">
        <div class="header-left fc h100">
            <div class="header-back fcc" @click="emits('back')"><IconMeriComponentChevronLeft color="#8B949E" />{{ i18n.global.t('meos_control_web.back') }}</div>
            <div class="line" style="margin-right: 8px"></div>
            <m-dropdown v-model="dropdownId" :options="options" :text="dropdownName" trigger="click" @change="changeDropdown"> </m-dropdown>
            <div class="line" style="margin: 0 12px"></div>
            <slot name="left"></slot>
        </div>
        <div class="header-right fc">
            <slot name="right"></slot>
            <m-date-picker
                v-model="globalTime"
                format="YYYY.MM.DD"
                :clearable="false"
                :scope="scope"
                :scope-disabled-tips-text="i18n.global.t('meos_control_web.future_time_not_selectable')"
            ></m-date-picker>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import { globalTimeKey } from '../injectionKey';
import dayjs from 'dayjs';
import { PropType } from 'vue';
import { getDayjsTz } from '@/utils/globalVariables';
const props = defineProps({
    options: {
        type: Array as PropType<{ label: string; key: string }[]>,
        default: () => []
    }
});
const emits = defineEmits(['back', 'change']);
const getGlobalTime = () => {
    // 获取当前日期
    const currentDate = getDayjsTz();
    // 通过减去1天来获取昨天的日期
    const yesterday = currentDate.subtract(1, 'day');
    return yesterday.format('YYYY.MM.DD');
};
const scope = `1900.01.01-${getGlobalTime()}`;
const globalTime = inject(globalTimeKey);
const dropdownId = ref('');
const dropdownName = ref('');
const changeDropdown = (value: any, data: { label: string }) => {
    dropdownName.value = data.label;
    emits('change', value, data);
};
onMounted(() => {
    dropdownName.value = props.options[0].label;
    dropdownId.value = props.options[0].key;
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
