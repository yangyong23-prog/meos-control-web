<template>
    <Swiper
        direction="vertical"
        :autoplay="{
            delay: 500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }"
        :speed="1000"
        loop
        class="notify-list"
        :slides-per-group="1"
        :space-between="0"
    >
        <SwiperSlide v-for="item in props.data" :key="item.traceId + item.state">
            <m-tag :color="tagStyle[item.operateType]?.color" :bg-color="tagStyle[item.operateType]?.bgColor" size="small">{{ item.label }}</m-tag>
            <span class="text"> {{ item.dataTime }}&nbsp;{{ item.createUser }}{{ item.content }}</span>
        </SwiperSlide>
    </Swiper>
</template>

<script setup>
import i18n from '@/localization';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { tagStyle } from '@/constants/broadCast';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.notify-list {
    height: 100%;
    list-style: none;
    position: relative;
    :deep(.swiper-slide) {
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
