<template>
    <div :class="{ LMS: hasLMS }" class="set-form-container">
        <m-scrollbar v-if="show" :max-height="600">
            <m-form ref="SetForm" :model="params" label-position="top" scroll-to-error>
                <template v-for="item in formItemList" :key="item.infoCode">
                    <component
                        :is="item.component"
                        v-show="!item.hide"
                        :id="data.id"
                        :unit="data.unit"
                        :min="item.min"
                        :max="item.max"
                        :precision="item.precision"
                        :data="item"
                        :unlimit-time-range="unlimitTimeRange"
                        :select-data="data"
                        :current-info-code="data.infoCode"
                        :is-clear="isClear"
                        :control-list-data="controlListData"
                        :has-l-m-s="hasLMS"
                        :set-params="setParams"
                        @change-form-item="handleChangeFormItem"
                    />
                </template>

                <m-form-item style="--m-form-item-margin: 0; position: sticky; bottom: 0; background-color: #ffffff; z-index: 2">
                    <div style="text-align: right; width: 100%">
                        <m-tips :content="i18n.global.t('meos_control_web.operate_interrupt_in_saveing')" :disabled="!btnLoading" theme="darkTransparent">
                            <m-button size="small" :disabled="btnLoading" @click="closeForm">{{ i18n.global.t('common.cancel') }}</m-button>
                        </m-tips>
                        <m-button type="primary" size="small" :loading="btnLoading" @click="handleSubmit">{{ i18n.global.t('common.confirm') }}</m-button>
                    </div>
                </m-form-item>
            </m-form>
        </m-scrollbar>
    </div>
</template>

<script setup>
import useSetFormHook from '@/views/ACAC/hooks/useSetFormHook';
import i18n from '@/localization';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    controlListData: {
        type: Array,
        default: () => []
    },
    customAxios: {
        type: Boolean,
        default: false
    },
    unlimitTimeRange: {
        type: Boolean,
        default: false
    },
    identifyLocalOrRemote: Function,
    canChange: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['close', 'submit']);
const hasLMS = computed(() => {
    for (const element of formItemList.value) {
        const data = props.controlListData.find(item => item.infoCode === element.infoCode);
        if (data?.chillerType?.id === 'LMS') {
            return true;
        }
    }

    return false;
});
const { params, SetForm, show, isClear, formItemList, btnLoading, handleChangeFormItem, closeForm, handleSubmit, setParams } = useSetFormHook(props, emit);
</script>
<style lang="less" scoped>
.set-form-container {
    width: 332px;
    &.LMS {
        width: 368px;
    }
    :deep(.m-scrollbar) {
        padding: 20px;
    }
    :deep(.m-date-picker) {
        width: 100%;
        .m-date-picker__result {
            width: 100% !important;
        }
    }
    :deep(.m-select-wrap) {
        width: 100%;
        .m-select,
        .m-select-inner {
            width: 100% !important;
        }
    }
    :deep(.m-input) {
        width: 100% !important;
    }
}
</style>
