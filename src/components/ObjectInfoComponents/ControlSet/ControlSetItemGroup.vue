<template>
    <ControlSetItem
        :info-code="item.infoCode"
        :type="[item.infoCode === 'manualAutoSet' ? 'is-manual-auto-set' : 'is-not-manual-auto-set']"
        :data="item"
        :cur-info-code="curInfoCode"
        :system-id="systemId"
        :class="[item.notFirstManualAutoSet ? 'not-first-manual-auto-set' : '']"
        :show-data-source="showDataSource"
        :show-control-btn-fn="showControlBtnFn"
        :object-id="objectId"
        v-bind="disabledFun(item)"
        @open-form="(e, val) => emit('open-form', e, item, val)"
    />
</template>

<script setup>
import ControlSetItem from './ControlSetItem.vue';

const props = defineProps({
    item: {
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
    objectId: {
        type: String,
        default: ''
    },
    showDataSource: {
        type: Boolean,
        default: false
    },
    showControlBtnFn: {
        type: Function,
        default: null
    },
    disabledFun: {
        type: Function,
        required: true
    }
});

const emit = defineEmits(['open-form']);
</script>
