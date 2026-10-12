<template>
    <div :id="editScopeKey" class="temperature">
        <div :class="['temperature-item', rightConfigExpand ? 'f mh96' : 'mh96', showDivider ? 'show-divider' : 'hide-divider']">
            <div v-if="rightConfigExpand" style="width: 100px">
                {{ carbonDioxideList.name }}
            </div>
            <div :class="[rightConfigExpand ? 'ml12' : 'mt30', 'box-line', 'fcc']" :style="{ width: '100%', maxWidth: '1000px' }">
                <div :class="['fcb', 'f14', 'mb4', 'box-line-item', 'w100']">
                    <div
                        v-for="(item, index) in carbonDioxideList.list"
                        :key="index"
                        :class="[rightConfigExpand ? 'fcb h100' : 'fcb h64', 'flex-row']"
                        :style="{ left: `${percentPositions[index]}` }"
                    >
                        <div class="ft1 title font-h">{{ item.name }}</div>
                        <!-- <div class="get-line-white"></div> -->
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
                                :precision="0"
                                :min="0"
                                :max="9999"
                                @change="() => validate()"
                            >
                                <template #suffix> ppm </template>
                            </m-input-number>
                        </m-form-item>
                    </div>
                </div>
                <div class="temperature-bar"></div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>
<script setup>
import { rightConfigExpandInjectKey, acEditFormKey } from '../constant/injectKey';
import i18n from '@/localization';
const rightConfigExpand = inject(rightConfigExpandInjectKey);

const formRef = inject(acEditFormKey);
const props = defineProps({
    dataObj: {
        type: Object,
        default: () => {}
    },
    showDivider: {
        type: Boolean,
        default: true
    }
});

const percentPositions = ['20%', '80%'];

const carbonDioxideList = ref([]);
let notValidateEmpty = true;
const isEmpty = val => {
    return val === '' || val === undefined || val === null;
};

watch(
    () => props.dataObj,
    () => {
        // if (props.dataObj) {
        const list = [
            {
                key: 'carbonDioxideLimitValue',
                value: props.dataObj?.carbonDioxideLimitValue || '',
                name: i18n.global.t('meos_control_web.co2_comfort_zone_upper_limit'),
                prop: 'item.0.value',
                index: 0
            },
            {
                key: 'carbonDioxideUpperLimitValue',
                value: props.dataObj?.carbonDioxideUpperLimitValue || '',
                name: i18n.global.t('meos_control_web.co2_high_threshold'),
                prop: 'item.1.value',
                index: 1
            }
        ];

        carbonDioxideList.value = {
            name: i18n.global.t('meos_control_web.co2_standard'),
            list
        };
        // }
        // console.log('props.dataObj: ', carbonDioxideList);
    },
    { immediate: true }
);
const makeSaveDate = () => {
    const val = {};
    carbonDioxideList.value?.list?.forEach(obj => {
        val[obj.key] = obj.value;
    });
    return val;
};

const editScopeKey = 'Co2LineEdit';
const renderList = computed(() => {
    return carbonDioxideList.value?.list || [];
});

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

const validate = async (isSaving = false) => {
    const _props = [];
    notValidateEmpty = !isSaving;
    carbonDioxideList.value?.list?.forEach(obj => {
        _props.push(obj.prop);
    });
    try {
        await formRef?.value?.validateField(_props);
        // console.log('res: ', _props, res, formRef?.value);
        notValidateEmpty = false;
        return { data: makeSaveDate() };
    } catch (e) {
        // console.log('e: ', e);
    }
    notValidateEmpty = false;
    return { errorScope: editScopeKey };
};
const validateForSave = () => {
    return validate(true);
};
defineExpose({ validate: validateForSave, getFormData: makeSaveDate });
</script>
<style lang="less" scoped>
.flex-row {
    position: absolute;
    transform: translateX(-50%);
    flex-direction: column;
    width: 40%;
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
    // .w55 {
    //     width: 70%;
    // }
    .temperature-item:not(:last-child) {
        border-bottom: 1px dashed #e1e5eb;
    }
    .temperature-item.hide-divider {
        border-bottom: none;
    }
    .temperature-bar {
        width: 100%;
        height: 12px;
        border-radius: 4px;
        background: linear-gradient(
            90deg,
            #8ad1a6 0%,
            #8ad1a6 calc(20% - 1px),
            white calc(20% - 1px),
            white calc(20% + 1px),
            #edc578 calc(20% + 1px),
            #edc578 calc(80% - 1px),
            white calc(80% - 1px),
            white calc(80% + 1px),
            #ef9b96 calc(80% + 1px),
            #ef9b96 100%
        );
        position: relative;
        transform: translateY(-16px);
    }
    .get-line-box {
        width: 100%;
        height: 100%;
    }
    .get-line-white {
        height: 8px;
        width: 2px;
        background-color: white;
        border-radius: 4px;
    }
    .h64 {
        height: 64px;
    }
}
.pd6 {
    padding-left: 4%;
    padding-right: 4%;
}
.pd4 {
    padding-left: 2%;
    padding-right: 2%;
}
.font-h {
    height: 19px;
}
</style>
