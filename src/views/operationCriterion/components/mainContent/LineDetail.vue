<template>
    <div class="temperature">
        <div :class="['temperature-item']">
            <div :class="['box-line', 'fcc']" :style="{ width: '100%' }">
                <div class="f14 mb4 box-line-item">
                    <div
                        v-for="(item, index) in list"
                        :key="index"
                        :class="['fcb h80', 'flex-row']"
                        :style="{
                            width: type === 'co2' ? '40%' : '22%',
                            left: typePositionMap[type][index] || percentPositions[index]
                        }"
                    >
                        <div v-ellipsis class="box-line-label">
                            {{ item.name }}
                        </div>
                        <div class="get-line-white"></div>
                        <div class="box-line-value">{{ item.value }}{{ typeUnitMap[type] }}</div>
                    </div>
                </div>
                <div class="temperature-bar" :class="type"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    type: {
        type: String,
        default: '',
        validate(value) {
            return ['co2', 'temperature', 'humidity', 'pressureDiff'].includes(value);
        }
    }
});
const percentPositions = ['11%', '37%', '63%', '89%'];
const co2PercentPositions = ['20%', '80%'];
const pressureDiffPercentPositions = ['32%', '67%'];

const typePositionMap = {
    temperature: percentPositions,
    humidity: percentPositions,
    co2: co2PercentPositions,
    pressureDiff: pressureDiffPercentPositions
};

const typeUnitMap = {
    temperature: '℃',
    co2: 'ppm',
    humidity: '%RH',
    pressureDiff: 'Pa'
};
</script>
<style lang="less" scoped>
.flex-row {
    display: flex;
    position: absolute;
    transform: translateX(-50%);
    flex-direction: column;
}
.temperature {
    padding: 0px 0px;
    width: 100%;
    height: 80px;
    .box-line {
        position: relative;
        &-item {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            display: flex;
            align-items: center;
            z-index: 2;

            .box-line-label {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px; /* 157.143% */
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                width: 100%;
                text-align: center;
            }
            .box-line-value {
                color: var(--gray-900, #1b2129);
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 22px; /* 137.5% */
            }
        }
    }
    .temperature-item {
        width: 100%;
        padding: 0px 0px;
        align-items: center;
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
    }

    .temperature-item:not(:last-child) {
        border-bottom: 1px dashed #e1e5eb;
    }
    .temperature-bar {
        width: 100%;
        height: 14px;
        border-radius: 4px;
        background: linear-gradient(
            90deg,
            #68b2e8 0%,
            #68b2e8 calc(11% - 1px),
            white calc(11% - 1px),
            white calc(11% + 1px),
            #6bcfdd calc(11% + 1px),
            #6bcfdd calc(37% - 1px),
            white calc(37% - 1px),
            white calc(37% + 1px),
            #8ad1a6 calc(37% + 1px),
            #8ad1a6 calc(63% - 1px),
            white calc(63% - 1px),
            white calc(63% + 1px),
            #edc578 calc(63% + 1px),
            #edc578 calc(89% - 1px),
            white calc(89% - 1px),
            white calc(89% + 1px),
            #ef9b96 calc(89% + 1px),
            #ef9b96 100%
        );
        position: relative;
        &.co2 {
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
        }
        &.pressureDiff {
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
        }
    }
    .get-line-box {
        width: 100%;
        height: 100%;
    }
    .get-line-white {
        height: 14px;
        width: 2px;
        // background-color: white;
        // border-radius: 2px 2px 0 0;
    }
    .h80 {
        height: 80px;
    }
}
.w55 {
    width: 55%;
}
.ml35 {
    margin-left: 35px;
}
.pd6 {
    padding-left: 4%;
    padding-right: 4%;
}
.pd4 {
    padding-left: 2%;
    padding-right: 2%;
}
</style>
