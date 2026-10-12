<template>
    <div class="preview-container">
        <div class="group-card" :class="{ 'center-layout': centerLayout }">
            <div ref="cardBox" class="info-out-container" :style="previewItemStyle">
                <!-- 单设备单信息点 -->
                <SingleInfoCode
                    v-if="infoPointData.type === 'singleInfoCode'"
                    :info-point-data="infoPointData"
                    :is-chart="false"
                ></SingleInfoCode>

                <!-- 单信息点多设备 or 单设备多信息点 -->
                <GroupInfoCode
                    v-if="infoPointData.type === 'infoCodeToEquips' || infoPointData.type === 'equipToInfoCodes'"
                    :info-point-data="infoPointData"
                    :is-chart="false"
                ></GroupInfoCode>

                <!-- 分组名称 -->
                <GroupName v-if="infoPointData.type === 'groupName'" :info-point-data="infoPointData"></GroupName>

                <!-- 标签 -->
                <Tab v-if="infoPointData.type === 'tab'" :info-point-data="infoPointData" :is-chart="false"></Tab>

                <!-- 分组标签 -->
                <TabGroup
                    v-if="infoPointData.type === 'tabGroup'"
                    :info-point-data="infoPointData"
                    :is-chart="false"
                ></TabGroup>
            </div>
        </div>
        <div v-if="haveShowTitleOperation" class="title-show-operation">
            {{ infoPointData.type === 'singleInfoCode' ? '信息点名称' : '分组名称'
            }}<m-switch v-model="showTitleSwitch" size="small" @change="switchChange"></m-switch>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue';
import SingleInfoCode from '@/views/Common/component/InformationCard/SingleInfoCode.vue';
import GroupInfoCode from '@/views/Common/component/InformationCard/GroupInfoCode.vue';
import GroupName from '@/views/Common/component/InformationCard/GroupName.vue';
import Tab from '@/views/Common/component/InformationCard/Tab.vue';
import TabGroup from '@/views/Common/component/InformationCard/TabGroup.vue';

const props = defineProps({
    infoPointData: {
        type: Object,
        default: () => {}
    }
});

const cardBox = ref(null);

const showTitleSwitch = ref('checked');

const switchChange = () => {
    // eslint-disable-next-line vue/no-mutating-props
    props.infoPointData.showTitle = showTitleSwitch.value === 'checked';
};

const haveShowTitleOperation = computed(() => {
    if (!props.infoPointData) return false;
    return ['singleInfoCode', 'equipToInfoCodes', 'infoCodeToEquips'].includes(props.infoPointData.type);
});

const centerLayout = computed(() => {
    if (!props.infoPointData) return false;
    return ['singleInfoCode', 'groupName', 'tab', 'tabGroup'].includes(props.infoPointData.type);
});

const previewItemStyle = ref({});
watchEffect(() => {
    previewItemStyle.value = {
        transformOrigin: ['singleInfoCode', 'groupName', 'tab', 'tabGroup'].includes(props.infoPointData.type)
            ? 'center'
            : 'center top',
        scale: `${148 / (cardBox.value?.offsetHeight + 26) > 1 ? 1 : 148 / (cardBox.value?.offsetHeight + 26)}`
    };
});

watch(
    () => props.infoPointData,
    () => {
        showTitleSwitch.value = props.infoPointData.showTitle ? 'checked' : 'uncheck';
    },
    {
        immediate: true
    }
);
</script>

<style lang="scss" scoped>
.preview-container {
    border-radius: 4px;
    width: 100%;
    .group-card {
        background: #f7f9fa;
        height: 164px;
        border-radius: 4px 4px 0 0;
        border-top: 1px solid #e1e5eb;
        border-bottom: 1px solid #e1e5eb;
        padding: 8px;
        position: relative;
        overflow: hidden;

        @include flex-display(flex-start, center, column);
        &.center-layout {
            @include flex-display(center, center, column);
        }
    }
    .title-show-operation {
        @include font-size-color(14px, #1b2129, 'Microsoft YaHei UI');

        user-select: none;
        display: flex;
        text-align: center;
        justify-content: center;
        margin: 0 auto;
        height: 46px;
        padding: 12px 16px;
    }
}
</style>
