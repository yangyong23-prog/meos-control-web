<template>
    <div class="dom-container" :style="style">
        <!-- 小附件异常标识 -->
        <NodeMark v-if="data.__showComs?.indexOf(SHOW_DOM_COM_MAP.NodeMark) > -1" :data="data" v-bind="$attrs" />

        <!-- 名字 -->
        <Name v-if="data.__showComs?.indexOf(SHOW_DOM_COM_MAP.Name) > -1" :data="data" v-bind="$attrs" />
        <!-- 开启/关闭 loading状态 -->
        <LoadingStatus v-if="data.__showComs.indexOf(SHOW_DOM_COM_MAP.LoadingStatus) > -1 && loadingStatus" :status="loadingStatus" :data="data" v-bind="$attrs" />
        <!-- 断电状态 -->
        <PorwerDown v-if="data.__showComs.indexOf(SHOW_DOM_COM_MAP.PorwerDown) > -1 && isPorwerDown" :data="data" v-bind="$attrs"></PorwerDown>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import NodeMark from './NodeMark.vue';
import Name from './Name.vue';
import LoadingStatus from './LoadingStatus.vue';
import PorwerDown from '../commonGraphDom/PorwerDown.vue';
import DockSingleton from '@/hooks/responsiveDock';

const { getIotData } = DockSingleton.getInstance();

import { SHOW_DOM_COM_MAP } from '../constants/common';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const loadingStatus = ref('');

const style = computed(() => {
    const { absoluteLocation } = props.data;
    return {
        top: `${absoluteLocation.y}px`,
        left: `${absoluteLocation.x}px`
    };
});

// 加载状态
watchEffect(() => {
    const { dataObject } = props?.data || {};
    const valObj = getIotData(dataObject?.id, 'rcRunStatus');
    if (!valObj) return '';
    const { dataValue } = valObj;

    // dom处理
    if (dataValue === '2') {
        loadingStatus.value = 'opening';
    } else if (dataValue === '3') {
        loadingStatus.value = 'closeing';
        // return 'closeing';
    } else if (dataValue !== '-1') {
        loadingStatus.value = '';
    }
});

// 断点
const isPorwerDown = computed(() => {
    const { dataObject } = props?.data || {};
    const valObj = getIotData(dataObject?.id, 'powerStatus');

    return valObj?.dataValue === '0';
});
</script>
<style lang="less" scoped>
.dom-container {
    display: inline-block;
    position: absolute;
}
</style>
