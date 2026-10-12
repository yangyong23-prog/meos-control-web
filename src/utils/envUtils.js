import { cryptoInstance } from '@/utils/persagyTools';
import {
    UNUSUAL_EVENTS,
    RISK_EVENTS,
    DEMANDMANAGEMENT_AC_HOME,
    MEOI_DATA_FREE_ANALYSIS,
    CLOUD_ORIGIN,
    MEOS_OPERATION_CRITERION,
    MEOS_LIGHTING_DEMAND,
    MEOS_RUNRETROREPORT_INFO
} from '@/config';
import { openWebsite } from '@/utils/websiteNavigation';
import { INTERFACE_PREFIX_MEOS } from '@/config';
import { isArray } from 'lodash';
import { getDayjsTz } from './globalVariables';
import useStore from '@/store';

// 是否是边环境
export const isEdge = () => {
    if (import.meta.env.DEV) {
        return INTERFACE_PREFIX_MEOS?.includes('-edge');
    } else {
        const WebEnv = sessionStorage.getItem('WebEnv');
        if (WebEnv) {
            try {
                const env = JSON.parse(WebEnv);
                return !!env.Edge;
            } catch (e) {
                return true;
            }
        }
        return true;
    }
};

// 是否运行在 meos-frame 框架下
export const isMeosFrame = () => window['frame-source'] === 'meos-frame';

export const abnormalJumpFun = params => {
    console.log(params, 123);
    openWebsite(UNUSUAL_EVENTS, {
        params: `code=${params.exceptionEventId || params.exceptionEventCode}&${getAuthParamsString()}&f=YIHENG_AbnormalEvent`,
        newPage: true
        // origin: CLOUD_ORIGIN || ''
    });
};

export const jumpToOperationCriterionPage = params => {
    openWebsite(MEOS_OPERATION_CRITERION, {
        params: `date=${params.date}&${getAuthParamsString()}`,
        newPage: true
    });
};

export const jumpToAnalysis = params => {
    const tody = getDayjsTz();
    const startTime = tody.startOf('day').valueOf();
    const endTime = tody.endOf('day').valueOf();
    let jumpParams;
    if (isArray(params)) {
        jumpParams = params.map(param => {
            return {
                startTime,
                endTime,
                fieldCode: param?.infoCode,
                id: param?.id
            };
        });
    } else {
        jumpParams = [
            {
                startTime,
                endTime,
                fieldCode: params?.infoCode,
                id: params?.id
            }
        ];
    }

    openWebsite(MEOI_DATA_FREE_ANALYSIS, {
        params: `iots=${JSON.stringify(jumpParams)}&${getAuthParamsString()}&f=MEOI_DataAnalysis`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};

export const riskJumpFun = params => {
    openWebsite(RISK_EVENTS, {
        params: `instanceTreeId=${encodeURIComponent(params.dangerEventId)}&${getAuthParamsString()}`,
        newPage: true
    });
};

export const demandManageAcHomeJumpFun = () => {
    openWebsite(DEMANDMANAGEMENT_AC_HOME, {
        params: getAuthParamsString(),
        newPage: true
    });
};

export const getAuthParamsString = (extraParams = {}) => {
    const meosSystem = JSON.parse(sessionStorage.getItem('meosSystem')) || {};
    const { projectId, userInfo } = meosSystem;
    const { base } = useStore();
    const params = {
        token: base.token || '',
        pj: cryptoInstance.Encrypt(projectId),
        userId: userInfo?.id || userInfo?.accountId || '',
        ...(extraParams ?? {})
    };

    return Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
};

export const jumpToLightingDemandManagement = (params = {}) => {
    openWebsite(MEOS_LIGHTING_DEMAND, {
        params: getAuthParamsString(params),
        newPage: true
    });
};

export const getMicroBasePath = () => {
    let meosSystemProps = null;
    if (!import.meta.env.VITE_DEV_MODE) {
        meosSystemProps = JSON.parse(sessionStorage.getItem('meosSystem') || '');
    }
    return meosSystemProps?.microBasePath || 'mid-frame-web';
};

export const jumpToRunretroReportInfo = (params = {}) => {
    openWebsite(MEOS_RUNRETROREPORT_INFO, {
        params: getAuthParamsString(params),
        newPage: true
    });
};
