import i18n from '@/localization';
import { selectModuleInfoInjectKey, clickAssembleFucKey, statisticsDataKey } from './useCommonConfig';
export default () => {
    const proxyList = ref([]);
    const systemItemColumn = inject('systemItemColumn');
    const selectModuleInfo = inject(selectModuleInfoInjectKey);
    const clickAssembleFuc = inject(clickAssembleFucKey);
    const statisticsData = inject(statisticsDataKey);
    const formatNumber = value => {
        return value?.toLocaleString();
    };
    const openSidebar = (item, name, type, systemType) => {
        selectModuleInfo.value = {
            localName: item.dynamicName,
            name: name,
            dataList: clickAssembleFuc('systemId', item.id, type, systemType),
            classCode: item.classCode,
            type: type,
            systemType: systemType
        };
    };

    // 判断是否有异常事件
    const itemHasAbnormalEvents = item => !!item?.abnormalCounts;

    // 判断是否有报警信号
    const itemHasAlarm = item => !!item?.alarmCounts;

    // 判断是否有故障信号
    const itemHasFault = item => !!item?.faultCounts;

    // 判断当前项是否被选中
    const isItemSelected = computed(() => {
        return (item, type, systemType) =>
            item.classCode === selectModuleInfo.value?.classCode && selectModuleInfo.value?.type === type && selectModuleInfo.value?.systemType === systemType;
    });

    return { proxyList, statisticsData, systemItemColumn, itemHasAbnormalEvents, itemHasAlarm, itemHasFault, isItemSelected, openSidebar, formatNumber };
};
