<template>
    <div class="demand-space-deviation">
        <m-select
            v-model="abnormalType"
            size="auto"
            class="demand-space-filter-select"
            :options="abnormalList"
            :max-scroll-height="362"
            :placeholder="i18n.global.t('meos_control_web.please_select')"
            :prefix="i18n.global.t('meos_control_web.abnormal_type_colon')"
        ></m-select>
        <div class="demand-sapce-table-warp" :class="{ empty: !deviationList?.length }">
            <m-table :columns="list" :merge-method="mergeMethod" :data-source="deviationList" :column-line="true">
                <template #localName="space">
                    <div class="space-obj" @click="showDetail(space)">
                        <p v-ellipsis class="space-name">{{ space.localName || '--' }}</p>
                        <span v-if="getIsAbnormal(space)" class="abnormal-tag">{{ i18n.global.t('meos_control_web.abnormal') }}</span>
                    </div>
                </template>
                <template #realArmingStatus="{ realArmingStatus }">
                    <div class="table-item">{{ spaceStatusTxtMap[realArmingStatus] }}</div>
                </template>
                <template #demandArmingStatus="{ demandArmingStatus }">
                    <div class="table-item">{{ spaceStatusTxtMap[demandArmingStatus] }}</div>
                </template>
            </m-table>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { openDetailDrawerInjectKey, closeDetailDrawerInjectKey, showModuleInfoInjectKey, selectModuleInfoInjectKey } from '../constants/injectKey';
import { abnormalSpaceMapListInjectKey } from '../hooks/useDashboard';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';
import { OBJ_TYPE } from '@/utils/globalVariables';
const props = defineProps({
    floorObj: {
        type: Object,
        default: () => ({})
    }
});

const openDetailDrawer = inject(openDetailDrawerInjectKey);
const abnormalSpaceMapList = inject(abnormalSpaceMapListInjectKey);

const getIsAbnormal = space => {
    const spaceStatus = abnormalSpaceMapList.value[space.id];
    return spaceStatus?.indexOf(ABNORMAL_EVENT) > -1;
};

const abnormalList = ref([
    { id: 'disArmDeviation', name: i18n.global.t('meos_control_web.disarm_demand_deviation') },
    // { id: 'accessDeviation', name: '空间通行 - 需求偏离' },
    { id: 'abnormal', name: i18n.global.t('meos_control_web.abnormal_event') }
]);
const abnormalType = ref(abnormalList.value[0].id);

const spaceStatusTxtMap = {
    DEPLOY_A_DEFENCE: i18n.global.t('common.arm'),
    WITHDRAW_A_GARRISON: i18n.global.t('meos_control_web.disarm_alt'),
    PARTIAL_DEFENSE: i18n.global.t('meos_control_web.partial_arm'),
    UNKNOWN: i18n.global.t('meos_control_web.monitoring_unavailable')
};

const list = ref([
    {
        dataIndex: 'localName',
        title: i18n.global.t('meos_control_web.space_name'),
        weight: 3
    },
    {
        dataIndex: 'realArmingStatus',
        title: i18n.global.t('meos_control_web.actual_status'),
        weight: 2
    },
    {
        dataIndex: 'demandArmingStatus',
        title: i18n.global.t('meos_control_web.demand_target'),
        weight: 2
    }
]);

const deviationList = computed(() => {
    const { demandDeviatedSpaces = [] } = props.floorObj;
    if (!abnormalType.value) return [...demandDeviatedSpaces];

    if (abnormalType.value === 'abnormal') {
        return demandDeviatedSpaces.filter(item => {
            return getIsAbnormal(item);
        });
    }

    return demandDeviatedSpaces;
});

const mergeMethod = (row, col, rowIndex, colIndex) => {
    // if (rowIndex % 2 === 0 && colIndex === 0) {
    //     return {
    //         rowspan: 2,
    //         colspan: 1
    //     };
    // }

    // if (rowIndex % 2 === 1 && colIndex === 0) {
    //     return {
    //         rowspan: 0,
    //         colspan: 1
    //     };
    // }

    return {
        rowspan: 1,
        colspan: 1
    };
};

const showDetail = space => {
    const spaceObj = {
        id: space.id,
        localName: space.localName ?? '--',
        objType: OBJ_TYPE.SPACE
    };
    openDetailDrawer(spaceObj);
};
</script>

<style lang="less" scoped>
.demand-space-deviation {
    padding-top: 12px;
    height: 100%;
    :deep(.demand-space-filter-select) {
        width: 100%;
        .m-select {
            width: 100% !important;
            .m-select-inner {
                width: 100% !important;
            }
        }
    }

    .demand-sapce-table-warp {
        margin: 24px 0;
        max-height: calc(100% - 64px);
        &.empty {
            height: calc(100% - 64px);
        }
        .space-obj {
            cursor: pointer;
            padding: 4px 0;
            .space-name {
                // 超出两行省略
                width: 100%;
                padding: 2px 0;
                font-size: 14px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;

                &:hover {
                    color: var(--blue-500);
                }
            }

            .abnormal-tag {
                display: inline-block;
                padding: 0px 4px;
                justify-content: center;
                align-items: center;
                gap: 10px;
                border-radius: 2px;
                background: var(--red-500);
                color: #fff;
                margin-top: 2px;
            }
        }
    }
}
</style>
