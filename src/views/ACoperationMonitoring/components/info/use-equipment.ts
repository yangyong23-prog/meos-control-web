// @ts-ignore
import i18n from '@/localization';
import { Ref, ShallowRef, watch, onUnmounted, onMounted, nextTick, computed, inject, ref } from 'vue';
import { EquipmentNodes, FanList, IOTObject } from '../../types';
import { queryFanAndWaterValveByCoolingTowerId, queryPumpGroupByWaterPump, querySingleAbnormalEventList } from '@/apis/systemDiagram';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { getObjectTag } from '@/apis/airterminalxplantrunmonitor';
import { getRunMode, getSystemRunningConditionInfo, infoCodeMap, setInfoCode, setStateInfoCode } from '../../../ACoperationMonitoring/use-utils';
import { MLoading, useZIndex } from 'meri-plus';
import { isArray } from 'lodash';
import { WebSocketObject } from '../../../ACoperationMonitoring/types';
import { EQSTATUS } from '../../../ACoperationMonitoring/coolVariables';
import { isEdge } from '@/utils/envUtils';
import dataDispatcher from '@/utils/dataDispatcher';
import dayjs from 'dayjs';

import { WebSocketClient } from '@/utils/dataDispatcher/webSocketClient';
const dispatcher = dataDispatcher();
interface InfoCodeItem {
    infoCode: string;
    dataValue: any;
    dataValueName: any;
    dataTime: string;
    linkCodes?: InfoCodeItem[];
}

// 同步主信息点及其关联信息点的实时值和时间。
const updateInfoCodeValue = (data: InfoCodeItem, item: InfoCodeItem) => {
    if (data.infoCode === item.infoCode) {
        item.dataValue = data.dataValue;
        item.dataTime = data.dataTime;
        item.dataValueName = data.dataValueName;
    }
    item.linkCodes?.forEach(link => {
        if (data.infoCode === link.infoCode) {
            console.log('link.dataValue>>>>', link, data);
            link.dataValue = data.dataValue;
            link.dataTime = data.dataTime;
            link.dataValueName = data.dataValueName;
        }
    });
};
export const getFanAndWaterValveByCoolingTowerId = (id: any, systemId: string, callback: { (arr1: any[], arr2: any[]): void; (arg0: any[], arg1: any[]): void }) => {
    let fanListArr: any[] = [],
        waterValveListArr: any[] = [];
    if (isEdge()) {
        queryFanAndWaterValveByCoolingTowerId({ coolingTowerId: id, systemId: systemId }).then((res: any) => {
            if (res.code === SUCCESSCODE) {
                res.data.forEach((item: { classCode: string; children: never[] }) => {
                    if (item.classCode === 'ACCCOF') {
                        fanListArr = [];
                        fanListArr = setFanOrWater(item);
                    }

                    if (item.classCode === 'ACVVEO') {
                        waterValveListArr = [];
                        waterValveListArr = setFanOrWater(item);
                    }
                });
                callback(fanListArr, waterValveListArr);
            }
        });
    }
};
const setFanOrWater = (item: any) => {
    const arr: any[] = [];
    item.children.forEach((val: any) => {
        const infoCodes: any[] = [];
        for (const key in val) {
            if (Object.prototype.hasOwnProperty.call(val, key)) {
                const element = val[key];
                if (element?.infoCode) {
                    infoCodes.push(element);
                }
            }
        }
        arr.push({
            infoCodes: infoCodes.map(infoCodeMap),
            id: val.id,
            name: val.localName,
            classCode: val.classCode,
            states: [],
            stateInfoCode: {
                isAlarm: val.isAlarm
            }
        });
    });
    arr.forEach(fan => {
        const obj: any = {};
        fan.infoCodes.forEach((val: { infoCode: string | number; dataValue: any }) => {
            obj[val.infoCode] = val.dataValue;
        });
        fan.stateInfoCode = structuredClone({ ...fan.stateInfoCode, ...obj });
    });
    return arr;
};
export const useEquipment = (props: any) => {
    const equipmentNode: Ref<any | EquipmentNodes> = ref({});
    const systemId = inject<Ref<string>>('systemId', ref(''));
    const showType = inject<Ref<string>>('showType', ref(''));
    const globalSocket = inject<ShallowRef<WebSocketClient>>('globalSocket');
    const show = ref(false);
    const manualAutoSet = computed(() => equipmentNode.value.stateInfoCode?.manualAutoStatus === '1');
    const fanList = ref<FanList[]>([]);
    const waterValveList = ref<FanList[]>([]);
    const loadingService = ref();
    const loading = ref(true);
    const loadingAbnormal = ref(true);
    const curAbnormalUpdateTime = ref('');
    const showRunSet = ref(false);
    const showRunInfo = ref(false);
    const showBasicInfo = ref(false);
    const expireTime = ref<string>();
    const pump = ref<IOTObject[]>([]);
    const pumpName = ref<string>('');
    const abnormalEventList = ref<any>([]);
    const timer = ref<any>(null);
    const timer1 = ref<any>(null);
    const tagsValue = ref<any>({});
    const state = ref(-1);
    const getEquipmentNode = (status: boolean) => {
        if (status) {
            loading.value = true;
            loadingService.value = MLoading.service({
                target: '.equipment-drawer .m-drawer-container-content',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                background: '#fff',
                loadTextOptions: {
                    text: i18n.global.t('common.loading'),
                    style: {}
                },
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-shadow
        //Eq6101122010170a9427b583431c84c3b5ac36dba443
        getSystemRunningConditionInfo(props.id, systemId.value, data => {
            equipmentNode.value.Iot = {} as any;
            equipmentNode.value.IotTwo = {} as any;
            equipmentNode.value.states = [];
            equipmentNode.value = { ...equipmentNode.value, ...props };
            const baseInfoCode = data.allInfoCode?.find((g: any) => g.groupName === i18n.global.t('meos_control_web.technical_parameters'));
            const runInfoCode = data.allInfoCode?.find((g: any) => g.groupName === i18n.global.t('meos_control_web.operating_parameters'));
            if (baseInfoCode) {
                showBasicInfo.value = true;
                equipmentNode.value.IotTwo.basicInfoCode = baseInfoCode;
            }
            if (runInfoCode) {
                showRunInfo.value = true;
                equipmentNode.value.IotTwo.runInfoCode = runInfoCode;
            }
            if (data.controlInfoCode?.length) {
                showRunSet.value = true;
                setInfoCode(equipmentNode.value.Iot, data.controlInfoCode?.[0] || {}, 'runSetName', 'runSet');
            }
            const arr: IOTObject[] = data.homeInfoCode || [];
            equipmentNode.value.Iot.homeInfos = structuredClone(arr.map(infoCodeMap));
            equipmentNode.value.stateInfoCode = structuredClone(data.extraInfo);
            loadingService.value.destroy();
            loading.value = false;
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-shadow
    //data.dataStatus === 1 && data.invalid === 0 && data.type === 0 && data.webType === 'PARAM_SET'
    const refreshEqFun = (data: any) => {
        if (props.id === data.objectId) {
            // 修改设备状态
            if (EQSTATUS.includes(data.infoCode)) {
                setStateInfoCode(equipmentNode.value, data.infoCode, data.dataValue);
            }
            for (const key in equipmentNode.value.Iot) {
                if (Object.prototype.hasOwnProperty.call(equipmentNode.value.Iot, key)) {
                    if (isArray(equipmentNode.value.Iot[key])) {
                        equipmentNode.value.Iot[key].forEach((item: InfoCodeItem) => {
                            updateInfoCodeValue(data, item);
                        });
                    }
                }
            }
            for (const key in equipmentNode.value.IotTwo) {
                if (equipmentNode.value.IotTwo[key].children?.length) {
                    equipmentNode.value.IotTwo[key].children.forEach((item: any) => {
                        recursion(data, item);
                    });
                } else {
                    equipmentNode.value.IotTwo[key].infoCodes.forEach((item: any) => {
                        updateInfoCodeValue(data, item);
                    });
                }
            }
        } else {
            // 风机阀门
            changeValue(fanList.value, data);
            changeValue(waterValveList.value, data);
        }
    };
    const recursion = (data: any, items: any) => {
        if (items.children?.length) {
            items.infoCodes.forEach((item: any) => {
                updateInfoCodeValue(data, item);
            });
            items.children.forEach((ff: any) => {
                recursion(data, ff);
            });
        } else {
            items.infoCodes.forEach((item: any) => {
                updateInfoCodeValue(data, item);
            });
        }
    };
    const changeValue = (arr: FanList[], data: WebSocketObject) => {
        for (const item of arr) {
            if (item.id === data.objectId) {
                // 修改设备状态
                if (EQSTATUS.includes(data.infoCode)) {
                    setStateInfoCode(item as any, data.infoCode, data.dataValue);
                    return;
                }
                for (const val of item.infoCodes) {
                    if (data.infoCode === val.infoCode) {
                        val.dataValue = data.dataValue;
                        return;
                    }
                }
            }
        }
    };
    //异常列表
    const getSingleAbnormalEventList = () => {
        querySingleAbnormalEventList({ objectId: props.id, systemId: systemId.value, systemClassCode: 'ACCC' }).then((res: any) => {
            loadingAbnormal.value = true;
            if (res.code === SUCCESSCODE) {
                if (res.data?.length) {
                    abnormalEventList.value = res.data;
                    state.value = 1;
                    loadingAbnormal.value = false;
                } else {
                    abnormalEventList.value = [];
                    state.value = 0;
                    loadingAbnormal.value = false;
                }
                curAbnormalUpdateTime.value = dayjs().format('YYYY-MM-DD HH:mm');
            } else {
                abnormalEventList.value = [];
                state.value = 0;
                loadingAbnormal.value = false;
            }
        });
    };
    const getTags = () => {
        getObjectTag({ objectId: props.id }).then(res => {
            if (res.code === SUCCESSCODE) {
                tagsValue.value = res.data;
            }
        });
    };
    const observe = dispatcher.request(globalSocket?.value, getSingleAbnormalEventList);
    const init = () => {
        show.value = true;
        nextTick(() => {
            const header: any = document.querySelector('.layout-header.fcb');
            if (header) {
                header.style.zIndex = useZIndex().nextZIndex();
            }
        });
        if (props.classCode === 'ACOTU') {
            getFanAndWaterValveByCoolingTowerId(props.id, systemId.value, (arr1: any[], arr2: any[]) => {
                fanList.value = arr1;
                waterValveList.value = arr2;
            });
        }
        if (props.classCode === 'ACCCOP' || props.classCode === 'ACCCCP') {
            queryPumpGroupByWaterPump({ systemId: systemId.value, objectId: props.id }).then((res: any) => {
                if (res.code === SUCCESSCODE && res.data) {
                    pumpName.value = res.data.groupName;
                    pump.value = res.data;
                }
            });
        }
        // isEdge()==true边缘端 false云端
        // 监听数据响应
        // dispatcher.isEdge = true;
        getEquipmentNode(true);
        getSingleAbnormalEventList();
        getTags();
        if (isEdge()) {
            getRunMode(props.id, systemId.value, (type, time) => {
                expireTime.value = time;
            });
            observe.response(data => {
                const socketData = data;
                if (dispatcher.isEdge) {
                    // 边缘端数据处理
                    if (socketData.dataStatus === 1 && socketData.invalid === 0 && socketData.type === 0 && socketData.webType === 'PARAM_SET') {
                        // // 过滤掉一些无效数据
                        // // 1, 控返不一致 dataValue 为3 标识超时，数据无效，不做处理
                        // if (socketData.objectId === 'Eq7480382824cd6e2ed36f6941d0bfebc0e6a3b2e621' && socketData.infoCode === 'orderFailAlarm') {
                        //     console.log('socketData>>>>', socketData);
                        // }
                        if (socketData.infoCode === 'orderFailAlarm' && socketData.dataValue === '3') {
                            return;
                        }
                        refreshEqFun(socketData);
                    }
                }
            });
            edgeTimerPolling();
        } else {
            cloudTimerPolling();
        }
    };
    const edgeTimerPolling = () => {
        clearInterval(timer.value);
        timer.value = setInterval(() => {
            getSingleAbnormalEventList();
        }, 60000);
    };
    const cloudTimerPolling = () => {
        clearInterval(timer1.value);
        timer1.value = setInterval(() => {
            getSingleAbnormalEventList();
            getEquipmentNode(false);
        }, 60000);
    };
    onMounted(() => {
        init();
    });
    onUnmounted(() => {
        observe.dispose();
        clearInterval(timer.value);
        timer.value = null;
        clearInterval(timer1.value);
        timer1.value = null;
    });
    watch(
        () => props.id,
        () => {
            init();
        }
    );
    // watch(abnormalListData, () => {
    //     clearInterval(timer);
    //     getAbnormalEventList();
    //     timerInfo();
    // });
    return {
        show,
        systemId,
        manualAutoSet,
        fanList,
        waterValveList,
        equipmentNode,
        loading,
        showRunSet,
        showBasicInfo,
        showRunInfo,
        expireTime,
        showType,
        pumpName,
        pump,
        abnormalEventList,
        loadingAbnormal,
        state,
        tagsValue,
        curAbnormalUpdateTime
    };
};
