<template>
    <div
        class="fcc"
        :style="{
            left: `${data.absoluteLocation.x}px`,
            top: `${data.absoluteLocation.y}px`,
            width: `${data.size.x}px`,
            height: `${data.size.y + 4}px`,
            fontSize: `${legendScaleRatio * fontSize}px`,
            position: 'absolute'
        }"
        @mouseenter="onMouseenter"
    >
        <div v-ellipsis class="equip-name m-ellipsis">{{ data.aliasName || data.localName }}</div>
    </div>
</template>
<script setup>
import { inject, defineProps } from 'vue';
import { editorKey } from '@/utils/injectionKey';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    },
    fontSize: {
        type: Number,
        default: 24
    }
});

const editor = inject(editorKey);

const onMouseenter = () => {
    editor?.hoverModel(props.data?.dataObjectId);
};
</script>

<style scoped lang="scss">
.equip-name {
    color: #1b2129;
    border-radius: 1.16px;
    background: rgb(232 236 240 / 80%);
    padding: 1px 2px;
    user-select: none;
    text-align: center;
}
</style>
