<!--
 * @Author: guoxiaohuan
 * @Date: 2024-05-14 11:51:06
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-16 11:19:21
 * @Description:
-->
<template>
    <m-form ref="Mform" class="form-container" :class="{ 'form-container-1440': screenWidth <= 1440 }" :model="params" label-position="top">
        <div v-for="(item, index) in params.dataList" :key="index">
            <div class="form-box">
                <m-form-item
                    :prop="`${item.code}`"
                    :item-model="item.valueInputLeft"
                    require-asterisk-position="right"
                    class="form-item-left"
                    :rules="[{ type: 'number', required:item.placeholder?false:true, message:i18n.global.t('meos_control_web.content_required'), trigger: ['blur', 'change'] },
                             { validator: (value: any, rule: any, callback: any) => validateInput(item, callback), trigger: ['blur','change'] } ]"
                >
                    <template #label>
                        <div class="label-position">
                            <m-tips :content="i18n.global.t('meos_control_web.param_wide_impact_modify_carefully')" theme="darkTransparent">
                                <svg v-if="item.level === 1" class="icon label-icon" aria-hidden="true">
                                    <use xlink:href="#icon-labelIcon" />
                                </svg>
                            </m-tips>
                            <span v-ellipsis class="label-name" :style="{ maxWidth: screenWidth <= 1440 ? '276px' : '294px' }">{{ item.name }}</span>
                            <span class="label-error">*</span>
                            <m-tips v-if="item.desc" :content="item.desc" theme="darkTransparent">
                                <svg class="icon label-icon-linear" aria-hidden="true">
                                    <use xlink:href="#icon-linear" />
                                </svg>
                            </m-tips>
                        </div>
                    </template>
                    <div style="display: flex">
                        <!-- 步长输入框 -->
                        <StepInput v-if="item.controlStyle === 'STEP_INPUT'" :cur-item="item" />
                        <!-- 单选控件 -->
                        <RadioButton v-else-if="item.controlStyle === 'RADIO_BUTTON'" :cur-item="item" />
                        <!-- 多选控件 -->
                        <Checkbox v-else-if="item.controlStyle === 'CHECKBOX'" :cur-item="item" />
                        <!-- 基础输入框 -->
                        <CommonInput v-else-if="item.controlStyle === 'COMMON_INPUT'" :cur-item="item" />
                        <!-- 上下限输入框 -->
                        <LimitInput v-else-if="item.controlStyle === 'LIMIT_INPUT'" :cur-item="item" :value="'left'" />
                        <m-tips
                            v-if="item.controlStyle !== 'LIMIT_INPUT' && item.valueInputLeft !== item.defaultValueLeft"
                            :content="defaultValueTips(item)"
                            theme="darkTransparent"
                        >
                            <m-button class="default-text" type="link" size="medium" @click="restoreDefault(item)">{{
                                i18n.global.t('meos_control_web.restore_default')
                            }}</m-button>
                        </m-tips>
                    </div>
                </m-form-item>
                <div v-if="item.controlStyle === 'LIMIT_INPUT'" class="line"></div>
                <m-form-item
                    v-if="item.controlStyle === 'LIMIT_INPUT'"
                    class="form-item-right"
                    :prop="`${item.code}`"
                    :item-model="item.valueInputRight"
                    require-asterisk-position="right"
                    :rules="[
                    {
                        type: 'number',
                        required:item.placeholder?false:true,
                        message: i18n.global.t('meos_control_web.content_required'),
                        trigger: ['blur', 'change']
                    },
                    {
                        validator: (value: any, rule: any, callback: any, status: string) => validateInput(item, callback),
                        trigger: ['blur', 'change']
                    }
                    ]"
                >
                    <LimitInput :cur-item="item" :value="'right'" />
                    <div class="default-text">
                        <m-tips
                            v-if="item.valueInputLeft !== item.defaultValueLeft || item.valueInputRight !== item.defaultValueRight"
                            :content="defaultValueTips(item)"
                            theme="darkTransparent"
                        >
                            <m-button type="link" size="medium" @click="restoreDefault(item)">{{ i18n.global.t('meos_control_web.restore_default') }}</m-button>
                        </m-tips>
                    </div>
                </m-form-item>
            </div>
            <div class="label-bottom">
                <span v-if="!item.isUnit">
                    {{ item.hint }}
                </span>
            </div>
        </div>
    </m-form>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import CommonInput from './common_input.vue';
import RadioButton from './radio_button.vue';
import Checkbox from './checkbox.vue';
import LimitInput from './limit_input.vue';
import StepInput from './step_input.vue';

import { defaultValueTips, formatterValue } from './tools';

const props = defineProps([
    'dataList' // 表单数组
]);

const params = reactive({
    dataList: []
});

const emit = defineEmits(['restoreDefault']);

if (props.dataList) {
    params.dataList = formatterValue(props.dataList);
}

console.log(params.dataList, '*********');

// 加开大小机限值 输入校验 只能输入整数
// const averageInput = (item: any, name: string) => {
//     if (name === 'left') {
//         // item.valueInputLeft = item.valueInputLeft.replace(/[^-0-9.]/g, '')
//         item.valueInputLeft = item.valueInputLeft.replace(/[^0-9.]|(\..*\.|^\.)+/g, '').replace(/^(\d+\.\d).*$/g, '$1');
//     } else {
//         // item.valueInputRight = item.valueInputRight.replace(/[^-0-9.]/g, '')
//         item.valueInputRight = item.valueInputRight.replace(/[^0-9.]|(\..*\.|^\.)+/g, '').replace(/^(\d+\.\d).*$/g, '$1');
//     }
// };
// 加开大小机限值 失焦校验 最大值 最小值
// const averageBlur = (item: any, name: string) => {
//     if (name === 'left') {
//         if (!item.valueInputLeft) return;
//         item.valueInputLeft = isNaN(item.valueInputLeft.replace(/[^0-9.]|(\..*\.|^\.)+/g, '').replace(/^(\d+\.\d).*$/g, '$1'))
//             ? ''
//             : Number(item.valueInputLeft.replace(/[^0-9.]|(\..*\.|^\.)+/g, '').replace(/^(\d+\.\d).*$/g, '$1')).toFixed(1);
//         if (item.valueInputLeft > item.max) {
//             item.valueInputLeft = item.max;
//         } else if (item.valueInputLeft < item.min) {
//             item.valueInputLeft = item.min;
//         } else if (item.valueInputLeft === '00') {
//             item.valueInputLeft = 0;
//         } else {
//             item.valueInputLeft = Number(item.valueInputLeft);
//         }
//     } else {
//         if (!item.valueInputRight) return;
//         item.valueInputRight = isNaN(item.valueInputRight.replace(/[^0-9.]|(\..*\.|^\.)+/g, '').replace(/^(\d+\.\d).*$/g, '$1'))
//             ? ''
//             : Number(item.valueInputRight.replace(/[^0-9.]|(\..*\.|^\.)+/g, '').replace(/^(\d+\.\d).*$/g, '$1')).toFixed(1);
//         if (item.valueInputRight > item.max) {
//             item.valueInputRight = item.max;
//         } else if (item.valueInputRight < item.min) {
//             item.valueInputRight = item.min;
//         } else if (item.valueInputRight === '00') {
//             item.valueInputRight = 0;
//         } else {
//             item.valueInputRight = Number(item.valueInputRight);
//         }
//     }
// };

// 恢复默认
const restoreDefault = (item: any) => {
    item.valueInputLeft = item.defaultValueLeft;
    if (item.valueInputRight) {
        item.valueInputRight = item.defaultValueRight;
    }
};
const Mform = ref<any>(null);
defineExpose({
    Mform
});

// input 校验
const validateInput = (item: any, callback: (avg?: any) => void) => {
    if (item.controlStyle === 'STEP_INPUT') {
        if (item.value.split(',')[0] % item.step !== 0) {
            item.isUnit = true;
            callback(new Error(item.hint));
        } else {
            item.isUnit = false;
            callback();
        }
    } else {
        item.isUnit = false;
        callback();
    }
};

const numberInputBlur = (item: any) => {
    if (item.valueInputLeft > item.max) {
        item.valueInputLeft = item.max;
    }
    if (item.value && item.value.split(',')[1]) {
        if (item.value.split(',')[1] > item.max) {
            item.value.split(',')[1] = item.max;
        }
    }
};
const screenWidth = ref(document.documentElement.clientWidth) as any;

watch(
    () => screenWidth.value,
    val => {
        screenWidth.value = val;
    },
    {
        deep: true
    }
);

onMounted(() => {
    window.addEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
});
</script>
<style scoped lang="less">
.form-container {
    border-radius: 4px;
    display: grid;
    grid-template-columns: repeat(3, 340px);
    gap: 20px 48px;
    user-select: none;
    .form-box {
        display: flex;
        position: relative;
        padding-top: 24px;
    }
}
.form-container-1440 {
    grid-template-columns: repeat(3, 320px);
    gap: 20px 24px;
}

.label-position {
    width: 100%;
    color: #1b2129;

    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    height: 24px;
    line-height: 24px;
    margin-bottom: 8px;
    position: relative;
    position: absolute;
    top: 0;
    left: 0;
    .label-icon {
        width: 12px;
        height: 12px;
        cursor: pointer;
        position: relative;
        top: -6px;
        margin-right: 4px;
    }
    .label-name {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .label-error {
        color: #f55047;
        margin-right: 4px;
        position: relative;
        top: -7px;
    }
    .label-icon-linear {
        flex-shrink: 0;
        cursor: pointer;
        position: relative;
        top: -5px;
    }

    .label-bottom-error {
        top: 40px;
    }
}
.label-bottom {
    color: #626c78;
    margin-top: 4px;

    font-size: 12px;
    line-height: 15px;
    white-space: nowrap;
}

.m-form-item {
    margin-bottom: 0;
}
.default-text {
    text-align: center;
    margin-left: 4px;
}
.form-item-left {
    :deep(.m-form-item__label-required) {
        display: none;
    }
}
.form-item-right {
    :deep(.m-form-item__content) {
        margin-left: 0 !important;
    }
}
.line {
    display: inline-block;
    width: 12px;
    height: 1px;
    background: #c4c9cf;
    margin: 16px 6px 0;
}
:deep(.m-form-item__error) {
    white-space: nowrap;
}
.second-tabs {
    :deep(.m-tabs-item) {
        min-width: auto;
    }
}
.m-input {
    min-width: 60px;
    width: 60px;
}

/deep/.inner-input {
    padding: 0 !important;
}
.input-text-right {
    margin: 0 0 0 8px;
}
/deep/.m-input-number-icon {
    display: none;
}
/deep/ .m-input-number-box {
    border-radius: 4px;
}
/deep/ .m-form-item__label {
    margin-bottom: 0 !important;
}
/deep/ .m-input-number .suffix-text {
    width: 76px;
}
</style>
