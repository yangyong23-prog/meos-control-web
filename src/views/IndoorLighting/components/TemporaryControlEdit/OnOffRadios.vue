<template>
    <div class="on-off-radios">
        <div>{{ i18n.global.t('meos_control_web.loop_onoff_config') }}</div>
        <m-radio-group v-model="onOffSetting" @change="radioChange">
            <m-radio v-for="item in onOffSettingOpt" :key="item.id" style="--margin: 6px" :label="item.id"> {{ item.name }}</m-radio>
        </m-radio-group>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { SETTING_MODE, INFOCODE } from '../../variables';

const onOffSetting = defineModel({ type: String, default: SETTING_MODE.OPEN });
const onOffSettingOpt = [
    {
        id: SETTING_MODE.OPEN,
        name: INFOCODE.runStatus1.aliasName
    },
    {
        id: SETTING_MODE.CLOSE,
        name: INFOCODE.runStatus0.aliasName
    }
];
</script>
<style lang="less" scoped>
.on-off-radios {
    display: flex;
    height: 35px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    padding: 4px 8px;
    border-radius: 4px;
    background: var(--Grey-Grey-200, #e8ecf0);

    color: var(--Grey-Grey-600, #626c78);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
}
</style>
