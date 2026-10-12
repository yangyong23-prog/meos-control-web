import menuConfig from './menuConfig.json';
import listInfoCodeConfigs from './listInfoCodeConfigs.json';
import listInfoCodesList from './codeList.json';
import listActualData from './listActualData.json';
const options = [
    {
        url: /\/api\/system\/graph\/menu\/config.*/,
        method: 'get',
        response: () => menuConfig,
        timeout: 1000
    },
    {
        url: /\/mock\/equipment\/infoCodeConfig\/listInfoCodeConfigsByTemplateType/,
        method: 'post',
        response: () => listActualData,
        timeout: 1000
    },
    {
        url: /\/mock\/knowledge\/listInfoCodes/,
        method: 'post',
        response: () => listInfoCodesList,
        timeout: 1000
    }
];

export default options;
