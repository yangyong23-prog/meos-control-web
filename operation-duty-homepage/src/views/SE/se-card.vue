<template>
    <div ref="contentElementRef" class="grid-card-layout">
        <div class="grid-card-header">
            <div class="grid-card-title">
                <div v-if="item.title" v-ellipsis class="grid-title">{{ item.title }}</div>
            </div>
        </div>
        <div :class="['grid-card-content', item.autoGrow ? 'auto-grow' : '']">
            <div v-for="(obj, index) in item.children" :key="index" class="grid-card-item">
                <div v-ellipsis class="grid-card-name m-ellipsis">{{ obj.localName }}</div>
                <div class="grid-card-con">
                    <div class="grid-card-ratio ffb">{{ getRatio(obj.luloadRate) }}</div>
                    <ProgressBar :dashed="false" :ratio="obj.luloadRate / 100 || 0" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import ProgressBar from '@/components/ProgressBar.vue';
import { isNumber } from 'lodash';
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
});
const getRatio = ratio => {
    if (isNumber(ratio)) {
        return ratio + '%';
    } else {
        return '--';
    }
};
</script>
<style lang="less" scoped>
.grid-card-layout {
    width: 100%;
    display: flex;
    flex-grow: 1;
    gap: 8px;
    flex-direction: column;
    .grid-card-title {
        height: 22px;
        .grid-title {
            position: relative;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            width: 100%;
            height: 22px;
            max-width: 100%;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            padding-left: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            line-height: 22px;

            &::after {
                position: absolute;
                left: 0;
                top: 4px;
                content: ' ';
                height: 14px;
                width: 3px;
                background: var(--blue-500);
            }
        }
    }
    .grid-card-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        &.auto-grow {
            flex-grow: 1;
        }
        .grid-card-item {
            flex: 1;
            padding: 4px 12px;
            border-radius: 4px;
            background: linear-gradient(90deg, rgba(36, 129, 242, 0.12) 0%, rgba(36, 129, 242, 0) 100%);
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            gap: 4px;
            .grid-card-name {
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;
                max-width: 100%;
                color: #626c78;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
            }
            .grid-card-con {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 4px;
                .grid-card-ratio {
                    font-size: 16px;
                    font-style: normal;
                    width: 64px;
                    min-width: 64px;
                    max-width: 64px;
                    font-weight: 700;
                    line-height: 24px; /* 150% */
                }
            }
        }
    }
}
</style>
