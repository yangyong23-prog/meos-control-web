<template>
    <div v-show="selectedList.length > 0" class="selected-wrap">
        <div class="left">
            <span>
                {{ i18n.global.t('meos_control_web.already_selected') }}
                <i class="number">{{ selectedList.length }}</i>
                {{ i18n.global.t('meos_control_web.item') }}
            </span>
            <ManualModal v-if="runningMonitorType !== 'SEWAGE'" :object-ids="objectIds" :visible="popoverModalBG && modalType === 'manual'" @save="save" @close-pop="closePop">
                <m-button type="primary" size="small" style="margin: 0 12px 0 16px" @click="showModal('manual')">{{ i18n.global.t('meos_control_web.switch_to_manual') }}</m-button>
            </ManualModal>
            <AutoModal
                v-if="runningMonitorType !== 'SEWAGE'"
                type="batchManualOrAuto"
                :object-ids="objectIds"
                :visible="popoverModalBG && modalType === 'auto'"
                @save="save"
                @close-pop="closePop"
            >
                <m-button type="primary" size="small" style="margin-right: 12px" @click="showModal('auto')">{{ i18n.global.t('meos_control_web.switch_to_auto') }}</m-button>
            </AutoModal>
            <PopoverWrap v-if="runningMonitorType !== 'SEWAGE'" placement="bottom" :visible="popoverModalBG && modalType === 'gy'">
                <template #content>
                    <DisIntervention
                        :running-monitor-type="runningMonitorType"
                        :object-ids="objectIds"
                        :info-code="''"
                        @save="save"
                        @close-pop="closePop"
                        @cancel="closePop"
                    ></DisIntervention>
                </template>
                <m-button type="primary" size="small" style="margin-right: 12px" @click="showModal('gy')">{{ i18n.global.t('meos_control_web.release_intervention') }}</m-button>
            </PopoverWrap>
            <span v-if="btnList.length > 0 && runningMonitorType !== 'SEWAGE'" class="split"></span>
        </div>
        <div class="middle">
            <AdaptiveMenuBar :list="btnList" :selected-list="selectedList"></AdaptiveMenuBar>
        </div>
        <div class="right">
            <m-button type="text" size="small">
                <span class="cancel-text" @click="clearChecked">{{ i18n.global.t('meos_control_web.deselect') }}</span>
            </m-button>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import AdaptiveMenuBar from './components/AdaptiveMenuBar.vue';
import ManualModal from './components/ManualModal.vue';
import AutoModal from './components/AutoModal.vue';
import DisIntervention from './components/Disintervention.vue';
import PopoverWrap from './components/PopoverWrap.vue';
import useManualCell from '../hooks/useManualCell';

const emit = defineEmits(['tableInit', 'cancel']);

const props = defineProps({
    selectedList: {
        type: Array,
        default: () => []
    },
    btnList: {
        type: Array,
        default: () => []
    },
    // 设备列表类型
    runningMonitorType: {
        type: String,
        default: ''
    }
});

const popoverModalBG = inject('popoverModalBG');
const clearChecked = inject('clearChecked');
const objectIds = computed(() => props.selectedList.map(res => res.objectId));
const { modalType, save, showModal, closePop } = useManualCell(props, emit);
</script>
<style lang="less" scoped>
.selected-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: -52px;
    height: 48px;
    border-radius: 4px;
    z-index: 55;
    border: 1px solid #64a6f7;
    background: #d9ebff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    box-shadow: 0px 22px 40px 0px rgba(98, 108, 120, 0.08), 0px 14px 26px 0px rgba(98, 108, 120, 0.04), 0px 0px 4px 0px rgba(98, 108, 120, 0.15);
    .left {
        color: var(--gray-600, #626c78);
        display: flex;
        align-items: center;
        font-family: 'PingFang SC';
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px; /* 157.143% */
        .number {
            color: var(--gray-900, #1b2129);
            font-family: 'PingFang SC';
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            margin: 0 2px;
        }
        .split {
            width: 1px;
            background: var(--gray-400, #c4c9cf);
            height: 20px;
            display: inline-block;
        }
    }
    .middle {
        flex: 1;
        min-width: 0;
        overflow: hidden;
    }
    .right {
        margin-left: 12px;
        .cancel-text {
            color: var(--gray-600, #626c78);
            text-align: center;
            font-feature-settings: 'clig' off, 'liga' off;

            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
        }
    }
}
</style>
