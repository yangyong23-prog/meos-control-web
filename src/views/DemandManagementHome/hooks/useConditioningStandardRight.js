// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { listConfigsByInstance, getWorkConditionByShellConfigData } from '@/apis/DemandManagementHome';
import { configListDataInjectKey, templateIdInjectKey, isProjectKey, isFuncTypeKey, pastDateStringKey } from '../constant/injectKey';
import { currentConfigItemKey, currentConfigObjKey, isLoadingConfigInfoKey, treeLoadingKey } from './useAcCommon';
import useStore from '@/store';
import emitter from '@/utils/bus';
import { getDayjsTz } from '@/utils/globalVariables';

export default () => {
    const { base } = useStore();
    const configListData = ref([]);
    const fetchAbortController = ref();
    const editWorkCondition = ref({});

    // 左侧分组是否加载中
    const treeLoading = inject(treeLoadingKey);
    // 右侧配置是否加载中
    const isLoadingConfigInfo = inject(isLoadingConfigInfoKey);

    const listLoading = computed(() => {
        return treeLoading?.value || isLoadingConfigInfo?.value;
    });
    const pastDateString = inject(pastDateStringKey);

    const templateType = inject('templateType');
    const templateId = inject(templateIdInjectKey);

    //左侧树选中的分组配置信息
    const currentConfigItem = inject(currentConfigItemKey);
    // 分组配置信息
    const currentConfigObj = inject(currentConfigObjKey);

    const instanceType = computed(() => {
        const res = currentConfigItem?.value?.objectType;
        return res;
    });
    const instanceIds = computed(() => {
        const res = currentConfigItem?.value?.relInstanceIds;
        return res;
    });
    // 空间功能类型、项目全局配置
    const isFuncType = computed(() => instanceType?.value === 'ROOM_FUNC_TYPE');
    const isProject = computed(() => instanceType?.value === 'PROJECT');

    //查询配置
    const fetchConfigList = async newParams => {
        configListData.value = [];
        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        isLoadingConfigInfo.value = true;

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
            isLoadingConfigInfo.value = false;
        });
        if (res?.code === '00000') {
            const resData = res.data || [];
            if (Array.isArray(resData)) {
                const tempData = [...resData];
                configListData.value = tempData;
                console.log(configListData.value);
            }
        }
    };

    const queryWorkConditionByShellConfigData = async () => {
        editWorkCondition.value = {};
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
        [() => currentConfigItem.value, templateType, templateId, () => pastDateString?.value],
        ([curSelect, curTem, curId, curDate]) => {
            if (Object.keys(curSelect).length > 0 && curTem && curId) {
                const newParams = {
                    templateType: curTem,
                    templateId: curId,
                    instanceType: curSelect.objectType,
                    instanceIds: curSelect.relInstanceIds,
                    ...(curDate ? { date: curDate } : {})
                };
                if (curSelect.objectType !== 'ROOM_FUNC_TYPE') {
                    fetchConfigList(newParams);
                } else {
                    const globalParams = {
                        templateType: curTem,
                        templateId: curId,
                        instanceType: 'PROJECT',
                        instanceIds: [base.projectId],
                        ...(curDate ? { date: curDate } : {})
                    };
                    fetchConfigList(globalParams);
                }
            }
        },
        {
            immediate: true
        }
    );

    watch(
        [() => isProject?.value, () => templateId?.value],
        ([curIsProject]) => {
            if (curIsProject) {
                queryWorkConditionByShellConfigData();
            }
        },
        {
            immediate: true
        }
    );

    provide(configListDataInjectKey, configListData);
    provide(isProjectKey, isProject);
    provide(isFuncTypeKey, isFuncType);
    provide('editWorkCondition', editWorkCondition);

    emitter.off('queryWorkConditionByShellConfigData');
    emitter.on('queryWorkConditionByShellConfigData', () => {
        queryWorkConditionByShellConfigData();
    });

    onUnmounted(() => {
        emitter.off('queryWorkConditionByShellConfigData');
        isLoadingConfigInfo.value = false;
        fetchAbortController.value?.abort();
        configListData.value = [];
    });
    return {
        fetchConfigList,
        configListData,
        listLoading,
        isProject,
        isFuncType,
        queryWorkConditionByShellConfigData,
        templateId,
        templateType,
        pastDateString
    };
};
