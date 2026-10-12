<template>
    <div v-if="controlItem.dataTime" class="control-set-time mt4" :info-code="controlItem.infoCode">
        <span @click="(e:any) => openControlPop(e, controlItem,'TIME')">
            {{ dayjs(controlItem.dataTime).format('YYYY.MM.DD HH:mm') }}
        </span>
        {{ i18n.global.t('meos_control_web.end_manual_intervention') }}
        <SetDiv @click="releaseIntervention">{{ i18n.global.t('meos_control_web.release_intervention') }}</SetDiv>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { hotEelieveIntervene } from '@/apis/systemDiagram';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import { IOTObject } from '../types';
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
const openControlPop: any = inject('openControlPop');
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
                hotEelieveIntervene({
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
    color: var(--gray-500, #8b949e);
    & > span {
        color: var(--blue-500);
        cursor: pointer;
    }
}
</style>
