// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { listFixedStrategyDateByMonth } from '@/apis/HeatStrateg';
import { getDayjsTz } from '@/utils/globalVariables';

export default () => {
    const route = useRoute();
    const screenWidth = ref(document.documentElement.clientWidth);
    const month = ref([]);
    const strategyMain = ref();
    const params = ref({});
    const heatShowStrategyModal = ref(false); // 策略弹框
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
    const defineParams = data => {
        params.value = data;
    };

    // 新建策略
    const addFixedTimeStrategy = () => {
        heatShowStrategyModal.value = true;
    };

    // 查看已配置策略月份
    const getListFixedStrategyDateByMonth = () => {
        month.value = [];
        listFixedStrategyDateByMonth({
            businessType: 'HOT_STATION',
            systemType: 'ACCH',
            systemId: route.query.systemId
        }).then(res => {
            const { result, data } = res;
            if (result !== 'success') return;
            const list = data;
            sortArr(list).forEach(item => {
                if (item.length > 1) {
                    month.value += `${dayjs(item[0]).format('YYYY.MM')}-${dayjs(item[item.length - 1]).format('YYYY.MM')}、`;
                } else {
                    month.value += `${dayjs(item).format('YYYY.MM')}、`;
                }
            });
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
    // 修改日期参数
    const changeParams = data => {
        params.value = data;
        strategyMain.value.getListFixedTimeStrategy();
    };
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

    watch(
        () => screenWidth.value,
        val => {
            screenWidth.value = val;
        },
        {
            deep: true
        }
    );
    provide('params', params);
    provide('screenWidth', screenWidth);
    return {
        month,
        addParams,
        screenWidth,
        strategyMain,
        headerOptions,
        heatShowStrategyModal,
        defineParams,
        changeParams,
        addFixedTimeStrategy,
        getListFixedStrategyDateByMonth
    };
};
