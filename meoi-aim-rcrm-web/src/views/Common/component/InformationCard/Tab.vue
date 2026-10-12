<template>
    <div
        :id="infoPointData?.id"
        :class="[isChart ? 'group-tab-chart' : 'group-tab']"
        :style="getItmeStyle(infoPointData.infoObject)"
    >
        <VueSvg
            v-if="infoCodeIconMap[infoPointData.infoObject.infoCode]"
            :key="infoPointData.infoObject.infoCode"
            :width="infoPointData.fontSize"
            :height="infoPointData.fontSize"
            :path="infoCodeIconMap[infoPointData.infoObject.infoCode]"
        ></VueSvg>

        <span
            v-if="labelNameMap[infoPointData.infoObject.infoCode]"
            class="group-tab-label"
            :style="getLabelStyle(infoPointData.infoCode)"
            >{{ labelNameMap[infoPointData.infoObject.infoCode] }}</span
        >
        <span v-else>
            {{ getPrefix(infoPointData)
            }}{{
                specialNameInfoCodeMap[infoPointData.infoObject.infoCode] ||
                getName(infoPointData.infoObject?.name) ||
                infoPointData.infoObject?.aliasName
            }}
        </span>
        <span style="display: flex">
            <span
                v-if="valColorMap[infoPointData.infoObject.infoCode]"
                class="group-tab-val"
                :style="getValStyle(infoPointData.infoObject)"
            >
                {{ infoPointData.infoObject.val }}
            </span>
            <span
                v-if="totalStypeMap[infoPointData.infoObject.infoCode]"
                class="group-tab-total"
                :style="getTotalStyle(infoPointData.infoObject)"
            >
                /{{ getTotalValue(infoPointData.infoObject) }}
            </span>
        </span>
    </div>
</template>

<script setup>
import VueSvg from '@/components/VueSvg.vue';
import abnormalSvg from '@/assets/svg/abnormal.svg';
import runningSvg from '@/assets/svg/running.svg';
import {
    bgColorMap,
    colorMap,
    specialNameInfoCodeMap,
    labelNameMap,
    valColorMap,
    infoCodePrefix,
    totalStypeMap
} from '@/views/Common/constant/index';
const props = defineProps({
    isChart: {
        type: Boolean,
        default: true
    },
    infoPointData: {
        type: Object,
        default: () => ({})
    }
});
const getName = name => {
    if (name) {
        return name.split('/')[name.split('/').length - 1];
    }
    return null;
};
const infoCodeIconMap = {
    equipGroupRunNum: runningSvg, // 组内运行数量
    equipGroupAbnormalEventNum: abnormalSvg // 组内异常数量
};

const getItmeStyle = iot => {
    const { fontSize } = props.infoPointData;
    return {
        background: bgColorMap[iot.infoCode] || '#246FE5',
        color: colorMap[iot.infoCode] || '#fff',
        fontSize: props.isChart ? `${fontSize}px` : '12px'
    };
};

const getPrefix = item => {
    return infoCodePrefix[item.infoObject.infoCode] || '';
};
const getLabelStyle = () => {
    const { fontSize } = props.infoPointData;
    return {
        color: '#626C78',
        margin: '0 4px',
        fontSize: props.isChart ? `${fontSize}px` : '12px'
    };
};
const getValStyle = iot => {
    const { fontSize } = props.infoPointData;

    return {
        color: iot.val > 0 ? valColorMap[iot.infoCode] : '#8B949E',
        fontSize: props.isChart ? `${fontSize}px` : '12px'
    };
};

const getTotalStyle = () => {
    const { fontSize } = props.infoPointData;
    return {
        display: 'flex',
        color: '#1B2129',
        fontSize: props.isChart ? `${fontSize}px` : '12px'
    };
};

const getTotalValue = iot => {
    const { linkCodes } = iot;
    if (linkCodes && linkCodes.length) {
        const totalCode = linkCodes.find(linkCode => linkCode.infoCode === 'equipGroupTotalEquipNum');
        if (totalCode) {
            return totalCode.dataValue;
        }
        return '0';
    }
    return '0';
};
</script>

<style lang="scss" scoped>
.group-tab {
    text-align: center;
    border-radius: 2px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding: 0 4px;
    white-space: nowrap;
    flex-wrap: nowrap;
}
.group-tab-label {
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0;
    vertical-align: middle;
    color: #626c78;
}
.group-tab-val {
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
}
.group-tab-total {
    color: #1b2129;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
}
.group-tab-chart {
    text-align: center;
    border-radius: 2px;
    color: #ffffff;
    padding: 0 4px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
}
</style>
