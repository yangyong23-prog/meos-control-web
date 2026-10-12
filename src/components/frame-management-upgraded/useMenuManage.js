// @ts-ignore
import i18n from '@/localization';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';
import { listTemplateType } from '@/apis/DemandManagementHome';
import { useRouter, useRoute } from 'vue-router';

export default (props, menusList, curMenuId) => {
    const router = useRouter();
    const route = useRoute();

    const {
        startRequest,
        startLoading: startMenuLoading,
        endLoading: endMenuLoading,
        isLoading: isMenuLoading,
        loadedData
    } = useFetchAbortController({
        request: listTemplateType,
        params: {},
        initData: []
    });

    watch(
        () => props.demandType,
        curType => {
            if (curType) {
                startRequest({ demandType: curType });
            }
        },
        {
            immediate: true
        }
    );

    const handleMenuData = data => {
        if (!data?.[0]?.templateTypes?.length) {
            return;
        }
        const tempList = data?.[0]?.templateTypes || [];
        const showList = tempList.map(item => {
            return {
                id: item.key,
                name: props.handleMenuName ? props.handleMenuName(item.value) : item.value,
                icon: props.menuIconMap[item.key]
            };
        });

        let templateType = showList[0]?.id;
        // 取路由query中模板type，没有则默认选中菜单模板列表第一个
        if (route.query?.templateType && showList.some(v => v?.id?.toString() === route.query?.templateType)) {
            templateType = route.query?.templateType;
        }
        menusList.value = showList;
        curMenuId.value = templateType;

        nextTick(() => {
            router.push({
                query: {
                    ...(router.currentRoute.value.query || {}),
                    templateType
                }
            });
        });
    };

    watch(
        () => loadedData.value,
        cur => {
            handleMenuData(cur);
        }
    );

    return { isMenuLoading, startMenuLoading, endMenuLoading, menusList };
};
