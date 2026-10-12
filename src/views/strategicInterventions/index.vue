<!--
 * @Author: guoxiaohuan
 * @Date: 2023-08-16 09:59:48
 * @LastEditors: chenpeng1 chenpeng1@persagy.com
 * @LastEditTime: 2025-11-21 15:07:18
 * @Description:
-->
<template>
    <div style="width: 100%">
        <div class="strategic-interventions">
            <m-scrollbar>
                <div style="min-width: 1280px">
                    <HeaderFilter
                        :style="{
                            padding: screenWidth >= 1920 ? '16px 14px 14px' : '8px 12px 5px'
                        }"
                        :list="headerOptions"
                        :show-search="false"
                        :month-data="month"
                        @default-params="defineParams"
                        @change-params="changeParams"
                    >
                        <template #append>
                            <div class="fc">
                                <SetButton type="primary" @click="addFixedTimeStrategy">{{ i18n.global.t('meos_control_web.create_new_schedule') }}</SetButton>
                            </div>
                        </template>
                    </HeaderFilter>
                    <div
                        class="calendar"
                        :style="{
                            height: screenWidth >= 1920 ? 'calc(100% - 76px)' : 'calc(100% - 50px)',
                            width: screenWidth >= 1920 ? 'calc(100% - 28px)' : 'calc(100% - 4px)'
                        }"
                    >
                        <!-- <m-scrollbar class="calendar-scroll"> -->
                        <Main v-if="route.query.type == '0'" ref="strategyMain" @get-list-fixed-strategy-date-by-month="getListFixedStrategyDateByMonth" />
                        <MainGroup v-else ref="strategyMainGroup" @get-list-fixed-strategy-date-by-month="getListFixedStrategyDateByMonth" />
                        <!-- </m-scrollbar> -->
                    </div>
                    <CreateEditStrategy
                        v-if="showStrategyModal"
                        :query-params="addParams"
                        @close="showStrategyModal = false"
                        @get-list-fixed-strategy-date-by-month="getListFixedStrategyDateByMonth"
                    />
                </div>
            </m-scrollbar>
        </div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
/*eslint-disable eqeqeq*/
import { useRoute } from 'vue-router';
import HeaderFilter from './HeaderFilter.vue';
import CreateEditStrategy from './CreateEditStrategy.vue';
import dayjs from 'dayjs';
import Main from './Main.vue';
import MainGroup from './mainGroup.vue';
import { listFixedStrategyDateByMonth } from '@/apis/strategic';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter } from '@/utils/dayjsTools';
import SetButton from '@/components/common/SetButton.vue';

const route = useRoute();
const month = ref([] as any);

const headerOptions = ref([
    {
        type: 'daterange',
        subtract: 7,
        diffDays: 7,
        dayHandler: () => {
            const end = getDayjsTz().add(5, 'day').startOf('day').format('YYYY.MM.DD');
            const start = getDayjsTz().subtract(1, 'day').endOf('day').format('YYYY.MM.DD');
            return `${start}-${end}`;
        },
        attrs: {
            width: 204
        }
    },
    {
        type: 'month',
        // subtract: 7,
        // diffDays: 7,
        dayHandler: () => {
            // const end = getDayjsTz().add(5, 'day').startOf('day').format('YYYY.MM.DD')
            // const start = getDayjsTz().subtract(1, 'day').endOf('day').format('YYYY.MM.DD')
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
let showStrategyModal = ref<boolean>(false);

const params = ref<Record<string, any>>({});
const defineParams = (data: Record<string, any>) => {
    params.value = data;
};

// 修改日期参数
const changeParams = (data: Record<string, any>, item: any) => {
    params.value = data;
    if (route.query.type == '0') {
        strategyMain.value.getListFixedTimeStrategy();
    } else {
        strategyMainGroup.value.getLastFreezePumpGroupListFixedTimeStrategy();
    }
};
provide('params', params);

// 查看已配置策略月份
const getListFixedStrategyDateByMonth = () => {
    month.value = [];
    listFixedStrategyDateByMonth({
        businessType: route.query.type == '0' ? 'CHILLER_UNIT' : 'LAST_FREEZE_PUMP_GROUP',
        systemId: route.query.systemId
    }).then((res: any) => {
        let { result, data } = res;
        if (result !== 'success') {
            return;
        }
        if (data?.length) {
            data = data.filter((item: string) => dayjsIsAfter(dayjs(item), getDayjsTz(), 'month'));
            sortArr(data).forEach((item: any) => {
                if (item.length > 1) {
                    month.value += `${dayjs(item[0]).format('YYYY.MM')}-${dayjs(item[item.length - 1]).format('YYYY.MM')}、`;
                } else {
                    month.value += `${dayjs(item).format('YYYY.MM')}、`;
                }
            });
        }
    });
};

const sortArr = (arr: any) => {
    let result = ref([] as any),
        i = 0;
    const list = arr.sort((a: any, b: any) => a - b);
    list.forEach((item: any, index: number) => {
        if (index === 0) {
            result.value[0] = [item];
        } else if (
            item ==
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

const screenWidth = ref(document.documentElement.clientWidth) as any;

watch(
    () => screenWidth.value,
    val => {
        screenWidth.value = val;
    },
    {
        deep: true
    }
);

onMounted(() => {
    window.addEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
    getListFixedStrategyDateByMonth();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
        screenWidth.value = document.documentElement.clientWidth;
    });
});
</script>
<style lang="less" scoped>
.strategic-interventions {
    height: 100%;
    width: 100%;
    background: #f7f9fa;
    .calendar {
        margin: 0 auto;
        border-radius: 8px;
        border: 1px solid #e1e5eb;
        border-right: 0;
        background: #fff;
        overflow: hidden;

        &-scroll {
            /deep/.m-scrollbar__content {
                height: 100%;
            }
        }
    }
}
</style>
