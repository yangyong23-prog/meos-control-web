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
                :show-filter="true"
                style="padding-left: 12px"
                @click="itemInfo(item)"
            />
            <template v-if="item.isTitle && !isEdge()">
                <div v-if="checkAllEmpty(item.relInfoCodeConfigs)" class="empty-wrap">
                    <span>{{ i18n.global.t('meos_control_web.no_valid_data') }}</span>
                </div>
            </template>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DataValueName from './DataValueName.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { getValueStr, isEmptyNoReturn } from '@/utils/tools';
import { IOT_RUNNING, EMPTY_VALUE } from '@/utils/globalVariables';
import { isIotInfoType } from '@/utils/infoTemplate';
import { isEmpty } from 'lodash';
import { isEdge, jumpToAnalysis } from '@/utils/envUtils';

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
const enableShow = valText => {
    if (isEdge()) {
        return true;
    } else {
        const isEmptyVal = typeof valText === 'string' && valText.startsWith('--');
        return !isEmptyVal;
    }
};

const infoCodes = computed(() => {
    const arr = [...(props.data.relInfoCodeConfigs || [])];
    if (props.data.groupChildren?.length) {
        props.data.groupChildren?.forEach(item => {
            arr.push({
                infoCodeName: item.groupName,
                infoCode: item.groupCode,
                isTitle: true,
                relInfoCodeConfigs: item?.relInfoCodeConfigs || []
            });
            arr.push(...(item.relInfoCodeConfigs || []));
        });
    }
    return arr;
});
const value = (infoCode, infoCodeType) => {
    let data = getIotData(props.selectObj.id, infoCode);
    if (isEmpty(data)) {
        data = getCustomInfo(props.selectObj.id, infoCodeType, infoCode);
    }

    return { text: getValueStr(data).text, isEmpty: isEmptyNoReturn(data.dataValue), time: data.dataTime };
};

const checkAllEmpty = arr => {
    if (Array.isArray(arr) && arr.length) {
        const allEmpty = arr.every(item => {
            const valText = value(item.infoCode, item.infoCodeType).text;
            return !enableShow(valText);
        });
        return allEmpty;
    } else {
        return true;
    }
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

.empty-wrap {
    width: calc(200%);
    padding: 12px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: #f7f9fa;
    border-radius: 4px;

    color: #626c78;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
</style>
