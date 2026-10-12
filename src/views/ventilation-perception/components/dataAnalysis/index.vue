<template>
    <div class="data-analysis">
        <Item v-if="staticsInfo?.sendFan?.total > 0" :data="staticsInfo.sendFan" :name="i18n.global.t('meos_control_web.supply_fan')" :idnex="0"></Item>
        <Item v-if="staticsInfo?.receiveFan?.total > 0" :data="staticsInfo.receiveFan" :name="i18n.global.t('meos_control_web.exhaust_fan')" :idnex="1"></Item>
    </div>
</template>
<script setup>
import useStaticData from '@/views/ventilation-perception/hooks/useVentStaticData';
import { MLoading } from 'meri-plus';
import Item from './item.vue';
const { staticsInfo, staticsLoading } = useStaticData();
const Mloading = ref(null);
watch(
    () => staticsLoading.value,
    curLoading => {
        Mloading.value?.destroy?.();
        if (curLoading) {
            Mloading.value = MLoading.service({
                target: '.data-analysis-container',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            Mloading.value?.destroy?.();
        }
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.data-analysis {
    height: 100%;
    padding-inline: 16px;
    &-item {
        border-radius: 4px;
        border: 1px solid var(--gray-200, #e8ecf0);
        padding: 12px;
    }
    .left-icon {
        border-radius: 8px;
        background: var(--turquoise-50, #e6fcf7);
        padding: 9px;
    }
    .legend-bar {
        height: 5px;
        background: #e8ecf0;
        .bar-item {
            height: 100%;
            // border-radius: 2px;
        }
    }
    .flex-gap {
        gap: 16px;
    }
    .statistics-buttom {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        .statistics {
            border-radius: 4px;
            background: var(--gray-50, #f7f9fa);
            padding: 4px;
        }
    }
}
.mark-icon {
    display: inline-block;
    width: 44px;
    height: 44px;
}
</style>
