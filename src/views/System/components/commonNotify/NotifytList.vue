<template>
    <ul ref="notifyListRef" class="notify-list" :class="{ 'animate-up': animateUp }">
        <li v-for="item in list" :key="item.traceId + item.state" @mouseenter="mouseenterNotify" @mouseleave="mouseleaveNotify">
            <m-tag :color="tagStyle[item.operateType]?.color" :bg-color="tagStyle[item.operateType]?.bgColor" size="small">{{ item.label }}</m-tag>
            <span class="text">{{ item.dataTime }}&nbsp;{{ item.createUser }}{{ item.content }}</span>
        </li>
    </ul>
</template>

<script setup>
import i18n from '@/localization';
import { tagStyle } from '@/constants/broadCast';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});
const animateUp = ref(false);

const list = ref([]);
let timer = null,
    timerout = null;

//设置滚动时间
const scrollAnimate = () => {
    animateUp.value = true;
    timerout = setTimeout(() => {
        list.value.push(list.value.shift());
        animateUp.value = false;
        clearTimeout(timerout);
    }, 500);
};

const mouseenterNotify = () => {
    clearInterval(timer);
};
const mouseleaveNotify = () => {
    if (list.value.length > 1) {
        timer = setInterval(scrollAnimate, 2000);
    }
};
onMounted(() => {
    if (props.data.length > 1) {
        clearInterval(timer);
        clearTimeout(timerout);
        timer = setInterval(scrollAnimate, 2000);
        list.value = structuredClone(props.data);
    }
});
onUnmounted(() => {
    clearInterval(timer);
    clearTimeout(timerout);
});
</script>
<style lang="less" scoped>
.animate-up {
    transition: all 0.5s ease-in-out;
    transform: translateY(-54px);
}
.notify-list {
    height: 100%;
    list-style: none;
    position: relative;
    li {
        height: 54px;
        line-height: 54px;
        padding: 0 20px;
        display: inline-flex;
        align-items: center;
        width: 100%;
        .text {
            line-height: 54px;
            width: 380px;
            display: inline-block;
            margin-left: 8px;
            color: @grey-900;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            user-select: none;
        }
    }
}
</style>
