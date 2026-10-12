<template>
    <div class="container-box">
        <m-tabs v-model="algParams.firstTabOn" :data="algParams.firstTabData" size="large" style="margin-bottom: 18px; margin-right: 18px" @change="tabsTitleChange" />
        <!-- 算法条件输入 -->
        <template v-if="algParams.firstTabOn === '1'">
            <xshellFormList
                ref="alg_project"
                :label-width="'360px'"
                :title="i18n.global.t('meos_control_web.project')"
                :xshell-params="algParams"
                :data-list="algParams.projectData"
                @form-item-modify="checkFormItemModify"
            />
            <objectTemplate
                v-model="algParams.second_tab_alg_cooling_on"
                :title="i18n.global.t('meos_control_web.central_cooling_system')"
                type="ACCC"
                name="alg_cooling"
                :tab-data="algParams.second_tab_alg_cooling"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_cooling"
                    type="ACCC"
                    :label-width="'360px'"
                    :xshell-params="algParams"
                    :data-list="algParams.coolingData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_cold_hot_on"
                :title="i18n.global.t('meos_control_web.central_heat_cool_source_system')"
                type="ACCI"
                name="alg_cold_hot"
                :tab-data="algParams.second_tab_alg_cold_hot"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="alg_cold_hot" :label-width="'360px'" :xshell-params="algParams" :data-list="algParams.coldHotData" @form-item-modify="checkFormItemModify" />
            </objectTemplate>
        </template>
        <!-- 空间品质判断及需求跃变计算的条件输入 -->
        <template v-if="algParams.firstTabOn === '2'">
            <xshellFormList
                ref="alg_demand_error"
                :label-width="'270px'"
                :title="i18n.global.t('meos_control_web.space_quality_anomaly_judgment_logic_condition_input')"
                :xshell-params="algParams"
                :data-list="algParams.demandErrorData"
                @form-item-modify="checkFormItemModify"
            />
            <xshellFormList
                ref="alg_jump"
                :label-width="'270px'"
                :title="i18n.global.t('meos_control_web.step_change_and_unit_add_remove_logic_condition_input')"
                :xshell-params="algParams"
                :data-list="algParams.jumpData"
                @form-item-modify="checkFormItemModify"
            />
            <xshellFormList
                ref="alg_tdb"
                :label-width="'270px'"
                :title="i18n.global.t('meos_control_web.space_temperature_setting_calculation_method_configuration')"
                :xshell-params="algParams"
                :data-list="algParams.spaceTdbSettingData"
                @form-item-modify="checkFormItemModify"
            />
            <xshellFormList
                ref="alg_advance_switch_duration"
                :label-width="'270px'"
                :title="'提前开关时长'"
                :xshell-params="algParams"
                :data-list="algParams.advanceSwitchDurationData"
                @form-item-modify="checkFormItemModify"
            />
        </template>
        <!-- 冷站自动需求计算的条件输入 -->
        <template v-if="algParams.firstTabOn === '3'">
            <objectTemplate
                v-model="algParams.second_tab_alg_add_subtract_on"
                :title="i18n.global.t('meos_control_web.add_remove_unit_logic_input')"
                :sub-title="i18n.global.t('meos_control_web.for_single_cool_station')"
                type="ACCC"
                name="alg_add_subtract"
                :tab-data="algParams.second_tab_alg_add_subtract"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_add_subtract"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.addSubtractData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_cold_out_temp_on"
                :title="i18n.global.t('meos_control_web.chiller_outlet_temp_setpoint_logic_input')"
                :sub-title="i18n.global.t('meos_control_web.for_single_cool_station')"
                type="ACCC"
                name="alg_cold_out_temp"
                :tab-data="algParams.second_tab_alg_cold_out_temp"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_cold_out_temp"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.coldOutTempData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_temp_press_diff_on"
                :title="i18n.global.t('meos_control_web.temp_press_diff_logic_input')"
                :sub-title="i18n.global.t('meos_control_web.for_single_cool_station')"
                type="ACCC"
                name="alg_temp_press_diff"
                :tab-data="algParams.second_tab_alg_temp_press_diff"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_temp_press_diff"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.tempPressDiffData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_diff_on"
                :title="i18n.global.t('meos_control_web.pump_group_supply_return_temp_press_logic_input')"
                type="GROUP"
                name="alg_diff"
                :tab-data="algParams.second_tab_alg_diff"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="alg_diff" :label-width="'330px'" :xshell-params="algParams" :data-list="algParams.diffData" @form-item-modify="checkFormItemModify" />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_accc_freq_on"
                :title="i18n.global.t('meos_control_web.control_group_frequency_constraint')"
                type="CONTROL_GROUP"
                name="alg_accc_freq"
                :tab-data="algParams.second_tab_alg_accc_freq"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="alg_accc_freq" :label-width="'330px'" :xshell-params="algParams" :data-list="algParams.acccFreqData" @form-item-modify="checkFormItemModify" />
            </objectTemplate>
            <xshellFormList
                ref="alg_out_wet_ball_temp_accc"
                :title="i18n.global.t('meos_control_web.outdoor_wet_bulb_temperature_configuration')"
                :label-width="'270px'"
                :xshell-params="algParams"
                :data-list="algParams.outWetBallTempAcccData"
                @form-item-modify="checkFormItemModify"
            />
        </template>
        <!-- 冷热站自动需求计算的条件输入 -->
        <template v-if="algParams.firstTabOn === '4'">
            <objectTemplate
                v-model="algParams.second_tab_alg_add_subtract_cold_on"
                :title="i18n.global.t('meos_control_web.add_remove_unit_logic_input_cooling')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_cool_station')"
                type="ACCI"
                name="alg_add_subtract_cold"
                :tab-data="algParams.second_tab_alg_add_subtract_cold"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_add_subtract_cold"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.addSubtractColdData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_add_subtract_hot_on"
                :title="i18n.global.t('meos_control_web.add_remove_unit_logic_input_heating')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_cool_station')"
                type="ACCI"
                name="alg_add_subtract_hot"
                :tab-data="algParams.second_tab_alg_add_subtract_hot"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_add_subtract_hot"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.addSubtractHotData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_cold_out_temp_cold_on"
                :title="i18n.global.t('meos_control_web.chiller_outlet_temp_setpoint_logic_cooling')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_cool_station')"
                type="ACCI"
                name="alg_cold_out_temp_cold"
                :tab-data="algParams.second_tab_alg_cold_out_temp_cold"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_cold_out_temp_cold"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.coldOutTempColdData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_cold_out_temp_hot_on"
                :title="i18n.global.t('meos_control_web.chiller_outlet_temp_setpoint_logic_heating')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_cool_station')"
                type="ACCI"
                name="alg_cold_out_temp_hot"
                :tab-data="algParams.second_tab_alg_cold_out_temp_hot"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_cold_out_temp_hot"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.coldOutTempTempData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <!-- 单个冷热站 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_coldhot_temp_press_diff_cool_on"
                :title="i18n.global.t('meos_control_web.temp_press_diff_logic_input_cooling')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_cool_station')"
                type="ACCI"
                name="alg_coldhot_temp_press_diff_cool"
                :tab-data="algParams.second_tab_alg_coldhot_temp_press_diff_cool"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_coldhot_temp_press_diff_cool"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.coldhotTempPressDiffCoolData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_coldhot_temp_press_diff_hot_on"
                :title="i18n.global.t('meos_control_web.temp_press_diff_logic_input_heating')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_cool_station')"
                type="ACCI"
                name="alg_coldhot_temp_press_diff_hot"
                :tab-data="algParams.second_tab_alg_coldhot_temp_press_diff_hot"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_coldhot_temp_press_diff_hot"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.coldhotTempPressDiffHotData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <!-- 泵组 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_diff_cold_on"
                :title="i18n.global.t('meos_control_web.pump_group_delta_t_p_cooling_input')"
                :sub-title="i18n.global.t('meos_control_web.for_single_pump_group')"
                type="GROUP"
                name="alg_diff_cold"
                :tab-data="algParams.second_tab_alg_diff_cold"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="alg_diff_cold" :label-width="'330px'" :xshell-params="algParams" :data-list="algParams.diffColdData" @form-item-modify="checkFormItemModify" />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_diff_hot_on"
                :title="i18n.global.t('meos_control_web.pump_group_delta_t_p_heating_input')"
                :sub-title="i18n.global.t('meos_control_web.for_single_pump_group')"
                type="GROUP"
                name="alg_diff_hot"
                :tab-data="algParams.second_tab_alg_diff_hot"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="alg_diff_hot" :label-width="'330px'" :xshell-params="algParams" :data-list="algParams.diffHotData" @form-item-modify="checkFormItemModify" />
            </objectTemplate>
        </template>
        <template v-if="algParams.firstTabOn === '5'">
            <objectTemplate
                v-model="algParams.second_tab_alg_hot_temp_system_on"
                :title="i18n.global.t('meos_control_web.outlet_water_temp_set_logic')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_station')"
                type="ACCH"
                name="alg_hot_temp_system"
                :tab-data="algParams.second_tab_alg_hot_temp_system"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_hot_temp_system"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.hotTempSystemData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_hot_deta_temp_press_system_on"
                :title="i18n.global.t('meos_control_web.temp_diff_pressure_diff_logic_condition')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_station')"
                type="ACCH"
                name="alg_hot_deta_temp_press_system"
                :tab-data="algParams.second_tab_alg_hot_deta_temp_press_system"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_hot_deta_temp_press_system"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.hotDetaTempPressSystemData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_hot_deta_temp_press_pump_on"
                :title="i18n.global.t('meos_control_web.temp_diff_pressure_diff_logic_condition')"
                :sub-title="i18n.global.t('meos_control_web.for_single_pump_group')"
                type="GROUP"
                name="alg_hot_deta_temp_press_pump"
                :tab-data="algParams.second_tab_alg_hot_deta_temp_press_pump"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_hot_deta_temp_press_pump"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.hotDetaTempPressPumpData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
        </template>
        <!-- 空调冷源自动需求计算的条件输入 -->
        <template v-if="algParams.firstTabOn === '6'">
            <!-- group_alg_cooling_condition 供冷工况 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_supply_cool_tab_on"
                :title="i18n.global.t('meos_control_web.cooling_operating_mode')"
                name="alg_supply_cool"
                :tab-data="algParams.second_tab_alg_supply_cool_tabs_list"
                :always-show="true"
                :is-join-title="true"
                type="ACAC"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_supply_cool"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.supplyCoolData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <!-- group_alg_cool_store_condition 蓄冷工况 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_storage_cool_tab_on"
                :title="i18n.global.t('meos_control_web.cold_storage_mode')"
                name="alg_storage_cool"
                :tab-data="algParams.second_tab_alg_storage_cool_tabs_list"
                :always-show="false"
                :is-join-title="true"
                type="ACAC"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_storage_cool"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.storageCoolData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <!-- group_alg_cool_release_condition 放冷工况 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_release_cool_tab_on"
                :title="i18n.global.t('meos_control_web.cold_discharge_mode')"
                name="alg_release_cool"
                :tab-data="algParams.second_tab_alg_release_cool_tabs_list"
                :always-show="false"
                :is-join-title="true"
                type="ACAC"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_release_cool"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.releaseCoolData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <!-- group_alg_cool_free_condition 免费冷工况 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_cool_free_tab_on"
                :title="i18n.global.t('meos_control_web.free_cooling_mode')"
                name="alg_cool_free"
                :tab-data="algParams.second_tab_alg_cool_free_tabs_list"
                :always-show="true"
                :is-join-title="true"
                type="ACAC"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="alg_cool_free" :label-width="'330px'" :xshell-params="algParams" :data-list="algParams.freeCoolData" @form-item-modify="checkFormItemModify" />
            </objectTemplate>

            <!-- group_alg_common_condition 通用工况 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_common_condition_tab_on"
                :title="i18n.global.t('meos_control_web.general_operating_condition')"
                name="alg_common_condition"
                :tab-data="algParams.second_tab_alg_common_condition_tabs_list"
                :always-show="true"
                :is-join-title="true"
                type="ACAC"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_common_condition"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.commonConditionData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <!-- group_alg_acac_cold_out_temp 空调-冷机出水温度设定逻辑条件输入（针对单个冷站） -->
            <objectTemplate
                v-model="algParams.second_tab_alg_cold_out_tab_on"
                :title="i18n.global.t('meos_control_web.chiller_outlet_temp_setpoint_logic_single_station')"
                name="alg_cold_out"
                :tab-data="algParams.second_tab_alg_cold_out_tabs_list"
                :always-show="true"
                :is-join-title="true"
                type="ACAC"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList ref="alg_cold_out" :label-width="'330px'" :xshell-params="algParams" :data-list="algParams.coldOutData" @form-item-modify="checkFormItemModify" />
            </objectTemplate>

            <!-- group_alg_acac_temp_press_diff 空调-供回水温差/压差逻辑条件输入 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_temp_press_tab_on"
                :title="i18n.global.t('meos_control_web.temp_press_diff_logic_input')"
                name="alg_temp_press"
                :tab-data="algParams.second_tab_alg_temp_press_tabs_list"
                :always-show="true"
                :is-join-title="true"
                type="ACAC"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_temp_press"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.tempPressData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <!-- group_alg_acac_diff 泵组供回水温差/压差逻辑条件输入 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_pump_temp_press_tab_on"
                :title="i18n.global.t('meos_control_web.pump_group_delta_t_p_input')"
                name="alg_pump_temp_press"
                :tab-data="algParams.second_tab_alg_pump_temp_press_tabs_list"
                :always-show="true"
                :is-join-title="true"
                type="GROUP"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_pump_temp_press"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.pumpTempPressData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <!-- group_alg_acac_freq 控制组频率约束 -->
            <objectTemplate
                v-model="algParams.second_tab_alg_control_group_freq_tab_on"
                :title="i18n.global.t('meos_control_web.control_group_frequency_constraint')"
                name="alg_control_group_freq"
                :tab-data="algParams.second_tab_alg_control_group_freq_tabs_list"
                :always-show="true"
                :is-join-title="true"
                type="CONTROL_GROUP"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="alg_control_group_freq"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.controlGroupFreqData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <!-- group_alg_out_wet_ball_temp 室外湿球温度配置 -->
            <xshellFormList
                ref="alg_out_wet_ball_temp"
                :title="i18n.global.t('meos_control_web.outdoor_wet_bulb_temperature_configuration')"
                :label-width="'270px'"
                :xshell-params="algParams"
                :data-list="algParams.outWetBallTempData"
                @form-item-modify="checkFormItemModify"
            />
        </template>
        <!-- 空调热源自动需求计算条件输入 -->
        <template v-if="algParams.firstTabOn === '7'">
            <!-- 出水温度设定逻辑条件 -->

            <objectTemplate
                v-model="algParams.second_tab_acah_hot_set_tab_on"
                :title="i18n.global.t('meos_control_web.heating_switch_setting')"
                sub-title=""
                type="ACAH"
                name="center_ac_hot_switch_setting"
                :tab-data="algParams.second_tab_acah_hot_set_tab_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="center_ac_hot_switch_setting"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acahHotSetData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.second_tab_alg_acah_add_tab_on"
                :title="i18n.global.t('meos_control_web.add_machine_logic')"
                sub-title=""
                type="ACAH"
                name="center_acah_add"
                :tab-data="algParams.second_tab_alg_acah_add_tab_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="center_acah_add"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acahAddData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.second_tab_alg_acah_add_tab_on"
                :title="i18n.global.t('meos_control_web.subtract_machine_logic')"
                sub-title=""
                type="ACAH"
                name="center_acah_sub"
                :tab-data="algParams.second_tab_alg_acah_sub_tab_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="center_acah_sub"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acahSubData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.second_tab_alg_acah_secu_calc_tab_on"
                :title="i18n.global.t('meos_control_web.security_status_calculation')"
                sub-title=""
                type="ACAH"
                name="center_acah_secu_calc"
                :tab-data="algParams.second_tab_alg_acah_secu_calc_tab_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="center_acah_secu_calc"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acahSecuCalcData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.secondTabAlgCenterAirHotTempSystemOn"
                :title="i18n.global.t('meos_control_web.outlet_water_temp_set_logic')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_station')"
                type="ACAH"
                name="center_ac_hot_water_temp"
                :tab-data="algParams.secondTabAlgCenterAirHotTempSystem"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="center_ac_hot_water_temp"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.centerAirHotTempSystemData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.secondTabAlgCenterAirHotTempPressureSystemOn"
                :title="i18n.global.t('meos_control_web.temp_diff_pressure_diff_logic_condition')"
                :sub-title="i18n.global.t('meos_control_web.for_single_heat_station')"
                type="ACCH"
                name="center_ac_hot_temp_press_diff"
                :tab-data="algParams.secondTabAlgCenterAirHotTempPressureSystem"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="center_ac_hot_temp_press_diff"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.centerAirHotTempPressureSystemData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
            <objectTemplate
                v-model="algParams.secondTabAlgCenterAirHotTempPressurePumpSystemOn"
                :title="i18n.global.t('meos_control_web.temp_diff_pressure_diff_logic_condition')"
                :sub-title="i18n.global.t('meos_control_web.for_single_pump_group')"
                type="GROUP"
                name="center_ac_hot_deta_temp_press_pump"
                :tab-data="algParams.secondTabAlgCenterAirHotTempPressurePumpSystem"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="center_ac_hot_deta_temp_press_pump"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.centerAirHotTempPressurePumpSystemData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
        </template>
        <!-- 空调冷热源自动需求计算条件输入（ACAI） -->
        <template v-if="algParams.firstTabOn === '8'">
            <objectTemplate
                v-model="algParams.acai_cooling_unit_count_tab_on"
                :title="i18n.global.t('meos_control_web.cool_count_calc_mode')"
                sub-title=""
                type="ACAI"
                name="acai_cooling_unit_count"
                :is-join-title="true"
                :tab-data="algParams.acai_cooling_unit_count_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_cooling_unit_count"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiCoolingUnitCountData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_cooling_supply_temp_tab_on"
                :title="i18n.global.t('meos_control_web.cooling_supply_temp_mode')"
                type="ACAI"
                name="acai_cooling_supply_temp"
                :is-join-title="true"
                :tab-data="algParams.acai_cooling_supply_temp_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_cooling_supply_temp"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiCoolingSupplyTempData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_cooling_safe_tab_on"
                :title="i18n.global.t('meos_control_web.safe_operation_supply_cool_mode')"
                sub-title=""
                type="ACAI"
                name="acai_cooling_safe"
                :is-join-title="true"
                :tab-data="algParams.acai_cooling_safe_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_cooling_safe"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiCoolingSafeData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_cooling_temp_press_diff_tab_on"
                :title="i18n.global.t('meos_control_web.cooling_temp_press_diff_condition_input_mode')"
                type="ACAI"
                name="acai_cooling_temp_press_diff"
                :is-join-title="true"
                :tab-data="algParams.acai_cooling_temp_press_diff_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_cooling_temp_press_diff"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiCoolingTempPressDiffData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_cooling_pump_diff_tab_on"
                :title="i18n.global.t('meos_control_web.cooling_pump_temp_press_diff_condition_input_mode')"
                type="GROUP"
                name="acai_cooling_pump_diff"
                :is-join-title="true"
                :tab-data="algParams.acai_cooling_pump_diff_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_cooling_pump_diff"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiCoolingPumpDiffData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_heating_switch_tab_on"
                :title="i18n.global.t('meos_control_web.heating_switch_setting_mode')"
                sub-title=""
                type="ACAI"
                name="acai_heating_switch"
                :is-join-title="true"
                :tab-data="algParams.acai_heating_switch_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_heating_switch"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiHeatingSwitchData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_heating_unit_count_tab_on"
                :title="i18n.global.t('meos_control_web.hot_machine_count_calc_mode')"
                sub-title=""
                type="ACAI"
                name="acai_heating_unit_count"
                :is-join-title="true"
                :tab-data="algParams.acai_heating_unit_count_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_heating_unit_count"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiHeatingUnitCountData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_heating_safe_tab_on"
                :title="i18n.global.t('meos_control_web.safe_operation_heating_mode')"
                sub-title=""
                type="ACAI"
                name="acai_heating_safe"
                :is-join-title="true"
                :tab-data="algParams.acai_heating_safe_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_heating_safe"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiHeatingSafeData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_heating_supply_temp_tab_on"
                :title="i18n.global.t('meos_control_web.heating_supply_temp_mode')"
                type="ACAI"
                name="acai_heating_supply_temp"
                :is-join-title="true"
                :tab-data="algParams.acai_heating_supply_temp_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_heating_supply_temp"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiHeatingSupplyTempData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_heating_temp_press_diff_tab_on"
                :title="i18n.global.t('meos_control_web.heating_temp_press_diff_condition_input_mode')"
                type="ACAI"
                name="acai_heating_temp_press_diff"
                :is-join-title="true"
                :tab-data="algParams.acai_heating_temp_press_diff_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_heating_temp_press_diff"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiHeatingTempPressDiffData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_heating_pump_diff_tab_on"
                :title="i18n.global.t('meos_control_web.heating_pump_temp_press_diff_condition_input_mode')"
                type="GROUP"
                name="acai_heating_pump_diff"
                :is-join-title="true"
                :tab-data="algParams.acai_heating_pump_diff_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_heating_pump_diff"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiHeatingPumpDiffData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>

            <objectTemplate
                v-model="algParams.acai_common_condition_tab_on"
                :title="i18n.global.t('meos_control_web.common_conditions')"
                sub-title=""
                type="ACAI"
                name="acai_common_condition"
                :is-join-title="true"
                :tab-data="algParams.acai_common_condition_tabs_list"
                @second-tab-change="secondTabChange"
            >
                <xshellFormList
                    ref="acai_common_condition"
                    :label-width="'330px'"
                    :xshell-params="algParams"
                    :data-list="algParams.acaiCommonConditionData"
                    @form-item-modify="checkFormItemModify"
                />
            </objectTemplate>
        </template>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
import { computed, inject, nextTick, onMounted, reactive, ref, watch } from 'vue';
import xshellFormList from './common/xshellFormList.vue';
import emitter from '@/utils/bus';
import i18n from '@/localization';
import { shellConfigQuery } from '@/apis/xshellConfiguration';
import { $Message, MLoading } from 'meri-plus';
import { formatterValue, updateshellConfigSave, checkErrorStatus } from '../utils/tools';
import objectTemplate from './common/objectTemplate.vue';
import { isEqual } from 'lodash';
import { checkGlobalModify } from '../utils/index';
import { ALG_NO_DEFAULT_VALUE } from '../constants/constant';
import { fetchAbortControllerInjectKey, loadingInstanceInjectKey } from '../hooks/useGlobalData';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';
import {
    fillAcacSectionData,
    fillAcaiSectionData,
    formatSecondTabData,
    objectTabs,
    resetDynamicSectionData,
    COMMON_NEED_OBJECT_ID_GROUPS
} from './composables/useAlgorithmLogicSections';

defineProps(['modelValue']);
const emit = defineEmits(['defaultRestoreAll', 'update:modelValue']);

const fetchAbortController: any = inject(fetchAbortControllerInjectKey);
const loadingInstance: any = inject(loadingInstanceInjectKey);

const algParams = reactive({
    isErrorRandom: Math.random(),
    firstTabData: [
        {
            id: '1',
            name: `${i18n.global.t('meos_control_web.algorithm_condition_input')}`
        },
        {
            id: '2',
            name: `${i18n.global.t('meos_control_web.space_quality_judgment_and_demand_jump_calc_condition_input')}`
        },
        {
            id: '3',
            name: `${i18n.global.t('meos_control_web.cooling_station_auto_demand_calc_condition_input')}`
        },
        {
            id: '4',
            name: `${i18n.global.t('meos_control_web.heating_cooling_station_auto_demand_calc_condition_input')}`
        },
        {
            id: '5',
            name: `${i18n.global.t('meos_control_web.heat_station_auto_demand_input')}`
        },
        {
            id: '6',
            name: `${i18n.global.t('meos_control_web.hvac_cooling_source_auto_demand_calc_condition_input')}`
        },
        {
            id: '7',
            name: `${i18n.global.t('meos_control_web.hvac_hot_source_auto_demand_calc_condition_input')}`
        },
        {
            id: '8',
            name: `${i18n.global.t('meos_control_web.hvac_heat_cool_source_auto_demand_calc_condition_input')}`
        }
    ],

    firstTabOn: '1',
    isErrorData: [
        { id: 'alg_project', errorStatus: true },
        { id: 'alg_demand_error', errorStatus: true },
        { id: 'alg_jump', errorStatus: true },
        { id: 'alg_advance_switch_duration', errorStatus: true }
    ],
    tabItem: [],
    allItem: [] as any,
    paramsArr: [],
    items: [] as any,
    defaultItem: [],
    noDefaultData: [] as any, // 需要恢复默认值的数组

    projectData: [],
    coolingData: [] as any,
    coolingErrorData: [],
    coldHotData: [] as any,
    coldHotErrorData: [],
    second_tab_alg_cooling_Data: [] as any,
    second_tab_alg_cooling: [] as any,
    second_tab_alg_cooling_on: '',
    second_tab_alg_cold_hot_Data: [] as any,
    second_tab_alg_cold_hot: [] as any,
    second_tab_alg_cold_hot_on: '',

    demandErrorData: [],
    jumpData: [],
    advanceSwitchDurationData: [],
    // 空间温度各项设定值的计算方式配置
    spaceTdbSettingData: [],
    spaceTdbSettingErrorData: [] as any,

    addSubtractData: [],
    addSubtractErrorData: [],
    second_tab_alg_add_subtract_Data: [] as any,
    second_tab_alg_add_subtract: [] as any,
    second_tab_alg_add_subtract_on: '',
    coldOutTempData: [],
    tempPressDiffData: [],
    second_tab_alg_cold_out_temp_Data: [] as any,
    second_tab_alg_temp_press_diff_Data: [] as any,
    second_tab_alg_cold_out_temp: [] as any,
    second_tab_alg_temp_press_diff: [] as any,
    second_tab_alg_cold_out_temp_on: '',
    second_tab_alg_temp_press_diff_on: '',
    diffData: [],
    second_tab_alg_diff_Data: [] as any,
    second_tab_alg_diff: [] as any,
    second_tab_alg_diff_on: '',
    second_tab_alg_accc_freq_Data: [] as any,
    second_tab_alg_accc_freq: [] as any,
    second_tab_alg_accc_freq_on: '',
    acccFreqData: [] as any,
    acccFreqErrorData: [] as any,
    outWetBallTempAcccData: [] as any,
    outWetBallTempAcccErrorData: [] as any,
    coldOutTempErrorData: [],
    tempPressDiffErrorData: [],
    diffErrorData: [],

    addSubtractColdData: [],
    second_tab_alg_add_subtract_cold_Data: [] as any,
    second_tab_alg_add_subtract_cold: [] as any,
    second_tab_alg_add_subtract_cold_on: '',
    addSubtractHotData: [],
    second_tab_alg_add_subtract_hot_Data: [] as any,
    second_tab_alg_add_subtract_hot: [] as any,
    second_tab_alg_add_subtract_hot_on: '',
    coldOutTempColdData: [],
    second_tab_alg_cold_out_temp_cold_Data: [] as any,
    second_tab_alg_cold_out_temp_cold: [] as any,
    second_tab_alg_cold_out_temp_cold_on: '',
    coldOutTempTempData: [],
    second_tab_alg_cold_out_temp_hot_Data: [] as any,
    second_tab_alg_cold_out_temp_hot: [] as any,
    second_tab_alg_cold_out_temp_hot_on: '',
    diffColdData: [],
    second_tab_alg_diff_cold_Data: [] as any,
    second_tab_alg_diff_cold: [] as any,
    second_tab_alg_diff_cold_on: '',
    diffHotData: [],
    second_tab_alg_diff_hot_Data: [] as any,
    second_tab_alg_diff_hot: [] as any,
    second_tab_alg_diff_hot_on: '',
    addSubtractColdErrorData: [],
    addSubtractHotErrorData: [],
    coldOutTempColdErrorData: [],
    coldOutTempTempErrorData: [],
    diffColdErrorData: [],
    diffHotErrorData: [],
    // group_alg_coldhot_temp_press_diff_cool  供回水温差/压差逻辑条件输入-供冷模式（针对单个冷热站）
    second_tab_alg_coldhot_temp_press_diff_cool_Data: [] as any,
    second_tab_alg_coldhot_temp_press_diff_cool: [] as any,
    second_tab_alg_coldhot_temp_press_diff_cool_on: '',
    coldhotTempPressDiffCoolData: [],
    coldhotTempPressDiffCoolErrorData: [],
    // group_alg_coldhot_temp_press_diff_hot 供回水温差/压差逻辑条件输入-供热模式（针对单个冷热站）
    second_tab_alg_coldhot_temp_press_diff_hot_Data: [] as any,
    second_tab_alg_coldhot_temp_press_diff_hot: [] as any,
    second_tab_alg_coldhot_temp_press_diff_hot_on: '',
    coldhotTempPressDiffHotData: [],
    coldhotTempPressDiffHotErrorData: [],
    // group_alg_hot_temp_system 出水温度设定逻辑条件（针对单个热站）
    second_tab_alg_hot_temp_system_Data: [] as any,
    second_tab_alg_hot_temp_system: [] as any,
    second_tab_alg_hot_temp_system_on: '',
    hotTempSystemData: [],
    hotTempSystemErrorData: [],
    // group_alg_hot_deta_temp_press_system 温差/压差设定逻辑条件（针对单个热站）
    second_tab_alg_hot_deta_temp_press_system_Data: [] as any,
    second_tab_alg_hot_deta_temp_press_system: [] as any,
    second_tab_alg_hot_deta_temp_press_system_on: '',
    hotDetaTempPressSystemData: [],
    hotDetaTempPressSystemErrorData: [],
    // group_alg_hot_deta_temp_press_pump 温差/压差设定逻辑条件（针对单个泵组）
    second_tab_alg_hot_deta_temp_press_pump_Data: [] as any,
    second_tab_alg_hot_deta_temp_press_pump: [] as any,
    second_tab_alg_hot_deta_temp_press_pump_on: '',
    hotDetaTempPressPumpData: [],
    hotDetaTempPressPumpErrorData: [],

    // 供冷工况
    second_tab_alg_supply_cool_tabs_list: [] as any, // tab 选项列表
    second_tab_alg_supply_cool_tab_on: '', // tab 选中项
    second_tab_alg_supply_cool_tab_Data: [] as any, //  tab 所有项数据
    supplyCoolData: [] as any, // tab 所有回显的表单数据
    supplyCoolErrorData: [] as any, // tab 所有回显的表单错误数据

    // 蓄冷工况
    second_tab_alg_storage_cool_tabs_list: [] as any,
    second_tab_alg_storage_cool_tab_on: '',
    second_tab_alg_storage_cool_tab_Data: [] as any,
    storageCoolData: [] as any,
    storageCoolErrorData: [] as any,

    // 放冷工况
    second_tab_alg_release_cool_tabs_list: [] as any,
    second_tab_alg_release_cool_tab_on: '',
    second_tab_alg_release_cool_tab_Data: [] as any,
    releaseCoolData: [] as any,
    releaseCoolErrorData: [] as any,

    // 免费冷工况
    second_tab_alg_cool_free_tabs_list: [] as any,
    second_tab_alg_cool_free_tab_on: '',
    second_tab_alg_cool_free_tab_Data: [] as any,
    freeCoolData: [] as any,
    freeCoolErrorData: [] as any,

    // 通用工况
    second_tab_alg_common_condition_tabs_list: [] as any,
    second_tab_alg_common_condition_tab_on: '',
    second_tab_alg_common_condition_tab_Data: [] as any,
    commonConditionData: [] as any,
    commonConditionErrorData: [] as any,

    // 空调-冷机出水温度设定逻辑条件输入（针对单个冷站）
    second_tab_alg_cold_out_tabs_list: [] as any,
    second_tab_alg_cold_out_tab_on: '',
    second_tab_alg_cold_out_tab_Data: [] as any,
    coldOutData: [] as any,
    coldOutErrorData: [] as any,

    // 空调-供回水温差/压差逻辑条件输入
    second_tab_alg_temp_press_tabs_list: [] as any,
    second_tab_alg_temp_press_tab_on: '',
    second_tab_alg_temp_press_tab_Data: [] as any,
    tempPressData: [] as any,
    tempPressErrorData: [] as any,

    // 空调-泵组供回水温差/压差逻辑条件输入
    second_tab_alg_pump_temp_press_tabs_list: [] as any,
    second_tab_alg_pump_temp_press_tab_on: '',
    second_tab_alg_pump_temp_press_tab_Data: [] as any,
    pumpTempPressData: [] as any,
    pumpTempPressErrorData: [] as any,

    // 空调-控制组频率约束
    second_tab_alg_control_group_freq_tabs_list: [] as any,
    second_tab_alg_control_group_freq_tab_on: '',
    second_tab_alg_control_group_freq_tab_Data: [] as any,
    controlGroupFreqData: [] as any,
    controlGroupFreqErrorData: [] as any,

    // 空调-室外湿球温度配置
    outWetBallTempData: [] as any,
    outWetBallTempErrorData: [] as any,

    // 空调热源自动需求计算条件输入--供热开关设定
    second_tab_acah_hot_set_data: [] as any,
    second_tab_acah_hot_set_tab_list: [] as any,
    second_tab_acah_hot_set_tab_on: '',
    acahHotSetData: [] as any,
    acahHotSetErrorData: [] as any,
    // 空调热源自动需求计算条件输入--加机逻辑
    second_tab_alg_acah_add_data: [] as any,
    second_tab_alg_acah_add_tab_list: [] as any,
    second_tab_alg_acah_add_tab_on: '',
    acahAddData: [] as any,
    acahAddErrorData: [] as any,
    // 空调热源自动需求计算条件输入--减机逻辑
    second_tab_alg_acah_sub_data: [] as any,
    second_tab_alg_acah_sub_tab_list: [] as any,
    second_tab_alg_acah_sub_tab_on: '',
    acahSubData: [] as any,
    acahSubErrorData: [] as any,
    // 空调热源自动需求计算条件输入--安全状态计算
    second_tab_alg_acah_secu_calc_data: [] as any,
    second_tab_alg_acah_secu_calc_tab_list: [] as any,
    second_tab_alg_acah_secu_calc_tab_on: '',
    acahSecuCalcData: [] as any,
    acahSecuCalcErrorData: [] as any,

    // 空调热源自动需求计算条件输入--出水温度设定逻辑条件（针对单个热站）
    secondTabAlgCenterAirHotTempSystemData: [],
    secondTabAlgCenterAirHotTempSystem: [],
    secondTabAlgCenterAirHotTempSystemOn: '',
    centerAirHotTempSystemData: [],
    centerAirHotTempSystemErrorData: [],

    // 空调热源自动需求计算条件输入--温差/压差设定逻辑条件（针对单个热站）
    secondTabAlgCenterAirHotTempPressureSystemData: [],
    secondTabAlgCenterAirHotTempPressureSystem: [],
    secondTabAlgCenterAirHotTempPressureSystemOn: '',
    centerAirHotTempPressureSystemData: [],
    centerAirHotTempPressureSystemErrorData: [],

    // 空调热源自动需求计算条件输入--温差/压差设定逻辑条件（针对单个泵组）
    secondTabAlgCenterAirHotTempPressurePumpSystemData: [],
    secondTabAlgCenterAirHotTempPressurePumpSystem: [],
    secondTabAlgCenterAirHotTempPressurePumpSystemOn: '',
    centerAirHotTempPressurePumpSystemData: [],
    centerAirHotTempPressurePumpSystemErrorData: [],

    // ACAI：供冷台数计算-供冷模式
    acai_cooling_unit_count_tabs_list: [] as any,
    acai_cooling_unit_count_tab_on: '',
    acai_cooling_unit_count_tab_Data: [] as any,
    acaiCoolingUnitCountData: [] as any,
    acaiCoolingUnitCountErrorData: [] as any,

    // ACAI：供水温度设定-供冷模式
    acai_cooling_supply_temp_tabs_list: [] as any,
    acai_cooling_supply_temp_tab_on: '',
    acai_cooling_supply_temp_tab_Data: [] as any,
    acaiCoolingSupplyTempData: [] as any,
    acaiCoolingSupplyTempErrorData: [] as any,

    // ACAI：安全运行-供冷模式
    acai_cooling_safe_tabs_list: [] as any,
    acai_cooling_safe_tab_on: '',
    acai_cooling_safe_tab_Data: [] as any,
    acaiCoolingSafeData: [] as any,
    acaiCoolingSafeErrorData: [] as any,

    // ACAI：供回水温差/压差逻辑条件输入-供冷模式
    acai_cooling_temp_press_diff_tabs_list: [] as any,
    acai_cooling_temp_press_diff_tab_on: '',
    acai_cooling_temp_press_diff_tab_Data: [] as any,
    acaiCoolingTempPressDiffData: [] as any,
    acaiCoolingTempPressDiffErrorData: [] as any,

    // ACAI：泵组供回水温差/压差逻辑条件输入-供冷模式
    acai_cooling_pump_diff_tabs_list: [] as any,
    acai_cooling_pump_diff_tab_on: '',
    acai_cooling_pump_diff_tab_Data: [] as any,
    acaiCoolingPumpDiffData: [] as any,
    acaiCoolingPumpDiffErrorData: [] as any,

    // ACAI：开关设定-供热模式
    acai_heating_switch_tabs_list: [] as any,
    acai_heating_switch_tab_on: '',
    acai_heating_switch_tab_Data: [] as any,
    acaiHeatingSwitchData: [] as any,
    acaiHeatingSwitchErrorData: [] as any,

    // ACAI：台数计算-供热模式
    acai_heating_unit_count_tabs_list: [] as any,
    acai_heating_unit_count_tab_on: '',
    acai_heating_unit_count_tab_Data: [] as any,
    acaiHeatingUnitCountData: [] as any,
    acaiHeatingUnitCountErrorData: [] as any,

    // ACAI：安全运行-供热模式
    acai_heating_safe_tabs_list: [] as any,
    acai_heating_safe_tab_on: '',
    acai_heating_safe_tab_Data: [] as any,
    acaiHeatingSafeData: [] as any,
    acaiHeatingSafeErrorData: [] as any,

    // ACAI：供水温度设定-供热模式
    acai_heating_supply_temp_tabs_list: [] as any,
    acai_heating_supply_temp_tab_on: '',
    acai_heating_supply_temp_tab_Data: [] as any,
    acaiHeatingSupplyTempData: [] as any,
    acaiHeatingSupplyTempErrorData: [] as any,

    // ACAI：供回水温差/压差逻辑条件输入-供热模式
    acai_heating_temp_press_diff_tabs_list: [] as any,
    acai_heating_temp_press_diff_tab_on: '',
    acai_heating_temp_press_diff_tab_Data: [] as any,
    acaiHeatingTempPressDiffData: [] as any,
    acaiHeatingTempPressDiffErrorData: [] as any,

    // ACAI：泵组供回水温差/压差逻辑条件输入-供热模式
    acai_heating_pump_diff_tabs_list: [] as any,
    acai_heating_pump_diff_tab_on: '',
    acai_heating_pump_diff_tab_Data: [] as any,
    acaiHeatingPumpDiffData: [] as any,
    acaiHeatingPumpDiffErrorData: [] as any,

    // ACAI：通用工况
    acai_common_condition_tabs_list: [] as any,
    acai_common_condition_tab_on: '',
    acai_common_condition_tab_Data: [] as any,
    acaiCommonConditionData: [] as any,
    acaiCommonConditionErrorData: [] as any
});

// 项目
const alg_project = ref<any>(null);
// 中央供冷系统
const alg_cooling = ref<any>(null);
// 中央冷热源系统
const alg_cold_hot = ref<any>(null);
// 空间品质异常判断逻辑条件输入
const alg_demand_error = ref<any>(null);
// 跃变与加减机逻辑条件输入
const alg_jump = ref<any>(null);
// 提前开关时长
const alg_advance_switch_duration = ref<any>(null);
// 加减机逻辑条件输入（针对单个冷站）
const alg_add_subtract = ref<any>(null);
// 冷机出水温度设定逻辑条件输入（针对单个冷站）
const alg_cold_out_temp = ref<any>(null);
const alg_temp_press_diff = ref<any>(null);
// 泵组供回水温差/压差逻辑条件输入（针对单个泵组）
const alg_diff = ref<any>(null);
// 控制组频率约束（针对单个冷站）
const alg_accc_freq = ref<any>(null);
// 室外湿球温度配置（针对冷站）
const alg_out_wet_ball_temp_accc = ref<any>(null);
// 加减机逻辑条件输入-供冷模式（针对单个冷热站）
const alg_add_subtract_cold = ref<any>(null);
// 加减机逻辑条件输入-供热模式（针对单个冷热站）
const alg_add_subtract_hot = ref<any>(null);
// 冷机出水温度设定逻辑条件输入-供冷模式（针对单个冷热站）
const alg_cold_out_temp_cold = ref<any>(null);
// 冷机出水温度设定逻辑条件输入-供热模式（针对单个冷热站）
const alg_cold_out_temp_hot = ref<any>(null);
// 泵组供回水温差/压差逻辑条件输入-供冷模式（针对单个泵组）
const alg_diff_cold = ref<any>(null);
// 泵组供回水温差/压差逻辑条件输入-供热模式（针对单个泵组）
const alg_diff_hot = ref<any>(null);

const alg_tdb = ref<any>(null);

const alg_coldhot_temp_press_diff_cool = ref<any>(null);
const alg_coldhot_temp_press_diff_hot = ref<any>(null);

const alg_hot_temp_system = ref<any>(null);
const alg_hot_deta_temp_press_system = ref<any>(null);
const alg_hot_deta_temp_press_pump = ref<any>(null);

// 供冷工况
const alg_supply_cool = ref<any>(null);
// 蓄冷工况
const alg_storage_cool = ref<any>(null);
// 放冷工况
const alg_release_cool = ref<any>(null);
// 免费冷工况
const alg_cool_free = ref<any>(null);
// 通用工况
const alg_common_condition = ref<any>(null);
// 空调-冷机出水温度设定逻辑条件输入（针对单个冷站）
const alg_cold_out = ref<any>(null);
// 空调-供回水温差/压差逻辑条件输入
const alg_temp_press = ref<any>(null);
// 空调-泵组
const alg_pump_temp_press = ref<any>(null);
// 空调-控制组频率约束
const alg_control_group_freq = ref<any>(null);
// 空调-室外湿球温度配置
const alg_out_wet_ball_temp = ref<any>(null);

/***空调热源自动需求计算条件输入***/

/***空调冷热源自动需求计算条件输入 ACAI***/
const acai_cooling_unit_count = ref<any>(null);
const acai_cooling_supply_temp = ref<any>(null);
const acai_cooling_safe = ref<any>(null);
const acai_cooling_temp_press_diff = ref<any>(null);
const acai_cooling_pump_diff = ref<any>(null);
const acai_heating_switch = ref<any>(null);
const acai_heating_unit_count = ref<any>(null);
const acai_heating_safe = ref<any>(null);
const acai_heating_supply_temp = ref<any>(null);
const acai_heating_temp_press_diff = ref<any>(null);
const acai_heating_pump_diff = ref<any>(null);
const acai_common_condition = ref<any>(null);
/***空调冷热源自动需求计算条件输入 ACAI***/
// 出水温度设定逻辑条件
const center_ac_hot_water_temp = ref<any>(null);
// 温差/压差设定逻辑条件（针对单个热站）
const center_ac_hot_temp_press_diff = ref<any>(null);
// 温差/压差设定逻辑条件（针对单个泵组）
const center_ac_hot_deta_temp_press_pump = ref<any>(null);
// 空调热源自动需求计算条件输入--供热开关设定
const center_ac_hot_switch_setting = ref<any>(null);
// 空调热源自动需求计算条件输入--加机逻辑
const center_acah_add = ref<any>(null);
// 空调热源自动需求计算条件输入--减机逻辑
const center_acah_sub = ref<any>(null);
// 空调热源自动需求计算条件输入--安全状态计算
const center_acah_secu_calc = ref<any>(null);
/***空调热源自动需求计算条件输入***/

// onChange、onClear 所有变动的字段项
const allModifyItems = ref<any[]>([]);

const getShellConfigQuery = async (name: string) => {
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

    algParams.allItem = [];
    algParams.second_tab_alg_cooling = [];

    algParams.projectData = [];
    algParams.coolingData = [];
    algParams.coolingErrorData = [];
    algParams.coldHotData = [];

    algParams.demandErrorData = [];
    algParams.jumpData = [];
    algParams.advanceSwitchDurationData = [];
    algParams.spaceTdbSettingData = [];

    algParams.addSubtractData = [];
    algParams.diffData = [];
    algParams.coldOutTempData = [];
    algParams.tempPressDiffData = [];
    algParams.addSubtractErrorData = [];
    algParams.coldOutTempErrorData = [];
    algParams.tempPressDiffErrorData = [];
    algParams.diffErrorData = [];
    algParams.acccFreqData = [];
    algParams.acccFreqErrorData = [];
    algParams.outWetBallTempAcccData = [];
    algParams.outWetBallTempAcccErrorData = [{ id: 'alg_out_wet_ball_temp_accc', errorStatus: true }];
    algParams.second_tab_alg_accc_freq_Data = [];
    algParams.second_tab_alg_accc_freq = [];
    algParams.second_tab_alg_accc_freq_on = '';

    algParams.addSubtractColdData = [];
    algParams.addSubtractHotData = [];
    algParams.coldOutTempColdData = [];
    algParams.coldOutTempTempData = [];
    algParams.diffColdData = [];
    algParams.diffHotData = [];
    algParams.addSubtractColdErrorData = [];
    algParams.addSubtractHotErrorData = [];
    algParams.coldOutTempColdErrorData = [];
    algParams.coldOutTempTempErrorData = [];
    algParams.diffColdErrorData = [];
    algParams.diffHotErrorData = [];
    algParams.hotTempSystemErrorData = [];
    algParams.hotDetaTempPressSystemErrorData = [];
    algParams.hotDetaTempPressPumpErrorData = [];
    algParams.coldhotTempPressDiffCoolErrorData = [];
    algParams.coldhotTempPressDiffHotErrorData = [];
    algParams.centerAirHotTempSystemErrorData = [];
    algParams.centerAirHotTempPressureSystemErrorData = [];
    algParams.centerAirHotTempPressurePumpSystemErrorData = [];
    algParams.acahHotSetData = [];
    algParams.acahHotSetErrorData = [];
    algParams.acahAddData = [];
    algParams.acahAddErrorData = [];
    algParams.acahSubData = [];
    algParams.acahSubErrorData = [];
    algParams.acahSecuCalcData = [];
    algParams.acahSecuCalcErrorData = [];

    // 空调冷源自动需求计算的条件输入-重置错误数据、表单数据
    algParams.supplyCoolData = [];
    algParams.supplyCoolErrorData = [];
    algParams.storageCoolData = [];
    algParams.storageCoolErrorData = [];
    algParams.releaseCoolData = [];
    algParams.releaseCoolErrorData = [];
    algParams.freeCoolData = [];
    algParams.freeCoolErrorData = [];
    algParams.commonConditionData = [];
    algParams.commonConditionErrorData = [];
    algParams.coldOutData = [];
    algParams.coldOutErrorData = [];
    algParams.tempPressData = [];
    algParams.tempPressErrorData = [];
    algParams.pumpTempPressData = [];
    algParams.pumpTempPressErrorData = [];
    algParams.controlGroupFreqData = [];
    algParams.controlGroupFreqErrorData = [];
    algParams.outWetBallTempData = [];
    algParams.outWetBallTempErrorData = [{ id: 'alg_out_wet_ball_temp', errorStatus: true }];

    const algParamsAny = algParams as any;

    resetDynamicSectionData(algParamsAny);

    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();

    shellConfigQuery({ scene: name }, fetchAbortController.value.signal)
        .then((res: any) => {
            if (res.code === '00000') {
                try {
                    const resData = Array.isArray(res?.data) ? [...res.data] : [];

                    resData.forEach((groups: any) => {
                        if (Array.isArray(groups.groups) && groups.groups.length) {
                            groups.groups.forEach((item: any) => {
                                if (COMMON_NEED_OBJECT_ID_GROUPS.includes(item.group)) {
                                    item.items = item.items?.filter((v: any) => !!v?.objectId) || [];
                                }
                                algParams.allItem.push(item);
                                // eslint-disable-next-line default-case
                                if (fillAcacSectionData(item, algParamsAny) || fillAcaiSectionData(item, algParamsAny)) {
                                    return;
                                }

                                switch (item.group) {
                                    case 'group_alg_project':
                                        algParams.projectData = formatterValue(item.items);
                                        break;
                                    case 'group_alg_demand_error':
                                        algParams.demandErrorData = formatterValue(item.items);
                                        break;
                                    case 'group_alg_jump':
                                        algParams.jumpData = formatterValue(item.items);
                                        break;
                                    case 'group_alg_advance_duration':
                                        algParams.advanceSwitchDurationData = formatterValue(item.items);
                                        break;
                                    case 'group_alg_space_temp_set': {
                                        const tempArr = formatterValue(item.items) as any;
                                        const tabNameSet = new Set();
                                        tempArr.forEach((v: any) => {
                                            if (!tabNameSet.has(v.tabObjectName)) {
                                                v.groupName = v.tabObjectName;
                                            }
                                            if (v.tabObjectName) {
                                                tabNameSet.add(v.tabObjectName);
                                            }
                                        });
                                        algParams.spaceTdbSettingData = tempArr;
                                        break;
                                    }
                                    case 'group_alg_cold_hot':
                                        algParams.second_tab_alg_cold_hot_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_cold_hot = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_cold_hot_on = objectTabs(item.items).tabOn;
                                        algParams.coldHotData = objectTabs(item.items).tabData;
                                        algParams.coldHotErrorData = objectTabs(item.items, 1).errorData;
                                        break;
                                    case 'group_alg_add_subtract':
                                        algParams.second_tab_alg_add_subtract_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_add_subtract = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_add_subtract_on = objectTabs(item.items).tabOn;
                                        algParams.addSubtractData = objectTabs(item.items).tabData;
                                        algParams.addSubtractErrorData = objectTabs(item.items, 3).errorData;

                                        break;
                                    case 'group_alg_temp_press_diff':
                                        algParams.second_tab_alg_temp_press_diff_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_temp_press_diff = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_temp_press_diff_on = objectTabs(item.items).tabOn;
                                        algParams.tempPressDiffData = objectTabs(item.items).tabData;
                                        algParams.tempPressDiffErrorData = objectTabs(item.items, 3).errorData;
                                        break;
                                    case 'group_alg_cold_out_temp':
                                        algParams.second_tab_alg_cold_out_temp_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_cold_out_temp = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_cold_out_temp_on = objectTabs(item.items).tabOn;
                                        algParams.coldOutTempData = objectTabs(item.items).tabData;
                                        algParams.coldOutTempErrorData = objectTabs(item.items, 3).errorData;
                                        break;
                                    case 'group_alg_diff':
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        item.items.forEach((code: any) => {
                                            if (code.objectName === i18n.global.t('meos_control_web.primary_pump_group')) {
                                                code.objectId = 'group_alg_diff_auto';
                                            }
                                        });
                                        algParams.second_tab_alg_diff_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_diff = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_diff_on = objectTabs(item.items).tabOn;
                                        algParams.diffData = objectTabs(item.items).tabData;
                                        algParams.diffErrorData = objectTabs(item.items, 3).errorData;
                                        break;
                                    case 'group_alg_accc_freq':
                                        algParams.second_tab_alg_accc_freq_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_accc_freq = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_accc_freq_on = objectTabs(item.items).tabOn;
                                        algParams.acccFreqData = objectTabs(item.items).tabData;
                                        algParams.acccFreqErrorData = objectTabs(item.items, 3).errorData;
                                        break;
                                    case 'group_alg_out_wet_ball_temp_accc':
                                        algParams.outWetBallTempAcccData = formatterValue(item.items);

                                        break;
                                    case 'group_alg_add_subtract_cold':
                                        algParams.second_tab_alg_add_subtract_cold_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_add_subtract_cold = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_add_subtract_cold_on = objectTabs(item.items).tabOn;
                                        algParams.addSubtractColdData = objectTabs(item.items).tabData;
                                        algParams.addSubtractColdErrorData = objectTabs(item.items, 4).errorData;

                                        break;
                                    case 'group_alg_add_subtract_hot':
                                        algParams.second_tab_alg_add_subtract_hot_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_add_subtract_hot = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_add_subtract_hot_on = objectTabs(item.items).tabOn;
                                        algParams.addSubtractHotData = objectTabs(item.items).tabData;
                                        algParams.addSubtractHotErrorData = objectTabs(item.items, 4).errorData;

                                        break;
                                    case 'group_alg_cold_out_temp_cold':
                                        algParams.second_tab_alg_cold_out_temp_cold_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_cold_out_temp_cold = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_cold_out_temp_cold_on = objectTabs(item.items).tabOn;
                                        algParams.coldOutTempColdData = objectTabs(item.items).tabData;
                                        algParams.coldOutTempColdErrorData = objectTabs(item.items, 4).errorData;

                                        break;
                                    case 'group_alg_cold_out_temp_hot':
                                        algParams.second_tab_alg_cold_out_temp_hot_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_cold_out_temp_hot = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_cold_out_temp_hot_on = objectTabs(item.items).tabOn;
                                        algParams.coldOutTempTempData = objectTabs(item.items).tabData;
                                        algParams.coldOutTempTempErrorData = objectTabs(item.items, 4).errorData;

                                        break;
                                    case 'group_alg_diff_cold':
                                        algParams.second_tab_alg_diff_cold_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_diff_cold = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_diff_cold_on = objectTabs(item.items).tabOn;
                                        algParams.diffColdData = objectTabs(item.items).tabData;
                                        algParams.diffColdErrorData = objectTabs(item.items, 4).errorData;

                                        break;
                                    case 'group_alg_diff_hot':
                                        algParams.second_tab_alg_diff_hot_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_diff_hot = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_diff_hot_on = objectTabs(item.items).tabOn;
                                        algParams.diffHotData = objectTabs(item.items).tabData;
                                        algParams.diffHotErrorData = objectTabs(item.items, 4).errorData;
                                        break;
                                    //
                                    case 'group_alg_coldhot_temp_press_diff_cool':
                                        algParams.second_tab_alg_coldhot_temp_press_diff_cool_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_coldhot_temp_press_diff_cool = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_coldhot_temp_press_diff_cool_on = objectTabs(item.items).tabOn;
                                        algParams.coldhotTempPressDiffCoolData = objectTabs(item.items).tabData;
                                        algParams.coldhotTempPressDiffCoolErrorData = objectTabs(item.items, 4).errorData;
                                        break;
                                    case 'group_alg_coldhot_temp_press_diff_hot':
                                        algParams.second_tab_alg_coldhot_temp_press_diff_hot_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_coldhot_temp_press_diff_hot = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_coldhot_temp_press_diff_hot_on = objectTabs(item.items).tabOn;
                                        algParams.coldhotTempPressDiffHotData = objectTabs(item.items).tabData;
                                        algParams.coldhotTempPressDiffHotErrorData = objectTabs(item.items, 4).errorData;
                                        break;
                                    case 'group_alg_hot_temp_system':
                                        algParams.second_tab_alg_hot_temp_system_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_hot_temp_system = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_hot_temp_system_on = objectTabs(item.items).tabOn;
                                        algParams.hotTempSystemData = objectTabs(item.items).tabData;
                                        algParams.hotTempSystemErrorData = objectTabs(item.items, 4).errorData;
                                        break;
                                    case 'group_alg_hot_deta_temp_press_system':
                                        algParams.second_tab_alg_hot_deta_temp_press_system_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_hot_deta_temp_press_system = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_hot_deta_temp_press_system_on = objectTabs(item.items).tabOn;
                                        algParams.hotDetaTempPressSystemData = objectTabs(item.items).tabData;
                                        algParams.hotDetaTempPressSystemErrorData = objectTabs(item.items, 4).errorData;
                                        break;
                                    case 'group_alg_hot_deta_temp_press_pump':
                                        algParams.second_tab_alg_hot_deta_temp_press_pump_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_hot_deta_temp_press_pump = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_hot_deta_temp_press_pump_on = objectTabs(item.items).tabOn;
                                        algParams.hotDetaTempPressPumpData = objectTabs(item.items).tabData;
                                        algParams.hotDetaTempPressPumpErrorData = objectTabs(item.items, 4).errorData;
                                        break;
                                    case 'group_alg_cooling':
                                        if (objectTabs(item.items).arr.length) {
                                            // 是否展示启动算法计算按钮
                                            emit('update:modelValue', true);
                                        } else {
                                            emit('update:modelValue', false);
                                        }
                                        algParams.second_tab_alg_cooling_Data = formatterValue(item.items);
                                        algParams.second_tab_alg_cooling = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_cooling_on = objectTabs(item.items).tabOn;
                                        algParams.coolingData = objectTabs(item.items).tabData;
                                        algParams.coolingErrorData = objectTabs(item.items, 1).errorData;
                                        break;

                                    //  空调热源自动需求计算条件输入--出水温度设定逻辑条件（针对单个热站）
                                    case 'group_alg_acah_out_temp':
                                        algParams.secondTabAlgCenterAirHotTempSystemData = formatterValue(item.items);
                                        algParams.secondTabAlgCenterAirHotTempSystem = objectTabs(item.items).tabList;
                                        algParams.secondTabAlgCenterAirHotTempSystemOn = objectTabs(item.items).tabOn;
                                        algParams.centerAirHotTempSystemData = objectTabs(item.items).tabData;
                                        algParams.centerAirHotTempSystemErrorData = objectTabs(item.items, 7).errorData;
                                        break;
                                    //  空调热源自动需求计算条件输入--温差/压差设定逻辑条件（针对单个热站）
                                    case 'group_alg_acah_hot_diff':
                                        algParams.secondTabAlgCenterAirHotTempPressureSystemData = formatterValue(item.items);
                                        algParams.secondTabAlgCenterAirHotTempPressureSystem = objectTabs(item.items).tabList;
                                        algParams.secondTabAlgCenterAirHotTempPressureSystemOn = objectTabs(item.items).tabOn;
                                        algParams.centerAirHotTempPressureSystemData = objectTabs(item.items).tabData;
                                        algParams.centerAirHotTempPressureSystemErrorData = objectTabs(item.items, 7).errorData;
                                        break;
                                    //  空调热源自动需求计算条件输入--温差/压差设定逻辑条件（针对单个泵组）
                                    case 'group_alg_acah_pump_diff':
                                        algParams.secondTabAlgCenterAirHotTempPressurePumpSystemData = formatterValue(item.items);
                                        algParams.secondTabAlgCenterAirHotTempPressurePumpSystem = objectTabs(item.items).tabList;
                                        algParams.secondTabAlgCenterAirHotTempPressurePumpSystemOn = objectTabs(item.items).tabOn;
                                        algParams.centerAirHotTempPressurePumpSystemData = objectTabs(item.items).tabData;
                                        algParams.centerAirHotTempPressurePumpSystemErrorData = objectTabs(item.items, 7).errorData;
                                        break;
                                    //  空调热源自动需求计算条件输入--供热开关设定
                                    case 'group_alg_acah_hot_set':
                                        algParams.second_tab_acah_hot_set_data = formatterValue(item.items);
                                        algParams.second_tab_acah_hot_set_tab_list = objectTabs(item.items).tabList;
                                        algParams.second_tab_acah_hot_set_tab_on = objectTabs(item.items).tabOn;
                                        algParams.acahHotSetData = objectTabs(item.items).tabData;
                                        algParams.acahHotSetErrorData = objectTabs(item.items, 7).errorData;
                                        break;
                                    //  空调热源自动需求计算条件输入--加机逻辑
                                    case 'group_alg_acah_add':
                                        algParams.second_tab_alg_acah_add_data = formatterValue(item.items);
                                        algParams.second_tab_alg_acah_add_tab_list = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_acah_add_tab_on = objectTabs(item.items).tabOn;
                                        algParams.acahAddData = objectTabs(item.items).tabData;
                                        algParams.acahAddErrorData = objectTabs(item.items, 7).errorData;
                                        break;
                                    //  空调热源自动需求计算条件输入--减机逻辑
                                    case 'group_alg_acah_sub':
                                        algParams.second_tab_alg_acah_sub_data = formatterValue(item.items);
                                        algParams.second_tab_alg_acah_sub_tab_list = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_acah_sub_tab_on = objectTabs(item.items).tabOn;
                                        algParams.acahSubData = objectTabs(item.items).tabData;
                                        algParams.acahSubErrorData = objectTabs(item.items, 7).errorData;
                                        break;
                                    //  空调热源自动需求计算条件输入--安全状态计算
                                    case 'group_alg_acah_secu_calc':
                                        algParams.second_tab_alg_acah_secu_calc_data = formatterValue(item.items);
                                        algParams.second_tab_alg_acah_secu_calc_tab_list = objectTabs(item.items).tabList;
                                        algParams.second_tab_alg_acah_secu_calc_tab_on = objectTabs(item.items).tabOn;
                                        algParams.acahSecuCalcData = objectTabs(item.items).tabData;
                                        algParams.acahSecuCalcErrorData = objectTabs(item.items, 7).errorData;
                                        break;
                                    default:
                                        break;
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.log('al-error----', error);
                }
                algParams.defaultItem = JSON.parse(JSON.stringify(algParams.allItem));

                const preSavedItems = algParams.defaultItem?.flatMap(v => (v as any)?.items) || [];
                algParams.allItem.forEach((group: any) => {
                    group.items.forEach((item: any) => {
                        // 初始化判断，是否展示批量恢复默认按钮，此时未编辑因此确认按钮应该是置灰的
                        const leftModifyItem = checkGlobalModify(item.valueInputLeft, item, 'left', preSavedItems);
                        checkFormItemModify(leftModifyItem);
                        const rightModifyItem = checkGlobalModify(item.valueInputRight, item, 'right', preSavedItems);
                        checkFormItemModify(rightModifyItem);
                    });
                });
            }
        })
        .finally(() => {
            loadingInstance.value.destroy();
        });
};
const tabsTitleChange = () => {
    formValidate();
};

// 二级 tab 切换配置：统一维护「数据源字段 -> 当前展示字段 -> 表单 ref」。
const secondTabFieldMap: Record<string, { dataKey: string; sourceKey: string; formRef: any }> = {
    alg_supply_cool: { dataKey: 'supplyCoolData', sourceKey: 'second_tab_alg_supply_cool_tab_Data', formRef: alg_supply_cool },
    alg_storage_cool: { dataKey: 'storageCoolData', sourceKey: 'second_tab_alg_storage_cool_tab_Data', formRef: alg_storage_cool },
    alg_release_cool: { dataKey: 'releaseCoolData', sourceKey: 'second_tab_alg_release_cool_tab_Data', formRef: alg_release_cool },
    alg_cool_free: { dataKey: 'freeCoolData', sourceKey: 'second_tab_alg_cool_free_tab_Data', formRef: alg_cool_free },
    alg_common_condition: { dataKey: 'commonConditionData', sourceKey: 'second_tab_alg_common_condition_tab_Data', formRef: alg_common_condition },
    alg_cold_out: { dataKey: 'coldOutData', sourceKey: 'second_tab_alg_cold_out_tab_Data', formRef: alg_cold_out },
    alg_temp_press: { dataKey: 'tempPressData', sourceKey: 'second_tab_alg_temp_press_tab_Data', formRef: alg_temp_press },
    alg_pump_temp_press: { dataKey: 'pumpTempPressData', sourceKey: 'second_tab_alg_pump_temp_press_tab_Data', formRef: alg_pump_temp_press },
    alg_control_group_freq: { dataKey: 'controlGroupFreqData', sourceKey: 'second_tab_alg_control_group_freq_tab_Data', formRef: alg_control_group_freq },
    alg_cooling: { dataKey: 'coolingData', sourceKey: 'second_tab_alg_cooling_Data', formRef: alg_cooling },
    alg_cold_hot: { dataKey: 'coldHotData', sourceKey: 'second_tab_alg_cold_hot_Data', formRef: alg_cold_hot },
    alg_add_subtract: { dataKey: 'addSubtractData', sourceKey: 'second_tab_alg_add_subtract_Data', formRef: alg_add_subtract },
    alg_cold_out_temp: { dataKey: 'coldOutTempData', sourceKey: 'second_tab_alg_cold_out_temp_Data', formRef: alg_cold_out_temp },
    alg_temp_press_diff: { dataKey: 'tempPressDiffData', sourceKey: 'second_tab_alg_temp_press_diff_Data', formRef: alg_temp_press_diff },
    alg_diff: { dataKey: 'diffData', sourceKey: 'second_tab_alg_diff_Data', formRef: alg_diff },
    alg_accc_freq: { dataKey: 'acccFreqData', sourceKey: 'second_tab_alg_accc_freq_Data', formRef: alg_accc_freq },
    alg_add_subtract_cold: { dataKey: 'addSubtractColdData', sourceKey: 'second_tab_alg_add_subtract_cold_Data', formRef: alg_add_subtract_cold },
    alg_add_subtract_hot: { dataKey: 'addSubtractHotData', sourceKey: 'second_tab_alg_add_subtract_hot_Data', formRef: alg_add_subtract_hot },
    alg_cold_out_temp_cold: { dataKey: 'coldOutTempColdData', sourceKey: 'second_tab_alg_cold_out_temp_cold_Data', formRef: alg_cold_out_temp_cold },
    alg_cold_out_temp_hot: { dataKey: 'coldOutTempTempData', sourceKey: 'second_tab_alg_cold_out_temp_hot_Data', formRef: alg_cold_out_temp_hot },
    alg_diff_cold: { dataKey: 'diffColdData', sourceKey: 'second_tab_alg_diff_cold_Data', formRef: alg_diff_cold },
    alg_diff_hot: { dataKey: 'diffHotData', sourceKey: 'second_tab_alg_diff_hot_Data', formRef: alg_diff_hot },
    alg_coldhot_temp_press_diff_cool: {
        dataKey: 'coldhotTempPressDiffCoolData',
        sourceKey: 'second_tab_alg_coldhot_temp_press_diff_cool_Data',
        formRef: alg_coldhot_temp_press_diff_cool
    },
    alg_coldhot_temp_press_diff_hot: {
        dataKey: 'coldhotTempPressDiffHotData',
        sourceKey: 'second_tab_alg_coldhot_temp_press_diff_hot_Data',
        formRef: alg_coldhot_temp_press_diff_hot
    },
    alg_hot_temp_system: { dataKey: 'hotTempSystemData', sourceKey: 'second_tab_alg_hot_temp_system_Data', formRef: alg_hot_temp_system },
    alg_hot_deta_temp_press_system: { dataKey: 'hotDetaTempPressSystemData', sourceKey: 'second_tab_alg_hot_deta_temp_press_system_Data', formRef: alg_hot_deta_temp_press_system },
    alg_hot_deta_temp_press_pump: { dataKey: 'hotDetaTempPressPumpData', sourceKey: 'second_tab_alg_hot_deta_temp_press_pump_Data', formRef: alg_hot_deta_temp_press_pump },
    center_ac_hot_water_temp: { dataKey: 'centerAirHotTempSystemData', sourceKey: 'secondTabAlgCenterAirHotTempSystemData', formRef: center_ac_hot_water_temp },
    center_ac_hot_temp_press_diff: {
        dataKey: 'centerAirHotTempPressureSystemData',
        sourceKey: 'secondTabAlgCenterAirHotTempPressureSystemData',
        formRef: center_ac_hot_temp_press_diff
    },
    center_ac_hot_deta_temp_press_pump: {
        dataKey: 'centerAirHotTempPressurePumpSystemData',
        sourceKey: 'secondTabAlgCenterAirHotTempPressurePumpSystemData',
        formRef: center_ac_hot_deta_temp_press_pump
    },
    center_ac_hot_switch_setting: { dataKey: 'acahHotSetData', sourceKey: 'second_tab_acah_hot_set_data', formRef: center_ac_hot_switch_setting },
    center_acah_add: { dataKey: 'acahAddData', sourceKey: 'second_tab_alg_acah_add_data', formRef: center_acah_add },
    center_acah_sub: { dataKey: 'acahSubData', sourceKey: 'second_tab_alg_acah_sub_data', formRef: center_acah_sub },
    center_acah_secu_calc: { dataKey: 'acahSecuCalcData', sourceKey: 'second_tab_alg_acah_secu_calc_data', formRef: center_acah_secu_calc },
    acai_cooling_unit_count: { dataKey: 'acaiCoolingUnitCountData', sourceKey: 'acai_cooling_unit_count_tab_Data', formRef: acai_cooling_unit_count },
    acai_cooling_supply_temp: { dataKey: 'acaiCoolingSupplyTempData', sourceKey: 'acai_cooling_supply_temp_tab_Data', formRef: acai_cooling_supply_temp },
    acai_cooling_safe: { dataKey: 'acaiCoolingSafeData', sourceKey: 'acai_cooling_safe_tab_Data', formRef: acai_cooling_safe },
    acai_cooling_temp_press_diff: { dataKey: 'acaiCoolingTempPressDiffData', sourceKey: 'acai_cooling_temp_press_diff_tab_Data', formRef: acai_cooling_temp_press_diff },
    acai_cooling_pump_diff: { dataKey: 'acaiCoolingPumpDiffData', sourceKey: 'acai_cooling_pump_diff_tab_Data', formRef: acai_cooling_pump_diff },
    acai_heating_switch: { dataKey: 'acaiHeatingSwitchData', sourceKey: 'acai_heating_switch_tab_Data', formRef: acai_heating_switch },
    acai_heating_unit_count: { dataKey: 'acaiHeatingUnitCountData', sourceKey: 'acai_heating_unit_count_tab_Data', formRef: acai_heating_unit_count },
    acai_heating_safe: { dataKey: 'acaiHeatingSafeData', sourceKey: 'acai_heating_safe_tab_Data', formRef: acai_heating_safe },
    acai_heating_supply_temp: { dataKey: 'acaiHeatingSupplyTempData', sourceKey: 'acai_heating_supply_temp_tab_Data', formRef: acai_heating_supply_temp },
    acai_heating_temp_press_diff: { dataKey: 'acaiHeatingTempPressDiffData', sourceKey: 'acai_heating_temp_press_diff_tab_Data', formRef: acai_heating_temp_press_diff },
    acai_heating_pump_diff: { dataKey: 'acaiHeatingPumpDiffData', sourceKey: 'acai_heating_pump_diff_tab_Data', formRef: acai_heating_pump_diff },
    acai_common_condition: { dataKey: 'acaiCommonConditionData', sourceKey: 'acai_common_condition_tab_Data', formRef: acai_common_condition }
};

const secondTabChange = (data: any, name: string) => {
    const config = secondTabFieldMap[name];
    if (!config) {
        return;
    }
    const algParamsAny = algParams as any;
    algParamsAny[config.dataKey] = formatSecondTab(algParamsAny[config.sourceKey], data);
    nextTick(() => {
        config.formRef.value?.checkAllItemsModify?.();
    });
};

const formatSecondTab = (allData: any, params: any) => {
    const dataList = formatSecondTabData(allData, params);
    formValidate();
    return dataList;
};

// 更新配置
const updateshellConfig = () => {
    const loading = MLoading.service({
        target: '.shell-config-right-box',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
    updateshellConfigSave('alg', algParams.allItem).then((res: any) => {
        loading.destroy();
        // eslint-disable-next-line eqeqeq
        if (res.code == '00000') {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            getShellConfigQuery('alg');
            nextTick(() => {
                emitter.emit('confirmDisabled', { status: true, isSave: true });
                allModifyItems.value = [];
            });
        } else {
            loading.destroy();
        }
    });
};

emitter.off('InputEmitter');
emitter.on('InputEmitter', (data: any) => {
    if (data.menu === ACTIVE_MENUS_ID_ENUM.ALGORITHM_LOGIC) {
        if (data.type === 'confirm') {
            formValidate(data.menu);
        } else if (data.type === 'cancel') {
            const preSavedItems = algParams.defaultItem?.flatMap(v => (v as any)?.items) || [];
            algParams.allItem.map((group: any) => {
                group.items.length &&
                    group.items.map((item: any) => {
                        const preSavedItem = preSavedItems?.find(v => v?.code === item?.code && (v?.objectId === item?.objectId || !v?.objectId));
                        if (item.valueType === 'MULTIPLE') {
                            item.valueInputLeft = structuredClone(item.defaultValues);
                        } else {
                            item.valueInputLeft = structuredClone(preSavedItem ? preSavedItem?.valueInputLeft : item?.valueInputLeft);
                            item.valueInputRight = structuredClone(preSavedItem ? preSavedItem?.valueInputRight : item?.valueInputRight);
                        }

                        // 取消后，需再次判断相对上次保存的值是否有变更，是否禁用确认按钮
                        const leftModifyItem = checkGlobalModify(item.valueInputLeft, item, 'left', preSavedItems);
                        checkFormItemModify(leftModifyItem);
                        const rightModifyItem = checkGlobalModify(item.valueInputRight, item, 'right', preSavedItems);
                        checkFormItemModify(rightModifyItem);
                    });
            });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        } else {
            const preSavedItems = algParams.defaultItem?.flatMap(v => (v as any)?.items) || [];
            algParams.allItem.map((group: any) => {
                group.items.map((item: any) => {
                    // 空调冷源自动需求计算的条件输入无禁用的字段
                    if (
                        !(item.tab === i18n.global.t('meos_control_web.hvac_cooling_source_auto_demand_calc_condition_input') && ALG_NO_DEFAULT_VALUE.includes(item.code)) &&
                        item.editAuth
                    ) {
                        item.valueInputLeft = structuredClone(item.defaultValueLeft);
                        item.valueInputRight = structuredClone(item.defaultValueRight);
                    }

                    // 批量恢复默认后，需再次判断相对上次保存的值是否有变更，是否禁用确认按钮
                    const leftModifyItem = checkGlobalModify(item.valueInputLeft, item, 'left', preSavedItems);
                    checkFormItemModify(leftModifyItem);
                    const rightModifyItem = checkGlobalModify(item.valueInputRight, item, 'right', preSavedItems);
                    checkFormItemModify(rightModifyItem);
                });
            });
            formValidate();
        }
    }
});

const validateFormItem = ({ condition, formRef, errorKey, errorId }: any) => {
    const algParamsAny = algParams as any;
    if (condition && !condition()) {
        return null;
    }

    if (!formRef.value?.Mform?.validate) {
        return null;
    }

    return formRef.value.Mform.validate((valid: boolean) => {
        checkErrorStatus(algParamsAny[errorKey], valid, typeof errorId === 'function' ? errorId() : errorId);
        return valid;
    });
};

// 校验配置：按一级 tab 维护表单 ref、错误数组与错误 id。
const validateFieldMap: Record<string, any[]> = {
    '1': [
        { formRef: alg_project, errorKey: 'isErrorData', errorId: 'alg_project' },
        { condition: () => algParams.second_tab_alg_cooling.length, formRef: alg_cooling, errorKey: 'coolingErrorData', errorId: () => `1-${algParams.second_tab_alg_cooling_on}` },
        {
            condition: () => algParams.second_tab_alg_cold_hot.length,
            formRef: alg_cold_hot,
            errorKey: 'coldHotErrorData',
            errorId: () => `1-${algParams.second_tab_alg_cold_hot_on}`
        }
    ],
    '2': [
        { formRef: alg_demand_error, errorKey: 'isErrorData', errorId: 'alg_demand_error' },
        { formRef: alg_jump, errorKey: 'isErrorData', errorId: 'alg_jump' },
        { formRef: alg_advance_switch_duration, errorKey: 'isErrorData', errorId: 'alg_advance_switch_duration' },
        { formRef: alg_tdb, errorKey: 'spaceTdbSettingErrorData', errorId: 'alg_tdb' }
    ],
    '3': [
        {
            condition: () => algParams.second_tab_alg_add_subtract.length,
            formRef: alg_add_subtract,
            errorKey: 'addSubtractErrorData',
            errorId: () => `3-${algParams.second_tab_alg_add_subtract_on}`
        },
        {
            condition: () => algParams.second_tab_alg_cold_out_temp.length,
            formRef: alg_cold_out_temp,
            errorKey: 'coldOutTempErrorData',
            errorId: () => `3-${algParams.second_tab_alg_cold_out_temp_on}`
        },
        {
            condition: () => algParams.second_tab_alg_temp_press_diff.length,
            formRef: alg_temp_press_diff,
            errorKey: 'tempPressDiffErrorData',
            errorId: () => `3-${algParams.second_tab_alg_temp_press_diff_on}`
        },
        { condition: () => algParams.second_tab_alg_diff.length, formRef: alg_diff, errorKey: 'diffErrorData', errorId: () => `3-${algParams.second_tab_alg_diff_on}` },
        {
            condition: () => algParams.second_tab_alg_accc_freq.length,
            formRef: alg_accc_freq,
            errorKey: 'acccFreqErrorData',
            errorId: () => `3-${algParams.second_tab_alg_accc_freq_on}`
        },
        { formRef: alg_out_wet_ball_temp_accc, errorKey: 'outWetBallTempAcccErrorData', errorId: 'alg_out_wet_ball_temp_accc' }
    ],
    '4': [
        {
            condition: () => algParams.second_tab_alg_add_subtract_cold.length,
            formRef: alg_add_subtract_cold,
            errorKey: 'addSubtractColdErrorData',
            errorId: () => `4-${algParams.second_tab_alg_add_subtract_cold_on}`
        },
        {
            condition: () => algParams.second_tab_alg_add_subtract_hot.length,
            formRef: alg_add_subtract_hot,
            errorKey: 'addSubtractHotErrorData',
            errorId: () => `4-${algParams.second_tab_alg_add_subtract_hot_on}`
        },
        {
            condition: () => algParams.second_tab_alg_cold_out_temp_cold.length,
            formRef: alg_cold_out_temp_cold,
            errorKey: 'coldOutTempColdErrorData',
            errorId: () => `4-${algParams.second_tab_alg_cold_out_temp_cold_on}`
        },
        {
            condition: () => algParams.second_tab_alg_cold_out_temp_hot.length,
            formRef: alg_cold_out_temp_hot,
            errorKey: 'coldOutTempTempErrorData',
            errorId: () => `4-${algParams.second_tab_alg_cold_out_temp_hot_on}`
        },
        {
            condition: () => algParams.second_tab_alg_diff_cold.length,
            formRef: alg_diff_cold,
            errorKey: 'diffColdErrorData',
            errorId: () => `4-${algParams.second_tab_alg_diff_cold_on}`
        },
        {
            condition: () => algParams.second_tab_alg_diff_hot.length,
            formRef: alg_diff_hot,
            errorKey: 'diffHotErrorData',
            errorId: () => `4-${algParams.second_tab_alg_diff_hot_on}`
        },
        {
            condition: () => algParams.second_tab_alg_coldhot_temp_press_diff_cool.length,
            formRef: alg_coldhot_temp_press_diff_cool,
            errorKey: 'coldhotTempPressDiffCoolErrorData',
            errorId: () => `4-${algParams.second_tab_alg_coldhot_temp_press_diff_cool_on}`
        },
        {
            condition: () => algParams.second_tab_alg_coldhot_temp_press_diff_hot.length,
            formRef: alg_coldhot_temp_press_diff_hot,
            errorKey: 'coldhotTempPressDiffHotErrorData',
            errorId: () => `4-${algParams.second_tab_alg_coldhot_temp_press_diff_hot_on}`
        }
    ],
    '5': [
        {
            condition: () => algParams.second_tab_alg_hot_temp_system.length,
            formRef: alg_hot_temp_system,
            errorKey: 'hotTempSystemErrorData',
            errorId: () => `5-${algParams.second_tab_alg_hot_temp_system_on}`
        },
        {
            condition: () => algParams.second_tab_alg_hot_deta_temp_press_system.length,
            formRef: alg_hot_deta_temp_press_system,
            errorKey: 'hotDetaTempPressSystemErrorData',
            errorId: () => `5-${algParams.second_tab_alg_hot_deta_temp_press_system_on}`
        },
        {
            condition: () => algParams.second_tab_alg_hot_deta_temp_press_pump.length,
            formRef: alg_hot_deta_temp_press_pump,
            errorKey: 'hotDetaTempPressPumpErrorData',
            errorId: () => `5-${algParams.second_tab_alg_hot_deta_temp_press_pump_on}`
        }
    ],
    '6': [
        {
            condition: () => algParams.second_tab_alg_supply_cool_tabs_list.length,
            formRef: alg_supply_cool,
            errorKey: 'supplyCoolErrorData',
            errorId: () => `6-${algParams.second_tab_alg_supply_cool_tab_on}`
        },
        {
            condition: () => algParams.second_tab_alg_storage_cool_tabs_list.length,
            formRef: alg_storage_cool,
            errorKey: 'storageCoolErrorData',
            errorId: () => `6-${algParams.second_tab_alg_storage_cool_tab_on}`
        },
        {
            condition: () => algParams.second_tab_alg_release_cool_tabs_list.length,
            formRef: alg_release_cool,
            errorKey: 'releaseCoolErrorData',
            errorId: () => `6-${algParams.second_tab_alg_release_cool_tab_on}`
        },
        {
            condition: () => algParams.second_tab_alg_cool_free_tabs_list.length,
            formRef: alg_cool_free,
            errorKey: 'freeCoolErrorData',
            errorId: () => `6-${algParams.second_tab_alg_cool_free_tab_on}`
        },
        {
            condition: () => algParams.second_tab_alg_common_condition_tabs_list.length,
            formRef: alg_common_condition,
            errorKey: 'commonConditionErrorData',
            errorId: () => `6-${algParams.second_tab_alg_common_condition_tab_on}`
        },
        {
            condition: () => algParams.second_tab_alg_cold_out_tabs_list.length,
            formRef: alg_cold_out,
            errorKey: 'coldOutErrorData',
            errorId: () => `6-${algParams.second_tab_alg_cold_out_tab_on}`
        },
        {
            condition: () => algParams.second_tab_alg_temp_press_tabs_list.length,
            formRef: alg_temp_press,
            errorKey: 'tempPressErrorData',
            errorId: () => `6-${algParams.second_tab_alg_temp_press_tab_on}`
        },
        {
            condition: () => algParams.second_tab_alg_pump_temp_press_tabs_list.length,
            formRef: alg_pump_temp_press,
            errorKey: 'pumpTempPressErrorData',
            errorId: () => `6-${algParams.second_tab_alg_pump_temp_press_tab_on}`
        },
        {
            condition: () => algParams.second_tab_alg_control_group_freq_tabs_list.length,
            formRef: alg_control_group_freq,
            errorKey: 'controlGroupFreqErrorData',
            errorId: () => `6-${algParams.second_tab_alg_control_group_freq_tab_on}`
        },
        { formRef: alg_out_wet_ball_temp, errorKey: 'outWetBallTempErrorData', errorId: 'alg_out_wet_ball_temp' }
    ],
    '7': [
        {
            condition: () => algParams.secondTabAlgCenterAirHotTempSystem.length,
            formRef: center_ac_hot_water_temp,
            errorKey: 'centerAirHotTempSystemErrorData',
            errorId: () => `7-${algParams.secondTabAlgCenterAirHotTempSystemOn}`
        },
        {
            condition: () => algParams.secondTabAlgCenterAirHotTempPressureSystem.length,
            formRef: center_ac_hot_temp_press_diff,
            errorKey: 'centerAirHotTempPressureSystemErrorData',
            errorId: () => `7-${algParams.secondTabAlgCenterAirHotTempPressureSystemOn}`
        },
        {
            condition: () => algParams.secondTabAlgCenterAirHotTempPressurePumpSystem.length,
            formRef: center_ac_hot_deta_temp_press_pump,
            errorKey: 'centerAirHotTempPressurePumpSystemErrorData',
            errorId: () => `7-${algParams.secondTabAlgCenterAirHotTempPressurePumpSystemOn}`
        },
        {
            condition: () => algParams.acahHotSetErrorData.length,
            formRef: center_ac_hot_switch_setting,
            errorKey: 'acahHotSetErrorData',
            errorId: () => `7-${algParams.second_tab_acah_hot_set_tab_on}`
        },
        {
            condition: () => algParams.acahAddErrorData.length,
            formRef: center_acah_add,
            errorKey: 'acahAddErrorData',
            errorId: () => `7-${algParams.second_tab_alg_acah_add_tab_on}`
        },
        {
            condition: () => algParams.acahSubErrorData.length,
            formRef: center_acah_sub,
            errorKey: 'acahSubErrorData',
            errorId: () => `7-${algParams.second_tab_alg_acah_sub_tab_on}`
        },
        {
            condition: () => algParams.acahSecuCalcErrorData.length,
            formRef: center_acah_secu_calc,
            errorKey: 'acahSecuCalcErrorData',
            errorId: () => `7-${algParams.second_tab_alg_acah_secu_calc_tab_on}`
        }
    ],
    '8': [
        {
            condition: () => algParams.acai_cooling_unit_count_tabs_list.length,
            formRef: acai_cooling_unit_count,
            errorKey: 'acaiCoolingUnitCountErrorData',
            errorId: () => `8-${algParams.acai_cooling_unit_count_tab_on}`
        },
        {
            condition: () => algParams.acai_cooling_supply_temp_tabs_list.length,
            formRef: acai_cooling_supply_temp,
            errorKey: 'acaiCoolingSupplyTempErrorData',
            errorId: () => `8-${algParams.acai_cooling_supply_temp_tab_on}`
        },
        {
            condition: () => algParams.acai_cooling_safe_tabs_list.length,
            formRef: acai_cooling_safe,
            errorKey: 'acaiCoolingSafeErrorData',
            errorId: () => `8-${algParams.acai_cooling_safe_tab_on}`
        },
        {
            condition: () => algParams.acai_cooling_temp_press_diff_tabs_list.length,
            formRef: acai_cooling_temp_press_diff,
            errorKey: 'acaiCoolingTempPressDiffErrorData',
            errorId: () => `8-${algParams.acai_cooling_temp_press_diff_tab_on}`
        },
        {
            condition: () => algParams.acai_cooling_pump_diff_tabs_list.length,
            formRef: acai_cooling_pump_diff,
            errorKey: 'acaiCoolingPumpDiffErrorData',
            errorId: () => `8-${algParams.acai_cooling_pump_diff_tab_on}`
        },
        {
            condition: () => algParams.acai_heating_switch_tabs_list.length,
            formRef: acai_heating_switch,
            errorKey: 'acaiHeatingSwitchErrorData',
            errorId: () => `8-${algParams.acai_heating_switch_tab_on}`
        },
        {
            condition: () => algParams.acai_heating_unit_count_tabs_list.length,
            formRef: acai_heating_unit_count,
            errorKey: 'acaiHeatingUnitCountErrorData',
            errorId: () => `8-${algParams.acai_heating_unit_count_tab_on}`
        },
        {
            condition: () => algParams.acai_heating_safe_tabs_list.length,
            formRef: acai_heating_safe,
            errorKey: 'acaiHeatingSafeErrorData',
            errorId: () => `8-${algParams.acai_heating_safe_tab_on}`
        },
        {
            condition: () => algParams.acai_heating_supply_temp_tabs_list.length,
            formRef: acai_heating_supply_temp,
            errorKey: 'acaiHeatingSupplyTempErrorData',
            errorId: () => `8-${algParams.acai_heating_supply_temp_tab_on}`
        },
        {
            condition: () => algParams.acai_heating_temp_press_diff_tabs_list.length,
            formRef: acai_heating_temp_press_diff,
            errorKey: 'acaiHeatingTempPressDiffErrorData',
            errorId: () => `8-${algParams.acai_heating_temp_press_diff_tab_on}`
        },
        {
            condition: () => algParams.acai_heating_pump_diff_tabs_list.length,
            formRef: acai_heating_pump_diff,
            errorKey: 'acaiHeatingPumpDiffErrorData',
            errorId: () => `8-${algParams.acai_heating_pump_diff_tab_on}`
        },
        {
            condition: () => algParams.acai_common_condition_tabs_list.length,
            formRef: acai_common_condition,
            errorKey: 'acaiCommonConditionErrorData',
            errorId: () => `8-${algParams.acai_common_condition_tab_on}`
        }
    ]
};

// 验证
const formValidate = (data?: any) => {
    nextTick(() => {
        const validateFields = validateFieldMap[algParams.firstTabOn] || [];
        Promise.all(validateFields.map(validateFormItem)).then(results => {
            if (data === ACTIVE_MENUS_ID_ENUM.ALGORITHM_LOGIC) {
                updateshellConfig();
                return;
            }

            if (results.includes(undefined)) {
                emitter.emit('confirmDisabled', { status: true, isSave: false });
            }
        });
    });
};

let isTreeChanged = ref(false);

// 深度监听 algParams.allItem 性能问题

// 深度监听 algParams.allItem 性能问题
// 监听所有的item，有不是默认值的单独放到一个数组里面

const getType = (value: any) => {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
const stringifyVal = (val: any) => {
    const hasNumber = /\d+/g.test(val);
    return ['object', 'array'].includes(getType(val))
        ? JSON.stringify(val ?? '')
        : ['null', 'undefined'].includes(getType(val))
        ? getType(val)
        : hasNumber
        ? parseFloat(`${val ?? ''}`)
        : val;
};

const checkFormItemModify = (modifyItem: any) => {
    if (!algParams.defaultItem?.length) {
        return;
    }
    const { id } = modifyItem || {};
    const cloneItem = structuredClone(modifyItem);
    const hasCache = allModifyItems.value.some((item: any) => item?.id === id);
    if (hasCache) {
        const { curValue: preValue } = allModifyItems.value.find((item: any) => item?.id === id) || {};
        const stringVal = stringifyVal(cloneItem?.curValue);
        const preSavedLeftVal = stringifyVal(preValue);
        if (stringVal !== preSavedLeftVal) {
            allModifyItems.value = allModifyItems.value.map((item: any) => {
                if (item?.id !== id) {
                    return item;
                }
                return cloneItem;
            });
        }
    } else {
        allModifyItems.value.push(cloneItem);
    }
};

const checkRestoreDefault = () => {
    const allChangedItems = allModifyItems.value.filter(v => v?.isNotDefault && v.cloneItem.editAuth);
    if (allChangedItems?.length > 0) {
        // 全部恢复默认??
        emit('defaultRestoreAll', true);
    } else {
        // 全部恢复默认??
        emit('defaultRestoreAll', false);
    }
};

const checkDisableConfirm = () => {
    const allChangedItems = allModifyItems.value.filter(v => v?.isNotPreSaved);
    isTreeChanged.value = allChangedItems?.length > 0;
    if (isTreeChanged.value) {
        formValidate();
        emitter.emit('confirmDisabled', { status: false, isSave: true });
        algParams.isErrorRandom++;
    } else {
        emitter.emit('confirmDisabled', { status: true, isSave: true });
        formValidate();
    }
};

const allNotDefaultItemIds = computed(() => {
    return allModifyItems.value.map(v => ({ id: v?.id, isNotDefault: v?.isNotDefault, curValue: v?.curValue, defaultValue: v?.defaultValue }));
});

watch(
    () => allNotDefaultItemIds.value,
    (curItem, preItem) => {
        if (isEqual(curItem, preItem)) {
            return;
        } else {
            checkRestoreDefault();
        }
    }
);

const allNotPreSavedItemIds = computed(() => {
    return allModifyItems.value.map(v => ({ id: v?.id, isNotPreSaved: v?.isNotPreSaved, curValue: v?.curValue, preSavedValue: v?.preSavedValue }));
});

watch(
    () => allNotPreSavedItemIds.value,
    (curItem, preItem) => {
        if (isEqual(curItem, preItem)) {
            return;
        } else {
            checkDisableConfirm();
        }
    }
);

watch(
    () => [
        algParams.isErrorRandom,
        algParams.isErrorData,
        algParams.coolingErrorData,
        algParams.coldHotErrorData,
        algParams.addSubtractErrorData,
        algParams.coldOutTempErrorData,
        algParams.tempPressDiffErrorData,
        algParams.diffErrorData,
        algParams.freeCoolErrorData,
        algParams.addSubtractColdErrorData,
        algParams.addSubtractHotErrorData,
        algParams.coldOutTempColdErrorData,
        algParams.coldOutTempTempErrorData,
        algParams.diffColdErrorData,
        algParams.diffHotErrorData,
        algParams.coldhotTempPressDiffCoolErrorData,
        algParams.coldhotTempPressDiffHotErrorData,
        algParams.hotTempSystemErrorData,
        algParams.hotDetaTempPressSystemErrorData,
        algParams.hotDetaTempPressPumpErrorData,
        algParams.supplyCoolErrorData,
        algParams.storageCoolErrorData,
        algParams.releaseCoolErrorData,
        algParams.commonConditionErrorData,
        algParams.coldOutErrorData,
        algParams.tempPressErrorData,
        algParams.pumpTempPressErrorData,
        algParams.centerAirHotTempSystemErrorData,
        algParams.centerAirHotTempPressureSystemErrorData,
        algParams.centerAirHotTempPressurePumpSystemErrorData,
        algParams.acahHotSetErrorData,
        algParams.acahAddErrorData,
        algParams.acahSubErrorData,
        algParams.acahSecuCalcErrorData,
        algParams.acaiCoolingUnitCountErrorData,
        algParams.acaiCoolingSupplyTempErrorData,
        algParams.acaiCoolingSafeErrorData,
        algParams.acaiCoolingTempPressDiffErrorData,
        algParams.acaiCoolingPumpDiffErrorData,
        algParams.acaiHeatingSwitchErrorData,
        algParams.acaiHeatingUnitCountErrorData,
        algParams.acaiHeatingSafeErrorData,
        algParams.acaiHeatingSupplyTempErrorData,
        algParams.acaiHeatingTempPressDiffErrorData,
        algParams.acaiHeatingPumpDiffErrorData,
        algParams.acaiCommonConditionErrorData,
        algParams.acccFreqErrorData,
        algParams.outWetBallTempAcccErrorData,
        algParams.controlGroupFreqErrorData,
        algParams.outWetBallTempErrorData
    ],
    (newVal: any) => {
        for (let i = 0; i < newVal.length; i++) {
            if (newVal[i] instanceof Array) {
                let arr = [];
                arr = newVal[i].map((item: any) => {
                    return item.errorStatus;
                });
                if (arr.includes(false)) {
                    emitter.emit('confirmDisabled', { status: true, isSave: false });
                    return;
                }
            }
        }
        emitter.emit('confirmDisabled', { status: false, isSave: true });
        if (isTreeChanged.value) {
            emitter.emit('confirmDisabled', { status: false, isSave: true });
        } else {
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        }
    },
    { deep: true }
);

onMounted(() => {
    getShellConfigQuery('alg');
});
</script>
<style scoped lang="less">
@import '../styles/xshellConfigRight.less';
</style>
