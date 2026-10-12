// @ts-ignore
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { listConfigResultsByInstances } from '@/apis/DemandManagementHome';
import { currentFloorObjKey, currentSelectObjKey, globalValueSelectTypeKey } from '../injectKeys';
import { getDayjsTz } from '@/utils/globalVariables';
import { isRhQualityEnabledKey, isPressureDiffEnabledKey } from './useDashboard';

export default () => {
    const instanceTag = ref({});
    const isLoading = ref(false);
    const isOpen = ref(false);
    const currentFloorObj = inject(currentFloorObjKey);
    const selectModuleInfo = inject(currentSelectObjKey);
    const isRhQualityEnabled = inject(isRhQualityEnabledKey);
    const isPressureDiffEnabled = inject(isPressureDiffEnabledKey);
    const selectId = computed(() => selectModuleInfo?.value?.id);
    const curFloorId = computed(() => currentFloorObj?.value?.id);
    const isFromProject = computed(() => {
        return !selectId.value && !curFloorId?.value;
    });
    const instanceObj = computed(() => {
        let instanceType = '',
            instanceIds = [];
        if (selectId.value) {
            instanceType = 'SPACE';
            instanceIds = [selectId.value];
        } else if (curFloorId?.value) {
            instanceType = 'FLOOR';
            instanceIds = [curFloorId.value];
        } else {
            instanceType = 'PROJECT';
            instanceIds = [baseStore().projectId];
        }
        return {
            instanceType: instanceType,
            instanceIds: instanceIds
        };
    });
    const instanceTypeWithId = computed(() => {
        return `${instanceObj.value.instanceType}-${instanceObj.value.instanceIds[0]}`;
    });
    const finalConfigData = ref([]);
    const valueSelectTypeValue = ref('');
    const globalValueSelectTypeValue = inject(globalValueSelectTypeKey);

    const fetchAbortController = ref();
    const tabsItems = ref();
    const curModel = ref('');

    const temperatureList = [
        {
            title: `${i18n.global.t('meos_control_web.temperature')}-${i18n.global.t('meos_control_web.comfort_zone_upper')}`,
            content: i18n.global.t('meos_control_web.usually_per_national_or_asset_management_standard_limit')
        },
        {
            title: i18n.global.t('meos_control_web.temperature_comfort_zone_lower_alt'),
            content: i18n.global.t('meos_control_web.usually_per_national_or_asset_management_standard')
        },
        {
            title: i18n.global.t('meos_control_web.temperature_overcold_threshold_2'),
            content: i18n.global.t('meos_control_web.allow_exceed_comfort_lower_for_energy_carbon_goals')
        },
        { title: i18n.global.t('meos_control_web.temperature_overheat_threshold_2'), content: i18n.global.t('meos_control_web.allow_exceed_comfort_upper_for_energy_carbon_goals') }
    ];
    const co2List = [
        {
            title: `CO<sub>2</sub>-${i18n.global.t('meos_control_web.comfort_zone_upper')}`,
            content: i18n.global.t('meos_control_web.co2_upper_limit_standard')
        },
        { title: `CO<sub>2</sub>-${i18n.global.t('meos_control_web.high_threshold')}`, content: i18n.global.t('meos_control_web.co2_upper_limit_emergency') }
    ];
    const queryConfigsByInstance = async () => {
        isLoading.value = true;
        finalConfigData.value = [];
        tabsItems.value = [];
        valueSelectTypeValue.value = '';
        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        let params = {
            templateType: 'AIRCONDITIONING',
            instanceType: instanceObj.value.instanceType,
            instanceIds: instanceObj.value.instanceIds,
            date: getDayjsTz().format('YYYY-MM-DD'),
            filterShieldedSpaces: false
        };
        const isProject = instanceObj.value.instanceType === 'PROJECT';
        try {
            const response = await listConfigResultsByInstances(params, fetchAbortController.value.signal).finally(() => {
                isLoading.value = false;
            });
            const shielded = response?.data?.[0]?.shielded;
            instanceTag.value = { shielded };
            if (response.code === '00000' && response?.data?.length) {
                isLoading.value = false;

                if (isProject) {
                    isRhQualityEnabled.value = response?.data?.[0]?.finalConfig?.globalConfig?.environmentQuality?.isRhQualityEnabled;
                    isPressureDiffEnabled.value = response?.data?.[0]?.finalConfig?.globalConfig?.environmentQuality?.isPressureDiffQualityEnabled;
                }
                formatterData(response.data[0].finalConfig, isProject);
            } else {
                isLoading.value = false;
                finalConfigData.value = [];
                tabsItems.value = [];
                valueSelectTypeValue.value = '';
            }
        } catch (err) {
            isLoading.value = false;
            console.log(err);
        }
    };
    const globalConfigData = ref({});
    const spaceFuncTypeConfigsData = ref({});
    const formatterData = (response, isProject) => {
        console.log('response: ', response);
        const { globalConfig, spaceFuncTypeConfigs } = structuredClone(response);
        globalConfigData.value = globalConfig;
        spaceFuncTypeConfigsData.value = spaceFuncTypeConfigs?.map(item => {
            item.open = true;
            return item;
        });
        // 顶部tab
        const tabs = [];
        if (isProject && spaceFuncTypeConfigs?.length) {
            tabs.push({ id: 'global', name: i18n.global.t('meos_control_web.global_configuration') });
            tabs.push({ id: 'space', name: i18n.global.t('meos_control_web.space_type_config') });
        } else {
            tabs.push({ id: 'global', name: i18n.global.t('meos_control_web.global_configuration') });
        }
        tabsItems.value = tabs;
        curModel.value = tabsItems.value[0].id;
        if (curModel.value === 'global') {
            finalConfigData.value = Object.keys(globalConfig).length > 0 ? [globalConfig] : [];
        } else {
            finalConfigData.value =
                spaceFuncTypeConfigs?.map(item => {
                    item.open = true;
                    return item;
                }) || [];
        }
        // 价值选择
        if (globalConfig?.valueSelect) {
            const { valueSelectType } = globalConfig.valueSelect;
            valueSelectTypeValue.value = valueSelectType || '';
            if (isProject) {
                globalValueSelectTypeValue.value = valueSelectType || '';
            }
        }
    };
    const tabsChange = data => {
        curModel.value = data.id;
        if (data.id === 'global') {
            finalConfigData.value = Object.keys(globalConfigData.value).length > 0 ? [globalConfigData.value] : [];
        } else {
            finalConfigData.value = spaceFuncTypeConfigsData.value || [];
        }
    };
    const handleScroll = () => {
        if (isOpen?.value) isOpen.value = false;
    };

    watch(
        instanceTypeWithId,
        () => {
            queryConfigsByInstance();
        },
        { immediate: true }
    );

    provide('temperatureList', temperatureList);
    provide('co2List', co2List);
    provide('isOpen', isOpen);
    return {
        tabsItems,
        curModel,
        isLoading,
        valueSelectTypeValue,
        finalConfigData,
        currentFloorObj,
        selectModuleInfo,
        tabsChange,
        handleScroll,
        instanceTag,
        isFromProject
    };
};
