<template>
    <div class="table-warp indoor-light-required-loop-config">
        <div class="filter-warp fcb">
            <div class="statics">
                {{ i18n.global.t('meos_control_web.select_circuit') }}
            </div>
            <div class="selects">
                <m-select
                    v-if="hasLocalRemoteRule"
                    v-model="curLocalRemoteStatus"
                    :size="172"
                    :options="localRemoteOptions"
                    :prefix="`${i18n.global.t('meos_control_web.local_remote_status')}:`"
                    clearable
                ></m-select>
                <m-select v-model="curSelectLampType" :size="168" :options="lampTypeOptions" :prefix="i18n.global.t('meos_control_web.luminaire_type_colon')" clearable></m-select>
                <m-search
                    immediate
                    type="enter"
                    :placeholder="i18n.global.t('meos_control_web.press_enter_search_loop_name_code')"
                    @change="searchInputChange"
                    @clear="curSearchInput = ''"
                >
                </m-search>
            </div>
        </div>
        <div class="content">
            <div class="left">
                <m-tree v-model="curSelectLeftTree" :virtual="true" :data="leftTreeData" @select="selectLeftTree">
                    <template #nodeSuffix="node">
                        <div v-if="funcLampCountMap[node.id] > 0" class="sel-count">
                            {{ i18n.global.t('meos_control_web.selected_count', { count: funcLampCountMap[node.id] }) }}
                        </div>
                    </template>
                </m-tree>
            </div>
            <m-table :columns="columnsList" class="circuit-table" :data-source="tableData" :checkbox="true" @checked-change="checkedChange">
                <template #name="{ name, lampFuncType }">
                    <div class="row-name" :class="{ 'child-name': lampFuncType }" v-html="name"></div>
                </template>
                <template #relModels="row">
                    <div v-ellipsis class="row-name m-ellipsis">{{ relControllerDDCText(row) }}</div>
                </template>
                <template #serviceSpace="{ serviceSpace, isLoop }">
                    <div v-ellipsis class="row-name m-ellipsis" :class="{ 'no-cfg-text': !lampFuncType }">{{ objectsNameShow(isLoop, serviceSpace) }}</div>
                </template>

                <template #localRemoteStatus="row">
                    <div
                        class="local-remote"
                        :class="{ local: row.localRemoteStatus === INFOCODE.localRemoteStatus0.dataValue, remote: row.localRemoteStatus === INFOCODE.localRemoteStatus1.dataValue }"
                    >
                        {{ row.localRemoteStatusName }}
                    </div>
                </template>
            </m-table>
        </div>
    </div>
</template>

<script setup>
import _ from 'lodash';
import useLoading from '@/hooks/useLoading';
import DockSingleton from '@/hooks/responsiveDock';
import { nameMatch } from '@/utils/viewUtils';
import { SETTING_MODE, INFOCODE } from '../../variables';
import { loopIdMapSettingModeKey, baseFuncTypeCircuitKey, loadingCircuitKey, configLoopDataKey, onlySelForSpaceKey } from '@/views/IndoorLighting/hooks/useTemporaryControlEdit';
import i18n from '@/localization';

const props = defineProps({
    selSpaceIds: {
        type: Array,
        default: () => []
    }
});

const lampTypeOptions = ref([]);
const curSelectLeftTree = ref([]);
const curLocalRemoteStatus = ref('');
const curSelectFuncType = ref('');
const curSelectLampType = ref('');
const allDisable = ref(false);
const hasLocalRemoteRule = ref(false);
const curSearchInput = ref('');
const codeMapCircuitIds = ref({});
const idMapCircuitObjs = ref({});
const originTableData = ref([]);
const circuitCheckedMap = ref({});
const loopIdMapSettingMode = inject(loopIdMapSettingModeKey);
const baseFuncTypeCircuit = inject(baseFuncTypeCircuitKey);
const loadingCircuit = inject(loadingCircuitKey);
const configLoopData = inject(configLoopDataKey);
const onlySelForSpace = inject(onlySelForSpaceKey);

const { getIotData } = DockSingleton.getInstance();

const genFuncId = funcType => `func-${funcType}`;
const genLampId = (funcType, lampFuncType) => `lamp-${funcType}-${lampFuncType}`;
// 加载动画相关
const { loading, openLoading, closeLoading } = useLoading(
    'indoor-light-required-loop-config',
    '#FFFFFF',
    'ball',
    {
        width: '100px',
        height: '100px'
    },
    0
);
const localRemoteOptions = [
    {
        id: INFOCODE.localRemoteStatus0.dataValue,
        name: INFOCODE.localRemoteStatus0.aliasName
    },
    {
        id: INFOCODE.localRemoteStatus1.dataValue,
        name: INFOCODE.localRemoteStatus1.aliasName
    }
];

const checkedChange = obj => {
    // console.log('item, selected: ', obj);
    allDisable.value = obj.selecteds?.length > 0;
    obj.items?.forEach(item => {
        circuitCheckedMap.value[item.id] = item.checked;
    });
};
const reset = () => {
    originTableData.value = [];
    curSelectLeftTree.value = [];
    codeMapCircuitIds.value = {};
    idMapCircuitObjs.value = {};
    loopIdMapSettingMode.value = {};
    circuitCheckedMap.value = {};
    hasLocalRemoteRule.value = false;
    allDisable.value = false;
    curSelectFuncType.value = '';
    curSelectLampType.value = '';
    curSearchInput.value = '';
    curLocalRemoteStatus.value = '';
};
const translateToTableData = (arr, codeMapIds = {}, idMapLoop = {}, lampTypeMap = {}) => {
    const result = [];

    arr.forEach(f => {
        const funcTypeCode = genFuncId(f.funcType);
        if (!codeMapIds[funcTypeCode]) {
            codeMapIds[funcTypeCode] = [];
        }

        f.lampFuncTypeList?.forEach(l => {
            if (!lampTypeMap[l.lampFuncType]) {
                lampTypeMap[l.lampFuncType] = {
                    name: l.lampFuncTypeName,
                    id: l.lampFuncType
                };
            }

            l.circuitList?.forEach(c => {
                if (!idMapLoop[c.id]) {
                    const localRemoteStatusData = getIotData(c.id, INFOCODE.localRemoteStatus0.infoCode);
                    if (!hasLocalRemoteRule.value && localRemoteStatusData?.existsIotRule) {
                        hasLocalRemoteRule.value = true;
                    }
                    const localRemoteStatusName = localRemoteStatusData?.dataSources?.find(obj => obj.code === localRemoteStatusData.dataValue)?.name ?? '--';

                    const newObj = {
                        ...c,
                        funcTypeName: f.funcTypeName,
                        lampFuncTypeName: l.lampFuncTypeName,
                        name: c.localName,
                        isLoop: true,
                        type: 'loop',
                        localRemoteStatus: localRemoteStatusData.dataValue,
                        localRemoteStatusName
                    };

                    idMapLoop[c.id] = newObj;
                    result.push(newObj);
                }
            });
        });
    });
    return result;
};

function convertToTreeDataSimple(deviceList) {
    const result = {};
    deviceList.forEach(device => {
        // 构建一级节点
        if (!result[device.funcType]) {
            result[device.funcType] = {
                id: genFuncId(device.funcType),
                name: device.funcTypeName,

                children: {}
            };
        }
        // 构建二级节点
        if (!result[device.funcType].children[device.lampFuncType]) {
            result[device.funcType].children[device.lampFuncType] = {
                id: genLampId(device.funcType, device.lampFuncType),
                name: device.lampFuncTypeName || '--',
                children: []
            };
        }
    });
    // 转换为数组
    return Object.values(result).map(item => ({
        ...item,
        children: Object.values(item.children)
    }));
}

const isLeftTreeSelectedMatch = loop => {
    if (!curSelectLeftTree.value?.length) return true;
    const curSelId = curSelectLeftTree.value[0];

    return curSelId === 'all' || curSelId === genFuncId(loop.funcType) || curSelId === genLampId(loop.funcType, loop.lampFuncType);
};

const tableDataBaseFilttered = computed(() => {
    return originTableData.value
        ?.filter(loop => {
            const funcTypeOk = curSelectFuncType.value === '' || (curSelectFuncType.value === 'NONE' && !loop.funcType) || loop.funcType === curSelectFuncType.value;
            const lampOk = curSelectLampType.value === '' || (curSelectLampType.value === 'NONE' && !loop.lampFuncType) || loop.lampFuncType === curSelectLampType.value;
            let localRemoteStatusOk = curLocalRemoteStatus.value === '' || loop.localRemoteStatus === curLocalRemoteStatus.value;

            const searchText = curSearchInput.value?.trim().toLowerCase();
            const nameMatched = loop.localName?.trim().toLowerCase().includes(searchText);
            const wardsInclude = searchText === '' || loop.localId?.trim().toLowerCase().includes(searchText) || nameMatched;
            if (curSearchInput.value && wardsInclude) {
                // c.codeText = c.circuitId?.includes(curSearchInput.value) ? nameMatch(c.circuitId, curSearchInput.value) : c.circuitId || '--';
                loop.name = searchText && nameMatched ? nameMatch(loop.localName, searchText) : loop.localName || '--';
            } else {
                // c.codeText = c.circuitId || '--';
                loop.name = loop.localName;
            }
            const onlyCheckedOk = onlySelForSpace.value === 'uncheck' || circuitCheckedMap.value[loop.id] === 'checked';

            return funcTypeOk && lampOk && localRemoteStatusOk && wardsInclude && onlyCheckedOk;
        })
        ?.map(loop => {
            return {
                checked: circuitCheckedMap.value[loop.id] ?? 'uncheck',
                ...loop
            };
        });
});

const tableData = computed(() => {
    return tableDataBaseFilttered.value?.filter(loop => {
        const leftSelTreeOk = isLeftTreeSelectedMatch(loop);
        return leftSelTreeOk;
    });
});

const leftTreeData = computed(() => {
    // console.log('leftTreeData: ', tableDataBaseFilttered.value);
    const arr = convertToTreeDataSimple(tableDataBaseFilttered.value);
    // console.log('arr: ', arr, funcLampCountMap.value);

    return [
        {
            id: 'all',
            open: true,
            name: i18n.global.t('common.all'),
            children: arr
        }
    ];
});
const selectedCircuitsInfo = computed(() => {
    const selected = [];
    const circuitIds = [];
    const funcLampCountMap = {};
    let localCount = 0;
    originTableData.value?.forEach(loop => {
        if (circuitCheckedMap.value[loop.id] === 'checked') {
            const funcTypeId = genFuncId(loop.funcType);
            const lampTypeId = genLampId(loop.funcType, loop.lampFuncType);
            if (funcLampCountMap[funcTypeId] === undefined) funcLampCountMap[funcTypeId] = 0;
            if (funcLampCountMap[lampTypeId] === undefined) funcLampCountMap[lampTypeId] = 0;
            funcLampCountMap[funcTypeId] += 1;
            funcLampCountMap[lampTypeId] += 1;
            if (loop.localRemoteStatus === '0') localCount += 1;
            selected.push(loop);
            circuitIds.push(loop.id);
        }
    });
    return { selected, circuitIds, funcLampCountMap, localCount };
});
const selItemCount = computed(() => {
    return selectedCircuitsInfo.value?.circuitIds?.length ?? 0;
});
const selLoopLocalCount = computed(() => {
    return selectedCircuitsInfo.value?.localCount ?? 0;
});

const funcLampCountMap = computed(() => {
    return selectedCircuitsInfo.value?.funcLampCountMap ?? {};
});
const columnsList = computed(() => {
    const baseColumns = [
        {
            dataIndex: 'name',
            title: i18n.global.t('meos_control_web.loop_name'),
            ellipsis: true,
            width: 254
        },
        {
            dataIndex: 'relModels',
            title: i18n.global.t('meos_control_web.linked_lighting_controller'),
            width: 198
        },
        {
            dataIndex: 'serviceSpace',
            title: i18n.global.t('meos_control_web.served_space'),
            width: 254
        }
    ];
    if (hasLocalRemoteRule.value) {
        baseColumns.push({
            dataIndex: 'localRemoteStatus',
            title: `${i18n.global.t('meos_control_web.local_remote_status')}`,
            width: 146
        });
    }
    return baseColumns;
});
const searchInputChange = val => {
    curSearchInput.value = val;
};
const relControllerDDCText = loop => {
    return loop.relController?.length > 0 ? loop.relController[0].localName : loop.relDDC?.length > 0 ? loop.relDDC[0].localName : '--';
};
const objectsNameShow = (isLoop, objs) => {
    if (isLoop) {
        return objs?.length > 0 ? objs?.map(obj => obj.localName)?.join(',') : '--';
    }
    return '';
};

const parentMapSettingMode = computed(() => {
    const idMapMode = {};

    Object.keys(codeMapCircuitIds.value)?.forEach(id => {
        const ids = codeMapCircuitIds.value[id];
        let openCount = 0,
            closeCount = 0;
        ids?.forEach(loopId => {
            const mode = loopIdMapSettingMode.value[loopId];
            if (mode === SETTING_MODE.OPEN) {
                openCount += 1;
            } else if (mode === SETTING_MODE.CLOSE) {
                closeCount += 1;
            }
            if (ids.length > 0) {
                if (openCount === ids.length) {
                    idMapMode[id] = SETTING_MODE.ALL_OPEN;
                } else if (closeCount === ids.length) {
                    idMapMode[id] = SETTING_MODE.ALL_CLOSE;
                }
            }
        });
    });

    return idMapMode;
});

const calcConfigData = () => {
    const treeArr = tableData.value
        .map(func => {
            const lamps = func.children
                ?.map(lamp => {
                    const loops = lamp.children
                        ?.map(loop => {
                            if (loopIdMapSettingMode.value[loop.id]) {
                                return { ...loop, status: loopIdMapSettingMode.value[loop.id] };
                            }
                            return null;
                        })
                        .filter(Boolean);
                    if (loops.length > 0) {
                        return {
                            ...lamp,
                            status: parentMapSettingMode.value[lamp.id] ? parentMapSettingMode.value[lamp.id] : 'PART_OPEN',
                            children: loops
                        };
                    }
                })
                .filter(Boolean);
            if (lamps?.length > 0) {
                return { ...func, children: lamps, status: parentMapSettingMode.value[func.id] ? parentMapSettingMode.value[func.id] : 'PART_OPEN' };
            }
            return null;
        })
        .filter(Boolean);

    configLoopData.value = treeArr;
};
const setSelects = ids => {
    ids.forEach(id => {
        circuitCheckedMap.value[id] = 'checked';
    });
};
watch(
    () => baseFuncTypeCircuit?.value,
    () => {
        // reset();

        if (baseFuncTypeCircuit?.value) {
            const codeMapIds = {},
                lampTypeMap = {},
                idMapLoop = {};
            const rst = translateToTableData(baseFuncTypeCircuit.value, codeMapIds, idMapLoop, lampTypeMap);

            originTableData.value = rst ?? [];
            codeMapCircuitIds.value = codeMapIds;
            idMapCircuitObjs.value = idMapLoop;
            lampTypeOptions.value = Object.values(lampTypeMap);
        }
    },
    { immediate: true }
);
watch(
    loadingCircuit,
    () => {
        if (loadingCircuit.value) {
            openLoading();
        } else {
            closeLoading();
        }
    },
    { immediate: true }
);

defineExpose({
    calcConfigData,
    setSelects,
    selectedCircuitsInfo,
    selLoopLocalCount,
    selItemCount,
    reset
});
// loadData();
</script>
<style lang="less" scoped>
.table-warp {
    display: flex;
    flex: 1;
    overflow: hidden;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    flex-direction: column;
    gap: 12px;

    .top-area {
        display: flex;
        height: 35px;
        align-items: center;
        gap: 10px;
        align-self: stretch;
        padding: 4px 8px;
        border-radius: 4px;
        background: var(--Grey-Grey-200, #e8ecf0);

        color: var(--Grey-Grey-600, #626c78);
        font-size: 14px;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
    .filter-warp {
        width: 100%;
    }
    .statics {
        display: inline-flex;
        color: #000;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 137.5% */
        .selected-spaces {
            color: #626c78;
        }
    }
    .selects {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .circuit-table {
        flex: 1;
        overflow-x: hidden;
        height: 100%;
        // height: calc(100% - 46px);
    }
    .open-count {
        margin-left: 8px;
        color: var(--gray-600, #626c78);

        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
    }
    .content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex: 1;
        align-items: flex-start;
        gap: 8px;
        align-self: stretch;
        .left {
            display: flex;
            width: 304px;
            padding-right: 8px;
            flex-direction: column;
            align-items: flex-start;
            align-self: stretch;
            border-right: 1px solid var(--Grey-Grey-300, #e1e5eb);
            .sel-count {
                margin-left: 4px;
                color: var(--Grey-Grey-600, #626c78);
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px; /* 166.667% */
            }
        }
    }
    .local-remote {
        display: flex;
        align-items: center;
        padding: 0 4px;
        color: var(--Grey-Grey-600, #626c78);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
        &.local {
            color: var(--Palette-Blue-700, #1b4acc);
            border-radius: 2px;
            background: var(--Palette-Blue-100, #d9ebff);
        }
        &.remote {
            color: var(--Grey-Grey-600, #626c78);
            border-radius: 2px;
            background: var(--Grey-Grey-200, #e8ecf0);
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
