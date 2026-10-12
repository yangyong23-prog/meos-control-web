<template>
    <div class="item-wrap">
        <m-form-item
            :ref="el => (fieldRefs[0] = el)"
            label-width="140px"
            :prop="propKey + 'val'"
            :rules="{
                validator: (rule, value, callback) => validateBothInput(callback, true),
                trigger: 'none'
            }"
            class="form-item"
        >
            <template #label>
                <div style="word-break: break-word">{{ label }}</div>
            </template>
            <div class="num-units">
                <template v-if="option?.chillerLNum">
                    <m-select v-model="chillerLNum" :max-width="110" :disabled="disabled" :size="110" :options="optionList(CHILLER_CODE().LARGE.id)" clearable></m-select>
                    {{ isSingle ? getChillerMeasureWord(option?.chillerType) : CHILLER_CODE().LARGE.shortName }}
                </template>
                <template v-if="option?.chillerM1Num">
                    <m-select v-model="chillerM1Num" :max-width="110" :disabled="disabled" :size="110" :options="optionList(CHILLER_CODE().M1.id)" clearable></m-select>
                    {{ CHILLER_CODE().M1.shortName }}
                </template>
                <template v-if="option?.chillerSNum">
                    <m-select v-model="chillerSNum" :max-width="110" :disabled="disabled" :size="110" :options="optionList(CHILLER_CODE().SMALL.id)" clearable></m-select>
                    {{ CHILLER_CODE().SMALL.shortName }}
                </template>
            </div>
        </m-form-item>
        <m-form-item
            :ref="el => (fieldRefs[1] = el)"
            :label="i18n.global.t('meos_control_web.duration')"
            label-width="64px"
            style="--padding-3: 0"
            :prop="propKey + 'sustainTime'"
            :rules="[
                { validator: (_value, _rule, callback) => validateBothInput(callback, false), trigger: 'none' },
                {
                    validator: (_value, _rule, callback) => validateStepInput(sustainTime, callback),
                    trigger: ['blur']
                }
            ]"
            class="form-item sustain-time"
        >
            <StepInputNumber
                v-model="sustainTime"
                :min="5"
                :max="1440"
                :step="5"
                :precision="0"
                :blur-round="true"
                allow-empty
                :suffix="i18n.global.t('meos_control_web.minute')"
                width="90px"
                :disabled="disabled"
            />
            <div v-if="interfereOverTime" class="desc-text">{{ interfereOverTime }}{{ i18n.global.t('meos_control_web.intervention_end') }}</div>
        </m-form-item>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { EMPTYTEXT, CHILLER_CODE } from '@/views/ACAC/variables';
import { isEmptyNoReturn } from '@/utils/tools';
import { chillerDataKey } from '@/views/ACAC/hooks/useBaseHook';
import { strategyTimeKey } from '@/views/ACAC/hooks/useTimetableEditorItem';
import { pumpGroupChillerNumsKey } from '@/views/ACAC/hooks/useTimetableEditor';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import StepInputNumber from '@/components/ObjectInfoComponents/ControlForm/StepInputNumber.vue';
import { getChillerMeasureWord } from '@/views/ACAC/hooks/timetableConfig';
const pumpGroupChillerNums = inject(pumpGroupChillerNumsKey);
const props = defineProps({
    propKey: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    coolMode: {
        type: String,
        default: ''
    },
    objectId: {
        type: String,
        default: ''
    },
    option: {
        type: Object,
        default: () => {}
    },
    defaultData: {
        type: Object,
        default: () => null
    },
    // 禁用
    disabled: {
        type: Boolean,
        default: false
    }
});
const EMPTY_FLAG = '--';
const chillerData = inject(chillerDataKey);
const sustainTime = ref();
const chillerLNum = ref();
const chillerM1Num = ref();
const chillerSNum = ref();

const fieldRefs = ref([]);

const strategyTime = inject(strategyTimeKey);

const isValEmpty = val => {
    return isEmptyNoReturn(val) || val === EMPTY_FLAG;
};
const isAllSettingEmpty = () => {
    const opt = props.option;
    const isEmptyInput1 = !opt?.chillerLNum || isValEmpty(chillerLNum.value);
    const isEmptyInput2 = !opt?.chillerM1Num || isValEmpty(chillerM1Num.value);
    const isEmptyInput3 = !opt?.chillerSNum || isValEmpty(chillerSNum.value);
    return isEmptyInput1 && isEmptyInput2 && isEmptyInput3;
};

// 台数设置有部分为空
const hasPartEmpty = () => {
    const opt = props.option;
    let allCount = 0,
        emptyCount = 0;
    if (opt?.chillerLNum) {
        allCount += 1;
        if (isValEmpty(chillerLNum.value)) {
            emptyCount += 1;
        }
    }
    if (opt?.chillerM1Num) {
        allCount += 1;
        if (isValEmpty(chillerM1Num.value)) {
            emptyCount += 1;
        }
    }
    if (opt?.chillerSNum) {
        allCount += 1;
        if (isValEmpty(chillerSNum.value)) {
            emptyCount += 1;
        }
    }
    return emptyCount > 0 && allCount !== emptyCount;
};
const isAllEmpty = () => {
    const isEmptyInput4 = isValEmpty(sustainTime.value);
    return isAllSettingEmpty() && isEmptyInput4;
};

const isSingle = computed(() => {
    const opt = props.option;
    if (!opt) {
        return;
    }
    return opt.chillerLNum && !opt.chillerM1Num && !opt.chillerSNum;
});

const chillerDefine = computed(() => {
    if (chillerData?.value && props.option?.chillerType) {
        // console.log('pumpGroupChillerNums: ', pumpGroupChillerNums, props.option);
        if (pumpGroupChillerNums?.value && pumpGroupChillerNums?.value[props.option?.chillerType]) {
            return pumpGroupChillerNums?.value[props.option?.chillerType] ?? {};
        }
        const k = `${props.option?.chillerType}${props.objectId}`;
        return chillerData?.value[k] ?? {};
    }
    return {};
});

const optionList = k => {
    const length = chillerDefine.value[k] ?? 0;
    const arr = Array.from({ length }, (_, index) => {
        return {
            id: index + 1,
            name: `${index + 1}`
        };
    });
    arr.unshift({
        id: 0,
        name: '0'
    });
    return arr;
};

// 干预结束时间
const interfereOverTime = computed(() => {
    console.log('interfereOverTime: ', isAllSettingEmpty());
    if (!isAllSettingEmpty() && sustainTime.value && strategyTime?.value) {
        const day = getDayjsTz().format('YYYY-MM-DD');
        const curTime = dayjs(`${day} ${strategyTime?.value}`, 'YYYY-MM-DD HH:mm').add(sustainTime.value, 'm');
        return curTime.format('HH:mm');
    }
    return null;
});

const validateStepInput = (val, callback) => {
    const hasInputVal = val?.toString();
    const curItemVal = val ?? 0;
    const hasError = curItemVal % 5 !== 0 || curItemVal > 1440 || curItemVal < 5;
    if (hasInputVal && hasError) {
        callback(new Error(i18n.global.t('meos_control_web.multiples_of_5_range_5_to_1440')));
    } else {
        callback();
        return true;
    }
};

const validateBothInput = (callback, isSettingInput) => {
    // 如果只有部分台数设置，直接报错
    if (hasPartEmpty() && isSettingInput) {
        callback(new Error(EMPTYTEXT));
        return;
    }
    //
    let isEmpty1 = isAllSettingEmpty();
    const isEmpty2 = isEmptyNoReturn(sustainTime.value);
    const isCurEmpty = isSettingInput ? isEmpty1 : isEmpty2;

    if (isEmpty1 !== isEmpty2 && isCurEmpty) {
        callback(new Error(EMPTYTEXT));
    } else {
        callback();
    }
};

const validator = async () => {
    const promises = [];
    fieldRefs.value?.forEach(c => {
        if (c) {
            promises.push(c.validate());
        }
    });
    const rst = await Promise.allSettled(promises);
    const hasErr = rst.some(obj => obj.status === 'rejected');
    // console.log('aa: ', hasErr);
    const firstErrMsg = rst.filter(obj => obj.status === 'rejected').flatMap(obj => obj?.reason?.errors?.map(e => e?.message) || [])?.[0];

    return { status: !hasErr, errorMsg: firstErrMsg || EMPTYTEXT, prop: props.propKey + 'val' };
};
const getValue = () => {
    const value = { sustainTime: sustainTime.value };

    const opt = props.option;
    // console.log('opt: ', opt);
    if (opt) {
        value.chillerType = opt.chillerType;
        if (props.coolMode) {
            value.coolMode = props.coolMode;
        }
        if (opt.chillerLNum) {
            value.chillerLNum = isEmptyNoReturn(chillerLNum.value) ? '--' : chillerLNum.value;
        }
        if (opt.chillerM1Num) {
            value.chillerM1Num = isEmptyNoReturn(chillerM1Num.value) ? '--' : chillerM1Num.value;
        }
        if (opt.chillerSNum) {
            value.chillerSNum = isEmptyNoReturn(chillerSNum.value) ? '--' : chillerSNum.value;
        }
    }
    return value;
};
watch(
    [() => props.defaultData],
    () => {
        if (props.defaultData) {
            chillerLNum.value = props.defaultData.chillerLNum;
            chillerM1Num.value = props.defaultData.chillerM1Num;
            chillerSNum.value = props.defaultData.chillerSNum;
            sustainTime.value = props.defaultData.sustainTime;
        }
    },
    {
        immediate: true
    }
);

defineExpose({
    validator,
    getValue,
    isAllEmpty
});
</script>
<style lang="less" scoped>
.item-wrap {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    --padding-3: 8px;
    .num-units {
        display: flex;
        align-items: center;
        gap: 8px;

        color: var(--Gray-900);
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
    }
    .form-item {
        margin-bottom: 0;
    }
    .desc-text {
        margin-left: 8px;
        color: #aeb6be;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
    }
    .sustain-time {
        :deep(.m-input-number-rightButton.no-suffix) {
            border-radius: 4px 0 0 4px;
        }
    }
}
</style>
