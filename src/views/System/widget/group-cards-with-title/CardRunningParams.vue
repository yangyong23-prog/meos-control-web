<template>
    <div class="card-running-params-container">
        <template v-for="item in infoCodes" :key="item.infoCode">
            <template v-if="withoutInfoCode">
                <DataValueName
                    :name="item.title"
                    :value="item?.dataValue !== '--' ? `${item.dataValue} ${item.unit}` : '--'"
                    :unit="item.unit"
                    :is-link="false"
                    :without-info-code="true"
                />
            </template>
            <DataValueName
                v-else
                :name="item.infoCodeName"
                :value="value(item.infoCode, item.infoCodeType).text"
                :unit="item.unit"
                :is-link="item.infoCodeType === IOT_RUNNING && !value(item.infoCode).isEmpty"
                :time="value(item.infoCode, item.infoCodeType).time"
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
    relInfoCodeConfigs: {
        type: Array,
        default: () => []
    },
    selectObjId: {
        type: String,
        default: ''
    },
    withoutInfoCode: {
        type: Boolean,
        default: false
    }
});

const { getIotData, getCustomInfo } = DockSingleton.getInstance();
const infoCodes = computed(() => {
    const arr = [...(props?.relInfoCodeConfigs || [])];
    return arr;
});
const value = (infoCode, infoCodeType) => {
    if (!props.selectObjId) {
        return { text: '', isEmpty: false, time: '' };
    }
    let data = getIotData(props.selectObjId, infoCode);
    if (isEmpty(data)) {
        data = getCustomInfo(props.selectObjId, infoCodeType, infoCode);
    }

    return { text: getValueStr(data).text, isEmpty: isEmptyNoReturn(data.dataValue), time: data.dataTime };
};

const itemInfo = item => {
    const jumpParams = {
        infoCode: item.infoCode,
        id: props.selectObjId
    };
    jumpToAnalysis(jumpParams);
};
</script>
<style lang="less" scoped>
.card-running-params-container {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
