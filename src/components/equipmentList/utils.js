import DockSingleton from '@/hooks/responsiveDock';
import { BATCH_MANUAUTO_TYPE } from './variables';
import { INFO_CODE, IOT_SETTING, IS_MANUAL, IS_AUTO } from '@/utils/globalVariables';
import { isUnrelatedToManualAutoSet } from '@/components/ObjectInfoComponents/utils';

const { getIotData } = DockSingleton.getInstance();

const juddgeIntervention = (objId, code) => {
    const infoData = getIotData(objId, code);
    return !!infoData?.additionalMapValue?.recoveryDateTime;
};
const getManuautoStatusVal = objId => {
    const infoData = getIotData(objId, INFO_CODE.manualAutoStatus.infoCode);
    return infoData?.dataValue;
};

// 获取批量勾选，按钮列表
export const getBatchBtnInfoList = (selEquipList, columns, manualAutoSetControl) => {
    const infoCache = {};

    const cacheInfo = item => {
        if (!infoCache[item.infoCode]) {
            infoCache[item.infoCode] = {
                sortNum: Object.keys(infoCache)?.length ?? 0,
                data: item
            };
        }
    };
    const deal = node => {
        if (node.children?.length > 0) {
            node.children.forEach(c => {
                deal(c);
            });
        } else {
            // 是iot设定信息点的
            if (node.infoCodeType === IOT_SETTING) {
                cacheInfo(node);
            } else if (node.relInfoCodeConfigs) {
                node.relInfoCodeConfigs.forEach(n => deal(n));
            }
        }
    };
    columns.forEach(n => {
        deal(n);
    });
    const arr = Object.values(infoCache)
        ?.sort((a, b) => {
            if (a.data?.infoCode === INFO_CODE.manualAutoSet.infoCode || b.data?.infoCode === INFO_CODE.manualAutoSet.infoCode) {
                return 1;
            }
            return a.sortNum - b.sortNum;
        })
        ?.map(obj => obj.data)
        .filter(info => {
            // 过滤所选设备，此信息点有规则的
            const hasRule = selEquipList.some(obj => {
                // 如果需要判断手自动设置逻辑，并且当前信息点不是手自动设置，则需要判断当前设备的手自动状态，只有在手动状态下才显示；如果不需要判断手自动设置逻辑，或者当前信息点是手自动设置，则直接根据是否有规则来判断
                // 过滤掉与手自动设定无关的设定参数
                if (manualAutoSetControl && info.infoCode !== INFO_CODE.manualAutoSet.infoCode && !isUnrelatedToManualAutoSet(info)) {
                    const isManual = getIotData(obj.id, INFO_CODE.manualAutoSet.infoCode).dataValue === IS_MANUAL;
                    return isManual && getIotData(obj.id, info.infoCode)?.existsIotRule === true;
                } else {
                    return getIotData(obj.id, info.infoCode)?.existsIotRule === true;
                }
            });
            return hasRule;
        });
    let hasManualStatus = false,
        hasAutoStatus = false,
        batchManuautoType = BATCH_MANUAUTO_TYPE.NONE,
        hasIntervention = false;
    selEquipList?.forEach(obj => {
        if (!hasManualStatus) {
            // 有手动状态
            hasManualStatus = getManuautoStatusVal(obj.id) === IS_MANUAL;
        }
        if (!hasAutoStatus) {
            // 有自动状态
            hasAutoStatus = getManuautoStatusVal(obj.id) === IS_AUTO;
        }
        arr?.forEach(info => {
            // 判断除手自动设定信息点之外的设定参数有干预(时间)
            if (info.infoCode !== INFO_CODE.manualAutoSet.infoCode) {
                if (!hasIntervention) {
                    hasIntervention = juddgeIntervention(obj.id, info.infoCode);
                }
            }
        });
    });
    if (hasManualStatus && hasAutoStatus) {
        batchManuautoType = BATCH_MANUAUTO_TYPE.MANU_AND_AUTU;
    } else if (hasManualStatus) {
        batchManuautoType = BATCH_MANUAUTO_TYPE.ONLY_MANU;
    } else if (hasAutoStatus) {
        batchManuautoType = BATCH_MANUAUTO_TYPE.ONLY_AUTU;
    }
    console.log('arr: ', infoCache, arr);
    return {
        btnList: arr,
        hasIntervention,
        batchManuautoType
    };
};
