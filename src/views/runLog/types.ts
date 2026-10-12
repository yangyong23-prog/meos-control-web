// @ts-ignore
import i18n from '@/localization';
export const enum TREE_NODE_TYPE {
    TREE_GROUP = 1,
    TREE_TEMPLATE
}

export interface TreeData {
    id: string;
    name: string;
    type?: number;
    children?: TreeData[];
    objCode?: string;
    disabled?: boolean;

    orderNum?: number;
    content?: string;

    time?: string; //时间：20240612 10:05:00
    sysid?: string; // 系统id：sy001
    syslocalname?: string; //系统名称：北区供冷系统
    sysSwitchSet?: boolean; // 冷站开关设定：开
    manualautlab?: string; //人工自动标签：人工
    tobdtp?: string; //是否下发+原因：否(与上条指令相同不下发）

    chillmumset?: string; // 冷机台数设定：3大1小
    chillmumsetsource?: string; //冷机台数设定来源：供冷成本跃变

    aienable?: boolean; //AI算法是否启用：是
    runchillnum?: string; //当前冷站运行台数：3大0小

    ifaddnum?: boolean; //是否加机：加机
    confirmadd?: string; //触发加机计算：是（累计30min触发）
    addm?: number; //M值：2.5
    outputchillnum?: string; //输出冷机台数：2大1小

    eqid?: string; //设备id：eq001
    eqlocalname?: string; //设备名称：冷机1（大机）
    runstatus?: string; //冷机运行状态：运行
    iPLR?: number; //电流负载率：96%
    maxPLRSet?: number; //负载率最大值设定：98%
    shelliPLR?: number; //判断加机的负载率-电流负载率最大值设定:5%
    evapWaterOutTemp?: number; //蒸发器出口水温：13℃
    chillWaterOutTempSet?: number; //冷冻水出水温度设定值：12℃
    shellevapWaterchillWater?: number; //判断加机的蒸发器出口水温-冷冻水出水温度设定:1℃
    ratedP?: number; //额定功率：2200

    subtractresult?: string; //减机结果：2(减机）
    confirmsubtract?: string; //触发减机计算：是（累计30min触发）

    shelllastschilliPLR?: number; //最后一台小机判断减机的负载率阈值：40%
    shelllastlchilliPLR?: number; //最后一台大机判断减机的负载率阈值：40%
    elecConsumP?: number; //冷机耗电功率：1800kw

    chillnumcombination?: string; //冷机台数组合：3大1小
    chillcombinationratedP?: number; //组合功率：5000kw
    ifcostjump?: boolean; //是否触发算法计算：是

    totalcost?: number; //总空间供冷成本：1000
    totalaircommandcost?: number; //有空调需求空间的供冷成本：500
    costproportion?: number; //供冷成本占比：50%
    shellcostproportion?: string; //壳配置供冷成本占比设定：70%~80%

    intermissionif?: boolean; //是否加机：是
    confirmintermission?: boolean; //是否触发加机：是
    spaceR1abnormal?: boolean; //空间R1异常：是
    chillpumpgroupabnormal?: boolean; //有泵组异常：是
    chillpumpgroupid?: boolean; //泵组id：sg001
    chillpumpgrouplocalname?: string; //泵组名称：一次冷冻泵组
    supplytemp?: number; //供水温度：13℃
    shellsupplytemp?: number; //壳配置温度阈值：15℃
    onepumprun?: boolean; //）是否至少有一台水泵运行：是
    shellpumpabnormaltime?: number; //壳配置的泵组连续不满足持续时长判断：30min
    chillrunnum?: string; //当前冷机运行台数：0大0小
    pumpabnormal?: boolean; //泵组异常：是
}

export interface SelectOption {
    id: string;
    name: string;
    key?: string;
    nodeCode?: string;
    value?: string;
    [key: string]: any;
}

export interface TableQuery {
    curTime: string;
    curItem?: unknown;
    [key: string]: any;
}

const enum TEMPLATE_TYPE {
    SYS_SWITCH_SET = 1, //系统开关设定报表
    CHILLER_NUM_SET, //冷机台数设定总览报表
    CHILLER_NUM_SET_ADD, //加机计算汇总报表
    CHILLER_NUM_SET_ADD_SINGLE, //加机计算明细报表
    CHILLER_NUM_SET_SUBTRACT, //减机计算汇总报表
    CHILLER_NUM_SET_COST_JUMP, //供冷成本跃变计算报表
    CHILLER_NUM_SET_INTERMISSION //间歇供冷加机报表
}

export const templateGroupTree = [
    {
        id: '1',
        name: i18n.global.t('meos_control_web.cooling_station'),
        children: [
            {
                id: '1-1',
                name: i18n.global.t('meos_control_web.system_on_off_setting_report'),
                key: TEMPLATE_TYPE.SYS_SWITCH_SET
            },
            {
                id: '1-2',
                name: i18n.global.t('meos_control_web.chiller_unit_setpoint'),
                children: [
                    { id: '1-2-1', name: i18n.global.t('meos_control_web.chiller_unit_setpoint_overview_report'), key: TEMPLATE_TYPE.CHILLER_NUM_SET },
                    {
                        id: '1-2-2',
                        name: i18n.global.t('meos_control_web.add_unit_calc_summary_report'),
                        key: TEMPLATE_TYPE.CHILLER_NUM_SET_ADD,
                        children: [{ id: '1-2-2-1', name: i18n.global.t('meos_control_web.add_unit_calc_detail_report'), key: TEMPLATE_TYPE.CHILLER_NUM_SET_ADD_SINGLE }]
                    },
                    { id: '1-2-3', name: i18n.global.t('meos_control_web.remove_unit_calc_summary_report'), key: TEMPLATE_TYPE.CHILLER_NUM_SET_SUBTRACT },
                    { id: '1-2-4', name: i18n.global.t('meos_control_web.cooling_cost_step_change_report'), key: TEMPLATE_TYPE.CHILLER_NUM_SET_COST_JUMP },
                    { id: '1-2-5', name: i18n.global.t('meos_control_web.intermittent_cooling_add_unit_report'), key: TEMPLATE_TYPE.CHILLER_NUM_SET_INTERMISSION }
                ]
            }
        ]
    }
];

export const templateColumnsMap = {
    [TEMPLATE_TYPE.SYS_SWITCH_SET]: [
        {
            dataIndex: 'col1',
            title: i18n.global.t('meos_control_web.chiller_unit_setpoint_output'),
            resizable: true,
            children: [
                {
                    dataIndex: 'time',
                    title: i18n.global.t('meos_control_web.time'),
                    resizable: true
                },
                {
                    dataIndex: 'sysSwitchSet',
                    title: i18n.global.t('meos_control_web.cooling_station_switch_setpoint'),
                    resizable: true
                },
                {
                    dataIndex: 'manualautlab',
                    title: i18n.global.t('meos_control_web.manual_auto_label'),
                    resizable: true
                },
                {
                    dataIndex: 'tobdtp',
                    title: i18n.global.t('meos_control_web.issue_or_not'),
                    resizable: true
                }
            ]
        },
        {
            dataIndex: 'col2',
            title: i18n.global.t('meos_control_web.switch_setpoint_data_source_input'),
            resizable: true,
            children: [
                {
                    dataIndex: 'sysSwitchSetair',
                    title: i18n.global.t('meos_control_web.hvac_demand'),
                    resizable: true
                },
                {
                    dataIndex: 'sysSwitchSettimetable',
                    title: i18n.global.t('meos_control_web.fixed_schedule'),
                    resizable: true
                },
                {
                    dataIndex: 'sysSwitchSetmanual',
                    title: i18n.global.t('meos_control_web.manual_intervention1'),
                    resizable: true
                }
            ]
        }
    ],
    [TEMPLATE_TYPE.CHILLER_NUM_SET]: [
        {
            dataIndex: 'col1',
            title: i18n.global.t('meos_control_web.cooling_station_current_operation'),
            resizable: true,
            children: [
                {
                    dataIndex: 'time',
                    title: i18n.global.t('meos_control_web.time'),
                    resizable: true
                },
                {
                    dataIndex: 'manualautlab',
                    title: i18n.global.t('meos_control_web.manual_auto_label'),
                    resizable: true
                },
                {
                    dataIndex: 'aienable',
                    title: i18n.global.t('meos_control_web.ai_algorithm_is_enabled'),
                    resizable: true
                },
                {
                    dataIndex: 'runchillnum',
                    title: i18n.global.t('meos_control_web.current_running_chillers'),
                    resizable: true
                }
            ]
        },
        {
            dataIndex: 'col2',
            title: i18n.global.t('meos_control_web.chiller_unit_setpoint_output'),
            resizable: true,
            children: [
                {
                    dataIndex: 'time',
                    title: i18n.global.t('meos_control_web.chiller_unit_setpoint'),
                    resizable: true
                },
                {
                    dataIndex: 'chillmumsetsource',
                    title: i18n.global.t('meos_control_web.chiller_unit_setpoint_data_source'),
                    resizable: true
                },
                {
                    dataIndex: 'tobdtp',
                    title: i18n.global.t('meos_control_web.issue_or_not'),
                    resizable: true
                }
            ]
        },
        {
            dataIndex: 'col3',
            title: i18n.global.t('meos_control_web.chiller_unit_setpoint_source'),
            resizable: true,
            children: [
                {
                    dataIndex: 'chillerOnSetadd',
                    title: i18n.global.t('meos_control_web.add_unit'),
                    resizable: true
                },
                {
                    dataIndex: 'chillerOnSetsubtract',
                    title: i18n.global.t('meos_control_web.remove_unit'),
                    resizable: true
                },
                {
                    dataIndex: 'chillerOnSetcostjump',
                    title: i18n.global.t('meos_control_web.cooling_cost_step_change'),
                    resizable: true
                },
                {
                    dataIndex: 'chillerOnSetintermission',
                    title: i18n.global.t('meos_control_web.intermittent_cooling_add_unit'),
                    resizable: true
                }
            ]
        }
    ],

    [TEMPLATE_TYPE.CHILLER_NUM_SET_ADD]: [],
    [TEMPLATE_TYPE.CHILLER_NUM_SET_ADD_SINGLE]: [],
    [TEMPLATE_TYPE.CHILLER_NUM_SET_SUBTRACT]: [],

    [TEMPLATE_TYPE.CHILLER_NUM_SET_COST_JUMP]: [
        {
            dataIndex: 'col1',
            title: i18n.global.t('meos_control_web.time_and_shell_config'),
            resizable: true,
            children: [
                {
                    dataIndex: 'time',
                    title: i18n.global.t('meos_control_web.time'),
                    resizable: true
                },
                {
                    dataIndex: 'shellcostproportion',
                    title: i18n.global.t('meos_control_web.shell_config_cooling_cost_ratio_setting'),
                    resizable: true
                }
            ]
        },
        {
            dataIndex: 'col2',
            title: i18n.global.t('meos_control_web.cooling_cost_ratio_at_time_t'),
            resizable: true,
            children: [
                {
                    dataIndex: 'totalcost',
                    title: i18n.global.t('meos_control_web.total_space_cooling_cost'),
                    resizable: true
                },
                {
                    dataIndex: 'totalaircommandcost',
                    title: i18n.global.t('meos_control_web.cooling_cost_with_air_conditioning_demand'),
                    resizable: true
                },
                {
                    dataIndex: 'costproportion',
                    title: i18n.global.t('meos_control_web.cooling_cost_ratio_at_time_t'),
                    resizable: true
                }
            ]
        },
        {
            dataIndex: 'col3',
            title: i18n.global.t('meos_control_web.cooling_cost_ratio_next_15_min'),
            resizable: true,
            children: [
                {
                    dataIndex: 'totalcost',
                    title: i18n.global.t('meos_control_web.total_space_cooling_cost'),
                    resizable: true
                },
                {
                    dataIndex: 'totalaircommandcost',
                    title: i18n.global.t('meos_control_web.cooling_cost_with_air_conditioning_demand'),
                    resizable: true
                },
                {
                    dataIndex: 'costproportion',
                    title: i18n.global.t('meos_control_web.cooling_cost_ratio_next_15_min'),
                    resizable: true
                }
            ]
        },
        {
            dataIndex: 'col4',
            title: i18n.global.t('meos_control_web.calculation_output'),
            resizable: true,
            children: [
                {
                    dataIndex: 'ifcostjump',
                    title: i18n.global.t('meos_control_web.trigger_algorithm_calc'),
                    resizable: true
                },
                {
                    dataIndex: 'outputchillnum',
                    title: i18n.global.t('meos_control_web.algorithm_return_result'),
                    resizable: true
                }
            ]
        }
    ],
    [TEMPLATE_TYPE.CHILLER_NUM_SET_INTERMISSION]: [
        {
            dataIndex: 'col1',
            title: i18n.global.t('meos_control_web.system_operation_status'),
            resizable: true,
            children: [
                {
                    dataIndex: 'time',
                    title: i18n.global.t('meos_control_web.time'),
                    resizable: true
                },
                {
                    dataIndex: 'sysSwitchSet',
                    title: i18n.global.t('meos_control_web.system_on_off_setting'),
                    resizable: true
                },
                {
                    dataIndex: 'chillerOnSetintermissionabnormal',
                    title: i18n.global.t('meos_control_web.current_chillers_running'),
                    resizable: true
                },
                {
                    dataIndex: 'spaceR1abnormal',
                    title: i18n.global.t('meos_control_web.space_overheating_anomaly'),
                    resizable: true
                }
            ]
        },
        {
            dataIndex: 'col2',
            title: i18n.global.t('meos_control_web.pump_group_status'),
            resizable: true,
            children: [
                {
                    dataIndex: 'chillerOnSetintermissionabnormal', //泵组名称(chillerOnSetintermissionabnormal,chillpumpgrouplocalname)
                    title: i18n.global.t('meos_control_web.pump_group_name'),
                    resizable: true
                }
            ]
        },
        {
            dataIndex: 'col3',
            title: i18n.global.t('meos_control_web.calculation_result_output'),
            resizable: true,
            children: [
                {
                    dataIndex: 'intermissionif',
                    title: i18n.global.t('meos_control_web.add_chiller_or_not'),
                    resizable: true
                },
                {
                    dataIndex: 'confirmintermission',
                    title: i18n.global.t('meos_control_web.trigger_add_chiller'),
                    resizable: true
                },
                {
                    dataIndex: 'outputchillnum',
                    title: i18n.global.t('meos_control_web.chiller_unit_count'),
                    resizable: true
                }
            ]
        }
    ]
};
