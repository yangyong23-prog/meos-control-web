<template>
    <div class="acac-grid-card-mid-col bc">
        <div v-ellipsis class="acac-grid-card-mid-col-name">
            {{ item.name }}
        </div>
        <div class="acac-grid-card-mid-cols">
            <div v-if="item.values.length === 0" class="acac-grid-card-mid-col-item">
                <div class="val">--</div>
            </div>
            <div v-for="(data, index) in item.values" :key="index" class="acac-grid-card-mid-col-item">
                <div class="val">
                    {{ data.val }}
                </div>
                <div class="unit">
                    {{ data.unit }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    }
});
</script>
<style lang="less" scoped>
.acac-grid-card-mid-col {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    min-width: 120px !important;
    .acac-grid-card-mid-col-name {
        color: var(--gray-800, #2e3742);
        min-height: 33px;
        font-size: 14px;
        font-weight: 700;
        line-height: 1.15;
        max-width: 100%;
        // 超出两行省略
        display: -webkit-box; /* 弹性伸缩盒子 */
        -webkit-line-clamp: 2; /* 限制显示3行 */
        -webkit-box-orient: vertical; /* 垂直排列子元素 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: initial;
    }
    .acac-grid-card-mid-cols {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding-top: 4px;
        flex-wrap: wrap;
        .acac-grid-card-mid-col-item {
            flex-shrink: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            .val {
                display: flex;
                color: var(--gray-800, #2e3742);
                font-family: 'PersagyBold', 'Persagy-Bold', 'PersagyRegular', 'PersagyMedium';
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
            }
            .unit {
                color: var(--gray-600, #626c78);
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
            }
        }
    }
}
</style>
