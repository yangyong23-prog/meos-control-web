<template>
    <div
        ref="domViewRef"
        class="info-point-dow-view-out"
        :class="[CUSTOM_CONTAINER_CLASS]"
        :data-position="dataPosition"
        :style="outStyle"
        @mousemove.stop
        @mouseenter.stop="mouseenterDom"
    >
        <!-- 单设备单信息点 -->
        <SingleInfoCode
            v-if="infoPointData.type === 'singleInfoCode'"
            :info-point-data="infoPointData"
        ></SingleInfoCode>

        <!-- 单信息点多设备 or 单设备多信息点 -->
        <GroupInfoCode
            v-if="infoPointData.type === 'infoCodeToEquips' || infoPointData.type === 'equipToInfoCodes'"
            :info-point-data="infoPointData"
        ></GroupInfoCode>

        <!-- 分组名称 -->
        <GroupName v-if="infoPointData.type === 'groupName'" :info-point-data="infoPointData"></GroupName>

        <!-- 标签 -->
        <Tab v-if="infoPointData.type === 'tab'" :info-point-data="infoPointData"></Tab>

        <!-- 分组标签 -->
        <TabGroup v-if="infoPointData.type === 'tabGroup'" :info-point-data="infoPointData"></TabGroup>
    </div>
</template>
<script setup>
import { computed, inject, ref } from 'vue';
import SingleInfoCode from '@/views/Common/component/InformationCard/SingleInfoCode.vue';
import GroupInfoCode from '@/views/Common/component/InformationCard/GroupInfoCode.vue';
import GroupName from '@/views/Common/component/InformationCard/GroupName.vue';
import Tab from '@/views/Common/component/InformationCard/Tab.vue';
import TabGroup from '@/views/Common/component/InformationCard/TabGroup.vue';
import { editorKey } from '@/utils/injectionKey';
import { CUSTOM_CONTAINER_CLASS } from '@/utils/globalVariables';

const props = defineProps({
    infoPointData: {
        type: Object,
        default: () => {}
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    }
});

const domViewRef = ref(null);

const editor = inject(editorKey);

const dataPosition = computed(() => {
    if (props.infoPointData?.position) {
        const { position } = props.infoPointData;
        return `${position.x}_${position.y}`;
    }
    return '';
});
const outStyle = computed(() => {
    const { position } = props.infoPointData;
    return {
        left: position?.x + 'px',
        top: position?.y + 'px',
        transform: `scale(${props.legendScaleRatio})`
    };
});

const mouseenterDom = () => {
    editor.hoverInfoObject(props.infoPointData, domViewRef.value);
};
</script>
<style lang="scss" scoped>
.info-point-dow-view-out {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
</style>
