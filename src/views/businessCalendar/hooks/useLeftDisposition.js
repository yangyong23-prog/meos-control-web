// @ts-ignore
import i18n from '@/localization';
import { getGlobalRule, treeBuildingFloorSpace, queryCalendarByInstanceId } from '@/apis/calendar';
import baseStore from '@/store/baseStore';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { globalConfiguredArrKey, isLeftPreviewLoadingKey } from '../injectKeys';

export default () => {
    const configuredArr = inject(globalConfiguredArrKey);
    const currentModel = ref([]);
    const data = ref([]);
    const ids = ref([]);
    const InitialSelection = ref([]);

    const isPreviewLoading = inject(isLeftPreviewLoadingKey);

    //查询建筑楼层空间
    const getTreeBuildingFloorSpaceFun = () => {
        treeBuildingFloorSpace({ projectId: baseStore().projectId, systemId: baseStore().projectId }).then(res => {
            handleTreeData(res.data);
            currentModel.value = [res.data[0]?.id];
            InitialSelection.value = [res.data[0]?.id];
        });
    };
    //把建筑数据组装成tree
    const handleTreeData = tree => {
        ids.value = [];
        data.value = [];
        const handleLevelOne = element => {
            const newElement = {
                id: element.id,
                name: element.localName ?? '--',
                children: []
            };
            if (element.floors) {
                element.floors.forEach(subElement => {
                    newElement.children.push(handleLevelTwo(subElement));
                    ids.value.push(subElement.id);
                });
            }

            return newElement;
        };
        const handleLevelTwo = subElement => {
            const newSubElement = {
                id: subElement.id,
                name: subElement.localName ?? '--',
                children: []
            };
            if (subElement.spaces) {
                subElement.spaces.forEach(subSubElement => {
                    newSubElement.children.push(handleLevelThree(subSubElement));
                    ids.value.push(subSubElement.id);
                });
            }
            return newSubElement;
        };
        const handleLevelThree = subSubElement => {
            const newSubSubElement = {
                id: subSubElement.id,
                name: subSubElement.localName ?? '--'
            };
            return newSubSubElement;
        };
        tree.forEach(item => {
            data.value.push(handleLevelOne(item));
            ids.value.push(item.id);
        });
        getQueryCalendarByInstanceIdFun(ids.value);
        return data.value;
    };
    //查询已配置项
    const getQueryCalendarByInstanceIdFun = item => {
        queryCalendarByInstanceId(item).then(res => {
            configuredArr.value = res.data || [];
        });
    };

    // 查询全局配置
    const getGlobalRuleFun = async () => {
        isPreviewLoading.value = true;
        const res = await getGlobalRule({ instanceId: baseStore().projectId }).finally(() => {
            isPreviewLoading.value = false;
        });
        if (res?.code === SUCCESSCODE) {
            const {
                businessTimeRange,
                coolingSeasonDateRangeList,
                heatingSeasonDateRangeList,
                seasonRangeParam,
                weekdays,
                anniversary,
                holidayGeneralConfiguration,
                holidaySpecialConfiguration
            } = res?.data || {};
            return {
                businessTimeRange,
                coolingSeasonDateRangeList,
                heatingSeasonDateRangeList,
                seasonRangeParam,
                weekdays,
                anniversary,
                holidayGeneralConfiguration,
                holidaySpecialConfiguration
            };
        }
        return {};
    };

    onMounted(() => {
        getTreeBuildingFloorSpaceFun();
    });
    return {
        data,
        currentModel,
        configuredArr,
        getGlobalRuleFun,
        isPreviewLoading
    };
};
