<template>
    <div class="multiple-rows-form-list">
        <div v-for="(row, index) in multipleRowsList" :key="index" class="row-box">
            <m-form-item
                :label="rangeLabel"
                :prop="'row.' + index + '.selected'"
                :item-model="row.selected"
                :rules="[
                    {
                        validator: (value, rule, callback) => validateSelect(row.key, callback),
                        trigger: ['change']
                    }
                ]"
            >
                <m-select
                    v-model="row.selected"
                    :size="340"
                    :menu-size="240"
                    :options="getDynamicOptions(row)"
                    multiple
                    clearable
                    panel-searchable
                    has-confirm
                    has-check-all
                    @confirm="val => resetCount(val, row.key)"
                    @clear="resetCount([], row.key)"
                >
                    <template v-for="optionItem in getDynamicOptions(row)" :key="optionItem.id">
                        <m-option :value="optionItem.id" :label="optionItem.name" :disabled="optionItem.disabled">
                            <m-tips :content="`${i18n.global.t('meos_control_web.chiller_no_duplicate_selection')}`" :disabled="!optionItem.disabled" theme="darkTransparent">{{
                                optionItem.name
                            }}</m-tips>
                        </m-option>
                    </template>
                </m-select>
            </m-form-item>

            <m-form-item
                :label="secondFieldLabel"
                :prop="'row.' + index + '.' + secondFieldKey"
                :item-model="row[secondFieldKey]"
                :rules="[
                    {
                        validator: (value, rule, callback) => validateSecondField(row, callback),
                        trigger: ['blur', 'change']
                    }
                ]"
            >
                <m-tips :content="`${pleaseSelectLabel}`" theme="darkTransparent" :disabled="(row?.selected?.length ?? 0) > 1">
                    <div v-if="(row?.selected?.length ?? 0) < 2" class="hidden-mask"></div>
                </m-tips>
                <m-select
                    v-if="!isIntervalRule"
                    v-model="row.countLimit"
                    :options="
                        (row?.selected?.length ?? 0) < 2
                            ? []
                            : [...rangeGenerator(row?.selected?.length, 1)].map(v => {
                                  return { id: v, name: v };
                              })
                    "
                    :disabled="(row?.selected?.length ?? 0) < 2"
                    :size="270"
                    clearable
                >
                </m-select>
                <m-input-number
                    v-else
                    v-model="row.intervalTime"
                    :disabled="(row?.selected?.length ?? 0) < 2"
                    :size="270"
                    text-align="left"
                    controls="rightButton"
                    :precision="0"
                    :min="gapTimeSetting.MIN"
                    :max="gapTimeSetting.MAX"
                    :step="gapTimeSetting.STEP"
                    clearable
                >
                    <template #suffix>{{ gapTimeSetting.UNIT }}</template>
                </m-input-number>
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
import { rangeGenerator } from '@/utils';
import i18n from '@/localization';

const props = defineProps({
    options: {
        type: Array,
        default: () => []
    },
    ruleMode: {
        type: String,
        default: 'countLimit'
    },
    rangeSelectFree: {
        type: Boolean,
        default: false
    },
    showHostName: {
        type: Boolean,
        default: false
    }
});
const SELECT_HOST_RANGE = i18n.global.t('meos_control_web.select_host_range');
const PLEASE_SELECT_HOST_RANGE_FIRST = i18n.global.t('meos_control_web.please_select_host_range_first');
const PLEASE_SELECT_AT_LEAST_TWO_HOSTS = i18n.global.t('meos_control_web.please_select_at_least_two_hosts');

const SELECT_CHILLER_RANGE = i18n.global.t('meos_control_web.select_chiller_range');
const PLEASE_SELECT_CHILLER_RANGE_FIRST = i18n.global.t('meos_control_web.please_select_chiller_range_first');
const PLEASE_SELECT_AT_LEAST_TWO_CHILLERS = i18n.global.t('meos_control_web.please_select_at_least_two_chillers');

const pleaseSelectLabel = computed(() => {
    return props.showHostName ? PLEASE_SELECT_HOST_RANGE_FIRST : PLEASE_SELECT_CHILLER_RANGE_FIRST;
});
const selectAtLeastTwoLabel = computed(() => {
    return props.showHostName ? PLEASE_SELECT_AT_LEAST_TWO_HOSTS : PLEASE_SELECT_AT_LEAST_TWO_CHILLERS;
});
const rangeLabel = computed(() => {
    return props.showHostName ? SELECT_HOST_RANGE : SELECT_CHILLER_RANGE;
});

const gapTimeSetting = {
    MIN: 0,
    MAX: 900,
    UNIT: 's',
    STEP: 1
};

// [{key:string,selected?:string[],countLimit?:number | string,intervalTime?:number | string}]
const multipleRowsList = defineModel({ type: Array });
const emits = defineEmits(['change']);
const isIntervalRule = computed(() => props.ruleMode === 'intervalTime');
const secondFieldKey = computed(() => (isIntervalRule.value ? 'intervalTime' : 'countLimit'));
const secondFieldLabel = computed(() => (isIntervalRule.value ? i18n.global.t('meos_control_web.interval_time_min') : i18n.global.t('meos_control_web.max_start_units')));

const disableAdd = computed(() => multipleRowsList.value.length === 20);
const showRemove = computed(() => multipleRowsList.value.length > 1);

const getDynamicOptions = computed(() => row => {
    const selectedIds = multipleRowsList.value.map(item => item.selected || [])?.flat();

    return props.options.map(v => {
        const disabled = selectedIds.includes(v.id) && !row.selected?.includes(v.id);
        return { ...v, disabled: props.rangeSelectFree ? false : disabled };
    });
});

const validateSelect = (rowKey, callback) => {
    const { selected: rowValue } = multipleRowsList.value.find(it => it.key === rowKey) || {};
    if (rowValue?.length && (rowValue?.length ?? 0) < 2) {
        callback(new Error(selectAtLeastTwoLabel.value));
    } else {
        callback();
    }
};

const validateSecondField = (row, callback) => {
    if (!isIntervalRule.value) {
        callback();
        return;
    }
    const hasSelected = (row?.selected?.length ?? 0) > 1;
    if (!hasSelected) {
        callback();
        return;
    }
    const intervalTime = row?.intervalTime;
    if (intervalTime === '' || intervalTime === undefined || intervalTime === null) {
        callback(new Error(i18n.global.t('meos_control_web.please_input_interval_time')));
        return;
    }
    const num = Number(intervalTime);
    if (!Number.isInteger(num) || num < gapTimeSetting.MIN || num > gapTimeSetting.MAX) {
        callback(new Error(i18n.global.t('meos_control_web.please_input_integer_range_0_900')));
        return;
    }
    callback();
};

const resetCount = (val, rowKey) => {
    const list = multipleRowsList.value.map(it => {
        if (it.key !== rowKey) {
            return it;
        }
        return { ...it, [secondFieldKey.value]: undefined };
    });
    multipleRowsList.value = list;
};

const addRow = () => {
    const newId = new Date().toISOString();
    const newItem = {
        key: newId,
        selected: undefined,
        [secondFieldKey.value]: undefined
    };
    const newItems = [...multipleRowsList.value, newItem];

    if (newItems.length > 20) {
        return;
    }
    multipleRowsList.value = newItems;
};

const removeRow = rowKey => {
    const list = multipleRowsList.value.filter(it => it.key !== rowKey);
    if (list.length === 0) {
        return;
    }
    multipleRowsList.value = list;
};

watch(
    () => multipleRowsList.value,
    val => {
        const cloneVal = structuredClone(val);
        const final = Array.isArray(cloneVal)
            ? cloneVal.map(v => {
                  const { countLimit, intervalTime } = v || {};
                  const cloneItem = { ...v };
                  if (countLimit === null || countLimit === undefined) {
                      delete cloneItem.countLimit;
                  }
                  if (intervalTime === null || intervalTime === undefined) {
                      delete cloneItem.intervalTime;
                  }

                  return cloneItem;
              })
            : cloneVal;
        emits('change', final);
    },
    {
        deep: true
    }
);
</script>

<style lang="less" scoped>
.multiple-rows-form-list {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    gap: 16px;
}
.row-box {
    display: flex;
    align-items: center;
    padding: 8px;
    gap: 16px;
    border-radius: 4px;
    background: var(--gray-100, #f1f4f6);

    :deep(.m-form-item) {
        margin-bottom: 0px;
    }

    // :deep(.m-select-tag-content) {
    //     color: var(--gray-900, #1b2129);

    //     font-size: 14px;
    //     font-style: normal;
    //     font-weight: 400;
    //     line-height: 22px;
    //     background: var(--gray-200, #e8ecf0);
    // }

    .icon-delete {
        cursor: pointer;
    }
}

.actions {
    display: flex;
    align-items: center;
}

.hidden-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    cursor: not-allowed;
}
</style>
