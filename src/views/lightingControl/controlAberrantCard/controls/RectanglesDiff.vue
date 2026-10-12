<template>
    <div class="rectangles-diff-wrapper">
        <div class="rectangles-diff-header">
            <div class="left">
                <div class="rectangles-diff-title">{{ i18n.global.t('meos_control_web.demand_overview') }}</div>
                <m-button v-if="showCollapse" type="link" @click="toggle">{{
                    isCollapse ? i18n.global.t('meos_control_web.expand') : i18n.global.t('meos_control_web.collapse')
                }}</m-button>
            </div>
            <div class="right">
                <div class="right-content"><slot name="action"></slot></div>
            </div>
        </div>
        <div class="rectangles-diff-content">
            <div class="legend">
                <div v-for="item in finalLegends" :key="item" class="legend-item">
                    <div
                        :class="{
                            'legend-item-color': true,
                            'is-self': item === i18n.global.t('meos_control_web.self_interven')
                        }"
                    ></div>
                    <div class="legend-item-text">{{ item }}</div>
                </div>
            </div>
            <div class="rectangles">
                <div class="standard-rectangles">
                    <template v-for="item in standardRectangles" :key="item.timeScope">
                        <m-popover class="custom-rectangle-popover" :show-arrow="false" theme="darkTransparent" placement="top">
                            <template #content>
                                <div class="hover-title">
                                    {{
                                        `${item?.isNone ? i18n.global.t('meos_control_web.demand_scene_not_yet_set') : item?.name} ${
                                            item.isActive ? '(' + i18n.global.t('meos_control_web.effective') + ')' : ''
                                        }`
                                    }}
                                </div>
                                <div>{{ `${item?.timeScope}` }}</div>
                            </template>
                            <div
                                :class="{
                                    'standard-rectangle-box': true,
                                    [item?.isNone ? 'has-none' : 'has-name']: true,
                                    'is-not-hover': !isHover(item) && !isClick(item)
                                }"
                                :style="{
                                    left: item?.left,
                                    width: item?.width,
                                    minWidth: item?.isMini ? '4px' : 'none'
                                }"
                                @click="onSelect(item)"
                                @mouseenter="mouseShow(item, true)"
                                @mouseleave="mouseShow(item, false)"
                            >
                                <div
                                    class="rectangle-item-inner"
                                    :style="{
                                        'border-inline':
                                            isHover(item) || isClick(item)
                                                ? `${item?.isMini ? 0.5 : 1.5}px solid ${checkBorderColor(item)}`
                                                : `${item?.isMini ? 0.5 : 1.5}px solid white`,
                                        'border-block': isHover(item) || isClick(item) ? `${item?.isMini ? 0.5 : 1.5}px solid ${checkBorderColor(item)}` : 'none'
                                    }"
                                ></div>
                            </div>
                        </m-popover>
                    </template>
                </div>
                <template v-for="(diffItems, index) in diffRectangles" :key="index">
                    <div v-if="!!diffItems.length && !diffItems?.[0]?.isHide" class="diff-rectangles-wrapper">
                        <div v-if="showCollapse" class="diff-title">{{ diffItems?.[0]?.isSelf ? i18n.global.t('meos_control_web.self_interven') : diffItems?.[0]?.name }}</div>
                        <div class="diff-rectangles">
                            <template v-for="item in diffItems" :key="item.timeScope">
                                <m-popover class="custom-rectangle-popover" :show-arrow="false" theme="darkTransparent" placement="top">
                                    <template #content>
                                        <div class="hover-title">
                                            {{
                                                `${
                                                    item?.isNone
                                                        ? i18n.global.t('meos_control_web.no_intervention')
                                                        : props?.defaultTemplateType
                                                        ? i18n.global.t('meos_control_web.manual_intervention1')
                                                        : item?.tempName || item?.name
                                                } ${item.isActive ? '(' + i18n.global.t('meos_control_web.effective') + ')' : ''}`
                                            }}
                                        </div>
                                        <div>{{ `${item?.timeScope}` }}</div>
                                    </template>
                                    <div
                                        :class="{
                                            'diff-rectangle-box': true,
                                            [item?.isNone ? 'has-none' : 'has-name']: true,
                                            'is-self': item?.isSelf,
                                            'is-not-hover': !isHover(item) && !isClick(item)
                                        }"
                                        :style="{ left: item?.left, width: item?.width }"
                                        @click="onSelect(item)"
                                        @mouseenter="mouseShow(item, true)"
                                        @mouseleave="mouseShow(item, false)"
                                    >
                                        <div
                                            class="rectangle-item-inner"
                                            :style="{
                                                'border-inline':
                                                    isHover(item) || isClick(item)
                                                        ? `${item?.isMini ? 0.5 : 1.5}px solid ${checkBorderColor(item)}`
                                                        : `${item?.isMini ? 0.5 : 1.5}px solid white`,
                                                'border-block': isHover(item) || isClick(item) ? `${item?.isMini ? 0.5 : 1.5}px solid ${checkBorderColor(item)}` : 'none'
                                            }"
                                        ></div>
                                    </div>
                                </m-popover>
                            </template>
                        </div>
                    </div>
                </template>
                <div class="time-line-mark" :style="{ left: `${computedActiveTime}%` }">
                    <div ref="curTimeElement" class="current">{{ i18n.global.t('meos_control_web.current') }}</div>
                </div>
                <div class="time-line-axis">
                    <div class="time-minutes">
                        <div>00:00</div>
                        <div v-show="!isCurrentTimeIntersect" ref="midTimeElement">12:00</div>
                        <div>24:00</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { Rectangle, RectangleStatus, DiffRectangleType, RectangleType } from './types';
import { getDayjsTz } from '@/utils/globalVariables';

interface RectangleDiffProps {
    modelView: DiffRectangleType;
    demandArr?: Rectangle[];
    diffArr?: Rectangle[][];
    activeTime?: number;
    defaultTemplateType?: string;
}

type ModelDiffData = Omit<RectangleDiffProps, 'demandArr'>;

const props = defineProps<RectangleDiffProps>();

const standardRectangles = ref<Rectangle[]>([]);
const diffRectangles = ref<Rectangle[][]>([]);

const allLegends = [
    i18n.global.t('meos_control_web.auto_demand'),
    i18n.global.t('meos_control_web.no_demand_scene'),
    i18n.global.t('meos_control_web.extend_interven'),
    i18n.global.t('meos_control_web.self_interven')
];
const finalLegends = ref(allLegends);

const showCollapse = ref();
const isCollapse = ref(false);

const activeTimeRef = ref<number>(getDayjsTz().valueOf());
const computedActiveTime = ref();
const curTimeElement = ref(null);
const midTimeElement = ref(null);

const selectedItem = ref<Rectangle>();
const activeTimePool = ref<Rectangle[]>([]);
const emit = defineEmits(['RectangleSelect', 'RectangleActive']);
const curHoverItem = ref<Rectangle>();

const checkBorderColor = (item: Rectangle) => {
    if (item?.isNone) {
        if (item?.type === 'auto') {
            return '#8b949e';
        } else {
            return '#8b949e';
        }
    } else {
        if (item?.type === 'auto') {
            return '#246fe5';
        } else {
            return '#e68600';
        }
    }
};

const isClick = computed(() => (item: Rectangle) => {
    const isSelected = item?.isSelected;
    const isActive = item?.isActive;
    // 其他时间块有选中，优先级高于active
    if (!isSelected && selectedItem?.value?.type) {
        return false;
    }
    // 默认无需求
    if (item?.isAllEmpty && !selectedItem?.value?.type && !activeTimePool.value?.length) {
        return true;
    }
    return isSelected || isActive;
});

const isHover = computed(() => (item: Rectangle) => {
    const isTimeSame = curHoverItem?.value?.timeRangeString === item?.timeRangeString;
    const isNameSame = curHoverItem?.value?.name === item?.name;
    const isTypeSame = item?.isNone && item?.type?.toString() ? curHoverItem?.value?.type === item?.type : true;
    return isTimeSame && isNameSame && isTypeSame;
});

const mouseShow = (item: Rectangle, isShow: boolean) => {
    if (isShow) {
        curHoverItem.value = item;
    } else {
        curHoverItem.value = undefined;
    }
};

const isCurrentTimeIntersect = computed(() => {
    if (curTimeElement.value && midTimeElement.value) {
        const isIntersect = areElementsIntersecting(curTimeElement.value, midTimeElement.value);
        return isIntersect;
    }
    return false;
});

function areElementsIntersecting(element1: any, element2: any) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

function setSelect(rec?: Rectangle) {
    selectedItem.value = rec;
    emit('RectangleSelect', rec);
}
function setActive(data: Rectangle[]) {
    activeTimePool.value = data;
    emit('RectangleActive', data);
}

const dayMillionSeconds = 86400000;
const fiveMinutesMillionSeconds = 300000;
const activePriority: RectangleType[] = ['space', 'floor', 'building', 'project', 'aggregation', 'auto'];
const typeNameMap: Record<RectangleType, string> = {
    space: i18n.global.t('meos_control_web.space_intervention'),
    floor: i18n.global.t('meos_control_web.inherit_floor_intervention'),
    building: i18n.global.t('meos_control_web.inherit_building_intervention'),
    project: i18n.global.t('meos_control_web.inherit_project_intervention'),
    auto: i18n.global.t('meos_control_web.auto_demand'),
    aggregation: ''
};

const toggle = () => {
    isCollapse.value = !isCollapse.value;
};

const onSelect = (rec?: Rectangle) => {
    if (rec?.isNone && rec?.type !== 'auto') {
        return;
    }
    setSelect(rec);
    standardRectangles.value = handleSelected(standardRectangles.value);
    diffRectangles.value = diffRectangles.value.map(item => {
        const res = handleSelected(item);
        return res;
    });
};

const clickRectangleById = (configId?: string) => {
    if (!configId) {
        onSelect();
        return;
    }
    const standardTimeItem = standardRectangles.value.find((item: Rectangle) => {
        const { configId: itemConfigId, isNone, type, timeRangeString } = item || {};
        const unionConfigId = type + '-' + timeRangeString;
        return (isNone && configId === unionConfigId) || itemConfigId === configId;
    });
    let diffTimeItem;
    diffRectangles.value.forEach((diffItems: Rectangle[]) => {
        const diffItem = diffItems.find((v: Rectangle) => {
            const { configId: itemConfigId, isNone, type, timeRangeString } = v || {};
            const unionConfigId = type + '-' + timeRangeString;
            return itemConfigId === configId || (isNone && configId === unionConfigId);
        });
        if (diffItem) {
            diffTimeItem = diffItem;
        }
    });
    if (standardTimeItem) {
        onSelect(standardTimeItem);
    }
    if (diffTimeItem) {
        onSelect(diffTimeItem);
    }
};

watch(
    () => props?.activeTime,
    cur => {
        if (cur) {
            activeTimeRef.value = cur;
        }
    }
);

watch(
    [() => props?.demandArr, () => props?.diffArr, () => props.modelView],
    ([demandArr, diffArr, modelView]) => {
        // 切换入参数据，清空副作用
        setSelect();
        setActive([]);

        const diffItems = canShowDiff({ modelView, diffArr });
        // XXX 按优先级排序->计算 isActive->反转按渲染排序
        const activeFirstDiffItems = diffItems
            ?.sort((a, b) => {
                if (a[0].type === 'aggregation' || b[0].type === 'aggregation') {
                    return -1;
                }
                const aPriority = getPriority(a[0].type);
                const bPriority = getPriority(b[0].type);
                return aPriority - bPriority;
            })
            ?.map(item => {
                const res = timeRangeToDomStyle(item, item?.[0]?.type);
                return res;
            });
        const renderFirstDiffItems = activeFirstDiffItems?.reverse() ?? [];
        if (renderFirstDiffItems?.length > 1) {
            isCollapse.value = true;
        } else {
            isCollapse.value = false;
        }
        diffRectangles.value = renderFirstDiffItems;
        standardRectangles.value = timeRangeToDomStyle(demandArr ?? [], 'auto');

        computeLegends({ modelView, diffArr });
        computeCollapse({ modelView, diffArr });
        computeCurrentTime();
    },
    {
        immediate: true
    }
);

watch(
    isCollapse,
    cur => {
        diffRectangles.value = diffRectangles.value.map(item => {
            const res = item.map(v => {
                return {
                    ...v,
                    isHide: cur ? v?.type !== 'aggregation' : v?.type === 'aggregation'
                };
            });
            return res;
        });
    },
    {
        immediate: true
    }
);

onUnmounted(() => {
    setSelect();
    setActive([]);
});

function getPriority(itemType: RectangleType) {
    return activePriority.findIndex(item => item === itemType);
}

function canShowDiff(config?: ModelDiffData) {
    const { modelView: view, diffArr: diffData } = config || {};
    const res = diffData?.filter(v => {
        const curType = v?.[0]?.type;
        if (curType === 'aggregation') {
            return true;
        }

        const curIndex = view ? getPriority(view) : 0;
        const curScope = activePriority.slice(curIndex);
        return curScope.includes(curType);
    });

    const selfRes = res?.map(v => {
        const isSelf = view && v?.[0]?.type === view;
        const arr = v?.map(item => {
            const { instanceType } = item || {};
            const insType = instanceType as RectangleType;
            const newName = instanceType ? typeNameMap[insType] || '' : '';
            const isCur = insType === view;
            return {
                ...item,
                tempName: item?.type === 'aggregation' ? (isCur ? i18n.global.t('meos_control_web.manual_intervention1') : newName) : item?.name,
                isSelf
            };
        });
        return arr;
    });
    return selfRes;
}

function computeLegends(config: ModelDiffData) {
    const { modelView: view, diffArr: diffData } = config || {};
    const diffItems = canShowDiff({ modelView: view, diffArr: diffData });
    const isSomeSelf = diffItems?.some(item => item?.[0]?.isSelf);
    const isSomeInherit = diffItems?.some(item => !item?.[0]?.isSelf);

    const res = allLegends.filter(s => {
        if (
            [i18n.global.t('meos_control_web.auto_demand'), i18n.global.t('meos_control_web.no_demand_scene')].includes(s) ||
            (s === i18n.global.t('meos_control_web.extend_interven') && isSomeInherit) ||
            (s === i18n.global.t('meos_control_web.self_interven') && isSomeSelf)
        ) {
            return true;
        }
        return false;
    });
    finalLegends.value = res;
}

function computeCollapse(config: ModelDiffData) {
    const { modelView: view, diffArr: diffData } = config || {};
    const diffItems = canShowDiff({ modelView: view, diffArr: diffData });
    const typeCount = diffItems?.reduce((acc: number, item: Rectangle[]) => acc + (item?.length ? 1 : 0), 0);
    showCollapse.value = (typeCount ?? 0) > 1;
}

function computeLeftWidth(startTime: number, endTime: number) {
    const startOfDay = getDayjsTz().startOf('day');
    const diffStart = startTime - startOfDay.valueOf();
    const diff = endTime - startTime;
    const left = (diffStart / dayMillionSeconds) * 100 + '%';
    const width = (diff / dayMillionSeconds) * 100 + '%';
    return { left, width };
}

function computeTimeRangeString(startTime: number, endTime: number) {
    const transformEndTime = dayjs(endTime).format('HH:mm');
    const endString = transformEndTime === '00:00' ? '24:00' : transformEndTime;
    const timeRangeString = dayjs(startTime).format('HH:mm') + '-' + endString;
    return timeRangeString;
}

function computeIsActive(config: RectangleStatus) {
    const { timeRange, startTime, endTime, type, isSelf, isNone, name, configId, instanceType } = config;
    const isActive = startTime < activeTimeRef.value && (endTime > activeTimeRef.value || endTime === activeTimeRef.value);
    if (!isActive || (type !== 'auto' && isNone)) {
        return false;
    } else {
        const tempData = [...activeTimePool.value, { configId, instanceType, timeRange, type, name, isSelf, isNone }];
        const sortData = tempData.sort((a, b) => {
            if (a.type === 'aggregation' || b.type === 'aggregation') {
                return -1;
            }
            const aPriority = getPriority(a.type);
            const bPriority = getPriority(b.type);
            return aPriority - bPriority;
        });
        setActive(sortData);
        if (sortData.length > 1 && sortData[0].type !== type) {
            return false;
        } else {
            return true;
        }
    }
}

function computeTimeToRender(config: RectangleStatus) {
    const { timeRange, startTime, endTime, type, isSelf, isNone } = config;
    const computedStyle = computeLeftWidth(startTime, endTime);
    const timeRangeString = computeTimeRangeString(startTime, endTime);
    const isActive = computeIsActive(config);
    const finalItem = { ...computedStyle, timeRange, timeRangeString, timeScope: `${i18n.global.t('meos_control_web.time')}：${timeRangeString}`, isActive, type, isSelf, isNone };
    return finalItem;
}

function timeRangeToDomStyle(arr: Rectangle[], recType: RectangleType) {
    const startOfDayTime = getDayjsTz().startOf('day').valueOf();
    const startOfNextDayTime = getDayjsTz().add(1, 'day').startOf('day').valueOf();
    const startDayString = dayjs(startOfDayTime).format('YYYY-MM-DD HH:mm:ss');
    const endDayString = dayjs(startOfNextDayTime).format('YYYY-MM-DD HH:mm:ss');
    if (!arr?.length) {
        if (recType === 'auto') {
            const res = [
                {
                    left: '0%',
                    width: '100%',
                    isNone: true,
                    type: 'auto',
                    timeScope: i18n.global.t('meos_control_web.time_00_24'),
                    timeRangeString: '00:00-24:00',
                    timeRange: [startDayString, endDayString],
                    isAllEmpty: true
                }
            ] as Rectangle[];
            return res;
        }
        return [];
    }

    const res = arr.reduce((acc: Rectangle[], cur: Rectangle, index: number) => {
        const { type, timeRange = [], isSelf, name, configId } = cur || {};
        const [start, end] = timeRange || [];
        // 开始时间截断
        const startTime = dayjs(start).valueOf() < startOfDayTime ? startOfDayTime : dayjs(start).valueOf();
        // 结束时间截断
        const endTime = dayjs(end).valueOf() > startOfNextDayTime ? startOfNextDayTime : dayjs(end).valueOf();
        const preEndTimeString = acc?.slice(-1)?.[0]?.timeRange?.[1];
        const preEndTime = preEndTimeString ? dayjs(preEndTimeString).valueOf() : startOfDayTime;

        if (preEndTime && preEndTime < startTime) {
            const computedRender = computeTimeToRender({
                timeRange: [preEndTimeString || startDayString, start],
                startTime: preEndTime,
                endTime: startTime,
                type,
                isSelf,
                name,
                isNone: true
            });
            acc.push({ ...computedRender });
        }

        const computedRender = computeTimeToRender({ timeRange, startTime, endTime, type, isSelf, name, configId });
        // XXX:极小时间段定义为5分钟到30分钟，设置小的边框间隙
        const isMini =
            (endTime - startTime > fiveMinutesMillionSeconds || endTime - startTime === fiveMinutesMillionSeconds) && endTime - startTime < fiveMinutesMillionSeconds * 6;
        acc.push({ ...cur, ...computedRender, isMini });

        if (index === arr.length - 1 && endTime < startOfNextDayTime) {
            const finalComputedRender = computeTimeToRender({
                timeRange: [end, endDayString],
                startTime: endTime,
                endTime: startOfNextDayTime,
                type,
                isSelf,
                name,
                isNone: true
            });
            acc.push({ ...finalComputedRender });
        }
        return acc;
    }, []);
    const newName = typeNameMap[recType] || '';
    return res.map(v => ({ ...v, name: v?.name || newName }));
}

function computeIsSelected(rectangle: Rectangle) {
    const { type, timeRangeString } = rectangle;
    return type === selectedItem?.value?.type && timeRangeString === selectedItem?.value?.timeRangeString;
}

function computeCurrentTime() {
    const activeTime = activeTimeRef.value;
    // 42%-57% 碰撞
    computedActiveTime.value = ((activeTime - getDayjsTz().startOf('day').valueOf()) * 100) / dayMillionSeconds;
}

function handleSelected(data: Rectangle[]) {
    return data.map(v => ({
        ...v,
        isSelected: computeIsSelected(v)
    }));
}

defineExpose({
    clickRectangleById
});
</script>

<style lang="less" scoped>
.rectangles-diff-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}

.rectangles-diff-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .left {
        display: flex;
        align-items: center;
    }

    .rectangles-diff-title {
        color: #2e3742;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        position: relative;
        padding-left: 12px;

        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 3px;
            height: 14px;
            background-color: @blue-500;
        }
    }

    .right-content {
        position: absolute;
        top: -5px;
        right: 0;
    }
}

.rectangles-diff-content {
    width: 100%;
    height: 100%;
}

.legend {
    display: flex;
    align-items: center;
    column-gap: 10px;
    margin-bottom: 8px;

    .legend-item {
        display: flex;
        align-items: center;
        column-gap: 8px;

        .legend-item-color {
            width: 14px;
            height: 14px;
        }

        &:nth-child(1) {
            .legend-item-color {
                background-color: #9fc9fb;
            }
        }

        &:nth-child(2) {
            .legend-item-color {
                background-color: var(--gray-300, #e1e5eb);
                background-image: repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 3px, #fafafa 0px, #fafafa 6px);
                background-size: 100% 100%;
            }
        }

        &:nth-child(3),
        &:nth-child(4) {
            .legend-item-color {
                background-color: #ffe399;
            }
            .legend-item-color.is-self {
                background-color: #ecc00c;
            }
        }

        .legend-item-text {
            color: #626c78;
            font-size: 12px;
            line-height: normal;
        }
    }
}

.rectangles {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    position: relative;
}

.standard-rectangles {
    height: 24px;
    display: flex;
    align-items: center;
    position: relative;

    .standard-rectangle-box {
        height: 100%;
        cursor: pointer;
    }

    .rectangle-item-inner {
        height: 100%;
        width: 100%;

        &:hover {
            box-shadow: 0px 8px 10px 0px rgba(141, 141, 141, 0.1);
        }
    }

    .standard-rectangle-box.is-not-hover {
        &:first-child {
            .rectangle-item-inner {
                border-left: none !important;
            }
        }

        &:last-child {
            .rectangle-item-inner {
                border-right: none !important;
            }
        }
    }

    .has-name {
        background: var(--blue-200, #9fc9fb);
    }

    .has-none {
        background-color: var(--gray-300, #e1e5eb);
        background-image: repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 4px, #ffffff 0px, #ffffff 8px);
        background-size: 100% 100%;
    }
}

.diff-rectangles-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
}

.diff-rectangles {
    height: 16px;
    display: flex;
    align-items: center;
    position: relative;

    .diff-rectangle-box {
        height: 100%;
        cursor: pointer;
    }

    .rectangle-item-inner {
        height: 100%;
        width: 100%;

        &:hover {
            box-shadow: 0px 8px 10px 0px rgba(141, 141, 141, 0.1);
        }
    }

    .diff-rectangle-box.is-not-hover {
        &:first-child {
            .rectangle-item-inner {
                border-left: none !important;
            }
        }

        &:last-child {
            .rectangle-item-inner {
                border-right: none !important;
            }
        }
    }

    .has-name {
        background: #ffe399;
    }

    .has-name.is-self {
        background: var(--yellow-700, #ecc00c);
    }

    .has-none {
        background-color: #eeeeee;
        cursor: default;
    }
}

.time-line-mark {
    position: absolute;
    top: 0;
    width: 1px;
    height: calc(100% - 26px);
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-left: 1px dashed #000;
        width: 0;
    }

    .current {
        position: absolute;
        min-width: 28px;
        bottom: -22px;
        left: -12px;
        padding: 2px 4px;
        border-radius: 2px;
        background: #424c59;

        color: #fff;
        text-align: center;
        font-size: 10px;
        line-height: 12px; /* 120% */

        &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            top: -2px;
            right: calc(50%);
            border-left: 2px solid transparent;
            border-right: 2px solid transparent;
            border-bottom: 2px solid #424c59;
        }
    }
}

.time-line-axis {
    width: 100%;
    border-top: 1px solid var(--gray-200, #e8ecf0);
    padding-top: 4px;
}

.time-minutes {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: var(--gray-600, #626c78);
    text-align: center;
    font-size: 12px;
    line-height: 22px;
}

.custom-rectangle-popover {
    .hover-title {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-bottom: 4px;
    }
}
</style>
