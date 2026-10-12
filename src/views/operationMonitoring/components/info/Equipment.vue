<template>
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="show"
        :z-index="Z_INDEX.commonDrawer"
        :shadow="true"
        :shadow-click="true"
        :drawer-class="`equipment-drawer equipment-${showType} noIframe cold-source`"
        @close="close"
    >
        <template #title>
            <div class="fb">
                <div class="fc" style="flex-wrap: wrap">
                    <div v-ellipsis class="f18 m-ellipsis space-title mt4 mr4">{{ localName ?? '--' }}&nbsp;&nbsp;</div>
                    <div v-if="tagsValue" class="mr16 top-title-tag">
                        <tags :data-obj="tagsValue" />
                    </div>
                </div>

                <div v-if="isEquipDetailIconVisible()" class="fc" style="height: 28px; padding: 4px 0 4px 4px; margin-top: 2px">
                    <m-tips :content="i18n.global.t('meos_control_web.open_equipment_detail_in_new_tab')" theme="darkTransparent" placement="left">
                        <div class="icon-link fcc hover-bgc" @click="itemInfo">
                            <SvgIcon name="detail" />
                        </div>
                    </m-tips>
                    <div class="get-line ml8 mr4"></div>
                </div>
            </div>
        </template>
        <template #content>
            <template v-if="!loading">
                <div class="tabs-for-custom-box-container">
                    <m-tabs v-model="tabModel" size="large" :data="currentTabList" />
                </div>
                <m-scrollbar v-show="tabModel === '1'" :height="'calc(100% - 41px)'">
                    <div v-if="isRunStatusEmpty" class="tab-for-custom-no-data-container">
                        <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
                    </div>
                    <div ref="contentContainerRef">
                        <!-- 非补水监测控制台 -->
                        <div v-if="canControl && showRunSet && HASAUTO().includes(classCode) && isEdge()" class="box-item">
                            <div class="box-item-title f16">{{ i18n.global.t('meos_control_web.console') }}</div>
                            <AutoSet :id="id" :manual-auto-set="manualAutoSet" :expire-time="expireTime" />
                        </div>
                        <!-- 参数设定 -->
                        <div v-if="canControl && showRunSet && HASCONTROL().includes(classCode) && isEdge()" class="mt12 mb24">
                            <!-- <div class="box-item-title f16">{{ equipmentNode.Iot.runSetName }}</div> -->
                            <div v-if="noEnumList.length" class="runset-title f14 fb7">{{ equipmentNode.Iot.runSetName }}</div>
                            <EquipmentParamsSet :manual-auto-set="manualAutoSet" :list="equipmentNode.Iot.runSet" :class-code="classCode" />
                        </div>
                        <!-- 补水监测控制台 -->
                        <div v-if="canControl && showRunSet && WATERREFILLTEXT().includes(classCode) && isEdge()" class="box-item">
                            <div class="box-item-title f16">{{ i18n.global.t('meos_control_web.console') }}</div>
                            <AutoSet v-if="classCode == 'ACGEFP'" :id="id" :manual-auto-set="manualAutoSet" :expire-time="expireTime" />
                            <MonitoringEquipmentControl :manual-auto-set="manualAutoSet" :list="equipmentNode.Iot.runSet" :class-code="classCode" />
                        </div>
                        <template v-if="classCode === 'ACCCOP' || classCode === 'ACCCCP'">
                            <div v-if="pumpName" class="box-item">
                                <div class="box-item-title f16">{{ pumpName }}</div>
                                <EquipmentOperationInfo :list="pump" />
                            </div>
                        </template>
                        <template v-if="classCode === 'ACOTU'">
                            <div v-if="fanList.length" class="box-item">
                                <div class="box-item-title f16">{{ i18n.global.t('meos_control_web.fan_info') }}</div>
                                <FanAndWaterValve :other-id="otherId" :list="fanList" type="1" :manual-auto-set="manualAutoSet" :class-code="classCode" />
                            </div>
                            <div v-if="waterValveList.length" class="box-item">
                                <div class="box-item-title f16">{{ i18n.global.t('meos_control_web.water_valve_info') }}</div>
                                <FanAndWaterValve :other-id="otherId" :list="waterValveList" type="2" :manual-auto-set="manualAutoSet" :class-code="classCode" />
                            </div>
                        </template>
                        <template v-if="showRunInfo">
                            <div class="box-item">
                                <div class="box-item-title f16">{{ equipmentNode.IotTwo.runInfoCode.groupName }}</div>
                                <EquipmentOperationInfo :list="equipmentNode.IotTwo.runInfoCode" />
                            </div>
                        </template>
                        <template v-if="showBasicInfo">
                            <div class="box-item">
                                <div class="box-item-title f16">{{ equipmentNode.IotTwo.basicInfoCode.groupName }}</div>
                                <EquipmentOperationInfo :list="equipmentNode.IotTwo.basicInfoCode" />
                            </div>
                        </template>
                    </div>
                </m-scrollbar>
                <Relationship v-show="tabModel === '2'" :id="id" :class-code="classCode" />
                <SERelEquipmentList
                    v-if="tabModel === 'rel'"
                    class="se-relequipmentlist"
                    :select-obj="selectObj"
                    :group-list="groupList"
                    :running-monitor-type="runningMonitorType"
                    @click-equip="openEquipment"
                />
                <div v-if="tabModel === 'abnormal'" class="tab-for-custom-abnormal-container">
                    <AbnormalList
                        :abnormal-event-list="abnormalEventList"
                        :abnormal-event-list-loaded-time="curDateString"
                        :abnormal-event-list-loading="loadingAbnormal"
                        :abnormal-event-list-update-time="curAbnormalUpdateTime"
                        :show-type="'tab'"
                        :padding-right="24"
                    />
                </div>
            </template>
        </template>
    </m-drawer>
</template>

<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import { useEquipment } from './use-equipment';
import AutoSet from './AutoSet.vue';
import EquipmentParamsSet from './EquipmentParamsSet.vue';
import EquipmentOperationInfo from './EquipmentOperationInfo.vue';
import FanAndWaterValve from './FanAndWaterValve.vue';
import Relationship from './Relationship.vue';
import { HASCONTROL, HASAUTO, WATERREFILLTEXT } from '../../../operationMonitoring/coolVariables';
import baseStore from '@/store/baseStore';
const base = baseStore();
import SvgIcon from '@/components/common/SvgIcon.vue';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { openWebsite } from '@/utils/websiteNavigation';
import MonitoringEquipmentControl from './MonitoringEquipmentControl.vue';
import { isEdge, getAuthParamsString, abnormalJumpFun } from '@/utils/envUtils';
import { OBJ_TYPE } from '@/utils/globalVariables';
import tags from '@/components/tsgs/index.vue';
import SERelEquipmentList from './SERelEquipmentList.vue';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import { useElementSize } from '@vueuse/core';

const props = defineProps({
    classCode: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: ''
    },
    otherId: {
        type: String,
        default: ''
    },
    localName: {
        type: String,
        default: ''
    },
    runningMonitorType: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['close', 'changeTree']);
const systemId = inject('systemId');
const systemClassCode = inject('systemClassCode');
const majorCode = inject('majorCode');
const {
    show,
    manualAutoSet,
    fanList,
    expireTime,
    waterValveList,
    equipmentNode,
    loading,
    showRunSet,
    showRunInfo,
    showBasicInfo,
    showType,
    pumpName,
    pump,
    abnormalEventList,
    loadingAbnormal,
    curAbnormalUpdateTime,
    state,
    tagsValue
} = useEquipment(props);
const main = ref();
const curDateString = new Date().toISOString();

const noEnumList = computed(() => {
    const data = equipmentNode.value.Iot.runSet.filter(item => item.infoCode !== 'manualAutoSet');
    return data;
});
const selectObj = computed(() => {
    if (props.id) {
        return {
            id: props.id,
            localName: props.localName,
            classCode: props.classCode
        };
    }
    return null;
});

const isEquipDetailIconVisible = () => {
    return (
        base.hasAuth('MEOI_CatalogList') && // MEOI_CatalogList权限
        equipmentNode.value?.stateInfoCode?.objType &&
        equipmentNode.value?.stateInfoCode?.objType !== OBJ_TYPE.EQUIPGROUP // 设备组
    );
};

const itemInfo = () => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${props.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};

const close = () => {
    show.value = false;
    // const header: any = document.querySelector('.saasweb-header');
    // if (header) {
    //     header.style.zIndex = 2;
    // }
    nextTick(() => {
        emits('close');
    });
};
const tabModel = ref('1');
// const tabList = ref([
//     { id: '1', name: '运行情况' },
//     { id: '2', name: '关联设备' }
// ]);
// const tabListSE = ref([
//     { id: '1', name: '运行情况' },
//     { id: 'rel', name: i18n.global.t('meos_control_web.related_info') }
// ]);
const seTabs = [
    { id: '1', name: i18n.global.t('meos_control_web.operation_monitoring_alt') },
    { id: 'abnormal', name: i18n.global.t('meos_control_web.abnormal_event') },
    { id: 'rel', name: i18n.global.t('meos_control_web.related_info') }
];
const baseTabs = [
    { id: '1', name: i18n.global.t('meos_control_web.operation_monitoring_alt') },
    { id: 'abnormal', name: i18n.global.t('meos_control_web.abnormal_event') }
];
const tabListWithBase = ref(baseTabs);
const tabListWithSe = ref(seTabs);
const currentTabList = computed(() => {
    return props.classCode === 'SETDLC' ? tabListWithSe.value : tabListWithBase.value;
});

// 是否可以控制，针对热源，暂时不可控
const canControl = computed(() => {
    return majorCode?.value !== 'ACCH';
});

const contentContainerRef = ref(null);
const { height } = useElementSize(contentContainerRef);

const isRunStatusEmpty = computed(() => {
    return height.value < 34;
});

onMounted(() => {
    // nextTick(() => {
    //     const header: any = document.querySelector('.saasweb-header');
    //     if (header) {
    //         header.style.zIndex = 9999;
    //     }
    // });
    if (showType.value === '2D') {
        nextTick(() => {
            main.value = document.querySelector('.xplant-runmonitor-main');
            main.value?.addEventListener('click', close);
        });
    }
});
onUnmounted(() => {
    main.value?.removeEventListener('click', close);
});

provide('expireTime', expireTime);
provide('systemId', systemId);
provide('systemClassCode', systemClassCode);
provide('equipmentNode', equipmentNode); //iot数据
provide('abnormalEventList', abnormalEventList); //异常列表数据
</script>
<style lang="less" scoped>
:deep(.circular) {
    width: 21px !important;
    height: 21px !important;
    circle {
        stroke: #626c78 !important;
    }
}
:deep(.el-loading-mask) {
    background: var(--gray-50, #f7f9fa);
}
:deep(.el-loading-spinner) {
    margin-top: -10px !important;
}
.loading-content {
    width: 100%;
    min-height: 44px;
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
}
.se-relequipmentlist {
    height: calc(100% - 41px);
}
</style>
<style lang="less">
.cold-source {
    .m-drawer-container-header {
        height: auto;
        align-items: normal;
    }
    .m-drawer-container-header-icon {
        margin-top: 4px;
    }
}
@media screen and (min-width: 1600px) {
    .equipment-drawer {
        .m-drawer-container {
            width: 480px !important;
        }
    }
    .setting-name {
        max-width: 200px;
    }
    .space-title {
        max-width: 310px;
    }
}
@media screen and (max-width: 1600px) {
    .equipment-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
    }
    .setting-name {
        max-width: 132px;
    }
    .space-title {
        max-width: 225px;
    }
}

.noIframe {
    .m-drawer-mask,
    .m-drawer-container {
        top: 48px;
        z-index: 1;
    }
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }
}
.runset-title {
    width: 100%;
    padding: 0px 8px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    margin-bottom: 12px;
    background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0) 100%);
}
.equipment-good {
    width: 100%;
    padding: 12px 20px;
    background-color: #f7f9fa;
}

.equipment-drawer {
    .icon-link {
        // padding-right: 8px;
        // margin-right: 8px;
        // border-right: 1px solid var(--gray-300);
        height: 20px;
        cursor: pointer;
    }
    .m-drawer-mask {
        display: none;
    }
    .m-drawer-container-header {
        border-bottom: none;
        padding-bottom: 10px;
    }
    .m-drawer-mask {
        background-color: transparent;
    }
    .m-drawer-container-content {
        width: 100%;
        padding: 0;
        overflow: hidden;

        .m-scrollbar__box {
            padding: 16px 24px 0 24px;
        }

        .abnormal-wrap {
            .m-scrollbar__box {
                padding: 0px;
            }
        }

        // .m-tabs {
        //     padding: 0 20px;
        //     border-bottom: 1px solid var(--gray-200);
        // }
    }
    .box-item {
        & + .box-item {
            margin-top: 22px;
        }
        .box-item-title {
            padding-left: 8px;
            font-weight: 700;
            position: relative;
            height: 22px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            & > span {
                font-size: 12px;
                font-weight: 500;
                color: #8d9399;
                margin-left: 8px;
            }
            &::after {
                position: absolute;
                width: 3px;
                height: 14px;
                content: '';
                display: block;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                background-color: var(--blue-500);
            }
        }
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
}
.hover-bgc {
    padding: 2px;
    border-radius: 2px;
}
.hover-bgc:hover {
    border-radius: 2px;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    padding: 2px;
}
.get-line {
    width: 1px;
    height: 14px;
    background: #d9d9d9;
}
.tab-for-custom-abnormal-container {
    padding: 16px 24px;
    padding-right: 0px;
    height: calc(100% - 42px);
}
.tab-for-custom-no-data-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.tabs-for-custom-box-container {
    border-bottom: 1px solid #e8ecf0;
    .m-tabs {
        width: 100%;
        padding: 0 12px;
    }
    .m-tabs-list {
        height: 42px;
        line-height: 1;
    }
    .m-tabs-name {
        line-height: 1;
    }
}
</style>
