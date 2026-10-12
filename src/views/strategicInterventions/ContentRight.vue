<!--  -->
<template>
    <div class="content-right" :style="{ width: route.query.type == '0' ? '315px' : '442px' }">
        <div class="content-right-title">
            {{ i18n.global.t('meos_control_web.reference_info') }}
            <span class="content-right-title-text">{{
                route.query.type == '0'
                    ? `（${i18n.global.t('meos_control_web.end_stage_pump_schedule')}） `
                    : '（' + i18n.global.t('meos_control_web.cooling_station_schedule') + '）'
            }}</span>
        </div>
        <div class="content-right-time">
            <m-date-picker
                v-if="isDaterange"
                v-model="date"
                :scope="`${new Date()} - ${new Date(new Date().setFullYear(new Date().getFullYear() + 1))}`"
                @change="changePicker"
            ></m-date-picker>
            <m-date-picker
                v-else
                v-model="date"
                :width="240"
                placement="bottomRight"
                type="daterange"
                :placeholder="i18n.global.t('meos_control_web.start_time_to_end_time')"
                :scope="`${new Date()} - ${new Date(new Date().setFullYear(new Date().getFullYear() + 1))}`"
                @change="changePicker"
            />
        </div>
        <m-scrollbar v-if="boxList.length" class="content-right-list">
            <div v-for="(item, index) in boxList" :key="index + 'i'" class="list-box">
                <div
                    v-if="
                        item.beginDate &&
                        item.endDate &&
                        (dayjs(item.beginDate).add(1, 'day').format('YYYY.MM.DD') == dayjs(item.endDate).format('YYYY.MM.DD') || item.beginDate == item.endDate)
                    "
                    class="list-box-header"
                >
                    {{ item.beginDate ? dayjs(item.beginDate).format('YYYY.MM.DD') : '--' }}
                </div>
                <div v-else class="list-box-header">
                    {{ item.beginDate ? dayjs(item.beginDate).format('YYYY.MM.DD') : '--' }}-{{ item.endDate ? dayjs(item.endDate).add(-1, 'day').format('YYYY.MM.DD') : '--' }}
                </div>
                <div class="box-item">
                    <div class="box-item-title">{{ item.objectLocalName || '--' }}</div>
                    <div class="table-header">
                        <span
                            v-for="(h, i) in item.content[0].head"
                            :key="i"
                            class="head"
                            :style="{ width: route.query.type == '0' ? '135px' : '' }"
                            :class="route.query.type == '1' && [i == 0 && 'head0', i == 1 && 'head1', i == 2 && 'head2']"
                        >
                            {{ h }}
                        </span>
                    </div>
                    <div v-for="(child, index) in item.content" :key="index" class="table-body">
                        <span :style="{ width: route.query.type == '1' ? '48px' : '135px' }">{{ child.time }}</span>
                        <span :style="{ width: route.query.type == '1' ? '60px' : '135px' }">{{ child.status }}</span>
                        <span v-if="route.query.type == '1'" :style="{ width: '72px' }">{{ child.num }}</span>
                        <span v-if="route.query.type == '1'" :style="{ width: '116px' }">{{ child.tem }}</span>
                        <span v-if="route.query.type == '1'">{{ child.susTime }}</span>
                    </div>
                    <!-- <m-table
            :columns="route.query.type == '0' ? columns.chillerTable : columns.pumpGroupTable"
            :data-source="item.content" /> -->
                </div>
            </div>
        </m-scrollbar>
        <div v-else class="no-data">
            <m-illustration
                type="noContent"
                :title="
                    date
                        ? props.queryParams.type == '1'
                            ? i18n.global.t('meos_control_web.no_chiller_plant_schedule_in_period')
                            : i18n.global.t('meos_control_web.no_chilled_pump_schedule_in_period')
                        : i18n.global.t('meos_control_web.please_select_schedule_time_first')
                "
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
/*eslint-disable eqeqeq*/
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import { listFixedTimeStrategyByDateRange, chillListFixedTimeStrategyByDateRange } from '@/apis/strategic';
import { useRoute } from '@/hooks/setupHelper';
import i18n from '@/localization';

const date = ref<string>('');
const route = useRoute();
const props = defineProps(['queryParams', 'minChillersNumber']);
if (props.queryParams && props.queryParams.data && props.queryParams.data.dateTime) {
    date.value = dayjs(props.queryParams.data.dateTime).format('YYYY.MM.DD');
}
const isDaterange = ref(false);
emitter.off('changeDaterange');

// 新建成功之后调用
emitter.on('changeDaterange', (data: any) => {
    boxList.value = [];
    if (data.split('-')[0] == data.split('-')[1]) {
        isDaterange.value = true;
        date.value = dayjs(data.split('-')[0]).format('YYYY.MM.DD');
        if (!data) return;
        getListFixedTimeStrategyByDateRange('point');
    } else {
        isDaterange.value = false;
        date.value = data;
        if (!data) return;
        getListFixedTimeStrategyByDateRange('period');
    }
});
// 获取策略列表
const getListFixedTimeStrategyByDateRange = (status: string) => {
    if (props.queryParams.type == '1') {
        chillListFixedTimeStrategyByDateRange({
            systemId: route.query.systemId,
            beginDateTime: status == 'point' ? dayjs(unref(date)).format('YYYY-MM-DD') : dayjs(unref(date).split('-')[0]).format('YYYY-MM-DD'),
            endDateTime: status == 'point' ? dayjs(unref(date)).add(1, 'day').format('YYYY-MM-DD') : dayjs(unref(date).split('-')[1]).add(1, 'day').format('YYYY-MM-DD')
        }).then((res: any) => {
            const { code, data, result } = res;
            if (result !== 'success') return;

            data &&
                data.length &&
                data.map((item: any) => {
                    item.content.length &&
                        item.content.map((date: any) => {
                            date.head = [
                                i18n.global.t('meos_control_web.moment'),
                                i18n.global.t('meos_control_web.operation_status'),
                                i18n.global.t('meos_control_web.chiller_unit_count'),
                                i18n.global.t('meos_control_web.chilled_water_outlet_temp_setpoint'),
                                i18n.global.t('meos_control_web.continuous_duration')
                            ];
                            date.time = date.strategyTime.slice(0, 5);
                            date.status = date.runStatus == 'OPEN' ? i18n.global.t('common.status_open') : i18n.global.t('common.status_close');
                            date.num =
                                props.minChillersNumber === 0
                                    ? date.runStatus == 'OPEN'
                                        ? date.chillerLNum + i18n.global.t('common.tai')
                                        : '--'
                                    : date.runStatus == 'OPEN'
                                    ? date.chillerLNum + i18n.global.t('common.large') + date.chillerSNum + i18n.global.t('common.small')
                                    : '--';
                            date.tem = date.runStatus == 'OPEN' ? Math.floor(date.chillWaterOutTempSet * 10) / 10 + ' °C' : '--';
                            if (date.sustainTime) {
                                if (date.runStatus == 'OPEN') {
                                    console.log(date.sustainTime, typeof String(date.sustainTime));
                                    date.susTime = date.sustainTime.toFixed(1) + ' min';
                                } else {
                                    date.susTime = '--' + ' min';
                                }
                            } else {
                                date.susTime = '--';
                            }
                        });
                    boxList.value.push(item);
                });
        });
    } else {
        listFixedTimeStrategyByDateRange({
            systemId: route.query.systemId,
            beginDateTime: status == 'point' ? dayjs(unref(date)).format('YYYY-MM-DD') : dayjs(unref(date).split('-')[0]).format('YYYY-MM-DD'),
            endDateTime: status == 'point' ? dayjs(unref(date)).add(1, 'day').format('YYYY-MM-DD') : dayjs(unref(date).split('-')[1]).add(1, 'day').format('YYYY-MM-DD')
        }).then((res: any) => {
            const { code, data, result } = res;
            if (result !== 'success') return;
            data &&
                data.length &&
                data.map((item: any) => {
                    item.content.length &&
                        item.content.map((date: any) => {
                            date.head = [i18n.global.t('meos_control_web.moment'), i18n.global.t('meos_control_web.operation_status')];
                            date.time = date.strategyTime.slice(11, 16);
                            date.status = date.runStatus == 'OPEN' ? i18n.global.t('common.status_open') : i18n.global.t('common.status_close');
                        });
                    boxList.value.push(item);
                });
        });
    }
};

const changePicker = (data: any) => {
    boxList.value = [];
    if (!data) return;
    if (data.split('-').length == 1) {
        getListFixedTimeStrategyByDateRange('point');
    } else {
        getListFixedTimeStrategyByDateRange('period');
    }
};

const boxList = ref([] as any);
</script>
<style lang="less">
.create-strategy {
    .meri-table-medium {
        --header-line-height: 20px;
        --line-height: 34px;
    }
    .meri-table-element-tr .meri-table-element-th {
        background: #fff;
    }
    .meri-table-body-tr:hover .meri-table-element-td {
        background: none;
    }
    .meri-table-element-tr .meri-table-element-td,
    .meri-table-element-tr .meri-table-element-th {
        border-top: none;
        padding: 0;
    }
    .meri-table-header .meri-table-element {
        border-bottom: none;
    }
    .meri-table-body-cell-title {
        color: var(--gray-900);
    }
    .content-right {
        font-family: Microsoft YaHei UI;
        margin-left: 16px;
        .m-scrollbar {
            height: calc(100% - 86px);
        }
        &-title {
            font-size: 16px;
            margin-bottom: 16px;
            color: #2e3742;
            font-weight: 700;
            line-height: 24px;
            font-family: Microsoft YaHei UI;
            &-text {
                color: #626c78;
                font-size: 14px;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
            }
        }
        .table-header {
            display: flex;
            .head {
                display: inline-block;
                margin-right: 8px;
                color: #626c78;
                font-family: Microsoft YaHei UI;
                font-size: 12px;
                line-height: 20px;
                :last-of-type(1) {
                    width: 116px;
                }
            }
            .head0 {
                width: 48px;
            }
            .head1 {
                width: 60px;
            }
            .head2 {
                width: 72px;
            }
            .head3 {
                width: 116px;
            }
        }
        .table-body {
            color: #1b2129;
            font-size: 14px;
            line-height: 22px;
            span {
                margin-top: 12px;
                display: inline-block;
                margin-right: 8px;
                font-family: Microsoft YaHei UI;
                &:not(:last-child) {
                    //   width: 88px;
                }
            }
        }
        &-time {
            margin-bottom: 16px;
        }
        &-list {
            padding-bottom: 8px;
            .list-box {
                padding: 12px;
                border-radius: 4px;
                border: 1px solid var(--gray-300, #e1e5eb);
                & + .list-box {
                    margin-top: 16px;
                }
                &-header {
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 700;
                    padding-bottom: 12px;
                    color: #2e3742;
                    font-family: Microsoft YaHei UI;
                    border-bottom: 1px solid var(--gray-300, #e1e5eb);
                }
                .box-item {
                    padding-top: 12px;
                    & + .box-item {
                        // border-top: 1px solid var(--gray-300, #e1e5eb);
                    }
                    &-title {
                        margin-bottom: 8px;
                        font-family: Microsoft YaHei UI;
                    }
                    // &:nth-last-of-type(1){
                    //     border-bottom: 0;
                    // }
                }
            }
        }
        .no-data {
            .illustration-box {
                margin-top: calc(100% / 3);
            }
        }
    }
}
</style>
