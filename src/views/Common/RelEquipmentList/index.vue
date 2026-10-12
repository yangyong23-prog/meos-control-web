<template>
    <div v-if="loading" class="content"></div>
    <div v-else-if="!loading && relEquipList.length === 0" class="no-data">
        <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
    </div>
    <m-scrollbar v-else box-class="rel-equipment-box-scrollbar" @scroll="onScroll">
        <div class="title f16 fb7 mb4 mt20">{{ i18n.global.t('meos_control_web.sub_devices_under_device') }}</div>
        <div v-for="item in relEquipList" :key="item.id" class="item" @click.stop="emits('clickEquip', item)">
            <div class="fcb">
                <span class="equip-name">{{ (item.dynamicName || item.localName) ?? '--' }}</span>
                <template v-if="true">
                    <m-tips :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="left">
                        <div class="icon-link fcc bgc-hover" @click.stop="itemInfo(item)">
                            <SvgIcon name="detail" />
                        </div>
                    </m-tips>
                </template>
            </div>

            <div class="mr16 mb4 title-tag">
                <m-tag v-if="item.inFloor?.localName" size="small" color="#1B4ACC" bg-color="#D9EBFF" style="font-weight: var(--platform-font-weight)">
                    {{ item.inFloor?.localName }}</m-tag
                >
                <TemplateObjectTags
                    v-if="item?.relInfoCodeGroupConfigs.find(item => item.groupCode === 'relEquipStatus')"
                    :status-data="item?.relInfoCodeGroupConfigs.find(item => item.groupCode === 'relEquipStatus')"
                    :select-obj="item"
                    :template-type="DETAIL"
                />
            </div>
            <div class="info-content">
                <div v-for="info in item?.relInfoCodeGroupConfigs.find(item => item.groupCode === 'relRunningParameter')?.relInfoCodeConfigs" :key="info.infoCode" class="info">
                    <span class="font">{{ info.infoCodeName + '：' }}</span>
                    <m-popover v-if="info.infoCodeType == IOT_RUNNING" :enterable="false" theme="darkTransparent" :show-arrow="false">
                        <template #content>
                            <p>
                                {{ i18n.global.t('meos_control_web.data_update_time_colon')
                                }}{{ dayjs(getIotData(item.id, info.infoCode).dataTime ?? '').format('YYYY.MM.DD HH:mm:ss') }}
                            </p>
                            <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
                        </template>
                        <span v-ellipsis :class="[info.dataValue ? 'iot-info' : '', 'time', 'm-ellipsis']" @click.stop="detailsIot(item.id, info)">{{
                            getIotShowValue(item.id, info.infoCode)
                        }}</span>
                    </m-popover>
                </div>
            </div>
        </div>
    </m-scrollbar>
</template>

<script setup>
import i18n from '@/localization';
import dataDockHandling from '@/hooks/dataDockHandling';
import { DETAIL, IOT_RUNNING, SUCCESSCODE } from '@/utils/globalVariables';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import { MLoading } from 'meri-plus';
import DockSingleton from '@/hooks/responsiveDock';
import dayjs from 'dayjs';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString, jumpToAnalysis } from '@/utils/envUtils';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { iterateObjct4InstanceInfo } from '@/utils';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';

const props = defineProps({
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
    }
});

const emits = defineEmits('clickEquip');
const commonDrawerRoot = inject(commonDrawerRootContextKey);
const { getIotShowValue, getIotData } = DockSingleton.getInstance();
const { loadDynaDataWithIotHandling } = dataDockHandling();

const relEquipList = ref([]);
const loading = ref(true);
let mloading = null;

if (loading.value) {
    mloading = MLoading.service({
        target: '.content',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
}

loadDynaDataWithIotHandling(
    {
        runningMonitorType: props.runningMonitorType,
        objectIds: [props.selectObj?.id],
        templateType: DETAIL,
        groupCodes: ['independenceRelEquipment']
    },
    listInfoCodeConfigsByObjectIdCommon
)
    .then(({ code, data }) => {
        if (code === SUCCESSCODE) {
            const { classCodeIds } = iterateObjct4InstanceInfo(data);
            commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);

            relEquipList.value = data[0]?.independenceRelEquipment.relInfoCodeConfigs[0]?.dataValue || [];
        }
    })
    .finally(() => {
        loading.value = false;
        mloading?.destroy();
    });
// TODO
const onScroll = () => {};

//ios详情
const detailsIot = (id, item) => {
    console.log('item :>> ', item);
    if (item.dataValue) {
        const jumpParams = {
            infoCode: item.infoCode,
            id
        };
        jumpToAnalysis(jumpParams);
    }
};

const itemInfo = item => {
    if (!item?.id) return;
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${item?.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
</script>

<style lang="less" scoped>
.content {
    height: 100%;
}
:deep(.rel-equipment-box-scrollbar) {
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
.item {
    display: flex;
    padding: 12px 12px;
    flex-direction: column;
    border-bottom: 1px solid var(--gray-200, #e8ecf0);
    .equip-name {
        color: var(--Grey-900);
        font-size: 14px;
        font-weight: var(--platform-font-weight);
    }
    .bgc-hover {
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 26px;
        height: 26px;
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    .title-tag {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;
    }
    .info-content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .info {
            min-width: calc(50% - 8px);
            margin-top: 8px;
            .font {
                color: #626c78;
            }
            .iot-info {
                color: #246fe5;
            }

            .iot-info:hover {
                color: #1b4acc;
                cursor: pointer;
            }
        }
    }

    &:hover {
        background-color: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        cursor: pointer;
        .equip-name {
            color: var(--blue-500, #246fe5);
        }
    }
}
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
