<template>
    <div class="switch-ai-container">
        <ShellConfigAiSvg />
        <div class="row-flex">
            <span class="text">{{ i18n.global.t('meos_control_web.ai_algorithm_settings') }}</span>
            <m-switch v-model="aiSwitch" class="switch" @click="changeAiSwitch"></m-switch>
        </div>

        <m-tips :content="i18n.global.t('meos_control_web.ai_calc_results_enabled')" theme="darkTransparent" placement="bottom">
            <IconMeriComponentDialogLinear size="16" color="#626C78" />
        </m-tips>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ShellConfigAiSvg from '@/assets/svg/shell-config-ai.svg';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import useSwitchHeader from '../hooks/useSwitchHeader';

const { spaceSwitch, changeSpaceSwitch, coolSwitch, changeCoolSwitch, acPumpSwitch, changeAcPumpSwitch, aiSwitch, changeAiSwitch } = useSwitchHeader();
</script>

<style scoped lang="less">
.switch-left-container {
    display: flex;
    height: 32px;
    padding: 4px 12px 4px 8px;
    align-items: center;
    border-radius: 4px;
    background: rgba(19, 167, 242, 0.12);

    margin-right: 12px;
    gap: 8px;
}
.switch-ai-container {
    display: flex;
    height: 32px;
    padding: 4px 12px 4px 8px;
    align-items: center;

    border-radius: 4px;
    background: rgba(19, 167, 242, 0.12);
    margin-right: 12px;
    gap: 4px;
    white-space: nowrap;
}

.divider {
    width: 1px;
    height: 13px;
    background: #b6ddf3;
}
.text {
    // font-family: Microsoft YaHei UI;
    font-size: 14px;
    font-weight: 700;
    background: linear-gradient(90deg, #246fe5 1.19%, #11abf3 77.48%, #00b7d0 101.98%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.row-flex {
    display: flex;
    align-items: center;
    column-gap: 4px;
}
</style>
