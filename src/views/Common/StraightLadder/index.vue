<template>
    <m-scrollbar box-class="straight-ladder-scrollbar" :height="'100%'">
        <!-- <div class="title f16 fb7">{{ i18n.global.t('meos_control_web.abnormal_event') }}</div>
        <div class="exception-list">
            <FoldWrap v-model="proxyAbnormalEventList" :data="abnormalEventList">
                <AbnormalList class="abnormal-list-warp" :abnormal-event-list="proxyAbnormalEventList" :single-exception="true" :empty="false" :title-show="false" />
            </FoldWrap>
        </div> -->
        <template v-if="relEquipGroups.length">
            <div class="title f16 fb7">{{ i18n.global.t('meos_control_web.related_equipment') }}</div>
            <associatedDevice
                :data="relEquipGroups"
                @open-monitor-player="
                    item => {
                        emits('clickPlayer', item);
                    }
                "
            />
        </template>
        <template v-if="parameterInformation?.length">
            <div v-for="(item, index) in parameterInformation" :key="index">
                <div class="title f16 fb7 mt28 mb12">{{ item.groupName }}</div>
                <EquipmentOperationInfo :list="item" :select-obj="selectObj" />
            </div>
        </template>
        <template v-if="technicalParameterList?.length">
            <div v-for="(item, index) in technicalParameterList" :key="index">
                <div class="title f16 fb7 mt28 mb12">{{ item.groupName }}</div>
                <EquipmentOperationInfo :list="item" :select-obj="selectObj" />
            </div>
        </template>
    </m-scrollbar>
</template>
<script setup>
import { listInfoCodeConfigsByObject } from '@/apis/airterminalxplantrunmonitor';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import FoldWrap from '@/components/common/FoldWrap.vue';
import associatedDevice from '@/views/Common/associatedDevice/index.vue';
import EquipmentOperationInfo from '@/views/Common/EquipDetails/EquipmentOperationInfo.vue';
import { MLoading } from 'meri-plus';
const emits = defineEmits(['loadedRelationObjs', 'clickPlayer']);
const props = defineProps({
    selectObj: {
        type: Object,
        default: () => {}
    },
    runningMonitorType: {
        type: String,
        default: ''
    }
});
const abnormalEventList = ref([]);
const proxyAbnormalEventList = ref([]);
const parameterInformation = ref([]);
const technicalParameterList = ref([]);

const equipId = computed(() => {
    return props.selectObj.id;
});
useEquipInfoSSEHandle(
    equipId,
    {
        RISK_EVENT_DETAIL: abnormalEventList,
        techniqueParameter: technicalParameterList,
        runningParameter: parameterInformation
    },
    true,
    DETAIL
);

const relEquipGroups = ref([]);

let loadingService;

const getData = async () => {
    if (!props.selectObj?.id || !props.runningMonitorType) return;
    loadingService = MLoading.service({
        target: '.straight-ladder-scrollbar',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        background: '#fff',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
    // 测试关联模式
    // emits('loadedRelationObjs', ['Eq6101122010f5c64d1ad54d4eb28aa8f07f001f6865']);
    listInfoCodeConfigsByObject({ runningMonitorType: props.runningMonitorType, objectIds: [props.selectObj.id], templateCode: DETAIL })
        .then(res => {
            if (res.code === SUCCESSCODE) {
                res.data[0]?.relInfoCodeGroupConfigs?.forEach(item => {
                    if (item.groupCode === 'riskEvent') {
                        //异常事件
                        abnormalEventList.value = item?.relInfoCodeConfigs[0].dataValue || [];
                    }
                    if (item.groupCode === 'relEquipment') {
                        // 关联设备
                        relEquipGroups.value = item.relInfoCodeConfigs[0].dataValue || [];
                    }
                    if (item.groupCode === 'runningParameter') {
                        //运行参数
                        parameterInformation.value.push(item);
                    }
                    if (item.groupCode === 'techniqueParameter') {
                        //技术参数
                        technicalParameterList.value.push(item);
                    }
                });
            }
            loadingService?.destroy();
            loadingService = null;
        })
        .catch(() => {
            loadingService?.destroy();
            loadingService = null;
        });
};

watch(
    () => props.selectObj,
    () => {
        getData();
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
:deep(.straight-ladder-scrollbar) {
    padding: 0 10px 0 24px;
}

.title {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    height: 22px;
    line-height: 22px;
    margin: 16px 0;
    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500, #246fe5);
        content: '';
    }
}

.exception-list {
    padding-right: 10px;
    &-item {
        position: relative;
        padding: 12px 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #fffbfb 0.85%, rgba(255, 255, 255, 0) 96.02%);
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    &-title {
        padding-left: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
    &-title:before {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #f55047;
        border: 1px solid #fff;
        left: 10px;
        top: 18px;
    }
}
</style>
