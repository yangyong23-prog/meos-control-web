<template>
    <m-form ref="Mform" label-width="200px" :model="params" label-position="top" require-asterisk-position="right">
        <template v-for="item in currentInfoCodeObject.components" :key="item">
            <component :is="components[item]" />
        </template>
        <div style="text-align: right; padding-top: 6px">
            <m-button size="small" style="margin-right: 12px" @click="cancel(false)">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button id="commandExecuteByBatch" type="primary" size="small" @click="sumbit">{{ i18n.global.t('meos_control_web.submit') }}</m-button>
        </div>
    </m-form>
</template>

<script lang="ts" setup>
import { commandExecuteByBatch, getRunningChillerData } from '@/apis/systemDiagram';
import { Params } from '../../types';
import { Ref } from 'vue';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { IOTObject } from '@/views/systemDiagram/types';
import EndTime from './formComponents/EndTime.vue';
import ColderNumber from './formComponents/ColderNumber.vue';
import ParamsSet from './formComponents/ParamsSet.vue';
import Reason from './formComponents/Reason.vue';
import { getCooler } from '@/apis/strategic';
import dayjs from 'dayjs';
import { useSuccessMessage } from '@/utils/tools';
import { isNil } from 'lodash';
import emitter from '@/utils/bus';
import i18n from '@/localization';

const emits = defineEmits(['cancel', 'sumbit']);
const Mform = ref<any>(null);
const params = ref<Params>({
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
const paramsPlan: Record<string, any> = {
    sysSwitchSet: 'sysSwitchSet',
    enableCtrl: 'enableCtrl',
    chillerLNum: 'max',
    chillerSNum: 'min',
    chillWaterOutTempSet: 'data',
    chillWaterDetaPressSet: 'data',
    chillWaterDetaTempSet: 'data',
    branchDetaTempSet: 'data',
    branchDetaPressSet: 'data',
    worstTerminalDetaPressSet: 'data'
};
const coldNum = ref<any>({});
// 区分冷战控制还是末级泵组控制
// const TempTimeStrategy: 'TempTimeStrategy' | 'ChillerTempTimeStrategy' = inject(
//   'TempTimeStrategy',
//   'ChillerTempTimeStrategy'
// )
// 系统id
const systemId: Ref<string> = inject('systemId', ref(''));
// 当前选中的信息点对象
const currentInfoCodeObject: Ref<IOTObject> = inject('currentInfoCodeObject')!;
const isSizingMachine: any = inject('isSizingMachine');
// 真实运行的冷机参数
const RunningChillerData = ref<any>({
    runningChillerLNum: 0,
    runningChillerSNum: 0,
    ratedCoolMax: 0,
    ratedCoolMin: 0
});
const sumbit = () => {
    Mform.value.validate((valid: boolean) => {
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
            commandExecuteByBatch(data).then(res => {
                if (res.code === SUCCESSCODE) {
                    emitter.emit('refreshNotify', 'query');
                    useSuccessMessage();
                    cancel(true);
                }
            });
        }
    });
};
const setParams = () => {
    const paramsOld: Record<string, any> = structuredClone(params.value);
    const data: Record<string, any> = {};
    currentInfoCodeObject.value.strategyPlan.forEach((element: string) => {
        if (paramsPlan[element]) {
            data[element] = paramsOld[paramsPlan[element]];
        }
    });
    if (isSizingMachine.value) {
        data.chillerSNum = 0;
    }
    return data;
};
const cancel = (type = false) => {
    emits('cancel', type);
};
const getRunningChiller = () => {
    getRunningChillerData({ systemId: systemId.value }).then((res: any) => {
        if (res.code === SUCCESSCODE && res.data) {
            RunningChillerData.value.ratedCoolMax = res.data.ratedCoolMax;
            RunningChillerData.value.ratedCoolMin = res.data.ratedCoolMin;
            RunningChillerData.value.runningChillerLNum = res.data.runningChillerLNum;
            RunningChillerData.value.runningChillerSNum = res.data.runningChillerSNum;
        }
    });
};
const getCoolerNum = () => {
    getCooler({ systemId: systemId.value }).then((res: any) => {
        if (res.code === SUCCESSCODE && res.data) {
            coldNum.value = res.data;
        }
    });
};
const components = ref<Record<string, typeof Reason>>({ Reason, EndTime, ColderNumber, ParamsSet });
const initData = () => {
    // input值
    if (currentInfoCodeObject.value.infoCode !== 'sysSwitchSet' && currentInfoCodeObject.value.infoCode !== 'enableCtrl') {
        params.value.data = currentInfoCodeObject.value.dataValue;
    }
    params.value.min = !isNil(currentInfoCodeObject.value.min) ? `${currentInfoCodeObject.value.min}` : '';
    params.value.max = !isNil(currentInfoCodeObject.value.max) ? `${currentInfoCodeObject.value.max}` : '';
    currentInfoCodeObject.value.dataTime && (params.value.time = dayjs(currentInfoCodeObject.value.dataTime).format('YYYY.MM.DD HH:mm'));
};

onMounted(() => {
    getRunningChiller();
    getCoolerNum();
    initData();
});
provide('params', params);
provide('RunningChillerData', RunningChillerData);
provide('coldNum', coldNum);
</script>
<style lang="less" scoped></style>
<style lang="less">
.control-pop {
    textarea {
        resize: none;
    }
}
</style>
