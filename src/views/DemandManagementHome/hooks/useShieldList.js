import i18n from '@/localization';
import { treeShieldedObject, addInstanceConfig } from '@/apis/DemandManagementHome';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { getTreeBuildingFloorSpace } from '@/apis/DemandManagementHomeNew';
import useStore from '@/store';

export default (templateType, updateLeftData) => {
    const { base } = useStore();
    const { projectId, projectName } = base;
    const treeData = ref([]);
    const treeLoading = ref(false);
    const treeSpaceIds = ref([]);
    const defaultSelected = ref([]);
    const allShieldedSpaces = ref([]);
    const fetchAbortController = ref(null);

    const handleTreeSelected = (data, selectedSet) => {
        if (data?.children?.length) {
            data.children.forEach(item => {
                handleTreeSelected(item, selectedSet);
            });
        } else {
            selectedSet.add(data?.id);
        }
    };

    const handleTreeName = (data, allSpacesSet) => {
        data.name = (data.localName || data.name) ?? '--';
        if (data?.children?.length) {
            data.children.forEach(item => {
                handleTreeName(item, allSpacesSet);
            });
        } else {
            allSpacesSet.add(data?.id);
        }
    };

    const queryTreeShieldedObject = async type => {
        await treeShieldedObject({ templateType: type }).then(({ code, data }) => {
            if (code === SUCCESSCODE && data?.children?.length) {
                const cloneData = structuredClone(data?.children);
                const newSelectedSpaces = new Set();
                cloneData?.forEach(item => {
                    handleTreeSelected(item, newSelectedSpaces);
                });
                allShieldedSpaces.value = [...newSelectedSpaces];
                // defaultSelected.value = [...newSelectedSpaces];
            } else {
                allShieldedSpaces.value = [];
            }
        });
    };

    // 获取过滤了黑名单的建筑楼层空间数据
    const getFilterBlackListTree = async () => {
        const params = {
            templateType: templateType?.value || 'AIRCONDITIONING',
            queryFloor: true,
            querySpace: true,
            // filterInBlacklistedSpace: true,
            filterInShieldedSpace: false
        };

        treeLoading.value = true;
        treeData.value = [];
        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        await getTreeBuildingFloorSpace(params, fetchAbortController.value?.signal)
            .then(res => {
                const { data, code } = res;
                if (code === SUCCESSCODE) {
                    const cloneData = structuredClone(data);
                    const allSpacesSet = new Set();
                    cloneData?.forEach(item => {
                        handleTreeName(item, allSpacesSet);
                    });
                    // treeData.value = cloneData;
                    if (cloneData?.length) {
                        // 添加项目树根节点
                        treeData.value = [
                            {
                                id: projectId || 'projectId',
                                name: projectName || i18n.global.t('meos_control_web.project_name'),
                                children: cloneData,
                                instanceType: 'PROJECT'
                            }
                        ];
                    }

                    treeSpaceIds.value = [...allSpacesSet];
                    treeLoading.value = false;
                }
            })
            .finally(() => {
                treeLoading.value = false;
            });
    };

    const updateShieldCount = async (curTemplateType = 'AIRCONDITIONING') => {
        await queryTreeShieldedObject(curTemplateType);
        try {
            const res = await getTreeBuildingFloorSpace({
                templateType: curTemplateType,
                queryFloor: true,
                querySpace: true,
                // filterInBlacklistedSpace: true
                filterInShieldedSpace: false
            });
            const { data, code } = res || {};
            if (code === SUCCESSCODE) {
                const cloneData = structuredClone(data);
                const allSpacesSet = new Set();
                cloneData?.forEach(item => {
                    handleTreeName(item, allSpacesSet);
                });
                const allFilterBlackListSpaces = [...allSpacesSet];
                defaultSelected.value = allShieldedSpaces.value.filter(v => allFilterBlackListSpaces.includes(v));
            }
        } catch (error) {
            defaultSelected.value = allShieldedSpaces.value;
        }
    };

    watch(
        () => templateType.value,
        curTemplateType => {
            // 仅空调调用
            if (curTemplateType === 'AIRCONDITIONING') {
                updateShieldCount(curTemplateType);
            }
        },
        {
            immediate: true
        }
    );

    const submitShieldListModal = (selectedSpaces, relatedNodes, { successCallback, failCallback }) => {
        // 无树数据，直接返回
        if (!treeSpaceIds.value?.length) {
            successCallback?.();
            return;
        }

        const shieldedIds = selectedSpaces.value || [];
        const addShieldedIds = shieldedIds?.filter(v => !defaultSelected.value.includes(v));
        const cancelShieldedIds = defaultSelected.value?.filter(v => {
            const isNotDefault = !shieldedIds.includes(v);
            return isNotDefault && treeSpaceIds.value.includes(v);
        });

        const curTemplateType = templateType.value;
        let promises = [];
        if (addShieldedIds?.length) {
            promises.push(
                addInstanceConfig({
                    templateType: curTemplateType,
                    instanceType: 'SPACE',
                    instanceIds: addShieldedIds,
                    config: { shielded: true }
                })
            );
        }
        if (cancelShieldedIds?.length) {
            promises.push(
                addInstanceConfig({
                    templateType: curTemplateType,
                    instanceType: 'SPACE',
                    instanceIds: cancelShieldedIds,
                    config: { shielded: false }
                })
            );
        }
        if (!promises?.length) {
            successCallback?.();
            return;
        }
        try {
            Promise.all(promises).then(res => {
                const [resOne, resTwo] = res || [];
                if (resOne?.data || resTwo?.data) {
                    successCallback?.(i18n.global.t('common.operation_success'));

                    Promise.all([updateShieldCount(curTemplateType), updateLeftData?.()]);
                }
            });
        } catch (error) {
            failCallback?.(i18n.global.t('meos_control_web.shield_zone_fail'));
        }
    };

    return {
        treeData,
        treeLoading,
        defaultSelected,
        submitShieldListModal,
        getFilterBlackListTree,
        updateShieldCount
    };
};
