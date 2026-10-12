<template>
    <m-scrollbar v-if="groupData.length" class="associated-devices-new">
        <div v-if="groupName" class="associated-devices-new-name">{{ groupName }}</div>
        <ConfigBox v-for="item in groupData" :key="item.groupCode" :title="item.groupName" :collapse="groupData.length > 1 && collapse">
            <component
                :is="component"
                v-for="equipment in item.equipments"
                :key="equipment.id"
                :status-data="getStatusData(equipment)"
                :equipment-data="equipment"
                :select-obj="selectObj"
                :class="equipment.classes"
                :can-jump="equipment.canJump || canJump"
                v-bind="$attrs"
            >
                <template v-if="hasEquipParameterSet(equipment)">
                    <RunningParamsFour v-if="getInfoCodes(equipment)" :data="getInfoCodes(equipment)" :select-obj="{ id: equipment.id }" :stratification="false" />
                </template>
                <template v-else>
                    <RunningParamsTwo v-if="getInfoCodes(equipment)" :data="getInfoCodes(equipment)" :select-obj="{ id: equipment.id }" :stratification="false" />
                </template>
            </component>
        </ConfigBox>
    </m-scrollbar>
    <div v-else class="wh100 fcc" style="flex-direction: column">
        <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import ConfigBox from '../ControlSet/ConfigBox.vue';
import TemplateOne from '../SingleDeviceControl/TemplateOne.vue';
import RunningParamsFour from '@/components/ObjectInfoComponents/RunningParams/indexFour.vue';
import RunningParamsTwo from '@/components/ObjectInfoComponents/RunningParams/indexTwo.vue';
import { orderBy } from 'lodash';
import { OBJ_TYPE } from '@/utils/globalVariables';

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => ({})
    },
    // 基础数据
    basicData: {
        type: Array,
        default: () => []
    },
    groupName: {
        type: String,
        default: ''
    },
    // 是否折叠
    collapse: {
        type: Boolean,
        default: false
    },
    // 处理后的数据
    processedData: {
        type: Array,
        default: () => [
            /*
    [{
                    groupCode: '',
                    groupName: '',
                    groupOrder: 5,
                    equipments: [{
                    id:'',
                    classCode:'',
                    className:'',
                    relInfo:{
                        groupCode: 'relCircuit',
                        groupName: i18n.global.t('meos_control_web.served_space'),
                        objs: [{id:'',localName:'',objType:'equipment'}]
                    }]
                }]
			*/
        ]
    },
    component: {
        type: Object,
        default: () => TemplateOne
    },
    res: {
        type: Object,
        default: () => ({})
    },
    canJump: {
        type: Boolean,
        default: false
    },
    showByGroup: {
        type: Boolean,
        default: false
    },
    extraEquipmentGroupCodes: {
        type: Array,
        default: () => []
    }
});

const groupData = computed(() => {
    let arr = [];
    // 如果传入了processedData，则使用它
    if (props.processedData && props.processedData.length) {
        arr = structuredClone(props.processedData);
    } else {
        if (props.basicData && props.basicData.length) {
            props.basicData.forEach(item => {
                arr.push({
                    groupCode: item.groupCode,
                    groupName: item.groupName,
                    groupOrder: item.groupOrder,
                    equipments: getEquipmentFn(item.relInfoCodeConfigs)
                });
            });
        }
        arr = arr.sort((a, b) => a.groupOrder - b.groupOrder);
        // 过滤掉没有设备的组
        arr = arr.filter(item => item.equipments.length);
    }
    return arr;
});
/**
 * 从关联信息配置中提取设备数据值
 *
 * @param {Array} relInfoCodeConfigs - 关联信息配置数组，每个配置项应包含dataValue字段
 * @returns {Array} 返回过滤后的设备数据值数组，包含所有非空值
 */
const getEquipmentFn = relInfoCodeConfigs => {
    // 处理无效输入
    if (!relInfoCodeConfigs || !Array.isArray(relInfoCodeConfigs)) return [];

    // 提取并扁平化所有dataValue，然后过滤掉空值
    const arr = relInfoCodeConfigs
        .map(item => item.dataValue)
        .flat()
        .filter(Boolean);
    arr.forEach(item => {
        const floor = treeBuildFloorStore().getBuildOrFloor(item.floorId);
        item.floorSequenceId = floor?.floorSequenceId;
        item.floorLocalName = floor?.localName || '';
    });
    return orderBy(arr, ['floorSequenceId'], 'desc');
};

/**
 * 获取状态数据配置
 *
 * 根据传入的对象查找对应的状态配置信息（空间状态或设备状态）
 *
 * @param {Object} item - 包含关联信息配置的对象
 * @param {Array} [item.relInfoCodeGroupConfigs] - 关联信息配置组数组
 * @param {String} [item.objType] - 对象类型（'space'表示空间类型）
 * @returns {Object} 返回找到的状态配置对象，若未找到则返回包含空数组的默认对象 { relInfoCodeConfigs: [] }
 */
const getStatusData = item => {
    // 参数有效性检查：如果item无效或没有配置组，直接返回空数组
    if (!item || !item.relInfoCodeGroupConfigs || !Array.isArray(item.relInfoCodeGroupConfigs)) return [];

    // 根据对象类型查找对应的状态配置组（空间状态或设备状态）
    const statusConfigs = item.relInfoCodeGroupConfigs.find(config => config.groupCode === (item?.objType === OBJ_TYPE.SPACE ? 'spaceStatus' : 'equipStatus'));

    // 返回找到的配置组或默认空配置
    return statusConfigs || { relInfoCodeConfigs: [] };
};

const hasEquipParameterSet = item => {
    // 没有配置
    if (!item || !Array.isArray(item.relInfoCodeGroupConfigs) || item.relInfoCodeGroupConfigs.length === 0) return false;
    // 是否设备
    if (item.objType !== 'equipment') return false;
    const parameterSet = item.relInfoCodeGroupConfigs.find(_item => {
        return _item.groupCode === 'equipParameterSet';
    });
    return !!parameterSet;
};
const getInfoCodes = item => {
    return item.relInfoCodeGroupConfigs?.find(item => [...props.extraEquipmentGroupCodes, 'enviroParameter'].includes(item.groupCode));
};
</script>
<style lang="less" scoped>
.associated-devices-new {
    padding: 16px 24px;
    :deep(.single-device-control) {
        &:first-child {
            margin-top: 12px;
        }
    }
}
</style>
