<template>
    <div class="ws-floor-item" :class="{ hasSuperHighLevelAlarm: floor.hasSuperHighLevelAlarm || floor.hasHighLevelAlarm }" @click="goToFloor(floor)">
        <div class="floor-title fcb">
            <div class="fcc">
                <div class="fs18 fw700" :class="{ hasEventAlarm: floor.hasAbnormalEvent }" style="margin-right: 8px">{{ floor.name }}</div>
                <template v-if="floor.hasSuperHighLevelAlarm || floor.hasHighLevelAlarm">
                    <m-tag v-if="floor.hasHighLevelAlarm" size="small" bg-color="rgba(255, 132, 25, 0.18)" color="#FF8419">{{
                        i18n.global.t('meos_control_web.high_level')
                    }}</m-tag>
                    <m-tag v-if="floor.hasSuperHighLevelAlarm" size="small" bg-color="rgba(255, 132, 25, 0.18)" color="#FF8419">{{
                        i18n.global.t('meos_control_web.ultra_high_level')
                    }}</m-tag>
                </template>
                <template v-else>
                    <div class="fs16 fw700 fcc" style="color: var(--green-700)">
                        <div style="width: 16px; height: 16px; margin-right: 4px">
                            <IconMeriComponentNotificationSuccess />
                        </div>
                        {{ i18n.global.t('meos_control_web.level_normal') }}
                    </div>
                </template>
            </div>
            <m-button size="small" type="link" @click="goToFloor(floor)">{{ i18n.global.t('meos_control_web.enter_floor') }}</m-button>
        </div>
        <div class="floor-describe">{{ i18n.global.t('meos_control_web.ultra_high_or_high_level_total') }}</div>
        <div class="floor-equipment-type" :style="{ 'grid-template-columns': `repeat(${max}, minmax(0, 1fr))` }">
            <div v-for="(item, key) of equipGroup" :key="key" class="type-box">
                <div class="type-box-title fcb">
                    <template v-if="(floor.hasSuperHighLevelAlarm || floor.hasHighLevelAlarm) && getHighLevelNumber(item.val)">
                        <span v-ellipsis class="fs16 fw700 m-ellipsis" style="color: #ff8419">{{ EQUIPEMNT_CLASSCODE[item.code].name }}</span>
                    </template>
                    <template v-else>
                        <span v-ellipsis class="fs16 m-ellipsis">{{ EQUIPEMNT_CLASSCODE[item.code].name }}</span>
                    </template>

                    <div style="margin-left: 12px">
                        <template v-if="(floor.hasSuperHighLevelAlarm || floor.hasHighLevelAlarm) && getHighLevelNumber(item.val)">
                            <span class="ffCustom-M fs24 fw700" style="color: #ff8419">{{ getHighLevelNumber(item.val) }}</span>
                            <span class="ffCustom-M fs24 fw700" style="color: var(--gray-800)">/{{ item.val.length }}</span>
                        </template>
                        <template v-else>
                            <span class="ffCustom-M fs24 fw700" style="color: var(--gray-400)">0/</span>
                            <span class="ffCustom-M fs24 fw700" style="color: var(--gray-800)">{{ item.val.length }}</span>
                        </template>
                    </div>
                </div>
                <div class="type-box-line">
                    <div :style="{ width: `${(getHighLevelNumber(item.val) / item.val.length) * 100}%`, height: '12px', 'background-color': '#FFAE68', borderRadius: '2px' }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js" setup>
import { currentFloorObjInjectKey } from '../../constant/injectKey';
import { MAP_FILTER_CLSDDCODES } from '../../constant/index';
import { EQUIPEMNT_CLASSCODE } from '../../variables';
import { IconMeriComponentNotificationSuccess } from "meri-icon";
import { getFloorInfoByFloorId } from '../../FloorMap/utils'
import DockSingleton from '@/hooks/responsiveDock';
import i18n from '@/localization';
import { computed } from 'vue';

const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    floor: Object,
    // eslint-disable-next-line vue/require-default-prop
    max: Number
})

const currentFloorObj = inject(currentFloorObjInjectKey);  // ==> src\views\WSSewageTreatment\hooks\useBaseData.js
const callToggleWidth=inject('callToggleWidth')
const goToFloor = (data)=>{
    const f = { id: data.id };
    const floorInfo = getFloorInfoByFloorId(data.id);
    if (floorInfo) {
        currentFloorObj.value = floorInfo;
    } else {
        currentFloorObj.value = f;
    }
    callToggleWidth(true)
}
const equipGroup = computed(() => {
    const groups = [];
    for(let key in props?.floor?.equipmentGroup ){
        groups.push({
            code: key,
            val: props.floor.equipmentGroup[key]
        })
    }
    return groups.sort((a, b) => (MAP_FILTER_CLSDDCODES.indexOf(a.code) - MAP_FILTER_CLSDDCODES.indexOf(b.code)));
});

const getHighLevelNumber = (equipments) => {
    let number = 0;
    equipments.forEach(equipment => {
		const superHighLevelAlarm = getIotData(equipment.id, 'superHighLevelAlarm');
		const highLevelAlarm = getIotData(equipment.id, 'highLevelAlarm');
		const highLevAlarm = getIotData(equipment.id, 'highLevAlarm');
		if (superHighLevelAlarm?.dataValue === '1' || highLevelAlarm?.dataValue === '1' || highLevAlarm?.dataValue === '1') {
			number++;
		}
	});
	return number
}
</script>
<style lang="less" scoped>
.ws-floor-item {
    padding: 10px 20px 16px 20px;
    border-radius: 8px;
    background-color: #ffffffcc;
    cursor: pointer;
    border: 2px solid transparent;
    display: flex;
    flex-direction: column;
    gap: 8px;
    :deep(.m-button) {
        opacity: 1;
    }
    & + .ws-floor-item {
        margin-top: 16px;
    }
    &.hasSuperHighLevelAlarm {
        background-color: rgba(255, 255, 255, 0.8);
    }
    &:hover {
        border-color: var(--blue-400);
        :deep(.m-button) {
            opacity: 1;
        }
    }
    .floor-title {
        .hasEventAlarm {
            position: relative;
            padding-right: 20px;
            &::after {
                position: absolute;
                content: '';
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--red-500);
                right: 0px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
    .floor-describe {
        color: var(--gray-600);
    }
    .floor-equipment-type {
        display: grid;
        gap: 24px;
        .type-box {
            height: 100%;
            &-line {
                margin-top: 8px;
                background-color: #e4f4ec;
                height: 12px;
                border-radius: 2px;
            }
        }
    }
}
</style>
