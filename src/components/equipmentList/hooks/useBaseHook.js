// @ts-ignore
import i18n from '@/localization';
import { getClassCodeList, treeTemplateType } from '@/apis/equipmentList';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import useLoading from '@/hooks/useLoading';
import baseStore from '@/store/baseStore';
import { isEdge } from '@/utils/envUtils';
import { setColorConfig } from '@/utils/viewUtils';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { isEmpty } from 'lodash';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM, TABLE_LIST, OBJ_TYPE } from '@/utils/globalVariables';

const { cancelQuest, cancelToken } = UseCancelTokenHooks();
// 定义依赖注入的 Symbol key
export const curClassCodeObjKey = Symbol('curClassCodeObj'); // 当前分类对象
export const classCodeListKey = Symbol('classCodeList'); // 分类列表
export const changeCurClassCodeKey = Symbol('changeCurClassCode'); // 切换分类方法
export const refreshTableFnKey = Symbol('refreshTableFn'); // 刷新表格方法
export const openLoadingKey = Symbol('openLoading'); // 打开loading方法
export const closeLoadingKey = Symbol('closeLoading'); // 关闭loading方法
export const commonPropsKey = Symbol('commonProps'); // 通用props
export const operationPermissionsKey = Symbol('operationPermissions'); // 操作权限
export const spaceMapKey = Symbol('spaceMapKey'); // 空间Map
export const treeBuildFloorDataKey = Symbol('treeBuildFloorData'); // 树形建筑楼层数据
export const loadingTreeKey = Symbol('loadingTree'); // 树形建筑楼层数据加载状态
export const paramsKey = Symbol('params'); // 基础参数
export const selectTableListKey = Symbol('selectTableListKey'); // 选中项列表
export const setColumnsKey = Symbol('setColumnsKey'); // 设置表头配置
export const isFirstFilterKey = Symbol('isFirstFilterKey'); // 是否有过滤条件\
export const filterObjectIdsKey = Symbol('filterObjectIdsKey'); // 过滤对象ID列表

/**
 * 设备列表基础hook
 * 负责分类列表、当前分类、loading控制等基础数据和方法
 * @param {Object} props - 组件传入的参数
 * @returns {Object} 包含当前分类对象、刷新标记、分类加载状态
 */
export const useBaseHook = props => {
    // 初始化loading方法
    const { openLoading, closeLoading } = useLoading(
        'loading-box',
        '#ffffff',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0,
        {
            zIndex: 10
        }
    );
    // 刷新标记
    const Refresh = ref(true);
    // 当前分类对象
    const curClassCodeObj = ref({});
    // 分类列表
    const classCodeList = ref([]);
    // 分类加载状态
    const loadingClassList = ref(false);
    const loadingTree = ref(false);
    const treeBuildFloorData = ref([]);
    const cacheTreeBuildFloorData = {};
    const filterObjectIds = ref(undefined);

    const isFirstFilter = ref(false);

    // 选中的表格项
    const selectTableList = ref([]);

    const params = computed(() => ({
        runningMonitorType: props.runningMonitorType,
        runningMonitorSecondType: props.runningMonitorSecondType
    }));
    const spaceMap = computed(() => {
        const ids = curClassCodeObj.value.treeData;
        const inSpaceIds = [];
        const serviceSpaceIds = [];
        treeBuildFloorData.value.forEach(item => {
            if (ids.includes(item.id)) {
                item.children.forEach(floor => {
                    floor.spaceIds?.inSpaceIds && inSpaceIds.push(...floor.spaceIds.inSpaceIds);
                    floor.spaceIds?.serviceSpaceIds && serviceSpaceIds.push(...floor.spaceIds.serviceSpaceIds);
                });
            } else {
                item.children.forEach(floor => {
                    if (ids.includes(floor.id)) {
                        floor.spaceIds?.inSpaceIds && inSpaceIds.push(...floor.spaceIds.inSpaceIds);
                        floor.spaceIds?.serviceSpaceIds && serviceSpaceIds.push(...floor.spaceIds.serviceSpaceIds);
                    }
                });
            }
        });
        return { serviceSpaceIds, inSpaceIds, isFloorOrBuild: inSpaceIds.length || serviceSpaceIds.length };
    });
    listInfoCodeConfigsByObjectIdCommon({
        runningMonitorType: 'COMMON',
        templateType: 'WEB_CONFIG',
        objectIds: [baseStore().projectId],
        filterGroups: [{ groupCode: 'default', infoCodes: ['equipmentListCellStyle'] }]
    }).then(res => {
        try {
            const equipmentListCellStyle = res.data[0]?.relInfoCodeGroupConfigs
                ?.find(item => item.groupCode === 'default')
                ?.relInfoCodeConfigs?.find(item => item.infoCode === 'equipmentListCellStyle');
            const showStyle = equipmentListCellStyle?.showStyle ? equipmentListCellStyle.showStyle.replace(/\n/g, '') : '[]';
            const list = JSON.parse(showStyle);
            setColorConfig(list);
        } catch (error) {
            console.log(error);
            setColorConfig([]);
        }
    });
    /**
     * 拉取分类列表并设置当前分类
     */
    const setClassCodeList = async () => {
        openLoading();
        loadingClassList.value = true;
        await getFilterObjectIds();
        try {
            const res = await getClassCodeList({
                ...params.value,
                objectTypes: [OBJ_TYPE.EQUIPMENT, OBJ_TYPE.EQUIPGROUP],
                templateType: TABLE_LIST,
                filterObjectIds: filterObjectIds.value,
                filterInSystemIds: props.filterInSystemIds,
                excludeClassCodes: props.excludeClassCodes
            });
            if (res.data.length === 0) {
                closeLoading();
                return;
            }
            res.data = res.data.filter(item => item.totalObjectCount);
            if (res.data.length === 0) {
                closeLoading();
                return;
            }
            // 格式化分类数据
            classCodeList.value = res.data.map(item => ({
                id: item.templateTypeId,
                name: item.templateTypeName || item.classCodeName,
                multiple: false,
                treeData: [],
                number: item.totalObjectCount,
                ...item
            }));
            console.log(props.classCode);
            const obj = classCodeList.value?.find(item => item.classCode === props?.classCode) || classCodeList.value[0] || {};
            obj.treeData = props.floorId ? [props.floorId] : [];
            // 设置当前分类对象
            curClassCodeObj.value = obj;
            await setTreeBuildFloorData();
        } catch (error) {
            console.log(error);
        } finally {
            loadingClassList.value = false;
        }
    };
    const setTreeBuildFloorData = async () => {
        try {
            treeBuildFloorData.value = [];
            if (cacheTreeBuildFloorData[curClassCodeObj.value.id]) {
                treeBuildFloorData.value = cacheTreeBuildFloorData[curClassCodeObj.value.id];
                return;
            }
            loadingTree.value = true;
            cancelQuest();
            const res = await treeTemplateType(
                {
                    ...params.value,
                    templateType: TABLE_LIST,
                    templateIds: [curClassCodeObj.value.id],
                    filterObjectIds: filterObjectIds.value
                },
                { cancelToken: cancelToken() }
            );
            res.data.forEach(element => {
                element.id = element.nodeId;
                element.name = element.nodeName;
                element.open = true;
                element.children.forEach(item => {
                    item.id = item.nodeId;
                    item.name = item.nodeName;
                });
            });
            treeBuildFloorData.value = res.data;
            res.data?.length && (cacheTreeBuildFloorData[curClassCodeObj.value.id] = structuredClone(res.data));
        } catch (error) {
            console.log(error);
        } finally {
            loadingTree.value = false;
        }
    };
    /**
     * 切换当前分类
     * @param {Object} item - 新的分类对象
     */
    const changeCurClassCode = item => {
        item.treeData = [];
        curClassCodeObj.value = item;
        setTreeBuildFloorData();
        isFirstFilter.value = false;
    };

    /**
     * 刷新表格方法
     * 通过切换Refresh标记实现
     */
    const refreshTableFn = () => {
        Refresh.value = false;
        nextTick(() => {
            Refresh.value = true;
        });
    };
    const getFilterObjectIds = async () => {
        if (props.getFilterObjectIdsFn) {
            const ids = await props.getFilterObjectIdsFn();
            filterObjectIds.value = ids.length ? ids : undefined;
        }
    };
    // 组件挂载时拉取分类列表
    onMounted(async () => {
        emitter.emit(CLOSE_CONTROL_FORM, { needClose: true });
        setClassCodeList();
        if (!isEmpty(props.filter)) {
            isFirstFilter.value = true;
        }
    });

    // 监听分类对象变化，触发表格刷新
    watch(
        () => [curClassCodeObj.value.id, curClassCodeObj.value.treeData],
        (newVal, oldVal) => {
            if (oldVal) {
                refreshTableFn();
            }
        }
    );
    const operationPermissions = computed(() => {
        if (!isEdge()) {
            return {
                disabled: true,
                content: i18n.global.t('meos_control_web.cloud_platform_operation_not_supported_please_use_edge')
            };
        }
        if (!baseStore().hasAuth(props.permission)) {
            return {
                disabled: true,
                content: i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding')
            };
        }
        return {
            disabled: false,
            content: ''
        };
    });
    const setColumns = ref([]);
    // 提供响应式数据和方法给子组件
    provide(curClassCodeObjKey, curClassCodeObj);
    provide(classCodeListKey, classCodeList);
    provide(changeCurClassCodeKey, changeCurClassCode);
    provide(refreshTableFnKey, refreshTableFn);
    provide(openLoadingKey, openLoading);
    provide(closeLoadingKey, closeLoading);
    provide(commonPropsKey, props);
    provide(operationPermissionsKey, operationPermissions);
    provide(treeBuildFloorDataKey, treeBuildFloorData);
    provide(loadingTreeKey, loadingTree);
    provide(spaceMapKey, spaceMap);
    provide(paramsKey, params);
    provide(selectTableListKey, selectTableList);
    provide(setColumnsKey, setColumns);
    provide(isFirstFilterKey, isFirstFilter);
    provide(filterObjectIdsKey, filterObjectIds);
    // 返回基础数据
    return { curClassCodeObj, Refresh, loadingClassList, classCodeList, selectTableList };
};
