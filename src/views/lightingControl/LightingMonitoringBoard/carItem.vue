<template>
    <div v-for="(item, index) in list" :key="index" class="carItem cp" @click="goFloor(item)" @mouseleave="handleMouseLeave(item)" @mouseenter="handleMouseEnter(item)">
        <div class="fcb" style="line-height: 28px">
            <div class="fc">
                <div class="f18 fb7">{{ item.localName ?? '--' }}</div>
                <div v-if="item.haveAbnormal || item.haveDeviation || item.haveStatusAbnormal" class="get-round ml4"></div>
            </div>
            <div>
                <m-button v-show="item.id === id" type="link" size="small" class="mr4" @click="goFloor(item)">{{ i18n.global.t('meos_control_web.enter_floor') }}</m-button>
                <m-tag v-if="item.totalMoreOpenCount" color="#FFFFFF" bg-color="#E6B407" size="small">
                    {{
                        i18n.global.t('meos_control_web.more_open_num', {
                            totalMoreOpenCount: item.totalMoreOpenCount
                        })
                    }}
                </m-tag>
                <m-tag v-if="item.totalMoreLessCount" color="#FFFFFF" bg-color="#FF9D2D" size="small">
                    {{ i18n.global.t('meos_control_web.less_open_num', { totalMoreLessCount: item.totalMoreLessCount }) }}
                </m-tag>
            </div>
        </div>
        <div class="f mt12 mb12">
            <div>
                <div class="f18 fb7 font-f">{{ convertAndFloor(item.demandConsistency) || '--' }}%</div>
                <div class="f14 ft mt4">{{ i18n.global.t('meos_control_web.space_lighting') }}</div>
            </div>
            <div class="get-line-h ml32 mr32"></div>
            <div style="flex: 1">
                <div :class="['fcb']">
                    <div class="f14 ft mr6" style="width: 60px">{{ i18n.global.t('meos_control_web.actually_on') }}</div>

                    <div :class="['legend-bar', 'fc']">
                        <m-popover :content="i18n.global.t('meos_control_web.i_am_hint_text')" theme="darkTransparent" :show-arrow="false">
                            <template #content>
                                <div>
                                    {{ i18n.global.t('meos_control_web.actually_on') }} : <span class="f14 fb7">{{ item.totalRealOpenCount }}</span>
                                </div>
                            </template>
                            <div
                                :class="['pr', 'bar-item']"
                                :style="{
                                    backgroundColor: '#9FC9FB',
                                    width: item.totalRealOpenCount !== 0 ? ((item.totalRealOpenCount / totalMax()) * 100).toFixed(1) + '%' : 2 + 'px'
                                }"
                            >
                                <div v-show="item.totalRealOpenCount < item.totalDemandOpenCount" class="get-dotted-line"></div>
                            </div>
                        </m-popover>
                        <div class="ft f12 ml6">{{ item.totalRealOpenCount }}</div>
                    </div>
                </div>
                <div :class="['fcb', 'mt8']">
                    <div class="f14 ft mr6" style="width: 60px">{{ i18n.global.t('meos_control_web.need_start') }}</div>
                    <m-popover :content="i18n.global.t('meos_control_web.i_am_hint_text')" theme="darkTransparent" :show-arrow="false">
                        <template #content>
                            <div>
                                {{ i18n.global.t('meos_control_web.need_start') }} : <span class="f14 fb7">{{ item.totalDemandOpenCount }}</span>
                            </div>
                        </template>
                        <div :class="['legend-bar', 'fc']">
                            <div
                                :class="['pr', 'bar-item']"
                                :style="{
                                    backgroundColor: '#D7DBE0',
                                    width: item.totalDemandOpenCount !== 0 ? ((item.totalDemandOpenCount / totalMax()) * 100).toFixed(1) + '%' : 2 + 'px'
                                }"
                            >
                                <div
                                    v-show="item.totalDemandOpenCount < item.totalRealOpenCount || item.totalDemandOpenCount === item.totalRealOpenCount"
                                    class="get-dotted-line1"
                                ></div>
                            </div>

                            <div class="ft f12 ml6">{{ item.totalDemandOpenCount }}</div>
                        </div>
                    </m-popover>
                </div>
            </div>
        </div>
        <div :class="[item?.totalDemandDeviatedSpaceCount ? 'requirement' : 'no-requirement', 'fc', 'cp']" @click.stop="handleDemandDeviationList(item)">
            <template v-if="item?.totalDemandDeviatedSpaceCount">
                <I18nSlot html-tag="div" name-key="meos_control_web.total_disorder_space" class="f14">
                    <template #num>
                        <span class="fb7" style="color: #f55047; font-family: 'Persagy2.0'">{{ item.totalDemandDeviatedSpaceCount }}</span>
                    </template>
                </I18nSlot>
                <IconMeriComponentChevronRight />
            </template>
            <template v-else>
                <div class="ft">{{ i18n.global.t('meos_control_web.no_demand_deviation_space') }}</div>
            </template>
        </div>
        <div class="get-w-line mt8 mb8"></div>
        <div>
            <div
                v-if="item.totalInterventionSpaceCount || item.totalDemandInterventionSpaceCount || item.totalManualSpaceCount"
                v-ellipsis="{
                    title: i18n.global.t('meos_control_web.interrupt_space', {
                        totalInterventionSpaceCount: item.totalInterventionSpaceCount,
                        totalDemandInterventionSpaceCount: item.totalDemandInterventionSpaceCount,
                        totalManualSpaceCount: item.totalManualSpaceCount
                    })
                }"
                class="ft f12 m-ellipsis"
            >
                <I18nSlot html-tag="div" class="ft" name-key="meos_control_web.interrupt_space">
                    <template #totalInterventionSpaceCount>
                        <span style="color: black">{{ item.totalInterventionSpaceCount }}</span>
                    </template>
                    <template #totalDemandInterventionSpaceCount>
                        <span style="color: black">{{ item.totalDemandInterventionSpaceCount }}</span>
                    </template>
                    <template #totalManualSpaceCount>
                        <span style="color: black">{{ item.totalManualSpaceCount }}</span>
                    </template>
                </I18nSlot>
            </div>
            <div v-else class="ft">{{ i18n.global.t('meos_control_web.no_space_intervention') }}</div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import I18nSlot from '@/components/I18nSlot.vue';
import emitter from '@/utils/bus';
import { IconMeriComponentChevronRight } from 'meri-icon';
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    commonArea: {
        type: Array,
        default: () => {}
    }
});
const id = ref('');
const curFloorId = inject('curFloorId');
const headerModelView = inject('headerModelView');
const isFloor = inject('isFloor');
const templateType = inject('templateType');
const callToggleWidth = inject('callToggleWidth');
const handleMouseLeave = item => {
    id.value = '';
};
const handleMouseEnter = item => {
    id.value = item.id;
};
const goFloor = data => {
    templateType.value = data.demandTemplateType;
    nextTick(() => {
        callToggleWidth(true);
        isFloor.value = true;
        headerModelView.value = 'model';
        curFloorId.value = data.id;
    });
};

const handleDemandDeviationList = item => {
    const dataItems = item?.demandDeviatedSpaces;
    if (Array.isArray(dataItems) && dataItems?.length) {
        emitter.emit('viewDemandDeviationList', {
            item,
            list: dataItems
        });
    }
};
const convertAndFloor = value => {
    return value === '--' ? '--' : (Number(value) * 100).toFixed(0);
};
//实际最大数
const maxActual = () => {
    let maxItem = [];
    props?.commonArea?.forEach(item => {
        item.floors.forEach(io => {
            maxItem.push(io.totalRealOpenCount);
        });
    });
    return Math.max(...maxItem);
};
//需要最大数
const maxRequires = () => {
    let maxItem = [];
    props?.commonArea?.forEach(item => {
        item.floors.forEach(io => {
            maxItem.push(io.totalDemandOpenCount);
        });
    });
    return Math.max(...maxItem);
};
const totalMax = () => {
    return maxActual() > maxRequires() ? maxActual() : maxRequires();
};
</script>
<style lang="less" scoped>
.carItem {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px 16px 14px;
    min-height: 186px;
    min-width: 339px;
    border: 2px solid transparent;
}
.carItem:hover {
    border: 2px solid var(--blue-400, #2481f2);
}
.get-round {
    width: 10px;
    height: 10px;
    background-color: #f55047;
    border-radius: 50%;
}
.get-line-h {
    height: 48px;
    width: 1px;
    border-right: 1px solid rgba(196, 201, 207, 0.3);
    // background-color: #c4c9cf;
}
.get-w-line {
    width: 100%;
    height: 1px;
    background-color: rgba(196, 201, 207, 0.3);
}
.legend-bar {
    height: 10px;
    flex: 1;
    .bar-item {
        height: 100%;
        border-radius: 2px;
    }
}
.requirement {
    width: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, rgba(116, 146, 165, 0.08) 0%, rgba(116, 146, 165, 0.04) 100%);
    padding: 4px 12px;
}
.no-requirement {
    width: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, rgba(116, 146, 165, 0.08) 0%, rgba(116, 146, 165, 0.04) 100%);
    padding: 4px 12px;
}
.requirement:hover {
    background: linear-gradient(90deg, rgba(116, 146, 165, 0.2) 0%, rgba(116, 146, 165, 0.12) 100%);
}
.pr {
    position: relative;
}
.get-dotted-line {
    height: 48px;
    width: 1px;
    border-right: 1px dashed #8b949e;
    position: absolute;
    top: -5px;
    right: -1px;
    z-index: 1;
}
.get-dotted-line1 {
    height: 48px;
    width: 1px;
    border-right: 1px dashed #8b949e;
    position: absolute;
    right: -1px;
    bottom: -6px;
}
.font-f {
    font-family: 'CustomMedium2', 'PersagyBold2', 'Persagy-Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'PingFang SC', 'Noto Sans',
        'Noto Sans CJK SC', 'Microsoft YaHei', '微软雅黑', sans-serif;
}
</style>
