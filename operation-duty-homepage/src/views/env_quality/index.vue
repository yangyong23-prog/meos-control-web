<template>
    <Panel
        id="env-quality"
        :loading="loading"
        :title="title"
        title-path="/ac-operation-control"
        :card-tag="{
            errorEventTotal: data?.errorEventTotal
        }"
    >
        <div class="env-quality">
            <div class="chart-box">
                <div ref="chartDom" class="env-quality-chart"></div>
                <div class="title">
                    {{ i18n.global.t('operation_duty_homepage.meos_home_temperature_compliance_rate') }}
                </div>
            </div>
            <div class="env-quality-total">
                <div v-for="item in totalList" :key="item.name" class="env-quality-total-item">
                    <div :style="{ color: item.value === '--' ? 'var(--gray-500)' : item.color }" class="env-quality-total-item-color fcc ffb">{{ item.value }}</div>
                    <div class="fcc" :style="{ color: item.value === '--' ? 'var(--gray-500)' : '' }">{{ item.name }}</div>
                </div>
            </div>
            <div v-if="size === '1*2' || size === 'large'" class="env-quality-space">
                <div class="space-title">{{ i18n.global.t('operation_duty_homepage.meos_home_special_space_leaderboard') }}</div>
                <template v-if="specialSpaceRankList.length">
                    <div v-for="(item, i) in specialSpaceRankList" :key="item.spaceId" class="space-item">
                        <div class="space-item-icon">
                            <img :src="getImageUrl(i + 1)" alt="" />
                        </div>
                        <div class="space-item-content">
                            <div class="space-item-content-name">
                                <span v-ellipsis class="space-name">{{ item.spaceName }}</span>
                                <span class="temp">{{ item.tdb }}℃</span>
                            </div>
                            <div class="space-item-content-value fc">
                                <div style="width: 10%" class="value-line"></div>
                                <div style="width: 80%; height: 100%">
                                    <div :style="{ width: item.account + '%' }" class="value-line"></div>
                                </div>
                                <div class="value-line" style="width: 10%; background-color: transparent"></div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="fcc" style="flex: 1">
                        <m-illustration :title="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" type="noContent"></m-illustration>
                    </div>
                </template>
            </div>
        </div>
    </Panel>
</template>

<script lang="js" setup>
import i18n from '@/localization';
import Panel from '../components/base/panel.vue';
import * as echarts from 'echarts/core';
import { TitleComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useResizeObserver } from '@vueuse/core';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
const { data, getDutyHomeData, loading, startDataPolling } = useHomeDataHook();
defineProps({
	size: {
		type: String,
		default: '1*1'
	},
	title: {
		type: String,
		default: i18n.global.t('common.env_quality')
	}
})
echarts.use([
  PieChart,
  CanvasRenderer,
  LabelLayout,
  TitleComponent
]);
const chartDom = ref()
const specialSpaceRankList = ref([])
const tdbSatisfyPercentage = ref(0)
let myChart,
	resizeObserver;
const renderChart = () => {
	myChart = echarts.init(chartDom.value);
 	const option = {
		color: ['#69CD90', '#E1E5EB'],
		title: {
			text: tdbSatisfyPercentage.value !== null ? tdbSatisfyPercentage.value + '%' : '--',
			// subtext: i18n.global.t('operation_duty_homepage.meos_home_temperature_compliance_rate'),
			textStyle: {
				fontFamily: 'PersagyBold, Persagy-Bold',
				fontSize: 28,
				color: '#2E3742'
			},
			subtextStyle: {
				color: '#626C78',
				fontSize: 14
			},
			textAlign: 'center',
			left: '50%',
			top: 55
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: [96, 111],
				center: ['50%', '100%'],
				// adjust the start and end angle
				startAngle: 180,
				endAngle: 360,
				emphasis : {
					disabled: true
				},
				label: {
					show: false
				},
				data: [
					{ value: tdbSatisfyPercentage.value, name: 'Search Engine'},
					{ value: 100 - tdbSatisfyPercentage.value, name: 'Direct' }
				]
			}
		]
	};
	option && myChart.setOption(option);
	resizeObserver = useResizeObserver(chartDom.value, resizeEcharts);
}
const resizeEcharts = () => {
	myChart.resize();
}
function getImageUrl(i) {
    return new URL(`../../assets/imgs/${i}.png`, import.meta.url).href;
}
const totalList = computed(() => {
	return [
		{name: i18n.global.t('operation_duty_homepage.meos_home_number_of_supercooled_spaces'), value: data.value?.tooColdCount ?? '--', color: 'var(--blue-600)'},
		{name: i18n.global.t('operation_duty_homepage.meos_home_number_of_cold_spaces'), value: data.value?.coldCount ?? '--', color: 'var(--blue-300)'},
		{name: i18n.global.t('operation_duty_homepage.meos_home_number_of_partial_hot_spaces'), value: data.value?.hotCount ?? '--', color: 'var(--red-300)'},
		{name: i18n.global.t('operation_duty_homepage.meos_home_number_of_superheated_spaces'), value: data.value?.tooHotCount ?? '--', color: 'var(--red-600)'}
	]
})
const init = async () => {
	try {
		startDataPolling({ systemList: ['RUN_ANALYSIS'] });
		await getDutyHomeData({ systemList: ['RUN_ANALYSIS'] });
		specialSpaceRankList.value = data.value.specialSpaceRankList ?? []
		let tdbs = [];

		specialSpaceRankList.value.forEach((item) => {
			tdbs.push(+item.tdb)
		})
		const maxTdb = Math.max(...tdbs)
		const minTdb = Math.min(...tdbs)
		const sub = maxTdb - minTdb
		specialSpaceRankList.value.forEach(item => {
			if (+item.tdb === maxTdb) {
				item.account = 100
			} else if (+item.tdb === minTdb) {
				item.account = 0
			} else {
				item.account = ((item.tdb - minTdb) / sub) * 100
			}
		})
		tdbSatisfyPercentage.value = data.value.tdbSatisfyPercentage ?? null
		renderChart();
	} catch (error) {
		specialSpaceRankList.value = []
	}

}
onMounted(() => {
    init();
});
onUnmounted(() => {
	myChart?.dispose();
    resizeObserver?.stop();
})
</script>
<style lang="less" scoped>
.env-quality {
    padding: 0 8px;
    height: calc(100% - 26px);
    display: flex;
    flex-direction: column;
    gap: 32px;
    .chart-box {
        position: relative;
        width: 100%;
        height: 113px;
        .title {
            position: absolute;
            width: 50%;
            top: 100%;
            left: 50%;
            transform: translate(-50%, -50%);
            white-space: normal;
            overflow-wrap: break-word;
            text-align: center;
            color: #626c78;
            font-size: 14px;
            max-width: 180px;
        }
    }
    &-chart {
        height: 113px;
        :deep(canvas) {
            cursor: default;
            font-family: 'PersagyBold', 'PersagyRegular', 'PersagyMedium', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'PingFang SC', 'Noto Sans',
                'Noto Sans CJK SC', 'Microsoft YaHei', '微软雅黑', sans-serif;
        }
    }
    &-total {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        &-item {
            width: 100%;
            white-space: pre-wrap;
            color: #626c78;
            font-size: 14px;
            text-align: center;

            &-color {
                font-weight: 700;
                font-size: 24px;
            }
        }
    }
    &-space {
        padding: 0 8px;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .space-title {
            font-weight: 700;
        }
        .space-item {
            min-height: 48px;
            display: flex;
            gap: 8px;
            align-items: center;
            &-icon {
                width: 30px;
                height: 20px;
                img {
                    height: 100%;
                    width: 100%;
                }
                display: flex;
                align-items: center;
                justify-content: center;
            }
            &-content {
                width: calc(100% - 30px);
                &-name {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    width: 100%;
                    .space-name {
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        min-width: 0;
                    }

                    .temp {
                        flex-shrink: 0;
                        margin-left: 4px;
                    }
                }
                &-value {
                    margin-top: 4px;
                    height: 8px;
                    background-color: var(--alpha-30);
                    .value-line {
                        height: 100%;
                        background-color: var(--blue-400);
                    }
                }
            }
        }
    }
}
</style>
