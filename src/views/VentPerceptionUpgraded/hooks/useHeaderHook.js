// @ts-ignore
import i18n from '@/localization';
import { currentFloorObjInjectKey } from './useBaseHook';
export const filterEquipmentTypeKey = Symbol('filterEquipmentTypeKey'); // 选中的设备类
export const onlyShowControlledEquipmentKey = Symbol('onlyShowControlledEquipmentKey'); // 仅看可控设备
export const onlyShowControlledEquipmentRefKey = Symbol('onlyShowControlledEquipmentRefKey');
export const equipTypeOptionsKey = Symbol('equipTypeOptionsKey');
export const curSceneSelSpaceTypesKey = Symbol('curSceneSelSpaceTypesKey');
export const curSceneEnvParamKey = Symbol('curSceneEnvParamKey'); // 环境参数
export default () => {
    const currentFloorObj = inject(currentFloorObjInjectKey);
    const onlyShowControlledEquipment = ref(true); // 仅看可控设备
    const onlyShowControlledEquipmentRef = ref('checked');
    const filterEquipmentType = ref(''); // 设备类筛选
    const equipTypeOptions = ref([]); //设备分类选项-排风机、送风机
    const curSceneEnvParam = ref('tdb'); //
    const curSceneSelSpaceTypes = ref([]);
    provide(onlyShowControlledEquipmentKey, onlyShowControlledEquipment);
    provide(filterEquipmentTypeKey, filterEquipmentType);
    provide(equipTypeOptionsKey, equipTypeOptions);
    provide(curSceneEnvParamKey, curSceneEnvParam);
    provide(curSceneSelSpaceTypesKey, curSceneSelSpaceTypes);
    provide(onlyShowControlledEquipmentRefKey, onlyShowControlledEquipmentRef);
    watch([currentFloorObj], () => {
        if (currentFloorObj?.value) {
            nextTick(() => {
                filterEquipmentType.value = '';
                curSceneSelSpaceTypes.value = [];
            });
        } else {
            onlyShowControlledEquipment.value = true;
            onlyShowControlledEquipmentRef.value = 'checked';
            filterEquipmentType.value = '';
            curSceneSelSpaceTypes.value = [];
        }
    });
    return {
        onlyShowControlledEquipment,
        filterEquipmentType,
        equipTypeOptions,
        curSceneEnvParam,
        curSceneSelSpaceTypes
    };
};
