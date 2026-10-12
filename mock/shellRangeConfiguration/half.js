const HALF_SECTION_CONFIG_DATA = {
    code: '00000',
    result: 'success',
    data: [
        {
            groups: [
                {
                    group: 'group_hsec_display',
                    tab: '半剖图配置',
                    items: [
                        {
                            code: 'graph_hsec_model',
                            scene: 'hsec',
                            group: 'group_hsec_display',
                            tab: '半剖图配置',
                            name: '半剖图入口配置',
                            unit: '/',
                            defaultValues: '1',
                            step: -1,
                            hint: '',
                            desc: '',
                            editAuth: true,
                            valSource: '{"1":"点击设备直接打开半剖图","2":"从设备详情打开半剖图"}',
                            shellConfigValue: '1'
                        }
                    ]
                },
                {
                    group: 'group_hsec_show',
                    tab: '半剖图配置',
                    items: [
                        {
                            code: 'graph_hsec_acatah',
                            scene: 'hsec',
                            group: 'group_hsec_show',
                            tab: '半剖图配置',
                            name: '空调机组显隐配置',
                            unit: '/',
                            defaultValues: 'show',
                            step: -1,
                            hint: '',
                            desc: '',
                            editAuth: true,
                            valSource: '{"classCode":"acatah"}',
                            shellConfigValue: 'show'
                        },
                        {
                            code: 'graph_hsec_acatah_list',
                            scene: 'hsec',
                            group: 'group_hsec_show',
                            tab: '半剖图配置',
                            name: '添加需隐藏设备',
                            unit: '/',
                            defaultValues: '',
                            step: -1,
                            hint: '',
                            desc: '',
                            editAuth: true,
                            valSource: '{"classCode":"acatah"}',
                            shellConfigValue: ''
                        },
                        {
                            code: 'graph_hsec_acatfu',
                            scene: 'hsec',
                            group: 'group_hsec_show',
                            tab: '半剖图配置',
                            name: '新风机组显隐配置',
                            unit: '/',
                            defaultValues: 'show',
                            step: -1,
                            hint: '',
                            desc: '',
                            editAuth: true,
                            valSource: '{"classCode":"acatfu"}',
                            shellConfigValue: 'show'
                        },
                        {
                            code: 'graph_hsec_acatfu_list',
                            scene: 'hsec',
                            group: 'group_hsec_show',
                            tab: '半剖图配置',
                            name: '添加需隐藏设备',
                            unit: '/',
                            defaultValues: '',
                            step: -1,
                            hint: '',
                            desc: '',
                            editAuth: true,
                            valSource: '{"classCode":"acatfu"}',
                            shellConfigValue: ''
                        }
                    ]
                }
            ],
            desc: '半剖图配置；修改后即时生效'
        }
    ],
    message: null,
    timestamp: '1765958815990'
};

return HALF_SECTION_CONFIG_DATA;
