<template>
    <div ref="parent" class="info-tag-box">
        <m-tag v-for="tag in outTagsValueFun" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
        <m-popover :content="i18n.global.t('meos_control_web.i_am_hint_text')" :enterable="true">
            <template #content>
                <m-tag v-for="tag in innerTagsValueFun" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
            </template>
            <div v-if="innerTagsValueFun.length > 0" class="num-handle">+{{ innerTagsValueFun.length }}</div>
        </m-popover>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MEOS_TMP_TAG_STYLES } from '@/config';
import DockSingleton from '@/hooks/responsiveDock';
import { isIotInfoType, isRiskEventInfoType, INFO_TAG_DEFINE } from '@/utils/infoTemplate';
import _, { isEmpty } from 'lodash';
import { useRoute } from 'vue-router';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
const { getIotData, getObjectDanegerStatus, getObjectAbnormalStatus, getCustomInfo } = DockSingleton.getInstance();
import { getTextWith } from '@/views/apm-3d/components/D2Component/d2Utils';

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
    }
});
const route = useRoute();
const defineInfo = ref(MEOS_TMP_TAG_STYLES || INFO_TAG_DEFINE);
const commonDrawerRoot = inject(commonDrawerRootContextKey);

const parent = ref(null);
// 计算一行最多放多少个
const number = ref(3);

onMounted(() => {
    window.addEventListener('resize', resize);
    resize();
});

const resize = () => {
    // 标签的长度不一定一样
    let num = 0,
        remainWidth = parent.value.offsetWidth;
    for (let i = 0; i < tagsValueFun.value.length; i++) {
        const item = tagsValueFun.value[i];
        // 8 是加上padding的宽度
        const itemOffsetWidth = getTextWith(item.name, '12px serif') + 8;
        if (remainWidth < itemOffsetWidth) {
            num = i + 1;
            if (i !== 0 && num < tagsValueFun.value.length && remainWidth < 24) {
                num--;
            }
            break;
        } else {
            remainWidth = remainWidth - itemOffsetWidth - 12;
        }
        if (i === tagsValueFun.value.length - 1) {
            num = i + 1;
        }
    }
    number.value = num;
};

onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
});

const outTagsValueFun = computed(() => {
    return tagsValueFun.value.filter((item, index) => {
        return index <= number.value - 1;
    });
});

const innerTagsValueFun = computed(() => {
    return tagsValueFun.value.filter((item, index) => {
        return index > number.value - 1;
    });
});

const tagsValueFun = computed(() => {
    if (defineInfo.value && props.templateType && props.statusData) {
        const bft = defineInfo.value.base || {};
        const tmp = defineInfo.value[(props.templateType || '').toLowerCase()] || {};

        const statusMap = {
            ...bft,
            ...tmp
        };
        const tags = props.statusData?.relInfoCodeConfigs
            ?.map(info => {
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
                    } else if (info.infoCode === 'dangerEvent') {
                        if (props.selectObj?.id) {
                            const dangerStatus = getObjectDanegerStatus(props.selectObj?.id);
                            return infoDefine[dangerStatus.code];
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
                                name: i18n.global.t('meos_control_web.current_floor_colon_item', {
                                    item: info.dataValue || '--'
                                })
                            };
                            return infoObj;
                        }
                    } else if (isRiskEventInfoType(info.infoCodeType)) {
                        // TODO
                    } else {
                        const customInfo = getCustomInfo(props.selectObj?.id, info.infoCodeType, info.infoCode);
                        console.log('customInfo :>> ', customInfo);
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
            })
            .filter(Boolean);
        // 有高液位报警时 不显示低液位报警
        if (tags?.some(tag => tag?.id === 'highLevAlarm')) {
            return tags.filter(tag => tag?.id !== 'lowLevAlarm');
        } else {
            return tags;
        }
    }
    return [];
});

watch(tagsValueFun, () => {
    resize();
});
</script>

<style lang="less" scoped>
.info-tag-box {
    position: relative;
    .info-tag {
        font-weight: var(--platform-font-weight) !important;
        &:not(:first-child) {
            margin-left: 4px;
        }
    }
    .info-tag-vn {
        position: absolute;
    }
    .num-handle {
        border-radius: 2px;
        background: var(--gray-200, #e8ecf0);
        display: inline-block;
        margin-left: 4px;
        // width: 24px;
        height: 20px;
        padding: 0px 4px 0px 4px;
        user-select: none;
        line-height: 20px;
        text-align: center;
        &:hover {
            background: var(--Grey-Grey-300, #e1e5eb);
        }
    }
}
</style>
