<template>
    <div class="content-header">
        <div v-if="tabList?.length" class="tab-wrap">
            <m-tabs :model-value="tabId" :data="tabList" @update:model-value="changeTabs" />
        </div>
        <div v-else class="tab-wrap fc">{{ i18n.global.t('meos_control_web.demand_auto_calc_condition') }}</div>
        <div v-if="tabList?.length" class="btn-wrap fc">
            <div class="btn-wrap fc">
                <div>
                    <m-tips :content="i18n.global.t('meos_control_web.restore_adjusted_params_to_default')" theme="darkTransparent">
                        <m-button type="link" size="medium">{{ i18n.global.t('meos_control_web.batch_restore_default') }}</m-button></m-tips
                    >
                </div>
                <div v-show="show" class="fc">
                    <div class="get-line ml4 mr4"></div>
                    <m-button type="link" size="medium">{{ i18n.global.t('meos_control_web.batch_edit') }}</m-button>
                </div>
            </div>
        </div>
    </div>
    <template v-if="tabList?.length">
        <main class="content-main">
            <m-scrollbar box-class="box-scrollbar">
                <div v-for="(items, indexs) in dataArr" :key="indexs + 'w'">
                    <div v-if="items.groupType" class="f14 fb7 mb12 fcb" style="height: 32px">
                        <div class="title-item">{{ items.groupName }}</div>
                        <m-button v-show="items.batchButton && indexs == 0" type="link" size="medium">{{ i18n.global.t('meos_control_web.batch_edit') }}</m-button>
                    </div>
                    <div v-for="(item, index) in items.shellParam" :key="index" class="content-main-item mb24">
                        <div v-if="item.configType == '0'">
                            <publicFormList ref="publicForm" :data-list="item.paramConfig" @restore-default="restoreDefault" />
                        </div>
                        <div v-if="item.configType == '1'">
                            <div v-for="(io, iv) in item.instanceInfo" :key="iv">
                                <div class="fb7 f14 mb12">{{ io.instanceName }}</div>
                                <publicFormList ref="publicForm" :data-list="io.paramConfig" @restore-default="restoreDefault" />
                            </div>
                        </div>
                    </div>
                </div>
            </m-scrollbar>
        </main>
        <footer>
            <div style="padding-left: 24px">
                <m-button type="primary" @click="confirm">{{ i18n.global.t('meos_control_web.acknowledge') }}</m-button>
                <m-button type="default" @click="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
            </div>
        </footer>
    </template>
    <empty v-else />
    <m-modal
        v-model:visible="algParams.showleave"
        :append-to="$modalAppendTo"
        type="info"
        :title="i18n.global.t('meos_control_web.confirm_leave')"
        :content="i18n.global.t('meos_control_web.changes_not_saved_after_leave')"
        @close="closeShowleave"
        @submit="submitShowleave"
    />
</template>
<script setup>
import publicFormList from '../publicFormList/index.vue';
import Empty from './empty.vue';
import { queryConfigParamByGroup, saveConfigParamByGroup } from '@/apis/xshellConfiguration';
import emitter from '@/utils/bus';
import i18n from '@/localization';

const tabList = inject('selectList');
const InputBlur = inject('InputBlur');
const isEdit = inject('isEdit');
const algParams = reactive({
    showleave: false,
    activeMenu: 0,
    sureId: ''
});
const dataArr = ref([]);
const tabId = ref('');
onMounted(() => {
    getQueryByGroupId();
});
tabId.value = tabList.value[0].id;
//监听输入框的值是否发送变化
watch(
    dataArr,
    (newVal, oldVal) => {
        if (newVal) {
            console.log(newVal, oldVal, 'newVal');
            isEdit.value = true;
        }
    },
    {
        deep: true
    }
);
const getQueryByGroupId = () => {
    dataArr.value = [];
    // queryConfigParamByGroup({ groupId: tabId.value }).then(res => {});
    //四级和标题都有的的情况
    // const arr = [
    //     {
    //         groupId: '59',
    //         groupName: '加机逻辑条件',
    //         groupType: true,
    //         batchButton: true,
    //         shellParam: [
    //             {
    //                 instanceId: '6',
    //                 instanceName: '中央供冷系统01号',
    //                 instanceType: 'SYSTEM',
    //                 dimensionality: 'INSTANCE',
    //                 params: [
    //                     {
    //                         code: '00000',
    //                         name: '史冷机负载率最大值少工前',
    //                         range: '0,100',
    //                         hint: '范围：（0%~100%）',
    //                         unit: '%',
    //                         value: '55',
    //                         defaultValues: '30',
    //                         step: 5,
    //                         controlStyle: 'COMMON_INPUT',
    //                         decimalPlaces: '0',
    //                         desc: '设置的冷机负载率最大值，用于加机条件',
    //                         level: '0'
    //                     },
    //                     {
    //                         code: 'alg_coldhot_out_temp_default_heat',
    //                         scene: 'alg',
    //                         group: 'group_alg_cold_out_temp_hot',
    //                         tab: '冷热站自动需求计算的条件输入',
    //                         name: '出水温度设定值的默认',
    //                         unit: '℃',
    //                         defaultValues: '40',
    //                         decimalPlaces: 0,
    //                         controlStyle: 'COMMON_INPUT',
    //                         step: 1,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围（0-99）',
    //                         desc: '默认的主机出水温度设定值'
    //                     },
    //                     {
    //                         code: 'control_vrv_hot_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '供热送风温度差',
    //                         unit: '℃',
    //                         valueInputLeft: '0',
    //                         defaultValues: '10',
    //                         controlStyle: 'RADIO_BUTTON',
    //                         items: [
    //                             { key: '0', value: '是' },
    //                             { key: '1', value: '否' }
    //                         ],
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '供热送风温度设定=温度目标设定值+供热送风温度差ΔT4，用来计算供热送风温度设定'
    //                     },
    //                     {
    //                         code: 'control_vrv_wind_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '除湿送风温度差',
    //                         unit: '℃',
    //                         valueInputLeft: ['0', '1', '2'],
    //                         controlStyle: 'CHECKBOX',
    //                         items: [
    //                             { key: '0', value: '离心式冷水机组1' },
    //                             { key: '1', value: '离心式冷水机组2' },
    //                             { key: '2', value: '离心式冷水机组3' },
    //                             { key: '3', value: '离心式冷水机组4' }
    //                         ],
    //                         defaultValues: '0,1',
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '除湿送风温度设定=温度目标设定值-除湿送风温度差ΔT5，用来计算除湿送风温度设定'
    //                     },
    //                     {
    //                         code: 'alg_space_error_threshold',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: 'CO₂浓度目标上限差值',
    //                         unit: '',
    //                         controlStyle: 'COMMON_INPUT',
    //                         defaultValues: '400',
    //                         step: 0,
    //                         min: 0,
    //                         decimalPlaces: 1,
    //                         max: 9999,
    //                         hint: '范围 （ 0-9999）',
    //                         desc: 'CO₂浓度目标上限设定=CO₂浓度目标设定值+ CO₂浓度目标上限差值ΔCO₂，用来判断是否触发末端CO₂模式的调节'
    //                     },
    //                     {
    //                         code: 'alg_coldhot_add_average_m',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '相对湿度目标上限差值',
    //                         controlStyle: 'COMMON_INPUT',
    //                         unit: '%',
    //                         defaultValues: '20',
    //                         step: 0,
    //                         min: 0,
    //                         max: 100,
    //                         hint: '范围 （0-100）',
    //                         desc: '相对湿度目标上限设定=相对湿度目标设定值+相对湿度目标上限差值ΔRH，用来判断是否触发末端湿度模式的调节'
    //                     },
    //                     {
    //                         code: 'control_vrv_cooling_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '冷水阀开度偏差',
    //                         unit: '%',
    //                         controlStyle: 'LIMIT_INPUT',
    //                         decimalPlaces: 0,
    //                         defaultValues: '7,12',
    //                         step: 0,
    //                         min: 0,
    //                         max: 100,
    //                         hint: '范围 （ 0-100）',
    //                         desc: '若冷水阀开度反馈在【冷水阀开度设定±ΔDchv】范围外，触发冷水阀状态反馈与指令不符报警'
    //                     },
    //                     {
    //                         code: 'alg_cooling_out_temp_threshold',
    //                         value: '13',
    //                         objectId: 'Sy1694252386245562370',
    //                         objectName: '中央供冷系统-塔楼',
    //                         scene: 'alg',
    //                         group: 'group_alg_cold_out_temp',
    //                         tab: '冷站自动需求计算的条件输入',
    //                         name: '冷冻水出水温度设定值的上下限',
    //                         unit: '℃',
    //                         defaultValues: '7',
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         controlStyle: 'COMMON_INPUT',
    //                         hint: '范围（0-99），上限≥下限',
    //                         desc: '根据不同类型系统配置自动需求的出水温度设定值的上下限(如大温差的系统，设定值可以达到6℃)'
    //                     }
    //                 ]
    //             },
    //             {
    //                 instanceId: '6',
    //                 instanceName: '中央供冷系统02号',
    //                 instanceType: 'SYSTEM',
    //                 dimensionality: 'INSTANCE',
    //                 params: [
    //                     {
    //                         code: 'control_vrv_wind_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '除湿送风温度差',
    //                         unit: '℃',
    //                         valueInputLeft: ['0', '1', '2'],
    //                         controlStyle: 'CHECKBOX',
    //                         items: [
    //                             { key: '0', value: '离心式冷水机组1' },
    //                             { key: '1', value: '离心式冷水机组2' },
    //                             { key: '2', value: '离心式冷水机组3' },
    //                             { key: '3', value: '离心式冷水机组4' }
    //                         ],
    //                         defaultValues: '0,1',
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '除湿送风温度设定=温度目标设定值-除湿送风温度差ΔT5，用来计算除湿送风温度设定'
    //                     },
    //                     {
    //                         code: 'alg_space_error_threshold',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: 'CO₂浓度目标上限差值',
    //                         unit: '',
    //                         controlStyle: 'COMMON_INPUT',
    //                         defaultValues: '400',
    //                         step: 0,
    //                         min: 0,
    //                         decimalPlaces: 1,
    //                         max: 9999,
    //                         hint: '范围 （ 0-9999）',
    //                         desc: 'CO₂浓度目标上限设定=CO₂浓度目标设定值+ CO₂浓度目标上限差值ΔCO₂，用来判断是否触发末端CO₂模式的调节'
    //                     },
    //                     {
    //                         code: 'alg_coldhot_add_average_m',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '相对湿度目标上限差值',
    //                         controlStyle: 'COMMON_INPUT',
    //                         unit: '%',
    //                         defaultValues: '20',
    //                         step: 0,
    //                         min: 0,
    //                         max: 100,
    //                         hint: '范围 （0-100）',
    //                         desc: '相对湿度目标上限设定=相对湿度目标设定值+相对湿度目标上限差值ΔRH，用来判断是否触发末端湿度模式的调节'
    //                     },
    //                     {
    //                         code: 'control_vrv_cooling_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '冷水阀开度偏差',
    //                         unit: '%',
    //                         controlStyle: 'LIMIT_INPUT',
    //                         decimalPlaces: 0,
    //                         defaultValues: '7,12',
    //                         step: 0,
    //                         min: 0,
    //                         max: 100,
    //                         hint: '范围 （ 0-100）',
    //                         desc: '若冷水阀开度反馈在【冷水阀开度设定±ΔDchv】范围外，触发冷水阀状态反馈与指令不符报警'
    //                     },
    //                     {
    //                         code: 'control_vrv_cooling_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '供冷送风温度差',
    //                         unit: '',
    //                         value: '7,12',
    //                         defaultValues: '7,12',
    //                         controlStyle: 'LIMIT_INPUT',
    //                         decimalPlaces: 0,
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '供冷送风温度设定=温度目标设定值-供冷送风温度差ΔT3，用来计算供冷送风温度设定'
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         groupId: '59',
    //         groupName: '加机逻辑条件2',
    //         isEdit: true,
    //         shellConfig: [
    //             {
    //                 instanceId: '6',
    //                 instanceName: '中央供冷系统01号',
    //                 instanceType: 'SYSTEM',
    //                 dimensionality: 'INSTANCE',
    //                 params: [
    //                     {
    //                         code: '00000',
    //                         name: '史冷机负载率最大值少工前',
    //                         range: '0,100',
    //                         hint: '范围：（0%~100%）',
    //                         unit: '%',
    //                         value: '55',
    //                         defaultValues: '30',
    //                         step: 5,
    //                         controlStyle: 'COMMON_INPUT',
    //                         decimalPlaces: '0',
    //                         desc: '设置的冷机负载率最大值，用于加机条件',
    //                         level: '0'
    //                     },
    //                     {
    //                         code: 'control_vrv_hot_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '供热送风温度差',
    //                         unit: '℃',
    //                         valueInputLeft: '0',
    //                         defaultValues: '10',
    //                         controlStyle: 'RADIO_BUTTON',
    //                         items: [
    //                             { key: '0', value: '是' },
    //                             { key: '1', value: '否' }
    //                         ],
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '供热送风温度设定=温度目标设定值+供热送风温度差ΔT4，用来计算供热送风温度设定'
    //                     },
    //                     {
    //                         code: 'control_vrv_wind_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '除湿送风温度差',
    //                         unit: '℃',
    //                         valueInputLeft: ['0', '1', '2'],
    //                         controlStyle: 'CHECKBOX',
    //                         items: [
    //                             { key: '0', value: '离心式冷水机组1' },
    //                             { key: '1', value: '离心式冷水机组2' },
    //                             { key: '2', value: '离心式冷水机组3' },
    //                             { key: '3', value: '离心式冷水机组4' }
    //                         ],
    //                         defaultValues: '0,1',
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '除湿送风温度设定=温度目标设定值-除湿送风温度差ΔT5，用来计算除湿送风温度设定'
    //                     },
    //                     {
    //                         code: 'alg_space_error_threshold',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: 'CO₂浓度目标上限差值',
    //                         unit: '',
    //                         controlStyle: 'COMMON_INPUT',
    //                         defaultValues: '400',
    //                         step: 0,
    //                         min: 0,
    //                         decimalPlaces: 1,
    //                         max: 9999,
    //                         hint: '范围 （ 0-9999）',
    //                         desc: 'CO₂浓度目标上限设定=CO₂浓度目标设定值+ CO₂浓度目标上限差值ΔCO₂，用来判断是否触发末端CO₂模式的调节'
    //                     },
    //                     {
    //                         code: 'alg_coldhot_add_average_m',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '相对湿度目标上限差值',
    //                         controlStyle: 'COMMON_INPUT',
    //                         unit: '%',
    //                         defaultValues: '20',
    //                         step: 0,
    //                         min: 0,
    //                         max: 100,
    //                         hint: '范围 （0-100）',
    //                         desc: '相对湿度目标上限设定=相对湿度目标设定值+相对湿度目标上限差值ΔRH，用来判断是否触发末端湿度模式的调节'
    //                     },
    //                     {
    //                         code: 'control_vrv_cooling_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '冷水阀开度偏差',
    //                         unit: '%',
    //                         controlStyle: 'LIMIT_INPUT',
    //                         decimalPlaces: 0,
    //                         defaultValues: '7,12',
    //                         step: 0,
    //                         min: 0,
    //                         max: 100,
    //                         hint: '范围 （ 0-100）',
    //                         desc: '若冷水阀开度反馈在【冷水阀开度设定±ΔDchv】范围外，触发冷水阀状态反馈与指令不符报警'
    //                     },
    //                     {
    //                         code: 'control_vrv_cooling_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '供冷送风温度差',
    //                         unit: '',
    //                         defaultValues: '7,12',
    //                         controlStyle: 'LIMIT_INPUT',
    //                         decimalPlaces: 0,
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '供冷送风温度设定=温度目标设定值-供冷送风温度差ΔT3，用来计算供冷送风温度设定'
    //                     }
    //                 ]
    //             },
    //             {
    //                 instanceId: '6',
    //                 instanceName: '中央供冷系统02号',
    //                 instanceType: 'SYSTEM',
    //                 dimensionality: 'INSTANCE',
    //                 params: [
    //                     {
    //                         code: '00000',
    //                         name: '史冷机负载率最大值少工前',
    //                         range: '0,100',
    //                         hint: '范围：（0%~100%）',
    //                         unit: '%',
    //                         value: '55',
    //                         defaultValues: '30',
    //                         step: 5,
    //                         controlStyle: 'COMMON_INPUT',
    //                         decimalPlaces: '0',
    //                         desc: '设置的冷机负载率最大值，用于加机条件',
    //                         level: '0'
    //                     },
    //                     {
    //                         code: 'control_vrv_hot_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '供热送风温度差',
    //                         unit: '℃',
    //                         valueInputLeft: '0',
    //                         defaultValues: '10',
    //                         controlStyle: 'RADIO_BUTTON',
    //                         items: [
    //                             { key: '0', value: '是' },
    //                             { key: '1', value: '否' }
    //                         ],
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '供热送风温度设定=温度目标设定值+供热送风温度差ΔT4，用来计算供热送风温度设定'
    //                     },
    //                     {
    //                         code: 'control_vrv_wind_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '除湿送风温度差',
    //                         unit: '℃',
    //                         valueInputLeft: ['0', '1', '2'],
    //                         controlStyle: 'CHECKBOX',
    //                         items: [
    //                             { key: '0', value: '离心式冷水机组1' },
    //                             { key: '1', value: '离心式冷水机组2' },
    //                             { key: '2', value: '离心式冷水机组3' },
    //                             { key: '3', value: '离心式冷水机组4' }
    //                         ],
    //                         defaultValues: '0,1',
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '除湿送风温度设定=温度目标设定值-除湿送风温度差ΔT5，用来计算除湿送风温度设定'
    //                     },
    //                     {
    //                         code: 'alg_space_error_threshold',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: 'CO₂浓度目标上限差值',
    //                         unit: '',
    //                         controlStyle: 'COMMON_INPUT',
    //                         defaultValues: '400',
    //                         step: 0,
    //                         min: 0,
    //                         decimalPlaces: 1,
    //                         max: 9999,
    //                         hint: '范围 （ 0-9999）',
    //                         desc: 'CO₂浓度目标上限设定=CO₂浓度目标设定值+ CO₂浓度目标上限差值ΔCO₂，用来判断是否触发末端CO₂模式的调节'
    //                     },
    //                     {
    //                         code: 'alg_coldhot_add_average_m',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '相对湿度目标上限差值',
    //                         controlStyle: 'COMMON_INPUT',
    //                         unit: '%',
    //                         defaultValues: '20',
    //                         step: 0,
    //                         min: 0,
    //                         max: 100,
    //                         hint: '范围 （0-100）',
    //                         desc: '相对湿度目标上限设定=相对湿度目标设定值+相对湿度目标上限差值ΔRH，用来判断是否触发末端湿度模式的调节'
    //                     },
    //                     {
    //                         code: 'control_vrv_cooling_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '冷水阀开度偏差',
    //                         unit: '%',
    //                         controlStyle: 'LIMIT_INPUT',
    //                         decimalPlaces: 0,
    //                         defaultValues: '7,12',
    //                         step: 0,
    //                         min: 0,
    //                         max: 100,
    //                         hint: '范围 （ 0-100）',
    //                         desc: '若冷水阀开度反馈在【冷水阀开度设定±ΔDchv】范围外，触发冷水阀状态反馈与指令不符报警'
    //                     },
    //                     {
    //                         code: 'control_vrv_cooling_temp_max',
    //                         scene: 'control',
    //                         group: 'group_control_vrv',
    //                         name: '供冷送风温度差',
    //                         unit: '',
    //                         defaultValues: '7,12',
    //                         controlStyle: 'LIMIT_INPUT',
    //                         decimalPlaces: 0,
    //                         step: 0,
    //                         min: 0,
    //                         max: 99,
    //                         hint: '范围 （0-99）',
    //                         desc: '供冷送风温度设定=温度目标设定值-供冷送风温度差ΔT3，用来计算供冷送风温度设定'
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // ];
    const arr = [
        {
            groupType: true,
            groupId: '59',
            groupName: i18n.global.t('meos_control_web.add_unit_logic_condition'),
            batchButton: true,
            shellParam: [
                {
                    configType: '0',
                    paramConfig: [
                        {
                            id: 'string',
                            projectId: 'string',
                            classCode: 'string',
                            paramGroup: 'string',
                            paramCode: '00000',
                            paramName: i18n.global.t('meos_control_web.hist_max_chiller_load_before_shift'),
                            paramType: '0',
                            paramValue: '0',
                            valueRange: i18n.global.t('meos_control_web.range_0_to_100_percent'),
                            valueTips: i18n.global.t('meos_control_web.max_chiller_load_ratio_for_add'),
                            valueStep: '5',
                            valueScale: i18n.global.t('meos_control_web.st_range_0_to_100_percent_ring'),
                            valueDefault: '30',
                            valueUnit: '%',
                            valueType: 'NUMBER',
                            paramTips: i18n.global.t('meos_control_web.max_chiller_load_ratio_for_add'),
                            remark: i18n.global.t('meos_control_web.max_chiller_load_ratio_for_add'),
                            mulInstance: [
                                {
                                    objectId: 'string',
                                    objectName: 'string'
                                }
                            ]
                        }
                    ]
                },
                {
                    configType: '1',
                    instanceInfo: [
                        {
                            instanceId: 'string',
                            instanceType: 'string',
                            instanceName: i18n.global.t('meos_control_web.instance_name'),
                            paramConfig: [
                                {
                                    id: 'string',
                                    projectId: 'string',
                                    classCode: 'string',
                                    paramGroup: 'string',
                                    paramCode: '00000',
                                    paramName: i18n.global.t('meos_control_web.hist_max_chiller_load_before_shift'),
                                    paramType: '0',
                                    paramValue: '0',
                                    valueRange: i18n.global.t('meos_control_web.range_0_to_100_percent'),
                                    valueTips: i18n.global.t('meos_control_web.max_chiller_load_ratio_for_add'),
                                    valueStep: '5',
                                    valueScale: i18n.global.t('meos_control_web.st_range_0_to_100_percent_ring'),
                                    valueDefault: '30',
                                    valueUnit: '%',
                                    valueType: 'NUMBER',
                                    paramTips: i18n.global.t('meos_control_web.max_chiller_load_ratio_for_add'),
                                    remark: i18n.global.t('meos_control_web.max_chiller_load_ratio_for_add'),
                                    mulInstance: [
                                        {
                                            objectId: 'string',
                                            objectName: 'string'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    //有标题的情况
    dataArr.value = arr;
    // algParams.dataArr = [];
};

// 恢复默认
const restoreDefault = item => {
    console.log(item);
};
// 二次弹框取消
const closeShowleave = () => {
    algParams.showleave = false;
};
//顶部tabs切换事件
const changeTabs = item => {
    algParams.sureId = item;
    if (isEdit.value) {
        algParams.showleave = true;
    }
};
const publicForm = ref(null);
const confirm = () => {
    publicForm.value.forEach(element => {
        element.Mform.validate((valid, error) => {
            console.log(valid, error);
        });
    });
};
// 二次弹框提交
const submitShowleave = () => {
    tabId.value = algParams.sureId;
    getQueryByGroupId();
};
</script>
<style lang="less" scoped>
.content-header {
    border-bottom: 1px solid @grey-200;
    height: 50px;
    padding: 8px 28px 0 16px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .tab-wrap {
        // background: red;
        // display: flex;
        // align-items: end;
    }
    .btn-wrap {
        // background: red;
    }
    .get-line {
        width: 1px;
        height: 14px;
        background: #d9d9d9;
    }
}
.content-main {
    padding: 24px 10px 24px 28px;
    height: calc(100% - 115px);
    overflow: hidden;
    &-item {
        border-radius: 4px;
        background: var(--gray-50, #f7f9fa);
        padding: 20px 16px;
        min-width: 1106px;
    }
    .title-item {
        position: relative;
        margin-left: 10px;

        &::before {
            position: absolute;
            width: 3px;
            height: 14px;
            background: #246fe5;
            left: -10px;
            top: 3px;
            content: '';
        }
    }
    :deep(.box-scrollbar) {
        padding-right: 18px !important;
    }
}

footer {
    box-sizing: border-box;
    height: 64px;
    line-height: 64px;
    // padding-left: 60px;
    border-top: 1px solid var(--gray-grey-300, #e1e5eb);
    // position: fixed;
    // bottom: 0;
    // right: 0;
    width: 100%;
    .m-button {
        margin-right: 12px;
    }
}
</style>
