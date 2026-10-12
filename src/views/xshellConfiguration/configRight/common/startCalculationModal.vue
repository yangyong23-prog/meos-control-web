<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        modal-class-name="startCalculation-tempalte-modal"
        type="default"
        :title="i18n.global.t('meos_control_web.start_algorithm_calc')"
        :need-scrollbar="false"
        :width="420"
        :height="346"
        :z-index="10"
        :max-height="642"
        :escable="false"
        :auto-close="false"
        @close="closeModal"
    >
        <template #content>
            <m-scrollbar class="start-calculation-loading content-wrap" bar-x-size="0px" bar-x-hover-size="0px">
                <div v-if="!systemTreeLoading">
                    <div class="startCalculation-decs">
                        {{ i18n.global.t('meos_control_web.start_algorithm_calc_decs') }}
                    </div>
                    <m-tree v-model="selected" :data="systemTree" class="startCalculation-tempalte-tree" multiple :return-parent-node="false"> </m-tree>
                </div>
            </m-scrollbar>
        </template>
        <template #footer>
            <div class="footer-btn-group">
                <div class="btns">
                    <m-button type="default" :disabled="submitLoading" @click.stop="closeModal">
                        {{ i18n.global.t('common.cancel') }}
                    </m-button>
                    <m-button type="primary" :loading="submitLoading" @click="confirm">
                        {{ i18n.global.t('meos_control_web.start_algorithm_calc') }}
                    </m-button>
                </div>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
import { startAlgorithmCalculation } from '@/apis/xshellConfiguration';
import { $Message } from 'meri-plus';
import { systemTreeKey, systemTreeLoadingKey, getAIsystemTreeKey } from '../../hooks/useGlobalData';

const emits = defineEmits(['close', 'after-submit']);
const showModal = ref(false);
const submitLoading = ref(false);
const selected = ref([]);
const systemTree = inject(systemTreeKey);
const systemTreeLoading = inject(systemTreeLoadingKey);
const getAIsystemTree = inject(getAIsystemTreeKey);

onMounted(() => {
    getAIsystemTree();
    showModal.value = true;
});

const closeModal = () => {
    if (submitLoading.value) {
        return;
    }
    showModal.value = false;
    nextTick(() => {
        emits('close');
    });
};

const confirm = () => {
    if (selected.value?.length === 0) {
        return $Message.error({ title: i18n.global.t('meos_control_web.un_selected') });
    }
    submitLoading.value = true;
    startAlgorithmCalculation({
        systemIdList: selected.value
    })
        .then(res => {
            if (res.code === '00000') {
                submitLoading.value = false;
                closeModal();
                $Message.success({ title: i18n.global.t('meos_control_web.startup_success') });
            }
        })
        .finally(() => {
            submitLoading.value = false;
        });
};
</script>

<style lang="less" scoped>
.startCalculation-tempalte-modal {
    .content-wrap {
        padding: 16px;
        .startCalculation-decs {
            padding-left: 12px;
            margin-bottom: 12px;
            color: var(--Grey-Grey-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }
        .startCalculation-tempalte-tree {
            padding-left: 0px;
        }
    }
    .footer-btn-group {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .btns {
            display: flex;
            align-items: center;
        }
    }
}
</style>
<style lang="less">
.startCalculation-tempalte-modal {
    .m-modal-main-title {
        color: var(--Grey-Grey-800, #2e3742) !important;
    }
    .m-modal-main-content {
        padding: 0px !important;
    }
}
</style>
