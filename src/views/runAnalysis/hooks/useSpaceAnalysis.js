// @ts-ignore
import i18n from '@/localization';
import {
    globalTimeKey,
    curSelectedFloorKey,
    curSelectedSpaceKey,
    clickSpaceKey,
    curSelectedTimeKey,
    changeTimeKey,
    changeIotSpaceKey,
    spaceTypeKey,
    buildingInfoPromiseKey,
    spaceTimeStatisticsKey
} from '../injectionKey';
import dayjs from 'dayjs';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import baseStore from '@/store/baseStore';
import { getAirSpaceRecord, getSpaceListByIds } from '@/apis/runAnalysis';
import { CO2, TEMPERATURE, AIRSPACETYPE_MAP_IOTCODE } from '../variable';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { transeAirSpaceRecord, makeFlatBuildingFloorSpaces, findSpaceStatusInTime, getStoreTreeBuildingFloor } from '../utils/index';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';

export default () => {
    const options = ref([
        {
            key: TEMPERATURE,
            label: i18n.global.t('meos_control_web.temperature_analysis_during_business_hours')
        },
        {
            key: CO2,
            label: i18n.global.t('meos_control_web.during_business_hours')
        }
    ]);
    const spaceType = ref(TEMPERATURE);
    const globalTime = inject(globalTimeKey);
    // 只看IOT监测空间
    const onlyIotMonitorSpace = ref(true);
    // 辅助线当前选择的时间，默认12:00
    const curSelectedTime = ref('12:00');
    // 当前选中空间对象
    const curSelectedSpaceObj = ref();

    const curSelectedFloorObj = ref();
    // 整体达标率
    const complianceRate = ref(75.5);
    const spaceRecordApiToken = UseCancelTokenHooks();
    const spaceModelApiToken = UseCancelTokenHooks();
    const buildingInfoPromise = getStoreTreeBuildingFloor();

    const spaceInfoList = ref();
    const spaceDetailList = ref();
    const loading = ref(false);

    // 平铺结构的左侧列表数据
    const flatBuildingFloorSpaces = computed(() => {
        const infoCode = AIRSPACETYPE_MAP_IOTCODE[spaceType.value];
        const spaces = onlyIotMonitorSpace.value
            ? spaceInfoList.value?.filter(obj => {
                  return obj.infoCodeRule?.includes(infoCode);
              })
            : spaceInfoList.value;
        return makeFlatBuildingFloorSpaces(spaces || []);
    });

    const clearData = () => {
        spaceInfoList.value = null;
        spaceDetailList.value = null;
    };

    // 当前时刻空间数据
    const baseSpaces = computed(() => {
        return flatBuildingFloorSpaces?.value.filter(obj => {
            if (obj.type !== 'space') {
                return false;
            }

            return true;
        });
    });

    const currentMapSpaces = computed(() => {
        if (baseSpaces.value?.length > 0 && spaceDetailList.value) {
            const idMapBase = {};
            baseSpaces.value.forEach(obj => {
                idMapBase[obj.spaceId] = obj;
            });
            return spaceDetailList.value
                ?.map(space => {
                    const baseInfo = idMapBase[space.id];
                    if (baseInfo) {
                        const status = findSpaceStatusInTime(baseInfo, curSelectedTime.value);

                        if (status) {
                            return {
                                status,
                                ...baseInfo,
                                ...space
                            };
                        }
                    }
                    return null;
                })
                .filter(Boolean);
        }

        return [];
    });

    // 空间状态按时刻统计
    const spaceTimeStatistics = computed(() => {
        const res = {};

        currentMapSpaces.value?.forEach(obj => {
            const { status } = obj;
            if (!res[status]) {
                res[status] = 0;
            }
            res[status] += 1;
        });
        return res;
    });

    // 查询空间模型数据
    const querySpaceModels = async spaceIds => {
        if (!spaceIds?.length) {
            return;
        }
        spaceModelApiToken.cancelQuest();
        const params = { projectId: baseStore().projectId, spaceIds };
        try {
            const { code, data } = await getSpaceListByIds(params, { cancelToken: spaceModelApiToken.cancelToken() });
            if (code === SUCCESSCODE && data) {
                // data
                spaceDetailList.value = data;
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    const querySpaceRecord = async () => {
        if (!globalTime.value || !spaceType.value) {
            return;
        }
        clearData();
        spaceRecordApiToken.cancelQuest();
        spaceDetailList.value = null;
        const params = { type: spaceType.value, date: dayjs(globalTime.value).format('YYYY-MM-DD') };
        if (curSelectedFloorObj.value?.id) {
            params.instanceIds = [curSelectedFloorObj.value?.id];
            params.instanceType = 'FLOOR';
        } else {
            params.instanceIds = [baseStore().projectId];
            params.instanceType = 'PROJECT';
        }
        try {
            const { code, data } = await getAirSpaceRecord(params, { cancelToken: spaceRecordApiToken.cancelToken() });

            if (code === SUCCESSCODE && data) {
                const { satisfyPercentage, spacesAnalysisList } = data;
                complianceRate.value = satisfyPercentage;

                await buildingInfoPromise;
                if (spacesAnalysisList) {
                    const cachedFloorInfo = {};
                    const spaceIds = [];
                    spacesAnalysisList.forEach(obj => {
                        additionalFloorInfo(obj, cachedFloorInfo);
                        spaceIds.push(obj.spaceId);
                    });
                    await querySpaceModels(spaceIds);
                    transeAirSpaceRecord(spacesAnalysisList);
                    spaceInfoList.value = spacesAnalysisList;
                }
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    /**
     * 修改空间类型
     * 此函数用于更新全局或共享变量spaceType的值
     * 它通过接受一个新的id参数来改变空间类型
     *
     * @param id - 新的空间类型标识符
     *        这个参数的类型取决于空间类型是如何定义的，
     *        通常是数字或字符串
     */
    const changeSpaceType = id => {
        spaceType.value = id;
    };

    /**
     * 修改IoT监控空间的数据
     * 此函数用于更新全局变量onlyIotMonitorSpace的值，使其反映最新的IoT空间数据
     * @param {any} data - 要更新到IoT监控空间的数据这可以是任何类型的值，具体取决于需要更新的数据类型
     */
    const changeIotSpace = data => {
        console.log('changeIotSpace: ', data);
        onlyIotMonitorSpace.value = data;
    };
    const changeTime = data => {
        console.log('changeTime: ', data);

        curSelectedTime.value = data;
    };
    const clickSpace = data => {
        if (!data) {
            curSelectedSpaceObj.value = {};
            return;
        }
        if (data.type === 'space') {
            curSelectedSpaceObj.value = data;
            console.log('data: ', data);
        }
    };
    const init = async (resetSelTime = true) => {
        loading.value = true;
        curSelectedSpaceObj.value = {};
        if (resetSelTime) {
            curSelectedTime.value = '12:00';
        }
        await querySpaceRecord();
        const timer = setTimeout(() => {
            loading.value = false;
            clearTimeout(timer);
        }, 200);
    };

    watch(
        () => [globalTime?.value, spaceType.value],
        () => {
            //
            init();
            // queryListRunningLogByDate();
        }
    );
    watch(
        () => curSelectedFloorObj?.value,
        () => {
            init(false);
        }
    );
    onMounted(() => {
        init();
    });
    provide(curSelectedFloorKey, curSelectedFloorObj);
    provide(curSelectedSpaceKey, curSelectedSpaceObj);
    provide(clickSpaceKey, clickSpace);
    provide(changeTimeKey, changeTime);
    provide(changeIotSpaceKey, changeIotSpace);
    provide(curSelectedTimeKey, curSelectedTime);
    provide(spaceTypeKey, spaceType);
    provide(buildingInfoPromiseKey, buildingInfoPromise);
    provide(spaceTimeStatisticsKey, spaceTimeStatistics);
    return {
        flatBuildingFloorSpaces,
        onlyIotMonitorSpace,
        curSelectedTime,
        currentMapSpaces,
        curSelectedSpaceObj,
        curSelectedFloorObj,
        options,
        spaceType,
        complianceRate,
        spaceTimeStatistics,
        loading,
        changeSpaceType,
        changeIotSpace,
        changeTime,
        clickSpace
    };
};
