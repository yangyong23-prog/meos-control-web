<template>
    <m-popover trigger="manually" :is-open="isOpen" class="tag-select-popover" :width="width" @show="openPopoverFun" @hide="hidePopoverFun">
        <template #content>
            <slot name="options" :options="options">
                <m-tabs v-if="optionTypeTab" v-model="tabActive" :data="tabDataAndOptions" v-bind="{ ...tabAttrs }" />
                <template v-if="hasSearchOptions">
                    <m-scrollbar :max-height="`calc(${maxHeight} - ${optionTypeTab ? 57 : 16}px)`">
                        <div class="tag-select_options">
                            <template v-for="item in options" :key="item.id">
                                <div
                                    v-if="item.name.includes(searchValue)"
                                    v-ellipsis
                                    class="opiton-item m-ellipsis"
                                    :class="{ 'opiton-item-active': isActive(item.id) }"
                                    @click="addTagFun(item)"
                                >
                                    {{ item.name }}
                                </div>
                            </template>
                        </div>
                    </m-scrollbar>
                </template>
                <template v-else>
                    <slot name="empty"><div class="empty-box">{{ i18n.global.t('meos_control_web.no_content') }}</div></slot>
                </template>
            </slot>
        </template>
        <Draggable
            ref="origin"
            :list="modelValue"
            class="tag-select"
            :class="{ clearable: clearable, active: active, disabled: disabled }"
            :style="{ width: width }"
            @end="moveEndTag"
            @click="isOpen = true"
            @keydown.enter="createTagFun"
            @keydown.delete="deleteTagFun"
        >
            <template #item="{ element, index }">
                <div class="tag-select_tag-box">
                    <div v-ellipsis class="tag-box-text m-ellipsis">
                        {{ element.name }}
                    </div>
                    <div class="tag-box-colse" @click.stop="deleteOneFun(index)">
                        <IconMeriComponentClose />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="tag-select_input">
                    <input :value="searchValue" :placeholder="modelValue.length > 0 ? '' : placeholder" @input="inputSearchFun" />
                </div>
                <div v-if="clearable && hasValue" class="tag-select_clear" @click.stop="clearFun">
                    <IconMeriComponentCancel />
                </div>
            </template>
        </Draggable>
    </m-popover>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { ListItem, TagSelectProps } from './props';
import { IconMeriComponentClose, IconMeriComponentCancel } from 'meri-icon';
import Draggable from 'vuedraggable';
const FormItemContext: any = inject('FormItem');

const props = defineProps(TagSelectProps);
const emits = defineEmits(['update:modelValue', 'update:searchValue', 'clear', 'input', 'change', 'moveEnd']);
const modelValue = computed({
    get() {
        return props.modelValue || [];
    },
    set(val) {
        emits('update:modelValue', val);
        return val;
    }
});
const tabActive = ref(unref(props).tabDataAndOptions?.[0]?.id || '');
const options = computed({
    get() {
        if (props.optionTypeTab) {
            return props.tabDataAndOptions?.find(item => item.id === tabActive.value)?.options || [];
        }
        return props.options;
    },
    set(val) {
        return val;
    }
});

const search = ref('');
const searchValue = computed({
    get() {
        if (typeof props.searchValue !== 'undefined') {
            return props.searchValue;
        }
        return search.value;
    },
    set(val) {
        if (typeof props.searchValue !== 'undefined') {
            emits('update:searchValue', val);
            return val;
        }
        search.value = val;
        return val;
    }
});
const hasSearchOptions = computed(() => options.value.filter((item: { name: string | string[] }) => item.name.includes(searchValue.value)).length > 0);
const active = ref(false);
const isOpen = ref(false);
const origin = ref();
const hasValue = computed(() => modelValue.value?.length > 0);
const openPopoverFun = () => {
    active.value = true;
    isOpen.value = true;
    window.addEventListener('click', closePopover, true);
};
const hidePopoverFun = () => {
    window.removeEventListener('click', closePopover, true);
    active.value = false;
    searchValue.value = '';
};

const isActive = computed(() => (id: any) => {
    let flag = false;
    modelValue.value.forEach(item => {
        if (item.id === id) {
            flag = true;
        }
    });
    return flag;
});
const addTagFun = (data: ListItem) => {
    modelValue.value?.push(data);
    updateModelValue();
    changeModelValue();
};
const createTagFun = () => {
    if (searchValue.value) {
        modelValue.value?.push({ id: searchValue.value, name: searchValue.value, type: 'enter' });
        searchValue.value = '';
        updateModelValue();
        changeModelValue();
    }
};
const deleteTagFun = () => {
    if (!searchValue.value && modelValue.value.length > 0) {
        modelValue.value.pop();
        updateModelValue();
        changeModelValue();
    }
};
const moveEndTag = (evt: any, originalEvent: any) => {
    emits('moveEnd', evt, originalEvent);
    console.log(modelValue.value);
    updateModelValue();
    changeModelValue();
};
const inputSearchFun = (e: any) => {
    searchValue.value = e.target.value;
    emits('input', e);
};
const deleteOneFun = (index: number) => {
    modelValue.value?.splice(index, 1);
    updateModelValue();
    changeModelValue();
};
const clearFun = () => {
    searchValue.value = '';
    modelValue.value = [];
    emits('clear');
    validate();
};
const closePopover = (e: any) => {
    const popover = document.querySelector('.tag-select-popover');
    if (!origin.value?.targetDomElement?.contains(e.target) && !popover?.contains(e.target) && active.value) {
        isOpen.value = false;
    }
};
const updateModelValue = () => {
    emits('update:modelValue', modelValue.value);
};
const changeModelValue = () => {
    emits(
        'change',
        modelValue.value,
        modelValue.value.map(item => item.id)
    );
    validate();
};
const validate = () => {
    nextTick(() => {
        FormItemContext?.validate('change');
    });
};
defineExpose({ openPopoverFun });
</script>
<style lang="less" scoped>
.m-form-item.is-error {
    .tag-select {
        border: 1px solid var(--red-500);
    }
}
.tag-select {
    display: inline-flex;
    min-height: 32px;
    border: 1px solid var(--gray-400);
    border-radius: var(--big-radius);
    padding: 4px 8px;
    flex-wrap: wrap;
    position: relative;
    transition: border-color 0.2s;
    background-color: #fff;
    &:hover {
        border: 1px solid var(--blue-600);
    }
    &.clearable {
        padding-right: 20px;
    }
    &.active {
        border: 1px solid var(--blue-600);
    }
    &.disabled {
        border: 1px solid var(--gray-400);
        background-color: var(--gray-200);
        pointer-events: none;
    }
    .tag-select_tag {
        max-width: 100%;
        &-box {
            height: 20px;
            box-sizing: border-box;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            padding: 0px 8px;
            font-weight: var(--platform-font-weight);
            font-size: var(--font-m);
            color: var(--title-color);
            background-color: var(--gray-200);
            border-radius: var(--small-radius);
            margin: 1px 6px 1px 0;
            margin-right: 4px;
            max-width: 100%;
            cursor: move;
            user-select: none;
            &.sortable-chosen {
                background: var(--blue-100);
            }
            .tag-box-text {
                flex: 1;
                line-height: 20px;
                height: 100%;
            }
            .tag-box-colse {
                display: flex;
                align-items: center;
                cursor: pointer;
                &:hover {
                    background-color: var(--gray-300);
                }
            }
        }
    }
    .tag-select_input {
        display: flex;
        flex: 1;
        flex-grow: 1;
        border: none;
        color: var(--gray-900);
        caret-color: var(--primary-color);
        appearance: none;
        height: 22px;
        background-color: transparent;
        min-width: 20px;
        input {
            width: 100%;
            background-color: initial;
        }
    }
    &:hover {
        .tag-select_clear {
            display: flex;
        }
    }
    .tag-select_clear {
        cursor: pointer;
        display: none;
        align-items: center;
        position: absolute;
        top: 50%;
        right: 4px;
        transform: translateY(-50%);
    }
}
</style>

<style lang="less">
.tag-select_clear:hover path.fill_color {
    fill: var(--blue-400);
}
.m-popover.tag-select-popover {
    --m-popover-padding: var(--padding-2);
    min-width: 120px;
    max-height: 300px;
    min-height: 48px;
    .tag-select_options {
        .opiton-item {
            box-sizing: border-box;
            width: 100%;
            height: 40px;
            padding: 0 12px;
            font-size: var(--font-m);
            font-weight: var(--platform-font-weight);
            color: var(--title-color);
            border-radius: 4px;
            line-height: 40px;
            border: 1px solid #fff;
            cursor: pointer;
            user-select: none;
            &:hover {
                background: var(--divider-color);
            }
            &-active {
                background: var(--blue-100);
                color: var(--primary-color);
            }
        }
    }
    .empty-box {
        color: var(--describe-color);
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .m-tabs-scroll {
        position: relative;
        &:after {
            content: ' ';
            display: block;
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0.6px;
            height: 1.2px;
            background-color: var(--gray-300);
        }
    }
}
</style>
