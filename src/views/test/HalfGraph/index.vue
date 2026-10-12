<template>
    <div class="container">
        <div class="left-section">
            <HalfSectionView
                v-model:show="showHalfView"
                :target-data="targetData"
                :template-data="curTemplate"
                :use-scale="useScaleChecked === 'checked'"
                :info-groups="infoGroups"
                :is-loading="isLoading"
            />
        </div>
        <div class="right-section">
            <HalfViewEntry v-model="showHalfView" />

            <m-form-item label="启用缩放">
                <m-switch v-model="useScaleChecked" size="small"></m-switch>
            </m-form-item>
            <m-form-item label="当前模版">
                {{ targetData?.templateCode ?? '' }}
            </m-form-item>
            <m-form-item label="设备列表">
                <m-select v-model="curEquipId" :options="equipList" placeholder="请选择设备"> </m-select>
            </m-form-item>
            <!-- <m-select
                v-model="curTemplateCode"
                :options="templateList"
                placeholder="请选择模版"
            >
            </m-select> -->
        </div>
    </div>
</template>
<script setup>
import { AIR_TERMINAL, OBJ_TYPE } from '@/utils/globalVariables';
import HalfSectionView from '@/components/HalfSectionView/index.vue';
import HalfViewEntry from '@/components/HalfSectionView/HalfViewEntry.vue';
import useHalfViewDataHook from '@/components/HalfSectionView/hooks/useHalfViewDataHook';

const TEMPLATE_CODE_MAP_INFO = {
    'ACATAH-1': {
        freshAirHeatRecoveryType: '1',
        isFreshAirSection: '1',
        // 有无排风段：无
        isExhaustAirSection: '0'
    },
    'ACATAH-2': {
        freshAirHeatRecoveryType: '1',
        isFreshAirSection: '1',
        // 有无排风段：无
        isExhaustAirSection: '1'
    },
    'ACATAH-3': {
        freshAirHeatRecoveryType: '1',
        isFreshAirSection: '0',
        // 有无排风段：无
        isExhaustAirSection: '0'
    },
    'ACATFU-1': {
        heatRecoveryType: '1'
    },
    'ACATFU-2': {
        heatRecoveryType: '3'
    }
};
const show = ref(true);
const useScaleChecked = ref('checked');
// const curTemplateCode = ref('ACATAH-3');
const curEquipId = ref('Eg9522457558mdgxtcs001');
const curTemplateCode = ref('ACATFU-2');

const equipList = ref([
    {
        id: 'Eq74803828248ee634521043484485e8cfe149d583b7',
        localName: 'F4空调机组-DK-14',
        name: 'F4空调机组-DK-14',
        classCode: 'ACATAH',
        templateCode: 'ACATAH-1'
    },

    {
        id: 'Eq74803828245ee45a97fcd64d369f2c7c7377626337',
        localName: 'F4空调机组-DK-24',
        name: 'F4空调机组-DK-24',
        classCode: 'ACATAH',
        templateCode: 'ACATAH-2'
    },
    {
        id: 'Eq748038282479d39366547e469ab1e5482904aa8537',
        localName: 'F4空调机组-DK-17',
        name: 'F4空调机组-DK-17',
        classCode: 'ACATAH',
        templateCode: 'ACATAH-3'
    },
    {
        id: 'Eq7480382824dd1e3a5abc344079bdb536fbae4cfcf7',
        localName: 'F4-新风机组-21',
        name: 'F4-新风机组-21',
        classCode: 'ACATFU',
        templateCode: 'ACATFU-1'
    },
    {
        id: 'Eg9522457558mdgxtcs001',
        name: '1#空调机组控制组',
        localName: '1#空调机组控制组',
        objType: OBJ_TYPE.EQUIPGROUP,
        classCode: 'ACAHG'
    },
    {
        id: 'Eq7480382824018c6e66c9b9458893e238df3c2cd447',
        localName: 'F4-新风机组-1',
        name: 'F4-新风机组-1',
        classCode: 'ACATFU',
        templateCode: 'ACATFU-2'
    },
    {
        id: 'Eq9522457558mdgxtcs015',
        name: '新风机组关系测试001',
        localName: '新风机组关系测试001',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATFU',
        dynamicName: '新风机组关系测试001',
        heatRecoveryType: '1'
    },
    {
        id: 'Eq9522457558mdgxtcs006',
        name: '空调机组F7-关系测试001',
        localName: '空调机组F7-关系测试001',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        templateCode: 'ACATAH-2'
    },
    {
        id: 'Eq9522457558mdgxtcs033',
        name: '空调机组F7-关系测试004',
        localName: '空调机组F7-关系测试004',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        dynamicName: '空调机组F7-关系测试004',
        freshAirHeatRecoveryType: '1',
        isFreshAirSection: '1',
        isExhaustAirSection: '0'
    },
    {
        id: 'Eq9522457558mdgxtcs008',
        name: '空调机组F7-关系测试003',
        localName: '空调机组F7-关系测试003',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        dynamicName: '空调机组F7-关系测试003',
        freshAirHeatRecoveryType: '1',
        isFreshAirSection: '1',
        isExhaustAirSection: '1'
    },
    {
        id: 'Eq9522457558mdgxtcs007',
        name: '空调机组F7-关系测试002',
        localName: '空调机组F7-关系测试002',
        objType: OBJ_TYPE.EQUIPMENT,
        classCode: 'ACATAH',
        dynamicName: '空调机组F7-关系测试002',
        freshAirHeatRecoveryType: '1',
        isFreshAirSection: '0',
        isExhaustAirSection: '0'
    }
]);
const targetData = computed(() => {
    return equipList.value.find(item => item.id === curEquipId.value);
    // const info = TEMPLATE_CODE_MAP_INFO[curTemplateCode.value];
    // return { id: `Eq7480382824bb50b31b9b6d434dbc52d0bb41614c4e`, localName: 'AHU-B02-01', classCode: 'ACATAH', templateCode: curTemplateCode.value, ...info };
});
const { hasHalfSectionView, showHalfView, infoGroups, curTemplate, isLoading } = useHalfViewDataHook(targetData, AIR_TERMINAL);

const templateList = ref([
    { id: 'ACATAH-1', name: 'ACATAH-1' },
    { id: 'ACATAH-2', name: 'ACATAH-2' },
    { id: 'ACATAH-3', name: 'ACATAH-3' },
    { id: 'ACATFU-1', name: 'ACATFU-1' },
    { id: 'ACATFU-2', name: 'ACATFU-2' }
]);
</script>
<style scoped lang="less">
.container {
    display: flex;
    width: 100%;
    height: 100%;
    .left-section {
        width: calc(100% - 482px);
        height: 100%;
        border: 1px solid #cd3217;
        padding: 10px;
        background: #d6dde5;
    }
    .right-section {
        width: 480px;
        height: 100%;
        padding: 8px;
        border: 1px solid #3a4a69;
    }
}
</style>
