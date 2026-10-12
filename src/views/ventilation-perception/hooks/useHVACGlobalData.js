// @ts-ignore
import i18n from '@/localization';
import { ref, provide } from 'vue';
import {
    showAbnormalStateKey,
    allEquipsInjectKey,
    allSpacesInjectKey,
    spacesAndEquipsLoadingInjectKey,
    clickMapObjInjectKey,
    buildFloorMapRefInjectKey,
    headerModelViewKey,
    spaceStaticDataLoadingKey,
    mapStaticDataLoadingKey,
    buildingFloorSpacesStaticTreeKey,
    spaceIotDataLoadingKey,
    abnormalParamIdsKey,
    mapClassCodeIdsKey,
    floorFromeKey
} from '../constant/symbols';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import useStore from '@/store';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import dataDockHandling from '@/hooks/dataDockHandling';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import { queryDashboardGridChartSpace } from '@/apis/dashboard';
import { GRID } from '@/utils/globalVariables';
const FIRST_LOAD_NUM = 50;

export default (setSpaceSSEClientOption, writeFloorInfoComputed, templateName, templateType) => {
    const { base } = useStore();
    const currentFloorObj = ref(); // 当前楼层对象

    const currentTab = ref('runStatus'); // 当前tab

    const onlyShowControlledEquipment = ref(true); // 仅看可控设备

    const filterEquipmentType = ref(); // 设备类筛选

    const equipTypeOptions = ref([]); //设备分类选项-排风机、送风机

    const equipClassCodeList = ref([]);
    // 建筑楼层空间数
    const buildingSpaceTree = ref([]);

    const curEquipInfoList = ref([]);

    const currentBuidingNum = ref(1); // 当前建筑数量
    const currentBuildingObj = ref({}); // 当前建筑对象

    const allEquips = ref([]);
    const allSpaces = ref([]);
    const spacesAndEquipsLoading = ref([]);

    // 是否展示异常 badge 小红点
    const showAbnormalState = ref(false);

    const buildFloorMapRef = ref(); // 建筑楼层map组件

    const headerModelView = ref('list'); // 当前视图 列表 or 地图
    const floorFrome = ref('');

    const showPipes = ref(false); // 显示管道
    const onlyShowAbnormal = ref(false); // 仅看异常

    const filterEquipmentClass = ref(); // 末端设备筛选

    // 建筑楼层空间数
    const abnormalParamIds = ref([]);

    const spaceStaticDataDataLoading = ref(false);
    const mapStaticDataLoading = ref(true);
    const buildingFloorSpacesStaticTree = ref([]); // 建筑楼层空间树
    const spaceIotDataLoading = ref(true);
    const mapClassCodeIds = ref();
    const abnormalList = [{ id: 'abnormal', name: i18n.global.t('meos_control_web.space_with_abnormal_event') }];
    // RISK_EVENT 异常状态，DEMAND_TARGET 需求目标值；DEMAND_TARGET_TYPE 需求目标类型
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const subTabsList = computed(() => {
        const indicators = {
            [i18n.global.t('common.meos_home_parking_lot')]: [{ id: 'cO', name: 'CO', unit: 'ppm' }],
            [i18n.global.t('meos_control_web.meos_home_computer_room_logistics')]: [
                { id: 'tdb', name: i18n.global.t('meos_control_web.temperature'), unit: '°C' },
                { id: 'o2', name: 'O₂', unit: '' }
            ],
            [i18n.global.t('meos_control_web.dome')]: [{ id: 'tdb', name: i18n.global.t('meos_control_web.temperature'), unit: '°C' }],
            [i18n.global.t('meos_control_web.meos_home_the_bathroom')]: [
                { id: 'nH3', name: 'NH₃', unit: '' },
                { id: 'h2S', name: 'H₂S', unit: '' }
            ]
        };

        if (templateName?.value) {
            return indicators[templateName?.value];
        }
        return [];
    });
    // 获取动态数据
    const getDynamicDataSlice = async (spaces = []) => {
        return loadDynaDataWithIotHandling({
            projectId: base.projectId,
            // runningMonitorType: 'AIR_TERMINAL',
            runningMonitorType: 'VENTILATION',
            templateCode: GRID,
            objectIds: spaces.map(sp => sp.id)
        });
    };

    const getDynamicIotData = async () => {
        const spaces = [];
        const claasCode2objectIds = {};
        buildingFloorSpacesStaticTree.value.forEach(building => {
            building.floors.forEach(floor => {
                spaces.push(...floor.spaces);
                floor.spaces.forEach(space => {
                    if (!claasCode2objectIds[space.classCode]) {
                        claasCode2objectIds[space.classCode] = [];
                    }
                    claasCode2objectIds[space.classCode].push(space.id);
                });
            });
        });

        setSpaceSSEClientOption(claasCode2objectIds);

        const spacesSlice = spaces.slice(0, FIRST_LOAD_NUM);

        try {
            spaceIotDataLoading.value = true;
            // 首次加载
            const fisrtLoadPromise = getDynamicDataSlice(spacesSlice);
            const remainSpaces = spaces.slice(FIRST_LOAD_NUM);

            // 第二次加载
            const secondLoadPromise = new Promise(reslove => {
                // 二次加载滞后处理
                setTimeout(async () => {
                    const tempPromise = remainSpaces.length ? getDynamicDataSlice(remainSpaces) : Promise.resolve(null);
                    const res = await tempPromise;
                    reslove(res);
                });
            });

            await Promise.all([fisrtLoadPromise, secondLoadPromise]);
        } catch (e) {
            console.error(e);
        } finally {
            spaceIotDataLoading.value = false;
        }
    };
    const fetchAbortController = ref();
    const getTreeBuildingFloor = async () => {
        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        // 获取建筑信息
        let parasm = {
            projectId: base.projectId,
            isQuerySpace: false
        };
        const res = await getListTreeBuildingFloorSpace(parasm, fetchAbortController.value.signal);
        const { data, code } = res;
        // eslint-disable-next-line eqeqeq
        if (code == '00000') {
            xplantindoorenvStore().setBuildingData(data);
            xplantindoorenvStore().setBuildingFloorData(data);
        }
        return data;
    };

    const getStaticSpace = async () => {
        spaceStaticDataDataLoading.value = true;
        mapStaticDataLoading.value = true;
        try {
            await getTreeBuildingFloor();
            const params = {
                // runningMonitorType: 'AIR_TERMINAL',
                runningMonitorType: 'VENTILATION',
                runningMonitorSecondType: templateType?.value,
                instance: {
                    instanceType: 'PROJECT',
                    instanceId: base.projectId
                },
                withColumns: [
                    'id',
                    'localName',
                    'floorId',
                    'buildingId',
                    'bimId',
                    'bimLocation',
                    'classCode',
                    'co2Rule',
                    'localId',
                    'name',
                    'objType',
                    'outline',
                    'roomFuncType',
                    'tdbRule',
                    'valid'
                ]
            };

            const res = await queryDashboardGridChartSpace(params);
            const { data, code } = res;
            const cachedFloorInfo = {};
            const buildingFloorSpaceTreeMap = {};
            if (code === '00000') {
                data.forEach(space => {
                    additionalFloorInfo(space, cachedFloorInfo);

                    // 建筑分组
                    if (!buildingFloorSpaceTreeMap[space.buildingId]) {
                        buildingFloorSpaceTreeMap[space.buildingId] = {
                            id: space.buildingId,
                            name: space.buildingLocalName,
                            buildingLocalName: space.floorLocalName,
                            buildingSequenceId: space.buildingSequenceId,
                            floors: {}
                        };
                    }

                    // 楼层分组
                    const floorMap = buildingFloorSpaceTreeMap[space.buildingId].floors;
                    if (!floorMap[space.floorId]) {
                        floorMap[space.floorId] = {
                            id: space.floorId,
                            name: space.floorLocalName,
                            floorLocalName: space.floorLocalName,
                            floorName: space.floorLocalName,
                            buildingLocalName: space.buildingLocalName,
                            floorSequenceId: space.floorSequenceId,
                            spaces: []
                        };
                    }
                    const spaceArr = floorMap[space.floorId].spaces;
                    spaceArr.push(space);
                });

                const buildingFloorSpaceTree = Object.values(buildingFloorSpaceTreeMap);
                buildingFloorSpaceTree.forEach(building => {
                    building.floors = Object.values(building.floors);
                    // 楼层排序
                    building.floors.sort((f1, f2) => {
                        return f2.floorSequenceId - f1.floorSequenceId;
                    });
                    building.floors.forEach(floor => {
                        writeFloorInfoComputed(floor);
                    });
                });

                // 建筑排序
                buildingFloorSpaceTree.sort((b1, b2) => {
                    return b2.buildingSequenceId - b1.buildingSequenceId;
                });

                buildingFloorSpacesStaticTree.value = buildingFloorSpaceTree;
                currentBuildingObj.value = buildingFloorSpacesStaticTree.value[0];
                getDynamicIotData();
            }
        } catch (e) {
            console.error('getStaticSpace  error:', e);
        } finally {
            spaceStaticDataDataLoading.value = false;
        }
    };

    watch(
        () => templateType?.value,
        val => {
            if (val) {
                headerModelView.value = 'list';
                getStaticSpace();
            }
        },
        { immediate: true }
    );
    provide(showAbnormalStateKey, showAbnormalState);

    provide('currentFloorObj', currentFloorObj);
    provide('curEquipInfoList', curEquipInfoList);

    // tab相关
    provide('currentTab', currentTab);

    // 显隐相关
    // 仅看可控设备
    provide('onlyShowControlledEquipment', onlyShowControlledEquipment);

    // 筛选相关
    // 选中的设备类
    provide('filterEquipmentType', filterEquipmentType);

    provide('equipClassCodeList', equipClassCodeList);
    provide('buildingSpaceTree', buildingSpaceTree);
    provide('equipTypeOptions', equipTypeOptions);
    provide('currentBuildingObj', currentBuildingObj);
    provide('currentBuidingNum', currentBuidingNum);
    provide('subTabsList', subTabsList);

    const clickMapObj = obj => {
        buildFloorMapRef.value?.clickMapObj(obj);
    };

    provide('currentBuidingNum', currentBuidingNum);

    // tab相关
    provide('currentTab', currentTab);

    // 显隐相关
    provide('showPipes', showPipes);
    provide('onlyShowAbnormal', onlyShowAbnormal);
    provide('onlyShowControlledEquipment', onlyShowControlledEquipment);

    // 筛选相关
    provide('filterEquipmentClass', filterEquipmentClass);

    provide('equipClassCodeList', equipClassCodeList);
    provide('buildingSpaceTree', buildingSpaceTree);
    provide('abnormalList', abnormalList);
    provide(allEquipsInjectKey, allEquips);
    provide(allSpacesInjectKey, allSpaces);
    provide(spacesAndEquipsLoadingInjectKey, spacesAndEquipsLoading);

    provide(clickMapObjInjectKey, clickMapObj);
    provide(buildFloorMapRefInjectKey, buildFloorMapRef);
    provide(headerModelViewKey, headerModelView);

    provide(buildingFloorSpacesStaticTreeKey, buildingFloorSpacesStaticTree);
    provide(spaceStaticDataLoadingKey, spaceStaticDataDataLoading);
    provide(mapStaticDataLoadingKey, mapStaticDataLoading);
    provide(spaceIotDataLoadingKey, spaceIotDataLoading);
    provide(abnormalParamIdsKey, abnormalParamIds);
    provide(mapClassCodeIdsKey, mapClassCodeIds);

    provide(floorFromeKey, floorFrome);
    return {
        currentFloorObj,
        currentBuildingObj,
        headerModelView,
        floorFrome,
        buildFloorMapRef
    };
};
