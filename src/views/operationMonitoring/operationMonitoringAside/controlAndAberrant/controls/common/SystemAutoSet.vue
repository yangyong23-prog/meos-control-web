<template>
    <m-radio-group v-model="params.model" @change="change">
        <div class="radio-box">
            <m-tips
                v-for="item in list"
                :key="item.model"
                theme="darkTransparent"
                :disabled="baseStore().hasAuth(SUB_PERMISSION)"
                :content="i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding')"
                placement="top"
            >
                <div class="radio-box-item" :class="{ 'is-active': params.model === item.model, 'is-disabled': !baseStore().hasAuth(SUB_PERMISSION) }">
                    <m-radio :disabled="!baseStore().hasAuth(SUB_PERMISSION)" :label="item.model">{{ item.name }}</m-radio>
                    <p v-if="baseStore().hasAuth(SUB_PERMISSION)" @click="params.model = item.model">{{ item.explain }}</p>
                    <p v-else>{{ item.explain }}</p>
                </div>
            </m-tips>
        </div>
    </m-radio-group>
    <EquipmentAutoSet v-if="showAutoControl" :id="systemId" :model="params.model" :type="'control'" :type-status="typeStatus" @close="close" />
</template>

<script setup>
import i18n from '@/localization';
import EquipmentAutoSet from '@/views/ACoperationMonitoring/components/info/EquipmentAutoSet.vue';
import baseStore from '@/store/baseStore';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
const SUB_PERMISSION = window[GET_MENU_CONFIG]?.().SUB_PERMISSION || window[GET_MENU_CONFIG]?.().PERMISSION;
defineProps({
    typeStatus: {
        type: String,
        default: () => ''
    }
});
const emits = defineEmits(['close']);
const systemId = inject('systemId', ref(''));
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const showAutoControl = ref(false);
const oldModel = ref('');
const params = ref({
    model: oldModel.value,
    expireTime: '',
    operateType: '',
    operateReason: '',
    contentInfo: ''
});
// 一键手自动控制：
// 点击“控制台”出此中心弹窗，可设置手自动设置
// 当选择“一键自动”时，原位出现二次确认提示，如右图
// 当选择“一键手动”时，显示更多信息“结束时间、原因、备注”
// 结束时间：必填，选择到分钟的维度，仅可选择未来时间
// 原因：必填，下拉单选，可选择“运行异常手动紧急操作、设备维保或设备调试、设备故障隔离、供冷需求变化，调整设备参数、其他”
// 当切换原因选择“其他”时，显示“原因批注”字段；必填，最多可输入20字，当输入超过20字时，输入框显示“最多可支持20个字符”
// 备注：为非必填字段，备注最多可输入50字，超过50字时输入框即时标红报错提示“最多可支持50个字符”
// 点击保存成功后，页面顶部massage提示“操作成功”
// 若是一键手动保存成功后，所有设备名称前均带上「手动」标签显示

const list = ref([
    { name: i18n.global.t('meos_control_web.one_click_auto'), model: '1', explain: i18n.global.t('meos_control_web.after_selection_all_equipment_automatic_control_by_system') },
    {
        name: i18n.global.t('meos_control_web.one_click_manual'),
        model: '0',
        explain: i18n.global.t('meos_control_web.after_selection_all_equipment_manual_control_system_stops_auto_adjustment')
    }
]);
const close = type => {
    showAutoControl.value = false;
    if (type === true) {
        nextTick(() => {
            emits('close');
        });
    } else {
        params.value.model = '';
    }
};
const curModel = ref('');
const change = value => {
    showAutoControl.value = true;
    curModel.value = value;
};
provide('curModel', curModel);
</script>
<style lang="less" scoped>
.radio-box {
    width: 100%;
    &-item {
        width: 100%;
        border-radius: 4px;
        margin-top: 12px;
        padding: 16px 12px;
        border: 1px solid #e8ecf0;
        font-style: normal;
        font-weight: var(--platform-font-weight);

        &.is-active {
            border: 1px solid var(--blue-500);
            background-color: var(--blue-50);
        }
        &.is-disabled {
            background-color: #f5f7f9;
            cursor: not-allowed;
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
