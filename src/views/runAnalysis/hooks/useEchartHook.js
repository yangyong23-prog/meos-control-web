// @ts-ignore
import i18n from '@/localization';
import { ECHART_COLORS } from '@/utils/globalVariables';
import { useResizeObserver } from '@vueuse/core';
import * as echarts from 'echarts/core';
import { throttle, uniqueId } from 'lodash';

/**
 * 自定义钩子用于初始化和管理Echart实例
 * @param {Function} getOptionFun 一个返回echart配置项的函数
 * @param {number} wait 节流等待时间，用于防抖处理图表重绘，默认为0
 * @returns {Object} 返回包含chartDom和widthDom的引用对象
 */
export const useEchartHook = (getOptionFun, wait = 0, emits, resizeObserverClass) => {
    // Echart实例和ResizeObserver实例变量
    let myChart = null,
        resizeObserver = null,
        highlightData = {},
        option = {};
    // 使用ref创建对图表DOM元素和宽度的响应式引用
    const chartDom = ref();
    const widthDom = ref(0);
    const isHighlight = ref(false);
    const id = uniqueId('echart-Id-');
    const timeMove = ref();
    const isEndMove = ref(true);
    /**
     * 渲染图表的函数
     * 它初始化或更新Echart实例，并设置图表的选项
     */
    const renderChart = () => {
        // 更新图表宽度
        widthDom.value = chartDom.value.clientWidth;

        // 获取图表配置项并应用默认颜色
        option = { color: ECHART_COLORS, ...getOptionFun() };

        // 初始化Echart实例
        myChart = echarts.init(chartDom.value);

        // 清空现有图表，以支持新的配置项
        myChart?.clear();

        setOption(option);
        // 设置图表容器大小变化时的回调函数，使用节流防抖
        resizeObserver = useResizeObserver(resizeObserverClass ? document.querySelector(resizeObserverClass) : chartDom.value, throttle(resizeEcharts, wait));
        if (emits) {
            event();
        }
    };
    const highlightFun = data => {
        try {
            if (!isEndMove.value) {
                return;
            }
            isHighlight.value = true;
            highlightData = data.batch[0];
            emits?.('hover', structuredClone(highlightData));
        } catch (error) {
            // console.log(data);
        }
    };
    const downplayFun = () => {
        try {
            emits?.('mouseleave', id);
        } catch (error) {
            // console.log(data);
        }
    };

    const event = () => {
        myChart.on('finished', function () {
            emits('finished');
            myChart.on('highlight', highlightFun);
            myChart.on('downplay', downplayFun);
            chartDom.value?.addEventListener('mousemove', () => {
                isEndMove.value = true;
                clearTimeout(timeMove.value);
                timeMove.value = setTimeout(() => {
                    clearTimeout(timeMove.value);
                    emits?.('hover', structuredClone(highlightData));
                    isEndMove.value = false;
                }, 100);
            });
            chartDom.value?.addEventListener('mouseout', () => {
                clearTimeout(timeMove.value);
                const timer = setTimeout(() => {
                    emits?.('mouseleave');
                    clearTimeout(timer);
                }, 100);
            });
        });
    };
    const setOption = data => {
        // 应用新的配置项到图表
        data && myChart?.setOption(data);
    };
    /**
     * 当图表容器大小变化时调用的回调函数
     * @param {Array} entries ResizeObserverEntry数组
     */
    const resizeEcharts = entries => {
        const entry = entries[0];
        const { width } = entry.contentRect;

        // 更新图表宽度
        widthDom.value = width;
        hideTip();
        // 调用Echart实例的resize方法重绘图表
        myChart.resize();
    };
    /**
     * 显示提示信息的函数
     * 该函数通过调用myChart的dispatchAction方法来显示图表中的提示信息
     * 主要用于在图表中高亮显示特定数据点的信息
     *
     * @param {Object} params - 包含显示提示信息所需参数的对象
     * @param {number} params.seriesIndex - 数据序列的索引，用于指定哪个数据序列的提示信息
     * @param {number} params.dataIndex - 数据点的索引，用于指定数据序列中具体的数据点
     */
    const showTip = params => {
        let { seriesIndex } = params;
        for (let index = 0; index < option.series.length; index++) {
            const item = option.series[index];
            if (item.data[params.dataIndex]?.value !== null) {
                seriesIndex = index;
                break;
            }
        }
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex,
            dataIndex: params.dataIndex
        });
    };
    /**
     * 隐藏提示框
     * 当传入的echartId与当前图表的id不匹配时，此函数将隐藏提示框
     * 这用于确保只有在交互正确的图表时才会隐藏提示信息
     * @param {string} echartId - 当前操作的图表ID
     */
    const hideTip = echartId => {
        if (echartId === id) {
            return;
        }
        myChart.dispatchAction({
            type: 'hideTip'
        });
        myChart.dispatchAction({
            type: 'updateAxisPointer',
            currTrigger: 'leave'
        });
    };

    /**
     * 切换图例的选择状态
     * 此函数通过dispatchAction触发'legendSelect'或'legendUnSelect'事件来选择或取消选择图例
     * @param {string} name - 图例的名称
     * @param {boolean} show - 如果为true，则选择图例；如果为false，则取消选择图例
     */
    const legendToggleSelect = (name, show) => {
        myChart.dispatchAction({
            type: show ? 'legendSelect' : 'legendUnSelect',
            name
        });
    };
    const convertToPixel = () => {
        const xPositions = [];
        const { length } = option.xAxis[0].data;
        for (let index = 0; index < length; index++) {
            const position = myChart.convertToPixel({ seriesIndex: 0 }, [index, 0]);
            xPositions.push(position[0]);
        }
        return xPositions;
    };
    // 在组件挂载时渲染图表
    onMounted(() => {
        renderChart();
    });
    // 在组件卸载时停止监听大小变化
    onUnmounted(() => {
        myChart.off('highlight');
        myChart.off('downplay');
        chartDom.value?.removeEventListener('mousemove');
        chartDom.value?.removeEventListener('mouseout');
        myChart.dispose();
        resizeObserver.stop();
    });
    // 返回图表DOM和宽度的引用，以便在组件中使用
    return { chartDom, widthDom, renderChart, showTip, legendToggleSelect, hideTip, convertToPixel };
};
