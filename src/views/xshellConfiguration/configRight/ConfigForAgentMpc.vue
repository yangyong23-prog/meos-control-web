<template>
    <div class="config-container">
        <title-type class="row" :title="i18n.global.t('meos_control_web.AI_MPC_Config')" />
        <template v-if="!Object.keys(mpcConfigData).length"> <Empty :text="i18n.global.t('meos_control_web.no_content')" class="empty-new" /></template>
        <template v-else>
            <ConfigForAgentMpcFormItem v-model="mpcConfigData.ACAC" />
            <ConfigForAgentMpcFormItem v-model="mpcConfigData.ACAI" />
            <div v-if="mpcConfigData.AIR_TERMINAL?.options?.length" class="content-wrap margin-bottom-16">
                <div class="single-title">{{ i18n.global.t('meos_control_web.air_terminal') }}</div>
                <m-checkbox-group v-model="mpcConfigData.AIR_TERMINAL.selected">
                    <div class="checkbox-list">
                        <m-checkbox v-for="item in mpcConfigData.AIR_TERMINAL.options" :key="item.id" :label="item.id"> {{ item.name }}</m-checkbox>
                    </div>
                </m-checkbox-group>
            </div>
        </template>

        <title-type class="row" :title="i18n.global.t('meos_control_web.algorithm_configuration_title')" />

        <div class="single-line">
            <SwitchHeader />
            <span class="line-link"></span>
            <m-button type="link" @click="openStartCalculationModal">{{ i18n.global.t('meos_control_web.start_algorithm_calc') }}</m-button>
        </div>

        <startCalculationModal v-if="showStartCalculationModal" @close="closeStartCalculationModal" @after-submit="afterStartCalculationSubmit" />
    </div>
</template>

<script setup>
import { $Message } from 'meri-plus';
import emitter from '@/utils/bus';
import i18n from '@/localization';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { shellConfigQuery, shellConfigSave } from '@/apis/xshellConfiguration';

import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';
import titleType from './common/titleType.vue';
import { fetchAbortControllerInjectKey, useShellConfigLoading } from '../hooks/useGlobalData';
import SwitchHeader from '../header/SwitchHeader.vue';
import startCalculationModal from './common/startCalculationModal.vue';
import ConfigForAgentMpcFormItem from './ConfigForAgentMpcFormItem.vue';
import Empty from '@/components/common/Empty.vue';

const { showLoading, hideLoading } = useShellConfigLoading();
const fetchAbortController = inject(fetchAbortControllerInjectKey);

const QUERY_SCENE_NAME = 'mpc';
const LEFT_ACTIVE_MENU_ID = ACTIVE_MENUS_ID_ENUM.CONFIG_FOR_AGENT_MPC;

const initMpcConfigData = ref({});
const mpcConfigData = ref({});
const initGroups = ref([]);
const isLoaded = ref(false);

const showStartCalculationModal = ref(false);

// 开启启用算法弹窗
const openStartCalculationModal = () => {
    showStartCalculationModal.value = true;
};

// 关闭启用算法弹窗
const closeStartCalculationModal = () => {
    showStartCalculationModal.value = false;
};

// 启用算法开启成功
const afterStartCalculationSubmit = () => {
    showStartCalculationModal.value = false;
};

// 安全解析 JSON
const safeJsonParse = (str, defaultValue = null) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        return defaultValue;
    }
};

// 处理基础配置项
const processBasicConfigItem = (item, currentInstance) => {
    const options = safeJsonParse(item?.valSource, []);
    let finalVal = item?.shellConfigValue;

    // 特殊处理数组类型的值
    try {
        const tempVal = JSON.parse(item?.shellConfigValue);
        if (Array.isArray(tempVal)) {
            finalVal = tempVal;
        }
    } catch (error) {
        // 保持原始值
    }

    currentInstance[item.code] = {
        options,
        value: finalVal,
        label: item?.name,
        required: item?.editAuth
    };
};

// 处理阶段配置项
const processStageConfigItem = (item, currentInstance) => {
    const options = safeJsonParse(item?.valSource, []);
    const finalVal = safeJsonParse(item?.shellConfigValue, []);
    const levelOne = { options, value: finalVal, label: item?.name, required: item?.editAuth };

    if (!currentInstance[item.code]) {
        currentInstance[item.code] = { levelOne };
    } else {
        currentInstance[item.code].levelOne = levelOne;
    }
};

// 处理分类配置项
const processClassConfigItem = (item, currentInstance) => {
    const selectedArr = safeJsonParse(item?.shellConfigValue, []);
    const finalVal = (item.mulInstance || []).filter(v => selectedArr.includes(v.objectId))?.map(v => v?.objectId);

    const levelTwo = {
        label: item.name,
        options: item.mulInstance || [],
        value: finalVal
    };

    const itemCode = item?.code?.replace('_class_code', '');
    if (!currentInstance[itemCode]) {
        currentInstance[itemCode] = { levelTwo };
    } else {
        currentInstance[itemCode].levelTwo = levelTwo;
    }
};

// 处理 MPC 配置项
const processMpcConfigItems = items => {
    const instanceMap = new Map();
    (items || [])?.forEach(item => {
        if (!instanceMap.has(item?.objectId)) {
            instanceMap.set(item?.objectId, { id: item?.objectId, name: item?.objectName });
        }
        const currentInstance = instanceMap.get(item?.objectId);

        if (['mpc_app_mode', 'mpc_calc_policy'].includes(item?.code)) {
            processBasicConfigItem(item, currentInstance);
        } else if (['mpc_stage_up', 'mpc_stage_day', 'mpc_stage_down', 'mpc_stage_night'].includes(item?.code)) {
            processStageConfigItem(item, currentInstance);
        } else if (['mpc_stage_up_class_code', 'mpc_stage_day_class_code', 'mpc_stage_down_class_code', 'mpc_stage_night_class_code'].includes(item?.code)) {
            processClassConfigItem(item, currentInstance);
        }
    });

    // 将 Map 中的数据转换为数组形式存储
    return Array.from(instanceMap.values());
};

// 获取配置
const getShellConfigQuery = async () => {
    isLoaded.value = false;
    showLoading();

    initMpcConfigData.value = {};
    mpcConfigData.value = {};
    initGroups.value = [];

    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();

    const res = await shellConfigQuery({ scene: QUERY_SCENE_NAME }, fetchAbortController.value.signal).finally(() => {
        hideLoading();
    });
    if (res.code === SUCCESSCODE && Array.isArray(res.data)) {
        res.data.forEach(group => {
            if (Array.isArray(group?.groups)) {
                group.groups.forEach(obj => {
                    try {
                        if (obj?.group === 'group_mpc_agent_acac') {
                            // 中央空调供冷全系统
                            const allInstances = processMpcConfigItems(obj?.items);
                            if (Array.isArray(allInstances) && allInstances.length) {
                                mpcConfigData.value.ACAC = {
                                    instances: allInstances,
                                    selected: allInstances?.[0]?.id
                                };
                            }
                        } else if (obj?.group === 'group_mpc_agent_acai') {
                            // 中央空调冷热源全系统
                            const allInstances = processMpcConfigItems(obj?.items);
                            if (Array.isArray(allInstances) && allInstances.length) {
                                mpcConfigData.value.ACAI = {
                                    instances: allInstances,
                                    selected: allInstances?.[0]?.id
                                };
                            }
                        } else if (obj?.group === 'group_mpc_agent_air_terminal') {
                            // 空调末端
                            const options = obj?.items?.map(v => ({ code: v?.code, id: v?.valSource, name: v?.name, value: '' })) || [];
                            const selected = obj?.items?.map(v => v?.value)?.filter(v => !!v) || [];
                            if (Array.isArray(options) && options.length) {
                                mpcConfigData.value.AIR_TERMINAL = {
                                    options,
                                    selected
                                };
                            }
                        }
                        initGroups.value.push(obj);
                    } catch (error) {
                        console.log('json parse error', error);
                        return;
                    }
                });
            }
        });

        initMpcConfigData.value = structuredClone(toRaw(mpcConfigData.value));
    }

    nextTick(() => {
        emitter.emit('confirmDisabled', { status: true, isSave: true });

        isLoaded.value = true;
    });

    return res;
};

// 处理阶段配置项的保存
const handleStageConfigSave = (code, curInstanceConfig, item) => {
    const selectValue = curInstanceConfig[code]?.levelOne?.value || [];
    return {
        code: item.code,
        objectId: item.objectId,
        objectName: item.objectName,
        value: JSON.stringify(selectValue)
    };
};

// 处理分类配置项的保存
const handleClassConfigSave = (code, curInstanceConfig, item) => {
    const itemCode = code?.replace('_class_code', '');
    const selectValue = curInstanceConfig[itemCode]?.levelTwo?.value || [];
    return {
        code: item.code,
        objectId: item.objectId,
        objectName: item.objectName,
        value: JSON.stringify(selectValue)
    };
};

// 处理基础配置项的保存
const handleBasicConfigSave = (code, curInstanceConfig, item) => {
    const selectValue = curInstanceConfig[code]?.value;
    return {
        code: item.code,
        objectId: item.objectId,
        objectName: item.objectName,
        value: Array.isArray(selectValue) ? JSON.stringify(selectValue) : selectValue
    };
};

const handleInstanceConfig = (key, obj) => {
    const newItems = [];
    (obj?.items || []).forEach(item => {
        const { code, objectId } = item || {};
        const allInstances = mpcConfigData.value[key]?.instances || [];
        const curInstanceConfig = allInstances.find(v => v.id === objectId) || {};

        if (['mpc_stage_up', 'mpc_stage_day', 'mpc_stage_down', 'mpc_stage_night'].includes(code)) {
            newItems.push(handleStageConfigSave(code, curInstanceConfig, item));
        } else if (code.includes('_class_code')) {
            newItems.push(handleClassConfigSave(code, curInstanceConfig, item));
        } else {
            newItems.push(handleBasicConfigSave(code, curInstanceConfig, item));
        }
    });
    return newItems;
};

// 处理空调末端配置项
const handleAirTerminalConfig = obj => {
    const tempArr = mpcConfigData.value.AIR_TERMINAL?.options || [];
    const selectedArr = mpcConfigData.value.AIR_TERMINAL?.selected || [];
    return tempArr.map(v => ({ code: v.code, value: selectedArr.includes(v.id) ? v.id : '' }));
};

// 构建配置组
const buildConfigGroups = () => {
    return initGroups.value.map(obj => {
        let newItems = [];

        if (obj?.group === 'group_mpc_agent_acac') {
            newItems = handleInstanceConfig('ACAC', obj);
        } else if (obj?.group === 'group_mpc_agent_acai') {
            newItems = handleInstanceConfig('ACAI', obj);
        } else if (obj?.group === 'group_mpc_agent_air_terminal') {
            newItems = handleAirTerminalConfig(obj);
        }

        return {
            group: obj.group,
            items: newItems
        };
    });
};

// 更新配置
const updateShellConfig = () => {
    const groups = buildConfigGroups();

    shellConfigSave({
        scene: QUERY_SCENE_NAME,
        groups
    }).then(res => {
        if (res.code === SUCCESSCODE) {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            getShellConfigQuery();
        }
    });
};
emitter.off('InputEmitter');
emitter.on('InputEmitter', data => {
    if (data.menu === LEFT_ACTIVE_MENU_ID) {
        if (data.type === 'confirm') {
            formValidate(data.menu);
        } else if (data.type === 'cancel') {
            mpcConfigData.value = structuredClone(toRaw(initMpcConfigData.value));
            nextTick(() => {
                emitter.emit('confirmDisabled', { status: true, isSave: true });
            });
        } else {
            formValidate();
        }
    }
});

// 验证
const formValidate = data => {
    if (data !== LEFT_ACTIVE_MENU_ID) {
        return;
    }
    const finalVal = mpcConfigData.value;
    console.log(finalVal);
    let errorTips = '';
    if (errorTips) {
        $Message.error({ title: errorTips });
        return;
    } else {
        updateShellConfig();
    }
};

onMounted(() => {
    Promise.allSettled([getShellConfigQuery()]);
});

watch(
    [() => mpcConfigData.value],
    () => {
        if (isLoaded.value) {
            emitter.emit('confirmDisabled', { status: false, isSave: true });
        }
    },
    {
        immediate: true,
        deep: true
    }
);

onUnmounted(() => {
    hideLoading();
});
</script>

<style lang="less" scoped>
.config-container {
    display: flex;
    flex-direction: column;
    padding-inline: 16px;
    padding-bottom: 16px;

    .row {
        margin-bottom: 10px;
    }
}

.single-line {
    display: flex;
    align-items: center;
    padding-left: 30px;
}

.line-link {
    display: inline-block;
    width: 1px;
    height: 14px;
    background: #c4c9cf;
    margin: 0 6px;
}

.content-wrap {
    padding-left: 30px;
}
.single-title {
    color: #2e3742;

    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
    margin-bottom: 12px;
}

.margin-bottom-16 {
    margin-bottom: 16px;
}

.checkbox-list {
    display: flex;
    align-items: center;
    gap: 20px;
}

.empty-new {
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
