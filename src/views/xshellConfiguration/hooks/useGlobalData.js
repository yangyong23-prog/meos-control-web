import { inject } from 'vue';
import { $Message } from 'meri-plus';
import emitter from '@/utils/bus';
import { startAlgorithmCalculation, listTypeByCode, queryMpcAgentCfg } from '@/apis/xshellConfiguration';
import AlgorithmLogic from '../configRight/algorithmLogic.vue';
import ControlLogic from '../configRight/controlLogic.vue';
import SpaceRequirements from '../configRight/spaceRequirements.vue';
import FrontEndOfStrategyAndControlParameters from '../configRight/frontEndOfStrategyAndControlParameters.vue';
import WeatherSource from '../configRight/weatherSource.vue';
import EfficiencyMetrics from '../configRight/EfficiencyMetrics.vue';
import SystemGraphSetting from '../configRight/SystemGraphSetting.vue';
import { listObjectsByTackValueLogic } from '@/apis/public';
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import ViewHalfSectionSetting from '../configRight/ViewHalfSectionSetting.vue';
import LightingConfig from '../configRight/LightingConfig.vue';
import MachineRoomConfig from '../configRight/MachineRoomConfig.vue';
import SecurityConfig from '../configRight/SecurityConfig.vue';
import VentilationConfig from '../configRight/VentilationConfig.vue';
import ViewReportConfig from '../configRight/ViewReportConfig.vue';
import ConfigForAgentMpc from '../configRight/ConfigForAgentMpc.vue';
import PersistentDataRule from '../configRight/PersistentDataRule.vue';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';

export const fetchAbortControllerInjectKey = Symbol('fetchAbortControllerInjectKey');
export const loadingInstanceInjectKey = Symbol('loadingInstanceInjectKey');
export const isLoadingInjectKey = Symbol('isLoadingInjectKey');
export const showShellConfigLoadingKey = Symbol('showShellConfigLoadingKey');
export const hideShellConfigLoadingKey = Symbol('hideShellConfigLoadingKey');
export const systemTreeKey = Symbol('systemTreeInjectKey');
export const systemTreeLoadingKey = Symbol('systemTreeLoadingInjectKey');
export const getAIsystemTreeKey = Symbol('getAIsystemTreeInjectKey');
export const systemTreeMPCKey = Symbol('systemTreeMPCInjectKey');
export const systemTreeMPCLoadingKey = Symbol('systemTreeMPCLoadingInjectKey');
export const getMPCConfigDataAndSystemDataKey = Symbol('getMPCConfigDataAndSystemDataInjectKey');
export const goBackKey = Symbol('goBackKey');
export const showLeaveKey = Symbol('showLeaveKey');

// 配置右侧统一的加载态 composable：类型安全的 inject，避免各组件重复 copy MLoading 配置
export const useShellConfigLoading = () => {
    const loadingInstance = inject(loadingInstanceInjectKey);
    const isLoading = inject(isLoadingInjectKey);
    const showLoading = inject(showShellConfigLoadingKey);
    const hideLoading = inject(hideShellConfigLoadingKey);
    return {
        loadingInstance,
        isLoading,
        showLoading,
        hideLoading
    };
};

export default () => {
    const menuList = ref([
        {
            activeIcon: 'activegit',
            defaultIcon: 'defaultgit',
            name: i18n.global.t('meos_control_web.auto_demand_calc_condition_input'),
            tips: i18n.global.t('meos_control_web.algorithm_strategy_generation_parameters_modify_next_day_effective')
        },
        {
            activeIcon: 'activelocate',
            defaultIcon: 'defaultlocate',
            name: i18n.global.t('meos_control_web.control_logic_condition_input'),
            tips: i18n.global.t('meos_control_web.control_logic_parameters_modify_immediate_effective')
        },
        {
            activeIcon: 'activebox',
            defaultIcon: 'defaultbox',
            name: i18n.global.t('meos_control_web.space_demand_input_condition'),
            tips: i18n.global.t('meos_control_web.demand_mgmt_input_condition_instant_effect')
        },
        {
            activeIcon: 'activemap',
            defaultIcon: 'defaultmap',
            name: i18n.global.t('meos_control_web.demand_target_control_param_input'),
            tips: i18n.global.t('meos_control_web.control_input_param_condition_instant_effect')
        },
        {
            activeIcon: 'activeMpc',
            defaultIcon: 'defaultMpc',
            name: i18n.global.t('meos_control_web.AI_MPC_Config'),
            tips: ''
        },
        {
            activeIcon: 'activeweather',
            defaultIcon: 'defaultweather',
            name: i18n.global.t('meos_control_web.outdoor_weather_source_input'),
            tips: i18n.global.t('meos_control_web.chiller_plant_weather_data_source_switch_modify_immediate_effective')
        },
        {
            activeIcon: 'activeEfficiencyMetrics',
            defaultIcon: 'defaultEfficiencyMetrics',
            name: i18n.global.t('meos_control_web.efficiency_index_config'),
            tips: ''
        },
        {
            activeIcon: 'activeSystemGraph',
            defaultIcon: 'defaultSystemGraph',
            name: i18n.global.t('meos_control_web.graph_setting'), // graph_setting
            tips: ''
        },
        {
            activeIcon: 'activeViewHalfSection',
            defaultIcon: 'initViewHalfSection',
            name: i18n.global.t('meos_control_web.terminal_config'),
            tips: ''
        },
        {
            activeIcon: 'activeLighting',
            defaultIcon: 'defaultLighting',
            name: i18n.global.t('meos_control_web.lighting_config'),
            tips: ''
        },
        {
            activeIcon: 'activeVentilation',
            defaultIcon: 'defaultVentilation',
            name: i18n.global.t('meos_control_web.ventilation_config'),
            tips: ''
        },
        {
            activeIcon: 'activeMachineRoomConfig',
            defaultIcon: 'defaultMachineRoomConfig',
            name: i18n.global.t('meos_control_web.machine_room_config'),
            tips: ''
        },
        {
            activeIcon: 'activeSecurityConfig',
            defaultIcon: 'defaultSecurityConfig',
            name: i18n.global.t('meos_control_web.security_config'),
            tips: ''
        },
        //报告配置入口
        {
            activeIcon: 'activeReport',
            defaultIcon: 'defaultReport',
            name: i18n.global.t('meos_control_web.report_config'),
            tips: ''
        },
        //云端持久化数据显示规则入口
        {
            activeIcon: 'activePersistentDataRule',
            defaultIcon: 'defaultPersistentDataRule',
            name: i18n.global.t('meos_control_web.persistent_data_display_rule'),
            tips: ''
        }
    ]);
    const title = ref(menuList.value[0]?.name);
    const activeMenu = ref(ACTIVE_MENUS_ID_ENUM.ALGORITHM_LOGIC);
    // 默认标题及tips
    const titleTips = computed(() => menuList.value.find(item => item.name === title.value)?.tips || '');
    // 是否展示返回
    const goBack = reactive({
        subTitle: '',
        callback: null,
        // 记录触发 goBack 操作的来源菜单 ID，供 resetGoBack 中进行条件判断
        from: null
    });
    // 是否展示启动算法计算按钮
    const isStartCalculation = ref(false);
    // 是否展示批量恢复默认值按钮
    const isRestoreAll = ref(false);
    // 是否需要保存
    const isSave = ref(true);
    // 确认取消是否置灰
    const isDisabled = ref(true);
    // 二次弹框
    const showleave = ref(false);
    const itemObj = ref({});

    const fetchAbortController = ref();
    const loadingInstance = ref();
    const isLoading = ref(false);

    // 统一的配置右侧加载态：启动/关闭 loading 并同步 isLoading，供 changeMenu 的离页确认判断使用
    const showShellConfigLoading = () => {
        loadingInstance.value?.destroy?.();
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
        isLoading.value = true;
    };
    const hideShellConfigLoading = () => {
        loadingInstance.value?.destroy?.();
        loadingInstance.value = null;
        isLoading.value = false;
    };

    // 系统树
    const systemTree = ref([]);
    // 系统树加载中
    const systemTreeLoading = ref(true);
    // 系统树(MPC)
    const systemTreeMPC = ref([]);
    // 系统树加载中(MPC)
    const systemTreeMPCLoading = ref(true);
    // 需要查询的字典编码和名称的枚举
    const CLASS_CODE_LIST = ['ACCC', 'ACAC', 'ACAI', 'ACCI', 'ACAH', 'ACCH'];
    // 字典数据
    const classCodeNameList = ref([]);
    // MPC配置数据
    const MPCConfigData = ref([]);
    // 算法开启弹窗和MPC开启弹窗公用
    let modalLoadingInstance = null;

    provide(fetchAbortControllerInjectKey, fetchAbortController);
    provide(loadingInstanceInjectKey, loadingInstance);
    provide(isLoadingInjectKey, isLoading);
    provide(showShellConfigLoadingKey, showShellConfigLoading);
    provide(hideShellConfigLoadingKey, hideShellConfigLoading);
    provide(systemTreeKey, systemTree);
    provide(systemTreeMPCKey, systemTreeMPC);
    provide(systemTreeMPCLoadingKey, systemTreeMPCLoading);

    // 获取字典数据
    const getListTypeByCode = () => {
        listTypeByCode(CLASS_CODE_LIST).then(res => {
            const { code, data } = res;
            if (code === '00000') {
                classCodeNameList.value = data;
            }
        });
    };

    // 启动算法计算
    const startCalculation = () => {
        startAlgorithmCalculation({}).then(res => {
            if (res.code === '00000') {
                $Message.success({ title: i18n.global.t('meos_control_web.startup_success') });
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.startup_fail') });
            }
        });
    };
    // 重置 goBack 相关状态
    const resetGoBack = () => {
        if (goBack.subTitle && goBack.from !== activeMenu.value) {
            goBack.from = null;
            goBack.subTitle = '';
        }
    };
    // 菜单栏切换
    const changeMenu = (item, index) => {
        resetGoBack();
        itemObj.value = {
            item: item,
            index: index
        };
        if (index === activeMenu.value) return;

        if (!isDisabled.value || !isSave.value) {
            if (!isLoading.value) {
                showleave.value = true;
            }
        } else {
            title.value = item.name;
            activeMenu.value = index;
            // 切换菜单，重置恢复默认的值
            isRestoreAll.value = false;
        }
    };
    // 是否展示批量恢复按钮
    const defaultRestoreAll = data => {
        isRestoreAll.value = data;
    };
    // 二次弹框取消
    const closeShowleave = () => {
        showleave.value = false;
    };
    // 二次弹框提交
    const submitShowleave = () => {
        isSave.value = true;
        showleave.value = false;
        isDisabled.value = true;
        setTimeout(() => {
            title.value = itemObj.value.item.name;
            activeMenu.value = itemObj.value.index;
        }, 500);
    };
    // 批量恢复默认值
    const restoreAllDefault = () => {
        isRestoreAll.value = false;
        emitter.emit('InputEmitter', { menu: activeMenu.value, type: 'reset' });
        $Message.success({ title: i18n.global.t('meos_control_web.restore_success') });
    };
    // 确认
    const confirm = () => {
        emitter.emit('InputEmitter', { menu: activeMenu.value, type: 'confirm' });
    };

    // 取消
    const cancel = () => {
        emitter.emit('InputEmitter', { menu: activeMenu.value, type: 'cancel' });
    };

    const currentComponent = computed(() => {
        const componentMap = {
            [ACTIVE_MENUS_ID_ENUM.ALGORITHM_LOGIC]: AlgorithmLogic,
            [ACTIVE_MENUS_ID_ENUM.CONTROL_LOGIC]: ControlLogic,
            [ACTIVE_MENUS_ID_ENUM.SPACE_REQUIREMENTS]: SpaceRequirements,
            [ACTIVE_MENUS_ID_ENUM.FRONT_END_OF_STRATEGY_AND_CONTROL_PARAMETERS]: FrontEndOfStrategyAndControlParameters,
            [ACTIVE_MENUS_ID_ENUM.CONFIG_FOR_AGENT_MPC]: ConfigForAgentMpc,
            [ACTIVE_MENUS_ID_ENUM.WEATHER_SOURCE]: WeatherSource,
            [ACTIVE_MENUS_ID_ENUM.EFFICIENCY_METRICS]: EfficiencyMetrics,
            [ACTIVE_MENUS_ID_ENUM.SYSTEM_GRAPH_SETTING]: SystemGraphSetting,
            [ACTIVE_MENUS_ID_ENUM.VIEW_HALF_SECTION_SETTING]: ViewHalfSectionSetting,
            [ACTIVE_MENUS_ID_ENUM.LIGHTING_CONFIG]: LightingConfig,
            [ACTIVE_MENUS_ID_ENUM.VENTILATION_CONFIG]: VentilationConfig,
            [ACTIVE_MENUS_ID_ENUM.MACHINE_ROOM_CONFIG]: MachineRoomConfig,
            [ACTIVE_MENUS_ID_ENUM.SECURITY_CONFIG]: SecurityConfig,
            [ACTIVE_MENUS_ID_ENUM.VIEW_REPORT_CONFIG]: ViewReportConfig,
            [ACTIVE_MENUS_ID_ENUM.PERSISTENT_DATA_RULE]: PersistentDataRule
        };
        return componentMap[activeMenu.value];
    });

    // 确认按钮置灰
    emitter.off('confirmDisabled');
    emitter.on('confirmDisabled', data => {
        isDisabled.value = data.status;
        isSave.value = data.isSave;
    });

    // 切换菜单时统一取消上一个模块的在途请求
    watch(activeMenu, () => {
        fetchAbortController.value?.abort?.();
    });

    // 离开壳配置页时兜底取消
    onUnmounted(() => {
        fetchAbortController.value?.abort?.();
        emitter.off('confirmDisabled');
    });

    // 获取系统下拉
    const getAIsystemTree = () => {
        modalLoadingInstance?.destroy();
        systemTree.value = [];
        systemTreeLoading.value = true;
        const params = {
            runningMonitorType: 'AI',
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACCC', 'ACAC', 'ACCI', 'ACCH'],
                    withColumns: ['id', 'localName', 'classCode'],
                    orderCustoms: [
                        {
                            column: 'classCode',
                            asc: true
                        },
                        {
                            column: 'localName',
                            chineseOrder: true
                        }
                    ]
                }
            }
        };
        modalLoadingInstance = MLoading.service({
            target: `.start-calculation-loading`,
            fullscreen: false,
            duration: 30000,
            lottieName: 'circle',
            loadIconStyle: {
                width: '200px',
                height: '200px'
            }
        });
        listObjectsByTackValueLogic(params, { signal: fetchAbortController.value?.signal })
            .then(({ code, data }) => {
                if (code === '00000') {
                    const tree = [];
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        const node = tree.find(_item => {
                            return _item.classCode === item.classCode;
                        });
                        if (node) {
                            node.children.push({
                                id: item.id,
                                name: item.localName
                            });
                        } else {
                            const classCodeNode = classCodeNameList.value.find(_item => {
                                return item.classCode === _item.code;
                            });
                            tree.push({
                                id: item.classCode,
                                name: classCodeNode?.name ? classCodeNode.name : '--',
                                classCode: item.classCode,
                                children: [
                                    {
                                        id: item.id,
                                        name: item.localName
                                    }
                                ]
                            });
                        }
                    }
                    systemTree.value = tree;
                }
            })
            .finally(() => {
                modalLoadingInstance?.destroy();
                systemTreeLoading.value = false;
            });
    };

    // 获取MPC配置数据和系统数据
    const getMPCConfigDataAndSystemData = () => {
        modalLoadingInstance?.destroy();
        systemTreeMPC.value = [];
        systemTreeMPCLoading.value = true;
        const params = {
            runningMonitorType: 'AI',
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACCC', 'ACAC', 'ACAI', 'ACCI', 'ACAH', 'ACCH'],
                    withColumns: ['id', 'localName', 'classCode'],
                    orderCustoms: [
                        {
                            column: 'classCode',
                            asc: true
                        },
                        {
                            column: 'localName',
                            chineseOrder: true
                        }
                    ]
                }
            }
        };
        modalLoadingInstance = MLoading.service({
            target: `.mpc-calculation-loading`,
            fullscreen: false,
            duration: 30000,
            lottieName: 'circle',
            loadIconStyle: {
                width: '200px',
                height: '200px'
            }
        });
        // 查询MPC配置
        const signal = fetchAbortController.value?.signal;
        queryMpcAgentCfg(undefined, { signal })
            .then(res => {
                const { code, data } = res;
                if (code === '00000') {
                    MPCConfigData.value = data;
                    // 获取可系统列表
                    listObjectsByTackValueLogic(params, { signal })
                        .then(({ code, data }) => {
                            if (code === '00000') {
                                const tree = [];
                                for (let i = 0; i < data.length; i++) {
                                    const item = data[i];
                                    const node = tree.find(_item => {
                                        return _item.classCode === item.classCode;
                                    });
                                    if (node) {
                                        const config = MPCConfigData.value.find(_item => _item.systemId === item.id);
                                        if (config) {
                                            config.space = config.space ? 'checked' : 'uncheck';
                                            config.cold = config.cold ? 'checked' : 'uncheck';
                                            config.terminalPump = config.terminalPump ? 'checked' : 'uncheck';
                                        }
                                        node.children.push({
                                            id: item.id,
                                            name: item.localName,
                                            ...config
                                        });
                                    } else {
                                        const classCodeNode = classCodeNameList.value.find(_item => {
                                            return item.classCode === _item.code;
                                        });
                                        const config = MPCConfigData.value.find(_item => _item.systemId === item.id);
                                        if (config) {
                                            config.space = config.space ? 'checked' : 'uncheck';
                                            config.cold = config.cold ? 'checked' : 'uncheck';
                                            config.terminalPump = config.terminalPump ? 'checked' : 'uncheck';
                                        }
                                        tree.push({
                                            id: item.classCode,
                                            name: classCodeNode?.name ? classCodeNode.name : '--',
                                            classCode: item.classCode,
                                            open: true,
                                            children: [
                                                {
                                                    id: item.id,
                                                    name: item.localName,
                                                    ...config
                                                }
                                            ]
                                        });
                                    }
                                }
                                systemTreeMPC.value = tree;
                            }
                        })
                        .finally(() => {
                            modalLoadingInstance?.destroy();
                            systemTreeMPCLoading.value = false;
                        });
                } else {
                    modalLoadingInstance?.destroy();
                    systemTreeMPCLoading.value = false;
                }
            })
            .catch(err => {
                modalLoadingInstance?.destroy();
                systemTreeMPCLoading.value = false;
            });
    };

    provide(getAIsystemTreeKey, getAIsystemTree);
    provide(getMPCConfigDataAndSystemDataKey, getMPCConfigDataAndSystemData);
    provide(goBackKey, goBack);
    provide(showLeaveKey, showleave);

    getListTypeByCode();

    return {
        menuList,
        title,
        activeMenu,
        titleTips,
        isRestoreAll,
        isStartCalculation,
        isSave,
        isDisabled,
        showleave,
        itemObj,
        currentComponent,
        confirm,
        cancel,
        changeMenu,
        startCalculation,
        defaultRestoreAll,
        closeShowleave,
        submitShowleave,
        restoreAllDefault,
        goBack
    };
};
