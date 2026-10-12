import i18n from '@/localization';
export default () => {
    const panelSelectData = ref([
        {
            name: i18n.global.t('meos_control_web.pipeline_visibility'),
            id: 'pipeShowSwitchKey',
            checked: 'uncheck',
            enable: false,
            disableTip: i18n.global.t('meos_control_web.no_pipeline'),
            children: [
                {
                    name: i18n.global.t('meos_control_web.cooling_water_supply_pipe_cc'),
                    id: i18n.global.t('meos_control_web.cooling_water_supply_pipe_cc'),
                    checked: 'checked',
                    color: '#ff0000'
                },
                {
                    name: i18n.global.t('meos_control_web.cooling_water_supply_pipe'),
                    id: i18n.global.t('meos_control_web.cooling_water_supply_pipe_aa'),
                    checked: 'uncheck',
                    color: '#00ff00'
                }
            ]
        },
        {
            name: i18n.global.t('meos_control_web.space_info_card_visibility'),
            id: 'spaceCardShowSwitchKey',
            checked: 'checked',
            enable: true
        },
        {
            name: i18n.global.t('meos_control_web.aux_name_visibility'),
            id: 'postionObjShowSwitchKey',
            checked: 'checked',
            enable: true
        }
    ]);

    // 筛选面板数据
    const panelSelectCheckedIds = ref([]);

    const panelSelectChange = ids => {
        panelSelectCheckedIds.value = ids;
    };

    // 空间信息卡片显隐
    const spaceCardShowOption = computed(() => {
        return panelSelectCheckedIds.value.includes('spaceCardShowSwitchKey');
    });

    // 辅助名称显隐
    const showPostionSpaceOption = computed(() => {
        return panelSelectCheckedIds.value.includes('postionObjShowSwitchKey');
    });

    return {
        panelSelectData,
        panelSelectCheckedIds,
        panelSelectChange,
        spaceCardShowOption,
        showPostionSpaceOption
    };
};
