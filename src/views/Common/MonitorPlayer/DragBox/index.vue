<template>
    <div :id="id" v-move :class="[type === 'computer' ? 'bm14' : 'bm4', 'drag-box']" :style="{ zIndex: zIndex }">
        <slot />
    </div>
</template>

<script setup>
import { uuid } from 'yushu-js-utils';
// import useDrawer from '@/hooks/useDrawer';

// const { drawerTop } = useDrawer();
const drawerTop = ref(0);
const isFullScreen = inject('isFullScreen');
const props = defineProps({
    minTop: {
        type: Number,
        default: 0
    },
    minLeft: {
        type: Number,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: ''
    },
    zIndex: {
        type: Number,
        default: 9999
    }
});

const id = `drag_box__${uuid(6)}`;

const vMove = el => {
    async function mouseDown(e) {
        await nextTick();
        const X = e.clientX - el.offsetLeft,
            Y = e.clientY - el.offsetTop,
            boxWidth = document.querySelector(`#${id}`).offsetWidth,
            boxHeight = document.querySelector(`#${id}`).offsetHeight;

        function mouseMove(mElement) {
            if (props.disabled) return;

            let left = mElement.clientX - X,
                top = mElement.clientY - Y;

            const documentWidth = document.documentElement.clientWidth || document.body.clientWidth,
                documentHeight = document.documentElement.clientHeight || document.body.clientHeight;

            if (top < (props.minTop || drawerTop.value)) top = props.minTop || drawerTop.value;
            if (left < props.minLeft) left = props.minLeft;

            if (top > documentHeight - boxHeight) top = documentHeight - boxHeight;
            if (left > documentWidth - boxWidth) left = documentWidth - boxWidth;

            el.style.left = `${left}px`;
            el.style.top = `${top}px`;
            el.style.cursor = 'move';
            el.style['user-select'] = 'none';
        }

        document.addEventListener('mousemove', mouseMove);

        document.addEventListener('mouseup', () => {
            el.style['user-select'] = 'auto';
            el.style.cursor = 'auto';
            document.removeEventListener('mousemove', mouseMove);
        });
    }
    el.addEventListener('mousedown', mouseDown);
};
</script>

<style lang="less" scoped>
.drag-box {
    position: fixed;
    right: calc(var(--broken-width) + 8px);
    background: #fff;
    width: fit-content;
    height: fit-content;
    border-radius: 8px;
    box-shadow: 0 22px 40px 0 rgb(98 108 120 / 8%), 0 14px 26px 0 rgb(98 108 120 / 4%), 0 0 4px 0 rgb(98 108 120 / 15%);
    z-index: 9999;
    overflow: hidden;
}
.bm4 {
    bottom: 4px;
}
.bm14 {
    bottom: 14px;
}
</style>
