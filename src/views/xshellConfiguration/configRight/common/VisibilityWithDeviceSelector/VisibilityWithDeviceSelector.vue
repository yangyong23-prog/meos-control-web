<template>
    <div class="visibility-with-device-selector-container">
        <m-form-item
            :prop="`item.${index}.valueInputLeft`"
            :item-model="item.valueInputLeft"
            require-asterisk-position="right"
            class="form-item-left"
        >
            <div
                v-if="slots.label"
                class="label-wrapper"
            >
                <slot name="label"></slot>
            </div>
            <div class="visibility-with-device-selector">
                <!-- 显隐配置单选按钮组 -->
                <div class="visibility-radio-group">
                    <m-radio-group
                        :model-value="item.valueInputLeft"
                        @change="handleVisibilityWithDeviceChange"
                    >
                        <div
                            class="list"
                            style="line-height: 14px"
                        >
                            <m-radio
                                v-for="radio in visibilityOptions"
                                :key="radio.label"
                                :disabled="!item?.editAuth"
                                :label="radio.value"
                                >{{ radio.label }}</m-radio
                            >
                        </div>
                    </m-radio-group>
                </div>
            </div>
            <slot name="default-text"></slot>
        </m-form-item>
        <!-- 设备选择器（仅在隐藏时显示） -->
        <div
            v-if="isShow"
            class="device-selector-wrapper form-item-left"
        >
            <HiddenDevicesSelector
                :selected-devices="selectedDevices"
                :class-code="item?.classCode"
                @change="handleDeviceChange"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { showAndHideOptions } from '@/views/xshellConfiguration/constants/constant';
import HiddenDevicesSelector from './HiddenDevicesSelector.vue';

// 阻止自动继承属性，避免 disabled 属性传递给 m-radio-group 时出现警告
defineOptions({
    inheritAttrs: false
});

// 获取插槽对象
const slots = useSlots();

const props = defineProps({
    item: {
        type: Object,
        default: null
    },
    index: {
        type: Number,
        default: 0
    },
    checkModify: {
        type: Function,
        default: () => {}
    }
});

const visibilityOptions = computed(() => props.item?.options || []);
const isShow = computed(() => props.item?.valueInputLeft === showAndHideOptions.show.value);

// 已选择的设备列表
const selectedDevices = computed(() => {
    if (!props.item) {
        return [];
    }
    const selectedItems = props.item.relationData;

    return selectedItems;
});

// 处理显隐配置和设备选择器的组合变化
const handleVisibilityWithDeviceChange = val => {
    if (props.item) {
        props.item.valueInputLeft = val;
        props.checkModify(val, props.item, 'left');
        props.item.relationData = [];
    }
};

// 处理设备选择变化
const handleDeviceChange = selectedItems => {
    console.log(selectedItems, 'selectedItems');
    props.item.relationData = selectedItems;
};
</script>

<style scoped lang="less">
@import '../../../styles/xshellConfigRight.less';

.visibility-with-device-selector-container {
    width: 100%;
}

.label-wrapper {
    margin-right: 12px;
}

.visibility-with-device-selector {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.visibility-radio-group {
    .list {
        display: flex;
    }
}
.device-selector-wrapper {
    margin-right: 18px;
    margin-bottom: 16px;
}
</style>
