import querySceneFuncTypeList from './querySceneFuncTypeList.json';
import querySceneCircuitView from './querySceneCircuitView.json';
const options = [
    {
        url: '/demand/lighting/querySceneFuncTypeList',
        method: 'post',
        response: () => querySceneFuncTypeList,
        timeout: 1000
    },
    {
        url: '/demand/lighting/querySceneCircuitView',
        method: 'post',
        response: () => {
            const data = querySceneCircuitView;
            data.data = Array.from({ length: 20 }).map(() => ({
                circuitId: 'string',
                circuitLocalId: '123',
                circuitLocalName: '1#照明回路',
                funcType: '标识照明',
                funcTypeName: '标识照明',
                lampFuncType: '筒灯',
                lampFuncTypeName: '筒灯',
                settingMode: 'OPEN'
            }));
            return data;
        },
        timeout: 1000
    }
];

export default options;
