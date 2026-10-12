<template>
    <div v-show="show" class="half-section-view">
        <div class="header">
            <div class="left">
                <div v-ellipsis class="title m-ellipsis">
                    {{ targetData?.localName ?? '--' }}
                </div>
                <div v-if="runningInfo" class="status" :class="runningInfo?.isRunning ? 'running' : ''">
                    {{ i18n.global.t('meos_control_web.operation_status_colon') }}{{ runningInfo?.text }}
                </div>
            </div>
            <div class="header-close" @click="show = false">
                <IconMeriActionClose size="24"></IconMeriActionClose>
            </div>
        </div>
        <div class="half-section-view-content">
            <div ref="graphContainerRef" class="graph-container">
                <div class="base-layer" :style="graphStyle">
                    <component :is="pipe.img" v-for="(pipe, index) in pipeBgInfos" :key="`pipe-${index}`" :style="pipe.style" class="base-img"></component>

                    <template v-for="arrow in arrowsData" :key="arrow.code">
                        <component :is="arrow.img" :style="getSvgItemStyle(arrow)" class="arrow-img"></component>
                    </template>
                    <div
                        v-for="card in airOutletCards"
                        :id="card.code"
                        :key="card.code"
                        :style="{ left: card.anchorLocation.x + 'px', top: card.anchorLocation.y + 'px' }"
                        class="air-outlet-card-anchor"
                    ></div>
                    <div
                        v-for="anchor in relEquipNameAnchors"
                        :id="anchor.domId"
                        :key="anchor.domId"
                        :style="{ left: anchor.anchorLocation.x + 'px', top: anchor.anchorLocation.y + 'px' }"
                        class="air-outlet-card-anchor"
                    ></div>
                    <template v-for="part in partsData" :key="part.id">
                        <component
                            :is="componentMap[part.code]"
                            :id="part.id"
                            :style="getSvgItemStyle(part)"
                            :width="part.size.width"
                            :height="part.size.height"
                            :equip-id="part.equipId"
                            v-bind="$attrs"
                            class="part-img"
                            @mouseenter="hoverPartAbout(part, $event)"
                            @mouseleave="unhoverPartAbout()"
                        ></component>
                    </template>
                </div>
                <div class="dom-layer" :style="domLayerStyle">
                    <div
                        v-for="part in partsData"
                        :id="part.nameId"
                        :key="part.id"
                        v-ellipsis
                        class="part-name"
                        :class="curHoverPartId === part.id ? 'hover' : ''"
                        :style="namesStyleMap[part.id]"
                        @mouseenter="hoverPartAbout(part)"
                        @mouseleave="unhoverPartAbout()"
                    >
                        {{ part.name }}
                    </div>
                    <InfoCard
                        v-for="partCard in infoCardList"
                        :key="partCard.id"
                        :hovered="curHoverPartId === partCard.id"
                        :style="infoCardsStyleMap[partCard.id]"
                        :item="partCard"
                        :equip-id="partCard.equipId"
                        @onHover="() => hoverPartAbout(partCard)"
                        @unHover="unhoverPartAbout()"
                    ></InfoCard>
                    <AirOutletCard
                        v-for="card in airOutletCards"
                        :key="card.code"
                        :data="card"
                        :equip-id="targetData?.id"
                        :style="airOutletCardStyleMap[card.code]"
                    ></AirOutletCard>
                    <RelEquipName v-for="card in relEquipNameAnchors" :key="card.domId" :data="card" :style="relEquipNamesStyleMap[card.id]"></RelEquipName>
                </div>
            </div>
            <AlarmMessage
                v-if="!isLoading"
                :equip-id="targetData?.id"
                :data="alarmInfoList"
                :is-group="alarmIsGroup"
                :style="{
                    fontSize: nameInfoFontSize + 'px'
                }"
            ></AlarmMessage>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import useRendererHook from './hooks/useRendererHook';
import InfoCard from './components/InfoCard.vue';
import { IconMeriActionClose } from 'meri-icon';
import AlarmMessage from './components/AlarmMessage.vue';
import AirOutletCard from './components/AirOutletCard.vue';
import RelEquipName from './components/RelEquipName.vue';
import { itemValueText } from './utils/index';
import responsiveDock from '@/hooks/responsiveDock';

const { getIotData } = responsiveDock.getInstance();
const props = defineProps({
    infoGroups: { type: Array, default: () => [] },
    targetData: { type: Object, default: () => {} },
    templateData: { type: Object, default: () => {} },
    isLoading: { type: Boolean, default: true },
    useScale: { type: Boolean, default: true }
});
const show = defineModel('show', { type: Boolean, default: false });

const {
    pipeBgInfos,
    partsData,
    arrowsData,
    graphStyle,
    graphContainerRef,
    namesStyleMap,
    infoCardsStyleMap,
    componentMap,
    infoCardList,
    curHoverPartId,
    airOutletCards,
    airOutletCardStyleMap,
    relEquipNameAnchors,
    relEquipNamesStyleMap,
    nameInfoFontSize,
    hoverPartAbout,
    unhoverPartAbout,
    getSvgItemStyle,
    domLayerStyle
} = useRendererHook(props);

const runningInfo = computed(() => {
    if (!props.targetData?.id) return null;
    const info = getIotData(props.targetData.id, 'runStatus');
    if (!info.existsIotRule) {
        return;
    }
    return {
        ...info,
        text: itemValueText(info),
        isRunning: info?.dataValue === '1'
    };
});
const alarmInfoList = computed(() => {
    const group = props.infoGroups?.find(g => g.groupCode === 'runningParameter')?.groupChildren?.find(g => g.groupCode === 'alarmMessage');

    const arr = group?.relInfoCodeConfigs?.find(config => config.infoCode === 'alarmMessage')?.dataValue;

    const mainItem = {
        id: props.targetData?.id,
        localName: props.targetData?.localName,
        infoList: arr
    };
    const alarmList = [];
    if (arr?.length > 0) {
        alarmList.push(mainItem);
    }
    props.infoGroups
        ?.find(g => g.groupCode === 'relation')
        ?.relInfoCodeConfigs?.forEach(config => {
            config.dataValue?.forEach(item => {
                const alarmMessages = item.relInfoCodeGroupConfigs
                    ?.find(g => g.groupCode === 'runningParameter')
                    ?.groupChildren?.find(g => g.groupCode === 'alarmMessage')
                    ?.relInfoCodeConfigs?.find(cfg => cfg.infoCode === 'alarmMessage')?.dataValue;
                if (alarmMessages?.length > 0) {
                    alarmList.push({
                        id: item.id,
                        localName: item.localName,
                        infoList: alarmMessages
                    });
                }
            });
        });

    return alarmList;
});
const alarmIsGroup = computed(() => {
    return props.targetData?.classCode === 'ACAHG';
});
</script>
<style scoped lang="less">
.half-section-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #fff;

    border-radius: 8px;

    .header {
        width: 100%;
        display: flex;
        height: 56px;
        padding: 12px 24px;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--Grey-Grey-200, #e8ecf0);
        .left {
            display: flex;
            align-items: center;
            gap: 8px;
            overflow: hidden;
            flex: 1;
            .title {
                color: var(--Grey-Grey-800, #2e3742);
                font-size: 16px;
                font-weight: 700;
                line-height: 24px; /* 150% */
            }
            .status {
                display: flex;
                padding: 0 4px;
                justify-content: center;
                align-items: center;
                gap: 10px;
                white-space: nowrap;
                border-radius: 2px;
                font-size: 12px;
                font-weight: 400;

                background: var(--Grey-Grey-200, #e8ecf0);
                color: var(--Grey-Grey-900, #1b2129);

                &.running {
                    background: var(--Palette-Green-100, #daf7e1);
                    color: var(--Palette-Green-700, #0c9b4a);
                }
            }
        }
        .header-close {
            height: 24px;
            width: 24px;

            cursor: pointer;
            z-index: 2;
            &:hover {
                border-radius: 4px;
                background-color: var(--alpha-30);
            }
        }
    }
    &-content {
        width: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow: hidden;
        position: relative;
        .graph-container {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            overflow-y: auto;
            background: var(--Grey-Grey-100, #f1f4f6);
            .base-layer {
                position: absolute;
                // width: 100%;
                // height: 100%;
                -webkit-transform-origin: left top;
                -moz-transform-origin: left top;
                -ms-transform-origin: left top;
                transform-origin: left top;
            }
            .base-img {
                position: absolute;
            }
            .part-img,
            .arrow-img {
                position: absolute;
            }
            .dom-layer {
                position: relative;
                pointer-events: none; /* 核心：让 b 不拦截鼠标事件 */
            }

            .dom-layer * {
                pointer-events: auto; /* 核心：让 b 里面的子元素恢复鼠标事件 */
            }
        }
        .part-name {
            text-align: center;
            position: absolute;
            color: var(--Grey-Grey-600, #626c78);
            // -webkit-text-stroke-width: 1px;
            // -webkit-text-stroke-color: #fff;
            /* 主流浏览器原生描边 */
            // -webkit-text-stroke: 1px #fff;
            // text-stroke: 1px #fff;
            /* Firefox 降级（text-shadow） */
            text-shadow: 1px 0 0 @white, 0 1px 0 @white, -1px 0 0 @white, 0 -1px 0 @white;
            font-size: 14px;
            font-weight: 400;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            overflow: hidden;
            word-break: break-all;

            &.hover {
                color: var(--Palette-Blue-500, #246fe5);
                font-weight: 700;
                z-index: 10;
            }
        }
        .air-outlet-card-anchor {
            position: absolute;
            width: 1px;
            height: 1px;
            visibility: hidden;
            pointer-events: none;
        }
    }
}
</style>
