<template>
    <div ref="container" class="input-container">
        <div class="header">
            <div class="title">
                <span>{{ props.title }}</span>
                <span class="required">*</span>
            </div>
            <m-tips
                :content="i18n.global.t('meos_control_web.default_value_is', { val: props.defaultValues?.join(', ') })"
                theme="darkTransparent"
                :disabled="!props.defaultValues?.length"
            >
                <m-button
                    class="ml4"
                    type="link"
                    size="medium"
                    :style="{
                        zIndex: 1,
                        visibility: showDefaultBtn ? 'visible' : 'hidden'
                    }"
                    @click="restoreDefault"
                    >{{ i18n.global.t('meos_control_web.restore_default_value') }}</m-button
                >
            </m-tips>
        </div>
        <div class="range-row-container">
            <div class="range-top">
                <div class="range-bar-items">
                    <div v-for="(barName, index) in props.names" :key="index" class="range-bar-item">{{ barName }}</div>
                </div>
                <div class="range-bar-line-container">
                    <div ref="parent" :style="{ background: `linear-gradient(90deg, ${colorStops})` }" class="range-bar-line"></div>
                </div>
            </div>
            <div class="range-bottom">
                <div v-for="(item, index) in allRanges" :key="item.key" :ref="ins => (childRefs[index] = ins)" class="range-bottom-item">
                    <div class="vertical-bar-container">
                        <div class="vertical-bar"></div>
                    </div>
                    <m-tips :content="item.disabledTips" theme="darkTransparent" :disabled="!item.disabledTips">
                        <div v-if="item.disabledTips" class="hidden-mask"></div>
                    </m-tips>
                    <m-form-item
                        :ref="ins => (selfFormItemRefs[index] = ins)"
                        :class="{
                            'list-item': true,
                            'has-unit': !!props.unit
                        }"
                        :prop="'row.' + item.key + '.count'"
                        :item-model="item.count"
                        :rules="[
                            {
                                validator: (value, rule, callback) => validateInput(item, callback),
                                trigger: ['blur', 'change']
                            }
                        ]"
                    >
                        <m-input-number
                            v-model="item.count"
                            width="128"
                            text-align="left"
                            placeholder
                            controls="rightButton"
                            :disabled="!!item.disabledTips"
                            :precision="1"
                            :step="1"
                            :min="props.enableMinMax ? props.min : Number.MIN_SAFE_INTEGER"
                            :max="props.enableMinMax ? props.max : Number.MAX_SAFE_INTEGER"
                            @change="val => handleChange(val, item)"
                        >
                            <template v-if="props.unit" #suffix>{{ props.unit }}</template>
                        </m-input-number>
                    </m-form-item>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useTemplateRef } from 'vue';
import { useResizeObserver } from '@vueuse/core';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    names: {
        type: Array,
        default: () => [
            i18n.global.t('meos_control_web.needs_improvement'),
            i18n.global.t('meos_control_web.general'),
            i18n.global.t('meos_control_web.good'),
            i18n.global.t('meos_control_web.excellent')
        ]
    },
    colors: {
        type: Array,
        default: () => ['#f8766f', '#ffcb47', '#64a6f7', '#69cd90']
    },
    defaultValues: {
        type: Array,
        default: () => []
    },
    unit: {
        type: String,
        default: ''
    },
    firstDisabled: {
        type: Boolean,
        default: true
    },
    lastDisabled: {
        type: Boolean,
        default: false
    },
    validEqual: {
        type: Boolean,
        default: true
    },
    min: {
        type: [Number, String],
        default: ''
    },
    max: {
        type: [Number, String],
        default: ''
    },
    enableMinMax: {
        type: Boolean,
        default: false
    },
    hint: {
        type: String,
        default: ''
    }
});

const allRanges = defineModel({
    type: Array
});
const containerRef = useTemplateRef('container');
const parentRef = useTemplateRef('parent');
const emit = defineEmits(['change']);
const childRefs = ref([]);
const positions = ref([]);
const selfFormItemRefs = ref([]);
const showDefaultBtn = ref(false);
const multiFieldsNotDefaultMap = ref(new Map());

const addSmallStep = num => {
    const step = 0.2;
    return num ? `${(parseFloat(num) + step).toFixed(2)}` : num;
};

const colorStops = computed(() => {
    const allPositions = positions.value;
    const rangePercent = props.colors
        .flatMap((v, index) => [
            { color: v, fromIndex: index },
            { color: v, toIndex: index + 1 }
        ])
        .reduce((acc, cur) => {
            const { color, fromIndex, toIndex } = cur;
            const fromPosition = allPositions[fromIndex];
            const toPosition = allPositions[toIndex];
            if (acc.some(v => (v.from === toPosition && toPosition) || (v.to === fromPosition && fromPosition))) {
                acc.push({
                    color,
                    from: addSmallStep(fromPosition),
                    to: addSmallStep(toPosition)
                });
            } else {
                acc.push({
                    color,
                    from: fromPosition,
                    to: toPosition
                });
            }

            return acc;
        }, []);
    return rangePercent.map(v => `${v.color} ${v?.from || v?.to}%`).join(', ');
});

const validateInput = (item, callback) => {
    const leftCount = allRanges.value.find(v => v?.key === item?.key - 1)?.count;
    const rightCount = allRanges.value.find(v => v?.key === item?.key + 1)?.count;
    const isLeftError = leftCount?.toString() && item?.count?.toString() && parseFloat(`${leftCount}`) > parseFloat(`${item?.count}`);
    const isRightError = rightCount?.toString() && item?.count?.toString() && parseFloat(`${rightCount}`) < parseFloat(`${item?.count}`);
    const isLeftEqual = leftCount?.toString() && item?.count?.toString() && parseFloat(`${leftCount}`) === parseFloat(`${item?.count}`);
    const isRightEqual = rightCount?.toString() && item?.count?.toString() && parseFloat(`${rightCount}`) === parseFloat(`${item?.count}`);

    const checkSelf = () => {
        const hasMinMax = props.enableMinMax && props.min.toString() && props.max.toString();
        const cur = (item?.count ?? '').toString();

        const curNumber = parseFloat(cur);
        const minNumber = parseFloat(props.min?.toString());
        const maxNumber = parseFloat(props.max?.toString());

        if (isNaN(curNumber)) {
            return false;
        }

        if (hasMinMax && (curNumber < minNumber || curNumber > maxNumber)) {
            return false;
        }

        return true;
    };
    const checkLeft = props.validEqual ? isLeftError || isLeftEqual : isLeftError;
    const checkRight = props.validEqual ? isRightError || isRightEqual : isRightError;

    let errStr;
    if ((item?.count ?? '') === '') {
        errStr = i18n.global.t('meos_control_web.input_required_check_error_4');
    } else if (!checkSelf()) {
        errStr = props.hint || `范围：${props.min} - ${props.max}`;
    } else if (checkRight) {
        errStr = i18n.global.t('meos_control_web.number_check_error_3') || i18n.global.t('meos_control_web.left_must_be_less_than_right');
    } else if (checkLeft) {
        errStr = i18n.global.t('meos_control_web.number_check_error_1') || i18n.global.t('meos_control_web.left_must_be_less_than_right');
    } else {
        errStr = '';
    }

    if (errStr && !item?.disabledTips) {
        item.errorTips = errStr;
        callback(new Error(errStr));
    } else {
        item.errorTips = '';
        callback();
    }
};

const validateAll = async () => {
    try {
        const res = await Promise.all(selfFormItemRefs.value.map(formItemInstance => formItemInstance?.validate()));
        return true;
    } catch (error) {
        // console.log('validate-row error', error);
        return false;
    }
};

const handleChange = (val, item) => {
    const defaultVal = props.defaultValues[item.key];
    const isNotDefault = defaultVal?.toString() && Number(val) !== parseFloat(`${defaultVal}`);
    if (isNotDefault) {
        multiFieldsNotDefaultMap.value.set(item.key, { val, defaultVal, isNotDefault: true });
    } else {
        multiFieldsNotDefaultMap.value.delete(item.key);
    }
    if (multiFieldsNotDefaultMap.value.size) {
        showDefaultBtn.value = true;
    } else {
        showDefaultBtn.value = false;
    }

    nextTick(() => {
        validateAll();
    });
};

const scrollIntoField = () => {
    containerRef.value?.scrollIntoView?.({ behavior: 'smooth', block: 'start', inline: 'nearest' });
};

const restoreDefault = () => {
    const newDefault = props.defaultValues.map((v, index, arr) => ({
        key: index,
        count: v,
        disabledTips:
            index === 0 && props.firstDisabled
                ? i18n.global.t('meos_control_web.lower_limit_not_editable')
                : index === arr.length - 1 && props.lastDisabled
                ? i18n.global.t('meos_control_web.upper_limit_readonly')
                : ''
    }));
    allRanges.value = structuredClone(newDefault);

    nextTick(() => {
        validateAll();
    });
};

const { stop } = useResizeObserver(parentRef, () => {
    if (!parentRef.value) return;

    const parentRect = parentRef.value.getBoundingClientRect();
    const parentWidth = parentRect.width;

    positions.value = childRefs.value.map(child => {
        const childRect = child?.getBoundingClientRect();
        const childCenter = (childRect.left + childRect.right) / 2;
        return (((childCenter - parentRect.left) / parentWidth) * 100).toFixed(2);
    });
});

watch(
    allRanges,
    cur => {
        if (Array.isArray(cur) && cur?.length) {
            const hasSomeNotDefault = cur.some((item, index) => {
                return `${item?.count ?? ''}` !== `${props.defaultValues[index] ?? ''}`;
            });
            showDefaultBtn.value = hasSomeNotDefault;
        }
    },
    {
        immediate: true
    }
);

const allRangesString = computed(() => {
    return JSON.stringify(allRanges.value);
});

watch(allRangesString, cur => {
    const curData = JSON.parse(cur);
    emit('change', curData);
});

onUnmounted(() => {
    stop?.();
});

defineExpose({
    validateAll,
    scrollIntoField,
    showDefaultBtn
});
</script>

<style lang="less" scoped>
.input-container {
    width: 100%;
    display: flex;
    padding: 8px 8px 0px 8px;
    flex-direction: column;
    gap: 4px;
    background: var(--gray-50, #f7f9fa);

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            padding-left: 12px;
            color: var(--gray-800, #2e3742);
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
        }

        .required {
            color: var(--red-500, #f55047);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            margin-left: 4px;
        }
    }
}

.range-row-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    .range-top {
        display: flex;
        flex-direction: column;
        margin-bottom: 4px;
    }

    .range-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-inline: 16px;
        max-width: 100%;
    }

    .range-bottom-item {
        position: relative;

        .hidden-mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 12;
            cursor: not-allowed;
        }
    }

    .list-item:not(.has-unit) {
        :deep(.m-input-number-rightButton) {
            border-radius: 4px;
        }
    }
}

.range-bar-items {
    display: flex;
    align-items: center;
    padding: 0px 64px;
    margin-bottom: 5.4px;

    .range-bar-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        color: var(--gray-600, #626c78);
        text-align: center;

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
}

.range-bar-line-container {
    width: 100%;
    padding: 0 12px;

    .range-bar-line {
        width: 100%;
        height: 12px;
        border-radius: 4px;
    }
}

.vertical-bar-container {
    position: absolute;
    top: -15px;
    left: 50%;

    .vertical-bar {
        width: 2px;
        height: 10px;
        border-radius: 1px;
        background-color: #fff;
    }
}
</style>
