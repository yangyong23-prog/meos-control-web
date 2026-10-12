<template>
    <div
        v-if="viewBox"
        class="draw-rect"
        :style="{
            left: `${viewBox.left}px`,
            width: `${viewBox.width}px`,
            height: `${viewBox.height}px`,
            top: `${viewBox.top + (qiankunWindow?.__POWERED_BY_QIANKUN__ ? -48 : 0)}px`,
            visibility: eIn && sIn ? 'visible' : 'hidden'
        }"
    >
        <svg xmlns="http://www.w3.org/2000/svg" :width="viewBox.width" :height="viewBox.height" :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`" fill="none">
            <!-- 路径 -->
            <path v-if="showDot" id="line" ref="line" :d="linePathD" :stroke="color" stroke-width="3" />
            <!-- 箭头 -->
            <path v-if="showArrow" id="arrow" :d="arrowPathD" :fill="color" stroke="white" />
            <!-- 起点 -->
            <circle id="dot" :cx="dotC.x" :cy="dotC.y" r="3.5" :fill="color" stroke="white" />
        </svg>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { qiankunWindow } from '@/utils/helper';
import { throttle } from 'lodash';

const props = defineProps({
    startConfig: {
        type: Object,
        default: null
    },
    endConfig: {
        type: Object,
        default: null
    },
    color: {
        type: String,
        default: '#2481F2'
    },
    growAnimation: {
        type: Boolean,
        default: true
    },
    duration: {
        type: Number,
        default: 500
    }
});

const viewBox = ref();
const arrowPathD = ref();
const linePathD = ref();
const dotC = ref();
const sIn = ref(false);
const eIn = ref(false);
const showDot = ref(true);
const showArrow = ref(false);

const line = ref();

const startPoint = ref();
const endPoint = ref();

let growAnimationShowed = false,
    resizecallback = null;

// 起点半径
const startDotR = 4;
function getLineD(start, end) {
    // M5 137H29.5C33.9183 137 37.5 133.418 37.5 129V15.9999C37.5 11.5816 41.0817 7.99988 45.5 7.99988H71
    const { x: sx, y: sy } = start;
    const { y: ey } = end;
    const ex = end.x - 8;
    const dx = ex - sx;
    const dy = ey - sy;

    const eps = 1e-3;
    if (Math.sqrt(dx * dx + dy * dy) < eps) {
        return `M ${sx} ${sy}`;
    }

    if (Math.abs(dy) < eps || Math.abs(dx) < eps) {
        return `M ${sx} ${sy} L ${ex} ${ey}`;
    }

    const signX = dx > 0 ? 1 : -1; // X方向移动符号（左/右）
    const signY = dy > 0 ? 1 : -1; // Y方向移动符号（上/下）
    const r = Math.min(Math.abs(dx) / 2, Math.abs(dy) / 2) * 0.3; // 圆弧半径

    // 路径上的关键点坐标
    const x1 = sx + (dx - signX * 2 * r) / 2;
    const y1 = sy;
    const x2 = x1 + signX * r;
    const y2 = y1 + signY * r;
    const x3 = x2;
    const y3 = y2 + signY * (Math.abs(dy) - 2 * r);
    const x4 = x3 + signX * r;
    const y4 = y3 + signY * r;

    // 圆弧方向标记（基于Y移动方向）
    const sweep1 = signY > 0 ? 1 : 0; // 第一段圆弧（水平→垂直）
    const sweep2 = signY > 0 ? 0 : 1; // 第二段圆弧（垂直→水平）

    // 构建path的d属性
    return `M ${sx} ${sy}
          L ${x1} ${y1}
          A ${r} ${r} 0 0 ${sweep1} ${x2} ${y2}
          L ${x3} ${y3}
          A ${r} ${r} 0 0 ${sweep2} ${x4} ${y4}
          L ${ex} ${ey}`;
}

const getArrowD = ({ x, y }) => {
    // 三角形垂线长度
    const d = 8;
    // 三角形底边长度
    const b = 10;
    return `M${x} ${y}L${x - d} ${y - b * 0.5}L${x - d} ${y + b * 0.5}L${x} ${y}Z`;
};

watchEffect(async () => {
    if (!(props.startConfig.dom && props.endConfig.dom)) return;
    await nextTick();

    const { dom: startDom, offsetX: sOffsetX = 0, offsetY: sOffsetY = 0, height: sHeight = 0, scrollCintainer: sScrollCintainer } = props.startConfig;
    const { dom: endDom, offsetX: eOffsetX = 0, offsetY: eOffsetY = 0, height: eHeight = 0, scrollCintainer: eScrollCintainer } = props.endConfig;

    const sCallback = () => {
        const sRect = startDom.getBoundingClientRect();
        startPoint.value = { left: sRect.x + sRect.width + sOffsetX, top: sRect.y + (sHeight || sRect.height) * 0.5 + sOffsetY };
        if (sScrollCintainer) {
            sIn.value = isPointInsideScrollContainer(sScrollCintainer, startPoint.value);
        } else {
            sIn.value = true;
        }
    };

    const eCallback = () => {
        const eRect = endDom.getBoundingClientRect();
        endPoint.value = { left: eRect.x + eOffsetX, top: eRect.y + (eHeight || eRect.height) * 0.5 + eOffsetY };

        if (eScrollCintainer) {
            eIn.value = isPointInsideScrollContainer(eScrollCintainer, endPoint.value);
        } else {
            eIn.value = true;
        }
    };

    resizecallback = () => {
        sCallback();
        eCallback();
    };

    window.addEventListener('resize', resizecallback);

    if (sScrollCintainer) {
        sScrollCintainer.addEventListener('scroll', throttle(sCallback, 8), { passive: true });
    }
    if (eScrollCintainer) {
        eScrollCintainer.addEventListener('scroll', throttle(eCallback, 8), { passive: true });
    }
    resizecallback();
});

watch([startPoint, endPoint], async () => {
    if (startPoint.value && endPoint.value) {
        const left = Math.min(endPoint.value.left, startPoint.value.left);
        const top = Math.min(endPoint.value.top, startPoint.value.top);
        const width = Math.max(endPoint.value.left, startPoint.value.left) - left;
        const height = Math.max(endPoint.value.top, startPoint.value.top) - top;
        viewBox.value = { left: left - startDotR, top: top - startDotR, width: width + startDotR * 2, height: height + startDotR * 2 };

        const start = { x: startPoint.value.left - viewBox.value.left, y: startPoint.value.top - viewBox.value.top };
        const end = { x: endPoint.value.left - viewBox.value.left, y: endPoint.value.top - viewBox.value.top };
        dotC.value = start;
        arrowPathD.value = getArrowD(end);
        linePathD.value = getLineD(start, end);
        await nextTick();
        // 修复可能的线条成为虚线的问题
        if (!growAnimationShowed && JSON.stringify(start) !== JSON.stringify(end)) {
            const showArrowFunc = () => {
                showArrow.value = true;
                if (line.value) {
                    // 恢复默认值
                    line.value.style.strokeDashoffset = 0;
                    line.value.style.strokeDasharray = 'none';
                }
            };
            if (props.growAnimation) {
                animateGrowPath(line.value, props.duration).then(showArrowFunc);
            } else {
                showArrowFunc();
            }
            addLightFlowAnimation(line.value);
            growAnimationShowed = true;
        }
    }
});

// 判断点是否在滚动容器的可视区域外
function isPointInsideScrollContainer(container, point) {
    const { top } = point;
    // 获取容器相对于视口的位置
    const containerRect = container.getBoundingClientRect();

    // 判断点是否可见
    const visible = top >= containerRect.top && top <= containerRect.bottom;

    return visible;
}

function animateGrowPath(path, duration = 2000) {
    return new Promise(resolve => {
        const length = path.getTotalLength();

        // 重置为初始状态
        path.style.strokeDashoffset = length;
        path.style.strokeDasharray = length;

        // 启动动画
        let startTime;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 更新偏移量
            path.style.strokeDashoffset = length * (1 - progress);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        }
        requestAnimationFrame(step);
    });
}
function addLightFlowAnimation(pathElement) {
    // 获取原始路径数据
    const d = pathElement.getAttribute('d');
    const strokeWidth = parseFloat(pathElement.getAttribute('stroke-width')) || 3;
    const strokeColor = pathElement.getAttribute('stroke') || '#000';

    // 创建发光路径
    const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glowPath.setAttribute('d', d);
    glowPath.setAttribute('fill', 'none');

    // 设置发光路径样式
    glowPath.setAttribute('stroke', 'white');
    glowPath.setAttribute('stroke-width', strokeWidth);
    glowPath.setAttribute('stroke-linecap', 'round');
    glowPath.setAttribute('stroke-linejoin', 'round');
    glowPath.setAttribute('opacity', '0.8');

    // 计算路径长度
    const pathLength = Math.ceil(glowPath.getTotalLength());

    // 设置虚线模式 - 确保光线在路径上匀速移动
    const dashLength = pathLength * 0.2; // 光线长度
    const gapLength = pathLength; // 间隔长度

    glowPath.setAttribute('stroke-dasharray', `${dashLength} ${gapLength}`);
    glowPath.setAttribute('stroke-dashoffset', dashLength + gapLength);

    // 添加动画元素 - 确保匀速运动
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animate.setAttribute('attributeName', 'stroke-dashoffset');
    animate.setAttribute('from', dashLength + gapLength);
    animate.setAttribute('to', '0');
    animate.setAttribute('dur', `${pathLength / 150}s`); // 速度与路径长度成正比
    animate.setAttribute('repeatCount', 'indefinite');
    glowPath.appendChild(animate);

    // 添加模糊效果
    const filterId = 'blur-filter-' + Date.now();
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', filterId);

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    filter.appendChild(feGaussianBlur);

    defs.appendChild(filter);

    // 插入到DOM树中
    pathElement.parentNode.insertBefore(defs, pathElement.parentNode.firstChild);
    pathElement.parentNode.insertBefore(glowPath, pathElement.nextSibling);

    // 应用模糊效果
    glowPath.setAttribute('filter', `url(#${filterId})`);
    glowPath.setAttribute('style', 'mix-blend-mode: screen;');

    return glowPath;
}

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizecallback);
});
</script>

<style lang="less" scoped>
.draw-rect {
    position: absolute;
    pointer-events: none;
}
</style>
