<template>
    <div :id="infoPointData?.id" :class="[isChart ? 'single-info-chart' : 'single-info-chart-not']" :style="outStyle">
        <!-- 默认单信息点不展示信息点名称 -->
        <div v-if="infoPointData.showTitle" v-ellipsis class="single-info-name">
            {{ infoPointData.title }}
        </div>
        <div v-ellipsis class="single-info-value" :style="outStyleItem">
            <span style="margin: 0 auto; max-width: 200px; border-radius: 2px; padding: 0 4px">
                {{ getValueTextByInfoObject(infoPointData.infoObject)
                }}<span v-if="infoPointData.infoObject?.unit" class="unit">{{ infoPointData.infoObject?.unit }}</span>
            </span>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { getValueTextByInfoObject } from '../utils';
const props = defineProps({
    isChart: {
        type: Boolean,
        default: true
    },
    infoPointData: {
        type: Object,
        default: () => ({})
    }
});
const outStyle = computed(() => {
    const { width, fontSize } = props.infoPointData;
    if (props.isChart) {
        return {
            width: `${width}px`,
            fontSize: `${fontSize}px`
        };
    }

    return {};
});
const outStyleItem = computed(() => {
    const { fontSize } = props.infoPointData;
    if (props.isChart) {
        return {
            fontSize: `${fontSize}px`
        };
    }

    return {};
});
</script>
<style lang="scss" scoped>
.single-info-chart {
    .single-info-name {
        margin-bottom: 0;
        text-align: center;

        @include text-ellipsis;
    }
    .single-info-value {
        font-weight: 700;
        width: 100%;
        text-align: center;
        > span {
            border: 0.6px solid rgb(255 255 255 / 80%);
            background: rgb(255 255 255 / 80%);
        }

        @include text-ellipsis;
        .unit {
            font-size: 24px;
        }
    }
}
.single-info-chart-not {
    text-align: center;
    .single-info-name {
        margin-bottom: 6px;
        height: 14px;
        line-height: 14px;
        width: 184px;

        @include font-size-color(14px, #8b949e, 'Microsoft YaHei UI');
    }
    .single-info-value {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        border-radius: 2px;
        font-weight: 700;

        @include font-size-color(16px, #1b2129, 'Persagy');
        .unit {
            @include font-size-color(10px, #1b2129, 'Microsoft YaHei');
        }
    }
}
</style>
