<template>
    <DrawerWrap :model-value="modelValue" :use-drawer="useDrawer" @close="close">
        <template #title>
            <div ref="headerContainerRef" :class="['fb', 'header-title-slot', useDrawer ? '' : 'pd24']">
                <div class="fc" style="flex-wrap: wrap; gap: 4px">
                    <div style="display: flex; align-items: center" @click="testStatus">
                        <div ref="titleTextRef" v-ellipsis class="f18 title-text fb7">
                            {{ selectObj.localName ?? '--' }}
                        </div>
                    </div>
                    <div class="mr16 title-tag">
                        <m-tag
                            v-if="runningMonitorType !== 'ELEVATOR' && (tagsValue.floorLocalName || selectObj.floorLocalName || floorLocalName)"
                            size="small"
                            color="#1B4ACC"
                            bg-color="#D9EBFF"
                            style="font-weight: var(--platform-font-weight)"
                        >
                            {{ tagsValue.floorLocalName || selectObj.floorLocalName || floorLocalName }}</m-tag
                        >
                        <m-tag
                            v-else-if="runningMonitorType === 'WEAK_POWER' && inFloor.localName"
                            size="small"
                            color="#1B4ACC"
                            bg-color="#D9EBFF"
                            style="font-weight: var(--platform-font-weight)"
                        >
                            {{ inFloor.localName }}</m-tag
                        >
                        <slot v-if="$slots.tags" name="tags"></slot>
                        <slot v-else-if="$slots.rewritetags" name="rewritetags" :status-data="tagsValue"></slot>
                        <TemplateObjectTags
                            v-else
                            :status-data="tagsValue"
                            :select-obj="selectObj"
                            :filter-arr="filterCodes"
                            :template-type="DETAIL"
                            :filter-tags="props.filterTags"
                        />
                    </div>
                </div>
                <div ref="headerRightRef" class="fc header-title-slot-right">
                    <slot name="extra-icon" :select-obj="selectObj" :tags="tagsValue"></slot>
                    <!-- 新开标签页跳转详情 -->
                    <template v-if="isEquipDetailIconVisible">
                        <m-tips :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="left">
                            <div class="icon-link fcc bgc-hover" @click="itemInfo">
                                <SvgIcon name="detail" />
                            </div>
                        </m-tips>
                    </template>
                    <div v-if="useDrawer" class="get-line ml8 mr4"></div>
                </div>
            </div>
        </template>
        <template #content>
            <div :class="['drawer-content', useDrawer ? 'height-8' : 'height-50']">
                <div v-if="showTabsAlaways || tabList?.length > 1" class="drawer-tabs-box">
                    <m-tabs v-model="curTab" :data="tabList" size="large" @change="changeTab"></m-tabs>
                </div>
                <div id="drawer-inner-id" class="drawer-inner" :class="{ 'has-tabs': showTabsAlaways || tabList?.length > 1, 'drawer-inner-top-line': isShowLine }">
                    <slot :select-obj="selectObj" :cur-tab="curTab"></slot>
                </div>
            </div>
        </template>
    </DrawerWrap>
</template>

<script setup>
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import { getCurrentInstance, useSlots } from 'vue';
import { useElementSize } from '@vueuse/core';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString } from '@/utils/envUtils';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import { listInfoCodeConfigsByObject } from '@/apis/airterminalxplantrunmonitor';
import { useOrderedChildren } from './useOrderedChildren';
import { commonDrawerRootContextKey } from './constant';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import { isEmpty, debounce } from 'lodash';
import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';
import { isEdge } from '@/utils/envUtils';

import DrawerWrap from './DrawerWrap.vue';
import { traverseObjectItems, isIotInfoType } from '@/utils/infoTemplate';

import DockSingleton from '@/hooks/responsiveDock';
import { progressProps } from 'element-plus';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM, DETAIL, OBJ_TYPE } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, CLOUD_IOT_DATA_CHANGE, DANGER_EVENT, EQUIPMENT_BUSINESS, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE, RELEASE_INTERVENTION } from '@/utils/SSEEventTypes';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';

const { setIotData, setAbnormalEvent, getAbnormalEventsList, clearAbnormalEventsList } = DockSingleton.getInstance();
const slotsData = useSlots();
const props = defineProps({
    showTabsAlaways: {
        // 始终显示tabs 不判断tabs数量大于1时显示tabs
        type: Boolean,
        default: false
    },
    modelValue: {
        type: Boolean,
        default: false
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    sseClient: {
        type: Object,
        default: null
    },
    runningMonitorType: {
        type: String,
        default: ''
    },
    subscribeType: {
        type: String,
        default: ''
    },
    isShowLine: {
        type: Boolean,
        default: false
    },
    // 是否按需订阅
    isSubscriptOnDemand: {
        type: Boolean,
        default: false
    },
    useDrawer: {
        type: Boolean,
        default: true
    },
    inFloor: {
        type: Object,
        default: null
    },
    cancelLastRequest: {
        type: Boolean,
        default: false
    },
    filterCodes: {
        type: Array,
        default: () => []
    },
    sseRefreshCallback: {
        type: Function,
        default: null
    },
    useNewApi: {
        type: Boolean,
        default: false
    },
    useHalfViewHandler: {
        type: Function,
        default: () => false
    },
    filterTags: {
        type: Function,
        default: null
    }
});

const headerContainerRef = ref(null);
const titleTextRef = ref(null);
const headerRightRef = ref(null);
const { width: headerWidth } = useElementSize(headerContainerRef);
const { width: headerRightWidth } = useElementSize(headerRightRef);
// 按需订阅SSE classCode 对应id的收集
const mainIdMapClassIds = ref({});
const setClass2Ids = (mainId, classIds) => {
    if (mainId !== props.selectObj?.id) {
        delete mainIdMapClassIds.value[mainId];
    }
    if (!classIds) {
        return;
    }
    const mainRecord = mainIdMapClassIds.value[mainId];
    if (!mainRecord) {
        mainIdMapClassIds.value[mainId] = { ...classIds };
        return;
    }
    Object.keys(classIds).forEach(newClassCode => {
        const newClassIds = classIds[newClassCode] || [];
        const existedObj = mainRecord[newClassCode];
        if (existedObj) {
            const s = new Set([...mainRecord[newClassCode], ...newClassIds]);
            mainRecord[newClassCode] = [...s];
        } else {
            mainRecord[newClassCode] = newClassIds;
        }
    });
};
// 按需订阅的 sseClient
let demandSseClient = null,
    demandSseCloseSse = null,
    fetchAbortController;
const halfViewEventType = 'HALF_VIEW';
const floorLocalName = ref('');
// 生成SSE参数
const genSSEParams = () => {
    // 判断是否使用半屏视图
    const useHalfView = props.useHalfViewHandler(props.selectObj);

    const eventTypeParam = {
        INFO_CODE_CONFIG_EVENT: { templateTypes: [DETAIL] }
    };
    const eventParamMap = {
        INFO_CODE_CONFIG_EVENT: { templateTypes: [DETAIL] }
    };
    if (useHalfView) {
        eventTypeParam.INFO_CODE_CONFIG_EVENT.templateTypes.push(halfViewEventType);
        eventParamMap.INFO_CODE_CONFIG_EVENT.templateTypes.push(halfViewEventType);
    }
    if (!isEdge()) {
        eventTypeParam.CLOUD_IOT_DATA_CHANGE = { templateTypes: [DETAIL] };
        eventParamMap.CLOUD_IOT_DATA_CHANGE = { templateTypes: [DETAIL] };
        if (useHalfView) {
            eventTypeParam.CLOUD_IOT_DATA_CHANGE.templateTypes.push(halfViewEventType);
            eventParamMap.CLOUD_IOT_DATA_CHANGE.templateTypes.push(halfViewEventType);
        }
    }
    return { eventTypeParam, eventParamMap };
};

if (props.isSubscriptOnDemand) {
    const { sseClient, setSSEClientOption, closeSse } = useSinglePOSTSSEClient(props.subscribeType || props.runningMonitorType);

    // 创建sseClient
    demandSseClient = sseClient;
    demandSseCloseSse = closeSse;
    const eventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, ABNORMAL_EVENT, RELEASE_INTERVENTION, INFO_CODE_CONFIG_EVENT, DANGER_EVENT, EQUIPMENT_BUSINESS];
    // 使用响应性Dock存储sse推送回来的数据
    useResponsiveDockSSEHandle(sseClient, eventType, props.sseRefreshCallback);
    const paramsSSE = computed(() => {
        const mainId = props.selectObj?.id;
        let rst = mainIdMapClassIds.value[mainId] || {};
        return { ...rst };
    });
    // 重连sse连接 防抖
    const connectSSEDebounce = debounce(() => {
        const rawData = toRaw(paramsSSE.value);
        if (!isEmpty(rawData)) {
            const { eventTypeParam, eventParamMap } = genSSEParams();
            setSSEClientOption({
                claasCode2objectIds: rawData,
                eventTypeParam,
                eventParamMap,
                eventType
                // instanceId: props.selectObj.id,
                // instanceType
            });
        }
    }, 200);

    watch(
        () => paramsSSE.value,
        () => {
            // console.log('paramsSSE.value: ', paramsSSE.value);
            connectSSEDebounce();
        }
    );
}

const emits = defineEmits(['update:modelValue', 'statusLoaded', 'close']);

const curTab = ref('');

const changeTab = data => {
    curTab.value = data.id;
    emitter.emit(CLOSE_CONTROL_FORM, { needHide: true, needClose: true });
};

const { children: panes, addChild: registerPane, removeChild: unregisterPane } = useOrderedChildren(getCurrentInstance(), 'DrawerPane');

provide(commonDrawerRootContextKey, {
    props,
    curTab,
    demandSseClient,
    setClass2Ids,
    registerPane,
    unregisterPane
});

const tabList = ref([]);

// watch(
//     () => props.modelValue,
//     (newVal, oldVal) => {
//         // 打开抽屉时才关闭控制表单，避免抽屉内组件切换时误触发
//         if (newVal === true && oldVal === false) {
//             emitter.emit(CLOSE_CONTROL_FORM, { needHide: true, needClose: true });
//         }
//     }
// );

watch(panes, () => {
    tabList.value = panes.value.map((pane, index) => {
        pane.index = `${index}`;
        return {
            ...pane,
            id: pane.name,
            name: pane.label
        };
    });
    curTab.value = tabList.value[0]?.id || '';
});

const isEquipDetailIconVisible = computed(() => {
    return props.selectObj?.objType !== OBJ_TYPE.EQUIPGROUP; // 设备组
});

const tagsValue = ref({});
const getTags = () => {
    floorLocalName.value = '';
    tagsValue.value = {};
    if (!props.selectObj?.id) return;
    if (props.cancelLastRequest) {
        fetchAbortController?.abort?.();
    }
    const params = {
        runningMonitorType: props.runningMonitorType,
        objectIds: [props.selectObj.id],
        templateCode: DETAIL,
        groupCodes: [props.selectObj?.objType === OBJ_TYPE.SPACE ? 'spaceStatus' : 'equipStatus']
    };

    fetchAbortController = new AbortController();
    let queryDyncInfoPromise = null;
    if (props.useNewApi) {
        queryDyncInfoPromise = listInfoCodeConfigsByObjectIdCommon(params, fetchAbortController.signal);
    } else {
        queryDyncInfoPromise = listInfoCodeConfigsByObject(params, { signal: fetchAbortController.signal });
    }
    queryDyncInfoPromise.then(res => {
        if (!res?.data || !props.selectObj?.id) return;
        if (res.data[0]?.floorId) {
            floorLocalName.value = treeBuildFloorStore()?.getBuildOrFloor(res.data[0].floorId)?.localName || '';
        }
        if (res.data[0]?.relInfoCodeGroupConfigs?.length) {
            const findCondation = props.selectObj?.objType === OBJ_TYPE.SPACE ? 'spaceStatus' : 'equipStatus';
            const statusTags = res.data[0]?.relInfoCodeGroupConfigs.find(item => item.groupCode === findCondation);
            if (statusTags) {
                tagsValue.value = statusTags;
                if (props.isSubscriptOnDemand) {
                    statusTags?.relInfoCodeConfigs?.forEach(item => {
                        if (isIotInfoType(item?.infoCodeType)) {
                            setIotData(props.selectObj.id, item?.infoCode, item);
                        } else if (item?.infoCode === 'alarmeventdetail') {
                            clearAbnormalEventsList([props?.selectObj?.id]);
                            // dataValue是异常事件列表，入池
                            item.dataValue?.forEach(ab => {
                                setAbnormalEvent(ab);
                            });
                        } else if (item?.infoCode === 'riskEventDetailSpaceWithEquipments') {
                            clearAbnormalEventsList([props?.selectObj?.id]);
                            // dataValue是异常事件列表，入池
                            item.dataValue?.forEach(ab => {
                                setAbnormalEvent(ab);
                            });
                        }
                    });
                }
                console.log('tagsValue.value: ', tagsValue.value);
            } else {
                tagsValue.value = {};
            }
        }
        emits('statusLoaded', tagsValue.value, res.data[0]);
    });
};

watch(
    () => props.selectObj,
    () => {
        // 没自定义标签时查标签
        if (!slotsData.tags) {
            getTags();
        }
    },
    {
        immediate: true
    }
);

const dealSpaceTagsEvent = da => {
    if (props.type === 'space') {
        const newData = da[props.id];
        if (newData) {
            Object.keys(newData).forEach(k => {
                tagsValue.value[k] = newData[k];
            });
        }
    }
};

const equipmentId = computed(() => props.selectObj?.id);

useEquipInfoSSEHandle(
    equipmentId,
    {
        equipStatus: tagsValue
    },
    true,
    DETAIL,
    unref(props).sseClient || demandSseClient
);

// 标题最大宽度计算
watchEffect(() => {
    if (headerWidth.value && headerRightRef.value && titleTextRef.value) {
        const leftMaxWidth = (headerWidth.value ?? 480) - (headerRightWidth.value ?? 60) - 10;
        console.log('leftMaxWidth: ', leftMaxWidth, titleTextRef.value.style);
        titleTextRef.value.style.maxWidth = `${leftMaxWidth}px`;
    }
});
onMounted(() => {
    props.sseClient?.addEventListener('OBJECT_TAG', dealSpaceTagsEvent);
});
onBeforeUnmount(() => {
    props.sseClient?.removeEventListener('OBJECT_TAG', dealSpaceTagsEvent);
    fetchAbortController = null;
});

const close = () => {
    emits('close');
    demandSseCloseSse?.();
};

const itemInfo = () => {
    if (!props.selectObj?.id) return;
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${props.selectObj?.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
useWatchWithCleanup(
    () => equipmentId.value,
    () => {
        emitter.emit(CLOSE_CONTROL_FORM, { needHide: true, needClose: true });
    }
);
// curTab,props.selectObj变化时需要重置drawer-inner-id得滚动条
watch([curTab, () => props.selectObj?.id], () => {
    const drawerInner = document.querySelector('#drawer-inner-id');
    if (drawerInner) {
        drawerInner.scrollTop = 0;
    }
});
</script>

<style lang="less" scoped>
.pd24 {
    padding: 16px 24px 4px;
}
.header-title-slot {
    gap: 4px;
    align-items: flex-start;
    .title-text {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        text-wrap-mode: initial;
    }
    .header-title-slot-right {
        margin-top: -1px;
    }
    .title-tag {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        height: 20px;
        gap: 4px;
        :deep(.m-tag-small + .m-tag-small) {
            margin-left: 0;
        }
    }

    .get-line {
        width: 1px;
        height: 14px;
        background: @grey-400;
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
}

.drawer-content {
    width: 100%;
    font-size: 16px;
    :deep(.drawer-tabs-box) {
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
    .drawer-inner {
        overflow: auto;
        font-size: 14px;
        height: 100%;
        // margin-top: 8px;
        border-top: 1px solid #e8ecf0;

        &.has-tabs {
            height: calc(100% - 46px);
            margin-top: 0px;
            border-top: none;
        }
    }
    .drawer-inner-top-line {
        border-top: none;
    }
}
.height-8 {
    height: calc(100% - 8px);
}
.height-50 {
    height: calc(100% - 50px);
}
</style>
