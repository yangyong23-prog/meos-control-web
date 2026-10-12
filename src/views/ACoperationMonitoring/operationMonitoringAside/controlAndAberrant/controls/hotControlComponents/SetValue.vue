<template>
    <div class="control-set-value fcb">
        <div class="fcb control-set-value-text">
            <div class="fc" :style="{ width: actualValueWidth }">
                <span style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.actual_value_colon') }}</span>
                {{ getSetValueAndActualValue(controlItem).actualText }}
            </div>
            <div v-ellipsis="{ title: getSetValueAndActualValue(controlItem).text }" :style="{ width: settingValueWidth }" class="m-ellipsis">
                <span style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.setpoint_value_colon') }}</span>
                {{ getSetValueAndActualValue(controlItem).text }}
            </div>
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
