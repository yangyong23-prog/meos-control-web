<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        modal-class-name="startMPCCalculation-tempalte-modal"
        type="default"
        :title="i18n.global.t('meos_control_web.start_mpc_calc')"
        :need-scrollbar="false"
        :width="600"
        :height="350"
        :z-index="10"
        :max-height="642"
        :escable="false"
        :auto-close="false"
        @close="closeModal"
    >
        <template #content>
            <m-scrollbar class="mpc-calculation-loading content-wrap" bar-x-size="0px" bar-x-hover-size="0px">
                <div v-if="!systemTreeMPCLoading">
                    <div class="startMPCCalculation-decs">
                        {{ i18n.global.t('meos_control_web.start_mpc_calc_decs') }}
                        <m-tips theme="darkTransparent" width="430px" placement="top">
                            <template #content>
                                <div>
                                    {{ i18n.global.t('meos_control_web.start_mpc_calc_decs_tips1') }}
                                    <br />
                                    {{ i18n.global.t('meos_control_web.start_mpc_calc_decs_tips2') }}
                                    <br />
                                    {{ i18n.global.t('meos_control_web.start_mpc_calc_decs_tips3') }}
                                </div>
                            </template>
                            <IconMeriComponentDialogLinear size="16" color="#626C78" />
                        </m-tips>
                    </div>
                    <m-tree :data="systemTreeMPC" class="startMPCCalculation-tempalte-tree" last-stage readonly :return-parent-node="false">
                        <template #rowSuffix="node">
                            <div v-if="!node.children" class="switch-line">
                                <span class="switch-label">{{ i18n.global.t('common.space') }}</span>
                                <m-switch v-model="node.space" size="small"></m-switch>
                                <span class="segmentation-line"></span>
                                <span class="switch-label">{{ systemLabel(node) }}</span>
                                <m-switch v-model="node.cold" size="small"></m-switch>
                                <span class="segmentation-line"></span>
                                <span class="switch-label">{{ i18n.global.t('meos_control_web.pump_group') }}</span>
                                <m-switch v-model="node.terminalPump" size="small"></m-switch>
                            </div>
                        </template>
                    </m-tree>
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
                        {{ i18n.global.t('common.confirm') }}
                    </m-button>
                </div>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
import { mpcAgentCfg } from '@/apis/xshellConfiguration';
import { $Message } from 'meri-plus';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import { systemTreeMPCKey, systemTreeMPCLoadingKey, getMPCConfigDataAndSystemDataKey } from '../../hooks/useGlobalData';

const emits = defineEmits(['close', 'after-submit']);
const showModal = ref(false);
const submitLoading = ref(false);
const systemTreeMPC = inject(systemTreeMPCKey);
const systemTreeMPCLoading = inject(systemTreeMPCLoadingKey);
const getMPCConfigDataAndSystemData = inject(getMPCConfigDataAndSystemDataKey);

const labelMap = {
    ACAC: i18n.global.t('meos_control_web.cooling_source'),
    ACCC: i18n.global.t('meos_control_web.cooling_source'),
    ACAI: i18n.global.t('meos_control_web.heating_cooling_source'),
    ACCI: i18n.global.t('meos_control_web.heating_cooling_source'),
    ACAH: i18n.global.t('meos_control_web.heat_source'),
    ACCH: i18n.global.t('meos_control_web.heat_source')
};

onMounted(() => {
    showModal.value = true;
    getMPCConfigDataAndSystemData();
});

const systemLabel = computed(() => {
    return node => {
        return labelMap[node.parent.classCode] ?? '--';
    };
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
    submitLoading.value = true;
    const params = [];
    systemTreeMPC.value.map(item => {
        item.children.map(_item => {
            params.push({
                cold: _item.cold === 'checked' ? true : false,
                space: _item.space === 'checked' ? true : false,
                terminalPump: _item.terminalPump === 'checked' ? true : false,
                systemId: _item.id
            });
        });
    });
    mpcAgentCfg(params)
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
.startMPCCalculation-tempalte-modal {
    .content-wrap {
        padding: 16px;
        .startMPCCalculation-decs {
            display: flex;
            align-items: center;
            padding-left: 12px;
            gap: 8px;
            margin-bottom: 12px;
            color: var(--Grey-Grey-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }
        .startMPCCalculation-tempalte-tree {
            padding-left: 0px;
            .switch-line {
                display: flex;
                .switch-label {
                    margin-right: 4px;
                }
                .segmentation-line {
                    display: inline-block;
                    width: 1px;
                    height: 13px;
                    margin: 0px 8px;
                    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                }
            }
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
.startMPCCalculation-tempalte-modal {
    .m-modal-main-title {
        color: var(--Grey-Grey-800, #2e3742) !important;
    }
    .m-modal-main-content {
        padding: 0px !important;
    }
}
</style>
