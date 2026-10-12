import { computed, ref } from 'vue';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { OBJ_TYPE } from '@/utils/globalVariables';

const getShowStyleConfig = showStyle => {
    // 壳配置 showStyle 可能为空或格式异常，解析失败时按不展示处理，避免拓扑环境参数计算中断。
    try {
        return showStyle ? JSON.parse(showStyle.replace('\n', '')) : {};
    } catch (error) {
        console.warn('Failed to parse topology showStyle:', showStyle, error);
        return {};
    }
};

const isShowInTopology = infoConfig => {
    return !!(infoConfig?.existsIotRule && infoConfig?.infoCode && getShowStyleConfig(infoConfig.showStyle)?.showInTopology);
};

const getTopologyInfoConfigs = relInfoCodeGroupConfigs => {
    const groupMap = new Map((relInfoCodeGroupConfigs || []).map(group => [group?.groupCode, group?.groupChildren || []]));
    const curveConfigs = groupMap
        .get('curveStatistic')
        ?.map(group => group?.relInfoCodeConfigs?.[0])
        .filter(isShowInTopology);
    const statisticConfigs = groupMap
        .get('currentStatistic')
        ?.flatMap(group => group?.relInfoCodeConfigs || [])
        .filter(isShowInTopology);

    return [...(curveConfigs || []), ...(statisticConfigs || [])];
};

const getTemplateObjectId = data => data?.objectId || data?.id;

export default ({ topologySpace, currentSelectObj, templateData, getIotData, envStatusMaps }) => {
    const topologySpaceWithEnvMap = ref(new Map());
    const topologySpaceTemplateDataMap = ref(new Map());

    const isSpaceSelect = computed(() => currentSelectObj.value?.objType === OBJ_TYPE.SPACE);

    const getTopologyEnvStatusInfos = spaceId => {
        const statusConfigList = [
            [envStatusMaps.tdbEnvStatusMap.value[spaceId], envStatusMaps.TOPOLOGY_TEMPERATURE_STATUS_MAP],
            [envStatusMaps.co2EnvStatusMap.value[spaceId], envStatusMaps.TOPOLOGY_CO2_STATUS_MAP],
            [envStatusMaps.rhEnvStatusMap.value[spaceId], envStatusMaps.TOPOLOGY_RH_STATUS_MAP],
            [envStatusMaps.pressureDiffEnvStatusMap.value[spaceId], envStatusMaps.TOPOLOGY_PRESSURE_DIFF_STATUS_MAP]
        ];

        return statusConfigList.reduce((statusInfos, [status, statusMap]) => {
            const statusInfo = statusMap[status];
            if (status && statusInfo) {
                statusInfos[statusInfo.belong] = statusInfo;
            }
            return statusInfos;
        }, {});
    };

    const topologySpaceWithEnvComputed = computed(() => {
        const tempSpace = topologySpace.value || {};
        const topologySpaceTemplateData = topologySpaceTemplateDataMap.value.get(tempSpace.id) || {};
        const topologyInfoConfigs = getTopologyInfoConfigs(topologySpaceTemplateData?.relInfoCodeGroupConfigs);
        const envStatusInfos = getTopologyEnvStatusInfos(tempSpace.id);

        const environment = topologyInfoConfigs.map(v => {
            const iotValObj = getIotData(tempSpace.id, v?.infoCode);
            return {
                label: iotValObj?.infoCodeName,
                value: iotValObj?.dataValue,
                unit: iotValObj?.unit || '',
                statusInfo: envStatusInfos[v?.infoCode]
            };
        });

        return {
            ...tempSpace,
            environment
        };
    });

    const topologySpaceWithEnv = computed(() => {
        const spaceId = topologySpace.value?.id;
        const spaceWithEnv = topologySpaceWithEnvMap.value.get(spaceId);
        return spaceWithEnv || topologySpaceWithEnvComputed.value;
    });

    useWatchWithCleanup(
        [() => templateData.value, () => currentSelectObj.value?.id],
        () => {
            const selectedId = currentSelectObj.value?.id;
            const templateObjectId = getTemplateObjectId(templateData.value);
            // 只在当前选中空间，且模板数据确实属于该空间时更新环境参数模板缓存；切到设备时保留上一份空间模板。
            if (isSpaceSelect.value && selectedId && templateObjectId === selectedId) {
                topologySpaceTemplateDataMap.value.set(selectedId, templateData.value || {});
            }
        },
        { immediate: true }
    );

    useWatchWithCleanup(
        [() => topologySpaceWithEnvComputed.value, () => topologySpace.value?.id],
        () => {
            const spaceId = topologySpace.value?.id;
            if (spaceId) {
                topologySpaceWithEnvMap.value.set(spaceId, topologySpaceWithEnvComputed.value);
            }
        },
        { immediate: true }
    );

    const clearTopologySpaceEnvironmentCache = () => {
        topologySpaceWithEnvMap.value.clear();
        topologySpaceTemplateDataMap.value.clear();
    };

    return {
        topologySpaceWithEnv,
        clearTopologySpaceEnvironmentCache
    };
};
