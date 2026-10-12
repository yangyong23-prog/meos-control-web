<template>
    <div class="space-info wh100">
        <div class="space-info-header fcb">
            <div class="fc" style="max-width: calc(100% - 36px); flex: 1">
                <div class="space-info-header-title fc" style="max-width: calc(100% - 180px)">
                    <div class="fw700 fs16 m-ellipsis" style="padding-left: 2px">
                        {{ curSelectedSpace.localName ?? '--' }}
                    </div>
                    <m-tag color="#1B4ACC" bg-color="#D9EBFF" size="small" style="margin: 0 8px"> {{ curSelectedSpace.floorLocalName }} </m-tag>
                </div>
                <div class="space-info-header-tab">
                    <m-tabs v-model="tabData" :data="tabList" type="segment" size="small" @change="change"></m-tabs>
                </div>
            </div>
            <div class="fcc close-icon" @click="clickSpace(false)">
                <IconMeriActionClose :size="20" />
            </div>
        </div>
        <div class="space-info-content">
            <!-- eslint-disable-next-line vue/attribute-hyphenation -->
            <DataAnalysis
                v-if="tabData === SPACE_INFO_ANALYSIS"
                :temperature-bars="temperatureBars"
                :air-season="airSeason"
                :CO2Bars="CO2Bars"
                :base-info="baseInfo"
                :echart-datas="echartDatas"
                :proportion-statistics="proportionStatistics"
                :loading="loading"
            />
            <RelatedEquipemnt v-show="tabData === SPACE_INFO_RELATED_EQUIPEMNT" />
        </div>
    </div>
</template>

<script setup>
import { clickSpaceKey, curSelectedSpaceKey } from '../../injectionKey';
import { IconMeriActionClose } from 'meri-icon';
import DataAnalysis from './DataAnalysis.vue';
import RelatedEquipemnt from './RelatedEquipemnt.vue';
import useSpaceInfo from '../../hooks/useSpaceInfo';
import { SPACE_INFO_ANALYSIS, SPACE_INFO_RELATED_EQUIPEMNT } from '../../variable';

const curSelectedSpace = inject(curSelectedSpaceKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
const clickSpace = inject(clickSpaceKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
const { tabList, tabData, temperatureBars, CO2Bars, baseInfo, echartDatas, proportionStatistics, airSeason, loading, change } = useSpaceInfo(curSelectedSpace.value.id);
</script>
<style lang="less" scoped>
.space-info {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 16;
    background-color: #e9f1f8;
    &-header {
        height: 52px;
        padding: 12px 16px 8px 16px;
        .close-icon {
            border-radius: 4px;
            padding: 2px;
            cursor: pointer;
            &:hover {
                background-color: var(--alpha-30);
            }
        }
        &-title {
            max-width: calc(100% - 180px);
        }
    }
    &-content {
        height: calc(100% - 52px);
    }
}
</style>
