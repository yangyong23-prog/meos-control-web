<template>
    <div class="cold-hot-strategic-interventions">
        <div class="strategic-interventions">
            <HeaderFilter
                :list="headerOptions"
                :show-search="false"
                :month-data="month"
                :show-batch-delete="route.query.type === '0'"
                @default-params="defineParams"
                @change-params="changeParams"
                @batch-delete="handleBatchDelete"
            >
                <template #append>
                    <div class="fc">
                        <div v-if="route.query.type === '0' && base.hasAuth(AI_PERMISSION)" class="switch-container fc">
                            <set-ai-bg class="bg" />
                            <span class="text">{{ i18n.global.t('meos_control_web.ai_algorithm_settings') }}</span>
                            <m-tips :content="i18n.global.t('meos_control_web.ai_calc_chiller_count_on')" theme="darkTransparent">
                                <IconMeriComponentDialogLinear size="16" color="#626C78" />
                            </m-tips>
                            <m-switch v-model="values" class="switch" @click="changeSwitch"></m-switch>
                        </div>
                        <SetButton type="primary" @click="addFixedTimeStrategy">{{ i18n.global.t('meos_control_web.create_new_schedule') }}</SetButton>
                    </div>
                </template>
            </HeaderFilter>
            <div class="calendar">
                <Main v-if="route.query.type === '0'" ref="strategyMain" />
            </div>
            <CreateEditStrategy
                v-if="showStrategyModal"
                :query-params="addParams"
                @close="showStrategyModal = false"
                @get-list-fixed-strategy-date-by-month="getListFixedStrategyDateByMonth"
            />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useRoute } from 'vue-router';
import HeaderFilter from './HeaderFilter.vue';
import CreateEditStrategy from './CreateEditStrategy.vue';
import dayjs from 'dayjs';
import Main from './Main.vue';
import { batchDeleteFixedTimeStrategy, listFixedStrategyDateByMonth, saveSupportAiConfig, querySupportAi } from '@/apis/hotColdStationStrategyIntervention';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import SetAiBg from './setAiBg.vue';
import { MMessageBox, $Message } from 'meri-plus';
import baseStore from '@/store/baseStore';
import { GET_MENU_CONFIG, getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { dayjsIsAfter } from '@/utils/dayjsTools';
import SetButton from '@/components/common/SetButton.vue';
import { setModelType } from '@/utils/tools';
const AI_PERMISSION = window[GET_MENU_CONFIG]?.().AI_PERMISSION;
const base = baseStore();

const route = useRoute();
const month = ref([]);

const values = ref('uncheck');
const headerOptions = ref([
    {
        type: 'month',
        dayHandler: () => {
            return `${getDayjsTz().format('YYYY.MM')}`;
        },
        attrs: {
            width: 204
        }
    }
]);

// 新建策略传过去的参数
const addParams = reactive(
    Object.assign(
        {
            name: 'add'
        },
        route.query
    )
);

// 冷站ref
const strategyMain = ref();

// 冷冻泵组ref
const strategyMainGroup = ref();

// 新建编辑策略弹框
let showStrategyModal = ref(false);

const params = ref({});
const defineParams = data => {
    params.value = data;
};

// 修改日期参数
const changeParams = async data => {
    params.value = data;
    if (route.query.type === '0') {
        try {
            await strategyMain.value.getCalendarData();
        } catch (e) {
            console.log(e);
        }
    } else {
        strategyMainGroup.value.getLastFreezePumpGroupListFixedTimeStrategy();
    }
};
provide('params', params);

// 查看已配置策略月份
const getListFixedStrategyDateByMonth = () => {
    month.value = [];
    listFixedStrategyDateByMonth({
        businessType: 'HOT_COLD_STATION',
        systemId: route.query.systemId,
        systemType: 'ACCI'
    }).then(res => {
        let { result, data } = res;
        if (result !== 'success') {
            return;
        }
        if (data?.length) {
            data = data.filter(item => dayjsIsAfter(dayjs(item), getDayjsTz(), 'month'));
            sortArr(data).forEach(item => {
                if (item.length > 1) {
                    month.value += `${dayjs(item[0]).format('YYYY.MM')}-${dayjs(item[item.length - 1]).format('YYYY.MM')}、`;
                } else {
                    month.value += `${dayjs(item).format('YYYY.MM')}、`;
                }
            });
        }
    });
};

const sortArr = arr => {
    let result = ref([]),
        i = 0;
    const list = arr.sort((a, b) => a - b);
    list.forEach((item, index) => {
        if (index === 0) {
            result.value[0] = [item];
        } else if (
            item ===
            dayjs(list[index - 1])
                .add(1, 'month')
                .format('YYYY-MM-DD HH:mm:ss')
        ) {
            result.value[i].push(item);
        } else {
            result.value[++i] = [item];
        }
    });
    return result.value;
};

// 新建策略
const addFixedTimeStrategy = () => {
    showStrategyModal.value = true;
};

const removeBatchDeleteTargets = async (deleteDateRange, closePopover) => {
    setModelType(route.query.systemId || '');
    const dateRange = deleteDateRange.split('-').map(item => dayjs(item).format('YYYY-MM-DD'));
    const [beginDate, endDate] = dateRange;
    try {
        const res = await batchDeleteFixedTimeStrategy({
            systemType: 'ACCI',
            systemId: route.query.systemId,
            objectId: route.query.systemId,
            beginDate,
            endDate
        });
        if (res.code === SUCCESSCODE) {
            $Message.success({ title: i18n.global.t('meos_control_web.delete_success') });
            closePopover();
            getListFixedStrategyDateByMonth();
            strategyMain.value?.getCalendarData();
        }
    } catch (e) {
        console.log(e);
    }
};

const handleBatchDelete = (deleteDateRange, closePopover) => {
    MMessageBox({
        type: 'danger',
        title: i18n.global.t('meos_control_web.confirm_delete'),
        customClass: 'customClass',
        confirmButtonText: i18n.global.t('common.delete'),
        message: i18n.global.t('meos_control_web.delete_future_strategy_stopped_dup'),
        hasLoading: true,
        beforeClose: (action, data, done) => {
            if (action === 'confirm') {
                done();
                removeBatchDeleteTargets(deleteDateRange, closePopover);
            } else {
                done();
            }
        }
    });
};

const getSupportAi = () => {
    querySupportAi({ systemId: route.query.systemId, strategyType: 'HOT_COLD_STATION' }).then(res => {
        if (res.result === 'success') {
            if (res.data?.length) {
                values.value = res.data[0].isAiStrategy ? 'checked' : 'uncheck';
            }
        }
    });
};

// 切换AI策略
const changeSwitch = () => {
    saveSupportAiConfig({
        systemId: route.query.systemId,
        strategyType: 'HOT_COLD_STATION',
        statusList: [{ isAiStrategy: values.value === 'checked' }]
    }).then(res => {
        const { data } = res;
        if (data) {
            $Message.success({
                title:
                    values.value === 'checked'
                        ? `${i18n.global.t('meos_control_web.ai_algorithm_enabled_success')}`
                        : `${i18n.global.t('meos_control_web.ai_algorithm_disabled_success')}`
            });
        } else {
            values.value = 'uncheck';
        }
    });
};

onMounted(() => {
    getSupportAi();

    getListFixedStrategyDateByMonth();
});

onBeforeUnmount(() => {});
</script>
<style lang="less" scoped>
.cold-hot-strategic-interventions {
    height: 100%;
    width: 100%;
}
.strategic-interventions {
    height: 100%;
    width: 100%;
    background: #f7f9fa;

    .calendar {
        border-radius: 8px;
        border-right: 0;
        overflow: hidden;
        padding: 0 12px;
        padding-bottom: 12px;
        height: calc(100% - 48px);
    }

    .switch-container {
        border-radius: 4px;
        background: rgba(19, 167, 242, 0.12);
        margin-right: 12px;
        padding: 2px 12px 2px 8px;

        .bg {
            width: 28px;
            height: 28px;
        }

        .text {
            font-family: Microsoft YaHei UI;
            font-size: 16px;
            font-weight: 700;
            background: linear-gradient(90deg, #246fe5 1.19%, #11abf3 77.48%, #00b7d0 101.98%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0 4px 0 7px;
        }

        .switch {
            margin-left: 12px;
        }
    }
}
</style>
