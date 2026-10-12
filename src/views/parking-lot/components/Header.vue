<template>
    <div class="parking-lot-header">
        <template v-if="!floorView">
            <div class="left-box">
                <img class="img" src="@/assets/images/common/ac-class-icon.png" alt="header-icon" />
                <span class="title">{{ i18n.global.t('common.meos_home_parking_lot') }}</span>
            </div>
        </template>
        <template v-else>
            <div class="go-back-wrap">
                <div class="go-back" @click="goBackBuilding"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" />{{ i18n.global.t('meos_control_web.back') }}</div>
                <div class="line"></div>
                <div class="name">{{ buildingLocalName ? `${buildingLocalName}/${curFloorName || '--'}` : curFloorName || '--' }}</div>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import { floorViewInjectKey, closeDetailDrawerInjectKey, currentFloorObjInjectKey } from '../constant/injectKey';

const currentFloorObj = inject(currentFloorObjInjectKey, ref(null));
const floorView = inject(floorViewInjectKey);
const closeDetailDrawer = inject(closeDetailDrawerInjectKey);

const curFloorName = computed(() => {
    const n = currentFloorObj?.value?.floorLocalName || currentFloorObj?.value?.localName || currentFloorObj?.value?.floorName || '--';
    return n ? i18n.global.t('meos_control_web.floor_num', { floor: n }) : '';
});

const buildingLocalName = computed(() => {
    return currentFloorObj?.value?.buildingLocalName || '';
});

const goBackBuilding = () => {
    closeDetailDrawer?.();
    currentFloorObj.value = null;
};
</script>

<style lang="less" scoped>
.parking-lot-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    height: 48px;
    width: 100%;
    padding: 16px 16px 0px 10px;
    display: flex;
    align-items: center;

    .left-box {
        display: flex;
        align-items: center;
        flex-shrink: 0;

        .img {
            width: 44px;
            height: 44px;
        }

        .title {
            color: @grey-800;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            line-height: 32px;
            margin-inline: 6px 8px;
        }
    }

    .go-back-wrap {
        display: flex;
        align-items: center;
        margin-left: 6px;
        column-gap: 4px;

        .go-back {
            display: flex;
            align-items: center;
            column-gap: 2px;
            padding: 5px 8px 5px 4px;
            cursor: pointer;
            color: @grey-900;
            font-size: 16px;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
        }

        .line {
            width: 1px;
            height: 16px;
            background-color: @grey-400;
        }
        .name {
            padding-left: 8px;
            color: @grey-800;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            line-height: 32px;
        }
    }
}
</style>
