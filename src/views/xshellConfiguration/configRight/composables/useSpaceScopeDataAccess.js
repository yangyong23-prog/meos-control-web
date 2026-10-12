import { ref } from 'vue';
import i18n from '@/localization';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import { getSpaceListObject, queryACShellSpace } from '@/apis/xshellConfiguration';
import { getTreeBuildingFloorSpace } from '@/apis/DemandManagementHomeNew';
import { AIR_TERMINAL, GeneralZone, GRID, SUCCESSCODE } from '@/utils/globalVariables';
import useStore from '@/store';
import treeBuildFloorStore from '@/store/treeBuildFloor';

const FALLBACK_NAME = '--';

const normalizeText = text => (text || '').toString().trim().toLowerCase();

const getFloorSequence = floorInfo => {
    const val = floorInfo?.floorSequenceId;
    return Number.isFinite(Number(val)) ? Number(val) : Number.MAX_SAFE_INTEGER;
};

const compareSpaceName = (a, b) => {
    return (a?.spaceName || '').localeCompare(b?.spaceName || '', 'zh-CN', {
        numeric: true,
        sensitivity: 'base'
    });
};

const sortSpacesByLocation = spaces => {
    return [...(spaces || [])].sort((a, b) => {
        if (a.buildingOrder !== b.buildingOrder) {
            return (a.buildingOrder ?? 1) - (b.buildingOrder ?? 1);
        }
        if (a.floorSequenceId !== b.floorSequenceId) {
            return (a.floorSequenceId ?? Number.MAX_SAFE_INTEGER) - (b.floorSequenceId ?? Number.MAX_SAFE_INTEGER);
        }
        return compareSpaceName(a, b);
    });
};

const buildSpaceByFloor = ({ spaceId, spaceName, floorId, floorSequenceId, floorName, buildingName, buildingOrder }) => ({
    id: spaceId,
    floorId,
    floorSequenceId,
    buildingName: buildingName || FALLBACK_NAME,
    buildingOrder,
    floorName: floorName || FALLBACK_NAME,
    spaceName: spaceName || FALLBACK_NAME,
    iotTags: []
});

const IOT_RULE_PARSERS = [
    {
        label: () => i18n.global.t('meos_control_web.air_terminal_iot_temperature'),
        test: text => /tdb/.test(text)
    },
    {
        label: () => i18n.global.t('meos_control_web.air_terminal_iot_co2'),
        test: text => /co2|cO2/.test(text)
    },
    {
        label: () => i18n.global.t('meos_control_web.air_terminal_iot_co'),
        test: text => /co|cO/.test(text)
    },
    {
        label: () => i18n.global.t('meos_control_web.air_terminal_iot_humidity'),
        test: text => /rh|rH/.test(text)
    },

    {
        label: () => i18n.global.t('meos_control_web.air_terminal_iot_pm25'),
        test: text => /pm2d5|pM2d5/.test(text)
    },
    {
        label: () => i18n.global.t('meos_control_web.air_terminal_iot_pm10'),
        test: text => /pm10|pM10/.test(text)
    },
    {
        label: () => i18n.global.t('meos_control_web.air_terminal_iot_voc'),
        test: text => /voc|vOC/.test(text)
    },
    {
        label: () => i18n.global.t('meos_control_web.air_terminal_iot_tvoc'),
        test: text => /tvoc|tVOC/.test(text)
    },
    {
        label: () => i18n.global.t('meos_control_web.air_terminal_iot_hcho'),
        test: text => /hcho|hCHO/.test(text)
    },
    {
        label: () => i18n.global.t('meos_control_web.differential_pressure'),
        test: text => /pressurediff/.test(text)
    }
];

const getIotTagOrder = tag => {
    const order = IOT_RULE_PARSERS.findIndex(parser => parser.label() === tag);
    return order === -1 ? Number.MAX_SAFE_INTEGER : order;
};

const sortTagsByParserOrder = tags => {
    return [...(tags || [])].sort((a, b) => getIotTagOrder(a) - getIotTagOrder(b));
};

const getIotTagByCode = infoCode => {
    const normalizedCode = normalizeText(infoCode);
    if (!normalizedCode) {
        return '';
    }

    const hit = IOT_RULE_PARSERS.find(parser => parser.test(normalizedCode));
    return hit ? hit.label() : '';
};

const getInfoCodeItem = (space, spaceIdToIotTagsMap) => {
    const configItems = space?.relInfoCodeGroupConfigs?.filter(v => v?.groupCode?.startsWith('spaceGrid'));
    if (!Array.isArray(configItems)) {
        return;
    }

    for (const element of configItems) {
        const { infoCode, existsIotRule } = element?.groupChildren?.[0]?.relInfoCodeConfigs?.[0] || {};
        const spaceId = space?.objectId || space?.id;

        if (!spaceId || !existsIotRule) {
            continue;
        }

        const nextTag = getIotTagByCode(infoCode);
        if (!nextTag) {
            continue;
        }

        const prevTags = spaceIdToIotTagsMap.get(spaceId) || [];
        if (!prevTags.includes(nextTag)) {
            spaceIdToIotTagsMap.set(spaceId, sortTagsByParserOrder([...prevTags, nextTag]));
        }
    }
};

const handleTreeName = data => {
    data.name = (data.localName || data.name) ?? FALLBACK_NAME;

    if (data?.children?.length) {
        data.children.forEach(item => {
            if (data.instanceType === 'FLOOR') {
                item.floorId = data.id;
            }
            handleTreeName(item);
        });
    }
};

export const useSpaceScopeDataAccess = () => {
    const { base } = useStore();

    const referencedSpaceList = ref([]);
    const buildingFloorSpaceList = ref([]);
    const whitelistSpaceIds = ref([]);

    // 上次保存的自定义白名单列表
    const lastSavedCustomWhitelist = ref([]);

    const spaceListLoading = ref(false);
    const spaceTreeLoading = ref(false);
    const spaceTreeData = ref([]);

    const fetchDynamicIOTData = async (spaces = [], finallyCallback) => {
        const params = {
            projectId: base.projectId,
            runningMonitorType: AIR_TERMINAL,
            templateCode: GRID,
            objectIds: spaces.map(sp => sp.id),
            notFilterIotInfoCodeRule: true
        };

        if (!spaces?.length) {
            return [];
        }

        const res = await listInfoCodeConfigsByObjectIdCommon(params).finally(() => {
            finallyCallback?.();
        });
        if (res?.code !== SUCCESSCODE) {
            return spaces;
        }

        try {
            const resData = res?.data;
            if (!Array.isArray(resData)) {
                return spaces;
            }

            const spaceIdToIotTagsMap = new Map();
            resData.forEach(item => {
                getInfoCodeItem(item, spaceIdToIotTagsMap);
            });

            return spaces.map(space => ({
                ...space,
                iotTags: spaceIdToIotTagsMap.get(space.id) || []
            }));
        } catch (error) {
            console.error(error);
            return spaces;
        }
    };

    /**
     * 初始化空间范围数据。
     *
     * @param {boolean} [withLoading=true] 是否显示空间列表加载状态。
     * @returns {Promise<object|Array>} 接口返回结果。
     */
    const initSpaceScopeData = async (withLoading = true) => {
        if (withLoading) {
            spaceListLoading.value = true;
        }
        const res = await queryACShellSpace();
        if (res?.code !== SUCCESSCODE || !Array.isArray(res?.data)) {
            referencedSpaceList.value = [];
            if (withLoading) {
                spaceListLoading.value = false;
            }
            return res;
        }

        const buildingOrderMap = new Map();
        let buildOrder = 0;
        const nextSpaceList = res.data.map(item => {
            const floorInfo = treeBuildFloorStore().getBuildOrFloor(item?.floorId) || {};
            const buildingId = item?.buildingId || floorInfo?.buildingId || '';
            if (!buildingOrderMap.has(buildingId)) {
                buildingOrderMap.set(buildingId, buildOrder++);
            }

            return {
                id: item?.id,
                buildingId,
                floorId: item?.floorId,
                buildingOrder: buildingOrderMap.get(buildingId),
                floorSequenceId: getFloorSequence(floorInfo),
                buildingName: floorInfo.buildingName || FALLBACK_NAME,
                floorName: floorInfo.localName || FALLBACK_NAME,
                spaceName: item?.localName || FALLBACK_NAME,
                iotTags: []
            };
        });

        referencedSpaceList.value = await fetchDynamicIOTData(sortSpacesByLocation(nextSpaceList), () => {
            spaceListLoading.value = false;
        });
        return res;
    };

    const setLastSavedWhiteList = async (lastConfig, withLoading = true) => {
        const { whitelistType, objects: lastList = [] } = lastConfig || {};
        if (withLoading) {
            spaceListLoading.value = true;
        }
        if (whitelistType === 'CUSTOM') {
            if (withLoading) {
                const nextSpaceList = mapIotRecordsToSpaceRows(lastList);
                lastSavedCustomWhitelist.value = await fetchDynamicIOTData(sortSpacesByLocation(nextSpaceList), () => {
                    if (withLoading) {
                        spaceListLoading.value = false;
                    }
                });
            }

            whitelistSpaceIds.value = lastList.map(item => item.id);
            buildingFloorSpaceList.value = structuredClone(lastSavedCustomWhitelist.value);
        } else {
            whitelistSpaceIds.value = [];
            buildingFloorSpaceList.value = [];
        }
    };

    const loadFilteredSpaceTree = async () => {
        const params = {
            templateType: 'AIRCONDITIONING',
            queryFloor: true,
            querySpace: true,
            filterInBlacklistedSpace: false,
            filterInShieldedSpace: false
        };

        spaceTreeLoading.value = true;
        spaceTreeData.value = [];

        return getTreeBuildingFloorSpace(params)
            .then(res => {
                const { data, code } = res;
                if (code !== SUCCESSCODE) {
                    return;
                }

                const cloneData = structuredClone(data);
                cloneData?.forEach(item => {
                    handleTreeName(item);
                });

                if (Array.isArray(cloneData) && cloneData.length) {
                    spaceTreeData.value = [
                        {
                            id: base.projectId || 'projectId',
                            name: base.projectName || i18n.global.t('meos_control_web.project_name'),
                            children: cloneData,
                            instanceType: 'PROJECT'
                        }
                    ];
                }
            })
            .finally(() => {
                spaceTreeLoading.value = false;
            });
    };

    const querySpacesByIotRules = async filterInfoCodeRules => {
        const res = await getSpaceListObject({
            filterClassCodes: [GeneralZone],
            withColumns: ['id', 'localName', 'floorId'],
            filterInfoCodeRules
        }).catch(() => null);

        if (res?.code !== SUCCESSCODE) {
            return null;
        }

        return res?.data || [];
    };

    const mapIotRecordsToSpaceRows = records => {
        return (records || []).map(v => {
            const { id: spaceId, localName: spaceName, floorId, floorName, floorSequenceId, buildingName, buildingSequenceId } = v || {};
            const floorInfo = treeBuildFloorStore().getBuildOrFloor(floorId) || {};
            const buildingId = floorInfo?.buildingId || '';
            const buildInfo = treeBuildFloorStore().getBuildOrFloor(buildingId) || {};
            return buildSpaceByFloor({
                spaceId,
                floorId,
                floorSequenceId: floorInfo?.floorSequenceId || floorSequenceId,
                floorName: floorInfo?.localName || floorName,
                buildingName: buildInfo?.localName || buildingName,
                buildingOrder: buildInfo?.buildingSequenceId || buildingSequenceId,
                spaceName
            });
        });
    };

    const mapTreeNodesToSpaceRows = nodes => {
        return (nodes || []).map(v => {
            const { spaceId, spaceName, floorId, floorSequenceId, floorName, buildingName, buildingSequenceId } = v || {};
            return buildSpaceByFloor({
                spaceId,
                floorId,
                floorSequenceId,
                floorName,
                buildingName,
                buildingOrder: buildingSequenceId,
                spaceName
            });
        });
    };

    return {
        referencedSpaceList,
        buildingFloorSpaceList,
        whitelistSpaceIds,
        spaceListLoading,
        spaceTreeLoading,
        spaceTreeData,
        initSpaceScopeData,
        loadFilteredSpaceTree,
        querySpacesByIotRules,
        mapIotRecordsToSpaceRows,
        mapTreeNodesToSpaceRows,
        fetchDynamicIOTData,
        sortSpacesByLocation,
        setLastSavedWhiteList
    };
};
