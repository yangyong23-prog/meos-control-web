// @ts-ignore
import i18n from '@/localization';
import { getLightingEquipmentList } from '@/apis/IndoorLighting';
import { listInstanceGroup } from '@/apis/lightingRequirements';
import useLoading from '@/hooks/useLoading';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import treeBuildFloor from '@/store/treeBuildFloor';
import baseStore from '@/store/baseStore';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { uniqBy } from 'lodash';
import { globalLoopListKey, fetchGlobalLoopListKey } from './useGlobalData';

export const activeFuncTypeKey = Symbol('activeFuncType');
export const changeActiveFuncTypeKey = Symbol('changeActiveFuncType');
export const loopsDataKey = Symbol('loopsData'); // 用于存储回路数据
export const useLoopGroupHook = props => {
    const { cancelQuest, cancelToken } = UseCancelTokenHooks();

    const globalLoopList = inject(globalLoopListKey);
    const fetchGlobalLoopList = inject(fetchGlobalLoopListKey);

    const funcTypes = ref([]);
    const activeFuncType = ref({});
    const funcTypeLoading = ref(false);
    const loopsData = ref([]); // 用于存储回路数据
    const serviceAreaTypeObj = {
        PUBLIC_AREA_LIGHTING: '1',
        PARKING_LOT_LIGHTING: '2',
        BUILDING_LIGHTING: '3',
        LANDSCAPE_LIGHTING: '4',
        SIGN_LIGHTING: '5'
    };
    // 加载动画相关
    const { openLoading, closeLoading } = useLoading(
        'group-tree',
        '#F1F4F6',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const groupList = ref([]);
    const getGroupList = async () => {
        openLoading();
        cancelQuest();
        try {
            // 兼容无选中功能类型时的传参
            const tags = activeFuncType?.value?.code ? [activeFuncType.value.code] : [];
            const res = await listInstanceGroup({ templateType: props.templateType, tags: tags }, { cancelToken: cancelToken() });
            groupList.value =
                res.data?.map(item => {
                    item.belongInstance = item.belongInstance || { instanceId: baseStore().projectId };
                    const data = treeBuildFloor().getBuildOrFloor(item.belongInstance.instanceId);
                    let obj = {};
                    item.belongInstance.localName = data?.localName || i18n.global.t('meos_control_web.project');
                    obj = { ...item, ...item.belongInstance };
                    obj.floorSequenceId = data?.floorSequenceId || 999;
                    if (obj.instanceType === 'FLOOR') {
                        const build = treeBuildFloor().getBuildOrFloor(data.buildingId);
                        obj.buildingName = build?.localName;
                    }
                    delete obj.belongInstance;
                    return obj;
                }) || [];
            groupList.value.sort((a, b) => b.floorSequenceId - a.floorSequenceId);
        } catch (error) {
            console.log(error);
        } finally {
            closeLoading();
        }
    };
    const changeActiveFuncType = data => {
        console.log(data);
        activeFuncType.value = data;
        getGroupList();
    };

    const handleLoopData = resData => {
        const serviceAreaType = serviceAreaTypeObj[props.templateType] || '1';
        loopsData.value = structuredClone(resData || []);
        loopsData.value = loopsData.value.filter(item => item.serviceAreaType === serviceAreaType && (item?.relController?.length || item?.relDDC?.length));
        loopsData.value.forEach(item => {
            if (item.funcType) {
                funcTypes.value.push({ code: item.funcType, name: item.funcTypeName });
            }
            if (Array.isArray(item.relController) || Array.isArray(item.relDDC)) {
                const relDDC = (item?.relDDC || []).map(v => {
                    return { ...v, floorId: v?.floorId || item?.floorId || item?.relController[0]?.floorId || item?.relSpace?.[0]?.floorId };
                });
                const relController = item?.relController || [];
                const allItems = [...relController, ...relDDC];
                item.relController = uniqBy(allItems, 'id');
            }
        });

        funcTypes.value = uniqBy(funcTypes.value, 'code');
        funcTypes.value = funcTypes.value.toSorted((a, b) => a?.code - b?.code);
        activeFuncType.value = funcTypes.value?.[0] || {};
    };
    const getLoopsData = async () => {
        funcTypeLoading.value = true;
        try {
            if (globalLoopList.value?.length) {
                handleLoopData(globalLoopList.value);
            } else if (fetchGlobalLoopList) {
                const res = await fetchGlobalLoopList({
                    runningMonitorSecondType: props.templateType
                });
                if (res.code === SUCCESSCODE) {
                    globalLoopList.value = res.data;
                    handleLoopData(res.data);
                }
            } else {
                const res = await getLightingEquipmentList({
                    withColumns: ['id', 'buildingId', 'funcType', 'lampFuncType', 'serviceAreaType', 'localName', 'floorId', 'classCode'],
                    runningMonitorSecondType: props.templateType
                });
                if (res.code === SUCCESSCODE) {
                    handleLoopData(res.data);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            funcTypeLoading.value = false;
        }
    };
    const init = async () => {
        openLoading();
        await getLoopsData();
        await getGroupList();
    };
    watch(
        () => props.templateType,
        async cur => {
            // 模板类型改变且不为空时重新加载数据
            if (cur) {
                await init();
            }
        },
        {
            immediate: true
        }
    );

    provide(activeFuncTypeKey, activeFuncType);
    provide(changeActiveFuncTypeKey, changeActiveFuncType);
    provide(loopsDataKey, loopsData);
    return {
        funcTypes,
        funcTypeLoading,
        groupList,
        activeFuncType
    };
};
