<template>
    <i18n-t :keypath="nameKey" :tag="htmlTag" scope="global" v-bind="attrs">
        <template v-for="(item, key) in slots" #[key]>
            <slot :name="key"></slot>
        </template>
    </i18n-t>
</template>

<script setup>
import { useAttrs, useSlots } from 'vue';

const attrs = useAttrs();

const slots = useSlots();

const props = defineProps({
    nameKey: {
        type: String,
        default: ''
    },
    htmlTag: {
        type: String,
        default: ''
    }
});
</script>

<style lang="less" scoped></style>
