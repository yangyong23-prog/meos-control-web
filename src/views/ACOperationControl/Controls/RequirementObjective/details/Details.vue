<template>
    <div class="config-details-box">
        <BasicInfo :object-setting="objectSetting" :object-parent-setting="objectParentSetting" />
        <div class="tem-co2">
            <TemStandard :object-setting="objectSetting" :object-parent-setting="objectParentSetting" />
            <CO2Standard :object-setting="objectSetting" :object-parent-setting="objectParentSetting" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType, Ref } from 'vue';
import BasicInfo from './BasicInfo.vue';
import CO2Standard from './CO2Standard.vue';
import TemStandard from './TemStandard.vue';
import { ObjectSetting } from '../types';
defineProps({
    objectSetting: {
        type: Object as PropType<ObjectSetting>,
        default: () => ({})
    },
    objectParentSetting: {
        type: Object as PropType<ObjectSetting>,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.config-details-box {
    :deep(.box-item-title) {
        padding-left: 12px;
        margin-top: 20px;
        position: relative;
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        &::after {
            position: absolute;
            top: 4px;
            left: 0;
            width: 3px;
            height: 14px;
            background: var(--blue-500, #246fe5);
            content: '';
        }
    }
}
</style>
