import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import baseStore from '@/store/baseStore';

export const templateConfigsKey = Symbol('templateConfigsKey');
export default () => {
    const configGroupCodes = ['mpcColdStationOperationPrediction', 'mpcFinalStrategySelection', 'mpcCrewStrategyDetails', 'mpcCrewOperationPrediction'];
    const templateConfigs = ref({});
    listInfoCodeConfigsByObjectIdCommon({
        runningMonitorType: 'COMMON',
        templateType: 'WEB_CONFIG',
        objectIds: [baseStore().projectId],
        filterGroups: [{ groupCode: 'default', infoCodes: configGroupCodes }]
    }).then(res => {
        if (res?.data?.length) {
            const codeMap = {};
            res.data[0]?.relInfoCodeGroupConfigs
                ?.find(item => item.groupCode === 'default')
                ?.relInfoCodeConfigs?.forEach(item => {
                    templateConfigs.value[item.infoCode] = item;
                    const { showStyle, infoCode } = item;
                    if (showStyle) {
                        try {
                            const showStyleObj = JSON.parse(showStyle.replace(/\n/g, ''));
                            codeMap[infoCode] = showStyleObj;
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            templateConfigs.value = codeMap;
        }
    });

    provide(templateConfigsKey, templateConfigs);

    return { templateConfigs };
};
