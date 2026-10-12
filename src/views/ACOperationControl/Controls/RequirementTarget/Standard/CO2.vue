<template>
    <div class="co2-container">
        <div class="co2-bar">
            <div v-if="co2List?.length" class="co2-list">
                <div v-for="(item, index) in co2List" :key="item" class="co2-item" :style="{ left: `${percentPositions[index]}` }">
                    <div v-ellipsis class="title" :style="{ 'justify-content': index === 0 ? 'flex-start' : 'flex-end' }" v-html="item.title"></div>
                    <div class="line"></div>
                    <div class="value">{{ item.value }}ppm</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const CO2_COMFORT_LIMIT_TITLE = i18n.global.t('meos_control_web.comfort_zone_upper');
const CO2_HIGH_THRESHOLD_TITLE = i18n.global.t('meos_control_web.high_threshold');
const props = defineProps({
    quality: {
        type: Object,
        default: () => {}
    }
});
const quality = computed(() => props.quality);
const co2List = ref([
    {
        title: CO2_COMFORT_LIMIT_TITLE,
        value: quality.value.carbonDioxideLimitValue ?? '--'
    },
    {
        title: CO2_HIGH_THRESHOLD_TITLE,
        value: quality.value.carbonDioxideUpperLimitValue ?? '--'
    }
]);
const percentPositions = ['20%', '80%'];
</script>
<style lang="less" scoped>
.co2-container {
    height: 104px;
    padding: 8px 12px;
    margin-bottom: 20px;
    background: #f7f9fa;
    .co2-bar {
        position: relative;
        margin-top: 38px;
        width: 100%;
        height: 12px;
        border-radius: 4px;
        background: linear-gradient(
            90deg,
            #8ad1a6 0%,
            #8ad1a6 calc(20% - 1px),
            white calc(20% - 1px),
            white calc(20% + 1px),
            #edc578 calc(20% + 1px),
            #edc578 calc(80% - 1px),
            white calc(80% - 1px),
            white calc(80% + 1px),
            #ef9b96 calc(80% + 1px),
            #ef9b96 100%
        );
        .co2-list {
            display: flex;
            justify-content: space-between;
            .co2-item {
                display: flex;
                position: absolute;
                transform: translateX(-50%);
                width: 40%;
                flex-direction: column;
                .title {
                    color: #626c78;
                    font-size: 14px;
                    line-height: 22px;
                    white-space: nowrap;
                    height: 22px;
                    margin-top: -26px;
                    text-align: center;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .line {
                    width: 2px;
                    height: 10px;
                    margin: 5px 0 4px 0;
                    margin-left: calc(100% / 2 - 1px);
                }
                .value {
                    height: 22px;
                    text-align: center;
                    color: #1b2129;
                    font-size: 14px;
                    line-height: 22px;
                }
            }
        }
    }
}
</style>
