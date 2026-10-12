// @ts-ignore
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { STATIC_TYPE, INSTANCE_TYPE, LOOP_STATIC_TYPES, INFOCODE, PUBLIC, PARKING } from '../variables';
import { loopListKey, getModuleListByLoopIdKey, getLoopListByBuildingIdKey, getLoopListByFloorIdKey, curStaticLoopCountKey, loopIdMapInfoConfigsKey } from './useBaseHook';

import { canControl } from '@/utils/tools';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import _ from 'lodash';
import { markRaw } from 'vue';

export const curOpenGroupCodeKey = Symbol('curOpenGroupCodeKey');
/**
 * 根据统计类型过滤回路
 * @param {string} type - 统计类型
 * @param {string} objId - 对象ID
 * @param {Function} getIotData - 获取IoT数据的函数
 * @returns {boolean} 是否符合过滤条件
 */
const filterByStaticType = (type, objId, getIotData) => {
    const typeConfig = {
        [STATIC_TYPE.LOCAL]: INFOCODE.localRemoteStatus0,
        [STATIC_TYPE.OPEN_MORE]: INFOCODE.controlDeviationStatus1,
        [STATIC_TYPE.OPEN_LESS]: INFOCODE.controlDeviationStatus2,
        [STATIC_TYPE.UNKNOW]: INFOCODE.runStatusNull
    };

    const config = typeConfig[type];
    if (!config) return false;

    const infoObj = getIotData(objId, config.infoCode);
    return config.checkDataValue ? config.checkDataValue(infoObj?.dataValue) : infoObj?.dataValue === config.dataValue;
};
/**
 * 按灯具类型分组
 * @param {Array} loops - 回路列表
 * @returns {Array} 按灯具类型分组的回路列表
 */
const getLampLoopList = loops => {
    const lamps = [];
    const keyMapObj = {};
    loops?.forEach(obj => {
        if (!keyMapObj[obj.lampFuncType]) {
            const lamp = {
                id: obj.lampFuncType,
                name: obj.lampFuncTypeName,
                children: []
            };
            keyMapObj[obj.lampFuncType] = lamp;
            lamps.push(lamp);
        }
        keyMapObj[obj.lampFuncType].children.push(obj);
    });
    return lamps;
};
/**
 * 按空间分组 ,排序：
 * @param {*} loops
 * @returns
 */
const _getSpaceLoopList = (loops, floorMap, hasMultiBuilding) => {
    if (!floorMap) {
        return [];
    }
    let spaces = [],
        noneModule = null;
    const keyMapObj = {};

    loops?.forEach(obj => {
        const space = obj.inSpace;
        // console.log('space: ', space, obj);
        if (space) {
            if (!keyMapObj[space.id]) {
                const newObj = { ...space, isSpace: true, floorLocalName: floorMap[space.floorId]?.floorLocalName, children: [] };
                keyMapObj[space.id] = newObj;
                spaces.push(newObj);
            }
            keyMapObj[space.id].children.push(obj);
        } else {
            if (!noneModule) {
                const newObj = { id: 'none', isSpace: true, localName: i18n.global.t('meos_control_web.unlinked_lighting_controller'), children: [] };
                noneModule = newObj;
            }
            noneModule?.children.push(obj);
        }
    });
    if (hasMultiBuilding) {
        // 第二步：按建筑分组，构建建筑层级结构
        const buildingMap = {}; // 临时存储：{建筑排序值: 建筑对象}
        // 1. 遍历空间，按 buildingOrder 分组到对应建筑
        spaces.forEach(space => {
            const buildingOrder = floorMap[space.floorId]?.buildingOrder ?? 999;
            const buildingId = floorMap[space.floorId]?.buildingId ?? `building_${buildingOrder}`;
            const buildingLocalName = floorMap[space.floorId]?.buildingLocalName || '--';

            // 若该建筑未初始化，创建建筑对象
            if (!buildingMap[buildingOrder]) {
                buildingMap[buildingOrder] = {
                    id: buildingId, // 建筑唯一ID（可自定义）
                    isBuilding: true,
                    open: true,
                    buildingOrder: buildingOrder,
                    buildingLocalName: buildingLocalName,
                    children: [] // 建筑下的空间列表
                };
            }
            // 将空间添加到对应建筑的 children 中
            buildingMap[buildingOrder].children.push(space);
        });

        // 第三步：对每个建筑下的空间按原有规则排序
        Object.values(buildingMap).forEach(building => {
            building.children = _.orderBy(
                building.children,
                [
                    // 排序维度1：楼层序号（降序，返回负数实现asc等价降序）
                    space => -(floorMap[space.floorId]?.floorSequenceId ?? 0),
                    // 排序维度2：空间名称（升序）
                    space => space.localName
                ],
                ['asc', 'asc']
            );
        });

        // 第四步：将建筑对象按 buildingOrder 升序排列，生成最终建筑数组
        const buildingList = _.orderBy(Object.values(buildingMap), ['buildingOrder'], ['asc']);

        // 第五步：处理“未关联”分组（noneModule），追加到建筑列表最后
        if (noneModule) {
            buildingList.push(noneModule);
        }
        return buildingList;
    } else {
        spaces = _.orderBy(
            spaces,
            [
                // 排序维度1：建筑ID（按建筑原始顺序）
                space => {
                    // 若空间的floorId无匹配，默认排最后（可自定义）
                    return floorMap[space.floorId]?.buildingOrder ?? 999;
                },
                // 排序维度2：floorSequenceId（降序，所以返回负数实现降序）
                space => {
                    return -(floorMap[space.floorId]?.floorSequenceId ?? 0);
                },
                // 排序维度3：空间名称（升序）
                space => space.localName
            ],
            [
                'asc', // 建筑ID升序（匹配建筑原始顺序）
                'asc', // 因为维度2返回负数，asc等价于原数值降序
                'asc' // 空间名称升序
            ]
        );
        if (noneModule) {
            spaces.push(noneModule);
        }
        // console.log('spaces: ', spaces);
        return spaces;
    }
};
export default props => {
    const { getIotData } = DockSingleton.getInstance();
    const loopList = inject(loopListKey);

    const base = baseStore();
    const getLoopListByBuildingId = inject(getLoopListByBuildingIdKey);
    const getLoopListByFloorId = inject(getLoopListByFloorIdKey);
    const getModuleListByLoopId = inject(getModuleListByLoopIdKey);
    const curStaticLoopCount = inject(curStaticLoopCountKey);
    const loopIdMapInfoConfigs = inject(loopIdMapInfoConfigsKey);

    const loopCheckedMap = ref({});

    const showToolPanel = ref(false);
    const curSelStaticCode = ref('');
    const curOpenGroupCode = ref('');
    const loopOpenedMap = ref({
        [LOOP_STATIC_TYPES.MANUAL.code]: {},
        [LOOP_STATIC_TYPES.SYS_AUTO.code]: {},
        [LOOP_STATIC_TYPES.LOCAL.code]: {}
    });
    const extpandInfoAllMap = ref({});

    const allBuildingData = xplantindoorenvStore().buildingData;

    // ========== 性能优化：缓存不变的外部查询，避免在循环内反复调用 ==========
    const _hasPermission = (() => {
        const permission = window[GET_MENU_CONFIG]()?.PERMISSION || '';
        return permission && base.hasAuth(permission);
    })();
    const _isEdge = isEdge();

    const reset = () => {
        loopCheckedMap.value = {};
        extpandInfoAllMap.value = {};
        loopOpenedMap.value = {
            [LOOP_STATIC_TYPES.MANUAL.code]: {},
            [LOOP_STATIC_TYPES.SYS_AUTO.code]: {},
            [LOOP_STATIC_TYPES.LOCAL.code]: {}
        };
        showToolPanel.value = false;
        curSelStaticCode.value = '';
        curOpenGroupCode.value = '';
    };

    const floorMap = computed(() => {
        const _map = {};
        allBuildingData?.forEach((building, buildingIndex) => {
            // 遍历当前建筑的所有楼层，写入映射表
            building.floors.forEach(floor => {
                _map[floor.id] = {
                    buildingId: building.id, // 关联建筑id
                    buildingOrder: buildingIndex, // 关联建筑索引-顺序
                    buildingLocalName: building.localName, // 关联建筑名称
                    floorSequenceId: floor.floorSequenceId, // 关联楼层序号
                    floorLocalName: floor.localName // 关联楼层名称
                };
            });
        });
        return _map;
    });
    const targetLoopList = computed(() => {
        let arr = null;
        if (props.instanceType === INSTANCE_TYPE.BUILDING) {
            arr = getLoopListByBuildingId(props.instanceId);
        } else if (props.instanceType === INSTANCE_TYPE.FLOOR) {
            arr = getLoopListByFloorId(props.instanceId);
        } else {
            if (loopList?.value) {
                arr = [...loopList.value.values()];
            }

            props.serviceAreaType && (arr = arr.filter(loop => loop.serviceAreaType === props.serviceAreaType));
        }
        if (!arr) {
            return [];
        }

        arr = arr
            .filter(_obj => {
                const obj = toRaw(_obj);
                let inSpace = null;
                const relControllers = getModuleListByLoopId(obj.id);

                if (relControllers?.length > 0) {
                    inSpace = relControllers[0].relSpace;
                    obj.inSpace = toRaw(inSpace);
                    obj.inSpaceName = toRaw(inSpace)?.localName;
                }
                return filterByStaticType(props.type, obj.id, getIotData);
            })
            .sort((a, b) =>
                a.localName?.localeCompare(b.localName, 'zh', {
                    numeric: true,
                    sensitivity: 'base'
                })
            );
        // 阻止 Vue 对回路对象做深层响应式代理，减少 100+ 个对象的 reactive getter/setter 初始化开销
        return arr.map(loop => markRaw(loop));
    });

    const NO_PER_TEXT = i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');
    const CLOUD_NO_TEXT = i18n.global.t('meos_control_web.cloud_platform_operation_not_supported_please_use_edge');
    // ========== 性能优化：objDisabledInfo 从 targetLoopList 派生，避免单独遍历 ==========
    const objDisabledInfo = computed(() => {
        const objIdMap = {};
        targetLoopList.value.forEach(loop => {
            if (!_hasPermission) {
                objIdMap[loop.id] = {
                    value: false,
                    text: NO_PER_TEXT
                };
            } else if (!_isEdge) {
                objIdMap[loop.id] = {
                    value: false,
                    text: CLOUD_NO_TEXT
                };
            } else {
                const onlineStatus = getIotData(loop.id, INFOCODE.onlineStatus0.infoCode);
                const localRemoteStatus = getIotData(loop.id, INFOCODE.localRemoteStatus0.infoCode);
                objIdMap[loop.id] = canControl([onlineStatus, localRemoteStatus]);
            }
        });
        return objIdMap;
    });

    const getSpaceLoopList = loops => {
        const hasMultiBuilding = allBuildingData?.length > 1;
        return _getSpaceLoopList(loops, floorMap.value, hasMultiBuilding);
    };

    // ========== 性能优化：curStaticLoopCount 副作用移到 watcher，不在 computed 内赋值 ==========
    watch(
        targetLoopList,
        list => {
            curStaticLoopCount.value = list?.length ?? 0;
        },
        { immediate: true }
    );

    const curSecondTypeCode = computed(() => {
        if (props.serviceAreaType === PARKING.id) return PARKING.code;
        if (props.serviceAreaType === PUBLIC.id) return PUBLIC.code;
        return '';
    });

    const curLoopGroupsBase = computed(() => {
        const localLoops = [];
        const manualOpenLoops = [];
        const sysAutoCloseLoops = [];
        const groups = [];
        targetLoopList.value?.forEach(loop => {
            const equipSwitchSetInfo = getIotData(loop.id, 'equipSwitchSet');
            const localRemoteStatusInfo = getIotData(loop.id, 'localRemoteStatus');
            if (localRemoteStatusInfo.dataValue === '0') {
                localLoops.push(loop);
            } else if (equipSwitchSetInfo?.additionalMapValue?.recoveryDateTime) {
                manualOpenLoops.push(loop);
            } else {
                sysAutoCloseLoops.push(loop);
            }
        });

        if (manualOpenLoops.length > 0) {
            const descs = LOOP_STATIC_TYPES.MANUAL[props.type] ?? {};
            groups.push({ ...descs, code: LOOP_STATIC_TYPES.MANUAL.code, checkable: true, loops: manualOpenLoops });
        }
        if (sysAutoCloseLoops.length > 0) {
            const descs = LOOP_STATIC_TYPES.SYS_AUTO[props.type] ?? {};
            groups.push({ ...descs, code: LOOP_STATIC_TYPES.SYS_AUTO.code, checkable: true, loops: sysAutoCloseLoops });
        }
        if (localLoops.length > 0) {
            groups.push({ ...LOOP_STATIC_TYPES.LOCAL, checkable: false, loops: localLoops });
        }

        return groups;
    });

    const curLoopGroups = computed(() => {
        return curLoopGroupsBase.value.map(group => {
            const result = {
                ...group,
                groupedLoops: group.code === LOOP_STATIC_TYPES.LOCAL.code ? getSpaceLoopList(group.loops, floorMap.value) : getLampLoopList(group.loops)
            };
            if (group.code !== LOOP_STATIC_TYPES.LOCAL.code) {
                const { code } = group;
                // 用 getter 对象替代内层 computed ref，从根本上消除 computed-inside-computed 反模式
                result.lampsCheckedMap = {
                    get value() {
                        return lampsCheckedMapsByGroup.value[code] || {};
                    }
                };
                result.allCheckedValue = {
                    get value() {
                        return allCheckedValuesByGroup.value[code] || 'uncheck';
                    }
                };
                result.allDisabledInfo = {
                    get value() {
                        return allDisabledInfoByGroup.value[code]?.value ?? false;
                    },
                    get text() {
                        return allDisabledInfoByGroup.value[code]?.text ?? '';
                    }
                };
            }
            return result;
        });
    });

    // ========== 性能优化：将原本在 curLoopGroups 内层 computed 中的计算提取到 hook 级 ==========
    const lampsCheckedMapsByGroup = computed(() => {
        const result = {};
        curLoopGroupsBase.value.forEach(group => {
            if (group.code === LOOP_STATIC_TYPES.LOCAL.code) return;
            const groupedLoops = getLampLoopList(group.loops);
            const map = {};
            groupedLoops?.forEach(lamp => {
                const loopCount = lamp.children?.length;
                const checkedLoopCount = lamp.children?.filter(obj => loopCheckedMap.value[obj.id])?.length;
                map[lamp.id] = checkedLoopCount > 0 && checkedLoopCount !== loopCount ? 'notNull' : checkedLoopCount === loopCount && loopCount > 0 ? 'checked' : 'uncheck';
            });
            result[group.code] = map;
        });
        return result;
    });

    const allCheckedValuesByGroup = computed(() => {
        const result = {};
        const maps = lampsCheckedMapsByGroup.value;
        Object.entries(maps).forEach(([code, map]) => {
            const lampIds = Object.keys(map);
            const lampCount = lampIds.length;
            const lampCheckedCount = lampIds.filter(id => map[id] === 'checked').length;
            const lampNotNullCount = lampIds.filter(id => map[id] === 'notNull').length;
            result[code] =
                lampNotNullCount > 0 || (lampCheckedCount > 0 && lampCheckedCount !== lampCount)
                    ? 'notNull'
                    : lampCheckedCount === lampCount && lampCount > 0
                    ? 'checked'
                    : 'uncheck';
        });
        return result;
    });

    const allDisabledInfoByGroup = computed(() => {
        const result = {};
        curLoopGroupsBase.value.forEach(group => {
            if (group.code === LOOP_STATIC_TYPES.LOCAL.code) return;
            const hasEnabled = group.loops?.some(loop => objDisabledInfo.value[loop.id]?.value);
            if (hasEnabled) {
                result[group.code] = { value: true, text: '' };
            } else {
                const disableLoopId = group.loops?.find(loop => !objDisabledInfo.value[loop.id]?.value)?.id;
                if (disableLoopId) {
                    result[group.code] = objDisabledInfo.value[disableLoopId];
                }
            }
        });
        return result;
    });

    // 按控制模块分组
    const controllerLoopList = computed(() => {
        const idMap = {};
        const modules = [];
        let noneModule = null;
        targetLoopList.value?.forEach(obj => {
            const { relController } = obj;
            if (relController?.length > 0) {
                const controller = relController[0];
                if (!idMap[controller.id]) {
                    const newObj = { ...controller, children: [] };
                    idMap[controller.id] = newObj;
                    modules.push(newObj);
                }
                idMap[controller.id].children.push(obj);
            } else {
                if (!noneModule) {
                    const newObj = { id: 'none', localName: '--', children: [] };
                    noneModule = newObj;
                }
                noneModule?.children.push(obj);
            }
        });

        if (noneModule) {
            modules.push(noneModule);
        }
        return modules;
    });

    const loopCheckedIds = computed(() => {
        return Object.keys(loopCheckedMap.value)?.filter(id => {
            return loopCheckedMap.value[id];
        });
    });

    const offlineCount = computed(() => {
        if (props.type !== STATIC_TYPE.UNKNOW) {
            return 0;
        }
        return (
            targetLoopList.value?.filter(loop => {
                return getIotData(loop.id, 'onlineStatus')?.dataValue === '0';
            })?.length ?? 0
        );
    });

    const hasIntervention = objId => {
        if (loopIdMapInfoConfigs.value) {
            const controls = loopIdMapInfoConfigs.value[objId]?.controlledParameterSet;

            return controls?.some(info => {
                // 除手自动设定信息点之外的有干预时间的
                if (info.infoCode === 'manualAutoSet') {
                    return false;
                }
                const infoData = getIotData(objId, info.infoCode);

                return !!infoData?.additionalMapValue?.recoveryDateTime;
            });
        }
        return false;
    };
    const checkedInfoList = computed(() => {
        const codeMap = { manualAutoStatus: [], equipSwitchSet: [], intervention: [] };
        loopCheckedIds.value?.forEach(id => {
            const manualInfo = getIotData(id, 'manualAutoStatus');
            const equipSwitchSetInfo = getIotData(id, 'equipSwitchSet');
            if (manualInfo?.infoCode) {
                codeMap.manualAutoStatus.push(id);
            }
            if (equipSwitchSetInfo?.infoCode) {
                codeMap.equipSwitchSet.push(id);
            }

            if (hasIntervention(id)) {
                codeMap.intervention.push(id);
            }
        });
        return codeMap;
    });

    const clearCheck = () => {
        loopCheckedMap.value = {};
    };

    watch([() => props.type, () => props.instanceType, () => props.instanceId], () => {
        reset();
    });
    watch(loopCheckedIds, () => {
        showToolPanel.value = loopCheckedIds.value?.length > 0;
    });
    // 根据当前列表变化清除不存在的回路勾选
    watch(targetLoopList, () => {
        const idMap = {};
        targetLoopList.value?.forEach(obj => {
            idMap[obj.id] = true;
        });
        Object.keys(loopCheckedMap.value)?.forEach(id => {
            if (!idMap[id]) {
                delete loopCheckedMap.value[id];
            }
        });
    });
    watch(
        () => objDisabledInfo.value,
        () => {
            Object.entries(objDisabledInfo.value).forEach(([loopId, info]) => {
                if (!info.value) {
                    loopCheckedMap.value[loopId] = false;
                }
            });
        }
    );
    watch(curLoopGroupsBase, () => {
        curLoopGroupsBase.value?.forEach(group => {
            if (curCheckedGroup.value?.checkable) {
                group.loops.forEach(loop => {
                    const checkedCode = loopCheckedMap.value[loop.id];
                    if (checkedCode && checkedCode !== group.code) {
                        delete loopCheckedMap.value[loop.id];
                    }
                });
            }
        });
    });

    const uncheckOtherGroup = curGroup => {
        const otherCheckableGroup = curLoopGroups.value.find(g => {
            return g.code !== curGroup.code && g.code !== LOOP_STATIC_TYPES.LOCAL.code;
        });
        if (otherCheckableGroup) {
            otherCheckableGroup.loops.forEach(loop => {
                loopCheckedMap.value[loop.id] = false;
            });
        }
    };

    const clickLampCheckBox = (lamp, group) => {
        // console.log('lamp, group: ', lamp, group);
        uncheckOtherGroup(group);

        const newCheckVal = group.lampsCheckedMap.value[lamp.id] === 'uncheck' ? 'checked' : 'uncheck';
        lamp.children?.forEach(obj => {
            if (objDisabledInfo.value[obj.id]?.value) {
                // 有权限才勾选
                loopCheckedMap.value[obj.id] = newCheckVal === 'checked' ? group.code : false;
            }
        });
    };
    const clickLoopCheckBox = (checkItem, group) => {
        const { id, checked } = checkItem;
        uncheckOtherGroup(group);
        if (objDisabledInfo.value[id]?.value) {
            loopCheckedMap.value[id] = checked !== 'checked' ? group.code : false;
        }
    };
    const checkAll = (curChecked, group) => {
        if (curChecked === 'checked' || curChecked === 'notNull') {
            loopCheckedMap.value = {};
        } else {
            const idMap = {};
            group.loops?.forEach(obj => {
                // console.log('obj: ', obj);
                // 有权限才勾选
                if (objDisabledInfo.value[obj.id]?.value) {
                    idMap[obj.id] = group.code;
                }
            });
            loopCheckedMap.value = idMap;
        }
    };
    /** 当前选中的回路分组 */
    const curCheckedGroup = computed(() => {
        return curLoopGroups.value.find(g => g.loops.some(loop => loopCheckedMap.value[loop.id]));
    });

    const toggleInfoAll = (val, group) => {
        // extpandInfoAll.value = val;
        // group.extpandInfoAll = val;
        extpandInfoAllMap.value[group.code] = val;
        const idMap = {};
        targetLoopList.value?.forEach(obj => {
            idMap[obj.id] = val;
        });
        loopOpenedMap.value[group.code] = idMap;
    };
    const selStaticItem = item => {
        if (curSelStaticCode.value === item.code) {
            curSelStaticCode.value = '';
        } else {
            curSelStaticCode.value = item.code;
        }
    };

    provide(curOpenGroupCodeKey, curOpenGroupCode);

    return {
        // allCheckedValue,
        // lampsCheckedMap,
        controllerLoopList,
        loopCheckedMap,
        showToolPanel,
        loopCheckedIds,
        loopOpenedMap,
        curSelStaticCode,
        offlineCount,
        targetLoopList,
        checkedInfoList,
        curCheckedGroup,
        objDisabledInfo,
        curSecondTypeCode,
        curLoopGroups,
        extpandInfoAllMap,
        getLampLoopList,
        getSpaceLoopList,
        clickLoopCheckBox,
        clickLampCheckBox,
        checkAll,
        toggleInfoAll,
        clearCheck,
        selStaticItem
    };
};
