// @ts-ignore
import i18n from '@/localization';
import { onMounted, watch, inject, ref, onBeforeUnmount, nextTick } from 'vue';

import { addInstanceConfig } from '@/apis/DemandManagementHome';
import { getColdHeatSystemTree } from '@/apis/DemandManagementHomeNew';
import useMessage from '@/components/hooks/useMessage';
import { blackListSpaceIdsInjectKey, blackListInitTreeDataInjectKey, blackListSpaceTypeListInjectKey } from '../constant/injectKey';
import emitter from '@/utils/bus';

export default showModal => {
    const { useSuccessMessage } = useMessage();

    const templateType = inject('templateType');
    const blackListSpaceIds = inject(blackListSpaceIdsInjectKey);
    const initStaticTree = inject(blackListInitTreeDataInjectKey);
    const blackListSpaceTypeList = inject(blackListSpaceTypeListInjectKey);

    const notColdHeatModel = ref([]);
    const notColdHeatOptions = ref([]);
    const hasTempIotModel = ref('');
    const hasTempIotOptions = ref([
        { id: 'hasIot', name: i18n.global.t('meos_control_web.has_iot_monitoring') },
        { id: 'noIot', name: i18n.global.t('meos_control_web.no_iot_monitoring') }
    ]);
    const spaceTypeModel = ref([]);
    const spaceTypeOptions = ref([]);

    const leftTreeTop = ref(0);
    const leftScroll = ref();

    const curSelectedFloor = ref([]);
    const keyword = ref('');
    const onlySelected = ref('uncheck');
    const pageNum = ref(1);
    const pageSize = 10;

    // 操作忙碌中，全选，清除，勾选单个
    const isOpBusy = ref(false);

    let allSpaceIdMap = {};

    const closeModal = () => {
        nextTick(() => {
            showModal.value = false;
        });
    };
    const clickSaveBtn = () => {
        useSuccessMessage(i18n.global.t('common.save_success'));
        nextTick(() => {
            showModal.value = false;
        });
    };

    const handleTreeCheck = (list, blackListIds) => {
        list.forEach((item, index) => {
            item.name = item.localName ?? '--';
            const isInBlackList = item.objType === 'space' && blackListIds.includes(item.id);
            item.checked = isInBlackList ? 'checked' : 'uncheck';
            if (item.objType === 'space') {
                allSpaceIdMap[item.id] = item;
            }
            if (item?.children?.length) {
                item?.children?.sort((a, b) => (b?.floorSequenceID ?? 0) - (a?.floorSequenceID ?? 0));
                handleTreeCheck(item.children, blackListIds);
            }
        });
    };

    // 初始化非冷热源系统服务的实例树
    const handleColdHeatTreeInit = list => {
        if (!list?.length) {
            return;
        }
        const tempData = list.map(v => {
            const instances = v?.systems?.map(instance => ({ id: instance?.id, name: instance?.localName ?? '--' }));
            return { id: v?.classCode, name: v?.classCodeName, children: instances };
        });
        notColdHeatOptions.value = tempData;
    };

    const handleSpaceTypeInit = () => {
        const finalData = blackListSpaceTypeList.value;
        if (finalData?.length) {
            spaceTypeOptions.value = finalData;
        }
    };

    const handleTreeInit = (list, blackListIds = []) => {
        const tempBlackListIds = [...blackListIds];
        if (list?.length) {
            handleTreeCheck(list, tempBlackListIds);
            // handleColdHeatTreeInit(list);
            handleSpaceTypeInit();
        }
    };

    const changeOnlyShowSelected = val => {
        // console.log('item: ', val);
        onlySelected.value = val;
    };

    // 空间功能类型，编码-对象映射
    const spaceFuncCodeMap = computed(() => {
        const obj = {};
        blackListSpaceTypeList.value?.forEach(func => {
            obj[func.funcType] = func;
        });
        return obj;
    });

    // 左侧树中的空间，数组
    const spacesInTree = computed(() => {
        const arr = [];
        initStaticTree?.value?.forEach(prj => {
            prj.children?.forEach(building => {
                building.children?.forEach(floor => {
                    floor.children?.forEach(s => {
                        arr.push({ ...s, name: s.localName ?? '--' });
                    });
                });
            });
        });
        return arr;
    });

    // 根据顶部筛选条件筛选出来的空间数组
    const filteredSpaces = computed(() => {
        const blackIdMap = {};
        if (onlySelected.value === 'checked') {
            blackListSpaceIds.value?.forEach(sId => {
                blackIdMap[sId] = true;
            });
        }
        return spacesInTree.value.filter(obj => {
            let isIn = true;
            if (notColdHeatModel.value?.length > 0) {
                const { serviceColdHeatSystemIds = [] } = obj || {};
                const hasService = notColdHeatModel.value?.some(v => serviceColdHeatSystemIds?.includes(v));
                isIn = !hasService;
            }
            if (isIn && hasTempIotModel.value) {
                if (hasTempIotModel.value === 'hasIot') {
                    isIn = obj.existTabIotInfoCodeRule;
                } else {
                    isIn = !obj.existTabIotInfoCodeRule;
                }
            }
            if (isIn && spaceTypeModel.value?.length > 0) {
                isIn = spaceTypeModel.value.includes(obj.roomFuncType);
            }
            if (isIn && onlySelected.value === 'checked') {
                isIn = !!blackIdMap[obj.id];
            }
            return isIn;
        });
    });

    const currentSpaces = computed(() => {
        // pageNum.value = 1;
        return filteredSpaces.value?.filter(obj => {
            let isIn = true;
            if (curSelectedFloor.value?.length > 0) {
                isIn = curSelectedFloor.value.some(fId => fId === obj.floorId);
            }
            if (isIn && keyword.value) {
                isIn = obj.localName?.includes(keyword.value);
            }
            return isIn;
        });
    });

    const pageTotal = computed(() => {
        return currentSpaces.value?.length || 0;
    });

    // 右侧表格中的空间数据(根据左侧选择的楼层、名字筛选)
    const tableListSpaces = computed(() => {
        const s = (pageNum.value - 1) * pageSize;

        return currentSpaces.value.slice(s, s + pageSize).map(obj => {
            return { ...obj, checked: blackListSpaceIds.value?.some(sId => sId === obj.id) ? 'checked' : 'uncheck' };
        });
    });

    // 获取空间功能类型
    const getSpaceFuncName = funcType => {
        return spaceFuncCodeMap.value[funcType];
    };

    // 左侧树
    const buildingFloorTree = computed(() => {
        let arr = [];
        if (initStaticTree?.value?.length > 0) {
            const spaceIdMap = {};
            filteredSpaces.value.forEach(s => {
                spaceIdMap[s.id] = s;
            });
            const r = initStaticTree?.value[0];

            arr = r.children
                ?.map(b => {
                    const building = { ...b };
                    building.children = building.children
                        .filter(f => {
                            return f.children?.some(s => spaceIdMap[s.id]);
                        })
                        .map(f => {
                            const floor = { ...f };

                            delete floor.children;
                            return floor;
                        });
                    return building;
                })
                .filter(b => b.children?.length > 0);
        }

        nextTick(() => {
            if (!curSelectedFloor.value?.length) {
                if (arr.length > 0) {
                    if (arr[0].children?.length > 0) {
                        curSelectedFloor.value = [arr[0].children[0].id];
                    }
                }
            }
        });
        return arr;
    });

    const invokeSaveChange = async (targetIds, inBlacklisted, useOpBusy = true) => {
        if ((useOpBusy && isOpBusy.value) || !targetIds?.length) {
            return;
        }
        if (useOpBusy) {
            isOpBusy.value = true;
        }
        try {
            const floorIdSet = new Set();
            targetIds.forEach(sId => {
                const obj = allSpaceIdMap[sId];
                if (obj?.floorId) {
                    floorIdSet.add(obj.floorId);
                }
            });

            await addInstanceConfig({
                templateType: templateType.value,
                instanceType: 'SPACE',
                instanceIds: targetIds,
                config: { inBlacklisted }
            });

            // 接口调用成功后更新blackListSpaceIds
            const tagSet = new Set(targetIds);
            let newIdSet = inBlacklisted ? new Set([...blackListSpaceIds.value, ...targetIds]) : new Set([...blackListSpaceIds.value].filter(x => !tagSet.has(x)));
            blackListSpaceIds.value = [...newIdSet];
            const treeNodeConfig = { cancelSelectTreeNode: true };
            emitter.emit('updateShieldAndBlackList', { floorIds: [...floorIdSet], treeNodeConfig });
        } catch (e) {
            console.log('e: ', e);
        } finally {
            isOpBusy.value = false;
        }
    };

    // 选择当前全部
    const selectAll = () => {
        const ids = currentSpaces.value?.map(obj => obj.id);
        // console.log('selectAll: ', ids);
        invokeSaveChange(ids, true);
    };
    const checkedChangeSpace = obj => {
        let inBlacklisted = false;
        const ids = obj?.items?.map(item => {
            if (item.checked === 'checked') {
                inBlacklisted = true;
            }
            return item.id;
        });
        invokeSaveChange(ids, inBlacklisted, false);
    };
    const clearCurSeleced = () => {
        const ids = currentSpaces.value?.map(obj => obj.id);

        invokeSaveChange(ids, false);
    };
    const clearAllSeleced = () => {
        // console.log('clearCurSeleced: ');
        invokeSaveChange(blackListSpaceIds.value, false);
    };

    const onLeftTreeScroll = ({ scrollTop }) => {
        leftTreeTop.value = scrollTop;
    };

    watch(
        [showModal, () => blackListSpaceIds?.value, () => initStaticTree?.value],
        ([show, curBlack, curTree]) => {
            if (show && curTree?.length) {
                handleTreeInit(curTree, curBlack);

                nextTick(() => {
                    leftScroll.value?.setScrollTop(leftTreeTop.value);
                });
            }
        },
        {
            immediate: true
        }
    );
    watch([notColdHeatModel, hasTempIotModel, spaceTypeModel, onlySelected, curSelectedFloor], () => {
        pageNum.value = 1;
    });

    const tags = [
        {
            show: node => {
                const curFunType = node?.roomFuncType;

                return !!curFunType;
            },
            txt: node => {
                const curFunType = node?.roomFuncType;

                return getSpaceFuncName(curFunType)?.name;
            },
            color: '#1B2129',
            bg: '#E8ECF0'
        },
        {
            show: () => {
                return true;
            },
            txt: node => {
                return node.existTabIotInfoCodeRule ? i18n.global.t('meos_control_web.has_iot') : i18n.global.t('meos_control_web.no_iot');
            },
            color: '#E68600',
            bg: '#FFF0CC'
        },
        {
            show: (node, config) => {
                const filterSystemIds = config.notColdHeatModel;

                if (!filterSystemIds?.length) {
                    return false;
                }

                if (node?.serviceColdHeatSystemIds?.length) {
                    // TODO 反向过滤
                    const hasService = filterSystemIds?.some(v => node?.serviceColdHeatSystemIds?.includes(v));
                    return !hasService;
                }
                return true;
            },
            txt: () => i18n.global.t('meos_control_web.no_service_relation'),
            color: '#D72824',
            bg: '#FFE6E5'
        }
    ];

    onMounted(() => {
        getColdHeatSystemTree({
            withColumns: ['id', 'localName', 'classCode']
        }).then(res => {
            if (res?.code === '00000') {
                const resData = res?.data;
                handleColdHeatTreeInit(resData);
            }
        });
    });

    onBeforeUnmount(() => {
        allSpaceIdMap = {};
        leftTreeTop.value = 0;
    });

    return {
        notColdHeatModel,
        notColdHeatOptions,
        spaceTypeModel,
        hasTempIotOptions,
        hasTempIotModel,
        spaceTypeOptions,
        buildingFloorTree,
        curSelectedFloor,
        tableListSpaces,
        tags,
        keyword,
        onlySelected,
        pageNum,
        pageTotal,
        pageSize,
        isOpBusy,
        blackListSpaceIds,
        leftScroll,
        changeOnlyShowSelected,
        closeModal,
        clickSaveBtn,
        selectAll,
        clearCurSeleced,
        clearAllSeleced,
        checkedChangeSpace,
        onLeftTreeScroll
    };
};
