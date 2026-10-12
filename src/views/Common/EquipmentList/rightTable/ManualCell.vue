<template>
    <m-tips theme="darkTransparent" placement="top" trigger="hover" :content="tipsContent" :disabled="!tipsContent">
        <div class="hand-automatism-wrap fcol" :class="[{ disabled: disabled }, { manual: model === '0' }]">
            <!-- 设定值操作列 -->
            <template v-if="cellType === 'set'"
                ><AloneModal
                    :visible="modalType === 'set' && popoverModalBG"
                    :object-ids="objectIds"
                    :disabled="disabled"
                    :data="data"
                    :auto-recovery-date-time="autoRecoveryDateTime"
                    :project-id="projectId"
                    :manual-auto-status="manualAutoStatus"
                    :data-value="dataValue"
                    @save="save"
                    @close-pop="closePop"
                >
                    <div class="hand-automatism-text" :class="{ disabled: disabled }" @click="showModal('set')">
                        {{ defaultValue }}
                    </div>
                </AloneModal>
            </template>
            <template v-else-if="cellType === 'operate'">
                <div style="display: flex">
                    <AloneModal
                        :cell-type="cellType"
                        :visible="modalType === 'set' && popoverModalBG"
                        :object-ids="objectIds"
                        :disabled="disabled"
                        :data="data"
                        :auto-recovery-date-time="autoRecoveryDateTime"
                        :project-id="projectId"
                        :manual-auto-status="manualAutoStatus"
                        :data-value="data?.dataSource[0].code"
                        @save="save"
                        @close-pop="closePop"
                    >
                        <div class="hand-automatism-text" style="margin-right: 12px" :class="{ disabled: disabled }" @click="showModal('set')">
                            {{ data?.dataSource[0].name }}
                        </div>
                    </AloneModal>
                    <AloneModal
                        :cell-type="cellType"
                        :visible="modalType === 'set' && popoverModalBG"
                        :object-ids="objectIds"
                        :disabled="disabled"
                        :data="data"
                        :auto-recovery-date-time="autoRecoveryDateTime"
                        :project-id="projectId"
                        :manual-auto-status="manualAutoStatus"
                        :data-value="data?.dataSource[1].code"
                        @save="save"
                        @close-pop="closePop"
                    >
                        <div class="hand-automatism-text" :class="{ disabled: disabled }" @click="showModal('set')">
                            {{ data?.dataSource[1].name }}
                        </div>
                    </AloneModal>
                </div>
            </template>
            <!-- 手自动状态操作列 -->
            <template v-else>
                <div :style="{ padding: String(model) === '0' ? '11.5px 0' : '0' }">
                    <div class="radio-btn">
                        <!-- 自动 -->
                        <AutoModal
                            :object-ids="objectIds"
                            type="batchManualOrAuto"
                            :disabled="disabled"
                            :visible="modalType === 'auto' && popoverModalBG"
                            @save="save"
                            @close-pop="closePop"
                        >
                            <m-radio :model-value="autoModel" :size="14" style="margin-right: 8px" :class="{ disabled: disabled }" @click="showModal('auto')">{{
                                i18n.global.t('meos_control_web.auto')
                            }}</m-radio>
                        </AutoModal>
                        <!-- 手动 -->
                        <ManualModal :object-ids="objectIds" :visible="modalType === 'manual' && popoverModalBG" :disabled="disabled" @save="save" @close-pop="closePop">
                            <m-radio :model-value="manualModel" :size="14" :class="{ disabled: disabled }" @click="showModal('manual')">{{
                                i18n.global.t('meos_control_web.manual')
                            }}</m-radio>
                        </ManualModal>
                    </div>
                    <!-- 修改截止时间 -->
                    <ManualModal
                        :object-ids="objectIds"
                        :visible="modalType === 'edit' && popoverModalBG"
                        :expire-time="data?.additionalMapValue?.recoveryDateTime || ''"
                        :disabled="disabled"
                        type="edit"
                        @save="save"
                        @close-pop="closePop"
                    >
                        <div v-show="String(model) === '0'" class="hand-automatism-text" :class="{ disabled: disabled }" @click="showModal('edit')">
                            {{ i18n.global.t('meos_control_web.modify_deadline') }}
                        </div>
                    </ManualModal>
                </div>
            </template>
        </div>
    </m-tips>
</template>
<script setup>
import i18n from '@/localization';
import ManualModal from './components/ManualModal.vue';
import AutoModal from './components/AutoModal.vue';
import AloneModal from './components/AloneModal.vue';
import useManualCell from '../hooks/useManualCell';
const popoverModalBG = inject('popoverModalBG');

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    dataDefault: {
        type: Object,
        default: () => {}
    },
    objectIds: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    },
    // 设备列表类型
    runningMonitorType: {
        type: String,
        default: ''
    },
    autoRecoveryDateTime: {
        type: String,
        default: ''
    },
    cellType: {
        type: String,
        default: ''
    },
    projectId: {
        type: String,
        default: ''
    },
    manualAutoStatus: {
        type: String,
        default: ''
    },
    dataValue: {
        type: String,
        default: ''
    },
    defaultValue: {
        type: String,
        default: ''
    }
});

const emit = defineEmits('tableInit');

const { model, disabled, modalType, autoModel, manualModel, tipsContent, save, showModal, closePop } = useManualCell(props, emit);
</script>
<style lang="less" scoped>
.hand-automatism-wrap {
    width: 100%;
    height: 100%;
    .radio-btn {
        height: 22px;
        line-height: 22px;
        display: flex;
        align-items: center;
        .m-radio {
            margin-right: 4px;
            &:last-child {
                margin-right: 0;
            }
            &.disabled {
                cursor: not-allowed;
                :deep(.radio.checked .m-radio-icon:before) {
                    background: #c4c9cf;
                    cursor: not-allowed;
                }
                :deep(.border-gray) {
                    border: 1px solid #c4c9cf;
                }
            }
        }
    }
    .hand-automatism-text {
        color: @blue-500;
        font-feature-settings: 'clig' off, 'liga' off;
        cursor: pointer;

        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        &:hover {
            color: @blue-700;
        }
        &.disabled {
            color: @grey-400;
            cursor: not-allowed;
        }
    }
}
.manual {
    justify-content: space-between;
}
</style>
