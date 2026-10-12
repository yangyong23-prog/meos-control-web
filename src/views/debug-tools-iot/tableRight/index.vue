<template>
    <div class="tableRight">
        <div class="table-loading">
            <header v-if="tableData.length" class="fcb">
                <div class="f18 fb7">{{ currentInstance?.name }}</div>
                <div class="fc">
                    <m-search
                        v-model="params.searchKeyword"
                        class="search-input mr8"
                        type="enter"
                        width="200"
                        :placeholder="i18n.global.t('meos_control_web.press_enter_search_point_name_code')"
                    >
                    </m-search>
                    <m-select
                        v-model="params.bindingRule"
                        clearable
                        class="mr8"
                        :options="BindingRuleList"
                        :prefix="i18n.global.t('meos_control_web.binding_rule_colon')"
                        :size="200"
                    >
                        <m-option v-for="item in BindingRuleList" :key="item.id" :value="item.id" :label="item.name">
                            <m-tag :color="item.color" :bg-color="item.bgcolor">{{ item.name }}</m-tag>
                        </m-option>
                    </m-select>
                    <m-select
                        v-model="params.instantiation"
                        clearable
                        class="mr8"
                        :options="BindingRuleList"
                        :prefix="i18n.global.t('meos_control_web.instantiation_rule_colon')"
                        :size="200"
                    >
                        <m-option v-for="item in BindingRuleList" :key="item.id" :value="item.id" :label="item.name">
                            <m-tag :color="item.color" :bg-color="item.bgcolor">{{ item.name }}</m-tag>
                        </m-option>
                    </m-select>
                    <m-select
                        v-model="params.isKeyInfoCode"
                        clearable
                        :options="booleanOptions"
                        :prefix="i18n.global.t('meos_control_web.is_key_information_point_colon')"
                        :size="200"
                    >
                    </m-select>
                </div>
            </header>
            <div class="mt12 table-data" style="position: relative">
                <div v-if="tableData.length" style="height: 100%; width: 100%">
                    <m-table :columns="tableList" :data-source="filteredTableData" :even-color="true" :empty-text="'--'">
                        <template #bindingPointStatus="{ bindingPointStatus }">
                            <m-tag v-if="bindingPointStatus === 'YES'" color="#1B2129" bg-color="#E8ECF0"> {{ i18n.global.t('meos_control_web.has_rule') }} </m-tag>
                            <m-tag v-if="bindingPointStatus === 'NO'" color="#D72824" bg-color="#FFE6E5">{{ i18n.global.t('meos_control_web.no_rule') }}</m-tag>
                        </template>
                        <template #instantiationRuleStatus="{ instantiationRuleStatus }">
                            <m-tag v-if="instantiationRuleStatus === 'YES'" color="#1B2129" bg-color="#E8ECF0"> {{ i18n.global.t('meos_control_web.has_rule') }} </m-tag>
                            <m-tag v-if="instantiationRuleStatus === 'NO'" color="#D72824" bg-color="#FFE6E5">{{ i18n.global.t('meos_control_web.no_rule') }}</m-tag>
                        </template>
                        <template #isKeyInfoCode="{ showStyle }">
                            <span>
                                {{
                                    safeJsonParse(showStyle)?.important === true
                                        ? i18n.global.t('common.yes')
                                        : safeJsonParse(showStyle)?.important === false
                                        ? i18n.global.t('common.no')
                                        : '--'
                                }}
                            </span>
                        </template>
                        <template #dataValue="data">
                            {{ getValueStr(data) }}
                        </template>
                    </m-table>
                </div>
                <div v-else class="noData">
                    <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { MLoading } from 'meri-plus';
import { currentInstanceInjectKey, currentTemplateIdsInjectKey } from '../hooks/useDebugToolsGlobal';
import { isEdge } from '@/utils/envUtils';
import i18n from '@/localization';
import { queryObjectInfoCodes } from '@/apis/debugToolIot';
import { toNumber } from 'lodash';
const props = defineProps({
    isMountedLoading: {
        type: Boolean,
        default: false
    }
});
const params = ref({
    bindingRule: '',
    instantiation: '',
    searchKeyword: '',
    isKeyInfoCode: ''
});

const currentInstance = inject(currentInstanceInjectKey);
const currentTemplateIds = inject(currentTemplateIdsInjectKey);
const loadingGlobal = ref();
const booleanOptions = ref([
    { name: i18n.global.t('common.yes'), id: 'YES' },
    { name: i18n.global.t('common.no'), id: 'NO' }
]);
const BindingRuleList = ref([
    { name: i18n.global.t('meos_control_web.has_rule'), id: 'YES', color: '#1B2129', bgcolor: '#E8ECF0' },
    { name: i18n.global.t('meos_control_web.no_rule'), id: 'NO', color: '#D72824', bgcolor: '#FFE6E5' }
]);
const tableColumnConfig = computed(() => {
    return {
        dataIndex: isEdge() ? 'dataIndicateTime' : 'minuteDisplay',
        title: isEdge() ? i18n.global.t('meos_control_web.data_expiry_time_constant') : i18n.global.t('meos_control_web.sub_accuracy_rule')
    };
});
const tableList = ref([
    { dataIndex: 'infoCodeName', title: i18n.global.t('meos_control_web.data_point_name'), resizable: true },
    { dataIndex: 'infoCode', title: i18n.global.t('meos_control_web.data_point_code'), resizable: true },
    { dataIndex: 'bindingPointStatus', title: i18n.global.t('meos_control_web.binding_rule'), resizable: true, width: 120 },
    { dataIndex: 'instantiationRuleStatus', title: i18n.global.t('meos_control_web.instantiation_rule'), resizable: true, width: 120 },
    { dataIndex: 'dataValue', title: i18n.global.t('meos_control_web.latest_value'), resizable: true, width: 120 },
    { dataIndex: 'unit', title: i18n.global.t('meos_control_web.unit'), resizable: true, width: 120 },
    { dataIndex: 'updateTime', title: i18n.global.t('meos_control_web.latest_value_data_time'), resizable: true },
    {
        dataIndex: tableColumnConfig.value.dataIndex,
        title: tableColumnConfig.value.title,
        resizable: true
    },
    {
        dataIndex: 'isKeyInfoCode',
        title: i18n.global.t('meos_control_web.is_key_information_point'),
        resizable: true
    }
]);
const tableData = ref([]);
// 安全解析 JSON
const safeJsonParse = (str, defaultValue = null) => {
    if (!str) return defaultValue;
    try {
        const newStr = str.replace(/\n/g, '');
        return JSON.parse(newStr);
    } catch (error) {
        return defaultValue;
    }
};
const filteredTableData = computed(() => {
    let result = tableData.value;
    if (params.value.bindingRule) {
        result = result.filter(item => item.bindingPointStatus === params.value.bindingRule);
    }
    if (params.value.instantiation) {
        result = result.filter(item => item.instantiationRuleStatus === params.value.instantiation);
    }
    if (params.value.searchKeyword) {
        result = result.filter(item => item.infoCodeName.includes(params.value.searchKeyword) || item.infoCode.includes(params.value.searchKeyword));
    }
    if (params.value.isKeyInfoCode) {
        // "showStyle": "{\n  \"important\": true\n}",
        const isImportantCode = params.value.isKeyInfoCode === 'YES' ? true : false;
        result = result.filter(item => {
            const { important } = safeJsonParse(item?.showStyle) || {};
            return important === isImportantCode;
        });
    }
    return result;
});
const getValueStr = data => {
    if (!data) return '--';

    let str = '';
    if (data?.dataSources?.length && data.dataValue) {
        data.dataSources.forEach(item => {
            if (item?.code && item?.name) {
                try {
                    // eslint-disable-next-line no-restricted-syntax
                    if (toNumber(item.code) === toNumber(data.dataValue)) {
                        str = item.name;
                    }
                } catch (error) {
                    console.error('Error comparing data values:', error);
                }
            }
        });
    }

    if (!str) {
        str = data.dataValue || '--';
    }
    return str;
};
watch(
    () => props.isMountedLoading,
    () => {
        if (props.isMountedLoading) {
            nextTick(() => {
                loadingGlobal.value = MLoading.service({
                    target: `.table-loading`,
                    fullscreen: false,
                    duration: 100,
                    lottieName: 'ball',
                    loadIconStyle: {
                        width: '100px',
                        height: '100px'
                    }
                });
            });
        } else {
            loadingGlobal.value?.destroy();
        }
    }
);
watch(
    () => currentInstance.value,
    () => {
        if (currentInstance.value) {
            initData(true);
        } else {
            tableData.value = [];
        }
    }
);
const initData = loading => {
    let Mloading = null;
    if (loading) {
        Mloading = MLoading.service({
            target: '.table-loading',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
        queryObjectInfoCodes({
            objectId: currentInstance.value.id,
            templateTypeIds: currentTemplateIds.value
        })
            .then(res => {
                tableData.value = res.data;
            })
            .finally(() => {
                Mloading?.destroy();
            });
    }
};
</script>
<style lang="less" scoped>
.tableRight {
    padding: 16px;
    width: 100%;
    height: 100%;
    .table-loading {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .table-data {
        height: calc(100% - 32px);
    }
    .noData {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.search-input {
    :deep(input) {
        padding-left: 10px !important;
    }
}
</style>
