// @ts-ignore
import i18n from '@/localization';
import { queryWeather } from '@/apis/systemDiagram';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import { CONTROL_TABS } from '../constant/variables';
import { getCurrentSystemConfig } from '../utils/index';
import { currentSystemKey } from './useStateHook';
import dataDockHandling from '@/hooks/dataDockHandling';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import { isEdge } from '@/utils/envUtils';
import useStore from '@/store';
import { useRightSSEHook } from './useSSEHook';

export const controlDataKey = Symbol('controlData');
export const isQueryWeatherLoadingKey = Symbol('isQueryWeatherLoadingKey');
export const sseRightClientKey = Symbol('sseRightClientKey');
export const weatherListKey = Symbol('weatherList');
export const systemParamsKey = Symbol('systemParams');
export const isSystemLoadingKey = Symbol('isSystemLoadingKey');

const useWeatherData = () => {
    const { base } = useStore();
    const { projectId } = base || {};
    const weatherList = ref([]);
    const isQueryWeatherLoading = ref(false);

    const getWeatherList = async () => {
        // weatherList.value = [];
        isQueryWeatherLoading.value = true;
        try {
            const res = await queryWeather({
                projectId: projectId
            });
            if (res.code === SUCCESSCODE) {
                const list = [];
                const { data } = res;
                // -0.9999 代表无值
                const configName = data?.config; //'weather_station'，'weather_services';
                if (data?.dryBulb) {
                    list.push({
                        title: i18n.global.t('meos_control_web.dry_bulb_temp'),
                        dataValue: data.dryBulb === -0.9999 ? '--' : data.dryBulb.toFixed(1),
                        unit: '℃',
                        configName,
                        key: 'dryBulb'
                    });
                }
                if (data?.wetBulb) {
                    list.push({
                        title: i18n.global.t('meos_control_web.wet_bulb_temperature'),
                        dataValue: data.wetBulb === -0.9999 ? '--' : data.wetBulb.toFixed(1),
                        unit: '℃',
                        configName,
                        key: 'wetBulb'
                    });
                }
                if (data?.relativeHumidity) {
                    list.push({
                        title: i18n.global.t('meos_control_web.relative_humidity'),
                        dataValue: data.relativeHumidity === -0.9999 ? '--' : data.relativeHumidity.toFixed(1),
                        unit: '%RH',
                        configName,
                        key: 'relativeHumidity'
                    });
                }

                if (data?.alkane) {
                    list.push({
                        title: i18n.global.t('meos_control_web.enthalpy'),
                        dataValue: data.alkane === -0.9999 ? '--' : data.alkane.toFixed(1),
                        unit: 'kJ/kg.dra',
                        configName,
                        key: 'alkane'
                    });
                }

                weatherList.value = list;
            }
        } catch (error) {
            isQueryWeatherLoading.value = false;
            weatherList.value = [];
        } finally {
            isQueryWeatherLoading.value = false;
        }
    };

    return {
        getWeatherList,
        weatherList,
        isQueryWeatherLoading
    };
};

export const useRightTPASHook = ({ controlTabs, controlData }) => {
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { getWeatherList, weatherList, isQueryWeatherLoading } = useWeatherData();
    let weatherTimer = null;

    // 当前系统配置、当前专业代码
    const { currentConfig, majorCode } = getCurrentSystemConfig();

    // 系统数据
    const currentSystem = inject(currentSystemKey);
    const systemParams = ref([]);
    const isSystemLoading = ref(false);

    // SSE配置
    const claasCode2objectIds = ref({});
    const { sseRightClient, setRightSSEClientOption } = useRightSSEHook(majorCode, currentConfig?.RUNNING_MONITOR_TYPE);

    const initTabs = () => {
        // 监控状态：不可监不可控 1、只可监不可控 2、可监可控 3
        if (currentSystem.value.monitoringSurveillanceStatus === '1') {
            controlTabs.value = [{ id: CONTROL_TABS.ABNORMAL_EVENTS, name: i18n.global.t('meos_control_web.abnormal_event'), slotName: 'abnormal' }];
            controlData.value = CONTROL_TABS.ABNORMAL_EVENTS;
        }
    };

    const getSystemData = async () => {
        if (!currentSystem.value.systemId || !currentConfig?.RUNNING_MONITOR_TYPE) {
            return;
        }
        isSystemLoading.value = true;
        const res = await loadDynaDataWithIotHandling(
            {
                templateCode: DETAIL,
                runningMonitorType: currentConfig?.RUNNING_MONITOR_TYPE,
                objectIds: [currentSystem.value.systemId]
            },
            listInfoCodeConfigsByObjectIdCommon
        ).finally(() => {
            isSystemLoading.value = false;
        });
        const systemData = res?.data?.find(item => item.id === currentSystem.value.systemId);
        systemParams.value = systemData;
    };
    const getRightWeatherData = async () => {
        try {
            getWeatherList();
        } catch (error) {
            console.log('getRightDataError', error);
        } finally {
            // 边缘端 - 每隔1min钟获取一次数据
            // 非边缘端 - 每隔5min获取一次数据
            if (isEdge()) {
                weatherTimer = setInterval(() => {
                    getWeatherList();
                }, 1000 * 60);
            } else {
                weatherTimer = setInterval(() => {
                    getWeatherList();
                }, 1000 * 60 * 5);
            }
        }
    };

    onMounted(() => {
        initTabs();
        getRightWeatherData();

        watch(
            () => currentSystem?.value?.systemId,
            async curId => {
                if (curId) {
                    await getSystemData();
                    claasCode2objectIds.value[majorCode] = [curId];
                    setRightSSEClientOption(claasCode2objectIds.value);
                }
            }
        );
    });

    provide(controlDataKey, controlData);
    provide(isQueryWeatherLoadingKey, isQueryWeatherLoading);
    provide(sseRightClientKey, sseRightClient);
    provide(weatherListKey, weatherList);
    provide(systemParamsKey, systemParams);
    provide(isSystemLoadingKey, isSystemLoading);

    onBeforeUnmount(() => {
        weatherList.value = [];
    });
    onUnmounted(() => {
        if (weatherTimer) {
            clearInterval(weatherTimer);
        }
    });

    return {
        controlTabs,
        controlData,
        currentSystem,
        systemParams
    };
};

export default function useRightHook() {
    // Tab 数据
    const controlData = ref(CONTROL_TABS.OPERATING_CONTROL);
    const controlTabs = ref([
        { id: CONTROL_TABS.OPERATING_CONTROL, name: i18n.global.t('meos_control_web.operation_control') },
        { id: CONTROL_TABS.ABNORMAL_EVENTS, name: i18n.global.t('meos_control_web.abnormal_event'), slotName: 'abnormal' }
    ]);
    // 当前系统配置
    const { currentConfig } = getCurrentSystemConfig();
    if (currentConfig?.RIGHT_CONFIG?.RIGHT_CONTROL_HOOK) {
        return currentConfig.RIGHT_CONFIG.RIGHT_CONTROL_HOOK({ controlData, controlTabs });
    } else {
        provide(controlDataKey, controlData);
        return { controlTabs, controlData };
    }
}
