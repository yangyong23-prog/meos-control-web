import { cryptoInstance } from '@/utils/persagyTools';
import { isEdge } from '@/utils/tools';
import { ApmWebsite } from 'yushu-js-utils';
export const JumpFun = (path, params = {}, prefix) => {
    // 对运行播报的跳转进行特殊处理，边缘端也跳云端的路径
    if (prefix) {
        ApmWebsite.openWebsite(getMicroBasePath(), `${prefix}${path}`, {
            params: getAuthParamsString(params),
            newPage: false
        });
    } else {
        ApmWebsite.openWebsite(getMicroBasePath(), `${isEdge() ? '/meos-autocontrol-web-edge' : '/meos-control-web'}${path}`, {
            params: getAuthParamsString(params),
            newPage: false
        });
    }
};

export const JumpAlarmFun = (path, params = {}) => {
    ApmWebsite.openWebsite(getMicroBasePath(), `${isEdge() ? '/yiheng-unattended-alarm-web-edge' : '/yiheng-unattended-alarm-web'}${path}`, {
        params: getAuthParamsString(params),
        newPage: true
    });
};

export const getAuthParamsString = data => {
    const WebStore = window.WebStore || {};
    const { projectId, token } = WebStore;
    const cloneData = structuredClone(data);
    for (const key in cloneData) {
        if (Object.prototype.hasOwnProperty.call(cloneData, key)) {
            try {
                cloneData[key] = encodeURIComponent(cloneData[key]);
            } catch (error) {
                console.log(error);
            }
        }
    }
    const params = {
        token: token || '',
        pj: cryptoInstance.Encrypt(projectId),
        ...cloneData
    };
    const str = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
    return str;
};

export const getMicroBasePath = () => {
    const WebEnv = window.WebEnv ? window.WebEnv : '';
    return WebEnv?.PREFIX || 'mid-frame-web';
};
