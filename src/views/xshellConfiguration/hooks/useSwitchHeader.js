// @ts-ignore
import i18n from '@/localization';
import { $Message } from 'meri-plus';
import baseStore from '@/store/baseStore';
import { getAlgorithmConfig, getTimeSeriesModelConfig, changeAlgorithmConfig, changeTimeSeriesModelConfig } from '@/apis/xshellConfiguration';

const timeSeriesNameMap = [
    { type: 'enable_ltsm_space_config', name: i18n.global.t('common.space') },
    { type: 'enable_ltsm_cooling_config', name: i18n.global.t('meos_control_web.cooling_station') },
    { type: 'enable_ltsm_pump_config', name: i18n.global.t('meos_control_web.terminal_pump') }
];

export default () => {
    // 空间、冷站、末端泵开关
    const spaceSwitch = ref('uncheck');
    const coolSwitch = ref('uncheck');
    const acPumpSwitch = ref('uncheck');
    // AI算法开关
    const aiSwitch = ref('uncheck');

    const getTimeSeriesModelConfigFetch = async () => {
        try {
            spaceSwitch.value = 'uncheck';
            coolSwitch.value = 'uncheck';
            acPumpSwitch.value = 'uncheck';

            const res = await getTimeSeriesModelConfig({ projectId: baseStore().projectId, groupCode: baseStore().groupCode });
            const { data } = res || {};
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const { type, status } = item || {};
                    if (type === 'enable_ltsm_space_config') {
                        spaceSwitch.value = status ? 'checked' : 'uncheck';
                    }
                    if (type === 'enable_ltsm_cooling_config') {
                        coolSwitch.value = status ? 'checked' : 'uncheck';
                    }
                    if (type === 'enable_ltsm_pump_config') {
                        acPumpSwitch.value = status ? 'checked' : 'uncheck';
                    }
                });
            }
        } catch (error) {
            spaceSwitch.value = 'uncheck';
            coolSwitch.value = 'uncheck';
            acPumpSwitch.value = 'uncheck';
        }
    };

    const getAlgorithmConfigFetch = async () => {
        try {
            aiSwitch.value = 'uncheck';

            const res = await getAlgorithmConfig({ projectId: baseStore().projectId });
            const { data } = res || {};
            aiSwitch.value = data ? 'checked' : 'uncheck';
        } catch (error) {
            aiSwitch.value = 'uncheck';
        }
    };

    const changeTimeSeriesModelConfigFetch = async ({ type, status, name }) => {
        try {
            const res = await changeTimeSeriesModelConfig({ type, status });
            const { data } = res || {};
            if (data) {
                $Message.success({
                    title: status
                        ? i18n.global.t('meos_control_web.name_model_open_success', { name: name })
                        : i18n.global.t('meos_control_web.name_model_close_success', { name: name })
                });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    onMounted(() => {
        Promise.allSettled([getTimeSeriesModelConfigFetch(), getAlgorithmConfigFetch()]);
    });
    const changeAiSwitch = () => {
        changeAlgorithmConfig({ status: aiSwitch.value === 'checked', projectId: baseStore().projectId }).then(res => {
            const { data } = res;
            if (data) {
                $Message.success({
                    title:
                        aiSwitch.value === 'checked'
                            ? `${i18n.global.t('meos_control_web.ai_algorithm_enabled_success')}`
                            : `${i18n.global.t('meos_control_web.ai_algorithm_disabled_success')}`
                });
            } else {
                aiSwitch.value = 'uncheck';
            }
        });
    };

    const changeSpaceSwitch = async () => {
        const preStatus = spaceSwitch.value === 'checked';
        const reqItem = timeSeriesNameMap.find(item => item.type === 'enable_ltsm_space_config');
        const res = await changeTimeSeriesModelConfigFetch({ ...reqItem, status: !preStatus });
        return Promise.resolve(res);
    };
    const changeCoolSwitch = async () => {
        const preStatus = coolSwitch.value === 'checked';
        const reqItem = timeSeriesNameMap.find(item => item.type === 'enable_ltsm_cooling_config');
        const res = await changeTimeSeriesModelConfigFetch({ ...reqItem, status: !preStatus });
        return Promise.resolve(res);
    };
    const changeAcPumpSwitch = async () => {
        const preStatus = acPumpSwitch.value === 'checked';
        const reqItem = timeSeriesNameMap.find(item => item.type === 'enable_ltsm_pump_config');
        const res = await changeTimeSeriesModelConfigFetch({ ...reqItem, status: !preStatus });
        return Promise.resolve(res);
    };
    return {
        spaceSwitch,
        changeSpaceSwitch,
        coolSwitch,
        changeCoolSwitch,
        acPumpSwitch,
        changeAcPumpSwitch,
        aiSwitch,
        changeAiSwitch
    };
};
