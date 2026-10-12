// @ts-ignore
import i18n from '@/localization';
import { throttle, debounce } from 'lodash';

export default (chart, chartOriginData) => {
    const fitViewPadding = { top: 40, bottom: 40 };

    // 缩放恢复默认
    const realSize = ref(false);
    const defaultSize = ref(false);
    // 容器不可见要求设置视角
    const invisibleRequireSized = ref(false);
    let containerDom = null,
        containerDomResizeObserver = null;
    // 变换到真实尺寸
    const transformToRealSize = () => {
        if (realSize.value) return;
        chart.value.viewReal();
        defaultSize.value = false;
        realSize.value = true;
    };
    // 恢复默认尺寸
    const restoreDefault = () => {
        if (defaultSize.value) return;
        if (chartOriginData.value) {
            const { displayMode, customizeContent } = chartOriginData.value;
            // 有图幅尺寸的话，调用fitToRect
            if (customizeContent?.rect) {
                chart.value.fitToRect?.({
                    rect: customizeContent.rect,

                    padding: { top: 20, left: 10, right: 10 }
                });
            } else if (`${displayMode}` === '2') {
                // 2 为 真实尺寸
                chart.value.viewReal();
            } else if (`${displayMode}` === '3') {
                // 3 为 横向适配
                chart.value.fitView({ padding: fitViewPadding });
            } else if (`${displayMode}` === '4') {
                // 4 为 纵向适配
                chart.value.fitView({ padding: fitViewPadding });
            } else {
                // 1 为 自适应
                chart.value.fitView({ padding: fitViewPadding });
            }
        }
        defaultSize.value = true;
        realSize.value = false;
    };

    const resize = () => {
        // 如果当前是恢复默认过的，重置画布再执行恢复默认
        if (defaultSize.value) {
            defaultSize.value = false;
            chart.value?.resizeContainer?.();

            restoreDefault();
        } else {
            chart.value?.resizeContainer?.();
            chart.value?.resize();
        }
        realSize.value = false;
    };
    const resizeDebounce = debounce(resize, 16);

    onMounted(() => {
        containerDom = document.getElementById(chart.value?.container);

        containerDomResizeObserver = new ResizeObserver(
            throttle(entries => {
                const isDomChage = entries.findIndex(e => e.target === containerDom) > -1;

                if (isDomChage) {
                    resizeDebounce();
                }
            }, 16)
        );

        containerDomResizeObserver.observe(containerDom);
    });

    onUnmounted(() => {
        containerDomResizeObserver.unobserve(containerDom);
    });

    return {
        transformToRealSize,
        restoreDefault,
        resize,
        invisibleRequireSized,
        realSize,
        defaultSize
    };
};
