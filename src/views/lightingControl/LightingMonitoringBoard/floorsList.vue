<template>
    <div style="position: relative; height: 100%">
        <!-- 筛选 -->
        <div class="screen-item">
            <div>
                <m-select
                    ref="select"
                    v-model="params.selectValue"
                    class="mr8"
                    :options="paramsList"
                    :prefix="i18n.global.t('meos_control_web.public_parking') + '：'"
                    :size="200"
                    @change="equipChange"
                ></m-select>
                <m-select
                    ref="select"
                    v-model="params.interventionType"
                    clearable
                    class="mr8"
                    :options="InterventionTypeList"
                    :prefix="i18n.global.t('meos_control_web.intervention_type_colon')"
                    :size="200"
                    @change="interventionTypeChange"
                    @clear="interventionTypeChange"
                ></m-select>
                <m-select
                    ref="select"
                    v-model="params.exceptionScreening"
                    clearable
                    :options="ExceptionScreeningList"
                    :prefix="i18n.global.t('meos_control_web.abnormal_filter_colon')"
                    :size="200"
                    @change="exceptionChange"
                    @clear="exceptionChange"
                >
                    <m-option v-for="(item, index) in ExceptionScreeningList" :key="item.id" class="select-option" :value="item.id" :label="item.name">
                        <div :color="item.color">{{ item.name }}</div>
                        <span v-if="index === ExceptionScreeningList.length - 1" class="ft1 mt4">{{
                            i18n.global.t('meos_control_web.equipment_offline_or_feedback_mismatch')
                        }}</span>
                    </m-option>
                </m-select>
            </div>
        </div>
        <div class="floors-list">
            <template v-if="currentArray.length">
                <template v-for="(item, index) in currentArray" :key="index">
                    <template v-if="item.floorArr.length">
                        <div class="title-box fc">
                            <IconMeriComponentArrowDown class="arrow-icon cp" :style="{ transform: `rotate(${item.rotateDegree}deg)` }" @click="toggleRotate(item, index)" />
                            <div class="f18 fb7">{{ item.localName ?? '--' }}</div>
                        </div>
                        <div v-show="item.showHiddle" class="list-box fc mt16 mb12">
                            <carItem :list="item?.floorArr" :common-area="currentArray" />
                        </div>
                    </template>
                </template>
            </template>
        </div>
    </div>
    <div v-if="!isEmptyFun(currentArray)" class="nodata">
        <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
    </div>
</template>
<script setup>
import carItem from './carItem.vue';
import { IconMeriComponentArrowDown } from 'meri-icon';
import i18n from '@/localization';
const params = ref({
    selectValue: 'PUBLIC_AREA_LIGHTING',
    interventionType: '',
    exceptionScreening: ''
});
// 定义用于控制筛选状态的变量，初始值为false，表示默认不筛选
const isFiltered = ref(true);

const CommonArea = inject('CommonArea');
const ParkingLot = inject('ParkingLot');

const templateType = inject('templateType');

const CommonAnomaly = inject('CommonAnomaly');
const ParkingLotAnomaly = inject('ParkingLotAnomaly');

const mapHandle = (type, item) => {
    item.floors.forEach(val => {
        const exceptionScreening = [''];
        const interventionType = [''];
        if (val.totalDemandInterventionSpaceCount) {
            interventionType.push('1');
        }
        if (val.totalManualSpaceCount) {
            interventionType.push('2');
        }
        if (val.haveDeviation) {
            exceptionScreening.push('1');
        }
        if (val.haveAbnormal) {
            exceptionScreening.push('2');
        }
        if (val.haveStatusAbnormal) {
            exceptionScreening.push('3');
        }
        val.interventionType = interventionType;
        val.exceptionScreening = exceptionScreening;
    });

    return { type, ...item };
};
// 根据筛选状态确定当前要展示的数组
const currentArray = computed(() => {
    let arr = [];
    if (CommonArea?.value?.demandConsistency) {
        arr = [...(CommonArea.value?.buildings.map(item => mapHandle(true, item)) || [])];
    }
    if (ParkingLot?.value?.demandConsistency) {
        arr = [...arr, ...(ParkingLot.value?.buildings.map(item => mapHandle(false, item)) || [])];
    }
    const buildings = arr.filter(item => item.type === isFiltered.value);
    buildings?.forEach(item => {
        const floors = item.floors.filter(val => val.interventionType.includes(params.value.interventionType) && val.exceptionScreening.includes(params.value.exceptionScreening));
        item.floorArr = floors;
    });
    return buildings;
});
const isEmptyFun = dataArr => {
    let isEmpty = false,
        arr = [];
    dataArr?.map(item => {
        arr.push(item.floorArr);
        if (arr.length) {
            isEmpty = true;
        } else {
            isEmpty = false;
        }
    });
    return isEmpty;
};
const paramsList = computed(() => {
    let list = [];
    if (CommonArea?.value?.buildings) {
        list.push({
            name: i18n.global.t('meos_control_web.public'),
            id: 'PUBLIC_AREA_LIGHTING'
        });
    }
    if (ParkingLot?.value?.buildings) {
        list.push({
            name: i18n.global.t('common.meos_home_parking_lot'),
            id: 'PARKING_LOT_LIGHTING'
        });
    }
    return list;
});
const list = ref([
    { name: i18n.global.t('meos_control_web.public'), id: 'PUBLIC_AREA_LIGHTING' },
    { name: i18n.global.t('common.meos_home_parking_lot'), id: 'PARKING_LOT_LIGHTING' }
]);
const InterventionTypeList = ref([
    { name: i18n.global.t('meos_control_web.manual_intervention_demand'), id: '1' },
    { name: i18n.global.t('meos_control_web.device_manual_control'), id: '2' }
]);
const ExceptionScreeningList = ref([
    { name: i18n.global.t('meos_control_web.demand_deviation'), id: '1' },
    { name: i18n.global.t('meos_control_web.abnormal_event'), id: '2' },
    { name: i18n.global.t('meos_control_web.device_status_abnormal'), id: '3' }
]);

//筛选后展开收起恢复默认
const unpackDefault = () => {
    let newArray = null;
    if (params.value.selectValue === 'PUBLIC_AREA_LIGHTING') {
        newArray = CommonArea?.value?.demandConsistency ? [...(CommonArea.value?.buildings || [])] : [];
    } else {
        newArray = ParkingLot?.value?.demandConsistency ? [...(ParkingLot.value?.buildings || [])] : [];
    }
    newArray.map(item => {
        item.showHiddle = true;
        item.rotateDegree = 0;
    });
};
//设备状态
const equipChange = value => {
    isFiltered.value = value === 'PUBLIC_AREA_LIGHTING' ? true : false;
    // templateType.value = value;
    unpackDefault();
};
const interventionTypeChange = () => {
    unpackDefault();
};
const exceptionChange = () => {
    unpackDefault();
};
//展开收起箭头
const toggleRotate = (data, index) => {
    let newArray = null;
    if (params.value?.selectValue === 'PUBLIC_AREA_LIGHTING') {
        newArray = [...(CommonArea.value?.buildings || [])];
    } else {
        newArray = [...(ParkingLot.value?.buildings || [])];
    }
    newArray[index].showHiddle = !newArray[index].showHiddle;
    newArray[index].rotateDegree = newArray[index].rotateDegree === 0 ? -90 : 0;
};
</script>

<style lang="less" scoped>
@media (max-width: 800px) {
    .list-box {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media screen and (min-width: 800px) and (max-width: 1480px) {
    .list-box {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media screen and (min-width: 1480px) and (max-width: 1919px) {
    .list-box {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media (min-width: 1919px) {
    .list-box {
        grid-template-columns: repeat(4, 1fr);
    }
}
.select-option:last-of-type {
    height: 50px !important;
}
.nodata {
    position: absolute;
    height: calc(100% - 330px);
    width: 100%;
    top: 360px;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.floors-list {
    padding-top: 10px;
    height: calc(100% - 330px);
    overflow: hidden;
    .title-box {
        line-height: 30px;
        // position: sticky;
        // top: 0;
        z-index: 50;
        background-color: #ebf6ff;
        .arrow-icon {
            transition: transform 0.5s ease;
            :deep(.fill_color) {
                fill: #8d9399 !important;
            }
        }
    }
    .list-box {
        // width: 100%;
        gap: 12px;
        display: grid;
        // background-color: red;
    }
}
.screen-item {
    position: absolute;
    top: 10px;
    right: 0;
    z-index: 51;
}
</style>
