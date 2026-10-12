<template>
    <div class="co2-bar box-line fcc">
        <div class="box-line-view fc">
            <div v-for="item in list" :key="item.key" class="view-item">
                <div class="fcb h100 view-item-box">
                    <div style="color: var(--gray-600)">{{ item.name }}</div>
                    <div class="get-line-white"></div>
                    <div>{{ obj?.[item.key] }}ppm</div>
                </div>
            </div>
        </div>
        <div class="temperature-bar"></div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
defineProps({
    obj: {
        type: Object,
        default: () => {}
    },
    isDet: {
        type: Boolean,
        default: false
    }
});
const list = ref([
    {
        name: i18n.global.t('meos_control_web.co2_comfort_zone_upper_limit'),
        key: 'carbonDioxideLimitValue'
    },
    {
        name: i18n.global.t('meos_control_web.co2_high_threshold'),
        key: 'carbonDioxideUpperLimitValue'
    }
]);
</script>
<style lang="less" scoped>
.co2-bar {
    height: 100%;
}
.box-line {
    position: relative;
    &-view {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 2;
        .view-item {
            display: flex;
            width: 50%;
            height: 100%;
            &-box {
                flex-direction: column;
            }
        }
    }
}
.temperature-bar {
    width: 100%;
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(90deg, #8edbab 0%, #8edbab 15.12%, #f55047 61.84%);
    position: relative;
}
.get-line-white {
    height: 12px;
    width: 2px;
    background-color: white;
    border-radius: 4px;
}
</style>
