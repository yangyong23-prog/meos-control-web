import i18n from '@/localization';
import { MMessageBox, $Message } from 'meri-plus';
import useStore from '@/store';
import dayjs from 'dayjs';
import { listConfigsByInstance, addInstanceConfig, getWorkConditionByShellConfigData } from '@/apis/DemandManagementHome';
import {
    selectModuleInfoInjectKey,
    configListDataInjectKey,
    templateIdInjectKey,
    isProjectKey,
    isSpaceKey,
    customConfigInstancesInjectKey,
    pastDateStringKey
} from '../constant/injectKey';
import emitter from '@/utils/bus';
import { getDayjsTz, OBJ_TYPE } from '@/utils/globalVariables';

export default () => {
    const { base } = useStore();
    const { projectId } = base || {};
    const configListData = ref([]);
    const listLoading = ref(false);
    const fetchAbortController = ref();
    const editWorkCondition = ref({});

    const customConfigInstances = inject(customConfigInstancesInjectKey);
    const pastDateString = inject(pastDateStringKey);

    const templateType = inject('templateType');
    const templateId = inject(templateIdInjectKey);
    const selectModuleInfo = inject(selectModuleInfoInjectKey);
    const instanceType = computed(() => {
        const res = selectModuleInfo?.value?.objType ? selectModuleInfo?.value?.objType?.toString()?.toUpperCase() : 'PROJECT';
        return res;
    });
    const instanceIds = computed(() => {
        const res = selectModuleInfo?.value?.objType ? [selectModuleInfo?.value?.id] : [projectId];
        return res;
    });
    const instanceTitle = computed(() => selectModuleInfo?.value?.localName ?? '--');
    const isSpace = computed(() => selectModuleInfo?.value?.objType === OBJ_TYPE.SPACE);
    const isProject = computed(() => instanceType?.value === 'PROJECT');

    const instanceHasChildrenCustomConfig = computed(() => {
        // 空调需求不需要计算当前选中节点及下级是否有特殊配置，另外的接口查询处理
        if (templateType.value === 'AIRCONDITIONING') {
            return false;
        }
        const res = selectModuleInfo?.value?.hasChildrenCustomConfig;
        return !!res;
    });

    const isShield = ref(false);
    const referenceTitle = ref('');
    const showCancelReference = computed(() => !!referenceTitle.value);
    const showClearConfig = ref(false);

    const checkHasChildrenCustomConfig = computed(() => (nodeId, nodeType) => {
        // 当前对象及其下级对象只要有一个出现特殊配置时，就展示清除配置按钮
        const curHasCustomConfig = customConfigInstances?.value?.some(item => item.id === nodeId);
        const childrenHasCustomConfig = customConfigInstances?.value?.some(item => {
            if (nodeType === 'BUILDING' && [OBJ_TYPE.SPACE, 'floor'].includes(item.objType)) {
                return item.buildingId === nodeId;
            }
            if (nodeType === 'FLOOR' && item.objType === OBJ_TYPE.SPACE) {
                return item.floorId === nodeId;
            }
            return false;
        });
        return curHasCustomConfig || childrenHasCustomConfig;
    });

    const fetchConfigList = computed(() => async newParams => {
        configListData.value = [];
        referenceTitle.value = '';
        showClearConfig.value = false;
        isShield.value = false;
        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        listLoading.value = true;

        const requestParams = newParams
            ? newParams
            : {
                  templateType: templateType?.value,
                  templateId: templateId?.value,
                  instanceType: instanceType?.value,
                  instanceIds: instanceIds?.value,
                  ...(pastDateString?.value ? { date: pastDateString?.value } : {})
              };
        const res = await listConfigsByInstance(requestParams, fetchAbortController.value.signal).finally(() => {
            listLoading.value = false;
        });
        if (res?.code === '00000') {
            const resData = res.data || [];
            if (Array.isArray(resData)) {
                const tempData = [...resData];
                configListData.value = tempData;

                const { instanceTag, inheritInstances, instanceId, instanceType: nodeType } = tempData[0] || {};
                const { customConfig, shielded } = instanceTag || {};
                if (templateType.value === 'AIRCONDITIONING') {
                    const checkClearConfigShow = checkHasChildrenCustomConfig.value(instanceId, nodeType);
                    showClearConfig.value = !!customConfig || checkClearConfigShow;
                } else {
                    showClearConfig.value = !!customConfig || instanceHasChildrenCustomConfig.value;
                }
                isShield.value = nodeType === 'SPACE' ? !!shielded : false;
                if (customConfig) {
                    referenceTitle.value = '';
                } else {
                    referenceTitle.value = inheritInstances?.[0]?.instanceName || inheritInstances?.[0]?.instanceId;
                }
            }
        }
    });

    const shieldSpaceConfirm = computed(() => hide => {
        // 显示确认对话框
        MMessageBox({
            customClass: 'message-box-custom', // 参数化 customClass
            title: `${hide ? i18n.global.t('meos_control_web.unblock_or_not_colon') : i18n.global.t('meos_control_web.block_or_not')}${instanceTitle.value}`,
            message: `` // 空消息
        })
            .then(async () => {
                try {
                    const floorId = selectModuleInfo?.value?.floorId;
                    const res = await addInstanceConfig({
                        templateType: templateType.value,
                        instanceType: instanceType.value,
                        instanceIds: instanceIds.value,
                        config: { shielded: !hide }
                    });
                    if (res.data) {
                        isShield.value = !isShield.value;
                        if (templateType.value === 'AIRCONDITIONING') {
                            const treeNodeConfig = { openFloor: true, selectTreeNoe: hide ? { ...(selectModuleInfo?.value || {}) } : undefined };
                            emitter.emit('updateShieldAndBlackList', { floorIds: [floorId], treeNodeConfig });
                        } else {
                            emitter.emit('refreshTree', { id: selectModuleInfo?.value?.id });
                        }

                        $Message.success({ title: hide ? i18n.global.t('meos_control_web.unshield_success') : i18n.global.t('meos_control_web.shield_success') });
                    }
                } catch (error) {
                    console.error('屏蔽空间接口调用失败:', error);
                }
            })
            .catch(error => {
                console.error('MMessageBox 调用失败:', error);
            });
    });
    const queryWorkConditionByShellConfigData = async () => {
        editWorkCondition.value = [];
        const res = await getWorkConditionByShellConfigData({
            templateType: templateType?.value,
            templateId: templateId?.value,
            date: getDayjsTz().format('YYYY-MM-DD')
        });
        const { result, data } = res;
        if (result === 'success') {
            editWorkCondition.value = data || {};
        }
    };

    watch(
        [() => selectModuleInfo?.value?.id, templateType, templateId, () => instanceHasChildrenCustomConfig.value, () => pastDateString?.value],
        ([curSelectId, curTem, curId, , curDate]) => {
            if (curSelectId && curTem && curId) {
                const typeMap = {
                    S: 'SPACE',
                    F: 'FLOOR',
                    B: 'BUILDING',
                    P: 'PROJECT'
                };
                const computeInstanceType = typeMap?.[curSelectId?.[0]] ?? 'PROJECT';
                const newParams = {
                    templateType: curTem,
                    templateId: curId,
                    instanceType: computeInstanceType,
                    instanceIds: [curSelectId],
                    ...(curDate ? { date: curDate } : {})
                };
                fetchConfigList.value?.(newParams);
            }
        },
        {
            immediate: true
        }
    );

    emitter.off('refreshRightConfigList');
    emitter.on('refreshRightConfigList', () => {
        fetchConfigList.value?.();
    });

    provide(configListDataInjectKey, configListData);
    provide(isProjectKey, isProject);
    provide(isSpaceKey, isSpace);
    provide('editWorkCondition', editWorkCondition);

    onUnmounted(() => {
        listLoading.value = false;
        fetchAbortController.value?.abort();
        configListData.value = [];

        emitter.off('refreshRightConfigList');
    });
    return {
        fetchConfigList,
        configListData,
        listLoading,
        instanceTitle,
        isSpace,
        isProject,
        isShield,
        showCancelReference,
        showClearConfig,
        shieldSpaceConfirm,
        referenceTitle,
        queryWorkConditionByShellConfigData
    };
};
