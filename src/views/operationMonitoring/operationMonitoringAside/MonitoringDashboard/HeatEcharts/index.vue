<template>
    <m-modal v-model:visible="show" :append-to="$modalAppendTo" type="full" modal-class-name="heat-echarts-data" :auto-close="false" :escable="false" @close="close">
        <template #content>
            <div class="heat-echarts-container">
                <div class="heat-header fcb">
                    <div class="heat-header-title">
                        <img class="heat-header-title-img" src="@/assets/imgs/852827713.png" alt="" />
                        <span
                            >{{ i18n.global.t('meos_control_web.operation_monitoring_dashboard') }} -
                            <span class="heat-header-title-mark">{{ systemObj?.localName || systemObj?.name || '--' }}</span></span
                        >
                    </div>
                    <div class="heat-close" @click="close"><IconMeriActionClose size="24" /></div>
                </div>
                <div class="heat-content">
                    <m-illustration v-if="isEmpty" class="empty fcc" :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
                    <div v-else class="heat-content-chart">
                        <template v-if="!isLoading">
                            <!-- 市政换热 -->
                            <MunicipalhotstationBoardModal
                                v-if="heatSoureType === 'MunicipalhotstationBoard'"
                                :is-shows="isShows"
                                :generate-array="generateArray"
                                :municipalhot-top-data="municipalhotTopData"
                                :municipalhot-center-data="municipalhotCenterData"
                                :colored-array="coloredArray"
                            ></MunicipalhotstationBoardModal>
                            <!-- 燃气锅炉 -->
                            <GasBoilerBoardModal
                                v-else
                                :is-shows="isShows"
                                :generate-array="generateArray"
                                :gas-boiler-board-top-data="gasBoilerBoardTopData"
                                :gas-boiler-board-center-data="gasBoilerBoardCenterData"
                                :colored-array="coloredArray"
                            ></GasBoilerBoardModal>
                            <RealTimeValue v-if="batchInfoCodeData?.length" :batch-info-code-data="batchInfoCodeData" :is-show-bottom="isShowBottom" />
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriActionClose } from 'meri-icon';
import useHeatEcharts from '../../../hooks/useHeatEcharts';
import RealTimeValue from './RealTimeValue.vue';
import MunicipalhotstationBoardModal from './MunicipalhotstationBoardModal.vue';
import GasBoilerBoardModal from './GasBoilerBoardModal.vue';
const emits = defineEmits(['close']);
const props = defineProps({
    funcCode: {
        type: String,
        default: () => ''
    }
});
const {
    isShows,
    isEmpty,
    isLoading,
    systemObj,
    coloredArray,
    isShowBottom,
    heatSoureType,
    batchInfoCodeData,
    gasBoilerBoardTopData,
    gasBoilerBoardCenterData,
    municipalhotTopData,
    municipalhotCenterData,
    generateArray
} = useHeatEcharts(props);
const show = ref(false);
const close = () => {
    show.value = false;
    emits('close');
};
onMounted(() => {
    show.value = true;
});
</script>
<style lang="less">
.heat-echarts-data {
    height: 100%;
    .m-modal-header {
        display: none !important;
    }
    .heat-echarts-container {
        width: 100%;
        height: 100vh;
        background-image: url('@/assets/imgs/page_bg.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-color: #ebf6ff;
        .heat-header {
            padding: 16px 24px 0 24px;
            &-title {
                height: 40px;
                color: #2e3742;
                font-size: 18px;
                font-weight: 700;
                display: flex;
                align-items: center;
                &-img {
                    height: 40px;
                    width: 40px;
                    margin-right: 4px;
                }
                &-mark {
                    color: #246fe5;
                }
            }
            .heat-close {
                height: 24px;
                width: 24px;
                cursor: pointer;
                &:hover {
                    background-color: var(--alpha-30);
                    border-radius: 2px;
                }
            }
        }
        .heat-content {
            height: calc(100% - 80px);
            overflow: auto;
            &-chart {
                height: 100%;
                padding: 12px 24px 24px 24px;
                .chart-line-container {
                    margin-bottom: 20px;
                    min-height: 280px;
                    max-height: 420px;
                    height: calc((100% - 120px) / 2);
                    border-radius: 12px;
                    display: grid;
                    grid-gap: 20px;
                    &-item {
                        height: 100%;
                        padding: 12px 24px;
                        border-radius: 12px;
                        background: rgba(255, 255, 255, 0.8);
                        box-shadow: 0px 4px 24px 0px rgba(213, 227, 241, 0.4);
                        &-legend {
                            height: 32px;
                            margin: 8px 0;
                            overflow: hidden;
                            position: relative;

                            .legend-container {
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 32px;
                                display: flex;

                                .legend-item {
                                    margin-right: 16px;
                                    height: 32px;
                                    line-height: 32px;
                                    display: flex;
                                    align-items: center;
                                    .icon {
                                        display: inline-block;
                                        width: 16px;
                                        height: 3px;
                                        margin-right: 4px;
                                    }
                                    .name {
                                        color: #626c78;
                                        font-size: 14px;
                                        white-space: nowrap;
                                    }
                                }
                            }
                            .btn {
                                position: absolute;
                                user-select: none;
                                right: 0;
                                top: 0;
                                width: 64px;
                                height: 32px;
                                line-height: 32px;
                                text-align: right;
                                background: #fff;
                                color: #246fe5;
                                box-shadow: -5px 0 10px -5px rgba(0, 0, 0, 0.16);
                                &:hover {
                                    color: #1b4acc;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
                .chart-line-container-1 {
                    grid-template-columns: repeat(1, 1fr);
                }
                .chart-line-container-2 {
                    grid-template-columns: repeat(2, 1fr);
                }
                .chart-line-container-3 {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
            .empty {
                height: 100%;
            }
        }
        .el-loading-spinner .path {
            stroke-width: 1px !important;
            stroke: #626c78 !important;
            opacity: 1 !important;
        }
        .el-loading-mask {
            background: none !important;
        }
        .el-loading-spinner .circular {
            width: 26px;
            height: 26px;
        }
    }
    .m-modal-full-content {
        padding: 0 !important;
        min-width: 1280px;
    }
}
@media screen and (max-width: 1800px) {
    .heat-echarts-data {
        .heat-echarts-container {
            .heat-content {
                &-chart {
                    padding: 12px 16px 16px 16px;
                    .chart-line-container {
                        margin-bottom: 12px;
                        grid-gap: 12px;
                    }
                }
            }
        }
    }
}
</style>
