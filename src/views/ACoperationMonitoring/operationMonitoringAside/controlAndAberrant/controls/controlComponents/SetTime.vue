<template>
    <div class="control-set-time" :info-code="controlItem.infoCode">
        {{ dayjs(controlItem.dataTime).format('YYYY.MM.DD HH:mm') }} {{ i18n.global.t('meos_control_web.end_manual_intervention') }}
        <SetDiv @click="releaseIntervention">{{ i18n.global.t('meos_control_web.release_intervention') }}</SetDiv>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { relieveIntervene } from '@/apis/systemDiagram';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import { IOTObject } from '@/views/systemDiagram/types';
import dayjs from 'dayjs';
import { MMessageBox } from 'meri-plus';
import { PropType } from 'vue';
import emitter from '@/utils/bus';
import SetDiv from '@/components/common/SetDiv.vue';

const props = defineProps({
    controlItem: {
        type: Object as PropType<IOTObject>,
        default: () => ({})
    }
});
const getListCoolStrategy: any = inject('getListCoolStrategy');
const getListFixedTimeStrategy: any = inject('getListFixedTimeStrategy');
const systemId = inject('systemId', ref(''));
const releaseIntervention = () => {
    MMessageBox({
        title: i18n.global.t('meos_control_web.acknowledge_release_manual_intervention'),
        customClass: 'customClass',
        hasLoading: true,
        message: i18n.global.t('meos_control_web.after_release_devices_auto_control'),
        beforeClose: (action: any, data: any, done: () => void) => {
            if (action === 'confirm') {
                relieveIntervene({
                    systemId: systemId.value,
                    objectId: props.controlItem.objectId,
                    infoCode: props.controlItem.infoCode,
                    manualIntervention: false
                }).then(res => {
                    if (res.code === SUCCESSCODE) {
                        emitter.emit('refreshNotify', 'query');
                        useSuccessMessage();
                        getListCoolStrategy();
                        getListFixedTimeStrategy();
                    }
                });
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
    & > span {
        color: var(--blue-500);
        cursor: pointer;
    }
}
</style>
