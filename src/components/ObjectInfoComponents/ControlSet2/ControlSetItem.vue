<template>
    <div class="control-set-item">
        <div>
            <slot name="left"></slot>
        </div>
        <div style="flex: 1">
            <div class="control-set-item-name mb4">
                {{ data.infoCodeName }}
                <slot name="name-right"></slot>
            </div>
            <div class="control-set-item-value">
                <SetAndActual
                    :data="data"
                    :cur-info-code="curInfoCode"
                    :data-source-item-code="dataSourceItemCode"
                    v-bind="$attrs"
                    :show-set-buttons="showSetButtons"
                    @open-form="openForm"
                />
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
    showSetButtons: {
        type: Boolean,
        default: false
    },
    dataSourceItemCode: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
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
const openForm = (e, item, dataSourceItem) => {
    emit('openForm', e, item, dataSourceItem);
};
</script>
<style lang="less" scoped></style>
