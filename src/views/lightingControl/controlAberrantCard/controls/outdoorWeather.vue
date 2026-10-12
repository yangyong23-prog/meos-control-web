<!--
 * @Author: guoxiaohuan
 * @Date: 2024-04-26 14:48:55
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-16 15:01:39
 * @Description:
-->
<template>
    <div class="outdoor-weather-container">
        <img src="@/assets/imgs/partlyCloudy.png" alt="" :style="{ marginRight: screenWidth <= 1600 ? '8px' : '20px' }" />
        <template v-for="(item, index) in weatherData" :key="index + 'w'">
            <div class="weather-item">
                <div v-ellipsis class="m-ellipsis weather-item-name">{{ item.text }}</div>
                <div class="weather-item-time">{{ item.time }}</div>
            </div>
            <div v-if="index < 2" class="line" :style="{ margin: screenWidth <= 1600 ? '6px' : '16px' }"></div>
        </template>
    </div>
</template>

<script setup>
const weatherData = inject('weatherData');
const screenWidth = ref(document.documentElement.clientWidth);

watch(
    () => screenWidth.value,
    val => {
        screenWidth.value = val;
    },
    {
        deep: true
    }
);

watch(
    () => weatherData?.value,
    val => {
        weatherData.value = val;
    },
    {
        deep: true
    }
);

onMounted(() => {
    window.addEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
});
</script>

<style lang="less" scoped>
.outdoor-weather-container {
    height: 75px;
    padding: 12px 8px;
    border-radius: 4px;
    background: #fef9e6;
    display: flex;
    align-items: center;
    img {
        display: block;
        width: 51px;
        height: 51px;
    }
    .weather-item {
        width: 84px;
        &-name {
            color: var(--gray-600);
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            margin-bottom: 4px;
        }
        &-time {
            color: var(--gray-900);
            font-family: Persagy2;
            font-size: 18px;
            font-weight: 500;
            line-height: 22px;
        }
    }
    .line {
        width: 1px;
        height: 40px;
        border-right: 1px solid var(--alpha-30, rgba(196, 201, 207, 0.3));
    }
}
</style>
