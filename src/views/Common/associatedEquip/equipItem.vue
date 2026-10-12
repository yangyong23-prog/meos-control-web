<template>
    <div class="content-wrap" @mouseenter="emits('hoverEquip', data)" @mouseleave="emits('unhoverEquip')">
        <div class="title-wrap">
            <div class="left">
                <div class="fc">
                    <m-tips
                        v-if="curFloorId && curFloorId != item.floorId"
                        :content="i18n.global.t('meos_control_web.device_not_on_floor_click_jump')"
                        theme="darkTransparent"
                        trigger="hover"
                    >
                        <div v-ellipsis :class="['title', typeName === 'KitchenFumes' ? 'hover-title' : '', 'cp']" @click="emits('clickEquip', data)">
                            {{ item?.localName ?? '--' }}
                        </div>
                    </m-tips>
                    <div v-else v-ellipsis :class="['title', typeName === 'KitchenFumes' ? 'hover-title' : '', 'cp']" @click="emits('clickEquip', data)">
                        {{ item?.localName ?? '--' }}
                    </div>
                    <span v-if="item?.additionalInfo" class="tag grey" style="margin-right: 4px">{{ item?.additionalInfo }}</span>
                    <span v-if="item?.floorName" class="tag" style="margin-right: 4px" :class="{ grey: selectObj.floorId != item.floorId }">{{ item.floorName ?? '--' }}</span>
                    <span v-show="curFloorId && curFloorId != item.floorId" class="tag grey" style="margin-right: 4px">{{ i18n.global.t('meos_control_web.cross_floor') }}</span>
                </div>
                <div class="tag-wrap mt8">
                    <TemplateObjectTags :status-data="item?.tagsValue" :select-obj="item" :template-type="DETAIL" />
                </div>
            </div>
            <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                <div class="right" @click.stop="jumpTo(item.id)">
                    <EquipHoverIcon></EquipHoverIcon>
                </div>
            </m-tips>
        </div>
        <independentSetting :list="item" :select-obj="selectObj" />
        <div v-if="item && item.serviceSpace && item.serviceSpace.length && item.serviceSpace.length > 0" class="open-wrap">
            <div class="title" style="width: 100%">
                <div
                    class="cp fc"
                    @click.stop="
                        () => {
                            open = !open;
                        }
                    "
                >
                    <span style="margin-right: 4px">{{ i18n.global.t('meos_control_web.view_device_service_space') }}</span>
                    <IconMeriComponentChevronDown color="#246fe5" class="arrow" :class="{ rotate: open }" size="14"></IconMeriComponentChevronDown>
                </div>
            </div>
            <div v-show="open" class="open-content">
                <div v-for="res in item.serviceSpace" :key="res.id" :class="[props.typeName === 'KitchenFumes' ? 'cp' : '', 'item-wrap']" @click.stop="openSpace(res)">
                    <div class="left">
                        <span class="text">{{ res?.localName ?? '--' }}</span>
                        <span v-show="res?.floorName" class="tag">{{ res?.floorName ?? '--' }}</span>
                    </div>
                    <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                        <div class="right" @click.stop="jumpTo(res.id)">
                            <EquipHoverIcon></EquipHoverIcon>
                        </div>
                    </m-tips>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import EquipHoverIcon from '@/assets/svg/equipHoverIcon.svg';
import { IconMeriComponentChevronDown } from 'meri-icon';
import { openWebsite } from '@/utils/websiteNavigation';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { getAuthParamsString } from '@/utils/envUtils';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import independentSetting from '@/components/independentSetting/index.vue';
// import equipmentTags from '@/components/equipmentTags/index.vue';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import { computed, ref } from 'vue';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';

import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { DETAIL } from '@/utils/globalVariables';

const commonDrawerRoot = inject(commonDrawerRootContextKey);

const emits = defineEmits('unhoverEquip', 'hoverEquip', 'clickEquip', 'clickSpace');

const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    curFloorId: {
        type: String,
        default: ''
    },
    typeName: {
        type: String,
        default: ''
    }
});

// eslint-disable-next-line vue/no-setup-props-destructure
const equipmentId = ref(props.data.id);

// eslint-disable-next-line vue/no-setup-props-destructure
const relInfoCodeGroupConfigs = ref(props.data.relInfoCodeGroupConfigs);
const equipStatus = ref(relInfoCodeGroupConfigs.value.find(i => i.groupCode === 'equipStatus'));
const equipParameterSet = ref(relInfoCodeGroupConfigs.value.find(i => i.groupCode === 'equipParameterSet'));

useEquipInfoSSEHandle(
    equipmentId,
    {
        equipStatus: equipStatus,
        equipParameterSet: equipParameterSet
    },
    true,
    DETAIL,
    commonDrawerRoot?.demandSseClient
);

const openSpace = data => {
    if (props.typeName !== 'KitchenFumes') return;
    emits('clickSpace', data);
};
const open = ref(false);

const item = computed(() => {
    const { data = {} } = props;
    // floorId 可能不存在
    const { localName, localId } = data?.floorId ? getFloorInfoByFloorId(data.floorId) : {};
    // 转化为independentSetting所需要的格式
    let additionalInfo;
    const additionalInfos = relInfoCodeGroupConfigs.value.find(i => i.groupCode === 'objectAdditionalInfo')?.relInfoCodeConfigs;
    if (additionalInfos) {
        const { dataValue = '', dataSource = [] } = additionalInfos.find(i => i.infoCode === 'funcType');
        additionalInfo = dataSource.find(i => i.code === dataValue)?.name;
    }

    return {
        ...data,
        // 待验证
        ...equipParameterSet.value,
        floorName: localName || localId,
        additionalInfo,
        serviceSpace: data?.serviceSpace?.map(s => {
            const { localName: innerName, localId: innerId } = s?.floorId ? getFloorInfoByFloorId(s.floorId) : {};
            const floorName = innerName || innerId;
            return { ...s, floorName: floorName };
        }),
        // relInfoCodeConfigs: equipParameterSet?.value?.relInfoCodeConfigs?.length ? equipParameterSet.value.relInfoCodeConfigs : [],
        tagsValue: equipStatus.value
    };
});

//TODO:考虑以后做到independentSetting组件中
const model = computed(() => {
    let model = '',
        manualAutoSetItem = equipParameterSet.value.relInfoCodeConfigs.find(res => res.infoCode === 'manualAutoSet');
    if (manualAutoSetItem) {
        model = manualAutoSetItem?.dataValue;
    }
    return model;
});
</script>

<style lang="less" scoped>
.tag {
    padding: 0 4px;
    display: inline-block;
    border-radius: 2px;
    line-height: 20px;
    background: @blue-100;
    color: @blue-700;
    font-size: 12px;
    font-weight: var(--platform-font-weight);
    margin-left: 4px;
}
.grey {
    background: @grey-200;
    color: @grey-900;
}
.content-wrap {
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 16px;
    margin-right: 14px;

    &:last-child {
        margin-bottom: 0;
    }
    background: @grey-50;
    border: 1px solid @grey-50;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    &:hover {
        border-color: @blue-500;
    }
    .title-wrap {
        display: flex;
        // align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        // cursor: pointer;
        .left {
            // display: flex;
            // align-items: center;
            // background: red;
            flex: 1;
            overflow: hidden;
            .title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: @grey-900;
                font-size: 16px;
                font-weight: 700;
                // width: 100%;
                line-height: 22px;
            }
            .hover-title:hover {
                color: #246fe5;
            }
            .tag-wrap {
                flex-shrink: 0;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                height: 20px;
                gap: 4px;
            }
        }
        .right {
            cursor: pointer;
            width: 18px;
            height: 18px;
            margin-left: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
                border-radius: 2px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
    .open-wrap {
        flex: 1;
        color: @blue-500;
        // margin-top: 8px;
        height: 28px;
        text-align: center;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        .title {
            display: flex;
            align-items: center;
            // cursor: pointer;
            user-select: none;
            // background: red;
            > span {
                line-height: 28px;
            }
        }
        .open-content {
            padding-top: 8px;
            // cursor: pointer;
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
                    .text {
                        color: @grey-600;
                        text-align: center;
                        font-size: 14px;
                        font-weight: var(--platform-font-weight);
                        line-height: 22px;
                        margin-right: 4px;
                    }
                }
                .right {
                    width: 18px;
                    height: 18px;
                    display: none;
                    &:hover {
                        border-radius: 2px;
                        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                    }
                }
                &:hover {
                    border-radius: 4px;
                    border-bottom: 1px solid @grey-200;
                    background: rgba(196, 201, 207, 0.3);
                    .right {
                        width: 18px;
                        height: 18px;

                        display: block;
                    }
                }
                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }
    .arrow {
        transition: transform 0.3s linear;
        font-size: 14px;
    }
    .rotate {
        transform: rotate(180deg);
        transition: transform 0.3s linear;
    }
}
:deep(.pd-class) {
    padding: 8px 0px;
}
</style>
