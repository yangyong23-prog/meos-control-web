import { RightComponentRefKey, showSystemInfoKey } from './useBaseHook';
import treeBuildFloorStore from '@/store/treeBuildFloor';

export const openEquipmentInfoKey = Symbol('openEquipmentInfoKey');
export const closeEquipmentInfoKey = Symbol('closeEquipmentInfoKey');
export const showEquipmentInfoKey = Symbol('showEquipmentInfoKey');
export const equipmentNodeActiveDataKey = Symbol('equipmentNodeActiveDataKey');
export const useLeftHook = () => {
    const showEquipmentInfo = ref(false);
    const equipmentNodeActiveData = ref();
    const showSystemInfo = inject(showSystemInfoKey);
    const RightComponentRef = inject(RightComponentRefKey);
    const { getBuildOrFloor } = treeBuildFloorStore();
    const openEquipmentInfo = data => {
        equipmentNodeActiveData.value = {};
        showSystemInfo.value = false;
        if (!data.floorLocalName) {
            data.floorLocalName = getBuildOrFloor(data.floorId)?.localName || '';
        }

        RightComponentRef.value?.closeSetForm?.();
        equipmentNodeActiveData.value = structuredClone(data);
        nextTick(() => {
            showEquipmentInfo.value = true;
        });
    };

    const closeEquipmentInfo = (type = true) => {
        if (type) {
            equipmentNodeActiveData.value = {};
            showEquipmentInfo.value = false;
        }
    };
    provide(openEquipmentInfoKey, openEquipmentInfo);
    provide(closeEquipmentInfoKey, closeEquipmentInfo);
    provide(showEquipmentInfoKey, showEquipmentInfo);
    provide(equipmentNodeActiveDataKey, equipmentNodeActiveData);
    return {
        showEquipmentInfo,
        equipmentNodeActiveData,
        closeEquipmentInfo,
        openEquipmentInfo
    };
};
