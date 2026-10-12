<template>
    <div class="select-infos-warp" :style="style">
        <div v-if="selectedInfo" class="select-info-choose">
            <div v-if="selectedInfo.linkCodes?.length > 0" class="link-code-group">
                <template v-for="(linkItem, linkIdx) in selectedInfo.linkCodes" :key="`linkCode_${selectedInfo.infoCode}_${linkIdx}`">
                    <m-tips theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
                        <template #content>
                            <span class="jum-tip" style="font-size: 12px; color: var(--gray-400)">*{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</span>
                            <br />
                            <div>{{ itemShowText(linkItem) }}</div>
                        </template>

                        <div ref="infoItemDoms" class="info-item" @click.stop="jumpToDataAnalysis(selectedInfo.linkCodes, true)">
                            {{ itemShowText(linkItem) }}
                        </div>
                    </m-tips>
                    <div v-if="linkIdx < selectedInfo.linkCodes.length - 1" ref="infoSplitDoms" class="group-val-line"></div>
                </template>
            </div>
            <m-tips v-else theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
                <template #content>
                    <span class="jum-tip" style="font-size: 12px; color: var(--gray-400)">*{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</span>
                    <br />
                    <div>{{ selectedInfo.aliasName || selectedInfo.name }}:{{ getItemValText(data, selectedInfo) }}</div>
                </template>

                <div ref="singleRefDom" v-ellipsis :style="{ width: `${singleW}px` }" class="info-item" @click.stop="jumpToDataAnalysis(selectedInfo)">
                    {{ getItemValText(data, selectedInfo) }}
                </div>
            </m-tips>
            <m-select v-model="selectValue" :options="data.options" :value-key="'infoCode'" :popover-attrs="{ placement: 'bottom-end' }" @change="switchData">
                <template #trigger>
                    <m-tips theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
                        <template #content>
                            <span>{{ i18n.global.t('meos_control_web.switch_data') }}</span>
                        </template>
                        <div class="switch-cion-warp"><SwitchIcon /></div>
                    </m-tips>
                </template>
            </m-select>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';

const { getIotData } = DockSingleton.getInstance();
import { jumpToAnalysis } from '@/utils/envUtils';
import _ from 'lodash';
import SwitchIcon from '@/assets/svg/switch-icon.svg';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    currentSelectedInfoCode: {
        type: String,
        default: ''
    }
});

// eslint-disable-next-line vue/no-setup-props-destructure
const { size: textRectSize } = unref(props.data) || {};

const emits = defineEmits(['switchInfo']);

// eslint-disable-next-line vue/no-setup-props-destructure
const selectValue = ref(props.currentSelectedInfoCode);

const selectedInfo = computed(() => {
    return props.data.options.find(d => d.infoCode === props.currentSelectedInfoCode);
});

const otherW = 36;
const infoItemDoms = shallowRef();
const infoSplitDoms = shallowRef();
const singleRefDom = shallowRef();
const singleW = shallowRef();

let timer = null;
const updateWidthDistribute = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        selectValue.value = props.currentSelectedInfoCode;
        let wAcc = 0;
        if (singleRefDom?.value) {
            wAcc += singleRefDom.value.scrollWidth + 1;
            if (textRectSize.x - otherW < wAcc) {
                singleW.value = textRectSize.x - otherW;
            } else {
                singleW.value = wAcc;
            }
        } else if (infoItemDoms.value?.length) {
            const splitLength = infoSplitDoms.value?.length ? infoSplitDoms.value?.length - 1 : 0;
            const maxW = textRectSize.x - otherW - splitLength * 12;
            const allScrollWidth = infoItemDoms.value.reduce((acc, dom) => {
                return acc + dom.scrollWidth + 1;
            }, 0);
            let relW = maxW < allScrollWidth ? maxW : allScrollWidth,
                remainI = infoItemDoms.value.length;
            infoItemDoms.value.sort((a, b) => {
                return a.scrollWidth - b.scrollWidth;
            });

            infoItemDoms.value.forEach(dom => {
                const everyW = relW / remainI;
                let relEveryWidth = dom.scrollWidth > everyW ? everyW : dom.scrollWidth;
                dom.style.width = `${relEveryWidth + 4}px`;
                relW -= relEveryWidth;
                remainI--;
            });
        }
    }, 50);
};
watch(
    [() => props.currentSelectedInfoCode],
    () => {
        updateWidthDistribute();
    },
    { immediate: true }
);

const style = computed(() => {
    const { size, absoluteLocation } = props.data || {};
    return {
        top: `${absoluteLocation.y}px`,
        left: `${absoluteLocation.x}px`,
        width: `${size.x}px`,
        height: `${size.y}px`
        // '--d-width': `${size.x}px`
    };
});

const getItemValText = (data, iotItem, showUnit = true) => {
    updateWidthDistribute();
    const valObj = getIotData(data?.relObj?.dataObject?.id, iotItem?.infoCode);
    if (valObj) {
        return `${valObj.dataValueName || valObj.dataValue || '--'}${showUnit ? iotItem.unit || '' : ''}`;
    }
    return '';
};

const itemShowText = (infoItem, showUnit = true) => {
    updateWidthDistribute();
    return `${infoItem.aliasName || infoItem.name}${infoItem.hasColon ? '' : ':'}${getItemValText(props.data, infoItem, showUnit)}`;
};

const jumpToDataAnalysis = (item, useParentCode = false) => {
    const equipId = props.data?.relObj?.dataObject?.id,
        _infoCode = useParentCode && item.mergeCode ? item.mergeCode : item.infoCode;

    // const { infoCode } = item;
    console.log(item);
    if (_.isArray(item) && equipId) {
        const jumpParams = item.map(child => {
            return {
                infoCode: child.infoCode,
                id: equipId
            };
        });
        console.log(jumpParams);
        jumpToAnalysis(jumpParams);
    } else if (equipId && _infoCode) {
        const jumpParams = {
            infoCode: _infoCode,
            id: equipId
        };
        jumpToAnalysis(jumpParams);
    }
};

const switchData = infoCode => {
    emits('switchInfo', infoCode);
};
</script>
<style lang="less" scoped>
.select-infos-warp {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 28px;
    .select-info-choose {
        border-radius: 2px;
        background: #fff;
        padding: 2px 4px;
        align-items: center;
        display: flex;
        justify-content: flex-end;
        gap: 4px;
        // max-width: var(--d-width);

        .link-code-group {
            font-size: 0;
            display: flex;
            // max-width: calc(var(--d-width) - 36px);

            .group-val-line {
                width: 1px;
                height: 24px;
                margin: 0 4px;
                background: var(--gray-400);
                flex-shrink: 0;
            }
        }

        .info-item {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--blue-500);
            font-size: 24px;
            line-height: 24px;
            height: 24px;
            display: inline-block;
            // flex: 1;
        }

        .switch-cion-warp {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            border-radius: 2px;
            background: #14c4c4;
            padding: 2px;
            cursor: pointer;
        }
    }
}
</style>
