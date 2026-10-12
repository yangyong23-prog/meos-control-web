<template>
    <div class="module-info-header fcb">
        <div class="header-left fc h100">
            <div class="header-back fcc" @click="handleModuleInfoChange"><IconMeriComponentChevronLeft color="#8B949E" />{{ i18n.global.t('meos_control_web.back') }}</div>
            <div class="line" style="margin-right: 8px"></div>
            <m-dropdown v-model="systemId" width="240px" :options="systemList" :text="systemName" trigger="click" @change="changeSystem"> </m-dropdown>
            <div class="line" style="margin-right: 12px"></div>
            <m-tabs v-if="tabsList.length" :key="systemId" v-model="analysisType" :data="tabsList" size="large" />
        </div>
        <div class="header-right fc">
            <m-checkbox v-model="checkboxValue">
                <div class="flex-row">
                    <span>{{ i18n.global.t('meos_control_web.moment_anchor') }}</span>
                    <m-tips :content="i18n.global.t('meos_control_web.keyboard_arrow_switch_precision')" theme="darkTransparent" placement="right-start">
                        <IconMeriComponentDialogLinear :size="14" />
                    </m-tips>
                </div>
            </m-checkbox>
            <div class="line" style="margin: 0 12px"></div>
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

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft, IconMeriComponentDialogLinear } from 'meri-icon';
import { handleModuleInfoChangeKey, globalTimeKey, analysisTypeKey, systemIdKey, systemNameKey } from '../injectionKey';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
const props = defineProps({
    analysisTypeList: {
        type: Array,
        default: () => []
    },
    systemList: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['update:modelValue']);
const checkboxValue = computed({
    get() {
        return props.modelValue ? 'checked' : 'uncheck';
    },
    set(val) {
        emits('update:modelValue', val !== 'uncheck');
    }
});
const getGlobalTime = () => {
    // 获取当前日期
    const currentDate = getDayjsTz();
    // 通过减去1天来获取昨天的日期
    const yesterday = currentDate.subtract(1, 'day');
    return yesterday.format('YYYY.MM.DD');
};
const scope = `1900.01.01-${getGlobalTime()}`;

const handleModuleInfoChange = inject(handleModuleInfoChangeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const globalTime = inject(globalTimeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const analysisType = inject(analysisTypeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const systemId = inject(systemIdKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const systemName = inject(systemNameKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const tabsList = ref(props.analysisTypeList);
const changeSystem = (value, option) => {
    systemName.value = option.label;
    systemId.value = value;
    console.log(option);
    if (option.isCoolStore !== '1') {
        tabsList.value = props.analysisTypeList.filter(item => item.id !== 'COLD_STORE_SIDE');
        if (analysisType.value === 'COLD_STORE_SIDE') {
            analysisType.value = tabsList.value[0]?.id || '';
        }
    } else {
        tabsList.value = structuredClone(props.analysisTypeList);
    }
};
onMounted(() => {
    tabsList.value = structuredClone(props.analysisTypeList);
});
</script>
<style lang="less" scoped>
.module-info-header {
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
    :deep(.m-tabs-line) {
        height: 100%;
        .m-tabs-body {
            height: 100%;
            .m-tabs-scroll,
            .m-tabs-list {
                height: 100%;
            }
        }
        .m-tabs-list:before {
            bottom: 0;
        }
    }
    .flex-row {
        display: flex;
        align-items: center;
        gap: 4px;
    }
}
</style>
