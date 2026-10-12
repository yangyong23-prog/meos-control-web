<template>
    <div class="control-set-item">
        <div class="control-set-item-name">{{ data.infoCodeName }}</div>
        <div class="control-set-item-value">
            <SetAndActual :data="data" :cur-info-code="curInfoCode" :show-data-source="showDataSource" v-bind="$attrs" @open-form="openForm" />
        </div>
        <div class="control-set-item-time">
            <InterfereTime
                v-if="infoCodeData.additionalMapValue?.recoveryDateTime"
                :system-id="systemId"
                :data="data"
                :time="infoCodeData.additionalMapValue?.recoveryDateTime"
                v-bind="$attrs"
            />
        </div>
    </div>
</template>

<script setup>
import DockSingleton from '@/hooks/responsiveDock';
import SetAndActual from './SetAndActual.vue';
import InterfereTime from './InterfereTime.vue';
const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    curInfoCode: {
        type: Object,
        default: () => ({})
    },
    systemId: {
        type: String,
        default: ''
    },
    showDataSource: {
        type: Boolean,
        default: false
    }
});
const infoCodeData = computed(() => {
    const data = getIotData(props.data.objectId, props.data.infoCode);
    if (data) {
        return data;
    }
    return {};
});
const emit = defineEmits(['openForm']);
const openForm = (e, val) => {
    emit('openForm', e, val);
};
</script>
<style lang="less" scoped></style>
