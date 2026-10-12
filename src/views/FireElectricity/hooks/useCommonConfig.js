import useLoading from '@/hooks/useLoading';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import { queryEquipment } from '@/apis/fireElectricity';
import { listInfoCodeConfigsWithHttpConfig, queryEquipsWithHttpConfig } from '@/apis/public';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { GRID, SUCCESSCODE } from '@/utils/globalVariables';
import { RUNNING_MONITOR_TYPE } from '../constant/index';
import baseStore from '@/store/baseStore';
import dataDockHandling from '@/hooks/dataDockHandling';
import DockSingleton from '@/hooks/responsiveDock';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import _ from 'lodash';
import i18n from '@/localization';
import useStore from '@/store';
import { CAMERA_COLUMS } from '@/constants/equipAdditionalColumns';

export const monitoringGlobalLoadingKey = Symbol('monitoringGlobalLoadingKey'); // 全局loading
export const buildingFloorPromiseKey = Symbol('buildingFloorPromiseKey'); // 加载建筑楼层数据
export const monitoringMainLoadingKey = Symbol('monitoringMainLoadingKey'); // 左侧局部loading
export const abnormalEventListKey = Symbol('abnormalEventListKey'); // 异常事件列表
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey'); // 异常事件列表加载状态
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey'); // 异常事件列表更新时间
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey');
export const noRelationChartDataKey = Symbol('noRelationChartDataKey`'); // 异常事件列表无数据
export const claasCode2objectIdsKey = Symbol('claasCode2objectIdsKey`'); // 要订阅的数据（{classCode:ids}）

export const equipDyncInfoListKey = Symbol('equipDyncInfoListKey`'); // 图设备动态数据{id,tags}
export const showModuleInfoInjectKey = Symbol('showModuleInfoInjectKey');
export const selectModuleInfoInjectKey = Symbol('selectModuleInfoInjectKey'); // 当前选中对象
export const currentFloorObjInjectKey = Symbol('currentFloorObjInjectKey'); //当前进入的楼层
export const curHoverInfoKey = Symbol('curHoverInfoKey'); //当前hover信息
export const mapBgColorKey = Symbol('mapBgColorKey'); //地图背景色
export const dashboardFloorIdsKey = Symbol('dashboardFloorIdsKey'); //dashboard静态数据相关的楼层ID，主要给楼层选择器用
export const dashboardDataKey = Symbol('dashboardDataKey '); //dashboard静态数据
export const statisticsDataKey = Symbol('statisticsDataKey '); //dashboard顶部统计静态数据
export const statisticsSelectKey = Symbol('statisticsSelectKey '); //dashboard下拉框筛选
export const abnormalTypeKey = Symbol('abnormalTypeKey '); //dashboard下拉框筛选

export const clickAssembleFucKey = Symbol('clickAssembleFucKey ');
export const isFaultFucKey = Symbol('isFaultFucKey '); //是否故障
export const isAlarmFucKey = Symbol('isAlarmFucKey '); //是否报警

export const isGlobalLoadingKey = Symbol('isGlobalLoadingKey ');
export const equipsInFloorKey = Symbol('equipsInFloorKey '); //楼层下的设备
export const systemIdMapClassCodesKey = Symbol('systemIdMapClassCodesKey '); //系统ID映射系统类
export const allCameraEquipsKey = Symbol('allCameraEquipsKey '); //楼层图所有摄像头设备
export const camerasInFloorKey = Symbol('camerasInFloorKey '); //楼层下摄像头设备
export const abnormalListInFloorKey = Symbol('abnormalListInFloorKey '); //楼层下异常列表
export const curCheckedSysClassCodesKey = Symbol('curCheckedSysClassCodesKey '); //、
export const abnormalTypeFilteringKey = Symbol('abnormalTypeFilteringKey '); //异常类型筛选
export const spaceIdMapEquipsKey = Symbol('spaceIdMapEquipsKey '); //空间下的设备对象映射
export const selectCameraInfoKey = Symbol('selectCameraInfoKey '); //选择摄像头信息

export const equipListSidebarLoadingKey = Symbol('equipListSidebarLoadingKey'); //设备列表loading
export default selectSpaceObj => {
    const { openLoading, closeLoading } = useLoading('fire-electricity-warpper', '#F1F4F6', 'ball');
    const { loadDynaDataWithIotHandling, writeDataToResponsiveDock } = dataDockHandling();
    const queryDyncTreeToken = UseCancelTokenHooks();
    const toggleWidthDivRef = ref(null);
    const unpackShow = ref(true);
    const noRelationChartData = ref(true);
    const monitoringGlobalLoading = ref(true);
    const monitoringMainLoading = ref(false);
    const store = useStore();
    const { projectId } = store.base;
    const staticEquipIds = ref([]);
    const staticEquips = ref({});
    const claasCode2objectIds = ref({});
    const cameraClaasCode2objectIds = ref({});
    const curHoverInfo = ref({});
    const selectModuleInfo = ref(null);
    const curFloorObj = ref(null);
    const dashboardFloorIds = ref([]);
    const mapBgColor = ref('');
    const isGlobalLoading = ref(false);
    let buildingFloorPromise = null;
    const idMapEquip = ref({});
    const systemIdMapClassCodes = ref({});
    const allCameraEquips = ref([]);
    const showEquipListSidebar = ref(true);
    const equipListSidebarLoading = ref(false);

    const statisticsData = ref([]);
    const statisticsSelect = ref([]);
    const equips = ref([]);
    const spaceIdMapEquips = ref({});
    const selectCameraInfo = ref({});
    const showCamera = ref({});

    const floorIdMapEquips = {};
    const { getIotData, getObjectAbnormalStatus, getAbnormalEventsList } = DockSingleton.getInstance();

    const resetTreeData = () => {
        staticEquipIds.value = [];
        staticEquips.value = {};
        claasCode2objectIds.value = {};
        idMapEquip.value = {};
    };
    const currentFloorId = computed(() => {
        return curFloorObj.value?.id;
    });

    // 是故障
    const isFault = obj => {
        const iotObj = getIotData(obj.id, 'faultStatus');
        const AlarmObj = getIotData(obj.id, 'faultAlarm');
        return iotObj?.dataValue === '1' || AlarmObj?.dataValue === '1';
    };
    const isAbnormal = item => {
        const ids = [item.id];
        if (item.spaceIds?.length > 0) {
            ids.push(item.spaceIds[0]);
        }
        return getAbnormalEventsList(ids)?.length;
    };
    // 是报警信号
    const isAlarm = obj => {
        const alarmMessageObj = getIotData(obj.id, 'alarmMessage');
        const alarmStatusObj = getIotData(obj.id, 'alarmStatus');
        const normallyOpenDoorClosureAlarmObj = getIotData(obj.id, 'normallyOpenDoorClosureAlarm');
        const residualCurrentWarningObj = getIotData(obj.id, 'residualCurrentWarning');
        const overTemperatureWarningObj = getIotData(obj.id, 'overTemperatureWarning');
        const overTemperatureAlarmObj = getIotData(obj.id, 'overTemperatureAlarm');
        const residualCurrentAlarmObj = getIotData(obj.id, 'residualCurrentAlarm');
        const normallyClosedDoorOpeningAlarmObj = getIotData(obj.id, 'normallyClosedDoorOpeningAlarm');
        return (
            alarmMessageObj?.dataValue === '1' ||
            alarmStatusObj?.dataValue === '1' ||
            normallyOpenDoorClosureAlarmObj?.dataValue === '1' ||
            residualCurrentWarningObj?.dataValue === '1' ||
            overTemperatureWarningObj?.dataValue === '1' ||
            overTemperatureAlarmObj?.dataValue === '1' ||
            residualCurrentAlarmObj?.dataValue === '1' ||
            normallyClosedDoorOpeningAlarmObj?.dataValue === '1'
        );
    };

    const handleTreeBuildingFloorData = async () => {
        const parasm = {
            projectId,
            isQuerySpace: false
        };
        const { data, code } = await getListTreeBuildingFloorSpace(parasm);
        if (code === SUCCESSCODE) {
            xplantindoorenvStore().setBuildingData(data);
            xplantindoorenvStore().setBuildingFloorData(data);
        }
    };
    buildingFloorPromise = handleTreeBuildingFloorData();

    // 给卡片上添加计算属性的统计数据
    const makeObjCountComputed = (target, equipArr) => {
        // 设备数量
        target.equipCounts = equipArr?.length ?? 0;
        // 故障数量
        target.faultCounts = computed(() => {
            return equipArr?.filter(equip => isFault(equip))?.length ?? 0;
        });
        // 告警数量
        target.alarmCounts = computed(() => {
            return equipArr?.filter(equip => isAlarm(equip))?.length ?? 0;
        });
        // 异常数量
        target.abnormalCounts = computed(() => {
            let num = 0;
            const ids = [];
            equipArr?.forEach(equip => {
                ids.push(equip.id);
                if (equip.spaceIds?.length > 0) {
                    ids.push(equip.spaceIds[0]);
                }
            });
            num = getAbnormalEventsList(ids)?.length ?? 0;
            return num;
        });
    };
    // 将对象数组转换为list树
    const makeBuildFloorGroup = arr => {
        arr?.forEach(obj => {
            obj.name = obj.localName ?? '--';
        });
        const hasMultBuilding = _.groupBy(arr, obj => obj.buildingId)?.length > 1;
        const groupedByBuilding = _.groupBy(arr, 'buildingId');
        // 2. 构建树形结构
        const tree = _.map(groupedByBuilding, (items, buildingId) => {
            // 提取建筑名称（假设数据中没有建筑名称字段，直接用 buildingId）
            const buildingName = items?.length > 0 ? items[0].buildingLocalName ?? '--' : '--';

            // 3. 提取楼层并去重
            const floors = _.uniqBy(items, 'floorId').map(item => {
                const floorObj = {
                    floorId: item.floorId,
                    floorName: item.floorLocalName,
                    floorSequenceId: item.floorSequenceId,
                    buildingId: item.buildingId,
                    children: []
                };
                makeObjCountComputed(
                    floorObj,
                    arr?.filter(obj => obj.floorId === item.floorId)
                );
                return floorObj;
            });
            const buildingItem = {
                buildingId: buildingId,
                buildingName,
                children: floors?.sort((objA, objB) => objB.floorSequenceId - objA.floorSequenceId)
            };
            makeObjCountComputed(
                buildingItem,
                arr?.filter(obj => obj.buildingId === buildingId)
            );
            return buildingItem;
        });
        return tree || [];
    };

    // 查询摄像头设备
    const queryCameraEquips = async floorIds => {
        if (floorIds?.length > 0) {
            const paramsEquips = { classCodes: ['SPVSCM'], floorIds, additionalWithColumns: CAMERA_COLUMS };
            // const paramsEquips = { classCodes: ['SPVSCM'], floorIds };
            const { code, data } = await queryEquipsWithHttpConfig(paramsEquips);

            if (code === SUCCESSCODE && data) {
                const floorIdCache = {};
                const classCodeIds = {};
                data.forEach(obj => {
                    additionalFloorInfo(obj, floorIdCache);
                    if (!classCodeIds.SPVSCM) {
                        classCodeIds.SPVSCM = [];
                    }
                    classCodeIds.SPVSCM.push(obj.id);
                });
                cameraClaasCode2objectIds.value = classCodeIds;
                allCameraEquips.value = data;
            }
        }
    };

    // 加载静态数据
    // TODO！
    const getQueryEquipment = async () => {
        openLoading();
        isGlobalLoading.value = true;
        const cachedFloorInfo = {};
        try {
            await buildingFloorPromise;
            const { data } = await queryEquipment();

            const classCodeIds = {};
            const spaceIdMap = {};
            data?.forEach(item => {
                systemIdMapClassCodes.value[item.id] = { classCode: item.classCode, classCodeName: item.classCodeName };
                const eqIdsSet = new Set();
                item?.equipments?.forEach(io => {
                    additionalFloorInfo(io, cachedFloorInfo);
                    if (!io.systemId) {
                        io.systemId = [];
                    }
                    io.systemId.push(item.id);
                    // 不重复的设备
                    if (!idMapEquip.value[io.id]) {
                        idMapEquip.value[io.id] = io;
                        eqIdsSet.add(io.id);

                        equips.value.push(io);

                        if (!floorIdMapEquips[io.floorId]) {
                            floorIdMapEquips[io.floorId] = [];
                        }
                        floorIdMapEquips[io.floorId].push(io);
                        if (!classCodeIds[io.classCode]) {
                            classCodeIds[io.classCode] = [];
                        }
                        // 消防电取消空间的异常事件：https://shimo.im/docs/m5kvdmaz8Ph4083X
                        // if (!classCodeIds.GeneralZone) {
                        //     classCodeIds.GeneralZone = [];
                        // }
                        if (io.spaceIds?.length > 0) {
                            const spaceId = io.spaceIds[0];
                            // 消防电取消空间的异常事件：https://shimo.im/docs/m5kvdmaz8Ph4083X
                            // classCodeIds.GeneralZone.push(io.spaceIds[0]);
                            if (!spaceIdMap[spaceId]) {
                                spaceIdMap[spaceId] = [];
                            }
                            spaceIdMap[spaceId].push(io);
                        }
                        classCodeIds[io.classCode].push(io.id);
                    }
                });
                staticEquipIds.value = [...eqIdsSet];
                makeObjCountComputed(item, item?.equipments);
            });
            claasCode2objectIds.value = classCodeIds;
            Object.entries(([spaceId, eqs]) => {
                spaceIdMap[spaceId] = _.uniqBy(eqs, 'id');
            });
            console.log('spaceIdMap: ', spaceIdMap);
            spaceIdMapEquips.value = spaceIdMap;
            statisticsData.value = data;
            statisticsSelect.value = Array.from(new Map(data.map(io => [io.classCode, io])).values());
            dashboardFloorIds.value = Object.keys(floorIdMapEquips);
            console.log(statisticsSelect.value, 'equips');
            isGlobalLoading.value = false;
            queryCameraEquips(dashboardFloorIds.value);
            closeLoading();
        } catch (error) {
            isGlobalLoading.value = false;
            closeLoading();
        }
    };

    const curCheckedSysClassCodes = ref();
    const abnormalType = ref();

    const filterSystemCode = obj => {
        let val = true;
        if (curCheckedSysClassCodes.value?.length > 0) {
            val = curCheckedSysClassCodes.value.some(sysCode => {
                return obj.systemId?.some(sysId => systemIdMapClassCodes.value[sysId]?.classCode === sysCode);
            });
        }
        return val;
    };
    const filterEquipArr = () => {
        const eqs = equips.value.filter(obj => {
            let val = true;
            val = filterSystemCode(obj);
            if (val && abnormalType.value) {
                if (abnormalType.value === 'fault') {
                    val = isFault(obj);
                } else if (abnormalType.value === 'abnormal') {
                    val = isAbnormal(obj);
                } else if (abnormalType.value === 'alarm') {
                    val = isAlarm(obj);
                } else {
                    val = false;
                }
            }
            return val;
        });
        return eqs;
    };
    const dashboardData = computed(() => {
        const eqs = filterEquipArr();
        return makeBuildFloorGroup(eqs, floorIdMapEquips);
    });

    const init = () => {
        getQueryEquipment();
    };
    init();

    //详情侧边栏组装新数据格式
    const clickAssembleFuc = (field, targeId, type, systemType) => {
        const tree = [];
        let eqs = [];
        equipListSidebarLoading.value = true;
        try {
            // 用于存储第一层节点，以 classCode 为键
            const classCodeMap = {};
            const hasMultipleBuildings = xplantindoorenvStore().buildingFloorData.length > 1;

            // 提取构建第三层节点的函数
            const createLocalNode = item => {
                const alarmMessageObj = isAlarm(item); // 报警状态
                const faultStatusObj = isFault(item); // 故障状态
                const abnormalOrNot = getObjectAbnormalStatus(item.id); // 异常
                const { localName, id, spaceIds, floorId, floorLocalId, floorLocalName, buildingLocalName, buildingId, floorSequenceId } = item;
                return {
                    localName,
                    id,
                    spaceIds,
                    floorId,
                    floorLocalId,
                    floorLocalName,
                    buildingLocalName,
                    buildingId,
                    alarmMessageObj,
                    faultStatusObj,
                    abnormalOrNot,
                    floorSequenceId
                };
            };
            if (systemType) {
                eqs = equips.value;
            } else {
                eqs = filterEquipArr();
            }
            eqs.forEach(item => {
                const alarmMessageObj = isAlarm(item);
                const faultStatusObj = isFault(item);
                const shouldInclude = (type === 'fault' && faultStatusObj) || (type === 'alarm' && alarmMessageObj);

                if (item[field].includes(targeId) && shouldInclude) {
                    const { classCode, classCodeName, buildingId, buildingLocalName } = item;

                    // 处理第一层节点（classCodeName 和 classCode）
                    if (!classCodeMap[classCode]) {
                        const classNode = {
                            classCode,
                            classCodeName,
                            count: 0,
                            children: []
                        };
                        tree.push(classNode);
                        classCodeMap[classCode] = classNode;
                    }
                    const classNode = classCodeMap[classCode];
                    classNode.count += 1;

                    if (hasMultipleBuildings) {
                        // 处理第二层节点（buildingLocalName 和 buildingId）
                        let buildingNode = classNode.children.find(node => node.buildingId === buildingId);
                        if (!buildingNode) {
                            buildingNode = {
                                buildingId,
                                buildingLocalName,
                                children: []
                            };
                            classNode.children.push(buildingNode);
                        }
                        // 处理第三层节点
                        const localNode = createLocalNode(item);
                        buildingNode.children.push(localNode);
                    } else {
                        // 只有两层结构时，localNode 直接作为 classNode 的子节点
                        const localNode = createLocalNode(item);
                        classNode.children.push(localNode);
                    }
                }
            });
            tree.map(item => {
                item?.children?.map(io => {
                    io?.children?.sort((a, b) => {
                        const seqA = a.floorSequenceId || 0;
                        const seqB = b.floorSequenceId || 0;
                        return seqB - seqA;
                    });
                });
            });
            return tree;
        } catch (error) {
            console.error('组装树结构时出错:', error);
            return [];
        } finally {
            equipListSidebarLoading.value = false;
            showEquipListSidebar.value = false;
            nextTick(() => {
                showEquipListSidebar.value = true;
            });
        }
    };

    // 楼层下设备
    const equipsInFloor = computed(() => {
        if (curFloorObj.value?.id) {
            return equips.value?.filter(obj => {
                return obj.floorId === curFloorObj.value?.id;
            });
        }
        return [];
    });

    // 楼层下的摄像头
    const camerasInFloor = computed(() => {
        if (allCameraEquips.value?.length > 0 && curFloorObj?.value?.id) {
            return allCameraEquips.value.filter(obj => obj.floorId === curFloorObj?.value?.id);
        }
        return [];
    });

    //统计右侧查询异常事件id集合
    const abnormalTargetObjIds = computed(() => {
        const temp = [];
        equips.value.forEach(item => {
            temp.push(item.id);
            // 消防电取消空间的异常事件：https://shimo.im/docs/m5kvdmaz8Ph4083X
            // 所在空间只取第一个
            // if (item.spaceIds?.length > 0) {
            //     temp.push(item.spaceIds[0]);
            // }
        });
        // 去重并保持顺序
        return [...new Set(temp)];
    });
    // 各楼层异常事件列表
    const abnormalListInFloor = computed(() => {
        const floorIdMapList = {};
        equips.value?.forEach(obj => {
            if (!floorIdMapList[obj.floorId]) {
                floorIdMapList[obj.floorId] = [];
            }
            floorIdMapList[obj.floorId].push(obj.id);
            // 消防电取消空间的异常事件：https://shimo.im/docs/m5kvdmaz8Ph4083X
            // const inSpaceId = obj.spaceIds?.find(id => !!id);
            // if (inSpaceId) {
            //     floorIdMapList[obj.floorId].push(inSpaceId);
            // }
        });
        allCameraEquips.value?.forEach(obj => {
            floorIdMapList[obj.floorId]?.push(obj.id);
        });
        const res = {};
        Object.entries(floorIdMapList).forEach(([floorId, ids]) => {
            res[floorId] = getAbnormalEventsList(ids);
        });
        return res;
    });

    //异常类型筛选
    const abnormalTypeFiltering = computed(() => {
        const resultSet = new Set();
        const faultObj = { id: 'fault', name: i18n.global.t('meos_control_web.has_fault_signal'), Order: 3 };
        const alarmObj = { id: 'alarm', name: i18n.global.t('meos_control_web.has_alarm_signal'), Order: 2 };
        const abnormalObj = { id: 'abnormal', name: i18n.global.t('meos_control_web.has_abnormal_event'), Order: 1 };
        let hasAbnormal = false,
            hasFault = false,
            hasAlarm = false;
        for (const item of equips.value) {
            // if (!filterSystemCode(item)) {
            //     continue;
            // }
            if (!hasFault && isFault(item)) {
                resultSet.add(faultObj);
            }
            if (!hasAlarm && isAlarm(item)) {
                resultSet.add(alarmObj);
            }
            if (!hasAbnormal) {
                const ids = [item.id];
                if (item.spaceIds?.length > 0) {
                    ids.push(item.spaceIds[0]);
                }
                if (getAbnormalEventsList(ids)?.length) {
                    resultSet.add(abnormalObj);
                }
            }
            // 如果已经包含了所有可能的对象，可以提前终止遍历
            if (resultSet.size === 3) {
                break;
            }
        }
        const arr = Array.from(resultSet).sort((a, b) => a.Order - b.Order);
        return arr;
    });

    const spaceDetailData = computed(() => {
        if (selectSpaceObj?.value?.id) {
            const spaceId = selectSpaceObj.value.id;
            const equipInSpaces = spaceIdMapEquips.value[spaceId];
            const equipIds = [];
            const statusList = [];
            let hasAlarm = false,
                hasFault;
            const classCodeMapEquips = {};
            equipInSpaces?.forEach(obj => {
                equipIds.push(obj.id);
                if (!hasAlarm && isAlarm(obj)) {
                    hasAlarm = true;
                }
                if (!hasFault && isFault(obj)) {
                    hasFault = true;
                }
                const rawEq = toRaw(obj);
                if (!classCodeMapEquips[obj.classCode]) {
                    classCodeMapEquips[obj.classCode] = [];
                }

                classCodeMapEquips[obj.classCode].push(rawEq);
            });
            const abnormalEventList = getAbnormalEventsList([spaceId, ...equipIds]);
            if (abnormalEventList?.length > 0) {
                statusList.push({ code: 'abnormal', name: i18n.global.t('meos_control_web.abnormal'), color: '#F55047' });
            }
            if (hasAlarm) {
                statusList.push({ code: 'alarm', name: i18n.global.t('meos_control_web.alarm_signal'), color: '#FE8F3C' });
            }
            if (hasFault) {
                statusList.push({ code: 'fault', name: i18n.global.t('meos_control_web.fault_signal'), color: '#EABF00' });
            }
            const classCodeEquips = [];
            Object.keys(classCodeMapEquips).forEach(k => {
                const eqs = classCodeMapEquips[k];
                if (eqs?.length > 0) {
                    classCodeEquips.push({
                        classCode: k,
                        classCodeName: eqs[0].classCodeName,
                        equips: eqs
                    });
                }
            });

            return {
                abnormalEventList,
                statusList,
                classCodeEquips
            };
        }
        return null;
    });

    // 加载动态数据
    watch(
        staticEquipIds,
        () => {
            queryDyncTreeToken.cancelQuest();
            if (staticEquipIds.value?.length > 0) {
                const params = {
                    projectId: baseStore().projectId,
                    runningMonitorType: RUNNING_MONITOR_TYPE,
                    objectIds: staticEquipIds.value,
                    templateCode: GRID
                };

                listInfoCodeConfigsWithHttpConfig(params, { cancelToken: queryDyncTreeToken.cancelToken() }).then(res => {
                    if (res) {
                        const { code, data } = res;
                        if (code === SUCCESSCODE && data) {
                            // TODO

                            writeDataToResponsiveDock(data);
                        }
                    }
                });
            }
        },
        { immediate: true }
    );

    provide(monitoringGlobalLoadingKey, monitoringGlobalLoading);
    provide(monitoringMainLoadingKey, monitoringMainLoading);

    provide(noRelationChartDataKey, noRelationChartData);
    provide(claasCode2objectIdsKey, claasCode2objectIds);
    provide(buildingFloorPromiseKey, buildingFloorPromise);
    provide(curHoverInfoKey, curHoverInfo);
    provide(selectModuleInfoInjectKey, selectModuleInfo);
    provide(currentFloorObjInjectKey, curFloorObj);
    provide(mapBgColorKey, mapBgColor);
    provide(dashboardFloorIdsKey, dashboardFloorIds);
    provide(dashboardDataKey, dashboardData);
    provide(statisticsDataKey, statisticsData);
    provide(abnormalTypeKey, abnormalType);
    provide(statisticsSelectKey, statisticsSelect);
    provide(isGlobalLoadingKey, isGlobalLoading);
    provide(clickAssembleFucKey, clickAssembleFuc);
    provide(isFaultFucKey, isFault);
    provide(isAlarmFucKey, isAlarm);
    provide(equipsInFloorKey, equipsInFloor);
    provide(camerasInFloorKey, camerasInFloor);
    provide(systemIdMapClassCodesKey, systemIdMapClassCodes);
    provide(allCameraEquipsKey, allCameraEquips);
    provide(abnormalListInFloorKey, abnormalListInFloor);
    provide(curCheckedSysClassCodesKey, curCheckedSysClassCodes);
    provide(abnormalTypeFilteringKey, abnormalTypeFiltering);
    provide(spaceIdMapEquipsKey, spaceIdMapEquips);
    provide(selectCameraInfoKey, selectCameraInfo);
    provide(equipListSidebarLoadingKey, equipListSidebarLoading);
    return {
        currentFloorId,
        toggleWidthDivRef,
        unpackShow,
        claasCode2objectIds,
        cameraClaasCode2objectIds,
        abnormalTargetObjIds,
        selectModuleInfo,
        isGlobalLoading,
        curFloorObj,
        abnormalListInFloor,
        spaceDetailData,
        selectCameraInfo,
        allCameraEquips,
        showEquipListSidebar
    };
};
