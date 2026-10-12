import i18n from '@/localization';
import { getDebugToolTemplateTypes, getDebugToolObjectDetail } from '@/apis/debugToolIot';

export const systemsOptionsInjectKey = Symbol('systemsOptionsInjectKey');
export const currentSystemInjectKey = Symbol('currentSystemInjectKey');
export const instanceTypesOptionsInjectKey = Symbol('instanceTypesOptionsInjectKey');
export const currentInstanceTypeInjectKey = Symbol('currentInstanceTypeInjectKey');

export const staticInstanceListInjectKey = Symbol('staticInstanceListInjectKey');
export const instancesListInjectKey = Symbol('instancesListInjectKey');
export const currentInstanceInjectKey = Symbol('currentInstanceInjectKey');
export const currentTemplateIdsInjectKey = Symbol('currentTemplateIdsInjectKey');

export const leftSidebarWidthInjectKey = Symbol('leftSidebarWidthInjectKey');
export const searchKeywordsInjectKey = Symbol('searchKeywordsInjectKey');
export const isLeftListLoadingInjectKey = Symbol('isLeftListLoadingInjectKey');

export default () => {
    const isSystemsLoading = ref(false);
    const staticSystemsList = ref([]);
    const systemsOptions = ref([]);
    const currentSystem = ref();
    const instanceTypesOptions = ref([]);
    const currentInstanceType = ref();

    const isInstanceListLoading = ref(false);
    const instancesList = ref([]);
    const staticInstanceList = ref([]);
    const currentInstance = ref();

    const leftSidebarWidth = ref(320);
    const leftSidebarShow = ref(true);
    const isMountedLoading = ref(false);

    const searchKeywords = ref('');

    const fetchAbortController = ref();

    const isLeftListLoading = computed(() => {
        return isSystemsLoading.value || isInstanceListLoading.value;
    });

    const instanceTypesOptionsFlatten = computed(() => {
        return instanceTypesOptions?.value?.flatMap(item => item.children);
    });

    const currentTemplateIds = computed(() => {
        if (currentInstanceType?.value) {
            const templateIds = instanceTypesOptionsFlatten.value?.find(v => v?.id === currentInstanceType?.value)?.relTemplateIds;
            return templateIds;
        }
        return [];
    });

    const handleSystemsChange = arr => {
        // 切换系统，清空对象类型选项，重新获取对象类型选项
        instanceTypesOptions.value = [];
        currentInstanceType.value = '';

        const templateTypesArr = arr?.find(v => v?.runningMonitorType === currentSystem.value)?.classCodes || [];
        const groupByArr = templateTypesArr?.reduce((acc, cur) => {
            const key = cur.objectType;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(cur);
            return acc;
        }, {});
        instanceTypesOptions.value = Object.keys(groupByArr).map(key => {
            const { objectTypeName } = groupByArr[key]?.[0] || {};
            return {
                id: key,
                name: objectTypeName,
                children: groupByArr[key]?.map(child => {
                    const { classCode: id, classCodeName, relTemplateIds } = child;
                    return { id, name: `${classCodeName} (${id})`, relTemplateIds };
                })
            };
        });
        currentInstanceType.value = instanceTypesOptions?.value?.[0]?.children?.[0]?.id;
    };

    const getSystemsAndInstanceTypes = async () => {
        isSystemsLoading.value = true;
        const res = await getDebugToolTemplateTypes().finally(() => {
            isSystemsLoading.value = false;
        });
        if (res?.code === '00000') {
            const resData = res?.data;
            if (Array.isArray(resData)) {
                staticSystemsList.value = resData;

                const systemArr = resData?.map(v => ({ id: v.runningMonitorType, name: v.runningMonitorTypeName }));
                systemsOptions.value = systemArr;
                currentSystem.value = systemArr?.[0]?.id;
            }
        }
        return res;
    };

    const getInstanceList = async () => {
        const classCode = currentInstanceType.value;
        if (!classCode) {
            return;
        }

        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();
        const { signal } = fetchAbortController.value;

        isInstanceListLoading.value = true;
        const res = await getDebugToolObjectDetail(
            {
                classCode
            },
            signal
        ).finally(() => {
            isInstanceListLoading.value = false;
        });
        if (res?.code === '00000') {
            const resData = res?.data;
            if (Array.isArray(resData)) {
                const arrData = resData.map((v, index) => {
                    const { id, localName: name } = v;
                    return { id, name: name ?? '--', index };
                });
                staticInstanceList.value = arrData;
                instancesList.value = arrData;
                currentInstance.value = arrData?.[0];
            }
        }
        return res;
    };

    onMounted(async () => {
        try {
            isMountedLoading.value = true;
            await getSystemsAndInstanceTypes();
        } catch (error) {
            console.error(error);
        } finally {
            isMountedLoading.value = false;
        }
    });

    watch(currentSystem, () => {
        handleSystemsChange(staticSystemsList.value);
    });

    watch(currentInstanceType, async cur => {
        // 切换对象类型选项，清空实例列表选项、清空搜索值，重新请求对象实例列表
        staticInstanceList.value = [];
        instancesList.value = [];
        currentInstance.value = undefined;
        searchKeywords.value = '';
        if (cur) {
            await getInstanceList();
        }
    });

    watch(searchKeywords, curKeywords => {
        // 搜索关键字改变，过滤实例列表
        if (curKeywords) {
            instancesList.value = staticInstanceList.value.filter(item => item.name.includes(curKeywords));
        } else {
            instancesList.value = staticInstanceList.value;
        }
    });

    provide(systemsOptionsInjectKey, systemsOptions);
    provide(currentSystemInjectKey, currentSystem);
    provide(instanceTypesOptionsInjectKey, instanceTypesOptions);
    provide(currentInstanceTypeInjectKey, currentInstanceType);
    provide(instancesListInjectKey, instancesList);
    provide(currentInstanceInjectKey, currentInstance);
    provide(currentTemplateIdsInjectKey, currentTemplateIds);
    provide(leftSidebarWidthInjectKey, leftSidebarWidth);
    provide(searchKeywordsInjectKey, searchKeywords);
    provide(isLeftListLoadingInjectKey, isLeftListLoading);
    provide(staticInstanceListInjectKey, staticInstanceList);

    onUnmounted(() => {
        staticSystemsList.value = null;
        systemsOptions.value = null;
        currentSystem.value = null;
        instanceTypesOptions.value = null;
        currentInstanceType.value = null;
        staticInstanceList.value = null;
        instancesList.value = null;
        currentInstance.value = null;
        currentTemplateIds.value = null;
        fetchAbortController.value = null;
    });

    return {
        isMountedLoading,
        isLeftListLoading,
        systemsOptions,
        currentSystem,
        instanceTypesOptions,
        currentInstanceType,
        instancesList,
        currentInstance,
        leftSidebarWidth,
        leftSidebarShow
    };
};
