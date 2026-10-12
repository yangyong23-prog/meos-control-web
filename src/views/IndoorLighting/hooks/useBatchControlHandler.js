// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { $Message } from 'meri-plus';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { getNextFiveMinutePoint, useSuccessMessage } from '@/utils/tools';
import DockSingleton from '@/hooks/responsiveDock';
import { useGeneralControl } from '@/hooks/useGeneralControl';

import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
import { INTERVENTION_TIME_V2, REASON } from '@/components/ObjectInfoComponents/ControlForm/config';

export default () => {
    const isExecIng = ref(false);
    const showErrorList = ref(false);
    const errorList = ref([]);

    const { getIotData, setIotData } = DockSingleton.getInstance();
    const virtualRef = ref(null);
    const isControlOpen = ref(false);
    const formList = ref([]);
    const curInfoCode = ref(null);
    const curObjectIds = ref(null);
    const { controlFn, releaseIntervention, executeCircuitDemand } = useGeneralControl();
    const openForm = (e, item, objectIds) => {
        // console.log('openForm--e, item: ', e, item);

        emitter.emit(CLOSE_CONTROL_FORM, { needClose: true });

        formList.value = [];
        curObjectIds.value = objectIds;
        isControlOpen.value = false;
        virtualRef.value = e;
        curInfoCode.value = item;
        const hasAuto = objectIds?.some(objId => {
            const info = getIotData(objId, 'manualAutoSet');
            return info.dataValue === '1';
        });

        const spoce = `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(1, 'year').format('YYYY.MM.DD HH:mm:00')}`;
        // 开关设定时，要看是自动的情况下才有结束时间
        formList.value.push(
            INTERVENTION_TIME_V2(
                spoce,
                undefined,
                { scopeDisabledTipsText: i18n.global.t('meos_control_web.only_1_year_range_allowed') },
                {
                    useLongterm: false,
                    scopeDisabledTipsText: i18n.global.t('meos_control_web.only_1_year_range_allowed')
                }
            )
        );

        formList.value.push(REASON());

        nextTick(() => {
            isControlOpen.value = true;
        });
    };
    const closeForm = () => {
        isControlOpen.value = false;
        virtualRef.value = null;
        curInfoCode.value = {};
        formList.value = [];
    };
    const handleSubmit = async (data, fn) => {
        console.log('data: ', data, curInfoCode.value);
        const params = {
            objectIds: curObjectIds.value,
            infoCode: curInfoCode.value.infoCode,
            infoValue: curInfoCode.value.dataValue,
            model: data[curInfoCode.value.infoCode],
            ...data
        };

        params.expireTime = params.expireTime ? dayjs(params.expireTime).format('YYYYMMDDHHmmss') : '';
        if (['manualAutoSet', 'manualAutoStatus'].includes(params.infoCode)) {
            params.content = data.content || '';
        }
        try {
            const cmdName = curInfoCode.value?.dataSource?.find(obj => obj.code === curInfoCode.value.dataValue)?.name;

            const infoCodeText = i18n.global.t('meos_control_web.info_code_text', {
                cmdName: cmdName ?? ''
            });
            await controlFn({
                data: params,
                callback: res => {
                    const { code, data: resData } = res;
                    if (code === SUCCESSCODE) {
                        useSuccessMessage(
                            i18n.global.t('meos_control_web.batch_control_message6', {
                                length: params.objectIds.length,
                                infoCodeText: infoCodeText
                            })
                        );
                    } else if (code === 'A0400') {
                        let title = '';
                        // 部分失败
                        if (resData.failureNum !== resData.allCount) {
                            title = i18n.global.t('meos_control_web.batch_control_message7', {
                                successCount: resData.successCount,
                                infoCodeText: infoCodeText,
                                failureNum: resData.failureNum
                            });
                        } else {
                            title = title = i18n.global.t('meos_control_web.batch_control_message8', {
                                allCount: resData.allCount,
                                infoCodeText: infoCodeText
                            });
                        }
                        $Message.error({
                            title,
                            showClose: true,
                            duration: 3000,
                            button: i18n.global.t('meos_control_web.view_detail'),
                            buttonClick: () => {
                                errorList.value = resData.errorCountObject || [];
                                showErrorList.value = true;
                            }
                        });
                    }
                },
                needMessage: false,
                autoHandleError: false
            });

            fn();
        } catch (error) {
            fn();
            console.log(error);
        } finally {
            curObjectIds.value = [];
        }
    };

    const batchReleaseInterventionFun = objectIds => {
        let params = {
            objectIds,
            infoCode: 'equipSwitchSet'
        };
        releaseIntervention(params, res => {
            if (res.code === SUCCESSCODE) {
                useSuccessMessage();
            }
        }).then();
    };
    /**
     * (批量)按需求关闭
     * @param {*} objectIds
     * @param {*} templateType
     * @param {*} val  CLOSE/OPEN
     */
    const batchOpenCloseByDemandFun = (objectIds, templateType, val) => {
        let params = {
            templateType,

            time: getDayjsTz().format('YYYYMMDDHHmmss'),
            forcibleExecution: true,
            circuitSettingModeMap: objectIds.reduce((acc, id) => ({ ...acc, [id]: val }), {})
        };
        executeCircuitDemand(params, res => {
            if (res.code === SUCCESSCODE) {
                useSuccessMessage();
            }
        }).then();
    };

    return { handleSubmit, openForm, batchReleaseInterventionFun, batchOpenCloseByDemandFun, closeForm, isControlOpen, virtualRef, formList, showErrorList, errorList };
};
