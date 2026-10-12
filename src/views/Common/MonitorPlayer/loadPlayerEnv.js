// @ts-ignore
import i18n from '@/localization';
// 环境变量取值规则
// 1，判断云端or边缘端; 边缘端取baseUrl 取 env.js 中的 apmCommonEnv.INTERFACE_PREFIX_IOTHUB || meosEnv.INTERFACE_PREFIX_IOTHUB
// 2, 云端： 优先取 env.js 中 apmMonitoringConfigs 数组中 isMock为true的配置
// 3, 云端： 没有 isMock为true 的配置，根据 groupCode和projectId为条件 配置配置

/** example
 *  apmMonitoringConfigs:[ {
        isMock: true, // 是否mock环境
        instanceId: 'Eq74803828245263ecac1c51473c962f987a8973e5e0', // id
        manufacturer: 'xx大华xx', // 制造商
        groupCode: 'XC', 
        projectId: 'Pj3201050003',
        Environment: 'dev',
        url: 'https://xc-njjy.meosedge.com/iot-hub-server-edge' // 播放域名
    },
    {
        isMock: false, // 是否mock环境
        groupCode: 'TYXN', 
        projectId: 'Pj9900011177',
        url: 'https://xc-xxxxx.meosedge.com/iot-hub-server-edge' // 播放域名
    }]
 */
import { INTERFACE_PREFIX_IOTHUB, APM_MONITORING_CONFIGS, INTERFACE_PREFIX_BDTP_DMP_RWD } from '@/config';
import { isEdge } from '@/utils/envUtils';
import useStore from '@/store';

export const getPlayerEnv = () => {
    if (isEdge()) {
        const { base } = useStore();
        const { projectId, groupCode } = base;
        return {
            baseUrl: INTERFACE_PREFIX_IOTHUB,
            bdtpBaseUrl: INTERFACE_PREFIX_BDTP_DMP_RWD,
            groupCode,
            projectId
        };
    } else {
        const apmMonitoringConfigs = APM_MONITORING_CONFIGS || [];
        const mockConfig = apmMonitoringConfigs.find(config => config.isMock);
        if (mockConfig) {
            return {
                baseUrl: mockConfig.url,
                bdtpBaseUrl: mockConfig.bdtpBaseUrl,
                objectId: mockConfig.instanceId,
                groupCode: mockConfig.groupCode,
                projectId: mockConfig.projectId,
                manufacturer: mockConfig.manufacturer,
                objectIds: mockConfig.objectIds,
                realTimeStreamProtocol: mockConfig.realTimeStreamProtocol
            };
        }

        const { base } = useStore();
        const { projectId, groupCode } = base;
        const matchConfig = apmMonitoringConfigs.find(config => config.groupCode === groupCode && config.projectId === projectId);
        return {
            baseUrl: matchConfig.url,
            bdtpBaseUrl: INTERFACE_PREFIX_BDTP_DMP_RWD,
            groupCode: matchConfig.groupCode,
            projectId: matchConfig.projectId
        };
    }
};
