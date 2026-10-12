<template>
    <m-scrollbar v-if="!isEmpty" box-class="control-console-box-scrollbar" @scroll="onScroll">
        <slot v-if="$slots.top" name="top"></slot>
        <template v-if="settings?.relInfoCodeConfigs?.length > 0">
            <div class="title f16 fb7 mt20 mb12">{{ settings.groupName }}</div>
            <div class="settings">
                <independentSetting :list="settings" :select-obj="selectObj" v-bind="$attrs" />
            </div>
        </template>
        <template v-if="environmentalParameter?.relInfoCodeConfigs?.length">
            <div class="title f16 fb7 mt20 mb12">{{ environmentalParameter.groupName }}</div>
            <EnvironmentalParameter :current-statistic-arr="environmentalParameter" :select-obj="selectObj" />
        </template>
        <template v-if="!props.hideLinkedEquipment && relEquipGroups.length">
            <div class="title f16 fb7 mt20 mb12">{{ i18n.global.t('meos_control_web.related_equipment') }}</div>
            <associatedDeviceSewage
                v-if="runningMonitorType === 'SEWAGE' && selectObj.objType === OBJ_TYPE.SPACE"
                :data="relEquipGroups"
                v-bind="$attrs"
                :running-monitor-type="runningMonitorType"
                :select-obj="selectObj"
            />
            <RelEquipList v-else-if="runningMonitorType === 'SEWAGE'" :data="relEquipGroups" v-bind="$attrs" :running-monitor-type="runningMonitorType" :select-obj="selectObj" />
            <associatedDevice
                v-else
                :data="relEquipGroups"
                v-bind="$attrs"
                :running-monitor-type="runningMonitorType"
                :select-obj="selectObj"
                @open-monitor-player="
                    (...params) => {
                        emits('openMonitorPlayer', ...params);
                    }
                "
            />
        </template>
        <template v-if="!hideInspection && Object.keys(inspectionInformation?.dataValue || {}).length != 0">
            <div class="title f16 fb7 mt20 mb12">{{ i18n.global.t('meos_control_web.inspection_info') }}</div>
            <InspectionInformation :inspection-information="inspectionInformation?.dataValue" />
        </template>
        <template v-if="accessRecognizerList.length">
            <div class="title f16 fb7 mt20 mb12">{{ i18n.global.t('meos_control_web.related_access_reader') }}</div>
            <AccessRecognizer :list="accessRecognizerList" :select-obj="selectObj" />
        </template>
        <template v-if="spaceAllData?.length">
            <div class="title f16 fb7 mt20 mb12">{{ i18n.global.t('meos_control_web.located_space') }}</div>
            <div v-for="(item, index) in spaceAllData" :key="index">
                <SpaceInfo
                    v-bind="$attrs"
                    :list="item"
                    :select-obj="selectObj"
                    :running-monitor-type="runningMonitorType"
                    @open-monitor-player="
                        (...params) => {
                            emits('openMonitorPlayer', ...params);
                        }
                    "
                />
            </div>
        </template>
        <template v-if="parameterInformation?.length">
            <div v-for="(item, index) in parameterInformation" :key="index">
                <div class="title f16 fb7 mt20 mb12">{{ item.groupName }}</div>
                <EquipmentOperationInfo :filter-codes="filterCodes" :list="item" :select-obj="selectObj" />
            </div>
        </template>
        <template v-if="basicInfo?.length">
            <div v-for="(item, index) in basicInfo" :key="index">
                <div class="title f16 fb7 mt20 mb12">{{ item.groupName }}</div>
                <EquipmentOperationInfo :list="item" :select-obj="selectObj" />
            </div>
        </template>
        <template v-if="technicalParameterList?.length">
            <div v-for="(item, index) in technicalParameterList" :key="index">
                <div class="title f16 fb7 mt20 mb12">{{ item.groupName }}</div>
                <EquipmentOperationInfo :list="item" :select-obj="selectObj" />
            </div>
        </template>
    </m-scrollbar>
    <div v-else class="no-data">
        <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import EquipmentOperationInfo from './EquipmentOperationInfo.vue';
import independentSetting from '@/components/independentSetting/index.vue';
import AccessRecognizer from '@/views/Common/AccessRecognizer/index.vue';
import SpaceInfo from './SpaceInfo.vue';
import EnvironmentalParameter from '../EnvironmentalParameter/index.vue';
import InspectionInformation from '../InspectionInformation/index.vue';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import { MLoading } from 'meri-plus';
import associatedDevice from '@/views/Common/associatedDevice/index.vue';
import associatedDeviceSewage from '@/views/Common/associatedDeviceSewage/index.vue';

import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { listInfoCodeConfigsByObject } from '@/apis/airterminalxplantrunmonitor';

import DockSingleton from '@/hooks/responsiveDock';

import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import RelEquipList from './RelEquipList.vue';
import dataDockHandling from '@/hooks/dataDockHandling';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import { DETAIL, OBJ_TYPE } from '@/utils/globalVariables';

const { setAbnormalEvent, getAbnormalEventsList, clearAbnormalEventsList, getCustomInfo, setCustomInfo } = DockSingleton.getInstance();

const { writeDataToResponsiveDock } = dataDockHandling();
const commonDrawerRoot = inject(commonDrawerRootContextKey);
const props = defineProps({
    hideAbnormalList: {
        type: Boolean,
        default: false
    },
    hideInspection: {
        type: Boolean,
        default: false
    },
    hideLinkedEquipment: {
        type: Boolean,
        default: false
    },
    runningMonitorType: {
        type: String,
        default: ''
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    sseClient: {
        type: Object,
        default: null
    },
    initClosePlayer: {
        type: Boolean,
        default: false
    },
    filterCodes: {
        type: Array,
        default: () => []
    },
    useNewApi: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['loadInSpaceIds', 'closeMonitorPlayer', 'openMonitorPlayer', 'init-abnormal-list']);

const settings = ref({});
const parameterInformation = ref([]);
const basicInfo = ref([]);
const spaceAllData = ref([]);
const _abnormalEventList = ref([]);
const technicalParameterList = ref([]);
const proxyAbnormalEventList = ref([]);
const relEquipGroups = ref([]);
const accessRecognizerList = ref([]);
const settingRef = ref(null);
const openOrCloseRef = ref(null);
const controlModelRef = ref(null);
const disinterventionRef = ref(null);
const environmentalParameter = ref({});
const isEmpty = ref(false);

const listInfoCodeConfigsApiToken = UseCancelTokenHooks();
// const inspectionInformationObj = ref({});
const equipmentId = computed(() => {
    return props.selectObj.id;
});

let propsSseClient = props.sseClient || commonDrawerRoot?.demandSseClient;

useEquipInfoSSEHandle(
    equipmentId,
    {
        equipParameterSet: settings,
        runningParameter: parameterInformation,
        basicInfo: basicInfo,
        inSpace: spaceAllData,
        RISK_EVENT_DETAIL: _abnormalEventList,
        techniqueParameter: technicalParameterList
        // ROUTING_INSPECTION: inspectionInformationObj
    },
    true,
    DETAIL,
    propsSseClient
);

const riskEventType = ref('');
const loadingInstanceRef = ref();
const fetchAbortController = ref();

const abnormalEventList = computed(() => {
    if (commonDrawerRoot?.props.isSubscriptOnDemand) {
        return getAbnormalEventsList([props?.selectObj?.id]);
        // if (riskEventType.value === 'RISK_EVENT_DETAIL_SPACE_WITH_EQUIPMENTS') {
        //     return getAbnormalEventsList(o => o.id === props?.selectObj?.id || o.inSpaceIds?.includes(props?.selectObj?.id));
        // } else {
        //     return getAbnormalEventsList(o => o.id === props?.selectObj?.id);
        // }
    } else {
        return _abnormalEventList.value;
    }
});

const onScroll = () => {
    settingRef?.value?.popoverRef.updatePosition();
    openOrCloseRef?.value?.popoverRef.updatePosition();
    controlModelRef?.value?.popoverRef.updatePosition();
    disinterventionRef?.value?.popoverRef.updatePosition();
};
const initModule = loading => {
    relEquipGroups.value = [];
    settings.value = {};
    parameterInformation.value = [];
    basicInfo.value = [];
    isEmpty.value = false;
    spaceAllData.value = [];
    _abnormalEventList.value = [];
    technicalParameterList.value = [];
    proxyAbnormalEventList.value = [];
    environmentalParameter.value = {};

    fetchAbortController?.value?.abort();
    fetchAbortController.value = new AbortController();
    listInfoCodeConfigsApiToken.cancelQuest();
    if (loading) {
        loadingInstanceRef?.value?.destroy?.();
        loadingInstanceRef.value = MLoading.service({
            target: '.control-console-box-scrollbar',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    }
    const params = { runningMonitorType: props.runningMonitorType, objectIds: [props.selectObj?.id], templateCode: DETAIL };

    let queryDyncInfoPromise = null;
    if (props.useNewApi) {
        queryDyncInfoPromise = listInfoCodeConfigsByObjectIdCommon(params, fetchAbortController.value.signal);
    } else {
        queryDyncInfoPromise = listInfoCodeConfigsByObject(params, { signal: fetchAbortController.value.signal });
    }

    // Sp74803828241c2dd5e7acb24cddb2f9b6b5db247168
    queryDyncInfoPromise
        .then(res => {
            // inspectionInformationObj.value = {};

            res.data[0]?.relInfoCodeGroupConfigs?.map(item => {
                if (item.groupCode === 'equipParameterSet') {
                    //参数设定
                    settings.value = item;
                }
                if (item.groupCode === 'inSpace') {
                    //所在空间
                    spaceAllData.value.push(item.relInfoCodeConfigs);
                }
                if (item.groupCode === 'relEquipment') {
                    // 关联设备
                    if (props?.runningMonitorType === 'SEWAGE' && props?.selectObj?.objType === OBJ_TYPE.SPACE) {
                        relEquipGroups.value = item?.relInfoCodeConfigs.filter(r => Array.isArray(r.dataValue) && r.dataValue.length > 0) || [];
                    } else {
                        relEquipGroups.value = item.relInfoCodeConfigs[0].dataValue || [];
                        if (!relEquipGroups.value.length) {
                            emits('closeMonitorPlayer');
                        } else {
                            console.log('relEquipGroups.value[0]>>>>', relEquipGroups.value[0]);
                            if (!props.initClosePlayer) {
                                emits(
                                    'openMonitorPlayer',
                                    relEquipGroups.value[0],
                                    relEquipGroups.value[0]?.relInfoCodeGroupConfigs?.find(group => group.groupCode === 'equipStatus')
                                );
                            }
                        }
                    }
                }
                if (item.groupCode === 'runningParameter') {
                    if (item?.groupChildren && item.groupChildren.length && props.filterCodes && props.filterCodes?.length) {
                        const validInfos = [];
                        item.groupChildren.forEach(relinfo => {
                            relinfo?.relInfoCodeConfigs?.forEach(info => {
                                if (!props.filterCodes?.includes(info?.infoCode)) {
                                    validInfos.push(info?.infoCode);
                                }
                            });
                        });
                        if (validInfos.length) {
                            //运行参数
                            parameterInformation.value.push(item);
                        }
                    } else {
                        //运行参数
                        parameterInformation.value.push(item);
                    }
                }
                if (item.groupCode === 'techniqueParameter') {
                    //技术参数
                    technicalParameterList.value.push(item);
                }

                if (item.groupCode === 'basicInfo') {
                    //基本信息
                    basicInfo.value.push(item);
                }

                if (item.groupCode === 'riskEvent') {
                    //异常事件
                    riskEventType.value = item?.relInfoCodeConfigs[0].infoCodeType;
                    if (
                        item?.relInfoCodeConfigs[0].infoCodeType === 'RISK_EVENT_DETAIL_SPACE_WITH_EQUIPMENTS' ||
                        item?.relInfoCodeConfigs[0].infoCodeType === 'RISK_EVENT_DETAIL'
                    ) {
                        _abnormalEventList.value = item?.relInfoCodeConfigs[0].dataValue || [];
                        emits('init-abnormal-list', _abnormalEventList.value);
                        // 按需订阅时收集sse订阅参数
                        if (commonDrawerRoot?.props.isSubscriptOnDemand) {
                            clearAbnormalEventsList([props?.selectObj?.id]);
                            _abnormalEventList.value?.forEach(ab => {
                                setAbnormalEvent(ab);
                            });
                        }
                    }
                }
                if (item.groupCode === 'relCardReader') {
                    accessRecognizerList.value = item?.relInfoCodeConfigs[0].dataValue || [];
                }
                //环境参数
                if (item.groupCode === 'enviroParameter') {
                    environmentalParameter.value = item;
                }
                //巡检信息
                if (item.groupCode === 'routingInspection') {
                    const inspectionInformationObj = item?.relInfoCodeConfigs?.[0] || [];
                    if (inspectionInformationObj) {
                        setCustomInfo(props.selectObj?.id, inspectionInformationObj, inspectionInformationObj.infoCodeType, inspectionInformationObj.infoCode);
                    }
                }
            });
            const inSpaceIds = [];
            spaceAllData.value.forEach(obj => {
                obj.forEach(it => {
                    it.dataValue?.forEach(item => {
                        inSpaceIds.push(item.id);
                    });
                });
            });
            isEmpty.value = !(
                (!props.hideAbnormalList && abnormalEventList.value?.length) ||
                settings.value?.relInfoCodeConfigs?.length ||
                environmentalParameter.value?.relInfoCodeConfigs?.length ||
                relEquipGroups.value?.length ||
                (!props.hideInspection && Object.keys(inspectionInformation.value?.dataValue || {}).length) ||
                accessRecognizerList.value?.length ||
                spaceAllData.value?.length ||
                parameterInformation.value?.length ||
                basicInfo.value?.length ||
                technicalParameterList.value?.length
            );

            emits('loadInSpaceIds', inSpaceIds);

            // 按需订阅时收集sse订阅参数
            if (commonDrawerRoot?.props.isSubscriptOnDemand) {
                const { classCodeIds } = iterateObjct4InstanceInfo(res.data);
                commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);
                // traverseObjectItems(res.data, (ownObj, info) => {
                //     if (ownObj?.id && info?.infoCode && isIotInfoType(info?.infoCodeType)) {
                //         setIotData(ownObj?.id, info?.infoCode, info);
                //     }
                // });
                // console.log('writeDataToResponsiveDock.data: ', res.data);
                writeDataToResponsiveDock(res.data);
            }
            loadingInstanceRef?.value?.destroy?.();
        })
        .catch(() => {
            loadingInstanceRef?.value?.destroy?.();
        })
        .finally(() => {
            loadingInstanceRef?.value?.destroy?.();
        });
};
onMounted(() => {
    initModule(true);
});

const inspectionInformation = computed(() => {
    return getCustomInfo(props.selectObj?.id, 'ROUTING_INSPECTION', 'onsiteinfodetail') || {};
});
watch(
    () => props.selectObj,
    () => {
        if (props.selectObj?.id) {
            initModule(true);
        }
    }
);
provide('settingRef', settingRef);
provide('openOrCloseRef', openOrCloseRef);
provide('controlModelRef', controlModelRef);
provide('disinterventionRef', disinterventionRef);
</script>
<style lang="less" scoped>
:deep(.control-console-box-scrollbar) {
    padding: 0 24px 16px 24px;
}
.title {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    height: 22px;
    line-height: 22px;

    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500);
        content: '';
    }
}
.settings {
    width: 100%;
    padding: 8px 0px;
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
}
.exception-list {
    &-item {
        position: relative;
        padding: 12px 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #fffbfb 0.85%, rgba(255, 255, 255, 0) 96.02%);
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
.exception-list-item:hover {
    cursor: pointer;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}
.equipment-good {
    width: 100%;
    padding: 12px 20px;
    background-color: #f7f9fa;
}
.abnormal-list-warp {
    :deep(.abnormal-item) {
        margin-right: 0px !important;
    }
}
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
