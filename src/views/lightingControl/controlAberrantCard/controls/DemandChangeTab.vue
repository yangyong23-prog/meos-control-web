<!--
 * @Author: guoxiaohuan
 * @Date: 2024-04-26 11:29:11
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2025-09-19 17:44:10
 * @Description:
-->
<template>
    <div class="controls-container">
        <DemandChange />
        <div class="controls-container-title">{{ i18n.global.t('meos_control_web.current_demand_satisfaction') }}</div>
        <DemandSituation />
        <div class="controls-container-title">
            {{ i18n.global.t('meos_control_web.current_device_status') }}
            <div v-if="templateType" class="controls-container-title-right">
                <m-button type="link" size="medium" @click.stop="openEquipmentList(templateType)">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
            </div>
        </div>
        <EqState />
        <div class="controls-container-title">{{ i18n.global.t('meos_control_web.illuminance_monitoring') }}</div>
        <Monitoring />
        <div class="controls-container-title">{{ i18n.global.t('meos_control_web.outdoor_weather') }}</div>
        <OutdoorWeather />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DemandChange from './demandChange.vue';
import DemandSituation from './demandSituation.vue';
import EqState from './eqState.vue';
import Monitoring from './monitoring.vue';
import OutdoorWeather from './outdoorWeather.vue';
import useControlsInfo from '../../hooks/useControlsInfo';
import { loopControlList } from '@/store/loopControlList';
import useStore from '@/store';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
const curFloorId = inject('curFloorId');
const templateType = inject('templateType');
const openEquipmentList = inject('openEquipmentList');
useControlsInfo();
const loopListStore = loopControlList();

const showList = metaList => {
    let baseObj, params;
    if (curFloorId?.value) {
        baseObj = { instanceType: 'FLOOR', instanceId: curFloorId.value, templateType: templateType?.value };
    } else {
        baseObj = { templateType: templateType?.value };
    }
    if (metaList.type === 'loop') {
        params = baseObj ? Object.assign(metaList, { hlInfo: baseObj }) : metaList;
    } else {
        params = baseObj ? Object.assign(metaList, { coInfo: baseObj }) : metaList;
    }
    // console.log('params: ', params);
    loopListStore.setList(params);
    loopListStore.setVisible(true);
};
// templateType.value !== 'PUBLIC_AREA_LIGHTING';
// const showListBtn = computed(() => {
//     if (templateType.value === 'PUBLIC_AREA_LIGHTING') {
//         if (xplantindoorenvStore()?.buildingData) {
//             return true;
//         } else {
//             return false;
//         }
//     } else {
//         return true;
//     }
// });
const store = useStore();
const { projectId } = store.base;

const getTreeBuildingFloor = () => {
    // eslint-disable-next-line one-var
    let parasm = {
        projectId
    };
    return getListTreeBuildingFloorSpace(parasm).then(res => {
        const { data, code } = res;
        // eslint-disable-next-line eqeqeq
        if (code == '00000') {
            loopListStore.setBuildingData(data);
        }
    });
};

onMounted(() => {
    getTreeBuildingFloor();
});
</script>

<style lang="less" scoped>
.controls-container {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
    user-select: none; /* 标准语法 */
    padding-inline: 16px;
    padding-top: 20px;
    &-title {
        color: @grey-800;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-right {
            display: flex;
            align-items: center;
            .text {
                font-weight: var(--platform-font-weight);
                color: @grey-600;
                font-size: 14px;
            }
            .line {
                width: 1px;
                height: 14px;
                background: #d9d9d9;
                margin: 0 4px;
            }
        }
    }
    .controls-container-title-padding {
        margin-bottom: 0;
    }
}
</style>
