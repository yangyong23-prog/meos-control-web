<template>
    <Panel id="run-broadcast" :loading="loading" :title-path-prefix="'/meos-control-web'" :title="title" title-path="/operationLog">
        <div v-if="total" class="run-broadcast">
            <div class="bc run-total fcb">
                <div class="run-total-box run-total-number">
                    <div class="run-total-box-num">{{ autoCount }}</div>
                    <div v-ellipsis class="run-total-box-text m-ellipsis">{{ i18n.global.t('operation_duty_homepage.meos_home_number_of_automatic_control_commands_today') }}</div>
                </div>
                <div class="run-total-box run-total-account">
                    <div class="run-total-box-num">{{ getNumber() }}%</div>
                    <div v-ellipsis class="run-total-box-text m-ellipsis">{{ i18n.global.t('operation_duty_homepage.meos_home_proportion_of_automatic_control_command') }}</div>
                </div>
                <div class="run-total-box run-total-pie">
                    <Pie :data="{ value: autoCount, total: total }" color="#2481F2" />
                </div>
            </div>
            <div class="run-messages">
                <div class="run-messages-title">{{ i18n.global.t('operation_duty_homepage.meos_home_latest_automatic_control_commands', [total >= 3 ? 3 : total]) }}</div>
                <div class="run-messages-content">
                    <template v-for="(item, i) in list" :key="item.objectId + i">
                        <div v-if="i <= 2" class="run-message-content">
                            <div class="run-message-content-label">
                                <span> {{ dayTz(item.createTime).format('HH:mm:ss') }} </span>
                                <span> {{ item.firstLevelCategoryName }} </span>
                            </div>
                            <div class="run-message-content-divider"></div>
                            <div v-ellipsis class="run-message-content-value m-ellipsis">
                                {{ item.createUser }}&nbsp;
                                {{ item.contentDesc }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div v-else class="wh100 fcc">
            <m-illustration :title="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" type="noContent"></m-illustration>
        </div>
    </Panel>
</template>

<script setup>
import { isEdge } from '@/utils/tools';
import i18n from '@/localization';
import { todayLogSummary } from '@/apis/duty';
import Panel from '../components/base/panel.vue';
import Pie from '@/components/echarts/Pie.vue';
import { floor } from 'lodash';
import { dayTz } from '@/utils/dayjsTools';
import { useIntervalHook } from '@/hooks/useIntervalHook';
// eslint-disable-next-line import/no-extraneous-dependencies
import Decimal from 'decimal.js';
defineProps({
    size: {
        type: String,
        default: '1*1'
    },
    title: {
        type: String,
        default: i18n.global.t('operation_duty_homepage.meos_home_run_the_broadcast')
    }
});
console.log(new Decimal(313).div(new Decimal(558)).toNumber());

const list = ref([]);
const autoCount = ref(0);
const total = ref(0);
const loading = ref(true);
// 是否正在获取数据，轮询时防止上一次接口未返回又继续发起请求
let pollingLoading = false;
const { startDataPolling } = useIntervalHook();

const getList = async () => {
    loading.value = true;
    startDataPolling([getRunBroadcastList]);
    await getRunBroadcastList();
    loading.value = false;
};

const getRunBroadcastList = async () => {
    if (pollingLoading) {
        return;
    }
    pollingLoading = true;
    list.value = [];
    try {
        const res = await todayLogSummary();
        list.value = res.data.latestContent || [];
        autoCount.value = +res.data.autoCount || 0;
        total.value = +res.data.total || 0;
    } catch (error) {
        list.value = [];
        autoCount.value = 0;
        total.value = 0;
    } finally {
        pollingLoading = false;
    }
};
const getNumber = () => {
    if (total.value === 0) {
        return 0;
    }
    return floor(new Decimal(autoCount.value).div(new Decimal(total.value)).toNumber() * 100, 2);
};
onMounted(() => {
    getList();
});
</script>
<style lang="less" scoped>
.run-broadcast-loading {
    padding: 12px;
}
.run-broadcast {
    padding: 0 12px;
    overflow: hidden;
    white-space: nowrap;
    height: 100%;
}
.run-total {
    height: 82px;
    padding: 12px 16px;
    gap: 22px;
    &-box {
        height: 58px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
        &-num {
            font-size: 24px;
            font-weight: 700;
        }
        &-text {
            color: var(--gray-600);
        }
    }
    &-pie {
        height: 58px;
        flex: 0 0 58px;
    }
}
.run-messages {
    margin-top: 12px;
    display: flex;
    flex-direction: column;

    .run-messages-title {
        color: var(--gray-500, #8b949e);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-bottom: 12px;
    }
    .run-messages-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        .run-message-content {
            display: flex;
            flex-direction: row;
            padding: 4px 0px;
            align-items: center;
            gap: 8px;
            .run-message-content-label {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 8px;
                span {
                    color: var(--gray-900, #1b2129);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;
                }
            }
            .run-message-content-divider {
                width: 1px;
                height: 14px;
                display: block;
                background-color: var(--gray-400);
            }
            .run-message-content-value {
                color: var(--gray-500, #8b949e);

                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
            }
        }
    }
}
</style>
