<template>
    <div v-show="props.showEnableConfig" class="env-first-row">
        <div :class="['show-condition', showPressureDiff === SHOW_PRESSURE_DIFF_ENUM.YES ? 'show-border-bottom' : '']">
            <div class="left-label">{{ i18n.global.t('meos_control_web.enable_standard_configuration_for_pressure_diff') }}</div>
            <m-radio-group v-model="showPressureDiff">
                <div class="list">
                    <m-radio v-for="item in radioOptions" :key="item" class="f14" :label="item.value">{{ item.label }}</m-radio>
                </div>
            </m-radio-group>
        </div>
    </div>
    <div v-show="showPressureDiff === SHOW_PRESSURE_DIFF_ENUM.YES" :id="editScopeKey" class="temperature">
        <div :class="['temperature-item', rightConfigExpand ? 'f mh96' : 'mh128']">
            <div style="width: 100px">{{ i18n.global.t('meos_control_web.pressure_diff_standard') }}</div>
            <div :class="[rightConfigExpand ? 'ml12' : 'mt40', 'box-line', 'fcc']" :style="{ width: '100%', maxWidth: '1000px' }">
                <div class="fcb f14 mb4 box-line-item">
                    <div
                        v-for="(item, index) in renderList"
                        :key="index"
                        :class="[rightConfigExpand ? 'fcb h100' : 'fcb h64', 'flex-row']"
                        :style="{ left: `${percentPositions[index]}` }"
                    >
                        <div v-ellipsis class="ft1 title font-h">{{ rightConfigExpand ? item.name : item.name.slice(2) }}</div>
                        <m-form-item
                            :prop="item.prop"
                            :item-model="item.value"
                            :rules="[{ validator: (rule, v, cb) => validateWithNumber(rule, v, cb, index), type: 'number', trigger: ['change', 'blur'] }]"
                            require-asterisk-position="right"
                            class="form-box"
                        >
                            <m-input-number
                                v-model="item.value"
                                width="120px"
                                text-align="left"
                                :placeholder="i18n.global.t('common.placeholder_input')"
                                controls="rightButton"
                                :precision="1"
                                :min="-1000"
                                :max="1000"
                                @change="() => validate()"
                            >
                                <template #suffix> Pa </template>
                            </m-input-number>
                        </m-form-item>
                    </div>
                </div>
                <div class="temperature-bar"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { rightConfigExpandInjectKey, acEditFormKey } from '../constant/injectKey';
import { PRESSURE_DIFF_LIMIT_VAL_DEF, SHOW_PRESSURE_DIFF_ENUM } from '../constant/ac';
import i18n from '@/localization';

const rightConfigExpand = inject(rightConfigExpandInjectKey);
const formRef = inject(acEditFormKey);
const props = defineProps({
    diffData: {
        type: Object,
        default: () => ({})
    },
    showEnableConfig: {
        type: Boolean,
        default: true
    }
});
const renderList = ref([]);
let notValidateEmpty = true;
const itemProp = index => {
    return `pressureDiff.${index}.value`;
};

const percentPositions = ['32%', '67%'];

const isEmpty = val => {
    return val === '' || val === undefined || val === null;
};
const showPressureDiff = defineModel({ type: String, default: SHOW_PRESSURE_DIFF_ENUM.NO });
const radioOptions = ref([
    {
        label: i18n.global.t('meos_control_web.yes'),
        value: SHOW_PRESSURE_DIFF_ENUM.YES
    },
    {
        label: i18n.global.t('common.no'),
        value: SHOW_PRESSURE_DIFF_ENUM.NO
    }
]);

watch(
    () => props.diffData,
    () => {
        const curData = props.diffData;
        const list = Object.keys(curData)
            .map(key => {
                const defs = PRESSURE_DIFF_LIMIT_VAL_DEF[key];
                if (defs) {
                    return { name: defs.title, value: curData[key], key: key, index: defs.index, prop: itemProp(defs.index) };
                }
                return null;
            })
            .filter(Boolean);
        if (list?.length) {
            list.sort((a, b) => a.index - b.index);
            renderList.value = list;
        } else {
            renderList.value = [
                {
                    name: PRESSURE_DIFF_LIMIT_VAL_DEF.lowerLimitValue.title,
                    value: '',
                    key: 'lowerLimitValue',
                    index: 0,
                    prop: 'pressureDiff.0.value'
                },
                {
                    name: PRESSURE_DIFF_LIMIT_VAL_DEF.upperLimitValue.title,
                    value: '',
                    key: 'upperLimitValue',
                    index: 1,
                    prop: 'pressureDiff.1.value'
                }
            ];
        }
    },
    { immediate: true }
);

const makeSaveData = () => {
    if (showPressureDiff.value !== SHOW_PRESSURE_DIFF_ENUM.YES) {
        return {};
    }
    return renderList.value?.reduce((pre, cur) => {
        pre[cur.key] = cur.value;
        return pre;
    }, {});
};

const editScopeKey = 'PressureDiffLineEdit';
const validate = async (isSaving = false) => {
    const _props = [];
    notValidateEmpty = !isSaving;
    renderList.value.forEach(obj => {
        _props.push(obj.prop);
    });
    try {
        await formRef?.value?.validateField(_props);
        notValidateEmpty = false;
        return { data: makeSaveData() };
    } catch (e) {
        console.log('e: ', e);
    }
    notValidateEmpty = false;
    return { errorScope: editScopeKey };
};

const validateForSave = () => {
    return validate(true);
};

const validateWithNumber = (rule, value, callback, index) => {
    let flag = false,
        text = '';
    if (!notValidateEmpty && isEmpty(value)) {
        flag = true;
        text = i18n.global.t('meos_control_web.input_required_check_error_2');
    } else if (index === 0) {
        const nextItem = renderList.value[index + 1];
        if (!isEmpty(value) && !isEmpty(nextItem.value)) {
            if (value > nextItem.value) {
                flag = true;
                text = i18n.global.t('meos_control_web.number_check_error_4');
            }
        }
    } else {
        const preItem = renderList.value[index - 1];
        if (!isEmpty(value) && !isEmpty(preItem.value)) {
            if (value < preItem.value) {
                flag = true;
                text = i18n.global.t('meos_control_web.number_check_error_5');
            }
        }
    }
    if (flag) {
        callback(new Error(text));
    } else {
        callback();
    }
};

defineExpose({ validate: validateForSave, getFormData: () => ({ data: makeSaveData() }) });
</script>
<style lang="less" scoped>
.env-first-row {
    display: flex;
    align-items: center;
    padding-top: 16px;
    padding-inline: 12px;

    width: 100%;
}

.show-condition {
    display: flex;
    align-items: center;
    gap: 40px;
    width: 100%;
    padding-bottom: 12px;
}
.show-border-bottom {
    border-bottom: 1px dashed #e1e5eb;
}

.left-label {
    color: var(--Grey-Grey-900, #1b2129);
    font-style: normal;
    font-weight: 400;
}

.flex-row {
    position: absolute;
    transform: translateX(-50%);
    flex-direction: column;
    width: 33%;
}
.temperature {
    background: var(--gray-50, #f7f9fa);
    padding: 0px 12px;
    .box-line {
        position: relative;
        &-item {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            z-index: 2;
        }
        .title::after {
            content: '*';
            margin-left: 4px;
            color: #f55047;
        }
    }
    .temperature-item {
        width: 100%;
        padding: 12px 0px 0px 0px;
        flex: 1;
    }
    .mh96 {
        min-height: 104px;
    }
    .mh128 {
        min-height: 128px;
    }
    .temperature-item:not(:last-child) {
        border-bottom: 1px dashed #e1e5eb;
    }
    .temperature-bar {
        width: 100%;
        height: 12px;
        border-radius: 4px;
        background: linear-gradient(
            90deg,
            #68b2e8 0%,
            #68b2e8 calc(32% - 1px),
            white calc(32% - 1px),
            white calc(32% + 1px),
            #8ad1a6 calc(32% + 1px),
            #8ad1a6 calc(67% - 1px),
            white calc(67% - 1px),
            white calc(67% + 1px),
            #ef9b96 calc(67% + 1px),
            #ef9b96 100%
        );
        position: relative;
        transform: translateY(-16px);
    }
    .h64 {
        height: 64px;
    }

    :deep(.m-form-item__error) {
        white-space: nowrap;
    }
}

.font-h {
    height: 19px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
    text-align: center;
}
</style>
