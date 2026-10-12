<template>
    <div class="operation-monitoring-running-params">
        <template v-for="item in infoCodes" :key="item.infoCode">
            <div v-if="item.isTitle" class="infoCode-group">{{ item.infoCodeName }}</div>
            <DataValueName
                v-else
                :name="item.infoCodeName"
                :value="value(item.infoCode, item.infoCodeType).text"
                :unit="item.unit"
                :is-link="item.infoCodeType === IOT_RUNNING && !value(item.infoCode).isEmpty"
                :time="value(item.infoCode, item.infoCodeType).time"
                style="padding-left: 12px"
                @click="itemInfo(item)"
            />
        </template>
    </div>
</template>

<script setup>
import DataValueName from '../data-value-name/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { getValueStr, isEmptyNoReturn } from '@/utils/tools';
import { jumpToAnalysis } from '@/utils/envUtils';
import { IOT_RUNNING } from '@/utils/globalVariables';
import { isEmpty } from 'lodash';

const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {};
        }
    },
    selectObj: {
        type: Object,
        default: () => {
            return {};
        }
    }
});
const { getIotData, getCustomInfo } = DockSingleton.getInstance();
const infoCodes = computed(() => {
    const arr = [...(props.data.relInfoCodeConfigs || [])];
    if (props.data.groupChildren?.length) {
        props.data.groupChildren?.forEach(item => {
            arr.push({
                infoCodeName: item.groupName,
                infoCode: item.groupCode,
                isTitle: true
            });
            arr.push(...(item.relInfoCodeConfigs || []));
        });
    }
    return arr;
});
const value = (infoCode, infoCodeType) => {
    if (!props.selectObj?.id) {
        return { text: '', isEmpty: false, time: '' };
    }
    let data = getIotData(props.selectObj.id, infoCode);
    if (isEmpty(data)) {
        data = getCustomInfo(props.selectObj.id, infoCodeType, infoCode);
    }

    return { text: getValueStr(data).text, isEmpty: isEmptyNoReturn(data.dataValue), time: data.dataTime };
};

const itemInfo = item => {
    const jumpParams = {
        infoCode: item.infoCode,
        id: props.selectObj.id
    };
    jumpToAnalysis(jumpParams);
};
</script>
<style lang="less" scoped>
.operation-monitoring-running-params {
    display: grid;
    gap: 12px 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    .infoCode-group {
        grid-column-start: span 2;
        border-radius: 4px;
        padding: 5px 0;
        padding-left: 12px;
        background: linear-gradient(to right, #f1f4f6, rgba(241, 244, 246, 0));
    }
}
</style>
