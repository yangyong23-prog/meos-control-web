<template>
    <div class="AutomaticReset fcb">
        <div>{{ data.className }}</div>
        <SetButton type="link" size="small" @click="zeroClearing(data)">{{ i18n.global.t('meos_control_web.reset_to_zero1') }}</SetButton>
    </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { useSuccessMessage } from '@/utils/tools';
import { MMessageBox } from 'meri-plus';
import baseStore from '@/store/baseStore';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { systemIdKey } from '../hooks/useBaseHook';
import SetButton from '@/components/common/SetButton.vue';

defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
const systemId: any = inject(systemIdKey);
const { clearAccRuntimeClassFn } = useGeneralControl();
const zeroClearing = (item: any) => {
    MMessageBox({
        title: i18n.global.t('meos_control_web.reset_to_zero'),
        customClass: 'customClass',
        hasLoading: true,
        message: i18n.global.t('meos_control_web.op_reset_accum_runtime_auto_period'),
        beforeClose: (action: any, data: any, done: () => void) => {
            if (action === 'confirm') {
                clearAccRuntimeClassFn({ projectId: baseStore().projectId, objectId: item.objectId, classCode: item.classCode, systemId: systemId.value }).then(res => {
                    done();
                    useSuccessMessage();
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
    height: 56px;
    border-radius: 4px;
    background-color: var(--gray-50);
    color: #000;
    &:hover {
        background-color: var(--alpha-30);
    }
    padding: 12px 16px;
}
</style>
