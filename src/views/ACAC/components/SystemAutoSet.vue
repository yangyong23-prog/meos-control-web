<template>
    <m-radio-group v-model="params.model">
        <div class="radio-box">
            <m-tips v-for="item in list" :key="item.model" theme="darkTransparent" :disabled="!isBtnDisabled" :content="disabledTips" placement="top">
                <div class="radio-box-item" :class="{ 'is-active': params.model === item.model, 'is-disabled': !baseStore().hasAuth(PERMISSION) }">
                    <m-radio :disabled="isBtnDisabled" :label="item.model">{{ item.name }}</m-radio>
                    <p v-if="!isBtnDisabled" @click="params.model = item.model">{{ item.explain }}</p>
                    <p v-else>{{ item.explain }}</p>
                </div>
            </m-tips>
        </div>
    </m-radio-group>
    <EquipmentAutoSet v-if="showAutoControl" :model="params.model" @close="close" @error-fun="errorFun" />
    <ErrorList v-if="showErrorList" :error-list="errorList" @close="showErrorList = false" />
</template>

<script setup>
import i18n from '@/localization';
import EquipmentAutoSet from './EquipmentAutoSet.vue';
import { $Message } from 'meri-plus';
import ErrorList from './ErrorList.vue';
import baseStore from '@/store/baseStore';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import { isEdge } from '@/utils/envUtils';
const PERMISSION = window[GET_MENU_CONFIG]?.().PERMISSION;
const showErrorList = ref(false);
const errorList = ref([]);
const emits = defineEmits(['close']);
const showAutoControl = ref(false);
const oldModel = ref('');
const params = ref({
    model: oldModel.value,
    expireTime: '',
    operateType: '',
    operateReason: '',
    contentInfo: ''
});

const list = ref([
    { name: i18n.global.t('meos_control_web.one_click_auto'), model: '1', explain: i18n.global.t('meos_control_web.after_selection_all_equipment_automatic_control_by_system') },
    {
        name: i18n.global.t('meos_control_web.one_click_manual'),
        model: '0',
        explain: i18n.global.t('meos_control_web.after_selection_all_equipment_manual_control_system_stops_auto_adjustment')
    }
]);
const close = () => {
    showAutoControl.value = false;
    params.value.model = '';
};
const curModel = ref('');
const change = () => {
    showAutoControl.value = true;
    curModel.value = params.value.model;
};
const errorFun = data => {
    $Message.error({
        title: i18n.global.t('meos_control_web.failnum_device', {
            failnum: data.failureNum
        }),
        showClose: true,
        duration: 3000,
        button: i18n.global.t('meos_control_web.view_detail'),
        buttonClick: () => {
            errorList.value = data.errorCountObject || [];
            showErrorList.value = true;
        }
    });
};
watch(
    () => params.value.model,
    () => {
        params.value.model && change();
    },
    {
        deep: true
    }
);

const isBtnDisabled = computed(() => {
    return !baseStore().hasAuth(PERMISSION) || !isEdge();
});

const disabledTips = computed(() => {
    if (!baseStore().hasAuth(PERMISSION)) {
        return i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');
    } else if (!isEdge()) {
        return i18n.global.t('meos_control_web.cloud_platform_operation_not_supported_please_use_edge');
    }
    return '';
});
</script>
<style lang="less" scoped>
.radio-box {
    width: 100%;
    &-item {
        width: 100%;
        border-radius: 4px;
        margin-top: 12px;
        padding: 16px 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        background-color: var(--gray-50);
        cursor: pointer;
        &:hover {
            background-color: var(--alpha-30);
        }
        &.is-disabled {
            background-color: #f5f7f9;
            cursor: not-allowed;
        }
        &.is-active {
            background-color: var(--blue-50);
        }

        .m-radio {
            display: flex;
            align-items: center;
            margin: 0;
            color: #1b2129;
            font-size: 14px;
            height: 22px;
            line-height: 22px;
            margin-bottom: 8px;
        }
        p {
            color: #8d9399;
            font-size: 12px;
            line-height: 18px;
            padding-left: 8px;
        }
    }
}
</style>
