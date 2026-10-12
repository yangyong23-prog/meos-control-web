<template>
    <m-drawer :append-to="$drawerAppendTo" :show="show" :z-index="Z_INDEX.commonDrawer" :shadow-click="false" :drawer-class="`module-drawer noIframe`" @close="close">
        <template #title>
            <div class="fb">
                <div class="fc" style="flex-wrap: wrap">
                    <div v-ellipsis class="f20 m-ellipsis mt4" style="max-width: 400px">{{ localName ?? '--' }}&nbsp;&nbsp;</div>
                    <div class="mr16 top-title-tag">
                        <m-tag v-if="configList.relFloor" size="small" color="#1B4ACC" bg-color="#D9EBFF" class="info-tag"> {{ configList.relFloor.localName ?? '--' }} </m-tag>
                        <!-- 全开 全关 部分开启 -->
                        <m-tag v-if="configList.tag?.openCloseStatus?.key == 'ALL_OPEN'" size="small" color="#FFFFFF" bg-color="#F2CB0C" class="info-tag">{{
                            i18n.global.t('meos_control_web.fully_on')
                        }}</m-tag>
                        <m-tag v-if="configList.tag?.openCloseStatus?.key == 'ALL_CLOSE'" size="small" color="#FFFFFF" bg-color="#626C78" class="info-tag">{{
                            i18n.global.t('meos_control_web.fully_off')
                        }}</m-tag>
                        <m-tag v-if="configList.tag?.openCloseStatus?.key == 'PARTIAL_OPEN'" size="small" color="#FFFFFF" bg-color="#D96C00" class="info-tag">{{
                            i18n.global.t('meos_control_web.partial_on')
                        }}</m-tag>
                        <m-tag
                            v-if="configList.tag?.abnormalStatuses?.length && configList.tag?.abnormalStatuses.find(dataObj => dataObj.key == ABNORMAL_EVENT)"
                            size="small"
                            color="#FFFFFF"
                            bg-color="#F55047"
                            class="info-tag"
                            >{{ i18n.global.t('meos_control_web.abnormal') }}</m-tag
                        >
                        <m-tag
                            v-if="configList.tag?.runningDeviationTypes?.find(dataObj => dataObj?.key && dataObj.key == 'MORE_OPEN')"
                            size="small"
                            color="#FFFFFF"
                            bg-color="#E6B407"
                            class="info-tag"
                            >{{ i18n.global.t('common.over_on') }}</m-tag
                        >
                        <m-tag
                            v-if="configList.tag?.runningDeviationTypes?.find(dataObj => dataObj?.key && dataObj.key == 'LESS_OPEN')"
                            size="small"
                            color="#FFFFFF"
                            bg-color="#FF9D2D"
                            class="info-tag"
                            >{{ i18n.global.t('common.drive_less') }}</m-tag
                        >
                        <m-tag v-if="configList.tag?.interventionType?.key == 'MANUAL_CONTROL'" size="small" color="#FFFFFF" bg-color="#8252E3" class="info-tag">{{
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
            <div class="control-module-wrap">
                <div v-show="state.clickTop" class="click-top" @click="hidenBtn(e)"></div>
                <div class="tabs-item">
                    <m-tabs v-model="state.curTab" :data="state.tabItems" type="segment" size="medium" @change="tabChange"></m-tabs>
                </div>
                <div v-show="state.curTab === 1" class="child">
                    <m-scrollbar ref="scrollbarRef" box-class="module-scrollbar" @scroll="scroll">
                        <div>
                            <div>
                                <div class="title-item f16 fb7 mt16 mb12">{{ i18n.global.t('meos_control_web.module_basic_info') }}</div>
                                <moduleInfo :obj="configList" />
                            </div>
                            <div>
                                <div class="title-item f16 fb7 mt16 mb12">{{ i18n.global.t('meos_control_web.related_equipment_batch_control') }}</div>
                                <div class="mb16">
                                    <batchControl :list="dataStatus" />
                                </div>
                                <loopList :list="configList.relCircuits" :click-top="state.clickTop" @hiden-popup-show="hidenPopupShow" />
                            </div>
                        </div>
                    </m-scrollbar>
                </div>
                <div v-show="state.curTab === 2" class="child">
                    <m-scrollbar ref="scrollAbnormalbarRef" box-class="module-scrollbar" @scroll="scroll">
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
import moduleInfo from '../../components/info/moduleInfo.vue';
import { useModule } from '../use-module';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import { openWebsite } from '@/utils/websiteNavigation';
import { isEdge, getAuthParamsString } from '@/utils/envUtils';
import i18n from '@/localization';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { OBJ_TYPE } from '@/utils/globalVariables';
const emits = defineEmits(['close']);
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
    }
});
const state = reactive({
    curTab: 1,
    unpack: i18n.global.t('meos_control_web.expand'),
    circuit: i18n.global.t('meos_control_web.expand'),
    circuitShow: true,
    unpackShow: true,
    tabItems: [
        {
            id: 1,
            name: i18n.global.t('meos_control_web.module_associated_devices')
        },
        {
            id: 2,
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
const { dataStatus, show, configList } = useModule(props);
console.log(dataStatus, configList);
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
    (newValue, oldValue) => {
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
provide('filterIds', filterIds);
</script>
<style lang="less">
@media screen and (min-width: 1600px) {
    .module-drawer {
        .m-drawer-container {
            width: 480px !important;
        }
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
    .module-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
    }
    .top-title-tag {
        max-width: 280px;
        display: flex;
        flex-wrap: wrap;
        .info-tag {
            margin-right: 4px !important;
            margin-left: 0px !important;
            margin-top: 4px !important;
        }
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
.module-drawer {
    .icon-link {
        height: 20px;
        cursor: pointer;
    }
    .m-drawer-container-header {
        height: auto;
        align-items: normal;
    }
    .m-drawer-container-header-icon {
        // margin-top: 4px;
    }
    .m-drawer-container-content {
        width: 100% !important;
        padding: 0px !important;
        overflow: hidden;
    }

    .click-top {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 3;
    }
    .info-tag {
        font-weight: var(--platform-font-weight) !important;
    }

    .module-scrollbar {
        padding: 0px 16px;
    }
    .tabs-item {
        padding: 0px 16px;
    }
    .control-module-wrap {
        width: 100%;
        height: 100%;
        padding: 16px 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
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
                top: 3px;
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
    .m-tabs.m-tabs-segment {
        width: 100% !important;
        .m-tabs-item {
            flex: 1;
        }
        .m-tabs-body {
            padding-right: 0 !important;

            .m-tabs-trigger {
                display: none !important;
            }
        }
    }
}
</style>
