<template>
    <div class="container-box">
        <xshellFormList
            ref="weatherSource"
            :label-width="'200px'"
            :title="i18n.global.t('meos_control_web.outdoor_weather_source_switch')"
            :xshell-params="params"
            :data-list="params.weatherData"
            :dynamic-show-handler-config="dynamicShowHandlerConfig"
        >
        </xshellFormList>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { shellConfigQuery, shellConfigSave } from '@/apis/xshellConfiguration';
import { formatterValue, validate } from '../utils/tools';
import xshellFormList from './common/xshellFormList.vue';
import emitter from '@/utils/bus';
import { $Message, MLoading } from 'meri-plus';
import { fetchAbortControllerInjectKey, loadingInstanceInjectKey } from '../hooks/useGlobalData';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';
import { SUCCESSCODE } from '@/utils/globalVariables';

const emit = defineEmits(['defaultRestoreAll']);
const fetchAbortController = inject<any>(fetchAbortControllerInjectKey);
const loadingInstance = inject<any>(loadingInstanceInjectKey);

const WEATHER_SOURCE_SWITCH_CODE = 'weather_weather_change';
const WEATHER_STATION_CODE = 'alg_weather_data_source';
const WEATHER_STATION_VALUE = i18n.global.t('common.no');

// 基于当前返回字段动态组装示例规则
const dynamicShowHandlerConfig = computed(() => {
    const nextConfig: Record<string, any> = {};

    params.weatherData.forEach((item: any) => {
        if (item?.code === WEATHER_SOURCE_SWITCH_CODE) {
            return;
        }

        if (item?.code === WEATHER_STATION_CODE) {
            nextConfig[item.code] = ({ getValue, getField }: { getValue: (code: string) => string; getField: (code: string) => any }) => ({
                show: getValue(WEATHER_SOURCE_SWITCH_CODE) === WEATHER_STATION_VALUE,
                emptyMsg: getField(WEATHER_STATION_CODE)?.mulInstanceList?.length ? '' : i18n.global.t('meos_control_web.no_weather_station_available')
            });
            return;
        }
    });

    return nextConfig;
});

// 室外天气
const weatherSource = ref<any>(null);

// 空间需求
const params = reactive({
    allItem: [] as any, // 全部的item,不包含groups
    defaultItem: [] as any, // 默认不变的item
    weatherData: [] // 天气数据
});

const getShellConfigQuery = async (name: string) => {
    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();
    loadingInstance?.value?.destroy?.();
    loadingInstance.value = MLoading.service({
        target: '.shell-config-right-box',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });

    params.allItem = [];
    params.defaultItem = [];
    params.weatherData = [];
    let items: any = [];

    try {
        const res = await shellConfigQuery({ scene: name }, fetchAbortController.value.signal);
        if (res.code === '00000') {
            const resData = res.data || [];
            if (Array.isArray(resData)) {
                resData.forEach((group: any) => {
                    group.groups.length &&
                        group.groups.forEach((item: any) => {
                            items.push(item);
                            if (item.group === 'group_weather_change') {
                                params.weatherData = formatterValue(item.items);
                            }
                        });
                });
            }
        }
    } catch (error: any) {
        if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
            console.error(error);
        }
    } finally {
        loadingInstance.value?.destroy?.();
    }

    params.allItem = items;
    params.defaultItem = structuredClone(items);
};

// 更新配置

// 更新配置
const updateShellConfig = () => {
    const finalGroups = params.allItem.map((group: any) => {
        if (group.group === 'group_weather_change') {
            const firstRow: any = params.weatherData?.find((v: any) => v.code === 'weather_weather_change') || {};
            const isWeatherService = firstRow?.valueInputLeft === i18n.global.t('meos_control_web.yes');
            return {
                group: group.group,
                items: params.weatherData?.map((v: any) => {
                    if (v.code === 'weather_weather_change') {
                        const finalVal = isWeatherService ? i18n.global.t('meos_control_web.weather_service') : i18n.global.t('meos_control_web.weather_station');
                        return { code: v.code, value: finalVal };
                    }
                    return { code: v.code, value: isWeatherService ? '' : v.valueInputLeft };
                })
            };
        }
        return group;
    });
    shellConfigSave({
        scene: 'weather',
        groups: finalGroups
    }).then(res => {
        if (res.code === SUCCESSCODE) {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
            getShellConfigQuery('weather');
        }
    });
};

emitter.off('InputEmitter');
emitter.on('InputEmitter', (data: any) => {
    if (data.menu === ACTIVE_MENUS_ID_ENUM.WEATHER_SOURCE) {
        if (data.type === 'confirm') {
            formValidate(data.menu);
        } else if (data.type === 'cancel') {
            params.allItem.map((group: any) => {
                group.items.map((item: any) => {
                    item.valueInputLeft = item.valueLeft != null ? item.valueLeft : item.defaultValueLeft;
                    item.valueInputRight = item.valueRight != null ? item.valueRight : item.defaultValueRight;
                });
            });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        } else {
            params.allItem.map((group: any) => {
                group.items.map((item: any) => {
                    item.valueInputLeft = item.defaultValueLeft;
                    item.valueInputRight = item.defaultValueRight;
                });
            });
            formValidate();
        }
    }
});

// 验证
const formValidate = (data?: any) => {
    nextTick(() => {
        Promise.all([validate(weatherSource)]).then(function (results) {
            if (data === ACTIVE_MENUS_ID_ENUM.WEATHER_SOURCE) {
                // 更新配置
                updateShellConfig();
            } else {
                if (results.includes(undefined)) {
                    emitter.emit('confirmDisabled', { status: true, isSave: false });
                }
            }
        });
    });
};

const isItemModified = (item: any) => {
    return item.valueInputLeft !== item.defaultValueLeft || item.valueInputRight !== item.defaultValueRight;
};

// 统一从当前表单数据派生“是否有改动”和“是否展示恢复默认”状态，避免多段 watcher 重复遍历。
const noDefaultData = computed(() => {
    return params.allItem.flatMap((group: any) => group.items.filter((item: any) => isItemModified(item)));
});

const isTreeChanged = computed(() => {
    return JSON.stringify(params.allItem) !== JSON.stringify(params.defaultItem);
});

watch(
    () => [JSON.stringify(params.allItem), JSON.stringify(params.defaultItem)],
    () => {
        formValidate();
        emitter.emit('confirmDisabled', { status: !isTreeChanged.value, isSave: true });
        emit('defaultRestoreAll', !!noDefaultData.value.length);
    }
);

onMounted(() => {
    getShellConfigQuery('weather');
});
</script>
<style scoped lang="less">
@import '../styles/xshellConfigRight.less';
</style>
