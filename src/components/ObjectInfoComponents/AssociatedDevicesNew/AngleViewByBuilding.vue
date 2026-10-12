<template>
    <m-scrollbar
        v-if="list.length"
        :class="{
            'angle-view-by-building': true,
            'with-last-bottom-border': props.withLastBottomBorder,
            'with-header-padding': props.withHeaderPadding
        }"
    >
        <ConfigBox v-for="item in list" :key="item.groupCode" :title="item.groupName" :collapse="list.length >= 2">
            <m-collapse
                v-model="item.collapseData"
                icon-position="left"
                :class="{ 'one-build': oneBuild, 'build-collapse': true }"
                :only-icon-click="props.onlyIconClick"
                :style="{ marginTop: oneBuild ? '0' : '12px' }"
            >
                <m-collapse-item v-for="build in item.builds" :id="build.id" :key="build.id" :title="build.localName" style="--collapse-icon-size: 16px">
                    <TemplateOne
                        v-for="equipment in build.children"
                        :key="equipment.id"
                        :equipment-data="equipment"
                        :status-data="getStatusData(equipment)"
                        :select-obj="selectObj"
                        :title-ellipsis="false"
                        :need-hover="false"
                        :config-space-name="getSpaceName(equipment)"
                        class="only-view"
                        @hover-equip="
                            item => {
                                emits('hoverEquip', item);
                            }
                        "
                        @unhover-equip="
                            () => {
                                emits('unhoverEquip');
                            }
                        "
                        @click-name="clickName"
                    >
                        <template v-if="props.infoCodeWithLink">
                            <RunningParamsThree v-if="getInfoCodes(equipment)" :data="getInfoCodes(equipment)" :select-obj="{ id: equipment.id }" :stratification="false" />
                        </template>
                        <template v-else>
                            <template v-if="hasEquipParameterSet(equipment)">
                                <RunningParamsFour v-if="getInfoCodes(equipment)" :data="getInfoCodes(equipment)" :select-obj="{ id: equipment.id }" :stratification="false" />
                            </template>
                            <template v-else>
                                <RunningParamsTwo v-if="getInfoCodes(equipment)" :data="getInfoCodes(equipment)" :select-obj="{ id: equipment.id }" :stratification="false" />
                            </template>
                        </template>
                    </TemplateOne>
                </m-collapse-item>
            </m-collapse>
        </ConfigBox>
    </m-scrollbar>
    <div v-else class="wh100 fcc">
        <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
    </div>
</template>

<script setup>
import ConfigBox from '../ControlSet/ConfigBox.vue';
import RunningParamsFour from '@/components/ObjectInfoComponents/RunningParams/indexFour.vue';
import RunningParamsTwo from '@/components/ObjectInfoComponents/RunningParams/indexTwo.vue';
import RunningParamsThree from '@/components/ObjectInfoComponents/RunningParams/indexThree.vue';
import { uniq } from 'lodash';
import treeBuildFloor from '@/store/treeBuildFloor';
import TemplateOne from '../SingleDeviceControl/TemplateOne.vue';
import i18n from '@/localization';

import { templateDataKey } from '@/hooks/useObjectInfoDataByTemplateHook';
import { EQUIP_STATUS, SPACE_STATUS } from '../constant';
import { OBJ_TYPE } from '@/utils/globalVariables';
const props = defineProps({
    selectObj: {
        type: Object,
        default: () => ({ id: '' })
    },
    groupList: {
        type: Array,
        default: () => []
    },
    res: {
        type: Object,
        default: () => ({}),
        required: true
    },
    extraEquipmentGroupCodes: {
        type: Array,
        default: () => []
    },
    onlyIconClick: {
        type: Boolean,
        default: false
    },
    infoCodeWithLink: {
        type: Boolean,
        default: false
    },
    withLastBottomBorder: {
        type: Boolean,
        default: false
    },
    withHeaderPadding: {
        type: Boolean,
        default: false
    }
});
const templateData = inject(templateDataKey);
const emits = defineEmits(['clickName', 'loadedObjects', 'unhoverEquip', 'hoverEquip']);
const list = ref([]);
const otherBuildId = `other-${Math.random().toString(36).slice(2)}`;

watch(templateData, value => {
    const relConfigs = value ? value?.relInfoCodeGroupConfigs?.find(g => g.groupCode === 'relation')?.groupChildren : [];
    let objects = [];
    relConfigs?.forEach(g => {
        const objList = g.relInfoCodeConfigs?.length > 0 ? g.relInfoCodeConfigs[0].dataValue || [] : [];
        if (objList.length > 0) {
            objects = objects.concat(objList);
        }
    });
    emits('loadedObjects', objects);
});

const handleGroupList = () => {
    list.value = props.groupList.map(item => {
        const buildingIds = item.equipments.map(item => {
            item.floorId = item.floorId || item.inFloor?.id;
            return treeBuildFloor().getBuildOrFloor(item.floorId || item.inFloor?.id)?.buildingId || otherBuildId;
        });
        const builds = getTreeBuildData(item);
        return {
            ...item,
            builds,
            collapseData: uniq(buildingIds)
        };
    });
    list.value = list.value.filter(item => item.equipments.length > 0);
};

const getTreeBuildData = item => {
    if (!Array.isArray(item.equipments)) return [];
    // 不同楼层按楼层顺序从高到底降序排序，同一楼层时按设备名称升序排序
    const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });
    item.equipments = item.equipments.toSorted((a, b) => {
        if (a.floorSequenceId === b.floorSequenceId) {
            const aName = a.dynamicName || a.localName || '';
            const bName = b.dynamicName || b.localName || '';
            return collator.compare(aName, bName);
        } else {
            return b.floorSequenceId - a.floorSequenceId;
        }
    });
    // 分组：buildId => [equipments]
    const buildMap = {};
    item.equipments.forEach(equipment => {
        const { floorId } = equipment;
        const floor = treeBuildFloor().getBuildOrFloor(floorId);
        equipment.floorLocalName = floor?.localName || '';
        equipment.floorSequenceId = floor?.floorSequenceId;
        const build = treeBuildFloor().getBuildOrFloor(floor?.buildingId);
        if (!build) {
            if (!buildMap[otherBuildId]) {
                buildMap[otherBuildId] = {
                    id: otherBuildId,
                    localName: i18n.global.t('meos_control_web.others'),
                    children: []
                };
            }
            buildMap[otherBuildId].children.push(equipment);
            return;
        }
        if (build) {
            if (!buildMap[build.id]) {
                buildMap[build.id] = {
                    id: build.id,
                    localName: build.localName,
                    children: []
                };
            }
            buildMap[build.id].children.push(equipment);
        }
    });
    return Object.values(buildMap);
};

// 获取设备所在空间信息
const getSpaceName = item => {
    const basicInfoGroup = item.relInfoCodeGroupConfigs?.find(v => ['basicInfo'].includes(v.groupCode));
    return basicInfoGroup?.relInfoCodeConfigs?.find(s => s?.infoCode === 'MechInArch/Eq2Sp')?.dataValue?.[0] || '';
};

const getInfoCodes = item => {
    return item.relInfoCodeGroupConfigs?.find(item => [...props.extraEquipmentGroupCodes, 'enviroParameter'].includes(item.groupCode));
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
    const statusConfigs = item.relInfoCodeGroupConfigs.find(config => {
        if (item?.objType === OBJ_TYPE.SPACE) {
            return SPACE_STATUS.includes(config.groupCode);
        } else {
            return EQUIP_STATUS.includes(config.groupCode);
        }
    });

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

const oneBuild = computed(() => {
    return treeBuildFloor().treeBuildFloor.length === 1;
});
const clickName = equipment => {
    emits('clickName', equipment);
};
watch(
    () => props.groupList,
    () => {
        handleGroupList();
    }
);
</script>
<style lang="less" scoped>
.angle-view-by-building {
    padding: 16px 24px;
    :deep(.m-collapse.build-collapse) {
        .m-collapse-item__header {
            padding: 4px;
        }
    }
    :deep(.m-collapse.one-build) {
        .m-collapse-item__header {
            display: none;
        }
    }
    .only-view.single-device-control {
        background-color: transparent;
        padding: 12px;
        border-radius: 0;
        border-bottom: 1px solid var(--gray-200);
        margin-top: 0;
        &:last-child {
            border-bottom: none;
        }
        &:hover {
            background-color: var(--alpha-30);
            border-radius: 4px;
        }
    }
}

.with-last-bottom-border {
    .only-view.single-device-control {
        &:last-child {
            border-bottom: 1px solid var(--gray-200);
        }
    }
}

.with-header-padding {
    :deep(.m-collapse-item__header) {
        height: 28px;
    }
    :deep(.m-collapse-item__header-icon) {
        width: 16px;
        height: 16px;
    }
}
</style>
