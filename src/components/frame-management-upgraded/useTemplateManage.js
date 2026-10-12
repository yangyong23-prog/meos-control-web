// @ts-ignore
import i18n from '@/localization';
import { getListDateSetting } from '@/apis/public';
import { useRouter, useRoute } from 'vue-router';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';

export default (props, curMenuId, curTemplateTag, curTemplateId) => {
    const router = useRouter();
    const route = useRoute();

    const templateTabs = ref([]); // 顶部模板列表

    const showTemplateManage = ref(false); // 模板弹窗组件
    const isHideTemplateManage = ref(false);

    const onMenusChange = item => {
        router.push({
            query: {
                ...(router.currentRoute.value.query || {}),
                templateType: item.id,
                templateTag: undefined
            }
        });
    };
    const onTabChange = val => {
        curTemplateId.value = val?.templateId;
        router.push({
            query: {
                ...(router.currentRoute.value.query || {}),
                templateTag: val.id
            }
        });
    };

    const {
        startRequest,
        isLoading: isTemplateLoading,
        loadedData,
        startLoading: startTemplateLoading,
        endLoading: endTemplateLoading,
        isLoaded: isTemplateLoaded
    } = useFetchAbortController({
        request: getListDateSetting,
        params: {},
        initData: []
    });

    const handleTemplateData = async data => {
        try {
            const filterData = data?.filter(item => item.isEnabled);
            const showList = filterData
                .map(item => ({
                    id: item.templateTag,
                    name: item.templateName,
                    templateId: item.templateId,
                    templateTag: item.templateTag
                }))
                ?.filter(item => {
                    const isShow = props?.handleTemplateDataFilter ? props?.handleTemplateDataFilter(item) : true;
                    return isShow;
                });

            templateTabs.value = showList;
            let templateTag = showList[0]?.id;
            // 取路由query中模板tag，没有则默认选中模板列表第一个
            if (route.query?.templateTag && templateTabs.value.some(v => v?.id?.toString() === route.query?.templateTag)) {
                templateTag = route.query?.templateTag;
            }
            curTemplateTag.value = templateTag;
            curTemplateId.value = showList.find(t => t?.templateTag === templateTag)?.templateId;

            nextTick(() => {
                router.push({
                    query: {
                        ...(router.currentRoute.value.query || {}),
                        templateTag
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    watch(
        () => curMenuId.value,
        newVal => {
            // 切换左侧菜单模板类型，取消顶部模板tag列表请求
            if (newVal) {
                startRequest({ templateType: newVal });
            }
        }
    );

    watch(
        () => loadedData.value,
        cur => {
            if (Array.isArray(cur) && cur.length) {
                handleTemplateData(cur);
            }
        }
    );

    const openTemplateManage = () => {
        showTemplateManage.value = true;
    };
    const closeTemplateManage = status => {
        if (status) {
            startRequest({ templateType: curMenuId.value });
        }
        showTemplateManage.value = false;
    };

    return {
        isTemplateLoading,
        isTemplateLoaded,
        startTemplateLoading,
        endTemplateLoading,
        templateTabs,
        onMenusChange,
        onTabChange,
        showTemplateManage,
        openTemplateManage,
        closeTemplateManage,
        isHideTemplateManage
    };
};
