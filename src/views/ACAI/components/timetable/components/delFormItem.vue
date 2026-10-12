<template>
    <m-form ref="Mform" label-width="" :rules="rules" :model="params" require-asterisk-position="right" scroll-to-error label-position="top">
        <m-form-item v-if="isCreationDropdown" :label="i18n.global.t('meos_control_web.please_select_schedule_to_delete')" prop="type">
            <m-checkbox-group v-model="params.type">
                <m-checkbox v-for="(type, index) in excludedAirTypes" :key="type" :class="{ ml16: index > 0 }" :label="type">{{
                    i18n.global.t('meos_control_web.name_timetable', { name: CONSOLE_TYPE_MAP[type].name })
                }}</m-checkbox>
                <!-- <m-checkbox :label="'HEAT_SUPPLY'" class="ml16">{{ i18n.global.t('meos_control_web.cold_storage_schedule') }}</m-checkbox> -->
            </m-checkbox-group>
        </m-form-item>
        <m-form-item
            v-if="params.type.includes('COOL_SUPPLY') || (!isCreationDropdown && curConsoleType === 'COOL_SUPPLY')"
            :label="i18n.global.t('meos_control_web.cooling_time_range')"
            prop="date"
        >
            <m-date-picker
                v-model="params.date"
                class="mt4"
                type="daterange"
                :scope="`${getDayjsTz().add(1, 'day')} - ${getDayjsTz().add(1, 'year').endOf('year')}`"
                :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                @change="handleChange"
            ></m-date-picker>
        </m-form-item>
        <m-form-item
            v-if="params.type.includes('HEAT_SUPPLY') || (!isCreationDropdown && curConsoleType === 'HEAT_SUPPLY')"
            :label="i18n.global.t('meos_control_web.heating_time_range')"
            prop="date1"
        >
            <m-date-picker
                v-model="params.date1"
                class="mt4"
                type="daterange"
                :scope="`${getDayjsTz().add(1, 'day')} - ${getDayjsTz().add(1, 'year').endOf('year')}`"
                :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                @change="handleChange"
            ></m-date-picker>
        </m-form-item>
        <m-form-item v-if="curConsoleType === 'AIR_TERMINAL_ZONE'" :label="i18n.global.t('meos_control_web.time_range')" prop="date2">
            <m-date-picker
                v-model="params.date2"
                class="mt4"
                type="daterange"
                :scope="`${getDayjsTz().add(1, 'day')} - ${getDayjsTz().add(1, 'year').endOf('year')}`"
                :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                @change="handleChange"
            ></m-date-picker>
        </m-form-item>
        <div style="width: 100%; gap: 12px; display: flex; justify-content: flex-end">
            <m-button @click="clearValidate">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="danger" @click="sumbit">{{ i18n.global.t('common.delete') }}</m-button>
        </div>
    </m-form>
</template>
<script setup>
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { MMessageBox, $Message } from 'meri-plus';
import { batchRemoveStrategy } from '@/apis/ACAC';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { CONSOLE_TYPE_MAP } from '../../../variables';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
import { isCreationDropdownKey, excludedAirTypesKey } from '../../../hooks/useTimetableHook';

const init = inject('init');
const isCreationDropdown = inject(isCreationDropdownKey);
const excludedAirTypes = inject(excludedAirTypesKey);
const props = defineProps({
    currentSystem: {
        type: Object,
        default: () => {}
    },
    systemType: {
        type: String,
        default: ''
    },
    curConsoleType: {
        type: String,
        default: ''
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

const emit = defineEmits(['showPopoverFuc', 'sumbitPopoverFuc']);
const Mform = ref(null);
const sumbit = () => {
    Mform.value.validate((valid, error) => {
        if (valid) {
            remove();
        }
    });
};
const remove = () => {
    const objData = {
        projectId: baseStore().projectId,
        systemType: props.systemType,
        objectId: props.curConsoleType !== 'AIR_TERMINAL_ZONE' ? props.currentSystem.systemId : '',
        systemId: props.currentSystem.systemId,
        coolSupplyBeginDate: params.value.date.split('-')[0] ? dayjs(params.value.date.split('-')[0]).format('YYYY-MM-DD') : '',
        coolSupplyEndDate: params.value.date.split('-')[1] ? dayjs(params.value.date.split('-')[1]).format('YYYY-MM-DD') : '',
        airTerminalBeginDate: params.value.date2.split('-')[0] ? dayjs(params.value.date2.split('-')[0]).format('YYYY-MM-DD') : '',
        airTerminalEndDate: params.value.date2.split('-')[0] ? dayjs(params.value.date2.split('-')[1]).format('YYYY-MM-DD') : '',
        heatSupplyBeginDate: params.value.date1.split('-')[0] ? dayjs(params.value.date1.split('-')[0]).format('YYYY-MM-DD') : '',
        heatSupplyEndDate: params.value.date1.split('-')[0] ? dayjs(params.value.date1.split('-')[1]).format('YYYY-MM-DD') : ''
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
