<template>
    <div v-if="currentFloorObj?.id" class="header-container">
        <div class="header-box">
            <div class="left">
                <div v-if="currentFloorObj?.id" class="go-back-wrap">
                    <span class="go-back" @click="goBack"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>
                    <span class="name">
                        <span v-if="curBuildingName" v-ellipsis class="m-ellipsis" style="cursor: pointer" @click="goBack">{{ curBuildingName }}/</span>
                        <span v-ellipsis class="m-ellipsis">{{ curFloorName }}</span>
                    </span>
                </div>
            </div>
            <div class="right">
                <MapSearch
                    :current-floor-tag="false"
                    :spaces="curFloorSpaceList"
                    :equips="curFloorFilteredEquipList"
                    :loading="spacesAndEquipsLoading"
                    @choose="chooseObj"
                ></MapSearch>
                <div class="header-box-select">
                    <m-checkbox class="checkbox" :model-value="onlyShowControlledEquipmentRef" @change="onlyShowControlledEquipmentChange">
                        {{ i18n.global.t('meos_control_web.only_controllable_equipment') }}
                    </m-checkbox>
                    <span class="box-split ml12"></span>
                    <!-- 设备类 -->
                    <m-select
                        v-model="curFilterEquipClassCodes"
                        :max-scroll-height="362"
                        :size="200"
                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                        :prefix="i18n.global.t('meos_control_web.equipment_type_colon')"
                        noborder
                        clearable
                        multiple
                        :options="eqTypeOptions"
                    >
                    </m-select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import useHeaders from './hooks/useHeaders';

defineProps({
    filterOptionData: {
        type: Array,
        default: () => []
    }
});
const emits = defineEmits(['choose', 'hoverObj', 'unhoverObj']);

const {
    currentFloorObj,
    searchEquips,
    spacesAndEquipsLoading,
    curBuildingName,
    curFloorName,
    eqTypeOptions,
    curFloorFilteredEquipList,
    curFloorSpaceList,
    curFilterEquipClassCodes,
    onlyShowControlledEquipmentChange,
    onlyShowControlledEquipmentRef,

    goBack,
    chooseObj,
    hoverObj,
    unhoverObj
} = useHeaders(emits);
</script>

<style lang="less" scoped>
.header-container {
    width: 100%;
    height: 48px;
    z-index: 99;
    position: absolute;
    top: 0;
    left: 0;
    padding: 16px 16px 0 12px;
    .header-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
            flex: 1;
            min-width: 0;
            align-items: center;
            .header-name {
                color: @grey-800;
                font-size: 20px;
                font-style: normal;
                font-weight: 700;
                line-height: 32px;
            }
        }
        .go-back-wrap {
            flex: 1;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: @grey-900;
            width: 100%;

            .go-back {
                display: inline-flex;
                align-items: center;
                cursor: pointer;

                &:hover {
                    background-color: #c4c9cf;
                }
            }
            .name {
                display: flex;
                min-width: 0;
                align-items: center;
                color: @grey-800;
                font-size: 18px;
                font-weight: 700;
            }
        }
        .right {
            display: flex;
            gap: 8px;

            .check-warp {
                padding: 0px 8px 0px 8px;
                border-radius: 4px;
                background: var(--Grey-Grey-0, #fff);
                box-shadow: 0px 2px 10px 0px rgba(27, 33, 41, 0.1);
            }
            .header-box-select {
                height: 32px;
                border-radius: 4px;
                background: #fff;
                padding: 8px 4px 8px 12px;
                border: 1px solid var(--gray-400);
                display: flex;
                align-items: center;
                .box-split {
                    width: 1px;
                    height: 14px;
                    opacity: 0.4;
                    background: var(--gray-500, #8b949e);
                }
                :deep(.m-select) {
                    height: 24px;
                }
                &:not(:has(.box-split)) {
                    padding: 8px 0px 8px 0px;
                }
                :deep(.m-checkbox-label) {
                    max-width: 86px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                }
            }
        }
    }
}
</style>
