import i18n from '@/localization';
import {
    batchCommandSend,
    changeInfoCodeExpireTime,
    clearAccRuntimeClass,
    commandExecuteChangeManualAutoStatus,
    commandExecuteReleaseIntervention,
    commandExecuteCircuitDemand,
    batchCommandSendBySingleObject,
    resetMultiObjectDatas,
    batchAutoCommandSendBySingleObject,
    batchObjectCommandSend
} from '@/apis/common';
import { GET_MENU_CONFIG, IS_AUTO, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import dayjs from 'dayjs';
import { $Message } from 'meri-plus';

export const useGeneralControl = () => {
    // 手自动控制参数
    const manualInfoCodes = ['manualAutoSet', 'manualAutoStatus'];
    // 新接口需要的参数
    const newKeys = ['objectIds', 'infoValue', 'expireTime', 'content', 'systemId'];
    const axiosParamsKeys = ref([]);
    const errorList = ref([]);
    const showErrorList = ref(false);
    const axiosFn = data => {
        let params = data,
            fn;
        fn = manualInfoCodes.includes(data.infoCode) ? commandExecuteChangeManualAutoStatus : batchCommandSend;
        if (manualInfoCodes.includes(data.infoCode)) {
            // if (data.infoValue === IS_AUTO) {
            //     data.content = '';
            // }
            newKeys.push('oneClick');
        } else {
            newKeys.push('infoCode');
        }
        axiosParamsKeys.value = newKeys;
        params = {
            ...data,
            objectIds: data.objectIds,
            infoCode: data.infoCode,
            infoValue: data.infoValue
        };
        params.expireTime = data.expireTime ? dayjs(data.expireTime).format('YYYY-MM-DD HH:mm:ss') : '';
        return { fn, params };
    };

    /**
     * @description: 生成axios请求参数
     * @param {*} data {
    	objectIds: [],
     	systemId?: '',
    	expireTime: ',
    	infoValue: '',
    	content?: '',
    	infoCode: '',
    	oneClick?: false
    }
     * @param {*} callback
     * @return {*}
     */
    const controlFn = async ({ data, callback, needMessage = false, autoHandleError = true }) => {
        setModelType(data);
        const { fn, params } = axiosFn(data);
        // 删除多余参数
        for (const key of Object.keys(params)) {
            if (!axiosParamsKeys.value.includes(key)) {
                delete params[key];
            }
        }
        try {
            const res = await fn(params, autoHandleError);
            const { code } = res;
            if (needMessage) {
                if (code === SUCCESSCODE) {
                    useSuccessMessage(
                        i18n.global.t('meos_control_web.general_control_message3', {
                            successCount: res.data?.successCount,
                            name: data.valueName || ''
                        })
                    );
                } else if (code === 'A0400') {
                    let title = '';
                    // 部分失败
                    if (res.data?.failureNum !== res.data?.allCount) {
                        title = i18n.global.t('meos_control_web.general_control_message1', {
                            successCount: res.data?.successCount,
                            failureNum: res.data?.failureNum,
                            name: data.valueName || ''
                        });
                    } else {
                        title = i18n.global.t('meos_control_web.general_control_message2', {
                            allCount: res.data?.allCount,
                            name: data.valueName || ''
                        });
                    }

                    $Message.error({
                        title,
                        showClose: true,
                        duration: 3000,
                        button: i18n.global.t('meos_control_web.view_detail'),
                        buttonClick: () => {
                            errorList.value = res.data.errorCountObject || [];
                            showErrorList.value = true;
                        }
                    });
                } else {
                    $Message.error({
                        title: res.message
                    });
                }
            }
            if (callback) {
                callback?.(res);
                return;
            }

            if (code === SUCCESSCODE) {
                useSuccessMessage();
            }
        } catch (error) {
            console.log(error);
            callback?.(error);
        }
    };
    /**
     * 单对象批量控制函数
     * 用于处理单个对象的批量命令发送操作，并支持回调函数执行
     * @param {Object} params - 函数参数对象
     * @param {*} params.data {
					"objectId": "string",
					"systemId": "string",
					"commandParams": "{ infoCode: string, infoValue: string }[]",
					"content": "string"
				} - 需要处理的数据，将用于设置模型类型和批量命令发送
     * @param {Function} [params.callback] - 可选的回调函数，在操作完成后执行
     * @returns {Promise<*>} 返回批量命令发送的结果或捕获的错误
     */
    const singleObjectBatchControlFn = async ({ data, callback }) => {
        setModelType(data);
        try {
            const res = await batchCommandSendBySingleObject(data);
            callback?.(res);
            return res;
        } catch (error) {
            callback?.(error);
            return error;
        }
    };

    /**
     * 多对象批量控制函数
     * 用于处理单个对象的批量命令发送操作，并支持回调函数执行
     * @param {Object} params - 函数参数对象
     * @param {*} params.data {
					"objectId": "string",
					"systemId": "string",
					"commandParams": "{ infoCode: string, infoValue: string }[]",
					"content": "string"
				} - 需要处理的数据，将用于设置模型类型和批量命令发送
     * @param {Function} [params.callback] - 可选的回调函数，在操作完成后执行
     * @returns {Promise<*>} 返回批量命令发送的结果或捕获的错误
     */
    const multiObjectBatchControlFn = async ({ data, callback }) => {
        setModelType(data);
        try {
            const res = await batchObjectCommandSend(data);
            callback?.(res);
            return res;
        } catch (error) {
            callback?.(error);
            return error;
        }
    };

    /**
     * 单对象批量控制函数
     * 用于处理单个对象的批量命令发送操作，并支持回调函数执行
     * @param {Object} params - 函数参数对象
     * @param {*} params.data {
					"objectId": "string",
					"systemId": "string",
					"commandParams": "{ infoCode: string, infoValue: string }[]",
					"content": "string"
				} - 需要处理的数据，将用于设置模型类型和批量命令发送
     * @param {Function} [params.callback] - 可选的回调函数，在操作完成后执行
     * @returns {Promise<*>} 返回批量命令发送的结果或捕获的错误
     */
    const batchAutoCommandSendBySingleObjectFn = async ({ data, callback }) => {
        setModelType(data);
        try {
            const res = await batchAutoCommandSendBySingleObject(data);
            callback?.(res);
            return res;
        } catch (error) {
            callback?.(error);
            return error;
        }
    };
    /**
     * @description: 释放干预
     * @param {*} data {
			"objectIds": [
				"string"
			],
			"systemId": "string",
			"infoCode": "string",
			"content": "string"
		}
	 * @param {*} callback
     * @return {*}
     */
    const releaseIntervention = async (data, callback) => {
        setModelType(data);
        try {
            const res = await commandExecuteReleaseIntervention(data);
            callback?.(res);
            return res;
        } catch (error) {
            callback?.(error);
            return error;
        }
    };
    /**
     * @description: 修改信息点的干预截止时间
     * @param {*} data
	 * {
		"projectId": "string",
		"systemId": "string",
		"objectId": "string",
		"infoCode": "string",
		"expireTime": "string",
		"content": "string"
	}
	 * @param {*} callback
     * @return {*}
     */
    const changeInfoCodeExpireTimeFn = async (data, callback) => {
        setModelType(data);
        try {
            const res = await changeInfoCodeExpireTime(data);
            callback?.(res);
            return res;
        } catch (error) {
            callback?.(error);
            return error;
        }
    };
    const clearAccRuntimeClassFn = async (data, callback) => {
        setModelType(data);
        try {
            const res = await clearAccRuntimeClass(data);
            callback?.(res);
            return res;
        } catch (error) {
            callback?.(error);
            return error;
        }
    };
    const setModelType = data => {
        if (data?.systemId) {
            sessionStorage.setItem('modelType', data.systemId);
        } else {
            sessionStorage.setItem('modelType', window[GET_MENU_CONFIG]?.()?.PRODUCT_CODE || '');
        }
    };
    const executeCircuitDemand = async (data, callback) => {
        setModelType(data);
        try {
            const res = await commandExecuteCircuitDemand(data);
            callback?.(res);
            return res;
        } catch (error) {
            callback?.(error);
            return error;
        }
    };
    const resetMultiObjectDatasFn = async (data, callback) => {
        setModelType(data);
        try {
            const res = await resetMultiObjectDatas(data);
            callback?.(res);
            return res;
        } catch (error) {
            callback?.(error);
            return error;
        }
    };
    return {
        errorList,
        showErrorList,
        controlFn,
        releaseIntervention,
        changeInfoCodeExpireTimeFn,
        clearAccRuntimeClassFn,
        executeCircuitDemand,
        singleObjectBatchControlFn,
        multiObjectBatchControlFn,
        resetMultiObjectDatasFn,
        batchAutoCommandSendBySingleObjectFn
    };
};
