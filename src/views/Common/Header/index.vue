<template>
    <div class="header-warp">
        <div v-if="!floorView" class="header-icon-warp">
            <img src="@/assets/images/common/ac-class-icon.png" style="width: 44px; height: 44px" alt="" />
            <span class="header-name">{{ title }}</span>
        </div>
        <div v-if="floorView" class="go-back-wrap" @click="goBackBuilding">
            <span class="go-back"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" />{{ i18n.global.t('meos_control_web.back') }}</span>
            <span class="line"></span>
            <span class="name"
                ><span v-if="buildingLocalName && currentBuildingNum > 1">{{ buildingLocalName }}/</span>{{ curFloorName }}</span
            >
        </div>
        <slot name="headLeft"></slot>
        <div class="header-right">
            <slot name="headRight"></slot>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    currentFloorObj: {
        type: Object,
        default: () => {}
    },
    currentBuildingNum: {
        type: Number,
        default: 0
    },
    buildingLocalName: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['goBackBuilding']);
const floorView = computed(() => {
    return !!props.currentFloorObj?.id;
});

const curFloorName = computed(() => {
    if (props.currentFloorObj) {
        // 机房夹层出现两个层
        if (
            props.currentFloorObj.localId?.slice(-1) === i18n.global.t('meos_control_web.floor_level') ||
            props.currentFloorObj.floorName?.slice(-1) === i18n.global.t('meos_control_web.floor_level')
        ) {
            return `${props.currentFloorObj.localId || props.currentFloorObj.floorName}`;
        } else {
            return i18n.global.t('meos_control_web.floor_num', { floor: props.currentFloorObj.localId || props.currentFloorObj.floorName });
        }
    }
    return '';
});
const goBackBuilding = () => {
    emits('goBackBuilding');
};
</script>
<style lang="less" scoped>
.header-warp {
    padding: 10px 16px 0px 10px;
    margin-right: 16px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: var(--z-index-system-graph-header);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    .header-icon-warp {
        display: flex;
        align-items: center;
        column-gap: 6px;
        flex-shrink: 0;
        .header-name {
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px;
        }
    }
    .go-back-wrap {
        display: inline-flex;
        padding: 0px 16px 0px 4px;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        border-radius: 4px;
        font-size: 14px;
        color: @grey-900;
        z-index: 20;
        .go-back {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
        }
        .line {
            width: 1px;
            height: 16px;
            background-color: @grey-400;
        }
        .name {
            color: @grey-800;
            text-align: center;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
        }
    }
    .header-right {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        position: relative;
    }
}
</style>
