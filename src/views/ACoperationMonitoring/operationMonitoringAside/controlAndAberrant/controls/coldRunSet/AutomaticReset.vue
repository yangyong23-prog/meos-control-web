<template>
    <div class="AutomaticReset fcb">
        <div>{{ data.className }}</div>
        <SetButton type="link" size="small" @click="zeroClearing(data)">{{ i18n.global.t('meos_control_web.reset_to_zero1') }}</SetButton>
    </div>
</template>
<script lang="ts" setup>
import { useSuccessMessage } from '@/utils/tools';
import { MMessageBox } from 'meri-plus';
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import SetButton from '@/components/common/SetButton.vue';
const listAccRuntimeClassFun: any = inject('listAccRuntimeClassFun');
const openLoading: any = inject('openLoading');
defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
const { clearAccRuntimeClassFn } = useGeneralControl();

const zeroClearing = (item: any) => {
    MMessageBox({
        title: i18n.global.t('meos_control_web.reset_to_zero'),
        customClass: 'customClass',
        hasLoading: true,
        message: i18n.global.t('meos_control_web.op_reset_accum_runtime_auto_period'),
        beforeClose: (action: any, data: any, done: () => void) => {
            if (action === 'confirm') {
                clearAccRuntimeClassFn({ projectId: baseStore().projectId, objectId: item.objectId, classCode: item.classCode }).then(res => {
                    done();
                    useSuccessMessage();
                    openLoading();
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
.AutomaticReset {
    border-radius: 4px;
    border: 1px solid var(--gray-200, #e8ecf0);
    padding: 12px 16px;
}
</style>
