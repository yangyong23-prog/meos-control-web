import treeBuildFloorStore from '@/store/treeBuildFloor';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';
import { showSystemInfoKey } from '../constant/variable';

export const openEquipmentInfoKey = Symbol('openEquipmentInfoKey');
export const closeEquipmentInfoKey = Symbol('closeEquipmentInfoKey');
export const showEquipmentInfoKey = Symbol('showEquipmentInfoKey');
export const useLeftHook = () => {
    // 是否展示设备详情
    const showEquipmentInfo = ref(false);
    const showSystemInfo = inject(showSystemInfoKey, ref(false));
    // 激活的设备节点数据
    const equipmentNodeActiveData = ref();
    const { getBuildOrFloor } = treeBuildFloorStore();

    const openEquipmentInfo = data => {
        showSystemInfo.value = false;
        equipmentNodeActiveData.value = {};
        if (!data.floorLocalName) {
            data.floorLocalName = getBuildOrFloor(data.floorId)?.localName || '';
        }
        equipmentNodeActiveData.value = structuredClone(data);
        nextTick(() => {
            showEquipmentInfo.value = true;
        });
        emitter.emit(CLOSE_CONTROL_FORM);
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
    return {
        showEquipmentInfo,
        equipmentNodeActiveData,
        closeEquipmentInfo,
        openEquipmentInfo
    };
};
