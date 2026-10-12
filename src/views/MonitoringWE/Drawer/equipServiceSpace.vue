<template>
    <div class="space-list-warp">
        <m-scrollbar v-if="spaceList?.length">
            <div class="title f16 fb7 mb8 mt16">{{ i18n.global.t('meos_control_web.equipment_served_zone') }}</div>
            <div v-for="item in spaceList" :key="item.id" style="margin-right: 24px">
                <div v-if="isMultipleBuildings" class="build-name">{{ item.localName }}</div>
                <div class="space-item-content">
                    <div v-for="space in item.children" :key="space.id" class="space-item" @mouseenter="space.showDetail = true" @mouseleave="space.showDetail = false">
                        <div class="space-item-left">
                            <div class="space-item-name">
                                {{ space.localName }}
                            </div>
                            <div class="space-item-tag">
                                <m-tag size="small" color="#1B4ACC" bg-color="#D9EBFF"> {{ space?.inFloor?.localName }} </m-tag>
                                <m-tag v-if="isAbnormal(space.id)" size="small" color="#FFFFFF" bg-color="#F55047">{{ i18n.global.t('meos_control_web.abnormal') }} </m-tag>
                                <!-- <templateObjectTags :status-data="space.relInfoCodeGroupConfigs?.[0]" :select-obj="selectObj" :template-type="DETAIL" /> -->
                            </div>
                        </div>
                        <div v-if="space.showDetail" class="space-item-right">
                            <m-tips :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="top-end">
                                <div class="icon-link fcc bgc-hover" @click="itemInfo()">
                                    <SvgIcon name="detail" />
                                </div>
                            </m-tips>
                        </div>
                    </div>
                </div>
            </div>
        </m-scrollbar>
        <div v-else class="no-data"><m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration></div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
import templateObjectTags from '@/components/templateObjectTags/index.vue';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { openWebsite } from '@/utils/websiteNavigation';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { getAuthParamsString } from '@/utils/envUtils';
import useLoading from '@/hooks/useLoading';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { listInfoCodeConfigsByObject } from '@/apis/MonitoringWE';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import dataDockHandling from '@/hooks/dataDockHandling';
import { RUNNING_MONITOR_TYPE } from '../constant/index';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
const { getObjectAbnormalStatus, clearAbnormalEventsList } = DockSingleton.getInstance();
const { writeDataToResponsiveDock } = dataDockHandling();
const { openLoading, closeLoading } = useLoading('space-list-warp', '#fff', 'ball');
const queryDyncTreeToken = UseCancelTokenHooks();
const commonDrawerRoot = inject(commonDrawerRootContextKey);
const props = defineProps({
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const spaceList = ref([]);
const isMultipleBuildings = computed(() => {
    return xplantindoorenvStore().buildingData?.length > 1;
});

const isAbnormal = id => getObjectAbnormalStatus(id);

const itemInfo = () => {
    if (!props.selectObj?.id) return;
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${props.selectObj?.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
const generalZoneIds = ref([]);
onMounted(() => {
    initModule(true);
});
onBeforeUnmount(() => {
    clearAbnormalEventsList(generalZoneIds.value);
});

const initModule = loading => {
    spaceList.value = [];
    if (loading) {
        openLoading();
    }
    listInfoCodeConfigsByObject(
        { runningMonitorType: RUNNING_MONITOR_TYPE, groupCodes: ['equipmentServiceSpace'], objectIds: [props.selectObj?.id], templateCode: DETAIL },
        { cancelToken: queryDyncTreeToken.cancelToken() }
    )
        .then(res => {
            const { code, data } = res;
            if (code === SUCCESSCODE && data) {
                data[0]?.relInfoCodeGroupConfigs?.map(item => {
                    if (item.groupCode === 'equipmentServiceSpace') {
                        spaceList.value = buildTree((item.relInfoCodeConfigs?.length && item.relInfoCodeConfigs[0].dataValue) || []);
                    }
                });
            }

            // 按需订阅时收集sse订阅参数
            if (commonDrawerRoot?.props.isSubscriptOnDemand) {
                const { classCodeIds } = iterateObjct4InstanceInfo(data);
                generalZoneIds.value = classCodeIds?.GeneralZone || [];
                commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);
                writeDataToResponsiveDock(data);
            }
            closeLoading();
        })
        .catch(() => {
            closeLoading();
        });
};

function buildTree(dataValue) {
    const buildingMap = {};

    dataValue.forEach(item => {
        const buildingId = item.inBuilding.id;

        if (!buildingMap[buildingId]) {
            buildingMap[buildingId] = {
                id: buildingId,
                localName: item.inBuilding.localName,
                dynamicName: item.inBuilding.dynamicName,
                children: []
            };
        }
        buildingMap[buildingId].children.push({
            ...item,
            id: item.id,
            localName: item.localName,
            dynamicName: item.dynamicName,
            objType: item.objType,
            inFloor: item.inFloor
        });
    });
    return Object.values(buildingMap);
}

watch(
    () => props.selectObj,
    () => {
        if (props.selectObj?.id) {
            initModule(true);
        }
    }
);
</script>

<style lang="less" scoped>
.space-list-warp {
    padding: 0 0 0 24px;
    height: 100%;
    .title {
        font-size: 16px;
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
    .build-name {
        color: var(--gray-500, #8b949e);
        font-size: 14px;
        line-height: 22px;
        margin: 12px 12px 4px 12px;
    }
    .space-item-content {
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        line-height: 22px;
        .space-item {
            display: flex;
            justify-content: space-between;
            padding: 11px 12px;
            border-bottom: 1px solid var(--gray-200, #e8ecf0);
            &:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
        .space-item-left {
            display: flex;
            align-items: flex-start;
        }
        .space-item-right {
            margin-left: 8px;
            display: flex;
            .bgc-hover {
                border-radius: 2px;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 20px;
                height: 20px;
                padding: 2px;
                &:hover {
                    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                }
            }
        }
        .space-item-name {
            margin-right: 4px;
        }
        .space-item-tag {
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
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
