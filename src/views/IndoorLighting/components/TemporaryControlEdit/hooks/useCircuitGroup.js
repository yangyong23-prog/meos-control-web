import { loopListKey } from '@/views/IndoorLighting/hooks/useBaseHook';
import { listInstanceGroup } from '@/apis/lightingRequirements';

import baseStore from '@/store/baseStore';
import { TEMP_CTL_EDIT_SELECT_TYPE, INFOCODE } from '@/views/IndoorLighting/variables';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { nameMatch } from '@/utils/viewUtils';
import DockSingleton from '@/hooks/responsiveDock';
import { circuitGroupLoadingKey } from '@/views/IndoorLighting/hooks/useTemporaryControlEdit';

// import { SETTING_MODE, INFOCODE } from '../../variables';
export default props => {
    const loopList = inject(loopListKey);
    const circuitGroupLoading = inject(circuitGroupLoadingKey);

    const originCircuitGroupList = ref([]);
    const groupCheckedMap = ref({});

    const curSearchInput = ref('');
    const curSelFuncType = ref('');
    const curLocalRemoteStatus = ref('');

    const { cancelToken, cancelQuest } = UseCancelTokenHooks();
    const { getIotData } = DockSingleton.getInstance();

    const isLoopLocal = loop => {
        const localRemoteStatusData = getIotData(loop.id, INFOCODE.localRemoteStatus0.infoCode);
        return localRemoteStatusData.dataValue === INFOCODE.localRemoteStatus0.dataValue;
    };
    const getLocalCount = loops => {
        let count = 0;
        loops?.forEach(loop => {
            if (isLoopLocal(loop)) {
                loop.local = true;
                count++;
            }
        });
        return count;
    };

    const checkedChange = obj => {
        console.log('item, selected: ', obj);

        obj.items?.forEach(item => {
            groupCheckedMap.value[item.id] = item.checked;
        });
    };
    const reset = () => {
        originCircuitGroupList.value = [];

        groupCheckedMap.value = {};
    };

    const setSelects = ids => {
        console.log('ids: ', ids);
        groupCheckedMap.value = [];
        ids.forEach(id => {
            groupCheckedMap.value[id] = 'checked';
        });
    };

    const funcTypeList = computed(() => {
        const arr = [];
        const record = {};
        Array.from(loopList.value.values()).forEach(loop => {
            if (loop.serviceAreaType === props.runningMonitorSecondTypeId && !record[loop.funcType]) {
                record[loop.funcType] = true;
                arr.push({
                    id: loop.funcType,
                    name: loop.funcTypeName
                });
            }
        });
        return arr;
    });

    const getCircuitGroupList = async () => {
        cancelQuest();
        circuitGroupLoading.value = true;
        try {
            const belongInstance = [
                {
                    instanceType: props.instanceType ?? 'PROJECT',
                    instanceId: props.instanceId ?? baseStore().projectId
                }
            ];
            const tags = funcTypeList.value?.map(func => func.id);
            await listInstanceGroup({ templateType: props.runningMonitorSecondType, tags, belongInstance }, { cancelToken: cancelToken() }).then(res => {
                if (res.code === SUCCESSCODE) {
                    console.log('res: ', res);
                    originCircuitGroupList.value = res.data?.map(group => {
                        return {
                            ...group,
                            oriName: group.name,
                            loopCount: group.relObjects?.length ?? 0,
                            localCount: getLocalCount(group.relObjects)
                        };
                    });
                }
            });
        } catch (error) {
            console.log('error: ', error);
        } finally {
            circuitGroupLoading.value = false;
        }
    };

    const curFilteredTableData = computed(() => {
        return originCircuitGroupList.value
            .filter(group => {
                const searchText = curSearchInput.value?.trim().toLowerCase();
                const nameMatched = group.oriName?.trim().toLowerCase().includes(searchText);
                const wardsInclude = searchText === '' || nameMatched;
                if (curSearchInput.value && wardsInclude) {
                    // c.codeText = c.circuitId?.includes(curSearchInput.value) ? nameMatch(c.circuitId, curSearchInput.value) : c.circuitId || '--';
                    group.name = searchText && nameMatched ? nameMatch(group.oriName, searchText) : group.oriName || '--';
                } else {
                    // c.codeText = c.circuitId || '--';
                    group.name = group.oriName;
                }
                const hasLocal = group.localCount > 0;
                let localRemoteStatusOk =
                    curLocalRemoteStatus.value === '' ||
                    (hasLocal ? curLocalRemoteStatus.value === INFOCODE.localRemoteStatus0.dataValue : curLocalRemoteStatus.value === INFOCODE.localRemoteStatus1.dataValue);

                return localRemoteStatusOk && wardsInclude;
            })
            ?.map(loop => {
                return {
                    checked: groupCheckedMap.value[loop.id] ?? 'uncheck',
                    ...loop
                };
            });
    });
    const curTableData = computed(() => {
        return curFilteredTableData.value.filter(group => {
            const funcTypeMatched = group.tag === curSelFuncType.value;
            return funcTypeMatched;
        });
    });
    const curFuncTypeList = computed(() => {
        const curFuncTypeMap = {};
        curFilteredTableData.value?.forEach(group => {
            curFuncTypeMap[group.tag] = true;
        });
        return funcTypeList.value?.filter(func => curFuncTypeMap[func.id]);
    });
    const selGroupInfo = computed(() => {
        const localLootIdSet = new Set();
        let selCount = 0;
        const selGroupList = [];
        const selectedCircuitGroupIds = [];
        const selFuncCounts = {};
        originCircuitGroupList.value?.forEach(group => {
            if (groupCheckedMap.value[group.id] === 'checked') {
                selCount += 1;
                if (!selFuncCounts[group.tag]) {
                    selFuncCounts[group.tag] = 0;
                }
                selFuncCounts[group.tag] += 1;
                selGroupList.push(group);
                selectedCircuitGroupIds.push(group.id);
                group.relObjects?.forEach(loop => {
                    if (loop.local) {
                        localLootIdSet.add(loop.id);
                    }
                });
            }
        });
        console.log(' selGroupList,  selCount,: ', selGroupList, selCount);
        return {
            selGroupList,
            selCount,
            selFuncCounts,
            selectedCircuitGroupIds,
            localCount: localLootIdSet.size
        };
    });
    const funcSelCountMap = computed(() => {
        return selGroupInfo.value.selFuncCounts;
    });

    const selLoopLocalCount = computed(() => {
        return selGroupInfo.value.localCount;
    });
    const selItemCount = computed(() => {
        return selGroupInfo.value.selCount;
    });

    watch(
        [funcTypeList],
        () => {
            // console.log('funcTypeList.value?.length: ', funcTypeList.value?.length);
            if (funcTypeList.value?.length > 0) {
                getCircuitGroupList();
            }
        },
        { immediate: true }
    );
    watch(curFuncTypeList, () => {
        if (curFuncTypeList.value?.length > 0) {
            if (!curFuncTypeList.value?.some(obj => obj.id === curSelFuncType.value)) {
                curSelFuncType.value = curFuncTypeList.value[0].id;
            }
        }
    });

    return {
        curSelFuncType,
        curSearchInput,
        curLocalRemoteStatus,
        curTableData,
        curFuncTypeList,
        funcSelCountMap,
        checkedChange,
        reset,
        setSelects,
        selItemCount,
        selLoopLocalCount,
        selGroupInfo
    };
};
