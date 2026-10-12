<template>
    <div class="ws-view-list">
        <template v-if="!loadingFloor">
            <div v-if="props?.equipmentsMpa?.size" class="ws-view-list-filter">
                <m-select v-model="selectValue" :options="list" :prefix="i18n.global.t('meos_control_web.abnormal_type_colon')" clearable></m-select>
            </div>
            <m-collapse v-if="buildFloorEquipmentTree.length" v-model="collapseData" icon-position="left" :hover-style="false">
                <m-collapse-item v-for="build in buildFloorEquipmentTree" :id="build.id" :key="build.id" :title="build.name" only-icon-click>
                    <template v-for="floor in build.floors" :key="floor.id">
                        <FloorItem :floor="floor" :max="build.floorTypeMaxNumber" />
                    </template>
                </m-collapse-item>
            </m-collapse>
            <div v-else class="no-data fcc">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { orderBy } from 'lodash';
import FloorItem from './FloorItem.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { checkMonitorSurveillanceStatus } from '../../utils/index';

const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    loadingFloor: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    currentFloorObj: Object,
    // eslint-disable-next-line vue/require-default-prop
    equipmentsMpa: Object,
    // eslint-disable-next-line vue/require-default-prop
    buildIds: Array,
    abnormalEventList: {
        type: Array,
        default: () => []
    }
});
const list = ref([
    { id: 'abnormalEvent', name: i18n.global.t('meos_control_web.abnormal_event') },
    { id: 'superHighLevelAlarm', name: i18n.global.t('meos_control_web.ultra_high_level') },
    { id: 'highLevelAlarm', name: i18n.global.t('meos_control_web.high_level') }
]);
const selectValue = ref('');
// eslint-disable-next-line vue/no-setup-props-destructure
const collapseData = ref([...props.buildIds]);
const buildFloorEquipmentTree = computed(() => {
    const tree = {};
    const equipments = props.equipmentsMpa || [];

    equipments.forEach(item => {
        const { buildingId, floorId } = item;
        // 仅自身可监可控或关联设备数据有值，才进行下一步
        if (!checkMonitorSurveillanceStatus(item) && !item?.relEquipment?.length) {
            return;
        }
        if (!tree[buildingId]) {
            tree[buildingId] = {
                id: buildingId,
                name: item.buildingName,
                floors: {}
            };
        }
        if (!tree[buildingId].floors[floorId]) {
            tree[buildingId].floors[floorId] = {
                id: floorId,
                name: item.floorName,
                equipments: [],
                hasSuperHighLevelAlarm: false,
                hasHighLevelAlarm: false,
                hasAbnormalEvent: false,
                equipmentGroup: {}
            };
        }
        tree[buildingId].floors[floorId].equipments.push(item);
    });

    const treeList = Object.values(tree);
    treeList.forEach(item => {
        let floors = Object.values(item.floors);
        floors = orderBy(floors, ['name'], ['asc']);
        item.floors = floors.map(floor => {
            floor.equipments.forEach(element => {
                const superHighLevelAlarm = getIotData(element.id, 'superHighLevelAlarm');
                const highLevelAlarm = getIotData(element.id, 'highLevelAlarm');
                const highLevAlarm = getIotData(element.id, 'highLevAlarm');
                if (superHighLevelAlarm?.dataValue === '1') {
                    floor.hasSuperHighLevelAlarm = true;
                }
                if (highLevelAlarm?.dataValue === '1' || highLevAlarm?.dataValue === '1') {
                    floor.hasHighLevelAlarm = true;
                }
                // 仅自身可监可控才进入楼层卡片统计
                if (!checkMonitorSurveillanceStatus(element)) {
                    return;
                }
                if (floor.equipmentGroup[element.classCode]) {
                    floor.equipmentGroup[element.classCode].push(element);
                } else {
                    floor.equipmentGroup[element.classCode] = [element];
                }
            });

            const equipmentIds = floor.equipments.map(val => val.id);
            const spaceIds = floor.equipments.map(val => val.spaceId);
            const allIds = [...equipmentIds, ...spaceIds];
            const abnormalEventsList = props.abnormalEventList.filter(val => allIds.includes(val.id));
            if (abnormalEventsList.length) {
                floor.hasAbnormalEvent = true;
            }

            return floor;
        });
        item.floorTypeNumbers = floors.map(floor => Object.keys(floor.equipmentGroup).length);
        item.floorTypeMaxNumber = Math.max(...item.floorTypeNumbers);

        if (selectValue.value === 'superHighLevelAlarm') {
            item.floors = item.floors.filter(val => val.hasSuperHighLevelAlarm);
        } else if (selectValue.value === 'highLevelAlarm') {
            item.floors = item.floors.filter(val => val.hasHighLevelAlarm);
        } else if (selectValue.value === 'abnormalEvent') {
            item.floors = item.floors.filter(val => val.hasAbnormalEvent);
        }
    });

    return treeList.filter(val => val.floors.length);
});
</script>
<style lang="less" scoped>
.ws-view-list {
    padding: 0 24px 12px 16px;
    padding-right: 0px;
    position: relative;
    &-filter {
        position: absolute;
        right: 0px;
        top: -2px;
    }

    :deep(.m-collapse-item__header) {
        padding: 8px 0;
        font-size: 18px;
        font-weight: 700;
        cursor: default;

        .m-collapse-item__header-icon {
            cursor: pointer;
        }
    }
    :deep(.m-collapse-item) {
        & + .m-collapse-item {
            margin-top: 16px;
        }
    }
    .no-data {
        height: calc(100vh - 376px - 48px - 80px);
    }
}
</style>
