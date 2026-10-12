<template>
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="show"
        :title="i18n.global.t('meos_control_web.system_settings')"
        :shadow="true"
        :shadow-click="true"
        width="480px"
        :drawer-class="`hot-system-drawer noIframe`"
        :z-index="Z_INDEX.commonDrawer"
        @close="close"
    >
        <template #content>
            <div class="drawer-loading-container">
                <div v-if="runSet?.length" class="mb24">
                    <div class="params-set-title fc mb16">{{ i18n.global.t('meos_control_web.parameter_setting') }}</div>
                    <div v-for="(item, index) in runSet" :key="index">
                        <SystemForm :current-info-code-object="item" @close="close" />
                    </div>
                </div>
                <div class="params-set-title fc">{{ i18n.global.t('meos_control_web.manual_auto_settings') }}</div>
                <SystemAutoSet :type-status="'HeatSource'" @close="close" />
                <div v-if="automaticResetArr?.length" class="mb24 mt24">
                    <div class="params-set-title fc mb4">{{ i18n.global.t('meos_control_web.auto_control_cum_runtime_reset') }}</div>
                    <div v-for="(item, index) in automaticResetArr" :key="index" style="padding-top: 8px">
                        <AutomaticReset :data="item" />
                    </div>
                </div>
            </div>
        </template>
    </m-drawer>
</template>

<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import SystemForm from './SystemForm.vue';
import SystemAutoSet from '../../common/SystemAutoSet.vue';
import AutomaticReset from '../../coldRunSet/AutomaticReset.vue';
defineProps({
    runSet: {
        type: Array,
        default: () => []
    },
    automaticResetArr: {
        type: Array,
        default: () => []
    }
});
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
    // openLoading();
});
provide('equiptype', 'heatSource');
</script>
<style lang="less" scoped>
.drawer-loading-container {
    min-height: 100%;
    .form-item {
        padding: 8px 12px;
        border-radius: 4px;
        background: var(--gray-50, #f7f9fa);
        .name {
            &::before {
                display: inline-block;
                position: absolute;
                width: 7px;
                right: -8px;
                content: '*';
                color: #f55047;
                font-size: 10px;
            }
        }
    }
}
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
.hot-system-drawer {
    .m-drawer-mask {
        background-color: transparent;
    }
    .m-drawer-container-content {
        width: 100%;
        padding: 16px 20px;
    }
}
</style>
