// @ts-ignore
import i18n from '@/localization';
import { listObjectsByTackValueLogic } from '@/apis/public';
import {
    curSelectedPeriodIdKey,
    curTemplateIdKey,
    getGlobalAllLoopListKey,
    isSceneConfigLoadedKey,
    getGlobalLoopListByBuildingIdKey,
    getGlobalLoopListByFloorIdKey,
    getGlobalLoopListByModuleIdKey,
    getGlobalLoopListBySpaceIdKey,
    getGlobalModuleListByLoopIdKey,
    getGlobalModuleListBySpaceIdKey,
    refreshLoopConfigDataKey,
    queryLoopConfigParamsKey,
    publicAreaVisibleKey,
    getGlobalLoopListByProjectIdKey,
    curMenuIdKey,
    configuredInstanceIdsKey,
    isProjectWithOutdoorIlluminanceRuleKey,
    isSpaceWithWorkPlaneLuxRuleKey
} from './useGlobalData';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';
import { setModuleTreeData, setSpaceTreeData, isSpaceLightFeedBack } from '@/views/demand-management-light-upgraded/utils';
import _, { uniqBy, isEqual, isNumber, isEmpty } from 'lodash';
import baseStore from '@/store/baseStore';
import { leftTreeListKey } from './useConfigCommonHook';
import { OBJ_TYPE } from '@/utils/globalVariables';

export const configPreviewLoadingKey = Symbol('configPreviewLoadingKey');
export const sidebarWidthKey = Symbol('sidebarWidthKey');
export const currentSelTreeNodeKey = Symbol('currentSelTreeNodeKey');
export const currentSelectObjKey = Symbol('currentSelectObjKey');
export const currentHoverObjKey = Symbol('currentHoverObjKey');
export const allSpaceKey = Symbol('allSpaceKey');
export const filterSpacesKey = Symbol('filterSpacesKey');
export const loopIdMapModeKey = Symbol('loopIdMapModeKey');
export const loopIdMapSourceKey = Symbol('loopIdMapSourceKey');

// 筛选项
export const currentLoopsKey = Symbol('currentLoopsKey');
export const rightTableLoopsKey = Symbol('rightTableLoopsKey');
export const funcTypeOptsKey = Symbol('funcTypeOptsKey');
export const lampOptsKey = Symbol('lampOptsKey');
export const relControllersKey = Symbol('relControllersKey');
export const relControllerKey = Symbol('relControllerKey');
export const lampOptSelKey = Symbol('lampOptSelKey');
export const funcTypeOptSelKey = Symbol('funcTypeOptSelKey');
export const relSpacesKey = Symbol('relSpacesKey');
export const roomFuncTypeSelKey = Symbol('roomFuncTypeSelKey');
export const lightFeedbackKey = Symbol('lightFeedbackKey');

export const curControlledObjIdKey = Symbol('curControlledObjIdKey');
export const hasFeedbackAdjustmentKey = Symbol('hasFeedbackAdjustmentKey');

export const useConfigPreviewData = () => {
    const loading = ref(true);
    const sidebarWidth = ref(304);
    const showSidebar = ref(true);
    const currentSelTreeNode = ref();
    const currentSelectObj = ref();
    const currentHoverObj = ref();
    const allSpace = ref([]);
    const getGlobalLoopListByProjectId = inject(getGlobalLoopListByProjectIdKey);
    const getGlobalLoopListByBuildingId = inject(getGlobalLoopListByBuildingIdKey);
    const getGlobalLoopListByFloorId = inject(getGlobalLoopListByFloorIdKey);
    const getGlobalLoopListBySpaceId = inject(getGlobalLoopListBySpaceIdKey);
    const getGlobalModuleListBySpaceId = inject(getGlobalModuleListBySpaceIdKey);
    const getGlobalModuleListByLoopId = inject(getGlobalModuleListByLoopIdKey);
    const isProjectWithOutdoorIlluminanceRule = inject(isProjectWithOutdoorIlluminanceRuleKey);
    const isSpaceWithWorkPlaneLuxRule = inject(isSpaceWithWorkPlaneLuxRuleKey);

    const loopIdMapMode = ref({});
    const loopIdMapSource = ref({});

    const getGlobalAllLoopList = inject(getGlobalAllLoopListKey);
    const curMenuId = inject(curMenuIdKey);
    const curSelectedPeriodId = inject(curSelectedPeriodIdKey);
    const isSceneConfigLoaded = inject(isSceneConfigLoadedKey);
    const refreshLoopConfigData = inject(refreshLoopConfigDataKey);
    const queryLoopConfigParams = inject(queryLoopConfigParamsKey);
    const publicAreaVisible = inject(publicAreaVisibleKey);

    watch(
        [() => queryLoopConfigParams.value, () => isSceneConfigLoaded.value],
        ([cur]) => {
            if (cur?.sceneId && curSelectedPeriodId?.value && cur?.demandTemplateId && isSceneConfigLoaded.value) {
                nextTick(() => {
                    // refreshLoopConfigData?.();
                    refreshLoopConfigData?.().then(({ code, data }) => {
                        if (code === '00000') {
                            const map = {};
                            const sourceMap = {};
                            data.forEach(({ circuitId, settingMode, configSourceObjId, configSourceObjName }) => {
                                map[circuitId] = settingMode;
                                sourceMap[circuitId] = {
                                    circuitId,
                                    settingMode,
                                    configSourceObjId,
                                    configSourceObjName
                                };
                            });
                            loopIdMapSource.value = sourceMap;
                            loopIdMapMode.value = map;
                        }
                    });
                });
            }
        },
        {
            immediate: true
        }
    );

    const roomFuncTypeSel = ref([]);
    const lightFeedback = ref('');

    const isFeedbackAdjustmentSpace = s => {
        // 反馈调节判断
        // ①空间对象的静态信息点“被自然采光替代程replacedByNatLighting=1或2；
        // ②服务该空间的回路中包含“功能类型=1 普通照明”的回路
        // 3、具备照度反馈条件：该空间“参考面照度（workPlaneLux）”有实例化规则 或 项目的“室外照度（outdoorIlluminance）”有实例化规则

        const loops = getGlobalLoopListBySpaceId(s.id);
        const funcTypes = [];
        loops.forEach(loop => {
            if (funcTypes.indexOf(loop.funcType) === -1) {
                funcTypes.push(loop.funcType);
            }
        });

        return isSpaceLightFeedBack({ ...s, funcTypes }, isSpaceWithWorkPlaneLuxRule(s.id), isProjectWithOutdoorIlluminanceRule());
    };

    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    const filterSpaces = computed(() => {
        return allSpace.value?.length > 0
            ? structuredClone(allSpace.value).filter(s => {
                  s.name = s.localName;
                  let show = true,
                      roomFuncCondi = true,
                      lightFeedbackCondi = true;

                  if (roomFuncTypeSel.value.length > 0) {
                      roomFuncCondi = roomFuncTypeSel.value.includes(s.roomFuncType);
                  }

                  if (lightFeedback.value === '1') {
                      // 反馈调节判断
                      lightFeedbackCondi = isFeedbackAdjustmentSpace(s);
                  }

                  return show && roomFuncCondi && lightFeedbackCondi;
              })
            : [];
    });

    const currentLoops = computed(() => {
        let loops = [];
        if (['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'].includes(curMenuId.value)) {
            const { objType, id, floorId } = currentSelTreeNode.value || {};
            if (objType === OBJ_TYPE.PROJECT) {
                loops = getGlobalLoopListByProjectId(id);
            } else if (objType === OBJ_TYPE.BUILDING) {
                loops = getGlobalLoopListByBuildingId(id);
            } else if (objType === OBJ_TYPE.FLOOR) {
                loops = getGlobalLoopListByFloorId(id);
            } else if (objType === OBJ_TYPE.SPACE) {
                loops = getGlobalLoopListBySpaceId(id);
            }
        } else {
            loops = getGlobalAllLoopList();
        }
        loops.sort((a, b) => {
            if (publicAreaVisible.value) {
                if (!isEqual(a.buildingOrder, b.buildingOrder)) {
                    if (a.buildingOrder < 0) {
                        return 1;
                    }
                    if (b.buildingOrder < 0) {
                        return -1;
                    }
                    return a.buildingOrder - b.buildingOrder;
                }
                if (!isEqual(a.floorSequenceId, b.floorSequenceId)) {
                    if (isEmpty(a.floorSequenceId)) {
                        return 1;
                    }
                    if (isEmpty(b.floorSequenceId)) {
                        return -1;
                    }
                    return b.floorSequenceId - a.floorSequenceId;
                }
            }

            if (!isEqual(a.funcType, b.funcType)) {
                if (isEmpty(a.funcType)) {
                    return 1;
                }
                if (isEmpty(b.funcType)) {
                    return -1;
                }
                return parseInt(a.funcType) - parseInt(b.funcType);
            }
            if (!isEqual(a.lampFuncType, b.lampFuncType)) {
                if (isEmpty(a.lampFuncType)) {
                    return 1;
                }
                if (isEmpty(b.lampFuncType)) {
                    return -1;
                }
                return parseInt(a.lampFuncType) - parseInt(b.lampFuncType);
            }

            return a.localName?.localeCompare(b.localName, 'zh', {
                numeric: true,
                sensitivity: 'base'
            });
        });
        return loops;
    });
    // 功能类型
    const funcTypeOpts = computed(() => {
        const opts = currentLoops.value.map(l => ({
            id: l.funcType,
            name: l.funcTypeName ?? '--'
        }));
        return uniqBy(opts, 'id');
    });
    const funcTypeOptSel = ref('');

    // 灯具类型
    const lampOpts = computed(() => {
        const opts = currentLoops.value.map(l => ({
            id: l.lampFuncType,
            name: l.lampFuncTypeName ?? '--'
        }));
        return uniqBy(opts, 'id');
    });
    const lampOptSel = ref('');

    // 关联控制模块
    const relControllers = computed(() => {
        const { objType, id } = currentSelTreeNode.value || {};
        const moduleList = currentLoops.value.flatMap(l => structuredClone(getGlobalModuleListByLoopId(l.id)));
        const list = _.uniqBy(moduleList, 'id').map(m => {
            m.name = m.localName;
            return m;
        });

        // eslint-disable-next-line one-var
        let tree = setModuleTreeData(list),
            node = tree?.[0];

        if (objType === OBJ_TYPE.SPACE) {
            return list;
        }

        while (node) {
            if (objType === node.objType) {
                tree = node.children;
                node = null;
            } else {
                node = node.children?.find(c => c.id === id);
            }
        }
        if (tree.length === 1 && tree[0].children) {
            tree[0].open = true;
        }
        return tree;
    });
    const relController = ref([]);

    watch(curSelectedPeriodId, () => {
        funcTypeOptSel.value = '';
        relController.value = [];
        lampOptSel.value = '';
    });

    // 服务空间
    const relSpacesOpt = computed(() => {
        const { objType, id, localName } = currentSelTreeNode.value || {};
        let tree = setSpaceTreeData(filterSpaces.value ?? []),
            node = tree?.[0];
        if (objType === OBJ_TYPE.SPACE) {
            return [
                {
                    id: id,
                    name: localName
                }
            ];
        }
        while (node) {
            if (objType === node.objType) {
                console.log(1, node);
                tree = node.children;
                node = null;
            } else {
                node = node.children?.find(c => c.id === id);
            }
        }
        return tree;
    });

    const hasFeedbackAdjustment = computed(() => {
        return allSpace.value?.some(s => isFeedbackAdjustmentSpace(s));
    });

    watch(
        () => getGlobalAllLoopList(),
        async allLoops => {
            const spaceIds = allLoops
                .flatMap(({ relSpace = [] }) => relSpace)
                .filter(d => d)
                .map(s => s.id);
            try {
                const { code, data } = await listObjectsByTackValueLogic({
                    runningMonitorType: 'LIGHTING',
                    takeValueLogic: {
                        queryParam: {
                            id: spaceIds,
                            withColumns: [
                                'buildingId',
                                'id',
                                'localName',
                                'relObjIds',
                                'floorId',
                                'classCode',
                                'funcType',
                                'roomFuncType',
                                'objType',
                                'bimLocation',
                                'outline',
                                'replacedByNatLighting'
                            ],
                            valid: 1
                        }
                    }
                });

                if (code === '00000') {
                    data.forEach(space => {
                        if (typeof space.outline === 'string') {
                            try {
                                space.outline = JSON.parse(space.outline);
                            } catch (error) {
                                space.outline = [];
                            }
                        }
                    });
                    allSpace.value = data;
                }
                loading.value = false;
            } catch (error) {
                console.log('error :>> ', error);
                loading.value = false;
                allSpace.value = [];
            }
        },
        {
            immediate: true
        }
    );

    watch(
        curMenuId,
        () => {
            console.log('curMenuId :>> ', curMenuId.value);
            if (!['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'].includes(curMenuId.value)) {
                //夜景等
                currentSelTreeNode.value = { id: baseStore().projectId, objType: OBJ_TYPE.PROJECT, localName: baseStore().projectName };
            }
        },
        {
            immediate: true
        }
    );
    // 右侧表格
    const rightTableLoops = computed(() => {
        const tableData = currentLoops.value.filter(loop => {
            let valid = true;
            if (valid) {
                if (lampOptSel.value) {
                    if (lampOptSel.value !== loop?.lampFuncType) {
                        valid = false;
                    }
                }
            }
            if (valid) {
                if (funcTypeOptSel.value) {
                    if (funcTypeOptSel.value !== loop?.funcType) {
                        valid = false;
                    }
                }
            }
            if (valid) {
                if (relController.value?.length) {
                    valid = false;
                    if (loop.relController) {
                        loop.relController.some(ctrl => {
                            if (relController.value.includes(ctrl.id)) {
                                valid = true;
                                return true;
                            }
                            return false;
                        });
                    }
                }
            }
            return valid;
        });
        return tableData;
    });

    const curControlledObjId = ref([]);

    provide(configPreviewLoadingKey, loading);
    provide(sidebarWidthKey, sidebarWidth);
    provide(currentSelTreeNodeKey, currentSelTreeNode);
    provide(currentSelectObjKey, currentSelectObj);
    provide(currentHoverObjKey, currentHoverObj);
    provide(allSpaceKey, allSpace);
    provide(filterSpacesKey, filterSpaces);
    provide(currentLoopsKey, currentLoops);
    provide(rightTableLoopsKey, rightTableLoops);
    provide(funcTypeOptsKey, funcTypeOpts);

    provide(relControllerKey, relController);
    provide(lampOptSelKey, lampOptSel);
    provide(funcTypeOptSelKey, funcTypeOptSel);

    provide(lampOptsKey, lampOpts);
    provide(relControllersKey, relControllers);
    provide(relSpacesKey, relSpacesOpt);
    provide(loopIdMapSourceKey, loopIdMapSource);
    provide(loopIdMapModeKey, loopIdMapMode);
    provide(roomFuncTypeSelKey, roomFuncTypeSel);
    provide(lightFeedbackKey, lightFeedback);
    provide(curControlledObjIdKey, curControlledObjId);
    provide(hasFeedbackAdjustmentKey, hasFeedbackAdjustment);

    return {
        loading,
        sidebarWidth,
        showSidebar
    };
};
