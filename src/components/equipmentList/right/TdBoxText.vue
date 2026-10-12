<template>
    <div class="wh100 td-box-text-box">
        <div v-ellipsis class="td-box-text-box-str">
            {{ data[column.dataIndex] ?? getValueStr(getInfoCode).text }}
        </div>

        <SetIntervene v-if="getInfoCode.additionalMapValue?.recoveryDateTime" v-bind="$attrs" @intervene-click="interveneClick" />
    </div>
</template>

<script setup>
import { getValueStr } from '@/utils/viewUtils';
import SetIntervene from '../components/control/SetIntervene.vue';
import { openRecoveryDateTimeControlFormKey, openReleaseInterventionControlFormKey } from '../hooks/useControlHook';
const openRecoveryDateTimeControlFormFn = inject(openRecoveryDateTimeControlFormKey);
const openReleaseInterventionControlFormFn = inject(openReleaseInterventionControlFormKey);
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    column: {
        type: Object,
        default: () => ({})
    },
    getInfoCode: {
        type: Object,
        default: () => ({})
    }
});
const interveneClick = (e, type) => {
    if (type === 'time') {
        openRecoveryDateTimeControlForm(e);
    } else {
        openReleaseInterventionControlForm(e);
    }
};
const openRecoveryDateTimeControlForm = e => {
    openRecoveryDateTimeControlFormFn({ el: e, data: { ...props.getInfoCode, id: props.data.id } });
};
const openReleaseInterventionControlForm = e => {
    openReleaseInterventionControlFormFn({ el: e, data: { ...props.getInfoCode, id: props.data.id } });
};
</script>
<style lang="less" scoped>
.td-box-text-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    word-break: break-all;
    &-str {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
    }
}
</style>
