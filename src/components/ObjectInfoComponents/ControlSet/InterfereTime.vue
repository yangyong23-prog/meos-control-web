<template>
    <div class="control-item-time fs12">
        {{ dayjs(time).format('YYYY.MM.DD HH:mm') }} {{ text }}&nbsp;&nbsp;
        <m-popconfirm
            v-if="isEdge() && !disabled"
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
        <m-tips v-else-if="disabled" theme="darkTransparent" :content="disabledText" placement="top">
            <span class="link-text disabled">{{ i18n.global.t('meos_control_web.release_intervention') }}</span>
        </m-tips>
        <m-tips v-else theme="darkTransparent" :content="i18n.global.t('meos_control_web.cloud_platform_control_not_supported_please_use_edge')" placement="top">
            <span class="link-text disabled">{{ i18n.global.t('meos_control_web.release_intervention') }}</span>
        </m-tips>
    </div>
</template>

<script setup>
import { changeManualAutoStatusByObjectId, commandExecuteChangeManualAutoStatus, commandExecuteReleaseIntervention, releaseIntervention } from '@/apis/common';
import { isEdge } from '@/utils/envUtils';
import { CONTROL_API_TYPE, GET_MENU_CONFIG, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import dayjs from 'dayjs';
import i18n from '@/localization';

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
    disabled: {
        type: Boolean,
        default: false
    },
    disabledText: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
    }
});

const releaseInterventionFun = () => {
    let axiosFn = ['manualAutoSet', 'manualAutoStatus'].includes(props.data.infoCode) ? changeManualAutoStatusByObjectId : releaseIntervention,
        params = {
            objectIds: [props.data.objectId],
            infoCode: props.data.infoCode,
            content: ''
        };
    // 判断是否使用新的控制API
    if (window[GET_MENU_CONFIG]?.()?.CONTROL_API_TYPE === CONTROL_API_TYPE.new) {
        axiosFn = ['manualAutoSet', 'manualAutoStatus'].includes(params.infoCode) ? commandExecuteChangeManualAutoStatus : commandExecuteReleaseIntervention;
    }
    if (props.systemId) {
        params.systemId = props.systemId;
    }
    // 手自动没有解除干预说法，直接切换状态
    if (['manualAutoSet', 'manualAutoStatus'].includes(props.data.infoCode)) {
        params = {
            objectIds: [props.data.objectId],
            model: '1',
            operateReason: ''
        };
        if (window[GET_MENU_CONFIG]?.()?.CONTROL_API_TYPE === CONTROL_API_TYPE.new) {
            params = {
                objectIds: [props.data.objectId],
                infoValue: '1',
                content: '',
                expireTime: ''
            };
            if (props.systemId) {
                params.systemId = props.systemId;
            }
        }
    }
    axiosFn(params).then(res => {
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
</script>
<style lang="less" scoped>
.control-item-time {
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
