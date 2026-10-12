<template>
    <m-modal v-model:visible="showModal" :append-to="$modalAppendTo" modal-class-name="loop-preview-modal-custom" type="full" :need-scrollbar="false">
        <template #header>
            <div class="preview-header">
                <div class="preview-title">
                    {{ i18n.global.t('meos_control_web.loop_demand_overview') }}
                </div>
            </div>
        </template>
        <template #content>
            <div class="preview-content">
                <div class="left">
                    <m-search
                        v-if="treeData.length"
                        v-model="keyword"
                        :placeholder="i18n.global.t('meos_control_web.search_space_name')"
                        :style="{ width: '100%', marginBottom: '7px' }"
                        :height="32"
                        trigger-on-focus
                        type="real"
                        label="value"
                    ></m-search>
                    <m-tree v-model="selectedTreeNodes" :data="treeData" virtual :filter-value="keyword" search-as-tree> </m-tree>
                </div>
                <template v-if="!viewLoops?.length">
                    <Empty class="empty-container" />
                </template>
                <div v-if="viewLoops?.length" class="right">
                    <div class="filter-container">
                        <m-search v-model="query.name" :placeholder="i18n.global.t('meos_control_web.search_lighting_loop_name')" immediate type="enter" :size="240" :width="240">
                        </m-search>

                        <m-select
                            v-model="query.funcTypes"
                            :prefix="i18n.global.t('meos_control_web.function_type_colon')"
                            multiple
                            clearable
                            has-check-all
                            has-confirm
                            :options="funcTypeOpts"
                            :size="240"
                        >
                        </m-select>
                        <m-select
                            v-model="query.lampFuncTypes"
                            :prefix="i18n.global.t('meos_control_web.luminaire_type_colon')"
                            multiple
                            clearable
                            :options="lampOpts"
                            has-check-all
                            has-confirm
                            :size="240"
                        >
                        </m-select>
                    </div>

                    <template v-if="!tableData.length">
                        <Empty class="empty-container" />
                    </template>

                    <TimeLines v-show="tableData.length" ref="timeLinesRef" v-model:current-time="currentTime" class="lines-container" :data="tableData">
                        <template #pages>
                            <m-pagination
                                v-model:page-num="pageState.pageNum"
                                background
                                :total="pageState.total"
                                :page-size="pageState.pageSize"
                                layout="total,prev,pager,next,sizes"
                                @page-change="pageChange"
                                @size-change="sizeChange"
                            ></m-pagination>
                        </template>
                    </TimeLines>
                </div>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import { uniqBy, trim } from 'lodash';
import dayjs from 'dayjs';
import i18n from '@/localization';
import useStore from '@/store';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { loopListKey, currentFloorObjInjectKey } from '../../hooks/useBaseHook';
import { PUBLIC, PARKING } from '../../variables';
import { equipmentTargetDataInjectKey, equipmentTargetRunningMonitorSecondTypeInjectKey } from '../../hooks/useEquipmentTarget';
import TimeLines from './TimeLines.vue';
import Empty from '@/components/common/Empty.vue';
import { getDayjsTz } from '@/utils/globalVariables';

const { base } = useStore();
const { projectName } = base;

const NOT_CONFIGURED = 'NOT_CONFIGURED';
const FEEDBACK_ADJUSTMENT = 'FEEDBACK_ADJUSTMENT';
const OPEN = 'OPEN';
const CLOSE = 'CLOSE';
const EMPTY = 'EMPTY';
const statusSwitchMap = {
    [NOT_CONFIGURED]: 'empty',
    [OPEN]: 'open',
    [CLOSE]: 'close',
    [FEEDBACK_ADJUSTMENT]: 'feedback',
    [EMPTY]: 'empty'
};

// 获取场景数据、当前楼层数据、所有回路数据、回路状态数据及更新时间
const equipmentTargetRunningMonitorSecondType = inject(equipmentTargetRunningMonitorSecondTypeInjectKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const allLoopListMap = inject(loopListKey, new Map());

const equipmentTargetData = inject(equipmentTargetDataInjectKey);
const equipUpdateTime = ref('');
const emptyTimesMap = ref(new Map());

const timeLinesRef = ref(null);
// 弹窗控制、当前时间
const showModal = defineModel('show', { type: Boolean, default: false });
const currentTime = defineModel('currentTime', { type: String, default: '12:00' });

// 回路开关反馈调节状态数据
const loopsStatusMap = ref(new Map());

// 树数据
const selectedTreeNodes = ref([]);
const treeData = ref([]);
const curSelectedNode = computed(() => {
    const curNode = selectedTreeNodes?.value?.[0];
    return curNode;
});

// 树搜索关键字
const keyword = ref('');

// 列表搜索
const query = reactive({
    name: '',
    funcTypes: [],
    lampFuncTypes: []
});

// 列表分页
const defaultPage = {
    pageNum: 1,
    pageSize: 20,
    total: 0
};
const pageState = reactive(defaultPage);

// 列表数据
const tableData = ref([]);

const serviceAreaType = computed(() => {
    const code = equipmentTargetRunningMonitorSecondType.value || '';
    const isPublic = code === PUBLIC.code;
    const isParking = code === PARKING.code;
    return isPublic ? PUBLIC.id : isParking ? PARKING.id : '';
});

// 计算实际查看的回路数据
const viewLoops = computed(() => {
    const res = Array.from(allLoopListMap.value.values());
    const curSceneLoops = res.filter(loop => loop.serviceAreaType === serviceAreaType.value);
    return curSceneLoops;
});

watch(
    [() => equipmentTargetData.value, () => equipmentTargetRunningMonitorSecondType.value],
    () => {
        const { funcTypeConfigs } = equipmentTargetData.value || {};
        if (Array.isArray(funcTypeConfigs)) {
            emptyTimesMap.value.clear();
            loopsStatusMap.value.clear();
            for (const funcTypeConfig of funcTypeConfigs) {
                const { beginDateTime, endDateTime, funcTypeConfigs: funcArr } = funcTypeConfig || {};
                const timeId = beginDateTime && endDateTime ? `${beginDateTime},${endDateTime}` : '';
                if (Array.isArray(funcArr)) {
                    if (!funcArr?.length) {
                        // 无场景时段需要特殊处理
                        emptyTimesMap.value.set(timeId, {
                            id: timeId,
                            beginDateTime,
                            endDateTime,
                            settingMode: EMPTY
                        });
                    } else {
                        for (const funcItem of funcArr) {
                            const { funcType, circuitSettings = [] } = funcItem || {};
                            for (const circuitSetting of circuitSettings) {
                                const { circuitId, settingMode } = circuitSetting || {};
                                if (!loopsStatusMap.value.has(circuitId)) {
                                    loopsStatusMap.value.set(circuitId, {
                                        id: circuitId,
                                        settingsMap: new Map()
                                    });
                                }
                                const curSettingMap = loopsStatusMap.value.get(circuitId).settingsMap;
                                if (!curSettingMap.has(timeId)) {
                                    curSettingMap.set(timeId, {
                                        funcType,
                                        beginDateTime,
                                        endDateTime,
                                        settingMode
                                    });
                                }
                            }
                        }
                    }
                }
            }
            equipUpdateTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm:ss');
        }
    },
    {
        immediate: true
    }
);

const getLoopStatus = loopId => {
    let tempArr = [];
    const loopMap = loopsStatusMap.value?.get(loopId)?.settingsMap ?? new Map();
    const emptyMap = emptyTimesMap.value;

    const processMap = (map, defaultStatus) => {
        for (const entry of map) {
            const [, loop] = entry;
            if (!loop || typeof loop !== 'object') continue;

            const { beginDateTime, endDateTime, settingMode } = loop || {};
            const status = statusSwitchMap[settingMode ?? defaultStatus];

            try {
                // 验证日期时间参数
                if (!beginDateTime || !endDateTime) {
                    tempArr.push({ range: '', status, errorData: { beginDateTime, endDateTime } });
                    continue;
                }

                const start = dayjs(beginDateTime).format('HH:mm');
                const end = dayjs(endDateTime).format('HH:mm');

                // 验证格式化结果
                if (!start || !end || start === 'Invalid Date' || end === 'Invalid Date') {
                    tempArr.push({ range: '', status, errorData: { beginDateTime, endDateTime } });
                    continue;
                }

                const isZero = end === '00:00';
                const range = `${start}-${isZero ? '24:00' : end}`;
                tempArr.push({ range, status });
            } catch (error) {
                tempArr.push({ range: '', status, errorData: { beginDateTime, endDateTime } });
            }
        }
    };
    processMap(loopMap, CLOSE);
    processMap(emptyMap, EMPTY);
    const validRanges = tempArr?.filter(s => !!s?.range && !s?.errorData);
    return { ranges: validRanges };
};

// 获取当前节点下的回路数据
const getLoopListByNodeId = nodeId => {
    if (nodeId === 'root') {
        return viewLoops.value;
    }
    return viewLoops.value.filter(loop => {
        const hasIncludeNode = loop.relSpace.some(space => {
            const { floorId, id: spaceId } = space;
            const floor = treeBuildFloorStore().getBuildOrFloor(floorId);
            const { buildingId } = floor || {};
            return [spaceId, floorId, buildingId].includes(nodeId);
        });
        const isCurrentScene = loop.serviceAreaType === serviceAreaType.value;
        return hasIncludeNode && isCurrentScene;
    });
};

// 功能类型
const funcTypeOpts = computed({
    get() {
        const curNodeLoops = getLoopListByNodeId?.(curSelectedNode.value);
        const opts = curNodeLoops.map(l => ({
            id: l?.funcType ?? '',
            name: l?.funcTypeName ?? '--'
        }));

        return uniqBy(opts, 'id');
    },
    set(val) {
        return val;
    }
});

// 灯具类型
const lampOpts = computed({
    get() {
        const curNodeLoops = getLoopListByNodeId?.(curSelectedNode.value);
        const opts = curNodeLoops.map(l => ({
            id: l?.lampFuncType ?? '',
            name: l?.lampFuncTypeName ?? '--'
        }));
        return uniqBy(opts, 'id');
    },
    set(val) {
        return val;
    }
});

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义所有正则元字符
}

// 生成空间树数据
const generateSpaceTreeData = (spaceList, filterFloorId = '') => {
    const spaceIdSet = new Set();
    const floorsMap = new Map();
    const buildsMap = new Map();

    spaceList.forEach(space => {
        const { id, floorId } = space || {};
        if (filterFloorId && floorId !== filterFloorId) {
            return;
        }

        const floorInfo = treeBuildFloorStore().getBuildOrFloor(floorId) || {};
        const { buildingId } = floorInfo;
        const buildingInfo = treeBuildFloorStore().getBuildOrFloor(buildingId) || {};

        if (!floorsMap.has(floorId)) {
            floorsMap.set(floorId, { ...floorInfo, name: floorInfo?.localName, children: [] });
        }

        if (!spaceIdSet.has(id)) {
            spaceIdSet.add(id);
            const cloneSpace = { ...space, name: space?.localName, objType: 'space' };
            floorsMap.get(floorId).children.push(cloneSpace);
        }

        if (!buildsMap.has(buildingId)) {
            buildsMap.set(buildingId, { ...buildingInfo, name: buildingInfo?.localName, children: [] });
        }
    });

    [...floorsMap.values()]
        .toSorted((a, b) => b.floorSequenceId - a.floorSequenceId)
        .forEach(floor => {
            const buildingInfo = buildsMap.get(floor.buildingId) || {};
            if (buildingInfo) {
                buildingInfo.children.push(floor);
            }
        });
    const finalTree = [{ id: 'root', name: projectName || '--', open: buildsMap.size === 1, children: [...buildsMap.values()].map(b => ({ ...b, open: buildsMap.size === 1 })) }];
    return finalTree;
};

watch(
    [() => currentFloorObj.value?.id, () => viewLoops.value],
    () => {
        const allSpaceList = viewLoops.value.flatMap(loop => loop?.relSpace ?? []);
        const curInstanceId = currentFloorObj.value?.id ? currentFloorObj.value?.id : 'root';
        const tempTree = generateSpaceTreeData(allSpaceList);
        treeData.value = tempTree;
        nextTick(() => {
            selectedTreeNodes.value = [curInstanceId];
        });
    },
    {
        immediate: true
    }
);

// 动态计算列表数据
const calculateData = needScroll => {
    // tableData.value = [];

    const activeLoopList = getLoopListByNodeId?.(curSelectedNode.value);
    const funcTypeOptions = {};
    const lampFuncTypeOptions = {};

    const data = activeLoopList
        .filter(loop => {
            let valid = true;
            const { funcType = '', lampFuncType = '', funcTypeName, lampFuncTypeName } = loop;

            if (trim(query.name)) {
                const reg = new RegExp(escapeRegExp(trim(query.name)), 'gi');
                if (!reg.test(loop.localName)) {
                    valid = false;
                }
            }

            if (valid) {
                funcTypeOptions[funcType] = {
                    id: funcType,
                    name: funcTypeName ?? '--'
                };
                lampFuncTypeOptions[lampFuncType] = {
                    id: lampFuncType,
                    name: lampFuncTypeName ?? '--'
                };
            }

            if (query.funcTypes.length) {
                if (!query.funcTypes.includes(funcType)) {
                    valid = false;
                }
            }

            if (query.lampFuncTypes.length) {
                if (!query.lampFuncTypes.includes(lampFuncType)) {
                    valid = false;
                }
            }

            return valid;
        })
        .toSorted((a, b) =>
            a.localName?.localeCompare(b.localName, 'zh', {
                numeric: true,
                sensitivity: 'base'
            })
        )
        .map(loop => {
            const loopStatus = getLoopStatus(loop.id) || {};
            return { name: loop.localName, id: loop.id, ...loopStatus };
        });

    funcTypeOpts.value = data.length === 0 || Object.keys(funcTypeOptions).length === 0 ? funcTypeOpts.value : Object.values(funcTypeOptions);
    lampOpts.value = data.length === 0 || Object.keys(lampFuncTypeOptions).length === 0 ? lampOpts.value : Object.values(lampFuncTypeOptions);
    pageState.total = data.length;
    tableData.value = data.slice((pageState.pageNum - 1) * pageState.pageSize, pageState.pageNum * pageState.pageSize);
    if (needScroll) {
        timeLinesRef?.value?.scrollToTop?.();
    }
};

const resetAndRefresh = () => {
    query.name = '';
    query.funcTypes = [];
    query.lampFuncTypes = [];

    pageState.pageNum = 1;
    // pageState.pageSize = 20;
    pageState.total = 0;

    nextTick(() => {
        calculateData(true);
    });
};

watch(
    () => equipUpdateTime.value,
    cur => {
        if (cur && curSelectedNode.value && showModal.value) {
            calculateData();
        }
    }
);

watch(
    () => showModal.value,
    () => {
        keyword.value = '';
        if (showModal.value && currentFloorObj.value?.id) {
            const curInstanceId = currentFloorObj.value.id;
            nextTick(() => {
                selectedTreeNodes.value = [curInstanceId];
            });
        }
    },
    {
        immediate: true
    }
);

watch(
    [() => curSelectedNode.value, () => showModal.value],
    () => {
        if (curSelectedNode.value && showModal.value) {
            resetAndRefresh();
        }
    },
    {
        immediate: true
    }
);

watch([() => query.name, () => query.funcTypes, () => query.lampFuncTypes], () => {
    if (curSelectedNode.value && showModal.value) {
        pageState.pageNum = 1;
        calculateData(true);
    }
});

const pageChange = val => {
    pageState.pageNum = val;
    calculateData(true);
};
const sizeChange = size => {
    pageState.pageNum = 1;
    pageState.pageSize = size;
    calculateData(true);
};
</script>

<style lang="less">
.loop-preview-modal-custom.m-modal-bg {
    .m-modal-full {
        .m-modal-header {
            display: flex;
            padding: 12px 24px;
            justify-content: space-between;
            align-items: center;
        }

        .preview-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .preview-title {
                font-weight: 700;
                white-space: nowrap;
                font-size: 16px;
                line-height: 20px;
                display: flex;
                flex-direction: row;
                align-items: center;
                white-space: nowrap;
                min-width: 0;
            }
        }

        .m-modal-full-content {
            padding: 0px;

            .preview-content {
                display: flex;
                align-self: center;
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
<style lang="less" scoped>
.left {
    display: flex;
    width: 360px;
    height: 100%;
    padding: 12px 24px;
    flex-direction: column;
    gap: 8px;
    background: #f7f9fa;
}
.right {
    flex: 1;
    display: flex;
    flex-direction: column;

    .filter-container {
        display: flex;
        align-items: center;
        padding: 16px 24px 10px;
        gap: 12px;
    }

    .lines-container {
        padding-left: 24px;
        height: calc(100% - 58px);
    }
}
.empty-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
