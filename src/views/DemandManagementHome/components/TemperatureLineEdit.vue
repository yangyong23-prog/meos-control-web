<template>
    <div :id="editScopeKey" class="temperature">
        <div v-for="(items, indexs) in temperatureList" :key="indexs" :class="['temperature-item', rightConfigExpand ? 'f mh96' : 'mh128']">
            <div style="width: 100px">{{ items.name }}</div>
            <div :class="[rightConfigExpand ? 'ml12' : 'mt40', 'box-line', 'fcc']" :style="{ width: '100%', maxWidth: '1000px' }">
                <div class="fcb f14 mb4 box-line-item">
                    <div
                        v-for="(item, index) in items.list"
                        :key="index"
                        :class="[rightConfigExpand ? 'fcb h100' : 'fcb h64', 'flex-row']"
                        :style="{ left: `${percentPositions[index]}` }"
                    >
                        <div v-ellipsis class="ft1 title font-h">{{ rightConfigExpand ? item.name : item.name.slice(2) }}</div>
                        <!-- <div class="get-line-white"></div> -->
                        <m-form-item
                            :prop="item.prop"
                            :item-model="item.value"
                            :rules="[{ validator: item.validator, type: 'number', trigger: ['change'] }]"
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
                                :min="-99.9"
                                :max="99.9"
                                @change="() => validate()"
                            >
                                <template #suffix> ℃ </template>
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
import { LIMIT_VAL_DEF, AIR_SEASON_DEF } from '../constant/ac';
import i18n from '@/localization';
const rightConfigExpand = inject(rightConfigExpandInjectKey);
const formRef = inject(acEditFormKey);
const props = defineProps({
    seasonQuality: {
        type: Array,
        default: () => []
    }
});
const temperatureList = ref([]);
let notValidateEmpty = true;
const itemProp = (seasonObj, index) => {
    return `item.${seasonObj.airSeason}.${index}.value`;
};

const percentPositions = ['11%', '37%', '63%', '89%'];

const isEmpty = val => {
    return val === '' || val === undefined || val === null;
};
watch(
    () => props.seasonQuality,
    () => {
        // console.log('props.seasonQuality: ', props.seasonQuality);
        temperatureList.value = props.seasonQuality?.map(obj => {
            const list = Object.keys(obj)
                .map(k => {
                    const defs = LIMIT_VAL_DEF[k];
                    if (defs) {
                        return { name: defs.title, value: obj[k], key: k, index: defs.index, prop: itemProp(obj, defs.index) };
                    }
                    return null;
                })
                .filter(Boolean);
            list.sort((a, b) => a.index - b.index);
            list.forEach(item => {
                item.validator = (rule, value, callback) => {
                    let flag = false,
                        text = '';
                    if (!notValidateEmpty && isEmpty(value)) {
                        flag = true;
                        text = i18n.global.t('meos_control_web.input_required_check_error_2');
                    } else {
                        // console.log('value , rule: ', value, rule);
                        if (item.index < list.length - 1) {
                            if (!isEmpty(value) && !isEmpty(list[item.index + 1].value)) {
                                if (value > list[item.index + 1].value) {
                                    flag = true;
                                    text = item.index === 0 ? i18n.global.t('meos_control_web.number_check_error_3') : i18n.global.t('meos_control_web.number_check_error_2');
                                }
                            }
                        } else if (item.index > 0 && item.index === list.length - 1) {
                            if (!isEmpty(value) && !isEmpty(list[item.index - 1].value)) {
                                if (value < list[item.index - 1].value) {
                                    flag = true;
                                    text = i18n.global.t('meos_control_web.number_check_error_1');
                                }
                            }
                        }
                    }
                    if (flag) {
                        callback(new Error(text));
                    } else {
                        callback();
                    }
                };
            });
            return {
                name: AIR_SEASON_DEF[obj.airSeason],
                list,
                airSeason: obj.airSeason
            };
        });
    },
    { immediate: true }
);

const makeSaveDate = () => {
    return temperatureList.value?.map(obj => {
        const val = {
            airSeason: obj.airSeason
        };
        obj.list?.forEach(item => {
            val[item.key] = item.value;
        });
        return val;
    });
};

const editScopeKey = 'TemperatureLineEdit';
const validate = async (isSaving = false) => {
    const _props = [];
    notValidateEmpty = !isSaving;
    temperatureList.value.forEach(obj => {
        obj.list?.forEach(item => {
            _props.push(item.prop);
        });
    });
    try {
        if (_props.length) {
            await formRef?.value?.validateField(_props);
            // console.log('res: ', _props, formRef?.value);
            notValidateEmpty = false;
            return { data: makeSaveDate() };
        } else {
            notValidateEmpty = false;
            return { data: [] };
        }
    } catch (e) {
        console.log('e: ', e);
    }
    notValidateEmpty = false;
    return { errorScope: editScopeKey };
};
const changeDate = () => {
    // console.log('changeDate: ');
    const _props = [];
    temperatureList.value.forEach(obj => {
        obj.list?.forEach(item => {
            _props.push(item.prop);
        });
    });
    try {
        formRef?.value?.validateField(_props);
    } catch (e) {
        console.log('e: ', e);
    }
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
    width: 22%;
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
            #68b2e8 calc(11% - 1px),
            white calc(11% - 1px),
            white calc(11% + 1px),
            #6bcfdd calc(11% + 1px),
            #6bcfdd calc(37% - 1px),
            white calc(37% - 1px),
            white calc(37% + 1px),
            #8ad1a6 calc(37% + 1px),
            #8ad1a6 calc(63% - 1px),
            white calc(63% - 1px),
            white calc(63% + 1px),
            #edc578 calc(63% + 1px),
            #edc578 calc(89% - 1px),
            white calc(89% - 1px),
            white calc(89% + 1px),
            #ef9b96 calc(89% + 1px),
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
        height: 12px;
        width: 2px;
        background-color: white;
    }
    .h64 {
        height: 64px;
    }

    :deep(.m-form-item__error) {
        white-space: nowrap;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    width: 100%;
    text-align: center;
}
</style>
