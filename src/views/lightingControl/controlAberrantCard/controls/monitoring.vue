<!--
 * @Author: guoxiaohuan
 * @Date: 2024-04-26 17:34:37
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-16 14:58:00
 * @Description: 
-->
<template>
    <div class="monitoring-container">
        <div class="monitoring-container-default">
            <div class="monitoring-container-default-left">
                <img src="@/assets/imgs/sun.png" alt="" />
                {{ i18n.global.t('meos_control_web.current_illuminance_colon')
                }}<span class="values">{{ monitoringData.outdoorIlluminance ? Number(monitoringData.outdoorIlluminance).toFixed(0) : '--' }}</span
                >lx
            </div>
            <m-button v-if="monitoringData.lightingSidebarSensorInfoVO && monitoringData.lightingSidebarSensorInfoVO.length" type="link" size="medium" @click="isShow = !isShow">{{
                isShow ? i18n.global.t('meos_control_web.collapse_sensors') : i18n.global.t('meos_control_web.view_sensor')
            }}</m-button>
        </div>
        <div v-if="isShow" class="monitoring-container-block">
            <div v-for="(item, index) in monitoringData.lightingSidebarSensorInfoVO" :key="index + 'm'" v-ellipsis class="monitoring-container-block-item">
                <span class="name">{{ item.instanceName }}</span
                >：{{ item.illum ? Number(item.illum).toFixed(0) : '--' }}lx
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const monitoringData = inject('monitoringData');

const isShow = ref(false);
watch(
    () => monitoringData?.value,
    val => {
        monitoringData.value = val;
    },
    {
        deep: true
    }
);
</script>

<style scoped lang="less">
.monitoring-container {
    border-radius: 4px;
    background: #ebf6ff;
    padding: 8px;
    margin-bottom: 28px;
    &-default {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 32px;
        &-left {
            display: flex;
            color: #626c78;
            font-size: 14px;
            img {
                display: block;
                width: 20px;
                height: 20px;
                margin-right: 4px;
            }
            .values {
                color: #2e3742;
                font-weight: 700;
            }
        }
    }
    &-block {
        margin-top: 8px;
        border-top: 1px solid #e8ecf0;
        padding: 10px 0 0 24px;
        display: grid;
        gap: 10px;
        &-item {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .name {
            color: #626c78;
        }
    }
}
</style>
