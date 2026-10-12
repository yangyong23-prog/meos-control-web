<template>
    <div class="header-container">
        <div class="header-box">
            <div class="left">
                <div class="go-back-wrap">
                    <span class="go-back" @click="goBack"><IconMeriComponentChevronLeft :size="18" :color="'#424C59'" /></span>
                    <span class="name">
                        <span v-if="curBuildingName" v-ellipsis class="m-ellipsis" style="cursor: pointer" @click="goBack">{{ curBuildingName }}/</span>
                        <span v-ellipsis class="m-ellipsis">{{ curFloorName }}</span>
                    </span>
                </div>
            </div>
            <div class="right">
                <m-select
                    v-model="curCardViewType"
                    :options="viewTypeOptions"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :size="184"
                    menu-size="auto"
                    @change="showHostControllerSpaceCard"
                ></m-select>

                <m-select
                    v-model="curFilterOption"
                    :options="exceptionScreenList"
                    :prefix="i18n.global.t('meos_control_web.abnormal_filter_colon')"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :size="184"
                    menu-size="300"
                    multiple
                    clearable
                    has-confirm
                    has-check-all
                ></m-select>
                <MapSearch
                    :max-height="488"
                    :current-floor-tag="false"
                    :spaces="searchDataList"
                    :loading="spacesAndEquipsLoading"
                    only-type="space"
                    @choose="chooseObj"
                    @hover-obj="hoverObj"
                    @unhover-obj="unhoverObj"
                ></MapSearch>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import MapSearch from '@/views/Common/MapSearch/index.vue';
import useHeaders from './hooks/useHeaders';
import { exceptionScreenListKey } from '../../hooks/useBaseHook';
import { curFilterOptionKey } from './hooks/useFloorMapHook';

defineProps({
    filterOptionData: {
        type: Array,
        default: () => []
    }
});

const _exceptionScreenList = inject(exceptionScreenListKey);
const curFilterOption = inject(curFilterOptionKey);

const exceptionScreenList = ref([]);

watch(
    _exceptionScreenList,
    () => {
        exceptionScreenList.value = _exceptionScreenList.value?.map(obj => ({ ...obj, name: obj.aliasName || obj.name })) ?? [];
    },
    { immediate: true }
);
const emits = defineEmits(['choose', 'hoverObj', 'unhoverObj']);
const {
    searchDataList,
    spacesAndEquipsLoading,
    curBuildingName,
    curFloorName,
    viewTypeOptions,
    curCardViewType,
    goBack,
    showHostControllerSpaceCard,
    chooseObj,
    hoverObj,
    unhoverObj
} = useHeaders(emits);
</script>

<style lang="less" scoped>
.header-container {
    width: 100%;
    height: 48px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    padding: 16px 0 0 12px;
    .header-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
            flex: 1;
            min-width: 0;
            align-items: center;
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
                border-radius: 4px;

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
        }
    }
}
</style>
