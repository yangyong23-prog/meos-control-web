<template>
    <SimpleDrawer v-model="showDrawer">
        <template #title>
            {{ title }}
        </template>
        <template #content>
            <template v-if="isEmpty">
                <Empty class="empty-container" />
            </template>
            <template v-else>
                <m-scrollbar>
                    <div class="statistics-drawer-content">
                        <div v-for="(item, i) in staticData" :key="i" class="equip-item">
                            <div
                                :class="{
                                    'equip-title-header': true,
                                    'is-header-hover': item.id === hoverItemId
                                }"
                                @click.stop="item.open = !item.open"
                                @mouseenter="handleMouse('enter', item.id)"
                                @mouseleave="handleMouse('leave', item.id)"
                            >
                                <div class="left">
                                    <span v-ellipsis class="m-ellipsis fw700">{{ item?.title || '--' }}</span>
                                    <m-tag v-if="item?.floorName" color="#1B4ACC" bg-color="#D9EBFF" size="small">{{ item?.floorName || '--' }}</m-tag>
                                    <m-tag v-if="checkAbnormalId(item.id)" color="#fff" bg-color="#F55047" size="small">{{ i18n.global.t('meos_control_web.abnormal') }}</m-tag>
                                    <m-tag v-if="item.superHigh" color="#FFF" bg-color="#FB9F1E" size="small">{{ i18n.global.t('meos_control_web.ultra_high_level') }}</m-tag>
                                    <m-tag v-if="item.high" color="#FFF" bg-color="#FB9F1E" size="small">{{ i18n.global.t('meos_control_web.high_level') }}</m-tag>
                                </div>
                                <div class="right">
                                    <m-button
                                        :class="{
                                            'icon-btn': true
                                        }"
                                        type="link"
                                        size="small"
                                        @click.stop="goFloorInfo(item)"
                                        >{{ i18n.global.t('meos_control_web.jump_to_floor_to_view_details') }}</m-button
                                    >
                                </div>
                            </div>
                            <m-button
                                v-if="item?.children?.length"
                                type="link"
                                class="expand-btn"
                                :icon="!item.open ? 'IconMeriComponentChevronDown' : 'IconMeriComponentChevronUp'"
                                size="small"
                                @click.stop="item.open = !item.open"
                                >{{ i18n.global.t('meos_control_web.related_sewage_pump') }}</m-button
                            >
                            <span v-else class="without-subItems">{{ i18n.global.t('meos_control_web.no_associated_submersible_sewage_pump') }}</span>
                            <div v-if="item?.open && item?.children?.length" class="item-children">
                                <div v-for="(subItem, index) in item.children" :key="index" class="subItem-row">
                                    <div class="subItem-left">
                                        <span v-ellipsis :class="['subItem-title', 'm-ellipsis']">{{ subItem?.title || '--' }}</span>
                                        <m-tag v-if="item.floor" class="ml4" color="#1B4ACC" bg-color="#D9EBFF" size="small">{{ item.floor }}</m-tag>
                                        <m-tag v-if="subItem.open" color="#fff" bg-color="#09B3B5" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
                                        <m-tag v-if="subItem.close" color="#fff" bg-color="#626C78" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
                                        <m-tag v-if="checkAbnormalId(subItem.id)" color="#fff" bg-color="#F55047" size="small">{{
                                            i18n.global.t('meos_control_web.abnormal')
                                        }}</m-tag>
                                        <m-tag v-if="subItem.isFault" color="#fff" bg-color="#FB9F1E" size="small">{{ i18n.global.t('meos_control_web.fault_signal') }}</m-tag>
                                    </div>
                                    <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                                        <div class="equipment-icon" @click.stop="jumpTo(subItem.id)">
                                            <EquipHoverIcon></EquipHoverIcon>
                                        </div>
                                    </m-tips>
                                </div>
                            </div>
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
import EquipHoverIcon from '@/assets/svg/equipHoverIcon.svg';
import Empty from '@/components/common/Empty.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString } from '@/utils/envUtils';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { currentFloorObjInjectKey } from '../../constant/injectKey';
import { drawerVisibleStateKey } from '@/hooks/useDrawerVisible';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    staticData: {
        type: Array,
        default: () => []
    },
    abnormalIds: {
        type: Array,
        default: () => []
    }
});
const showDrawer = defineModel({
    type: Boolean,
    default: false
});
const drawerVisibleState = inject(drawerVisibleStateKey);
const callToggleWidth = inject('callToggleWidth');
onMounted(() => {
    const otherDrawerOne = {
        drawerId: `other-drawer-one`,
        visible: computed(() => showDrawer?.value)
    };
    if (drawerVisibleState?.value) {
        drawerVisibleState.value.push(otherDrawerOne);
    }
});

const currentFloorObj = inject(currentFloorObjInjectKey);

const isEmpty = computed(() => !props?.staticData?.length);

const hoverItemId = ref(null);

const handleMouse = (type, id) => {
    if (type === 'enter') {
        hoverItemId.value = id;
    } else {
        hoverItemId.value = null;
    }
};

// TODO 异常标签验证
const checkAbnormalId = computed(() => id => {
    const include = props?.abnormalIds?.includes(id);
    return include;
});

const goFloorInfo = item => {
    // TODO 跳转楼层并选中该设备
    const newItem = { localName: item?.floorName ?? '--', localId: item?.floorName, id: item?.floorId, selectedObj: { ...item, objType: 'equipment' } };
    console.log('clickFloorSelectedEquipment', newItem);
    callToggleWidth?.(true);
    currentFloorObj.value = newItem;
    nextTick(() => {
        showDrawer.value = false;
    });
};

const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
</script>

<style lang="less" scoped>
.empty-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

.statistics-drawer-content {
    display: flex;
    padding: 16px 24px;
    flex-direction: column;
    gap: 12px;
    overflow-x: hidden;
}

.equip-item {
    display: flex;
    padding: 12px 12px 4px 12px;
    flex-direction: column;

    border-radius: 4px;
    background: @grey-50;
}

.equip-title-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    .left {
        flex: 1;
        display: flex;
        align-items: center;
        column-gap: 8px;
        width: 100%;
        .m-tag-small + .m-tag-small {
            margin-left: 0px;
        }
    }

    .right {
        position: relative;
        width: 120px;
        height: 28px;
    }

    .icon-btn {
        visibility: hidden;
    }

    &:hover {
        // background-color: rgba(196, 201, 207, 0.3);
        .icon-btn {
            visibility: visible;
        }
    }
}

.is-header-hover {
    .left {
        width: calc(100% - 120px);
    }
}

.expand-btn {
    flex-direction: row-reverse;
}

.without-subItems {
    color: @grey-500;
    height: 28px;
}

.item-children {
    display: flex;
    flex-direction: column;

    border-radius: 8px;
    background: @grey-100;
}

.subItem-row {
    height: 44px;
    padding: 0px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(196, 201, 207, 0.3);

    &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    &:last-child {
        border-bottom: 0px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .subItem-title {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }

    .subItem-left {
        max-width: calc(100% - 20px);
        display: flex;
        align-items: center;
    }

    .equipment-icon {
        width: 18px;
        height: 18px;
        cursor: pointer;
        visibility: hidden;
    }

    &:hover {
        background-color: rgba(196, 201, 207, 0.3);
        .equipment-icon {
            visibility: visible;
        }
    }
}
</style>
