<template>
    <div ref="chartDom" class="wh100 ChartDataView" style="position: relative"></div>
</template>

<script setup>
import i18n from '@/localization';
import { isEmpty, isEmptyNoReturn } from '@/utils/tools';
import { useEchartHook } from '../../hooks/useEchartHook';
import { fifteenMinuteTimesKey, oneHourTimesKey } from '../../injectionKey';
import { floor, isNaN, max, min, orderBy, split } from 'lodash';
const fifteenMinuteTimes = inject(fifteenMinuteTimesKey);
const oneHourTimes = inject(oneHourTimesKey);
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
    }
});
const emits = defineEmits(['hover', 'mouseleave', 'finished']);
const dataSources = computed(() => {
    const arr = props.data?.[0]?.data?.[0]?.dataSources || [];
    return orderBy(arr, ['code'], ['asc']);
});
function getStringLength(str) {
    let length = 0;
    // 遍历字符串的每个字符
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        // 中文字符的 Unicode 范围：\u4e00-\u9fa5
        if (charCode >= 0x4e00 && charCode <= 0x9fa5) {
            length += 2; // 中文字符计为2
        } else {
            length += 1; // 其他字符（英文、数字、符号等）计为1
        }
    }
    return length;
}
const getOption = () => {
    const series = structuredClone(props.data);
    if (dataSources.value?.length) {
        console.log(series);
        series.forEach(serie => {
            serie.data.forEach(item => {
                const val = item.value;
                const index = dataSources.value.findIndex(v => v.code * 1 === val);
                item.value = index === -1 ? null : index;
            });
        });
    }
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
            appendTo: '.module-info-main',
            enterable: true,
            position: function (point, params, dom, rect, size) {
                let positionLeft = 0,
                    pointX = point[0];
                const width = dom.clientWidth;
                if (props.index % 2 !== 0) {
                    if (pointX > size.viewSize[0] - size.contentSize[0]) {
                        positionLeft = pointX - width - 2;
                    } else {
                        positionLeft = pointX + 2;
                    }
                } else {
                    positionLeft = pointX - width - 2;
                    if (positionLeft < 0) {
                        positionLeft = pointX + 2;
                    }
                }
                return [positionLeft, 0];
            },
            formatter(arr) {
                const systemHtml = `
						<div style="max-height: 170px;overflow-y: auto;">
							<div><span class="fw700" style="color: #1B2129;">${props.title}</span> ${arr[0].axisValue}</div>
							${arr
                                .map(item => {
                                    let val = '';
                                    if (dataSources.value?.length) {
                                        const obj = dataSources.value[item.data.value];
                                        val = obj?.name;
                                    } else {
                                        val = item.data.value;
                                    }
                                    const infoCode = props.infoCodes.find(val => val.infoCode === item.seriesName.split('&&')[0]);
                                    return `
										<div class="fc" style="margin-top: 8px;min-width: 160px;">
											<div style="display:inline-block;margin-right:4px;width:12px;height:4px;background-color:${item.color};"></div>
											<div style="margin-right: 8px;">${infoCode.name}</div> <span style="color: #1B2129;">${isEmpty(val)}&nbsp${props.unit}</span>
										</div>
									`;
                                })
                                .join('')}
						</div>

						`;
                const noSystemHtml = () => {
                    let infoCodes = [],
                        objectIds = [];
                    const valueByKey = {};

                    arr.forEach(item => {
                        const names = item.seriesName.split('&&');
                        infoCodes.push(names[0]);
                        objectIds.push(names[1]);
                        valueByKey[item.seriesName] = item;
                    });
                    infoCodes = [...new Set(infoCodes)];
                    objectIds = [...new Set(objectIds)];
                    return `
					<div style="max-height: 170px;overflow-y: auto;">
						<table>
							<tr style="height: 28px;">
								<td><span class="fw700" style="color: #1B2129;">${props.title}</span> ${arr[0].axisValue}&nbsp;&nbsp;&nbsp;&nbsp;</td>
								${infoCodes
                                    .map(item => {
                                        const infoCode = props.infoCodes.find(val => val.infoCode === item);
                                        return `
											<td class="fw700" style="color: #1B2129;">${infoCode.name}&nbsp;&nbsp;&nbsp;&nbsp;</td>
										`;
                                    })
                                    .join('')}
							</tr>
							${objectIds
                                .map(item => {
                                    const object = props.objects.find(val => val.objectId === item);
                                    return `
										<tr style="height: 28px;">
											<td class="fc" style="height: 28px;">
												<div style="display:inline-block;margin-right:4px;width:12px;height:4px;background-color:${object?.color};"></div>
												${object?.localName}&nbsp;&nbsp;&nbsp;&nbsp;
											</td>
											${infoCodes
                                                .map(val => {
                                                    if (dataSources.value?.length) {
                                                        const { value } = valueByKey[val + '&&' + item];
                                                        const obj = dataSources.value[value];
                                                        return `
															<td  style="color: #1B2129;height: 28px;">
																${obj?.name ?? '--'}
															</td>
														`;
                                                    }
                                                    return `
														<td style="color: #1B2129;height: 28px;">
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
                data: props.data?.[0]?.data?.map(item => item.time) || fifteenMinuteTimes.value,
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
            left: 16,
            right: 24,
            bottom: 0,
            top: 20,
            containLabel: true
        },
        yAxis: {
            type: 'value',
            minInterval: 1,

            splitNumber: dataSources.value?.length || null,
            nameTextStyle: {
                color: '#2E3742',
                fontWeight: 700
            },
            max(value) {
                if (dataSources.value?.length) {
                    return value.max || dataSources.value?.length - 1;
                }
                if (isNaN(value.max)) {
                    return 40;
                }
            },
            min(value) {
                if (dataSources.value?.length) {
                    const minValue = value.min !== value.max ? value.min : 0;
                    return minValue || 0;
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
                overflow: 'truncate',
                width: 60,
                hideOverlap: true,
                formatter(value) {
                    let kValue = '';
                    if (dataSources.value?.length) {
                        const dataSource = dataSources.value[value];
                        if (dataSource) {
                            kValue = dataSource.name;
                        } else {
                            kValue = '';
                        }
                    } else {
                        kValue = value.toFixed(0);
                        if (Math.abs(value) >= 1000) {
                            kValue = value / 1000;
                            kValue = kValue.toFixed(0) + 'k';
                        }
                    }

                    const num = 8 - getStringLength(kValue);
                    if (num < 0) {
                        return kValue;
                    }
                    const start = '0'.repeat(num);
                    return `{a|${start}}` + kValue;
                },
                rich: {
                    a: {
                        color: '#fff'
                    }
                }
            }
        },
        series
    };
};
// const max = ref(40);
// const min = ref(0);
const option = ref({});
onMounted(() => {
    // const numbers = [];
    // props.data.forEach(item => {
    //     item.data.forEach(val => {
    //         if (!isEmptyNoReturn(val.value)) {
    //             numbers.push(val.value);
    //         }
    //     });
    // });
    // if (numbers.length) {
    //     max.value = Math.ceil(Math.max(...numbers));
    //     min.value = Math.floor(Math.min(...numbers));
    // }
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
    :deep(canvas) {
        cursor: default;
    }
}
</style>
