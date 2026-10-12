<template>
    <div class="control-item-time fs12">
        {{ dayjs(time).format('YYYY.MM.DD HH:mm') }} {{ text }}&nbsp;&nbsp;
        <m-popconfirm
            v-if="isEdge() && baseStore().hasAuth(props.permission)"
            :content="i18n.global.t('meos_control_web.confirm_release_intervention_dup')"
            status="primary"
            placement="bottom-end"
            :cancel-button-text="i18n.global.t('common.cancel')"
            :confirm-button-text="i18n.global.t('common.confirm')"
            style="--m-popover-padding: 20px; --m-popover-border-radius: 8px"
            width="316px"
            @confirm="releaseInterventionFun"
            @show="showTip"
            @hide="hideTip"
        >
            <span class="link-text" :class="{ 'is-active': show }" @click.stop="() => {}">{{ i18n.global.t('meos_control_web.release_intervention') }}</span>
        </m-popconfirm>
        <m-tips v-else theme="darkTransparent" :content="disabledTip()" placement="top">
            <span class="link-text disabled">{{ i18n.global.t('meos_control_web.release_intervention') }}</span>
        </m-tips>
    </div>
</template>

<script setup>
import { releaseIntervention } from '@/apis/ACAC';
import { isEdge } from '@/utils/envUtils';
import { GET_MENU_CONFIG, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import dayjs from 'dayjs';
import i18n from '@/localization';
import baseStore from '@/store/baseStore';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    time: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: i18n.global.t('meos_control_web.end_manual_intervention')
    },
    releaseInterventionFun: Function,
    systemId: {
        type: String,
        default: ''
    },
    consoleTypes: {
        type: String,
        default: ''
    },
    systemType: {
        type: String,
        default: ''
    },
    permission: {
        type: String,
        default: () => window[GET_MENU_CONFIG]().PERMISSION || ''
    }
});

const releaseInterventionFun = () => {
    if (props.releaseInterventionFun) {
        props.releaseInterventionFun({
            infoCode: props.data.infoCode,
            objectId: props.data.id,
            systemId: props.systemId
        });
        return;
    }
    if (props.data.unitsNumberSetValue) {
        // 处理单位数量设置的逻辑
        props.data.unitsNumberSetValue.forEach(item => {
            releaseIntervention({
                infoCode: item.infoCode,
                consoleTypes: props.consoleTypes,
                systemType: props.systemType,
                objectId: props.data.id,
                systemId: props.systemId
            });
        });
    }
    releaseIntervention({
        infoCode: props.data.infoCode,
        consoleTypes: props.consoleTypes,
        systemType: props.systemType,
        objectId: props.data.id,
        systemId: props.systemId
    }).then(res => {
        if (res.code === SUCCESSCODE) {
            useSuccessMessage();
        }
    });
};
const show = ref(false);
const showTip = () => {
    show.value = true;
};
const hideTip = () => {
    show.value = false;
};
const disabledTip = () => {
    if (!baseStore().hasAuth(props.permission)) {
        return i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');
    }
    if (!isEdge()) {
        return i18n.global.t('meos_control_web.cloud_platform_control_not_supported_please_use_edge');
    }
};
</script>
<style lang="less" scoped>
.control-item-time {
    padding-left: 36px;
    color: var(--gray-600);
    .link-text.disabled {
        color: var(--gray-400);
        cursor: not-allowed;
    }
    .link-text.is-active {
        color: var(--blue-700);
    }
}
</style>
