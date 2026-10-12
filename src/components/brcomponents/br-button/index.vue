<template>
    <m-button ref="button" @click="clickFun">
        <template #default>
            <slot></slot>
        </template>
    </m-button>
</template>

<script lang="ts">
import props, { Props } from './props';
export default defineComponent({
    name: 'BrButton',
    props,
    emits: ['click'],
    setup(props: Props, { emit }) {
        const button = ref<HTMLButtonElement | null>(null);
        const clickFun = () => {
            emit('click');
            if (props.url) {
                openLoading((button.value as any).$el);
            }
        };
        const openLoading = (e: HTMLButtonElement) => {
            e.classList.add('iconfont');
            e.classList.add('icon-jiazai');
            e.classList.add('auto-loading');
            e.disabled = true;
            e.id = props.url || '';
        };
        return {
            clickFun,
            button
        };
    }
});
</script>
<style scoped lang="less">
@keyframes rotate {
    0% {
        -webkit-transform: rotate(0deg);
    }
    25% {
        -webkit-transform: rotate(90deg);
    }
    50% {
        -webkit-transform: rotate(180deg);
    }
    75% {
        -webkit-transform: rotate(270deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}
.auto-loading {
    cursor: not-allowed;
    color: rgb(139, 148, 158);
    &::before {
        color: rgb(139, 148, 158);
        animation: rotate 1s linear infinite;
        margin-right: 8px;
    }
}
</style>
