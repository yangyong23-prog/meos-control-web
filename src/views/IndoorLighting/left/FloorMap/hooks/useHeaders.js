// @ts-ignore
import i18n from '@/localization';
import { currentFloorObjInjectKey, showCircuitsAndControlerKey } from '../../../hooks/useBaseHook';
import { filterOptionDataKey, SpaceType } from './useFloorMapHook';
export default emits => {
    const showCircuitsAndControler = inject(showCircuitsAndControlerKey);

    const curCardViewType = ref(showCircuitsAndControler.value ? '2' : '1');
    const showHostControllerSpaceCard = state => {
        showCircuitsAndControler.value = state === '2';
    };

    const currentFloorObj = inject(currentFloorObjInjectKey);
    const filterOptionData = inject(filterOptionDataKey);
    const spacesAndEquipsLoading = ref(false);

    const viewTypeOptions = ref([
        {
            id: '1',
            name: i18n.global.t('meos_control_web.only_show_exception_circuit')
        },
        {
            id: '2',
            name: i18n.global.t('meos_control_web.view_all_modules_and_circuits')
        }
    ]);
    const curBuildingName = computed(() => {
        return `${currentFloorObj?.value?.buildingLocalName || ''}`;
    });
    const curFloorName = computed(() => {
        return `${currentFloorObj?.value?.floorName || currentFloorObj?.value?.localName || ''}`;
    });
    const goBack = () => {
        currentFloorObj.value = null;
    };
    const chooseObj = obj => {
        emits('chooseObj', obj);
    };
    const hoverObj = obj => {
        emits('hoverObj', obj);
    };
    const unhoverObj = () => {
        emits('unhoverObj');
    };

    // 筛选数据
    const searchDataList = computed(() => {
        return filterOptionData.value.filter(({ type }) => type !== SpaceType.position);
    });

    return {
        searchDataList,
        spacesAndEquipsLoading,
        curBuildingName,
        curFloorName,
        viewTypeOptions,
        curCardViewType,
        goBack,
        showHostControllerSpaceCard,
        chooseObj,
        hoverObj,
        unhoverObj
    };
};
