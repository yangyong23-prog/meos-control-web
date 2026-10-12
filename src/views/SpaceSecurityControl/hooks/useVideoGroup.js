// @ts-ignore
import i18n from '@/localization';
import { querySpaceFuncTypeMap } from '@/apis/SpaceSecurityControl';
import { SUCCESSCODE } from '@/utils/globalVariables';

export const enterVideoGroupKey = Symbol('enterVideoGroupKey');
export const showVideoGroupMapKey = Symbol('showVideoGroupMapKey');
export const exitVideoGroupKey = Symbol('exitVideoGroupKey');

// 视频组下的header筛选：设备类型、空间功能类型
export const selectedCameraTypesKey = Symbol('selectedCameraTypesKey');
export const allSpaceFuncTypesKey = Symbol('allSpaceFuncTypesKey');
export const selectedSpaceFuncTypesKey = Symbol('selectedSpaceFuncTypesKey');

export const useVideoGroup = () => {
    const showVideoGroupMap = ref(false);

    const selectedCameraTypes = ref([]);

    const allSpaceFuncTypes = ref([]);
    const selectedFuncTypes = ref([]);

    const enterVideoGroup = () => {
        showVideoGroupMap.value = true;
    };

    const exitVideoGroup = () => {
        showVideoGroupMap.value = false;
    };

    const getAllSpaceTypes = async () => {
        try {
            allSpaceFuncTypes.value = [];
            const res = await querySpaceFuncTypeMap();
            if (res?.code === SUCCESSCODE && Array.isArray(res?.data?.[0]?.dataSource)) {
                allSpaceFuncTypes.value = res?.data?.[0]?.dataSource;
            }
        } catch (error) {
            allSpaceFuncTypes.value = [];
        }
    };

    onMounted(() => {
        getAllSpaceTypes();
    });

    watch(showVideoGroupMap, cur => {
        if (!cur) {
            selectedCameraTypes.value = [];
            selectedFuncTypes.value = [];
        }
    });

    provide(enterVideoGroupKey, enterVideoGroup);
    provide(exitVideoGroupKey, exitVideoGroup);
    provide(showVideoGroupMapKey, showVideoGroupMap);

    provide(selectedCameraTypesKey, selectedCameraTypes);
    provide(allSpaceFuncTypesKey, allSpaceFuncTypes);
    provide(selectedSpaceFuncTypesKey, selectedFuncTypes);

    return {
        showVideoGroupMap
    };
};
