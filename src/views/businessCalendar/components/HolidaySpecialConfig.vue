<script setup>
import { IconMeriComponentButtonAdd, IconMeriComponentDialogLinear } from 'meri-icon';
import { nanoid } from 'nanoid';
import i18n from '@/localization';
import { dayjsIsSameOrBefore, dayjsIsSameOrAfter } from '@/utils/dayjsTools';
import { getDayjsTz } from '@/utils/globalVariables';
import { useElementVisibility } from '@vueuse/core';
import { useTemplateRef } from 'vue';

const props = defineProps({
    code: {
        type: String,
        default: ''
    },
    maxCount: {
        type: Number,
        default: 50
    },
    width: {
        type: Number,
        default: 458
    },
    title: {
        type: String,
        default: ''
    },
    tips: {
        type: String,
        default: ''
    },
    autoScroll: {
        type: Boolean,
        default: false
    }
});

const dateScope = `${getDayjsTz().add(1, 'day').format('YYYY.MM.DD')}-${getDayjsTz().add(20, 'year').format('YYYY.MM.DD')}`;

const rangeList = defineModel('rangeList', { type: Array, default: () => [] });

const allFormItemInstances = ref([]);

const target = useTemplateRef('target');

const validateListItem = (callback, data) => {
    if (!data?.value || !data?.id) {
        callback();
        return;
    }
    const [dataStart, dataEnd] = data.value.split('-') || [];

    const otherRangeList = rangeList.value.filter(v => v?.id !== data.id && v?.value);
    const hasOverlap = otherRangeList.some(item => {
        const [otherStart, otherEnd] = item.value.split('-');
        if (!otherStart || !otherEnd) return false;
        // 包含端点的重叠检查
        return dayjsIsSameOrBefore(dataStart, otherEnd) && dayjsIsSameOrAfter(dataEnd, otherStart);
    });

    if (hasOverlap) {
        callback(new Error(i18n.global.t('meos_control_web.overlaps_with_selected_date_slot_please_check')));
    } else {
        callback();
    }
};

const validateAllFields = () => {
    allFormItemInstances.value?.forEach(c => {
        c?.validate();
    });
};

const createItem = isInit => {
    rangeList.value = [
        ...rangeList.value,
        {
            value: '',
            id: nanoid()
        }
    ];
    if (!isInit && props.autoScroll) {
        nextTick(() => {
            target?.value?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }
};

const deleteItem = delId => {
    const preList = [...rangeList.value];
    rangeList.value = preList.filter(v => v?.id !== delId);
    nextTick(() => {
        validateAllFields();
    });
};

const changeDate = () => {
    validateAllFields();
};
onMounted(() => {
    if (rangeList.value.length === 0) {
        createItem(true);
    }
});
</script>

<template>
    <div class="cold-box form-item-box">
        <slot></slot>
        <div class="form-item-box-left ft f14 mt8">
            <span>{{ props.title }}</span>
            <m-popover :show-arrow="false" theme="darkTransparent" placement="right-start" :content="props.tips">
                <IconMeriComponentDialogLinear :size="16" class="hover-icon" color="var(--gray-600)" />
            </m-popover>
        </div>
        <div ref="target" class="form-item-box-right">
            <m-form-item
                v-for="(item, i) in rangeList"
                :key="item.id"
                :ref="ins => (allFormItemInstances[i] = ins)"
                label=""
                label-width="1px"
                :prop="`${item.id}.${code + i}.value`"
                :item-model="item.value"
                :rules="[
                    {
                        validator: (value, rule, callback) => validateListItem(callback, item),
                        trigger: ['change']
                    }
                ]"
            >
                <m-date-picker
                    v-model="item.value"
                    clearable
                    type="daterange"
                    :popover-attrs="{
                        'popover-class': 'popoverClass',
                        arrowOverflow: false
                    }"
                    :scope="dateScope"
                    :placeholder="i18n.global.t('meos_control_web.start_year_date_to_end_year_date')"
                    format="YYYY.MM.DD"
                    :width="width"
                    placement="bottomRight"
                    range-separator=" - "
                    @change="changeDate"
                />
                <m-tips :disabled="rangeList.length == 1" placement="top" :content="i18n.global.t('common.delete')" theme="darkTransparent">
                    <m-button v-if="rangeList.length > 1" type="icon" icon="IconMeriActionDelete" class="ml10" @click="deleteItem(item.id)" />
                </m-tips>
            </m-form-item>

            <div v-show="rangeList.length < props.maxCount" class="fcc link-btn" @click="createItem(false)">
                <IconMeriComponentButtonAdd :size="14" :color="'var(--blue-500)'" />&nbsp;{{ i18n.global.t('meos_control_web.add') }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.form-item-box {
    border-radius: 4px;
    height: 100%;

    width: 100%;
    position: relative;
    & + .form-item-box {
        margin-top: 16px;
    }
    .link-btn {
        color: var(--blue-500);
        width: max-content;
        padding: 4px;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: var(--gray-300);
        }
    }
    &-left {
        display: flex;
        align-items: center;
        height: 22px;
        gap: 8px;
        margin-bottom: 7px;

        :deep(.m-popper-trigger) {
            display: flex;
            align-items: center;
            cursor: pointer;
        }
    }
    &-right {
        width: 100%;
    }
}
.hover-icon {
    background-color: transparent;
    border-radius: 2px;
    &:hover {
        background: rgba(196, 201, 207, 0.3);
    }
}
</style>
