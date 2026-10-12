<template>
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="show"
        :z-index="Z_INDEX.commonDrawer"
        :shadow-click="false"
        :drawer-class="`buildingLightingSidebar-drawer noIframe`"
        @close="close"
    >
        <template #title>
            <div class="fc" style="flex-wrap: wrap">
                <div v-ellipsis class="f18 m-ellipsis space-title mt4">{{ localName ?? '--' }}&nbsp;&nbsp;</div>
                <div class="mr16 top-title-tag">
                    <!-- 全开 全关 部分开启 -->
                    <m-tag v-if="lampsObj.tags?.openCloseStatus == 'ALL_OPEN'" size="small" color="#FFFFFF" bg-color="#F2CB0C" class="info-tag">{{
                        i18n.global.t('meos_control_web.fully_on')
                    }}</m-tag>
                    <m-tag v-if="lampsObj.tags?.openCloseStatus == 'ALL_CLOSE'" size="small" color="#FFFFFF" bg-color="#626C78" class="info-tag">{{
                        i18n.global.t('meos_control_web.fully_off')
                    }}</m-tag>
                    <m-tag v-if="lampsObj.tags?.openCloseStatus == 'PARTIAL_OPEN'" size="small" color="#FFFFFF" bg-color="#D96C00" class="info-tag">{{
                        i18n.global.t('meos_control_web.partial_on')
                    }}</m-tag>
                    <m-tag
                        v-if="lampsObj.tags?.abnormalStatuses?.length && lampsObj.tags?.abnormalStatuses.find(dataObj => dataObj == ABNORMAL_EVENT)"
                        size="small"
                        color="#FFFFFF"
                        bg-color="#F55047"
                        class="info-tag"
                        >{{ i18n.global.t('meos_control_web.abnormal') }}</m-tag
                    >
                    <m-tag
                        v-if="lampsObj.tags?.runningDeviationTypes?.find(dataObj => dataObj && dataObj == 'MORE_OPEN')"
                        size="small"
                        color="#FFFFFF"
                        bg-color="#E6B407"
                        class="info-tag"
                        >{{ i18n.global.t('common.over_on') }}</m-tag
                    >
                    <m-tag
                        v-if="lampsObj.tags?.runningDeviationTypes?.find(dataObj => dataObj && dataObj == 'LESS_OPEN')"
                        size="small"
                        color="#FFFFFF"
                        bg-color="#FF9D2D"
                        class="info-tag"
                        >{{ i18n.global.t('common.drive_less') }}</m-tag
                    >
                    <m-tag v-if="lampsObj.tags?.interventionType == 'MANUAL_CONTROL'" size="small" color="#FFFFFF" bg-color="#8252E3" class="info-tag">{{
                        i18n.global.t('meos_control_web.manual_intervention')
                    }}</m-tag>
                    <!-- <m-tag size="small" color="#FFFFFF" bg-color="#00A2A7">反馈调节</m-tag> -->
                </div>
            </div>
        </template>
        <template #content>
            <m-scrollbar box-class="space-scrollbar">
                <div class="mt16">
                    <div class="title-item f14 fb7 mt16">{{ i18n.global.t('meos_control_web.abnormal_event_list') }}</div>
                    <AbnormalList
                        :abnormal-event-list="lampsObj?.exceptionEventBaseInfoList"
                        :abnormal-event-list-loading="abnormalEventListLoading"
                        :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                        :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                    />
                </div>
                <div v-if="lampsObj.deviceInfo?.length">
                    <div class="title-item f14 fb7 mt16 mb12">{{ i18n.global.t('meos_control_web.related_equipment_abnormal') }}</div>
                    <div v-for="(item, index) in lampsObj.deviceInfo" :key="index" class="fcb f14 mb14 ml12">
                        <div style="color: #1b2129">{{ item.name }}</div>
                        <div>
                            <span v-if="item.infoCodeList?.indexOf('onlineStatus') > -1" class="ft">{{ i18n.global.t('meos_control_web.offline') }}</span>
                            <span v-if="item.infoCodeList?.indexOf('orderFailAlarm') > -1" class="ml8" style="color: #e68600">{{
                                i18n.global.t('meos_control_web.control_feedback_mismatch')
                            }}</span>
                        </div>
                    </div>
                </div>
            </m-scrollbar>
        </template>
    </m-drawer>
</template>
<script setup>
import { Z_INDEX } from '@/constants/zIndex';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import { getLightSpaceData } from '@/apis/lightingControl';
import { MLoading } from 'meri-plus';
import { SUCCESSCODE } from '@/utils/globalVariables';
import i18n from '@/localization';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
const abnormalEventListLoading = inject('abnormalEventListLoading');
const abnormalEventListUpdateTime = inject('abnormalEventListUpdateTime');
const abnormalEventListLoadedTime = inject('abnormalEventListLoadedTime');
// const abnormalEventList = inject('abnormalEventList');
const show = ref(false);
const emits = defineEmits(['close']);
const abnormalEventList = ref([]);
const lampsObj = ref({});
const props = defineProps({
    objectType: {
        type: String,
        default: ''
    },
    localName: {
        type: String,
        default: ''
    },
    templateType: {
        type: String,
        default: ''
    }
});

const init = loading => {
    show.value = true;
    let Mloading = null;
    if (loading) {
        Mloading = MLoading.service({
            target: '.space-scrollbar',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    }
    getLightSpaceData({
        demandTemplateType: props.templateType,
        lampFuncType: props.objectType
    })
        .then(res => {
            if (res.code === SUCCESSCODE) {
                lampsObj.value = res.data;
            }
            Mloading?.destroy();
        })
        .catch(error => {
            Mloading?.destroy();
        });
};
const close = () => {
    // const header = document.querySelector('.saasweb-header');
    // if (header) {
    //     header.style.zIndex = 2;
    // }
    nextTick(() => {
        emits('close');
    });
};
onMounted(() => {
    nextTick(() => {
        init(true);
        // const header = document.querySelector('.saasweb-header');
        // if (header) {
        //     header.style.zIndex = 9999;
        // }
    });
});
</script>
<style lang="less" scoped>
:deep(.space-scrollbar) {
    // padding: 0 24px;
}
.info-tag {
    font-weight: var(--platform-font-weight) !important;
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
</style>
<style lang="less">
.buildingLightingSidebar-drawer {
    .m-drawer-container-content {
        width: 100% !important;
    }
}
@media screen and (min-width: 1600px) {
    .buildingLightingSidebar-drawer {
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
                margin-right: 4px;
                margin-left: 0px;
                margin-top: 4px;
            }
        }
    }
}
@media screen and (max-width: 1600px) {
    .buildingLightingSidebar-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
        .space-title {
            max-width: 225px;
        }
        .top-title-tag {
            max-width: 280px;
            display: flex;
            flex-wrap: wrap;
            .info-tag {
                margin-right: 4px;
                margin-left: 0px;
                margin-top: 4px;
            }
        }
    }
}
</style>
