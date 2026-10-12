<template>
    <div class="chart-line-title">
        <div class="title-text">{{ title }}</div>
        <template v-if="tabData.length > 1">
            <div class="tab-title" :style="{ maxWidth: title === i18n.global.t('meos_control_web.boiler_operation') ? '330px' : '250px' }">
                <m-tabs v-model="modalData" :data="tabData" type="segment" size="small" @change="changeTab"></m-tabs>
            </div>
        </template>
        <div v-else class="title-right">{{ tabData[0]?.name }}</div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    title: {
        type: String,
        default: () => ''
    },
    modalOn: {
        type: String,
        default: () => ''
    },
    tabData: {
        type: Array,
        default: () => []
    }
});
const emits = defineEmits(['changeTab']);
const changeTab = val => {
    modalData.value = val.id;
    emits('changeTab', val);
};
// eslint-disable-next-line vue/no-setup-props-destructure
const modalData = ref(props.modalOn);
</script>

<style lang="less" scoped>
.chart-line-title {
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-text {
        color: #2e3742;
        font-size: 16px;
        font-weight: 700;
    }
    .tab-title {
        :deep(.m-tabs.m-tabs-segment) {
            width: 100%;
            .m-tabs-list {
                .m-tabs-item {
                    flex: 1;
                }
            }
        }
    }
    .title-right {
        text-align: right;
        color: #1b2129;
        font-size: 14px;
    }
}
</style>
