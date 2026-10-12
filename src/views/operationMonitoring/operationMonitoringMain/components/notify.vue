<template>
    <div class="notify">
        <m-popover v-if="curNotifyList?.length" popover-class="notify-list-popover">
            <template #content>
                <div class="scroll-popover-wrap">
                    <m-scrollbar>
                        <div class="scroll-popover">
                            <div v-for="item in poverNotifyList" :key="item.content" class="popover-box">
                                <m-tag :color="tagStyle[item.operateType]?.color" :bg-color="tagStyle[item.operateType]?.bgColor" size="small">{{ item.label }}</m-tag>
                                <span>{{ item.content }}</span>
                            </div>
                        </div>
                    </m-scrollbar>
                </div>
            </template>
            <div class="notify-wrap">
                <ul ref="notifyListRef" class="notify-list" :class="{ 'animate-up': animateUp }">
                    <li v-for="item in curNotifyList" :key="item.content" @mouseenter="mouseenterNotify" @mouseleave="mouseleaveNotify">
                        <m-tag :color="tagStyle[item.operateType]?.color" :bg-color="tagStyle[item.operateType]?.bgColor" size="small">{{ item.label }}</m-tag>
                        <span class="text">{{ item.content }}</span>
                    </li>
                </ul>
            </div>
        </m-popover>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { tagStyle } from '@/constants/broadCast';

const props = defineProps({
    notifyList: {
        type: Array,
        default: () => []
    }
});
const animateUp = ref(false);
const curNotifyList = ref([]);
const poverNotifyList = ref([]);

let timer = null;
//设置滚动时间
const scrollAnimate = () => {
    animateUp.value = true;
    setTimeout(() => {
        curNotifyList.value.push(curNotifyList.value[0]);
        curNotifyList.value.shift();
        animateUp.value = false;
    }, 500);
};

onMounted(() => {
    if (curNotifyList.value.length > 1) {
        timer = setInterval(scrollAnimate, 2000);
    }
});

onUnmounted(() => {
    clearInterval(timer);
});

const mouseenterNotify = () => {
    clearInterval(timer);
};
const mouseleaveNotify = () => {
    if (curNotifyList.value.length > 1) {
        timer = setInterval(scrollAnimate, 2000);
    }
};

watch(
    () => props.notifyList,
    val => {
        poverNotifyList.value = JSON.parse(JSON.stringify(val));
        curNotifyList.value = val;
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.notify {
    .notify-wrap {
        width: 100%;
        height: 54px;
        overflow: hidden;
        .notify-list {
            height: 54px;
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
    }

    .animate-up {
        transition: all 0.5s ease-in-out;
        transform: translateY(-54px);
    }
}

.scroll-popover {
    .popover-box {
        font-family: Microsoft YaHei UI;
        margin-bottom: 16px;
        display: flex;
        align-items: start;
        span {
            display: inline-block;
            margin-left: 8px;
            width: calc(100% - 40px);
            word-wrap: break-word;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
<style lang="less">
.notify-list-popover {
    --aside-padding: 16px;
    padding: 20px 20px 16px 20px !important;
    border-radius: 8px !important;
    border: 1px solid #e1e5eb;
    width: calc(370px + var(--aside-padding));
    max-width: calc(370px + var(--aside-padding));
}

@media only screen and (min-width: 1600px) {
    .notify-list-popover {
        --aside-padding: 16px;
        width: calc(450px + var(--aside-padding)) !important;
        max-width: calc(450px + var(--aside-padding)) !important;
    }
}
</style>
