<template>
    <div class="passenger-flow-header">
        <template v-if="!floorView">
            <div class="left-box">
                <img class="img" src="@/assets/images/common/ac-class-icon.png" alt="header-icon" />
                <span class="title">{{ i18n.global.t('meos_control_web.passenger_flow_statistics') }}</span>
                <span class="date">{{ todayDate }}</span>
            </div>
        </template>
        <template v-else>
            <div class="go-back-wrap">
                <div class="go-back" @click="goBackBuilding">
                    <IconMeriComponentChevronLeft :size="18" :color="'#424C59'" />
                </div>
                <div class="name">
                    <template v-if="currentBuidingNum > 1 && buildingLocalName"> {{ buildingLocalName }}/ </template>{{ curFloorName || '--' }}
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import { floorViewInjectKey, closeDetailDrawerInjectKey, currentFloorObjInjectKey, currentBuidingNumInjectKey } from '../constant/injectKey';
import { getDayjsTz } from '@/utils/globalVariables';

const currentFloorObj = inject(currentFloorObjInjectKey, ref(null));
const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
const currentBuidingNum = inject(currentBuidingNumInjectKey);

const curFloorName = computed(() => {
    const n = currentFloorObj?.value?.floorLocalName || currentFloorObj?.value?.localId || currentFloorObj?.value?.localName || '--';
    return n ? i18n.global.t('meos_control_web.floor_num', { floor: n }) : '';
});

const floorView = inject(floorViewInjectKey);

const todayDate = computed(() => {
    return getDayjsTz().format('YYYY.MM.DD');
});

const goBackBuilding = () => {
    closeDetailDrawer?.();
    currentFloorObj.value = null;
};
const buildingLocalName = computed(() => {
    if (currentFloorObj.value) {
        return `${currentFloorObj.value.buildingLocalName ?? '--'}`;
    }
    return '';
});
</script>

<style lang="less" scoped>
.passenger-flow-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 65;
    height: 48px;
    width: 100%;
    padding: 16px 16px 0px 12px;
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

        .date {
            color: @grey-900;
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
        }
    }

    .go-back-wrap {
        display: flex;
        align-items: center;
        margin-left: 6px;
        column-gap: 4px;

        .go-back {
            cursor: pointer;
        }
        .name {
            color: @grey-800;
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            line-height: 32px;
        }
    }
}
</style>
