<template>
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="show"
        :title="i18n.global.t('meos_control_web.system_parameter_setting')"
        :shadow="true"
        :shadow-click="true"
        width="480px"
        :drawer-class="`system-drawer noIframe`"
        :z-index="Z_INDEX.commonDrawer"
        @close="close"
    >
        <template #content>
            <m-scrollbar class="drawer-loading-container" style="padding-right: 20px">
                <!-- 冷热源 -->
                <div v-if="runSet.length" class="mb24">
                    <div class="params-set-title fc mb16">{{ i18n.global.t('meos_control_web.parameter_setting') }}</div>
                    <div v-for="(item, index) in runSet" :key="item.infoCode">
                        <SystemForm :current-info-code-object="item" @close="close" />
                        <div v-if="index < runSet.length - 1" class="params-set-line"></div>
                    </div>
                </div>
                <div v-if="pumpSetArr?.length" class="mb24">
                    <div class="params-set-title fc mb16">{{ i18n.global.t('meos_control_web.primary_secondary_pump_group_setting') }}</div>
                    <div v-for="(item, index) in pumpSetArr" :key="index" style="background-color: #f7f9fa; padding-top: 8px; border-radius: 4px">
                        <div class="ml12 fb7">{{ item.objectLocalName }}</div>
                        <PumpSetForm :current-info-code-object="item.runningPlan" :data="item" @close="close" />
                        <div v-if="index < pumpSetArr.length - 1" class="mt16"></div>
                    </div>
                </div>
                <div class="params-set-title fc">{{ i18n.global.t('meos_control_web.manual_auto_settings') }}</div>
                <SystemAutoSet @close="close" />
                <div v-if="automaticResetArr?.length" class="mt24">
                    <div class="params-set-title fc mb4">{{ i18n.global.t('meos_control_web.auto_control_cum_runtime_reset') }}</div>
                    <div v-for="(item, index) in automaticResetArr" :key="index" style="padding-top: 8px">
                        <AutomaticReset :data="item" />
                    </div>
                </div>
            </m-scrollbar>
        </template>
    </m-drawer>
</template>

<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import SystemForm from './SystemForm.vue';
import PumpSetForm from './PumpSetForm.vue';
import SystemAutoSet from '../common/SystemAutoSet.vue';
import AutomaticReset from './AutomaticReset.vue';
defineProps({
    runSet: {
        type: Array,
        default: () => []
    },
    pumpSetArr: {
        type: Array,
        default: () => []
    },
    automaticResetArr: {
        type: Array,
        default: () => []
    }
});
const openLoading = inject('openLoading');
const show = ref(false);
const emits = defineEmits(['close', 'cancel']);
const close = () => {
    show.value = false;
    nextTick(() => {
        emits('close');
    });
};
onMounted(() => {
    show.value = true;
    openLoading();
});
</script>
<style lang="less" scoped>
.params-set-title {
    color: #2e3742;
    //
    font-size: 16px;
    font-weight: 700;
    height: 24px;
    line-height: 24px;
    padding-left: 12px;
    position: relative;
    &::after {
        content: '';
        width: 3px;
        height: 14px;
        background-color: #246fe5;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
}
.params-set-line {
    height: 1px;
    margin: 16px 0;
    background: linear-gradient(to left, transparent 0%, transparent 50%, #e1e5eb 50%, #e1e5eb 100%);
    background-size: 10px 1px;
    background-repeat: repeat-x;
}
</style>
<style lang="less">
.system-drawer {
    .m-drawer-mask {
        background-color: transparent;
    }
    .m-drawer-container-content {
        width: 100%;
        padding: 16px 0px 16px 20px;
    }
}
</style>
