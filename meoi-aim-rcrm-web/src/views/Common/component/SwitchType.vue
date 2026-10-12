<!--
 * @Author: wuyangyang
 * @Date: 2024-03-11 15:01:01
 * @LastEditors: wuyangyang
 * @LastEditTime: 2024-03-20 14:07:52
 * @Description: 
-->
<template>
    <div class="switch-type">
        <div
            v-for="(item, index) in state.arr"
            :key="index"
            :class="[state.index == index ? 'active' : 'no-active', 'switch-type-item']"
            @click="switchBtn(item, index)"
        >
            <div class="title">{{ item.legendName }}</div>
            <div class="img-item">
                <!-- <img :src="item.fileUrl" class="switch-img" /> -->
                <NodeImg :file-id="item.fileUrl" class="switch-img"></NodeImg>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, watchEffect } from 'vue';
import NodeImg from '../NodeVE/NodeImg.vue';
import emitter from '@/utils/bus';
const emits = defineEmits(['clickFn']);
const props = defineProps({
    nodeData: {
        type: Object,
        default: () => {}
    }
});
const state = reactive({
    arr: [],
    index: 0
});
watchEffect(() => {
    state.arr = props.nodeData.iconVoList || [];
    if (props.nodeData.iconVoList) {
        emits('clickFn', props.nodeData?.iconVoList[0] || {}, 0);
    }
});
const switchBtn = (item, index) => {
    state.index = index;
    emits('clickFn', item, index);
};
emitter.on('updateLeftImg', obj => {
    if (obj) {
        state.arr[obj.index].fileUrl = obj.fileId;
    }
    console.log(state.arr, '1111');
});
</script>
<style lang="scss" scoped>
.switch-type {
    margin-right: 16px;
    width: 30%;
    .switch-type-item {
        width: 180px;
        height: 180px;
        cursor: pointer;
        border-radius: 8px;
        margin-bottom: 10px;
        .title {
            padding: 8px 16px;
            border-bottom: 2px solid #e1e5eb;
            font-size: 14px;
            font-weight: 700;
            height: 40px;
        }
        .img-item {
            width: 100%;
            height: 140px;
            .switch-img {
                width: 100%;
                height: 136px;
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
            }
        }
    }
}
.switch-type-item:hover {
    border: 2px solid #246fe5;
}
.active {
    border: 2px solid #246fe5;
}
.no-active {
    border: 2px solid #e1e5eb;
}
</style>
