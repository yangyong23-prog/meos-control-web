// @ts-ignore
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import dayjs from 'dayjs';
export default () => {
    const manualAutoSetAll = ref([]); // 批量选中的manualAutoSet
    const autoSet = ref([]); // 批量选中的自动状态数组
    const checkedChange = ({ selecteds }) => {
        manualAutoSetAll.value =
            selecteds?.length &&
            selecteds
                ?.map(item => {
                    return item?.manualAutoSet.model;
                })
                .filter(item => item);
        autoSet.value = manualAutoSetAll?.value?.length && manualAutoSetAll?.value?.filter(item => item === '1');
    };
    //可选择日期
    const scopeTime = computed(() => {
        let bTime = getDayjsTz().add(1, 'minute').format('YYYY.MM.DD HH:mm:ss');
        return bTime + '-3000.01.01';
    });
    provide('manualAutoSetAll', manualAutoSetAll);
    provide('autoSet', autoSet);
    provide('scopeTime', scopeTime);
    return {
        checkedChange,
        manualAutoSetAll
    };
};
