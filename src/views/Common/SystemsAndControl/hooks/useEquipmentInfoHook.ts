import emitter from '@/utils/bus';
import { EquipmentData } from '../types';
import { ChartEvent, IndexEmits } from '../types/emits';
import { IndexProps } from '../types/props';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { useObjectInfoDataByTemplateHook } from '@/hooks/useObjectInfoDataByTemplateHook';
import { CLOSE_CONTROL_FORM } from '@/utils/globalVariables';

export const useEquipmentInfoHook = (props: IndexProps, emits: IndexEmits) => {
    const equipmentNodeActiveData = ref<EquipmentData>({} as EquipmentData);
    const showEquipmentInfo = ref(false);
    const { getBuildOrFloor } = treeBuildFloorStore();
    const { templateData, closeObjectInfoSSEClient } = useObjectInfoDataByTemplateHook(equipmentNodeActiveData);

    /**
     * 打开设备信息面板函数
     * @param data - 设备数据对象，包含设备的相关信息
     */
    const openEquipmentFn = (data: EquipmentData) => {
        emitter.emit(CLOSE_CONTROL_FORM, { needClose: true });
        // 隐藏设备信息面板
        // showEquipmentInfo.value = false; // 模型图依赖了 showEquipmentInfo，为 false 模型会取消选中（异步），可能导致模型选中后，再次取消选中

        // 设置运行监控类型
        data.runningMonitorType = props.runningMonitorType;

        // 如果楼层本地名称不存在，则根据楼层ID获取建筑或楼层信息并设置本地名称
        if (!data.floorLocalName) {
            data.floorLocalName = getBuildOrFloor(data.floorId)?.localName || '';
        }

        // 重置并更新设备节点激活数据
        equipmentNodeActiveData.value = {} as EquipmentData;
        equipmentNodeActiveData.value = structuredClone(data);

        // 在下次DOM更新后显示设备信息面板并触发打开设备事件
        nextTick(() => {
            showEquipmentInfo.value = true;
            emits(ChartEvent.OpenEquipment, data);
        });
    };
    /**
     * 关闭设备信息面板函数
     * @param type - 可选的布尔类型参数，用于传递关闭类型信息
     */
    const closeEquipmentFn = (type?: boolean) => {
        // 隐藏设备信息显示
        showEquipmentInfo.value = false;
        // 清空设备节点激活数据
        equipmentNodeActiveData.value = {} as EquipmentData;
        // 取消系统图选中状态
        emits(ChartEvent.CloseEquipment, type);
    };
    /**
     * 关闭详情抽屉的回调函数
     *
     * 该函数用于处理关闭设备详情抽屉时的清理工作，
     * 包括关闭设备功能和取消系统图的选中状态
     */
    const onDetailDrawerClose = () => {
        closeEquipmentFn();
        // 取消系统图选中状态
        emitter.emit('monitorCloseEquipmentiInfo');
        closeObjectInfoSSEClient();
    };

    return {
        equipmentNodeActiveData,
        showEquipmentInfo,
        templateData,
        openEquipmentFn,
        closeEquipmentFn,
        onDetailDrawerClose
    };
};
