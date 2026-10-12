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
import { isEdge } from '@/utils/envUtils';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import dayjs from 'dayjs';
import i18n from '@/localization';
import { useGeneralControl } from '@/hooks/useGeneralControl';

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
const { releaseIntervention } = useGeneralControl();

const releaseInterventionFun = () => {
    releaseIntervention(
        {
            objectIds: [props.data.objectId],
            infoCode: props.data.infoCode,
            systemId: props.systemId,
            content: ''
        },
        res => {
            const { code } = res;
            if (code === SUCCESSCODE) {
                useSuccessMessage();
            }
        }
    );
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
