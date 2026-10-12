<template>
    <div class="flow-demand-config-list">
        <div v-for="(row, index) in flowDemandList" :key="row.key || index" class="row-box">
            <div class="field-label">{{ i18n.global.t('meos_control_web.select_chiller_or_heat_exchanger_range') }}</div>
            <m-form-item
                class="row-field-item"
                :prop="'row.' + index + '.selected'"
                :item-model="row.selected"
                :rules="[
                    {
                        validator: (value, rule, callback) => validateSelect(row, callback),
                        trigger: ['change']
                    }
                ]"
            >
                <m-select
                    v-model="row.selected"
                    class="field-control select-control"
                    :size="150"
                    :menu-size="240"
                    :options="getDynamicOptions(row)"
                    multiple
                    clearable
                    panel-searchable
                    has-confirm
                    has-check-all
                    @confirm="handleRowChange"
                    @clear="handleRowChange('selected', [], row)"
                >
                    <template v-for="optionItem in getDynamicOptions(row)" :key="optionItem.id">
                        <m-option :value="optionItem.id" :label="optionItem.name" :disabled="optionItem.disabled">
                            <m-tips :content="i18n.global.t('meos_control_web.selected_in_other_group')" :disabled="!optionItem.disabled" theme="darkTransparent">
                                {{ optionItem.name }}
                            </m-tips>
                        </m-option>
                    </template>
                </m-select>
            </m-form-item>

            <div class="field-label">{{ i18n.global.t('meos_control_web.chilled_side_flow_factor') }}</div>
            <m-form-item
                class="row-field-item"
                :prop="'row.' + index + '.chillFlowFactor'"
                :item-model="row.chillFlowFactor"
                :rules="[
                    {
                        validator: (value, rule, callback) => validateFactor(row, 'chillFlowFactor', callback),
                        trigger: ['blur', 'change']
                    }
                ]"
            >
                <m-input-number
                    v-model="row.chillFlowFactor"
                    class="field-control number-control"
                    :precision="2"
                    :disabled="!hasSelectedObjects(row)"
                    :min="0"
                    :max="10"
                    :size="90"
                    text-align="left"
                    controls="rightButton"
                    @change="handleRowChange"
                />
            </m-form-item>

            <div class="field-label">{{ i18n.global.t('meos_control_web.cooling_side_flow_factor') }}</div>
            <m-form-item
                class="row-field-item"
                :prop="'row.' + index + '.coolingFlowFactor'"
                :item-model="row.coolingFlowFactor"
                :rules="[
                    {
                        validator: (value, rule, callback) => validateFactor(row, 'coolingFlowFactor', callback),
                        trigger: ['blur', 'change']
                    }
                ]"
            >
                <m-input-number
                    v-model="row.coolingFlowFactor"
                    class="field-control number-control"
                    :precision="2"
                    :disabled="!hasSelectedObjects(row)"
                    :min="0"
                    :max="10"
                    :size="90"
                    text-align="left"
                    controls="rightButton"
                    @change="handleRowChange"
                />
            </m-form-item>

            <div class="field-label">{{ i18n.global.t('meos_control_web.cooling_tower_heat_dissipation_factor') }}</div>
            <m-form-item
                class="row-field-item"
                :prop="'row.' + index + '.towerFlowFactor'"
                :item-model="row.towerFlowFactor"
                :rules="[
                    {
                        validator: (value, rule, callback) => validateFactor(row, 'towerFlowFactor', callback),
                        trigger: ['blur', 'change']
                    }
                ]"
            >
                <m-input-number
                    v-model="row.towerFlowFactor"
                    class="field-control number-control"
                    :precision="2"
                    :disabled="!hasSelectedObjects(row)"
                    :min="0"
                    :max="10"
                    :size="90"
                    text-align="left"
                    controls="rightButton"
                    @change="handleRowChange"
                />
            </m-form-item>

            <m-tips :content="i18n.global.t('common.delete')" theme="darkTransparent">
                <svg v-if="showRemove" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="icon-delete" @click="removeRow(row.key)">
                    <rect x="3.92871" y="3.12109" width="16.1437" height="1.61437" rx="0.807187" fill="#1B2129" />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.5781 6.08057H6.426C6.37838 6.08057 6.33079 6.08267 6.28336 6.08688C5.39525 6.16566 4.73916 6.94947 4.81794 7.83758L5.8442 19.4073C5.91809 20.2403 6.61594 20.879 7.45226 20.879H16.5769C17.4146 20.879 18.1131 20.2383 18.1853 19.4038L19.1865 7.83412C19.1905 7.78783 19.1925 7.7414 19.1925 7.69494C19.1925 6.80335 18.4697 6.08057 17.5781 6.08057ZM7.45226 19.2646L6.426 7.69494H17.5781L16.5769 19.2646H7.45226Z"
                        fill="#1B2129"
                    />
                    <rect x="11.2666" y="9.78027" width="1.61437" height="8.13914" rx="0.807187" fill="#8B949E" />
                </svg>
            </m-tips>
        </div>

        <div v-if="!disableAdd" class="actions">
            <m-button type="link" size="medium" icon="IconMeriComponentButtonAdd" @click="addRow">{{ i18n.global.t('meos_control_web.add') }}</m-button>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { FLOW_DEMAND_PARAM_FIELDS } from '../../constants/constant';

const props = defineProps({
    options: {
        type: Array,
        default: () => []
    }
});

const flowDemandList = defineModel({ type: Array });
const emits = defineEmits(['change']);

const createEmptyRow = () => ({
    key: new Date().toISOString(),
    selected: undefined,
    chillFlowFactor: undefined,
    coolingFlowFactor: undefined,
    towerFlowFactor: undefined
});

const normalizeNumericValue = value => {
    if (value === '' || value === null || value === undefined) {
        return undefined;
    }
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
};

const normalizeRow = row => {
    const nextRow = {
        key: row?.key || new Date().toISOString()
    };
    if ((row?.selected?.length ?? 0) > 0) {
        nextRow.selected = row.selected;
    }
    FLOW_DEMAND_PARAM_FIELDS.forEach(field => {
        const value = normalizeNumericValue(row?.[field]);
        if (value !== undefined) {
            nextRow[field] = value;
        }
    });
    return nextRow;
};

const ensureRows = rows => {
    if (!Array.isArray(rows) || rows.length === 0) {
        flowDemandList.value = [createEmptyRow()];
        return;
    }
    const hasMissingKey = rows.some(row => !row?.key);
    const hasMissingFields = rows.some(
        row => !Object.prototype.hasOwnProperty.call(row || {}, 'selected') || !FLOW_DEMAND_PARAM_FIELDS.every(field => Object.prototype.hasOwnProperty.call(row || {}, field))
    );
    if (!hasMissingKey && !hasMissingFields) {
        return;
    }
    flowDemandList.value = rows.map(row => ({
        ...createEmptyRow(),
        ...row,
        key: row?.key || new Date().toISOString()
    }));
};

const disableAdd = computed(() => flowDemandList.value.length === 20);
const showRemove = computed(() => flowDemandList.value.length > 1);

const getDynamicOptions = computed(() => row => {
    const selectedIds = flowDemandList.value.map(item => item.selected || []).flat();
    const options = Array.isArray(props.options) ? props.options : [];
    return options.map(option => ({
        ...option,
        disabled: selectedIds.includes(option.id) && !row.selected?.includes(option.id)
    }));
});

const hasSelectedObjects = row => (row?.selected?.length ?? 0) > 0;

// const hasFactorValue = row => FLOW_DEMAND_PARAM_FIELDS.some(field => normalizeNumericValue(row?.[field]) !== undefined);

const isAllFactorsEmpty = row => FLOW_DEMAND_PARAM_FIELDS.every(field => normalizeNumericValue(row?.[field]) === undefined);

const isValidFactorValue = value => {
    const normalizedValue = normalizeNumericValue(value);
    if (normalizedValue === undefined) {
        return true;
    }
    const decimalPart = String(value).split('.')[1] || '';
    return decimalPart.length <= 2 && normalizedValue >= 0 && normalizedValue <= 10;
};

const validateSelect = (row, callback) => {
    // if (hasFactorValue(row) && !hasSelectedObjects(row)) {
    //     callback(new Error(i18n.global.t('meos_control_web.please_select_at_least_one_object')));
    //     return;
    // }
    callback();
};

const validateFactor = (row, field, callback) => {
    const value = row?.[field];

    if (isAllFactorsEmpty(row) && hasSelectedObjects(row)) {
        // 请至少输入一个系数
        callback(new Error(i18n.global.t('meos_control_web.please_input_at_least_one_factor')));
        return;
    }

    // 如果输入了值，则校验值的合法性；如果未输入值，则不校验，允许为空
    if (normalizeNumericValue(value) === undefined) {
        callback();
        return;
    }

    if (!isValidFactorValue(value)) {
        callback(new Error(i18n.global.t('meos_control_web.flow_factor_range_0_10_two_decimals')));
        return;
    }
    callback();
};

const emitChange = () => {
    emits('change', Array.isArray(flowDemandList.value) ? flowDemandList.value.map(row => normalizeRow(row)) : []);
};

const handleRowChange = (field, value, row) => {
    if (field === 'selected' && Array.isArray(value) && value.length === 0) {
        // 如果是清空选择，则同时清空系数输入
        flowDemandList.value = flowDemandList.value.map(r => {
            if (r.key === row?.key) {
                return {
                    ...r,
                    selected: [],
                    chillFlowFactor: undefined,
                    coolingFlowFactor: undefined,
                    towerFlowFactor: undefined
                };
            }
            return r;
        });
    }
    emitChange();
};

const addRow = () => {
    if (flowDemandList.value.length >= 20) {
        return;
    }
    flowDemandList.value = [...flowDemandList.value, createEmptyRow()];
};

const removeRow = rowKey => {
    const nextRows = flowDemandList.value.filter(row => row.key !== rowKey);
    flowDemandList.value = nextRows.length ? nextRows : [createEmptyRow()];
};

watch(
    () => flowDemandList.value,
    value => {
        ensureRows(value);
    },
    {
        immediate: true,
        deep: true
    }
);

watch(
    () => flowDemandList.value,
    () => {
        emitChange();
    },
    {
        deep: true
    }
);
</script>

<style lang="less" scoped>
.flow-demand-config-list {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    gap: 16px;
}

.row-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 8px;
    gap: 16px;
    border-radius: 4px;
    background: var(--gray-100, #f1f4f6);
}

.row-field-item {
    margin-bottom: 0;
}

.field-label {
    flex: 0 0 auto;
    color: #1b2129;
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
}

.field-control {
    flex: 0 0 auto;
}

.select-control {
    width: 150px;
}

.number-control {
    width: 90px;
}

.icon-delete {
    cursor: pointer;
}

.actions {
    display: flex;
    align-items: center;
}
</style>
