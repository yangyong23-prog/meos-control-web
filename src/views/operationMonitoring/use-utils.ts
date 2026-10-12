// @ts-ignore
import i18n from '@/localization';
/* eslint-disable */
import { EquipmentNodes, IOTObject, SystemRunningConditionInfo } from './types';
import { queryInfoCodeConfigByObjectIds, queryRunMode } from '@/apis/systemDiagram';
import { EMPTYTEXT, SUCCESSCODE } from '@/utils/globalVariables';
import { HASONLIEANDRUNSTATUS, HASRCRUNSTATUS, HASRUNSTATUS, ONLYONLIE, ONLYRUNSTATUS } from './coolVariables';
import dayjs from 'dayjs';
import { isArray, toNumber } from 'lodash';
import { decimalsForJudgment } from '@/utils/tools';
import emitter from '@/utils/bus';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { useShellPrecisionConfig } from '@/hooks/useShellPrecisionConfig';
export const interval = (item: IOTObject) => {
    const type = typeof item.min !== 'undefined' && typeof item.max !== 'undefined';
    return type ? `${item.min || '--'}~${item.max || '--'}${item.unit}` : false;
};
export const validateNumber = (rule: any, value: number | string, callback: any) => {
    // eslint-disable-next-line prefer-template
    if (decimalsForJudgment(value as number) > 1) {
        callback(new Error(i18n.global.t('meos_control_web.max_one_decimal_allowed')));
    } else {
        callback();
    }
};
export const rules = (item: IOTObject) => {
    const arr = interval(item)
        ? [
              { type: 'number', required: true, message: EMPTYTEXT, trigger: 'blur' },
              {
                  type: 'number',
                  min: toNumber(item.min),
                  max: toNumber(item.max),
                  message: i18n.global.t('meos_control_web.only_support_interval_value', { interval: interval(item) }),
                  trigger: ['blur']
              },
              { validator: validateNumber, trigger: ['blur', 'change'] }
          ]
        : [
              { type: 'number', required: true, message: EMPTYTEXT, trigger: 'blur' },
              { validator: validateNumber, trigger: ['blur', 'change'] }
          ];

    return arr;
};
const statusCode = [
    'offline',
    'default',
    'close',
    'closing',
    'opening',
    'running',
    'offlineSelect',
    'defaultSelect',
    'closeSelect',
    'closingSelect',
    'openingSelect',
    'runningSelect'
];
export const getSystemRunningConditionInfo = async (id: string[] | string, systemId: string, callback: (arg0: any) => void) => {
    await queryInfoCodeConfigByObjectIds({ objectIds: isArray(id) ? id : [id], systemId }).then((res: any) => {
        if (res.code === SUCCESSCODE) {
            if (isArray(id)) {
                callback(res.data || {});
            } else {
                callback(res.data[id] || {});
            }
        }
    });
};
export const getRunMode = (objectId: string, systemId: string, callback: (arg0: boolean, arg1?: string) => void) => {
    if (isEdge()) {
        queryRunMode({ objectId, systemId }).then((res: any) => {
            if (res.code === SUCCESSCODE) {
                // eslint-disable-next-line n/no-callback-literal
                callback(res.data.manualAutoSet === '1', res.data.expireTime);
            }
        });
    }
};
export const setInfoCode = (Iot: any, data: any, name: string, code: string) => {
    Iot[name] = data.groupName;
    if (data.infoCodes?.length) {
        Iot[code] = data.infoCodes?.map(infoCodeMap);
    } else if (data.children?.length) {
        Iot[code] = data.children[0].infoCodes?.map(infoCodeMap);
    }
    Iot[code] = Iot[code]?.sort((aa: { ordered: number }, bb: { ordered: number }) => aa.ordered - bb.ordered);
};
export const setState = (data: EquipmentNodes, state: string, states: string[], type: boolean = true) => {
    if (type) {
        states?.push(state);
    }
    if (statusCode.includes(state)) {
        if (data.initData) {
            data.initData.setState(state, type);
        }
    }
};
export const infoCodeMap = (val: any) => {
    val.dataValue = val.dataValue || null;
    val.createTime = dayjs(val.createTime).format('YYYY.MM.DD HH:mm:ss');
    if (val.dataSource) {
        val.dataSource = val.dataSource?.sort((aa: { code: number }, bb: { code: number }) => bb.code * 1 - aa.code * 1);
    }
    return structuredClone(val);
};

export const setStateInfoCode = (item: EquipmentNodes, infoCode: string, value: any) => {
    try {
        if (infoCode === 'runStatus' && !HASRCRUNSTATUS().includes(item.data?.dataObject?.classCode || item.classCode)) {
            infoCode = 'rcRunStatus';
        }
    } catch (error) {
        console.log(item);
    }

    if (item.stateInfoCode) {
        const states: string[] = item.initData?.getStates() || [];
        states.forEach(val => {
            item.initData.setState(val, false);
        });
        item.stateInfoCode[infoCode] = value;
    }
};
// 在线状态和运行状态都存在时
const hasOnlieAndRunStatus = (item: EquipmentNodes, states: string[]) => {
    if (item.stateInfoCode.onlineStatus !== '1') {
        setState(item, 'offline', states);
        if (item.stateInfoCode.select) {
            setState(item, 'offlineSelect', states);
        }
    } else {
        if (!item.stateInfoCode.runStatus) {
            setState(item, 'offline', states);
            if (item.stateInfoCode.select) {
                setState(item, 'offlineSelect', states);
            }
        } else {
            if (!item.stateInfoCode.rcRunStatus) {
                item.stateInfoCode.rcRunStatus = item.stateInfoCode.runStatus;
            }
            if (item.stateInfoCode.rcRunStatus === '-1') {
                setState(item, 'offline', states);
                if (item.stateInfoCode.select) {
                    setState(item, 'offlineSelect', states);
                }
            }
            if (item.stateInfoCode.rcRunStatus === '1') {
                setState(item, 'default', states);
                if (item.stateInfoCode.select) {
                    setState(item, 'defaultSelect', states);
                }
            }
            if (item.stateInfoCode.rcRunStatus === '0') {
                setState(item, 'close', states);
                if (item.stateInfoCode.select) {
                    setState(item, 'closeSelect', states);
                }
            }
            if (item.stateInfoCode.rcRunStatus === '2') {
                setState(item, 'opening', states);
                if (item.stateInfoCode.select) {
                    setState(item, 'openingSelect', states);
                }
            }
            if (item.stateInfoCode.rcRunStatus === '3') {
                setState(item, 'closing', states);
                if (item.stateInfoCode.select) {
                    setState(item, 'closingSelect', states);
                }
            }
            setState(item, 'online', states);
        }
    }
};
// 只有在线状态
const onlyOnlie = (item: EquipmentNodes, states: string[]) => {
    if (item.stateInfoCode.onlineStatus === '1') {
        setState(item, 'default', states);
        if (item.stateInfoCode.select) {
            setState(item, 'defaultSelect', states);
        }
    } else if (item.stateInfoCode.onlineStatus === '0') {
        setState(item, 'offline', states);
        if (item.stateInfoCode.select) {
            setState(item, 'offlineSelect', states);
        }
    }
};
// 只有运行状态
const onlyRunStatus = (item: EquipmentNodes, states: string[]) => {
    if (!item.stateInfoCode.runStatus) {
        setState(item, 'offline', states);
        if (item.stateInfoCode.select) {
            setState(item, 'offlineSelect', states);
        }
    } else {
        if (!item.stateInfoCode.rcRunStatus) {
            item.stateInfoCode.rcRunStatus = item.stateInfoCode.runStatus;
        }
        if (item.stateInfoCode.rcRunStatus === '1') {
            setState(item, 'default', states);
            if (item.stateInfoCode.select) {
                setState(item, 'defaultSelect', states);
            }
        }
        if (item.stateInfoCode.rcRunStatus === '0') {
            setState(item, 'close', states);
            if (item.stateInfoCode.select) {
                setState(item, 'closeSelect', states);
            }
        }
        if (item.stateInfoCode.rcRunStatus === '2') {
            setState(item, 'opening', states);
            if (item.stateInfoCode.select) {
                setState(item, 'openingSelect', states);
            }
        }
        if (item.stateInfoCode.rcRunStatus === '3') {
            setState(item, 'closing', states);
            if (item.stateInfoCode.select) {
                setState(item, 'closingSelect', states);
            }
        }
        setState(item, 'online', states);
    }
};
// 电动通断水阀单独设置
const setACVVEO = (item: EquipmentNodes, states: string[]) => {
    try {
        if (item.stateInfoCode) {
            // 0 否 1 是
            if (item.stateInfoCode.isAlarm === 1) {
                setState(item, 'alarm', states);
            }
            // [{code: "0", name: "本地"}, {code: "1", name: "远程"}]
            if (item.stateInfoCode.localRemoteStatus === '0') {
                setState(item, 'local', states);
            } else if (item.stateInfoCode.localRemoteStatus === '1') {
                setState(item, 'remote', states);
            }
            // [{code: "0", name: "手动"}, {code: "1", name: "自动"}]
            if (item.stateInfoCode.manualAutoStatus === '0') {
                setState(item, 'manual', states);
            } else if (item.stateInfoCode.manualAutoStatus === '1') {
                setState(item, 'auto', states);
            }
            if (false) {
            } else {
                if (!item.stateInfoCode.switchStatus) {
                    setState(item, 'offline', states);
                    if (item.stateInfoCode.select) {
                        setState(item, 'offlineSelect', states);
                    }
                } else {
                    if (item.stateInfoCode.switchStatus === '1') {
                        setState(item, 'default', states);
                        if (item.stateInfoCode.select) {
                            setState(item, 'defaultSelect', states);
                        }
                    }
                    if (item.stateInfoCode.switchStatus === '2') {
                        setState(item, 'close', states);
                        if (item.stateInfoCode.select) {
                            setState(item, 'closeSelect', states);
                        }
                    }
                    if (item.stateInfoCode.switchStatus === '3') {
                        setState(item, 'running', states);
                        if (item.stateInfoCode.select) {
                            setState(item, 'runningSelect', states);
                        }
                    }
                    setState(item, 'online', states);
                }
            }
        }
    } catch (error) {}
};
export const setStateFun = (item: EquipmentNodes, classCode: string) => {
    const states: string[] = [];
    if (HASRUNSTATUS().includes(classCode)) {
        // [{code: "0", name: "离线"}, {code: "1", name: "在线"}]
        // 离线无数据：
        // 1:设备的在离线判断的信息点值为离线或者值为空
        // 2:设备的在离线判断为在线，但是运行状态判断的信息点未获取到数据
        try {
            console.log(item.stateInfoCode, 'item.stateInfoCode');
            if (item.stateInfoCode) {
                // 0 否 1 是
                if (item.stateInfoCode.isAlarm === 1) {
                    setState(item, 'alarm', states);
                }
                // [{code: "0", name: "正常"}, {code: "1", name: "故障"}]
                if (item.stateInfoCode.faultStatus === '1') {
                    setState(item, 'fault', states);
                }
                // [{code: "0", name: "本地"}, {code: "1", name: "远程"}]
                if (item.stateInfoCode.localRemoteStatus === '0') {
                    setState(item, 'local', states);
                } else if (item.stateInfoCode.localRemoteStatus === '1') {
                    setState(item, 'remote', states);
                }
                // [{code: "0", name: "手动"}, {code: "1", name: "自动"}]
                if (item.stateInfoCode.manualAutoStatus === '0') {
                    setState(item, 'manual', states);
                } else if (item.stateInfoCode.manualAutoStatus === '1') {
                    setState(item, 'auto', states);
                }
                if (HASONLIEANDRUNSTATUS().includes(classCode)) {
                    hasOnlieAndRunStatus(item, states);
                }
                if (ONLYONLIE().includes(classCode)) {
                    onlyOnlie(item, states);
                }
                if (ONLYRUNSTATUS().includes(classCode)) {
                    onlyRunStatus(item, states);
                }
            }
        } catch (error) {
            console.log(error);
        }
    } else if (classCode === 'ACVVEO') {
        setACVVEO(item, states);
    }
    return states;
};
export const getState = computed(() => setStateFun);

export const setRunningMonitorType = (classCode: string) => {
    if (isEdge()) return;
    let runningMonitorType = '';
    console.log('classCode', classCode);
    switch (classCode) {
        case 'ACCC':
            runningMonitorType = 'COLD_SOURCE';
            break;
        case 'ACCI':
            runningMonitorType = 'COLD_HEAT_SOURCE';
            break;
        default:
            runningMonitorType = '';
            break;
    }
    baseStore().setHeaderConfig({ runningMonitorType });
    if (runningMonitorType) {
        useShellPrecisionConfig().fetchShellPrecisionConfig();
    }
};
