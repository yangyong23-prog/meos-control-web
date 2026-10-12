<template>
    <m-form ref="Mform" label-width="" :rules="rules" :model="params" require-asterisk-position="right" scroll-to-error label-position="top">
        <m-form-item
            v-if="params.type.includes(CONSOLE_TYPES.HEAT_SUPPLY.id) || getButtonType === CONSOLE_TYPES.HEAT_SUPPLY.id"
            :label="i18n.global.t('meos_control_web.heating_time_range')"
            prop="date"
        >
            <m-date-picker
                v-model="params.date"
                class="mt4"
                type="daterange"
                :scope="`${dayTz().add(1, 'day')} - ${dayTz().add(1, 'year').endOf('year')}`"
                :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                @change="handleChange"
            ></m-date-picker>
        </m-form-item>

        <m-form-item v-if="getButtonType === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id" :label="i18n.global.t('meos_control_web.time_range')" prop="date2">
            <m-date-picker
                v-model="params.date2"
                class="mt4"
                type="daterange"
                :scope="`${dayTz().add(1, 'day')} - ${dayTz().add(1, 'year').endOf('year')}`"
                :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                @change="handleChange"
            ></m-date-picker>
        </m-form-item>
        <div style="width: 100%; text-align: right">
            <m-button @click="clearValidate">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="danger" class="ml12" style="margin-left: 12px" @click="sumbit">{{ i18n.global.t('common.delete') }}</m-button>
        </div>
    </m-form>
</template>
<script setup>
import dayjs from 'dayjs';
import { MMessageBox, $Message } from 'meri-plus';
import { batchRemoveStrategy } from '@/apis/ACAC';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { SYSTEM_CLASS_CODE, CONSOLE_TYPES } from '../../constant/variable';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
import { dayTz } from '@/utils/dayjsTools';

const init = inject('init');
const props = defineProps({
    currentSystem: {
        type: Object,
        default: () => {}
    }
});
const params = ref({
    type: [],
    date: '',
    date1: '',
    date2: ''
});
const rules = ref({
    type: { type: 'array', required: true, message: i18n.global.t('meos_control_web.input_required_check_error_4'), trigger: 'change' },
    date: { required: true, message: i18n.global.t('meos_control_web.input_required_check_error_4'), trigger: 'change' },
    date1: { required: true, message: i18n.global.t('meos_control_web.input_required_check_error_4'), trigger: 'change' },
    date2: { required: true, message: i18n.global.t('meos_control_web.input_required_check_error_4'), trigger: 'change' }
});
const getButtonType = computed(() => {
    // if (props.currentSystem.isShowCoolStore && props.currentSystem.unHideCoolingControl && props.currentSystem.consoleTypes !== CONSOLE_TYPES.AIR_TERMINAL_ZONE.id) {
    //     return 'dropdown';
    // } else if (props.currentSystem.isShowCoolStore && !props.currentSystem.unHideCoolingControl && props.currentSystem.consoleTypes === 'COOL_SUPPLY') {
    //     return 'coolSupply';
    // } else if (!props.currentSystem.isShowCoolStore && props.currentSystem.unHideCoolingControl && props.currentSystem.consoleTypes === 'COOL_INPUT') {
    //     return 'coolInput';
    // } else if (props.currentSystem.consoleTypes === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id) {
    //     return 'airTerminalZone';
    // }
    return props.currentSystem.consoleTypes;
});
const emit = defineEmits(['showPopoverFuc', 'sumbitPopoverFuc']);
const Mform = ref(null);
const sumbit = () => {
    Mform.value.validate((valid, error) => {
        if (valid) {
            console.log(params);
            remove();
        }
    });
};
const remove = () => {
    console.log(params.value.date.split('-')[0]);
    const objData = {
        projectId: baseStore().projectId,
        systemType: SYSTEM_CLASS_CODE,
        objectId: props.currentSystem.consoleTypes !== CONSOLE_TYPES.AIR_TERMINAL_ZONE.id ? props.currentSystem.systemId : '',
        systemId: props.currentSystem.systemId,
        heatSupplyBeginDate: params.value.date.split('-')[0] ? dayjs(params.value.date.split('-')[0]).format('YYYY-MM-DD') : '',
        heatSupplyEndDate: params.value.date.split('-')[1] ? dayjs(params.value.date.split('-')[1]).format('YYYY-MM-DD') : '',
        airTerminalBeginDate: params.value.date2.split('-')[0] ? dayjs(params.value.date2.split('-')[0]).format('YYYY-MM-DD') : '',
        airTerminalEndDate: params.value.date2.split('-')[0] ? dayjs(params.value.date2.split('-')[1]).format('YYYY-MM-DD') : ''
    };

    MMessageBox({
        type: 'danger',
        title: i18n.global.t('meos_control_web.acknowledge_delete'),
        customClass: 'customClass',
        confirmButtonText: i18n.global.t('common.delete'),
        message: `${i18n.global.t('meos_control_web.delete_future_strategy_stopped_dup')}`,
        hasLoading: true,
        beforeClose: (action, data, done) => {
            if (action === 'confirm') {
                batchRemoveStrategy(objData)
                    .then(res => {
                        if (res.code === SUCCESSCODE) {
                            $Message.success(i18n.global.t('common.operation_success'));
                            init(true);
                            emit('sumbitPopoverFuc');
                        }
                    })
                    .finally(() => {
                        done();
                    });
            } else {
                done();
            }
        }
    });
};
const clearValidate = () => {
    emit('showPopoverFuc');
};
</script>
<style lang="less" scoped></style>
