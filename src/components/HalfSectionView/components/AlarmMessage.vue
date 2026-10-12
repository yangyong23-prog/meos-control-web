<template>
    <div v-show="itemList?.length > 0" ref="alarmMessageRef" class="alarm-message" :class="{ 'container-expanded': isExpanded }">
        <div class="message-title"><AlarmSvg></AlarmSvg>{{ i18n.global.t('meos_control_web.half_view_alarm_msg') }}</div>
        <div class="split-line"></div>
        <template v-if="isGroup">
            <template v-for="item in itemList" :key="item.id">
                <div class="obj-name js-responsive-toggle" :style="{ visibility: !showExpandButton || item.index < overflowItemIndex ? 'visible' : 'hidden' }">
                    {{ item.localName ?? '--' }}:
                </div>
                <div
                    v-for="info in item.infoList"
                    :key="info.infoCode"
                    :style="{ visibility: !showExpandButton || info.index < overflowItemIndex ? 'visible' : 'hidden' }"
                    class="alarm-item js-responsive-toggle"
                    :class="info.className"
                >
                    <div class="title">{{ info.infoCodeName }}:</div>
                    <div class="content">{{ info.text }}</div>
                </div>
            </template>
        </template>
        <template v-else>
            <div
                v-for="item in itemList"
                :key="item.infoCode"
                :style="{ visibility: !showExpandButton || item.index < overflowItemIndex ? 'visible' : 'hidden' }"
                class="alarm-item js-responsive-toggle"
                :class="item.className"
            >
                <div class="title">{{ item.infoCodeName }}:</div>
                <div class="content">{{ item.text }}</div>
            </div>
        </template>
        <div v-if="showExpandButton" type="link" class="btn" :class="{ 'expand-button': !isExpanded }" @click="toggleExpand">
            {{ isExpanded ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}
        </div>
    </div>
</template>
<script setup>
import AlarmSvg from '@/assets/svg/HalfSectionView/alarm.svg';
import i18n from '@/localization';
import responsiveDock from '@/hooks/responsiveDock';
import { itemValueText } from '@/components/HalfSectionView/utils';
import { debounce } from 'lodash';
import { graphContainerWidthKey } from '@/components/HalfSectionView/hooks/useRendererHook';

const props = defineProps({
    equipId: { type: String, default: '' },
    data: { type: Array, default: () => [] },
    equipmentId: { type: String, default: '' },
    isGroup: {
        type: Boolean,
        default: false
    }
});

const { getIotData } = responsiveDock.getInstance();

const graphContainerWidth = inject(graphContainerWidthKey);
const overflowItemIndex = ref(100);
const alarmMessageRef = ref(null);
const isExpanded = ref(false);
const showExpandButton = ref(false); // 是否显示展开按钮
// const curInfoData = infoCode => getIotData(props.equipId, infoCode);

// 检测哪个 alarm-item 开始超出容器宽度
const findOverflowAlarmItem = () => {
    const container = alarmMessageRef.value;
    if (!container) return null;

    // 获取容器的边界信息
    const containerRect = container.getBoundingClientRect();
    const containerRight = containerRect.right;

    // 只检查 js-responsive-toggle 元素
    const alarmItems = container.querySelectorAll('.js-responsive-toggle');
    for (let i = 0; i < alarmItems.length; i++) {
        const item = alarmItems[i];
        const itemRect = item.getBoundingClientRect();

        // console.log('itemRect: ', itemRect, containerRight, item);
        // 如果元素的右边超出容器的右边，则该元素是第一个溢出的元素
        if (itemRect.right > containerRight - 58) {
            console.log('=======itemRect: ', itemRect, containerRight, item, i);
            // console.log(`第 ${i} 个 alarm-item 开始溢出`);
            return { element: item, index: i };
        }
    }

    return null; // 没有 alarm-item 溢出
};

// 检测是否需要显示展开按钮
const checkOverflow = async () => {
    if (!itemList.value?.length || !props.equipId) return;
    const container = alarmMessageRef.value; // 对应 .alarm-message 元素
    if (container && !isExpanded.value) {
        const isOverflow = container.scrollWidth > container.clientWidth;
        // console.log('内容是否溢出:', isOverflow, container.scrollWidth, container.clientWidth);
        showExpandButton.value = isExpanded.value || isOverflow;
    }
    if (showExpandButton.value) {
        if (!isExpanded.value) {
            overflowItemIndex.value = findOverflowAlarmItem()?.index ?? 100;
        }
    }
    // console.log(' overflowItemIndex.value: ', overflowItemIndex.value);
};
const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
    if (isExpanded.value) {
        overflowItemIndex.value = 100;
    }
    nextTick(() => {
        checkOverflow();
    });
};

const getAlarmItem = (objId, infoItem, index) => {
    const curInfoData = getIotData(objId, infoItem.infoCode) ?? {};
    const className = curInfoData.dataValue === '1' ? 'alarm' : curInfoData.dataValue === '0' ? 'normal' : 'other';

    return {
        ...curInfoData,
        className,
        index,
        text: itemValueText(curInfoData)
    };
};
const itemList = computed(() => {
    if (!props.data || !props.equipId) return [];
    if (props.isGroup) {
        let indexCount = 0;
        return props.data.map(obj => {
            const nameIdx = indexCount;
            indexCount += 1;

            const infoList =
                obj.infoList?.map((item, index) => {
                    return getAlarmItem(obj.id, item, indexCount++);
                }) ?? [];
            return { ...obj, infoList, index: nameIdx };
        });
    } else {
        const mainItem = props.data?.find(() => true);
        return (
            mainItem?.infoList?.map((item, index) => {
                return getAlarmItem(props.equipId, item, index);
            }) ?? []
        );
    }
});

const debounceResizeHandler = debounce(checkOverflow, 16);

watch([itemList, graphContainerWidth], debounceResizeHandler);
onMounted(() => {
    checkOverflow();
});

onUnmounted(() => {
    debounceResizeHandler?.cancel();
});
</script>
<style lang="less" scoped>
.alarm-message {
    position: absolute;
    // top: 100%;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 20px;
    // white-space: nowrap;
    max-width: calc(100% - 160px);
    width: max-content;
    // flex-wrap: wrap;
    flex-wrap: nowrap;

    display: flex;
    padding: 10px;
    align-items: center;
    gap: 12px;

    border-radius: 8px 8px 0 0;
    border: 1px solid var(--Grey-Grey-0-Text, #fff);
    background: rgba(255, 255, 255, 0.9);

    &.container-expanded {
        flex-wrap: wrap;
    }

    .message-title {
        display: flex;
        align-items: center;
        gap: 3px;
        white-space: nowrap;
        color: var(--Grey-Grey-900, #1b2129);

        font-weight: 400;
    }
    .split-line {
        flex-shrink: 0;
        width: 1px;
        height: 13px;
        background: #d9d9d9;
    }
    .obj-name {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        gap: 4px;
        color: var(--Grey-Grey-900, #1b2129);
        font-size: 14px;
        font-weight: 700;
    }
    .alarm-item {
        display: flex;
        flex-shrink: 0;
        padding: 4px 8px;
        align-items: center;
        gap: 4px;
        border-radius: 4px;
        background: var(--Grey-Grey-100, #f1f4f6);

        .title {
            color: var(--Grey-Grey-700, #424c59);

            font-weight: 400;
        }
        &.alarm {
            background: var(--Palette-Red-100, #ffe6e5);
            .content {
                color: var(--Palette-Red-500, #f55047);
            }
        }
        &.normal {
            background: var(--Palette-Turquoise-100, #cbf7f3);
        }
        &.other {
            background: var(--Grey-Grey-100, #f1f4f6);
        }
    }
    .btn {
        display: flex;
        padding: 5px 8px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: var(--Palette-Blue-500, #246fe5);
        border-radius: 4px;
        &:hover {
            background: var(--alpha-30);
        }
    }
    .expand-button {
        position: absolute;
        right: 10px;
        bottom: 8px;
    }
}
</style>
