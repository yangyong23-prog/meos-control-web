<template>
    <div :class="['bc-title', size, 'fcc', !!path ? 'is-jump' : '']" @click="jump">
        <slot></slot>
        <VueSvg v-if="path" :path="Right" />
    </div>
</template>

<script setup>
import VueSvg from './VueSvg.vue';
import Right from '@/assets/svg/arrow.right.svg';
import { JumpFun } from '@/utils/envUtils';
const props = defineProps({
    size: {
        type: String,
        default: 'M'
    },
    path: {
        type: String,
        default: ''
    },
    prefix: {
        type: String,
        default: ''
    },
    params: {
        type: Object,
        default: () => ({})
    }
});
const jump = () => {
    if (props.path) {
        JumpFun(props.path, props.params, props.prefix);
    }
};
</script>
<style lang="less" scoped>
.bc-title {
    color: var(--gray-800);
    font-weight: 700;
    width: max-content;
    padding: 0 4px;
    border-radius: 4px;
    &.M {
        font-size: 14px;
        height: 22px;
        line-height: 22px;
    }
    &.L {
        font-size: 18px;
        height: 26px;
        line-height: 26px;
    }
    &.is-jump {
        cursor: pointer;
        &:hover {
            background-color: var(--alpha-30);
        }
    }
}
.title-bl {
    color: #58a9ff;
}
.title-og {
    color: var(--orange-600, #f29f00);
}
.title-red {
    color: var(--red-400, #f8766f);
}
.title-custom {
    color: #769fd4;
}
</style>
