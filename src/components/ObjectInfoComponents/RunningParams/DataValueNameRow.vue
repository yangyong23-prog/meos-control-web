<template>
    <div ref="dataValueRef" class="data-value" :class="{ isLink, isWrapRow }">
        <span v-ellipsis class="data-value-name m-ellipsis">{{ `${name}` + '：' }}</span>
        <m-popover :disabled="!isLink" :enterable="false" theme="darkTransparent" :show-arrow="false">
            <template #content>
                <p style="font-size: 14px">{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ time ? dayjs(time).format('YYYY.MM.DD HH:mm:ss') : '' }}</p>
                <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
            </template>

            <span v-ellipsis class="data-value-value m-ellipsis" @click.stop="click">
                {{ isEmpty(value) }}
            </span>
        </m-popover>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { isEmpty } from '@/utils/tools';
import dayjs from 'dayjs';
import { useElementSize } from '@vueuse/core';

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
    index: {
        type: Number,
        default: 0
    }
});
const emit = defineEmits(['click']);
const dataValueRef = ref(null);
const { height } = useElementSize(dataValueRef);
const isComputed = ref(false);

const isWrapRow = computed(() => (isComputed.value ? isComputed.value : height.value > 22));

watch(
    () => isWrapRow.value,
    cur => {
        nextTick(() => {
            isComputed.value = cur;
        });
    }
);
const click = () => {
    if (props.isLink) {
        emit('click');
    }
};
</script>
<style lang="less" scoped>
.data-value {
    flex: 1;
    min-width: calc(50% - 12px);
    max-width: calc(50%);
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
    &.isWrapRow {
        min-width: fit-content;
        max-width: calc(100%);
    }
}
</style>
