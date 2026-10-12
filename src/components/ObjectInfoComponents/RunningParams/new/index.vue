<template>
    <div
        v-for="val in groupChildren"
        :key="val.groupCode"
        class="group-zxccz group"
    >
        <div class="group-name">
            {{ val.groupName }}
        </div>
        <div class="operation-monitoring-running-params">
            <template
                v-for="item in val.relInfoCodeConfigs"
                :key="item.infoCode"
            >
                <DataValueName
                    v-if="showValueAndNameFn(value(item.infoCode, item.infoCodeType))"
                    :key="item.infoCode"
                    :name="item.infoCodeName"
                    :value="value(item.infoCode, item.infoCodeType).text"
                    :unit="item.unit"
                    :is-link="item.infoCodeType === IOT_RUNNING && !value(item.infoCode, item.infoCodeType).isEmpty"
                    :time="value(item.infoCode, item.infoCodeType).time"
                    :show-filter="true"
                    @click="itemInfo(item)"
                />
            </template>
        </div>
    </div>
</template>

<script setup>
import DataValueName from '../DataValueName.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { getValueStr, isEmptyNoReturn } from '@/utils/tools';
import { IOT_RUNNING } from '@/utils/globalVariables';
import { isEmpty } from 'lodash';
import { jumpToAnalysis } from '@/utils/envUtils';
import { isIotInfoType } from '@/utils/infoTemplate';

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
const showValueAndNameFn = value => {
    const { data } = value;
    if (data) {
        if (data.infoCodeType === IOT_RUNNING) {
            return data.existsIotRule;
        }

        return value.isEmpty === false;
    } else {
        return false;
    }
};
const groupChildren = computed(() => {
    return props.data?.groupChildren || [];
});
const value = (infoCode, infoCodeType) => {
    let data = {};
    if (isIotInfoType(infoCodeType)) {
        data = getIotData(props.selectObj.id, infoCode);
    } else {
        data = getCustomInfo(props.selectObj.id, infoCodeType, infoCode);
    }

    return { text: getValueStr(data).text, isEmpty: isEmptyNoReturn(data.dataValue), time: data.dataTime, data };
};

const itemInfo = item => {
    const jumpParams = {
        infoCode: item.infoCode,
        id: props.selectObj.id
    };
    jumpToAnalysis(jumpParams);
};
</script>
<style lang="less">
.group-zxccz {
    display: none;
    &:has(.data-value) {
        display: block;
    }
}
</style>
<style lang="less" scoped>
.operation-monitoring-running-params {
    display: grid;
    gap: 12px 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-left: 12px;
}
.group {
    margin-bottom: 12px;
}
.group-name {
    border-radius: 4px;
    padding: 5px 0;
    padding-left: 12px;
    background: linear-gradient(to right, #f1f4f6, rgba(241, 244, 246, 0));
    margin-bottom: 12px;
}
</style>
