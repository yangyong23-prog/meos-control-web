<template>
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="show"
        :title="i18n.global.t('meos_control_web.system_parameter_setting')"
        :shadow="true"
        :shadow-click="true"
        width="480px"
        :z-index="useZIndex().nextZIndex()"
        :drawer-class="`system-drawer noIframe`"
        @close="close"
    >
        <template #content>
            <div v-if="runSet.length" class="params-set">
                <div class="params-set-title fc">{{ i18n.global.t('meos_control_web.parameter_setting') }}</div>
                <div v-for="item in runSet" :key="item.infoCode" class="params-set-item">
                    <div style="width: 260px">
                        <SystemForm :current-info-code-object="item" :expire-time="expireTime" @close="close" />
                    </div>
                </div>
            </div>
            <div class="auto-set">
                <div class="params-set-title fc">{{ i18n.global.t('meos_control_web.manual_auto_settings') }}</div>
                <div style="padding-left: 8px">
                    <SystemAutoSet @close="close" />
                </div>
            </div>
            <div v-if="automaticResetArr?.length" class="mb24">
                <div class="params-set-title fc mb4">{{ i18n.global.t('meos_control_web.auto_control_cum_runtime_reset') }}</div>
                <div v-for="(item, index) in automaticResetArr" :key="index" style="padding-top: 8px">
                    <AutomaticReset :data="item" />
                </div>
            </div>
        </template>
    </m-drawer>
</template>

<script setup>
import i18n from '@/localization';
import { useZIndex } from 'meri-plus';
import SystemForm from './SystemForm.vue';
import SystemAutoSet from '../../common/SystemAutoSet.vue';
import AutomaticReset from '../../coldRunSet/AutomaticReset.vue';
defineProps({
    automaticResetArr: {
        type: Array,
        default: () => []
    },
    runSet: {
        type: Array,
        default: () => []
    },
    hotCoolModel: String,
    expireTime: String
});
const show = ref(false);
const emits = defineEmits(['close', 'cancel']);
const close = () => {
    show.value = false;
    const header = document.querySelector('.layout-header.fcb');
    if (header) {
        header.style.zIndex = 2;
    }
    nextTick(() => {
        emits('close');
    });
};
onMounted(() => {
    show.value = true;
    nextTick(() => {
        const header = document.querySelector('.layout-header.fcb');
        if (header) {
            header.style.zIndex = useZIndex().nextZIndex();
        }
    });
});
</script>
<style lang="less" scoped>
.params-set {
    margin-top: 20px;
    &-title {
        height: 24px;
        position: relative;
        text-indent: 8px;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 700;
        &::after {
            content: '';
            height: 14px;
            width: 3px;
            background-color: var(--blue-500);
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    &-item {
        padding-left: 8px;
        & + .params-set-item {
            padding-top: 24px;
            margin-top: 24px;
            border-top: 1px solid var(--gray-300);
        }
    }
}
.auto-set {
    margin-top: 24px;
    margin-bottom: 24px;
}
</style>
<style lang="less">
.system-drawer {
    .m-drawer-mask {
        background-color: transparent;
    }
    .m-drawer-container-content {
        width: 100%;
    }
}
</style>
