<template>
    <div class="temperature">
        <div :class="['temperature-item', 'mh128 w100']">
            <div style="width: 100px">{{ i18n.global.t('meos_control_web.pressure_diff_standard') }}</div>
            <div :style="{ width: '100%' }" :class="['mt40', 'box-line', 'fcc']">
                <div class="fcb f14 mb4 box-line-item">
                    <div v-for="(item, index) in itemConvert(props.data)" :key="index" :class="['fcb h64', 'flex-row']" :style="{ left: `${percentPositions[index]}` }">
                        <div v-ellipsis :class="['stand-name']">{{ item.name }}</div>
                        <div>{{ `${item.value?.toString() || '--'}Pa` }}</div>
                    </div>
                </div>
                <div class="temperature-bar"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';

const itemConvert = item => [
    { name: i18n.global.t('meos_control_web.pressure_diff_lower_limit_value'), value: item.lowerLimitValue },
    { name: i18n.global.t('meos_control_web.pressure_diff_upper_limit_value'), value: item.upperLimitValue }
];

const percentPositions = ['32%', '67%'];
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
</script>
<style lang="less" scoped>
.flex-row {
    position: absolute;
    transform: translateX(-50%);
    flex-direction: column;
}
.stand-name {
    width: 110px;
    color: #626c78;
    font-size: 14px;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
}
.temperature {
    background: var(--gray-50, #f7f9fa);
    padding: 0px 12px;
    .box-line {
        position: relative;
        max-width: 1000px;
        &-item {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            z-index: 2;
        }
    }
    .temperature-item {
        padding: 12px 0px;
        flex: 1;
    }
    .w100 {
        width: 100%;
    }
    .mh96 {
        min-height: 96px;
    }
    .mh128 {
        min-height: 128px;
    }
    .temperature-item:not(:last-child) {
        border-bottom: 1px dashed #e1e5eb;
    }
    .temperature-bar {
        width: 100%;
        height: 12px;
        border-radius: 4px;
        background: linear-gradient(
            90deg,
            #68b2e8 0%,
            #68b2e8 calc(32% - 1px),
            white calc(32% - 1px),
            white calc(32% + 1px),
            #8ad1a6 calc(32% + 1px),
            #8ad1a6 calc(67% - 1px),
            white calc(67% - 1px),
            white calc(67% + 1px),
            #ef9b96 calc(67% + 1px),
            #ef9b96 100%
        );
        position: relative;
    }
    .h64 {
        height: 64px;
    }
}
</style>
