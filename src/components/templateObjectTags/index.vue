<template>
    <m-tag v-for="tag in tagsValueFun" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
</template>
<script setup>
import i18n from '@/localization';
import { MEOS_TMP_TAG_STYLES } from '@/config';
import DockSingleton from '@/hooks/responsiveDock';
import { isIotInfoType, isRiskEventInfoType, INFO_TAG_DEFINE } from '@/utils/infoTemplate';
import { SYSTEM_CLASSCODE } from '@/views/ACAC/variables';
import { isEmpty } from 'lodash';
import { useRoute } from 'vue-router';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { DANEGER_STATUS } from '@/utils/globalVariables';
import routeUtils from '@/utils/routeUtils';

const { getIotData, getObjectDanegerStatus, getObjectAndRelatedDanegerList, getObjectAbnormalStatus, getCustomInfo } = DockSingleton.getInstance();

// import { isEdge } from '@/utils/envUtils';
const props = defineProps({
    statusData: {
        type: Object,
        default: () => {}
    },

    templateType: {
        type: String,
        default: ''
    },
    filterArr: {
        type: Array,
        default: () => []
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    isSubscriptOnDemand: {
        type: Boolean,
        default: false
    },
    filterTags: {
        type: Function,
        default: null
    }
});
const route = useRoute();
const defineInfo = ref(MEOS_TMP_TAG_STYLES || INFO_TAG_DEFINE);
const commonDrawerRoot = inject(commonDrawerRootContextKey);

const DANGER_STATUS_ORDERS = {
    [DANEGER_STATUS.EXCEPTION.code]: 10,
    [DANEGER_STATUS.CONJECTURE_EXCEPTION.code]: 9,
    [DANEGER_STATUS.POTENTIAL.code]: 8,
    [DANEGER_STATUS.UNKNOWN.code]: 7,
    [DANEGER_STATUS.GENERAL_NORMAL.code]: 6,
    [DANEGER_STATUS.NORMAL.code]: 5
};
const dangerStatusPriority = computed(() => {
    const dangerEventList = getObjectAndRelatedDanegerList([props.selectObj?.id]);
    const record = {};
    let arr = [];
    dangerEventList?.forEach(item => {
        const { status } = item;
        if (!record[status]) {
            record[status] = true;
            if (DANGER_STATUS_ORDERS[status]) {
                arr.push({
                    status,
                    order: DANGER_STATUS_ORDERS[status]
                });
            }
        }
    });
    arr = arr.sort((a, b) => b.order - a.order);
    return arr.length > 0 ? arr[0] : null;
});

const tagsValueFun = computed(() => {
    if (defineInfo.value && props.templateType && props.statusData) {
        const bft = defineInfo.value.base || {};
        const tmp = defineInfo.value[(props.templateType || '').toLowerCase()] || {};
        const statusMap = {
            ...bft,
            ...tmp
        };
        // 空间安防中 用 spaceSecurityRunStatus配置替换runStatus, 因为展示状态文案不一致
        if (routeUtils.isSpaceSecuritySystem(route) && statusMap.spaceSecurityRunStatus) {
            statusMap.runStatus = statusMap.spaceSecurityRunStatus;
        }
        const tags = [];
        const dealInfo = info => {
            const infoDefine = statusMap[info.infoCode];
            // 当前是异常状态，且从池子里拿到异常，则直接返回异常状态标签
            if (infoDefine) {
                // alarmeventdetail信息点是针对接入新的异常事件推送，特有配置
                if (info.infoCode === 'alarmeventdetail' || info.infoCode === 'riskEventDetailSpaceWithEquipments') {
                    const isAbnormal = getObjectAbnormalStatus(props?.selectObj?.id);
                    return isAbnormal ? infoDefine.value : null;
                } else if (info.infoCode === 'alarmstatus') {
                    if (props.isSubscriptOnDemand || commonDrawerRoot?.props.isSubscriptOnDemand) {
                        // 对于按需订阅的，查池子里的
                        // 这里是针对冰蓄冷（空调冷源ACAC)系统类设备的alarmstatus信息点
                        const isAbnormal = getObjectAbnormalStatus(props?.selectObj?.id);
                        return isAbnormal ? infoDefine.value : null;
                    }
                    // 针对无法存入异常事件池子的数据如 dataValue 为 'alarmstatus'，进行特殊处理。
                    // 相关模块： 空压机、电梯、客流等
                    if (typeof info?.dataValue === 'string' && info?.dataValue) {
                        return infoDefine[info.dataValue];
                    }
                } else if (isIotInfoType(info.infoCodeType)) {
                    const latestIot = getIotData(props.selectObj?.id, info.infoCode);
                    if (!isEmpty(latestIot)) {
                        return infoDefine[latestIot.dataValue];
                    }
                    const filterInfo = props.filterArr.includes('stopFloor');

                    if (!filterInfo && info.infoCode === 'stopFloor') {
                        const infoObj = {
                            color: '#2AA4FF',
                            name: `${i18n.global.t('meos_control_web.current_floor_colon')}${info.dataValue || '--'}`
                        };
                        return infoObj;
                    }
                } else if (isRiskEventInfoType(info.infoCodeType)) {
                    // TODO
                } else {
                    const customInfo = getCustomInfo(props.selectObj?.id, info.infoCodeType, info.infoCode);
                    console.log('customInfo :>> ', customInfo);
                    if (props.filterTags) {
                        const shouldShow = props.filterTags(info);
                        if (!shouldShow) {
                            return null;
                        }
                    }
                    if (!isEmpty(customInfo)) {
                        return infoDefine[customInfo.dataValue];
                    }
                    return infoDefine[info.dataValue];
                }
            }

            if (infoDefine) {
                return infoDefine[info.dataValue];
            }

            return null;
        };
        props.statusData?.relInfoCodeConfigs?.forEach(info => {
            if (info.infoCode === 'dangerEvent') {
                const dangerObj = dangerStatusPriority.value;
                if (dangerObj) {
                    const infoDefine = statusMap[info.infoCode];
                    // 当前是异常状态，且从池子里拿到异常，则直接返回异常状态标签
                    if (infoDefine) {
                        const obj = infoDefine[dangerObj.status];
                        if (obj) {
                            tags.push(obj);
                        }
                    }
                }
            } else {
                const styleInfo = dealInfo(info);
                if (styleInfo) {
                    tags.push(styleInfo);
                }
            }
        });
        // .filter(Boolean);
        // 有高液位报警时 不显示低液位报警

        if (tags?.some(tag => tag?.id === 'highLevAlarm')) {
            return tags.filter(tag => tag?.id !== 'lowLevAlarm');
        } else {
            return tags;
        }
    }
    return [];
});
</script>

<style lang="less" scoped>
.info-tag {
    font-weight: var(--platform-font-weight) !important;
    margin-left: 0px !important;
}
</style>
