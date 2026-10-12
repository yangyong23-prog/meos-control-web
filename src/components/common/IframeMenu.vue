<!--
 * @Author: guoxiaohuan
 * @Date: 2024-04-25 14:06:24
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-04-25 15:31:37
 * @Description:
-->
<template>
    <div class="frame-menu">
        <div
            v-for="item in menuData"
            :key="item.id"
            :class="{
                'frame-menu-item': true,
                fcc: true,
                'is-active': item.id === modelValue
            }"
            @click="menusChange(item)"
        >
            <slot name="menuItem" :data="item">
                <div class="frame-menu-item-icon">
                    <svg class="icon" aria-hidden="true" style="height: 24px; width: 24px">
                        <use :xlink:href="item.icon" />
                    </svg>
                </div>
                <div v-ellipsis class="frame-menu-item-name m-ellipsis">{{ item.name }}</div>
            </slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MenuItem } from '@/types/common';
import { PropType } from 'vue';
const emit = defineEmits(['update:modelValue', 'menusChange']);

const props = defineProps({
    menuData: {
        type: Array as PropType<MenuItem[]>,
        default: () => []
    },
    modelValue: {
        type: String,
        default: ''
    }
});

const menusChange = item => {
    emit('update:modelValue', item.id);
    emit('menusChange', item);
};
</script>

<style lang="less" scoped>
.frame-menu {
    --frame-menu-padding: 8px 0;
    --frame-menu-width: 72px;
    --frame-menu-item-padding: 10px 0;
    --frame-menu-item-height: 64px;
    height: 100%;
    width: var(--frame-menu-width);
    padding: var(--frame-menu-padding);
    box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
    border-right: 1px solid var(--gray-300, #e1e5eb);
    background: var(--Grey-Grey-0, #fff);
    &-item {
        height: var(--frame-menu-item-height);
        padding: var(--frame-menu-item-padding);
        flex-direction: column;
        color: var(--blue-500);
        filter: grayscale(1);
        cursor: pointer;
        width: var(--frame-menu-width);
        min-width: var(--frame-menu-width);

        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 20px;
        display: flex;
        &-icon {
            height: 24px;
            width: 24px;
        }
        &-name {
            text-align: center;
            width: 100%;
            padding: 0 4px;
        }
        &:hover,
        &.is-active {
            filter: grayscale(0);
            background: linear-gradient(90deg, #e3f1ff 0%, rgba(243, 249, 255, 0.43) 100%);
            position: relative;
            &::before {
                position: absolute;
                content: '';
                display: block;
                top: 50%;
                transform: translateY(-50%);
                left: 0;
                height: 50%;
                width: 2px;
                border-radius: 0 2px 2px 0;
                background-color: var(--blue-500);
            }
        }
    }
}
</style>
