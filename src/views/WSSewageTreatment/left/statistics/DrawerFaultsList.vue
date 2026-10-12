<template>
    <SimpleDrawer v-model="showDrawer">
        <template #title>
            {{ title }}
        </template>
        <template #content>
            <template v-if="isEmpty">
                <Empty class="empty-container" />
            </template>
            <template v-else-if="isTree">
                <m-scrollbar>
                    <div class="faultslist-drawer-content">
                        <m-tree ref="tree" :data="treeData" :default-expand-all="true" class="faultslist-tree" :item-height="'auto'" :indent="0" readonly last-stage>
                            <template #nodeSlot="subItem">
                                <div v-if="subItem.children" class="parent-row">
                                    <span :class="['parent-title']">{{ subItem?.name || '--' }}</span>
                                </div>
                                <div v-else class="subItem-row">
                                    <div class="subItem-left">
                                        <span class="subItem-title">{{ subItem?.name || '--' }}</span>
                                        <m-tag v-if="subItem.floor" class="ml4" color="#1B4ACC" bg-color="#D9EBFF" size="small">{{ subItem.floor }}</m-tag>
                                        <m-tag v-if="subItem.isOpen" color="#fff" bg-color="#09B3B5" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
                                        <m-tag v-if="subItem.isClose" color="#fff" bg-color="#626C78" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
                                        <m-tag v-if="subItem.isFault" color="#fff" bg-color="#FB9F1E" size="small">{{ i18n.global.t('meos_control_web.fault_signal') }}</m-tag>
                                    </div>
                                    <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                                        <div class="equipment-icon" @click.stop="jumpTo(subItem.id)">
                                            <EquipHoverIcon></EquipHoverIcon>
                                        </div>
                                    </m-tips>
                                </div>
                            </template>
                        </m-tree>
                    </div>
                </m-scrollbar>
            </template>
            <template v-else>
                <m-scrollbar>
                    <div class="faultslist-drawer-content list-wrap">
                        <div v-for="(subItem, index) in treeData" :key="index" class="subItem-row">
                            <div class="subItem-left">
                                <span class="subItem-title">{{ subItem?.name || '--' }}</span>
                                <m-tag v-if="subItem?.floor" class="ml4" color="#1B4ACC" bg-color="#D9EBFF" size="small">{{ subItem.floor }}</m-tag>
                                <m-tag v-if="subItem?.isOpen" color="#fff" bg-color="#09B3B5" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
                                <m-tag v-if="subItem?.isClose" color="#fff" bg-color="#626C78" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
                                <m-tag v-if="subItem?.isFault" color="#fff" bg-color="#F55047" size="small">{{ i18n.global.t('meos_control_web.abnormal') }}</m-tag>
                            </div>
                            <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                                <div class="equipment-icon" @click.stop="jumpTo(subItem.id)">
                                    <EquipHoverIcon></EquipHoverIcon>
                                </div>
                            </m-tips>
                        </div>
                    </div>
                </m-scrollbar>
            </template>
        </template>
    </SimpleDrawer>
</template>
<script setup>
import i18n from '@/localization';
import SimpleDrawer from '@/views/lightingControl/components/simple-drawer/index.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import Empty from '@/components/common/Empty.vue';
import EquipHoverIcon from '@/assets/svg/equipHoverIcon.svg';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { getAuthParamsString } from '@/utils/envUtils';
import { currentFloorObjInjectKey } from '../../constant/injectKey';
import { drawerVisibleStateKey } from '@/hooks/useDrawerVisible';

const currentFloorObj = inject(currentFloorObjInjectKey);
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    faultData: {
        type: Array,
        default: () => []
    }
});
const drawerVisibleState = inject(drawerVisibleStateKey);
const isTree = computed(() => {
    return xplantindoorenvStore().buildingData.length > 1;
});
const isEmpty = computed(() => {
    return !props.faultData.relEquipments?.length;
});
const treeData = computed(() => {
    if (props.faultData.relEquipments?.length) {
        if (isTree.value) {
            const result = props.faultData.relEquipments.reduce((acculator, cur) => {
                if (!currentFloorObj?.value?.id || cur.floorId === currentFloorObj?.value?.id) {
                    if (acculator[cur.buildingId]) {
                        acculator[cur.buildingId].children.push(cur);
                    } else {
                        acculator[cur.buildingId] = {
                            id: cur.buildingId,
                            name: cur.buildingName,
                            children: [cur]
                        };
                    }
                }

                return acculator;
            }, {});
            for (let k in result) {
                result[k].children.sort((a, b) => a.floorSequence - b.floorSequence);
            }
            return Object.values(result);
        } else {
            const equipments = props.faultData.relEquipments;
            equipments.sort((a, b) => a.floorSequence - b.floorSequence);
            return equipments;
        }
    }
    return [];
});

const showDrawer = defineModel({
    type: Boolean,
    default: false
});

onMounted(() => {
    const otherDrawerOne = {
        drawerId: `other-drawer-one`,
        visible: computed(() => showDrawer?.value)
    };

    if (drawerVisibleState?.value) {
        drawerVisibleState.value.push(otherDrawerOne);
    }
});

// TODO 异常标签验证
const checkAbnormalId = computed(() => id => {
    const include = props?.abnormalIds?.includes(id);
    return include;
});

const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
</script>
<style lang="less" scoped>
.subItem-row {
    padding: 12px 0px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .subItem-title {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 20px;
        margin-right: 4px;
    }

    .subItem-left {
        max-width: calc(100% - 20px);
        display: flex;
        align-items: flex-start;
    }

    .equipment-icon {
        width: 18px;
        height: 18px;
        margin-left: 8px;
        cursor: pointer;
        visibility: hidden;
    }
    &:hover {
        .equipment-icon {
            visibility: visible;
        }
    }
}
.parent-row {
    height: 44px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .parent-title {
        color: var(--grey-500, #8b949e);
    }
}
.faultslist-drawer-content {
    padding-left: 24px;
    padding-right: 24px;
    &.list-wrap {
        .subItem-row {
            padding-left: 20px;
            padding-right: 20px;
            border-bottom: 1px solid #e8ecf0;
            border-radius: 0;
            &:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
}
</style>
<style lang="less">
.m-tree.faultslist-tree {
    .m-tree-node > .m-tree-node__content {
        cursor: default;
        border-bottom: 1px solid #e8ecf0;
        border-radius: 0;
        &:hover {
            border-radius: 4px;
        }
    }
    .m-tree-node__content {
        height: auto;
    }
    .m-tree-node__content .container {
        padding-left: 0;
        padding-right: 20px;
        .nodeSlot {
            width: 100%;
            max-width: 100%;
        }
    }
    .m-tree-node__content .icon {
        width: 16px;
        margin-left: -8px;
        height: 16px;
    }
    .m-tree-node.is-notlast > .m-tree-node__content {
        border-bottom: none;
    }
}
</style>
