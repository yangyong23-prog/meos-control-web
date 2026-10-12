<template>
    <div v-for="(item, index) in automaticResetArr" :key="index" style="padding-top: 8px">
        <div class="automatic-reset fcb">
            <div>{{ item.className }}</div>
            <SetButton type="link" size="small" @click="zeroClearing(item)">{{ i18n.global.t('meos_control_web.reset_to_zero1') }}</SetButton>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useSuccessMessage } from '@/utils/tools';
import { MMessageBox } from 'meri-plus';
import baseStore from '@/store/baseStore';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { listAccRuntimeClass } from '@/apis/ACAC';
import SetButton from '@/components/common/SetButton.vue';

const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
    },
    systemClassCode: {
        type: String,
        default: ''
    }
});
const automaticResetArr = ref([]);

const { clearAccRuntimeClassFn } = useGeneralControl();
const emits = defineEmits(['loadFinally']);
onMounted(() => {
    listAccRuntimeClassFun();
});

const listAccRuntimeClassFun = () => {
    listAccRuntimeClass({ projectId: baseStore().projectId, systemId: props.systemId, systemClassCode: props.systemClassCode })
        .then(res => {
            automaticResetArr.value = res.data || [];
            emits('loadFinally');
        })
        .catch(err => {
            emits('loadFinally');
        });
};

const zeroClearing = item => {
    MMessageBox({
        title: i18n.global.t('meos_control_web.reset_to_zero'),
        customClass: 'customClass',
        hasLoading: true,
        message: i18n.global.t('meos_control_web.op_reset_accum_runtime_auto_period'),
        beforeClose: (action, data, done = () => {}) => {
            if (action === 'confirm') {
                clearAccRuntimeClassFn({ projectId: baseStore().projectId, objectId: item.objectId, classCode: item.classCode, systemId: props.systemId }).then(res => {
                    done();
                    useSuccessMessage();
                    listAccRuntimeClassFun();
                });
            } else {
                done();
            }
        }
    });
};
</script>
<style lang="less">
.automatic-reset {
    border-radius: 4px;
    border: 1px solid var(--gray-200, #e8ecf0);
    padding: 12px 16px;
}
</style>
