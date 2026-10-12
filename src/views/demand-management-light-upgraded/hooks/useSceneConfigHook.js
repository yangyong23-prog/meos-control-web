// @ts-ignore
import i18n from '@/localization';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';
import { listSceneConfig, listExistsSceneConfigTemplate } from '@/apis/lightingRequirements';
import { showSceneTimePreviewKey, isSceneConfigLoadingKey, isSceneConfigLoadedKey, scenePeriodListKey, curSelectedPeriodIdKey } from './useGlobalData';

export const refreshSceneConfigKey = Symbol('refreshSceneConfigKey');

const useExistSceneConfigData = () => {
    const dropDownTemplateList = ref([]); //配置模板列表
    const dropDownCurId = ref(''); // 已选配置模板

    const {
        startRequest: queryExistSceneConfig,
        loadedData,
        isLoading: isExistSceneConfigLoading
    } = useFetchAbortController({
        request: listExistsSceneConfigTemplate,
        params: {},
        initData: []
    });
    watch(
        () => loadedData.value,
        cur => {
            if (Array.isArray(cur) && cur.length) {
                dropDownTemplateList.value = cur.map(item => {
                    return {
                        label: item.templateName,
                        key: item.templateId
                    };
                });
                // dropDownCurId.value = cur[0].templateId;
            }
        }
    );
    return {
        dropDownTemplateList,
        dropDownCurId,
        queryExistSceneConfig,
        isExistSceneConfigLoading
    };
};

export const useSceneConfigData = (menuId, templateId, templateTag) => {
    const showSceneTimePreview = inject(showSceneTimePreviewKey);

    // 获取当前模板id对应的场景配置时段列表
    const {
        startRequest: querySceneConfig,
        startLoading,
        endLoading,
        isLoading,
        isLoaded,
        loadedData,
        cancelLastRequest,
        resetData
    } = useFetchAbortController({
        request: listSceneConfig,
        params: {},
        initData: []
    });

    const { dropDownTemplateList, dropDownCurId, queryExistSceneConfig, isExistSceneConfigLoading } = useExistSceneConfigData();

    // 当前选择的时段ID
    const isSceneConfigLoading = inject(isSceneConfigLoadingKey);
    const isSceneConfigLoaded = inject(isSceneConfigLoadedKey);
    const scenePeriodList = inject(scenePeriodListKey);
    const curSelectedPeriodId = inject(curSelectedPeriodIdKey);

    watch(
        () => menuId.value,
        cur => {
            // 切换左侧菜单，取消场景配置请求，重置场景选中数据
            if (cur) {
                cancelLastRequest();
                resetData();
                curSelectedPeriodId.value = '';
            }
        }
    );

    watch(
        () => templateId.value,
        cur => {
            // 切换顶部模板tag/id，取消场景配置请求, 重置场景选中数据
            if (cur) {
                curSelectedPeriodId.value = '';
                querySceneConfig({ templateId: cur });
            }
        },
        {
            immediate: true
        }
    );

    watchEffect(() => {
        isSceneConfigLoading.value = isLoading.value;
    });

    watchEffect(() => {
        isSceneConfigLoaded.value = isLoaded.value;
    });

    watchEffect(() => {
        scenePeriodList.value = loadedData.value;
    });

    watch(
        () => loadedData.value,
        cur => {
            if (isLoaded.value) {
                if (cur.length === 0) {
                    showSceneTimePreview.value = false;
                    queryExistSceneConfig({ templateId: templateId.value, templateType: menuId.value, templateTag: templateTag.value });
                } else {
                    showSceneTimePreview.value = true;
                }
                if (cur?.length) {
                    curSelectedPeriodId.value = cur?.[0]?.id;
                }

                // TODO 复制场景后需更新配置详情，调用相关接口
                // nextTick(() => {
                //     publicAreaVisible.value && publicArea.value?.queryListSceneConfig(type, data || []);
                //     !publicAreaVisible.value && otherArea.value?.queryListSceneConfig(type, data || []);
                // });
            }
        }
    );

    const refreshSceneConfig = () => {
        showSceneTimePreview.value = true;
        querySceneConfig({ templateId: templateId.value });
    };

    provide(refreshSceneConfigKey, refreshSceneConfig);

    return {
        isLoading,
        startLoading,
        endLoading,
        isLoaded,
        isExistSceneConfigLoading,

        dropDownTemplateList,
        dropDownCurId,
        querySceneConfig,
        refreshSceneConfig
    };
};
