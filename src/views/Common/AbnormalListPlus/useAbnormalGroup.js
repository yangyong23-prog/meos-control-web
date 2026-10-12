import i18n from '@/localization';
import { SORT_OPTION_ENUM, GROUP_ENUM, getCardTagOrder } from './config';

export const currentTimeKey = Symbol('currentTimeKey');
export const useDataTransform = (props, selectedSort) => {
    const currentTime = ref(Date.now());

    const _timer = setInterval(() => {
        currentTime.value = Date.now();
    }, 5 * 60 * 1000);

    onBeforeUnmount(() => {
        clearInterval(_timer);
    });

    const sortCards = (cards, sortByLevel) => {
        return cards?.toSorted((a, b) => {
            const aLevel = getCardTagOrder(a);
            const bLevel = getCardTagOrder(b);
            const aTime = a.exceptionStartTime ? +a.exceptionStartTime : 0;
            const bTime = b.exceptionStartTime ? +b.exceptionStartTime : 0;

            if (sortByLevel && aLevel !== bLevel) {
                return aLevel - bLevel;
            }

            return bTime - aTime;
        });
    };

    const groupData = computed(() => {
        const groupByArr = Object.groupBy(props.abnormalEventList, item => {
            if (item?.solveProcess === GROUP_ENUM.FIND_EXCEPTION) {
                return 'NoResponse';
            }
            if (item?.solveProcess === GROUP_ENUM.SOLVING) {
                return 'InProgress';
            }
            return 'Solved';
        });
        const isSortByLevel = selectedSort.value === SORT_OPTION_ENUM.BY_LEVEL;
        const sortedOne = sortCards(groupByArr.NoResponse || [], isSortByLevel);
        const sortedTwo = sortCards(groupByArr.InProgress || [], isSortByLevel);
        return [
            {
                id: 'NoResponse',
                name: i18n.global.t('meos_control_web.no_response'),
                cards: sortedOne
            },
            {
                id: 'InProgress',
                name: i18n.global.t('meos_control_web.troubleshooting_in_progress'),
                cards: sortedTwo
            }
        ];
    });

    provide(currentTimeKey, currentTime);

    return { groupData };
};
