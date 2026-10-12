<template>
    <div ref="contentElementRef" class="grid-card-layout">
        <div class="grid-card-header">
            <div class="grid-card-title">
                <Title class="grid-title">{{ item.name }}</Title>
            </div>
        </div>
        <div class="grid-card-content">
            <div v-for="(obj, index) in item.children" :key="index" class="grid-card-item">
                <div v-if="obj.showChart" class="canvas-box">
                    <Pie
                        :data="{
                            value: obj.pieValue || obj.runningTotal,
                            total: obj.pieTotal || obj.equipmentTotal
                        }"
                        :radio-start="'82%'"
                        :color="obj.pieColor"
                    />
                    <VueSvg v-if="obj.path" :path="svgs[obj.path]" />
                </div>
                <div class="grid-card-item-data">
                    <RunNumber :show-label="false" :value="obj.runningTotal" :total="obj.equipmentTotal" />
                    <div class="grid-card-item-label">
                        {{ obj.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import VueSvg from '@/components/VueSvg.vue';
import Title from '@/components/Title.vue';
import RunNumber from '@/components/RunNumber.vue';
import Pie from '@/components/echarts/Pie.vue';
import KetiSvg from '@/assets/svg/keti.svg';
import DiantiSvg from '@/assets/svg/dianti.svg';
import ShexiangSvg from '@/assets/svg/shexiang.svg';
import DiantiCameraSvg from '@/assets/svg/diantiCamera.svg';
const svgs = {
    KetiSvg: KetiSvg,
    ShexiangSvg: ShexiangSvg,
    DiantiSvg: DiantiSvg,
    DiantiCameraSvg: DiantiCameraSvg
};
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.grid-card-layout {
    width: 100%;
    display: flex;
    flex-grow: 0;
    gap: 4px;
    align-items: start;
    flex-direction: column;
    justify-content: space-between;
    .grid-card-content {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        gap: 0px;
        .grid-card-item + .grid-card-item {
            padding-left: 2px;
        }
        .grid-card-item {
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            gap: 4px;
            &:first-of-type {
                min-width: 138px;
            }
            &:last-of-type {
                min-width: 138px;
                width: 33.33%;
            }
            .canvas-box {
                width: 56px;
                height: 56px;
                padding: 2px;
                box-sizing: border-box;
                position: relative;
                display: flex;
                flex-shrink: 0;
                flex-grow: 0;
                align-items: center;
                justify-content: center;
                svg {
                    position: absolute;
                }
            }
            .grid-card-item-data {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;
                gap: 0px;
                .grid-card-item-label {
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    color: var(--gray-600, #626c78);
                    line-height: 22px;
                }
            }
        }
    }
}
</style>
