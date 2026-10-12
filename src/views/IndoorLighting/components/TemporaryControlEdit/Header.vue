<template>
    <div class="header w100">
        <div class="left">
            <div class="title">{{ mainTitle }}</div>
            <div v-if="subTitle" class="sub-title">{{ subTitle }}</div>
            <m-button v-if="step === 1" type="link" size="medium" @click="switchSelType">{{ btnText }}</m-button>
        </div>
        <!-- <div class="monitoring-board-header-close fcc" @click="$emit('close')">
            <IconMeriComponentClose size="24" />
        </div> -->
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentClose } from 'meri-icon';
import { TEMP_CTL_EDIT_SELECT_TYPE } from '@/views/IndoorLighting/variables';
const props = defineProps({
    mainTitle: {
        type: String,
        default: ''
    },
    subTitle: {
        type: String,
        default: ''
    },
    step: {
        type: Number,
        default: 1
    }
});
defineEmits(['close']);
const selType = defineModel({ type: Boolean, default: false });

const btnText = computed(() => {
    return selType.value === TEMP_CTL_EDIT_SELECT_TYPE.CIRCUIT_GROUPING ? i18n.global.t('meos_control_web.switch_by_space') : i18n.global.t('meos_control_web.switch_by_group');
});
const switchSelType = () => {
    selType.value = selType.value === TEMP_CTL_EDIT_SELECT_TYPE.CIRCUIT_GROUPING ? TEMP_CTL_EDIT_SELECT_TYPE.SPACE : TEMP_CTL_EDIT_SELECT_TYPE.CIRCUIT_GROUPING;
};
</script>
<style lang="less" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
        display: flex;
        align-items: center;
    }
}
</style>
