<template>
    <div class="align-name">对齐方式</div>
    <div class="align-content">
        <VueSvg
            v-for="(align, index) in alignments"
            :key="index"
            :path="require(`@/assets/svg/align/${align.icon}.svg`)"
            @click="modifyAlign(align.type)"
        />
    </div>
</template>

<script setup>
import VueSvg from '@/components/VueSvg.vue';
import { ALIGN_TYPE } from '@yushu/relation-chart';
const alignments = [
    { icon: 'left', type: ALIGN_TYPE.LEFT },
    { icon: 'center', type: ALIGN_TYPE.H_CENTER },
    { icon: 'right', type: ALIGN_TYPE.RIGHT },
    { icon: 'start', type: ALIGN_TYPE.TOP },
    { icon: 'alignCenter', type: ALIGN_TYPE.V_CENTER },
    { icon: 'end', type: ALIGN_TYPE.BOTTOM }
];
const emits = defineEmits(['modifyAlign']);

const modifyAlign = type => {
    emits('modifyAlign', type);
};
</script>

<style lang="scss" scoped>
.align-name {
    color: #2e3742;
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    margin: 0 20px 12px;
}
.align-content {
    width: calc(100% - 40px);
    margin: 0 20px;
    display: grid;
    gap: 11px;
    grid-template-columns: repeat(6, auto);
    svg {
        width: 32px;
        height: 32px;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
            background: #e8ecf0;
        }
    }
}
</style>
