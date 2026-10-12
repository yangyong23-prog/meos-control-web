<template>
    <div class="control-set-value fcb">
        <div class="fcb control-set-value-text">
            <div class="fc">
                <div class="fc">
                    <span style="color: var(--gray-600); width: 60px">{{ i18n.global.t('meos_control_web.actual_value_colon') }}</span>
                    <div>{{ getSetValueAndActualValue(controlItem).actualText }}</div>
                </div>
            </div>
            <template v-if="hasControls">
                <div class="fc" :style="{ width: settingValueWidth }">
                    <span style="color: var(--gray-600); min-width: 56px">{{ i18n.global.t('meos_control_web.setpoint_value_colon') }}</span>
                    <div v-ellipsis class="m-ellipsis">
                        {{ getSetValueAndActualValue(controlItem).text }}
                    </div>
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
        <div v-if="base.hasAuth('coolhotsyseqcontrol')">
            <SetBtn :control-item="controlItem" :content="content" />
        </div>
        <!-- <div>
            <SetBtn :control-item="controlItem" :content="content" />
        </div> -->
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getSetValueAndActualValue } from '@/utils/tools';
import baseStore from '@/store/baseStore';
import SetBtn from './SetBtn.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
const hasControls = inject('hasControls');
const base = baseStore();
defineProps({
    controlItem: {
        type: Object,
        default: () => ({})
    },
    content: String,
    actualValueWidth: {
        type: String,
        default: '150px'
    },
    settingValueWidth: {
        type: String,
        default: '130px'
    }
});
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
