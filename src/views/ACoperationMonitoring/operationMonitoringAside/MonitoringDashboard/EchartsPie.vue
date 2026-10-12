<template>
    <div class="echarts-box">
        <div class="pie-title">
            <div class="pie-title-text">{{ total }}</div>
            <div class="pie-title-subtext">
                <span v-ellipsis class="title">{{ i18n.global.t('meos_control_web.total_space_quantity') }}</span>
                <m-tips theme="darkTransparent" placement="bottom-start" :content="i18n.global.t('meos_control_web.iot_monitored_spaces_count')">
                    <svg class="icon icon-linear" aria-hidden="true">
                        <use xlink:href="#icon-linear" />
                    </svg>
                </m-tips>
            </div>
        </div>
        <div id="chartTem" style="width: 168px; height: 100%"></div>
        <div class="lengend-box">
            <div v-for="(item, index) in data" :key="index" class="lengend-box-item" @click="openSpaceList(item)">
                <div
                    class="color-item"
                    :style="{
                        background:
                            item.name === i18n.global.t('common.no_data_short')
                                ? '#C9CCD0'
                                : item.name === i18n.global.t('meos_control_web.no_operation_standard')
                                ? '#A7A6B5'
                                : color[index]
                    }"
                ></div>
                <div class="name-item">
                    <span style="display: flex; align-items: center; gap: 2px"
                        ><span v-ellipsis class="name">{{ item.name }}</span
                        >：{{ formatNumber(item.value) }}</span
                    >
                    <m-tips
                        v-if="item.name === i18n.global.t('common.no_data_short') || item.name === i18n.global.t('meos_control_web.no_operation_standard')"
                        theme="darkTransparent"
                        :show-arrow="false"
                        :content="`${
                            item.name === i18n.global.t('common.no_data_short')
                                ? i18n.global.t('meos_control_web.space_temporarily_unable_to_get_temperature_data')
                                : i18n.global.t('meos_control_web.space_without_hvac_demand_standard')
                        }`"
                    >
                        <IconMeriActionTips size="12" color="#1F2329" />
                    </m-tips>
                    <IconMeriComponentChevronRight class="tips-icon" size="12" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { sum, throttle } from 'lodash';
import { IconMeriActionTips, IconMeriComponentChevronRight } from 'meri-icon';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    color: {
        type: Array,
        default: () => ['#64A6F7', '#7EE2F0', '#B6E9C7', '#FFD873', '#F8766F', '#C9CCD0', '#A7A6B5']
    }
});

const myChart = ref(null);

const chartData = computed({
    set() {
        return props.data || [];
    },
    get() {
        return props.data;
    }
});
const emits = defineEmits(['openSpaceList']);
const formatNumber = value => {
    return value?.toLocaleString();
};
const openSpaceList = data => {
    emits('openSpaceList', data);
};
const drawLine = () => {
    if (!document.getElementById('chartTem')) {
        return;
    }
    window.removeEventListener('resize', resizeEcharts, false);
    myChart.value?.dispose?.();
    myChart.value = echarts.init(document.getElementById('chartTem'), null, { renderer: 'svg' });
    myChart.value.clear();
    myChart.value.setOption(optionFun(), true);
    myChart.value.on('click', function (params) {
        if (params.componentType === 'series') {
            openSpaceList(params.data);
        }
    });

    nextTick(() => {
        myChart.value?.resize();
    });
    window.addEventListener('resize', resizeEcharts, false);
};
const optionFun = () => {
    const options = {
        tooltip: {
            show: true,
            trigger: 'item',
            borderColor: '#E4E5E7',
            borderShadow: '0px 5px 10px 0px rgba(31, 35, 41, 0.10)'
        },
        grid: {
            left: 'center',
            top: 'middle',
            containLabel: true,
            height: '80%',
            width: '80%'
        },
        legend: {
            show: false
        },
        series: dataSeriesFun()
    };
    return options;
};
const resizeEcharts = () => {
    myChart.value?.resize();
};
const dataSeriesFun = () => {
    const series = [
        {
            name: '',
            type: 'pie',
            radius: ['68px', '78px'],
            center: ['50%', '50%'],
            hoverAnimation: isEmpty.value ? false : true,
            title: {
                show: isEmpty.value ? false : true
            },
            tooltip: {
                show: isEmpty.value ? false : true,
                confine: true,
                formatter(obj) {
                    const num = Math.floor(obj?.data?.name.length / 40);
                    let string = '';
                    for (let index = 0; index < num; index++) {
                        string = `${string + obj?.data?.name.slice(index * 40, (index + 1) * 40)}<br>`;
                    }
                    string = string + obj?.data?.name.slice(num * 40);
                    const itemKey = obj?.data?.key;
                    return `<div>
                                <div class="tooltip-box">
                                    <span class="tag" style="background:${
                                        string === i18n.global.t('common.no_data_short')
                                            ? '#C9CCD0'
                                            : string === i18n.global.t('meos_control_web.no_operation_standard')
                                            ? '#A7A6B5'
                                            : obj?.color
                                    }"></span>
                                    <span class="name">${i18n.global.t('meos_control_web.temperature_name_space', { name: string })}</span>
                                    <span class="count">${formatNumber(obj?.value)}</span>
                                </div>
                                <div class="tips">${i18n.global.t('meos_control_web.click_enter_detail')}</div>
                            </div>`;
                }
            },
            label: {
                show: false
            },
            labelLine: {
                show: false,
                length: 5
            },
            itemStyle: {
                normal: {
                    color: params => {
                        return props.color[params.dataIndex];
                    }
                }
            },
            data: isEmpty?.value ? [] : chartData.value
        }
    ];
    return series;
};
const isEmpty = computed(() => {
    return props.data.every(item => item.value === 0);
});
const total = computed(() => sum(chartData.value.map(item => item.value)));
// 防抖处理 drawLine 函数
const debouncedDrawLine = throttle(() => {
    drawLine();
}, 1000); // 设置防抖延迟时间为 300ms
watch(
    () => props.data,
    () => {
        debouncedDrawLine();
    },
    {
        deep: true
    }
);

onMounted(() => {
    if (props.data.length !== 0) {
        drawLine();
    }
});
onUnmounted(() => {
    debouncedDrawLine.cancel();
    window.removeEventListener('resize', resizeEcharts, false);
    myChart.value?.dispose?.();
    myChart.value = null;
});
</script>

<style lang="less" scoped>
.echarts-box {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 40px;
    position: relative;
    .pie-title {
        position: absolute;
        left: 24px;
        top: calc(50% - 30px);
        z-index: 1;
        width: 120px;
        height: 60px;
        white-space: nowrap;
        text-align: center;
        .pie-title-text {
            color: #1f2329;
            font-family: Persagy2.0;
            font-size: 28px;
            font-weight: 600;
        }
        .pie-title-subtext {
            display: flex;
            gap: 2px;
            align-items: center;
            justify-content: center;
            margin-top: 8px;
            color: #646a73;
            font-size: 14px;
            .title {
                max-width: 72px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
            }
            .icon-linear {
                height: 14px;
                width: 14px;
                fill: #626c78;
                margin-top: 3px;
            }
        }
    }
    .lengend-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
        &-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px;
            border-radius: 4px;
            user-select: none;
            white-space: nowrap;
            cursor: pointer;
            .color-item {
                width: 14px;
                height: 14px;
                border-radius: 2px;
            }
            .name-item {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                line-height: 18px;
                display: flex;
                align-items: center;
                gap: 6px;
                .name {
                    display: inline-block;
                    max-width: 82px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .tips-icon {
                    display: none;
                }
            }
            &:hover {
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
            &:hover .tips-icon {
                display: block;
                cursor: pointer;
            }
        }
    }
}
/deep/ .tooltip-box {
    display: flex;
    align-items: center;
    gap: 8px;
    .tag {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 2px;
    }
    .name {
        color: #646c73;
        font-size: 12px;
    }
    .count {
        color: #1f2329;
        font-family: 'Persagy2.0';
        font-size: 14px;
    }
}
/deep/ .tips {
    font-size: 12px;
    color: var(--gray-500, #8b949e);
    margin-top: 4px;
}
</style>
