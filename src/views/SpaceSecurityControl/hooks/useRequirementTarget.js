// @ts-ignore
import i18n from '@/localization';
import { CONTROL_BAR_TAB_KEYS } from '../constants/index';
import { listConfigResultsByInstances } from '@/apis/DemandManagementHome';
import { selectModuleInfoInjectKey } from '../constants/injectKey';
import useLoading from '@/hooks/useLoading';
import baseStore from '@/store/baseStore';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
export default defaultTemplateType => {
    const currentFloorObj = inject('currentFloorObj');
    const currentBuildingObj = inject('currentBuildingObj');
    const isLoading = ref(true);
    const { openLoading, closeLoading } = useLoading('requirement-target-container', '#fff', 'ball');
    const templateTypeToConfigLegendMap = {
        DEPLOYMENTSTATUS: [
            {
                color: '#E1E5EB',
                borderColor: 'transparent',
                title: i18n.global.t('meos_control_web.disarm_period'),
                type: 'disarming',
                isDefault: true
            },
            {
                color: '#FFB7B4',
                borderColor: 'transparent',
                title: i18n.global.t('meos_control_web.arm_period'),
                type: 'arming'
            }
        ],
        ACCESSDEMAND: [
            {
                color: '#B2E5C6',
                borderColor: 'transparent',
                title: i18n.global.t('meos_control_web.all_access_period'),
                type: 'passableTimeIntervals'
            },
            {
                color: '#FFB7B4',
                borderColor: 'transparent',
                title: i18n.global.t('meos_control_web.all_no_access_period'),
                type: 'unpassableTimeIntervals'
            },
            {
                color: '#A2CDFF',
                borderColor: 'transparent',
                title: i18n.global.t('meos_control_web.access_period_by_permission'),
                type: 'permissionPassTimeIntervals',
                isDefault: true
            }
        ]
    };
    const currentTab = inject('currentTab');
    const selectModuleInfo = inject(selectModuleInfoInjectKey);
    const legendData = ref([]); // 需求总览图例数据
    const globalConfigList = ref({});
    const spaceFuncTypeConfigsList = ref([]);
    const finalConfigObj = ref({});
    const templateType = ref(currentTab.value === CONTROL_BAR_TAB_KEYS.ACCESSDEMAND ? 'PASSING' : 'ARMING');
    const instanceObj = computed(() => {
        let instanceType = '',
            instanceIds = [];
        if (selectModuleInfo?.value?.id) {
            instanceType = 'SPACE';
            instanceIds = [selectModuleInfo.value.id];
        } else if (currentFloorObj?.value?.id) {
            instanceType = 'FLOOR';
            instanceIds = [currentFloorObj.value?.id];
        } else if (currentBuildingObj?.value?.id) {
            instanceType = 'BUILDING';
            instanceIds = [currentBuildingObj.value?.id];
        } else {
            instanceType = 'PROJECT';
            instanceIds = [baseStore().projectId];
        }
        return {
            instanceType: instanceType,
            instanceIds: instanceIds
        };
    });
    const fetchAbortController = ref();
    const queryConfigsByInstance = async () => {
        isLoading.value = true;
        openLoading();
        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        globalConfigList.value = {};
        spaceFuncTypeConfigsList.value = [];
        const response = await listConfigResultsByInstances(
            {
                templateType: templateType.value,
                date: getDayjsTz().format('YYYY-MM-DD'),
                instanceType: instanceObj.value.instanceType,
                instanceIds: instanceObj.value.instanceIds
            },
            fetchAbortController.value.signal
        ).finally(() => {
            isLoading.value = false;
            closeLoading();
        });
        const { result, data } = response;
        if (result === 'success' && data.length) {
            const { finalConfig } = data[0];
            finalConfigObj.value = finalConfig || {};
            globalConfigList.value = finalConfig.globalConfig || {};
            spaceFuncTypeConfigsList.value = finalConfig.spaceFuncTypeConfigs || [];
            isLoading.value = false;
        } else {
            isLoading.value = false;
            globalConfigList.value = {};
            finalConfigObj.value = {};
            spaceFuncTypeConfigsList.value = [];
        }
    };

    const stopEffect = watchEffect(() => {
        const filterType = currentTab.value === CONTROL_BAR_TAB_KEYS.ACCESSDEMAND ? 'PASSING' : 'ARMING';
        const finalTemplateType = defaultTemplateType.value || filterType;
        templateType.value = finalTemplateType;
        if (finalTemplateType === 'ARMING') {
            legendData.value = [
                { name: i18n.global.t('meos_control_web.arm_demand'), color: '#FFB7B4' },
                { name: i18n.global.t('meos_control_web.disarm_demand'), color: '#E1E5EB' }
            ];
        } else {
            legendData.value = [
                { name: i18n.global.t('meos_control_web.access_by_permission'), color: '#A2CDFF' },
                { name: i18n.global.t('meos_control_web.all_personnel_access'), color: '#B2E5C6' },
                { name: i18n.global.t('meos_control_web.all_personnel_no_access'), color: '#FFB7B4' }
            ];
        }
        if (currentTab?.value || selectModuleInfo?.value || templateType?.value || currentFloorObj?.value || currentBuildingObj?.value) {
            queryConfigsByInstance();
        }
    });
    provide('legendData', legendData);
    provide('currentTab', currentTab);
    provide('globalConfigList', globalConfigList);
    provide('templateType', templateType);
    provide('templateTypeToConfigLegendMap', templateTypeToConfigLegendMap);

    onUnmounted(() => {
        stopEffect();
        legendData.value = null;
        globalConfigList.value = null;
        templateTypeToConfigLegendMap.value = null;
    });

    return { legendData, globalConfigList, spaceFuncTypeConfigsList, finalConfigObj, templateType, isLoading };
};
