import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { DETAIL, GROUP_CODE_KEY_MAP, SUCCESSCODE } from '@/utils/globalVariables';
import { currentSystemKey } from '@/views/ACAC/hooks/useBaseHook';
import { listAccRuntimeClass, listInfoCodeConfigsByObjectId } from '@/apis/ACAC';

import { RUNNING_MONITOR_TYPE } from '../variables';

import { INFO_EXTEND_SET, INFO_CODE_SET_EXTEND_CONFIG } from '@/utils/SSEEventTypes';
import dataDockHandling from '@/hooks/dataDockHandling';
import useLoading from '@/hooks/useLoading';
import { sseConsoleClientKey } from './useRightHook';
import DockSingleton from '@/hooks/responsiveDock';

const COOL_STORE_VISIBLE_FIELD = {
    coolingTowerOutTempSet: false,
    coolingTowerOutTempCoolingSet: true,
    coolingTowerOutTempStorageSet: true,
    coolWaterDetaTempSet: false,
    coolingWaterSupplyReturnDiffCoolingSet: true,
    coolingWaterSupplyReturnDiffStorageSet: true,
    storageMainCoolingTempDiffSet: true,
    storageMainStorageTempDiffSet: true,
    dualModeChillerCoolingOutTempSet: true,
    dualModeChillerStorageOutTempSet: true,
    coolReleaseMainSupplyTempSet: true
};
// 系统设置
export default () => {
    const { getAllObjectInfo, setCustomInfo } = DockSingleton.getInstance();

    const { writeDataToResponsiveDock } = dataDockHandling();
    const systemParameterSetData = ref([]);
    const infoCodeMapExtendSet = ref({});
    const automaticResetArr = ref([]);
    const sseConsoleClient = inject(sseConsoleClientKey);
    const currentSystem = inject(currentSystemKey);
    const disabilityAlarmReset = ref({});
    const { openLoading, closeLoading } = useLoading(
        'cold-system-drawer-item',
        '#FFFFFF',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );

    const getTemplateInfoCodes = async () => {
        const params = {
            projectId: baseStore().projectId,
            templateCode: DETAIL,
            objectIds: [currentSystem?.value?.systemId],
            runningMonitorType: RUNNING_MONITOR_TYPE
        };
        try {
            const { data, code } = await listInfoCodeConfigsByObjectId(params);
            if (code === SUCCESSCODE && data.length) {
                writeDataToResponsiveDock(data);
                const systemParameterSet = data[0].relInfoCodeGroupConfigs?.find(obj => obj.groupCode === GROUP_CODE_KEY_MAP.systemParameterSet);
                if (systemParameterSet) {
                    systemParameterSetData.value = systemParameterSet.groupChildren
                        ?.map(obj => {
                            obj.relInfoCodeConfigs = obj.relInfoCodeConfigs?.filter(info => {
                                // 这一层有这种type的信息点，过滤掉（兼容因为它父信息点没有，导致返回到这一层，展示问题）
                                if (info?.infoCodeType === INFO_CODE_SET_EXTEND_CONFIG) {
                                    return false;
                                }
                                if (info.relInfoCodeConfigs?.length) {
                                    info.manualAutoConfig = info.relInfoCodeConfigs[0];
                                    if (!info.manualAutoConfig.dataValue) {
                                        info.manualAutoConfig.dataValue = {
                                            manualAutoSet: 1
                                        };
                                    }
                                    infoCodeMapExtendSet.value[info.infoCode] = info.manualAutoConfig;
                                }
                                if (COOL_STORE_VISIBLE_FIELD.hasOwnProperty(info.infoCode)) {
                                    // 供冷系统有/无蓄冷设备，控制显隐逻辑
                                    return currentSystem?.value?.isShowCoolStore === COOL_STORE_VISIBLE_FIELD[info.infoCode];
                                }
                                return true;
                            });
                            return obj;
                        })
                        .filter(obj => obj.relInfoCodeConfigs?.length > 0);
                }
                const _disabilityAlarmReset = data[0].relInfoCodeGroupConfigs?.find(obj => obj.groupCode === GROUP_CODE_KEY_MAP.disabilityAlarmReset);
                if (_disabilityAlarmReset) {
                    disabilityAlarmReset.value = _disabilityAlarmReset;
                }
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };
    const infoDatas = computed(() => {
        return systemParameterSetData.value?.map(obj => {
            const newObj = toRaw(obj);
            newObj.relInfoCodeConfigs = obj.relInfoCodeConfigs?.map(info => {
                info.manualAutoConfig = infoCodeMapExtendSet.value[info.infoCode];
                return info;
            });
            return newObj;
        });
    });
    const handleInfoExtendSet = res => {
        if (res.data) {
            if (res.data.infoCode) {
                systemParameterSetData.value.forEach(group => {
                    group.relInfoCodeConfigs.forEach(info => {
                        if (info.infoCode === res.data.infoCode) {
                            setCustomInfo(
                                res.data.objectId,
                                { ...info.manualAutoConfig, dataValue: res.data.extendSetting },
                                info.manualAutoConfig.infoCodeType,
                                info.manualAutoConfig.infoCode
                            );
                        }
                    });
                });
            }
        }
    };
    const listAccRuntimeClassFun = async () => {
        automaticResetArr.value = [];
        let res = await listAccRuntimeClass({ projectId: baseStore().projectId, systemId: currentSystem?.value?.systemId, systemClassCode: currentSystem.value.classCode });
        automaticResetArr.value = res.data || [];
    };
    const getAllDataFun = async () => {
        openLoading();
        try {
            await Promise.all([getTemplateInfoCodes(), listAccRuntimeClassFun()]);
        } finally {
            closeLoading();
        }
    };
    onMounted(() => {
        getAllDataFun();
        sseConsoleClient?.addEventListener(INFO_EXTEND_SET, handleInfoExtendSet);
    });
    onBeforeUnmount(() => {
        sseConsoleClient?.removeEventListener(INFO_EXTEND_SET, handleInfoExtendSet);
    });
    return {
        infoDatas,
        automaticResetArr,
        disabilityAlarmReset
    };
};
