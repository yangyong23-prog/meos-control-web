<template>
    <div v-if="hasDataValue" class="tab-item" :style="{ ...getItmeStyle(data.infoObject), fontSize: `${data.fontSize || 24}px` }">
        <component
            :is="infoCodeIconMap[infoObject?.infoCode]"
            v-if="infoObject && infoCodeIconMap[infoObject?.infoCode]"
            :width="data.fontSize ?? 16"
            :height="data.fontSize ?? 16"
        ></component>

        <span v-if="LABEL_NAME_MAP[infoObject?.infoCode]" class="group-tab-label" :style="getLabelStyle()">{{ LABEL_NAME_MAP[infoObject?.infoCode] }}</span>
        <span v-if="multValueObj">
            <span class="group-tab-val" :style="getMultValueStyle(infoObject?.infoCode)">
                {{ multValueObj?.firstText }}
            </span>
            <span class="group-tab-total">/{{ multValueObj.secondText }} </span>
        </span>
        <template v-else-if="infoObject?.infoCode === 'equipGroupAbnormalEventNum'">
            {{ abnormalInGroupEquipCount }}
        </template>
        <template v-else>
            {{ getItemValText(data, data.infoObject) }}
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { LABEL_NAME_MAP, INFO_CODE_VAL_DEFINE, INFO_CODE_COLORMAP } from '../constants/common';
import DockSingleton from '@/hooks/responsiveDock';
import { getEquipsByInGroupKey, getEquipCountInGroupKey } from '../constants/injectKey';
import abnormalSvg from '@/assets/svg/ACAC/abnormal.svg';
import runningSvg from '@/assets/svg/ACAC/running.svg';
const { getIotData, getObjectAbnormalStatus } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
// src/views/ACAC/components/RelationChart/hooks/useInfoCard.js
const getItemValText = inject('getItemValText');
// src/views/ACAC/components/RelationChart/index.vue
const getEquipsByInGroup = inject(getEquipsByInGroupKey);
const getEquipCountInGroup = inject(getEquipCountInGroupKey);

const infoCodeIconMap = {
    equipGroupRunNum: runningSvg, // 组内运行数量
    equipGroupAbnormalEventNum: abnormalSvg // 组内异常数量
};
const valColorMap = {
    equipGroupAbnormalEventNum: '#E63C35',
    equipGroupRunNum: '#09B3B5'
};

// 是复合值展示
const multValueObj = computed(() => {
    const d = props.data;
    const code = d?.infoObject?.infoCode;
    if (code === 'equipGroupRunNum') {
        const localRemoteStatusValObj = getIotData(d?.key, 'groupEquipRuningNum');
        const equipCounts = getEquipCountInGroup(d?.key);
        // console.log('code: ', d.key, code, localRemoteStatusValObj, equips);
        return { firstText: localRemoteStatusValObj.dataValue || '--', secondText: equipCounts ?? 0 };
    }
    return null;
});
// 设备组下异常设备数量
const abnormalInGroupEquipCount = computed(() => {
    const d = props.data;
    const equips = getEquipsByInGroup(d?.key);
    const abnormalEquipCount = equips?.filter(obj => getObjectAbnormalStatus(obj.id))?.length ?? 0;
    return abnormalEquipCount;
});

const infoObject = computed(() => {
    return props.data?.infoObject;
});

const hasDataValue = computed(() => {
    const d = props.data;
    const code = d?.infoObject?.infoCode;
    if (code === 'passByName' || code === 'equipGroupRunNum') {
        return true;
    }
    if (code === 'equipGroupAbnormalEventNum') {
        // console.log('equipGroupAbnormalEventNum: ', code);

        return abnormalInGroupEquipCount.value > 0;
    }
    if (code === 'localAndManualStatus') {
        const localRemoteStatusValObj = getIotData(d?.key, 'localRemoteStatus');
        const manualAutoStatusValObj = getIotData(d?.key, 'manualAutoStatus');

        // 本地或者手动的时候才显示
        return localRemoteStatusValObj?.dataValue === '0' || manualAutoStatusValObj?.dataValue === '0';
    } else if (code === 'controlFailureAlarm') {
        const iotInfo = getIotData(d?.key, code);
        return iotInfo?.dataValue === '2' || iotInfo?.dataValue === '3';
    }
    const valObj = getIotData(d?.key, code);
    if (!valObj) {
        return;
    }

    if (code === 'highLevAlarm' || code === 'lowLevAlarm' || code === 'faultStatus') {
        if (valObj?.dataValue !== '1') {
            return false;
        }
    }
    return !!valObj?.dataValue;
});

const getLabelStyle = () => {
    return {
        color: '#626C78',
        margin: '0 4px'
    };
};

const getItmeStyle = iot => {
    const d = props.data;

    //特殊标签编码处理 本地手动
    if (iot.infoCode === 'localAndManualStatus') {
        const localRemoteStatusValObj = getIotData(d?.key, 'localRemoteStatus');
        const manualAutoStatusValObj = getIotData(d?.key, 'manualAutoStatus');
        if (localRemoteStatusValObj?.dataValue === '0')
            return {
                color: '#fff',
                background: '#246FE5'
            };
        if (manualAutoStatusValObj?.dataValue === '0')
            return {
                color: '#fff',
                background: '#ffb800'
            };

        return {};
    }

    // 部分根据code映射颜色的
    if (INFO_CODE_COLORMAP[iot.infoCode]) {
        return INFO_CODE_COLORMAP[iot.infoCode];
    } else {
        // 根据信息点code，值
        const valObj = getIotData(d?.key, iot.infoCode);
        if (!valObj) {
            return {};
        }
        const colorInfo = INFO_CODE_VAL_DEFINE[iot.infoCode];
        if (colorInfo) {
            return colorInfo[valObj.dataValue] || {};
        }
    }

    return {};
};
const getMultValueStyle = infoCode => {
    return {
        color: multValueObj.value?.firstText > 0 ? valColorMap[infoCode] : '#8B949E'
    };
};
</script>

<style lang="scss" scoped>
.tab-item {
    display: flex;
    text-align: center;
    align-items: center;
    border-radius: 2px;
    color: #ffffff;
    font-size: 20px;
    padding: 0 4px;
    white-space: nowrap;
    .group-tab-val {
        color: #09b3b5;
        font-style: normal;
        font-weight: 700;
    }
    .group-tab-total {
        color: #1b2129;
        font-style: normal;
        font-weight: 400;
    }
}
</style>
