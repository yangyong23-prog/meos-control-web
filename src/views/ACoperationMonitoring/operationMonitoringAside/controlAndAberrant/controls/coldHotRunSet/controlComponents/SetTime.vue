<template>
    <div class="control-set-time" :info-code="controlItem.infoCode">
        {{ dayjs(controlItem.dataTime).format('YYYY.MM.DD HH:mm') }} {{ i18n.global.t('meos_control_web.end_manual_intervention') }}
        <span @click="releaseIntervention"> &nbsp;{{ i18n.global.t('meos_control_web.release_intervention') }} </span>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { relieveIntervene, removeInterveneSystemRunningModel } from '@/apis/systemDiagram';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import dayjs from 'dayjs';
import { MMessageBox } from 'meri-plus';
import emitter from '@/utils/bus';
const props = defineProps({
    controlItem: {
        type: Object,
        default: () => ({})
    }
});
const getListCoolStrategy = inject('getListCoolStrategy');
const refreshSystemFun = inject('refreshSystemFun');
const systemId = inject('systemId', ref(''));
const releaseIntervention = () => {
    MMessageBox({
        title: i18n.global.t('meos_control_web.acknowledge_release_manual_intervention'),
        customClass: 'customClass',
        hasLoading: true,
        message: i18n.global.t('meos_control_web.after_release_devices_auto_control'),
        beforeClose: async (action, data, done) => {
            if (action === 'confirm') {
                try {
                    if (props.controlItem.infoCode === 'hotCoolModel') {
                        const res = await removeInterveneSystemRunningModel({ systemId: systemId.value });
                        if (res.code === SUCCESSCODE) {
                            await refreshSystemFun();
                            useSuccessMessage();
                        }
                        done();
                        return;
                    }
                    const res2 = await relieveIntervene({
                        systemId: systemId.value,
                        objectId: props.controlItem.objectId,
                        infoCode: props.controlItem.infoCode,
                        manualIntervention: false
                    });
                    if (res2.code === SUCCESSCODE) {
                        await getListCoolStrategy();
                        emitter.emit('refreshNotify', 'query');
                        useSuccessMessage();
                    }
                    emitter.emit('SYSTEM_DATE_CHANGE');
                } catch (e) {
                    console.error(e);
                }

                done();
            } else {
                done();
            }
        }
    });
};
</script>
<style lang="less" scoped>
.control-set-time {
    height: 20px;
    color: var(--gray-700);
    font-size: 12px;
    & > span {
        color: var(--blue-500);
        cursor: pointer;
    }
}
</style>
