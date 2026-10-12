<!-- eslint-disable vue/v-on-event-hyphenation -->
<!--
 * @Author: wuyangyang
 * @Date: 2024-03-08 15:24:41
 * @LastEditors: wuyangyang
 * @LastEditTime: 2024-03-20 14:56:45
 * @Description: 
-->
<template>
    <m-modal type="default" :title="`图标编辑 - ${modalData?.legendName}`" :width="825" top-y="125" @close="close">
        <template #content>
            <div class="info-warp">
                <div class="info-size">
                    <span class="info-lable">尺寸：</span>
                    <span class="info-value">{{ modalData?.size?.x }}*{{ modalData?.size?.y }}px</span>
                </div>
                <div class="info-split"></div>
                <div class="info-id">
                    <span class="info-lable">ID：</span>
                    <span class="info-value">{{ modalData?.legendId }}</span>
                </div>
            </div>
            <div class="content-item">
                <SwitchType :node-data="modalData" @clickFn="updateInfo"></SwitchType>
                <div>
                    <div class="anchor-box">
                        <NodeVE
                            ref="nodeVe"
                            :node-data="modalData"
                            :img-obj="imgObj"
                            class="node-v-e"
                            mode="edit"
                        ></NodeVE>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="cancale">取消</m-button>
            <m-button type="primary" :disabled="!modalData.fileUrl" @click.stop="save">保存</m-button>
        </template>
    </m-modal>
</template>
<script setup>
import { MModal, MButton } from 'meri-plus';
import NodeVE from './NodeVE/Index.vue';
import SwitchType from './component/SwitchType.vue';
import { ref, watchEffect, getCurrentInstance } from 'vue';
const emite = defineEmits(['close', 'save']);
const props = defineProps({
    nodeData: {
        type: Object,
        default: () => {}
    }
});
const modalData = ref({});
const imgObj = ref({});
const app = getCurrentInstance()?.proxy;
watchEffect(() => {
    modalData.value = JSON.parse(JSON.stringify(props.nodeData || {}));
});
const nodeVe = ref();

const updateInfo = (item, index) => {
    imgObj.value = item;
    setTimeout(() => {
        app.$refs['nodeVe'].getUrl(item, index);
    }, 500);
};
const cancale = () => {
    emite('close');
};
const close = () => {
    emite('close');
};
const save = () => {
    if (nodeVe.value) {
        emite('save', nodeVe.value.getData());
    }
};
</script>
<style lang="scss" scoped>
.content-item {
    display: flex;
    margin-top: 12px;
}
.info-warp {
    display: flex;
    gap: 12px;
    align-items: center;
    .info-split {
        width: 1px;
        height: 14px;
        background-color: var(--grey-400);
    }
    .info-lable {
        color: var(--grey-600);
        font-size: 14px;
    }
    .info-value {
        color: var(--grey-900);
        font-size: 14px;
    }
}
.anchor-box {
    height: 464px;
    width: 580px;

    // margin: 12px 0 0;
    .node-v-e {
        border-radius: 8px;
    }
}
</style>
