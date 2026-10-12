<template>
    <m-form ref="Mform" label-width="200px" :model="params" label-position="top" require-asterisk-position="right">
        <template v-for="item in currentInfoCodeObject.components" :key="item">
            <component :is="componentsMap[item]" />
        </template>
        <div style="text-align: right; padding-top: 6px">
            <m-button size="small" style="margin-right: 12px" @click="cancel(false)">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button id="commandExecuteByBatch" type="primary" size="small" @click="sumbit">{{ i18n.global.t('meos_control_web.submit') }}</m-button>
        </div>
    </m-form>
</template>

<script setup>
import { commandExecuteByBatch } from '@/apis/systemDiagram';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import EndTime from './formComponents/EndTime.vue';
import ColderNumber from './formComponents/ColderNumber.vue';
import ParamsSet from './formComponents/ParamsSet.vue';
import Reason from './formComponents/Reason.vue';
import Text from './formComponents/Text.vue';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import { setModelType, useSuccessMessage } from '@/utils/tools';
import i18n from '@/localization';

const emits = defineEmits(['cancel', 'sumbit']);
const Mform = ref(null);
const params = ref({
    data: '',
    time: '',
    reason: '',
    content: '',
    max: '',
    min: '',
    sysSwitchSet: '',
    infoCode: '',
    enableCtrl: ''
});
// 接口传参的对应字段
const paramsPlan = {
    sysSwitchSet: 'sysSwitchSet',
    enableCtrl: 'enableCtrl',
    chillerLNum: 'max',
    chillerSNum: 'min',
    chillWaterOutTempSet: 'data',
    heatWaterSupplyTempSet: 'data',
    chillWaterDetaPressSet: 'data',
    chillWaterDetaTempSet: 'data',
    branchDetaTempSet: 'data',
    branchDetaPressSet: 'data'
};

const coldNum = ref({});
// 区分冷战控制还是末级泵组控制
// const TempTimeStrategy: 'TempTimeStrategy' | 'ChillerTempTimeStrategy' = inject(
//   'TempTimeStrategy',
//   'ChillerTempTimeStrategy'
// )
// 系统id
const systemId = inject('systemId', ref(''));
// 当前选中的信息点对象
const currentInfoCodeObject = inject('currentInfoCodeObject');
// 真实运行的冷机参数
const RunningChillerData = ref({
    runningChillerLNum: 0,
    runningChillerSNum: 0,
    ratedCoolMax: 0,
    ratedCoolMin: 0
});
const sumbit = () => {
    Mform.value.validate(valid => {
        if (valid) {
            params.value.sysSwitchSet = currentInfoCodeObject.value.dataValue !== '1' ? '1' : '0';
            params.value.enableCtrl = currentInfoCodeObject.value.dataValue !== '1' ? '1' : '0';
            params.value.infoCode = currentInfoCodeObject.value.valueInfoCode;
            const data = {
                systemId: systemId.value,
                objectId: currentInfoCodeObject.value.objectId,
                sustainTime: params.value.time ? dayjs(params.value.time).format('YYYY-MM-DD HH:mm:00') : getDayjsTz().format('YYYY-MM-DD HH:mm:00'),
                adjustmentReasonType: params.value.reason.includes('OTHER') ? 'OTHER' : params.value.reason,
                adjustmentReasonDetail: params.value.content,
                manualIntervention: true,
                data: setParams()
            };
            setModelType(systemId.value);
            commandExecuteByBatch(data).then(res => {
                if (res.code === SUCCESSCODE) {
                    // emitter.emit('refreshNotify', 'query');
                    useSuccessMessage();
                    cancel(true);
                }
            });
            console.log(data);
        }
    });
};
const setParams = () => {
    const paramsOld = structuredClone(params.value);
    const data = {};
    currentInfoCodeObject.value.strategyPlan.forEach(element => {
        if (paramsPlan[element]) {
            data[element] = paramsOld[paramsPlan[element]];
        }
    });
    return data;
};
const cancel = (type = false) => {
    emits('cancel', type);
};
const componentsMap = { Reason, EndTime, ColderNumber, ParamsSet, Text };
const initData = () => {
    // input值
    if (currentInfoCodeObject.value.inputValue) {
        params.value.data = currentInfoCodeObject.value.inputValue * 1;
    }
    params.value.min = currentInfoCodeObject.value.min ? `${currentInfoCodeObject.value.min}` : '';
    params.value.max = currentInfoCodeObject.value.max ? `${currentInfoCodeObject.value.max}` : '';
    currentInfoCodeObject.value.dataTime && (params.value.time = dayjs(currentInfoCodeObject.value.dataTime).format('YYYY.MM.DD HH:mm'));
};

onMounted(() => {
    initData();
});
provide('params', params);
provide('RunningChillerData', RunningChillerData);
provide('coldNum', coldNum);
</script>
<style lang="less">
.control-pop {
    textarea {
        resize: none;
    }
}
</style>
