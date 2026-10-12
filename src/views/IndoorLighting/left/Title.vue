<template>
    <div class="indoor-light-title fcb">
        <div class="indoor-title-text fs20 fw700">
            {{ i18n.global.t('meos_control_web.indoor_lighting') }}
            <m-tips :content="i18n.global.t('meos_control_web.i_am_hint_text')" theme="darkTransparent">
                <template #content>
                    <div>
                        <div>{{ i18n.global.t('meos_control_web.over_on_loop_demand_off_but_on') }}</div>
                        <div>{{ i18n.global.t('meos_control_web.under_open_definition') }}</div>
                        <div>{{ i18n.global.t('meos_control_web.switch_status_unknown_circuit_state_unavailable') }}</div>
                    </div>
                </template>
                <m-button type="text" size="small" style="cursor: default">
                    <template #icon>
                        <IconMeriComponentDialogLinear :size="16" :color="'#626C78'" :hover-color="'#626C78'"></IconMeriComponentDialogLinear>
                    </template>
                </m-button>
            </m-tips>
        </div>
        <div class="indoor-title-text fcc">
            <span v-show="!isNil(outdoorIlluminance.dataValue)" class="title-name">{{ i18n.global.t('meos_control_web.current_illuminance') }}</span>
            <span v-show="!isNil(outdoorIlluminance.dataValue)" class="title-value">{{ outdoorIlluminance.dataValue || '--' }}{{ outdoorIlluminance.unit }}</span>
            <m-popover v-if="lightingSidebarSensorInfoVO.length" theme="darkTransparent" placement="bottom" :show-arrow="false">
                <template #content>
                    <div v-for="value in lightingSidebarSensorInfoVO" :key="value.id" class="fcb">
                        {{ value.instanceName }} : {{ getIotData(value.id, value.infoCode).dataValue || '--' }}{{ outdoorIlluminance.unit }}
                    </div>
                </template>
                <span class="title-name link">{{ i18n.global.t('meos_control_web.Illuminance sensor') }}</span>
            </m-popover>
            <span v-show="!isNil(outdoorIlluminance.dataValue)" class="title-line">|</span>
            <span class="title-name">{{ i18n.global.t('meos_control_web.today_sunrise_time') }}</span>
            <span class="title-value">{{ formater(sunRiseAndSetData.today.sunRise) }}</span>
            <span class="title-name">{{ i18n.global.t('meos_control_web.today_sunset_time') }}</span>
            <span class="title-value">{{ formater(sunRiseAndSetData.today.sunSet) }}</span>
            <span class="title-name">{{ i18n.global.t('meos_control_web.next_day_sunrise_time') }}</span>
            <span class="title-value">{{ formater(sunRiseAndSetData.morrow.sunRise) }}</span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import DockSingleton from '@/hooks/responsiveDock';
import baseStore from '@/store/baseStore';
const { getIotData } = DockSingleton.getInstance();

defineProps({
    sunRiseAndSetData: {
        type: Object,
        default: () => ({})
    },
    lightingSidebarSensorInfoVO: {
        type: Array,
        default: () => []
    }
});
const outdoorIlluminance = computed(() => getIotData(baseStore().projectId, 'outdoorIlluminance'));
const formater = time => {
    return time ? dayjs(time).format('HH:mm') : '--';
};
</script>
<style lang="less" scoped>
.indoor-light-title {
    height: 32px;
    .indoor-title-text {
        gap: 4px;
        .title-name {
            color: var(--gray-600);
        }
        .title-value {
            font-weight: 700;
        }
        .title-line {
            color: var(--gray-400);
        }
        .link {
            cursor: default;
            color: var(--blue-500);
        }
    }
}
</style>
