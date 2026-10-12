<template>
    <PopoverWrap :visible="visible" :disabled="disabled">
        <template #content>
            <div v-if="PopoverParams" class="pop-confirm-container">
                <!-- 枚举类型参数 -->
                <span v-if="PopoverParams.dataType === 'ENUM'" class="title mb8">{{ PopoverParams.infoCodeName }}</span>
                <div v-if="PopoverParams.dataType === 'ENUM'" class="content mb10">
                    <m-radio-group v-model="PopoverParams.dataValue">
                        <div class="radio-list">
                            <m-radio v-for="item in PopoverParams.dataSource" :key="item.code" :label="item.code" :size="14">{{ item.name }} </m-radio>
                        </div>
                    </m-radio-group>
                    <span v-if="PopoverParams.dataValueError" class="error-text">{{ i18n.global.t('meos_control_web.input_required_check_error_4') }}</span>
                </div>
                <!-- 非枚举类型参数 -->
                <span v-if="['DOUBLE', 'INTEGER'].includes(PopoverParams.dataType)" class="title mb8">{{ PopoverParams.infoCodeName }}</span>
                <div v-if="['DOUBLE', 'INTEGER'].includes(PopoverParams.dataType)" class="content mb16">
                    <m-input-number
                        v-model="PopoverParams.dataValue"
                        text-align="left"
                        width="280"
                        :placeholder="i18n.global.t('common.placeholder_input')"
                        controls="rightButton"
                        :precision="PopoverParams.dataType === 'DOUBLE' ? undefined : 0"
                        :error-text="PopoverParams.dataValueError"
                    >
                        <template #suffix>{{ PopoverParams.unit || '--' }}</template>
                    </m-input-number>
                </div>
                <!-- 枚举和非枚举类型在自动模式下展示截止时间 -->
                <span v-if="PopoverParams.manualAutoStatus === '1'" class="title mb8">{{ i18n.global.t('meos_control_web.deadline') }}</span>
                <div v-if="PopoverParams.manualAutoStatus === '1'" class="content mb16">
                    <m-date-picker
                        v-model="PopoverParams.dateTime"
                        width="280"
                        type="datetime"
                        :scope="scopeTime"
                        :time-picker="{
                            format: 'hm'
                        }"
                        :error-info="PopoverParams.dateTimeError"
                    ></m-date-picker>
                </div>
                <!-- 三种类型都展示原因 -->
                <span class="title mb8">{{ i18n.global.t('meos_control_web.reason') }}</span>
                <div class="content mb16">
                    <m-input
                        v-model="PopoverParams.reason"
                        type="textarea"
                        width="240"
                        height="151"
                        show-word-limit
                        :placeholder="i18n.global.t('common.placeholder_input')"
                        :maxlength="100"
                        :error-text="PopoverParams.reasonError"
                    >
                    </m-input>
                </div>
                <footer>
                    <m-button type="default" size="small" @click="closePop">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" size="small" :loading="isLoading" @click="savePopover">{{ i18n.global.t('common.confirm') }}</m-button>
                </footer>
            </div>
        </template>
        <slot></slot>
    </PopoverWrap>
</template>
<script setup>
import PopoverWrap from './PopoverWrap.vue';
import usePopoverWrap from '@/views/Common/EquipmentList/hooks/usePopoverWrap';
import i18n from '@/localization';

const props = defineProps({
    manualAutoStatus: {
        type: String,
        default: ''
    },
    dataValue: {
        type: String,
        default: ''
    },
    projectId: {
        type: String,
        default: ''
    },
    objectIds: {
        type: Array,
        default: () => []
    },
    data: {
        type: Object,
        default: () => {}
    },
    disabled: {
        type: Boolean,
        default: false
    },
    visible: {
        type: Boolean,
        default: true
    },
    cellType: {
        type: String,
        default: ''
    }
});
const emit = defineEmits('tableInit');
const { PopoverParams, savePopover, isLoading, scopeTime } = usePopoverWrap(props, emit);
const closePop = inject('closePop');
</script>
<style lang="less" scoped>
.pop-confirm-container {
    width: 320px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    padding: 16px 20px;
    .title {
        display: inline-block;
        color: #646a73;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        position: relative;
        height: 22px;
        line-height: 22px;
        &::before {
            position: absolute;
            right: -10px;
            top: -1px;
            content: '*';
            color: #f55047;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            height: 22px;
            line-height: 22px;
        }
    }
    .content {
        position: relative;
        .radio-list {
            display: flex;
            flex-wrap: wrap;
            :deep(.m-radio) {
                display: flex;
                align-items: center;
                margin: 0;
                height: 28px;
                line-height: 22px;
                margin-right: 12px;
            }
        }
        .error-text {
            position: absolute;
            left: 0;
            bottom: -10px;
            color: #f55047;
            font-size: 12px;
        }
        .error-text-input {
            bottom: -15px;
        }
    }
    footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
    }
}
</style>
