import i18n from '@/localization';
import { ref, provide, nextTick } from 'vue';
import useStore from '@/store';
import { merge } from 'lodash';
import {
    listSceneConfig,
    getSceneObjectSettings,
    queryTreeControlledObject,
    queryPreviewSceneFuncTypeList,
    querySpaceModes,
    queryCircuitObjCfgStatistics,
    spaceFeedbackAdjustSettingsCheck
} from '@/apis/lightingRequirements';
const { base } = useStore();
import { INSTANCE_TYPE_SPACE, INSTANCE_TYPE_BUILDING, INSTANCE_TYPE_FLOOR } from '@/views/lightingRequirements/constants/index';

/**
 * 需求配置-公区
 */
export default () => {
    // 场景时段列表
    const scenePeriodList = ref([]);
    // 当前选择的时段ID
    const curSelectedPeriodId = ref('');
    // 管控对象树和空间配置信息
    const treeControlledObject = ref([]);
    // 当前选择管理对象类型(项目、楼栋、楼层、空间)
    const curControlledObjType = ref('');
    // 当前选择管理对象id
    const curControlledObjId = ref([]);
    // 照明需求配置详情
    const configurationDetails = ref({});

    const scrollbarRef = ref(null);

    // 当前场景配置预览是否打开字段
    const scenePreviewModel = ref(false);

    // 当前场景配置预览
    const previewSceneFuncTypeList = ref([]);

    const curSelectTreeNode = ref({});
    // 当前选择的功能类型
    const curSelectedFuncType = ref('');
    // 当前选中的灯具类型
    const curSelectedLampType = ref('');
    // 当前空间的开启状态
    const curSpacesSettingMode = ref([]);
    const funcLampTypeMap = ref({});
    // 当前筛选状态回路统计
    const curCircuitObjCfgStatistics = ref({});

    const isSpaceFeedbackRegulation = inject('isSpaceFeedbackRegulation');

    // 每次onTreeSelectChange发生的时候都会在loadingEle记录一个tag(时间戳)，所有接口返回后从loadingEle中移除对应的时间戳
    // 主要用于处理快速点击树节点导致多次请求，最后一次请求回来后才取消loading状态
    // 为什么不采用取消上一次网络请求的方式来解决这个问题？ 因为onTreeSelectChange中请求的接口比较多，取消访问不好操作
    const loadingEle = ref([]);
    /**
     * 获取照明需求配置详情
     * @param params
     */
    async function queryConfigurationDetails(params) {
        try {
            const { data, code } = await getSceneObjectSettings(params);
            if (data && code === '00000') {
                configurationDetails.value = data;
                configurationDetails.value.feedbackAdjustmentConfig = {
                    lightingCircuits: ['1', '2'],
                    underOutdoorIlluminance: 123,
                    underDuration: 456,
                    overtopOutdoorIlluminance: 789,
                    overtopDuration: 112
                };
                console.log(configurationDetails, 'configurationDetails');
            } else {
                configurationDetails.value = {};
            }
        } catch (e) {
            configurationDetails.value = {};
        }
    }

    /**
     * 查询当前条件下空间开启状态
     */
    const querySpaceSettingMode = async () => {
        const spaceIds = curShowSpaces.value?.map(obj => obj.id) || [];
        const params = {
            templateId: base.templateId,
            templateType: base.templateType,
            sceneId: curSelectedPeriodId.value,
            spaceIds
        };
        const { data, code } = await querySpaceModes(params);
        if (data && code === '00000') {
            curSpacesSettingMode.value = data;
        } else {
            curSpacesSettingMode.value = [];
        }
    };
    /**
     * 点击左侧树
     * @param ids
     * @param selectNode
     */
    async function onTreeSelectChange(ids, selectNode) {
        if (!selectNode || !selectNode.instanceType) return;
        const timeStamp = new Date().getTime();
        loadingEle.value.push(timeStamp);
        try {
            curControlledObjType.value = selectNode.instanceType;
            curSelectTreeNode.value = selectNode;
            //查询空间是否支持反馈调节
            if (selectNode.instanceType === 'SPACE') {
                spaceFeedbackAdjustSettingsCheck({
                    spaceId: selectNode.id,
                    templateType: base.templateType
                }).then(res => {
                    if (isSpaceFeedbackRegulation) {
                        isSpaceFeedbackRegulation.value = res.data;
                    }
                });
            }
            await queryConfigurationDetails({
                templateId: base.templateId,
                templateType: base.templateType,
                sceneId: curSelectedPeriodId.value,
                instanceId: selectNode.id,
                instanceType: selectNode.instanceType
            });
            await nextTick();
            await querySpaceSettingMode();
            await onQueryCircuitObjCfgStatistics();
        } catch (e) {
            configurationDetails.value = {};
        } finally {
            loadingEle.value = loadingEle.value.filter(item => item !== timeStamp);
        }
    }

    //查询场景统计
    async function onQueryCircuitObjCfgStatistics() {
        const params = {
            templateId: base.templateId,
            templateType: base.templateType,
            sceneId: curSelectedPeriodId.value,
            funcType: curSelectedFuncType.value,
            lampFuncType: curSelectedLampType.value,
            spaceIds: curShowSpaces.value?.map(obj => obj.id) || []
        };

        if (curSelectTreeNode.value.instanceType === INSTANCE_TYPE_SPACE) {
            params.spaceIds = [curSelectTreeNode.value.id];
        }

        const { data, code } = await queryCircuitObjCfgStatistics(params);
        if (data && code === '00000') {
            curCircuitObjCfgStatistics.value = data;
        } else {
            curCircuitObjCfgStatistics.value = {};
        }
    }

    // ? 查询-管控对象树和空间配置信息
    async function getTreeControlledObject(sceneId, noReset) {
        let params = {
                projectId: base.projectId,
                templateId: base.templateId,
                templateType: base.templateType,
                sceneId
            },
            data = await queryTreeControlledObject(params);
        if (data.result === 'success') {
            const deal = (node, setOpen = true, level = 0) => {
                node.isCfg = node.isCfg || false;

                if (setOpen && level < 2) {
                    node.open = true;
                }

                if (node.children?.length > 0) {
                    node.children.forEach(child => {
                        deal(child, setOpen, level + 1);
                    });
                }
            };
            if (!noReset) {
                curControlledObjId.value = [data.data.id];

                // 设置默认展开全部项目、建筑节点
                deal(data.data);

                console.log('data', data);
                onTreeSelectChange(null, data?.data || {});

                treeControlledObject.value = [data.data];
            } else {
                onTreeSelectChange(null, curSelectTreeNode.value || {});

                deal(data.data, false);

                treeControlledObject.value = [merge(treeControlledObject.value?.[0] || {}, data.data)];
            }

            nextTick(() => {
                scrollbarRef.value && scrollbarRef.value.setScrollTop(0);
            });
        }
    }

    // ? 查询-当前模板下的所有场景
    async function queryListSceneConfig(noReset = false, defaultData) {
        scenePeriodList.value = [];
        if (!noReset) {
            treeControlledObject.value = [];
            curControlledObjType.value = '';
            curControlledObjId.value = [];
        }
        const initData = data => {
            data?.forEach(res => {
                res.name = res.sceneName;
            });
            scenePeriodList.value = data || [];
            if (!curSelectedPeriodId.value) {
                curSelectedPeriodId.value = scenePeriodList.value[0].id;
            } else {
                if (!noReset) curSelectedPeriodId.value = scenePeriodList.value[0].id;
            }
            getTreeControlledObject(curSelectedPeriodId.value, noReset);
        };
        if (defaultData?.length > 0) return initData(defaultData);
        let params = { projectId: base.projectId, templateId: base.templateId };
        const { data, result } = await listSceneConfig(params);
        if (result === 'success' && data?.length > 0) {
            initData(data);
        }
    }

    const _findSpacesInTree = r => {
        if (!r) {
            return;
        }
        const spaces = [];
        const deal = node => {
            if (node.instanceType === INSTANCE_TYPE_SPACE) {
                spaces.push({
                    lampFuncTypeList: toRaw(node.lampFuncTypeList),
                    funcTypeList: toRaw(node.funcTypeList),
                    ...toRaw(node.modelMap)
                });
            }
            if (node.children?.length > 0) {
                node.children.forEach(child => {
                    deal(child);
                });
            }
        };
        deal(r);
        return spaces;
    };
    const allInitSpaces = computed(() => {
        return _findSpacesInTree(treeControlledObject.value?.[0]);
    });
    const curScopedSpace = computed(() => {
        // 若选中的空间实例，取所属楼层节点查找空间
        const n = curSelectTreeNode.value.instanceType === INSTANCE_TYPE_SPACE ? curSelectTreeNode.value.parent : curSelectTreeNode.value;
        return _findSpacesInTree(n);
    });

    watch(
        () => curScopedSpace.value,
        () => {
            const functypeMap = {};
            let spaces = curScopedSpace.value;
            if (curSelectTreeNode.value.instanceType === INSTANCE_TYPE_SPACE) {
                spaces = [curSelectTreeNode.value];
            }
            spaces?.forEach(space => {
                space.funcTypeList?.forEach(f => {
                    if (!functypeMap[f.key]) {
                        functypeMap[f.key] = {
                            funcType: f,
                            lampTypeList: []
                        };
                    }
                    const lamps = functypeMap[f.key].lampTypeList;
                    space.lampFuncTypeList?.forEach(lamp => {
                        const hasLamp = lamps.some(obj => {
                            return obj.key === lamp.key;
                        });
                        if (!hasLamp && lamp.additionalMapValue && lamp.additionalMapValue[f.key]) {
                            lamps.push(lamp);
                        }
                    });
                });
            });
            funcLampTypeMap.value = functypeMap;
        }
    );

    // 功能类型筛选下拉框列表数据
    const funcTypeOptions = computed(() => {
        return Object.values(funcLampTypeMap.value).map(obj => {
            return {
                ...obj.funcType,
                id: obj.funcType.key,
                name: obj.funcType.value
            };
        });
    });
    // 灯具类型筛选下拉框列表数据
    const lampTypeOptions = computed(() => {
        if (!funcLampTypeMap.value) {
            return [];
        }
        if (curSelectedFuncType.value) {
            const mapedLamps = funcLampTypeMap.value[curSelectedFuncType.value];
            return (mapedLamps?.lampTypeList || []).map(item => {
                item.id = item.key || 'none';
                item.name = item.value || i18n.global.t('meos_control_web.unconfiged');
                return item;
            });
        }
        const recordLampMap = {};
        const lamps = [];
        Object.values(funcLampTypeMap.value).forEach(obj => {
            obj.lampTypeList?.forEach(lamp => {
                if (!recordLampMap[lamp.key]) {
                    recordLampMap[lamp.key] = true;
                    lamps.push({
                        ...lamp,
                        id: lamp.key || 'none',
                        name: lamp.value || i18n.global.t('meos_control_web.unconfiged')
                    });
                }
            });
        });
        // console.log('lamps: ', lamps, funcTypeOptions.value);
        return lamps;
    });

    const curShowSpaces = computed(() => {
        return curScopedSpace.value?.filter(space => {
            let equipSelFuncType = true,
                equipSelLampType = true;
            if (curSelectedFuncType.value) {
                equipSelFuncType = space.funcTypeList.some(funcType => funcType.key === curSelectedFuncType.value);
            }
            if (curSelectedLampType.value) {
                equipSelLampType = space.lampFuncTypeList.some(lamp => (curSelectedLampType.value === 'none' && !lamp.key) || lamp.key === curSelectedLampType.value);
            }
            return equipSelFuncType && equipSelLampType;
        });
    });

    async function onQueryPreviewSceneFuncTypeList() {
        try {
            const { data, result } = await queryPreviewSceneFuncTypeList({
                templateId: base.templateId,
                sceneId: curSelectedPeriodId.value
            });

            if (result === 'success' && data) {
                previewSceneFuncTypeList.value = [data];
            } else {
                previewSceneFuncTypeList.value = [];
            }
        } catch (e) {
            previewSceneFuncTypeList.value = [];
        }
    }

    const loading = computed(() => {
        return loadingEle.value && loadingEle.value.length;
    });

    provide('queryListSceneConfig', queryListSceneConfig);
    provide('queryConfigurationDetails', queryConfigurationDetails);
    provide('getTreeControlledObject', getTreeControlledObject);
    provide('onTreeSelectChange', onTreeSelectChange);
    provide('scrollbarRef', scrollbarRef);
    provide('scenePeriodList', scenePeriodList);
    provide('treeControlledObject', treeControlledObject);
    provide('curControlledObjType', curControlledObjType);
    provide('curControlledObjId', curControlledObjId);
    provide('curSelectedPeriodId', curSelectedPeriodId);
    provide('configurationDetails', configurationDetails);
    provide('scenePreviewModel', scenePreviewModel);
    provide('previewSceneFuncTypeList', previewSceneFuncTypeList);
    provide('onQueryPreviewSceneFuncTypeList', onQueryPreviewSceneFuncTypeList);
    provide('curSelectedFuncType', curSelectedFuncType);
    provide('curSelectedLampType', curSelectedLampType);
    provide('funcTypeOptions', funcTypeOptions);
    provide('lampTypeOptions', lampTypeOptions);
    provide('curShowSpaces', curShowSpaces);
    provide('allInitSpaces', allInitSpaces);
    provide('curSpacesSettingMode', curSpacesSettingMode);
    provide('curCircuitObjCfgStatistics', curCircuitObjCfgStatistics);
    provide('onQueryCircuitObjCfgStatistics', onQueryCircuitObjCfgStatistics);
    provide('curSelectTreeNode', curSelectTreeNode);
    provide('loading', loading);

    return {
        scenePeriodList,
        curSelectedPeriodId,
        scenePreviewModel,
        previewSceneFuncTypeList,
        queryListSceneConfig,
        onQueryPreviewSceneFuncTypeList
    };
};
