<template>
    <div ref="containerRef" class="table-container">
        <header>
            <div class="left">
                <div class="left-box" :style="{ width: eqListPopover?.length ? 'calc(100% - 78px)' : '100%' }">
                    {{ configsByObjectTableList?.length ? i18n.global.t('meos_control_web.quick_positioning_colon') : '' }}
                    <div ref="eqListRef" class="eq-list" :style="{ width: eqListPopover?.length ? 'calc(100% - 126px)' : 'calc(100% - 118px)' }">
                        <a
                            v-for="item in srotEqList"
                            :key="item.templateTypeName"
                            class="eq-list-item"
                            :href="'#' + item.templateTypeName"
                            @click.prevent="scrollTo('#' + item.templateTypeName)"
                        >
                            <span class="name">{{ item.templateTypeName }}&nbsp;</span><span class="count">({{ item.count }})</span>
                        </a>
                    </div>
                </div>
                <MorePopover v-if="eqListPopover?.length" :is-more="isMore" :eq-list-popover="eqListPopover" @change-more="changeMore" @scroll-to="scrollTo" />
                <div class="filter-checkbox fcc" style="gap: 8px; margin-left: 8px">
                    <m-checkbox-group v-model="filter">
                        <m-checkbox label="iot">{{ i18n.global.t('meos_control_web.iot_monitoring') }}</m-checkbox>
                        <m-checkbox label="error"> {{ i18n.global.t('meos_control_web.abnormal_equipment') }}</m-checkbox>
                    </m-checkbox-group>
                </div>
            </div>
            <IconMeriActionClose class="close" :size="20" @click="changeTableView" />
        </header>
        <Empty v-if="isEmpty && !filterConfigsByObjectTableList.length" class="table-empty" :text="i18n.global.t('meos_control_web.no_content')" />
        <template v-else>
            <div class="table-content">
                <m-scrollbar>
                    <template v-for="item in filterConfigsByObjectTableList" :key="item.templateTypeName">
                        <div v-if="item.dataList.length" :id="item.templateTypeName" :target-id="item.templateTypeName" class="table-item">
                            <div
                                class="title"
                                :class="{
                                    fc: true,
                                    scrollActive: templateTypeId === item.templateTypeName && isActive
                                }"
                            >
                                {{ item.templateTypeName }}
                            </div>
                            <m-table
                                :key="screenWidth"
                                class="table-box"
                                :columns="item.columnsList"
                                :data-source="item.dataList"
                                :empty-text="'--'"
                                :column-line="true"
                                :size="screenWidth > 1600 ? 'medium' : 'small'"
                            >
                                <template #objectName="row">
                                    <div v-ellipsis class="object-name">{{ row.objectName }}</div>
                                </template>
                                <template #alarmeventdetail="row">
                                    <AlarmPopover :row="row" @abnormal-jump="abnormalJump" />
                                </template>
                            </m-table>
                        </div>
                    </template>
                </m-scrollbar>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriActionClose } from 'meri-icon';
import Empty from '@/components/common/Empty.vue';
import MorePopover from './MorePopover.vue';
import AlarmPopover from './alarmPopover.vue';
import useMachineRoomTable from '../hooks/useMachineRoomTable';
const props = defineProps({
    allEquips: {
        type: Array,
        default: () => []
    },
    listTemplateTypes: {
        type: Object,
        default: () => new Map()
    }
});
const emits = defineEmits(['changeTableView']);
const filterConfigsByObjectTableList = computed(() => {
    const arr = structuredClone(configsByObjectTableList.value);
    arr.forEach(item => {
        item.sortId = props.listTemplateTypes.get(item.templateTypeId)?.sequence || 0;
        if (filter.value.includes('iot')) {
            item.dataList = item.dataList.filter(val => {
                const iots = val.iots.filter(v => v.dataValue);
                return iots.length;
            });
        }
        if (filter.value.includes('error')) {
            item.dataList = item.dataList.filter(val => val.alarmeventdetail.length);
        }
    });
    console.log(arr);
    return arr.sort((a, b) => a.sortId - b.sortId);
});
const srotEqList = computed(() => {
    const arr = structuredClone(eqList.value);
    arr.forEach(item => {
        item.sortId = props.listTemplateTypes.get(item.templateTypeId)?.sequence || 0;
    });
    console.log(arr);
    return arr.sort((a, b) => a.sortId - b.sortId);
});
const {
    eqList,
    filter,
    isMore,
    isEmpty,
    isActive,
    eqListRef,
    screenWidth,
    containerRef,
    eqListPopover,
    templateTypeId,
    configsByObjectTableList,
    scrollTo,
    changeMore,
    abnormalJump,
    changeTableView
} = useMachineRoomTable(props, emits);
</script>
<style lang="less" scoped>
.table-container {
    z-index: 100;
    position: absolute;
    top: 0;
    right: 0;
    margin: 16px;
    width: 0;
    height: 0;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 3px 12px 0px rgba(27, 33, 41, 0.12), 0px 0.5px 3px 0px rgba(27, 33, 41, 0.08);
    &.is-open {
        transform-origin: top right;
        animation: expandOpen 300ms ease-in-out forwards;
    }
    header {
        height: 32px;
        display: flex;
        padding: 8px 20px;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e1e5eb;
        box-sizing: content-box;
        .left {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: calc(100% - 20px);
            &-box {
                display: flex;
                align-items: center;
            }
            .eq-list {
                overflow: hidden;
                height: 32px;
                &-item {
                    display: inline-block;
                    padding: 5px 4px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: var(--platform-font-weight);
                    line-height: 22px;
                    margin-right: 12px;
                    &:hover {
                        cursor: pointer;
                        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                    }
                }
                .name {
                    color: #1b2129;
                }
                .count {
                    color: #8b949e;
                }
            }
        }
        .close {
            min-width: 24px;
            max-width: 24px;
            padding: 2px;
            cursor: pointer;
            background: transparent;
            border-radius: 2px;
            &:hover {
                background: #f2f4f6;
            }
        }
    }
    .table-content {
        height: calc(100% - 49px);
        :deep(.meri-table-header-cell) {
            text-align: left;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .table-item {
            .title {
                color: #1b2129;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 26px;
                position: relative;
                padding: 12px 20px 12px 32px;
                &::before {
                    content: '';
                    position: absolute;
                    top: 18px;
                    left: 20px;
                    width: 3px;
                    height: 14px;
                    background: #246fe5;
                }
            }
            .table-box {
                width: calc(100% - 40px);
                margin: 0 20px;
                :deep(.meri-table-body-nodata) {
                    height: 100px;
                }
                .object-name {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            &:last-of-type {
                margin-bottom: 12px;
            }
            .scrollActive {
                animation: 850ms cubic-bezier(0.25, 0.1, 0.25, 1) 50ms 2 fadeGray;
            }
            @keyframes fadeGray {
                0% {
                    background-color: initial;
                }
                35.29% {
                    background-color: #e1e5eb;
                }
                41.18% {
                    background-color: #e1e5eb;
                }
                100% {
                    background-color: initial;
                }
            }
        }
    }
    .table-empty {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100% - 50px);
    }
    .filter-checkbox {
        flex: 0 0 auto;
    }
    @keyframes expandOpen {
        0% {
            transform: scaleX(0);
        }
        100% {
            transform: scaleX(1);
            width: calc(100% - 32px);
            height: calc(100% - 32px);
        }
    }
}
</style>
