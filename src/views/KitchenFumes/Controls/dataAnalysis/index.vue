<template>
    <div class="data-analysis">
        <div v-if="isEmpty" class="nodata">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
        </div>
        <template v-else>
            <Item v-if="staticsInfo.rangeHoodFan" :data="staticsInfo.rangeHoodFan" :name="i18n.global.t('meos_control_web.kitchen_exhaust_fan')" :item-idnex="0"></Item>
            <Item v-if="staticsInfo.supplementalFans" :data="staticsInfo.supplementalFans" :name="i18n.global.t('meos_control_web.make_up_air_unit')" :item-idnex="1"></Item>
            <Item v-if="staticsInfo.oilFumePurifiers" :data="staticsInfo.oilFumePurifiers" :name="i18n.global.t('meos_control_web.oil_fume_purifier')" :item-idnex="2"></Item>
        </template>
    </div>
</template>
<script setup>
import useStaticData from '@/views/KitchenFumes/hooks/useStaticData';
import { MLoading } from 'meri-plus';
import Item from './item.vue';
import i18n from '@/localization';

const { staticsInfo, staticsLoading } = useStaticData();

const isEmpty = computed(() => {
    return !staticsInfo.value?.rangeHoodFan && !staticsInfo.value?.supplementalFans && !staticsInfo.value?.oilFumePurifiers;
});
const Mloading = ref(null);
watch(
    () => staticsLoading.value,
    () => {
        Mloading.value?.destroy()?.();
        if (staticsLoading.value) {
            Mloading.value = MLoading.service({
                target: '.data-statistics',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            Mloading.value?.destroy()?.();
        }
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.data-analysis {
    height: 100%;

    .nodata {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
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
