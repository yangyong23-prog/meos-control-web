<!--
 * @Author: guoxiaohuan
 * @Date: 2024-03-25 09:49:39
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-04-24 14:05:07
 * @Description: 
-->
<template>
    <span ref="anchor" hidden></span>
    <Teleport v-if="container" :to="container">
        <div class="echarts-data">
            <div class="echarts-data-box">
                <div class="echarts-data-box-header">
                    <m-tabs v-model="tabId" :data="systemListComputed" size="large" @change="changeSystemId" />
                    <div class="header-close fcc" @click="close"><IconMeriActionClose size="24" /></div>
                </div>
                <EchartMain v-if="refresh" :tab-id="tabId" />
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { IconMeriActionClose } from 'meri-icon';
import EchartMain from './EchartMain.vue';

const emits = defineEmits(['close']);
const systemId = inject('systemId', ref(''));
const tabId = ref(systemId.value);
const systemList = inject('systemList');
const systemListComputed = ref([]);
if (systemList.value.length) {
    const obj = systemList.value.find(item => item.systemId === systemId.value);
    obj.name = obj.localName ?? '--';
    obj.id = obj.systemId;
    systemListComputed.value.push(obj);
}
const anchor = ref(null);
const container = shallowRef(null);
const refresh = ref(true);
const close = () => {
    emits('close');
};
const changeSystemId = () => {
    refresh.value = false;
    nextTick(() => {
        refresh.value = true;
    });
};
onMounted(() => {
    // 就近挂载到当前监控页面，避免覆盖主应用导航或其他子应用。
    container.value = anchor.value.closest('.operation-monitoring-wrap');
});
</script>
<style lang="less" scoped>
.echarts-data {
    // 全屏范围限定在监控页面，窄屏内容在看板内部滚动。
    position: absolute;
    inset: 0;
    z-index: var(--z-index-page-detail);
    overflow: auto;
    .echarts-data-box {
        height: 100%;
        min-width: 1440px;
        background: linear-gradient(180deg, #ebf6ff 0%, #f8fcff 100%);
        &-header {
            height: 56px;
            padding: 0 20px;
            border-bottom: 1px solid var(--gray-200);
            position: relative;
            .header-close {
                height: 24px;
                width: 24px;
                position: absolute;
                top: 28px;
                right: 20px;
                transform: translateY(-50%);
                cursor: pointer;
                z-index: 2;
                &:hover {
                    background-color: var(--alpha-30);
                }
            }
        }
    }
}
</style>
