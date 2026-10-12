<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        :escable="false"
        type="default"
        modal-class-name="fail-feedback-loops-modal"
        :title="`${i18n.global.t('meos_control_web.failed_circuit_detail')}`"
        :width="600"
        :need-scrollbar="true"
        :footer="false"
        @close="close"
    >
        <template #content>
            <template v-for="loop in props.loopsData" :key="loop.circuitId">
                <div class="loop-wrap">
                    <div class="loop-title">{{ loop.circuitName ?? '--' }}</div>
                    <div class="loop-desc">
                        <div v-for="space in loop.spaceConfigs" :key="space.spaceId" class="loop-row">
                            {{ renderRow(space) }}
                        </div>
                    </div>
                </div>
            </template>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    loopsData: {
        type: Array,
        default: () => []
    }
});

const emits = defineEmits(['close']);
const show = defineModel('show', { type: Boolean, default: false });

const renderRow = space => {
    const { underOutdoorIlluminance, underDuration, overtopOutdoorIlluminance, overtopDuration } = space.feedbackAdjustSetting || {};
    const hasUnder = underOutdoorIlluminance != null && underDuration != null;
    const hasUpper = overtopOutdoorIlluminance != null && overtopDuration != null;

    const preFix = i18n.global.t('meos_control_web.config_in_space', { spaceName: space.spaceName });
    const underString = hasUnder ? i18n.global.t('meos_control_web.auto_on_condition_desc', { underOutdoorIlluminance, underDuration }) : '';
    const upperString = hasUpper ? i18n.global.t('meos_control_web.auto_off_condition_desc', { overtopOutdoorIlluminance, overtopDuration }) : '';
    if (hasUnder && !hasUpper) {
        return `${preFix}${underString}`;
    } else if (hasUpper && !hasUnder) {
        return `${preFix}${upperString}`;
    } else {
        return `${preFix}${underString}、${upperString}`;
    }
};

const close = () => {
    emits('close');
};
</script>
<style lang="less">
.fail-feedback-loops-modal.m-modal-bg {
    .loop-wrap {
        display: flex;
        flex-direction: column;
        gap: 8px;
        & + .loop-wrap {
            margin-top: 12px;
        }
    }
    .loop-title {
        color: #1b2129;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
    }
    .loop-desc {
        display: flex;
        flex-direction: column;
        gap: 8px;

        color: #1b2129;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
    }
}
</style>
