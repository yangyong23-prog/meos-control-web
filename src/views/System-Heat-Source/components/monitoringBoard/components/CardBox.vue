<template>
    <div class="card-box wh100">
        <div class="card-box-title fcb">
            <span class="fw600 fs16"><slot name="title"></slot></span>
            <slot name="operate"></slot>
        </div>
        <div class="card-box-legend">
            <slot name="legend"></slot>
        </div>
        <div class="card-box-chart">
            <slot name="chart"></slot>
        </div>
    </div>
</template>

<script setup></script>
<style lang="less" scoped>
.card-box {
    padding: 8px 16px;
    white-space: nowrap;
    &-title {
        height: 32px;
        margin-bottom: 4px;
    }
    &-legend {
        height: 32px;
        margin-bottom: 4px;
    }
    &-chart {
        height: calc(100% - 72px);
    }
}
</style>
