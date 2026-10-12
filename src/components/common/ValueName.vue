<template>
    <m-popover :disabled="!canLink" :enterable="false" theme="darkTransparent" :show-arrow="false">
        <template #content>
            <p style="font-size: 14px">{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ time ? dayjs(time).format('YYYY.MM.DD HH:mm:ss') : '' }}</p>
            <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
        </template>
        <div class="value-name" :class="[type, layout, canLink ? 'is-link' : '']" @click="canLink ? ToAnalysis(infoCode, id) : null">
            <template v-if="layout === 'value-name'">
                <div v-ellipsis="{ class: ['value-name-ellipsis-class'] }" class="value-name-value m-ellipsis">
                    <span class="value-name-value" :style="valueStyle">
                        <slot name="value-prefix"></slot>
                        <slot name="value" :data="iotDataValue">{{ iotDataValue }}</slot>
                        <slot name="value-suffix"></slot>
                    </span>
                    <span class="value-name-unit" :style="unitStyle">
                        <slot name="unit-prefix"></slot>
                        <slot name="unit" :data="unit">{{ unit }}</slot>
                        <slot name="unit-suffix"></slot>
                    </span>
                </div>
                <div v-ellipsis="{ class: ['value-name-ellipsis-class'] }" class="value-name-title m-ellipsis" :style="nameStyle">
                    <slot name="unit-prefix"></slot>
                    <slot name="unit" :data="name">{{ name }}</slot>
                    <slot name="unit-suffix"></slot>
                </div>
            </template>
            <template v-else>
                <div v-ellipsis="{ class: ['value-name-ellipsis-class'] }" class="value-name-title m-ellipsis" :style="nameStyle">
                    <slot name="unit-prefix"></slot>
                    <slot name="unit" :data="name">{{ name }}</slot>
                    <slot name="unit-suffix"></slot>
                </div>
                <div v-ellipsis="{ class: ['value-name-ellipsis-class'] }" class="value-name-value m-ellipsis" :style="valueStyle">
                    <span class="value-name-value" :style="valueStyle">
                        <slot name="value-prefix"></slot>
                        <slot name="value" :data="iotDataValue">{{ iotDataValue }}</slot>
                        <slot name="value-suffix"></slot>
                    </span>
                    <span class="value-name-unit" :style="unitStyle">
                        <slot name="unit-prefix"></slot>
                        <slot name="unit" :data="unit">{{ unit }}</slot>
                        <slot name="unit-suffix"></slot>
                    </span>
                </div>
            </template>
        </div>
    </m-popover>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { jumpToAnalysis } from '@/utils/envUtils';
import dayjs from 'dayjs';
import { isNil, toNumber } from 'lodash';
const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    value: {
        type: String,
        default: undefined
    },
    name: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        default: ''
    },
    infoCode: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'vertical', // vertical or horizontal
        validator: v => ['vertical', 'horizontal'].includes(v)
    },
    layout: {
        type: String,
        default: 'value-name', // value-name or name-value
        validator: v => ['value-name', 'name-value'].includes(v)
    },
    displayDirective: {
        type: String,
        default: 'text', // text or html
        validator: v => ['text', 'html'].includes(v)
    },
    valueStyle: {
        type: Object,
        default: () => ({})
    },
    nameStyle: {
        type: Object,
        default: () => ({})
    },
    unitStyle: {
        type: Object,
        default: () => ({})
    },
    isLink: {
        type: Boolean,
        default: false
    },
    time: {
        type: String,
        default: ''
    }
});
const canLink = computed(() => {
    return props.isLink && !isNil(iotData.value?.dataValue);
});
const ToAnalysis = (infoCode, id) => {
    const jumpParams = {
        infoCode,
        id
    };
    jumpToAnalysis(jumpParams);
};
const isEmptyFun = v => {
    return v === null || v === undefined || v === '' || v === '--' || v === false;
};
/**
 * 获取数据的显示字符串和 HTML
 * @param {Object} data - 数据对象
 * @returns {Object} { html, text }
 */
const getValueStr = data => {
    // 数据为空时返回占位
    if (!data) {
        return { html: `<span>--</span>`, text: '--' };
    }

    // 优先处理枚举类型（dataSource/dataSources）
    const sources = data.dataSource || data.dataSources;
    if (Array.isArray(sources) && sources.length) {
        // 查找匹配的枚举名称
        const matched = sources.find(item => {
            return item.code === data.dataValue || toNumber(item.code) === toNumber(data.dataValue);
        });
        const str = matched ? matched.name : '--';
        return { html: `<span>${str}</span>`, text: str };
    }

    // 判断数据是否为空
    let value = !isEmptyFun(data.dataValue) ? data.dataValue : '--';

    // 如果不是占位，则按 scale 保留小数
    if (value !== '--') {
        const num = parseFloat(value);
        value = isNaN(num) ? value : num.toFixed(data.scale || 1);
    }
    return {
        html: `<span>${value}</span>`,
        text: value
    };
};
const iotData = computed(() => {
    if (props.id || props.infoCode) {
        // 如果有 id 或 infoCode，则获取对应的数据
        return getIotData(props.id, props.infoCode);
    }
    return null;
});

const iotDataValue = computed(() => {
    return isNil(props.value) ? getValueStr(iotData.value)[props.displayDirective] : props.value;
});
</script>
<style lang="less" scoped>
.value-name {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    &.horizontal {
        flex-direction: row;
        justify-content: start;
    }
    &.is-link {
        .value-name-value {
            cursor: pointer;
            color: var(--blue-500) !important;
        }
    }
}
.value-name-ellipsis-class {
    .value-name-value,
    .value-name-title {
        color: var(--gray-0) !important;
        font-size: 14px !important;
        font-weight: 500 !important;
    }
}
</style>
