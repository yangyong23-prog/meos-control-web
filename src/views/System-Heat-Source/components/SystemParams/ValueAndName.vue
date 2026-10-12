<template>
    <m-popover v-if="data.dataValue && data.infoCodeType == IOT_RUNNING" :enterable="false" theme="darkTransparent" :show-arrow="false">
        <template #content>
            <p v-if="data.dataTime" style="font-size: 14px">
                {{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ dayjs(data.dataTime).format('YYYY.MM.DD HH:mm:ss') }}
            </p>
            <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
        </template>
        <div class="info-item-value is-click fc" @click="itemInfo(data)">{{ getValueStr(data).text }}</div>
    </m-popover>
    <div v-else class="info-item-value fc">{{ getValueStr(data).text }}</div>
    <div v-ellipsis class="info-item-name m-ellipsis">{{ item.infoCodeName }}</div>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { getValueStr } from '@/utils/tools';
import dayjs from 'dayjs';
import { jumpToAnalysis } from '@/utils/envUtils';
import { IOT_RUNNING } from '@/utils/globalVariables';

const { getIotData } = DockSingleton.getInstance();

const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    },
    systemId: {
        type: String,
        default: ''
    }
});
const data = computed(() => {
    return getIotData(props.systemId, props.item.infoCode);
});
const itemInfo = item => {
    const jumpParams = {
        infoCode: item.infoCode,
        id: props.systemId
    };
    jumpToAnalysis(jumpParams);
};
</script>
<style lang="less" scoped>
.info-item-value {
    height: 22px;
    &.is-click {
        cursor: pointer;
        color: var(--blue-500);
    }
}
.info-item-name {
    height: 22px;
    line-height: 22px;
    color: var(--gray-600);
}
</style>
