<template>
    <div class="single-device-control" :class="{ 'can-jump': canJump }" @mouseenter="emits('hoverEquip', equipmentData)" @mouseleave="emits('unhoverEquip')">
        <div class="single-device-control-title fcb">
            <slot name="title" :title="equipmentData.dynamicName || equipmentData.localName">
                <m-tips :disabled="!needTip" :content="getContent()" theme="darkTransparent">
                    <div v-ellipsis class="title-name" :class="{ 'm-ellipsis': titleEllipsis, canClick: canClick }" @click="clickName">
                        {{ equipmentData.dynamicName || equipmentData.localName }}
                        <template v-if="floorName && !statusData?.relInfoCodeConfigs?.length && !equipmentData.relInfo?.objs?.length > 0">
                            <m-tag color="var(--blue-700)" bg-color="var(--blue-100)" size="small"> {{ floorName }} </m-tag>
                        </template>
                    </div>
                </m-tips>
            </slot>
            <m-tips :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="left">
                <div class="icon-link fcc" @click="itemInfo(equipmentData.id)">
                    <SvgIcon name="detail" />
                </div>
            </m-tips>
        </div>
        <!-- 展开收起面板 -->
        <m-collapse v-model="data" :hover-style="false" only-icon-click>
            <m-collapse-item v-if="statusData?.relInfoCodeConfigs?.length || equipmentData.relInfo?.objs?.length > 0" id="1" class="config-box-item mt8">
                <template #title="{ isActive, click }">
                    <div class="single-device-control-tags fc" :class="{ mb8: showControlSet && controlledParameterSet?.length }" style="gap: 4px">
                        <m-tag v-if="floorName" color="var(--blue-700)" bg-color="var(--blue-100)" size="small"> {{ floorName }} </m-tag>
                        <span v-if="equipmentData.relInfo?.objs?.length > 0" class="tag fcc" @click="click"
                            >{{ equipmentData.relInfo?.groupName + ':' + equipmentData.relInfo?.objs?.length }}
                            <IconMeriComponentChevronUp v-if="isActive" :size="14"></IconMeriComponentChevronUp>
                            <IconMeriComponentChevronDown v-else :size="14"></IconMeriComponentChevronDown>
                        </span>
                        <TemplateObjectTags :status-data="statusData" :select-obj="{ id: equipmentData.id }" :template-type="DETAIL" />
                    </div>
                </template>
                <template #icon> </template>
                <div class="open-content">
                    <div v-for="res in equipmentData.relInfo?.objs || []" :key="res.id" class="item-wrap">
                        <div class="left" style="gap: 4px">
                            <span v-ellipsis class="text m-ellipsis" :class="{ canClickRelInfo: canClickRelInfo }" @click.stop="clickRelInfoName(res)">{{
                                res?.localName ?? '--'
                            }}</span>
                            <m-tag color="var(--blue-700)" bg-color="var(--blue-100)" size="small"> {{ getFloorInfoByFloorId(res.floorId).localName ?? '--' }} </m-tag>
                            <TemplateObjectTags :status-data="getStatusData(res)" :select-obj="{ id: res.id }" :template-type="DETAIL" />
                        </div>
                        <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" placement="left">
                            <div class="right fcc" @click.stop="itemInfo(res.id)">
                                <SvgIcon name="detail" />
                            </div>
                        </m-tips>
                    </div>
                </div>
            </m-collapse-item>
        </m-collapse>
        <div v-if="showControlSet" class="single-device-control-infoCode">
            <ControlSet :info-codes="controlledParameterSet" :object-id="equipmentData.id" :set-conditions="controlledParameterSetCondition" v-bind="controlSetProps"></ControlSet>
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import ControlSet from '@/components/ObjectInfoComponents/ControlSet/index.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString } from '@/utils/envUtils';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp } from 'meri-icon';
import { DETAIL, OBJ_TYPE } from '@/utils/globalVariables';

const props = defineProps({
    equipmentData: {
        type: Object,
        default: () => ({})
    },
    statusData: {
        type: Object,
        default: () => ({})
    },
    selectObj: {
        type: Object,
        default: () => ({})
    },
    showControlSet: {
        type: Boolean,
        default: true
    },
    titleEllipsis: {
        type: Boolean,
        default: true
    },

    needTip: {
        type: Boolean,
        default: true
    },
    canJump: {
        type: Boolean,
        default: false
    },
    controlGroupCode: {
        type: String,
        default: 'equipParameterSet'
    },
    canClick: {
        type: Boolean,
        default: true
    },
    canClickRelInfo: {
        type: Boolean,
        default: false
    },
    configSpaceName: {
        type: String,
        default: ''
    },
    controlSetProps: {
        type: Object,
        default: () => ({})
    }
});
const data = ref([]);
const emits = defineEmits(['clickName', 'clickRelInfoName', 'hoverEquip', 'unhoverEquip']);
const clickName = () => {
    emits('clickName', props.equipmentData);
};
const clickRelInfoName = data => {
    emits('clickRelInfoName', data);
};
const getContent = () => {
    const floor = treeBuildFloorStore().getBuildOrFloor(props.equipmentData?.floorId);
    if (!floor) return '--';
    const build = treeBuildFloorStore().getBuildOrFloor(floor?.buildingId);
    if (props.equipmentData.objType === OBJ_TYPE.SPACE) {
        return i18n.global.t('meos_control_web.located_position_colon') + build?.localName + '-' + floor.localName;
    }
    let spaceName = '';
    // 优先取inSpaces
    if (props.equipmentData?.inSpaces?.length > 0) {
        spaceName = props.equipmentData?.inSpaces[0]?.localName;
    } else if (props.selectObj.objType === OBJ_TYPE.SPACE) {
        spaceName = props.selectObj.localName;
    } else if (props.selectObj?.relSpaceName) {
        spaceName = props.selectObj?.relSpaceName;
    } else {
        spaceName = props.configSpaceName;
    }
    return i18n.global.t('meos_control_web.located_position_colon') + build?.localName + '-' + floor.localName + (spaceName ? '-' + spaceName : '');
};
const controlledParameterSet = computed(() => {
    return props.equipmentData?.relInfoCodeGroupConfigs?.find(item => item.groupCode === props.controlGroupCode)?.relInfoCodeConfigs || [];
});
const controlledParameterSetCondition = computed(() => {
    const equipParameterSet = props.equipmentData?.relInfoCodeGroupConfigs?.find(item => item.groupCode === props.controlGroupCode);
    return equipParameterSet?.groupChildren?.[0]?.relInfoCodeConfigs?.map(item => item.infoCode) || [];
});
const floorName = computed(() => {
    return treeBuildFloorStore().getBuildOrFloor(props.equipmentData?.floorId || props.equipmentData?.inFloor?.id)?.localName || '';
});

const getStatusData = item => {
    // 参数有效性检查：如果item无效或没有配置组，直接返回空数组
    if (!item || !item.relInfoCodeGroupConfigs || !Array.isArray(item.relInfoCodeGroupConfigs)) return [];

    // 根据对象类型查找对应的状态配置组（空间状态或设备状态）
    const statusConfigs = item.relInfoCodeGroupConfigs.find(config => config.groupCode === (item?.objType === OBJ_TYPE.SPACE ? 'spaceStatus' : 'equipStatus'));

    // 返回找到的配置组或默认空配置
    return statusConfigs || { relInfoCodeConfigs: [] };
};

const itemInfo = id => {
    if (!id) return;
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
</script>
<style lang="less" scoped>
.single-device-control {
    background-color: var(--gray-50);
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid transparent;

    .tag {
        padding: 0 4px;
        border-radius: 2px;
        line-height: 20px;
        background: @blue-100;
        color: @blue-700;
        font-size: 12px;
        font-weight: var(--platform-font-weight);
        cursor: pointer;

        :deep(svg) {
            path {
                fill: @blue-700;
            }
        }
    }

    .open-content {
        .item-wrap {
            padding: 0 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 44px;
            border-bottom: 1px solid var(--gray-200, #e8ecf0);
            background: @grey-100;
            // background: red;
            .left {
                display: flex;
                align-items: center;
                min-width: 0px;
                .text {
                    width: 100%;
                    color: @grey-600;
                    text-align: center;
                    font-size: 14px;
                    font-weight: var(--platform-font-weight);
                    line-height: 22px;
                    margin-right: 4px;
                }
            }
            .right {
                cursor: pointer;
                width: 20px;
                height: 20px;
                opacity: 0;
                width: 20px;
                border-radius: 2px;
                transition: opacity 0.3s ease;
                margin-left: 4px;
                &:hover {
                    background-color: var(--alpha-30);
                }
            }
            &:hover {
                border-radius: 4px;
                border-bottom: 1px solid @grey-200;
                background: @grey-200;
                .left {
                    .text.canClickRelInfo {
                        color: var(--blue-500);
                        cursor: pointer;
                    }
                }
                .right {
                    opacity: 1;
                }
            }
            &:last-child {
                border-bottom: none;
            }
        }
    }

    & + .single-device-control {
        margin-top: 12px;
    }
    &.can-jump:hover {
        border: 1px solid var(--blue-500);
    }
    &:hover {
        .icon-link {
            opacity: 1;
        }
        .title-name.canClick {
            color: var(--blue-500);
            cursor: pointer;
        }
    }
    &-title {
        .icon-link {
            cursor: pointer;
            width: 20px;
            height: 20px;
            border-radius: 2px;
            opacity: 0;
            transition: opacity 0.3s ease;
            &:hover {
                background-color: var(--alpha-30);
            }
        }
    }
    :deep(.control-set) {
        .control-set-divider {
            height: 16px;
        }
        .control-set-item {
            padding: 8px 0;
        }
        .control-set-item + .control-set-item {
            border-top: 1px solid var(--gray-200);
        }
    }
}
</style>
