import i18n from '@/localization';
import { queryCoolingTowerByFanId, queryPumpGroupObjectByPumpId } from '@/apis/systemDiagram';
import { SUCCESSCODE } from '@/utils/globalVariables';

import baseStore from '@/store/baseStore';

export const userRight = () => {
    const equipmentNodes = ref([]);
    const activeEquipment = ref();
    const showActiveEquipment = ref(false);
    const showEquipmentInfo = ref(false);
    const showSystemInfo = ref(false);
    const equipDetailLoading = ref(false);
    const equipmentNodeActiveData = ref();
    const systemId = ref('');
    const systemClassCode = ref('');
    const showEquipmentFun = equipmentNode => {
        activeEquipment.value = null;
        equipDetailLoading.value = true;
        showActiveEquipment.value = false;
        showEquipmentInfo.value = false;
        if (!equipmentNode.id || equipmentNode.classCode === 'ACAT') {
            equipDetailLoading.value = false;
            return;
        }
        systemId.value = equipmentNode.systemObjectId;
        systemClassCode.value = equipmentNode.systemClassCode;
        // if (equipmentNode.data.dataObject.classCode === 'ACCCOF' || equipmentNode.data.dataObject.classCode === 'ACVVEO') {
        // 冷战
        if (baseStore().isCoolHotSystem) {
            //冷热源
            queryPumpGroupObjectByPumpId({ systemId: systemId.value, objectId: equipmentNode.id }).then(res => {
                if (res.code === SUCCESSCODE && res.data) {
                    if (res.data.id) {
                        if (activeEquipment.value) {
                            activeEquipment.value = null;
                            showActiveEquipment.value = false;
                        }
                        nextTick(() => {
                            equipmentNodeActiveData.value = {
                                id: res.data.id,
                                classCode: res.data.classCode,
                                localName: res.data.localName ?? '--',
                                activeName: (equipmentNode.localName || equipmentNode.equipO2OLocalName) ?? '--',
                                otherId: equipmentNode.id,
                                objType: equipmentNode.objType
                            };
                            activeEquipment.value = document.getElementById(equipmentNode.data?.dataObjectId);
                            showActiveEquipment.value = true;
                            showEquipmentInfo.value = true;
                            equipDetailLoading.value = false;
                        });
                    } else {
                        if (activeEquipment.value) {
                            activeEquipment.value = null;
                            showActiveEquipment.value = false;
                        }
                        nextTick(() => {
                            equipmentNodeActiveData.value = {
                                id: equipmentNode.id,
                                classCode: equipmentNode.classCode,
                                localName: equipmentNode.localName ?? '--',
                                activeName: equipmentNode.localName ?? '--',
                                objType: equipmentNode.objType
                            };
                            activeEquipment.value = document.getElementById(equipmentNode.data?.id);
                            showActiveEquipment.value = true;
                            showEquipmentInfo.value = true;
                            equipDetailLoading.value = false;
                        });
                    }
                }
            });
        } else {
            if (equipmentNode?.classCode === 'ACCCOF' || equipmentNode?.classCode === 'ACVVEO') {
                queryCoolingTowerByFanId({ systemId: equipmentNode.systemObjectId, objectId: equipmentNode.id }).then(res => {
                    if (res.code === SUCCESSCODE && res.data) {
                        if (res.data.extraInfo) {
                            if (activeEquipment.value) {
                                activeEquipment.value = null;
                                showActiveEquipment.value = false;
                            }
                            nextTick(() => {
                                equipmentNodeActiveData.value = {
                                    id: res.data.extraInfo.id,
                                    classCode: res.data.extraInfo.classCode,
                                    // classCode: 'ACGEFP',
                                    localName: res.data.extraInfo.localName ?? '--',
                                    activeName: (equipmentNode.localName || equipmentNode.equipO2OLocalName) ?? '--',
                                    otherId: equipmentNode.id,
                                    objType: equipmentNode.objType
                                };
                                activeEquipment.value = document.getElementById(equipmentNode.data?.dataObjectId);
                                showActiveEquipment.value = true;
                                showEquipmentInfo.value = true;
                                equipDetailLoading.value = false;
                            });
                        } else {
                            if (activeEquipment.value) {
                                activeEquipment.value = null;
                                showActiveEquipment.value = false;
                            }
                            nextTick(() => {
                                equipmentNodeActiveData.value = {
                                    id: equipmentNode.id,
                                    classCode: equipmentNode.classCode,
                                    // classCode: 'ACGEFP',
                                    localName: equipmentNode.localName ?? '--',
                                    activeName: equipmentNode.localName ?? '--',
                                    objType: equipmentNode.objType
                                };
                                activeEquipment.value = document.getElementById(equipmentNode.data?.dataObjectId);
                                showActiveEquipment.value = true;
                                showEquipmentInfo.value = true;
                                equipDetailLoading.value = false;
                            });
                        }
                    }
                });
            } else {
                if (activeEquipment.value) {
                    activeEquipment.value = null;
                    showActiveEquipment.value = false;
                }
                nextTick(() => {
                    equipmentNodeActiveData.value = {
                        id: equipmentNode.id,
                        classCode: equipmentNode.classCode,
                        // classCode: 'ACGEFP',
                        localName: equipmentNode.localName ?? '--',
                        activeName: equipmentNode.localName ?? '--',
                        objType: equipmentNode.objType
                    };
                    activeEquipment.value = document.getElementById(equipmentNode.data?.dataObjectId);
                    showActiveEquipment.value = true;
                    showEquipmentInfo.value = true;
                    equipDetailLoading.value = false;
                });
            }
        }
    };
    const closeEquipmentiInfo = () => {
        activeEquipment.value = null;
        showActiveEquipment.value = false;
        showEquipmentInfo.value = false;
        showSystemInfo.value = false;
        // console.trace(123);
    };

    provide('closeEquipmentiInfo', closeEquipmentiInfo);
    provide('showEquipmentFun', showEquipmentFun);
    provide('showEquipmentInfo', showEquipmentInfo);
    provide('showSystemInfo', showSystemInfo);
    provide('equipDetailLoading', equipDetailLoading);
    onUnmounted(() => {
        activeEquipment.value = null;
    });
    return {
        equipmentNodes,
        activeEquipment,
        showActiveEquipment,
        showEquipmentInfo,
        showSystemInfo,
        equipmentNodeActiveData,
        showEquipmentFun,
        closeEquipmentiInfo,
        systemId,
        systemClassCode
    };
};
