<template>
    <div class="table-warp indoor-light-required-loop-config fcc">
        <div class="filter-warp fcb">
            <div class="statics">
                {{ i18n.global.t('meos_control_web.loop_list') }}
                <div class="selected-spaces">（{{ i18n.global.t('meos_control_web.selected_space') }}:{{ selSpaceIds?.length ?? 0 }})</div>
            </div>
            <div class="selects">
                <m-select v-model="curSelectMode" :size="168" :options="modeSelectList" :prefix="i18n.global.t('meos_control_web.loop_status_colon')" clearable></m-select>
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
        <m-table :columns="columnsList" class="circuit-table" :data-source="tableData" @checked-change="checkedChange">
            <template #name="{ name, lampFuncType, isLoop, id }">
                <div class="row-name" :class="{ 'child-name': lampFuncType }" v-html="name"></div>
                <div v-if="!isLoop" class="open-count">
                    {{ i18n.global.t('meos_control_web.loop_on_colon') }}{{ idMapOpenCount[id] ?? 0 }}/{{ codeMapCircuitIds[id]?.length ?? 0 }}
                </div>
            </template>
            <template #relModels="{ relController, isLoop }">
                <div v-ellipsis class="row-name m-ellipsis">{{ objectsNameShow(isLoop, relController) }}</div>
            </template>
            <template #serviceSpace="{ serviceSpace, isLoop }">
                <div v-ellipsis class="row-name m-ellipsis" :class="{ 'no-cfg-text': !lampFuncType }">{{ objectsNameShow(isLoop, serviceSpace) }}</div>
            </template>

            <template #ops="row">
                <div class="op-warp">
                    <template v-if="row.isLoop">
                        <m-tips
                            :content="allDisable ? i18n.global.t('meos_control_web.cannot_operate_when_checked') : ''"
                            :disabled="!allDisable"
                            trigger="hover"
                            theme="darkTransparent"
                        >
                            <div
                                class="item"
                                :class="{ act: loopIdMapSettingMode[row.id] === SETTING_MODE.OPEN, disabled: allDisable }"
                                :disabled="allDisable"
                                @click="switchMode(row, SETTING_MODE.OPEN)"
                            >
                                {{ i18n.global.t('common.status_open') }}
                            </div>
                        </m-tips>
                        <m-tips
                            :content="allDisable ? i18n.global.t('meos_control_web.cannot_operate_when_checked') : ''"
                            :disabled="!allDisable"
                            trigger="hover"
                            theme="darkTransparent"
                        >
                            <div
                                class="item"
                                :class="{ act: loopIdMapSettingMode[row.id] === SETTING_MODE.CLOSE, disabled: allDisable }"
                                @click="switchMode(row, SETTING_MODE.CLOSE)"
                            >
                                {{ i18n.global.t('common.status_close') }}
                            </div>
                        </m-tips>
                    </template>
                    <template v-else>
                        <m-tips
                            :content="allDisable ? i18n.global.t('meos_control_web.cannot_operate_when_checked') : ''"
                            :disabled="!allDisable"
                            trigger="hover"
                            theme="darkTransparent"
                        >
                            <div
                                class="item"
                                :class="{ act: parentMapSettingMode[row.id] === SETTING_MODE.ALL_OPEN, disabled: allDisable }"
                                @click="switchMode(row, SETTING_MODE.OPEN)"
                            >
                                {{ i18n.global.t('meos_control_web.fully_on') }}
                            </div>
                        </m-tips>
                        <m-tips
                            :content="allDisable ? i18n.global.t('meos_control_web.cannot_operate_when_checked') : ''"
                            :disabled="!allDisable"
                            trigger="hover"
                            theme="darkTransparent"
                        >
                            <div
                                class="item"
                                :class="{ act: parentMapSettingMode[row.id] === SETTING_MODE.ALL_CLOSE, disabled: allDisable }"
                                @click="switchMode(row, SETTING_MODE.CLOSE)"
                            >
                                {{ i18n.global.t('meos_control_web.fully_off') }}
                            </div>
                        </m-tips>
                    </template>
                </div>
            </template>
            <template #tooltip="{ checkeds }">
                <div class="table-check-tooltips fc">
                    <span>
                        {{ i18n.global.t('meos_control_web.already_selected') }}<span class="count-num"> {{ checkeds.filter(obj => obj.isLoop)?.length }}</span>
                        {{ i18n.global.t('meos_control_web.project') }}
                    </span>
                    <div class="btn-groups fc">
                        <m-button width="64" size="small" @click="batchChange(checkeds, SETTING_MODE.OPEN)">{{ i18n.global.t('common.status_open') }}</m-button>
                        <m-button width="64" size="small" @click="batchChange(checkeds, SETTING_MODE.CLOSE)">{{ i18n.global.t('common.status_close') }}</m-button>
                    </div>
                </div>
            </template>
        </m-table>
    </div>
</template>

<script setup>
import _ from 'lodash';
import useLoading from '@/hooks/useLoading';

import { nameMatch } from '@/utils/viewUtils';
import { SETTING_MODE } from '../../variables';
import { loopIdMapSettingModeKey, baseFuncTypeCircuitKey, loadingCircuitKey, configLoopDataKey } from '@/views/IndoorLighting/hooks/useScheduledTaskEdit';
import i18n from '@/localization';

const props = defineProps({
    selSpaceIds: {
        type: Array,
        default: () => []
    }
});

const lampTypeOptions = ref([]);
const curSelectMode = ref('');
const curSelectLampType = ref('');
const allDisable = ref(false);
const curSearchInput = ref('');
const codeMapCircuitIds = ref({});
const idMapCircuitObjs = ref({});
const originTreeData = ref([]);
const loopIdMapSettingMode = inject(loopIdMapSettingModeKey);
const baseFuncTypeCircuit = inject(baseFuncTypeCircuitKey);
const loadingCircuit = inject(loadingCircuitKey);
const configLoopData = inject(configLoopDataKey);
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
const modeSelectList = [
    {
        id: SETTING_MODE.OPEN,
        name: i18n.global.t('meos_control_web.on')
    },
    {
        id: SETTING_MODE.CLOSE,
        name: i18n.global.t('meos_control_web.off')
    }
];

const checkedChange = obj => {
    console.log('item, selected: ');
    allDisable.value = obj.selecteds?.length > 0;
};
const reset = () => {
    originTreeData.value = [];
    codeMapCircuitIds.value = {};
    idMapCircuitObjs.value = {};
    loopIdMapSettingMode.value = {};
};
const translateToTree = (arr, codeMapIds = {}, idMapLoop = {}, lampTypeMap = {}) => {
    const result = [];
    arr.forEach(f => {
        const funcTypeCode = `func-${f.funcType}`;
        if (!codeMapIds[funcTypeCode]) {
            codeMapIds[funcTypeCode] = [];
        }

        f.id = funcTypeCode;
        f.name = f.funcTypeName ?? '--';
        f.checkbox = true;
        f.open = true;
        f.type = 'func';
        f.children = f.lampFuncTypeList?.map(l => {
            const lampCode = `${funcTypeCode}-lamp-${l.lampFuncType}`;
            if (!codeMapIds[lampCode]) {
                codeMapIds[lampCode] = [];
            }
            if (!lampTypeMap[l.lampFuncType]) {
                lampTypeMap[l.lampFuncType] = {
                    name: l.lampFuncTypeName,
                    id: l.lampFuncType
                };
            }
            l.id = lampCode;
            l.name = l.lampFuncTypeName ?? '--';
            l.type = 'lamp';
            l.checkbox = true;
            l.children = l.circuitList?.map(c => {
                codeMapIds[lampCode].push(c.id);
                codeMapIds[funcTypeCode].push(c.id);
                idMapLoop[c.id] = c;
                if (!loopIdMapSettingMode.value[c.id]) {
                    loopIdMapSettingMode.value[c.id] = SETTING_MODE.CLOSE;
                }
                return {
                    ...c,
                    name: c.localName,
                    isLoop: true,
                    type: 'loop',
                    checkbox: true
                };
            });
            return l;
        });
        result.push(f);
    });
    return result;
};

const tableData = computed(() => {
    return originTreeData.value
        ?.map(f => {
            const newFunc = { ...f };
            newFunc.children = newFunc.children
                ?.map(l => {
                    const newLamp = { ...l, type: 'lamp' };
                    let shouldOpen = false;
                    newLamp.children = newLamp.children?.filter(c => {
                        const modeOk = curSelectMode.value === '' || loopIdMapSettingMode.value[c.id] === curSelectMode.value;
                        const searchText = curSearchInput.value?.trim().toLowerCase();
                        const nameMatched = c.localName?.trim().toLowerCase().includes(searchText);
                        const wardsInclude = searchText === '' || c.localId?.trim().toLowerCase().includes(searchText) || nameMatched;
                        if (curSearchInput.value && wardsInclude) {
                            shouldOpen = true;
                            // c.codeText = c.circuitId?.includes(curSearchInput.value) ? nameMatch(c.circuitId, curSearchInput.value) : c.circuitId || '--';
                            c.name = searchText && nameMatched ? nameMatch(c.localName, searchText) : c.localName || '--';
                        } else {
                            // c.codeText = c.circuitId || '--';
                            c.name = c.localName;
                        }
                        return modeOk && wardsInclude;
                    });
                    newLamp.open = shouldOpen;
                    return newLamp;
                })
                .filter(l => {
                    const lampOk = curSelectLampType.value === '' || (curSelectLampType.value === 'NONE' && !l.lampFuncType) || l.lampFuncType === curSelectLampType.value;
                    return lampOk && l.children?.length > 0;
                });

            return newFunc;
            // return (curSelectMode.value === 'all' || obj.settingMode === curSelectMode.value) && wardsInclude;
        })
        .filter(f => f.children?.length > 0);
});
const columnsList = ref([
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.loop_name'),
        ellipsis: true,
        width: 500
    },
    {
        dataIndex: 'relModels',
        title: i18n.global.t('meos_control_web.related_module'),
        width: 180
    },
    {
        dataIndex: 'serviceSpace',
        title: i18n.global.t('meos_control_web.served_space'),
        width: 420
    },
    {
        dataIndex: 'ops',
        title: `${i18n.global.t('meos_control_web.operation1')}`,
        width: 112
    }
]);
const searchInputChange = val => {
    console.log('searchInputChange: ', val);
    curSearchInput.value = val;
};
const switchMode = (item, mode) => {
    if (allDisable.value) {
        return;
    }
    if (item.type === 'loop') {
        console.log('item: ', item);
        if (loopIdMapSettingMode.value[item.id] !== mode) {
            loopIdMapSettingMode.value[item.id] = mode;
        }
    } else {
        codeMapCircuitIds.value[item.id]?.forEach(id => {
            loopIdMapSettingMode.value[id] = mode;
        });
    }
};
const batchChange = (checkeds, toMode) => {
    const _record = {};
    checkeds?.forEach(obj => {
        if (obj.checked) {
            if (obj.parent) {
                obj.parent.checked = 'uncheck';
                if (obj.parent.parent) {
                    obj.parent.parent.checked = 'uncheck';
                }
            }
            if (obj.type === 'loop') {
                loopIdMapSettingMode.value[obj.id] = toMode;
            }

            _record[obj.id] = true;
            obj.checked = 'uncheck';
        }
    });
    allDisable.value = false;
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
const idMapOpenCount = computed(() => {
    const _idMapOpenCount = {};
    Object.keys(codeMapCircuitIds.value)?.forEach(id => {
        const ids = codeMapCircuitIds.value[id];
        let openCount = 0;
        ids?.forEach(loopId => {
            const mode = loopIdMapSettingMode.value[loopId];
            if (mode === SETTING_MODE.OPEN) {
                openCount += 1;
            }
        });
        _idMapOpenCount[id] = openCount;
    });
    return _idMapOpenCount;
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
watch(
    () => baseFuncTypeCircuit?.value,
    () => {
        // reset();

        if (baseFuncTypeCircuit?.value) {
            const codeMapIds = {},
                lampTypeMap = {},
                idMapLoop = {};
            const rst = translateToTree(baseFuncTypeCircuit.value, codeMapIds, idMapLoop, lampTypeMap);
            originTreeData.value = rst || [];
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
    reset
});
// loadData();
</script>
<style lang="less" scoped>
.table-warp {
    height: 100%;
    flex-direction: column;
    gap: 12px;
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
        height: calc(100% - 46px);
    }
    .open-count {
        margin-left: 8px;
        color: var(--gray-600, #626c78);

        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
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
            &.disabled {
                cursor: not-allowed;
                background: none;
                color: #c4c9cf;
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
