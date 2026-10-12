<template>
    <div ref="chartDom" class="wh100 ChartDataView" :style="{ position: 'relative', '--custom-single-height': `${singleHeight}px` }"></div>
</template>

<script setup>
import { isEmpty } from '@/utils/tools';
import { useEchartHook } from '../../hooks/useEchartHook';
import { floor, isNaN, max, min } from 'lodash';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        default: ''
    },
    objects: {
        type: Array,
        default: () => []
    },
    infoCodes: {
        type: Array,
        default: () => []
    },
    index: {
        type: Number,
        default: 1
    },
    isSystem: {
        type: Boolean,
        default: false
    },
    xData: {
        type: Array,
        default: () => []
    },
    fifteenMinuteTimes: {
        type: Array,
        default: () => []
    },
    dataSources: {
        type: Array,
        default: () => []
    },
    customFormatter: {
        type: Function,
        default: undefined
    },
    singleHeight: {
        type: Number,
        default: 0
    }
});
const emits = defineEmits(['hover', 'mouseleave', 'finished']);
const getOption = () => {
    const customValues = [];
    props.data?.[0]?.data?.forEach((item, i) => {
        if (item.time.includes(':00')) {
            customValues.push(i);
        }
    });
    return {
        legend: {
            show: false,
            itemWidth: 12,
            itemHeight: 12,
            itemStyle: {
                opacity: 0
            },
            lineStyle: { width: 4, inactiveWidth: 4 },
            right: '28px',
            textStyle: {
                color: '#1B2129',
                fontSize: 14
            },
            formatter(name) {
                const val = name?.split?.('&&')?.[0];
                return val || name;
            }
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            backgroundColor: '#FFFFFF',
            borderColor: '#FFFFFF',
            appendToBody: true,
            // 把 tooltip 限制在图表容器内
            // confine: true,
            enterable: true,
            position: function (point, params, dom, rect, size) {
                let positionLeft = 0,
                    pointX = point[0];
                const width = dom.clientWidth;

                if (pointX > size.viewSize[0] - size.contentSize[0]) {
                    positionLeft = pointX - width - 40;
                } else {
                    positionLeft = pointX + 20;
                }

                return [positionLeft + 20, 0];
            },
            formatter(arr) {
                if (props.customFormatter) {
                    return props.customFormatter(arr, props);
                }
                const systemHtml = `
						<div><span class="fw700" style="color: #1B2129;">${props.title}</span> ${arr[0].axisValue}</div>
						${arr
                            .map(item => {
                                return `
									<div class="fc" style="margin-top: 8px;min-width: 160px;">
										<div style="display:inline-block;margin-right:4px;width:12px;height:4px;background-color:${item.color};"></div>
										<div style="margin-right: 8px;">${item.seriesName.split('&&')[0]}</div> <span style="color: #1B2129;">${isEmpty(item.data.value)}&nbsp${props.unit}</span>
									</div>
								`;
                            })
                            .join('')}
						`;
                const noSystemHtml = () => {
                    let infoCodeNames = [],
                        objectNames = [];
                    const valueByKey = {};
                    arr.forEach(item => {
                        const names = item.seriesName.split('&&');
                        infoCodeNames.push(names[0]);
                        objectNames.push(names[1]);
                        valueByKey[item.seriesName] = item;
                    });
                    infoCodeNames = [...new Set(infoCodeNames)];
                    objectNames = [...new Set(objectNames)];
                    return `
						<div style="max-height: 230px;overflow-y: auto;">
							<table>
								<tr style="height: 28px;position:sticky;top: 0px;background-color: #fff;">
									<td><span class="fw700" style="color: #1B2129;">${props.title}</span> ${arr[0].axisValue}&nbsp;&nbsp;&nbsp;&nbsp;</td>
									${infoCodeNames
                                        .map(item => {
                                            return `
												<td class="fw700" style="color: #1B2129;">${item}&nbsp;&nbsp;&nbsp;&nbsp;</td>
											`;
                                        })
                                        .join('')}
								</tr>
								${objectNames
                                    .map(item => {
                                        const object = props.objects.find(val => val.localName === item);
                                        return `
											<tr style="height: 28px;">
												<td class="fc">
													<div style="display:inline-block;margin-right:4px;width:12px;height:4px;background-color:${object?.color};"></div>
													${item}&nbsp;&nbsp;&nbsp;&nbsp;
												</td>
												${infoCodeNames
                                                    .map(val => {
                                                        if (valueByKey[val + '&&' + item]?.data?.dataSources.length) {
                                                            const { dataSources } = valueByKey[val + '&&' + item].data;
                                                            const { value } = valueByKey[val + '&&' + item];
                                                            const obj = dataSources.find(aa => aa.code * 1 === value);
                                                            return `
																<td style="color: #1B2129;">
																	${obj?.name ?? '--'}
																</td>
															`;
                                                        }
                                                        return `
															<td style="color: #1B2129;">
																${isEmpty(valueByKey[val + '&&' + item]?.value)}${props.unit}
															</td>
														`;
                                                    })
                                                    .join('')}
											</tr>
										`;
                                    })
                                    .join('')}
							</table>
						</div>
					`;
                };

                return props.isSystem ? systemHtml : noSystemHtml();
            },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    type: 'solid',
                    color: '#C4C9CF'
                }
            },
            textStyle: {
                color: '#626C78'
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: props.data?.[0]?.data?.map(item => item.time) || props.fifteenMinuteTimes,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#CCDEF2'
                    }
                },
                axisLabel: {
                    color: '#626C78'
                    // interval: 1,
                    // showMaxLabel: true,
                    // hideOverlap: false,
                    // formatter(val) {
                    //     if (val.includes(':00')) {
                    //         return val;
                    //     }
                    //     return '';
                    // }
                }
            }
        ],
        grid: {
            left: 0,
            right: 24,
            bottom: 0,
            top: 10,
            containLabel: true
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            nameTextStyle: {
                color: '#2E3742',
                fontWeight: 700
            },
            max(value) {
                if (props.data?.[0]?.data?.[0]?.dataSources?.length) {
                    const codes = props.data?.[0]?.data?.[0]?.dataSources.map(item => item.code * 1);
                    return value.max || max(codes);
                }
                if (isNaN(value.max)) {
                    return 40;
                }
            },
            min(value) {
                if (props.data?.[0]?.data?.[0]?.dataSources?.length) {
                    const minValue = value.min !== value.max ? value.min : 0;
                    const codes = props.data?.[0]?.data?.[0]?.dataSources.map(item => item.code * 1);
                    return minValue || min(codes);
                }
                if (isNaN(value.min)) {
                    return 0;
                }
                return floor(value.min);
            },
            splitLine: {
                lineStyle: {
                    color: '#C4C9CF',
                    type: 'dashed'
                }
            },
            axisLabel: {
                formatter(value) {
                    if (props.dataSources.length) {
                        const dataSource = props.dataSources.find(ds => ds.code * 1 === value);
                        if (dataSource) {
                            return `{a|${dataSource.name}}`;
                        }
                    }
                    let kValue = value.toFixed(0);
                    if (Math.abs(value) >= 1000) {
                        kValue = value / 1000;
                        kValue = kValue.toFixed(0) + 'k';
                    }
                    return `{a|${kValue}}`;
                },
                rich: {
                    a: {
                        width: 50,
                        overflow: 'truncate',
                        backgroundColor: 'none'
                    }
                }
            }
        },
        series: props.data
    };
};
const option = ref({});
onMounted(() => {
    option.value = getOption();
});
const legendToggleSelectFun = (name, show) => {
    option.value.series.forEach(data => {
        if (data.name.includes(name)) {
            legendToggleSelect(data.name, show);
        }
    });
};
const { chartDom, legendToggleSelect, showTip, hideTip, convertToPixel } = useEchartHook(() => option.value, 500, emits);
defineExpose({ legendToggleSelectFun, convertToPixel, showTip, hideTip });
</script>
<style lang="less" scoped>
.ChartDataView {
    height: var(--custom-single-height);
    min-height: 150px;
    // flex: 1;

    :deep(canvas) {
        cursor: default;
    }
}
</style>
