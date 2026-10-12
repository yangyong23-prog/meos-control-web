import i18n from '@/localization';
import { listTemplateType } from '@/apis/DemandManagementHome';
import { templateTypeToMenuIconMap } from '../constant/config';
import useLoading from '@/hooks/useLoading';
import { templateIdInjectKey, templateTagInjectKey, isBeforeTodayDateConfigKey, isHideActionKey, pastDateStringKey } from '../constant/injectKey';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter } from '@/utils/dayjsTools';

export default ({ templateDemandType }) => {
    const { openLoading, closeLoading } = useLoading('demand-management-container', '#fff', 'ball');

    const router = useRouter();
    const route = useRoute();

    const templateTabsElementRef = ref(null);
    const templateTabsData = ref([]);

    const activeId = ref('');

    const templateType = ref('');

    // 是否为今日的过去的日期配置
    const isBeforeToday = ref(false);
    // 是否隐藏操作配置按钮（空调、通风的历史日期配置均为只读，不支持二次编辑）
    const isHideAction = computed(() => {
        const supportedTypes = ['AIRCONDITIONING', 'LOGISTICS_VENTILATION', 'PARKING_VENTILATION', 'TOILET_VENTILATION', 'DOME_VENTILATION'];
        return supportedTypes.includes(templateType.value) && isBeforeToday.value;
    });
    // 日期配置值（空调、通风均支持历史日期配置查询，如需求日历跳转携带 date）
    const pastDateString = computed(() => {
        const supportedTypes = ['AIRCONDITIONING', 'LOGISTICS_VENTILATION', 'PARKING_VENTILATION', 'TOILET_VENTILATION', 'DOME_VENTILATION'];
        const isPast = isBeforeToday.value;
        if (supportedTypes.includes(templateType.value) && isPast) {
            return route.query.date;
        }
        return '';
    });

    const menusData = ref([]);
    const templateTypeName = ref('');
    const isLoading = ref(true);

    const templateId = computed(() => {
        const res = templateTabsData?.value?.find(v => v?.id === activeId?.value)?.templateId;
        return res;
    });

    // 获取菜单模板
    const getMenuTemplate = demandType => {
        openLoading();
        menusData.value = [];
        listTemplateType({
            demandType
        })
            .then(res => {
                const { data, result } = res;
                if (result === 'success') {
                    if (data.length === 0) {
                        isLoading.value = false;
                    }
                    menusData.value =
                        data[0]?.templateTypes &&
                        data[0]?.templateTypes.length &&
                        data[0].templateTypes.map(item => {
                            return {
                                id: item.key,
                                name: demandType === 'VENTILATION' ? item?.value?.replace(i18n.global.t('common.meos_home_ventilation'), '') : item.value,
                                icon: templateTypeToMenuIconMap[item.key]
                            };
                        });
                    templateType.value = route.query.templateType || menusData.value[0]?.id;
                    templateTypeName.value = menusData.value?.find(v => v?.id === templateType.value)?.name;
                    router.push({
                        query: {
                            ...(router.currentRoute.value.query || {}),
                            templateType: templateType.value
                        }
                    });
                }
            })
            .finally(() => {
                closeLoading();
            });
    };

    watch(
        () => route.query.date,
        curDate => {
            //是否是历史时间
            if (curDate) {
                let configDate = dayjs(curDate).format('YYYY-MM-DD');
                isBeforeToday.value = dayjsIsAfter(getDayjsTz(), configDate, 'day');
            }
        },
        {
            immediate: true
        }
    );

    watch(
        () => route.query.templateType,
        (newVal, preVal) => {
            templateType.value = newVal || '';
            // 切换模板类型，清空模板tag
            if (preVal && newVal !== preVal) {
                activeId.value = '';
                router.push({
                    query: {
                        ...(router.currentRoute.value.query || {}),
                        templateTag: undefined
                    }
                });
            }
        },
        {
            immediate: true
        }
    );

    watchEffect(() => {
        templateDemandType?.value && getMenuTemplate(templateDemandType.value);
    });

    watchEffect(() => {
        const curTabs = templateTabsElementRef?.value?.templateTabs;
        if (curTabs?.length) {
            templateTabsData.value = curTabs;
        }
    });

    provide(isBeforeTodayDateConfigKey, isBeforeToday);
    provide(isHideActionKey, isHideAction);
    provide(pastDateStringKey, pastDateString);

    provide('templateType', templateType);
    provide('templateTypeName', templateTypeName);

    provide(templateIdInjectKey, templateId);
    provide(templateTagInjectKey, activeId);

    onUnmounted(() => {
        templateTabsElementRef.value = null;
    });

    return {
        isLoading,
        activeId,
        menusData,
        templateType,
        templateTypeName,
        templateTabsElementRef,
        pastDateString,
        templateTabsData,
        templateId
    };
};
