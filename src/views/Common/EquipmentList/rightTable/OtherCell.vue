<template>
    <m-tips theme="darkTransparent" placement="top" trigger="hover" :content="tipsContent" :disabled="!tipsContent">
        <div class="parameter-determination-wrap" :class="{ disabled: disabled }">
            <PopoverWrap :disabled="disabled" placement="bottom" :visible="visible && popoverModalBG">
                <template #content>
                    <!-- 解除干预 -->
                    <DisIntervention
                        v-if="secondKey === 'disIntervention'"
                        :object-ids="objectIds"
                        :info-code="data?.relInfoCodeConfig?.infoCode"
                        @cancel="closePop"
                        @save="save"
                    ></DisIntervention>
                    <!-- 干预状态下的手自动 -->
                    <ModifyTimeOrParameter
                        v-else-if="secondKey === 'editTime'"
                        :model="model"
                        :data="data"
                        :second-key="secondKey"
                        :btn-list="btnList"
                        :object-ids="objectIds"
                        @cancel="closePop"
                        @save="save"
                    ></ModifyTimeOrParameter>
                </template>
                <div class="intervened-options">
                    <m-dropdown :options="IntervenedOptions" :disabled="disabled" trigger="click" @change="changeDropdown">
                        {{ i18n.global.t('common.intervention') }}<IconMeriComponentArrowDown size="12" color="#1B4ACC" />
                    </m-dropdown>
                </div>
            </PopoverWrap>
        </div>
    </m-tips>
</template>
<script setup>
import i18n from '@/localization';
import DisIntervention from './components/Disintervention.vue';
import ModifyTimeOrParameter from './components/ModifyTimeOrParameter.vue';
import PopoverWrap from './components/PopoverWrap.vue';
import { IconMeriComponentArrowDown } from 'meri-icon';
import { getFormatDate } from '../utils';

const popoverModalBG = inject('popoverModalBG');

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    model: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    btnList: {
        type: Array,
        default: () => []
    },
    objectIds: {
        type: Array,
        default: () => []
    },
    autoRecoveryDateTime: {
        type: String,
        default: ''
    }
});
const emit = defineEmits('tableInit');

const IntervenedOptions = ref([
    {
        label: i18n.global.t('meos_control_web.modify_deadline'),
        key: 'editTime'
    },
    {
        label: i18n.global.t('meos_control_web.release_intervention'),
        key: 'disIntervention'
    }
]);
const secondKey = ref('');

const changeDropdown = data => {
    secondKey.value = data;
    visible.value = true;
    popoverModalBG.value = true;
};
const save = () => {
    closePop();
    emit('tableInit');
};

watch(popoverModalBG, v => {
    if (!v) {
        secondKey.value = '';
    }
});

const visible = ref(false);

// # 关闭全局弹框
const closePop = () => {
    visible.value = false;
    secondKey.value = '';
    popoverModalBG.value = false;
};

// #禁用状态
const disabled = computed(() => props.disabled);

// #干预状态
const isIntervened = computed(() => props.data?.relInfoCodeConfig?.additionalMapValue?.recoveryDateTime);

// #tips 提示内容
const tipsContent = computed(() => {
    if (disabled.value) return i18n.global.t('meos_control_web.equipment_offline_local_no_control_dup');
    // 是否被干预
    if (isIntervened.value)
        return i18n.global.t('meos_control_web.time_end_interrupt', { time: getFormatDate(props.data?.relInfoCodeConfig?.additionalMapValue?.recoveryDateTime) });
    return '';
});
</script>
<style lang="less" scoped>
.menu-item-wrap {
    padding: 8px 4px;
    div {
        display: flex;
        padding: 9px 8px;
        align-items: flex-start;
        color: #1b2129;

        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        cursor: pointer;
        line-height: 22px;
        &:hover {
            border-radius: 4px;
            background: var(--grey-40003, rgba(196, 201, 207, 0.3));
        }
    }
}
.parameter-determination-wrap {
    user-select: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    .top-title {
        color: #1b2129;

        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
    .intervened-options {
        width: 38px;
        height: 20px;
        display: flex;
        padding-left: 2px;
        border-radius: 2px;

        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        background: #d9ebff;
        color: #1b4acc;
        align-items: center;
        &:hover {
            background: #9fc9fb;
        }
        :deep(.dropdown-text) {
            height: 20px;
            padding: 0;
        }
    }
    &.disabled {
        cursor: not-allowed;
        .bottom-title {
            color: var(--gray-400, #c4c9cf);
        }
    }
}
</style>
