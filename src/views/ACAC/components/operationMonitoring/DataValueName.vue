<template>
    <div v-if="enableShow" class="data-value" :class="{ isLink }">
        <m-popover :disabled="!isLink" :enterable="false" theme="darkTransparent" :show-arrow="false">
            <template #content>
                <p style="font-size: 14px">{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ time ? dayjs(time).format('YYYY.MM.DD HH:mm:ss') : '' }}</p>
                <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
            </template>
            <div v-ellipsis class="data-value-value m-ellipsis" @click="click">
                {{ isEmpty(value) }}
            </div>
        </m-popover>
        <div v-ellipsis class="data-value-name m-ellipsis">{{ name }}</div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { isEmpty, isEmptyNoReturn } from '@/utils/tools';
import dayjs from 'dayjs';
import { isEdge } from '@/utils/envUtils';
const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    value: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        default: ''
    },
    isLink: {
        type: Boolean,
        default: false
    },
    time: {
        type: String,
        default: ''
    },
    showFilter: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['click']);

const enableShow = computed(() => {
    if (!props.showFilter) {
        return true;
    }
    if (isEdge()) {
        return true;
    } else {
        const valText = props.value;
        const isEmptyVal = typeof valText === 'string' && valText.startsWith('--');
        return !isEmptyVal;
    }
});
const click = () => {
    if (props.isLink) {
        emit('click');
    }
};
</script>
<style lang="less" scoped>
.data-value {
    height: 100%;
    &-name {
        position: relative;
        z-index: 1;
        color: var(--gray-600);
        height: 22px;
        line-height: 22px;
    }
    &-value {
        width: max-content;
        max-width: 100%;
        color: var(--gray-900);
        height: 22px;
        line-height: 22px;
    }
    &.isLink {
        .data-value-value {
            color: var(--blue-500);
            cursor: pointer;
        }
    }
}
</style>
