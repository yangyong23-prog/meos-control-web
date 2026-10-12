import i18n from '@/localization';
import dayjs from 'dayjs';
import { ALL_TAGS, TAGS_ID_ENUM } from './config';
import { currentTimeKey } from './useAbnormalGroup';
export const useAbnormalCard = props => {
    const currentTime = inject(currentTimeKey);
    const renderTags = ref([]);

    watch(
        () => props?.card?.importanceDegree,
        cur => {
            const tags = [];
            if (cur) {
                const firstStatus = ALL_TAGS.find(s => {
                    const filterArr = s?.importanceDegree ?? [];
                    return filterArr.includes(cur);
                });
                if (firstStatus) {
                    tags.push(firstStatus);
                }
            }

            renderTags.value = tags;
        },
        {
            immediate: true
        }
    );

    watch(
        [() => currentTime?.value, () => props?.card?.maxRequireSolveTime, () => props?.card?.minRequireSolveTime],
        ([curTime, curMaxTime, curMinTime], [, preMaxTime, preMinTime]) => {
            // 逾期计算
            const hasDeadline = curMaxTime || curMinTime || preMaxTime || preMinTime;
            const hasOverdue = renderTags.value.some(r => r?.id === TAGS_ID_ENUM.OVERDUE);
            if (curTime && hasDeadline && !hasOverdue) {
                const endTime = dayjs(curTime);
                const maxTime = curMaxTime || preMaxTime;
                const minTime = curMinTime || preMinTime;
                if (maxTime) {
                    const maxDeadline = dayjs(maxTime);
                    if (maxDeadline < endTime) {
                        const overdueStatus = ALL_TAGS.find(s => s.id === TAGS_ID_ENUM.OVERDUE);
                        renderTags.value.push(overdueStatus);
                    }
                } else if (minTime) {
                    const minDeadline = dayjs(minTime);
                    if (minDeadline < endTime) {
                        const overdueStatus = ALL_TAGS.find(s => s.id === TAGS_ID_ENUM.OVERDUE);
                        renderTags.value.push(overdueStatus);
                    }
                }
            }
        },
        {
            immediate: true
        }
    );

    const isHover = ref(false);
    // 当时标签hover生效的状态
    const hoverActive = ref({});
    // 当前异常的实例
    const showHoverMultiple = computed(() => isHover.value && Array.isArray(props?.card?.originalProblem) && (props?.card?.originalProblem?.length ?? 0) > 1);
    const renderName = computed(() => {
        if (showHoverMultiple.value) {
            return '';
        }
        // 之前取值：props?.card?.instancesName
        return props?.card?.originalProblem?.instanceName;
    });
    return { renderTags, isHover, hoverActive, renderName, showHoverMultiple };
};
