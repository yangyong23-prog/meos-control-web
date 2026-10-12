<template>
    <div>
        <m-modal
            v-model:visible="visibleModel"
            :append-to="$modalAppendTo"
            type="default"
            :title="i18n.global.t('meos_control_web.global_configuration')"
            :width="840"
            :top-y="120"
            :auto-close="false"
            align-center
            @close="closeModals"
        >
            <template #content>
                <div class="all-statistics">
                    {{ i18n.global.t('meos_control_web.loop_total_count') }}<span class="val">{{ allStatistics.total }}</span
                    >/ {{ i18n.global.t('common.status_open') }} <span class="val">{{ allStatistics.openCount }}</span
                    >/ {{ i18n.global.t('meos_control_web.unconfiged') }}
                    <span class="val">{{ allStatistics.noCount }}</span>
                </div>
                <FunctypeConfigTable ref="functypeCfgTable" class="func-table" :active="modelValue" :mode="'global'" :init-setting="initSetting"> </FunctypeConfigTable>
                <m-modal
                    v-model:visible="showExitConfirm"
                    :append-to="$modalAppendTo"
                    type="info"
                    :title="i18n.global.t('meos_control_web.confirm_exit')"
                    :content="i18n.global.t('meos_control_web.filled_content_not_recoverable')"
                    @close="closeExitConfirm"
                    @submit="sureExitConfirm"
                >
                </m-modal>
                <m-modal
                    v-model:visible="showSaveConfirm"
                    :append-to="$modalAppendTo"
                    type="info"
                    :title="i18n.global.t('meos_control_web.confirm_save_changes')"
                    :content="i18n.global.t('meos_control_web.obj_will_drop_parent_config')"
                    @submit="sureSaveConfirm"
                >
                </m-modal>
            </template>
            <template #footer>
                <m-button type="default" @click.stop="closeModals">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" :loading="isSaveLoading" @click.stop="saveAll">{{ i18n.global.t('common.save') }}</m-button>
            </template>
        </m-modal>
    </div>
</template>

<script setup>
import { ref, provide, inject } from 'vue';
import FunctypeConfigTable from './FunctypeConfigTable.vue';
import useFunctypeConfigEdit from '../hooks/useFunctypeConfigEdit';
import i18n from '@/localization';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    // 引用自上级
    isQuote: {
        type: Boolean,
        default: false
    },
    // 是否是照明-人工干预里用到的，默认是需求管理-照明用的
    isIntervene: {
        type: Boolean,
        default: false
    },
    initSetting: {
        type: Array,
        default: () => []
    },
    initSpaceTypes: {
        type: Array,
        default: () => []
    }
});
const emits = defineEmits(['update:modelValue', 'close', 'afterSave', 'ok']);
const functypeCfgTable = ref();
const showExitConfirm = ref(false);

const showSaveConfirm = ref(false);

const visibleModel = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});

const { allStatistics, isSaveLoading, genDataForSave, genShowResultData, saveGlobalEdit } = useFunctypeConfigEdit();
const _closeThisModal = () => {
    emits('update:modelValue');
    emits('close');
};
const closeModals = () => {
    console.log('closeModals');
    if (functypeCfgTable.value?.hasEditChanged()) {
        showExitConfirm.value = true;
    } else {
        _closeThisModal();
    }
};
const _saveData = async spaceTypes => {
    if (props.isIntervene) {
        // 如果是人工干预，将数据返回回去
        const saveData = genDataForSave();
        const showData = genShowResultData();
        emits('ok', { saveData, showData });
    } else {
        await saveGlobalEdit(spaceTypes);
        _closeThisModal();
        emits('afterSave');
    }
};
const saveAll = () => {
    console.log('saveAll: ');
    if (isSaveLoading?.value) {
        return;
    }
    if (props.isQuote) {
        showSaveConfirm.value = true;
        return;
    }
    console.log('closeModals');
    _saveData();
};
const closeExitConfirm = () => {
    console.log('closeExitConfirm');
};
const sureExitConfirm = () => {
    console.log('sureExitConfirm');
    _closeThisModal();
};
const sureSaveConfirm = () => {
    _saveData(props.initSpaceTypes);
};

provide('allStatistics', allStatistics);
</script>
<style lang="less" scoped>
.all-statistics {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--gray-600);
    font-size: 12px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 20px; /* 166.667% */
    .val {
        color: var(--gray-900);
    }
}
.func-table {
    margin-top: 8px;
    height: calc(100% - 28px);
}
</style>
