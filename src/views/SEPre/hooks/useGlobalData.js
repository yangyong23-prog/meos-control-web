// @ts-ignore
import i18n from '@/localization';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';
import { getFirstMenuCodeData } from '@/apis/SEPre';
import DockSingleton from '@/hooks/responsiveDock';
import dataDockHandling from '@/hooks/dataDockHandling';
import { RUNNING_MONITOR_TYPE, MENU_CODE, CLASS_CODE_NAME_MAP } from '../constant/index';
import { GRID, SUCCESSCODE } from '@/utils/globalVariables';
import { isIotInfoType } from '@/utils/infoTemplate';

export const isGlobalLoadingKey = Symbol('isGlobalLoadingKey');
export const startLoadingKey = Symbol('startLoadingKey');
export const endLoadingKey = Symbol('endLoadingKey');
export const dashboardAbnormalFilterKey = Symbol('dashboardAbnormalFilterKey');
export const dashboardAbnormalOptionsKey = Symbol('dashboardAbnormalOptionsKey');
export const staticDataKey = Symbol('staticDataKey');
export const staticIdsInfoCodesMapKey = Symbol('staticIdsInfoCodesMapKey');
export const isLoadedInfoCodesKey = Symbol('isLoadedInfoCodesKey');
export const viewHasDataKey = Symbol('viewHasDataKey');

export const abnormalOptions = [{ id: 'abnormal', name: i18n.global.t('meos_control_web.has_abnormal_event') }];

const findClassInfo = classCode => {
    for (const [codes, info] of CLASS_CODE_NAME_MAP) {
        if (codes.includes(classCode)) {
            return info;
        }
    }
    return undefined;
};

export default () => {
    const { setObject2RelatedObject, setIotData, setAbnormalEventStrategy, AbnormalEventStrategy, getAbnormalEventsList } = DockSingleton.getInstance();

    const toggleWidthDivRef = ref(null);
    const unpackShow = ref(true);

    const dashboardAbnormalOptions = ref(abnormalOptions || []);
    const dashboardAbnormalFilter = ref();

    const staticData = ref([]);
    const staticIds = ref([]);
    const classCode2ObjectIds = ref({});
    const classCode2InstanceIds = ref({});
    const abnormalTargetObjIds = ref([]);
    const staticIdsInfoCodesMap = ref(new Map());
    const isLoadedInfoCodes = ref(false);

    // 是否勾无数据
    const viewHasData = ref(true);

    const {
        startRequest,
        isLoading: isGlobalLoading,
        loadedData,
        startLoading,
        endLoading
    } = useFetchAbortController({
        request: getFirstMenuCodeData,
        params: { menuCode: MENU_CODE },
        initData: []
    });

    onMounted(async () => {
        await startRequest();
        // 建立异常事件关联策略
        setAbnormalEventStrategy(AbnormalEventStrategy.Related);
    });

    const { idDynaData, loadDynaDataWithIotHandling } = dataDockHandling();

    const getInfoItems = ({ instanceId, relId, runningParameter }) => {
        let singleInfoItems = [],
            groupInfoItems = [],
            curInstanceIdInfoCodes = [];
        const id = relId || instanceId;
        // 分组信息点
        (runningParameter?.groupChildren || []).forEach(v => {
            const { groupOrder, groupName, relInfoCodeConfigs = [] } = v || {};
            const validInfoCodes = relInfoCodeConfigs.filter(config => config.existsIotRule);
            const sortedInfoCodes = validInfoCodes?.toSorted?.((a, b) => (a?.sequence ?? 0) - (b?.sequence ?? 0));

            sortedInfoCodes.forEach(info => {
                if (isIotInfoType(info.infoCodeType)) {
                    setIotData(id, info.infoCode, info);
                }
            });
            const curItem = {
                name: groupName,
                codes: sortedInfoCodes?.map(config => config?.infoCode),
                unit: relInfoCodeConfigs?.[0]?.unit,
                sequence: sortedInfoCodes?.[0]?.sequence,
                groupOrder,
                relId,
                instanceId
            };
            groupInfoItems.push(curItem);
        });
        groupInfoItems = groupInfoItems.toSorted((a, b) => (a?.groupOrder ?? 0) - (b?.groupOrder ?? 0));

        // 单个信息点
        (runningParameter?.relInfoCodeConfigs || []).forEach(v => {
            const { infoCodeName, infoCodeType, unit, existsIotRule, infoCode, sequence } = v || {};
            if (isIotInfoType(infoCodeType)) {
                setIotData(id, infoCode, v);
            }
            const curItem = {
                name: infoCodeName,
                codes: existsIotRule ? [infoCode] : [],
                unit,
                sequence,
                relId,
                instanceId
            };
            singleInfoItems.push(curItem);
        });
        singleInfoItems = singleInfoItems.toSorted?.((a, b) => (a?.sequence ?? 0) - (b?.sequence ?? 0));

        const singleBeginSequence = singleInfoItems?.[0]?.sequence ?? 0;
        const groupBeginSequence = groupInfoItems?.[0]?.sequence ?? 0;
        // 单个信息点在前，还是多个信息点在前
        if (singleBeginSequence > groupBeginSequence) {
            curInstanceIdInfoCodes = [...groupInfoItems, ...singleInfoItems];
        } else {
            curInstanceIdInfoCodes = [...singleInfoItems, ...groupInfoItems];
        }

        return curInstanceIdInfoCodes;
    };

    // 获取动态数据
    const getDynamicIotData = async (ids = []) => {
        isLoadedInfoCodes.value = false;
        const res = await loadDynaDataWithIotHandling({
            runningMonitorType: RUNNING_MONITOR_TYPE,
            objectIds: ids,
            templateCode: GRID,
            notFilterIotInfoCodeRule: true
        });
        if (res?.code === SUCCESSCODE) {
            // 关联对象classCode和实例IDS映射
            const relationItemObj = {};
            Object.keys(idDynaData.value).forEach(instanceId => {
                const instanceInfo = idDynaData.value[instanceId];
                const { runningParameter, relation } = instanceInfo || {};
                let curInstanceIdInfoCodes = [];

                // 关联对象信息点
                if (relation?.relInfoCodeConfigs?.[0]?.dataValue?.[0]?.relInfoCodeGroupConfigs?.length) {
                    (relation?.relInfoCodeConfigs || []).forEach(v => {
                        const { dataValue = [] } = v || {};
                        dataValue.forEach((instance, index) => {
                            // 取第一个实例对象展示
                            if (index !== 0) {
                                return;
                            }
                            const relId = instance?.id;
                            if (instance?.classCode) {
                                if (!relationItemObj[instance.classCode]) {
                                    relationItemObj[instance.classCode] = [];
                                }
                                const preArr = relationItemObj[instance.classCode];
                                const newClassArr = [...preArr, relId];
                                relationItemObj[instance?.classCode] = [...new Set(newClassArr)];
                            }
                            const relRunningParameter = instance?.relInfoCodeGroupConfigs?.find(s => s?.groupCode === 'runningParameter') || {};
                            if (relRunningParameter) {
                                const infoItems = getInfoItems({ instanceId, relId, runningParameter: relRunningParameter });
                                curInstanceIdInfoCodes = [...curInstanceIdInfoCodes, ...infoItems];
                            }
                        });
                    });
                }
                // 对象本身信息点
                if (runningParameter) {
                    const infoItems = getInfoItems({ instanceId, runningParameter });
                    curInstanceIdInfoCodes = [...curInstanceIdInfoCodes, ...infoItems];
                }

                // 排序并过滤有效信息点
                const filterList = curInstanceIdInfoCodes.toSorted?.((a, b) => (a?.sequence ?? 0) - (b?.sequence ?? 0))?.filter(v => v.codes?.length);
                staticIdsInfoCodesMap.value.set(instanceId, filterList.slice(0, 2));
            });
            classCode2ObjectIds.value = { ...classCode2InstanceIds.value, ...relationItemObj };
            staticData.value.forEach(group => {
                group.cards.forEach(v => {
                    v.infoCodes = staticIdsInfoCodesMap.value.get(v.id);
                });
            });
            isLoadedInfoCodes.value = true;
        }
    };

    // 获取静态数据，建立关联实例ID映射关系，请求动态数据
    watch(loadedData, curArr => {
        const cloneArr = structuredClone(curArr);
        const classCodeGroup = Object.groupBy(cloneArr, item => item.classCode);
        const allInstanceIds = new Set();
        if (Array.isArray(cloneArr)) {
            cloneArr.forEach(item => {
                const { id, graphObjectIds = [] } = item || {};
                allInstanceIds.add(id);
                if (graphObjectIds?.length) {
                    graphObjectIds.forEach(gId => {
                        allInstanceIds.add(gId);
                        setObject2RelatedObject(id, gId);
                    });
                }
            });
        }
        const groupedList = Object.entries(classCodeGroup).map(([key, value]) => {
            const collator = new Intl.Collator('zh-CN');
            const curGroup = findClassInfo(key) || {};
            return {
                id: key,
                name: curGroup?.name,
                order: curGroup?.order,
                cards: value
                    .map(v => {
                        const { localName: name, id } = v || {};
                        const abnormalCount = computed(() => {
                            const listArr = getAbnormalEventsList([id]);
                            return listArr?.length ?? 0;
                        });
                        return { ...v, name, abnormalCount };
                    })
                    .toSorted((a, b) => collator.compare(a.name, b.name))
            };
        });

        const classCodeWithIds = Object.entries(classCodeGroup).reduce((acc, [key, value]) => {
            acc[key] = value.map(v => v.id);
            return acc;
        }, {});
        staticData.value = groupedList.toSorted((a, b) => a.order - b.order);

        //  统计左侧分类实例ID映射，不含关联实例ID
        classCode2InstanceIds.value = classCodeWithIds;
        // 统计右侧查询异常事件实例ID集合
        abnormalTargetObjIds.value = [...allInstanceIds];

        const allCardInsIds = Object.values(classCodeGroup)
            .flat()
            .map(v => v.id);
        staticIds.value = allCardInsIds;
        getDynamicIotData(allCardInsIds);
    });

    onBeforeUnmount(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Single);
    });

    provide(isGlobalLoadingKey, isGlobalLoading);
    provide(isLoadedInfoCodesKey, isLoadedInfoCodes);
    provide(startLoadingKey, startLoading);
    provide(endLoadingKey, endLoading);
    provide(dashboardAbnormalOptionsKey, dashboardAbnormalOptions);
    provide(dashboardAbnormalFilterKey, dashboardAbnormalFilter);
    provide(staticDataKey, staticData);
    provide(staticIdsInfoCodesMapKey, staticIdsInfoCodesMap);
    provide(viewHasDataKey, viewHasData);

    return { toggleWidthDivRef, unpackShow, isGlobalLoading, abnormalTargetObjIds, classCode2ObjectIds };
};
