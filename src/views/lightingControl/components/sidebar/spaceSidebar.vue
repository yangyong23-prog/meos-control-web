<template>
    <m-drawer :append-to="$drawerAppendTo" :show="show" :z-index="Z_INDEX.commonDrawer" :shadow-click="false" :drawer-class="`light-control-space-drawer noIframe`" @close="close">
        <template #title>
            <div class="fb">
                <div ref="myElement" :class="['fc']" style="flex-wrap: wrap">
                    <div v-ellipsis class="f18 m-ellipsis space-title mt4">{{ localName ?? '--' }}&nbsp;&nbsp;</div>
                    <div class="mr16 top-title-tag">
                        <m-tag v-if="spaceData.relFloor" size="small" color="#1B4ACC" bg-color="#D9EBFF" class="info-tag"> {{ spaceData.relFloor.localName ?? '--' }} </m-tag>
                        <m-tag v-if="spaceData.tag?.openCloseStatus?.key == 'ALL_OPEN'" size="small" color="#FFFFFF" bg-color="#F2CB0C" class="info-tag">{{
                            i18n.global.t('meos_control_web.fully_on')
                        }}</m-tag>
                        <m-tag v-if="spaceData.tag?.openCloseStatus?.key == 'ALL_CLOSE'" size="small" color="#FFFFFF" bg-color="#626C78" class="info-tag">{{
                            i18n.global.t('meos_control_web.fully_off')
                        }}</m-tag>
                        <m-tag v-if="spaceData.tag?.openCloseStatus?.key == 'PARTIAL_OPEN'" size="small" color="#FFFFFF" bg-color="#D96C00" class="info-tag">{{
                            i18n.global.t('meos_control_web.partial_on')
                        }}</m-tag>
                        <m-tag
                            v-if="spaceData.tag?.abnormalStatuses?.length && spaceData.tag?.abnormalStatuses.find(dataObj => dataObj.key == ABNORMAL_EVENT)"
                            size="small"
                            color="#FFFFFF"
                            bg-color="#F55047"
                            class="info-tag"
                            >{{ i18n.global.t('meos_control_web.abnormal') }}</m-tag
                        >
                        <m-tag
                            v-if="spaceData.tag?.runningDeviationTypes?.find(dataObj => dataObj?.key && dataObj.key == 'MORE_OPEN')"
                            size="small"
                            color="#FFFFFF"
                            bg-color="#E6B407"
                            class="info-tag"
                            >{{ i18n.global.t('common.over_on') }}</m-tag
                        >
                        <m-tag
                            v-if="spaceData.tag?.runningDeviationTypes?.find(dataObj => dataObj?.key && dataObj.key == 'LESS_OPEN')"
                            size="small"
                            color="#FFFFFF"
                            bg-color="#FF9D2D"
                            class="info-tag"
                            >{{ i18n.global.t('common.drive_less') }}</m-tag
                        >
                        <m-tag v-if="spaceData.tag?.interventionType?.key == 'MANUAL_CONTROL'" size="small" color="#FFFFFF" bg-color="#8252E3" class="info-tag">{{
                            i18n.global.t('meos_control_web.manual_intervention')
                        }}</m-tag>
                        <!-- <m-tag size="small" color="#FFFFFF" bg-color="#00A2A7">反馈调节</m-tag> -->
                    </div>
                </div>
                <div v-if="isEquipDetailIconVisible" class="fc" style="padding: 4px 0 4px 4px">
                    <m-tips :content="i18n.global.t('meos_control_web.open_equipment_detail_in_new_tab')" theme="darkTransparent" placement="left">
                        <div class="icon-link fcc bgc-hover" @click="itemInfo">
                            <SvgIcon name="detail" />
                        </div>
                    </m-tips>
                    <div class="get-line ml8 mr8"></div>
                </div>
            </div>
        </template>
        <template #content>
            <div class="control-aberrant-wrap">
                <div v-show="state.clickTop" class="click-top" style="border: 1px solid blue" @click="hidenBtn(e)"></div>
                <div class="tabs-item">
                    <m-tabs v-model="state.curTab" :data="state.tabItems" size="large" @change="tabChange"></m-tabs>
                </div>
                <!-- 环境品质 -->
                <!-- <div v-show="state.curTab === 1" class="child">
                    <EnvironmentalQuality :is-abnormal="false" :select-obj="selectObj" :space-id="selectObj?.id" :running-monitor-type="'LIGHTING'" :is-abnormal="false"></EnvironmentalQuality>
                </div> -->
                <!-- 空间关联设备 -->
                <div v-show="state.curTab === 1" class="child">
                    <m-scrollbar ref="scrollbarRef" box-class="space-scrollbar" @scroll="scroll">
                        <div class="space-item">
                            <div v-if="spaceData.relCircuits?.length" class="mt16">
                                <batchControl :list="dataStatus" />
                            </div>
                            <div v-if="spaceData.relCircuits?.length">
                                <div class="fcb">
                                    <div class="title-item f16 fb7 mt16 mb12">{{ i18n.global.t('meos_control_web.lighting_circuit_list') }}</div>
                                    <div v-if="spaceData.relControllers?.length" class="fc unpack" style="cursor: pointer" @click="unpackFun">
                                        <div class="mr4">{{ state.unpack }}</div>
                                        <SvgIcon name="unpack" />
                                    </div>
                                </div>
                                <div v-show="state.unpackShow">
                                    <loopList :list="spaceData.relCircuits" :click-top="state.clickTop" @hiden-popup-show="hidenPopupShow" />
                                </div>
                            </div>
                            <div v-if="spaceData.relControllers?.length">
                                <div class="fcb">
                                    <div class="title-item f16 fb7 mt16 mb12">{{ i18n.global.t('meos_control_web.lighting_module_list') }}</div>
                                    <div v-if="spaceData.relCircuits?.length" class="fc unpack" style="cursor: pointer" @click="lightingCircuitFun">
                                        <div class="mr4">{{ state.circuit }}</div>
                                        <SvgIcon name="unpack" />
                                    </div>
                                </div>
                                <div v-show="state.circuitShow">
                                    <circuitList :list="spaceData.relControllers" />
                                </div>
                            </div>
                        </div>
                    </m-scrollbar>
                </div>
                <!-- 需求目标 -->
                <div v-if="state.curTab === 2" ref="tabBottomRef" class="child" :style="{ '--tab-bottom-height': (height || 0) + 'px' }">
                    <m-scrollbar :height="'100%'">
                        <div class="demand-target-tab-container">
                            <DemandTargetTab :is-space-detail="true" :container-height="height" />
                        </div>
                    </m-scrollbar>
                </div>

                <!-- 异常事件 -->
                <div v-show="state.curTab === 3" class="child">
                    <m-scrollbar ref="scrollAbnormalbarRef" box-class="space-scrollbar" @scroll="scroll">
                        <div class="mt16">
                            <abnormalList />
                        </div>
                    </m-scrollbar>
                </div>
            </div>
        </template>
    </m-drawer>
</template>
<script setup>
import { Z_INDEX } from '@/constants/zIndex';
import SvgIcon from '@/components/common/SvgIcon.vue';
import batchControl from '../../components/batchControl.vue';
import loopList from '../../components/loopList.vue';
import abnormalList from '../../components/abnormalList.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import i18n from '@/localization';
import circuitList from '../../components/circuitList.vue';
import { useRight } from '../use-right';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import { getAuthParamsString } from '@/utils/envUtils';
import DemandTargetTab from '../../controlAberrantCard/controls/DemandTargetTab.vue';
import { useElementSize } from '@vueuse/core';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { OBJ_TYPE } from '@/utils/globalVariables';
// import EnvironmentalQuality from '@/views/Common/environmentalQuality/index.vue'; // 环境品质

const emits = defineEmits(['close']);
const myElement = ref(null);
const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    objectType: {
        type: String,
        default: ''
    },
    localName: {
        type: String,
        default: ''
    },
    spaceId: {
        type: String,
        default: ''
    },
    templateType: {
        type: String,
        default: ''
    },
    defaultTabKey: {
        type: Number,
        default: 1
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const { dataStatus, show, spaceData } = useRight(props);
console.log(spaceData, 'spaceData');

const tabBottomRef = ref(null);
const { height } = useElementSize(tabBottomRef);
// eslint-disable-next-line vue/no-setup-props-destructure
const state = reactive({
    curTab: props?.defaultTabKey ?? 1,
    unpack: i18n.global.t('meos_control_web.collapse'),
    circuit: i18n.global.t('meos_control_web.collapse'),
    circuitShow: true,
    unpackShow: true,
    tabItems: [
        // {
        //     id: 1,
        //     name: '环境品质'
        // },
        {
            id: 1,
            name: i18n.global.t('meos_control_web.related_equipment')
        },
        {
            id: 2,
            name: i18n.global.t('meos_control_web.demand_target')
        },
        {
            id: 3,
            name: i18n.global.t('meos_control_web.abnormal_event')
        }
    ],
    clickTop: false
});
const top = ref(0);
const topAbnormal = ref(0);
const scrollbarRef = ref();
const scrollAbnormalbarRef = ref();
const filterIds = ref([]);
watch(
    () => top.value,
    () => {
        if (state.curTab === 1) {
            scrollbarRef.value.setScrollTop(top.value);
        } else {
            scrollAbnormalbarRef.value.setScrollTop(topAbnormal.value);
        }
    }
);
watch(
    () => props.id,
    newValue => {
        filterIds.value = [newValue];
    },
    { immediate: true, deep: true }
);

const isEquipDetailIconVisible = computed(() => {
    return props.objectType !== OBJ_TYPE.EQUIPGROUP; // 设备组
});

const hidenBtn = e => {
    console.log(123);
    // 阻止事件冒泡
    // e.stopPropagation();
    // // 阻止事件的默认行为
    // e.preventDefault();
    state.clickTop = false;
};
const hidenPopupShow = item => {
    state.clickTop = item;
};
const scroll = scrollitem => {
    if (state.curTab === 1) {
        top.value = scrollitem.scrollTop;
    } else {
        topAbnormal.value = scrollitem.scrollTop;
    }
};
const tabChange = () => {
    if (state.curTab === 1) {
        scrollbarRef.value.setScrollTop(top.value);
    } else {
        scrollAbnormalbarRef.value.setScrollTop(topAbnormal.value);
    }
};
const itemInfo = () => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${props.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
const close = () => {
    top.value = 0;
    topAbnormal.value = 0;
    // const header = document.querySelector('.saasweb-header');
    // if (header) {
    //     header.style.zIndex = 2;
    // }
    nextTick(() => {
        emits('close');
    });
};
onMounted(() => {
    // nextTick(() => {
    //     const header = document.querySelector('.saasweb-header');
    //     if (header) {
    //         header.style.zIndex = 9999;
    //     }
    // });
});
onUnmounted(() => {
    top.value = 0;
    topAbnormal.value = 0;
});
const unpackFun = () => {
    state.unpackShow = !state.unpackShow;
    state.unpack = state.unpackShow === false ? i18n.global.t('meos_control_web.expand') : i18n.global.t('meos_control_web.collapse');
};
const lightingCircuitFun = () => {
    state.circuitShow = !state.circuitShow;
    state.circuit = state.circuitShow === false ? i18n.global.t('meos_control_web.expand') : i18n.global.t('meos_control_web.collapse');
};
provide('filterIds', filterIds);
</script>
<!-- 不要这样写，要加scoped，这里是因为要结测了，时间来不及所以临时这样修改 -->
<style lang="less">
.light-control-space-drawer {
    .icon-link {
        height: 20px;
        cursor: pointer;
    }
    .m-drawer-container-header {
        height: auto;
        align-items: normal;
        padding: 16px 24px 12px 24px;
        border-bottom: none;
    }
    .m-drawer-container-header-icon {
        // margin-top: 4px;
    }
    .space-scrollbar {
        padding: 0 24px;
    }
    .m-drawer-container-content {
        width: 100% !important;
        padding: 0px !important;
        overflow: hidden;
    }

    @media screen and (min-width: 1600px) {
        .m-drawer-container {
            width: 480px !important;
        }
        .space-title {
            max-width: 310px;
        }
        .top-title-tag {
            max-width: 356px;
            display: flex;
            flex-wrap: wrap;
            .info-tag {
                margin-right: 4px !important;
                margin-left: 0px !important;
                margin-top: 4px !important;
            }
        }
    }
    @media screen and (max-width: 1600px) {
        .m-drawer-container {
            width: 400px !important;
        }
        .space-title {
            max-width: 225px;
        }
        .top-title-tag {
            max-width: 280px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .info-tag {
                margin-right: 4px !important;
                margin-left: 0px !important;
                margin-top: 4px !important;
            }
        }
    }
    .info-tag {
        font-weight: var(--platform-font-weight) !important;
    }
    .click-top {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 3;
    }

    .demand-target-tab-container {
        padding-inline: 8px;
        height: 100%;
        transform: translateY(-4px);
    }
    .tabs-item {
        padding-left: 12px;
        border-bottom: 1px solid #e8ecf0;
    }
    .control-aberrant-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        padding-bottom: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .child {
            flex: 1;
            min-height: 0;
            overflow: hidden;
        }
        .title-item {
            position: relative;
            margin-left: 10px;

            &::before {
                position: absolute;
                width: 3px;
                height: 14px;
                background: #246fe5;
                left: -10px;
                top: 4px;
                content: '';
            }
        }
        .unpack {
            padding: 4px;
        }
        .unpack:hover {
            border-radius: 2px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
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
    .get-line {
        width: 1px;
        height: 14px;
        background: #d9d9d9;
    }
    .bgc-hover {
        border-radius: 2px;
        padding: 2px;
    }
    .bgc-hover:hover {
        border-radius: 2px;
        padding: 2px;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
}
</style>
