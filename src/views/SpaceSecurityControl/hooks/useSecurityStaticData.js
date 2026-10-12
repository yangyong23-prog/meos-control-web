// @ts-ignore
import i18n from '@/localization';
import { querySecurityDeploymentSpace, querySecurityAccessSpace, querySecurityEquipmentList } from '@/apis/SpaceSecurityControl';
import useStore from '@/store';
import { CONTROL_BAR_TAB_KEYS, CONTROL_BAR_TABS } from '../constants/index';
import {
    staticSpacesKey,
    staticEquipsKey,
    staticSpacesLoadingKey,
    staticEquipsLoadingKey,
    staticObjectIdsKey,
    accessSpacesKey,
    deploymentSpacesKey,
    getStaticSpacesKey,
    getStaticEquipsKey
} from '../constants/injectKey';

export default () => {
    const { base } = useStore();
    const { projectId } = base;

    const tabsOptions = ref([]); // 地图tabs项
    const currentFloorObj = ref(); // 当前楼层对象

    // 静态空间
    const staticSpaces = ref([]);
    const deploymentSpaces = ref([]);
    const accessSpaces = ref([]);

    const fetchSpacesAbortController = ref();
    const spacesLoading = ref(false);

    // 静态设备
    const staticEquips = ref([]);
    const fetchEquipsAbortController = ref();
    const equipsLoading = ref(false);

    const spacesAndEquipsLoading = computed(() => spacesLoading.value || equipsLoading.value);

    const staticObjectIds = computed(() => {
        const arr = new Set();
        staticSpaces.value.forEach(obj => {
            arr.add(obj.id);
        });
        staticEquips.value.forEach(obj => {
            arr.add(obj.id);
        });
        return [...arr];
    });

    const classCodeObjectIdsMap = computed(() => {
        // const curFloorId = currentFloorObj?.value?.id;
        let cacheMap = {};
        if (staticSpaces.value?.length && staticEquips.value?.length) {
            staticSpaces.value.forEach(data => {
                // const checkCondition = curFloorId ? curFloorId === data.floorId : true;
                const checkCondition = true;
                if (cacheMap?.GeneralZone) {
                    checkCondition && cacheMap.GeneralZone.push(data.id);
                } else {
                    checkCondition && (cacheMap.GeneralZone = [data.id]);
                }
            });

            staticEquips.value.forEach(data => {
                // const checkCondition = curFloorId ? curFloorId === data.floorId && data.classCode : data.classCode;
                const checkCondition = true;
                if (cacheMap?.[data.classCode]) {
                    checkCondition && cacheMap[data.classCode].push(data.id);
                } else {
                    checkCondition && (cacheMap[data.classCode] = [data.id]);
                }
            });
        }

        return cacheMap;
    });

    const querySpaceData = async () => {
        fetchSpacesAbortController.value?.abort?.();
        fetchSpacesAbortController.value = new AbortController();
        const { signal } = fetchSpacesAbortController.value;
        try {
            const params = {
                instanceId: currentFloorObj?.value?.id ? currentFloorObj?.value?.id : projectId,
                instanceType: currentFloorObj?.value?.id ? 'FLOOR' : 'PROJECT'
            };
            spacesLoading.value = true;
            const [deploymentRes, accessRes] = await Promise.all([querySecurityDeploymentSpace(params, signal), querySecurityAccessSpace(params, signal)]).finally(() => {
                spacesLoading.value = false;
            });

            return { deploymentRes, accessRes };
        } catch (error) {
            console.error('Error fetching space data:', error);
        } finally {
            spacesLoading.value = false;
        }
    };

    const handleSpacesData = async () => {
        let hasDeploymentStatusSpace = false;

        const res = await querySpaceData();
        const spaceIdInfoMap = {};
        if (res?.deploymentRes?.code === '00000' && res?.accessRes?.code === '00000') {
            const deploymentRes = res?.deploymentRes?.data;
            const accessRes = res?.accessRes?.data;
            if (Array.isArray(deploymentRes) && Array.isArray(accessRes)) {
                if (deploymentRes?.length) {
                    hasDeploymentStatusSpace = true;
                }
                deploymentSpaces.value = deploymentRes;
                deploymentRes.forEach(spaceItem => {
                    // 标记空间来源撤布防
                    spaceIdInfoMap[spaceItem.id] = { ...spaceItem, isFromDeployment: true };
                });

                accessSpaces.value = accessRes;
                accessRes.forEach(spaceItem => {
                    const preSpaceItem = spaceIdInfoMap[spaceItem.id] || {};
                    // 标记空间来源通行
                    spaceIdInfoMap[spaceItem.id] = { ...preSpaceItem, ...spaceItem, isFromAccess: true };
                });
            }
        }

        // 无撤布防的空间时，不展示对应Tab
        tabsOptions.value = CONTROL_BAR_TABS.filter(da => {
            if (!hasDeploymentStatusSpace && da.id === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS) {
                return false;
            }
            return true;
        });
        const result = Object.values(spaceIdInfoMap);
        staticSpaces.value = result;
        return result;
    };

    const queryEquipmentsData = async () => {
        fetchEquipsAbortController.value?.abort?.();
        fetchEquipsAbortController.value = new AbortController();
        const { signal } = fetchEquipsAbortController.value;
        try {
            const params = {
                instanceId: currentFloorObj?.value?.id ? currentFloorObj?.value?.id : projectId,
                instanceType: currentFloorObj?.value?.id ? 'FLOOR' : 'PROJECT'
            };
            equipsLoading.value = true;
            const res = await querySecurityEquipmentList(params, signal).finally(() => {
                equipsLoading.value = false;
            });
            return res;
        } catch (error) {
            console.error('Error fetching equip data:', error);
        } finally {
            equipsLoading.value = false;
        }
    };

    const handleEquipmentsData = async () => {
        const res = await queryEquipmentsData();
        let equips = [];
        if (res?.code === '00000') {
            if (Array.isArray(res?.data)) {
                equips = res?.data?.filter?.(obj => !!obj.bimLocation);
            }
        }
        staticEquips.value = equips;
        return equips;
    };

    provide(staticSpacesKey, staticSpaces);
    provide(staticSpacesLoadingKey, spacesLoading);
    provide(getStaticSpacesKey, handleSpacesData);

    provide(staticEquipsKey, staticEquips);
    provide(staticEquipsLoadingKey, equipsLoading);
    provide(getStaticEquipsKey, handleEquipmentsData);

    provide(staticObjectIdsKey, staticObjectIds);
    provide(accessSpacesKey, accessSpaces);
    provide(deploymentSpacesKey, deploymentSpaces);

    provide('currentFloorObj', currentFloorObj);
    provide('tabsOptions', tabsOptions);
    provide('spacesAndEquipsLoading', spacesAndEquipsLoading);

    onUnmounted(() => {
        staticSpaces.value = null;
        staticEquips.value = null;
        accessSpaces.value = null;
        deploymentSpaces.value = null;
        currentFloorObj.value = null;
        tabsOptions.value = null;
    });

    return { currentFloorObj, tabsOptions, staticSpaces, staticEquips, staticObjectIds, classCodeObjectIdsMap };
};
