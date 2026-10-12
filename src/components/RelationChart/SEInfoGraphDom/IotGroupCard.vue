<template>
    <div class="iot-group-container" :style="style">
        <div class="group-info-top">
            <PrePage v-if="totalPages > 1" class="page-btn" @click="prePage()" />
            <div
                :class="{
                    'group-info-name-wrap': true,
                    'has-btns': totalPages > 1
                }"
            >
                <div
                    v-ellipsis
                    :class="['group-info-name', 'text-hide', data.clickSelected ? 'is-selected' : '']"
                    :style="{
                        background: abnormalList.length ? STATUS_BG_COLOR[abnormalList[0]] : '',
                        color: abnormalList.length ? '#fff' : ''
                    }"
                    @click.stop="clickName"
                    @mousemove.stop="() => {}"
                    @mouseenter.stop="hoverName"
                    @mouseleave.stop="unHoverName"
                >
                    {{ data.relObj?.dataObject?.localName ?? '--' }}
                </div>
                <div class="status-marks" :style="{ right: `0px`, top: '-4px', transform: `scale(${legendScaleRatio}) translateY(-50%)` }">
                    <span v-for="(item, index) in abnormalList" :key="item" class="mark-out">
                        <span v-if="index === 0 && item !== STATUS_NAME.offline" class="mark-animation" :style="{ background: STATUS_BG_COLOR[item] }"></span>
                        <span class="mark-item" :style="{ background: STATUS_BG_COLOR[item] }"></span>
                    </span>
                </div>
            </div>
            <NextPage v-if="totalPages > 1" class="page-btn" @click="nextPage()" />
        </div>

        <div v-for="(item, index) in iotItems" :key="index" class="group-info-item">
            <div v-ellipsis class="group-info-item-key text-hide">{{ item.aliasName || item.name }}{{ getUnit(item) }}</div>
            <div v-if="item.linkCodes?.length > 0" class="item-val-group-line fc">
                <template v-for="(linkItem, linkIdx) in item.linkCodes" :key="`linkCode_${item.infoCode}_${linkIdx}`">
                    <m-tips theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
                        <template #content>
                            <span class="jum-tip" style="font-size: 12px; color: var(--gray-400)">*{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</span>
                            <br />
                            <div>{{ itemShowText(linkItem) }}</div>
                        </template>

                        <div class="info-item text-hide" @click.stop="jumpToDataAnalysis(item.linkCodes, true)">{{ itemShowText(linkItem, false) }}</div>
                    </m-tips>
                    <div v-if="linkIdx < item.linkCodes.length - 1" class="group-val-line"></div>
                </template>
            </div>
            <m-tips v-else theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
                <template #content>
                    <span class="jum-tip" style="font-size: 12px; color: var(--gray-400)">*{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</span>
                    <br />
                    <div>{{ item.aliasName || item.name }}:{{ getItemValText(data, item, true) }}</div>
                </template>

                <div v-ellipsis class="item-val-inline text-hide" @click.stop="jumpToDataAnalysis(item)">
                    {{ getItemValText(data, item) }}
                </div>
            </m-tips>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { jumpToAnalysis } from '@/utils/envUtils';
import { STATUS_NAME, STATUS_BG_COLOR, STATUS_FONT_COLOR } from '../constants/common';
import _ from 'lodash';
import NextPage from '@/assets/svg/nextpage.svg';
import PrePage from '@/assets/svg/prepage.svg';

const { getIotData } = DockSingleton.getInstance();

const emit = defineEmits(['clickName', 'hoverName', 'unHoverName']);
const abnormalList = ref([]);
const currentPage = ref(0);

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    chartAttr: {
        type: Object,
        default: null
    }
});
const totalPages = ref(0);
const prePage = () => {
    if (currentPage.value > 0) {
        currentPage.value -= 1;
    } else {
        currentPage.value = totalPages.value - 1;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
        currentPage.value += 1;
    } else {
        currentPage.value = 0;
    }
};

const bgClass = ref();
watchEffect(() => {
    const { data } = props;
    const { dataObject } = data.relObj;
    if (props.chartAttr?.classCode === 'SEHD') {
        totalPages.value = Math.ceil(data.iotGroupsList.length / 4);
    }

    // 异常状态
    const statusList = [];
    if (data?.abnormal) {
        statusList.push(STATUS_NAME.abnormal);
        bgClass.value = 'is-abnormal';
    }
    const inconsistentObj = getIotData(dataObject?.id, 'orderFailAlarm');
    if (inconsistentObj?.dataValue === '1') {
        statusList.push(STATUS_NAME.inconsistent);
    }
    const offlineObj = getIotData(dataObject?.id, 'onlineStatus');
    if (!_.isEmpty(offlineObj) && offlineObj?.dataValue !== '1') {
        statusList.push(STATUS_NAME.offline);
    }

    let cStyle = {};

    if (statusList[0]) {
        // 异常色
        cStyle = {
            backgroundColor: STATUS_BG_COLOR[statusList[0]],
            color: STATUS_FONT_COLOR[statusList[0]]
        };
    } else {
        // 正常色
        cStyle = {
            backgroundColor: STATUS_BG_COLOR[STATUS_NAME.normal],
            color: STATUS_FONT_COLOR[STATUS_NAME.normal]
        };
    }
    cStyle = {
        ...cStyle
    };
    abnormalList.value = statusList;
});

const getItemValText = (data, iotItem, showUnit = false) => {
    const valObj = getIotData(data?.relObj?.dataObject?.id, iotItem?.infoCode);
    if (valObj) {
        return `${valObj.dataValueName || valObj.dataValue || '--'}${showUnit ? iotItem.unit || '' : ''}`;
    }
    return '';
};

const itemShowText = (infoItem, showUnit = true) => {
    return `${infoItem.aliasName || infoItem.name}${infoItem.hasColon ? '' : ':'}${getItemValText(props.data, infoItem, showUnit)}`;
};

const getUnit = infoItem => {
    let tempUnit = infoItem.unit;
    if (infoItem.linkCodes?.length) {
        tempUnit = infoItem.linkCodes[0].unit;
    }
    if (tempUnit) return `(${tempUnit})`;
    return '';
};

const clickName = () => {
    emit('clickName', props.data.relObj);
};

const hoverName = () => {
    emit('hoverName', props.data.relObj);
};
const unHoverName = () => {
    emit('unHoverName', props.data.relObj);
};
const iotItems = computed(() => {
    if (props.chartAttr?.classCode === 'SEHD') {
        return props.data.iotGroupsList.slice(currentPage.value * 4, currentPage.value * 4 + 4);
    }
    return props.data.iotGroupsList;
});

const style = computed(() => {
    const { x, y, w, h } = props.data || {};
    return {
        top: `${y}px`,
        left: `${x}px`,
        width: `${w}px`
    };
});
const jumpToDataAnalysis = (item, useParentCode = false) => {
    const equipId = props.data?.relObj?.dataObject?.id,
        _infoCode = useParentCode ? '' : item.infoCode;
    console.log(item);
    if (_.isArray(item) && equipId) {
        const jumpParams = item.map(child => {
            return {
                infoCode: child.infoCode,
                id: equipId
            };
        });
        jumpToAnalysis(jumpParams);
    } else if (equipId && _infoCode) {
        const jumpParams = {
            infoCode: _infoCode,
            id: equipId
        };
        jumpToAnalysis(jumpParams);
    }
};
</script>
<style lang="less" scoped>
.iot-group-container {
    display: inline-block;
    position: absolute;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid var(--Gray-300);
    background: rgba(241, 244, 246, 1);
    color: #424c59;
    font-size: 14px;
    .group-info-top {
        display: flex;
        flex-direction: row;
        flex: 1;
        width: 100%;
        position: relative;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        .page-btn {
            cursor: pointer;
            &:hover {
                :deep circle {
                    stroke: var(--blue-500, #246fe5);
                }
                :deep path {
                    fill: var(--blue-500, #246fe5);
                }
            }
        }
    }
    .group-info-name-wrap {
        position: relative;
        display: flex;
        flex: 1;
        max-width: 100%;
        &.has-btns {
            max-width: calc(100% - 80px);
        }
    }
    .group-info-name {
        cursor: default;
        width: 100%;
        font-size: 24px;
        font-style: normal;
        position: relative;
        text-align: center;
        font-weight: 700;
        line-height: 40px;
        padding-left: 6px;
        padding-right: 6px;
        border-radius: 2px;
        user-select: none;
        &:hover,
        &.is-selected {
            cursor: pointer;
            background-color: #246fe5 !important;
            color: #ffffff;
        }
        &.is-abnormal {
            background: var(--red-500, #f55047);
            color: #fff;
        }
    }
    .status-marks {
        position: absolute;
        pointer-events: none;
        .mark-out {
            display: inline-block;
            width: 7px;
            line-height: 0;
            position: relative;
            .mark-item {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid #fff;
                border-radius: 50%;
            }
            // 动画 变大再变小
            @keyframes mark-animation {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(5);
                    opacity: 0.2;
                }
                100% {
                    transform: scale(5);
                    opacity: 0;
                }
            }
            .mark-animation {
                position: absolute;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                opacity: 0.2;
                animation: mark-animation 2s cubic-bezier(0, 0, 0.25, 1) infinite;
            }
        }
    }
    .group-info-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        cursor: default;
        padding: 12px 0;
        border-bottom: 1px solid #e1e5eb;
        margin-top: 2px;
        &:last-child {
            border-bottom: none;
        }
        .group-info-item-key {
            @include text-ellipsis;
            max-width: 240px;
            color: var(--blue-500);
            font-size: 20px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 26px;
            border-radius: 4px;
            background: var(--blue-100);
            padding: 2px 4px;
            margin-right: 4px;
        }

        .item-val-group-line {
            flex-basis: 1;
            flex-shrink: 1;
            gap: 4px;
            cursor: pointer;
            display: flex;
            justify-content: flex-end;
            font-size: 20px;
            .group-val-line {
                width: 1px;
                height: 16px;
                background: var(--gray-400);
            }
        }

        .group-info-item-value {
            @include text-ellipsis;
        }

        .item-val-inline {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
        }

        .info-item:hover,
        .item-val-inline:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            color: var(--blue-500);
        }
    }
}
</style>
