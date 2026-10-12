<template>
    <div class="equip-running-icon-info-container">
        <div v-if="iotItems.length" class="iot-rows-card" :style="{ transform: `translateY(calc(-50% - 20px ))` }">
            <div v-for="(item, index) in iotItems" :key="index" class="iot-info-row">
                <div class="iot-info-row-name">{{ item.name }}</div>
                <div :class="['iot-info-row-value']">
                    <span>{{ item.valText }}</span>
                </div>
            </div>
            <div class="card-before" />
        </div>
    </div>
</template>
<script setup>
import DockSingleton from '@/hooks/responsiveDock';

const { getIotData, getAbnormalEventsList } = DockSingleton.getInstance();
const props = defineProps({
    model: {
        type: Object,
        default: () => ({})
    },
    currentStyle: {
        type: Object,
        default: () => ({})
    },
    infoCodes: {
        type: Array,
        default: () => []
    },
    rootMedia: {
        type: Object,
        default: () => ({})
    }
});

const iotItems = computed(() => {
    const computedRes = props.infoCodes?.map(obj => {
        const infoObj = getIotData(props.model?.data.id, obj.infoCode) || {};

        const finalVal = (infoObj?.dataSource || [])?.length ? infoObj?.dataSource?.find(v => v?.code === infoObj.dataValue)?.name : infoObj?.dataValue;
        return {
            ...obj,
            name: `${obj.infoCodeName || ''}：`,
            valText: `${finalVal || '--'}${infoObj.unit || ''}`
        };
    });
    return computedRes?.slice(0, 4);
});
</script>
<style lang="less" scoped>
.equip-running-icon-info-container {
    display: flex;
    flex-direction: column;
    position: relative;
    pointer-events: none;

    .iot-rows-card {
        display: flex;
        flex-direction: column;
        padding: 6px 8px;
        background-color: rgba(46, 55, 66, 0.64);

        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }

    .iot-info-row {
        display: flex;
        align-items: center;

        font-size: 12px;
        font-weight: var(--platform-font-weight);
        line-height: 20px;
    }

    .iot-info-row-name {
        color: @grey-400;
    }

    .iot-info-row-value {
        color: #fff;
        // max-width: 60px;
        // text-overflow: ellipsis;
        // overflow: hidden;
    }

    .card-before {
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        height: 6px;
        width: 12px;
        clip-path: polygon(0 0, 50% 100%, 100% 0%);
        opacity: 0.64;
        background-color: rgba(46, 55, 66, 0.64);
    }
}
</style>
