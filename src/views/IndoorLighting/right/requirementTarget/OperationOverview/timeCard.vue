<template>
    <div class="time-card">
        <div class="base-layer">
            <div class="legend">
                <div v-for="legend in legends" :key="legend.name" class="legend-item">
                    <div class="legend-icon" :style="{ backgroundColor: legend.icon.color }"></div>
                    <div v-ellipsis class="legend-text meos-ellipsis-line">{{ legend.name }}</div>
                </div>
            </div>
            <div class="operation-standard">
                <div
                    v-for="item in operationStandardData"
                    :key="item.startTime + item.endTime"
                    class="operation-standard-item"
                    :class="{ 'selected-time-range': isSelectedTimeInRange(item), [item.type]: true }"
                    :style="{ width: item.rate + '%' }"
                >
                    <m-popover :show-arrow="false" theme="darkTransparent" placement="top">
                        <template #content>
                            <div class="hover-content">{{ item.name }}</div>
                            <div class="hover-content">{{ i18n.global.t('meos_control_web.time') }}:{{ item.timeRange }}</div>
                        </template>
                        <div style="display: block; height: 100%; width: 100%"></div>
                    </m-popover>
                </div>
            </div>
            <div class="temporary-circuit">
                <div
                    v-for="item in temporaryCircuitData"
                    :key="'temp-' + item.startTime + item.endTime"
                    class="temporary-circuit-item"
                    :class="item.type"
                    :style="{ width: item.rate + '%' }"
                ></div>
            </div>
            <div class="time-label">
                <div class="time-label-item">00:00</div>
                <div class="time-label-item">12:00</div>
                <div class="time-label-item">24:00</div>
            </div>
        </div>
        <div v-if="!(curTimePos.x == null)" class="overlay-layer">
            <div class="current-line" :style="{ left: curTimePos.x + '%' }"></div>
            <div class="current-marker" :style="{ left: curTimePos.x + '%' }">
                <div class="marker-text" @click="handleMarerClick">{{ i18n.global.t('meos_control_web.current') }}</div>
            </div>
            <div class="time-line" :style="{ left: timePos.x + '%' }"></div>
            <div class="time-marker" :style="{ left: timePos.x + '%' }" @mousedown="handleMouseDown">
                <div class="marker-text">{{ timeLabel }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { getDayjsTz } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import i18n from '@/localization';

// 节流时间常量（毫秒）
const THROTTLE_TIME = 100;

const emit = defineEmits(['update:selectedTime']);

const props = defineProps({
    startTime: {
        type: String,
        default: () => {
            const now = getDayjsTz().set('hour', 0).set('minute', 0).set('second', 0);
            return now.format('YYYY-MM-DD HH:mm:ss');
        }
    },
    endTime: {
        type: String,
        default: () => {
            const now = getDayjsTz().set('hour', 23).set('minute', 59).set('second', 59);
            return now.format('YYYY-MM-DD HH:mm:ss');
        }
    },
    currentTime: {
        type: String,
        default: ''
    },
    selectedTime: {
        type: String,

        default: ''
    },
    temporarySwitchCircuitTaskTime: {
        type: Array,
        default: () => []
    },
    operationStandard: {
        type: Array,
        default: () => []
    }
});
// 添加节流功能的拖拽事件处理
let lastExecTime = 0,
    timeoutId = null,
    // 添加拖拽功能
    startX = 0,
    startLeft = 0;
const isDragging = ref(false);

// marker的位置
const curTimePos = ref({ x: 0, y: 0 });
const timePos = ref({ x: 0, y: 0 });

const handleMarerClick = () => {
    emit('update:selectedTime', props.currentTime);
};

// 图例数据
const legends = computed(() => {
    return [
        { name: i18n.global.t('meos_control_web.operation_standard'), icon: { color: 'var(--blue-200)' } },
        { name: i18n.global.t('meos_control_web.temporary_switch_circuit'), icon: { color: 'var(--yellow-700)' } }
    ];
});

const isSelectedTimeInRange = item => {
    if (item?.startTime && item?.endTime && props?.selectedTime) {
        return item.startTime <= props.selectedTime && item.endTime >= props.selectedTime;
    }
    return false;
};

const handleMouseDown = event => {
    isDragging.value = true;
    startX = event.clientX;
    startLeft = timePos.value.x;

    // 添加全局事件监听器
    window.addEventListener('mousemove', throttledHandleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
};

const handleMouseMove = event => {
    if (!isDragging.value) return;

    const container = document.querySelector('.time-card');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;

    // 计算鼠标移动距离
    const deltaX = event.clientX - startX;
    // 计算相对于容器的百分比变化
    const deltaPercentage = (deltaX / containerWidth) * 100;

    // 更新 timePos
    let newLeft = startLeft + deltaPercentage;
    // 限制在容器范围内
    newLeft = Math.max(0, Math.min(100, newLeft));

    timePos.value.x = newLeft;

    // 拖拽过程中，实时更新 selectedTime
    const startMilliseconds = timeToMilliseconds(props.startTime);
    const endMilliseconds = timeToMilliseconds(props.endTime);
    const totalTimeRange = endMilliseconds - startMilliseconds;
    const currentMilliseconds = startMilliseconds + (newLeft / 100) * totalTimeRange;
    const selectedTimeString = millisecondsToTime(Math.floor(currentMilliseconds), props.startTime);
    // 发送更新事件
    emit('update:selectedTime', selectedTimeString);
};

const throttledHandleMouseMove = event => {
    const now = Date.now();
    const interval = THROTTLE_TIME; // 100ms 节流间隔

    if (now - lastExecTime >= interval) {
        // 立即执行
        handleMouseMove(event);
        lastExecTime = now;
    } else {
        // 清除之前的定时器
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // 设置新的定时器，确保最后一次事件被执行
        timeoutId = setTimeout(() => {
            handleMouseMove(event);
            lastExecTime = Date.now();
        }, interval - (now - lastExecTime));
    }
};

const handleMouseUp = () => {
    isDragging.value = false;

    // 清除可能存在的定时器
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    // 移除全局事件监听器
    window.removeEventListener('mousemove', throttledHandleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
};

// 将时间字符串转换为毫秒数的辅助函数（支持完整日期时间格式）
const timeToMilliseconds = timeStr => {
    return dayjs(timeStr).valueOf(); // 返回毫秒时间戳
};

// 将毫秒数转换为完整日期时间字符串的辅助函数
const millisecondsToTime = milliseconds => {
    return dayjs(milliseconds).format('YYYY-MM-DD HH:mm:ss');
};

// 通用的时间段处理函数
const processTimeData = data => {
    // 将props的时间转换为毫秒
    const startMilliseconds = timeToMilliseconds(props.startTime);
    const endMilliseconds = timeToMilliseconds(props.endTime);

    // 计算总时间范围（毫秒）
    const totalTimeRange = endMilliseconds - startMilliseconds;

    // 创建一个时间段数组，包含所有时间段
    const timeSlots = [];

    // 添加数据中的时间段
    const sortedData = [...data].sort((a, b) => timeToMilliseconds(a.startTime) - timeToMilliseconds(b.startTime));

    let processingTime = startMilliseconds;

    for (const item of sortedData) {
        const itemStart = timeToMilliseconds(item.startTime);
        const itemEnd = timeToMilliseconds(item.endTime);

        // 如果当前时间小于时间段开始时间，添加空时间段
        if (processingTime < itemStart && itemStart <= endMilliseconds) {
            // 确保时间段在范围内
            const slotStart = Math.max(processingTime, startMilliseconds);
            const slotEnd = Math.min(itemStart, endMilliseconds);

            if (slotStart < slotEnd) {
                const duration = slotEnd - slotStart;
                const rate = totalTimeRange > 0 ? (duration / totalTimeRange) * 100 : 0;
                timeSlots.push({
                    name: i18n.global.t('meos_control_web.scene_not_yet_set'),
                    startTime: millisecondsToTime(slotStart, props.startTime),
                    endTime: millisecondsToTime(slotEnd, props.startTime),
                    type: 'empty',
                    rate: parseFloat(rate.toFixed(4)) // 保留四位小数
                });
            }
        }

        // 如果时间段在范围内，添加正常时间段
        if (itemEnd > startMilliseconds && itemStart < endMilliseconds) {
            const slotStart = Math.max(itemStart, startMilliseconds);
            const slotEnd = Math.min(itemEnd, endMilliseconds);

            if (slotStart < slotEnd) {
                const duration = slotEnd - slotStart;
                const rate = totalTimeRange > 0 ? (duration / totalTimeRange) * 100 : 0;
                timeSlots.push({
                    ...item,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    type: 'normal',
                    rate: parseFloat(rate.toFixed(4)) // 保留四位小数
                });
            }
        }

        processingTime = Math.max(processingTime, itemEnd);
    }

    // 如果还有剩余时间，添加空时间段
    if (processingTime < endMilliseconds) {
        const duration = endMilliseconds - processingTime;
        const rate = totalTimeRange > 0 ? (duration / totalTimeRange) * 100 : 0;
        timeSlots.push({
            name: i18n.global.t('meos_control_web.scene_not_yet_set'),
            startTime: millisecondsToTime(processingTime, props.startTime),
            endTime: props.endTime,
            type: 'empty',
            rate: parseFloat(rate.toFixed(4)) // 保留四位小数
        });
    }

    // 按startTime升序排序
    return timeSlots.sort((a, b) => timeToMilliseconds(a.startTime) - timeToMilliseconds(b.startTime));
};

// 获取指定时间在时间轴上的位置（支持完整日期时间格式）
const getCurrentTimePosition = timeString => {
    // 将当前时间转换为毫秒
    const currentMillisecondsTotal = timeToMilliseconds(timeString);

    // 将props的时间转换为毫秒
    const startMilliseconds = timeToMilliseconds(props.startTime);
    const endMilliseconds = timeToMilliseconds(props.endTime);

    // 检查当前时间是否在范围内
    if (currentMillisecondsTotal >= startMilliseconds && currentMillisecondsTotal <= endMilliseconds) {
        // 计算当前时间在总时间范围内的比例
        const totalTimeRange = endMilliseconds - startMilliseconds;
        const currentPosition = ((currentMillisecondsTotal - startMilliseconds) / totalTimeRange) * 100;
        return currentPosition;
    }

    // 如果不在范围内，返回null
    return null;
};

const operationStandardData = computed(() => {
    return processTimeData(props.operationStandard || []).map(item => {
        let start = dayjs(item.startTime).format('HH:mm'),
            end = dayjs(item.endTime).format('HH:mm');
        if (end === '23:59' || end === '00:00') {
            end = '24:00';
        }
        return {
            ...item,
            timeRange: `${start} ~ ${end}`
        };
    });
});

const temporaryCircuitData = computed(() => {
    return processTimeData(props.temporarySwitchCircuitTaskTime || []);
});

// 根据timePos的x属性计算对应的时间
const timeLabel = computed(() => {
    // 将百分比位置转换为时间
    const startMilliseconds = timeToMilliseconds(props.startTime);
    const endMilliseconds = timeToMilliseconds(props.endTime);
    const totalTimeRange = endMilliseconds - startMilliseconds;

    // 计算当前百分比位置对应的时间毫秒数
    const currentMilliseconds = startMilliseconds + (timePos.value.x / 100) * totalTimeRange;

    // 使用 dayjs 解析时间
    const currentTime = dayjs(currentMilliseconds);
    const hours = currentTime.hour();
    const minutes = currentTime.minute();
    const seconds = currentTime.second();

    // 格式化为 HH:mm 格式
    let timeString;
    // 当前时间为结束时间 且 时分秒为0 时，返回24:00
    if (currentMilliseconds === endMilliseconds && hours === 0 && minutes === 0 && seconds === 0) {
        timeString = '24:00';
    } else {
        timeString = currentTime.format('HH:mm');
    }

    // 如果curTimePos.x 与timePos.x相等，在时间字符串后添加“(当前)”
    if (Math.abs(curTimePos.value.x - timePos.value.x) < 0.1) {
        // 使用一个小的容差值比较浮点数
        timeString += `(${i18n.global.t('meos_control_web.current')})`;
    }

    return timeString;
});

// 监听 props 变化，更新位置
watch(
    () => props.selectedTime,
    newValue => {
        if (!newValue) return;
        const x = getCurrentTimePosition(newValue);
        if (x !== null) {
            timePos.value.x = x;
        }
    },
    { immediate: true }
);

watch(
    () => props.currentTime,
    newValue => {
        if (!newValue) return;
        const x = getCurrentTimePosition(newValue);
        if (x !== null) {
            curTimePos.value.x = x;
        }
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.time-card {
    width: 100%;
    height: 100%;
    position: relative;
    user-select: none;

    .base-layer {
        .legend {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;

            .legend-item {
                display: flex;
                align-items: center;

                .legend-icon {
                    display: block;
                    width: 14px;
                    height: 14px;
                    margin-right: 8px;
                }
                .legend-text {
                    font-size: 12px;
                }
            }
        }

        // 公共的 item 样式
        @padding-box-size: 1px;
        .operation-standard-item,
        .temporary-circuit-item {
            height: 100%;
            border: none;
            box-sizing: border-box;
            position: relative;

            &:first-child:not(:last-child) {
                border-right: @padding-box-size solid white;
            }

            &:last-child:not(:first-child) {
                border-left: @padding-box-size solid white;
            }

            &:not(:first-child):not(:last-child) {
                border-left: @padding-box-size solid white;
                border-right: @padding-box-size solid white;
            }
        }

        .operation-standard {
            display: flex;
            height: 24px;
            margin-top: 8px;

            .operation-standard-item {
                &.selected-time-range,
                &:hover {
                    &::after {
                        content: '';
                        position: absolute;
                        inset: 0;
                        border: @padding-box-size solid var(--blue-500);
                        pointer-events: none;
                    }
                }

                &.normal {
                    background-color: var(--blue-200);
                }

                &.empty {
                    background: repeating-linear-gradient(108.552deg, #e1e5eb, #e1e5eb 3px, #fafafa 0px, #fafafa 6px);
                }

                .hover-content {
                    padding: 12px;
                    line-height: 22px;
                }
            }
        }

        .temporary-circuit {
            display: flex;
            height: 24px;
            margin-top: 4px;

            .temporary-circuit-item {
                &.normal {
                    background-color: var(--yellow-700);
                }

                &.empty {
                    background-color: #eeeeee;
                }
            }
        }

        .time-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 20px;
            margin-top: 4px;
            padding: 4px 0 0 0; // 顶部padding 4px
            border-top: 2px solid var(--gray-200); // 顶部border宽度2px 颜色--gray-200

            .time-label-item {
                font-size: 12px;
                font-weight: 400;
                color: var(--gray-600);
            }
        }
    }
    .overlay-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // 允许鼠标事件穿透到下层，但子元素保持正常交互
        pointer-events: none;

        .current-line,
        .current-marker,
        .time-line,
        .time-marker {
            pointer-events: auto; // 子元素保持正常的鼠标事件响应
        }

        .time-line,
        .current-line {
            position: absolute;
            top: 25px;
            bottom: 22px;
            width: 1px;
            transform: translateX(-50%); // 让线的中心对准指定位置
        }

        .current-line {
            border-left: 1px dashed var(--gray-900);
        }
        .time-line {
            border-left: 1px solid var(--gray-900);
        }

        .time-marker,
        .current-marker {
            position: absolute;
            bottom: 0;
            left: 0; // 与 current-line 使用相同的位置
            transform: translateX(-50%); // 水平居中对齐 current-line

            .marker-text {
                position: relative;
                color: white;
                font-size: 10px;
                border-radius: 2px;
                padding: 2px 4px;
                white-space: nowrap;
                line-height: 12px;

                &::before {
                    content: '';
                    position: absolute;
                    top: -4px; // 三角形在上方
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                }
            }
        }

        .current-marker {
            .marker-text {
                background: var(--gray-600);
                cursor: pointer;

                &::before {
                    border-bottom: 4px solid var(--gray-600);
                }
            }
        }

        .time-marker {
            .marker-text {
                background: var(--gray-700);
                cursor: grab; /* 添加拖拽鼠标样式 */

                &::before {
                    border-bottom: 4px solid var(--gray-700);
                }
            }

            &:active {
                .marker-text {
                    cursor: grabbing; /* 拖拽时的鼠标样式 */
                }
            }
        }
    }
}
</style>
