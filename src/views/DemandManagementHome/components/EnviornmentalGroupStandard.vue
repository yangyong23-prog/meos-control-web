<template>
    <m-modal
        v-model:visible="innerShow"
        :append-to="$modalAppendTo"
        modal-class-name="group-standard-modal"
        type="default"
        :footer="false"
        :title="i18n.global.t('meos_control_web.group_standard')"
        :height="600"
        :width="1000"
        @close="close"
    >
        <template #content>
            <div class="f" style="height: 100%">
                <div class="group-standard-modal-left">
                    <m-scrollbar class="group-standard-modal-left-scrollbar">
                        <div
                            v-for="standard in allStandard"
                            :key="standard.spaceType.id"
                            class="left-item"
                            :class="{ active: standard === currentStandard }"
                            @click="chooseSpaceStacndard(standard)"
                        >
                            {{ standard.spaceType.name }}
                        </div>
                    </m-scrollbar>
                </div>
                <div class="group-standard-modal-right">
                    <div v-if="loading" id="group-standard-loading-warp"></div>
                    <template v-if="temperatureList?.length">
                        <div class="title-item f16 fb7">{{ i18n.global.t('meos_control_web.temp_criterion') }}</div>
                        <div class="temperature-box mt12 mb12">
                            <div v-for="(item, idx) in temperatureList" :key="idx" class="temperature-box-item">
                                <div>{{ item.name }}</div>
                                <div class="temperature-box-item-bc mt8 mb8">
                                    <TemperatureBar :list="item.list" :is-det="true" />
                                </div>
                                <div class="fc f14 ft">
                                    {{ i18n.global.t('meos_control_web.temperature_monitoring') }}
                                    <span>{{ i18n.global.t('meos_control_web.exceed_comfort_zone_duration') }}{{ item.tempOverTimeLimit || '--' }}min</span>
                                    <div class="get-line ml12 mr12"></div>
                                    <span>{{ i18n.global.t('meos_control_web.exceed_cold_hot_threshold_duration') }}{{ item.tempUncomfortTimeLimit || '--' }}min</span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-if="CO2Obj">
                        <div class="title-item f16 fb7">CO<sub>2</sub>{{ i18n.global.t('meos_control_web.standard') }}</div>
                        <div class="temperature-box mt12 mb12">
                            <div class="temperature-box-item">
                                <div class="temperature-box-item-bc mb8">
                                    <CO2Bar :list="CO2Obj.list" :is-det="true" :right-config-expand="true" />
                                </div>
                                <div class="fc f14 ft">
                                    <span>CO<sub>2</sub>{{ i18n.global.t('meos_control_web.monitoring_colon') }}</span>
                                    <span>{{ i18n.global.t('meos_control_web.exceed_comfort_zone_duration') }}{{ CO2Obj.coUncomfortTimeLimit || '--' }}min</span>
                                    <div class="get-line ml12 mr12"></div>
                                    <span>{{ i18n.global.t('meos_control_web.exceed_high_threshold_duration') }}{{ CO2Obj.coOverTimeLimit || '--' }}min</span>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-if="!CO2Obj && !temperatureList?.length" class="empty-container">
                        <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
                    </div>
                </div>
            </div>
        </template>
    </m-modal>
</template>
<script setup>
import i18n from '@/localization';
import TemperatureBar from './TemperatureBar.vue';
import CO2Bar from './CO2Bar.vue';
import { queryStandard, queryZone } from '@/apis/DemandManagementHome';
import useStore from '@/store';
const { base } = useStore();
import { MLoading } from 'meri-plus';

const climateZone = ref('');

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['update:show']);
const innerShow = computed({
    get() {
        return props.show;
    },
    set(val) {
        emits('update:show', val);
    }
});

const loading = ref(false);
const allStandard = ref([]);
const currentStandard = ref(null);

// // 查询地区便秘
// const queryZonePromise =;

// // 查询所有运行标准
// const queryStandardPromise =;
loading.value = true;
Promise.all([
    queryZone({
        groupCode: base.groupCode,
        projectId: base.projectId
    }),
    queryStandard({
        groupCode: base.groupCode,
        projectId: base.projectId
    })
])
    .then(([zoneRes, standardRes]) => {
        const { resultCode: zoneCode, content: zoneData } = zoneRes;
        const { code: standardCode, data: standardData } = standardRes;
        if (zoneCode === '00000') {
            climateZone.value = zoneData[0]?.climateZone;
        }
        if (standardCode === '00000') {
            standardData.forEach((da, index) => {
                if (!da.spaceType) {
                    da.spaceType = {
                        id: 'project' + index,
                        name: i18n.global.t('meos_control_web.global_configuration')
                    };
                }
            });
            allStandard.value = standardData;
            currentStandard.value = standardData[0];
        }
    })
    .catch(e => {
        console.log(e);
    })
    .finally(() => {
        loading.value = false;
    });

const chooseSpaceStacndard = item => {
    currentStandard.value = item;
};

const close = () => {
    innerShow.value = false;
};
const loadingInstance = ref();
watch([loading, () => props.show], () => {
    if (loading.value && props.show) {
        nextTick(() => {
            loadingInstance.value = MLoading.service({
                target: `#group-standard-loading-warp`,
                fullscreen: false,
                duration: 100,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                },
                background: 'transparent'
            });
        });
    } else {
        loadingInstance.value?.destroy();
    }
});
const temperatureList = computed(() => {
    const allTemps = currentStandard.value?.configValues?.temps || [];
    const currentZoneTemps = allTemps.find(item => item.zoneCode === climateZone.value)?.tempLimits;
    const renderTemps =
        currentZoneTemps?.map(tempObj => {
            return {
                name: tempObj.seasonName,
                list: [
                    { name: i18n.global.t('meos_control_web.temperature_overcold_threshold'), value: tempObj.tempColdLimit },
                    { name: i18n.global.t('meos_control_web.temperature_comfort_zone_lower'), value: tempObj.tempComfortLowerLimit },
                    { name: i18n.global.t('meos_control_web.temperature_comfort_zone_upper'), value: tempObj.tempComfortUpperLimit },
                    { name: i18n.global.t('meos_control_web.temperature_overheat_threshold'), value: tempObj.tempHotLimit }
                ],

                tempOverTimeLimit: tempObj.tempOverTimeLimit,
                tempUncomfortTimeLimit: tempObj.tempUncomfortTimeLimit
            };
        }) || [];
    console.log(renderTemps);

    return renderTemps;
});

const CO2Obj = computed(() => {
    const co = currentStandard.value?.configValues?.co;
    if (!co) return null;
    return {
        name: i18n.global.t('meos_control_web.co2_standard'),
        list: [
            { name: `CO<sub>2</sub>${i18n.global.t('meos_control_web.comfort_zone_upper')}`, value: co.coComfortUpperLimit },
            { name: `CO<sub>2</sub>${i18n.global.t('meos_control_web.high_threshold')}`, value: co.coHigherLimit }
        ],
        coOverTimeLimit: co.coOverTimeLimit,
        coUncomfortTimeLimit: co.coUncomfortTimeLimit
    };
});
</script>
<style lang="less" scoped>
.group-standard-modal-left-scrollbar {
    padding-right: 10px;
}
.group-standard-modal-left {
    height: 100%;
    max-height: 100%;
    width: 40%;
    padding: 10px;
    padding-right: 0;
    // overflow: auto;
    .left-item {
        padding: 12px;
        font-size: 14px;
        font-style: normal;
        line-height: 22px;
        cursor: pointer;
        &:hover {
            background-color: var(--gray-200);
        }
        &.active {
            background-color: #d9ebff;
            border-radius: 4px;
            font-weight: 700;
            color: var(--blue-500);
        }
    }
}
.group-standard-modal-right {
    height: 100%;
    max-height: 100%;
    width: 60%;
    padding: 12px;
    background-color: #f1f4f6;
    overflow: auto;
    .empty-container,
    #group-standard-loading-warp {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.temperature-box {
    background-color: white;
    padding: 16px;
    border-radius: 8px;
    width: 100%;
    .temperature-box-item {
        .get-line {
            width: 1px;
            height: 12px;
            background-color: #e1e5eb;
        }
        &-bc {
            background-color: #f1f4f6;
            padding: 12px;
            height: 88px;
            overflow-x: hidden;
            .box-line {
                margin-left: 0px;
            }
        }
    }
    .temperature-box-item:not(:last-child) {
        border-bottom: 1px solid #e1e5eb;
        padding-bottom: 16px;
        margin-bottom: 16px;
    }
}

.title-item {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    height: 22px;
    line-height: 22px;

    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500);
        content: '';
    }
}
</style>
