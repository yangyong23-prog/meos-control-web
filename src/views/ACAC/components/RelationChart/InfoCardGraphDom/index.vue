<template>
    <div class="dom-container" :style="style">
        <component :is="infoComponents[data.type]" v-if="data.type" :key="data.id" :data="data" v-bind="$attrs"></component>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import singleInfoCode from './singleInfoCode.vue';
import groupInfoCode from './groupInfoCode.vue';
import Tab from './Tab.vue';
import TabGroup from './TabGroup.vue';
import GroupName from './GroupName.vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    }
});

const infoComponents = {
    singleInfoCode: singleInfoCode, // 单信息点
    equipToInfoCodes: groupInfoCode, // 单设备多信息点
    infoCodeToEquips: groupInfoCode, // 多设备单信息点
    groupName: GroupName, // 分组名称
    tab: Tab, // 标签
    tabGroup: TabGroup
};

const style = computed(() => {
    const { position } = props.data;
    if (!position) {
        return {};
    }
    return {
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: `scale(${props.legendScaleRatio})`
    };
});
</script>
<style lang="less" scoped>
.dom-container {
    display: flex;
    position: absolute;
}
</style>
