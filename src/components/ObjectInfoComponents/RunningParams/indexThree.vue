<template>
    <div class="operation-monitoring-running-params">
        <template v-for="(item, index) in infoCodesShow" :key="item.infoCode">
            <DataValueNameRow
                :name="item.infoCodeName"
                :value="value(item.infoCode, item.infoCodeType).text"
                :unit="item.unit"
                :is-link="item.infoCodeType === IOT_RUNNING && !value(item.infoCode, item.infoCodeType).isEmpty"
                :time="value(item.infoCode, item.infoCodeType).time"
                :index="index"
                @click="itemInfo(item)"
            />
        </template>
        <div v-if="needMore" class="view-more">
            <m-button v-if="curExpanded" type="link" size="medium" icon="IconMeriComponentChevronUp" icon-position="right" @click.stop="collapse">{{
                i18n.global.t('meos_control_web.collapse')
            }}</m-button>
            <m-button v-else type="link" size="medium" icon="IconMeriComponentChevronDown" icon-position="right" @click.stop="showAll">{{
                i18n.global.t('meos_control_web.view_more')
            }}</m-button>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DataValueNameRow from './DataValueNameRow.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { getValueStr } from '@/utils/viewUtils';
import { IOT_RUNNING } from '@/utils/globalVariables';
import { isEmptyNoReturn } from '@/utils/tools';
import { jumpToAnalysis } from '@/utils/envUtils';
import { isEmpty } from 'lodash';
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
    },
    stratification: {
        type: Boolean,
        default: true
    }
});
const curExpandObjId = ref('');
const { getIotData, getCustomInfo } = DockSingleton.getInstance();
const infoCodes = computed(() => {
    const arr = [...(props.data.relInfoCodeConfigs || [])];
    if (props.data.groupChildren?.length) {
        props.data.groupChildren?.forEach(item => {
            arr.push(...(item.relInfoCodeConfigs || []));
        });
    }
    return arr;
});
const value = (infoCode, infoCodeType) => {
    let data = {};
    if (isIotInfoType(infoCodeType)) {
        data = getIotData(props.selectObj.id, infoCode);
    } else {
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

const LIMIT_SHOW_COUNT = 6;

const needMore = computed(() => {
    return infoCodes.value?.length > LIMIT_SHOW_COUNT;
});

const curExpanded = computed(() => {
    return curExpandObjId?.value === props.selectObj.id;
});

const infoCodesShow = computed(() => {
    return needMore.value && !curExpanded.value ? infoCodes.value?.slice(0, LIMIT_SHOW_COUNT) : infoCodes.value;
});

const showAll = () => {
    if (curExpandObjId.value) {
        curExpandObjId.value = props.selectObj.id;
    }
};
const collapse = () => {
    if (curExpandObjId.value) {
        curExpandObjId.value = '';
    }
};
</script>
<style lang="less" scoped>
.operation-monitoring-running-params {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
    margin-top: 8px;
    :deep(.value-name) {
        color: var(--gray-600);
        .value-name-title {
            overflow: inherit !important;
        }
    }
}
.view-more {
    width: 100%;
    :deep(.m-button.medium.link.padding) {
        padding: 0 2px;
    }
    :deep(.m-button.medium) {
        line-height: 22px;
        height: 22px;
    }
}
</style>
