<template>
    <div class="circuit-setting">
        <div class="table-warp fcc">
            <div class="filter-warp fc">
                <m-select v-model="curSelectMode" :size="168" :options="modeSelectList" :prefix="i18n.global.t('meos_control_web.loop_status_colon')" clearable></m-select>
                <m-select
                    v-model="curSelectLampType"
                    :size="168"
                    :options="lampTypeSelOptions"
                    :prefix="i18n.global.t('meos_control_web.luminaire_type_colon')"
                    clearable
                ></m-select>
                <m-search
                    :width="206"
                    immediate
                    type="enter"
                    :placeholder="i18n.global.t('meos_control_web.press_enter_search_loop_name_code')"
                    @change="searchInputChange"
                    @clear="curSearchInput = ''"
                >
                </m-search>
            </div>
            <m-table :columns="columnList" :data-source="tableData" :checkbox="true" class="circuit-table" :cell-class-name-fn="cellClassNameFn">
                <template #name="{ name, lampFuncType }">
                    <div class="row-name" :class="{ 'child-name': lampFuncType }" v-html="name"></div>
                </template>
                <template #code="{ codeText }">
                    <div class="row-name" v-html="codeText"></div>
                </template>
                <template #lampType="{ lampFuncType, lampFuncTypeName }">
                    <div class="row-name" :class="{ 'no-cfg-text': !lampFuncType }">{{ lampFuncTypeName || i18n.global.t('meos_control_web.unconfiged') }}</div>
                </template>
                <template #ops="row">
                    <div class="op-warp">
                        <div class="item" :class="{ act: row.settingMode === SMD_OPEN }" @click="switchMode(row, SMD_OPEN)">{{ i18n.global.t('common.status_open') }}</div>
                        <div class="item" :class="{ act: row.settingMode === SMD_CLOSE }" @click="switchMode(row, SMD_CLOSE)">{{ i18n.global.t('common.status_close') }}</div>
                    </div>
                </template>
                <template #tooltip="{ checkeds }">
                    <div class="table-check-tooltips fc">
                        <span>
                            {{ i18n.global.t('meos_control_web.already_selected') }}<span class="count-num"> {{ checkeds.length }}</span>
                            {{ i18n.global.t('meos_control_web.project') }}
                        </span>
                        <div class="btn-groups fc">
                            <m-button width="64" size="small" @click="batchChange(checkeds, SMD_OPEN)">{{ i18n.global.t('common.status_open') }}</m-button>
                            <m-button width="64" size="small" @click="batchChange(checkeds, SMD_CLOSE)">{{ i18n.global.t('common.status_close') }}</m-button>
                        </div>
                    </div>
                </template>
            </m-table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { nameMatch } from '@/utils/viewUtils';
import { SMD_OPEN, SMD_CLOSE, NOT_CONFIGURED } from '../constants';
import i18n from '@/localization';

const props = defineProps({
    funcTypeObj: {
        type: Object,
        default: null
    }
});

const curSelectMode = ref('');
const curSelectLampType = ref('');
const curSearchInput = ref('');

const modeSelectList = [
    // {
    //     id: 'all',
    //     name: '全部'
    // },
    {
        id: SMD_OPEN,
        name: i18n.global.t('meos_control_web.on')
    },
    {
        id: SMD_CLOSE,
        name: i18n.global.t('meos_control_web.off')
    },
    {
        id: NOT_CONFIGURED,
        name: i18n.global.t('meos_control_web.unconfiged')
    }
];

const lampTypeSelOptions = computed(() => {
    const arr = [];
    const rec = {};

    props.funcTypeObj?.circuitSettings.forEach(c => {
        const _id = c.lampFuncType;
        if (!rec[_id]) {
            if (_id) {
                arr.push({
                    id: _id,
                    name: c.lampFuncTypeName
                });
            } else {
                arr.push({
                    id: 'NONE',
                    name: i18n.global.t('meos_control_web.unconfiged')
                });
            }
            rec[_id] = true;
        }
    });
    return arr;
});

const tableData = computed(() => {
    return props.funcTypeObj?.circuitSettings.filter(obj => {
        const isIdInclude = obj.circuitLocalId?.toUpperCase().includes(curSearchInput.value?.toUpperCase());
        const isNameInclude = obj.circuitLocalName?.toUpperCase().includes(curSearchInput.value?.toUpperCase());
        const wardsInclude = curSearchInput.value === '' || isIdInclude || isNameInclude;
        if (curSearchInput.value && wardsInclude) {
            obj.codeText = isIdInclude ? nameMatch(obj.circuitLocalId, curSearchInput.value) : obj.circuitLocalId || '--';
            obj.name = isNameInclude ? nameMatch(obj.circuitLocalName, curSearchInput.value) : obj.circuitLocalName || '--';
        } else {
            obj.codeText = obj.circuitLocalId || '--';
            obj.name = obj.circuitLocalName;
        }
        const modeOk = curSelectMode.value === '' || obj.settingMode === curSelectMode.value;
        const lampOk = curSelectLampType.value === '' || (curSelectLampType.value === 'NONE' && !obj.lampFuncType) || obj.lampFuncType === curSelectLampType.value;
        return modeOk && lampOk && wardsInclude;
        // return (curSelectMode.value === 'all' || obj.settingMode === curSelectMode.value) && wardsInclude;
    });
});
const columnList = ref([
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.loop_name'),
        ellipsis: true,
        width: 252
    },
    {
        dataIndex: 'code',
        title: i18n.global.t('meos_control_web.loop_code'),
        width: 180
    },
    {
        dataIndex: 'lampType',
        title: i18n.global.t('meos_control_web.luminaire_type'),
        width: 180
    },
    {
        dataIndex: 'ops',
        title: `${i18n.global.t('meos_control_web.operation1')}`,
        width: 104
    }
]);

const batchChange = (checkeds, toMode) => {
    console.log('checkeds: ', checkeds);
    const _record = {};
    checkeds?.forEach(obj => {
        if (obj.checked === 'checked') {
            _record[obj.id] = true;
        }
        obj.checked = obj.checked === 'checked' ? 'uncheck' : 'checked';
    });
    props.funcTypeObj?.circuitSettings?.forEach(obj => {
        if (_record[obj.id]) {
            obj.settingMode = toMode;
        }
    });
};
const searchInputChange = val => {
    console.log('searchInputChange: ', val);
    curSearchInput.value = val;
};

const switchMode = (row, mode) => {
    const item = tableData.value[row.index];
    if (item) {
        item.settingMode = item.settingMode === mode ? NOT_CONFIGURED : mode;
    }
};
watch(curSelectLampType, n => {
    console.log('curSelectLampType: ', n, typeof n);
});
</script>
<style lang="less" scoped>
.circuit-setting {
    height: 100%;
    .table-warp {
        height: 100%;
        flex-direction: column;
        gap: 12px;
        .circuit-table {
            height: calc(100%);
        }
    }

    .filter-warp {
        width: fit-content;
        gap: 12px;
        position: absolute;
        top: 0px;
        right: 0px;
    }
    .row-name {
        color: var(--gray-900);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
    .no-cfg-text {
        color: var(--gray-400);
    }
    .row-summary {
        display: flex;
        align-items: center;

        color: var(--gray-600);
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 20px;
        .val {
            color: var(--gray-900);
        }
        .edit-icon {
            cursor: pointer;
            &:hover {
                background: var(--alpha-30);
                border-radius: 2px;
            }
        }
    }

    .op-warp {
        display: flex;
        align-items: center;
        gap: 8px;
        .item {
            padding: 3px 4px;
            color: var(--blue-500);
            text-align: center;
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
            border-radius: 4px;
            cursor: pointer;
            &.act {
                background: var(--blue-100);
            }
            &:hover {
                background: var(--alpha-30);
            }
        }
    }
    .table-check-tooltips {
        gap: 16px;
        .count-num {
            color: var(--gray-900);
            font-size: 14px;
            font-weight: 600;
            line-height: 22px;
        }
        .btn-groups {
            gap: 12px;
        }
    }
}
</style>
<style lang="less">
.m-select-menu-content {
    min-height: 58px !important;
}
</style>
