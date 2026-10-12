import i18n from '@/localization';
import { DETAIL, GET_MENU_CONFIG, SUCCESSCODE } from '@/utils/globalVariables';
import dataDockHandling from './dataDockHandling';
import useLoading from './useLoading';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import { iterateObjct4InstanceInfo } from '@/utils';
import { isFunction, isObject, uniq } from 'lodash';
import { useObjectInfoSSEGlobal } from './useObjectInfoSSE';
export const templateDataKey = Symbol('templateDataKey');

export const useObjectInfoDataByTemplateHook = (data, className = 'drawer-content', options = { sse: true }, props) => {
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { cancelQuest, cancelToken } = UseCancelTokenHooks();

    const variales = window[GET_MENU_CONFIG]();
    const templateData = ref({});

    // 加载动画相关
    const { loading, openLoading, closeLoading } = useLoading(
        className,
        '#fff',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const { setObjectInfoSSEClientOption, closeObjectInfoSSEClient } = useObjectInfoSSEGlobal();
    const getObjectInfoData = async id => {
        cancelQuest();
        openLoading();
        try {
            const res = await loadDynaDataWithIotHandling(
                {
                    runningMonitorType: variales.RUNNING_MONITOR_TYPE || data.value.runningMonitorType,
                    objectIds: [id],
                    templateType: DETAIL
                },
                listInfoCodeConfigsByObjectIdCommon,
                undefined,
                { cancelToken: cancelToken() }
            );
            if (res.code === SUCCESSCODE) {
                templateData.value = res.data?.[0] || {};
                const { classCodeIds } = iterateObjct4InstanceInfo(res.data);
                for (const key in classCodeIds) {
                    if (Object.prototype.hasOwnProperty.call(classCodeIds, key)) {
                        classCodeIds[key] = uniq(classCodeIds[key]);
                    }
                }
                // 当没有返回数据时 保底处理
                if (data.value?.classCode && !classCodeIds[data.value?.classCode]) {
                    classCodeIds[data.value?.classCode] = [id];
                }
                let config = {};
                if (isObject(options)) {
                    config = options;
                }
                if (isFunction(options)) {
                    config = options();
                }
                config?.sse && setObjectInfoSSEClientOption(classCodeIds, config);
            }
        } catch (error) {
            templateData.value = {};
            console.error(error);
        } finally {
            closeLoading();
        }
    };

    watch(
        () => data.value?.id,
        () => {
            if (data.value?.id) {
                getObjectInfoData(data.value.id);
            } else {
                templateData.value = {};
                closeObjectInfoSSEClient();
            }
        }
    );
    provide(templateDataKey, templateData);

    return {
        templateData,
        closeObjectInfoSSEClient,
        getObjectInfoData,
        loading
    };
};
