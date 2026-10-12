<template>
    <div class="control-set-value fcb">
        <div class="fcb control-set-value-text">
            <div class="fc">
                <div class="fc">
                    <span style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.actual_value_colon') }}</span>
                    <div>{{ getSetValueAndActualValue(controlItem).actualText }}</div>
                </div>
                <div v-if="controlItem.infoCode === 'chillerNum' && hasControls">
                    <m-popover placement="bottom" width="200px">
                        <template #content>
                            <div style="display: flex; flex-direction: column; gap: 16px">
                                <div style="font-weight: 700">{{ i18n.global.t('meos_control_web.cooling_station_operating_units') }}</div>
                                <div>
                                    <span style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.auto_setpoint_colon') }}</span>
                                    <template v-if="!isSizingMachine">
                                        {{ controlItem.runStatus ? controlItem.autoSetChillerNum.large_cooler : '--' }} {{ i18n.global.t('common.large')
                                        }}{{ controlItem.runStatus ? controlItem.autoSetChillerNum.small_cooler : '--' }}
                                        {{ i18n.global.t('common.small') }}
                                    </template>
                                    <template v-else>{{ controlItem.runStatus ? controlItem.autoSetChillerNum.large_cooler : '--' }} {{ i18n.global.t('common.tai') }}</template>
                                </div>
                                <div>
                                    <span style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.auto_feedback_value_colon') }}</span>
                                    <template v-if="!isSizingMachine">
                                        {{ controlItem.runStatus ? controlItem.feedbackChillerNum.large_cooler : '--' }} {{ i18n.global.t('common.large')
                                        }}{{ controlItem.runStatus ? controlItem.feedbackChillerNum.small_cooler : '--' }}
                                        {{ i18n.global.t('common.small') }}
                                    </template>
                                    <template v-else>{{ controlItem.runStatus ? controlItem.feedbackChillerNum.large_cooler : '--' }} {{ i18n.global.t('common.tai') }}</template>
                                </div>
                            </div>
                        </template>
                        <div class="fcc" style="margin-left: 8px">
                            <SvgIcon name="info-gray" />
                        </div>
                    </m-popover>
                </div>
            </div>
            <template v-if="hasControls">
                <div class="fc" :style="{ width: settingValueWidth }">
                    <span style="color: var(--gray-600); min-width: 56px">{{ i18n.global.t('meos_control_web.setpoint_value_colon') }}</span>
                    <span v-ellipsis class="m-ellipsis">
                        {{ getSetValueAndActualValue(controlItem).text }}
                    </span>
                </div>
            </template>
            <template v-else>
                <div v-if="controlItem.infoCode !== 'chillerNum'" class="fc" :style="{ width: settingValueWidth }">
                    <span style="color: var(--gray-600); min-width: 56px">{{ i18n.global.t('meos_control_web.setpoint_value_colon') }}</span>
                    <div v-ellipsis class="m-ellipsis">
                        {{ getSetValueAndActualValue(controlItem).text }}
                    </div>
                </div>
            </template>
        </div>
        <div>
            <SetBtn :control-item="controlItem" :content="content" />
        </div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { getSetValueAndActualValue } from '@/utils/tools';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { IOTObject } from '../types';
import { PropType } from 'vue';
import SetBtn from './SetBtn.vue';
defineProps({
    controlItem: {
        type: Object as PropType<IOTObject>,
        default: () => ({})
    },
    content: {
        type: String,
        required: true
    },
    actualValueWidth: {
        type: String,
        default: '150px'
    },
    settingValueWidth: {
        type: String,
        default: '130px'
    }
});
const hasControls = inject('hasControls');
const isSizingMachine = inject('isSizingMachine');
</script>
<style lang="less" scoped>
.control-set-value {
    height: 32px;
    &-text {
        flex: 1;
        margin-right: 0px;
        span {
            white-space: nowrap;
        }
    }
}
</style>
