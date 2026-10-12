<template>
    <div class="demand-active-overview">
        <div class="overview-header">
            <div class="title">
                {{ hasSelect && !isSelectedActive ? i18n.global.t('meos_control_web.demand_config_colon') : i18n.global.t('meos_control_web.current_demand_colon') }}
            </div>
            <div
                v-ellipsis
                class="m-ellipsis time-scope"
            >
                {{ currentScope }}
            </div>
        </div>
        <div
            v-if="showOverview"
            class="overview-content"
        >
            <span
                >{{
                    i18n.global.t('meos_control_web.name_has', {
                        name: props?.modelName || '--'
                    })
                }}
            </span>
            <span class="total-highLight">{{ props?.overviewData?.total ?? 0 }}</span>
            <span> {{ i18n.global.t('meos_control_web.space', {}, { plural: props?.overviewData?.total ?? 0 }) }}</span>
            <span v-if="finalSpaces.length">{{ i18n.global.t('meos_control_web.chinese_comma') }}{{ i18n.global.t('meos_control_web.has') }} </span>
            <span
                v-for="(item, index) in finalSpaces"
                :key="index"
            >
                <span class="highLight">{{ item?.num ?? 0 }}</span>
                <span> {{ ` ${i18n.global.t('meos_control_web.space_with_name', { name: item?.name })}` }}</span>
                <span>{{ index === (finalSpaces?.length ?? 0) - 1 ? i18n.global.t('meos_control_web.chinese_dot') : i18n.global.t('meos_control_web.chinese_comma') }}</span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { DiffRectangleType, Rectangle } from './types';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsSame, dayjsIsBefore } from '@/utils/dayjsTools';

interface OverViewProps {
    modelName?: string;
    modelView?: DiffRectangleType;
    selectedItem?: Rectangle;
    activeTimePool?: Rectangle[];
    overviewData?: {
        total?: number;
        matchingCount?: number; //与当前对象的当前需求一致的空间数量
        autoCount?: number; // 与当前对象的当前需求不一致，且当前按自动需求运行的空间数量
        interventionCount?: number; // 与当前对象的当前需求不一致，且当前按人工干预需求运行的空间数量
    };
}

interface SpaceTreeData {
    type?: string;
    num?: number;
    name?: string;
}

const props = defineProps<OverViewProps>();

const hasSelect = ref(false);
const currentScope = ref('');

const finalSpaces = ref<SpaceTreeData[]>([]);

const hasSpaces = computed(() => {
    return props?.modelView && props?.modelView !== 'space';
});

const showOverview = computed(() => {
    const show = !hasSelect.value && hasSpaces.value && !currentScope.value.includes(i18n.global.t('meos_control_web.no_demand1')) && (props?.overviewData?.total ?? 0) > 0;
    return show;
});

const activeTimeItem = computed(() => {
    const res = props?.activeTimePool?.[0];
    if (res?.isNone) return;
    return res;
});

const selectedItem = computed(() => {
    const res = props?.selectedItem;
    if (res?.isNone) return;
    return res;
});

const isSelectedActive = computed(() => {
    const curActiveItem = activeTimeItem.value;
    const curSelectItem = selectedItem.value;
    return curActiveItem?.type && curActiveItem?.configId === curSelectItem?.configId;
});

const countMap = computed(() => {
    const curActiveItem = activeTimeItem.value;
    const isAutoDemand = curActiveItem?.type === 'auto';

    const modelViewNameMap: Record<string, string> = {
        // space: '空间', //空间本身不展示统计
        floor: i18n.global.t('meos_control_web.floor'),
        building: i18n.global.t('meos_control_web.building')
    };
    const modelViewName = modelViewNameMap[props?.modelView || ''] || i18n.global.t('meos_control_web.project');

    const temMap: Record<string, string> = {
        matchingCount: isAutoDemand
            ? i18n.global.t('meos_control_web.accord_demand_run', {
                  modelViewName: modelViewName
              })
            : i18n.global.t('meos_control_web.accord_interval_run', {
                  modelViewName: modelViewName
              }),
        autoCount: `${i18n.global.t('meos_control_web.by_special_requirement_auto_running')}`,
        interventionCount: i18n.global.t('meos_control_web.by_manual_intervention_running')
    };
    return temMap;
});

watch([() => props?.overviewData], ([cur]) => {
    let temItems: SpaceTreeData[] = [];
    Object.entries(cur || {}).forEach(([key, val]) => {
        const num = parseInt((val ?? '0')?.toString());
        if (key !== 'total' && num > 0) {
            temItems.push({
                type: key,
                num,
                name: countMap.value[key]
            });
        }
    });
    finalSpaces.value = temItems;
});

watch(
    [() => props?.selectedItem, () => props?.activeTimePool],
    ([curSelect, curActive]) => {
        hasSelect.value = !!curSelect;
        const { timeRange, isNone, isSelf, name, type } = curSelect ?? (curActive?.[0] || {});
        const startOfDayTime = getDayjsTz().startOf('day');
        if (timeRange) {
            const [start, end] = timeRange || [];
            const finalName =
                type === 'auto'
                    ? `${isNone ? i18n.global.t('meos_control_web.demand_scene_not_yet_set') : name || '--'}`
                    : `${
                          isNone
                              ? i18n.global.t('meos_control_web.no_intervention')
                              : isSelf
                              ? i18n.global.t('meos_control_web.manual_intervention1')
                              : name || i18n.global.t('meos_control_web.manual_intervention1')
                      }`;
            // 开始时间截断
            const startTimeStamp = dayjs(start);
            const startTime = dayjsIsBefore(startTimeStamp, startOfDayTime) ? startOfDayTime : startTimeStamp;

            // 结束时间截断
            const transformEndTime = dayjs(end).format('HH:mm');
            const isSameDay = start && end ? dayjsIsSame(dayjs(start), dayjs(end), 'day') : false;
            const isEndSameDay = dayjsIsSame(getDayjsTz(), dayjs(end), 'day');
            const finalEndTime = isSameDay || isEndSameDay ? transformEndTime : '24:00';

            currentScope.value = `${finalName}(${startTime.format('HH:mm')} - ${transformEndTime === '00:00' ? '24:00' : finalEndTime})`;
        } else {
            currentScope.value = `${i18n.global.t('meos_control_web.no_demand1')}(00:00 - 24:00)`;
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.demand-active-overview {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
}

.overview-header {
    display: flex;
    align-items: center;

    color: #2e3742;
    font-size: 14px;

    .title {
        flex-shrink: 0;
        font-weight: 700;
        line-height: 22px;
    }

    .time-scope {
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}
.overview-content {
    width: 100%;
    padding: 4px 8px;
    background: #fffbe6;

    color: var(--orange-700, #e68600);
    font-size: 12px;
    line-height: 18px;

    .total-highLight {
        font-size: 12px;
        font-weight: 700;
    }

    .highLight {
        // color: @blue-500;
        font-size: 12px;
        font-weight: 700;
    }
}
</style>
