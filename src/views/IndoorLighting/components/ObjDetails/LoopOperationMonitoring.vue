<template>
    <div class="loop-operation-monitoring w100">
        <template v-if="groupConfigs?.length > 0">
            <div v-for="(g, index) in groupConfigs" :key="index" class="group-item">
                <div class="title-item f16 fb7">{{ g.groupName }}</div>
                <ControlSet
                    v-if="g.groupCode === 'controlledParameterSet'"
                    :info-codes="g.relInfoCodeConfigs"
                    :object-id="data?.id"
                    :set-conditions="controlledParameterSetCondition(g)"
                    :custom-intervention-time="customInterventionTime"
                    show-data-source
                    show-reason
                    :show-info="false"
                    form-width="370px"
                ></ControlSet>

                <div v-else class="info-list-wrap w100">
                    <EquipmentOperationInfo :list="g" :select-obj="data"></EquipmentOperationInfo>
                </div>
            </div>
        </template>
        <div v-else class="no-data">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import ControlSet from '@/components/ObjectInfoComponents/ControlSet/index.vue';
import dataDockHandling from '@/hooks/dataDockHandling';
import useLoading from '@/hooks/useLoading';
import EquipmentOperationInfo from '@/views/Common/EquipDetails/EquipmentOperationInfo.vue';
import { RUNNING_MONITOR_TYPE } from '../../variables';
import { INTERVENTION_TIME_V2 } from '@/components/ObjectInfoComponents/ControlForm/config';
import { getNextFiveMinutePoint } from '@/utils/tools';
import dayjs from 'dayjs';
const { loadDynaDataWithIotHandling } = dataDockHandling();
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
let fetchAbortController = null;

const groupConfigs = ref();

// 加载动画相关
const { loading, openLoading, closeLoading } = useLoading(
    'loop-operation-monitoring',
    '#FFFFFF',
    'ball',
    {
        width: '100px',
        height: '100px'
    },
    0
);
const customInterventionTime = formList => {
    const spoce = `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(1, 'year').format('YYYY.MM.DD HH:mm:00')}`;

    formList.push(
        INTERVENTION_TIME_V2(
            spoce,
            undefined,
            { scopeDisabledTipsText: i18n.global.t('meos_control_web.only_1_year_range_allowed') },
            {
                useLongterm: false,
                scopeDisabledTipsText: i18n.global.t('meos_control_web.only_1_year_range_allowed')
            }
        )
    );
};
const controlledParameterSetCondition = g => {
    return g.groupChildren?.[0]?.relInfoCodeConfigs.map(item => item.infoCode) || [];
};
const loadData = async () => {
    groupConfigs.value = null;
    fetchAbortController?.abort();
    fetchAbortController = new AbortController();
    openLoading();
    const parames = {
        runningMonitorType: RUNNING_MONITOR_TYPE,
        templateType: DETAIL,
        objectIds: [props.data?.id],
        filterGroups: [
            {
                groupCode: 'controlledParameterSet',
                deepQuery: true
            },
            {
                groupCode: 'runningParameter',
                deepQuery: true
            }
        ]
    };
    try {
        const { code, data } = await loadDynaDataWithIotHandling(parames, listInfoCodeConfigsByObjectIdCommon, fetchAbortController?.signal);
        if (code === SUCCESSCODE && data?.length > 0) {
            groupConfigs.value = data[0].relInfoCodeGroupConfigs;
        }
    } finally {
        closeLoading();
    }
};
watch(
    () => props.data,
    () => {
        if (props.data?.id) {
            loadData();
        }
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.loop-operation-monitoring {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    padding: 16px 24px;
    height: 100%;

    gap: 20px;

    .group-item {
        width: 100%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap: 16px;
    }
    .title-item {
        position: relative;
        margin-left: 10px;

        &::before {
            position: absolute;
            width: 3px;
            height: 14px;
            background: #246fe5;
            left: -10px;
            top: 4px;
            content: '';
        }
    }
    .title-item:not(:first-of-type) {
        margin-top: 12px;
    }

    :deep(.control-set) {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        .control-set-item {
            padding: 8px 10px;
            border-radius: 8px;
            background: var(--gray-50, #f7f9fa);
        }
    }
    .no-data {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
